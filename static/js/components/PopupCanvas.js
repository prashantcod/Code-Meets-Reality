// Popup Canvas component
export function PopupCanvas(root) {
    root.innerHTML = `
        <div class="popup-canvas">
            <div class="popup-content">
                <!-- Popup content will be dynamically inserted here -->
            </div>
        </div>
    `;
    
    // Close popup when clicking outside the content
    root.addEventListener('click', (event) => {
        if (event.target === root.querySelector('.popup-canvas')) {
            root.querySelector('.popup-canvas').classList.remove('active');
        }
    });
}