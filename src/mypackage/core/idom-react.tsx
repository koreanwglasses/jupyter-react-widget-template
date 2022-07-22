import * as React from "react";

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


