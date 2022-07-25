from mypackage.core.widget_base import WidgetBase


class Sample(WidgetBase):
    def __init__(self, callback):
        super().__init__("Sample")

        self.model.cb = callback
        self.model.x = 1
