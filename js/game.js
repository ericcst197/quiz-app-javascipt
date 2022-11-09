const game = document.querySelector("#game");
const questionsWrapper = document.querySelector("#wrapper");
const question = document.querySelector("#question");
const choices = document.querySelectorAll(".choice-text");
const progressText = document.querySelector("#progress-text");
const progressState = document.querySelector("#progress-state");
const loader = document.querySelector("#loader");
const prevQuestion = document.querySelector("#previous");
const nextQuestion = document.querySelector("#next");

const link =
  sessionStorage.getItem("apiLink") || "https://opentdb.com/api.php?amount=10";
// Default link if user doesn't set the game
let currentQuestion = {};
let acceptingAnswers = true;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];
let MAX_QUESTIONS;

fetch(link)
  .then((res) => res.json())
  .then((data) => {
    questions = data.results.map((ques) => {
      let formattedQues = {};
      if (ques.type === "multiple") {
        const answerChoices = [...ques.incorrect_answers];
        formattedQues = {
          question: ques.question,
          chosenAnswer: null,
        };
        const answerIndex =
          Math.floor(Math.random() * ques.incorrect_answers.length) + 1;
        answerChoices.splice(answerIndex, 0, ques.correct_answer);

        formattedQues.answerChoices = answerChoices;
        formattedQues.answer = answerChoices[answerIndex];
      } else {
        formattedQues = {
          question: ques.question,
          answerChoices: ["True", "False"],
          chosenAnswer: null,
        };
        formattedQues.answer = ques.correct_answer;
      }
      return formattedQues;
    });
    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

function startGame() {
  questionCounter = 0;
  availableQuestions = [...questions];
  MAX_QUESTIONS = availableQuestions.length;
  if (window.location.pathname === "/game.html") {
    loader.classList.add("hidden");
    game.classList.remove("hidden");
    prevQuestion.classList.add("hidden");
    questionsWrapper.style.animation = "1s ease-out slidein";
    sessionStorage.removeItem("answers");
    sessionStorage.removeItem("acceptingAnswers");
    setTimeout(() => {
      questionsWrapper.style.animation = "";
    }, 1200);
    getNewQuestion();
    acceptingAnswers = true;
  }
}

function getNewQuestion() {
  nextQuestion.setAttribute("disabled", true);
  currentQuestion = availableQuestions[questionCounter];
  question.innerHTML = currentQuestion.question;
  choices.forEach((choice, index) => {
    if (currentQuestion.answerChoices[index]) {
      choice.parentElement.classList.remove("hidden");
      choice.innerHTML = currentQuestion.answerChoices[index];
    } else choice.parentElement.classList.add("hidden");

    const chosen = currentQuestion.chosenAnswer;
    if (chosen && choice.dataset.number == chosen) {
      choice.parentElement.classList.add("chosen");
      nextQuestion.removeAttribute("disabled");
    } else choice.parentElement.classList.remove("chosen");
  });

  questionCounter += 1;
  progressText.innerText = `Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressState.style.width = `${Math.floor(
    (questionCounter / MAX_QUESTIONS) * 100
  )}%`;
}

function prevPage() {
  questionsWrapper.style.animation = "1s ease-out slidein reverse";
  setTimeout(() => {
    questionsWrapper.style.animation = "1s ease-in slideout reverse";
    getNewQuestion();
    questionCounter === 1
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

function saveAnswer(curAns) {
  let getData = JSON.parse(sessionStorage.getItem("answers"));
  const answers = getData || [];

  const savedAns = answers.some((ans) => ans.question === curAns.question);
  const selectedAnsIndex = answers.findIndex(
    (ans) => ans.question === curAns.question
  );

  !getData || getData.length === 0 || !savedAns
    ? answers.push(curAns)
    : answers.splice(selectedAnsIndex, 1, curAns);

  sessionStorage.setItem("answers", JSON.stringify(answers));
}

function selected(selectedAns) {
  //find active btn first
  let active_btn = document.querySelector(".choice-container.chosen");

  //if any active btn
  if (active_btn) {
    //remove active class from it
    active_btn.classList.remove("chosen");
  }
  //now add active class to selected button
  selectedAns.parentElement.classList.add("chosen");
}

if (window.location.pathname === "/game.html") {
  choices.forEach((choice) => {
    choice.addEventListener("click", (e) => {
      if (!acceptingAnswers) return;
      const target = e.target;
      const selectedChoice = +target.dataset.number;

      availableQuestions[questionCounter - 1].chosenAnswer = selectedChoice;

      selected(choice);
      nextQuestion.removeAttribute("disabled");
    });
  });

  prevQuestion.addEventListener("click", function () {
    questionCounter -= 2;

    prevPage();
  });

  nextQuestion.addEventListener("click", function () {
    saveAnswer(currentQuestion);
    if (
      nextQuestion.innerHTML === "Check Result" &&
      currentQuestion.chosenAnswer
    ) {
      window.location.assign("/end.html");
      acceptingAnswers = false;
      sessionStorage.setItem(
        "acceptingAnswers",
        JSON.stringify(acceptingAnswers)
      );
      return;
    } else {
      prevQuestion.classList.remove("hidden");
      nextPage();
    }
  });
}
