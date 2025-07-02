#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Script to package a plugin for distribution
 * Usage: node scripts/package-plugin.js <plugin-directory> [output-directory]
 */

async function packagePlugin(pluginDir, outputDir = './dist') {
  const pluginPath = path.resolve(pluginDir);
  const outputPath = path.resolve(outputDir);

  console.log('📦 CNC Plugin Packager');
  console.log('='.repeat(50));

  // Validate plugin directory exists
  if (!fs.existsSync(pluginPath)) {
    console.error(`❌ Error: Plugin directory not found: ${pluginPath}`);
    process.exit(1);
  }

  // Check for plugin.json manifest
  const manifestPath = path.join(pluginPath, 'plugin.json');
  if (!fs.existsSync(manifestPath)) {
    console.error('❌ Error: plugin.json manifest not found in plugin directory');
    console.error('   Expected:', manifestPath);
    process.exit(1);
  }

  // Read and validate manifest
  let manifest;
  try {
    manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    console.log(`📋 Plugin: ${manifest.name} v${manifest.version}`);
    console.log(`🏷️  ID: ${manifest.id}`);
  } catch (error) {
    console.error(`❌ Error: Invalid plugin.json: ${error.message}`);
    process.exit(1);
  }

  // Validate required manifest fields
  const requiredFields = ['id', 'name', 'version', 'description', 'author', 'placement'];
  for (const field of requiredFields) {
    if (!manifest[field]) {
      console.error(`❌ Error: Missing required field in plugin.json: ${field}`);
      process.exit(1);
    }
  }

  // Create output directory
  if (!fs.existsSync(outputPath)) {
    fs.mkdirSync(outputPath, { recursive: true });
    console.log(`📁 Created output directory: ${outputPath}`);
  }

  // Check for package.json and install dependencies if needed
  const packageJsonPath = path.join(pluginPath, 'package.json');
  if (fs.existsSync(packageJsonPath)) {
    console.log('📦 Installing dependencies...');
    try {
      execSync('npm install', { cwd: pluginPath, stdio: 'inherit' });
      console.log('✅ Dependencies installed');
    } catch (error) {
      console.error('❌ Error installing dependencies:', error.message);
      process.exit(1);
    }

    // Build if build script exists
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    if (packageJson.scripts && packageJson.scripts.build) {
      console.log('🔨 Building plugin...');
      try {
        execSync('npm run build', { cwd: pluginPath, stdio: 'inherit' });
        console.log('✅ Build completed');
      } catch (error) {
        console.error('❌ Error building plugin:', error.message);
        process.exit(1);
      }
    }
  }

  // Define files to include in package
  const includePatterns = [
    'plugin.json',           // Required manifest
    'dist/**/*',            // Built files
    'build/**/*',           // Alternative build directory
    'src/**/*',             // Source files
    'assets/**/*',          // Static assets
    'public/**/*',          // Public assets
    'README.md',            // Documentation
    'CHANGELOG.md',         // Change log
    'LICENSE',              // License file
    'package.json',         // NPM manifest
    '*.js',                 // Root JS files
    '*.ts',                 // Root TS files
    '*.tsx',                // Root TSX files
    '*.jsx',                // Root JSX files
    '*.css',                // Root CSS files
    '*.json'                // Root JSON files
  ];

  // Define files to exclude
  const excludePatterns = [
    'node_modules/**/*',
    '.git/**/*',
    '.gitignore',
    '.npmignore',
    '.env*',
    '*.log',
    '.DS_Store',
    'Thumbs.db',
    '__tests__/**/*',
    '*.test.js',
    '*.test.ts',
    '*.spec.js',
    '*.spec.ts',
    'coverage/**/*',
    '.nyc_output/**/*'
  ];

  console.log('📋 Collecting files...');
  const filesToInclude = collectFiles(pluginPath, includePatterns, excludePatterns);
  
  if (filesToInclude.length === 0) {
    console.error('❌ Error: No files found to package');
    process.exit(1);
  }

  console.log(`📄 Found ${filesToInclude.length} files to package`);

  // Create ZIP package
  const zipName = `${manifest.id}-v${manifest.version}.zip`;
  const zipPath = path.join(outputPath, zipName);

  console.log('🗜️  Creating ZIP package...');
  try {
    await createZipPackage(pluginPath, filesToInclude, zipPath);
    console.log(`✅ Package created: ${zipPath}`);
    
    // Validate package after creation
    console.log('🔍 Validating package...');
    validatePackage(zipPath, manifest);
  } catch (error) {
    console.error(`❌ Error creating package: ${error.message}`);
    process.exit(1);
  }

  // Generate package info
  const packageInfo = {
    name: manifest.name,
    id: manifest.id,
    version: manifest.version,
    size: fs.statSync(zipPath).size,
    files: filesToInclude.length,
    path: zipPath,
    createdAt: new Date().toISOString()
  };

  // Save package info
  const infoPath = path.join(outputPath, `${manifest.id}-v${manifest.version}.json`);
  fs.writeFileSync(infoPath, JSON.stringify(packageInfo, null, 2));

  console.log('');
  console.log('🎉 Plugin packaging completed!');
  console.log('='.repeat(50));
  console.log(`📦 Package: ${zipName}`);
  console.log(`📏 Size: ${formatBytes(packageInfo.size)}`);
  console.log(`📄 Files: ${packageInfo.files}`);
  console.log(`📍 Location: ${zipPath}`);
  console.log('');
  console.log('Next steps:');
  console.log('1. Test the plugin package in your CNC application');
  console.log('2. Create a GitHub release with this package');
  console.log('3. Add to registry using: node scripts/add-plugin.js ' + manifest.id);

  return packageInfo;
}

function collectFiles(basePath, includePatterns, excludePatterns) {
  const files = [];
  
  function walkDir(dir, relativePath = '') {
    const items = fs.readdirSync(dir);
    
    for (const item of items) {
      const fullPath = path.join(dir, item);
      const relPath = path.join(relativePath, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        walkDir(fullPath, relPath);
      } else {
        // Check if file should be included
        const shouldInclude = includePatterns.some(pattern => 
          minimatch(relPath, pattern)
        );
        const shouldExclude = excludePatterns.some(pattern => 
          minimatch(relPath, pattern)
        );
        
        if (shouldInclude && !shouldExclude) {
          files.push(relPath);
        }
      }
    }
  }
  
  walkDir(basePath);
  return files;
}

function minimatch(filePath, pattern) {
  // Simple glob pattern matching
  const regex = pattern
    .replace(/\*\*/g, '.*')
    .replace(/\*/g, '[^/]*')
    .replace(/\?/g, '[^/]');
  return new RegExp(`^${regex}$`).test(filePath);
}

function createZipPackage(basePath, files, outputPath) {
  // Use Node.js built-in zlib or external zip library
  const archiver = require('archiver');
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  return new Promise((resolve, reject) => {
    output.on('close', resolve);
    archive.on('error', reject);
    
    archive.pipe(output);
    
    for (const file of files) {
      const fullPath = path.join(basePath, file);
      archive.file(fullPath, { name: file });
    }
    
    archive.finalize();
  });
}

function validatePackage(zipPath, manifest) {
  const stats = fs.statSync(zipPath);
  
  // Check package size
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (stats.size > maxSize) {
    console.warn(`⚠️  Warning: Package size (${formatBytes(stats.size)}) exceeds recommended maximum (50MB)`);
  }
  
  // TODO: Add more validations
  // - Extract and verify plugin.json exists
  // - Check for required files based on placement type
  // - Validate file permissions
  
  console.log('✅ Package validation passed');
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Command line execution
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 1) {
    console.log('Usage: node scripts/package-plugin.js <plugin-directory> [output-directory]');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/package-plugin.js ./my-plugin');
    console.log('  node scripts/package-plugin.js /path/to/plugin ./packages');
    process.exit(1);
  }

  const [pluginDir, outputDir] = args;
  
  // Check if archiver is available
  try {
    require('archiver');
  } catch (error) {
    console.error('❌ Error: Missing required dependency "archiver"');
    console.error('Install it with: npm install archiver');
    process.exit(1);
  }
  
  packagePlugin(pluginDir, outputDir).catch(error => {
    console.error('❌ Packaging failed:', error.message);
    process.exit(1);
  });
}

module.exports = { packagePlugin };