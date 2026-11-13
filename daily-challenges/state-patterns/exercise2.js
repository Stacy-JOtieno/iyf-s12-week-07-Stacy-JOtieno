const createStore = (initialState) => {
    let state = initialState;
    const listeners = [];

    return {
        getState: () => state,

        setState: (updates) => {
            state = { ...state, ...updates };
            listeners.forEach((listener) => listener(state)); // notify all listeners
        },

        subscribe: (listener) => {
            listeners.push(listener);
            // Return an unsubscribe function
            return () => {
                const index = listeners.indexOf(listener);
                if (index !== -1) {
                    listeners.splice(index, 1);
                }
            };
        },
    };
};

const store = createStore({ count: 0 });

const countElement = document.getElementById("count");
const logElement = document.getElementById("log");

function renderUI(state) {
    countElement.textContent = state.count;
}

function logChange(state) {
    logElement.textContent += `State changed: ${JSON.stringify(state)}\n`;
}

// Two subscribers reacting to the same store
store.subscribe(renderUI);
const unsubscribeLogger = store.subscribe(logChange);

document.getElementById("increment").addEventListener("click", () => {
    store.setState({ count: store.getState().count + 1 });
});

document.getElementById("stop-logging").addEventListener("click", () => {
    unsubscribeLogger();
});

renderUI(store.getState()); // show the starting value
