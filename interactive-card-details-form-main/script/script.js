const expirationSelect = document.querySelector("[data-expiration-year]");

const currentYear = new Date().getFullYear();
for (let i = currentYear; i < currentYear + 10; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.innerText = i;
  expirationSelect.append(option);
}

document.addEventListener("keydown", (e) => {
  const input = e.target;
  const key = e.key;
  if (!isConnectedInput(input)) return;

  switch (key) {
    case "ArrowLeft": {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousElementSibling;
        prev.focus();
        prev.selectionStart = prev.value.length - 1;
        prev.selectionEnd = prev.value.length - 1;
        e.preventDefault();
      }
      break;
    }
    case "ArrowRight": {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling;
        next.focus();
        next.selectionStart = 1;
        next.selectionEnd = 1;
        e.preventDefault();
      }
      break;
    }

    case "Delete": {
      if (
        input.selectionStart === input.value.length &&
        input.selectionEnd === input.value.length
      ) {
        const next = input.nextElementSibling;
        next.value = next.value.substring(1, next.value.length);
        next.focus();
        next.selectionStart = 0;
        next.selectionEnd = 0;
        e.preventDefault();
      }
      break;
    }
    case "Backspace": {
      if (input.selectionStart === 0 && input.selectionEnd === 0) {
        const prev = input.previousSibling;
        prev.value = input.prev.value.substring(0, prev.value.length - 1);
        prev.focus();
        prev.selectionStart = prev.value.length;
        prev.selectionEnd = prev.value.length;
        e.preventDefault();
      }
      break;
    }

    default: {
      if (e.ctrlKey || e.altKey) return;
      if (key.length > 1) return;
      if (key.match(/^[^0-9]$/)) return e.preventDefault();
      onInputChange(input, key);
    }
  }
});

document.addEventListener("paste", (e) => {
  const input = e.target;
  const data = e.clipboardData.getData("text");

  if (!isConnectedInput(input)) return;
  if (!data.match(/^[0-9]+$/)) return e.preventDefault();

  e.preventDefault();
  onInputChange(input, data);
});

function onInputChange(input, newValue) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  updateInputValue(input, newValue, start, end);
  focusInput(input, newValue.length + start);
}

function updateInputValue(input, extraValue, start = 0, end = 0) {
  const newValue = `${input.value.substring(
    0,
    start
  )}${extraValue}${input.value.substring(end, 16)}`;
  input.value = newValue.substring(0, 16);
  if (newValue > 16) {
    const next = input.nextElementSibling;
    if (next == null) return;
    updateInputValue(next, newValue.substring(16));
  }
}

function focusInput(input, dataLength) {
  let addedChars = dataLength;
  let currentInput = input;
  while (addedChars > 16 && currentInput.nextElementSibling != null) {
    addedChars -= 16;
    currentInput = currentInput.nextElementSibling;
  }
  if (addedChars > 16) addedChars = 16;

  currentInput.focus();
  currentInput.selectionStart = addedChars;
  currentInput.selectionEnd = addedChars;
}

function isConnectedInput(input) {
  const parent = input.closest("[data-connected-inputs]");
  return input.matches("input") && parent != null;
}

// Validate form

function validateForm() {
  let x = document.getElementById("name");
  if (x == "") {
    alert("Name must be filled out");
    return false;
  }
}

validateForm();
