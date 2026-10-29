# Acceptance Criteria - jupyterlab_file_browser_column_width_fix

The required behaviours in `INTENT.md` for a file browser whose cached column width is stale. Written from `INTENT.md`.

## Authors

- `@kj` Konrad Jelen

## Recovery `RECOVR`

Recovery of a listing whose cached content width is stale: columns, divider and saved bad state

- log: 2026-10-29T03:23:44Z @kj category created
- log: 2026-10-29T04:24:24Z @kj description added "Recovery of a listing whose cached content width is stale: columns, divider and saved bad state"

- [x] `ACC-RECOVR-1-STALE` **Stale width recovers** - HIGH; a listing whose cached content width is stale or smaller than the panel restores its columns with no sidebar drag and no page reload
  - evidence: init gate 2026-10-29: ui-tests/tests/columns.spec.ts:114 "a stale cached width recovers the Name column" passed (logs/ui-tests-init.log: 6 passed, 0 failed)
  - test: Galata `ui-tests/tests/columns.spec.ts` "a stale cached width recovers the Name column" - set the default listing `_width` to 24, call `_updateColumnSizes()`, assert the header Name width > 24 and every `jp-DirListing-itemText` box > 0
  - test-tags: FUNCTIONAL
  - log: 2026-10-29T03:23:44Z @kj added
  - log: 2026-10-29T03:38:36Z @kj closed
- [x] `ACC-RECOVR-2-DIVIDER` **Divider works in the stale state** - HIGH; the Name/Modified divider changes the Name width while the cached width is stale
  - evidence: init gate 2026-10-29: ui-tests/tests/columns.spec.ts:128 "the Name divider resizes while the width is stale" passed (logs/ui-tests-init.log: 6 passed, 0 failed)
  - test: Galata `ui-tests/tests/columns.spec.ts` "the Name divider resizes while the width is stale" - set `_width` to 24, drag the divider 80 px right, assert the Name header width increased
  - test-tags: FUNCTIONAL
  - log: 2026-10-29T03:23:47Z @kj added
  - log: 2026-10-29T03:38:36Z @kj closed
- [x] `ACC-RECOVR-5-HEAL` **Saved bad state heals on load** - HIGH; a listing restored with a saved 24 px Name column shows the names after load
  - evidence: init gate 2026-10-29: ui-tests/tests/columns.spec.ts:164 "a saved 24 px Name column heals on load" passed (logs/ui-tests-init.log: 6 passed, 0 failed)
  - test: Galata `ui-tests/tests/columns.spec.ts` "a saved 24 px Name column heals on load" - write a workspace state with `file-browser-filebrowser:columns` name 24, reload, assert every item text box > 0
  - test-tags: FUNCTIONAL
  - log: 2026-10-29T03:23:54Z @kj added
  - log: 2026-10-29T03:38:36Z @kj closed
- [x] `ACC-RECOVR-6-VISIBLE` **Names visible at a narrow sidebar** - HIGH; at a 250 px sidebar every file name has a text box wider than 0
  - evidence: init gate 2026-10-29: ui-tests/tests/columns.spec.ts:192 "names stay visible at a 250 px sidebar" passed (logs/ui-tests-init.log: 6 passed, 0 failed)
  - test: Galata `ui-tests/tests/columns.spec.ts` "names stay visible at a 250 px sidebar" - drag the left sidebar splitter to 250 px, assert every `jp-DirListing-itemText` bounding width > 0 and the header Name width > 24
  - test-tags: FUNCTIONAL
  - log: 2026-10-29T03:23:58Z @kj added
  - log: 2026-10-29T03:38:36Z @kj closed

## Saved state `STATE`

Column sizes the listing saves to the workspace state

- log: 2026-10-29T03:23:49Z @kj category created
- log: 2026-10-29T04:24:24Z @kj description added "Column sizes the listing saves to the workspace state"

- [x] `ACC-STATE-3-NODEGEN` **Degenerate sizes are never saved** - MEDIUM; a save writes no negative width and no Name column at its minimum while the panel is wide
  - evidence: review gate 2026-10-29: src/__tests__/columns.spec.ts:26 "sanitises negative and collapsed sizes against the panel width" passed (logs/test-review1.log: Jest 11 passed, 0 failed)
  - test: Jest `src/__tests__/columns.spec.ts` "sanitises negative and collapsed sizes against the panel width" - restore `{name:24,is_selected:18,last_modified:-48}` at 250 px, assert no negative width and a Name width above the minimum; assert a healthy set comes back unchanged
  - test-tags: UNIT
  - log: 2026-10-29T03:23:49Z @kj added
  - log: 2026-10-29T03:38:36Z @kj closed
  - log: 2026-10-29T04:24:21Z @kj edited evidence "init gate 2026-10-29: src/**tests**/columns.spec.ts:26 "sanitises negative and collapsed sizes against the panel width" passed (logs/test-phase3.log: 6 passed, 0 failed)" -> "review gate 2026-10-29: src/__tests__/columns.spec.ts:26 "sanitises negative and collapsed sizes against the panel width" passed (logs/test-review1.log: Jest 11 passed, 0 failed)"; reason: the build prettier pass had rewritten the path underscores as emphasis

## Healthy layout `HEALTH`

The stock path a healthy layout keeps

- log: 2026-10-29T03:23:52Z @kj category created
- log: 2026-10-29T04:24:24Z @kj description added "The stock path a healthy layout keeps"

- [x] `ACC-HEALTH-4-NOCHANGE` **Healthy layout unchanged** - MEDIUM; with a fresh workspace and a healthy width the Name column keeps its stock width and the divider still resizes it
  - evidence: init gate 2026-10-29: ui-tests/tests/columns.spec.ts:139 "a healthy layout keeps its column widths" passed (logs/ui-tests-init.log: 6 passed, 0 failed)
  - test: Galata `ui-tests/tests/columns.spec.ts` "a healthy layout keeps its column widths" - fresh settings, assert the header Name width > 100 and every item text box > 0; drag the divider and assert the width changed
  - test-tags: FUNCTIONAL
  - log: 2026-10-29T03:23:52Z @kj added
  - log: 2026-10-29T03:38:36Z @kj closed
