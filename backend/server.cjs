const path = require('path');
const fs = require('fs');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const defaultPort = 8062;
const root = path.resolve(__dirname, '../');
const tempPortFilePath = path.join(root, 'temp-port.txt');

server.use(jsonServer.bodyParser);

server.post('/threads', (req, res, next) => {
  console.log("よっしゃ〜")
  if (!req.body.title) {
    return res.status(400).json({
      message: 'スレッドのタイトルが入力されていません',
    });
  }
  if (!req.body.topic) {
    return res.status(400).json({
      message: 'スレッドのトピックが入力されていません',
    });
  }

  const now = new Date();
  const japanTimeOffset = 9 * 60; // 日本時間のオフセット（分）
  // 現在のUTC時刻に日本時間のオフセットを加算
  now.setMinutes(now.getMinutes() + japanTimeOffset);
  // 日本時間の日時文字列を作成
  const formattedDate = now.toISOString().replace('Z', '+09:00');
  req.body.createdAt = formattedDate;
  req.body.commentTotal = 0;

  next();
});

function startServer(port) {
  server
    .listen(port, () => {
      console.log(`json-server is running on port ${port}`);
      fs.writeFileSync(tempPortFilePath, port.toString());
    })
    .on('error', (err) => {
      const code = err.code;
      if (code === 'EADDRINUSE') {
        console.log(`Port ${port} is in use, trying another port.`);
        startServer(port + 1);
      } else {
        console.error(err);
      }
    });
}

server.use(middlewares);
server.use(router);

startServer(defaultPort);

// 正常終了時に起動ポート番号一時ファイル消去
process.on('exit', () => {
  if (fs.existsSync(tempPortFilePath)) {
    fs.unlinkSync(tempPortFilePath);
  }
});

// 異常終了時も
process.on('SIGINT', () => {
  if (fs.existsSync(tempPortFilePath)) {
    fs.unlinkSync(tempPortFilePath);
  }
  process.exit();
});
