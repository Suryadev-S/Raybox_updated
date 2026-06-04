import path from 'path';
import { defineConfig } from 'vite';

// https://vitejs.dev/config
export default defineConfig({
    build: {
        rollupOptions: {
            external: ["sharp", "better-sqlite3"],
        }
    },
    resolve: {
        alias: {
            "@electron": path.resolve(__dirname, "src/electron"),
            "@renderer": path.resolve(__dirname, "src/renderer"),
            "@shared": path.resolve(__dirname, "src/shared"),
        }
    },
});
