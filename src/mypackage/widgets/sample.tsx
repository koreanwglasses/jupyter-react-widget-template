import React, { useState } from "react";
import { useWidgetContext } from "../core/widget-wrapper";

export const Sample = () => {
  const widget = useWidgetContext();
  const [lastResponse, setLastResponse] = useState("");
  return (
    <div>
      <div>Last Response: {lastResponse}</div>
      <div>
        <button
          onClick={async () => {
            setLastResponse(await widget.exec("func"));
          }}
        >
          Click me!
        </button>
      </div>
    </div>
  );
};
