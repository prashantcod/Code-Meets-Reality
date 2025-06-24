document.addEventListener('DOMContentLoaded', () => {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-question');
    const aiAssistantModal = document.getElementById('ai-assistant-modal');

    // Add event listener for send button
    sendButton.addEventListener('click', sendQuestion);

    // Add event listener for enter key
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendQuestion();
        }
    });

    // Function to send question to AI
    async function sendQuestion() {
        const question = userInput.value.trim();
        
        // Don't send empty questions
        if (!question) return;
        
        // Add user message to chat
        addMessage('user', question);
        
        // Clear input
        userInput.value = '';
        
        try {
            // Show thinking indicator
            addThinkingIndicator();
            
            // Get current code from editor
            let code = '';
            try {
                code = window.editor ? window.editor.getValue() : '';
            } catch (e) {
                console.warn("Could not get code from editor:", e);
            }
            
            // Get language and concept
            const language = document.getElementById('language-selector')?.value || 'python';
            
            // Try to get concept from selector or active sidebar item
            let concept = 'general';
            try {
                const conceptSelector = document.getElementById('concept-selector');
                if (conceptSelector) {
                    concept = conceptSelector.value;
                } else {
                    const activeBtn = document.querySelector('.sidebar-menu-item.active[data-concept]');
                    if (activeBtn) {
                        concept = activeBtn.getAttribute('data-concept');
                    }
                }
            } catch (e) {
                console.warn("Could not determine concept:", e);
            }
            
            console.log(`Sending AI question about ${concept} in ${language}`);
            
            // Send request to backend
            const response = await fetch('/api/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    question,
                    code,
                    language,
                    concept
                })
            });
            
            // Remove thinking indicator
            removeThinkingIndicator();
            
            const data = await response.json();
            
            if (!response.ok || data.status === 'error') {
                console.warn('AI assistant responded with error:', data.error || 'Unknown error');
                
                if (data.error && data.error.includes('quota')) {
                    // Special message for quota issues
                    addMessage('ai', 'The AI assistant is currently experiencing high demand. I\'m using my built-in knowledge to answer instead.\n\n' + (data.response || 'Please try a different question or check back later.'));
                } else {
                    // Generic error with the response fallback
                    addMessage('ai', data.response || 'Sorry, I encountered an error while processing your request. Please try again later.');
                }
                return;
            }
            
            // Add AI response to chat
            addMessage('ai', data.response);
            
        } catch (error) {
            console.error('AI assistant error:', error);
            
            // Remove thinking indicator
            removeThinkingIndicator();
            
            // More detailed error message
            addMessage('ai', 'Sorry, I encountered a technical issue while processing your request. Our system is still working, but with limited AI capabilities at the moment. Please try asking another question or try again later.');
        }
    }

    // Function to add message to chat
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = role === 'user' ? 'user-message' : 'ai-message';
        
        // Handle markdown formatting for AI responses
        if (role === 'ai') {
            // Simple markdown parsing for code blocks
            content = content.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
            // Bold text
            content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            // Italic text
            content = content.replace(/\*(.*?)\*/g, '<em>$1</em>');
            // Line breaks
            content = content.replace(/\n/g, '<br>');
        }
        
        messageDiv.innerHTML = `<p>${content}</p>`;
        chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to add thinking indicator
    function addThinkingIndicator() {
        const thinkingDiv = document.createElement('div');
        thinkingDiv.className = 'ai-message thinking';
        thinkingDiv.innerHTML = '<p>Thinking<span class="dot-1">.</span><span class="dot-2">.</span><span class="dot-3">.</span></p>';
        thinkingDiv.id = 'thinking-indicator';
        chatMessages.appendChild(thinkingDiv);
        
        // Add animation for dots
        const style = document.createElement('style');
        style.innerHTML = `
            @keyframes blink {
                0% { opacity: 0.2; }
                50% { opacity: 1; }
                100% { opacity: 0.2; }
            }
            .thinking .dot-1 { animation: blink 1s infinite 0.2s; }
            .thinking .dot-2 { animation: blink 1s infinite 0.4s; }
            .thinking .dot-3 { animation: blink 1s infinite 0.6s; }
        `;
        document.head.appendChild(style);
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Function to remove thinking indicator
    function removeThinkingIndicator() {
        const thinkingIndicator = document.getElementById('thinking-indicator');
        if (thinkingIndicator) {
            thinkingIndicator.remove();
        }
    }

    // Function to clear chat history
    window.clearChat = function() {
        chatMessages.innerHTML = `
            <div class="ai-message">
                <p>Hello! I'm your coding assistant. Ask me anything about the code you're learning!</p>
            </div>
        `;
    };
});
