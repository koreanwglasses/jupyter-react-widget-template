from ..core.widget import WidgetBase, WidgetModel


class Sample(WidgetBase):
    def __init__(self, callback):
        self.__model = WidgetModel()
        super().__init__("Sample", {}, model=self.__model)

        self.model = self.__model.client()
        self.model.cb = callback
        self.model.x = 1
