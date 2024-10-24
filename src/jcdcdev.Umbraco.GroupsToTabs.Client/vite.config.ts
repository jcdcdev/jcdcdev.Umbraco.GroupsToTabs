import {defineConfig} from "vite";

export default defineConfig({
    build: {
        lib: {
            entry: ["src/index.ts"],
            formats: ["es"],
        },
        outDir: "../jcdcdev.Umbraco.GroupsToTabs/wwwroot/App_Plugins/jcdcdev.Umbraco.GroupsToTabs/dist/",
        sourcemap: true,
        rollupOptions: {
            external: [/^@umbraco/],
        },
    },
});
