const game = document.querySelector("#game");
const questionsWrapper = document.querySelector("#wrapper");
const question = document.querySelector("#question");
const choices = document.querySelectorAll(".choice-text");
const progressText = document.querySelector("#progress-text");
const progressState = document.querySelector("#progress-state");
const prevQuestion = document.querySelector("#previous");
const nextQuestion = document.querySelector("#next");

const review = document.querySelector("#review");
const result = document.querySelector("#result");
const end = document.querySelector("#end");
const finalScore = document.querySelector("#final-score");
const goHome = document.querySelector("#go-home");

let currentQuestion = {};
let acceptingAnswers = JSON.parse(sessionStorage.getItem("acceptingAnswers"));
let questionCounter = 0;
let answers = JSON.parse(sessionStorage.getItem("answers"));
let MAX_QUESTIONS = answers.length;
console.log(answers, MAX_QUESTIONS);

function getNewQuestion() {
  currentQuestion = answers[questionCounter];
  question.innerHTML = currentQuestion.question;
  choices.forEach((choice, index) => {
    choice.parentElement.classList.remove("correct", "incorrect");
    if (currentQuestion.answerChoices[index]) {
      choice.parentElement.classList.remove("hidden");
      choice.innerHTML = currentQuestion.answerChoices[index];
    } else choice.parentElement.classList.add("hidden");
    const chosen =
      currentQuestion.answerChoices[currentQuestion.chosenAnswer - 1];

    if (chosen === currentQuestion.answer && choice.innerHTML === chosen) {
      choice.parentElement.classList.add("correct");
    } else {
      choice.innerHTML === currentQuestion.answer
        ? choice.parentElement.classList.add("correct")
        : choice.innerHTML === chosen
        ? choice.parentElement.classList.add("incorrect")
        : null;
    }
  });

  if (questionCounter < MAX_QUESTIONS) questionCounter += 1;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressState.style.width = `${Math.floor(
    (questionCounter / MAX_QUESTIONS) * 100
  )}%`;
}

function getResult() {
  const correctAnswer = answers.filter(
    (ans) => ans.answer === ans.answerChoices[ans.chosenAnswer - 1]
  ).length;
  console.log(correctAnswer, MAX_QUESTIONS);
  finalScore.innerHTML = `${correctAnswer} of ${MAX_QUESTIONS} questions answered correctly.`;
}

getResult();

function prevPage() {
  questionsWrapper.style.animation = "1s ease-out slidein reverse";
  setTimeout(() => {
    questionsWrapper.style.animation = "1s ease-in slideout reverse";
    getNewQuestion();
    questionCounter <= 1
      ? prevQuestion.classList.add("hidden")
      : (nextQuestion.innerHTML = "Next");

    setTimeout(() => {
      questionsWrapper.style.animation = "";
    }, 950);
  }, 950);
}

function nextPage() {
  questionsWrapper.style.animation = "1s ease-in slideout";
  setTimeout(() => {
    questionsWrapper.style.animation = "1s ease-out slidein";
    getNewQuestion();
    if (questionCounter === MAX_QUESTIONS) {
      nextQuestion.innerHTML = "Check Result";
    }
    setTimeout(() => {
      questionsWrapper.style.animation = "";
    }, 950);
  }, 950);
}

goHome.addEventListener("click", function () {
  window.location.assign("/index.html");
  sessionStorage.removeItem("apiLink");
  sessionStorage.removeItem("answers");
  sessionStorage.removeItem("acceptingAnswers");
});

review.addEventListener("click", function () {
  nextQuestion.innerHTML = "Next";
  prevQuestion.classList.add("hidden");
  end.classList.add("hidden");
  result.classList.remove("hidden");
  getNewQuestion();
});

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    if (!acceptingAnswers) return;
  });
});

prevQuestion.addEventListener("click", function () {
  questionCounter -= 2;

  prevPage();
});

nextQuestion.addEventListener("click", function () {
  if (nextQuestion.innerHTML === "Check Result") {
    questionCounter = 0;
    end.classList.remove("hidden");
    result.classList.add("hidden");
    return;
  } else {
    prevQuestion.classList.remove("hidden");
    nextPage();
  }
});
