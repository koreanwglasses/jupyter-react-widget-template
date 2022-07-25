# Check the version of runtime dependencies
import pkg_resources
from packaging import version


assert version.parse(
    pkg_resources.get_distribution("notebook").version
) < version.parse("7")
assert version.parse(
    pkg_resources.get_distribution("ipywidgets").version
) < version.parse("8")

# Export widgets
from .widgets.sample import Sample
