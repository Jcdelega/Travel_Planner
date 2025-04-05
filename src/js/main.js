
class Travel {
    constructor(name, from, to, duration, country, transportation) {
        this.name = name;
        this.from = from;
        this.to = to;
        this.duration = Number(duration);
        this.country = country;
        this.transportation = transportation;
        this.tasks = [];
        this.price;
    }
    addTask(task){
        if(this.tasks.includes(task)){
            showModal("This task is already in your list");
            return;
        }else{
            this.tasks.push(task);
            showModal("Task added correctly");
        }
    }
    deleteTask(task){
        const index = this.tasks.indexOf(task);
        if(index !== -1){
            this.tasks.splice(index, 1);
            showModal("Task deleted");
        }else{
            showModal("Task not found");
        }
    }
    showDetails(){
        const {name, from, to, duration, country} = this;
        console.log(`Travel "${name}" from ${from} to ${to} by ${transportation}, ${country}, It lasts ${duration}`);
        if(this.tasks.length === 0){
            console.log("There is no tasks");
        }else{
            console.log("Tasks:");
            this.tasks.forEach((task, index)=>console.log(`${index + 1}. ${task}`));
        }
    }
    priceCalculation() {
        this.price = 0;
    
        // Price by arrival place
        if (this.to.toLowerCase() === "paris") {
            this.price = 500;
        } else if (this.to.toLowerCase() === "london") {
            this.price = 400;
        } else if (this.to.toLowerCase() === "new york") {
            this.price = 600;
        }else{
            this.price = 1000;
        }  

        // An extra fee is charged because of the mean of transportation selected
        switch(this.transportation){
            case "Plane":
                this.price += 300;
                break;
            case "Bus":
                this.price += 100;
                break;
            case "Train":
                this.price += 90;
                break;
            case "Taxi":
                this.price += 50;
                break;
            default:
                this.price += 10;
                break;
        }
        return this.price;
    }

};


const getTrips = ()=>{
    const data = JSON.parse(localStorage.getItem(`Trips`)) || [];
    return data.map(travel => Object.assign(new Travel() , travel));
}

const saveTripsToLocalStorage = ()=> localStorage.setItem(`Trips`, JSON.stringify(travels));

const saveTripToLocalStorage = travel => new Promise( resolve =>{
    setTimeout( () =>{
        travels.push(travel)
        saveTripsToLocalStorage();
        resolve();              //With this command we indicate that the promise finished
    },1000)
});

const travels = getTrips(); // We need to load the trips at the begining 
console.log(travels);

const clearInputs = () => {
    ['name', 'from', 'duration', 'country', `to`, `transportation`].forEach(id => {
        document.getElementById(id).value = "";
    });
};

const createTravel = async ()=>{
    const fields = [`name`, `from`, `to`, `duration`, `country`, `transportation`];
    const values = fields.map(id => document.getElementById(id).value.trim());

    if(values.some(value=> !value)){    //some in this case look for any value. It works with a callback function in this case evaluates that exists something in every element 
        showModal("Please fill all the fields");
        return;
    }

    const[name, from, to, duration, country, transportation] = values;
    const newTravel = new Travel(name, from, to, duration, country, transportation);

    await saveTripToLocalStorage(newTravel);

    setTimeout(()=>{
    
    }, 5000);
    renderTrips();
    clearInputs();
}

// Delete travel function
const deleteTravel = index => {
    const confirmation = confirm(`Do you want to delete this trip called: "${travels[index].name}"`)
    if (confirmation) {
        travels.splice(index, 1);
        saveTripsToLocalStorage();
        renderTrips();
        showModal("Travel deleted succsessfully ");
    }
}

// Add a task for an specific travel
const addTask = index => {
    showPrompt(index, (i, task) => {
        travels[i].addTask(task);
        saveTripsToLocalStorage();
        renderTrips();
    });
};

// Delete a task from a travel
const deleteTask = (index, taskIndex) => {
    const task = travels[index].tasks[taskIndex];
    travels[index].deleteTask(task);
    saveTripsToLocalStorage();
    renderTrips();
};


// Show all the trips on the UI
const renderTrips = () => {
    const container = document.getElementById('travels-list');
    container.innerHTML = ""; // Clean the previous container

    // Travels ordered (smallest to biggest)
    travels.sort((a, b) => a.duration - b.duration);

    // Create the visual structure for each travel
    travels.forEach((travel, index) => {
        const div = document.createElement('div');
        div.className = 'travel-card';

        // Generate the task list in HTML
        const tasksHTML = travel.tasks.map((task, taskIndex) =>
            `<li>${task} <button onclick="deleteTask(${index}, ${taskIndex})">Delete</button></li>`
        ).join('');



        // Insert the travel data in the card
        div.innerHTML = `
            <h3 id="test">${travel.name}</h3>
            <p>From: ${travel.from}</p>
            <p>By: ${travel.transportation}</p>
            <p>To: ${travel.to}, ${travel.country}</p>
            <p>Duration: ${travel.duration} días</p>
            <p>Total price calculated by this trip is: $${travel.priceCalculation()} dollars</p>
            <button class="danger-button" onclick="deleteTravel(${index})">Delete travel</button>
            <button onclick="addTask(${index})">Add task</button>
            <ul class="task">${tasksHTML}</ul>
        `;

        container.appendChild(div); // Added to DOM 
    });
};



// ---- Messages Modal ----

// Show a message in the modal window
const showModal = message => {
    document.getElementById("modal-text").textContent = message;
    document.getElementById("modal").style.display = "flex";
};

// Close modal
const closeModal = () => {
    document.getElementById("modal").style.display = "none";
};

// ---- Prompt personalizado para agregar task ----

let promptCallback = null;
let promptIndex = null;

// Open prompt to add a task
const showPrompt = (index, callback) => {
    promptIndex = index;
    promptCallback = callback;

    const input = document.getElementById("prompt-input");
    input.value = "";

    document.getElementById("prompt-modal").style.display = "flex";
    input.focus();
};

// Close prompt
const closePrompt = () => {
    document.getElementById("prompt-modal").style.display = "none";
    promptCallback = null;
    promptIndex = null;
};

// Prompt confirmation
const promptConfirmation = () => {
    const task = document.getElementById("prompt-input").value.trim();
    if (task && typeof promptCallback === 'function') {
        promptCallback(promptIndex, task);
    }
    closePrompt();
};


renderTrips();