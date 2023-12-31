const path = require('path');
const fs = require('fs');
const jsonServer = require('json-server');

const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();

const defaultPort = 8062;
const BASE_URL = `http://localhost:${defaultPort}`;
const root = path.resolve(__dirname, '../');
const tempPortFilePath = path.join(root, 'temp-port.txt');

server.use(jsonServer.bodyParser);

server.post('/threads', (req, res, next) => {
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

server.post('/threads/:threadId/comments', async (req, res, next) => {
  const threadId = req.params.threadId;
  if (Number.isNaN(Number(threadId))) {
    return res.status(400).json({
      message: '無効なスレッドIDです',
    });
  }
  if (!req.body.commentContent) {
    return res.status(400).json({
      message: 'コメントが入力されていません',
    });
  }

  // コメントの数を数える（上限10個）
  const resp = await fetch(`${BASE_URL}/comments`);
  const allcomennts = await resp.json();

  const commentsInThread =
    allcomennts.length > 0
      ? allcomennts.filter((comment) => comment.threadId === threadId).length
      : 0;
  if (commentsInThread >= 10) {
    return res.status(400).json({
      message: 'スレッドのコメントは10個までです',
    });
  }

  try {
    // スレッドのコメントをカウントアップしコメントデータを作成する
    const thraedResp = await fetch(`${BASE_URL}/threads/${threadId}`);
    if (!thraedResp.ok) {
      throw new Error('スレッドのデータを取得できませんでした');
    }

    const threadData = await thraedResp.json();

    threadData.commentTotal += 1;
    const newCommentTotal = threadData.commentTotal;

    const updateResp = await fetch(`${BASE_URL}/threads/${threadId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(threadData),
    });
    if (!updateResp.ok) {
      throw new Error('コメント数の更新二失敗しました');
    }

    // リクエストボディからコメントデータの作成（dbへの登録自体はミドルウェアがやる）
    req.body.commentNo = newCommentTotal;
    if (!req.body.commenter) {
      req.body.commenter = '名無し';
    }
    // ???
    if (!req.user) {
      req.body.userId = 0;
    } else {
      req.body.userId = req.user.id;
    }

    const now = new Date();
    const japanTimeOffset = 9 * 60; // 日本時間のオフセット（分）
    // 現在のUTC時刻に日本時間のオフセットを加算
    now.setMinutes(now.getMinutes() + japanTimeOffset);
    // 日本時間の日時文字列を作成
    const formattedDate = now.toISOString().replace('Z', '+09:00');
    req.body.createdAt = formattedDate;
  } catch (err) {
    return res.status(500).json({
      message: `internal server error: ${err}`,
    });
  }

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
