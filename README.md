# Commit Pilot

[![Deno](https://github.com/stewie1520/commit-pilot/actions/workflows/deno.yml/badge.svg)](https://github.com/stewie1520/commit-pilot/actions/workflows/deno.yml)

Commit Pilot (`cpx`) is an AI-powered CLI tool that automates the Git commit workflow. It automatically adds changes, generates meaningful commit messages based on your code changes, and follows commit lint rules.

## Features

- 🤖 **AI-Powered Commit Messages** - Generates contextual commit messages based on your code changes
- 🛠️ **Auto-staging** - Automatically adds all changes to staging
- 🌳 **Smart Branch Creation** - Creates new feature branches when working on default branches
- ✅ **Commit Lint Integration** - Follows your project's commit lint rules
- 🔄 **Message Improvement** - Refines generated commit messages for clarity and consistency

## Installation

```bash
# Install dependencies
deno install

# Build the project
deno task build

# Add cpx to your PATH
export PATH=$PATH:$(pwd)/bin
```

## Usage

```bash
# Basic usage - adds all changes, generates a commit message, and commits
cpx

# Only generate commit message for already staged changes
cpx -s
# OR
cpx --only-staged
```

## Development

```bash
# Run in development mode with file watching
deno task dev

# Run tests
deno task test

# Format code
deno fmt

# Build the binary
deno task build
```

## Project Structure

- `src/index.ts` - Main entry point
- `src/ai/flows/` - AI prompt flows for generating commit messages and branch names
- `src/git/` - Git command wrappers
- `src/utils/` - Utility functions

## Dependencies

- Built with [Deno](https://deno.land/)
- Uses [GenKit](https://github.com/genkitai/genkit) for AI prompt flows
- Integrates with local Git repositories

