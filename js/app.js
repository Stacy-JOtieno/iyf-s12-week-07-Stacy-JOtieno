// DOM Elements
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const itemsLeft = document.getElementById("items-left");
const filters = document.querySelectorAll(".filter");
const clearCompletedBtn = document.getElementById("clear-completed");

// State
let todos = [];
let currentFilter = "all";
let nextId = 1;
let clickTimer = null; // used to tell a single click from a double-click

// Functions
function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.dataset.id = todo.id;

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text; // textContent, never innerHTML: user input stays plain text

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.type = "button";
    deleteBtn.textContent = "\u00d7";
    deleteBtn.setAttribute("aria-label", `Delete "${todo.text}"`);

    li.append(text, deleteBtn);
    return li;
}

function getVisibleTodos() {
    if (currentFilter === "active") return todos.filter(t => !t.completed);
    if (currentFilter === "completed") return todos.filter(t => t.completed);
    return todos;
}

function renderTodos() {
    todoList.innerHTML = ""; // clear the list (safe: no user data involved)

    const visible = getVisibleTodos();

    if (visible.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent = todos.length === 0 ? "Nothing to do yet. Add a task above!" : `No ${currentFilter} tasks.`;
        todoList.appendChild(empty);
    } else {
        visible.forEach(todo => todoList.appendChild(createTodoElement(todo)));
    }

    updateStats();
}

function addTodo(text) {
    const trimmed = text.trim();
    if (!trimmed) return false; // the `required` attribute allows "   ", so check here too

    todos.push({ id: nextId++, text: trimmed, completed: false });
    renderTodos();
    return true;
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) todo.completed = !todo.completed;
    renderTodos();
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function updateStats() {
    const remaining = todos.filter(t => !t.completed).length;
    itemsLeft.textContent = `${remaining} ${remaining === 1 ? "item" : "items"} left`;
    clearCompletedBtn.disabled = !todos.some(t => t.completed);
}

function filterTodos(filter) {
    currentFilter = filter;
    filters.forEach(btn => btn.classList.toggle("active", btn.dataset.filter === filter));
    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    renderTodos();
}

// Bonus: edit a task in place
function startEdit(li) {
    const id = Number(li.dataset.id);
    const todo = todos.find(t => t.id === id);
    const label = li.querySelector(".todo-text");
    if (!todo || !label) return;

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = todo.text;
    label.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    let finished = false; // blur fires after Enter/Escape re-render, so guard against running twice

    function finish(save) {
        if (finished) return;
        finished = true;

        if (save) {
            const newText = editInput.value.trim();
            if (newText) {
                todo.text = newText;
            } else {
                deleteTodo(id); // saving an empty edit removes the task
                return;
            }
        }
        renderTodos();
    }

    editInput.addEventListener("keydown", event => {
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
    if (event.target.classList.contains("edit-input")) return; // clicking inside the edit box

    const id = Number(li.dataset.id);

    if (event.target.closest(".delete-btn")) {
        deleteTodo(id);
        return;
    }

    // Wait briefly so a double-click (edit) doesn't also toggle the task
    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => toggleTodo(id), 220);
});

todoList.addEventListener("dblclick", function (event) {
    const li = event.target.closest(".todo-item");
    if (!li || event.target.closest(".delete-btn")) return;

    clearTimeout(clickTimer); // cancel the pending toggle
    startEdit(li);
});

filters.forEach(btn => {
    btn.addEventListener("click", () => filterTodos(btn.dataset.filter));
});

clearCompletedBtn.addEventListener("click", clearCompleted);

// Initialize
renderTodos();