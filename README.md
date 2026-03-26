# ClawShell Hub

This directory contains the ClawShell application catalog and related schemas.

## Structure

```
clawshell-hub/
├── community-apps.json      # App registry (similar to Obsidian plugins)
├── CLAUDE_APPS_SCHEMA.json  # JSON Schema for validation
└── README.md                 # This file
```

## Adding Your App

To add your app to the ClawShell catalog:

1. Fork this repository
2. Add your app entry to `community-apps.json`
3. Submit a pull request

### App Entry Format

```json
{
  "appId": "your-app-id",
  "name": "Your App Name",
  "summary": "A brief description (max 200 chars)",
  "description": "Full description (optional, max 2000 chars)",
  "repo": "github-username/repo-name",
  "manifestUrl": "https://raw.githubusercontent.com/.../manifest.json",
  "iconUrl": "https://raw.githubusercontent.com/.../icon.png",
  "latestVersion": "1.0.0",
  "minShellVersion": "0.1.0",
  "author": {
    "name": "Your Name"
  },
  "categories": ["productivity"],
  "keywords": ["keyword1", "keyword2"],
  "repository": "https://github.com/.../repo-name",
  "license": "MIT"
}
```

### Requirements

- `appId`: Lowercase letters, numbers, and hyphens only
- `name`: 1-100 characters
- `summary`: 1-200 characters
- `repo`: GitHub repository in `owner/repo` format
- `manifestUrl`: Direct URL to your `manifest.json`
- `latestVersion`: Must follow SemVer (e.g., `1.0.0`)

## App Manifest

Your app's `manifest.json` must follow the ClawShell app manifest schema:

```json
{
  "schemaVersion": 1,
  "appId": "your-app-id",
  "name": "Your App Name",
  "version": "1.0.0",
  "description": "App description",
  "author": {
    "name": "Your Name"
  },
  "repository": "https://github.com/username/repo",
  "entry": {
    "index": "ui/dist/index.html"
  },
  "permissions": {
    "workspace": { "read": true, "write": true },
    "storage": { "localStorage": true, "cache": true },
    "network": {
      "allowedOrigins": ["https://api.example.com"]
    },
    "agents": ["agent-key"]
  },
  "agents": [
    { "key": "agent-key", "name": "Agent Name", "file": "agents/agent.yaml" }
  ],
  "skills": [
    { "key": "skill-key", "path": "skills/skill", "scope": "app" }
  ],
  "cronjobs": [
    { "key": "job-key", "file": "cronjobs/job.yaml", "agentId": "agent-key" }
  ],
  "compatibility": {
    "minShellVersion": "0.1.0"
  }
}
```

## Release Assets

When you release a new version on GitHub, include:

- `clawshell-app.tgz` - The packaged app containing:
  - `manifest.json`
  - `ui/dist/*` - Built UI assets
  - `agents/*.yaml` - Agent definitions
  - `skills/**/*` - Skill templates
  - `cronjobs/*.yaml` - Cron job definitions
  - `assets/icon.png` - App icon

## Validation

Validate your `community-apps.json` against the schema:

```bash
# Using ajv-cli
npx ajv validate -s CLAUDE_APPS_SCHEMA.json -d community-apps.json

# Or using Python
python -c "import json, jsonschema; jsonschema.validate(json.load(open('community-apps.json')), json.load(open('CLAUDE_APPS_SCHEMA.json')))"
```

## Categories

Available categories for apps:

- `productivity` - Tools to improve productivity
- `development` - Development tools and workflows
- `communication` - Chat, messaging, collaboration
- `analytics` - Data analysis and visualization
- `automation` - Task automation and workflows
- `education` - Learning and educational content
- `entertainment` - Games and entertainment
- `other` - Apps that don't fit other categories

## License

By submitting your app to the catalog, you confirm that:
- You have the right to distribute the app
- The app complies with ClawShell's terms of use
- You will maintain the app and respond to issues
