# Contributing to APIwidget

Thank you for considering contributing to APIwidget! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the Issues section
- Use the bug report template when creating a new issue
- Include detailed steps to reproduce the bug
- Include screenshots if applicable
- Describe the expected behavior and what actually happened
- Include system information (OS, browser, etc.)

### Suggesting Features

- Check if the feature has already been suggested in the Issues section
- Use the feature request template when creating a new issue
- Provide a clear description of the feature
- Explain why this feature would be useful to most users
- Include mockups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch from `develop`
3. Make your changes
4. Run tests and ensure they pass
5. Update documentation if necessary
6. Submit a pull request to the `develop` branch

## Development Workflow

### Setting Up the Development Environment

1. Clone the repository
2. Install dependencies with `npm install`
3. Copy `.env.example` to `.env` and configure environment variables
4. Start the development server with `npm run dev`
5. For Electron development, use `npm run electron:dev`

### Coding Standards

- Follow the ESLint configuration
- Write meaningful commit messages following the Conventional Commits specification
- Keep code modular and maintainable
- Add comments for complex logic
- Update documentation for public APIs

### Testing

- Write tests for new features
- Ensure all tests pass before submitting a pull request
- Run tests with `npm test`

### Documentation

- Update documentation for any changes to public APIs
- Use JSDoc comments for functions and classes
- Keep the README.md up to date

## Pull Request Process

1. Ensure your code follows the coding standards
2. Update documentation if necessary
3. Include tests for new features
4. Link the pull request to any related issues
5. Wait for a review from a maintainer
6. Address any feedback from the review
7. Once approved, a maintainer will merge your pull request

## Style Guides

### Git Commit Messages

Follow the Conventional Commits specification:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

Example: `feat(widget): add glass morphism design to floating widget`

### JavaScript/TypeScript Style Guide

- Use TypeScript for all new code
- Follow the ESLint configuration
- Use async/await instead of callbacks or promises
- Use functional components with hooks for React
- Use named exports instead of default exports

### CSS Style Guide

- Use CSS modules or styled-components
- Follow BEM naming convention for CSS classes
- Use variables for colors, spacing, and other repeated values
- Keep selectors simple and avoid deep nesting

### Documentation Style Guide

- Use Markdown for documentation
- Keep documentation up to date with code changes
- Include examples where appropriate
- Use clear, concise language

## Additional Notes

### Issue and Pull Request Labels

- `bug`: Something isn't working
- `feature`: New feature or request
- `documentation`: Improvements or additions to documentation
- `enhancement`: Improvement to existing features
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `wontfix`: This will not be worked on

## Thank You!

Your contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.
