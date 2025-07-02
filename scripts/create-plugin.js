#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

/**
 * Script to create a new plugin from template
 * Usage: node scripts/create-plugin.js <plugin-id> <plugin-name> [template-type]
 */

function createPlugin(pluginId, pluginName, templateType = 'dashboard') {
  console.log('🚀 CNC Plugin Generator');
  console.log('='.repeat(50));

  // Validate plugin ID
  if (!pluginId || !/^[a-z0-9-]+$/.test(pluginId)) {
    console.error('❌ Error: Plugin ID must contain only lowercase letters, numbers, and hyphens');
    process.exit(1);
  }

  if (!pluginName || pluginName.length < 3) {
    console.error('❌ Error: Plugin name must be at least 3 characters long');
    process.exit(1);
  }

  const validTemplates = ['dashboard', 'standalone', 'modal', 'sidebar'];
  if (!validTemplates.includes(templateType)) {
    console.error(`❌ Error: Template type must be one of: ${validTemplates.join(', ')}`);
    process.exit(1);
  }

  const pluginDir = path.resolve(pluginId);

  // Check if directory already exists
  if (fs.existsSync(pluginDir)) {
    console.error(`❌ Error: Directory ${pluginDir} already exists`);
    process.exit(1);
  }

  console.log(`📁 Creating plugin: ${pluginName} (${pluginId})`);
  console.log(`📦 Template: ${templateType}`);
  console.log(`📍 Location: ${pluginDir}`);
  console.log('');

  // Create directory structure
  fs.mkdirSync(pluginDir, { recursive: true });
  fs.mkdirSync(path.join(pluginDir, 'src'), { recursive: true });
  fs.mkdirSync(path.join(pluginDir, 'src', 'components'), { recursive: true });
  fs.mkdirSync(path.join(pluginDir, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(pluginDir, 'public'), { recursive: true });

  // Generate plugin.json manifest
  const manifest = generateManifest(pluginId, pluginName, templateType);
  fs.writeFileSync(
    path.join(pluginDir, 'plugin.json'),
    JSON.stringify(manifest, null, 2)
  );

  // Generate package.json
  const packageJson = generatePackageJson(pluginId, pluginName);
  fs.writeFileSync(
    path.join(pluginDir, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  // Generate main component
  const mainComponent = generateMainComponent(pluginId, pluginName, templateType);
  fs.writeFileSync(
    path.join(pluginDir, 'src', 'index.tsx'),
    mainComponent
  );

  // Generate component based on template type
  const component = generateComponent(pluginId, pluginName, templateType);
  const componentName = getComponentName(templateType);
  fs.writeFileSync(
    path.join(pluginDir, 'src', 'components', `${componentName}.tsx`),
    component
  );

  // Generate styles
  const styles = generateStyles(templateType);
  fs.writeFileSync(
    path.join(pluginDir, 'src', 'styles.css'),
    styles
  );

  // Generate README
  const readme = generateReadme(pluginId, pluginName, templateType);
  fs.writeFileSync(
    path.join(pluginDir, 'README.md'),
    readme
  );

  // Generate TypeScript config
  const tsConfig = generateTsConfig();
  fs.writeFileSync(
    path.join(pluginDir, 'tsconfig.json'),
    JSON.stringify(tsConfig, null, 2)
  );

  // Generate Vite config
  const viteConfig = generateViteConfig(pluginId);
  fs.writeFileSync(
    path.join(pluginDir, 'vite.config.ts'),
    viteConfig
  );

  console.log('✅ Plugin structure created successfully!');
  console.log('');
  console.log('📂 Generated files:');
  console.log('  ├── plugin.json         # Plugin manifest');
  console.log('  ├── package.json        # NPM configuration');
  console.log('  ├── tsconfig.json       # TypeScript configuration');
  console.log('  ├── vite.config.ts      # Vite build configuration');
  console.log('  ├── README.md           # Documentation');
  console.log('  └── src/');
  console.log('      ├── index.tsx       # Main plugin entry point');
  console.log('      ├── styles.css      # Plugin styles');
  console.log('      └── components/');
  console.log(`          └── ${componentName}.tsx # Main component`);
  console.log('');
  console.log('🚀 Next steps:');
  console.log(`1. cd ${pluginId}`);
  console.log('2. npm install');
  console.log('3. npm run dev          # Start development');
  console.log('4. npm run build        # Build for production');
  console.log('5. npm run package      # Package for distribution');

  return pluginDir;
}

function generateManifest(pluginId, pluginName, templateType) {
  const baseManifest = {
    id: pluginId,
    name: pluginName,
    version: '1.0.0',
    description: `${pluginName} plugin for CNC Controls application`,
    author: 'Your Name',
    license: 'MIT',
    keywords: [templateType, 'cnc', 'control'],
    category: getCategory(templateType),
    placement: templateType,
    screen: templateType === 'standalone' ? 'new' : 'main',
    priority: 50,
    autoStart: templateType === 'dashboard',
    permissions: getPermissions(templateType),
    compatibility: {
      minAppVersion: '1.0.0',
      maxAppVersion: '2.0.0'
    },
    dependencies: {
      react: '^18.0.0',
      antd: '^5.0.0'
    }
  };

  if (templateType === 'standalone') {
    baseManifest.menuTitle = pluginName;
    baseManifest.menuIcon = 'AppstoreOutlined';
    baseManifest.routePath = `/${pluginId}`;
  }

  if (templateType !== 'dashboard') {
    baseManifest.size = {
      width: 'auto',
      height: 'auto'
    };
  } else {
    baseManifest.size = {
      width: 400,
      height: 300
    };
  }

  return baseManifest;
}

function generatePackageJson(pluginId, pluginName) {
  return {
    name: pluginId,
    version: '1.0.0',
    description: `${pluginName} plugin for CNC Controls`,
    main: 'dist/index.js',
    scripts: {
      dev: 'vite',
      build: 'tsc && vite build',
      preview: 'vite preview',
      package: 'npm run build && node ../plugin-registry/scripts/package-plugin.js .',
      lint: 'eslint src --ext ts,tsx',
      'type-check': 'tsc --noEmit'
    },
    dependencies: {
      react: '^18.2.0',
      'react-dom': '^18.2.0',
      antd: '^5.12.0'
    },
    devDependencies: {
      '@types/react': '^18.2.43',
      '@types/react-dom': '^18.2.17',
      '@typescript-eslint/eslint-plugin': '^6.14.0',
      '@typescript-eslint/parser': '^6.14.0',
      '@vitejs/plugin-react': '^4.2.1',
      eslint: '^8.55.0',
      'eslint-plugin-react-hooks': '^4.6.0',
      'eslint-plugin-react-refresh': '^0.4.5',
      typescript: '^5.2.2',
      vite: '^5.0.8'
    },
    keywords: ['cnc', 'plugin', 'control', 'automation'],
    author: 'Your Name',
    license: 'MIT'
  };
}

function generateMainComponent(pluginId, pluginName, templateType) {
  const componentName = getComponentName(templateType);
  
  return `import React from 'react';
import { ${componentName} } from './components/${componentName}';
import './styles.css';

// Plugin configuration
export const pluginConfig = {
  id: '${pluginId}',
  name: '${pluginName}',
  version: '1.0.0'
};

// Main plugin component
const ${pluginName.replace(/[^a-zA-Z0-9]/g, '')}Plugin: React.FC = () => {
  return (
    <div className="${pluginId}-plugin">
      <${componentName} />
    </div>
  );
};

export default ${pluginName.replace(/[^a-zA-Z0-9]/g, '')}Plugin;
`;
}

function generateComponent(pluginId, pluginName, templateType) {
  const componentName = getComponentName(templateType);
  
  const templates = {
    dashboard: `import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col } from 'antd';

export const ${componentName}: React.FC = () => {
  const [data, setData] = useState({
    value1: 0,
    value2: 0,
    status: 'idle'
  });

  useEffect(() => {
    // Simulate data updates
    const interval = setInterval(() => {
      setData(prev => ({
        value1: Math.floor(Math.random() * 100),
        value2: Math.floor(Math.random() * 50),
        status: ['idle', 'running', 'paused'][Math.floor(Math.random() * 3)]
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card title="${pluginName}" size="small" className="${pluginId}-dashboard">
      <Row gutter={16}>
        <Col span={12}>
          <Statistic title="Value 1" value={data.value1} />
        </Col>
        <Col span={12}>
          <Statistic title="Value 2" value={data.value2} />
        </Col>
      </Row>
      <div className="status-indicator">
        Status: <span className={\`status-\${data.status}\`}>{data.status}</span>
      </div>
    </Card>
  );
};`,

    standalone: `import React, { useState } from 'react';
import { Layout, Card, Button, Table, Space } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';

const { Content } = Layout;

export const ${componentName}: React.FC = () => {
  const [items, setItems] = useState([
    { id: 1, name: 'Item 1', value: 10 },
    { id: 2, name: 'Item 2', value: 20 }
  ]);

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Value', dataIndex: 'value', key: 'value' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size="middle">
          <Button icon={<EditOutlined />} size="small">Edit</Button>
          <Button icon={<DeleteOutlined />} size="small" danger>Delete</Button>
        </Space>
      )
    }
  ];

  return (
    <Layout className="${pluginId}-standalone">
      <Content style={{ padding: '24px' }}>
        <Card 
          title="${pluginName}"
          extra={<Button type="primary" icon={<PlusOutlined />}>Add Item</Button>}
        >
          <Table 
            columns={columns} 
            dataSource={items} 
            rowKey="id"
            pagination={false}
          />
        </Card>
      </Content>
    </Layout>
  );
};`,

    modal: `import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';

interface ${componentName}Props {
  visible: boolean;
  onClose: () => void;
}

export const ${componentName}: React.FC<${componentName}Props> = ({ visible, onClose }) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      message.success('Operation completed successfully!');
      form.resetFields();
      onClose();
    } catch (error) {
      message.error('Operation failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="${pluginName}"
      open={visible}
      onCancel={onClose}
      footer={null}
      className="${pluginId}-modal"
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please enter a name' }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        
        <Form.Item
          name="value"
          label="Value"
          rules={[{ required: true, message: 'Please enter a value' }]}
        >
          <Input placeholder="Enter value" />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              Submit
            </Button>
            <Button onClick={onClose}>
              Cancel
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};`,

    sidebar: `import React, { useState } from 'react';
import { Card, List, Button, Input, Space } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';

export const ${componentName}: React.FC = () => {
  const [items, setItems] = useState([
    'Quick Action 1',
    'Quick Action 2',
    'Quick Action 3'
  ]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredItems = items.filter(item => 
    item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card 
      title="${pluginName}" 
      size="small" 
      className="${pluginId}-sidebar"
      extra={<Button type="text" icon={<PlusOutlined />} size="small" />}
    >
      <Space direction="vertical" style={{ width: '100%' }}>
        <Input
          placeholder="Search..."
          prefix={<SearchOutlined />}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          size="small"
        />
        
        <List
          size="small"
          dataSource={filteredItems}
          renderItem={(item, index) => (
            <List.Item>
              <Button type="text" size="small" block style={{ textAlign: 'left' }}>
                {item}
              </Button>
            </List.Item>
          )}
        />
      </Space>
    </Card>
  );
};`
  };

  return templates[templateType] || templates.dashboard;
}

function generateStyles(templateType) {
  return `.${templateType === 'dashboard' ? 'dashboard' : templateType === 'standalone' ? 'standalone' : templateType === 'modal' ? 'modal' : 'sidebar'} {
  /* Plugin-specific styles */
}

.status-indicator {
  margin-top: 12px;
  font-size: 12px;
}

.status-idle { color: #666; }
.status-running { color: #52c41a; }
.status-paused { color: #fa8c16; }

/* Responsive adjustments */
@media (max-width: 768px) {
  .ant-statistic {
    text-align: center;
  }
}
`;
}

function generateReadme(pluginId, pluginName, templateType) {
  return `# ${pluginName}

A ${templateType} plugin for CNC Controls application.

## Description

${pluginName} provides [describe functionality here].

## Features

- Feature 1
- Feature 2
- Feature 3

## Installation

1. Build the plugin:
   \`\`\`bash
   npm install
   npm run build
   \`\`\`

2. Package for distribution:
   \`\`\`bash
   npm run package
   \`\`\`

3. Install in CNC Controls application via plugin manager

## Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Package plugin
npm run package
\`\`\`

## Configuration

The plugin can be configured through the CNC Controls plugin settings:

- Setting 1: Description
- Setting 2: Description

## License

MIT License - see LICENSE file for details.
`;
}

function generateTsConfig() {
  return {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      module: 'ESNext',
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: 'react-jsx',
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true
    },
    include: ['src']
  };
}

function generateViteConfig(pluginId) {
  return `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.tsx',
      name: '${pluginId}',
      fileName: 'index'
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'antd'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          antd: 'antd'
        }
      }
    }
  }
})
`;
}

function getComponentName(templateType) {
  const names = {
    dashboard: 'DashboardCard',
    standalone: 'StandaloneView',
    modal: 'ModalDialog',
    sidebar: 'SidebarPanel'
  };
  return names[templateType] || 'DashboardCard';
}

function getCategory(templateType) {
  const categories = {
    dashboard: 'monitoring',
    standalone: 'utility',
    modal: 'utility',
    sidebar: 'utility'
  };
  return categories[templateType] || 'utility';
}

function getPermissions(templateType) {
  const permissions = {
    dashboard: ['machine.read', 'status.read'],
    standalone: ['config.read', 'config.write'],
    modal: ['machine.read'],
    sidebar: ['machine.read']
  };
  return permissions[templateType] || ['machine.read'];
}

// Command line execution
if (require.main === module) {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: node scripts/create-plugin.js <plugin-id> <plugin-name> [template-type]');
    console.log('');
    console.log('Template types: dashboard, standalone, modal, sidebar');
    console.log('');
    console.log('Examples:');
    console.log('  node scripts/create-plugin.js machine-monitor "Machine Monitor" dashboard');
    console.log('  node scripts/create-plugin.js gcode-editor "G-Code Editor" standalone');
    console.log('  node scripts/create-plugin.js quick-settings "Quick Settings" modal');
    console.log('  node scripts/create-plugin.js tool-panel "Tool Panel" sidebar');
    process.exit(1);
  }

  const [pluginId, pluginName, templateType] = args;
  createPlugin(pluginId, pluginName, templateType);
}

module.exports = { createPlugin };