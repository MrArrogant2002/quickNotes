# Contributing to QuickNotes

Thank you for your interest in contributing to QuickNotes! We welcome contributions from the community.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/quickNotes.git
   cd quickNotes
   ```
3. **Install dependencies**:
   ```bash
   pnpm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```
5. **Set up the database**:
   ```bash
   pnpm prisma generate
   pnpm prisma db push
   ```

## 🔧 Development Workflow

1. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and test them:
   ```bash
   pnpm dev
   ```

3. **Run linting** to ensure code quality:
   ```bash
   pnpm lint
   ```

4. **Commit your changes** with a descriptive message:
   ```bash
   git commit -m "feat: add amazing feature"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** on GitHub

## 📝 Commit Message Guidelines

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, missing semicolons, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```
feat: add note export to PDF functionality
fix: resolve issue with note search on mobile
docs: update installation instructions
```

## 🐛 Reporting Bugs

When reporting bugs, please include:

1. **Description** - Clear description of the bug
2. **Steps to reproduce** - How to reproduce the issue
3. **Expected behavior** - What should happen
4. **Actual behavior** - What actually happens
5. **Environment** - OS, Node version, browser, etc.
6. **Screenshots** - If applicable

## 💡 Feature Requests

We welcome feature requests! Please:

1. **Check existing issues** to avoid duplicates
2. **Describe the feature** clearly
3. **Explain the use case** and benefits
4. **Provide examples** if possible

## 🔍 Code Review Process

1. All submissions require review before merging
2. We may suggest changes or improvements
3. Keep discussions focused and respectful
4. Be open to feedback

## 📋 Pull Request Checklist

Before submitting a PR, ensure:

- [ ] Code follows the project's style guidelines
- [ ] Linting passes (`pnpm lint`)
- [ ] Changes are tested locally
- [ ] Documentation is updated if needed
- [ ] Commit messages follow conventions
- [ ] PR description clearly explains changes

## 🎯 Areas for Contribution

Some areas where we'd love help:

- **Testing** - Adding unit and integration tests
- **Documentation** - Improving guides and API docs
- **Features** - Implementing items from the roadmap
- **Bug fixes** - Addressing open issues
- **Performance** - Optimizing code and queries
- **Accessibility** - Improving a11y features
- **Internationalization** - Adding translations

## 🤝 Code of Conduct

### Our Pledge

We pledge to make participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive behavior includes:**
- Being respectful and inclusive
- Accepting constructive criticism
- Focusing on what's best for the community
- Showing empathy towards others

**Unacceptable behavior includes:**
- Harassment or discriminatory comments
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Other unprofessional conduct

### Enforcement

Instances of unacceptable behavior may be reported to the project maintainers. All complaints will be reviewed and investigated promptly and fairly.

## 📞 Getting Help

If you need help:

1. Check the [documentation](./docs)
2. Search [existing issues](https://github.com/MrArrogant2002/quickNotes/issues)
3. Ask in discussions
4. Open a new issue

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to QuickNotes! 🎉
