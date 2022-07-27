import React from "react";
import { useWidgetModel } from "../core/widget/hooks";

export const Sample = () => {
  const model = useWidgetModel();

  return (
    <div>
      <div>
        <input
          onInput={(e) => (model.x = e.currentTarget.value)}
          value={model.x ?? 0}
        />
      </div>
      +
      <div>
        <input
          onInput={(e) => (model.y = e.currentTarget.value)}
          value={model.y ?? 0}
        />
      </div>
      =<div>{model.z}</div>
      <div>
        <button
          onClick={async () => (model.z = await model.cb(+model.x, +model.y))}
        >
          Compute
        </button>
      </div>
    </div>
  );
};
