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

export function addTodo(text) {
    const next = logic.addTodo(state.todos, text);
    if (next === state.todos) {
        return false; // empty text: nothing changed
    }
    state.todos = next;
    commit();
    return true;
}

export function toggleTodo(id) {
    state.todos = logic.toggleTodo(state.todos, id);
    commit();
}

export function deleteTodo(id) {
    state.todos = logic.deleteTodo(state.todos, id);
    commit();
}

export function editTodo(id, text) {
    state.todos = logic.editTodo(state.todos, id, text);
    commit();
}

export function clearCompleted() {
    state.todos = logic.clearCompleted(state.todos);
    commit();
}

export function setFilter(filter) {
    state.filter = filter;
    commit();
}