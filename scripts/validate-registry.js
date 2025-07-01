#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to validate the plugin registry and all plugin manifests
 * Usage: node scripts/validate-registry.js
 */

function validateRegistry() {
  let hasErrors = false;

  console.log('🔍 Validating Plugin Registry...\n');

  // Check if registry.json exists
  const registryPath = path.join(__dirname, '../registry.json');
  if (!fs.existsSync(registryPath)) {
    console.error('❌ Error: registry.json not found');
    return false;
  }

  // Read and parse registry
  let registry;
  try {
    registry = JSON.parse(fs.readFileSync(registryPath, 'utf8'));
    console.log('✅ registry.json is valid JSON');
  } catch (error) {
    console.error(`❌ Error: Invalid JSON in registry.json: ${error.message}`);
    return false;
  }

  // Validate registry structure
  const requiredFields = ['version', 'plugins', 'categories'];
  for (const field of requiredFields) {
    if (!registry[field]) {
      console.error(`❌ Error: registry.json missing required field: ${field}`);
      hasErrors = true;
    }
  }

  if (!Array.isArray(registry.plugins)) {
    console.error('❌ Error: registry.plugins must be an array');
    hasErrors = true;
  }

  if (!Array.isArray(registry.categories)) {
    console.error('❌ Error: registry.categories must be an array');
    hasErrors = true;
  }

  // Check for duplicate plugin IDs
  const pluginIds = registry.plugins.map(p => p.id);
  const duplicateIds = pluginIds.filter((id, index) => pluginIds.indexOf(id) !== index);
  if (duplicateIds.length > 0) {
    console.error(`❌ Error: Duplicate plugin IDs found: ${duplicateIds.join(', ')}`);
    hasErrors = true;
  } else {
    console.log(`✅ No duplicate plugin IDs (${pluginIds.length} plugins)`);
  }

  // Validate each plugin entry
  console.log('\n📋 Validating plugin entries...');
  for (let i = 0; i < registry.plugins.length; i++) {
    const plugin = registry.plugins[i];
    const pluginErrors = validatePluginEntry(plugin, i);
    if (pluginErrors > 0) {
      hasErrors = true;
    }
  }

  // Validate plugin manifests
  console.log('\n📄 Validating plugin manifests...');
  const pluginsDir = path.join(__dirname, '../plugins');
  if (fs.existsSync(pluginsDir)) {
    const pluginDirs = fs.readdirSync(pluginsDir).filter(item => {
      return fs.statSync(path.join(pluginsDir, item)).isDirectory();
    });

    for (const pluginDir of pluginDirs) {
      const manifestPath = path.join(pluginsDir, pluginDir, 'plugin.json');
      if (fs.existsSync(manifestPath)) {
        const manifestErrors = validatePluginManifest(manifestPath, pluginDir);
        if (manifestErrors > 0) {
          hasErrors = true;
        }
      } else {
        console.warn(`⚠️  Warning: No plugin.json found in plugins/${pluginDir}/`);
      }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  if (hasErrors) {
    console.log('❌ Validation failed - please fix the errors above');
    return false;
  } else {
    console.log('✅ All validations passed!');
    console.log(`📊 Registry contains ${registry.plugins.length} plugins across ${registry.categories.length} categories`);
    return true;
  }
}

function validatePluginEntry(plugin, index) {
  let errors = 0;
  const prefix = `  Plugin ${index + 1} (${plugin.id || 'unknown'}):`;

  // Required fields
  const requiredFields = ['id', 'name', 'description', 'author', 'version', 'downloadUrl', 'manifestUrl', 'category'];
  for (const field of requiredFields) {
    if (!plugin[field]) {
      console.error(`${prefix} Missing required field: ${field}`);
      errors++;
    }
  }

  // Validate plugin ID format
  if (plugin.id && !/^[a-z0-9-]+$/.test(plugin.id)) {
    console.error(`${prefix} Invalid ID format (must be lowercase, numbers, hyphens only)`);
    errors++;
  }

  // Validate version format
  if (plugin.version && !/^\d+\.\d+\.\d+$/.test(plugin.version)) {
    console.error(`${prefix} Invalid version format (must be major.minor.patch)`);
    errors++;
  }

  // Validate URLs
  if (plugin.downloadUrl && !isValidUrl(plugin.downloadUrl)) {
    console.error(`${prefix} Invalid download URL`);
    errors++;
  }

  if (plugin.manifestUrl && !isValidUrl(plugin.manifestUrl)) {
    console.error(`${prefix} Invalid manifest URL`);
    errors++;
  }

  if (errors === 0) {
    console.log(`${prefix} ✅ Valid`);
  }

  return errors;
}

function validatePluginManifest(manifestPath, expectedId) {
  let errors = 0;
  const prefix = `  plugins/${expectedId}/plugin.json:`;

  try {
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

    // Required fields
    const requiredFields = ['id', 'name', 'version', 'description', 'author', 'placement'];
    for (const field of requiredFields) {
      if (!manifest[field]) {
        console.error(`${prefix} Missing required field: ${field}`);
        errors++;
      }
    }

    // Validate ID matches directory
    if (manifest.id !== expectedId) {
      console.error(`${prefix} ID mismatch (expected: ${expectedId}, found: ${manifest.id})`);
      errors++;
    }

    // Validate placement
    const validPlacements = ['dashboard', 'standalone', 'modal', 'sidebar'];
    if (manifest.placement && !validPlacements.includes(manifest.placement)) {
      console.error(`${prefix} Invalid placement: ${manifest.placement}`);
      errors++;
    }

    // Validate permissions
    if (manifest.permissions && Array.isArray(manifest.permissions)) {
      const validPermissions = [
        'machine.read', 'machine.write', 'machine.control',
        'status.read', 'files.read', 'files.write',
        'config.read', 'config.write', 'network.access'
      ];
      
      for (const permission of manifest.permissions) {
        if (!validPermissions.includes(permission)) {
          console.error(`${prefix} Invalid permission: ${permission}`);
          errors++;
        }
      }
    }

    if (errors === 0) {
      console.log(`${prefix} ✅ Valid`);
    }

  } catch (error) {
    console.error(`${prefix} JSON parse error: ${error.message}`);
    errors++;
  }

  return errors;
}

function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Command line execution
if (require.main === module) {
  const success = validateRegistry();
  process.exit(success ? 0 : 1);
}

module.exports = { validateRegistry };