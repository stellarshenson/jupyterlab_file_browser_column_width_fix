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
