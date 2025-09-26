const API_URL = "http://127.0.0.1:5000/api/todos";

// Referências gerais
const form = document.getElementById("task-form");
const contentInput = document.getElementById("content");
const dueDateInput = document.getElementById("due_date");
const todoList = document.getElementById("todo-list");
const completedList = document.getElementById("completed-tasks");

// Referências de edição
const editDialog = document.getElementById("editDialog");
const editContent = document.getElementById("editContent");
const editDate = document.getElementById("editDate");
const saveEdit = document.getElementById("saveEdit");
const cancelEdit = document.getElementById("cancelEdit");

let editingTodoId = null; // guarda o id da tarefa sendo editada

// ========= Funções auxiliares =========
function formatDate(dateStr) {
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}
function getTodayFormatted() {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    return `${day}/${month}/${year}`;
}
function sortByDate(todos) {
    return todos.sort((a, b) => {
        const dateA = new Date(a.due_date);
        const dateB = new Date(b.due_date);
        return dateA - dateB;
    });
}
function isBefore(date1, date2) {
  // date1 e date2 podem vir como string (dd/mm/aaaa) ou Date
  let d1, d2;

  if (typeof date1 === "string") {
    const [day, month, year] = date1.split("/").map(Number);
    d1 = new Date(year, month - 1, day);
  } else {
    d1 = date1;
  }

  if (typeof date2 === "string") {
    const [day, month, year] = date2.split("/").map(Number);
    d2 = new Date(year, month - 1, day);
  } else {
    d2 = date2;
  }

  return d1.getTime() < d2.getTime();
}
function updateCounter(filteredTodos, id) {
    const taskCounter = document.getElementById(id);
    taskCounter.textContent = filteredTodos.length;
}
// ========= CRUD =========

// Carregar tarefas
async function loadTodos() {
    const response = await fetch(API_URL);
    const todos = await response.json();
    
    // limpa listas
    todoList.innerHTML = "";
    completedList.innerHTML = "";

    sortByDate(todos).forEach(todo => {
        const li = document.createElement("li");

        // bloco esquerdo (checkbox + texto em coluna)
        const taskContent = document.createElement("div");
        taskContent.classList.add("task-content");

        // checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.finish === 1;

        checkbox.addEventListener("change", async () => {
            await fetch(`${API_URL}/${todo.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    content: todo.content,
                    due_date: todo.due_date,
                    finish: checkbox.checked ? 1 : 0
                })
            });
            loadTodos();
        });

        // texto da tarefa
        const textContainer = document.createElement("div");
        textContainer.classList.add("task-text");

        const taskTitle = document.createElement("span");
        taskTitle.textContent = todo.content;
        taskTitle.classList.add("task-title");

        const dueDate = document.createElement("span");
        dueDate.textContent = `Due date: ${formatDate(todo.due_date)}`;

                
        if (formatDate(todo.due_date) === getTodayFormatted()) {
            dueDate.classList.add("due-date-today");
        } else if (isBefore(formatDate(todo.due_date), getTodayFormatted())){
            dueDate.classList.add("due-date-late");    
        }          
        else {
            dueDate.classList.add("due-date");
        }

        textContainer.appendChild(taskTitle);
        textContainer.appendChild(dueDate);

        taskContent.appendChild(checkbox);
        taskContent.appendChild(textContainer);

        // botão excluir
        const deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "🗑️";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", async () => {
            li.classList.add("removing"); // anima
            setTimeout(async () => {
                await fetch(`${API_URL}/${todo.id}`, { method: "DELETE" });
                loadTodos();
            }, 300); // espera a animação acabar
        });

        // botão editar
        const editBtn = document.createElement("button");
        li.classList.add("adding");
        setTimeout(() => li.classList.add("show"), 50);
        editBtn.innerHTML = "✏️";
        editBtn.classList.add("edit-btn");
        editBtn.addEventListener("click", () => {
            editingTodoId = todo.id;
            editContent.value = todo.content;
            editDate.value = todo.due_date; // precisa estar em YYYY-MM-DD
            editDialog.showModal();
        });

        // monta li
        li.appendChild(taskContent);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        if (todo.finish === 1) {
            taskContent.classList.add("task-completed");
            completedList.appendChild(li);
        } else {
            todoList.appendChild(li);
        }

        li.classList.add("adding");
        requestAnimationFrame(() => {
            li.classList.add("show");        
        });

        
    });

    updateCounter(todos.filter(t => t.finish === 0), "task-counter");       
    updateCounter(todos.filter(t => t.finish === 1), "completed-task-counter"); 
}

// Adicionar nova tarefa
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const newTodo = {
        content: contentInput.value,
        due_date: dueDateInput.value
    };

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo)
    });

    contentInput.value = "";
    dueDateInput.value = "";

    loadTodos();
});

// ========= Edição =========

// salvar edição
saveEdit.addEventListener("click", async (e) => {
    e.preventDefault();
    if (!editingTodoId) return;

    await fetch(`${API_URL}/${editingTodoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            content: editContent.value,
            due_date: editDate.value,
            finish: 0 // mantém como não concluída
        })
    });

    editDialog.close();
    loadTodos();
});

// cancelar edição
cancelEdit.addEventListener("click", () => {
    editDialog.close();
});

// primeira carga
loadTodos();
