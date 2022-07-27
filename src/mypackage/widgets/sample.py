from ..core.widget import WidgetBase, WidgetModel


class Sample(WidgetBase):
    def __init__(self, callback, model=None):
        if model == None:
            model = WidgetModel.make_model()
        super().__init__("Sample", {}, model=model)

        self.model = model
        self.model.cb = callback
        self.model.x = 1
