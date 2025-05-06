#!/usr/bin/env node
import Module from 'node:module'
export const require = Module.createRequire(import.meta.url)
require('@biomejs/biome/bin/biome')
