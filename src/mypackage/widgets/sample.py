from ..core.widget import WidgetBase, WidgetModel


class Sample(WidgetBase):
    def __init__(self, callback):
        self.model = WidgetModel.make_model()
        super().__init__("Sample", {}, model=self.model)

        self.model.cb = callback
        self.model.x = 1
