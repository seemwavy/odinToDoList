
import { Task } from  './index.js'
import './styles.css'
import { displayRadioValue } from './index.js'
import { updateSidebar } from './index.js' 
import { addToSchedule } from './index.js'
import { removeFromSchedule } from './index.js'
const subScreen = document.getElementById("subScreen")
const mainScreen = document.getElementById("mainScreen")
export const updateMainscreen = (selectedList) => {
    var addAnotherTaskBtn = document.createElement("button")
    addAnotherTaskBtn.innerText = "Add Another Task"
    mainScreen.innerHTML = ""
    let listT = document.createElement("li") 
    listT.innerText = selectedList.listName
    mainScreen.innerText = selectedList.listName
    mainScreen.appendChild(subScreen)
    let editButton = document.createElement("button")
    editButton.className = "edit"
    editButton.innerHTML = "Edit List Name"
    editButton.addEventListener("click", function() {
        editToDoList(selectedList)
    })
    addAnotherTaskBtn.addEventListener("click", function() {
        addAnotherTask(selectedList)
    })
    mainScreen.appendChild(editButton)
    mainScreen.appendChild(addAnotherTaskBtn)
} 
export const updateSubscreen = (selectedTask) => {
    subScreen.innerHTML = ""
    let taskN = document.createElement("li"), dot = document.createElement("span")
    let taskD = document.createElement("p"), due = document.createElement("p")
    if (selectedTask.priority === "Low") {
        dot.className = "greenDot" 
    }
    else if (selectedTask.priority === "Medium") {
        dot.className = "yellowDot"
    }
    else if (selectedTask.priority === "High") {
        dot.className = "redDot"
    } 
    taskN.innerText = selectedTask.title
    taskD.innerText = "Description: " + selectedTask.description
    due.innerText = "Due: " + selectedTask.dueDate
    subScreen.appendChild(taskN)
    taskN.appendChild(taskD)
    taskN.appendChild(due)
    taskN.appendChild(dot)
    let editButton = document.createElement("button")
    editButton.className = "edit"
    editButton.innerHTML = "Edit Task"
    editButton.addEventListener("click", function() {
        editTask(selectedTask)
    })
    subScreen.appendChild(editButton) 
}

export function editToDoList(selectedList) {
    removeFromSchedule(selectedList)
    const listNameInput = document.createElement("input");
    listNameInput.type = "text";
    listNameInput.placeholder = "Enter new list name";
    mainScreen.appendChild(listNameInput);
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", () => {
        selectedList.listName = listNameInput.value;
        mainScreen.innerHTML = ""
        updateMainscreen(selectedList)
        saveToLocalStorage(selectedList.listName, selectedList)
        addToSchedule(selectedList)
        updateSidebar(selectedList)
    });
    mainScreen.appendChild(submitButton);
    
}


export function editTask(selectedTask) {
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.placeholder = "Enter new title";
    subScreen.appendChild(titleInput);
    const descriptionInput = document.createElement("input");
    descriptionInput.type = "text";
    descriptionInput.placeholder = "Enter new description";
    subScreen.appendChild(descriptionInput);
    const dueDateInput = document.createElement("input");
    dueDateInput.type = "text";
    dueDateInput.placeholder = "Enter new due date";
    subScreen.appendChild(dueDateInput);

    // Here be the radio button reading code -_-;
    const highPriorityRadio = document.createElement("input");
    highPriorityRadio.type = "radio";
    highPriorityRadio.name = "priority";
    highPriorityRadio.value = "High";
    subScreen.appendChild(highPriorityRadio);
    const highPriorityLabel = document.createElement("label");
    highPriorityLabel.textContent = "High";
    subScreen.appendChild(highPriorityLabel);
    const mediumPriorityRadio = document.createElement("input");
    mediumPriorityRadio.type = "radio";
    mediumPriorityRadio.name = "priority";
    mediumPriorityRadio.value = "Medium";
    subScreen.appendChild(mediumPriorityRadio);
    const mediumPriorityLabel = document.createElement("label")
    mediumPriorityLabel.textContent = "Medium"
    subScreen.appendChild(mediumPriorityLabel)
    const lowPriorityRadio = document.createElement("input");
    lowPriorityRadio.type = "radio";
    lowPriorityRadio.name = "priority";
    lowPriorityRadio.value = "Low";
    subScreen.appendChild(lowPriorityRadio);
    const lowPriorityLabel = document.createElement("label")
    lowPriorityLabel.textContent = "Low"
    subScreen.appendChild(lowPriorityLabel)
    const submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.addEventListener("click", () => {
        selectedTask.title = titleInput.value;
        selectedTask.description = descriptionInput.value
        selectedTask.dueDate = dueDateInput.value
        selectedTask.priority = displayRadioValue()
        subScreen.innerHTML= ""
        updateSubscreen(selectedTask)
    });
    subScreen.appendChild(submitButton)
}
export const addAnotherTask = (selectedList) => {
    var newListButton = document.getElementById("newL")
    document.body.removeChild(newListButton)
    let listName = selectedList.listName
    display.innerHTML = " "
    var newLocal = `<form class="entryForm" action="#" method="post">
            <h2>Create a task</h2>
            <label for="Task Name">Task Name</label>
            <input type="text" id="taskName" name="task Name" placeholder="Insert Task Name Here"><br>
            <label for="taskDescription">Task description</label>
            <input type="text" id="description" name="taskDescription" placeholder="task description here"><br>
            <label for="dueDate">Due date</label>
            <input type="text" id="dueDate" name="dueDate" placeholder="Insert due date here"><br>
            <label for="priority">Priorty:</label><br>
            <input type="radio" id="priority" name="priority" value="High" ><label for="priority">High</label>
            <input type="radio" id="priority" name="priority" value="Medium"><label for="priority">Medium</label>
            <input type="radio" id="priority" name="priority" value="Low"><label for="priority">Low</label>
            <button id="submitTask">Submit</button>
            </form>`
    display.innerHTML += newLocal
    var submitTaskButton = document.getElementById("submitTask")
    submitTaskButton.addEventListener("click", function() {
        let priority = displayRadioValue()
        var title = document.getElementById("taskName").value
        var description = document.getElementById("description").value
        var dueDate = document.getElementById("dueDate").value
        display.innerHTML = " "
        let newTask  = new Task(title, description, dueDate, priority)
        saveToLocalStorage(listName, newTask)
        selectedList.addTask(newTask)
        updateSidebar()
        updateMainscreen(selectedList)
        updateSubscreen(newTask)
        document.body.appendChild(newListButton)
    })
}
export function saveToLocalStorage(listName, data) {
localStorage.setItem(listName, JSON.stringify(data));
}

export function getFromLocalStorage(listName) {
return JSON.parse(localStorage.getItem(listName));
}