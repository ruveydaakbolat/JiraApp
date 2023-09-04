const listColumns = document.querySelectorAll('.drag-item-list');

const todoList = document.getElementById('todo-list');
const progressList = document.getElementById('progress-list');
const doneList = document.getElementById('done-list');

const addButtons = document.querySelectorAll('.add-btn:not(.update)');
const saveButtons = document.querySelectorAll('.update');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');

let todoListArray = [];
let progressListArray = [];
let doneListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;
let dragging = false;

let updatedOnLoad = false;

function getSavedColumns() {
  if (localStorage.getItem("todoItems")) {
    todoListArray = JSON.parse(localStorage.getItem("todoItems"));
    progressListArray = JSON.parse(localStorage.getItem("progressItems"));
    doneListArray = JSON.parse(localStorage.getItem("doneItems"));
  } else {
    todoListArray = ["React Entegrasyonu", "Angular Entegrasyonu"];
    progressListArray = ["Sendgrid Entegrasyonu"];
    doneListArray = ["Verimor Entegrasyonu"];
  }
}

function updateSavedColumns() {
  listArrays = [todoListArray, progressListArray, doneListArray];
  const arrayNames = ["todo", "progress", "done"];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(
      `${arrayName}Items`,
      JSON.stringify(listArrays[index])
    );
  });
}

function createItem(columnItem, column, item, index) {
    const listItem = document.createElement('li');
    listItem.classList.add('drag-item');
    listItem.textContent = item;
    listItem.draggable = true;
    listItem.contentEditable = true;
    listItem.setAttribute('onfocusout', `updateItem(${index},${column})`);
    listItem.setAttribute('ondragstart','drag(event)');
    columnItem.appendChild(listItem);
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;

  if (!dragging) {
    if (!selectedColumn[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent;
    }
    updateDOM();
  }
}

function allowDrop(e) {
  e.preventDefault();
}
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function updateInsideArrays() {
  todoListArray = [];
  for (let i = 0; i < todoList.children.length; i++) {
    todoListArray.push(todoList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  doneListArray = [];
  for (let i = 0; i < doneList.children.length; i++) {
    doneListArray.push(doneList.children[i].textContent);
  }

  updateDOM();
}

function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];

  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  parent.appendChild(draggedItem);
  dragging = false;
  updateInsideArrays();
}

function drag(e) {
    draggedItem = e.target;
    dragging = true;
}

function filterArray(array) {
  const filteredArray = array.filter((item) => item !== null);
  return filteredArray;
}

function updateDOM() {
    if(!updatedOnLoad)
    {
        getSavedColumns();
    }

    todoList.textContent = '';
    todoListArray.forEach((todoItem, index) => {
        createItem(todoList, 0, todoItem, index);
    });
    todoListArray = filterArray(todoListArray);

    progressList.textContent = '';
    progressListArray.forEach((progressItem, index) => {
        createItem(progressList, 1, progressItem, index);
    });
    progressListArray = filterArray(progressListArray);

    doneList.textContent = '';
    doneListArray.forEach((doneItem, index) => {
        createItem(doneList, 2, doneItem, index);
    });
    doneListArray = filterArray(doneListArray);

    updatedOnLoad = true;

    updateSavedColumns();
}

function showItemDiv(column) {
  addButtons[column].style.visibility = 'hidden';
  addItemContainers[column].style.display = 'flex';
  saveButtons[column].style.display = 'flex';
}

function hideItemDiv(column) {
  addButtons[column].style.visibility = 'visible';
  addItemContainers[column].style.display = 'none';
  saveButtons[column].style.display = 'none';
  addToColumn(column);
}

function addToColumn(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = '';
  updateDOM();
}

updateDOM()
