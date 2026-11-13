function calculateOrderTotal(items) {
    let total = 0;

    for (let i = 0; i <= items.length; i++) {
        const item = items[i];
        total += item.price * item.quanity;
    }

    if (total > 100) {
        total = total * 0.9; // 10% discount
    }

    return total;
}

const order = [
    { name: "Book", price: 15, quantity: 2 },
    { name: "Pen", price: 3, quantity: 5 },
    { name: "Notebook", price: 8, quantity: 3 },
];

console.log(calculateOrderTotal(order));
// Expected: 69