# Code Signature Testing Strategy

## Overview

This document outlines the comprehensive testing strategy for maintaining API signature compatibility between the CNC Plugin Registry and Electron application using proven testing frameworks and tools.

## Testing Framework Stack

### 1. TypeScript API Surface Testing

**Tool**: `@microsoft/api-extractor`
**Purpose**: Generate and compare API surface reports

```bash
npm install @microsoft/api-extractor --save-dev
```

**Configuration** (`api-extractor.json`):
```json
{
  "projectFolder": "./",
  "mainEntryPointFilePath": "./src/plugin-api/index.d.ts",
  "apiReport": {
    "enabled": true,
    "reportFolder": "./api-reports/",
    "reportFileName": "plugin-api.api.md"
  },
  "docModel": {
    "enabled": true,
    "apiJsonFilePath": "./api-reports/plugin-api.api.json"
  }
}
```

**Usage**:
```typescript
// tests/api-compatibility.test.ts
import { ApiModel, ApiPackage } from '@microsoft/api-extractor-model';
import { compareAPIReports } from './utils/api-comparison';

describe('Plugin API Compatibility', () => {
  test('API surface matches between electron app and registry', async () => {
    const electronAPI = await ApiModel.loadFromJsonFile('./electron-app/api-reports/plugin-api.api.json');
    const registryAPI = await ApiModel.loadFromJsonFile('./plugin-registry/api-reports/plugin-api.api.json');
    
    const compatibility = compareAPIReports(electronAPI, registryAPI);
    expect(compatibility.isCompatible).toBe(true);
    expect(compatibility.breakingChanges).toHaveLength(0);
  });
});
```

### 2. Runtime Type Validation

**Tool**: `io-ts` + `fp-ts`
**Purpose**: Runtime type checking and validation

```bash
npm install io-ts fp-ts --save-dev
```

**Implementation**:
```typescript
// src/validation/plugin-codecs.ts
import * as t from 'io-ts';

export const ConfigAPICodec = t.type({
  get: t.function,
  getSection: t.function,
  getWithFallback: t.function,
  isLoaded: t.function,
  reload: t.function
});

export const PluginAPICodec = t.type({
  config: ConfigAPICodec,
  machine: t.union([t.undefined, t.unknown]), // Future extension
  events: t.union([t.undefined, t.unknown]),  // Future extension
});

export const PluginManifestCodec = t.type({
  id: t.string,
  name: t.string,
  version: t.string,
  description: t.string,
  author: t.string,
  placement: t.keyof({
    dashboard: null,
    standalone: null,
    modal: null,
    sidebar: null
  }),
  permissions: t.array(t.string)
});
```

**Testing**:
```typescript
// tests/runtime-validation.test.ts
import { isRight } from 'fp-ts/Either';
import { PluginAPICodec, PluginManifestCodec } from '../src/validation/plugin-codecs';

describe('Runtime Type Validation', () => {
  test('Plugin API implements expected interface', () => {
    const mockAPI = createMockPluginAPI();
    const validation = PluginAPICodec.decode(mockAPI);
    
    if (!isRight(validation)) {
      console.log('Validation errors:', validation.left);
    }
    
    expect(isRight(validation)).toBe(true);
  });
  
  test('Plugin manifest conforms to schema', () => {
    const sampleManifest = loadSamplePluginManifest();
    const validation = PluginManifestCodec.decode(sampleManifest);
    
    expect(isRight(validation)).toBe(true);
  });
});
```

### 3. JSON Schema Contract Testing

**Tool**: `ajv` (Another JSON Schema Validator)
**Purpose**: Validate plugin manifests and configuration schemas

```bash
npm install ajv --save-dev
```

**Implementation**:
```typescript
// src/validation/schema-validator.ts
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

export interface PluginManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  placement: 'dashboard' | 'standalone' | 'modal' | 'sidebar';
  permissions: string[];
}

const pluginManifestSchema: JSONSchemaType<PluginManifest> = {
  type: 'object',
  properties: {
    id: { type: 'string', pattern: '^[a-z0-9-]+$' },
    name: { type: 'string', minLength: 1, maxLength: 100 },
    version: { type: 'string', pattern: '^\\d+\\.\\d+\\.\\d+$' },
    description: { type: 'string', minLength: 10, maxLength: 500 },
    author: { type: 'string', minLength: 1 },
    placement: { type: 'string', enum: ['dashboard', 'standalone', 'modal', 'sidebar'] },
    permissions: { 
      type: 'array', 
      items: { type: 'string' },
      uniqueItems: true 
    }
  },
  required: ['id', 'name', 'version', 'description', 'author', 'placement', 'permissions'],
  additionalProperties: false
};

export const validatePluginManifest = ajv.compile(pluginManifestSchema);
```

**Testing**:
```typescript
// tests/schema-validation.test.ts
import { validatePluginManifest } from '../src/validation/schema-validator';

describe('Schema Validation', () => {
  test('Valid plugin manifest passes validation', () => {
    const validManifest = {
      id: 'test-plugin',
      name: 'Test Plugin',
      version: '1.0.0',
      description: 'A test plugin for validation',
      author: 'Test Author',
      placement: 'dashboard' as const,
      permissions: ['machine.read']
    };
    
    const isValid = validatePluginManifest(validManifest);
    expect(isValid).toBe(true);
  });
  
  test('Invalid plugin manifest fails validation', () => {
    const invalidManifest = {
      id: 'Invalid ID!', // Invalid characters
      name: '',          // Too short
      version: '1.0',    // Invalid format
      // Missing required fields
    };
    
    const isValid = validatePluginManifest(invalidManifest);
    expect(isValid).toBe(false);
    expect(validatePluginManifest.errors).toBeDefined();
  });
});
```

### 4. TypeScript Compiler API Testing

**Tool**: TypeScript Compiler API
**Purpose**: Deep type system analysis and compatibility checking

```typescript
// src/validation/type-checker.ts
import * as ts from 'typescript';
import * as fs from 'fs';

export class TypeCompatibilityChecker {
  private program: ts.Program;
  private checker: ts.TypeChecker;
  
  constructor(configPath: string) {
    const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
    const parsedConfig = ts.parseJsonConfigFileContent(
      configFile.config,
      ts.sys,
      process.cwd()
    );
    
    this.program = ts.createProgram(parsedConfig.fileNames, parsedConfig.options);
    this.checker = this.program.getTypeChecker();
  }
  
  compareInterfaces(sourceFile: string, interfaceName1: string, interfaceName2: string): boolean {
    const source = this.program.getSourceFile(sourceFile);
    if (!source) return false;
    
    const interface1 = this.findInterface(source, interfaceName1);
    const interface2 = this.findInterface(source, interfaceName2);
    
    if (!interface1 || !interface2) return false;
    
    const type1 = this.checker.getTypeAtLocation(interface1);
    const type2 = this.checker.getTypeAtLocation(interface2);
    
    return this.checker.isTypeAssignableTo(type2, type1);
  }
  
  private findInterface(source: ts.SourceFile, name: string): ts.InterfaceDeclaration | undefined {
    function visit(node: ts.Node): ts.InterfaceDeclaration | undefined {
      if (ts.isInterfaceDeclaration(node) && node.name.text === name) {
        return node;
      }
      return ts.forEachChild(node, visit);
    }
    return visit(source);
  }
}
```

**Testing**:
```typescript
// tests/type-compatibility.test.ts
import { TypeCompatibilityChecker } from '../src/validation/type-checker';

describe('Type Compatibility', () => {
  test('PluginAPI interfaces are compatible', () => {
    const checker = new TypeCompatibilityChecker('./tsconfig.json');
    
    const isCompatible = checker.compareInterfaces(
      './src/types/plugin-api.ts',
      'ElectronPluginAPI',
      'RegistryPluginAPI'
    );
    
    expect(isCompatible).toBe(true);
  });
});
```

### 5. Contract Testing with Pact

**Tool**: `@pact-foundation/pact`
**Purpose**: Consumer-driven contract testing

```bash
npm install @pact-foundation/pact --save-dev
```

**Implementation**:
```typescript
// tests/plugin-api.pact.test.ts
import { Pact } from '@pact-foundation/pact';
import { createPluginAPI } from '../src/plugin-api';

const provider = new Pact({
  consumer: 'PluginRegistry',
  provider: 'ElectronApp',
  port: 1234,
  log: './logs/pact.log',
  dir: './pacts',
  logLevel: 'INFO'
});

describe('Plugin API Contract', () => {
  beforeAll(() => provider.setup());
  afterAll(() => provider.finalize());
  afterEach(() => provider.verify());
  
  test('should provide configuration access', async () => {
    await provider
      .given('machine configuration exists')
      .uponReceiving('a request for machine config')
      .withRequest({
        method: 'GET',
        path: '/api/config/machine'
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: {
          jogSettings: { defaultSpeed: 1000 },
          dimensions: { width: 100, height: 100 }
        }
      });
      
    const api = createPluginAPI('http://localhost:1234');
    const config = await api.config.getSection('machine');
    
    expect(config.jogSettings.defaultSpeed).toBe(1000);
  });
});
```

## Automated Testing Pipeline

### GitHub Actions Workflow

```yaml
# .github/workflows/api-compatibility.yml
name: API Compatibility Testing

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
  repository_dispatch:
    types: [api-updated]

jobs:
  api-surface-testing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Extract API surface from electron app
        run: |
          cd ../electron-app
          npm run api:extract
          
      - name: Extract API surface from registry
        run: npm run api:extract
        
      - name: Compare API surfaces
        run: npm run test:api-compatibility
        
      - name: Upload API reports
        uses: actions/upload-artifact@v3
        with:
          name: api-reports
          path: ./api-reports/
          
  runtime-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run runtime type validation
        run: npm run test:runtime-validation
        
      - name: Run schema validation
        run: npm run test:schema-validation
        
  contract-testing:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 18
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run contract tests
        run: npm run test:contracts
        
      - name: Publish contracts
        run: npm run pact:publish
```

### Package.json Scripts

```json
{
  "scripts": {
    "api:extract": "api-extractor run --local",
    "test:api-compatibility": "jest tests/api-compatibility.test.ts",
    "test:runtime-validation": "jest tests/runtime-validation.test.ts", 
    "test:schema-validation": "jest tests/schema-validation.test.ts",
    "test:type-compatibility": "jest tests/type-compatibility.test.ts",
    "test:contracts": "jest tests/plugin-api.pact.test.ts",
    "test:all-signatures": "npm run test:api-compatibility && npm run test:runtime-validation && npm run test:schema-validation && npm run test:type-compatibility",
    "pact:publish": "pact-broker publish ./pacts --consumer-app-version $GITHUB_SHA --broker-base-url $PACT_BROKER_BASE_URL"
  }
}
```

## Integration with Development Workflow

### Pre-commit Hooks

```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run test:all-signatures
```

### CI/CD Integration

```typescript
// src/validation/ci-integration.ts
export async function validateAPICompatibility(): Promise<ValidationResult> {
  const results = await Promise.all([
    runAPIExtractionTest(),
    runRuntimeValidationTest(),
    runSchemaValidationTest(),
    runTypeCompatibilityTest()
  ]);
  
  const failures = results.filter(r => !r.success);
  
  if (failures.length > 0) {
    throw new Error(`API compatibility validation failed: ${failures.map(f => f.error).join(', ')}`);
  }
  
  return { success: true, message: 'All API compatibility tests passed' };
}
```

## Benefits of This Testing Strategy

### 1. **Comprehensive Coverage**
- **Static Analysis**: TypeScript compiler and API-extractor catch compile-time issues
- **Runtime Validation**: io-ts ensures runtime type safety
- **Schema Validation**: ajv validates JSON structures
- **Contract Testing**: Pact ensures API behavior compatibility

### 2. **Early Detection**
- **Pre-commit**: Catches issues before they enter the repository
- **CI/CD**: Automated validation on every change
- **Repository Dispatch**: Immediate validation when electron app changes

### 3. **Developer Experience**
- **Clear Error Messages**: Detailed feedback on compatibility issues
- **IDE Integration**: TypeScript errors shown during development
- **Documentation**: API reports serve as living documentation

### 4. **Maintenance**
- **Automated Updates**: API changes trigger automatic validation
- **Version Tracking**: API evolution tracked over time
- **Rollback Safety**: Incompatible changes blocked from deployment

This testing strategy ensures that plugin signatures remain perfectly synchronized between the registry and electron app, preventing runtime errors and maintaining a stable plugin ecosystem.