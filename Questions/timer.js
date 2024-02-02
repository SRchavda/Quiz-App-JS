"use strict";

import { convertToMinutes } from "../helper";

let totalSeconds = 1;
let seconds = 1;
let intervalId;

function initTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    seconds = 1;
  }
}

function startTimer(element, timePerQuestion) {
  intervalId = setInterval(function () {
    if (seconds == timePerQuestion) {
      const event = new Event("questionTimeUp");
      document.dispatchEvent(event);
    }

    element.innerHTML = timePerQuestion - seconds;
    seconds++;
  }, 1000);
}

export function setUpQuestionTimer(element, timePerQuestion) {
  initTimer();
  startTimer(element, timePerQuestion);
  return seconds;
}

export function getTime() {
  return { seconds: seconds, totalSeconds: totalSeconds };
}

export function startTotalTimer(element, totalTime) {
  console.log("total");
  setInterval(function () {
    if (totalSeconds == totalTime) {
      const event = new Event("quizTimeUp");
      document.dispatchEvent(event);
    }
    element.innerHTML = convertToMinutes(totalTime - totalSeconds);
    totalSeconds++;
  }, 1000);
}
