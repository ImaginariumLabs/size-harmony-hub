# Documentation Update Checklist

This checklist should be used when implementing new features or making significant changes to ensure all documentation is kept up-to-date.

## Feature Implementation Checklist

When implementing a new feature or making significant changes, check off the following items:

### Planning Phase

- [ ] Update SPRINT_TRACKER.md with new task details
- [ ] Create GitHub issue using the task template
- [ ] Review and update ROADMAP.md if necessary

### Implementation Phase

- [ ] Document code with clear comments
- [ ] Create or update technical documentation
- [ ] Update architecture diagrams if the feature changes the system architecture

### Testing Phase

- [ ] Document test cases
- [ ] Update TESTING_STRATEGY.md if new testing approaches are used
- [ ] Document any known limitations or edge cases

### Completion Phase

- [ ] Update USER_GUIDE.md with information about the new feature
- [ ] Update screenshots or diagrams to reflect the new feature
- [ ] Mark task as complete in SPRINT_TRACKER.md
- [ ] Update VERSION.md if documentation has changed significantly

## Documentation Types to Update

Depending on the feature, different documentation files may need to be updated:

### User-Facing Features

- [ ] USER_GUIDE.md
- [ ] README.md (if it's a major feature)
- [ ] Screenshots in documentation

### Architectural Changes

- [ ] ARCHITECTURE.md
- [ ] Architecture diagrams
- [ ] PROJECT_STRUCTURE.md (if file structure changes)

### Development Process Changes

- [ ] DEVELOPMENT_WORKFLOW.md
- [ ] TESTING_STRATEGY.md
- [ ] CI/CD configuration

### API or Data Model Changes

- [ ] API documentation
- [ ] Database schema documentation
- [ ] SUPABASE_SETUP.md (if Supabase configuration changes)

## Documentation Review Process

After updating documentation:

1. Self-review the changes for accuracy and completeness
2. Have another team member review the documentation
3. Update the "Last Updated" date in the document header
4. Update VERSION.md with a summary of the changes

## Maintenance Schedule

Regular documentation maintenance should occur:

- At the end of each sprint
- Before each release
- Quarterly for comprehensive review

## Documentation Debt Tracking

If you don't have time to fully update documentation, create a "documentation debt" item:

- [ ] Create a GitHub issue with the "documentation" label
- [ ] Add a TODO comment in the code
- [ ] Add an entry to the Documentation Debt section of SPRINT_TRACKER.md

## Last Updated

This checklist was last updated on May 3, 2025.
