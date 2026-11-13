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

function getTodoId(listItem) {
    return Number(listItem.dataset.id); // dataset values are strings
}

function handleSubmit(event) {
    event.preventDefault();
    if (addTodo(elements.input.value)) {
        elements.input.value = "";
    }
    elements.input.focus();
}

function handleListClick(event) {
    const listItem = event.target.closest(".todo-item");
    if (!listItem || event.target.classList.contains("edit-input")) {
        return;
    }

    const id = getTodoId(listItem);

    if (event.target.closest(".delete-btn")) {
        deleteTodo(id);
        return;
    }

    clearTimeout(clickTimer);
    clickTimer = setTimeout(() => toggleTodo(id), DOUBLE_CLICK_DELAY_MS);
}

function handleListDoubleClick(event) {
    const listItem = event.target.closest(".todo-item");
    if (!listItem || event.target.closest(".delete-btn")) {
        return;
    }

    clearTimeout(clickTimer); // cancel the pending toggle

    const id = getTodoId(listItem);
    const todo = state.todos.find((item) => item.id === id);
    if (!todo) {
        return;
    }

    startEdit(
        listItem,
        todo,
        (newText) => editTodo(id, newText),
        () => render(state)
    );
}

elements.form.addEventListener("submit", handleSubmit);
elements.list.addEventListener("click", handleListClick);
elements.list.addEventListener("dblclick", handleListDoubleClick);
elements.filterButtons.forEach((button) => {
    button.addEventListener("click", () => setFilter(button.dataset.filter));
});
elements.clearCompletedButton.addEventListener("click", clearCompleted);

subscribe(render);
render(state);
