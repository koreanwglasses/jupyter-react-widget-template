import { EventEmitter } from "events";
import * as React from "react";
import { v4 as uuid } from "uuid";
import { LayoutContext } from "./idom-react";

type Message = { type: string; payload: any };

type ModelProperty<T = any> =
  | { type: "function" }
  | { type: "value"; value: T }
  | { type: "native"; value: T };

type ModelProperties<M extends {} = any> = {
  [K in keyof M]: ModelProperty<M[K]>;
};

const WidgetWrapperContext = React.createContext<{
  layoutContext: LayoutContext;
  receiver: EventEmitter;
  modelProperties: ModelProperties;
  setModelProperties: React.Dispatch<React.SetStateAction<ModelProperties>>;
}>({
  layoutContext: { sendEvent() {} },
  receiver: new EventEmitter(),
  modelProperties: {},
  setModelProperties: () => {},
});

export const WidgetWrapper = ({
  children,
  lastMessage,
  layoutContext,
  initialModelProperties,
}: React.PropsWithChildren<{
  layoutContext: LayoutContext;
  lastMessage: Message;
  initialModelProperties: ModelProperties;
}>) => {
  // Use an EventEmitter to simulate and listen for
  // messages from the back-end
  const emitter = React.useRef(new EventEmitter());
  const receiver = emitter.current;

  // IDOM sends messages to the component by changing the
  // lastMessage prop. This emits an event based on the
  // received message
  React.useEffect(() => {
    if (lastMessage) receiver.emit(lastMessage.type, lastMessage.payload);
  }, [lastMessage]);

  // Store the model parameters as state
  const [modelProperties, setModelProperties] = React.useState(
    initialModelProperties
  );

  // Update model parameters when messages are received
  React.useEffect(() => {
    const cb = ({ key, type, value }: any) =>
      setModelProperties((model) => ({ ...model, [key]: { type, value } }));

    receiver.on(`update_model`, cb);
    return () => {
      receiver.off(`update_model`, cb);
    };
  }, []);

  return (
    <WidgetWrapperContext.Provider
      value={{
        layoutContext,
        receiver,
        modelProperties,
        setModelProperties,
      }}
    >
      {children}
    </WidgetWrapperContext.Provider>
  );
};

export const useWidgetModel = <M extends {} = any>() => {
  const { layoutContext, receiver, modelProperties, setModelProperties } =
    React.useContext(WidgetWrapperContext);

  // Core communication utilities
  const sendMessage = (type: string, payload: any) =>
    layoutContext.sendEvent({ target: "message", data: [type, payload] });

  const recvMessage = (type: string) =>
    new Promise<any>((res) => receiver.once(type, res));

  // Additional utilities
  const callFunc = async (key: string, ...args: any[]) => {
    const returnId = uuid();

    sendMessage("call_func", { key, returnId, args });

    const [value, err] = await recvMessage(returnId);
    if (err) throw err;
    return value;
  };

  const updateModel = (key: string, value: any) => {
    setModelProperties((model) => ({
      ...model,
      [key]: { type: "native" as const, value },
    }));
    sendMessage("update_model", { key, value });
  };

  // Create a proxy to parse the model properties and make them act like regular
  // javascript objects.
  return new Proxy(modelProperties, {
    get(target, key, receiver) {
      if (typeof key === "symbol") {
        return Reflect.get(target, key, receiver);
      } else {
        const property = target[key];
        if (!property) {
          return undefined;
        }

        if (property.type === "value" || property.type === "native") {
          return property.value;
        } else if (property.type === "function") {
          return (...args: any) => callFunc(key, ...args);
        } else {
          throw new Error("Unknown property type encountered");
        }
      }
    },
    set(target, key, value, receiver) {
      if (typeof key === "symbol") {
        return Reflect.set(target, key, value, receiver);
      } else {
        updateModel(key, value);
        return true;
      }
    },
  }) as M;
};
