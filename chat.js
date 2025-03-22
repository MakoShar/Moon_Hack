const notificationPopup = document.getElementById('notification-popup');
const notificationBell = document.getElementById('notification-bell');
const closeBtn = document.getElementById('close-btn');
const sound = document.getElementById('notification-sound');
const messageContainer = document.getElementById('notification-messages');
const notificationCount = document.getElementById('notification-count');

let messages = [
    { text: 'You have a new message from John.', time: '10:00 AM' },
    { text: 'Your registration for Chakravyuh is confirmed.', time: '10:05 AM' },
    { text: "Don't forget to check the event schedule!", time: '10:10 AM' }
];

// Update the notification popup and count
function updateNotificationUI() {
    messageContainer.innerHTML = '';
    messages.forEach(msg => {
        const p = document.createElement('p');
        p.innerHTML = `${msg.text} <span class="message-time">${msg.time}</span>`;
        messageContainer.appendChild(p);
    });
    notificationCount.textContent = messages.length;
}

// Toggle notification popup
notificationBell.addEventListener('click', function() {
    if (notificationPopup.style.display === 'none' || !notificationPopup.style.display) {
        notificationPopup.style.display = 'block';
        sound.play();
    } else {
        notificationPopup.style.display = 'none';
    }
});

// Close popup when clicking the close button
closeBtn.addEventListener('click', function() {
    notificationPopup.style.display = 'none';
});

// Close popup when clicking outside
window.addEventListener('click', function(event) {
    if (event.target === notificationPopup) {
        notificationPopup.style.display = 'none';
    }
});

document.addEventListener('DOMContentLoaded', function() {
    const chatGroups = document.querySelectorAll('.group');
    const chatContents = document.querySelectorAll('.chat-content');

    function switchChat(chatId) {
        // Remove active class from all groups and contents
        chatGroups.forEach(group => group.classList.remove('active'));
        chatContents.forEach(content => {
            content.classList.remove('active');
            content.classList.add('hidden');
        });

        // Add active class to selected group and content
        const selectedGroup = document.querySelector(`[data-chat="${chatId}"]`);
        const selectedContent = document.getElementById(`${chatId}-chat`);
        
        if (selectedGroup && selectedContent) {
            selectedGroup.classList.add('active');
            selectedContent.classList.add('active');
            selectedContent.classList.remove('hidden');
        }
    }

    // Add click event listeners to chat groups
    chatGroups.forEach(group => {
        group.addEventListener('click', () => {
            const chatId = group.dataset.chat;
            switchChat(chatId);
        });
    });

    // Initialize with general chat
    switchChat('general');
});

// Video call functionality
document.querySelectorAll('.fa-video').forEach(btn => {
    btn.addEventListener('click', function() {
        showAuthPrompt();
    });
});

function showAuthPrompt() {
    const authPopup = document.createElement('div');
    authPopup.className = 'auth-popup active';
    authPopup.innerHTML = `
        <div class="popup-content">
            <h3 class="text-xl font-semibold mb-4">Authentication Required</h3>
            <p class="mb-6">Please sign in with your Google account to start a video call.</p>
            <div class="popup-buttons">
                <button onclick="authenticateWithGoogle()" class="accept-btn">
                    Sign in with Google
                </button>
                <button onclick="closePopup(this)" class="cancel-btn">
                    Cancel
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(authPopup);
}

function showOptions() {
    // Create and show options menu
    const optionsMenu = document.createElement('div');
    optionsMenu.className = 'options-menu';
    optionsMenu.innerHTML = `
        <div class="option-item">View Profile</div>
        <div class="option-item">Mute Chat</div>
        <div class="option-item">Block User</div>
        <div class="option-item">Clear Chat</div>
    `;
    
    // Position the menu near the ellipsis button
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    optionsMenu.style.position = 'absolute';
    optionsMenu.style.top = `${rect.bottom + 5}px`;
    optionsMenu.style.right = `${window.innerWidth - rect.right}px`;
    
    // Add to document and handle clicks
    document.body.appendChild(optionsMenu);
    
    // Close menu when clicking outside
    function closeMenu(e) {
        if (!optionsMenu.contains(e.target) && e.target !== button) {
            optionsMenu.remove();
            document.removeEventListener('click', closeMenu);
        }
    }
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
}

// Initialize UI
updateNotificationUI(); 