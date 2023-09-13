
const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");

function addTask() {
    const taskName = inputBox.value;
    const dueDate = new Date(document.getElementById("due-date").value);

    if (taskName === '') {
        alert("Please fill in the task field.");
    } else if (isNaN(dueDate)) {
        alert("Please enter a valid due date.");
    } else {
        const currentDate = new Date();
        const tomorrow = new Date(currentDate);
        tomorrow.setDate(currentDate.getDate() + 1);

        if (dueDate < currentDate.setHours(0, 0, 0, 0)) {
            alert("Due date cannot be in the past. Please select a future date.");
        } else {
            let container = 'completed-container';

            if (dueDate.toDateString() === currentDate.toDateString()) {
                container = 'today-container';
            } else if (dueDate.toDateString() === tomorrow.toDateString()) {
                container = 'tomorrow-container';
            } else {
                container = 'other-container';
            }

            const taskText = taskName + " (Due: " + dueDate.toLocaleDateString() + ")";
            const li = document.createElement("li");
            li.innerHTML = `
                ${taskText}
            `;

            // Add the due date as a data attribute to the <li> element
            li.setAttribute("data-due-date", dueDate.toISOString());

            const span = document.createElement("span");
            span.innerHTML = "\u00d7";
            li.appendChild(span);

            const taskListContainer = document.querySelector(`.${container} ul`);
            taskListContainer.appendChild(li);

            // Convert the added task to speech
            speak("Task added: " + taskName);

            // Sort the tasks within the "other" container
            if (container === 'other-container') {
                sortTasksInOtherContainer();
            }
        }
    }

    inputBox.value = "";
    document.getElementById("due-date").value = ""; // Clear the due date
    saveData();
}




const tomorrowContainer = document.querySelector(".tomorrow-container ul");
const otherContainer = document.querySelector(".other-container ul");
const completedContainer = document.querySelector(".completed-container ul");

tomorrowContainer.addEventListener("click", function(e) {
if (e.target.tagName === "LI") {
    giveRewardAndMoveToCompleted(e.target);
} else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
}
}, false);

completedContainer.addEventListener("click", function(e) {
// if (e.target.tagName === "LI") {
//     e.target.classList.toggle("checked");
//     // ... (similar code for handling checked tasks)
if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
}
}, false);

otherContainer.addEventListener("click", function(e) {
if (e.target.tagName === "LI") {
    giveRewardAndMoveToCompleted(e.target);
} else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
}
}, false);


listContainer.addEventListener("click", function(e) {
if (e.target.tagName === "LI") {
    e.target.classList.toggle("checked");
    if (e.target.classList.contains("checked")) {
        giveReward();
    }
    updateTaskContainer(e.target);
    saveData();
} else if (e.target.tagName === "SPAN") {
    e.target.parentElement.remove();
    saveData();
}
}, false);



function giveRewardAndMoveToCompleted(taskElement) {
const rewards = JSON.parse(localStorage.getItem("rewards")) || {};

// Update or add the reward for completing a task
rewards.completedTasks = (rewards.completedTasks || 0) + 1;

// Save the updated rewards to local storage
localStorage.setItem("rewards", JSON.stringify(rewards));

// Play a sound effect when a task is completed
const audio = new Audio('Among Us Task Complete - Sound Effect for editing.mp3'); // Replace with the actual path to your audio file
audio.play();

rewardCounter.textContent = rewards.completedTasks;

// Move the completed task to the Completed container
taskElement.classList.add("checked"); // Apply the checked style
updateTaskContainer(taskElement); // Move it to the appropriate container
saveData();
}



function updateTaskContainer(taskElement) {
const dueDateText = taskElement.textContent.match(/\(Due: (.+)\)/);
if (dueDateText) {
    const dueDate = new Date(dueDateText[1]);
    const currentDate = new Date();
    const tomorrow = new Date(currentDate);
    tomorrow.setDate(currentDate.getDate() + 1);

    let container = 'completed-container';

    if (dueDate.toDateString() === currentDate.toDateString()) {
        container = 'today-container';
    } else if (dueDate.toDateString() === tomorrow.toDateString()) {
        container = 'tomorrow-container';
    }

    const taskListContainer = document.querySelector(`.${container} ul`);
    taskListContainer.appendChild(taskElement);
}
}


const rewardCounter = document.getElementById("reward-counter");
function myfunction(){
const num =JSON.parse(localStorage.getItem("rewards")).completedTasks;
rewardCounter.textContent = num;
console.log(num);
}
window.onload=function(){
myfunction();
}
function giveReward() {
// Get the current user's rewards from local storage (if any)
const rewards = JSON.parse(localStorage.getItem("rewards")) || {};

// Update or add the reward for completing a task
rewards.completedTasks = (rewards.completedTasks || 0) + 1;

// Save the updated rewards to local storage
localStorage.setItem("rewards", JSON.stringify(rewards));

// Notify the user about the reward (e.g., with an alert or a UI message)
const audio = new Audio('Among Us Task Complete - Sound Effect for editing.mp3'); // Replace with the actual path to your audio file
audio.play();

rewardCounter.textContent = rewards.completedTasks;

}

function saveData(){
    localStorage.setItem("data",listContainer.innerHTML);
    const tomorrowTasks = document.querySelector(".tomorrow-container ul").innerHTML;
    const otherTasks = document.querySelector(".other-container ul").innerHTML;
    const completedTasks = document.querySelector(".completed-container ul").innerHTML;

    localStorage.setItem("tomorrowTasks", tomorrowTasks);
    localStorage.setItem("otherTasks", otherTasks);
    localStorage.setItem("completedTasks", completedTasks);
}

function showTask(){
    listContainer.innerHTML=localStorage.getItem("data");
    const tomorrowTasks = localStorage.getItem("tomorrowTasks");
    const otherTasks = localStorage.getItem("otherTasks");
    const completedTasks = localStorage.getItem("completedTasks");
  
    document.querySelector(".tomorrow-container ul").innerHTML = tomorrowTasks || "";
    document.querySelector(".other-container ul").innerHTML = otherTasks || "";
    document.querySelector(".completed-container ul").innerHTML = completedTasks || "";
}
showTask();

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.continuous = false;
recognition.interimResults = false;
recognition.lang = 'en-US';

recognition.onresult = function(event) {
const result = event.results[0][0].transcript;
inputBox.value = result;
};

recognition.onerror = function(event) {
console.error('Speech recognition error:', event.error);
};

function startSpeechRecognition() {
recognition.start();
}

const synth = window.speechSynthesis;

function speak(text) {
const utterance = new SpeechSynthesisUtterance(text);
synth.speak(utterance);
}

function handleKeyDown(event) {
if (event.key === 'Enter') {
    addTask();
}
}


const darkModeToggle = document.getElementById("dark-mode-toggle");
const containerDivs = document.querySelectorAll(".today-container, .tomorrow-container, .completed-container, .other-container, .todo-app");

darkModeToggle.addEventListener("click", () => {
containerDivs.forEach(container => {
    container.classList.toggle("flip");
});

// Other dark mode toggle code
document.body.classList.toggle("dark-mode");
const isDarkMode = document.body.classList.contains("dark-mode");
localStorage.setItem("darkMode", isDarkMode);
});



// Check user's preference from local storage and apply dark mode if needed
const savedDarkMode = localStorage.getItem("darkMode");
if (savedDarkMode === "true") {
document.body.classList.add("dark-mode");
}


function searchTasks() {
const searchInput = document.getElementById("search-box").value.toLowerCase();
const tasks = document.querySelectorAll("#list-container li");

tasks.forEach(task => {
    const taskText = task.textContent.toLowerCase();
    if (taskText.includes(searchInput)) {
        task.style.display = "block";
    } else {
        task.style.display = "none";
    }
});
}


// window.onload = function () {
//     showTasks();
//     myfunction(); // This line may be needed if it's related to your rewards feature.
//   };
// Function to compare due dates for sorting
function compareDueDates(taskA, taskB) {
    const dueDateA = new Date(taskA.querySelector('.due-date').textContent);
    const dueDateB = new Date(taskB.querySelector('.due-date').textContent);
    return dueDateA - dueDateB;
}

// Function to sort tasks in the "other" container by due date
function sortTasksByDueDate() {
    const otherContainer = document.querySelector('.other-container ul');
    const taskElements = Array.from(otherContainer.querySelectorAll('li'));

    // Sort the task elements based on due date
    taskElements.sort(compareDueDates);

    // Clear the "other" container
    otherContainer.innerHTML = '';

    // Append the sorted task elements back to the "other" container
    taskElements.forEach(taskElement => {
        otherContainer.appendChild(taskElement);
    });
}

// Attach a click event listener to the sort button
const sortButton = document.getElementById('sort-button');
sortButton.addEventListener('click', sortTasksByDueDate);

function sortTasksInOtherContainer() {
    const otherContainer = document.querySelector('.other-container ul');
    const taskElements = Array.from(otherContainer.querySelectorAll('li'));

    // Sort the task elements based on due date
    taskElements.sort((taskA, taskB) => {
        const dueDateA = new Date(taskA.getAttribute("data-due-date"));
        const dueDateB = new Date(taskB.getAttribute("data-due-date"));
        return dueDateA - dueDateB;
    });

    // Clear the "other" container
    otherContainer.innerHTML = '';

    // Append the sorted task elements back to the "other" container
    taskElements.forEach(taskElement => {
        otherContainer.appendChild(taskElement);
    });
}

