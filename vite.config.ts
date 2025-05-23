
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode, command }) => {
    // Support build:dev command by treating it as development mode when building
    const effectiveMode = command === 'build' && process.env.NODE_ENV === 'development' ? 'development' : mode;
    const env = loadEnv(effectiveMode, '.', '');
    
    return {
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      plugins: [
        react(),
        (effectiveMode === 'development' || command === 'serve') && componentTagger(),
      ].filter(Boolean),
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      server: {
        host: "::",
        port: 8080
      }
    };
});
