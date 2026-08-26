const inputBox = document.getElementById("input-box");
const listContainer = document.getElementById("list-container");
const progressBar = document.getElementById("progress-bar");
const progressText = document.getElementById("progress-text");
const toast = document.getElementById("toast");

let currentFilter = 'all';

// Fungsi Menambah Tugas
function addTask() {
    const text = inputBox.value.trim();
    if (text === '') {
        showToast("Tuliskan sesuatu terlebih dahulu!");
        return;
    }

    const li = document.createElement("li");
    li.innerHTML = text;

    const span = document.createElement("span");
    span.innerHTML = "\u00d7"; // Simbol '×'
    li.appendChild(span);

    listContainer.appendChild(li);
    inputBox.value = "";
    
    saveData();
    updateUI();
}

// Event Listener pada Input (Tekan Enter untuk menambah tugas)
inputBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addTask();
    }
});

// Event Listener pada List (Check & Delete)
listContainer.addEventListener("click", function(e) {
    if (e.target.tagName === "LI") {
        e.target.classList.toggle("checked");
        saveData();
        updateUI();
    } else if (e.target.tagName === "SPAN") {
        e.target.parentElement.remove();
        saveData();
        updateUI();
    }
}, false);

// Fitur: Update Progress Bar & Filter View
function updateUI() {
    const tasks = listContainer.querySelectorAll("li");
    const completedTasks = listContainer.querySelectorAll("li.checked");

    // 1. Update Progress Bar
    const total = tasks.length;
    const completed = completedTasks.length;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    progressBar.style.width = percentage + "%";
    progressText.innerText = `${percentage}% completed (${completed}/${total})`;

    // 2. Terapkan Filter yang Sedang Aktif
    applyFilter();
}

// Fitur: Filtering Tasks
function filterTasks(filterType, element) {
    currentFilter = filterType;

    // Update kelas aktif pada tombol filter
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    if (element) element.classList.add('active');

    applyFilter();
}

function applyFilter() {
    const tasks = listContainer.querySelectorAll("li");
    tasks.forEach(task => {
        switch (currentFilter) {
            case 'all':
                task.style.display = "block";
                break;
            case 'active':
                task.style.display = task.classList.contains("checked") ? "none" : "block";
                break;
            case 'completed':
                task.style.display = task.classList.contains("checked") ? "block" : "none";
                break;
        }
    });
}

// Fitur: Toast Notification
function showToast(message) {
    toast.innerText = message;
    toast.classList.add("show");
    setTimeout(() => {
        toast.classList.remove("show");
    }, 2500);
}

// Fitur: Save & Load Data LocalStorage
function saveData() {
    localStorage.setItem("data", listContainer.innerHTML);
}

function showTask() {
    const data = localStorage.getItem("data");
    if (data) {
        listContainer.innerHTML = data;
    }
    updateUI();
}

showTask();