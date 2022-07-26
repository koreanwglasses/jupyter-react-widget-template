import os
import idom
from shortuuid import uuid
import idom_jupyter


def rel_to_abs(path):
    return os.path.abspath(os.path.join(os.path.dirname(__file__), path))


BUNDLE_PATH = rel_to_abs("../bundle.js")
FALLBACK = "⌛"
NAME = "mypackage"

__web_module = None


def __load_web_module():
    global __web_module

    if __web_module == None:
        __web_module = idom.web.module_from_file(
            name=f"{NAME}", file=BUNDLE_PATH, fallback=FALLBACK
        )

    return __web_module


def load_component(component_name):
    web_module = __load_web_module()
    return idom.web.export(web_module, component_name)


def reload_bundle():
    global __web_module
    # Append a random string to the module name
    # to force it to reload
    uid = uuid()[:6]

    __web_module = idom.web.module_from_file(
        name=f"{NAME}_{uid}", file=BUNDLE_PATH, fallback=FALLBACK
    )
