function checkFileType(fileInput) {
    var filePath = fileInput.value;
    var allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;
    if (!allowedExtensions.exec(filePath)) {
        alert('Invalid file type. Only JPEG, PNG, and GIF files are allowed.');
        fileInput.value = '';
        return false;
    } else {
        // Image preview
        if (fileInput.files && fileInput.files[0]) {
            var reader = new FileReader();
            reader.onload = function(e) {
                document.getElementById('imagePreview').innerHTML = '<img src="'+e.target.result+'" width="200" height="200"/>';
            };
            reader.readAsDataURL(fileInput.files[0]);
        }
    }
}

function copyRegistrationLink(url) {
    // Get the full URL by combining with window.location.origin
    const fullUrl = window.location.origin + url;
    
    // Create a temporary input element
    const tempInput = document.createElement('input');
    tempInput.value = fullUrl;
    document.body.appendChild(tempInput);
    
    // Select and copy the text
    tempInput.select();
    document.execCommand('copy');
    
    // Remove the temporary input
    document.body.removeChild(tempInput);
    
    // Provide feedback to user
    alert('Registration link copied to clipboard!');
}

document.getElementById('toggleView').addEventListener('click', function() {
    const grid = document.querySelector('.grid');
    grid.classList.toggle('grid-cols-1');
    grid.classList.toggle('grid-cols-2');
    grid.classList.toggle('grid-cols-3');
});

// Example function to show notification
function showNotification(message) {
    const notification = document.getElementById('notificationPanel');
    notification.classList.remove('hidden');
    notification.querySelector('p').textContent = message;
    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}
const ctx = document.getElementById('myChart').getContext('2d');
        const myChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
                datasets: [{
                    label: 'Event Registrations',
                    data: [12, 19, 3, 5, 2, 3, 7],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

// Add event listeners to all delete buttons
document.querySelectorAll('a[href*="delete_event"]').forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent the default link behavior
        
        // Show confirmation dialog
        if (confirm('Are you sure you want to delete this event?')) {
            // If user clicks OK, navigate to the delete URL
            window.location.href = this.href;
        }
        // If user clicks Cancel, nothing happens and event is not deleted
    });
});

document.querySelectorAll('.delete-link').forEach(link => {
    link.addEventListener('click', function (event) {
        // Show confirmation dialog
        const userConfirmed = confirm("Are you sure you want to delete this event?");
        
        // If user cancels, prevent the default action
        if (!userConfirmed) {
            event.preventDefault();
        }
    });
});