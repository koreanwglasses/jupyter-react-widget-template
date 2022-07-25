import idom
from .idom_loader import load_component


class WidgetModel:
    def __init__(self, widget: "WidgetBase", initial={}):
        self.__dict = initial
        self.__widget = widget

    def __setattr__(self, key: str, value):
        if key.startswith("_WidgetModel"):
            super().__setattr__(key, value)
        else:
            if callable(value):
                msg = {"key": key, "type": "function"}
            else:
                msg = {"key": key, "type": "value", "value": value}
            self.__widget._WidgetBase__send_message("update_model", msg)
            self.__dict[key] = value

    def __getattr__(self, key):
        return self.__dict[key] if key in self.__dict else None

    def internal_dict(model: "WidgetModel"):
        return model.__dict

    def properties(model: "WidgetModel"):
        properties = {}
        for key, value in model.__dict.items():
            if callable(value):
                properties[key] = {"type": "function"}
            else:
                properties[key] = {"type": "value", "value": value}
        return properties


class WidgetBase:
    def __init__(self, component_name: str, props={}, default_model={}):
        self.__component = load_component(component_name)
        self.__props = props

        self.__setters = []
        self.model = WidgetModel(self, default_model)

    # Define helper functions handling events from component
    # and returning messages to component
    def __call_func(self, func, return_id, args):
        try:
            value = func(*args)
            error = None
        except Exception as e:
            value = None
            error = e.args

        self.__send_message(return_id, [value, error])

    # Helper functions for 2-way communication with component
    def __recv_message(self, type, payload):
        """
        Handles messages sent from the component.

        Do not call this function directly. This function is automatically
        called when a "message" event is sent from the component.
        """

        if type == "update_model":
            key = payload["key"]
            value = payload["value"]

            WidgetModel.internal_dict(self.model)[key] = value

        elif type == "call_func":
            func = WidgetModel.internal_dict(self.model)[payload["key"]]
            return_id = payload["returnId"]
            args = payload["args"]

            self.__call_func(func, return_id, args)

        else:
            print(f"Warning: Received message of unknown type '{type}'")

    def __send_message(self, type, payload):
        """
        Send a message to the component.
        """
        for func in self.__setters:
            func({"type": type, "payload": payload})

    @idom.component
    def show(self):
        # Communicate with the component by passing
        # messages to props. This is translated into
        # events on the front-end (js) side in widget-wrapper.tsx
        last_message, set_last_message = idom.hooks.use_state(None)
        self.__setters.append(set_last_message)

        # Create component
        return self.__component(
            {
                "lastMessage": last_message,
                "componentProps": self.__props,
                "initialModel": WidgetModel.properties(self.model),
            },
            event_handlers={
                "message": idom.core.events.EventHandler(
                    lambda data: self.__recv_message(data[0], data[1]), target="message"
                )
            },
        )
