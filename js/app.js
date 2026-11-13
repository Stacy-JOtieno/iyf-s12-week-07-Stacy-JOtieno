import {
    state,
    subscribe,
    addTodo,
    toggleTodo,
    deleteTodo,
    editTodo,
    clearCompleted,
    setFilter,
} from "./state.js";
import { elements, render, startEdit } from "./ui.js";

const DOUBLE_CLICK_DELAY_MS = 220; // wait to tell a single click from a double-click
let clickTimer = null;

elements.form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (addTodo(elements.input.value)) {
        elements.input.value = "";
    }
    elements.input.focus();
});

// Event delegation: one listener on the <ul> handles every task
elements.list.addEventListener("click", (event) => {
    const li = event.target.closest(".todo-item");
    if (!li || event.target.classList.contains("edit-input")) {
        return;
    }

    const id = Number(li.dataset.id); // dataset values are strings

    if (event.target.closest(".delete-btn")) {
        deleteTodo(id);
        return;
    }

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => toggleTodo(id), DOUBLE_CLICK_DELAY_MS);
});

elements.list.addEventListener("dblclick", (event) => {
    const li = event.target.closest(".todo-item");
    if (!li || event.target.closest(".delete-btn")) {
        return;
    }

    clearTimeout(clickTimer); // cancel the pending toggle
    const id = Number(li.dataset.id);
    const todo = state.todos.find((item) => item.id === id);
    if (todo) {
        startEdit(
            li,
            todo,
            (newText) => editTodo(id, newText),
            () => render(state)
        );
    }
});

elements.filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
});

elements.clearCompletedButton.addEventListener("click", clearCompleted);

subscribe(render);
render(state);