import { loadTodos, loadFilter, saveTodos, saveFilter } from "./storage.js";
import * as logic from "./todo-logic.js";

// Load ONCE, at startup
export const state = {
    todos: loadTodos(),
    filter: loadFilter(),
};

let onChange = () => {};

export function subscribe(listener) {
    onChange = listener;
}

// The one place that saves and notifies
function commit() {
    saveTodos(state.todos);
    saveFilter(state.filter);
    onChange(state);
}

function setTodos(todos) {
    state.todos = todos;
    commit();
}

export function addTodo(text) {
    const next = logic.addTodo(state.todos, text);
    if (next === state.todos) {
        return false; // empty text: nothing changed
    }
    setTodos(next);
    return true;
}

export function toggleTodo(id) {
    setTodos(logic.toggleTodo(state.todos, id));
}

export function deleteTodo(id) {
    setTodos(logic.deleteTodo(state.todos, id));
}

export function editTodo(id, text) {
    setTodos(logic.editTodo(state.todos, id, text));
}

export function clearCompleted() {
    setTodos(logic.clearCompleted(state.todos));
}

export function setFilter(filter) {
    state.filter = filter;
    commit();
}
