const setting = document.querySelector("#setting");
const settingBtn = document.querySelector("#setGame");
const startBtn = document.querySelector("#startGame");
const form = setting.querySelector("form");
const backdrop = setting.querySelector("#backdrop");

const questionNumber = form.querySelector("#question-count");
const category = form.querySelector("#category");
const difficulty = form.querySelector("#difficulty");
const quesType = form.querySelector("#type");

const category_API = "https://opentdb.com/api_category.php";
let API_LINK = "https://opentdb.com/api.php?amount=10"; // Default link if user doesn't set the game

async function getCategoryOptions() {
  const categoryRes = await fetch(category_API);
  const { trivia_categories } = await categoryRes.json();

  for (let cat of trivia_categories) {
    const HTML = `<option value='${cat.id}'>${cat.name}</option>`;
    category.insertAdjacentHTML("beforeend", HTML);
  }
}

function displaySetting() {
  setting.classList.toggle("hidden");
}

[settingBtn, backdrop].forEach((el) =>
  el.addEventListener("click", displaySetting)
);

form.addEventListener("submit", function (e) {
  e.preventDefault();
  API_LINK = "https://opentdb.com/api.php?amount=";
  API_LINK += questionNumber.value;

  if (category.value) {
    API_LINK += `&category=${category.value}`;
  }
  if (difficulty.value) {
    API_LINK += `&difficulty=${difficulty.value}`;
  }
  if (quesType.value) {
    API_LINK += `&type=${quesType.value}`;
  }

  sessionStorage.setItem("apiLink", API_LINK);
  displaySetting();
});

getCategoryOptions();

// startBtn.addEventListener("click", function () {
//   console.log("click");
//   fetchAPI();
// });
