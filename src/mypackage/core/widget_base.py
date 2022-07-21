import idom
from .idom_loader import load_component


class WidgetBase:
    def __init__(
        self,
        component_name: str,
        props={},
        event_handlers={},
    ):
        self.__component = load_component(component_name)
        self.__props = props
        self.__event_handlers = {}

        for key, value in dict(event_handlers).items():
            self.__event_handlers[key] = idom.core.events.EventHandler(
                value, target=key
            )

    @idom.component
    def show(self):
        y = self.__component(self.__props, event_handlers=self.__event_handlers)
        return y
