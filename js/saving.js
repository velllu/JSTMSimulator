// ------- Saves code and input data when quitting -------
const textArea = document.getElementById("code");
const input = document.getElementById("input");

// -- Reading --
const codeText = localStorage.getItem("code");
const inputText = localStorage.getItem("input");

if (codeText != null)
    textArea.value = codeText;

if (inputText != null)
    input.value = inputText;

// -- Saving --
// Debounce function from https://stackoverflow.com/questions/75988682/debounce-in-javascript
const debounce = (callback, wait) => {
    let timeoutId = null;
    return (...args) => {
        window.clearTimeout(timeoutId);
        timeoutId = window.setTimeout(() => {
            callback(...args);
        }, wait);
    };
}

const waitTime = 300;

const handleCodeChange = debounce(() => {
    localStorage.setItem("code", textArea.value);
}, waitTime);

const handleInputChange = debounce(() => {
    localStorage.setItem("input", input.value);
}, waitTime);

textArea.addEventListener("input", handleCodeChange);
input.addEventListener("input", handleInputChange);