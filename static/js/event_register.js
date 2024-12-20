document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('eventRegistrationForm');
    const attendanceSelect = document.getElementById('attendanceSelect');
    const additionalAttendees = document.getElementById('additionalAttendees');
    const transportDetails = document.getElementById('transportDetails');
    const numberOfPeople = document.getElementById('numberOfPeople');
    const attendeeDetails = document.getElementById('attendeeDetails');
    const progressBar = document.getElementById('progressBar');

    // Handle attendance selection
    attendanceSelect.addEventListener('change', function() {
        if (this.value === 'yes') {
            additionalAttendees.classList.remove('hidden');
            transportDetails.classList.remove('hidden');
            updateProgress();
        } else {
            additionalAttendees.classList.add('hidden');
            transportDetails.classList.add('hidden');
        }
    });

    // Handle number of people change
    numberOfPeople.addEventListener('change', function() {
        attendeeDetails.innerHTML = '';
        for (let i = 0; i < this.value; i++) {
            const attendeeHtml = `
                <div class="space-y-4 p-4 border rounded-md">
                    <h4 class="font-medium">Person ${i + 1}</h4>
                    <input type="text" name="person_${i+1}_name" placeholder="Name" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <input type="text" name="person_${i+1}_mobile" placeholder="Mobile Number" pattern="\\d{9}" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    <select name="person_${i+1}_id" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        <option value="">Select ID Proof</option>
                        <option value="aadhar">Aadhar Card</option>
                        <option value="passport">Passport</option>
                        <option value="license">Driving License</option>
                    </select>
                </div>
            `;
            attendeeDetails.insertAdjacentHTML('beforeend', attendeeHtml);
        }
        updateProgress();
    });

    // Handle transport mode selection
    ['arrival', 'departure'].forEach(type => {
        const select = document.getElementById(`${type}Transport`);
        const details = document.getElementById(`${type}Details`);

        select.addEventListener('change', function() {
            details.innerHTML = '';
            if (this.value) {
                let fieldsHtml = '';
                switch(this.value) {
                    case 'flight':
                        fieldsHtml = `
                            <input type="text" name="${type}FlightNumber" placeholder="Flight Number" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <input type="text" name="${type}Terminal" placeholder="Terminal Name" required class="block w-full mt-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        `;
                        break;
                    case 'train':
                        fieldsHtml = `
                            <input type="text" name="${type}TrainNumber" placeholder="Train Number" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <input type="text" name="${type}Station" placeholder="Station Name" required class="block w-full mt-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        `;
                        break;
                    case 'bus':
                        fieldsHtml = `
                            <input type="text" name="${type}BusStop" placeholder="Bus Stop" required class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                            <input type="text" name="${type}BusNumber" placeholder="Bus Number (Optional)" class="block w-full mt-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                        `;
                        break;
                }
                if (fieldsHtml) {
                    fieldsHtml += `
                        <input type="datetime-local" name="${type}DateTime" required class="block w-full mt-4 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                    `;
                }
                details.innerHTML = fieldsHtml;
            }
            updateProgress();
        });
    });

    // Update progress bar
    function updateProgress() {
        const totalFields = form.querySelectorAll('input:not([type="hidden"]), select, textarea').length;
        const filledFields = form.querySelectorAll('input:not([type="hidden"]):valid, select:valid, textarea:valid').length;
        const progress = (filledFields / totalFields) * 100;
        progressBar.style.width = `${progress}%`;
    }

    // Add input event listeners for real-time validation
    form.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('input', updateProgress);
    });

    // Form validation and submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (form.checkValidity()) {
            try {
                // Get form data
                const formData = new FormData(form);
                
                // Send POST request to server
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                    }
                });

                if (response.ok) {
                    // Successful submission - redirect to home
                    window.location.href = '/';
                } else {
                    // Handle error response
                    const data = await response.json();
                    window.location.href = '/'; // Redirect to home on error as well
                }

            } catch (error) {
                console.error('Error:', error);
                window.location.href = '/'; // Redirect to home on error
            }
        } else {
            window.location.href = '/'; // Redirect to home if form is invalid
        }
    });
});
