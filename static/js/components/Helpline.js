// AI Helpline component
export function Helpline(root) {
    root.innerHTML = `
        <div class="helpline">
            <div class="helpline-header">
                <h2>AI Assistant</h2>
                <button class="btn-close" id="helpline-close">
                    &times;
                </button>
            </div>
            <div class="helpline-content" id="helpline-messages">
                <div class="message message-ai">
                    <div class="message-bubble">
                        Hello! I'm your AI coding assistant. How can I help you today?
                    </div>
                    <div class="message-time">
                        Just now
                    </div>
                </div>
            </div>
            <div class="helpline-footer">
                <textarea class="helpline-input" id="helpline-input" placeholder="Ask me anything about your code..."></textarea>
                <button class="helpline-send" id="helpline-send">
                    <i data-feather="send"></i>
                </button>
            </div>
        </div>
    `;
    
    // Initialize Feather Icons
    if (window.feather) {
        feather.replace();
    }
    
    // Add event listeners
    const closeBtn = root.querySelector('#helpline-close');
    const sendBtn = root.querySelector('#helpline-send');
    const input = root.querySelector('#helpline-input');
    const messagesContainer = root.querySelector('#helpline-messages');
    
    // Close the helpline
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            const helplineRoot = document.getElementById('helpline-root');
            if (helplineRoot) {
                helplineRoot.classList.remove('active');
            }
        });
    }
    
    // Send message when clicking send button
    if (sendBtn) {
        sendBtn.addEventListener('click', () => {
            sendMessage();
        });
    }
    
    // Send message when pressing Enter (not Shift+Enter)
    if (input) {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
            }
        });
    }
    
    // Send a message to the AI assistant
    function sendMessage() {
        const question = input.value.trim();
        if (!question) return;
        
        // Clear the input
        input.value = '';
        
        // Add the user message to the UI
        addMessage('user', question);
        
        // Get the current code from the editor
        const code = window.editor ? window.editor.getValue() : '';
        const language = document.getElementById('language-selector').value;
        const concept = document.getElementById('concept-selector').value;
        
        // Add a thinking indicator
        addThinkingIndicator();
        
        // Send the question to the server
        fetch('/api/ask', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                code: code,
                language: language,
                concept: concept
            })
        })
        .then(response => response.json())
        .then(data => {
            // Remove the thinking indicator
            removeThinkingIndicator();
            
            // Add the AI response to the UI
            addMessage('ai', data.response);
            
            // Scroll to the bottom
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        })
        .catch(error => {
            console.error('Error asking AI:', error);
            removeThinkingIndicator();
            addMessage('ai', 'Sorry, there was an error processing your request. Please try again.');
        });
    }
    
    // Add a message to the UI
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${role}`;
        
        const messageBubble = document.createElement('div');
        messageBubble.className = 'message-bubble';
        messageBubble.textContent = content;
        
        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Just now';
        
        messageDiv.appendChild(messageBubble);
        messageDiv.appendChild(messageTime);
        
        messagesContainer.appendChild(messageDiv);
        
        // Scroll to the bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Add a thinking indicator
    function addThinkingIndicator() {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'message message-ai thinking';
        thinkingDiv.innerHTML = `
            <div class="message-bubble">
                <div class="thinking-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        messagesContainer.appendChild(thinkingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Remove the thinking indicator
    function removeThinkingIndicator() {
        const thinkingDiv = messagesContainer.querySelector('.thinking');
        if (thinkingDiv) {
            messagesContainer.removeChild(thinkingDiv);
        }
    }
}