---
slug: shared-types-migration
title: Plugin Registry Now Uses Shared TypeScript Types
authors: [whttlr]
tags: [types, typescript, migration, compatibility]
---

# Plugin Registry Migration to Shared Types

We're excited to announce that the CNC Plugin Registry has completed its migration to shared TypeScript types through the new `@whttlr/plugin-types` package!

<!-- truncate -->

## What Changed

The plugin registry and electron application now use a centralized type package to ensure consistent plugin interfaces across both systems. This eliminates API drift and provides better development experience for plugin creators.

### Key Benefits

- **Type Safety**: Plugin developers get full TypeScript IntelliSense
- **API Consistency**: Registry and electron app share identical interfaces
- **Zero Breaking Changes**: Existing plugins continue to work unchanged
- **Better DX**: Shared types available via npm: `npm install @whttlr/plugin-types`

## For Plugin Developers

Your existing plugins continue to work without changes. New plugins automatically get shared types when using `npm run create-plugin`.

### Using Shared Types

```typescript
import { PluginAPI, CompleteConfig } from '@whttlr/plugin-types';

interface MyPluginProps {
  api: PluginAPI;
}

export const MyPlugin: React.FC<MyPluginProps> = ({ api }) => {
  const machineConfig = api.config.getSection('machine');
  return <div>Status: {api.machine.getStatus().state}</div>;
};
```

## Technical Details

- **Package**: `@whttlr/plugin-types` v1.0.1
- **Compatibility**: Full backward compatibility maintained
- **Testing**: Automated compatibility tests ensure synchronization
- **CI/CD**: Continuous validation of type consistency

## What's Next

This foundation enables exciting future enhancements:
- Real-time plugin API validation
- Enhanced development tooling
- Cross-system compatibility checks

The migration demonstrates our commitment to a robust, developer-friendly plugin ecosystem.

---

Questions? Join the discussion in our [GitHub Discussions](https://github.com/whttlr/plugin-registry/discussions).