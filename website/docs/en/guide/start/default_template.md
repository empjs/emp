# Default Template

EMP provides several default templates to help you quickly start your project. This guide introduces the available templates and their usage.

## Available Templates

### React Templates

#### Basic React Template
```bash
npm create @efox/emp@latest my-react-app -- --template react
```

Features:
- React 18
- TypeScript support
- Module Federation ready
- Hot Module Replacement
- CSS Modules

#### React with Tailwind
```bash
npm create @efox/emp@latest my-react-tailwind -- --template react-tailwind
```

Features:
- All basic React template features
- Tailwind CSS integration
- PostCSS configuration
- Responsive design utilities

### Vue Templates

#### Vue 3 Template
```bash
npm create @efox/emp@latest my-vue3-app -- --template vue3
```

Features:
- Vue 3
- TypeScript support
- Composition API
- Module Federation ready
- Hot Module Replacement

#### Vue 2 Template
```bash
npm create @efox/emp@latest my-vue2-app -- --template vue2
```

Features:
- Vue 2
- TypeScript support
- Options API
- Module Federation ready
- Hot Module Replacement

## Template Structure

All templates follow a similar directory structure:

```
├── src/
│   ├── components/
│   ├── pages/
│   ├── App.[tsx|vue]
│   └── main.[ts|js]
├── public/
├── emp.config.[ts|js]
├── package.json
├── README.md
└── tsconfig.json
```

## Customization

### Configuration

Each template can be customized through `emp.config.ts`:

```typescript
export default defineConfig({
  // Base configuration
  server: {
    port: 8000
  },
  // Framework-specific settings
  plugins: [
    // Add plugins based on template
  ]
})
```

### Styling

Templates support various styling approaches:

```typescript
// CSS Modules
import styles from './styles.module.css'

// Global CSS
import './global.css'

// Preprocessors (if configured)
import './styles.scss'
```

## Development

### Starting Development Server

```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Best Practices

1. **Project Structure**
   - Keep components modular
   - Use consistent file naming
   - Organize by feature/module

2. **Code Style**
   - Follow framework conventions
   - Use TypeScript for type safety
   - Implement proper error handling

3. **Performance**
   - Optimize imports
   - Implement code splitting
   - Use lazy loading

4. **Testing**
   - Write unit tests
   - Include integration tests
   - Test across browsers

## Template Extensions

### Adding Dependencies

```bash
npm install package-name
```

### Configuring Tools

- ESLint configuration
- Prettier setup
- Git hooks
- CI/CD integration

## Troubleshooting

### Common Issues

1. **Build Errors**
   - Check Node.js version
   - Verify dependencies
   - Review configuration

2. **Runtime Issues**
   - Check browser console
   - Verify environment variables
   - Review module federation setup

For more detailed information about configuration and customization, refer to the [Configuration Guide](../config/index.mdx).