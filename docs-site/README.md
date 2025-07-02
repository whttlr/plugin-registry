# CNC Plugin Registry Documentation

This directory contains the Docusaurus-powered documentation site for the CNC Plugin Registry.

## 🚀 Live Site

Once deployed, the documentation will be available at:
**https://whttlr.github.io/plugin-registry/**

## 📁 Structure

```
docs-site/
├── docs/                    # Documentation content
│   ├── intro.md            # Welcome page
│   ├── development/        # Plugin development guides
│   ├── publishing/         # Publishing guides
│   ├── api/               # API reference
│   └── quick-reference.md  # Quick reference guide
├── src/
│   ├── pages/             # Custom pages
│   │   └── plugins.tsx    # Interactive plugin gallery
│   └── css/
│       └── custom.css     # Custom styles
├── static/                # Static assets
├── docusaurus.config.ts   # Site configuration
└── sidebars.ts           # Sidebar navigation
```

## 🛠 Development

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup
```bash
cd docs-site
npm install
```

### Development Server
```bash
npm start
```
This starts a local development server at `http://localhost:3000`

### Build
```bash
npm run build
```
Builds the static site for production

### Deploy
The site is automatically deployed via GitHub Actions when changes are pushed to the main branch.

## ✨ Features

### 🎨 Modern Design
- Clean, professional interface
- Dark/light theme support
- Responsive design for all devices
- Custom CNC-themed colors

### 🔍 Interactive Plugin Gallery
- Searchable plugin catalog
- Category filtering
- Plugin cards with metadata
- Direct download links

### 📚 Comprehensive Documentation
- **Getting Started** - Installation and setup
- **Development Guide** - Build your own plugins
- **API Reference** - Complete API documentation
- **Publishing Guide** - Share your plugins
- **Quick Reference** - Cheat sheets and examples

### 🚀 Advanced Features
- Full-text search across all documentation
- Version history and changelogs
- Syntax highlighting for code examples
- Interactive code snippets
- Mobile-optimized navigation

## 📝 Content Management

### Adding New Documentation
1. Create markdown files in the `docs/` directory
2. Update `sidebars.ts` to include new pages
3. Use frontmatter for page configuration:
   ```markdown
   ---
   sidebar_position: 1
   title: Page Title
   ---
   ```

### Updating Plugin Gallery
The plugin gallery (`src/pages/plugins.tsx`) can be updated to:
- Fetch live data from the registry API
- Add new plugin categories
- Enhance search functionality
- Add plugin ratings/reviews

### Customizing Theme
- Update colors in `src/css/custom.css`
- Modify `docusaurus.config.ts` for site-wide settings
- Add custom components in `src/components/`

## 🔧 Configuration

### Site Settings
Key configuration in `docusaurus.config.ts`:
- **Site URL**: `https://whttlr.github.io`
- **Base URL**: `/plugin-registry/`
- **Organization**: `whttlr`
- **Repository**: `plugin-registry`

### Navigation
The main navigation is configured in:
- **Navbar**: `docusaurus.config.ts` > `themeConfig.navbar`
- **Sidebar**: `sidebars.ts`
- **Footer**: `docusaurus.config.ts` > `themeConfig.footer`

### Search
Docusaurus includes built-in search functionality that indexes all content automatically.

## 🚀 Deployment

### GitHub Actions Workflow
The site deploys automatically via `.github/workflows/deploy-docs.yml`:

1. **Trigger**: Push to main branch with changes in `docs-site/`
2. **Build**: Install dependencies and build site
3. **Deploy**: Publish to GitHub Pages

### Manual Deployment
```bash
# Build the site
npm run build

# Deploy to GitHub Pages (requires permissions)
npm run deploy
```

## 🎯 Future Enhancements

### Planned Features
- [ ] Live plugin registry integration
- [ ] Plugin download statistics
- [ ] User ratings and reviews
- [ ] Plugin dependency visualization
- [ ] Interactive API explorer
- [ ] Video tutorials and demos
- [ ] Multi-language support
- [ ] Plugin development playground

### Community Features
- [ ] Plugin showcase gallery
- [ ] Developer spotlight articles
- [ ] Community contributions guide
- [ ] Plugin development contests
- [ ] User-submitted tutorials

## 🤝 Contributing

To contribute to the documentation:

1. Fork the repository
2. Make changes in the `docs-site/` directory
3. Test locally with `npm start`
4. Submit a pull request

### Writing Guidelines
- Use clear, concise language
- Include code examples for technical content
- Add screenshots for UI-heavy features
- Follow the existing structure and style
- Test all links and code snippets

---

This documentation site provides a professional, searchable, and maintainable platform for the CNC Plugin Registry community! 🎉
