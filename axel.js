const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const email = document.getElementById("email");
const submitButton = document.getElementById("submitBtn");
const questionContainer = document.getElementById("question-container");
const personalForm = document.getElementById("personal-form");

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

function loadQuestions() {
    fetch(
        "https://raw.githubusercontent.com/axelcollin87/quizquestions/master/quiz_data.json"
    )
        .then((response) => response.json())
        .then((data) => {
            data.questions.forEach((que) => {
                switch (que.type) {
                    case "text":
                        questionContainer.innerHTML += `<p class="questionP">${que.question}</p>`;
                        questionContainer.innerHTML += `<input type='text' placeholder='Type answer here'/>`;
                        break;
                    case "radio":
                        questionContainer.innerHTML += `<p class="questionP">${que.question}</p>`;
                        que.options.forEach((option) => {
                            questionContainer.innerHTML += `<input type='radio' name='question' value='${option}'/>`;
                            questionContainer.innerHTML += `<label for='${option}'>${option}</label>`;
                            questionContainer.innerHTML += `<br />`;
                        });
                        break;
                    case "checkbox":
                        questionContainer.innerHTML += `<p class="questionP">${que.question} (Multi choice)</p>`;
                        que.options.forEach((option) => {
                            questionContainer.innerHTML += `<input type='checkbox' name='question' value='${option}'/>`;
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
