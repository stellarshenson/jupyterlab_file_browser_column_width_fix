# Changelog

<!-- <START NEW CHANGELOG ENTRY> -->

## [0.6.3] - 2026-10-29

### Added

- Recovery of the file browser columns when DirListing's cached content width is stale, so names stay visible and the Name/Modified divider works
- Jest and pytest guards that fail when the DirListing patch is removed
- Unit cases for negative, collapsed and zero-width column states

### Changed

- The save path raises the column minimums at any panel width, including a listing that attaches before it has a measured node
- The template placeholder frontend test is replaced by the column helper suite

### Fixed

- The workspace state can no longer store negative column widths when the listing has no measurable width

<!-- <END NEW CHANGELOG ENTRY> -->
