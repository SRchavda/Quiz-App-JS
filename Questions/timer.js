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

export function startTotalTimer(element) {
  setInterval(function () {
    element.innerHTML = convertToMinutes(totalSeconds);
    totalSeconds++;
  }, 1000);
}
