import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { LayoutContext, LayoutContextProvider } from "./core/idom-react";

export function bind(node: Element, context: LayoutContext) {
  const root = ReactDOM.createRoot(node);

  return {
    create: (
      Component:
        | string
        | React.FunctionComponent<{}>
        | React.ComponentClass<{}, any>,
      props: React.Attributes | null | undefined,
      children: React.ReactNode[]
    ) => (
      <LayoutContextProvider value={context}>
        <Component {...props}>{children}</Component>
      </LayoutContextProvider>
    ),
    render: (
      element: React.DOMElement<React.DOMAttributes<Element>, Element>
    ) => root.render(element),
    unmount: () => root.unmount(),
  };
}

export { Sample } from "./widgets/sample";
