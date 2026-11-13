const STORAGE_KEY = "appState";

const state = {
    todos: [],
    filter: "all",
    theme: "light",
};

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const list = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter");
const themeToggle = document.getElementById("theme-toggle");

// Persist state
function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
        if (saved && typeof saved === "object") {
            Object.assign(state, saved);
        }
    } catch {
        // bad JSON: keep the default state
    }
}

// The ONE function that changes state
function setState(updates) {
    Object.assign(state, updates);
    saveState();
    render();
}

// Update specific properties
function setFilter(filter) {
    setState({ filter });
}

function setTheme(theme) {
    setState({ theme });
}

function addTodo(text) {
    setState({
        todos: [...state.todos, { id: Date.now(), text, completed: false }],
    });
}

function toggleTodo(id) {
    setState({
        todos: state.todos.map((todo) =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ),
    });
}

// The page is a picture of the state
function render() {
    document.body.dataset.theme = state.theme;

    filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === state.filter);
    });

    const visible = state.todos.filter((todo) => {
        if (state.filter === "active") {
            return !todo.completed;
        }
        if (state.filter === "completed") {
            return todo.completed;
        }
        return true;
    });

    list.innerHTML = "";
    visible.forEach((todo) => {
        const item = document.createElement("li");
        item.dataset.id = todo.id;
        item.textContent = todo.text;
        item.className = todo.completed ? "done" : "";
        list.appendChild(item);
    });
}

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = input.value.trim();
    if (text === "") {
        return;
    }
    addTodo(text);
    input.value = "";
});

list.addEventListener("click", (event) => {
    const item = event.target.closest("li");
    if (item) {
        toggleTodo(Number(item.dataset.id));
    } // dataset values are strings
});

filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
});

themeToggle.addEventListener("click", () => {
    setTheme(state.theme === "light" ? "dark" : "light");
});

loadState();
render();
