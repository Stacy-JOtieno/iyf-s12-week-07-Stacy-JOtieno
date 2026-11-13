const FORM_KEY_PREFIX = "form_";

const form = document.getElementById("contact-form");
const inputs = form.querySelectorAll("input, textarea");
const status = document.getElementById("status");

inputs.forEach((input) => {
    const storageKey = FORM_KEY_PREFIX + input.name;

    // Load the saved value on page load
    const saved = sessionStorage.getItem(storageKey);
    if (saved !== null) {
        input.value = saved;
    }

    // Save on every keystroke
    input.addEventListener("input", () => {
        sessionStorage.setItem(storageKey, input.value);
    });
});

// Clear the saved data on successful submit
form.addEventListener("submit", (event) => {
    event.preventDefault(); // no server here, so stay on the page
    inputs.forEach((input) => {
        sessionStorage.removeItem(FORM_KEY_PREFIX + input.name);
    });
    form.reset();
    status.textContent = "Message sent! Saved draft cleared.";
});
