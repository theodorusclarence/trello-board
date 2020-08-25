const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const listColumns = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnLoad = false;

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;

// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
    if (localStorage.getItem("backlogItems")) {
        backlogListArray = JSON.parse(localStorage.backlogItems);
        progressListArray = JSON.parse(localStorage.progressItems);
        completeListArray = JSON.parse(localStorage.completeItems);
        onHoldListArray = JSON.parse(localStorage.onHoldItems);
    } else {
        backlogListArray = ["Release the course", "Sit back and relax"];
        progressListArray = ["Work on projects", "Listen to music"];
        completeListArray = ["Being cool", "Getting stuff done"];
        onHoldListArray = ["Being uncool"];
    }
}

// Set localStorage Arrays
function updateSavedColumns() {
    listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray];
    const arrayNames = ["backlog", "progress", "complete", "onHold"];
    arrayNames.forEach((name, i) => {
        localStorage.setItem(`${name}Items`, JSON.stringify(listArrays[i]));
    });
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
    // List Item
    const listEl = document.createElement("li");
    listEl.classList.add("drag-item");
    listEl.textContent = item;
    listEl.draggable = true;
    listEl.setAttribute("ondragstart", "drag(event)");
    listEl.contentEditable = true;
    listEl.id = index;
    listEl.setAttribute("onfocusout", `updateItem(${index}, ${column})`);

    // Append
    columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
    // Check localStorage once
    if (!updatedOnLoad) {
        getSavedColumns();
    }
    // Backlog Column
    backlogList.textContent = "";
    backlogListArray.forEach((backlogItem, i) => {
        createItemEl(backlogList, 0, backlogItem, i);
    });
    // Progress Column
    progressList.textContent = "";
    progressListArray.forEach((progressItem, i) => {
        createItemEl(progressList, 1, progressItem, i);
    });
    // Complete Column
    completeList.textContent = "";
    completeListArray.forEach((completeItem, i) => {
        createItemEl(completeList, 2, completeItem, i);
    });
    // On Hold Column
    onHoldList.textContent = "";
    onHoldListArray.forEach((onHoldItem, i) => {
        createItemEl(onHoldList, 3, onHoldItem, i);
    });
    // Run getSavedColumns only once, Update Local Storage

    updatedOnLoad = true;
    updateSavedColumns();
}

// Update item - delete if necessary or update array value
function updateItem(id, column) {
    const selectedArray = listArrays[column];
    const selectedColumnEl = listColumns[column].children;

    if (!dragging) {
        if (!selectedColumnEl[id].textContent) {
            // delete selectedArray[id];
            selectedArray.splice(id, 1);
        } else {
            selectedArray[id] = selectedColumnEl[id].textContent;
        }

        updateDOM();
    }
}

// Add to column list, reset textbox
function addToColumn(column) {
    const itemText = addItems[column].textContent;
    if (itemText.length > 0) {
        const selectedArray = listArrays[column];
        selectedArray.push(itemText);
        updateDOM();
        addItems[column].textContent = "";
    }
}

// Show add Item input box
function showInputBox(column) {
    addBtns[column].style.visibility = "hidden";
    saveItemBtns[column].style.display = "flex";
    addItemContainers[column].style.display = "flex";
    addItems[column].focus();
}

// Hide item input box
function hideInputBox(column) {
    addBtns[column].style.visibility = "visible";
    saveItemBtns[column].style.display = "none";
    addItemContainers[column].style.display = "none";
    addToColumn(column);
}

// Allow arrays to reflect drag and drop items
function rebuildArrays() {
    backlogListArray = Array.from(backlogList.children).map((i) => i.textContent);
    completeListArray = Array.from(completeList.children).map((i) => i.textContent);
    progressListArray = Array.from(progressList.children).map((i) => i.textContent);
    onHoldListArray = Array.from(onHoldList.children).map((i) => i.textContent);

    updateDOM();
}

// When item start dragging
function drag(e) {
    draggedItem = e.target;
    dragging = true;
}

//  When Item enters column area
function dragEnter(column) {
    listColumns[column].classList.add("over");
    currentColumn = column;
}

// Column allows for item to drop
function allowDrop(e) {
    e.preventDefault();
}

// Dropping item in column
function drop(e) {
    e.preventDefault();
    // Remove Background Color/padding
    listColumns.forEach((column) => {
        column.classList.remove("over");
    });
    // Add Item to Column
    const parent = listColumns[currentColumn];
    parent.appendChild(draggedItem);
    // Dragging complete
    dragging = false;
    rebuildArrays();
}

// On Load
updateDOM();
