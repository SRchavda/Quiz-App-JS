"use strict";

import "./style.css";
import { setUpForm } from "./Form/form.js";

const inputNodeWithLabel = (label, type, name, id, value) => {
  let node = `
  <input type=${type} id=${id} name=${name} value=${value}>
  <label for=${id}>${label}</label>
  `;
  return node;
};

const firstPage = `
  <div class="formWrapper">
    <form name="quizForm" id="form">
      <div>
        <p>Quiz Categories</p>
        ${inputNodeWithLabel(
          "Web Development",
          "radio",
          "quiz_category",
          "web_development",
          "web_development"
        )}
        ${inputNodeWithLabel(
          "Javascript",
          "radio",
          "quiz_category",
          "javascript",
          "javascript"
        )}
        ${inputNodeWithLabel(
          "React",
          "radio",
          "quiz_category",
          "react",
          "react"
        )}
      </div>
      <div>
        <p>Difficulty Level</p>
        ${inputNodeWithLabel("Easy", "radio", "level", "easy", "easy")}
        ${inputNodeWithLabel("Medium", "radio", "level", "medium", "medium")}
        ${inputNodeWithLabel("Hard", "radio", "level", "hard", "hard")}
      </div>
      <div>
        <p>Number of questions</p>
        <input type="number" placeholder="15" name="noOfQues" id="noOfQues" />
      </div>
      <div>
        <p>Time limit</p>
        <input type="text" placeholder="MM:SS" name="timeLimit" />
      </div>
      <div>
          <button type="button" id="submitBtn">Submit</button>
      </div>
    </form>
  </div>
`;

// document.querySelector('#app').innerHTML = firstPage;
// setUpForm(document.querySelector("#submitBtn"));
