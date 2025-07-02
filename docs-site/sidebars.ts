import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */
const sidebars: SidebarsConfig = {
  // Main documentation sidebar
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/overview',
        'getting-started/installation',
        'getting-started/first-plugin',
      ],
    },
    {
      type: 'category',
      label: 'Plugin Development',
      items: [
        'development/overview',
        'development/architecture',
        'development/configuration',
        'development/data-access',
        'development/ui-components',
        'development/testing',
      ],
    },
    {
      type: 'category',
      label: 'Publishing',
      items: [
        'publishing/overview',
        'publishing/validation',
        'publishing/release-process',
        'publishing/troubleshooting',
      ],
    },
    'quick-reference',
  ],

  // API Reference sidebar
  apiSidebar: [
    'api/overview',
    {
      type: 'category',
      label: 'Plugin API',
      items: [
        'api/plugin-interface',
        'api/configuration-api',
        'api/machine-api',
        'api/events-api',
      ],
    },
    {
      type: 'category',
      label: 'Registry API',
      items: [
        'api/registry-format',
        'api/plugin-manifest',
        'api/schemas',
      ],
    },
  ],
};

export default sidebars;
