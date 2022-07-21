import idom
from .idom_loader import load_component


class WidgetBase:
    def __init__(self, component_name: str, props={}, callables={}):
        self.__component = load_component(component_name)
        self.__props = props
        self.__callables = dict(callables)

    @idom.component
    def show(self):
        last_response, set_last_response = idom.hooks.use_state([])

        def callable_wrapper(func, target, *args):
            try:
                value = func(*args)
                error = None
            except Exception as e:
                value = None
                error = e.args

            set_last_response({"target": target, "value": value, "error": error})

        event_handlers = {}
        for key, value in self.__callables.items():
            event_handlers["call:" + key] = idom.core.events.EventHandler(
                lambda data: callable_wrapper(value, *data), target=f"call:{key}"
            )

        y = self.__component(
            {"lastResponse": last_response, "componentProps": self.__props},
            event_handlers=event_handlers,
        )
        return y
