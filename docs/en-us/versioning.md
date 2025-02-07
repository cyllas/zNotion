# Versioning Guide

> [← Back to README](../../README.md) | [View API Documentation →](api.md) | [View Examples →](examples.md)

This document describes the versioning rules and practices adopted in the zNotion project.

## Table of Contents

- [Semantic Versioning](#semantic-versioning)
- [Conventional Commits](#conventional-commits)
- [Release Flow](#release-flow)
- [Changelog](#changelog)

## Semantic Versioning

zNotion strictly follows [Semantic Versioning](https://semver.org/):

### Version Format

```
MAJOR.MINOR.PATCH
```

- **MAJOR**: Incompatible changes with previous versions
- **MINOR**: New features maintaining compatibility
- **PATCH**: Bug fixes maintaining compatibility

### Examples

- `1.0.0` → `2.0.0`: Incompatible API change
- `1.0.0` → `1.1.0`: New feature added
- `1.0.0` → `1.0.1`: Bug fix

## Conventional Commits

We use the [Conventional Commits](https://www.conventionalcommits.org/) standard for commit messages.

### Commit Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Emoji | Description | Version Bump |
|------|-------|-------------|--------------|
| `feat` | ✨ | New feature | MINOR |
| `fix` | 🐛 | Bug fix | PATCH |
| `docs` | 📚 | Documentation | - |
| `style` | 💎 | Formatting, semicolons, etc. | - |
| `refactor` | ♻️ | Code refactoring | - |
| `perf` | ⚡️ | Performance improvements | PATCH |
| `test` | ✅ | Adding/modifying tests | - |
| `build` | 📦 | Build system or dependencies | PATCH |
| `ci` | 👷 | CI configuration | - |
| `chore` | 🔧 | Other changes | - |

### Commit Examples

```bash
# New feature
feat(pages): add pagination support to listing

# Bug fix
fix(auth): fix access token validation

# Documentation
docs: update API usage examples

# Refactoring
refactor(database): simplify query logic
```

## Release Flow

### 1. Development

```bash
# Create standardized commits
npm run commit
# Or
git cz
```

### 2. Release Creation

```bash
# Generate new version
npm run release
```

This command will:
1. Analyze commits since last version
2. Determine next version number
3. Generate/update CHANGELOG.md
4. Create git tag
5. Commit changes

### 3. Publishing

```bash
# Publish to npm
npm publish
```

## Changelog

The [CHANGELOG.md](../../CHANGELOG.md) file is automatically generated and maintained using `standard-version`.

### Changelog Sections

- ✨ New Features
- 🐛 Bug Fixes
- 📚 Documentation
- 💎 Styles
- ♻️ Refactoring
- ⚡️ Performance
- ✅ Tests
- 📦 Build
- 👷 CI
- 🔧 Chore

## Available Scripts

```bash
# Make commit following conventions
npm run commit

# Create new version
npm run release

# Publish to npm
npm publish
```

## Tools

- **Commitizen**: Interface for creating standardized commits
- **Commitlint**: Commit message validation
- **Standard Version**: Automatic version and changelog generation
- **Husky**: Git hooks for validation
