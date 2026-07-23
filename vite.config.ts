import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' 让构建产物可在任意子路径（如 CloudStudio 静态托管）下直接打开
export default defineConfig({
  plugins: [react()],
  base: './',
});
