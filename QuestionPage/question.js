"use strict";

import {
  getTime,
  setUpQuestionTimer,
  startTotalTimer,
} from "../Questions/timer";
import "../style.scss";

const nextBtnStr = `
  <button type="button" class="next-btn">Next <span><i class="fa-solid fa-arrow-right"></i></span></button>
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

// find random questions
function getRandomQuestions() {
  let randomIds = [];
  for (let i = 0; i < noOfQues; i++) {
    const a = Math.floor(Math.random() * questions.length + 1);
    !randomIds.includes(a) && randomIds.push(a);
  }

  return questions.filter((x) => randomIds.includes(x.id));
}

// const questionArr = questions.slice(0, noOfQues);
const questionArr = getRandomQuestions();
let curQuestion = { index: 0, ques: questionArr[0] };
let answerdQue = [];

// Setting up the question's html
function questionHeaderHtml() {
  const htmlStr = `
        <div class="total-timer-wrapper">
          <p id="totalTimer">
            Time left <br> <span id="current-time">00 : 00</span>
          </p>
        </div>
    `;

  return htmlStr;
}

function questionBodyHtml(question) {
  const htmlStr = `
    <div class="que-content">
      <div class="que-conter">
        <p>Question <span class="cur_que_num"></span>/${noOfQues}</p>
      </div>
      <div class="ques-text"></div>
      ${
        question?.codeAvailable
          ? `<div class="question-code">
        <pre>${question?.codeContent}</pre>
      </div>`
          : `<div></div>`
      }
      <div class="option-wrapper">
        ${optionHtml(question?.options)}
      </div>
    </div>
    <div class="que-timer">
      <div>timer progress circle</div>
      <p id="ques-seconds">58</p>
      <p>seconds</p>
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
        <!-- <p class="opt-number">${optNo + 1}</p> -->
        <div class="opt-text opt-${optNo}"></div>
      </button>
    `;
  }

  return resultStr;
}

// init question header
function setUpQuestionHeader() {
  document.querySelector("#question-header").innerHTML = questionHeaderHtml();
  startTotalTimer(document.querySelector("#current-time"), totalTime);
}
setUpQuestionHeader();

// init question body
function setUpQuestionBody() {
  document.querySelector("#question-body").innerHTML = questionBodyHtml(
    curQuestion.ques
  );

  const timerDiv = document.querySelector("#ques-seconds");
  console.log(timerDiv);
  let secondss = setUpQuestionTimer(timerDiv, 60);
  console.log(secondss);

  document.querySelector(".cur_que_num").innerHTML = curQuestion.index + 1;

  document.querySelector(".ques-text").textContent =
    curQuestion?.ques?.questionText;

  curQuestion?.ques?.options?.map((x, i) => {
    document.querySelector(`.opt-${i}`).textContent = x.text;
  });

  Array.from(document.getElementsByClassName("option")).forEach((element) => {
    element.addEventListener("click", (e) => optionClick(e));
  });
}
setUpQuestionBody();

function setUpQuestionFooter() {
  document.querySelector("#ques-sum").innerHTML = `
  <div id="correct-wrapper" class="toast-wrapper">
    <p class="correct"><i class="fa-solid fa-circle-check"></i><span id="correctCount">0</span></p>
  </div>
  <div id="incorrect-wrapper" class="toast-wrapper">
    <p class="incorrect"><i class="fa-solid fa-circle-xmark"></i><span id="inCorrectCount">0</span></p>
  </div>
  `;

  document.querySelector("#correctCount").innerHTML = correctAns;
  document.querySelector("#inCorrectCount").innerHTML = IncorrectAns;
}
setUpQuestionFooter();

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
    time: getTime().seconds,
  };
  answerdQue.push(newQuestion);

  var x = document.querySelector("#ques-feedback");
  x.className = "";
  x.classList.add("show");

  let isCorrect = curQuestion?.ques?.options[optionIndex]?.isCorrect;

  if (isCorrect) {
    correctAns++;
    streak++;
    document.querySelector("#correctCount").innerHTML = correctAns;
    x.classList.add("correct");
    x.textContent = "Correct !";
  } else {
    IncorrectAns++;
    const oldStreak = localStorage.getItem("streak");
    oldStreak > streak ? null : localStorage.setItem("streak", streak);
    streak = 0;
    document.querySelector("#inCorrectCount").innerHTML = IncorrectAns;
    x.classList.add("wrong");
    x.textContent = "Incorrect !";
  }

  setTimeout(function () {
    x.classList.remove("show");
  }, 3000);
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

    location.href = "../Summary/index.html";
  }
}

document.addEventListener("questionTimeUp", function () {
  onNextClick();
  skiped++;
});

document.addEventListener("quizTimeUp", function () {
  const queSum = {
    correct: correctAns,
    incorrect: IncorrectAns,
    skiped: skiped,
  };

  const oldStreak = localStorage.getItem("streak");
  localStorage.setItem("streak", streak > oldStreak ? streak : oldStreak);
  localStorage.setItem("ansQue", JSON.stringify(answerdQue));
  localStorage.setItem("queSum", JSON.stringify(queSum));

  location.href = "../Summary/index.html";
});
