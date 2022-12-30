import './styles.css'
import icon from './expand.png'
import { saveToLocalStorage } from './utility.js'
import { updateMainscreen } from './utility.js'
import { updateSubscreen } from './utility.js'
import { getFromLocalStorage } from './utility.js'
function buttonSpawn() {
    var button = document.createElement("button");
    button.id = "newL"
    button.textContent = "Create List"
    button.addEventListener("click", function() {
        listModule()
    })
    document.body.appendChild(button);
    return button
  };
const sideBar = document.getElementById("sidebar")
const newListButton = buttonSpawn()
export const schedule = [] 
const display = document.getElementById("display")

export function Task(title, description, dueDate, priority) {
    this.title = title;
    this.description = description;
    this.dueDate = dueDate;
    this.priority = priority;
}
export function ToDoList(listName) {
    this.tasks = [];
    this.taskCount = this.tasks.length;
    this.listName = listName;
    this.creationDate = new Date();
    this.addTask = function (newTask) {
           this.tasks.push(newTask)
    }
    this.removeTask = function (selectedTask) {
        this.tasks.pop(selectedTask)
    }
    this.taskSelection = function (e) {
        for (const task of this.tasks) {
            if (task.title === e.target.textContent) {
                return task
            }
        }
        return null
    }
}

export const listModule = () => {
    document.body.removeChild(newListButton)
    var newLocal =`<form class="entryForm" action="#" method="post">
        <h4>Create A tasklist</h4>
        <label for="title">List title:</label>
        <input type="text" id="listName" name="List Title" placeholder="Insert Tasklist title here"><br>
        <button id="submitList">Submit List</button>
        </form>`
    display.innerHTML = newLocal
    var submitListButton = document.getElementById("submitList")
    submitListButton.addEventListener("click", function() {
        taskModule()
    })
}
export const taskModule = () => {
    var listName = document.getElementById("listName").value
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
        resetModule(listName)
    })
}
const resetModule = (listName) => {
    let priority = displayRadioValue()
    var title = document.getElementById("taskName").value
    var description = document.getElementById("description").value
    var dueDate = document.getElementById("dueDate").value
    display.innerHTML = " "
    let newTask  = new Task(title, description, dueDate, priority)
    var activeList = null
    for (const list of schedule) {
        if (list.listName === listName) {
            activeList = list
        }
    }
    // If a ToDoList with the same name was not found make a new one
    if (activeList === null) {
        activeList = new ToDoList(listName)
        saveToLocalStorage(listName, activeList.tasks)
        addToSchedule(activeList)
    }
    activeList.addTask(newTask)
    document.body.appendChild(newListButton)
    updateSidebar(activeList)
    updateMainscreen(activeList, newTask)
    updateSubscreen(newTask)
}
export function displayRadioValue() {
    var ele = document.getElementsByName('priority');
    for(let i = 0; i < ele.length; i++) {
        if(ele[i].checked) {
            var check = ele[i].value;
            return check
        }
    }
}
export function updateSidebar(selectedList) {
  const listsFromLocalStorage = getFromLocalStorage(selectedList);
  let lists;
  // Check if listsFromLocalStorage is an array
  if (!Array.isArray(listsFromLocalStorage)) {
    // If listsFromLocalStorage is not an array, create an empty array and spread it
    lists = [...[], ...schedule];
  } else {
    // If listsFromLocalStorage is an array, merge it with the schedule array
    lists = [...listsFromLocalStorage, ...schedule];
  }
  sideBar.innerHTML = "";
  for (const list of lists) {
    const listItem = document.createElement("ul");
    listItem.textContent = list.listName;
    listItem.className = "listBox";
    const expandButton = document.createElement("img");
    expandButton.src = icon;
    expandButton.className = "icon";
    listItem.appendChild(expandButton);
    sideBar.appendChild(listItem);
    listItem.addEventListener("click", function() {
      updateMainscreen(list);
      // Loop through the tasks in the selected list and add a list item for each task
      for (const task of list.tasks) {
        // Check if a task item for the task already exists
        let taskItemExists = false;
        const tasksInSideBar = sideBar.querySelectorAll(".task");
        for (const el of tasksInSideBar) {
          if (el.textContent === task.title) {
            taskItemExists = true;
            break;
          }
        }
        // If a task item for the task does not exist make one
        if (!taskItemExists) {
          const taskItem = document.createElement("li");
          taskItem.textContent = task.title;
          taskItem.className = "task";
          listItem.appendChild(taskItem);
          taskItem.addEventListener("click", e => {
            const selectedTask = list.taskSelection(e);
            updateSubscreen(selectedTask);
          });
        }
      }
    });
  }
}
export function addToSchedule(selectedList) {
    schedule.push(selectedList)
}
export function removeFromSchedule(selectedList) {
    schedule.pop(selectedList)
}