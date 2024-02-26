const fName = document.getElementById("firstName");
const lName = document.getElementById("lastName");
const email = document.getElementById("email");
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
                console.log(que.question);
            });
        });
}
