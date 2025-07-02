#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const semver = require('semver');

/**
 * Script to update an existing plugin in the registry
 * Usage: node scripts/update-plugin.js <plugin-id> <version> [download-url]
 */

function updatePlugin(pluginId, version, downloadUrl = null) {
  // Validate inputs
  if (!pluginId || typeof pluginId !== 'string') {
    console.error('Error: Plugin ID is required');
    process.exit(1);
  }

  if (!version || typeof version !== 'string') {
    console.error('Error: Version is required');
    process.exit(1);
  }

  // Validate version format using semver
  if (!semver.valid(version)) {
    console.error('Error: Version must be valid semver format (e.g., 1.2.3)');
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

  // Find existing plugin
  const pluginIndex = registry.plugins.findIndex(p => p.id === pluginId);
  if (pluginIndex === -1) {
    console.error(`Error: Plugin ${pluginId} not found in registry`);
    console.log('Available plugins:', registry.plugins.map(p => p.id).join(', '));
    process.exit(1);
  }

  const plugin = registry.plugins[pluginIndex];

  // Check if plugin manifest exists and update from it
  const manifestPath = path.join(__dirname, `../plugins/${pluginId}/plugin.json`);
  if (fs.existsSync(manifestPath)) {
    try {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
      
      // Update plugin info from manifest
      plugin.name = manifest.name || plugin.name;
      plugin.description = manifest.description || plugin.description;
      plugin.author = manifest.author || plugin.author;
      plugin.category = manifest.category || plugin.category;
      plugin.tags = manifest.keywords || plugin.tags;
      
      if (manifest.compatibility) {
        plugin.minAppVersion = manifest.compatibility.minAppVersion || plugin.minAppVersion;
        plugin.maxAppVersion = manifest.compatibility.maxAppVersion || plugin.maxAppVersion;
      }
      
      console.log(`📋 Updated plugin info from manifest: ${manifestPath}`);
    } catch (error) {
      console.warn(`⚠️  Could not read manifest file: ${error.message}`);
    }
  }

  // Update version and URLs
  plugin.version = version;
  plugin.downloadUrl = downloadUrl || `https://github.com/your-org/cnc-plugin-registry/releases/download/${pluginId}-v${version}/${pluginId}.zip`;
  plugin.manifestUrl = `https://raw.githubusercontent.com/your-org/cnc-plugin-registry/main/plugins/${pluginId}/plugin.json`;
  plugin.lastUpdated = new Date().toISOString();

  // Update registry metadata
  registry.lastUpdated = new Date().toISOString();

  // Write updated registry
  try {
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n');
    console.log(`✅ Successfully updated plugin: ${plugin.name} (${pluginId}) v${version}`);
    console.log(`📦 Download URL: ${plugin.downloadUrl}`);
  } catch (error) {
    console.error(`Error: Failed to write registry: ${error.message}`);
    process.exit(1);
  }
}

// Command line execution
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node scripts/update-plugin.js <plugin-id> <version> [download-url]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/update-plugin.js machine-monitor 1.2.0');
    console.log('  node scripts/update-plugin.js gcode-snippets 2.0.1 https://example.com/download.zip');
    process.exit(1);
  }

  const [pluginId, version, downloadUrl] = args;
  updatePlugin(pluginId, version, downloadUrl);
}

module.exports = { updatePlugin };