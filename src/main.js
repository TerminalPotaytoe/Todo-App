import './styles.css'

let tasks = [
    {
        title: "Walk the fish",
        date: "09/11/1945",
        desc: "Bring the fish to mt. everest for hiking.",
        status: false,
        id: "67676767",
    }

];
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

    newTask(e.target.elements.title.value, e.target.elements.dueDate.value, e.target.elements.desc.value, e.target.elements.done.checked);
    form.reset();
    overlay.classList.add('hidden');
})

const tasksContainer = document.querySelector('.tasks');

tasksContainer.addEventListener('click', (e) => {
    const deleteBtn = e.target.closest('.deletebtn');
    if (!deleteBtn) return;
    const cardEl = deleteBtn.closest('.card');
    const taskId = cardEl.dataset.id;        

    tasks = tasks.filter(t => t.id !== taskId);
    cardEl.remove();
});


renderTask()

