const users = [
    { id: 1, name: "Amina", age: 21 },
    { id: 2, name: "Brian", age: 16 },
    { id: 3, name: "Wanjiku", age: 19 },
];

// Basic logging
console.log("Basic message");

// Styled logging
console.log("%cImportant!", "color: red; font-size: 20px;");

// Warnings and errors
console.warn("This might be a problem");
console.error("This is definitely wrong");

// Tables for arrays/objects
console.table(users);

// Grouping
console.group("User Processing");
console.log("Step 1");
console.log("Step 2");
console.groupEnd();

// Timing (fake network call that takes about 300ms)
function fetchUsers() {
    return new Promise((resolve) => setTimeout(() => resolve(users), 300));
}

console.time("fetchUsers");
await fetchUsers();
console.timeEnd("fetchUsers");

// Conditional logging: only prints when the condition is false
const x = -1;
console.assert(x > 0, "x should be positive");

// Stack trace
function inner() {
    console.trace("How did we get here?");
}
function outer() {
    inner();
}
outer();
