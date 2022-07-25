import React from "react";
import { useWidgetModel } from "../core/widget-wrapper";

export const Sample = () => {
  const model = useWidgetModel();

  return (
    <div>
      <div>{model.x}</div>
      <div>
        <button
          onClick={async () => {
            model.x = await model.cb(model.x);
          }}
        >
          Click me!
        </button>
      </div>
    </div>
  );
};
