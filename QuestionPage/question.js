"use strict";

import { setUpQuestionTimer } from "../Questions/timer";
import "../style.scss";

const nextBtnStr = `
  <button type="button" class="next-btn">Next -></button>
`;

const formData = new URLSearchParams(location.search);
const level = formData.get("level");
const category = formData.get("quiz_category");
const noOfQues = formData.get("noOfQues");
const totalTime = noOfQues * 60; //seconds

let score = 0;

// fetch data from json
async function fetchdata() {
  try {
    const response = await fetch(`../Questions/HTML.json`);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
}

// get & set data for questions
const questions = await fetchdata();
const questionArr = questions.slice(0, noOfQues);
let curQuestion = { index: 0, ques: questionArr[0] };

// Setting up the question's html
function questionHeaderHtml() {
  const htmlStr = `
        <div id="progress-wrapper">
          <!-- <progress id="quesProgress" value="0" max="15"></progress> -->
        </div>
        <div id="score-wrapper">
          <p class="score">Score : <span id="scoreCount">0</span></p>
        </div>
        <div class="ques-timer-wrapper">
          <p id="quesTimer"></p>
        </div>
        <div class="total-timer-wrapper">
          <p id="totalTimer"></p>
        </div>
        <div class="result-count-wrapper">
          <p class="correct-ques"></p>
          <p class="incorrect-ques"></p>
        </div>
    `;

  return htmlStr;
}

function questionBodyHtml(question) {
  const htmlStr = `
      <div class="ques-text">
        ${question?.questionText}
      </div>
      <div class="option-wrapper">
        ${optionHtml(question?.options)}
      </div>
  `;

  return htmlStr;
}

function optionHtml(optArr) {
  const resultStr = optArr?.reduce(
    (acc, curValue, curIndex) => acc + getOptStr(curValue, curIndex),
    ""
  );

  function getOptStr(option, optNo) {
    return `
      <button type="button" class="option" value="${option.text}">
        <p class="opt-number">${optNo + 1}</p>
        <div class="opt-text">${option.text}</div>
      </button>
    `;
  }

  return resultStr;
}

// init question header
document.querySelector("#question-header").innerHTML = questionHeaderHtml();
function setUpQuestionHeader() {
  const timerDiv = document.querySelector("#progress-wrapper");
  let secondss = setUpQuestionTimer(timerDiv);

  document.querySelector("#scoreCount").innerHTML = score;
}
setUpQuestionHeader();

// init question body
function setUpQuestionBody() {
  document.querySelector("#question-body").innerHTML = questionBodyHtml(
    curQuestion.ques
  );
  Array.from(document.getElementsByClassName("option")).forEach((element) => {
    element.addEventListener("click", (e) => optionClick(e));
  });
}
setUpQuestionBody();

// option click event
function optionClick(event) {
  let optionIndex = curQuestion?.ques?.options?.findIndex(
    (x) => x.text == event.currentTarget.value
  );

  Array.from(document.getElementsByClassName("option")).forEach(
    (x) => (x.disabled = true)
  );

  let isCorrect = curQuestion?.ques?.options[optionIndex]?.isCorrect;

  if (isCorrect) {
    score++;
    document.querySelector("#scoreCount").innerHTML = score;
    alert("Congratulations!");
  }
}

// set next btn and add event listner to it
document.querySelector("#next-btn-wrapper").innerHTML = nextBtnStr;
document
  .querySelector(".next-btn")
  .addEventListener("click", () => onNextClick());

function onNextClick() {
  curQuestion = {
    index: curQuestion.index + 1,
    ques: questionArr[curQuestion.index + 1],
  };
  setUpQuestionBody();
  setUpQuestionHeader();
}

document.addEventListener("questionTimeUp", function () {
  onNextClick();
});
