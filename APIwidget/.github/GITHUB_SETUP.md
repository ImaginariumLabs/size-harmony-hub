# GitHub Setup for APIwidget

## Repository Configuration

The APIwidget project will be hosted on GitHub with the following configuration:

### Repository Details

- **Repository Name**: apiwidget
- **Organization**: ImaginariumLabs
- **Visibility**: Public
- **Description**: A floating widget for monitoring API costs in real-time

## Branch Structure

The repository will follow a standard Git flow branching model:

- **main**: Production-ready code
- **develop**: Integration branch for features
- **feature/[feature-name]**: Individual feature branches
- **bugfix/[bug-name]**: Bug fix branches
- **release/[version]**: Release preparation branches

## Commit Guidelines

All commits should follow the Conventional Commits specification:

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that do not affect the meaning of the code
- **refactor**: A code change that neither fixes a bug nor adds a feature
- **perf**: A code change that improves performance
- **test**: Adding missing tests or correcting existing tests
- **chore**: Changes to the build process or auxiliary tools

Example: `feat(widget): add glass morphism design to floating widget`

## Pull Request Process

1. Create a feature branch from develop
2. Implement changes and test thoroughly
3. Create a pull request to merge back into develop
4. Ensure all CI checks pass
5. Request review from at least one team member
6. Address any feedback
7. Merge when approved

## Issue Templates

The repository will include the following issue templates:

1. **Bug Report**: For reporting bugs
2. **Feature Request**: For suggesting new features
3. **Documentation**: For documentation improvements
4. **Task**: For general development tasks

## GitHub Actions

The repository will use GitHub Actions for CI/CD:

1. **Build and Test**: Run on every push and pull request
2. **Lint**: Check code style and formatting
3. **Release**: Create releases for tagged versions
4. **Deploy**: Deploy to staging/production environments

## Release Process

1. Create a release branch from develop
2. Bump version numbers
3. Update CHANGELOG.md
4. Create a pull request to main
5. After merging, tag the release
6. GitHub Actions will build and create the release

## GitHub Project Board

A GitHub Project board will be used to track progress:

- **To Do**: Issues that are ready to be worked on
- **In Progress**: Issues currently being worked on
- **Review**: Pull requests awaiting review
- **Done**: Completed issues

## Repository Setup Instructions

1. Create the repository on GitHub
2. Clone the repository locally
3. Set up the initial project structure
4. Add .gitignore and other configuration files
5. Make the initial commit
6. Push to GitHub

## .gitignore Configuration

The repository will include a .gitignore file with the following entries:

```
# Dependencies
/node_modules
/.pnp
.pnp.js

# Testing
/coverage

# Production
/build
/dist
/release

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Editor directories and files
.idea
.vscode
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
```

## GitHub Security Features

The repository will enable the following security features:

1. **Dependabot**: For dependency vulnerability alerts
2. **Code scanning**: For identifying security vulnerabilities
3. **Secret scanning**: To prevent accidental secret exposure

## Contribution Guidelines

A CONTRIBUTING.md file will be added to the repository with guidelines for:

1. Code style and formatting
2. Testing requirements
3. Documentation standards
4. Pull request process
5. Code of conduct
