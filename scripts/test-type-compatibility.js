#!/usr/bin/env node

/**
 * Type Compatibility Test Script
 * Validates that plugin-registry and electron-app are using compatible type signatures
 */

const fs = require('fs');
const path = require('path');

const COLORS = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function checkFile(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description}`, 'green');
    return true;
  } else {
    log(`❌ ${description}`, 'red');
    return false;
  }
}

function checkPluginTypesUsage(filePath, description, allowIndirect = false) {
  if (!fs.existsSync(filePath)) {
    log(`❌ ${description} - File not found`, 'red');
    return false;
  }

  const content = fs.readFileSync(filePath, 'utf8');
  const hasDirectImport = content.includes('@whttlr/plugin-types');
  const hasIndirectUsage = allowIndirect && (
    content.includes('validatePluginManifest') || 
    content.includes('VALID_PERMISSIONS')
  );
  
  if (hasDirectImport) {
    log(`✅ ${description} - Uses @whttlr/plugin-types`, 'green');
    return true;
  } else if (hasIndirectUsage) {
    log(`✅ ${description} - Uses shared types (indirect)`, 'green');
    return true;
  } else {
    log(`❌ ${description} - Missing @whttlr/plugin-types usage`, 'red');
    return false;
  }
}

function checkPackageJsonDependency(filePath, packageName) {
  if (!fs.existsSync(filePath)) {
    log(`❌ package.json not found at ${filePath}`, 'red');
    return false;
  }

  const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const hasDependency = 
    (packageJson.dependencies && packageJson.dependencies[packageName]) ||
    (packageJson.devDependencies && packageJson.devDependencies[packageName]) ||
    (packageJson.peerDependencies && packageJson.peerDependencies[packageName]);

  if (hasDependency) {
    const version = 
      (packageJson.dependencies && packageJson.dependencies[packageName]) ||
      (packageJson.devDependencies && packageJson.devDependencies[packageName]) ||
      (packageJson.peerDependencies && packageJson.peerDependencies[packageName]);
    log(`✅ ${packageName} dependency found (${version})`, 'green');
    return true;
  } else {
    log(`❌ ${packageName} dependency missing`, 'red');
    return false;
  }
}

async function runCompatibilityTests() {
  log('\n🔍 Plugin Type Compatibility Test Suite', 'bold');
  log('==========================================\n', 'blue');

  let passed = 0;
  let total = 0;

  // Test 1: Check plugin-registry uses shared types
  log('📋 Testing Plugin Registry Integration...', 'blue');
  total++;
  if (checkPackageJsonDependency('./package.json', '@whttlr/plugin-types')) {
    passed++;
  }

  total++;
  if (checkPluginTypesUsage('./scripts/create-plugin.js', 'create-plugin.js')) {
    passed++;
  }

  total++;
  if (checkPluginTypesUsage('./scripts/add-plugin.js', 'add-plugin.js', true)) {
    passed++;
  }

  total++;
  if (checkPluginTypesUsage('./scripts/validate-registry.js', 'validate-registry.js')) {
    passed++;
  }

  // Test 2: Check electron-app uses shared types
  log('\n⚡ Testing Electron App Integration...', 'blue');
  const electronAppPath = '../electron-app';
  
  total++;
  if (checkPackageJsonDependency(path.join(electronAppPath, 'package.json'), '@whttlr/plugin-types')) {
    passed++;
  }

  total++;
  if (checkPluginTypesUsage(path.join(electronAppPath, 'src/services/config/types.ts'), 'electron-app config types')) {
    passed++;
  }

  total++;
  if (checkPluginTypesUsage(path.join(electronAppPath, 'src/services/database/types.ts'), 'electron-app database types')) {
    passed++;
  }

  total++;
  if (checkPluginTypesUsage(path.join(electronAppPath, 'src/services/plugin/types.ts'), 'electron-app plugin types')) {
    passed++;
  }

  // Test 3: Check create-plugin generates code with shared types
  log('\n📝 Testing Plugin Template Generation...', 'blue');
  
  total++;
  const createPluginContent = fs.readFileSync('./scripts/create-plugin.js', 'utf8');
  if (createPluginContent.includes('PluginAPI') && createPluginContent.includes('@whttlr/plugin-types')) {
    log('✅ create-plugin.js generates templates with shared types', 'green');
    passed++;
  } else {
    log('❌ create-plugin.js does not generate templates with shared types', 'red');
  }

  // Test 4: Validate package versions match
  log('\n📦 Testing Package Version Consistency...', 'blue');
  
  try {
    const registryPkg = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
    const electronPkg = JSON.parse(fs.readFileSync(path.join(electronAppPath, 'package.json'), 'utf8'));
    
    const registryVersion = registryPkg.dependencies?.['@whttlr/plugin-types'] || 
                           registryPkg.devDependencies?.['@whttlr/plugin-types'];
    const electronVersion = electronPkg.dependencies?.['@whttlr/plugin-types'] || 
                           electronPkg.devDependencies?.['@whttlr/plugin-types'];
    
    total++;
    if (registryVersion && electronVersion && registryVersion === electronVersion) {
      log(`✅ Package versions match: ${registryVersion}`, 'green');
      passed++;
    } else {
      log(`❌ Package version mismatch: registry(${registryVersion}) vs electron(${electronVersion})`, 'red');
    }
  } catch (error) {
    log(`❌ Error checking package versions: ${error.message}`, 'red');
    total++;
  }

  // Results
  log('\n📊 Test Results:', 'bold');
  log('===============', 'blue');
  log(`Passed: ${passed}/${total}`, passed === total ? 'green' : 'yellow');
  
  if (passed === total) {
    log('\n🎉 All compatibility tests passed!', 'green');
    log('✅ Plugin-registry and electron-app are using compatible type signatures', 'green');
    return true;
  } else {
    log('\n⚠️  Some compatibility tests failed!', 'yellow');
    log('🔧 Please review the failed tests above and ensure both systems use @whttlr/plugin-types', 'yellow');
    return false;
  }
}

// Run the tests
runCompatibilityTests()
  .then(success => {
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    log(`💥 Test suite failed with error: ${error.message}`, 'red');
    process.exit(1);
  });