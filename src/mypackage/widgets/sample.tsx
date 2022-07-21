import React, { useState } from "react";
import { useWidgetContext } from "../core/idom-react";

export const Sample = () => {
  const widget = useWidgetContext();
  const [lastResponse, setLastResponse] = useState("");
  return (
    <div>
      <div>Last Response: {lastResponse}</div>
      <div>
        <button
          onClick={async () => {
            setLastResponse(await widget.call("func"));
          }}
        >
          Click me!
        </button>
      </div>
    </div>
  );
};
