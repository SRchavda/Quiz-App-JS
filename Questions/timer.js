"use strict";

let seconds = 1;
let intervalId;

function initTimer() {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
    seconds = 1;
  }
}

function startTimer(element) {
  intervalId = setInterval(function () {
    if (seconds == 10) {
      const event = new Event("questionTimeUp");
      document.dispatchEvent(event);
    }

    element.innerHTML = `${seconds} seconds`;
    seconds++;
  }, 1000);
}

export function setUpQuestionTimer(element) {
  initTimer();
  startTimer(element);
  return seconds;
}

export function getTime() {
  return seconds;
}
