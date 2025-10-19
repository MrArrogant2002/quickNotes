# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Environment variable example files (.env.example, .env.docker.example)
- Docker support (Dockerfile, docker-compose.yml, .dockerignore)
- GitHub Actions CI/CD workflow
- Contributing guidelines (CONTRIBUTING.md)
- Security policy (SECURITY.md)
- MIT License (LICENSE)
- Issue templates for bug reports and feature requests
- Pull request template
- This changelog

### Fixed
- ESLint warnings for unused variables
- ESLint configuration to ignore scripts directory

### Changed
- Updated README with correct author information
- Enhanced contribution guidelines

## [0.1.0] - 2025

### Added
- User authentication with NextAuth v5
- Rich text editor with TipTap
- Note CRUD operations
- Tag organization system
- Search functionality
- User profile page
- Password reset functionality
- Email notifications with Resend
- Note sharing with public links
- Inline password change
- Dark mode support
- Responsive design with shadcn/ui components

### Security
- Password hashing with bcrypt
- JWT-based session management
- Input validation with Zod schemas
- Protected routes and API endpoints

[Unreleased]: https://github.com/MrArrogant2002/quickNotes/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/MrArrogant2002/quickNotes/releases/tag/v0.1.0
