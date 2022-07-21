import { EventEmitter } from "events";
import * as React from "react";
import TypedEventEmitter from "typed-emitter";
import { v4 as uuid } from "uuid";

export interface EventData {
  target: string;
  data: Array<any>;
}

export interface LayoutContext {
  sendEvent(data: EventData): void;
}

export type BindFunction = (
  node: HTMLElement,
  context: LayoutContext
) => {
  create(
    type: string | React.FunctionComponent<{}> | React.ComponentClass<{}, any>,
    props: React.Attributes | null | undefined,
    children: React.ReactNode[]
  ): any;
  render(
    element: React.DOMElement<React.DOMAttributes<Element>, Element>
  ): void;
  unmount(): void;
};

type WidgetEventEmitter = TypedEventEmitter<{
  [E in `response:${string}`]: (value: any, error: any) => void;
}>;

const WidgetWrapperContext = React.createContext<{
  layoutContext: LayoutContext;
}>({
  layoutContext: { sendEvent() {} },
});

const widgetEventEmitter = new EventEmitter() as WidgetEventEmitter;

export const WidgetWrapper = ({
  children,
  lastResponse,
  layoutContext,
}: React.PropsWithChildren<{
  layoutContext: LayoutContext;
  lastResponse: { target: string; value: any; error: any };
}>) => {
  React.useEffect(() => {
    widgetEventEmitter.emit(
      `response:${lastResponse.target}`,
      lastResponse.value,
      lastResponse.error
    );
  }, [lastResponse]);

  return (
    <WidgetWrapperContext.Provider value={{ layoutContext }}>
      {children}
    </WidgetWrapperContext.Provider>
  );
};

export const useWidgetContext = () => {
  const { layoutContext } = React.useContext(WidgetWrapperContext);

  return {
    call(target: string, ...args: any[]) {
      const responseId = uuid();

      layoutContext.sendEvent({
        target: `call:${target}`,
        data: [responseId, ...args],
      });

      return new Promise<any>((res, rej) => {
        widgetEventEmitter.once(`response:${responseId}`, (value, err) => {
          if (err) return rej(err);
          res(value);
        });
      });
    },
  };
};
