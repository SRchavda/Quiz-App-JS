"use strict";

import { getTime, setUpQuestionTimer } from "../Questions/timer";
import "../style.scss";

const nextBtnStr = `
  <button type="button" class="next-btn">Next -></button>
`;

const formData = new URLSearchParams(location.search);
const level = formData.get("level");
const category = formData.get("quiz_category");
const noOfQues = formData.get("noOfQues");
const totalTime = noOfQues * 60; //seconds

localStorage.setItem("totalQue", noOfQues);
localStorage.setItem("totalTime", totalTime);

let correctAns = 0;
let IncorrectAns = 0;
let skiped = 0;
let streak = 0;

// fetch data from json
async function fetchdata() {
  try {
    const response = await fetch(`../Questions/${category}.json`);
    return await response.json();
  } catch (err) {
    console.log(err);
  }
}

// get & set data for questions
const questions = await fetchdata();
const questionArr = questions.slice(0, noOfQues);
let curQuestion = { index: 0, ques: questionArr[0] };
let answerdQue = [];

// Setting up the question's html
function questionHeaderHtml() {
  const htmlStr = `
        <div id="progress-wrapper">
          <!-- <progress id="quesProgress" value="0" max="15"></progress> -->
        </div>
        <div id="correct-wrapper">
          <p class="correct">Correct : <span id="correctCount">0</span></p>
        </div>
        <div id="Incorrect-wrapper">
          <p class="Incorrect">Incorrect : <span id="inCorrectCount">0</span></p>
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

  document.querySelector("#correctCount").innerHTML = correctAns;
  document.querySelector("#inCorrectCount").innerHTML = IncorrectAns;
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

  const newOption = [...curQuestion?.ques?.options];
  newOption[optionIndex] = { ...newOption[optionIndex], isAns: true };
  const newQuestion = {
    ...curQuestion?.ques,
    options: newOption,
    time: getTime(),
  };
  answerdQue.push(newQuestion);

  let isCorrect = curQuestion?.ques?.options[optionIndex]?.isCorrect;

  if (isCorrect) {
    correctAns++;
    streak++;
    document.querySelector("#correctCount").innerHTML = correctAns;
    //alert("Congratulations!");
  } else {
    IncorrectAns++;
    const oldStreak = localStorage.getItem("streak");
    oldStreak > streak ? null : localStorage.setItem("streak", streak);
    streak = 0;
    document.querySelector("#inCorrectCount").innerHTML = IncorrectAns;
  }
}

// set next btn and add event listner to it
document.querySelector("#next-btn-wrapper").innerHTML = nextBtnStr;
document
  .querySelector(".next-btn")
  .addEventListener("click", () => onNextClick());

function onNextClick() {
  const isLast = curQuestion.index == questionArr.length - 1;

  if (!isLast) {
    curQuestion = {
      index: curQuestion.index + 1,
      ques: questionArr[curQuestion.index + 1],
    };
    setUpQuestionBody();
    setUpQuestionHeader();
  } else {
    const queSum = {
      correct: correctAns,
      incorrect: IncorrectAns,
      skiped: skiped,
    };

    const oldStreak = localStorage.getItem("streak");
    localStorage.setItem("streak", streak > oldStreak ? streak : oldStreak);
    localStorage.setItem("ansQue", JSON.stringify(answerdQue));
    localStorage.setItem("queSum", JSON.stringify(queSum));

    location.href = "../Summary/summary.html";
  }
}

document.addEventListener("questionTimeUp", function () {
  onNextClick();
  skiped++;
});
