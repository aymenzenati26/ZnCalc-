const display = document.querySelector(".display");
const buttons = document.querySelectorAll("button");
const specialChars = ["%", "*", "/", "-", "+", "="];
let output = "";

// Function to calculate based on button clicked or spoken command
const calculate = (btnValue) => {
  if (btnValue === "=" && output !== "") {
    // If output has '%', replace with '/100' before evaluating.
    try {
      output = eval(output.replace("%", "/100"));
      speak(`The result is ${output}`); // Speak the result
    } catch {
      output = "Error";
      speak("Error");
    }
  } else if (btnValue === "AC") {
    output = "";
    speak("Cleared");
  } else if (btnValue === "DEL") {
    // If DEL button is clicked, remove the last character from the output.
    output = output.toString().slice(0, -1);
    speak("Deleted");
  } else {
    // If output is empty and button is specialChars then return
    if (output === "" && specialChars.includes(btnValue)) return;
    output += btnValue;
  }
  display.value = output;
};

// Function for speech synthesis (speak out loud)
const speak = (text) => {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  speechSynthesis.speak(utterance);
};

// Speech recognition setup
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

// Start recognition and process the spoken input
recognition.onresult = (event) => {
  const spokenInput = event.results[0][0].transcript;
  processSpeech(spokenInput);
};

// Function to process the spoken command
const processSpeech = (spokenInput) => {
  // Normalize spoken input
  const normalizedInput = spokenInput
    .toLowerCase()
    .replace("plus", "+")
    .replace("minus", "-")
    .replace("times", "*")
    .replace("into", "*")
    .replace("divide", "/")
    .replace("equals", "=")
    .replace("clear", "AC")
    .replace("delete", "DEL");

  // Process each character or command
  for (const char of normalizedInput) {
    calculate(char);
  }

  // If "=" was part of the command, automatically calculate the result
  if (normalizedInput.includes("=")) calculate("=");
};

// Add event listener to buttons, call calculate() on click
buttons.forEach((button) => {
  button.addEventListener("click", (e) => calculate(e.target.dataset.value));
});

// Start listening for voice commands when a specific key is pressed
document.addEventListener("keydown", (e) => {
  if (e.key === "v") {
    speak("Voice recognition started. Speak your calculation.");
    recognition.start();
  }
});
