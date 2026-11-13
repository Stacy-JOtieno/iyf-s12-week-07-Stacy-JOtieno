// DOM Elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

// Storage helpers
const STORAGE_KEY = "todos";
const FILTER_KEY = "filter";
const VALID_FILTERS = ["all", "active", "completed"];
const DOUBLE_CLICK_DELAY_MS = 220;

function saveToStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

function getFromStorage(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    try {
        return JSON.parse(data);
    } catch {
        return defaultValue; // bad JSON: don't crash
    }
}

// State: load ONCE, when the app starts
let todos = getFromStorage(STORAGE_KEY, []);
if (!Array.isArray(todos)) {
    todos = []; // valid JSON but the wrong shape
}

let currentFilter = getFromStorage(FILTER_KEY, "all");
if (!VALID_FILTERS.includes(currentFilter)) {
    currentFilter = "all";
}

let clickTimer = null; // tells a single click from a double-click

// One place that saves and redraws
function commit() {
    saveToStorage(STORAGE_KEY, todos);
    saveToStorage(FILTER_KEY, currentFilter);
    render();
}

// Rendering
function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.dataset.id = todo.id;

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text; // textContent, never innerHTML

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "\u00d7";
    deleteBtn.setAttribute("aria-label", `Delete "${todo.text}"`);

    li.append(text, deleteBtn);
    return li;
}

function getVisibleTodos() {
    if (currentFilter === "active") return todos.filter((t) => !t.completed);
    if (currentFilter === "completed") return todos.filter((t) => t.completed);
    return todos;
}

function updateStats() {
    const remaining = todos.filter((t) => !t.completed).length;
    itemsLeft.textContent = `${remaining} ${remaining === 1 ? "item" : "items"} left`;
    clearCompletedBtn.disabled = !todos.some((t) => t.completed);
}

function render() {
    todoList.innerHTML = "";

    const visible = getVisibleTodos();

    if (visible.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent =
            todos.length === 0 ? "Nothing to do yet. Add a task above!" : `No ${currentFilter} tasks.`;
        todoList.appendChild(empty);
    } else {
        visible.forEach((todo) => todoList.appendChild(createTodoElement(todo)));
    }

    // Show the saved filter as active (the HTML hard-codes "All")
    filters.forEach((btn) => btn.classList.toggle("active", btn.dataset.filter === currentFilter));

    updateStats();
}

// Actions: change the array, then commit()
function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return false; // `required` allows "   ", so check here too

    todos = [
        ...todos,
        { id: Date.now(), text: trimmed, completed: false, createdAt: new Date().toISOString() },
    ];
    commit();
    return true;
}

function toggleTodo(id) {
    todos = todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    commit();
}

function deleteTodo(id) {
    todos = todos.filter((t) => t.id !== id);
    commit();
}

function filterTodos(filter) {
    currentFilter = filter;
    commit();
}

function clearCompleted() {
    todos = todos.filter((t) => !t.completed);
    commit();
}

// Bonus: edit a task in place
function startEdit(li) {
    const id = Number(li.dataset.id);
    const todo = todos.find((t) => t.id === id);
    const label = li.querySelector(".todo-text");
    if (!todo || !label) return;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = todo.text;
    label.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    let finished = false; // blur fires after the re-render, so guard against running twice

    function finish(save) {
        if (finished) return;
        finished = true;

        if (!save) {
            render();
            return;
        }

        const newText = editInput.value.trim();
        if (newText) {
            todos = todos.map((t) => (t.id === id ? { ...t, text: newText } : t));
            commit();
        } else {
            deleteTodo(id); // saving an empty edit removes the task
        }
    }

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") finish(true);
        if (event.key === "Escape") finish(false);
    });
    editInput.addEventListener("blur", () => finish(true));
}

// Event Listeners
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (addTodo(input.value)) {
        input.value = "";
    }
    input.focus();
});

// Event delegation: one listener on the <ul> handles every task
todoList.addEventListener("click", function (event) {
    const li = event.target.closest(".todo-item");
    if (!li) return;
    if (event.target.classList.contains("edit-input")) return;

    const id = Number(li.dataset.id); // dataset values are strings

    if (event.target.closest(".delete-btn")) {
        deleteTodo(id);
        return;
    }

    // Wait briefly so a double-click (edit) doesn't also toggle the task
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => toggleTodo(id), DOUBLE_CLICK_DELAY_MS);
});

todoList.addEventListener("dblclick", function (event) {
    const li = event.target.closest(".todo-item");
    if (!li || event.target.closest(".delete-btn")) return;

    clearTimeout(clickTimer); // cancel the pending toggle
    startEdit(li);
});

filters.forEach((btn) => {
    btn.addEventListener("click", () => filterTodos(btn.dataset.filter));
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// Initialize
render();