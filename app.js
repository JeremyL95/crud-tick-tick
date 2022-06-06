const taskInput = document.querySelector(".task-input input");
const taskContainer = document.querySelector(".task-container");
const filters = document.querySelectorAll(".filters span");
const btnClearAll = document.querySelector(".btn-clear");

let editID;
let isEditing = false;

let todos = JSON.parse(localStorage.getItem("todo-list"));

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("span.active").classList.remove("active");
    btn.classList.add("active");
    showToDoList(btn.id);
  });
});
showToDoList("all");

function showToDoList(filter) {
  let list = "";

  if (todos) {
    todos.forEach((todo, listID) => {
      let isCompleted = todo.status == "completed" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        list += `<li class="task">
                    <label for="${listID}">
                        <input onClick="updateStatus(this)" type="checkbox" id="${listID}" ${isCompleted}>
                        <p class="${isCompleted}">${todo.name}</p>
                    </label>
                    <div onClick="showMenu(this)" class="settings">
                        <i class="fas fa-ellipsis-h"></i>
                        <ul class="menu">
                            <li onClick="editTask(${listID}, '${todo.name}')"><i class="fas fa-edit"></i>Edit</li>
                            <li onClick="deleteTask(${listID})"><i class="fas fa-trash-alt"></i>Delete</li>
                        </ul>
                    </div>
                  </li>`;
      }
    });
  }
  taskContainer.innerHTML = list || `<span>You do not have any tasks here</span>`;
}

function updateStatus(selectedTask) {
  let taskName = selectedTask.parentElement.lastElementChild;

  if (selectedTask.checked) {
    taskName.classList.add("checked");
    todos[selectedTask.id].status = "completed";
  } else {
    taskName.classList.remove("checked");
    todos[selectedTask.id].status = "pending";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
}

function showMenu(currentTask) {
  let taskMenu = currentTask.lastElementChild;
  taskMenu.classList.add("show");

  document.addEventListener("click", (evt) => {
    if (evt.target.tagName != "I") {
      taskMenu.classList.remove("show");
    }
  });
}

function editTask(taskID, taskName) {
  editID = taskID;
  isEditing = true;
  taskInput.focus();
  taskInput.value = taskName;
}

function deleteTask(deleteCurrentID) {
  todos.splice(deleteCurrentID, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showToDoList("all");
}

taskInput.addEventListener("keyup", (evt) => {
  let userInput = taskInput.value.trim();

  if (evt.key === "Enter" && userInput) {
    if (!isEditing) {
      if (!todos) {
        todos = [];
      }
      let taskInfo = { name: userInput, status: "pending" };
      todos.push(taskInfo);
    } else {
      isEditing = false;
      todos[editID].name = userInput;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showToDoList("all");
  }
});

btnClearAll.addEventListener("click", () => {
  todos.splice(0, todos.length);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showToDoList("all");
});
