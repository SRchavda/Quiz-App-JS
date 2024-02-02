"use strict";

import "./summary.scss";

const passingThresold = 35; //%

// Set the Quiz Summary

const answeredQue = JSON.parse(localStorage.getItem("ansQue"));
const queSum = JSON.parse(localStorage.getItem("queSum"));
const totalQue = localStorage.getItem("totalQue");
const totalTime = localStorage.getItem("totalTime");
const { correct, incorrect, skiped } = queSum;
const streak = localStorage.getItem("streak");

// Result - Win or Lose
const isWin = (correct / totalQue) * 100 >= passingThresold;

// Correct ans streak

// Average time per question
const takenTime = answeredQue
  .reduce((acc, curValue) => acc + curValue.time, 0)
  .toFixed(2);
const avgTime = (takenTime / totalQue).toFixed(2);

// set up quiz analytics
const title = document.querySelector("#summary-title");
title.innerHTML = isWin ? "Well Done!!" : "Nice Try!!";
title.classList.add(isWin ? "sum-win" : "sum-lose");

document.querySelector("#correct-sum").innerHTML = `Correct - ${correct}`;
document.querySelector("#incorrect-sum").innerHTML = `Incorrect - ${incorrect}`;
document.querySelector("#skiped-sum").innerHTML = `Skiped - ${skiped}`;
document.querySelector("#summary-streak").innerHTML = `Streak - ${streak}`;
document.querySelector("#taken-time").innerHTML =
  "Time taken - " + takenTime + " seconds";
document.querySelector("#avg-time").innerHTML =
  "Average time - " + avgTime + " seconds";

// Set Questions and options

function questionForSummaryHtml(que, optionFun, queIndex) {
  return `
    <div class="summary-que">
        <div class="que-wrapper">
          <p class="summary-que-title que-${queIndex}"></p>
        </div>
        <div class="summary-option-wrapper">${optionFun(queIndex)}</div>
    </div>`;
}

function summaryQueOption(option, optIndex, queIndex) {
  console.log(option);
  return `
        <div class="summary-option">
          <p class="opt-${queIndex}${optIndex}"></p>
          <div>
            ${
              option.isCorrect ? `<i class="fa-solid fa-circle-check"></i>` : ""
            }
            ${option.isAns ? `<i class="fa-solid fa-circle-dot"></i>` : ""}
          </div>
        </div>
    `;
}

function setUpOptions(optionArr, queIndex) {
  return optionArr?.reduce(
    (acc, curOpt, curIndex) =>
      acc + summaryQueOption(curOpt, curIndex, queIndex),
    ""
  );
}

function setUpQuestionForSummary() {
  return answeredQue.reduce(
    (acc, curValue, curIndex) =>
      acc +
      questionForSummaryHtml(
        curValue,
        (queIndex) => setUpOptions(curValue?.options, queIndex),
        curIndex
      ),
    ""
  );
}

document.querySelector("#summary-que-wrapper").innerHTML =
  setUpQuestionForSummary();

answeredQue.map((x, i) => {
  document.querySelector(`.que-${i}`).textContent = x?.questionText;
  x?.options.map((y, j) => {
    document.querySelector(`.opt-${i}${j}`).textContent = y?.text;
  });
});
