const elApp = document.querySelector("#app");
const elTitle = elApp.querySelector(".title");
const elInputText = elApp.querySelector("#input-text");
const elInputColor = elApp.querySelector("#input-color");

const setColor = () => {
  const color = elInputColor.value;
  elApp.style.backgroundColor = color;
  elTitle.style.color = color;
  elInputText.value = color;
};

elInputColor.addEventListener("input", setColor);
window.addEventListener("load", setColor);