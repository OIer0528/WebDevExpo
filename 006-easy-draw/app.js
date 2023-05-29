// Global Variables
let isDrawing = false;
let selectedTool = "brush";
let brushWidth = 5;
let brushColor = "#000";
let prevMouseX, prevMouseY;
let snapshot;

// Tool Buttons - Click Event
document.querySelectorAll(".tool").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".options .active").classList.remove("active");
    button.classList.add("active");
    selectedTool = button.id;
  });
});

// #fill-color
const fillColor = document.querySelector("#fill-color");
const needFilled = () => fillColor.checked;

// #size-slider
const sizeSlider = document.querySelector("#size-slider");
sizeSlider.addEventListener("change", () => { brushWidth = sizeSlider.value; });

// Color Tools - Click Event
document.querySelectorAll(".color-tools .option").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelector(".options .selectd").classList.remove("selectd");
    button.classList.add("selectd");
    brushColor = window.getComputedStyle(button).getPropertyValue("background-color");
  });
});

// Color Picker - Change Event
const colorPicker = document.querySelector("#color-picker");
colorPicker.addEventListener("change", () => {
  colorPicker.parentElement.style.backgroundColor = colorPicker.value;
  colorPicker.parentElement.click();
});

// Canvas & Context
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");
const setCanvasBackground = () => {
  context.fillStyle = "#fff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = brushColor;
};
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
  setCanvasBackground();
});

// Canvas - Mouse Events
const startDraw = (e) => {
  context.beginPath();
  context.lineWidth = brushWidth;
  context.strokeStyle = brushColor;
  context.fillStyle = brushColor;
  isDrawing = true;
  prevMouseX = e.offsetX;
  prevMouseY = e.offsetY;
  snapshot = context.getImageData(0, 0, canvas.width, canvas.height);
};

const endDraw = () => {
  isDrawing = false;
};

const drawing = (e) => {
  if (!isDrawing) return;
  context.putImageData(snapshot, 0, 0);

  if (selectedTool === "brush") {
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
  } else if (selectedTool === "eraser") {
    context.strokeStyle = "#fff";
    context.lineTo(e.offsetX, e.offsetY);
    context.stroke();
  } else if (selectedTool === "rectangle") {
    const x = e.offsetX;
    const y = e.offsetY;
    const w = prevMouseX - e.offsetX;
    const h = prevMouseY - e.offsetY;
    needFilled() ? context.fillRect(x, y, w, h) : context.strokeRect(x, y, w, h);
  } else if (selectedTool === "circle") {
    context.beginPath();
    const r = Math.hypot(prevMouseX - e.offsetX, prevMouseY - e.offsetY);
    context.arc(prevMouseX, prevMouseY, r, 0, 2 * Math.PI);
    needFilled() ? context.fill() : context.stroke();
  } else if (selectedTool === "triangle") {
    context.beginPath();
    context.moveTo(prevMouseX, prevMouseY);
    context.lineTo(e.offsetX, e.offsetY);
    context.lineTo(prevMouseX * 2 - e.offsetX, e.offsetY);
    context.closePath()
    needFilled() ? context.fill() : context.stroke();
  }
};

canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", drawing);

// #clear-canvas
const clearCanvas = document.querySelector("#clear-canvas");
clearCanvas.addEventListener("click", () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  setCanvasBackground();
});

// #save-image
const saveImage = document.querySelector("#save-image");
saveImage.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL();
  link.click();
});