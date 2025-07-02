---
sidebar_position: 1
---

# Plugin Development Overview

Learn how to build powerful plugins for the CNC application. This guide covers everything from basic concepts to advanced features.

## Prerequisites

Before you start developing plugins, ensure you have:

- **Node.js 18+** installed
- **TypeScript** knowledge
- **React 18+** experience  
- Basic understanding of **CNC/machining concepts**

## Quick Start

### 1. Clone Plugin Template

```bash
git clone https://github.com/whttlr/plugin-template my-plugin
cd my-plugin
npm install
```

### 2. Update Plugin Manifest

```json title="package.json"
{
  "name": "my-plugin",
  "version": "1.0.0",
  "cncPlugin": {
    "apiVersion": "1.0.0",
    "displayName": "My Plugin",
    "placement": "dashboard"
  }
}
```

### 3. Start Development

```bash
npm run dev    # Start development server
npm run build  # Build for production
npm run test   # Run tests
```

## Plugin Architecture

### Core Components

```
CNC Application
├── PluginContext Service    # Plugin lifecycle management
├── PluginRenderer          # UI rendering system
├── PluginAPI              # Data access interface
├── Database Integration   # State persistence
└── Configuration System   # Settings management
```

### Plugin Structure

```
my-plugin/
├── package.json           # Plugin manifest and dependencies
├── src/
│   ├── index.tsx         # Main plugin entry point
│   ├── components/       # React components
│   ├── services/        # Plugin-specific services
│   └── types/           # TypeScript type definitions
├── assets/              # Static resources (images, icons)
├── tests/              # Unit and integration tests
└── README.md           # Plugin documentation
```

## Plugin Types

### Dashboard Plugin
Perfect for status monitoring and quick controls.

```typescript title="src/DashboardWidget.tsx"
import React from 'react';
import { PluginAPI } from '@cnc/plugin-api';

const DashboardWidget: React.FC<{ api: PluginAPI }> = ({ api }) => {
  const jogSpeed = api.config.get('jog.speed.xy');
  
  return (
    <div className="plugin-card">
      <h4>Jog Speed Monitor</h4>
      <p>Current: {jogSpeed} mm/min</p>
    </div>
  );
};

export default DashboardWidget;
```

```json title="Manifest Configuration"
{
  "cncPlugin": {
    "placement": "dashboard",
    "size": { "width": 400, "height": 300 },
    "permissions": ["machine.read"]
  }
}
```

### Standalone Application
Full-screen applications with dedicated functionality.

```typescript title="src/StandaloneApp.tsx"
import React from 'react';
import { PluginAPI } from '@cnc/plugin-api';

const StandaloneApp: React.FC<{ api: PluginAPI }> = ({ api }) => {
  return (
    <div className="plugin-app">
      <h1>My CNC Tool</h1>
      <p>Full application interface here</p>
    </div>
  );
};

export default StandaloneApp;
```

```json title="Manifest Configuration"
{
  "cncPlugin": {
    "placement": "standalone",
    "menuTitle": "My Tool",
    "menuIcon": "ToolOutlined",
    "routePath": "/my-tool"
  }
}
```

## Development Workflow

### 1. Setup Development Environment

```bash
# Create new plugin
npm run create-plugin my-widget "My Widget" dashboard

# Install dependencies
cd my-widget
npm install

# Start development
npm run dev
```

### 2. Plugin Development Loop

1. **Write Tests** (TDD approach)
2. **Implement Features**
3. **Test in Application**
4. **Refine and Iterate**

### 3. Testing

```typescript title="tests/MyPlugin.test.tsx"
import { render, screen } from '@testing-library/react';
import MyPlugin from '../src/MyPlugin';
import { mockPluginAPI } from '@cnc/test-utils';

test('renders plugin correctly', () => {
  const api = mockPluginAPI({
    config: { 'jog.speed.xy': 1000 }
  });

  render(<MyPlugin api={api} />);
  
  expect(screen.getByText('Current: 1000')).toBeInTheDocument();
});
```

### 4. Building and Packaging

```bash
# Build for production
npm run build

# Create distribution package
npm run package

# Validate plugin
npm run validate
```

## Key Development Concepts

### Plugin API Access
```typescript
interface PluginAPI {
  config: ConfigAPI;     // Configuration access
  machine: MachineAPI;   // Machine data (planned)
  events: EventAPI;      // Event system (planned)
  storage: StorageAPI;   // Plugin storage (planned)
  ui: UIAPI;            // UI utilities (planned)
}
```

### Configuration Access
```typescript
// Access machine settings
const units = api.config.get('machine.units');
const homePosition = api.config.get('machine.home');

// Get configuration sections
const jogSettings = api.config.getSection('jog');

// With fallback values
const customValue = api.config.getWithFallback('my.setting', 'default');
```

### Permission System
Declare required permissions in your manifest:

```json
{
  "cncPlugin": {
    "permissions": [
      "machine.read",      // Read machine status
      "config.read",       // Read configuration
      "network.access"     // External API calls
    ]
  }
}
```

## Best Practices

### Code Quality
- ✅ Use TypeScript for better type safety
- ✅ Follow React patterns and hooks
- ✅ Implement proper error handling
- ✅ Write comprehensive tests

### Security
- ✅ Request minimal permissions
- ✅ Validate all user inputs
- ✅ Use provided APIs instead of direct access
- ✅ Sanitize dynamic content

### Performance
- ✅ Keep bundle size minimal
- ✅ Implement proper cleanup
- ✅ Use lazy loading when appropriate
- ✅ Optimize re-renders

### UI/UX
- ✅ Follow application theme
- ✅ Support responsive layouts
- ✅ Provide loading states
- ✅ Use Ant Design components

## Next Steps

Now that you understand the basics, you can:

- **Expand your plugin** with more advanced features
- **Test thoroughly** before publishing
- **Follow React best practices** for UI components
- **Use TypeScript** for better development experience

Ready to share your plugin? Check the [quick reference](/docs/quick-reference) for publishing information and command references!