# jupyterlab_file_browser_column_width_fix

> [!IMPORTANT]
> This package is DEPRECATED. [jupyterlab_core_patches_extension](https://github.com/stellarshenson/jupyterlab_core_patches_extension) carries this fix with the other nine in one extension, with one switch per fix. Uninstall this package and the `stellars_jupyterlab_fixes` bundle before installing the replacement. This repository stays published and frozen.

[![GitHub Actions](https://github.com/stellarshenson/jupyterlab_file_browser_column_width_fix/actions/workflows/build.yml/badge.svg)](https://github.com/stellarshenson/jupyterlab_file_browser_column_width_fix/actions/workflows/build.yml)
[![npm version](https://img.shields.io/npm/v/jupyterlab_file_browser_column_width_fix.svg)](https://www.npmjs.com/package/jupyterlab_file_browser_column_width_fix)
[![PyPI version](https://img.shields.io/pypi/v/jupyterlab-file-browser-column-width-fix.svg)](https://pypi.org/project/jupyterlab-file-browser-column-width-fix/)
[![Total PyPI downloads](https://static.pepy.tech/badge/jupyterlab-file-browser-column-width-fix)](https://pepy.tech/project/jupyterlab-file-browser-column-width-fix)
[![JupyterLab 4](https://img.shields.io/badge/JupyterLab-4-orange.svg)](https://jupyterlab.readthedocs.io/en/stable/)
[![Brought To You By KOLOMOLO](https://img.shields.io/badge/Brought%20To%20You%20By-KOLOMOLO-00ffff?style=flat)](https://kolomolo.com)
[![Donate PayPal](https://img.shields.io/badge/Donate-PayPal-blue?style=flat)](https://www.paypal.com/donate/?hosted_button_id=B4KPBJDLLXTSA)

Keeps the JupyterLab file browser usable when its cached column width is stale. The Name column
can collapse to its minimum and render every file name at zero width; the Name/Modified divider
then does nothing. This extension restores the columns without dragging the sidebar or reloading.

## Features

- Recovers the columns when the cached content width is stale or smaller than the panel
- Keeps the Name/Modified divider working in that state
- Never saves a negative width or a Name column at its minimum while the panel is wide
- Leaves a healthy layout on the stock code path
- Heals an already-saved bad column state on load

## Requirements

- JupyterLab >= 4.6.0

## Install

```bash
pip install jupyterlab_file_browser_column_width_fix
```

## Uninstall

```bash
pip uninstall jupyterlab_file_browser_column_width_fix
```
