import idom
from .idom_loader import load_component


class WidgetBase:
    def __init__(self, component_name: str, props={}, callables={}):
        self.__component = load_component(component_name)
        self.__props = props
        self.__callables = dict(callables)

    @idom.component
    def show(self):
        # Communicate with the component by passing
        # messages to props. This is translated into
        # events on the front-end (js) side in widget-wrapper.tsx
        last_message, set_last_message = idom.hooks.use_state(None)

        # Define helper functions handling events from component
        # and returning messages to component

        def exec_func(func, id, args):
            try:
                value = func(*args)
                error = None
            except Exception as e:
                value = None
                error = e.args

            set_last_message(
                {
                    "type": f"return_value:{id}",
                    "payload": [value, error],
                }
            )

        # Register event handlers
        event_handlers = {}
        for key, value in self.__callables.items():
            event_handlers["exec_func:" + key] = idom.core.events.EventHandler(
                lambda data: exec_func(value, data[0], data[1]), target=f"exec_func:{key}"
            )

        # Create component
        return self.__component(
            {"lastMessage": last_message, "componentProps": self.__props},
            event_handlers=event_handlers,
        )
