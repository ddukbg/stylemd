# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.1] - 2026-02-01

### Fixed
- Fixed mobile layout issues in `windows98` theme:
  - Added `overflow-x: hidden` and `overflow-y: auto` to prevent full-page scroll locking on mobile.
  - Constrained window width (`max-width: 800px`, `width: calc(100vw - 30px)`) for better responsiveness.
  - Added media queries for small screens (<640px) to adjust padding, borders, and flex direction.
- Fixed navigation link generation in `stylemd blog init` templates:
  - Updated templates to use `{{url}}` instead of `{{title}}.html` for correct linking in navigation menus.

### Maintenance
- Added `node --test` script to `package.json` for running tests.

## [2.0.0] - 2025-05-02

### Added
- New `blog` mode for generating full static blog sites from markdown:
  - `stylemd blog init <siteDir>` command to scaffold a new blog site
  - `stylemd blog build` command to build a static blog site
  - Support for posts with front matter (title, date, slug)
  - Automatic index page generation
  - Blog-specific templates for all existing themes
  - `stylemd.config.json` configuration system
  - Multiple page types: static pages and blog posts
  - Templating system that includes navigation between pages
  - Support for customizing site title, author info, and more
- New configuration options:
  - `flatPages` and `flatPosts` for controlling URL structure
  - Pagination settings
  - Author metadata
  - Site title and description
  - Locale setting for date/time formatting
  - Custom CSS support for blog themes
- LaTeX math equation support:
  - Inline equations using `$...$` syntax
  - Display equations using `$$...$$` syntax
  - Integrated MathJax library for rendering
- Enhanced documentation:
  - Comprehensive blog mode usage guide
  - Theme customization instructions
  - Deployment examples
  - Advanced usage patterns

### Changed
- Extended templates system to support blog-specific layouts
- Updated README with comprehensive blog mode documentation
- Improved error handling for blog commands
- Enhanced help command with detailed examples and usage patterns
- Optimized template rendering for large blogs with many posts

### Fixed
- Fixed issue with non-ASCII characters in Markdown files
- Fixed pagination when using nested URL structure
- Resolved conflict between navigation links and page content in Windows98 theme

## [1.1.0] - 2025-04-19

### Added
- New Geocities-inspired themes:
  - `area51`: Dark retro sci-fi/hacker theme.
  - `heartland`: Warm, cozy 90s personal/hobby site theme.
  - `hollywood`: Flashy 90s entertainment/fan site theme.
  - `atlantis`: Mystical dark fantasy/underwater theme.
- Corresponding example Markdown files for the new themes.

## [1.0.2] - 2025-04-13

### Changed
- Switched GitHub Actions workflow to use `actions/create-release` with `generate_release_notes: true` for automatic release note generation based on tags, instead of `release-drafter`.

## [1.0.1] - 2025-04-13

### Changed
- Added `.github/release-drafter.yml` configuration file to enable automatic release notes.
- Updated comments in `.github/release-drafter.yml` to English.

## [1.0.0] - 2025-04-13

### Added

- Initial release of `stylemd`.
- Core functionality: Convert Markdown to HTML using Handlebars templates.
- Command-line interface (`stylemd <inputFile> [options]`).
- Options for specifying template (`-t`, `--template`) and output file (`-o`, `--output`).
- Included Themes:
  - `default`
  - `windows98`
  - `terminal`
  - `geocities`
  - `blueprint`
  - `macos-classic`
  - `amiga-workbench`
  - `msdos`
  - `c64`
  - `vim`
  - `retro-console`
  - `pixel-art`
  - `y2k`
  - `frutiger-aero`
- Example Markdown files and corresponding output HTML files.
- Project structure setup.
- README.md with installation, usage, themes list, contribution guide, and future plans.
- `.gitignore` file.
- `.gitattributes` file for consistent line endings.
- GitHub Actions workflow for automatic npm publishing and release creation on tag push.
- Added live preview links for themes in README.
- Added attribution footer to example Markdown files.

[2.0.0]: https://github.com/ddukbg/stylemd/compare/v1.1.0...v2.0.0
[1.1.0]: https://github.com/ddukbg/stylemd/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/ddukbg/stylemd/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ddukbg/stylemd/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ddukbg/stylemd/releases/tag/v1.0.0 