// サイトにアクセスした瞬間に結果を計算して表示
window.addEventListener("DOMContentLoaded", () => { // DOMContentLoaded（ドム・コンテンツ・ローデッド）とは、ブラウザがHTMLの読み込みと解析（パース）を完了し、DOMツリーの構築がすべて終わった時点で発火するJavaScriptのイベント
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
      <h3>診断記録</h3>
      <div class="resultmessage">あなたは恐怖への耐性が極めて高いようです。異変を目の前にしても冷静さを失いません。</div>

      <h3>警告</h3>
      <div class="resultmessage">危険な場所へ近づきすぎる傾向があります。好奇心には注意してください。</div>

      <h3>観察結果</h3>
      <div class="resultmessage">心霊遭遇率は低いと判定されました。</div>`;
    } else if (score <= 59) {
      resultText = '<img src="./img/result.png" class="resultImg">';

      resultDesc = `
      <h4 class="fearRate">怖がり度 ${fearPercent}%</h4>
      <h3>診断記録</h3>
      <div class="resultmessage">あなたは恐怖に対して一定の耐性を持っています。異変を感じても落ち着いて行動できます。</div>

      <h3>警告</h3>
      <div class="resultmessage">油断していると予想外の恐怖に巻き込まれる可能性があります。</div>

      <h3>観察結果</h3>
      <div class="resultmessage">心霊遭遇率は平均よりやや低めです。</div>`;

    } else if (score <= 74) {
      resultText = '<img src="./img/result.png" class="resultImg">';

      resultDesc = `
      <h4 class="fearRate">怖がり度 ${fearPercent}%</h4>
      <h3>診断記録</h3>
      <div class="resultmessage">あなたは一般的な恐怖心を持っています。異変を察知する感覚は標準的です。</div>

      <h3>警告</h3>
      <div class="resultmessage">深夜の探索や単独行動は推奨されません。</div>

      <h3>観察結果</h3>
      <div class="resultmessage">心霊遭遇率は平均的と判定されました。</div>`;

    } else {
      resultText = '<img src="./img/result.png" class="resultImg">';

      resultDesc = `
      <h4 class="fearRate">怖がり度 ${fearPercent}%</h4>
      <h3>診断記録</h3>
      <div class="resultmessage">あなたは恐怖を敏感に察知する能力を持っています。わずかな異変にも気付くでしょう。</div>

      <h3>警告</h3>
      <div class="resultmessage">夜間に一人でこのサイトを閲覧することは推奨されません。</div>

      <h3>観察結果</h3>
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

let ghostShown = false;

window.addEventListener("scroll", () => {
    if (window.scrollY > 150 && !ghostShown) {

        ghostShown = true;

        ghostWoman.classList.add("show");

        setTimeout(() => {
            ghostWoman.classList.remove("show");
        }, 1600);

    }
});