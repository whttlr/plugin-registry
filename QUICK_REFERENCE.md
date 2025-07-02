# Plugin Quick Reference

## Screen Placement Options

### Dashboard Plugin
```json
{
  "cncPlugin": {
    "ui": {
      "placement": "dashboard",
      "screen": "main",
      "size": { "width": 400, "height": 300 },
      "priority": 100
    }
  }
}
```
- **Use for**: Status cards, quick controls, monitoring widgets
- **Size**: 200-800px width, 150-600px height
- **Grid**: Responsive grid layout

### Standalone Plugin
```json
{
  "cncPlugin": {
    "ui": {
      "placement": "standalone",
      "screen": "new",
      "menuTitle": "My Tool",
      "menuIcon": "ToolOutlined",
      "routePath": "/my-tool"
    }
  }
}
```
- **Use for**: Full applications, file managers, configuration tools
- **Navigation**: Adds menu item to sidebar
- **Routing**: Custom URL path

### Modal Plugin
```json
{
  "cncPlugin": {
    "ui": {
      "placement": "modal",
      "size": { "width": 600, "height": "auto" }
    }
  }
}
```
- **Use for**: Settings dialogs, confirmations, forms
- **Trigger**: Activated by user action or other plugins
- **Size**: Auto-sizing or fixed dimensions

### Sidebar Plugin
```json
{
  "cncPlugin": {
    "ui": {
      "placement": "sidebar",
      "size": { "width": 300, "height": "auto" }
    }
  }
}
```
- **Use for**: Tool palettes, quick settings, shortcuts
- **Collapsible**: Can be minimized by user
- **Position**: Left or right side of screen

## Available Screens

| Screen | Purpose | Plugin Types |
|--------|---------|-------------|
| `main` | Main dashboard | Dashboard, Modal |
| `controls` | Jog controls | Dashboard, Sidebar |
| `machine` | Machine status | Dashboard, Modal |
| `workspace` | File management | Dashboard, Standalone |
| `settings` | Application settings | Modal, Standalone |
| `new` | Dedicated screen | Standalone only |

## Permissions Reference

| Permission | Access Level | Use Cases |
|------------|-------------|-----------|
| `machine.read` | Read machine status, position | Status displays, monitoring |
| `machine.write` | Send G-code commands | Control panels, automation |
| `machine.control` | Full machine control | Advanced control interfaces |
| `status.read` | System status information | Health monitoring, diagnostics |
| `files.read` | Read G-code files | File viewers, analyzers |
| `files.write` | Create/modify files | File editors, generators |
| `config.read` | Application configuration | Settings displays |
| `config.write` | Modify configuration | Settings editors |
| `network.access` | External API calls | Cloud sync, remote monitoring |

## Publishing Checklist

### Pre-Publishing
- [ ] Plugin builds without errors
- [ ] All tests pass
- [ ] Manifest is valid JSON
- [ ] Required fields completed
- [ ] Permissions documented
- [ ] Version follows semver

### GitHub Release
- [ ] Tag format: `{plugin-id}-v{version}`
- [ ] ZIP file attached as asset
- [ ] Release notes included
- [ ] Changelog updated

### Registry Submission
- [ ] Fork plugin-registry repo
- [ ] Add `plugins/{plugin-id}/plugin.json`
- [ ] Submit pull request
- [ ] Wait for approval
- [ ] Create GitHub release

## Common Configuration Patterns

### Basic Dashboard Widget
```typescript
const MyWidget: React.FC<PluginProps> = ({ api }) => {
  const jogSpeed = api.config.get('jog.speed.xy');
  const units = api.config.get('machine.units');
  
  return (
    <div className="plugin-card">
      <h4>Jog Speed</h4>
      <p>{jogSpeed} {units}/min</p>
    </div>
  );
};
```

### Configuration Section Access
```typescript
// Get entire configuration sections
const machineConfig = api.config.getSection('machine');
const jogSettings = api.config.getSection('jog');
const uiSettings = api.config.getSection('ui');

// Access nested values
const homeX = api.config.get('machine.home.x');
const theme = api.config.get('ui.theme');
```

### Error Handling
```typescript
const MyPlugin: React.FC<PluginProps> = ({ api }) => {
  const [error, setError] = useState<string | null>(null);
  
  const safeConfigGet = (path: string, fallback: any) => {
    try {
      return api.config.getWithFallback(path, fallback);
    } catch (err) {
      setError(`Configuration error: ${err.message}`);
      return fallback;
    }
  };
  
  if (error) {
    return <div className="plugin-error">{error}</div>;
  }
  
  // Normal plugin render
};
```

## Plugin Categories

| Category | Description | Examples |
|----------|-------------|----------|
| `monitoring` | Status and diagnostics | Machine monitor, connection status |
| `control` | Machine operation | Jog controls, spindle control |
| `visualization` | 3D/2D displays | G-code viewer, toolpath preview |
| `utility` | Helper tools | Calculator, unit converter |
| `automation` | Automated workflows | Auto-leveling, tool changing |
| `management` | Asset management | Tool library, material database |

## Size Guidelines

### Dashboard Cards
- **Small**: 400x300px (status displays)
- **Medium**: 600x400px (controls, forms)
- **Large**: 800x600px (complex widgets)

### Standalone Apps
- **Full screen**: Use available space
- **Responsive**: Adapt to window size
- **Mobile friendly**: Consider tablet use

### Modals
- **Small**: 400x300px (confirmations)
- **Medium**: 600x400px (forms, settings)
- **Large**: 800x600px (complex dialogs)
- **Auto**: Let content determine size