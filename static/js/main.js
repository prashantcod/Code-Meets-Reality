document.addEventListener('DOMContentLoaded', () => {
    // Initialize Feather icons
    feather.replace();
    
    // DOM Elements
    const sidebar = document.getElementById('sidebar');
    const referenceBtn = document.getElementById('reference-btn');
    const closeSidebarBtn = document.getElementById('close-sidebar');
    const sidebarBtns = document.querySelectorAll('.sidebar-btn');
    const mainContent = document.querySelector('.main-content');
    const aiHelpBtn = document.getElementById('ai-help-btn');
    const aiAssistantModal = document.getElementById('ai-assistant-modal');
    const closeModalBtn = document.getElementById('close-modal');
    const runCodeBtn = document.getElementById('run-code-btn');
    const resetOutputBtn = document.getElementById('reset-output-btn');
    const executionStatus = document.getElementById('execution-status');
    const languageSelector = document.getElementById('language-selector');

    // Toggle sidebar visibility
    referenceBtn.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        mainContent.classList.toggle('sidebar-visible');
    });

    closeSidebarBtn.addEventListener('click', () => {
        sidebar.classList.remove('open');
        mainContent.classList.remove('sidebar-visible');
    });

    // Handle sidebar navigation
    sidebarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            sidebarBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            // Get selected concept
            const concept = btn.getAttribute('data-concept');
            
            // Update content based on selected concept
            updateContentByConcept(concept);
            
            // On mobile, close sidebar after selection
            if (window.innerWidth < 768) {
                sidebar.classList.remove('open');
                mainContent.classList.remove('sidebar-visible');
            }
        });
    });

    // Toggle AI assistant modal
    aiHelpBtn.addEventListener('click', () => {
        aiAssistantModal.classList.add('open');
    });

    closeModalBtn.addEventListener('click', () => {
        aiAssistantModal.classList.remove('open');
    });

    // Close modal when clicking outside
    aiAssistantModal.addEventListener('click', (e) => {
        if (e.target === aiAssistantModal) {
            aiAssistantModal.classList.remove('open');
        }
    });

    // Run code button functionality
    runCodeBtn.addEventListener('click', async () => {
        // Show execution status
        executionStatus.classList.add('visible');
        
        try {
            // Get code from editor
            const code = editor.getValue();
            const language = languageSelector.value;
            
            // Execute code
            const result = await executeCode(code, language);
            
            // Update visual output
            updateVisualOutput(result);
        } catch (error) {
            console.error('Code execution failed:', error);
            // Show error in visual output
            showExecutionError(error.message || 'Code execution failed');
        } finally {
            // Hide execution status after a delay
            setTimeout(() => {
                executionStatus.classList.remove('visible');
            }, 1000);
        }
    });

    // Reset output button functionality
    resetOutputBtn.addEventListener('click', () => {
        resetVisualOutput();
    });

    // Language selector change event
    languageSelector.addEventListener('change', () => {
        const language = languageSelector.value;
        updateEditorLanguage(language);
        
        // Also update examples based on current concept and language
        const activeConcept = document.querySelector('.sidebar-btn.active').getAttribute('data-concept');
        updateContentByConcept(activeConcept, language);
    });

    // Initialize with default concept (if-else)
    updateContentByConcept('if-else');

    // Helper function to execute code
    async function executeCode(code, language) {
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, language })
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to execute code');
        }
        
        return await response.json();
    }

    // Helper function to update content based on selected concept
    function updateContentByConcept(concept, language = languageSelector.value) {
        // Get example data for the selected concept
        const exampleData = getExampleData(concept, language);
        
        // Update real-world example
        updateRealWorldExample(exampleData.realWorld);
        
        // Update code editor
        updateCodeEditor(exampleData.code);
        
        // Reset visual output
        resetVisualOutput();
    }

    // Function to show execution error in visual output
    function showExecutionError(errorMessage) {
        const outputConsole = document.querySelector('.output-console');
        if (outputConsole) {
            outputConsole.innerHTML = `<span style="color: #e74c3c;">Error: ${errorMessage}</span>`;
        }
    }
});
