// Toggle mobile menu
function toggleMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Calendar and Event Card Functionality
const dateInput = document.getElementById('event-date');
const resetBtn = document.getElementById('reset-btn');
const eventCards = document.querySelectorAll('.event-card');
const calendar = document.getElementById('calendar');

// Set minimum date to today
if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
}

// Scroll functionality
document.getElementById('scroll-left').addEventListener('click', () => {
  document.getElementById('events-container').scrollBy({ left: -300, behavior: 'smooth' });
});
document.getElementById('scroll-right').addEventListener('click', () => {
  document.getElementById('events-container').scrollBy({ left: 300, behavior: 'smooth' });
});

// Filter Events by selected date
function filterEventsByDate(selectedDate) {
    if (!selectedDate) {
        // If no date selected, show all cards but remove highlight
        eventCards.forEach(card => {
            card.classList.remove('highlight');
            card.style.display = 'block';
        });
        return;
    }

    eventCards.forEach(card => {
        const cardDate = card.getAttribute('data-date');
        if (cardDate === selectedDate) {
            card.classList.add('highlight');
            card.style.display = 'block';
            card.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            card.classList.remove('highlight');
            card.style.display = 'block';
        }
    });
}

// Event listener for date input changes
if (dateInput) {
    dateInput.addEventListener('change', function() {
        filterEventsByDate(this.value);
    });
}

// Reset button clears filter and re-highlights today if valid
if (resetBtn) {
    resetBtn.addEventListener('click', function() {
        dateInput.value = '';
        eventCards.forEach(card => {
            card.classList.remove('highlight');
            card.style.display = 'block';
        });
    });
}

// Function to get all event dates from cards
function getEventDates() {
    const dates = new Set();
    eventCards.forEach(card => {
        dates.add(card.getAttribute('data-date'));
    });
    return Array.from(dates);
}

// Function to highlight dates with events in the calendar
function highlightEventDates() {
    const eventDates = getEventDates();
    
    // Create a style element for our custom calendar styling
    let style = document.createElement('style');
    
    // Generate CSS rules for each event date
    const cssRules = eventDates.map(date => {
        const eventDate = new Date(date);
        return `
            input[type="date"]::-webkit-calendar-picker-indicator[data-date="${date}"] {
                background-color: #66d9ef;
                border-radius: 50%;
            }
            .calendar-popup .day[data-date="${date}"] {
                background-color: #eaf6fd;
                color: #2196F3;
                font-weight: bold;
            }
            .calendar-popup .day[data-date="${date}"]:hover {
                background-color: #66d9ef;
                color: white;
            }
        `;
    }).join('');

    style.textContent = cssRules;
    document.head.appendChild(style);
}

// Function to create a custom calendar overlay
function createCustomCalendar() {
    const eventDates = getEventDates();
    
    // Add event listener to the date input to modify the calendar when it opens
    dateInput.addEventListener('click', () => {
        // Small delay to ensure calendar is rendered
        setTimeout(() => {
            const calendar = document.querySelector('.calendar-popup');
            if (calendar) {
                const days = calendar.querySelectorAll('.day');
                days.forEach(day => {
                    const dateStr = day.getAttribute('data-date');
                    if (eventDates.includes(dateStr)) {
                        day.classList.add('has-event');
                        day.setAttribute('data-has-events', 'true');
                    }
                });
            }
        }, 100);
    });
}

// Update the initializeCalendar function
function initializeCalendar() {
    // Show all cards initially
    eventCards.forEach(card => {
        card.style.display = 'block';
        card.classList.remove('highlight');
    });

    // Add click event listeners to cards
    document.querySelectorAll('.event-card').forEach(card => {
        card.addEventListener('click', function() {
            const date = this.getAttribute('data-date');
            if (dateInput) {
                dateInput.value = date;
                filterEventsByDate(date);
            }
        });
    });

    // Highlight dates with events
    highlightEventDates();
    createCustomCalendar();

    // Set min and max dates based on event dates
    const eventDates = getEventDates();
    if (eventDates.length > 0) {
        dateInput.min = eventDates[0];
        dateInput.max = eventDates[eventDates.length - 1];
    }
}

// Initialize the calendar when the page loads
document.addEventListener('DOMContentLoaded', initializeCalendar);
