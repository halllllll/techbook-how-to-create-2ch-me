[ReactとTypeScriptで2chみたいな掲示板を作る ](https://techbookfest.org/product/uGAcppti6jMYVaKZSKjSLS?productVariantID=8Ee4JmqUGuhgD0f6fBzaW5)を写経するリポジトリ

# dif

## やったところ
コメントの投稿まで。ユーザー管理は実装してない

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

```ts
// vite.config.ts
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

## date-fns v3
日時のフォーマット。だいそれたことをしているわけではないが、書いてる途中で[ごく最近(12/03)](https://blog.date-fns.org/v3-is-out/)`date-fns`がメジャーアップデートされてv3になったので、ついでに導入した

## react-router-dom
本書では`BrowserRouter`コンポーネントを使っている。今回はv6推奨の[createBrowserRouter](https://reactrouter.com/en/main/routers/create-browser-router)を導入してみた。

## react-error-boundary
（後述する）データの取得とかを`Suspense`を使ってやるつもりだったので，どうせならよく併用されるらしい`react-error-boundary`を導入した。

```tsx
<Heading as="h2">スレッドの新規作成</Heading>
<ErrorBoundary
	FallbackComponent={ErrorFallback}
	onError={() => {
		setErrCount(errCount + 1);
	}}
>
	{errCount > 0 && (
		<Box>
		<Text as={'p'} color={'tomato'} fontSize={'xl'}>{`エラー回数: ${errCount}`}</Text>
		</Box>
	)}
	<ThreadForm threadsDispatch={threadsDispatch} />
</ErrorBoundary>
```

エラーが生じた際に専用の状態を管理しなくても、指定したフォールバックコンポーネントの画面を表示してくれる。

## Suspense / TanStack Query
スレッドの取得の部分で`Suspense`を使ってみることにした。単に標準fetchだとエラーバウンダリに補足されなかったり，無限にPromiseがsettledにならず止まらなかったり，`ErrorBoundary`のFallbackComponentとして設定しているエラー復帰も効かない（これはサスペンドされているコンポーネントの状態が変わらないせい？）。生fetchで回避する書き方がわからないので諦めて`TanStack Query`の公式ページに載っているやり方をそのまま使った。

[TanStack Query v5 - Suspense](https://tanstack.com/query/latest/docs/react/guides/suspense)

## 状態管理（クエリキャッシュ）
本書では画面に表示するスレッドのリストの状態管理および更新状況（ローディングやエラー）をContext経由でReducerで行っている。DBであるjson-serverから取得したデータをuseEffectを使って初期化している。今回は`TanStack Query`を使うことにしたので、データフェッチによって取得したクエリキャッシュはすべてTanStack Queryに寄せる。