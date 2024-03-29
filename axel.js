const fName = document.getElementById("first-name");
const lName = document.getElementById("last-name");
const email = document.getElementById("email");
const submitButton = document.getElementById("submit-btn");
const restartButton = document.getElementById("restart-btn");
const scoreText = document.getElementById("total-score");
const questionContainer = document.getElementById("question-container");
const personalForm = document.getElementById("personal-form");

let selectedQuestions = [];
let questionCount = 1;

// Add/Remove/Change this to control what questions will require an answer.
let requiredQuestions = [2, 4, 7];

// Validate personal form
function validatePersonalForm() {
    const firstNameError = document.getElementById("first-name-error");
    const lastNameError = document.getElementById("last-name-error");
    const emailError = document.getElementById("email-error");

    firstNameError.textContent = "";
    lastNameError.textContent = "";
    emailError.textContent = "";

    let isValid = true;

    if (inputEmpty(fName)) {
        firstNameError.textContent =
            "Please enter your first name before submiting";
        isValid = false;
    } else if (!/^[A-Za-z]+$/.test(fName.value)) {
        firstNameError.textContent = "First name should contain only letters";
        isValid = false;
    }

    if (inputEmpty(lName)) {
        lastNameError.textContent =
            "Please enter your last name before submiting";
        isValid = false;
    } else if (!/^[A-Za-z]+$/.test(lName.value)) {
        lastNameError.textContent = "First name should contain only letters";
        isValid = false;
    }

    if (inputEmpty(email)) {
        emailError.textContent = "Please enter your email address";
        isValid = false;
    } else if (!isValidEmailFormat(email.value)) {
        emailError.textContent =
            "Please enter a valid email format (example@domain.com)";
        isValid = false;
    }

    return isValid;
}

// Email regex, broken out to be reusable, no real need in this project maybe.
function isValidEmailFormat(email) {
    const stolenEmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return stolenEmailRegex.test(email);
}
// Checks an input element if its empty or not.
function inputEmpty(inputElement) {
    if (inputElement.value.trim() === "") {
        return true;
    } else {
        return false;
    }
}

// Personal info submit
// Adds current player info and calls loadQuestions function
personalForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (validatePersonalForm()) {
        const namePara = document.getElementById("name-paragraph");
        const mailPara = document.getElementById("mail-paragraph");

        namePara.textContent =
            event.target.elements["first-name"].value +
            " " +
            event.target.elements["last-name"].value;
        mailPara.textContent = event.target.elements["email"].value;

        personalForm.innerHTML = "";

        loadQuestions();
    }
});

// Loads the quiz form elements, builds 7 random questions from a 50 question pool.
//
// Displays the question container and submit button
function loadQuestions() {
    questionContainer.innerHTML = "";

    fetch(
        "https://raw.githubusercontent.com/axelcollin87/quizquestions/master/quiz_data.json"
    )
        .then((response) => response.json())
        .then((data) => {
            const textQuestions = data.questions.filter(
                (q) => q.type === "text"
            );
            const radioQuestions = data.questions.filter(
                (q) => q.type === "radio"
            );
            const checkboxQuestions = data.questions.filter(
                (q) => q.type === "checkbox"
            );

            const selectedQuestionIds = new Set();

            // This "logic" makes sure we get a spread over the different question types
            while (selectedQuestions.length < 7) {
                let type, questionArray;

                if (selectedQuestions.length % 3 === 0) {
                    type = "text";
                    questionArray = textQuestions;
                } else if (selectedQuestions.length % 3 === 1) {
                    type = "radio";
                    questionArray = radioQuestions;
                } else {
                    type = "checkbox";
                    questionArray = checkboxQuestions;
                }

                let newQuestion;
                do {
                    newQuestion =
                        questionArray[
                            Math.floor(Math.random() * questionArray.length)
                        ];
                } while (selectedQuestionIds.has(newQuestion.id));

                selectedQuestions.push(newQuestion);
                selectedQuestionIds.add(newQuestion.id);
            }

            selectedQuestions.forEach((q) => {
                // Start of the question div

                let questionHtml = `<div class="question" id="q${q.id}">`;

                if (requiredQuestions.includes(questionCount)) {
                    questionHtml += `<p class="question-req">Required question *</p>`;
                }

                switch (q.type) {
                    case "text":
                        questionHtml += `<p class="questionP">${questionCount}. ${q.question}</p>`;
                        questionHtml += `<input type='text' name='${q.id}' placeholder='Type answer here'/>`;
                        questionHtml += `<p class="input-error" id='${q.id}'></p>`;
                        questionCount += 1;
                        break;
                    case "radio":
                        questionHtml += `<p class="questionP">${questionCount}. ${q.question}</p>`;
                        q.options.forEach((option) => {
                            questionHtml += `<input type='radio' name='${q.id}' value='${option}'/>`;
                            questionHtml += `<label for='${option}'>${option}</label>`;
                            questionHtml += `<br />`;
                        });
                        questionHtml += `<p class="input-error" id='${q.id}'></p>`;
                        questionCount += 1;
                        break;
                    case "checkbox":
                        questionHtml += `<p class="questionP">${questionCount}. ${q.question} (Multi choice)</p>`;
                        q.options.forEach((option) => {
                            questionHtml += `<input type='checkbox' name='${q.id}' value='${option}'/>`;
                            questionHtml += `<label for='${option}'>${option}</label>`;
                            questionHtml += `<br />`;
                        });
                        questionHtml += `<p class="input-error" id='${q.id}'></p>`;
                        questionCount += 1;
                        break;
                }

                // End of the question div
                questionHtml += `</div>`;

                // Append the entire question div to the container
                questionContainer.innerHTML += questionHtml;
            });
        });
    questionContainer.style.display = "block";
    submitButton.style.display = "block";
}

// Submit quiz, iterates through questions to check answers and count score
submitButton.addEventListener("click", () => {
    let score = 0;

    if (checkRequiredAnswers()) {
        selectedQuestions.forEach((question) => {
            switch (question.type) {
                case "text":
                    const textAnswer = document.querySelector(
                        `input[name='${question.id}']`
                    );
                    if (textAnswer.value === question.answer) {
                        document.getElementById(
                            `q${question.id}`
                        ).style.borderColor = "#00c210";
                        score++;
                    } else {
                        document.getElementById(
                            question.id
                        ).textContent = `Correct answer: ${question.answer}`;
                        document.getElementById(
                            `q${question.id}`
                        ).style.borderColor = "#c20600";
                    }
                    break;
                case "radio":
                    const selectedRadio = document.querySelector(
                        `input[name='${question.id}']:checked`
                    );
                    if (
                        selectedRadio &&
                        selectedRadio.value === question.answer
                    ) {
                        document.getElementById(
                            `q${question.id}`
                        ).style.borderColor = "#00c210";
                        score++;
                    } else {
                        document.getElementById(
                            question.id
                        ).textContent = `Correct answer: ${question.answer}`;
                        document.getElementById(
                            `q${question.id}`
                        ).style.borderColor = "#c20600";
                    }
                    break;

                case "checkbox":
                    const selectedCB = document.querySelectorAll(
                        `input[name='${question.id}']:checked`
                    );
                    let selectedArr = Array.from(selectedCB).map(
                        (cb) => cb.value
                    );
                    matchingArrays =
                        question.answer.every((answer) =>
                            selectedArr.includes(answer)
                        ) && selectedArr.length === question.answer.length;
                    if (matchingArrays) {
                        document.getElementById(
                            `q${question.id}`
                        ).style.borderColor = "#00c210";
                        score++;
                    } else {
                        document.getElementById(
                            question.id
                        ).textContent = `Correct answer: ${question.answer}`;
                        document.getElementById(
                            `q${question.id}`
                        ).style.borderColor = "#c20600";
                    }
                    break;
            }
        });

        // Quiz submited, present score, remove sbmit button, add reset button.
        submitButton.style.display = "none";
        restartButton.style.display = "block";
        scoreText.innerText = `Congratulations on completing the quiz! Your total score is: ${score} / ${selectedQuestions.length}`;
        scoreText.style.display = "inline";
    } else {
        return;
    }
});

// Check for required questions to have some data
function checkRequiredAnswers() {
    let answered = true;

    const errTextParas = document.querySelectorAll(".input-error");
    errTextParas.forEach((para) => (para.textContent = ""));

    requiredQuestions.forEach((q) => {
        let qId = q - 1;
        switch (selectedQuestions[qId].type) {
            case "text":
                if (
                    inputEmpty(
                        document.querySelector(
                            `input[name='${selectedQuestions[qId].id}']`
                        )
                    )
                ) {
                    document.getElementById(
                        selectedQuestions[qId].id
                    ).textContent = "This question is required!";
                    answered = false;
                }
                break;
            case "radio":
                if (
                    !document.querySelector(
                        `input[name='${selectedQuestions[qId].id}']:checked`
                    )
                ) {
                    document.getElementById(
                        selectedQuestions[qId].id
                    ).textContent = "This question is required!";
                    answered = false;
                }
                break;
            case "check":
                if (
                    !document.querySelector(
                        `input[name='${selectedQuestions[qId].id}']:checked`
                    )
                ) {
                    document.getElementById(
                        selectedQuestions[qId].id
                    ).textContent = "This question is required!";
                    answered = false;
                }
                break;
        }
    });

    return answered;
}

// Restart quiz, reset needed variables
restartButton.addEventListener("click", () => {
    selectedQuestions = [];
    questionCount = 1;
    scoreText.style.display = "none";
    restartButton.style.display = "none";
    loadQuestions();
});
