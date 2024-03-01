const fName = document.getElementById("first-name");
const lName = document.getElementById("last-name");
const email = document.getElementById("email");
const submitButton = document.getElementById("submit-btn");
const questionContainer = document.getElementById("question-container");
const personalForm = document.getElementById("personal-form");

let questionData = [];

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
    if (validatePersonalForm()) {
        event.preventDefault();

        const namePara = document.getElementById("name-paragraph");
        const mailPara = document.getElementById("mail-paragraph");

        namePara.textContent =
            event.target.elements["first-name"].value +
            " " +
            event.target.elements["last-name"].value;
        mailPara.textContent = event.target.elements["email"].value;

        personalForm.innerHTML = "";

        loadQuestions();
    } else {
        event.preventDefault();
    }
});

// Loads the quiz form elements from api (dummy json from my github)
// Displays the question container and submit button
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
                        questionContainer.innerHTML += `<input type='text' name='${q.id}' placeholder='Type answer here (required) '/>`;
                        questionContainer.innerHTML += `<p class="input-error" id='${q.id}'>`;
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

// Submit quiz, iterates through questions to check answers and count score
submitButton.addEventListener("click", () => {
    let score = 0;

    if (checkRequiredAnswers()) {
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
                    const selectedRadio = document.querySelector(
                        `input[name='${question.id}']:checked`
                    );
                    if (selectedRadio.value === question.answer) {
                        console.log(`${question.answer} is correct!`);
                    } else {
                        console.log(
                            `Wrong answer, correct answer is: ${question.answer}`
                        );
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
                    console.log(matchingArrays);
                    break;
            }
        });
    } else {
        return;
    }
});

function checkRequiredAnswers() {
    let answered = true;

    questionData.forEach((element) => {
        if (element.type === "text") {
            document.getElementById(element.id).textContent = "";
            if (
                inputEmpty(
                    document.querySelector(`input[name='${element.id}']`)
                )
            ) {
                document.getElementById(element.id).textContent =
                    "This question is required!";
                answered = false;
            }
        }
    });

    return answered;
}
