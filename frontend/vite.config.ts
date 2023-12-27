import fs from "fs";
import { join, resolve } from "path";
import react from "@vitejs/plugin-react-swc";
import { defineConfig, loadEnv } from "vite";

const root = resolve(__dirname, "../");
const tempPortFilePath = join(root, "temp-port.txt");

function getBackendPort() {
	try {
		const port = fs.readFileSync(tempPortFilePath, "utf8");
		console.info(`proxy port: ${port}`);
		return port.trim(); // 余分な空白や改行を削除
	} catch (e) {
		console.error(e);
		console.warn(
			`Cannot read port from ${tempPortFilePath}, defaulting to 8062`,
		);
		return "9999"; // デフォルト値を設定
	}
}

// https://vitejs.dev/config/
export default ({ mode }) => {
	process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
	const backendPort = getBackendPort();
	return defineConfig({
		plugins: [react()],
		server: {
			proxy: {
				"/api": {
					target: `http://localhost:${backendPort}`,
					changeOrigin: true,
					rewrite: (path) => path.replace(/^\/api/, ""),
				},
			},
		},
	});
};
