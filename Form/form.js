export function setUpForm(element) {
    element.addEventListener('click', () => getFormValues())
}

const getFormValues = () => {
    let form = document.getElementById("form");
    let noOfQues = form.elements["noOfQues"].value;
    let level = form.elements["level"].value;
    let category = form.elements["quiz_category"].value;
    let timeLimit = form.elements["timeLimit"].value;

    console.log(noOfQues, level, category, timeLimit);
}