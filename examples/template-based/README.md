# Template-Based Plugins

## Overview

Template-based plugins are a **safer, simpler alternative** to code-based (iframe) plugins. Instead of writing JavaScript code, you provide JSON configuration that uses pre-built UI templates.

## 🔒 Security Comparison

### Template-Based Plugins (Recommended for Simple Use Cases)

**✅ Advantages:**
- **No code execution** - Completely safe, no XSS vulnerabilities
- **No sandboxing needed** - No iframe overhead
- **Instant loading** - No JavaScript parsing or execution
- **Type-safe** - Validated against JSON schema
- **Cannot access parent window** - Isolated by design
- **Easier to review** - Just JSON configuration

**❌ Limitations:**
- Limited to predefined templates
- Cannot implement custom interactions
- No dynamic data fetching
- No complex state management

### Code-Based Plugins (iframe)

**✅ Advantages:**
- Full control over UI rendering
- Can implement complex interactions
- Dynamic data fetching
- Custom state management
- Access to full plugin API

**❌ Security Considerations:**
- Executes JavaScript code (potential XSS)
- Requires iframe sandboxing
- Needs careful permission management
- More complex to audit

## 📋 When to Use Each Approach

### Use Template-Based Plugins When:

- ✅ Displaying static or semi-static data
- ✅ Creating simple dashboards or monitors
- ✅ Building quick action buttons
- ✅ Showing lists or status information
- ✅ You want maximum security
- ✅ You want fast development

### Use Code-Based Plugins When:

- ✅ Need complex user interactions
- ✅ Fetching data from external APIs
- ✅ Implementing custom visualizations
- ✅ Managing complex state
- ✅ Building full applications
- ✅ Need access to plugin APIs

## 🎨 Available Templates

### 1. StatusCard
**Use Case:** Connection status, system health, resource monitoring

```json
{
  "card": {
    "template": "StatusCard",
    "templateData": {
      "title": "Connection Status",
      "status": "connected",
      "info": [
        { "label": "Port", "value": "/dev/ttyUSB0" },
        { "label": "Baud", "value": "115200" }
      ],
      "actions": [
        { "label": "Disconnect", "event": "disconnect" }
      ]
    }
  }
}
```

### 2. DataDisplayCard
**Use Case:** Metrics, statistics, analytics, trends

```json
{
  "card": {
    "template": "DataDisplayCard",
    "templateData": {
      "title": "Today's Stats",
      "metrics": [
        {
          "label": "Jobs",
          "value": "8",
          "trend": "up",
          "change": "+2"
        }
      ]
    }
  }
}
```

### 3. ListCard
**Use Case:** Job history, tool library, file lists

```json
{
  "card": {
    "template": "ListCard",
    "templateData": {
      "title": "Recent Jobs",
      "items": [
        {
          "id": "1",
          "title": "part_v3.gcode",
          "badge": { "text": "completed", "variant": "success" }
        }
      ]
    }
  }
}
```

### 4. ActionCard
**Use Case:** Quick action buttons, command panels

```json
{
  "card": {
    "template": "ActionCard",
    "templateData": {
      "title": "Quick Actions",
      "layout": "grid",
      "actions": [
        { "label": "Home", "event": "machine:home" },
        { "label": "Stop", "event": "machine:stop", "variant": "destructive" }
      ]
    }
  }
}
```

### 5. UploadCard
**Use Case:** File upload widgets

```json
{
  "card": {
    "template": "UploadCard",
    "templateData": {
      "title": "Upload Files",
      "accept": ".gcode,.nc",
      "maxSize": 104857600
    }
  }
}
```

## 📦 Example Plugins

This directory contains 5 complete template-based plugin examples:

1. **system-monitor/** - StatusCard showing CPU/Memory/Disk
2. **productivity-stats/** - DataDisplayCard with metrics
3. **quick-actions/** - ActionCard with CNC commands
4. **tool-library/** - ListCard showing tool collection
5. **quick-upload/** - UploadCard for file uploads

## 🚀 Creating a Template-Based Plugin

### Step 1: Create Directory

```bash
mkdir my-plugin
cd my-plugin
```

### Step 2: Create manifest.json

```json
{
  "id": "com.yourname.my-plugin",
  "name": "My Plugin",
  "version": "1.0.0",
  "description": "My awesome template-based plugin",
  "author": "Your Name",
  "apiVersion": "1.0.0",
  "mainView": "dashboard",
  "permissions": ["state", "events", "logger"],
  "enabled": true,
  "card": {
    "template": "StatusCard",
    "templateData": {
      "title": "My Status",
      "status": "connected"
    },
    "cols": 6,
    "priority": 200
  }
}
```

### Step 3: Install

**That's it!** No JavaScript code needed. Just copy the folder to your plugins directory.

## 🔄 Hybrid Approach

You can start with a template-based plugin and upgrade to code-based later if needed:

1. **Phase 1:** Use template for simple display (safe, fast)
2. **Phase 2:** Add `entryPoint` when you need interactivity
3. **Phase 3:** Use plugin API for complex features

## 📊 Comparison Table

| Feature | Template-Based | Code-Based |
|---------|---------------|------------|
| **Security** | ⭐⭐⭐⭐⭐ Maximum | ⭐⭐⭐ Good (sandboxed) |
| **Simplicity** | ⭐⭐⭐⭐⭐ JSON only | ⭐⭐ Requires JS knowledge |
| **Performance** | ⭐⭐⭐⭐⭐ Instant | ⭐⭐⭐⭐ Fast (iframe overhead) |
| **Flexibility** | ⭐⭐ Limited to templates | ⭐⭐⭐⭐⭐ Unlimited |
| **Maintenance** | ⭐⭐⭐⭐⭐ Easy | ⭐⭐⭐ Moderate |
| **Type Safety** | ⭐⭐⭐⭐⭐ Schema validated | ⭐⭐⭐ Runtime only |

## 🎯 Recommendation

**Start with template-based plugins** for:
- Dashboard widgets
- Status displays
- Simple lists
- Quick actions

**Upgrade to code-based plugins** only when you need:
- External API integration
- Complex user interactions
- Custom visualizations
- Advanced state management

## 📚 Additional Resources

- [Plugin Types Documentation](../../../plugin-types/README.md)
- [Dashboard Grid System](../../docs/DASHBOARD_GRID.md)
- [Plugin Security Guide](../../docs/SECURITY.md)
- [Template Type Definitions](../../../plugin-types/src/dashboard/CardTemplates.ts)

## 💡 Tips

1. **Test with real data** - Replace example data with realistic values
2. **Use appropriate icons** - Choose icons that match your functionality
3. **Configure priorities** - Use priority to control card ordering
4. **Responsive design** - Configure responsive breakpoints for mobile
5. **Event naming** - Use clear, descriptive event names (e.g., `machine:home`, not `action1`)

## ⚠️ Important Notes

- Template-based plugins **cannot execute code**
- They rely on the host application to handle events
- Data in `templateData` is **static** - it won't update automatically
- For dynamic data, you'll need a code-based plugin that can fetch updates

## 🔮 Future Enhancements

Planned features for template-based plugins:

- [ ] Data binding to application state
- [ ] Computed properties
- [ ] Conditional visibility
- [ ] More template types
- [ ] Template composition (nested templates)
