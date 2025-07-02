# Plugin Publishing Guide

This guide explains how to publish your plugins to the CNC Plugin Registry.

## Publishing Methods

### Method 1: Automated Publishing (Recommended)

The fastest way to publish plugins using GitHub Actions automation.

#### Step 1: Prepare Your Plugin

```bash
# Ensure your plugin is ready
npm run build
npm run test
npm run lint

# Create distribution package
npm run package
```

#### Step 2: Validate Plugin Manifest

Ensure your `package.json` contains all required fields:

```json
{
  "name": "my-plugin",
  "version": "1.0.0",
  "description": "Clear description of plugin functionality",
  "author": "Your Name <email@example.com>",
  "license": "MIT",
  "main": "dist/index.js",
  "cncPlugin": {
    "apiVersion": "1.0.0",
    "category": "monitoring",
    "displayName": "My Plugin",
    "placement": "dashboard",
    "permissions": ["machine.read"]
  }
}
```

#### Step 3: Create GitHub Release

1. **Tag your release** with the format `{plugin-name}-v{version}`:
   ```bash
   git tag my-plugin-v1.0.0
   git push origin my-plugin-v1.0.0
   ```

2. **Create GitHub Release**:
   - Go to your repository's releases page
   - Click "Create a new release"
   - Use tag `my-plugin-v1.0.0`
   - Upload your plugin ZIP file as an asset
   - Add release notes

3. **Automatic Registry Update**:
   - GitHub Actions will automatically detect your release
   - Plugin will be added to the registry within minutes
   - You'll receive a notification when complete

### Method 2: Manual Registry Submission

For more control over the submission process.

#### Step 1: Fork the Registry Repository

```bash
git clone https://github.com/whttlr/plugin-registry.git
cd plugin-registry
```

#### Step 2: Add Plugin Manifest

Create `plugins/{your-plugin-id}/plugin.json`:

```json
{
  "id": "my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "Detailed description of what your plugin does",
  "author": "Your Name",
  "license": "MIT",
  "homepage": "https://github.com/username/my-plugin",
  "repository": {
    "type": "git",
    "url": "https://github.com/username/my-plugin.git"
  },
  "keywords": ["monitoring", "dashboard", "status"],
  "category": "monitoring",
  "placement": "dashboard",
  "screen": "main",
  "size": {
    "width": 400,
    "height": 300
  },
  "priority": 100,
  "autoStart": false,
  "permissions": ["machine.read", "status.read"],
  "compatibility": {
    "minAppVersion": "1.0.0",
    "maxAppVersion": "2.0.0"
  },
  "dependencies": {
    "react": "^18.0.0",
    "antd": "^5.0.0"
  },
  "screenshots": [
    "https://raw.githubusercontent.com/username/my-plugin/main/screenshots/dashboard.png"
  ],
  "changelog": "https://raw.githubusercontent.com/username/my-plugin/main/CHANGELOG.md"
}
```

#### Step 3: Validate and Submit

```bash
# Validate your plugin manifest
npm run validate

# Create pull request
git add plugins/my-plugin/plugin.json
git commit -m "Add my-plugin v1.0.0"
git push origin main
```

#### Step 4: Create Plugin Release

After your PR is approved:

1. Create a GitHub release in your plugin repository
2. Use tag format: `my-plugin-v1.0.0`
3. Upload your built plugin as a ZIP file
4. The registry will automatically update

## Release Requirements

### Version Format
- Must follow semantic versioning: `major.minor.patch`
- Examples: `1.0.0`, `2.1.3`, `0.5.0-beta.1`

### Release Tag Format
- Format: `{plugin-id}-v{version}`
- Examples: `machine-monitor-v1.0.0`, `gcode-viewer-v2.1.0`

### ZIP File Requirements
```
my-plugin.zip
├── package.json          # Plugin manifest
├── dist/                 # Built plugin files
│   ├── index.js         # Main entry point
│   ├── index.css        # Styles (if any)
│   └── assets/          # Static assets
├── README.md            # Plugin documentation
└── CHANGELOG.md         # Version history
```

## Pre-Publishing Checklist

### Code Quality
- [ ] All tests pass (`npm test`)
- [ ] No linting errors (`npm run lint`)
- [ ] TypeScript compiles without errors
- [ ] No console errors in development

### Plugin Manifest
- [ ] All required fields completed
- [ ] Version follows semantic versioning
- [ ] Description is clear and helpful (10+ characters)
- [ ] Permissions are minimal and documented
- [ ] Category is appropriate
- [ ] UI placement is correct

### Documentation
- [ ] README.md with installation/usage instructions
- [ ] CHANGELOG.md with version history
- [ ] Code comments for complex functionality
- [ ] Screenshots if UI-heavy

### Testing
- [ ] Plugin loads without errors
- [ ] All features work as expected
- [ ] Compatible with target app versions
- [ ] Handles edge cases gracefully

### Build
- [ ] Production build completes successfully
- [ ] Bundle size is reasonable (<1MB recommended)
- [ ] All dependencies included
- [ ] No development dependencies in production build

## Publishing Best Practices

### Versioning Strategy
```
1.0.0 - Initial stable release
1.1.0 - New features, backward compatible
1.0.1 - Bug fixes only
2.0.0 - Breaking changes
```

### Release Notes Template
```markdown
## Version 1.1.0

### New Features
- Added real-time status updates
- New configuration options for refresh rate

### Bug Fixes
- Fixed memory leak in status polling
- Corrected unit conversion calculations

### Dependencies
- Updated React to 18.2.0
- Added lodash for utility functions

### Breaking Changes
None

### Migration Guide
No migration needed for this version.
```

### Security Considerations
- Only request necessary permissions
- Validate all user inputs
- Use HTTPS URLs for external resources
- Don't include sensitive data in plugin files
- Test for XSS vulnerabilities

### Performance Optimization
- Minimize bundle size
- Use lazy loading for heavy components
- Implement proper cleanup in useEffect
- Avoid unnecessary re-renders
- Cache expensive calculations

## Troubleshooting

### Common Issues

#### "Plugin manifest validation failed"
- Check JSON syntax with a validator
- Ensure all required fields are present
- Verify field types match schema

#### "Release tag format incorrect"
- Must be `{plugin-id}-v{version}`
- Plugin ID must match manifest
- Version must be semantic version

#### "Plugin ZIP file invalid"
- Must contain package.json at root
- Built files should be in dist/ directory
- Check file permissions

#### "Registry update failed"
- Verify GitHub release was created properly
- Check that ZIP file was uploaded as asset
- Ensure tag follows naming convention

### Getting Help

1. **Check Documentation**: Review this guide and API docs
2. **Validate Locally**: Use `npm run validate` before submitting
3. **Community Support**: Join the plugin developers community
4. **Issue Tracker**: Report bugs on the registry repository

## Post-Publishing

### Monitoring
- Check plugin appears in registry
- Test installation in application
- Monitor for user feedback
- Track download statistics

### Updates
- Follow semantic versioning for updates
- Maintain backward compatibility when possible
- Provide migration guides for breaking changes
- Keep changelog up to date

### Community
- Respond to user issues and feedback
- Consider feature requests
- Share plugin in community forums
- Help other developers

This publishing system ensures quality, security, and discoverability of plugins while maintaining a smooth developer experience.