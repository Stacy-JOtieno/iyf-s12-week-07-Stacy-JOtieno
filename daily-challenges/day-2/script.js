
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const historyList = document.getElementById("historyList");
const searchMessage = document.getElementById("searchMessage");

// Load saved searches from localStorage
function getRecentSearches() {
    try {
        const savedSearches = localStorage.getItem("recentSearches");
        const searches = savedSearches ? JSON.parse(savedSearches) : [];

        return Array.isArray(searches) ? searches : [];
    } catch (error) {
        console.error("Could not load search history:", error);
        return [];
    }
}

let recentSearches = getRecentSearches();

// Save searches to localStorage
function saveSearch(searchTerm) {
    // Remove duplicates
    recentSearches = recentSearches.filter(
        search => search.toLowerCase() !== searchTerm.toLowerCase()
    );

    // Add the latest search at the beginning
    recentSearches.unshift(searchTerm);

    // Keep only the latest five searches
    recentSearches = recentSearches.slice(0, 5);

    try {
        localStorage.setItem(
            "recentSearches",
            JSON.stringify(recentSearches)
        );
    } catch (error) {
        console.error("Could not save search history:", error);
        searchMessage.textContent = "Unable to save search history.";
    }
}

// Display search history
function displayHistory() {
    historyList.innerHTML = "";

    recentSearches.forEach(search => {
        const listItem = document.createElement("li");

        listItem.textContent = search;

        // Click a previous search to search again
        listItem.addEventListener("click", () => {
            searchInput.value = search;
            performSearch(search);
        });

        historyList.appendChild(listItem);
    });
}

// Perform a search
function performSearch(searchTerm) {
    const cleanedSearch = searchTerm.trim();

    if (!cleanedSearch) {
        searchMessage.textContent = "Please enter a search term.";
        return;
    }

    saveSearch(cleanedSearch);

    searchMessage.textContent = `You searched for: ${cleanedSearch}`;

    displayHistory();
}

// Listen for form submission
searchForm.addEventListener("submit", event => {
    event.preventDefault();

    performSearch(searchInput.value);

    searchInput.value = "";
});

// Display saved searches when the page loads
displayHistory();
