"use strict";

let seconds = 1;
let intervalId;

function initTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    seconds = 0;
  }
}

function startTimer(element) {
  intervalId = setInterval(function () {
    element.innerHTML = `${seconds} seconds`;
    seconds++;
  }, 1000);
}

export function setUpQuestionTimer(element) {
  initTimer();
  startTimer(element);
}
