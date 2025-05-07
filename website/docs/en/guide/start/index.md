# Introduction
`EMP` is a high-performance engineering solution focused on micro-frontends, built on Rspack, Module Federation, and TypeScript.

## Why EMP

We created `EMP` to address various performance issues encountered while maintaining build tools in our team. Due to the presence of many monolithic applications within the team, which have complex build configurations, even after performance improvements with `EMP²`, production environment builds still take several minutes, and development environment startup times exceed one minute.

We tried various methods to optimize these monolithic applications on Webpack, but the results were minimal. We realized that optimizations on Webpack had reached their limit, and we needed to rebuild from the ground up to meet our needs.

Compared to previous versions of EMP, `EMP` has switched from webpack to rspack (a Rust-based high-performance build engine) for JS building. Through new algorithms, it reduces build output size, and the node build environment has been upgraded to use nodejs 20 LTS, with versions prior to 20 no longer being maintained.

## Current Status of EMP

Currently, `EMP` is in a released state and has been deployed in team production projects. After comparison with EMP2 across multiple projects, initial build speed has improved by approximately 28%, secondary build speed has improved by about 45%, and build output size has been reduced by more than 24%.

## Future of EMP
Micro-component sharing will adapt to more business scenarios, such as integrating new projects without requiring modifications to old projects. Further adaptation to modern browser modularization solutions, browser on-demand loading, and local development service on-demand building.

### Continuous Performance Improvement
Exploring higher-performance concurrent/multi-core friendly algorithms, higher-performance caching solutions, higher-performance plugin communication solutions, and more.

### Collaboration with More Team Partners
Within the team, `EMP` has been implemented in multiple projects, and we are currently collaborating with more team partners, hoping that `EMP` can become a standard configuration for more teams.