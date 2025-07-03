import React from 'react';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import { PluginRegistryEntry } from '@whttlr/plugin-types';

// Use the shared type instead of duplicating the interface
type Plugin = PluginRegistryEntry;

// This would normally be fetched from the registry API
const SAMPLE_PLUGINS: Plugin[] = [
  {
    id: 'machine-monitor',
    name: 'Machine Monitor',
    description: 'Real-time machine status monitoring with comprehensive dashboard displaying position, speed, and connectivity status',
    category: 'monitoring',
    author: 'CNC Controls Team',
    version: '1.0.0',
    downloadUrl: 'https://github.com/whttlr/plugin-registry/releases/download/machine-monitor-v1.0.0/machine-monitor.zip',
    manifestUrl: 'https://raw.githubusercontent.com/whttlr/plugin-registry/main/plugins/machine-monitor/plugin.json',
    tags: ['monitoring', 'dashboard', 'real-time', 'status'],
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    id: 'gcode-snippets',
    name: 'G-code Snippets',
    description: 'Quick access to commonly used G-code commands and custom snippets',
    category: 'utility',
    author: 'Community',
    version: '2.1.0',
    downloadUrl: 'https://github.com/whttlr/plugin-registry/releases/download/gcode-snippets-v2.1.0/gcode-snippets.zip',
    manifestUrl: 'https://raw.githubusercontent.com/whttlr/plugin-registry/main/plugins/gcode-snippets/plugin.json',
    tags: ['gcode', 'snippets', 'utility'],
    lastUpdated: '2024-01-10T14:20:00Z'
  },
  {
    id: 'tool-library',
    name: 'Tool Library',
    description: 'Comprehensive tool management with database of cutting tools and parameters',
    category: 'management',
    author: 'CNC Controls Team',
    version: '1.5.2',
    downloadUrl: 'https://github.com/whttlr/plugin-registry/releases/download/tool-library-v1.5.2/tool-library.zip',
    manifestUrl: 'https://raw.githubusercontent.com/whttlr/plugin-registry/main/plugins/tool-library/plugin.json',
    tags: ['tools', 'database', 'management'],
    lastUpdated: '2024-01-12T09:45:00Z'
  },
  {
    id: 'quick-settings',
    name: 'Quick Settings',
    description: 'Fast access to frequently used machine settings and configurations',
    category: 'utility',
    author: 'Community',
    version: '1.0.1',
    downloadUrl: 'https://github.com/whttlr/plugin-registry/releases/download/quick-settings-v1.0.1/quick-settings.zip',
    manifestUrl: 'https://raw.githubusercontent.com/whttlr/plugin-registry/main/plugins/quick-settings/plugin.json',
    tags: ['settings', 'configuration', 'quick'],
    lastUpdated: '2024-01-08T16:30:00Z'
  },
];

const CATEGORIES = {
  monitoring: { name: 'Monitoring', color: '#1890ff', icon: '📊' },
  control: { name: 'Control', color: '#52c41a', icon: '🎛️' },
  visualization: { name: 'Visualization', color: '#722ed1', icon: '👁️' },
  utility: { name: 'Utility', color: '#fa8c16', icon: '🔧' },
  automation: { name: 'Automation', color: '#eb2f96', icon: '🤖' },
  management: { name: 'Management', color: '#13c2c2', icon: '📁' },
};

const PLACEMENTS = {
  dashboard: { name: 'Dashboard', icon: '🎛️' },
  standalone: { name: 'Standalone', icon: '🖥️' },
  modal: { name: 'Modal', icon: '💬' },
  sidebar: { name: 'Sidebar', icon: '📋' },
};

function PluginCard({ plugin }: { plugin: Plugin }) {
  const category = CATEGORIES[plugin.category] || CATEGORIES.utility;
  const placement = PLACEMENTS[plugin.placement] || PLACEMENTS.dashboard;

  return (
    <div className="plugin-card">
      <div className="plugin-card__header">
        <h3>{plugin.name}</h3>
        <span className="plugin-card__version">v{plugin.version}</span>
      </div>
      
      <p className="plugin-card__description">{plugin.description}</p>
      
      <div className="plugin-card__meta">
        <div className="plugin-card__badges">
          <span 
            className="plugin-card__badge plugin-card__badge--category"
            style={{ backgroundColor: category.color }}
          >
            {category.icon} {category.name}
          </span>
          <span className="plugin-card__badge plugin-card__badge--placement">
            {placement.icon} {placement.name}
          </span>
        </div>
        
        <div className="plugin-card__keywords">
          {plugin.tags.slice(0, 3).map(tag => (
            <span key={tag} className="plugin-card__keyword">
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="plugin-card__footer">
        <span className="plugin-card__author">by {plugin.author}</span>
        <div className="plugin-card__actions">
          <Link
            className="button button--secondary button--sm"
            to={`https://github.com/whttlr/plugin-registry/tree/main/plugins/${plugin.id}`}
          >
            View Details
          </Link>
          <Link
            className="button button--primary button--sm"
            to={`https://github.com/whttlr/plugin-registry/releases/latest/download/${plugin.id}.zip`}
          >
            Download
          </Link>
        </div>
      </div>
    </div>
  );
}

function CategoryFilter({ 
  selectedCategory, 
  onCategoryChange 
}: { 
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}) {
  return (
    <div className="category-filter">
      <button
        className={`category-filter__button ${selectedCategory === 'all' ? 'category-filter__button--active' : ''}`}
        onClick={() => onCategoryChange('all')}
      >
        All Plugins
      </button>
      {Object.entries(CATEGORIES).map(([key, category]) => (
        <button
          key={key}
          className={`category-filter__button ${selectedCategory === key ? 'category-filter__button--active' : ''}`}
          onClick={() => onCategoryChange(key)}
          style={{ 
            borderColor: selectedCategory === key ? category.color : undefined,
            color: selectedCategory === key ? category.color : undefined
          }}
        >
          {category.icon} {category.name}
        </button>
      ))}
    </div>
  );
}

export default function PluginGallery(): JSX.Element {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchTerm, setSearchTerm] = React.useState('');

  const filteredPlugins = SAMPLE_PLUGINS.filter(plugin => {
    const matchesCategory = selectedCategory === 'all' || plugin.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      plugin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plugin.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout
      title="Plugin Gallery"
      description="Browse and download plugins for your CNC application"
    >
      <div className="container margin-vert--lg">
        <div className="text--center margin-bottom--lg">
          <h1>Plugin Gallery</h1>
          <p className="hero__subtitle">
            Discover powerful plugins to extend your CNC application
          </p>
        </div>

        <div className="plugin-gallery__controls">
          <div className="plugin-gallery__search">
            <input
              type="text"
              placeholder="Search plugins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="plugin-gallery__search-input"
            />
          </div>
          
          <CategoryFilter
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
          />
        </div>

        <div className="plugin-gallery__stats">
          <span>{filteredPlugins.length} plugins found</span>
        </div>

        <div className="plugin-gallery__grid">
          {filteredPlugins.map(plugin => (
            <PluginCard key={plugin.id} plugin={plugin} />
          ))}
        </div>

        {filteredPlugins.length === 0 && (
          <div className="text--center margin-vert--xl">
            <h3>No plugins found</h3>
            <p>Try adjusting your search or category filter.</p>
          </div>
        )}

        <div className="text--center margin-top--xl">
          <h2>Want to contribute?</h2>
          <p>
            Create your own plugin and share it with the community!
          </p>
          <Link
            className="button button--primary button--lg"
            to="/docs/development/overview"
          >
            Start Developing
          </Link>
        </div>
      </div>
    </Layout>
  );
}