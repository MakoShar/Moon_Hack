// Navigation
function toggleMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu.classList.toggle('active');
}

// Check if user is logged in
function updateAuthButtons() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const authButtons = document.getElementById('auth-buttons');
    
    if (token && userRole) {
        // User is logged in
        authButtons.innerHTML = `
            <button onclick="logout()" class="profile-button">
                Logout
            </button>
        `;
    } else {
        // User is not logged in
        authButtons.innerHTML = `
            <a href="Login.html" class="profile-button">Login</a>
        `;
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    window.location.href = 'index.html';
}

// Initialize navigation
document.addEventListener('DOMContentLoaded', function() {
    updateAuthButtons();
    
    // Set active nav link
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
});

// Calendar functionality
function initializeCalendar() {
    const datePicker = document.getElementById('date-picker');
    const eventsContainer = document.getElementById('events-container');
    
    if (!datePicker || !eventsContainer) return;

    // Set today's date as default
    const today = new Date().toISOString().split('T')[0];
    datePicker.value = today;

    // Sample events data
    const events = {
        '2025-03-15': [
            { title: 'Chakravyuh', time: '10:00 AM', location: 'Main Hall' },
            { title: 'Tech Roadies', time: '2:00 PM', location: 'Auditorium' }
        ],
        '2025-03-20': [
            { title: 'AI Workshop', time: '11:00 AM', location: 'Lab 101' },
            { title: 'Tech Robotics', time: '3:00 PM', location: 'Workshop' }
        ],
        '2025-07-15': [
            { title: 'Annual Tech Fest', time: '9:00 AM', location: 'Campus Ground' }
        ]
    };

    // Function to display events for selected date
    function displayEvents(date) {
        const dateEvents = events[date] || [];
        eventsContainer.innerHTML = '';

        if (dateEvents.length === 0) {
            eventsContainer.innerHTML = '<p class="text-gray-500">No events scheduled for this date.</p>';
            return;
        }

        dateEvents.forEach(event => {
            const eventCard = document.createElement('div');
            eventCard.className = 'event-card';
            eventCard.innerHTML = `
                <h4>${event.title}</h4>
                <ul>
                    <li><i class="fas fa-clock"></i> ${event.time}</li>
                    <li><i class="fas fa-map-marker-alt"></i> ${event.location}</li>
                </ul>
            `;
            eventsContainer.appendChild(eventCard);
        });
    }

    // Event listener for date picker
    datePicker.addEventListener('change', (e) => {
        displayEvents(e.target.value);
    });

    // Display events for today initially
    displayEvents(today);
}

// Event registration
function registerForEvent(eventId) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to register for events.');
        window.location.href = '/login';
        return;
    }

    // Here you would typically make an API call to register the user
    alert('Registration successful!');
}

// Club joining
function joinClub(clubId) {
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (!isLoggedIn) {
        alert('Please log in to join clubs.');
        window.location.href = '/login';
        return;
    }

    // Here you would typically make an API call to join the club
    alert('Successfully joined the club!');
}

// Chat functionality
function initializeChat() {
    const chatContainer = document.getElementById('chat-container');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    if (!chatContainer || !messageInput || !sendButton) return;

    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        const userMessage = document.createElement('div');
        userMessage.className = 'chat-message user-message';
        userMessage.innerHTML = `
            <div class="message-content">
                <p>${message}</p>
            </div>
        `;
        chatContainer.appendChild(userMessage);

        // Clear input
        messageInput.value = '';

        // Scroll to bottom
        chatContainer.scrollTop = chatContainer.scrollHeight;

        // Here you would typically send the message to your backend
        // and handle the response
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
}

// Initialize all functionality when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeCalendar();
    initializeChat();
}); 