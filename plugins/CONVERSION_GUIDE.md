# Plugin Conversion Guide: Template-Based vs Iframe-Based

## Overview

This document explains which plugins can be converted to template-based (safer, code-free) format and which should remain iframe-based.

## Conversion Analysis

### ✅ Converted to Template-Based

#### 1. machine-monitor (v1.0.0 → v2.0.0)

**Previous:** Iframe-based plugin with JavaScript execution
**Current:** Template-based using StatusCard

**Why it works:**
- Displays static machine status information
- Shows position, speed, and connectivity
- Simple button actions (refresh, details)
- No complex interactions or external API calls
- Perfect fit for StatusCard template

**Changes made:**
- ✅ Removed `entryPoint: "plugin.js"`
- ✅ Removed `dependencies` (no React/Ant Design needed)
- ✅ Added `card.template: "StatusCard"`
- ✅ Added `card.templateData` with status info
- ✅ Reduced permissions (no longer needs machine.read, status.read)
- ✅ Version bump to 2.0.0 (breaking change)
- ✅ Priority changed from 1 to 500 (extension range)

**Security improvements:**
- 🔒 No JavaScript execution
- 🔒 No iframe sandbox needed
- 🔒 Fewer permissions required
- 🔒 Zero XSS risk

**Benefits:**
- ⚡ Instant loading (no code parsing)
- 📦 Smaller bundle (no dependencies)
- 🛡️ Maximum security
- ✅ Easier to maintain

---

### ❌ Cannot Convert to Template-Based

#### 2. quick-settings

**Why it can't be converted:**
- Uses `mainView: "modal"` (not dashboard)
- Template-based plugins only work for dashboard cards
- Needs interactive settings controls
- Requires state management for settings values

**Recommendation:** Keep as iframe-based modal plugin

---

#### 3. tool-library

**Why it can't be converted:**
- `mainView: "standalone"` (full-page application)
- Complex tool management interface
- File read/write operations
- Configuration management
- Too complex for simple templates

**Recommendation:** Keep as iframe-based standalone plugin

---

#### 4. gcode-snippets

**Why it can't be converted:**
- `mainView: "standalone"` (full-page application)
- Requires Monaco code editor
- Complex snippet library management
- File operations and G-code insertion
- Machine write permissions needed

**Recommendation:** Keep as iframe-based standalone plugin

---

## Conversion Decision Tree

```
Can this plugin be converted to template-based?
│
├─ Is mainView "dashboard"?
│  ├─ NO → Keep iframe-based (templates only work for dashboard cards)
│  └─ YES → Continue
│
├─ Does it need external API calls?
│  ├─ YES → Keep iframe-based
│  └─ NO → Continue
│
├─ Does it need complex user interactions?
│  ├─ YES → Keep iframe-based
│  └─ NO → Continue
│
├─ Does it need dynamic data updates?
│  ├─ YES → Keep iframe-based
│  └─ NO → Continue
│
├─ Is it just displaying status/metrics/lists/actions?
│  ├─ YES → ✅ Convert to template-based!
│  └─ NO → Keep iframe-based
```

## Template Selection Guide

### StatusCard
**Best for:**
- Connection status
- Machine status
- Health checks
- Resource monitoring

**Example:** machine-monitor (converted)

### DataDisplayCard
**Best for:**
- Metrics and statistics
- Productivity tracking
- Analytics dashboards
- Trend displays

**Could convert:**
- A "job statistics" plugin
- A "production metrics" plugin

### ListCard
**Best for:**
- Job history
- Tool listings
- File browsers
- Recent items

**Could convert:**
- A simplified "recent jobs" widget
- A "favorite tools" quick list

### ActionCard
**Best for:**
- Quick action buttons
- Common commands
- Keyboard shortcuts
- Macro triggers

**Could convert:**
- A "quick commands" dashboard widget
- A "common operations" button grid

### UploadCard
**Best for:**
- File upload widgets
- Drag-drop interfaces
- Simple file operations

**Could convert:**
- A "quick upload" widget for G-code files

## How to Convert a Plugin

### Step 1: Evaluate
Use the decision tree above to determine if conversion is appropriate.

### Step 2: Choose Template
Select the template that best fits your plugin's purpose.

### Step 3: Update plugin.json

**Remove:**
```json
{
  "entryPoint": "plugin.js",
  "dependencies": { ... },
  "size": { ... }
}
```

**Add:**
```json
{
  "card": {
    "template": "StatusCard",
    "templateData": {
      "title": "Your Plugin",
      "status": "connected",
      // ... template-specific data
    },
    "cols": 6,
    "priority": 500,
    "responsive": {
      "xs": 12,
      "md": 6
    }
  }
}
```

### Step 4: Remove Code Files
Delete `plugin.js` and any other JavaScript files.

### Step 5: Update Version
Bump major version (e.g., 1.0.0 → 2.0.0) since this is a breaking change.

### Step 6: Reduce Permissions
Template-based plugins typically only need:
```json
"permissions": ["state", "events", "logger"]
```

### Step 7: Update Description
Add "(template-based, no code execution)" to description for clarity.

## Testing Converted Plugins

1. **Install plugin** in Whttlr CNC Controls
2. **Enable plugin** in Plugins view
3. **Check dashboard** - Plugin card should appear
4. **Test interactions** - Click buttons, verify events are logged
5. **Verify security** - Confirm no JavaScript execution
6. **Test responsive** - Resize window, check mobile layout

## Rollback Plan

If conversion causes issues:

1. Revert plugin.json to previous version
2. Restore plugin.js file
3. Restore dependencies
4. Decrement version number

## Future Enhancements

Template-based plugins may gain new features:

- **Data binding** - Connect to live application state
- **Computed properties** - Dynamic values based on state
- **Conditional display** - Show/hide based on conditions
- **Event handlers** - Register callbacks in manifest
- **More templates** - Additional UI patterns

## Summary

| Plugin | MainView | Can Convert? | Reason |
|--------|----------|--------------|--------|
| machine-monitor | dashboard | ✅ YES | Simple status display, converted to StatusCard |
| quick-settings | modal | ❌ NO | Modal view, not dashboard card |
| tool-library | standalone | ❌ NO | Complex full-page app |
| gcode-snippets | standalone | ❌ NO | Complex editor interface |

**Result:** 1 out of 4 plugins successfully converted to template-based format (25% conversion rate)

## Recommendations

1. **New plugins:** Start with template-based if possible
2. **Existing plugins:** Convert dashboard plugins that display static data
3. **Complex plugins:** Keep iframe-based for flexibility
4. **Hybrid approach:** Use templates for simple widgets, iframes for complex apps

## See Also

- [Template Plugins Documentation](../../app/docs/TEMPLATE_PLUGINS.md)
- [Template Examples](../examples/template-based/README.md)
- [Plugin Security Guide](../../app/docs/PLUGIN_SECURITY.md)
