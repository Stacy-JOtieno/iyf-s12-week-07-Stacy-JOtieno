
const registrationForm = document.getElementById("registrationForm");
const saveStatus = document.getElementById("saveStatus");

const STORAGE_KEY = "registrationDraft";

// Save all form fields
function saveFormData() {
    const formData = {};

    const formElements = registrationForm.elements;

    for (const element of formElements) {
        if (!element.name) continue;

        if (element.type === "submit" || element.type === "button") {
            continue;
        }

        formData[element.name] = element.value;
    }

    try {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(formData)
        );

        saveStatus.textContent = "Draft saved successfully!";
    } catch (error) {
        console.error("Error saving form:", error);
        saveStatus.textContent = "Unable to save your draft.";
    }
}

// Recover previously saved form data
function recoverFormData() {
    try {
        const savedData = localStorage.getItem(STORAGE_KEY);

        if (!savedData) return;

        const formData = JSON.parse(savedData);

        if (!formData || typeof formData !== "object" ||
            Array.isArray(formData)) {
            throw new Error("Invalid saved form data.");
        }

        for (const [fieldName, fieldValue] of Object.entries(formData)) {
            const field = registrationForm.elements.namedItem(fieldName);

            if (field && typeof fieldValue === "string") {
                field.value = fieldValue;
            }
        }

        saveStatus.textContent = "Your previous draft has been recovered.";

    } catch (error) {
        console.error("Error recovering form:", error);
        saveStatus.textContent = "Could not recover your previous draft.";
        localStorage.removeItem(STORAGE_KEY);
    }
}

// Automatically save every five seconds
const autoSaveInterval = setInterval(saveFormData, 5000);

// Save immediately when the page is about to close
window.addEventListener("pagehide", saveFormData);

// Clear saved data when the form is submitted
registrationForm.addEventListener("submit", event => {
    event.preventDefault();

    try {
        localStorage.removeItem(STORAGE_KEY);

        clearInterval(autoSaveInterval);

        registrationForm.reset();

        saveStatus.textContent = "Form submitted successfully! Draft cleared.";

    } catch (error) {
        console.error("Submission error:", error);
        saveStatus.textContent = "Unable to clear the saved draft.";
    }
});

// Recover saved information when the page loads
recoverFormData();
