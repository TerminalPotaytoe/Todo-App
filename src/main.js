import './styles.css'

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
    const raw = localStorage.getItem("tasks");
    return raw ? JSON.parse(raw) : [];
}

let tasks = loadTasks();
let editingId = null;
const newTaskBtn = document.querySelector('.newtask.btn');
const overlay = document.querySelector('.modal-overlay');
const form = document.getElementById('taskForm');
const template = document.querySelector('#template');

function newTask(title, date, desc, status){
    const task =  {
        title: title,
        date: date,
        desc: desc,
        status: status,
        id: crypto.randomUUID()
    }

    tasks.push(task);
    saveTasks();
    renderTask();
}

function renderTask(){
    tasksContainer.innerHTML = '';
    tasks.forEach(task => {
        
        const newTaskEl = template.content.cloneNode(true);

        newTaskEl.querySelector('.title').textContent = task.title;
        newTaskEl.querySelector('.date').textContent = `Due: ${task.date}`;
        newTaskEl.querySelector('.desc').textContent = task.desc;

        const statusbtn = newTaskEl.querySelector('.status-btn')
        if (task.status === true) {
            statusbtn.classList.remove('cross');
            statusbtn.classList.add('check');
            statusbtn.querySelector('i').classList.remove('fa-xmark');
            statusbtn.querySelector('i').classList.add('fa-check');
        }
        newTaskEl.querySelector('.card').dataset.id=task.id;

        document.querySelector('.tasks').appendChild(newTaskEl);
        console.log("Tasks on load:", tasks);
    });
}

newTaskBtn.addEventListener('click', (e) => {
    //unhides the thingy
    overlay.classList.remove('hidden');
    
})


overlay.addEventListener('click', (e) => {
    if (e.target.id === 'taskModal' || e.target.id === 'closeModal'){
        overlay.classList.add('hidden');
    }
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = {
        title: e.target.elements.title.value,
        date: e.target.elements.dueDate.value,
        desc: e.target.elements.desc.value,
        status: e.target.elements.done.checked,
    };
    
    if (!editingId) {
        newTask(e.target.elements.title.value, e.target.elements.dueDate.value, e.target.elements.desc.value, e.target.elements.done.checked);
        
    }
    else if (editingId) {
        const task = tasks.find(t => t.id === editingId);
        if (!task) return;
        Object.assign(task, data);
        editingId = null;
        renderTask();
    }
    saveTasks();
    form.reset();
    overlay.classList.add('hidden');
    
})

const tasksContainer = document.querySelector('.tasks');


tasksContainer.addEventListener('click', (e) => {
    const cardEl = e.target.closest('.card');
    if (!cardEl) return; //-> exit lor

    const taskId = cardEl.dataset.id;

    // ---DELETE CARD---
    if (e.target.closest('.deletebtn')) {
        tasks = tasks.filter(t => t.id !== taskId);
        
        cardEl.remove();
        saveTasks();
        return;
    }

    // ---- EDIT CARD ----
    if (e.target.closest('.editbtn')) {
        const task = tasks.find(t => t.id === taskId);
        if (!task) return;

        form.elements.title.value = task.title;
        form.elements.dueDate.value = task.date;
        form.elements.desc.value = task.desc;
        form.elements.done.checked = task.status;
        overlay.classList.remove('hidden');
        editingId = taskId;
        saveTasks();
        return;
    }

    if (e.target.closest('.status-btn')) {
        const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.status = !task.status;
    saveTasks();
    renderTask();
    return;
    }
});

renderTask()

