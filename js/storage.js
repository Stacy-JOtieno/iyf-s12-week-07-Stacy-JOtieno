import { FILTERS, FILTER_ALL, sanitizeTodos } from "./todo-logic.js";

const TODOS_KEY = "todos";
const FILTER_KEY = "todo-filter";

// Save data to localStorage
export function saveToStorage(key, data) {
    try {
        const jsonData = JSON.stringify(data);
        localStorage.setItem(key, jsonData);
        return true;
    } catch (error) {
        console.error("Could not save data:", error);
        return false;
    }
}

// Retrieve data from localStorage
export function getFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        if (data === null) {
            return defaultValue;
        }
        return JSON.parse(data);
    } catch (error) {
        console.error("Could not retrieve data:", error);
        return defaultValue;
    }
}

// Remove data from localStorage
export function removeFromStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error("Could not remove data:", error);
        return false;
    }
}

export function loadTodos() {
    return sanitizeTodos(getFromStorage(TODOS_KEY, []));
}

export function saveTodos(todos) {
    return saveToStorage(TODOS_KEY, todos);
}

export function loadFilter() {
    const saved = getFromStorage(FILTER_KEY, FILTER_ALL);
    return FILTERS.includes(saved) ? saved : FILTER_ALL;
}

export function saveFilter(filter) {
    return saveToStorage(FILTER_KEY, filter);
}
