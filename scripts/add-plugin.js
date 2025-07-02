#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { validatePluginManifest } = require('./validate-registry');

/**
 * Script to add a new plugin to the registry
 * Usage: node scripts/add-plugin.js <plugin-id> [manifest-path]
 */

function addPlugin(pluginId, manifestPath = null) {
  // Default manifest path - try both registry plugins dir and standalone plugin dir
  if (!manifestPath) {
    const registryPath = path.join(__dirname, `../plugins/${pluginId}/plugin.json`);
    const standalonePath = path.join(__dirname, `../${pluginId}/plugin.json`);
    
    if (fs.existsSync(registryPath)) {
      manifestPath = registryPath;
    } else if (fs.existsSync(standalonePath)) {
      manifestPath = standalonePath;
    } else {
      manifestPath = registryPath; // Use registry path for error message
    }
  }

  // Validate inputs
  if (!pluginId || typeof pluginId !== 'string') {
    console.error('Error: Plugin ID is required');
    process.exit(1);
  }

  if (!fs.existsSync(manifestPath)) {
    console.error(`Error: Plugin manifest not found at ${manifestPath}`);
    console.error('');
    console.error('Looked in:');
    console.error(`  - Registry: ../plugins/${pluginId}/plugin.json`);
    console.error(`  - Standalone: ../${pluginId}/plugin.json`);
    console.error('');
    console.error('Make sure the plugin directory exists and contains plugin.json');
    process.exit(1);
  }

  // Read plugin manifest
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  } catch (error) {
    console.error(`Error: Failed to parse plugin manifest: ${error.message}`);
    process.exit(1);
  }

  // Validate manifest using shared validation
  const validationResult = validatePluginManifest(manifest);
  if (!validationResult.isValid) {
    console.error('Error: Plugin manifest validation failed:');
    validationResult.errors.forEach(error => {
      console.error(`  - ${error}`);
    });
    process.exit(1);
  }

  // Ensure plugin ID matches
  if (manifest.id !== pluginId) {
    console.error(`Error: Plugin ID mismatch. Expected: ${pluginId}, Found: ${manifest.id}`);
    process.exit(1);
  }

  // Read current registry
  const registryPath = path.join(__dirname, '../registry.json');
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
  } catch (error) {
    console.error(`Error: Failed to read registry: ${error.message}`);
    process.exit(1);
  }

  // Check if plugin already exists
  const existingPlugin = registry.plugins.find(p => p.id === pluginId);
  if (existingPlugin) {
    console.error(`Error: Plugin ${pluginId} already exists in registry`);
    process.exit(1);
  }

  // Create new plugin entry
  const newPlugin = {
    id: manifest.id,
    name: manifest.name,
    description: manifest.description,
    author: manifest.author,
    version: manifest.version,
    downloadUrl: `https://github.com/your-org/cnc-plugin-registry/releases/download/${pluginId}-v${manifest.version}/${pluginId}.zip`,
    manifestUrl: `https://raw.githubusercontent.com/your-org/cnc-plugin-registry/main/plugins/${pluginId}/plugin.json`,
    category: manifest.category || 'utility',
    tags: manifest.keywords || [],
    minAppVersion: manifest.compatibility?.minAppVersion || '1.0.0',
    maxAppVersion: manifest.compatibility?.maxAppVersion || '2.0.0',
    lastUpdated: new Date().toISOString()
  };

  // Copy manifest to registry plugins directory if not already there
  const registryPluginDir = path.join(__dirname, `../plugins/${pluginId}`);
  const registryManifestPath = path.join(registryPluginDir, 'plugin.json');
  
  if (!fs.existsSync(registryPluginDir)) {
    fs.mkdirSync(registryPluginDir, { recursive: true });
  }
  
  if (!fs.existsSync(registryManifestPath)) {
    fs.copyFileSync(manifestPath, registryManifestPath);
    console.log(`📋 Copied manifest to registry: plugins/${pluginId}/plugin.json`);
  }

  // Add to registry
  registry.plugins.push(newPlugin);
  registry.lastUpdated = new Date().toISOString();

  // Sort plugins alphabetically by name
  registry.plugins.sort((a, b) => a.name.localeCompare(b.name));

  // Write updated registry
  try {
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
    console.log(`✅ Successfully added plugin: ${manifest.name} (${pluginId}) v${manifest.version}`);
  } catch (error) {
    console.error(`Error: Failed to write registry: ${error.message}`);
    process.exit(1);
  }
}

// Command line execution
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node scripts/add-plugin.js <plugin-id> [manifest-path]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/add-plugin.js machine-monitor');
    console.log('  node scripts/add-plugin.js gcode-snippets /path/to/plugin.json');
    process.exit(1);
  }

  const [pluginId, manifestPath] = args;
  addPlugin(pluginId, manifestPath);
}

module.exports = { addPlugin };