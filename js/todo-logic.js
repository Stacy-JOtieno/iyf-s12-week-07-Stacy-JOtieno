export const FILTER_ALL = "all";
export const FILTER_ACTIVE = "active";
export const FILTER_COMPLETED = "completed";
export const FILTERS = [FILTER_ALL, FILTER_ACTIVE, FILTER_COMPLETED];

const isActive = (todo) => !todo.completed;
const isCompleted = (todo) => todo.completed;

function updateTodo(todos, id, changes) {
    return todos.map((todo) => (todo.id === id ? { ...todo, ...changes } : todo));
}

export function isValidTodo(todo) {
    return (
        todo !== null &&
        typeof todo === "object" &&
        Number.isFinite(todo.id) &&
        typeof todo.text === "string" &&
        typeof todo.completed === "boolean"
    );
}

// Drops anything that isn't a well-formed todo (bad or old saved data)
export function sanitizeTodos(value) {
    return Array.isArray(value) ? value.filter(isValidTodo) : [];
}

export function getNextId(todos) {
    return todos.reduce((highest, todo) => Math.max(highest, todo.id), 0) + 1;
}

export function addTodo(todos, text) {
    const trimmed = text.trim();
    if (trimmed === "") {
        return todos;
    }
    return [...todos, { id: getNextId(todos), text: trimmed, completed: false }];
}

export function toggleTodo(todos, id) {
    return todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo));
}

export function deleteTodo(todos, id) {
    return todos.filter((todo) => todo.id !== id);
}

// An empty edit removes the task, same as your Week 5 behaviour
export function editTodo(todos, id, text) {
    const trimmed = text.trim();
    if (trimmed === "") {
        return deleteTodo(todos, id);
    }
    return todos.map((todo) => (todo.id === id ? { ...todo, text: trimmed } : todo));
}

export function clearCompleted(todos) {
    return todos.filter((todo) => !todo.completed);
}

export function filterTodos(todos, filter) {
    if (filter === "active") {
        return todos.filter((todo) => !todo.completed);
    }
    if (filter === "completed") {
        return todos.filter((todo) => todo.completed);
    }
    return todos;
}

export function countRemaining(todos) {
    return todos.filter((todo) => !todo.completed).length;
}

export function hasCompleted(todos) {
    return todos.some((todo) => todo.completed);
}