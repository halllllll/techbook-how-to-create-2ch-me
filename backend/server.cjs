const path = require("path");
const fs = require("fs");
const jsonServer = require("json-server");

const server = jsonServer.create();
const router = jsonServer.router("db.json");
const middlewares = jsonServer.defaults();

const defaultPort = 8062;
const root = path.resolve(__dirname, "../");
const tempPortFilePath = path.join(root, "temp-port.txt");

server.use(middlewares);
server.use(router);
server.use(jsonServer.bodyParser);

function startServer(port) {
	server
		.listen(port, () => {
			console.log(`json-server is running on port ${port}`);
			fs.writeFileSync(tempPortFilePath, port.toString());
		})
		.on("error", (err) => {
			const code = err.code;
			if (code === "EADDRINUSE") {
				console.log(`Port ${port} is in use, trying another port.`);
				startServer(port + 1);
			} else {
				console.error(err);
			}
		});
}

startServer(defaultPort);

// 正常終了時に起動ポート番号一時ファイル消去
process.on("exit", () => {
	if (fs.existsSync(tempPortFilePath)) {
		fs.unlinkSync(tempPortFilePath);
	}
});

// 異常終了時も
process.on("SIGINT", () => {
	if (fs.existsSync(tempPortFilePath)) {
		fs.unlinkSync(tempPortFilePath);
	}
	process.exit();
});
