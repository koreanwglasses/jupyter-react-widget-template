import React from "react";
import { useLayoutContext } from "../core/idom-react";

export const Sample = ({ text }: { text: string }) => {
  const layoutContext = useLayoutContext();
  return (
    <div>
      <div>{text}</div>
      <div>
        <button
          onClick={() =>
            layoutContext.sendEvent({ target: "click", data: ["hya"] })
          }
        >
          Click me!
        </button>
      </div>
    </div>
  );
};
