# Claude Context for CNC Plugin Registry

## Project Overview
A centralized registry system for managing, distributing, and versioning CNC application plugins. Built with Node.js/TypeScript, featuring automated GitHub Actions workflows, comprehensive validation, and a scalable architecture for plugin discovery and installation.

## Key Commands
- `npm run validate` - Validate all plugin manifests and registry
- `npm run add-plugin` - Add new plugin to registry
- `npm run create-plugin` - Generate plugin from template
- `npm run package-plugin` - Build and package plugin for distribution
- `npm run update-plugin` - Update existing plugin version
- `npm run test-compatibility` - Test type compatibility with electron-app
- `npm run test` - Run full test suite (validation + compatibility)
- `npm run lint` - Run ESLint code analysis
- `npm run clean` - Clean build artifacts

## Project Structure
**NOTE**: If any files are created, deleted, or moved, please update this architecture section to reflect the current project structure.

```
plugin-registry/
├── 📁 src/                          # Main source code (TypeScript)
│   ├── 📁 core/                     # Core registry functionality
│   │   ├── 📁 validation/           # Schema validation logic
│   │   │   ├── __tests__/
│   │   │   ├── __mocks__/
│   │   │   ├── README.md
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── SchemaValidator.ts
│   │   │
│   │   ├── 📁 registry/             # Registry management
│   │   │   ├── __tests__/
│   │   │   ├── __mocks__/
│   │   │   ├── README.md
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── RegistryManager.ts
│   │   │
│   │   └── 📁 plugin/               # Plugin metadata handling
│   │       ├── __tests__/
│   │       ├── __mocks__/
│   │       ├── README.md
│   │       ├── config.ts
│   │       ├── index.ts
│   │       └── PluginMetadata.ts
│   │
│   ├── 📁 services/                 # Cross-module services
│   │   ├── 📁 github/               # GitHub API integration
│   │   │   ├── __tests__/
│   │   │   ├── __mocks__/
│   │   │   ├── README.md
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── GitHubService.ts
│   │   │
│   │   ├── 📁 storage/              # File system operations
│   │   │   ├── __tests__/
│   │   │   ├── __mocks__/
│   │   │   ├── README.md
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── StorageService.ts
│   │   │
│   │   └── 📁 packaging/            # Plugin packaging service
│   │       ├── __tests__/
│   │       ├── __mocks__/
│   │       ├── README.md
│   │       ├── config.ts
│   │       ├── index.ts
│   │       └── PackagingService.ts
│   │
│   ├── 📁 scripts/                  # CLI scripts
│   │   ├── 📁 commands/             # Individual command modules
│   │   │   ├── 📁 add/
│   │   │   │   ├── __tests__/
│   │   │   │   ├── README.md
│   │   │   │   ├── index.ts
│   │   │   │   └── AddPlugin.ts
│   │   │   │
│   │   │   ├── 📁 create/
│   │   │   │   ├── __tests__/
│   │   │   │   ├── README.md
│   │   │   │   ├── index.ts
│   │   │   │   └── CreatePlugin.ts
│   │   │   │
│   │   │   ├── 📁 package/
│   │   │   │   ├── __tests__/
│   │   │   │   ├── README.md
│   │   │   │   ├── index.ts
│   │   │   │   └── PackagePlugin.ts
│   │   │   │
│   │   │   ├── 📁 update/
│   │   │   │   ├── __tests__/
│   │   │   │   ├── README.md
│   │   │   │   ├── index.ts
│   │   │   │   └── UpdatePlugin.ts
│   │   │   │
│   │   │   └── 📁 validate/
│   │   │       ├── __tests__/
│   │   │       ├── README.md
│   │   │       ├── index.ts
│   │   │       └── ValidateRegistry.ts
│   │   │
│   │   └── 📁 shared/               # Shared script utilities
│   │       ├── __tests__/
│   │       ├── README.md
│   │       ├── config.ts
│   │       ├── index.ts
│   │       └── ScriptUtils.ts
│   │
│   ├── 📁 templates/                # Plugin templates
│   │   ├── 📁 dashboard/
│   │   │   ├── __tests__/
│   │   │   ├── README.md
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── template.json
│   │   │
│   │   ├── 📁 standalone/
│   │   │   ├── __tests__/
│   │   │   ├── README.md
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── template.json
│   │   │
│   │   ├── 📁 modal/
│   │   │   ├── __tests__/
│   │   │   ├── README.md
│   │   │   ├── config.ts
│   │   │   ├── index.ts
│   │   │   └── template.json
│   │   │
│   │   └── 📁 sidebar/
│   │       ├── __tests__/
│   │       ├── README.md
│   │       ├── config.ts
│   │       ├── index.ts
│   │       └── template.json
│   │
│   └── 📁 utils/                    # Pure utility functions
│       ├── 📁 validation/
│       │   ├── __tests__/
│       │   ├── index.ts
│       │   └── validators.ts
│       │
│       ├── 📁 formatting/
│       │   ├── __tests__/
│       │   ├── index.ts
│       │   └── formatters.ts
│       │
│       └── 📁 versioning/
│           ├── __tests__/
│           ├── index.ts
│           └── semver.ts
│
├── 📁 plugins/                      # Plugin metadata storage
│   ├── machine-monitor/
│   ├── gcode-snippets/
│   ├── quick-settings/
│   └── tool-library/
│
├── 📁 schemas/                      # JSON validation schemas
│   ├── plugin-schema.json
│   └── registry-schema.json
│
├── 📁 scripts/                      # Legacy JavaScript scripts
│   ├── create-plugin.js
│   ├── add-plugin.js
│   ├── package-plugin.js
│   ├── update-plugin.js
│   └── validate-registry.js
│
├── 📁 .github/workflows/            # CI/CD automation
│   ├── validate-registry.yml
│   └── update-registry.yml
│
├── registry.json                    # Main registry index
└── package.json                     # Project configuration
```

## Important Notes
- This is a TypeScript-based plugin registry with automated workflows
- Features comprehensive validation using JSON schemas
- Automated GitHub Actions for registry updates on releases
- Supports multiple plugin types and placement configurations
- All new development should follow the self-contained module architecture

## Registry System Architecture

### Plugin Types & Categories
- **Monitoring**: Status displays and diagnostics
- **Control**: Machine control and automation
- **Visualization**: 3D/2D rendering tools
- **Utility**: General helper tools
- **Automation**: Automated workflows
- **Management**: Asset and configuration management

### Plugin Placement Types
- **Dashboard**: Small cards (400x300px default)
- **Standalone**: Full-screen applications
- **Modal**: Popup dialogs
- **Sidebar**: Compact side panels

### Permission Model
```typescript
type Permission = 
  | 'machine.read'      // Read machine status
  | 'machine.write'     // Send commands
  | 'machine.control'   // Full control
  | 'status.read'       // System status
  | 'files.read'        // File access
  | 'files.write'       // File modification
  | 'config.read'       // Configuration read
  | 'config.write'      // Configuration write
  | 'network.access';   // External requests
```

## Strictly Enforced Architecture

### Self-Contained Module Structure
Each functional domain is organized as a self-contained module with all related files in a dedicated folder.

### Module Structure Elements
Each module folder must contain:
- `__tests__/`: All test files using Jest/Vitest
- `__mocks__/`: Mock data and service mocks for testing
- `README.md`: Documentation on module purpose, usage, and API
- `config.ts`: Module-specific configuration (optional)
- `index.ts`: Public API exports
- `ModuleName.ts`: Main implementation

### Self-Containment Rules
- **Everything related to a module stays in one location**
- **Clear public APIs**: Each module exports a clean API via `index.ts`
- **Configuration separation**: Module-specific config in `config.ts`
- **Dependency injection**: Modules receive dependencies rather than creating them
- **No cross-module imports**: Modules only import from `services/` or `utils/`

### Test-Driven Development (TDD)
- **Write tests first**: Define expected behavior before implementation
- **Test co-location**: Tests live with the code they test
- **Mock isolation**: Use `__mocks__/` for test doubles
- **Coverage requirements**: Minimum 80% code coverage
- **Integration tests**: Test module interactions in `services/`

### Configuration Management
```typescript
// config.ts in each module
export interface ModuleConfig {
  // Module-specific configuration
}

export const defaultConfig: ModuleConfig = {
  // Default values
};

// No hardcoded values in implementation files
```

### Component/Feature/Config Isolation
- **Components**: UI elements in dedicated folders
- **Features**: Business logic in `core/` modules
- **Configuration**: Centralized in `config.ts` files
- **No mixing**: Clear separation between layers

## Development Guidelines

### Module Development
1. **Create module structure**:
   ```
   src/core/newfeature/
   ├── __tests__/
   │   └── NewFeature.test.ts
   ├── __mocks__/
   │   └── mockData.ts
   ├── README.md
   ├── config.ts
   ├── index.ts
   └── NewFeature.ts
   ```

2. **Write tests first** (TDD):
   ```typescript
   // __tests__/NewFeature.test.ts
   describe('NewFeature', () => {
     it('should perform expected behavior', () => {
       // Test implementation
     });
   });
   ```

3. **Define public API**:
   ```typescript
   // index.ts
   export { NewFeature } from './NewFeature';
   export type { NewFeatureConfig } from './config';
   ```

4. **Implement feature**:
   ```typescript
   // NewFeature.ts
   import { NewFeatureConfig, defaultConfig } from './config';
   
   export class NewFeature {
     constructor(private config: NewFeatureConfig = defaultConfig) {}
   }
   ```

### Script Development
- Follow command pattern in `scripts/commands/`
- Use shared utilities from `scripts/shared/`
- Include comprehensive error handling
- Add CLI help documentation

### Service Development
- Services provide cross-module functionality
- Use dependency injection for testability
- Include retry logic for external APIs
- Implement proper error boundaries

## Architecture Enforcement
- **File size limit**: 500 lines maximum per file
- **Single responsibility**: Each file/module has one clear purpose
- **Import discipline**: Clear dependency boundaries
- **Type safety**: Full TypeScript with strict mode
- **Async handling**: Proper Promise/async-await patterns

## CI/CD Workflows

### Validation Workflow
- Runs on every push and PR
- Validates all plugin manifests
- Checks registry.json integrity
- Ensures schema compliance

### Update Workflow
- Triggered by GitHub releases
- Automatically updates registry
- Validates download URLs
- Creates commit with changes

## Migration Path
Current JavaScript scripts in `/scripts` are being migrated to TypeScript modules in `/src/scripts/commands/`. New development should use the TypeScript structure.

## Recent Updates
- Established self-contained module architecture
- Added comprehensive documentation system
- Created plugin development guide
- Implemented quick reference guide
- Added publishing workflow documentation
- **NEW**: Defined strict TDD and isolation principles for all development