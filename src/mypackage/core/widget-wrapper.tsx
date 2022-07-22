import { EventEmitter } from "events";
import * as React from "react";
import { v4 as uuid } from "uuid";
import { LayoutContext } from "./idom-react";

type Message = { type: string; payload: any[] };

const WidgetWrapperContext = React.createContext<{
  layoutContext: LayoutContext;
  emitter: EventEmitter;
}>({
  layoutContext: { sendEvent() {} },
  emitter: new EventEmitter(),
});

export const WidgetWrapper = ({
  children,
  lastMessage,
  layoutContext,
}: React.PropsWithChildren<{
  layoutContext: LayoutContext;
  lastMessage: Message;
}>) => {
  const emitter = React.useRef(new EventEmitter());

  // IDOM sends messages to the component by changing the
  // lastMessage prop. This emits an event based on the
  // received message
  React.useEffect(() => {
    console.log(lastMessage)
    if (lastMessage)
      emitter.current.emit(lastMessage.type, ...lastMessage.payload);
  }, [lastMessage]);

  return (
    <WidgetWrapperContext.Provider
      value={{ layoutContext, emitter: emitter.current }}
    >
      {children}
    </WidgetWrapperContext.Provider>
  );
};

export const useWidgetContext = () => {
  const { layoutContext, emitter } = React.useContext(WidgetWrapperContext);

  return {
    messages: emitter as Omit<EventEmitter, "emit">,
    exec(target: string, ...args: any[]) {
      const id = uuid();

      layoutContext.sendEvent({
        target: `exec_func:${target}`,
        data: [id, args],
      });

      return new Promise<any>((res, rej) => {
        emitter.once(`return_value:${id}`, (value, err) => {
          if (err) return rej(err);
          res(value);
        });
      });
    },
  };
};
