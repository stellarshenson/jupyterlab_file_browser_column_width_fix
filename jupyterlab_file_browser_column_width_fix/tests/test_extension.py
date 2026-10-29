from pathlib import Path

from jupyterlab_file_browser_column_width_fix import (
    _jupyter_labextension_paths,
    _jupyter_server_extension_points,
)


def test_server_extension_points():
    assert _jupyter_server_extension_points() == [
        {"module": "jupyterlab_file_browser_column_width_fix"}
    ]


def test_labextension_paths():
    assert _jupyter_labextension_paths() == [
        {
            "src": "labextension",
            "dest": "jupyterlab_file_browser_column_width_fix",
        }
    ]


def test_frontend_patch_is_installed():
    source = (Path(__file__).parents[2] / "src" / "index.ts").read_text()
    assert "export function patchDirListing" in source
    for method in ("_updateColumnSizes", "_setColumnSize", "_saveState"):
        assert f"proto.{method} = function" in source
