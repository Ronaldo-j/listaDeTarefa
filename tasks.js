document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    fetch(`http://localhost:3000/user?email=${email}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('userName').textContent = data.name;
            document.getElementById('userNameSettings').textContent = data.name;
            document.getElementById('userEmailSettings').value = data.email;
            tasks = data.tasks || [];
            trash = data.trash || [];
            renderTasks();
            renderTrash();
            renderCalendar();
        });

        document.getElementById("addTaskForm").addEventListener("submit", function(event) {
            event.preventDefault();
            const taskTitle = document.getElementById("taskTitle").value.trim();
            const taskInput = document.getElementById("taskInput");
            const taskDate = document.getElementById("taskDate");
            const taskName = taskInput.value.trim();
            if (taskName !== "") {
                addTask(taskTitle, taskName, taskDate.value);
                taskInput.value = "";
                taskDate.value = "";
            }
        });        
});

function addTask(taskTitle, taskName, taskDate) {
    tasks.push({ title: taskTitle, name: taskName, date: taskDate, completed: false });
    renderTasks();
    renderCalendar();
    saveData();
}

function renderTasks() {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = `${task.name} (Data: ${task.date})`;
        if (task.completed) {
            li.style.textDecoration = "line-through";
        }

        const buttonContainer = document.createElement("div");

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Excluir";
        deleteButton.addEventListener("click", function() {
            deleteTask(index);
        });

        buttonContainer.appendChild(deleteButton);
        li.appendChild(buttonContainer);
        taskList.appendChild(li);
    });
}

function renderTrash() {
    const trashList = document.getElementById("trashList");
    trashList.innerHTML = "";
    trash.forEach((task, index) => {
        const li = document.createElement("li");
        li.textContent = `${task.name} (Data: ${task.date})`;

        const buttonContainer = document.createElement("div");

        const restoreButton = document.createElement("button");
        restoreButton.textContent = "Restaurar";
        restoreButton.addEventListener("click", function() {
            restoreTask(index);
        });

        const permanentlyDeleteButton = document.createElement("button");
        permanentlyDeleteButton.textContent = "Excluir Permanentemente";
        permanentlyDeleteButton.addEventListener("click", function() {
            permanentlyDeleteTask(index);
        });

        buttonContainer.appendChild(restoreButton);
        buttonContainer.appendChild(permanentlyDeleteButton);
        li.appendChild(buttonContainer);
        trashList.appendChild(li);
    });
}

function toggleTask(index) {
    tasks[index].completed = !tasks[index].completed;
    renderTasks();
    saveData();
}

function deleteTask(index) {
    trash.push(tasks.splice(index, 1)[0]);
    renderTasks();
    renderTrash();
    renderCalendar();
    saveData();
}

function restoreTask(index) {
    tasks.push(trash.splice(index, 1)[0]);
    renderTasks();
    renderTrash();
    renderCalendar();
    saveData();
}

function permanentlyDeleteTask(index) {
    trash.splice(index, 1);
    renderTrash();
    saveData();
}

function renderCalendar() {
    $('#calendarView').fullCalendar('destroy'); // Remove the previous calendar before re-rendering
    $('#calendarView').fullCalendar({
        events: tasks.map(task => ({
            title: task.name,
            start: task.date
        })),
        dayRender: function (date, cell) {
            const dayHasTasks = tasks.some(task => moment(task.date).isSame(date, 'day'));
            if (dayHasTasks) {
                cell.append('<div class="task-dot"></div>');
            }
        },
        eventMouseover: function (calEvent, jsEvent) {
            const tooltip = `<div class='tooltip'>${calEvent.title}</div>`;
            $("body").append(tooltip);
            $(this).mouseover(function (e) {
                $(this).css('z-index', 10000);
                $('.tooltip').fadeIn('500');
                $('.tooltip').fadeTo('10', 1.9);
            }).mousemove(function (e) {
                $('.tooltip').css('top', e.pageY + 10);
                $('.tooltip').css('left', e.pageX + 20);
            });
        },
        eventMouseout: function (calEvent, jsEvent) {
            $(this).css('z-index', 8);
            $('.tooltip').remove();
        }
    });
}


function openTab(event, tabName) {
    const tablinks = document.getElementsByClassName("tablink");
    const tabcontents = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    for (let i = 0; i < tabcontents.length; i++) {
        tabcontents[i].classList.remove("active");
    }
    document.getElementById(tabName).classList.add("active");
    event.currentTarget.classList.add("active");
}

function saveData() {
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    fetch('http://localhost:3000/saveTasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, tasks, trash })
    })
    .catch(error => console.error('Erro ao salvar tarefas:', error));
}

function logout() {
    window.location.href = "index.html";
}

function updateEmail() {
    const newEmail = document.getElementById('userEmailSettings').value.trim();
    if (newEmail) {
        const urlParams = new URLSearchParams(window.location.search);
        const email = urlParams.get('email');
        fetch('http://localhost:3000/updateEmail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ currentEmail: email, newEmail }) // alterado de oldEmail para currentEmail
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Email atualizado com sucesso') {
                alert('Email atualizado com sucesso!');
                window.location.href = `tasks.html?email=${encodeURIComponent(newEmail)}`;
            } else {
                alert(data.message);
            }
        })
        .catch(error => console.error('Erro ao atualizar email:', error));
    }
}

// Endpoint para atualizar email
app.post('/updateEmail', (req, res) => {
    const { currentEmail, newEmail } = req.body; // alterado de oldEmail para currentEmail
    const user = users.find(user => user.email === currentEmail);
    if (user) {
        if (users.find(u => u.email === newEmail)) {
            return res.status(400).json({ message: 'Novo email já está em uso' });
        }
        user.email = newEmail;
        res.status(200).json({ message: 'Email atualizado com sucesso' });
    } else {
        res.status(404).json({ message: 'Usuário não encontrado' });
    }
});

