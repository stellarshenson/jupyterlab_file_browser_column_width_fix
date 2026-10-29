# jupyterlab_file_browser_column_width_fix

## What is broken

JupyterLab 4.6.4 in GalaxaLab. The file browser Name column can collapse to 24 px and stay there.
At 24 px the file-type icon (20 px) plus its 4 px margin fill the cell, so every file and folder name
renders at zero width and disappears. Dragging the divider between Name and Modified does nothing.
Dragging the left sidebar edge wider brings the names back, and the repaired widths then survive a
reload.

Measured on 2026-10-29 in the live lab, sidebar 250 px wide:

- broken: header `name=36px`, item `jp-DirListing-itemName` 24 px, `jp-DirListing-itemText` bounding width 0 px
- healthy, fresh workspace, same server and same 250 px sidebar: header `name=149px`, item 139.5 px, text box 36 px
- saved state while broken: `{"name": 24, "is_selected": 18, "last_modified": -48}` under the key
  `file-browser-filebrowser:columns` in `~/.jupyter/lab/workspaces/default-37a8.jupyterlab-workspace`;
  the 2 October backup of the same file holds `{"name": 148.5, "last_modified": 89.5}`

## Known mechanism

Read from `/opt/conda/share/jupyter/lab/static/jlab_core.2320aca330a6fa6c.js`:

- `DirListing` caches the usable content width in `this._width`. Only four places recompute it:
  `onAfterAttach`, `onResize`, a directory path change in the model refresh path, and
  `_onContentResize` when the scrollbar width changes
- `_updateColumnSizes()` clamps each column with `Math.min(n, this._width - sum(others))`, distributes
  the remainder, applies the widths and calls `_saveState()`, so whatever it computed is written to
  the workspace
- `_setColumnSize()` returns early when the requested width plus the other columns exceeds the cached
  `this._width`, which is why the divider drag is inert while the cached width is small

Hypothesis, not proven: a listing that measured itself while its node had no width (hidden, collapsed,
or not yet laid out) caches a zero or negative width, every column clamps to its minimum, and that is
saved. The exact trigger did not reproduce from a fresh workspace, a hidden sidebar tab at load, a
collapsed sidebar, or a canvas resize.

## What the extension must do

1. A listing whose cached content width is stale or smaller than the panel recovers its columns with
   no manual sidebar drag and no page reload
2. The Name/Modified divider works in that state
3. Degenerate sizes are never saved: no negative column width, and no Name column at its minimum while
   the panel is wide
4. No behaviour change while the layout is healthy
5. An already-saved bad state heals on load

## Open to the project session

- The hook: wrapping `DirListing.prototype` methods from a frontend plugin, a renderer, a listener on
  the shell, or the restore path. Decide from the source
- Whether to recompute the content width on every `_updateColumnSizes()` call, and how to avoid layout
  thrash
- How to sanitise sizes restored from the state database
- Whether the server part is needed at all; a frontend-only extension is acceptable when the fix is
  complete without Python
- Tests: the project's own tiers, with a Galata case that drives the sidebar narrow and back and
  asserts the name text box is wider than zero

## Evidence on disk

- `~/.jupyter/lab/workspaces/default-37a8.jupyterlab-workspace` and its `.before-alarm-021120` backup
- `/var/log/jupyterlab.log`, the server log with every request
- The broken DOM captured on 2026-10-29 at 03:19: 24 rows, every name present in the DOM, every
  `jp-DirListing-itemText` 0 px wide
