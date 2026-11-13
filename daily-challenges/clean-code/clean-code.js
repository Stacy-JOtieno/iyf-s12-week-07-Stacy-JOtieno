// Exercise 1: meaningful names
const ADULT_AGE = 18;
const DISCOUNT_RATE = 0.1;

const users = [
    { name: "Amina", age: 21 },
    { name: "Brian", age: 16 },
    { name: "Wanjiku", age: 18 },
];

const currentDate = new Date();
const adultUsers = users.filter((user) => user.age >= ADULT_AGE);

function calculateDiscount(price, quantity) {
    return price * quantity * DISCOUNT_RATE;
}

console.log(currentDate.toDateString(), adultUsers.length, calculateDiscount(150, 4));

// Exercise 2: single responsibility (stubs stand in for the database and email)
const MIN_USER_AGE = 18;
const database = { save: async (user) => console.log("saved", user.email) };
const emailService = { sendWelcome: async (email) => console.log("welcome sent to", email) };

function validateUser(userData) {
    if (!userData.email.includes("@")) {
        throw new Error("Invalid email");
    }
    if (userData.age < MIN_USER_AGE) {
        throw new Error("Must be adult");
    }
}

function normalizeUser(userData) {
    return { ...userData, email: userData.email.toLowerCase(), name: userData.name.trim() };
}

async function createUser(userData) {
    validateUser(userData);
    const normalizedUser = normalizeUser(userData);
    await database.save(normalizedUser);
    await emailService.sendWelcome(normalizedUser.email);
    return normalizedUser;
}

createUser({ name: " Amina ", email: "AMINA@Example.com", age: 21 }).catch(console.error);
createUser({ name: "Brian", email: "brian@example.com", age: 16 }).catch((error) =>
    console.log("Rejected:", error.message)
);

// Exercise 3: no magic numbers
const MIN_PASSWORD_LENGTH = 8;
const ONE_DAY_MS = 24 * 60 * 60 * 1000;
const HTTP_NOT_FOUND = 404;

const password = "abc123";
if (password.length < MIN_PASSWORD_LENGTH) {
    console.log(`Password must be at least ${MIN_PASSWORD_LENGTH} characters`);
}
console.log("One day in ms:", ONE_DAY_MS);
console.log("Is 404 not found?", HTTP_NOT_FOUND === 404);