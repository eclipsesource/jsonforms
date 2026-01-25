import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@jsonforms/react-shadcn': path.resolve(__dirname, '../src'),
      '@jsonforms/examples-react': path.resolve(__dirname, '../../examples-react/src'),
      '@jsonforms/examples': path.resolve(__dirname, '../../examples/src'),
      '@': path.resolve(__dirname, '../src'),
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    cssCodeSplit: false,
    rollupOptions: {
      input: path.resolve(__dirname, 'index.example.html'),
      output: {
        format: 'iife',
        entryFileNames: 'bundle.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith('.css')) {
            return 'bundle.css';
          }
          return '[name].[ext]';
        },
      },
    },
  },
});
