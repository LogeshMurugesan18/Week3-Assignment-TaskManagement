function Task(taskName, dueDate, priority, completed) {
    this.taskName = taskName;
    this.dueDate = dueDate;
    this.priority = priority;
    this.completed = completed;
}

Task.prototype.getTaskDetail = function() {
    return `${this.taskName} - Due: ${this.dueDate} - Priority: ${this.priority} - Completed: ${this.completed}`;
}

Task.prototype.toggleCompletion = function() {
    this.completed = !this.completed;
}

// Tasks Collection (Array)
let taskList = [];

// Array Methods & Spread Syntax
function addTask(...tasks) {
    taskList.push(...tasks);
    saveTasks();
}

function deleteLastTask() {
    taskList.pop();
    saveTasks();
}

function addTaskToFront(...tasks) {
    taskList.unshift(...tasks);
    saveTasks();
}

function deleteFirstTask() {
    taskList.shift();
    saveTasks();
}

// Recursion
function displayTask(task) {
    let taskElement = document.createElement('div');
    taskElement.classList.add('task');
    let taskTitle = document.createElement('h2');
    taskTitle.textContent = task.taskName;
    let taskDetails = document.createElement('p');
    taskDetails.textContent = task.getTaskDetail();
    let toggleButton = document.createElement('button');
    toggleButton.textContent = task.completed ? 'Mark Incomplete' : 'Mark Complete';
    toggleButton.addEventListener('click', function() {
        task.toggleCompletion();
        saveTasks();
        renderTasks();
    });
    taskElement.appendChild(taskTitle);
    taskElement.appendChild(taskDetails);
    taskElement.appendChild(toggleButton);
    let dependentTasks = taskList.filter(t => t.taskName !== task.taskName && t.priority === task.priority && t.dueDate === task.dueDate && t.completed === task.completed);
    if (dependentTasks.length > 0) {
        let dependentList = document.createElement('ul');
        dependentTasks.forEach(t => {
            let dependentItem = document.createElement('li');
            dependentItem.textContent = t.taskName;
            dependentList.appendChild(dependentItem);
            displayTask(t);
        });
        taskElement.appendChild(dependentList);
    }
    document.getElementById('task-list').appendChild(taskElement);
}

function displayTasks() {
    document.getElementById('task-list').innerHTML = '';
    taskList.forEach(t => {
        if (!t.priority) {
            displayTask(t);
        }
    });
}

// Closure & Modules
let taskCounter = (function() {
    let count = 0;
    return {
        increment: function() {
            count++;
        },
        getCount: function() {
            return count;
        }
    };
})();

// Promise, Async/Await & JSON
function saveTasks() {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            localStorage.setItem('taskList', JSON.stringify(taskList));
            resolve();
        }, 1000);
    });
}

async function loadTasks() {
    try {
        let data = await new Promise((resolve, reject) => {
            setTimeout(() => {
                let taskListData = localStorage.getItem('taskList');
                if (taskListData) {
                    resolve(JSON.parse(taskListData));
                } else {
                    resolve([]);
                }
            }, 1000);
        });
        taskList = data.map(t => new Task(t.taskName, t.dueDate, t.priority, t.completed));
        renderTasks();
    } catch (error) {
        console.log(error);
    }
}

// DOM Basics
function addTaskUI() {
    let taskName = document.getElementById('task-name').value;
    let dueDate = document.getElementById('due-date').value;
    let priority = document.getElementById('priority').value;
    let task = new Task(taskName, dueDate, priority, false);
    addTask(task);
    renderTasks();
    document.getElementById('task-name').value = '';
    document.getElementById('due-date').value = '';
    document.getElementById('priority').value = 'low';
}

function deleteTaskUI(taskName) {
    taskList = taskList.filter(t => t.taskName !== taskName);
    saveTasks();
    renderTasks();
}

function renderTasks() {
    displayTasks();
    taskCounter.increment();
    document.getElementById('task-counter').textContent = taskCounter.getCount();
}

document.getElementById('add-btn').addEventListener('click', addTaskUI);

loadTasks();