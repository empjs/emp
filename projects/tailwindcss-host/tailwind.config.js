/** @type {import('tailwindcss').Config} */
module.exports = {
  // 替代 @config 的标准配置文件
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html'
  ],
  
  // 设置重要性选择器，替代原来 tailwindcss-config.ts 中的 important: '.tw-host'
  important: '.twHost',
  
  theme: {
    extend: {
      // 自定义主题扩展
      colors: {
        primary: {
          50: '#eff6ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      }
    },
  },
  
  plugins: [
    // 可以添加 TailwindCSS 插件
    // require('@tailwindcss/forms'),
    // require('@tailwindcss/typography'),
  ],
  
  // 其他配置选项
  corePlugins: {
    // 可以禁用某些核心插件
    // preflight: false,
  },
  
  // 变体配置
  variants: {
    extend: {
      // 扩展变体
    }
  }
}