document.addEventListener("DOMContentLoaded", function() {
    const carTable = document.getElementById("car-table");
    const categorySelector = document.querySelector("#search-selector .selector:nth-child(1)");
    const tagSelector = document.querySelector("#search-selector .selector:nth-child(2)");
    const randomButton = document.getElementById("random-button");
    const searchInput = document.getElementById("search-input");

    // Extract all unique categories and tags from the table
    const categoriesSet = new Set();
    const tagsSet = new Set();
    carTable.querySelectorAll("tr").forEach(function(row) {
        const categories = row.dataset.categories;
        const tags = row.dataset.tags;
        if (categories) {
            categories.split(", ").forEach(function(category) {
                categoriesSet.add(category);
            });
        }
        if (tags) {
            tags.split(", ").forEach(function(tag) {
                tagsSet.add(tag);
            });
        }
    });

    // Generate buttons for categories
    categoriesSet.forEach(function(category) {
        const button = createButton(category, filterCarsByCategory);
        categorySelector.appendChild(button);
    });

    // Generate buttons for tags
    tagsSet.forEach(function(tag) {
        const button = createButton(tag, filterCarsByTag);
        tagSelector.appendChild(button);
    });

    // Function to create a button with event listener
    function createButton(text, onClick) {
        const button = document.createElement("button");
        button.textContent = text;
        button.addEventListener("click", function() {
            toggleButton(button);
            onClick(text);
        });
        return button;
    }

    // Function to toggle button selection state
    function toggleButton(button) {
        button.classList.toggle("selected");
    }

    // Function to filter cars based on selected category
    function filterCarsByCategory(category) {
        const selectedCategories = getSelectedItems(categorySelector);
        const selectedTags = getSelectedItems(tagSelector);
        filterCars(selectedCategories, selectedTags, "categories");
    }

    // Function to filter cars based on selected tag
    function filterCarsByTag(tag) {
        const selectedCategories = getSelectedItems(categorySelector);
        const selectedTags = getSelectedItems(tagSelector);
        filterCars(selectedCategories, selectedTags, "tags");
    }

    // Function to filter cars based on selected criteria (categories or tags)
    function filterCars(selectedCategories, selectedTags, criteria) {
        carTable.querySelectorAll("tr").forEach(function(row) {
            const categories = row.dataset.categories ? row.dataset.categories.split(", ") : [];
            const tags = row.dataset.tags ? row.dataset.tags.split(", ") : [];
            if ((selectedCategories.length === 0 || selectedCategories.every(cat => categories.includes(cat))) &&
                (selectedTags.length === 0 || selectedTags.every(tag => tags.includes(tag)))) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    // Function to get selected items from the selector
    function getSelectedItems(selector) {
        return Array.from(selector.querySelectorAll("button.selected")).map(button => button.textContent);
    }

    // Event listener for random car button
    randomButton.addEventListener("click", function() {
        const visibleRows = Array.from(carTable.querySelectorAll("tr")).filter(row => row.style.display !== "none");
        const randomIndex = Math.floor(Math.random() * visibleRows.length);
        const primaryUrl = visibleRows[randomIndex].dataset.primaryUrl;
        if (primaryUrl) {
            window.open(primaryUrl, "_blank");
        } else {
            alert("Primary URL not available for the selected car.");
        }
    });

    // Event listener for search input
    searchInput.addEventListener("input", function() {
        const searchText = searchInput.value.toLowerCase().trim();
        carTable.querySelectorAll("tr").forEach(function(row) {
            const name = row.dataset.name.toLowerCase();
            const manufacturer = row.dataset.manufacturer.toLowerCase();
            if (name.includes(searchText) || manufacturer.includes(searchText)) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    });
});
