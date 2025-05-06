import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      port: 3000,
      host: "0.0.0.0",
    },
    plugins: [react()],
    define: {
      GH_TOKEN: JSON.stringify(env.GH_TOKEN || ""),
      GH_TARGET_REPOSITORY_OWNER: JSON.stringify(
        env.GH_TARGET_REPOSITORY_OWNER || ""
      ),
      GH_TARGET_REPOSITORY_NAME: JSON.stringify(
        env.GH_TARGET_REPOSITORY_NAME || ""
      ),
    },
  };
});
