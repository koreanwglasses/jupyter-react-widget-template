import idom
from .idom_loader import load_component


class WidgetBase:
    def __init__(self, component_name: str, props={}, callables={}):
        self.__component = load_component(component_name)
        self.__props = props
        self.__event_handlers = {}

        for key, value in dict(callables).items():
            self.__register_callable(key, value)

        self.__setters = []

    # Define helper functions handling events from component
    # and returning messages to component
    def __exec_func(self, func, id, args):
        try:
            value = func(*args)
            error = None
        except Exception as e:
            value = None
            error = e.args

        self.send_message(f"return_value:{id}", value, error)

    def __register_callable(self, name, func):
        self.__event_handlers["exec_func:" + name] = idom.core.events.EventHandler(
            lambda data: self.__exec_func(func, data[0], data[1]),
            target=f"exec_func:{name}",
        )

    def send_message(self, type, *payload):
        """
        TODO
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
            {"lastMessage": last_message, "componentProps": self.__props},
            event_handlers=self.__event_handlers,
        )
