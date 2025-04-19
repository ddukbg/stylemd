# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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

[1.1.0]: https://github.com/ddukbg/stylemd/compare/v1.0.2...v1.1.0
[1.0.2]: https://github.com/ddukbg/stylemd/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ddukbg/stylemd/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ddukbg/stylemd/releases/tag/v1.0.0 