const DISCOUNT_THRESHOLD = 100;
const DISCOUNT_RATE = 0.1;

function calculateOrderTotal(items) {
    let total = 0;

    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        total += item.price * item.quantity;
    }

    if (total > DISCOUNT_THRESHOLD) {
        total = total * (1 - DISCOUNT_RATE);
    }

    return total;
}

const order = [
    { name: "Book", price: 15, quantity: 2 },
    { name: "Pen", price: 3, quantity: 5 },
    { name: "Notebook", price: 8, quantity: 3 },
];

console.log(calculateOrderTotal(order)); // 69

// Checks: console.assert prints only when something is wrong
const bigOrder = [{ name: "Textbook", price: 50, quantity: 3 }]; // 150, so 10% off
const exactlyHundred = [{ name: "Calculator", price: 100, quantity: 1 }];

console.assert(calculateOrderTotal(order) === 69, "Order under 100 should have no discount");
console.assert(calculateOrderTotal(bigOrder) === 135, "Order over 100 should get 10% off");
console.assert(calculateOrderTotal(exactlyHundred) === 100, "Exactly 100 gets no discount");
console.assert(calculateOrderTotal([]) === 0, "Empty order should total 0");
