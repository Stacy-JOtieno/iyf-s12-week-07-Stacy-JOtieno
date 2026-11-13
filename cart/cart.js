const CART_KEY = "cart";
const MAX_HISTORY = 20;

// Centralized state. Only the cart is saved: products are fixed.
// `image` is an emoji so it works offline; swap in image paths later if you like.
const state = {
    products: [
        { id: 1, name: "Mandazi (pack of 6)", price: 120, image: "🍩" },
        { id: 2, name: "Chapati (pack of 5)", price: 150, image: "🫓" },
        { id: 3, name: "Tea leaves 250g", price: 180, image: "🍵" },
    ],
    cart: [], // { productId, quantity }
    history: [], // earlier copies of the cart, for Undo (kept in memory only)
};

const productList = document.getElementById("product-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const undoButton = document.getElementById("undo-btn");
const clearButton = document.getElementById("clear-btn");

// Storage helpers
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch {
        console.warn("Could not save the cart (storage full or blocked).");
    }
}

function getFromStorage(key, defaultValue = null) {
    const data = localStorage.getItem(key);
    if (data === null) return defaultValue;
    try {
        return JSON.parse(data);
    } catch {
        return defaultValue; // bad JSON: don't crash
    }
}

// Keep only well-formed items whose product still exists
function loadCart() {
    const saved = getFromStorage(CART_KEY, []);
    if (!Array.isArray(saved)) return [];
    return saved.filter(
        (item) =>
            item &&
            Number.isInteger(item.productId) &&
            Number.isInteger(item.quantity) &&
            item.quantity > 0 &&
            state.products.some((product) => product.id === item.productId)
    );
}

// One place that saves and redraws
function commit() {
    saveToStorage(CART_KEY, state.cart);
    renderCart();
}

// The one function that replaces the cart (remembering the old one for Undo)
function setCart(newCart) {
    state.history.push(state.cart.map((item) => ({ ...item })));
    if (state.history.length > MAX_HISTORY) {
        state.history.shift();
    }
    state.cart = newCart;
    commit();
}

// Actions
function addToCart(productId) {
    const existing = state.cart.find((item) => item.productId === productId);

    if (existing) {
        setCart(
            state.cart.map((item) =>
                item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
            )
        );
    } else {
        setCart([...state.cart, { productId, quantity: 1 }]);
    }
}

function updateQuantity(productId, quantity) {
    if (quantity <= 0) {
        removeFromCart(productId); // update or remove if quantity is 0
        return;
    }
    setCart(
        state.cart.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
}

function removeFromCart(productId) {
    setCart(state.cart.filter((item) => item.productId !== productId));
}

function clearCart() {
    if (state.cart.length === 0) return;
    setCart([]);
}

// Bonus: restore the previous cart
function undo() {
    if (state.history.length === 0) return;
    state.cart = state.history.pop();
    commit();
}

// Calculated values (never stored)
function getProduct(productId) {
    return state.products.find((product) => product.id === productId);
}

function getCartTotal() {
    return state.cart.reduce((total, item) => {
        const product = getProduct(item.productId);
        return product ? total + product.price * item.quantity : total;
    }, 0);
}

function getCartCount() {
    return state.cart.reduce((count, item) => count + item.quantity, 0);
}

function formatPrice(amount) {
    return `KSh ${amount.toLocaleString("en-KE")}`;
}

// Rendering helpers (textContent only, never innerHTML for data)
function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
}

function createButton(label, action, productId, ariaLabel) {
    const button = createElement("button", "", label);
    button.type = "button";
    button.dataset.action = action;
    button.dataset.id = productId;
    if (ariaLabel) button.setAttribute("aria-label", ariaLabel);
    return button;
}

// Products never change, so draw them once
function renderProducts() {
    state.products.forEach((product) => {
        const item = createElement("li", "product");
        item.append(
            createElement("span", "product-image", product.image),
            createElement("strong", "", product.name),
            createElement("span", "", formatPrice(product.price)),
            createButton("Add to Cart", "add", product.id)
        );
        productList.appendChild(item);
    });
}

function renderCart() {
    cartItems.innerHTML = "";

    if (state.cart.length === 0) {
        cartItems.appendChild(createElement("li", "empty", "Your cart is empty."));
    }

    state.cart.forEach((item) => {
        const product = getProduct(item.productId);
        if (!product) return;

        const row = createElement("li", "cart-item");

        const controls = createElement("span", "quantity");
        controls.append(
            createButton("−", "decrease", product.id, `Decrease quantity of ${product.name}`),
            createElement("span", "", String(item.quantity)),
            createButton("+", "increase", product.id, `Increase quantity of ${product.name}`)
        );

        row.append(
            createElement("span", "cart-name", product.name),
            controls,
            createElement("span", "", formatPrice(product.price * item.quantity)),
            createButton("Remove", "remove", product.id, `Remove ${product.name}`)
        );
        cartItems.appendChild(row);
    });

    cartCount.textContent = getCartCount();
    cartTotal.textContent = formatPrice(getCartTotal());
    undoButton.disabled = state.history.length === 0;
    clearButton.disabled = state.cart.length === 0;
}

// Event delegation: one handler for every button in both lists
function handleAction(event) {
    const button = event.target.closest("button[data-action]");
    if (!button) return;

    const productId = Number(button.dataset.id); // dataset values are strings
    const item = state.cart.find((cartItem) => cartItem.productId === productId);
    const currentQuantity = item ? item.quantity : 0;

    switch (button.dataset.action) {
        case "add":
            addToCart(productId);
            break;
        case "increase":
            updateQuantity(productId, currentQuantity + 1);
            break;
        case "decrease":
            updateQuantity(productId, currentQuantity - 1);
            break;
        case "remove":
            removeFromCart(productId);
            break;
    }
}

productList.addEventListener("click", handleAction);
cartItems.addEventListener("click", handleAction);
clearButton.addEventListener("click", clearCart);
undoButton.addEventListener("click", undo);

// Initialize: load ONCE
state.cart = loadCart();
renderProducts();
renderCart();