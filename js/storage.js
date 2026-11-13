
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
