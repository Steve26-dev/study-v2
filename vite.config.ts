import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // GitHub Pages 배포 시 상대 경로 문제 해결을 위해 필수
  build: {
    outDir: 'dist',
  }
});