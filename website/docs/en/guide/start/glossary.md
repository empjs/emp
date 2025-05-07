# Glossary

This glossary provides definitions for key terms used throughout the EMP documentation.

## Core Concepts

### EMP (Efficient Module Platform)
A high-performance build tool based on Rspack, designed for modern web development with a focus on module federation and efficient building.

### Module Federation
A JavaScript architecture that allows multiple independent builds to form a single application, enabling runtime dependency sharing and code splitting.

### Rspack
A Rust-based bundler that provides significant performance improvements over traditional JavaScript bundlers.

## Build Terms

### Bundle
A compiled and minified file that contains all the necessary code for a specific part of your application.

### Chunk
A portion of your application's code that can be loaded independently, often used in code splitting strategies.

### Tree Shaking
The process of removing unused code from your production bundle to reduce its size.

### Hot Module Replacement (HMR)
A development feature that allows modules to be updated without a full page refresh.

## Configuration Terms

### Entry Point
The main file that serves as the starting point for bundling your application.

### Output
The resulting files generated after the build process.

### Loader
A tool that transforms files from one format to another before adding them to the bundle.

### Plugin
An extension that can modify how the bundling works and add additional functionality.

## Development Terms

### Development Server
A local server that hosts your application during development, providing features like HMR and live reloading.

### Source Map
A file that maps the transformed code back to its original source, making debugging easier.

### Build Mode
The environment setting (development or production) that determines how the code is processed and optimized.

## Advanced Concepts

### Code Splitting
The practice of splitting your code into various bundles that can be loaded on demand.

### Dynamic Import
A feature that allows you to import modules conditionally and load them when needed.

### Lazy Loading
A technique where certain parts of your application are loaded only when they're required.

### Micro-frontends
An architectural style where independently deliverable frontend applications are composed into a larger whole.

## Performance Terms

### Time to Interactive (TTI)
The time it takes for a page to become fully interactive.

### First Contentful Paint (FCP)
The time when the first content element is rendered on the screen.

### Bundle Size
The total size of all JavaScript bundles that need to be downloaded by the browser.

## Deployment Terms

### Static Assets
Files like images, fonts, and other resources that don't need processing.

### Content Delivery Network (CDN)
A distributed network of servers that delivers content based on the user's geographic location.

### Environment Variables
Values that can be different between development and production environments.

## Best Practices

### Progressive Enhancement
A strategy of building applications that work for all users while providing enhanced functionality for modern browsers.

### Responsive Design
An approach to web design that makes web pages render well on different devices and screen sizes.

### Accessibility (a11y)
The practice of making websites usable by as many people as possible.

For more detailed information about these concepts and their implementation in EMP, refer to the respective documentation sections.