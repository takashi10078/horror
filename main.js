// htmlの要素取得
const form = document.getElementById("sindanForm"); // index.htmlのフォーム
const questions = document.getElementById("questions"); // 質問
const submitBlock = document.getElementById("submitBlock"); // 診断ボタン
const ghostWoman = document.getElementById("ghostWoman"); // おばけの女性
const scaryGhosts = document.querySelectorAll(".scary-ghost");
const answerTimer = document.getElementById("answerTimer");
let countdownTimerId = null;
let quizCountdownId = null;
let quizGhostTimeoutId = null;
const timerAudio = new Audio('./timer.mp3'); // 音声ファイルの読み込み
const ghostAudio = new Audio('./noise.m4a'); // おばけの出現音
const transitionAudio = new Audio('./noise2.m4a'); // 遷移音
const startBtn = document.getElementById("startBtn"); // startBtnを取得
const textBox = document.querySelector(".text-box"); // 質問フォームを取得 
const startOverlay = document.getElementById("startOverlay");
const bgm = document.getElementById("bgm");
const handsContainer = document.getElementById("handsContainer");let ghostTimerId = null;
let ghostShown = false; // scary image has already been shown

function showGhostWoman() {
  if (scaryGhosts.length === 0 || ghostShown) return;

  ghostShown = true;
  scaryGhosts.forEach((ghost) => ghost.classList.add("show"));

  // おばけが出た瞬間に効果音を再生
  ghostAudio.currentTime = 0;
  ghostAudio.play().catch(error => {
    console.log("おばけ音の再生に失敗しました:", error);
  });

  setTimeout(() => {
    scaryGhosts.forEach((ghost) => ghost.classList.remove("show"));
  }, 3000);
}

function startAnswerTimer() {
  let timerSeconds = 30; // 30秒からスタート
  ghostShown = false;

  // 動いているタイマーをすべてリセット
  clearInterval(quizCountdownId);
  clearTimeout(quizGhostTimeoutId);

  // おばけの音も念のため止めておく
  ghostAudio.pause();
  ghostAudio.currentTime = 0;

  // カウントダウン音声を最初から再生する設定
  timerAudio.pause();
  timerAudio.currentTime = 0;
  
  // 音声を再生（スタートボタンをクリックしているので、Chromeの規約をクリアして100%鳴ります）
  timerAudio.play().catch(error => {
    console.log("オーディオの再生に失敗しました:", error);
  });

  if (answerTimer) {
    answerTimer.textContent = "00:30";
  }

  // 1秒ごとに実行されるタイマー
  quizCountdownId = setInterval(() => {
    timerSeconds--;

    // 画面の残り秒数を正確に更新（1秒ごと）
    if (answerTimer) {
      const mins = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
      const secs = String(timerSeconds % 60).padStart(2, "0");
      answerTimer.textContent = `${mins}:${secs}`;
    }

    // タイマー終了処理
    if (timerSeconds <= 0) {
      clearInterval(quizCountdownId);
      timerAudio.pause(); // 30秒経ったらカウントダウン音を止める
    }
  }, 1000);

  // 30秒後におばけを表示
  quizGhostTimeoutId = setTimeout(showGhostWoman, 30000);
}
// jsonファイル取得 Ajax使用
async function loadQuestions() {
  try { // 例外処理
    const response = await fetch('./questions.json'); // jsonファイルの読み込み
    
    if (response.ok == false) { // .okはHTTPステータスコードが200~299の範囲のときにtrueになるex)404エラーはfalse
      throw new Error('JSONファイルの読み込みに失敗しました'); // エラー表示
    }

    const data = await response.json(); // jsonファイルから送られてきたよくわからないデータをawait（解析するから少し待っていて）

    // 読み込んだデータを元にHTML要素を生成
    for(const q of data) { // jsonファイルの一つ一つの要素を取り出す
      const pTag = document.createElement("p"); // htmlのpタグを作成
      pTag.innerHTML = `${q.text}<br>`; // jsonファイルの一つの要素の質問文（text）を呼び出し表示

      let i = 0; // ループ用の変数を定義
      for(const opt of q.options) { // 外側のループで取得した一つの要素のoptionsを取得
        const label = document.createElement("label"); // htmlのラベルを作成
        const input = document.createElement("input"); // htmlのinputを作成
        input.type = "radio"; // ラジオボタン作成
        input.name = `q${q.id}`; //jsonファイルのidをinputのname属性に入力
        input.value = opt.value; //jsonファイルのvalueをinputのvalue属性に入力
        
        if (i === 0) {
          input.required = true; // どれか一つを選択しないとエラー表示
        }

        label.appendChild(input); // ラベルの中にラジオボタンを入れる<label><input type="radio"></label>
        label.appendChild(document.createTextNode(` ${opt.text}`)); // 選択肢を追加する
        pTag.appendChild(label); // 質問文の入ったpTagに追加する
      };

      questions.appendChild(pTag); // 最後にすべてをhtmlに表示する
    };

    if (submitBlock) {
      submitBlock.style.display = "block"; // もし診断ボタンがあるなら表示してください(htmlで診断ボタンを非表示にしているから)
    }

  } catch (error) {
    console.error('Error:', error); // エラー表示
    questions.innerHTML = '<p style="color:red;">質問の読み込み中にエラーが発生しました。</p>'; //エラーメッセージ
  }
}

// 結果計算
if(form){
  form.addEventListener("submit", (e) => { // (e)イベント処理 診断ボタンを押したとき
    e.preventDefault(); // 計算をするのでいったんresult.htmlに飛ばすのをやめる

    // 【追加】ボタンが押されたので、すべてのタイマーと音を強制停止する
    clearInterval(quizCountdownId);
    clearTimeout(quizGhostTimeoutId);
    
    if (timerAudio) {
      timerAudio.pause();
      timerAudio.currentTime = 0;
    }
    if (ghostAudio) {
      ghostAudio.pause();
      ghostAudio.currentTime = 0;
    }

    transitionAudio.currentTime = 0;
    transitionAudio.play().catch(error => {
      console.log("演出音の再生に失敗しました:", error);
    });

    //結果項目の変数定義
    let score = 0; // 総合スコア

    for(let i = 1; i <= 30; i++){ // 質問を1から30までループ
      let selected = document.querySelector(`input[name="q${i}"]:checked`); // 質問番号を取得
      if(!selected) continue; // もし選択されていなかったらもう一度
      let value = Number(selected.value); // valueに値を入れる

      score += value; // 総合スコアに加算
    }

    localStorage.setItem("score", score);

    // 遷移演出開始
    document.body.classList.add("result-transition");

    // 10秒後に結果へ
    setTimeout(() => {
        location.href = "result.html";
    }, 10000);
  });
}


if(startBtn){
  startBtn.addEventListener("click", () => {

    // BGM停止
    if(bgm){
      bgm.pause();
      bgm.currentTime = 0;
    }

    //「診断スタート」ボタンのある画面を消す
    if(textBox){ textBox.style.display = "none"; }

    // 診断フォームを表示
    if(form){ form.style.display = "block"; }

    // 質問を読み込む
    loadQuestions();

    // タイマー開始（この中でtimer.mp3が再生される）
    startAnswerTimer();
  });
}


if(startOverlay){
    startOverlay.addEventListener("click", () => {

        clearInterval(handInterval);

        // BGM再生
        bgm.play().catch(error => {
            console.log("BGM再生失敗:", error);
        });

        // 黒画面をフェードアウト
        startOverlay.classList.add("hide");

        // 完全に削除
        setTimeout(() => {
            startOverlay.remove();
        }, 1500);
    });
}

function spawnHand() {
    if (!handsContainer) return;

    const hand = document.createElement("img");
    hand.src = "./img/hand2.png";
    hand.classList.add("scary-hand");

    // 1. ランダムサイズの設定
    const size = 150 + Math.random() * 150;
    hand.style.width = size + "px";

    // 2. 中央の文字エリアを避ける配置ロジック
    const width = window.innerWidth;
    const height = window.innerHeight;
    const centerX = width / 2;
    const centerY = height / 2;

    // 避けたい中央エリアのサイズ（文字の大きさに合わせて調整してください）
    const safeZoneWidth = 400; 
    const safeZoneHeight = 200;

    let x, y;

    // 中央エリア以外に配置されるまで座標を再計算
    do {
        x = Math.random() * width;
        y = Math.random() * height;
    } while (
        x > centerX - safeZoneWidth / 2 &&
        x < centerX + safeZoneWidth / 2 &&
        y > centerY - safeZoneHeight / 2 &&
        y < centerY + safeZoneHeight / 2
    );

    // 画像の中心が計算した座標に重なるように配置
    hand.style.left = x + "px";
    hand.style.top = y + "px";

    // 3. 画面中央を向く角度の計算
    const angle = Math.atan2(centerY - y, centerX - x) * 180 / Math.PI;

    // CSSの@keyframesに角度を渡すためのカスタムプロパティ（変数）を設定
    hand.style.setProperty('--angle', `${angle}deg`);
    // 位置ずれを防ぐためJS側での初期トランスフォームを設定
    hand.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;

    handsContainer.appendChild(hand);

    // 4. アニメーション終了後に要素を削除（1.5s = 1500ms）
    setTimeout(() => {
        hand.remove();
    }, 1500);
}

// 500msごとに4つの手を生成
let handInterval = setInterval(() => {
    for (let i = 0; i < 2; i++) {
        spawnHand();
    }
}, 800);