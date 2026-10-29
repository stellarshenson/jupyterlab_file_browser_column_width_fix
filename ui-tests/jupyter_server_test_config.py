import os
from tempfile import mkdtemp

from jupyterlab.galata import configure_jupyter_server

configure_jupyter_server(c)
c.ServerApp.port = int(os.environ.get("JUPYTER_TEST_PORT") or "8888")
c.LabApp.user_settings_dir = mkdtemp(prefix="galata-settings-")
c.GalaxaHubMotd.open_on_start = False
# The workstation lab config sets the exact manager classes back to True after
# this file loads, so name them here; the class sections outrank FileContentsManager.
c.AsyncLargeFileManager.delete_to_trash = False
c.FileContentsManager.delete_to_trash = False
