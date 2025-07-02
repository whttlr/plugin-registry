---
sidebar_position: 1
---

# Welcome to CNC Plugin Registry

Extend your CNC application with powerful, community-driven plugins. The CNC Plugin Registry is a centralized platform for discovering, developing, and distributing plugins that enhance your machining workflow.

## What are CNC Plugins?

CNC plugins are modular extensions that add functionality to your CNC control application. They can:

- **Monitor** machine status and performance
- **Control** advanced operations and automation
- **Visualize** toolpaths and working areas
- **Manage** tools, materials, and configurations
- **Automate** repetitive tasks and workflows

## Plugin Types

### 🎛️ Dashboard Plugins
Small, focused widgets that display on your main dashboard
- Real-time status monitoring
- Quick controls and settings
- Performance metrics

### 🖥️ Standalone Applications
Full-screen applications with dedicated functionality
- G-code editors and viewers
- Tool libraries and databases
- Advanced configuration tools

### 💬 Modal Dialogs
Popup interfaces for focused interactions
- Settings and preferences
- Confirmation dialogs
- Quick forms and inputs

### 📋 Sidebar Tools
Compact panels for frequently used utilities
- Tool palettes
- Quick reference guides
- Shortcut menus

## Getting Started

### 📖 For Users
- [Browse Plugin Gallery](/plugins) - Discover available plugins
- [Quick Reference](/docs/quick-reference) - Installation and usage guide

### 💻 For Developers
- [Development Guide](/docs/development/overview) - Build your first plugin
- [Quick Reference](/docs/quick-reference) - API and command reference

## Quick Examples

### Simple Dashboard Widget
```typescript
import React from 'react';
import { PluginAPI } from '@whttlr/plugin-types';

const StatusWidget: React.FC<{ api: PluginAPI }> = ({ api }) => {
  const machineConfig = api.config.getSection('machine');
  const jogSpeed = api.config.get('machine.jogSettings.defaultSpeed');
  
  return (
    <div className="status-widget">
      <h3>Machine Status</h3>
      <p>Jog Speed: {jogSpeed} units/min</p>
      <p>Config loaded: {api.config.isLoaded() ? 'Yes' : 'No'}</p>
    </div>
  );
};
```

### Plugin Configuration
```json
{
  "id": "status-widget",
  "name": "Status Widget",
  "version": "1.0.0",
  "description": "Display machine status information",
  "author": "Your Name",
  "placement": "dashboard",
  "permissions": ["machine.read", "config.read"],
  "size": {
    "width": 400,
    "height": 200
  }
}
```

## Registry Statistics

- **4** Available plugins
- **6** Plugin categories  
- **4** Placement types
- **Shared Types**: Uses @whttlr/plugin-types for consistency

## Community

Join our growing community of CNC enthusiasts and developers:

- 🐛 [Report Issues](https://github.com/whttlr/plugin-registry/issues)
- 💬 [Discussions](https://github.com/whttlr/plugin-registry/discussions)
- 📢 [Updates & News](/blog)

---

Ready to extend your CNC application? [Get started with plugin development](/docs/development/overview) or [browse the plugin gallery](/plugins) to find existing plugins for your needs.
