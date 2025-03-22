document.addEventListener('DOMContentLoaded', function() {
    // ... existing code ...

    // Add click handler for GDG section
    const gdgLinks = document.querySelectorAll('a[href="gdg.html"]');
    gdgLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Optional: Add transition effect before navigation
            const section = this.closest('.rounded-3xl');
            if (section) {
                section.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    section.style.transform = 'scale(1)';
                }, 200);
            }
        });
    });
}); 