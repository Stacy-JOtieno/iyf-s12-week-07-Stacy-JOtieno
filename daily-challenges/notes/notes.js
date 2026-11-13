const STORAGE_KEY = "notes";

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    try {
        return JSON.parse(data);
    } catch {
        return defaultValue;
    }
}

// Load ONCE at startup
let notes = getFromStorage(STORAGE_KEY, []);

const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const list = document.getElementById("note-list");
const clearButton = document.getElementById("clear-all");

function render() {
    list.innerHTML = "";
    notes.forEach((note) => {
        const item = document.createElement("li");
        item.dataset.id = note.id;
        item.textContent = note.text + " ";

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        item.appendChild(deleteButton);

        list.appendChild(item);
    });
}

// One place that saves and redraws
function commit() {
    saveToStorage(STORAGE_KEY, notes);
    render();
}

function addNote(text) {
    notes = [...notes, { id: Date.now(), text, createdAt: new Date().toISOString() }];
    commit();
}

function deleteNote(id) {
    notes = notes.filter((note) => note.id !== id);
    commit();
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (text === "") return;
    addNote(text);
    input.value = "";
});

// Event delegation: one listener for every Delete button
list.addEventListener("click", (event) => {
    if (event.target.tagName !== "BUTTON") return;
    const id = Number(event.target.closest("li").dataset.id);  // dataset values are strings
    deleteNote(id);
});

clearButton.addEventListener("click", () => {
    notes = [];
    commit();
});

render();