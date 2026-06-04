import { defineConfig } from 'vite';
import path from 'path'

// https://vitejs.dev/config
export default defineConfig({
    resolve: {
        alias: {
            "@electron": path.resolve(__dirname, "src/electron"),
            "@renderer": path.resolve(__dirname, "src/renderer"),
            "@shared": path.resolve(__dirname, "src/shared"),
        }
    },
});
