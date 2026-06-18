// サイトにアクセスした瞬間に結果を計算して表示あいうえお
window.addEventListener("DOMContentLoaded", () => {
  // --- 【追加】ロック画面のクリック解除処理 ---
  const lockOverlay = document.getElementById("resultLockOverlay");
  if (lockOverlay) {
    lockOverlay.addEventListener("click", () => {
      // 1. ロック画面を消す
      lockOverlay.style.display = "none";
      
      // 2. 空の再生を行い、このページ内での音声ロックを「確実」に解除する
      scrollGhostAudio.play().then(() => {
        scrollGhostAudio.pause(); // すぐ一時停止して音が出ないようにする
        scrollGhostAudio.currentTime = 0; // 再生位置を最初に戻す
      }).catch(e => console.log("Audio unlock failed:", e));
    });
  }
    try {
    // ローカルストレージにデータがあるか確認
    const hasData = localStorage.getItem("score");

    if (hasData === null) { // まだ診断していない場合
      const noResultTarget = document.getElementById("noResult"); // htmlのnoResultを取得
      if (noResultTarget) {
        noResultTarget.innerText = "まだ結果はありません"; // 画面表示
      }
      return; // ここで処理を終了
    }

    let score = Number(localStorage.getItem("score")); // ローカルストレージからscoreを取得して数値に変換

    const minScore = 30;
    const maxScore = 120;

    const fearPercent = Math.round(
      ((score - minScore) / (maxScore - minScore)) * 100
    );

    let resultText = ""; // 結果のテキストを入れる変数
    let resultDesc = ""; // 結果の説明を入れる変数

    // 最大スコアに応じて表示テキストを決定
    if (score <= 44) {
      resultText = '<img src="./img/result.png" class="resultImg">';

      resultDesc = `
      <h4 class="fearRate">怖がり度 ${fearPercent}%</h4>
      <h3>しんだんきろく</h3>
      <div class="resultmessage">あなたは恐怖への耐性が極めて高いようです。異変を目の前にしても冷静さを失いません。</div>

      <h3>けいこく</h3>
      <div class="resultmessage">危険な場所へ近づきすぎる傾向があります。好奇心には注意してください。</div>

      <h3>かんさつけっか</h3>
      <div class="resultmessage">心霊遭遇率は低いと判定されました。</div>`;
    } else if (score <= 59) {
      resultText = '<img src="./img/result.png" class="resultImg">';

      resultDesc = `
      <h4 class="fearRate">怖がり度 ${fearPercent}%</h4>
      <h3>しんだんきろく</h3>
      <div class="resultmessage">あなたは恐怖に対して一定の耐性を持っています。異変を感じても落ち着いて行動できます。</div>

      <h3>けいこく</h3>
      <div class="resultmessage">油断していると予想外の恐怖に巻き込まれる可能性があります。</div>

      <h3>かんさつけっか</h3>
      <div class="resultmessage">心霊遭遇率は平均よりやや低めです。</div>`;

    } else if (score <= 74) {
      resultText = '<img src="./img/result.png" class="resultImg">';

      resultDesc = `
      <h4 class="fearRate">怖がり度 ${fearPercent}%</h4>
      <h3>しんだんきろく</h3>
      <div class="resultmessage">あなたは一般的な恐怖心を持っています。異変を察知する感覚は標準的です。</div>

      <h3>けいこく</h3>
      <div class="resultmessage">深夜の探索や単独行動は推奨されません。</div>

      <h3>かんさつけっか</h3>
      <div class="resultmessage">心霊遭遇率は平均的と判定されました。</div>`;

    } else {
      resultText = '<img src="./img/result.png" class="resultImg">';

      resultDesc = `
      <h4 class="fearRate">怖がり度 ${fearPercent}%</h4>
      <h3>しんだんきろく</h3>
      <div class="resultmessage">あなたは恐怖を敏感に察知する能力を持っています。わずかな異変にも気付くでしょう。</div>

      <h3>けいこく</h3>
      <div class="resultmessage">夜間に一人でこのサイトを閲覧することは推奨されません。</div>

      <h3>かんさつけっか</h3>
      <div class="resultmessage">心霊遭遇率が高い可能性があります。背後には十分注意してください。</div>`;
    }

    const resultTarget = document.getElementById("result"); // result.htmlのresultを取得
    if (resultTarget) {
      // resultTextとresultDescを結合してhtmlに表示
      resultTarget.innerHTML = resultText + resultDesc; 
    } else {
      throw new Error("Textが見つかりません"); // エラー表示
    }

  } catch (error) {
    console.error("Error:", error); // エラー表示
  }
});

const ghostWoman = document.getElementById("ghostWoman2");
let ghostShown = false; // 1回だけ実行するためのフラグ

// スクロールでお化けが出たときの音声ファイルを読み込む
const scrollGhostAudio = new Audio('./noise3.m4a'); 

window.addEventListener("scroll", () => {
    // 150px以上スクロールし、かつ「まだ1回もイベントが起きていない」ときだけ実行
    if (window.scrollY > 150 && !ghostShown) {

        ghostShown = true; // 【重要】即座にtrueにして固定。これで2回目以降は絶対に動きません。

        // 音声を最初から1回だけ再生する
        scrollGhostAudio.currentTime = 0;
        scrollGhostAudio.play().catch(error => {
            console.log("音声再生がブロックされました:", error);
        });

        // おばけ画像を表示
        if (ghostWoman) {
            ghostWoman.classList.add("show");

            // 1.6秒後におばけの画像だけを静かに消す
            setTimeout(() => {
                ghostWoman.classList.remove("show");
            }, 1600);
        }
    }
});