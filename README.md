[ReactとTypeScriptで2chみたいな掲示板を作る ](https://techbookfest.org/product/uGAcppti6jMYVaKZSKjSLS?productVariantID=8Ee4JmqUGuhgD0f6fBzaW5)を写経するリポジトリ

# dif

## devcontainer
devcontainerを使う
## json-serverをnodeで動かす
devcontainer環境だからなのか、

- nodemon経由だとAPI叩くところでたまにエラーになる
- なぜかたまにdb.jsonが空になってしまう

という問題があった。直接`json-server`を起動するようにしたら大丈夫になった

```backend/package.json
{
    "scripts": {
        "start": "node server.cjs"
    },
    略
```

ついでに、`json-server`の起動ポート番号をハードコーディングじゃなくてviteからも読めるように一時ファイルに吐き出して共有してみた。ポート競合を避けるようにした。あと終了時は消すようにしてみたが動くかどうかわからない

```cjs
const defaultPort = 8062;
const root = path.resolve(__dirname, "../");
const tempPortFilePath = path.join(root, "temp-port.txt");

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
```

## vite.config.tsのプロキシ設定
上記のように`json-server`の起動を変更したのに伴ってこちらも修正。とはいえ、共通のポートを使うようにするようにしただけ。デフォルト値は気分であえて全然違うのを設定しているがfetch時になにかおかしいことを判別しやすくなるかな？程度でとくに意味はない

```ts:vite.config.ts
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

//　略
	const backendPort = getBackendPort()
	return defineConfig({
		plugins: [react()],
		server: {
			proxy: {
				"/api": {
					target: `http://localhost:${backendPort}`,
```

## biome

ついでに`biome.js`を導入する。プロジェクトルートでインストールし、frontend/backend両方に効かせる

```shell
yarn add -D @biomejs/biome -W
npx @biomejs/biome init
```

[biome.json](./biome.json)を参照

## 画面
デザインコンポーネントに[Chakra-ui](https://chakra-ui.com/)を使う． **ちゃんとデザインを整えるつもりは一切なく、単に機能面での理由。** 見た目以外の差異を中心に書く

- formまわりが若干異なる気がする
  - `useRef`とエラー。本書では「どのInputが不正か」をちゃんとやってるが、ここでは特定のフォームの中全体で考えることにして横着した

## react-router-dom
本書では`BrowserRouter`コンポーネントを使っている。今回はv6推奨の[createBrowserRouter](https://reactrouter.com/en/main/routers/create-browser-router)を導入してみた。

## suspense / Tanstack Query