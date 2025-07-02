# CNC Plugin Development Guide

This comprehensive guide covers everything you need to know to develop, test, and publish plugins for the CNC Jog Controls application.

## Table of Contents

1. [Overview](#overview)
2. [Plugin Architecture](#plugin-architecture)
3. [Getting Started](#getting-started)
4. [Plugin Configuration](#plugin-configuration)
5. [Data Access & Settings](#data-access--settings)
6. [Screen Management](#screen-management)
7. [Plugin API](#plugin-api)
8. [Development Workflow](#development-workflow)
9. [Publishing](#publishing)
10. [Best Practices](#best-practices)

## Overview

The CNC plugin system enables developers to extend the application with custom functionality through a React-based component architecture. Plugins can access machine data, configuration settings, and integrate seamlessly into the user interface.

### Plugin Types

- **Dashboard Plugins**: Small cards displayed on the main dashboard
- **Standalone Plugins**: Full-screen applications with their own navigation
- **Modal Plugins**: Popup dialogs for focused interactions
- **Sidebar Plugins**: Compact panels for quick access to tools

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

## Getting Started

### Prerequisites

- Node.js 18+
- TypeScript knowledge
- React 18+ experience
- Understanding of CNC/machining concepts

### Quick Start

1. **Clone Plugin Template**
   ```bash
   git clone https://github.com/whttlr/plugin-template my-plugin
   cd my-plugin
   npm install
   ```

2. **Update Plugin Manifest**
   ```json
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

3. **Develop Plugin**
   ```bash
   npm run dev    # Start development server
   npm run build  # Build for production
   npm run test   # Run tests
   ```

## Plugin Configuration

### Plugin Manifest (package.json)

Every plugin must include a complete manifest in its `package.json`:

```json
{
  "name": "my-cnc-plugin",
  "version": "1.0.0",
  "description": "Brief description of plugin functionality",
  "main": "dist/index.js",
  "author": "Your Name",
  "license": "MIT",
  "cncPlugin": {
    "apiVersion": "1.0.0",
    "category": "monitoring",
    "displayName": "My CNC Plugin",
    "permissions": ["machine.read", "config.read"],
    "ui": {
      "placement": "dashboard",
      "screen": "main",
      "size": { "width": 400, "height": 300 },
      "priority": 100
    }
  },
  "dependencies": {
    "react": "^18.0.0",
    "antd": "^5.0.0"
  }
}
```

### Required Fields

- **name**: Unique plugin identifier (lowercase, hyphens only)
- **version**: Semantic version (major.minor.patch)
- **description**: 10-500 character description
- **author**: Plugin creator or organization
- **cncPlugin.placement**: UI placement type
- **cncPlugin.permissions**: Required access permissions

### Optional Fields

- **license**: Software license (default: MIT)
- **homepage**: Plugin homepage URL
- **repository**: Source code repository
- **keywords**: Search keywords (max 10)
- **category**: Plugin category
- **screenshots**: Gallery images (max 5)

## Data Access & Settings

### Plugin API

The PluginAPI provides access to application data and services:

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
// Access machine configuration
const jogSpeed = pluginAPI.config.get('jog.speed.xy');
const units = pluginAPI.config.get('machine.units');
const homePosition = pluginAPI.config.get('machine.home');

// Get entire configuration sections
const jogSettings = pluginAPI.config.getSection('jog');
const machineConfig = pluginAPI.config.getSection('machine');

// With fallback values
const customSetting = pluginAPI.config.getWithFallback('custom.setting', 'default');
```

### Available Configuration Data

#### Machine Settings
```typescript
interface MachineConfig {
  units: 'mm' | 'inch';           // Units of measurement
  dimensions: {                   // Work area dimensions
    x: { min: number; max: number };
    y: { min: number; max: number };
    z: { min: number; max: number };
  };
  home: {                        // Home position
    x: number;
    y: number;
    z: number;
  };
  coordinateSystems: boolean;     // Multiple coordinate systems
  spindleControl: boolean;        // Spindle control capability
  probing: boolean;              // Probing support
}
```

#### Jog Settings
```typescript
interface JogConfig {
  speed: {                       // Jog speeds (units/min)
    xy: number;
    z: number;
    rapid: number;
  };
  acceleration: number;          // Acceleration (units/sec²)
  distances: number[];           // Preset jog distances
  increments: number[];          // Incremental jog amounts
}
```

#### UI Settings
```typescript
interface UIConfig {
  theme: 'light' | 'dark';       // Application theme
  language: string;              // UI language
  units: 'mm' | 'inch';         // Display units
  precision: number;             // Decimal precision
}
```

#### Connection Settings
```typescript
interface ConnectionConfig {
  port: string;                  // Serial port
  baudRate: number;             // Communication speed
  timeout: number;              // Connection timeout (ms)
  autoConnect: boolean;         // Auto-connect on startup
}
```

### Permissions System

Declare required permissions in your plugin manifest:

```json
{
  "cncPlugin": {
    "permissions": [
      "machine.read",      // Read machine status and position
      "machine.write",     // Send commands to machine
      "machine.control",   // Full machine control access
      "status.read",       // Read system status
      "files.read",        // Read G-code files
      "files.write",       // Write/modify files
      "config.read",       // Read configuration
      "config.write",      // Modify configuration
      "network.access"     // External network requests
    ]
  }
}
```

## Screen Management

### Placement Options

#### Dashboard Placement
Best for: Status monitoring, quick controls, data visualization

```json
{
  "ui": {
    "placement": "dashboard",
    "screen": "main",
    "size": { "width": 400, "height": 300 },
    "priority": 100
  }
}
```

#### Standalone Placement
Best for: Complex applications, configuration tools, file managers

```json
{
  "ui": {
    "placement": "standalone",
    "screen": "new",
    "menuTitle": "My Tool",
    "menuIcon": "ToolOutlined",
    "routePath": "/my-tool"
  }
}
```

#### Modal Placement
Best for: Settings dialogs, confirmation prompts, quick actions

```json
{
  "ui": {
    "placement": "modal",
    "size": { "width": 600, "height": "auto" }
  }
}
```

#### Sidebar Placement
Best for: Tool palettes, quick settings, shortcuts

```json
{
  "ui": {
    "placement": "sidebar",
    "size": { "width": 300, "height": "auto" }
  }
}
```

### Screen Targets

- **main**: Main dashboard screen
- **controls**: Jog controls screen
- **machine**: Machine status screen
- **workspace**: Workspace management screen
- **settings**: Application settings screen
- **new**: Create new dedicated screen

### Sizing

- **Width**: Number (pixels) or "auto"
- **Height**: Number (pixels) or "auto"
- **Priority**: 1-200 (higher numbers display first)

## Plugin API

### Basic Plugin Structure

```typescript
import React from 'react';
import { PluginAPI, PluginProps } from '@cnc/plugin-api';

interface MyPluginProps extends PluginProps {
  api: PluginAPI;
}

const MyPlugin: React.FC<MyPluginProps> = ({ api }) => {
  const [machineStatus, setMachineStatus] = React.useState(null);

  React.useEffect(() => {
    // Access configuration
    const jogSpeed = api.config.get('jog.speed.xy');
    console.log('Current jog speed:', jogSpeed);

    // Future: Subscribe to machine status updates
    // api.machine.onStatusChange(setMachineStatus);
  }, [api]);

  return (
    <div className="my-plugin">
      <h3>My Plugin</h3>
      <p>Jog Speed: {api.config.get('jog.speed.xy')} units/min</p>
    </div>
  );
};

export default MyPlugin;
```

### Plugin Lifecycle

```typescript
class PluginLifecycle {
  // Called when plugin is activated
  async onActivate(context: PluginContext): Promise<void> {
    console.log('Plugin activated');
  }

  // Called when plugin is deactivated
  async onDeactivate(): Promise<void> {
    console.log('Plugin deactivated');
  }

  // Called when UI component mounts
  async mount(container: HTMLElement): Promise<void> {
    console.log('Plugin UI mounted');
  }

  // Called when UI component unmounts
  async unmount(): Promise<void> {
    console.log('Plugin UI unmounted');
  }
}
```

### TypeScript Definitions

```typescript
// Define your plugin's props
interface MyPluginProps {
  api: PluginAPI;
  width?: number;
  height?: number;
  config?: Record<string, any>;
}

// Define configuration types
interface MyPluginConfig {
  refreshRate: number;
  showAdvanced: boolean;
  units: 'mm' | 'inch';
}
```

## Development Workflow

### 1. Local Development

```bash
# Start development server
npm run dev

# Watch for changes and rebuild
npm run watch

# Run tests
npm run test

# Type checking
npm run type-check
```

### 2. Testing

Create comprehensive tests for your plugin:

```typescript
// tests/MyPlugin.test.tsx
import { render, screen } from '@testing-library/react';
import MyPlugin from '../src/MyPlugin';
import { mockPluginAPI } from '@cnc/test-utils';

test('renders plugin correctly', () => {
  const api = mockPluginAPI({
    config: { 'jog.speed.xy': 1000 }
  });

  render(<MyPlugin api={api} />);
  
  expect(screen.getByText('Jog Speed: 1000')).toBeInTheDocument();
});
```

### 3. Building

```bash
# Build for production
npm run build

# Create distribution package
npm run package
```

### 4. Validation

```bash
# Validate plugin manifest
npm run validate

# Check for common issues
npm run lint
```

## Publishing

### Method 1: Automated Publishing

1. **Prepare Plugin**
   ```bash
   npm run build
   npm run test
   npm run package
   ```

2. **Create GitHub Release**
   - Tag: `my-plugin-v1.0.0`
   - Assets: `my-plugin.zip`

3. **Registry Auto-Update**
   - GitHub Actions automatically updates registry
   - Plugin becomes available in application

### Method 2: Manual Registry Submission

1. **Create Plugin Manifest**
   ```json
   {
     "id": "my-plugin",
     "name": "My Plugin",
     "version": "1.0.0",
     "description": "Plugin description here",
     "author": "Your Name",
     "placement": "dashboard",
     "permissions": ["machine.read"]
   }
   ```

2. **Submit Pull Request**
   - Fork plugin-registry repository
   - Add manifest to `plugins/my-plugin/plugin.json`
   - Create pull request

3. **Create Release**
   - After PR approval, create GitHub release
   - Format: `my-plugin-v1.0.0`
   - Include ZIP file with built plugin

### Publishing Checklist

- [ ] Plugin manifest complete and valid
- [ ] All tests passing
- [ ] Build completes without errors
- [ ] Required permissions documented
- [ ] README with usage instructions
- [ ] Version follows semantic versioning
- [ ] Screenshots included (if applicable)
- [ ] License specified

## Best Practices

### Code Quality

1. **Use TypeScript**: Better type safety and development experience
2. **Follow React Patterns**: Use hooks, functional components
3. **Error Handling**: Gracefully handle missing data or API failures
4. **Performance**: Optimize re-renders and memory usage
5. **Accessibility**: Follow WCAG guidelines for UI components

### Security

1. **Minimal Permissions**: Only request necessary permissions
2. **Input Validation**: Validate all user inputs
3. **XSS Prevention**: Sanitize dynamic content
4. **Safe APIs**: Use provided APIs instead of direct DOM manipulation

### UI/UX

1. **Consistent Design**: Follow application theme and styling
2. **Responsive Layout**: Support different screen sizes
3. **Loading States**: Show progress for async operations
4. **Error Messages**: Provide helpful error feedback
5. **Ant Design**: Use provided component library

### Configuration

1. **Default Values**: Provide sensible defaults
2. **Validation**: Validate configuration changes
3. **Documentation**: Document all configuration options
4. **Backwards Compatibility**: Handle configuration migrations

### Testing

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test plugin integration with API
3. **Mock APIs**: Use provided mock utilities
4. **Edge Cases**: Test error conditions and edge cases

### Documentation

1. **README**: Clear installation and usage instructions
2. **Code Comments**: Document complex logic
3. **Type Definitions**: Export TypeScript interfaces
4. **Changelog**: Maintain version history
5. **Examples**: Provide usage examples

### Performance

1. **Bundle Size**: Keep plugin size minimal
2. **Lazy Loading**: Load components when needed
3. **Memory Management**: Clean up event listeners and timers
4. **Debouncing**: Throttle frequent updates

### Versioning

1. **Semantic Versioning**: Follow semver specification
2. **Breaking Changes**: Major version for breaking changes
3. **Migration Guides**: Document upgrade procedures
4. **Compatibility**: Test with multiple app versions

This guide provides everything needed to create robust, secure, and user-friendly plugins for the CNC Jog Controls application. For additional support, consult the API documentation or community forums.