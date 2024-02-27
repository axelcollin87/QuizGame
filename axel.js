const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const email = document.getElementById("email");
const submitButton = document.getElementById("submitBtn");
const questionContainer = document.getElementById("question-container");
const personalForm = document.getElementById("personal-form");

let questionData = [];

personalForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const namePara = document.getElementById("nameParagraph");
    const mailPara = document.getElementById("mailParagraph");

    namePara.textContent =
        event.target.elements["firstName"].value +
        " " +
        event.target.elements["lastName"].value;
    mailPara.textContent = event.target.elements["email"].value;

    personalForm.innerHTML = "";

    loadQuestions();
});

submitButton.addEventListener("click", () => {
    let score = 0;

    questionData.forEach((question) => {
        switch (question.type) {
            case "text":
                const textAnswer = document.querySelector(
                    `input[name='${question.id}']`
                );
                if (textAnswer.value === question.answer) {
                    console.log(`${question.answer} is correct!`);
                } else {
                    console.log(
                        `Wrong answer, correct answer is: ${question.answer}`
                    );
                }
                break;
            case "radio":
                const radioSelection = document.querySelector(
                    `input[name='${question.id}']:checked`
                );
                if (radioSelection.value === question.answer) {
                    console.log(`${question.answer} is correct!`);
                } else {
                    console.log(
                        `Wrong answer, correct answer is: ${question.answer}`
                    );
                }
                break;

            // figure out how to do checkbox case, probably use querySelectorAll.
        }
    });
});

function loadQuestions() {
    fetch(
        "https://raw.githubusercontent.com/axelcollin87/quizquestions/master/quiz_data.json"
    )
        .then((response) => response.json())
        .then((data) => {
            questionData = data.questions;

            data.questions.forEach((q) => {
                switch (q.type) {
                    case "text":
                        questionContainer.innerHTML += `<p class="questionP">${q.question}</p>`;
                        questionContainer.innerHTML += `<input type='text' name='${q.id}' placeholder='Type answer here'/>`;
                        break;
                    case "radio":
                        questionContainer.innerHTML += `<p class="questionP">${q.question}</p>`;
                        q.options.forEach((option) => {
                            questionContainer.innerHTML += `<input type='radio' name='${q.id}' value='${option}'/>`;
                            questionContainer.innerHTML += `<label for='${option}'>${option}</label>`;
                            questionContainer.innerHTML += `<br />`;
                        });
                        break;
                    case "checkbox":
                        questionContainer.innerHTML += `<p class="questionP">${q.question} (Multi choice)</p>`;
                        q.options.forEach((option) => {
                            questionContainer.innerHTML += `<input type='checkbox' name='${q.id}' value='${option}'/>`;
                            questionContainer.innerHTML += `<label for='${option}'>${option}</label>`;
                            questionContainer.innerHTML += `<br />`;
                        });
                        break;
                }
            });
        });
    questionContainer.style.display = "block";
    submitButton.style.display = "block";
}
