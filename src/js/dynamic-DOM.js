// Show all the trips on the UI
const renderTrips = travels => {
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

export {renderTrips};