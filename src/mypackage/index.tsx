import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { LayoutContext, WidgetWrapper } from "./core/idom-react";

export function bind(node: Element, context: LayoutContext) {
  const root = ReactDOM.createRoot(node);

  return {
    create: (
      Component:
        | string
        | React.FunctionComponent<{}>
        | React.ComponentClass<{}, any>,
      props: {
        lastResponse: { target: string; value: any; error: any };
        componentProps: React.Attributes | null | undefined;
      },
      children: React.ReactNode[]
    ) => (
      <WidgetWrapper layoutContext={context} lastResponse={props.lastResponse}>
        <Component {...props.componentProps}>{children}</Component>
      </WidgetWrapper>
    ),
    render: (
      element: React.DOMElement<React.DOMAttributes<Element>, Element>
    ) => root.render(element),
    unmount: () => root.unmount(),
  };
}

export { Sample } from "./widgets/sample";
