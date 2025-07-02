# CNC Plugin Registry

A centralized registry for CNC jog controls application plugins. This registry provides automated validation, distribution, and version management for plugins.

## 🏗️ Repository Structure

```
cnc-plugin-registry/
├── 📄 registry.json              # Main registry index
├── 📁 plugins/                   # Plugin metadata
│   ├── machine-monitor/
│   │   └── plugin.json          # Plugin manifest
│   ├── gcode-snippets/
│   │   └── plugin.json
│   └── tool-library/
│       └── plugin.json
├── 📁 schemas/                   # JSON validation schemas
│   ├── plugin-schema.json       # Plugin manifest schema
│   └── registry-schema.json     # Registry index schema
├── 📁 scripts/                   # Management utilities
│   ├── create-plugin.js         # Generate new plugin from template
│   ├── package-plugin.js        # Build and package plugin for distribution
│   ├── add-plugin.js            # Add new plugin to registry
│   ├── update-plugin.js         # Update existing plugin
│   └── validate-registry.js     # Validate registry and manifests
├── 📁 .github/workflows/         # GitHub Actions
│   ├── validate-registry.yml    # Automated validation
│   └── update-registry.yml      # Auto-update on releases
└── 📄 README.md                  # This file
```

## 🚀 Quick Start

### For Plugin Users

Browse and install plugins directly from your CNC application's plugin store, which fetches from this registry.

### For Plugin Developers

**Quick Start - Create a New Plugin:**
```bash
# 1. Generate plugin from template
node scripts/create-plugin.js my-plugin "My Plugin" dashboard

# 2. Develop your plugin
cd my-plugin
npm install
npm run dev

# 3. Build and package
npm run build
npm run package

# 4. Create GitHub release with the ZIP file
# 5. Plugin automatically appears in registry!
```

**Traditional Workflow:**
1. **Create your plugin** following the development workflow below
2. **Add plugin metadata** to this registry
3. **Submit a pull request** with your plugin metadata  
4. **Create a release** in your plugin repository with format: `your-plugin-id-v1.0.0`

## 📋 Plugin Manifest Schema

Each plugin must include a `plugin.json` manifest:

```json
{
  "id": "machine-monitor",
  "name": "Machine Monitor",
  "version": "1.2.0",
  "description": "Real-time machine status monitoring with comprehensive dashboard",
  "author": "Your Organization",
  "license": "MIT",
  "homepage": "https://github.com/whttlr/machine-monitor-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/whttlr/machine-monitor-plugin.git"
  },
  "keywords": ["monitoring", "dashboard", "real-time"],
  "category": "monitoring",
  "placement": "dashboard",
  "screen": "main",
  "size": {
    "width": 400,
    "height": 300
  },
  "priority": 1,
  "autoStart": true,
  "permissions": ["machine.read", "status.read"],
  "compatibility": {
    "minAppVersion": "1.0.0",
    "maxAppVersion": "2.0.0"
  },
  "dependencies": {
    "react": "^18.0.0",
    "antd": "^5.0.0"
  }
}
```

### Required Fields

- `id`: Unique identifier (lowercase, numbers, hyphens)
- `name`: Human-readable plugin name  
- `version`: Semantic version (major.minor.patch)
- `description`: Brief functionality description
- `author`: Plugin author or organization
- `placement`: UI placement (`dashboard`, `standalone`, `modal`, `sidebar`)

### Plugin Categories

- `monitoring`: Status monitoring and diagnostics
- `control`: Machine control and automation
- `visualization`: 3D/2D visualization tools
- `utility`: General utilities and helpers
- `automation`: Automated workflows
- `management`: Asset and configuration management

### Permissions

- `machine.read`: Read machine status and position
- `machine.write`: Send commands to machine
- `machine.control`: Full machine control access
- `status.read`: Read system status information
- `files.read`: Read files and G-code
- `files.write`: Write and upload files
- `config.read`: Read application configuration
- `config.write`: Modify application settings
- `network.access`: Make external network requests

## 🛠️ Management Scripts

### Create New Plugin
```bash
node scripts/create-plugin.js <plugin-id> <plugin-name> [template-type]

# Examples
node scripts/create-plugin.js machine-monitor "Machine Monitor" dashboard
node scripts/create-plugin.js gcode-editor "G-Code Editor" standalone
node scripts/create-plugin.js quick-settings "Quick Settings" modal
node scripts/create-plugin.js tool-panel "Tool Panel" sidebar
```

### Package Plugin for Distribution
```bash
node scripts/package-plugin.js <plugin-directory> [output-directory]

# Examples
node scripts/package-plugin.js ./machine-monitor
node scripts/package-plugin.js /path/to/plugin ./packages
```

### Add Plugin to Registry
```bash
node scripts/add-plugin.js <plugin-id> [manifest-path]

# Examples
node scripts/add-plugin.js machine-monitor
node scripts/add-plugin.js custom-plugin /path/to/plugin.json
```

### Update Existing Plugin
```bash
node scripts/update-plugin.js <plugin-id> <version> [download-url]

# Examples  
node scripts/update-plugin.js machine-monitor 1.3.0
node scripts/update-plugin.js gcode-snippets 2.1.0 https://example.com/download.zip
```

### Validate Registry
```bash
node scripts/validate-registry.js
```

This checks:
- JSON syntax validity
- Schema compliance  
- No duplicate plugin IDs
- Manifest consistency
- URL accessibility (warning only)

## ⚡ Quick Reference

### Available NPM Scripts
```bash
npm run validate        # Validate registry and all manifests
npm run create-plugin   # Interactive plugin creation
npm run package-plugin  # Package existing plugin
npm run add-plugin      # Add plugin to registry
npm run update-plugin   # Update plugin in registry
npm test               # Run validation tests
```

### Plugin Template Types
- **dashboard**: Small cards for main dashboard (400x300px)
- **standalone**: Full-screen applications with navigation
- **modal**: Popup dialogs for focused tasks  
- **sidebar**: Compact side panels for quick access

## 🔄 Automated Workflows

### Validation (On Push/PR)

Every push and pull request triggers validation:
- JSON syntax checking
- Schema validation
- Duplicate ID detection
- Manifest consistency checks

### Auto-Update (On Release)

When you create a release with format `plugin-id-vX.Y.Z`:
1. Extracts plugin info from release tag
2. Updates registry.json automatically  
3. Validates changes
4. Commits and pushes updates

## 📊 Registry API

The registry provides a simple JSON API:

### Get All Plugins
```
GET https://raw.githubusercontent.com/whttlr/plugin-registry/main/registry.json
```

### Get Plugin Manifest
```
GET https://raw.githubusercontent.com/whttlr/plugin-registry/main/plugins/{plugin-id}/plugin.json
```

### Response Format
```json
{
  "version": "1.0.0",
  "plugins": [...],
  "categories": [...],
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

## 🔒 Security & Guidelines

### Security Measures
- All plugins run in sandboxed environments
- Permission-based access control
- Signature verification for plugin packages
- Content security policy enforcement

### Quality Guidelines  
- Comprehensive testing required
- Clear documentation and examples
- Semantic versioning compliance
- Regular security updates
- Performance benchmarking

### Submission Process
1. **Development**: Create plugin following API guidelines
2. **Testing**: Thoroughly test plugin functionality
3. **Documentation**: Provide clear usage instructions
4. **Metadata**: Submit plugin.json to this registry
5. **Review**: Community review and validation
6. **Release**: Automated distribution via GitHub releases

## 🔧 Plugin Development Workflow

### 1. Create Plugin from Template
```bash
# Generate plugin scaffold
node scripts/create-plugin.js my-plugin "My Plugin" dashboard

# Navigate to plugin directory
cd my-plugin

# Install dependencies
npm install
```

### 2. Develop Your Plugin
```bash
# Start development server
npm run dev

# Make your changes in src/
# Test in your CNC application
```

### 3. Build and Package
```bash
# Build for production
npm run build

# Package for distribution
npm run package

# This creates: my-plugin-v1.0.0.zip
```

### 4. Test Package
1. Install the ZIP file in your CNC application
2. Verify functionality
3. Test different screen sizes and placements

### 5. Publish to Registry
```bash
# Create GitHub release with the ZIP file
# Tag format: my-plugin-v1.0.0

# Add to registry (automatic via GitHub Actions)
# Or manually:
node scripts/add-plugin.js my-plugin
```

## 🤝 Contributing

1. **Fork** this repository
2. **Create** a branch for your plugin: `git checkout -b add-my-plugin`
3. **Add** your plugin metadata to `plugins/your-plugin-id/`
4. **Validate** using `node scripts/validate-registry.js`
5. **Commit** changes: `git commit -m "Add my-plugin v1.0.0"`
6. **Push** to your fork: `git push origin add-my-plugin`
7. **Submit** a pull request

## 📞 Support

- **Documentation**: [Plugin Development Guide](https://docs.example.com/plugins)
- **Issues**: [GitHub Issues](https://github.com/whttlr/plugin-registry/issues)
- **Discussions**: [GitHub Discussions](https://github.com/whttlr/plugin-registry/discussions)
- **Community**: [Discord Server](https://discord.gg/cnc-controls)

## 📄 License

This registry is licensed under the MIT License. Individual plugins may have their own licenses as specified in their manifests.

---

**Registry Stats**: ![Plugins](https://img.shields.io/badge/plugins-3-blue) ![Categories](https://img.shields.io/badge/categories-6-green) ![Last Updated](https://img.shields.io/badge/updated-2024--01--15-orange)