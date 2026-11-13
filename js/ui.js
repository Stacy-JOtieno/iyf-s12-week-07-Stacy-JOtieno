import { filterTodos, countRemaining, hasCompleted } from "./todo-logic.js";

export const elements = {
    form: document.getElementById("todo-form"),
    input: document.getElementById("todo-input"),
    list: document.getElementById("todo-list"),
    itemsLeft: document.getElementById("items-left"),
    filterButtons: document.querySelectorAll(".filter"),
    clearCompletedButton: document.getElementById("clear-completed"),
};

function createTodoElement(todo) {
    const li = document.createElement("li");
    li.className = "todo-item" + (todo.completed ? " completed" : "");
    li.dataset.id = todo.id;

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text; // textContent, never innerHTML

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "\u00d7";
    deleteButton.setAttribute("aria-label", `Delete "${todo.text}"`);

    li.append(text, deleteButton);
    return li;
}

function renderList({ todos, filter }) {
    elements.list.innerHTML = "";
    const visible = filterTodos(todos, filter);

    if (visible.length === 0) {
        const empty = document.createElement("li");
        empty.className = "empty-message";
        empty.textContent =
            todos.length === 0 ? "Nothing to do yet. Add a task above!" : `No ${filter} tasks.`;
        elements.list.appendChild(empty);
        return;
    }
    visible.forEach((todo) => elements.list.appendChild(createTodoElement(todo)));
}

function renderStats({ todos }) {
    const remaining = countRemaining(todos);
    elements.itemsLeft.textContent = `${remaining} ${remaining === 1 ? "item" : "items"} left`;
    elements.clearCompletedButton.disabled = !hasCompleted(todos);
}

function renderFilters({ filter }) {
    elements.filterButtons.forEach((button) => {
        button.classList.toggle("active", button.dataset.filter === filter);
    });
}

export function render(state) {
    renderList(state);
    renderStats(state);
    renderFilters(state);
}

export function startEdit(li, todo, onSave, onCancel) {
    const label = li.querySelector(".todo-text");
    if (!label) {
        return;
    }

    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = todo.text;
    label.replaceWith(editInput);
    editInput.focus();
    editInput.select();

    let finished = false; // blur fires after the re-render, so guard against running twice

    function finish(save) {
        if (finished) {
            return;
        }
        finished = true;
        if (save) {
            onSave(editInput.value);
        } else {
            onCancel();
        }
    }

    editInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            finish(true);
        }
        if (event.key === "Escape") {
            finish(false);
        }
    });
    editInput.addEventListener("blur", () => finish(true));
}