const notificationPopup = document.getElementById('notification-popup');
const notificationBell = document.getElementById('notification-bell');
const closeBtn = document.getElementById('close-btn');
const sound = document.getElementById('notification-sound');
const messageContainer = document.getElementById('notification-messages');
const notificationCount = document.getElementById('notification-count');
const addMessageBtn = document.getElementById('add-message');

let messages = JSON.parse(localStorage.getItem('notifications')) || [
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
  localStorage.setItem('notifications', JSON.stringify(messages));
}

// Show the notification popup with sound and auto-hide
notificationBell.addEventListener('click', function (event) {
  event.preventDefault();
  updateNotificationUI();
  notificationPopup.style.display = 'block';
  sound.play();

  // Auto-hide after 6 seconds
  setTimeout(() => {
    notificationPopup.style.display = 'none';
  }, 6000);
});

// Close the popup when clicking the close button
closeBtn.addEventListener('click', function () {
  notificationPopup.style.display = 'none';
});

// Close the popup when clicking outside
window.addEventListener('click', function (event) {
  if (event.target === notificationPopup) {
    notificationPopup.style.display = 'none';
  }
});

// Add a random new message dynamically
addMessageBtn.addEventListener('click', function () {
  const randomTexts = [
    'New event added: Hackathon 2025.',
    'Reminder: Project submission due tomorrow.',
    'Your team has a new message.',
    'Join the webinar at 4 PM today.',
    'Photography contest results are out.'
  ];
  const randomIndex = Math.floor(Math.random() * randomTexts.length);
  const now = new Date();
  const newMsg = {
    text: randomTexts[randomIndex],
    time: now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0')
  };
  messages.push(newMsg);
  updateNotificationUI();
});

// Initial UI setup on page load
updateNotificationUI();

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
            console.log('Switching to chat:', chatId); // Debug log
            switchChat(chatId);
        });
    });

    // Initialize with general chat
    switchChat('general');
});

document.querySelectorAll('.fa-video').forEach(btn => {
    btn.addEventListener('click', function() {
        // Here you can add video call functionality
        alert('Starting video call...');
        // Or create a more sophisticated video call interface
    });
});

// Update the startCall function to remove audio call functionality
function startCall(type) {
    if (type === 'video') {
        if (isAuthenticated()) {
            const meetingId = generateMeetingId();
            const meetUrl = `https://meet.google.com/${meetingId}`;
            
            const popup = document.createElement('div');
            popup.className = 'video-call-popup active';
            popup.innerHTML = `
                <div class="popup-content">
                    <h3 class="text-xl font-semibold mb-4">Start Video Call</h3>
                    <p class="mb-6">Join with Google Meet?</p>
                    <div class="popup-buttons">
                        <button onclick="window.open('${meetUrl}', '_blank')" class="accept-btn">
                            Join Meeting
                        </button>
                        <button onclick="closePopup(this)" class="cancel-btn">
                            Cancel
                        </button>
                    </div>
                </div>
            `;
            document.body.appendChild(popup);
        } else {
            showAuthPrompt();
        }
    }
}

// Helper functions
function isAuthenticated() {
    // Check if user is logged in (you can modify this based on your auth system)
    return localStorage.getItem('userAuthenticated') === 'true';
}

function generateMeetingId() {
    // Generate a random meeting ID
    return 'meet-' + Math.random().toString(36).substring(2, 15);
}

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

function authenticateWithGoogle() {
    // Implement Google OAuth here
    // For now, we'll simulate authentication
    localStorage.setItem('userAuthenticated', 'true');
    document.querySelector('.auth-popup').remove();
    startCall('video'); // Restart video call process
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
    
    // Add slight delay to prevent immediate closure
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 100);
}

// Add this new function to handle popup closing
function closePopup(button) {
    const popup = button.closest('.video-call-popup, .auth-popup');
    if (popup) {
        // Add fade-out animation
        popup.style.opacity = '0';
        setTimeout(() => {
            popup.remove();
        }, 300); // Match this with the CSS transition duration
    }
}

    function toggleChat() {
        var chatBox = document.getElementById("meditechChat");
        if (chatBox.style.display === "none" || chatBox.style.display === "") {
            chatBox.style.display = "block";
        } else {
            chatBox.style.display = "none";
        }
    }

