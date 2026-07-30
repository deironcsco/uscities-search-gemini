/**
 * app.js
 * 
 * Core logic for the US Cities Search application.
 * Handles: API integration, Debouncing, Sanitization, and UI Rendering.
 * 
 * Refactored: Removed dropdown suggestions in favor of dynamic result cards 
 * that update as the user types.
 */

// Configuration Constants
const API_BASE_URL = 'https://slutskcp-uscities-microservices-ddgpeagnc6czh6dd.canadacentral-01.azurewebsites.net/uscities-search/';
const DEBOUNCE_DELAY = 300; // ms

// DOM Elements
const searchInput = document.getElementById('search-input');
const searchButton = document.getElementById('search-button');
const resultsContainer = document.getElementById('results');

/**
 * Sanitizes user input to prevent basic XSS or injection attacks.
 * Choice: Uses regular expressions to strip out non-alphanumeric characters 
 * except spaces.
 */
function sanitizeInput(input) {
    if (!input) return '';
    return input.replace(/[^a-zA-Z0-9 ]/g, '').trim();
}

/**
 * Escapes HTML characters to safely render backend-provided text.
 */
function escapeHTML(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

/**
 * Debounce function to limit API calls during rapid typing.
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Fetches cities from the backend API.
 */
async function fetchCities(query) {
    const sanitized = sanitizeInput(query);
    if (!sanitized) return [];

    try {
        const response = await fetch(`${API_BASE_URL}${encodeURIComponent(sanitized)}`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        console.error("Failed to fetch cities:", error);
        return null;
    }
}

/**
 * Renders the results list in the UI.
 * Choice: Clears the container and builds cards for each result.
 */
function renderResults(cities) {
    resultsContainer.innerHTML = '';

    if (cities === null) {
        resultsContainer.innerHTML = `<div class="error">An error occurred while fetching data. Please try again later.</div>`;
        return;
    }

    if (cities.length === 0) {
        resultsContainer.innerHTML = `<div class="no-results">No cities found matching your search.</div>`;
        return;
    }

    cities.forEach(city => {
        const card = document.createElement('div');
        card.className = 'city-card';
        
        card.innerHTML = `
            <h3>${escapeHTML(city.city)}, ${escapeHTML(city.state_id)}</h3>
            <p><span class="label">State:</span> ${escapeHTML(city.state_name)}</p>
            <p><span class="label">County:</span> ${escapeHTML(city.county_name)}</p>
            <p><span class="label">Timezone:</span> ${escapeHTML(city.timezone)}</p>
            <p><span class="label">Zips:</span> ${escapeHTML(city.zips)}</p>
        `;
        resultsContainer.appendChild(card);
    });
}

/**
 * Triggers the main search execution.
 */
async function performSearch() {
    const query = searchInput.value;
    const sanitized = sanitizeInput(query);

    // Don't search for very short strings to avoid API noise
    if (sanitized.length < 2) {
        resultsContainer.innerHTML = '';
        return;
    }

    resultsContainer.innerHTML = '<div class="loading">Searching...</div>';
    const cities = await fetchCities(query);
    renderResults(cities);
}

/**
 * Handles the input event with debouncing.
 * Choice: Instead of a dropdown, we update the main results grid directly.
 */
const handleInput = debounce(() => {
    performSearch();
}, DEBOUNCE_DELAY);

// Event Listeners
searchInput.addEventListener('input', handleInput);

searchButton.addEventListener('click', performSearch);

// Allow pressing "Enter" to trigger search immediately
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        performSearch();
    }
});
