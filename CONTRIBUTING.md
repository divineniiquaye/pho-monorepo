# Contributing to Myapp

This document provides guidelines and instructions for contributing to the `Myapp` project. This project uses a modern monorepo structure with React, React Native, Expo, NextJS, Tailwind, and Nativewind.

## Code Structure and Organization

#### Modular Architecture

We organize our codebase into modules or packages that encapsulate specific functionality. This approach enhances readability, maintainability, and reusability.

#### Directory Structure

We adopt a consistent directory structure that separates components, utilities, services, and assets.

-   Most components and features can be shared, and thus the code lives in the eg. `packages/design-system` directory, and is then imported into each project.
-   Some components will have web- or native- specific features, and those can be denoted by adding `.native` or `.web` to the filename, and react-native will take care of the rest:
    -   `button.web.tsx` & `button.native.tsx` can be added to the project in the same folder, and imported into a parent component as `import Button from "@repo/design/ui/button"`. The compiler will correctly import the right component.

#### Component Design

We use atomic design principles to build reusable components. This means starting with the smallest functional components (atoms) and combining them to form more complex components (molecules and organisms).

We have some helpful folders set up for organizing the shared components in `packages/`

-   `api/`: For handling API calls, errors, and responses from the backend.
-   `design-system/`: For any UI primitives (Buttons, Links, Typography, Animations, Cards, etc), react context components, and shared features for individual screens.

## Best Practices

#### Code Reuse

We leverage shared utilities and components to avoid duplication. We use symbolic links or package aliases for easier imports across the monorepo.

#### Consistent Coding Standards

We adopt a coding standard that is enforced using ESLint and Prettier. We ask all contributors to configure their IDEs/editor to follow these standards.

## Dependency Management

We use Pnpm Workspaces to manage dependencies across the monorepo. This allows for shared dependencies and easier management of package versions.

#### Shared Dependencies

We centralize common dependencies in the root `package.json` to ensure consistency across packages and applications within the monorepo.

#### Version Management

We use tools like Renovate or Dependabot to keep dependencies up to date. We regularly update dependencies to benefit from performance improvements, new features, and security patches.

## Source Control

### Branching

We prefer trunk based development with short-lived branches for feature development. When work is picked up a new branch should be created from the `main` branch. Engineers should use this branch to completed the work. When a PR is merged into `main` the branch will be automatically deleted.

#### Branch Naming Conventions

To keep things organized branches are be prefixed with a category and include the Linear issue that the work is for (all work should be captured in our backlog).

##### Pattern

`${category}/${issue}-${description}`

**Example:**

`feature/sv-123-purchase-order-items-list`

##### Categories

-   `feat` is for adding, refactoring or removing product features
-   `chore` is for anything else (documentation, formatting, additional tests, etc)
-   `hotfix` is for a temporary solution that may not follow the usual processes (emergency code fixes)
-   `fix` is for fixing a bug (not a breaking change)

### Commits & Merging

#### Commit Frequency

Commits aren't for saving code that is "done". Commit any selection of files as soon as you find you have made some progress. We have two goals for committing early and often:

1. Give yourself "save" points throughout your code, so that you can go back if somethings stops working.
2. Increase transparency and visibility across the team to allow others to see how your work is progressing and to attempt to debug when you are having troubles. No one can help you if they can't run your code!

#### PUSH YOUR CODE EVERY DAY

It's vital to our progress as a team to share code before it is ready. At the least, push your code at the end of the day. If you have a partial solution, open a Draft PR in Github before you are ready for review.

#### Commit Structure

In order to make reviewing code easier, we prefer that you organize your commits into logical groups that can be reviewed together. This may mean squashing specific commits so that relevant code is well organized. When code review has been completed, additional squashing can be done to simplify the commit history but is not required.

-   Use commits to help organize PR reviews
-   Use squash to keep a meaningful commit history
-   Avoid merge commits

##### Commit Messages

We write clear, concise commit messages that describe the changes made and the reason for them. We consider adopting Conventional Commits to standardize commit messages.

#### Pull Requests and Code Reviews

We require pull requests for merging code into the main branch. We implement a code review process to ensure code quality and adherence to the style guide.

By following these guidelines, contributors can ensure a high-quality, maintainable, and consistent codebase. This style guide should be regularly reviewed and updated to reflect evolving best practices and project requirements.
