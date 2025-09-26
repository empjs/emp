#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 项目目录
const projectsDir = path.join(rootDir, 'projects');
// 目标目录
const targetRootDir = path.join(rootDir, 'dist');

// 确保目标根目录存在
if (!fs.existsSync(targetRootDir)) {
  fs.mkdirSync(targetRootDir, { recursive: true });
}

// 复制目录函数
function copyDir(src, dest) {
  // 确保目标目录存在
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // 读取源目录
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // 递归复制子目录
      copyDir(srcPath, destPath);
    } else {
      // 复制文件
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 获取所有 adapter-* 项目
const dirs = fs.readdirSync(projectsDir);
const adapterProjects = dirs.filter(dir => dir.startsWith('adapter-'));

console.log(`找到 ${adapterProjects.length} 个 adapter 项目`);

// 处理每个 adapter 项目
for (const project of adapterProjects) {
  const projectDistDir = path.join(projectsDir, project, 'dist');
  const targetDistDir = path.join(targetRootDir, project, 'dist');

  // 检查项目 dist 目录是否存在
  if (fs.existsSync(projectDistDir)) {
    console.log(`复制 ${project} 的 dist 目录...`);
    
    // 确保目标目录存在
    if (!fs.existsSync(path.dirname(targetDistDir))) {
      fs.mkdirSync(path.dirname(targetDistDir), { recursive: true });
    }
    
    // 复制目录
    copyDir(projectDistDir, targetDistDir);
    console.log(`${project} 复制完成`);
  } else {
    console.log(`警告: ${project} 没有 dist 目录`);
  }
}

console.log('所有 adapter 项目的 dist 目录复制完成');