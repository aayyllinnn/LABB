let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

function addTask() {
    const taskInput = document.getElementById("task-input");
    const dueDate = document.getElementById("due-date");

    if (taskInput.value.length < 3 || taskInput.value.length > 255) {
        alert("Zadanie musi mieć od 3 do 255 znaków.");
        return;
    }

    const currentDate = new Date();
    const dueDateValue = dueDate.value ? new Date(dueDate.value) : null;
    if (dueDateValue && dueDateValue < currentDate) {
        alert("Data musi być w przyszłości lub pusta.");
        return;
    }

    const task = {
        text: taskInput.value,
        dueDate: dueDate.value,
    };

    taskList.push(task);
    saveAndRenderTasks();

    taskInput.value = "";
    dueDate.value = "";
}

function saveAndRenderTasks() {
    localStorage.setItem("tasks", JSON.stringify(taskList));
    drawTasks();
}

function drawTasks() {
    const todoList = document.getElementById("todo-list");
    todoList.innerHTML = "";

    const searchTerm = document.getElementById("search").value.toLowerCase();
    let tasksToDisplay = taskList;

    if (searchTerm.length >= 2) {
        tasksToDisplay = taskList.filter(task => task.text.toLowerCase().includes(searchTerm))
            .concat(taskList.filter(task => !task.text.toLowerCase().includes(searchTerm)));
    }

    tasksToDisplay.forEach((task, index) => {
        const li = document.createElement("li");

        let dueDateFormatted = "Brak terminu";
        if (task.dueDate) {
            const date = new Date(task.dueDate);
            dueDateFormatted = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
        }

        let taskText = task.text;
        if (searchTerm) {
            taskText = taskText.replace(
                new RegExp(searchTerm, "gi"),
                match => `<span class="highlight">${match}</span>`
            );
        }

        li.innerHTML = `
            <span ondblclick="editTask(${index})">${taskText}</span> - 
            <small>${dueDateFormatted}</small>
            <button class="small-btn" onclick="removeTask(${index})">Usuń</button>
        `;
        todoList.appendChild(li);
    });
}

function removeTask(index) {
    taskList.splice(index, 1);
    saveAndRenderTasks();
}

function searchTasks() {
    drawTasks();
}

function editTask(index) {
    const li = document.querySelectorAll("#todo-list li")[index];
    const taskTextElement = li.querySelector("span");
    const oldText = taskTextElement.textContent;

    const input = document.createElement("input");
    input.type = "text";
    input.value = oldText;
    taskTextElement.replaceWith(input);
    input.focus();

    input.addEventListener("blur", () => {
        taskList[index].text = input.value;
        saveAndRenderTasks();
    });

    input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            taskList[index].text = input.value;
            saveAndRenderTasks();
        }
    });
}

document.addEventListener("DOMContentLoaded", saveAndRenderTasks);
