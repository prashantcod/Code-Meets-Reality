// Main app initialization script

import { Sidebar } from './components/Sidebar.js';
import { CodeEditor } from './components/CodeEditor.js';
import { RealWorldCode } from './components/RealWorldCode.js';
import { ConsoleOutput } from './components/ConsoleOutput.js';
import { InteractiveDemo } from './components/InteractiveDemo.js';
import { PopupCanvas } from './components/PopupCanvas.js';
import { Helpline } from './components/Helpline.js';
import { PracticeArea } from './components/PracticeArea.js';

/**
 * Global function to check OpenAI API status
 * This is used by the settings panel and other components
 * @returns {Promise<Object>} Object with available flag and error if applicable
 */
window.checkOpenAiApiStatus = async function() {
    const statusIndicator = document.getElementById('openai-status-indicator');
    const statusText = document.getElementById('openai-status-text');
    
    try {
        // Update UI to loading state if the elements exist
        if (statusIndicator && statusText) {
            statusIndicator.className = 'status-indicator status-loading';
            statusText.textContent = 'Checking API status...';
        }
        
        console.log("Checking OpenAI API status...");
        
        // Check server-side API key
        const response = await fetch('/api/check-openai-status', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ api_key: null }) // null means use server-side key
        });
        
        const data = await response.json();
        console.log("Server API key status:", data);
        
        if (data.status === 'ok') {
            if (statusIndicator && statusText) {
                statusIndicator.className = 'status-indicator status-success';
                statusText.textContent = 'Server API key connected';
            }
            return { available: true, source: 'server' };
        } else {
            // If server key didn't work, try client-side key
            const clientKey = localStorage.getItem('openai-api-key');
            
            if (clientKey) {
                const clientResponse = await fetch('/api/check-openai-status', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ api_key: clientKey })
                });
                
                const clientData = await clientResponse.json();
                console.log("Client API key status:", clientData);
                
                if (clientData.status === 'ok') {
                    if (statusIndicator && statusText) {
                        statusIndicator.className = 'status-indicator status-success';
                        statusText.textContent = 'Client API key connected';
                    }
                    return { available: true, source: 'client' };
                }
            }
            
            // If we got here, API is not active
            if (statusIndicator && statusText) {
                statusIndicator.className = 'status-indicator status-error';
                statusText.textContent = 'API key not configured';
            }
            return { 
                available: false, 
                error: 'No valid API key found',
                details: data.error || 'Unknown error' 
            };
        }
    } catch (error) {
        console.error('Error checking OpenAI API status:', error);
        if (statusIndicator && statusText) {
            statusIndicator.className = 'status-indicator status-error';
            statusText.textContent = 'Error checking API status';
        }
        return { 
            available: false, 
            error: 'API connection error',
            details: error.message
        };
    }
};

// Initialize the app when the DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    if (window.feather) {
        feather.replace();
    }
    
    // Initialize all components
    initializeComponents();
    
    // Set up event listeners
    setupEventListeners();
    
    // Load initial content
    loadInitialContent();
    
    // Check authentication status
    checkAuthStatus();
    
    // Make sure the beginner code tab is active on page load
    activateBeginnerCodeTab();
    
    // Debug: Log sidebar structure
    setTimeout(() => {
        console.log('SIDEBAR DEBUG - Tools section:');
        const toolsSection = document.querySelector('.sidebar-section:nth-child(2) .sidebar-menu');
        if (toolsSection) {
            console.log(toolsSection.innerHTML);
        } else {
            console.log('Tools section not found');
        }
    }, 1000);
});

// Function to check if user is logged in
async function checkAuthStatus() {
    try {
        const response = await fetch('/auth/me', {
            method: 'GET',
            credentials: 'include'
        });
        
        if (response.ok) {
            // User is logged in
            const userData = await response.json();
            updateUIForLoggedInUser(userData);
        } else {
            // User is not logged in
            updateUIForLoggedOutUser();
        }
    } catch (error) {
        console.error('Error checking auth status:', error);
        // Assume user is not logged in in case of error
        updateUIForLoggedOutUser();
    }
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
    const authButtons = document.querySelector('.auth-buttons');
    if (authButtons) {
        authButtons.innerHTML = `
            <div class="user-info">
                <span class="username">${user.username}</span>
                <button class="btn-auth btn-logout" id="logout-btn">
                    <i data-feather="log-out"></i> Log Out
                </button>
            </div>
        `;
        
        // Re-initialize Feather icons
        if (window.feather) {
            feather.replace();
        }
        
        // Add event listener for logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.location.href = '/auth/logout';
            });
        }
    }
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
    // Default state is logged out, so we don't need to do anything
    // The sign-in and sign-up buttons are already in the HTML
}

// Function to make sure beginner code tab is active
function activateBeginnerCodeTab() {
    // Activate the beginner code tab
    document.querySelectorAll('.panel-tab').forEach(tab => {
        if (tab.getAttribute('data-tab') === 'beginner-code') {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Activate the beginner code content
    document.querySelectorAll('.tab-content').forEach(content => {
        if (content.id === 'beginner-code-content') {
            content.classList.add('active');
            console.log('Activated beginner code content');
        } else {
            content.classList.remove('active');
        }
    });
    
    // Focus the editor
    if (window.editor && typeof window.editor.focus === 'function') {
        setTimeout(() => {
            window.editor.focus();
            console.log('Editor focused by activateBeginnerCodeTab');
        }, 100);
    }
}

function initializeComponents() {
    // Initialize sidebar
    const sidebarRoot = document.getElementById('sidebar-root');
    if (sidebarRoot) {
        Sidebar(sidebarRoot);
    }
    
    // Initialize a direct, simple code editor
    const codeEditorContent = document.querySelector('#beginner-code-content');
    if (codeEditorContent) {
        // Create a simple textarea editor directly in the DOM
        codeEditorContent.innerHTML = `
            <textarea id="simple-code-editor">#Write your Python code here

def greeting(name):
    """Returns a greeting message"""
    return f"Hello, {name}!"

# Test the function
result = greeting("World")
print(result)</textarea>
        `;
        
        const editor = document.getElementById('simple-code-editor');
        
        // Create a global editor object that our other functions can use
        window.editor = {
            getValue: function() {
                return editor.value;
            },
            setValue: function(value) {
                editor.value = value;
            },
            focus: function() {
                editor.focus();
            },
            lineCount: function() {
                return editor.value.split('\n').length;
            },
            getLine: function(line) {
                return editor.value.split('\n')[line] || '';
            },
            setCursor: function() {
                // Position cursor at the end
                editor.selectionStart = editor.value.length;
                editor.selectionEnd = editor.value.length;
            }
        };

        // Handle tab key for indentation
        editor.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.selectionStart;
                const end = this.selectionEnd;
                
                // Insert 4 spaces at cursor position
                this.value = this.value.substring(0, start) + '    ' + this.value.substring(end);
                
                // Move cursor after the inserted spaces
                this.selectionStart = this.selectionEnd = start + 4;
            }
        });
        
        // Auto-indentation for Enter key
        editor.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                const start = this.selectionStart;
                const lineStart = this.value.lastIndexOf('\n', start - 1) + 1;
                const currentLine = this.value.substring(lineStart, start);
                const indent = currentLine.match(/^\s*/)[0]; // Get leading whitespace
                
                // Handle auto-indentation for blocks (lines ending with colon)
                if (currentLine.trim().endsWith(':')) {
                    const insertion = '\n' + indent + '    '; // Add 4 more spaces for new block
                    this.value = this.value.substring(0, start) + insertion + this.value.substring(start);
                    this.selectionStart = this.selectionEnd = start + insertion.length;
                } else if (indent.length > 0) {
                    // Just maintain the current indentation level
                    const insertion = '\n' + indent;
                    this.value = this.value.substring(0, start) + insertion + this.value.substring(start);
                    this.selectionStart = this.selectionEnd = start + insertion.length;
                } else {
                    // No indentation
                    const insertion = '\n';
                    this.value = this.value.substring(0, start) + insertion + this.value.substring(start);
                    this.selectionStart = this.selectionEnd = start + insertion.length;
                }
            }
        });
        
        // Auto-update real-world examples when typing
        editor.addEventListener('input', function() {
            // Use debounce to avoid too many requests
            if (window.debounceTimer) {
                clearTimeout(window.debounceTimer);
            }
            window.debounceTimer = setTimeout(function() {
                const code = editor.value;
                console.log("Input detected, code length:", code.length);
                if (code && code.length > 30) { // Lowered the threshold to 30 characters
                    console.log("Updating real-world code from input event");
                    updateRealWorldCode(code);
                    // Temporarily disable demo updates as they're less important
                    // updateInteractiveDemo(code);
                }
            }, 1000); // Reduced to 1 second delay
        });

        // Focus the editor immediately
        setTimeout(function() {
            editor.focus();
            console.log('Editor focused');
        }, 100);
    }
    
    // Initialize real-world code panel
    const realWorldCodeRoot = document.getElementById('realworld-code-root');
    if (realWorldCodeRoot) {
        RealWorldCode(realWorldCodeRoot);
    }
    
    // Initialize console output
    const consoleOutputRoot = document.getElementById('console-output-root');
    if (consoleOutputRoot) {
        ConsoleOutput(consoleOutputRoot);
    }
    
    // Initialize interactive demo
    const interactiveDemoRoot = document.getElementById('interactive-demo-root');
    if (interactiveDemoRoot) {
        InteractiveDemo(interactiveDemoRoot);
    }
    
    // Initialize popup canvas
    const popupCanvasRoot = document.getElementById('popup-canvas-root');
    if (popupCanvasRoot) {
        PopupCanvas(popupCanvasRoot);
    }
    
    // Initialize AI helpline
    const helplineRoot = document.getElementById('helpline-root');
    if (helplineRoot) {
        Helpline(helplineRoot);
    }
    
    // Initialize practice area
    const practiceAreaRoot = document.getElementById('practice-area-root');
    if (practiceAreaRoot) {
        PracticeArea(practiceAreaRoot);
    }
    
    // Load auth examples if available
    try {
        // Dynamically import the authentication examples
        import('./components/AuthenticationExample.js')
            .then(module => {
                window.authExamples = module;
                console.log("Authentication examples loaded successfully");
                
                // Add authentication example button to sidebar if it exists
                const sidebarTools = document.querySelector('.sidebar-tools');
                if (sidebarTools) {
                    const authButton = document.createElement('button');
                    authButton.className = 'sidebar-button';
                    authButton.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-lock">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                        </svg>
                        <span>Auth Example</span>
                    `;
                    authButton.onclick = () => {
                        if (window.editor && window.authExamples) {
                            const language = document.getElementById('language-selector').value || 'python';
                            window.authExamples.insertAuthenticationExample(window.editor, language);
                        }
                    };
                    sidebarTools.appendChild(authButton);
                }
            })
            .catch(err => console.warn("Could not load authentication examples:", err));
    } catch (e) {
        console.warn("Authentication examples module could not be loaded:", e);
    }
}

function setupEventListeners() {
    // Run code button
    const runCodeButton = document.getElementById('run-code');
    if (runCodeButton) {
        runCodeButton.addEventListener('click', executeCode);
    }
    
    // Toggle help button
    const toggleHelpButton = document.getElementById('toggle-help');
    if (toggleHelpButton) {
        toggleHelpButton.addEventListener('click', toggleHelpline);
    }
    
    // Clear console button
    const clearConsoleButton = document.getElementById('clear-console');
    if (clearConsoleButton) {
        clearConsoleButton.addEventListener('click', clearConsole);
    }
    
    // Sign-in button
    const signInButton = document.getElementById('sign-in-btn');
    if (signInButton) {
        signInButton.addEventListener('click', () => {
            window.location.href = '/auth/login';
        });
    }
    
    // Sign-up button
    const signUpButton = document.getElementById('sign-up-btn');
    if (signUpButton) {
        signUpButton.addEventListener('click', () => {
            window.location.href = '/auth/login';
        });
    }
    
    // Console handle for slide up/down
    const consoleHandle = document.querySelector('.console-handle');
    if (consoleHandle) {
        consoleHandle.addEventListener('click', toggleConsole);
    }
    
    // Minimize console button
    const minimizeConsoleButton = document.getElementById('minimize-console');
    if (minimizeConsoleButton) {
        minimizeConsoleButton.addEventListener('click', minimizeConsole);
    }
    
    // Open GUI Demo button (new button in the real-world code panel)
    const openGuiDemoButton = document.getElementById('open-gui-demo');
    if (openGuiDemoButton) {
        openGuiDemoButton.addEventListener('click', openGuiDemo);
    }
    
    // Close interactive demo button
    const closeDemoButton = document.getElementById('close-demo');
    if (closeDemoButton) {
        closeDemoButton.addEventListener('click', closeInteractiveDemo);
    }
    
    // Language selector
    const languageSelector = document.getElementById('language-selector');
    if (languageSelector) {
        languageSelector.addEventListener('change', onLanguageChange);
    }
    
    // Concept selector
    const conceptSelector = document.getElementById('concept-selector');
    if (conceptSelector) {
        conceptSelector.addEventListener('change', onConceptChange);
    }
    
    // Panel tabs
    const panelTabs = document.querySelectorAll('.panel-tab');
    if (panelTabs.length > 0) {
        panelTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                // Get the tab id
                const tabId = tab.getAttribute('data-tab');
                
                // Remove active class from all tabs
                panelTabs.forEach(t => t.classList.remove('active'));
                
                // Add active class to the clicked tab
                tab.classList.add('active');
                
                // Hide all tab contents
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                // Show the selected tab content
                const tabContent = document.getElementById(`${tabId}-content`);
                if (tabContent) {
                    tabContent.classList.add('active');
                    
                    // If switching to beginner code tab, focus the editor
                    if (tabId === 'beginner-code' && window.editor) {
                        // Small delay to ensure the editor is visible
                        setTimeout(() => {
                            if (typeof window.editor.focus === 'function') {
                                window.editor.focus();
                                // Position cursor at the end
                                const lastLine = window.editor.lineCount() - 1;
                                const lastChar = window.editor.getLine(lastLine).length;
                                window.editor.setCursor({line: lastLine, ch: lastChar});
                            }
                        }, 50);
                    }
                }
                
                // If practice problems tab is clicked
                if (tabId === 'practice-problems') {
                    loadPracticeProblems();
                }
            });
        });
    }
}

// Console toggle function
function toggleConsole() {
    const consoleContainer = document.getElementById('console-container');
    if (consoleContainer) {
        consoleContainer.classList.toggle('expanded');
        
        // Focus on console output for better readability
        if (consoleContainer.classList.contains('expanded')) {
            const consoleOutput = document.querySelector('.console-output');
            if (consoleOutput) {
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
            }
        }
    }
}

// Function to show console (make it globally available)
window.showConsole = function() {
    console.log('Showing console globally');
    const consoleContainer = document.getElementById('console-container');
    console.log('Console container found:', consoleContainer);
    if (consoleContainer) {
        if (!consoleContainer.classList.contains('expanded')) {
            console.log('Console container classes before:', consoleContainer.className);
            consoleContainer.classList.remove('minimized');
            console.log('Console container classes after remove:', consoleContainer.className);
            consoleContainer.classList.add('expanded');
            console.log('Console container classes after add:', consoleContainer.className);
            
            // Focus on console output for better readability
            const consoleOutput = document.querySelector('.console-output');
            if (consoleOutput) {
                consoleOutput.scrollTop = consoleOutput.scrollHeight;
            }
        }
    }
}

// Minimize console function
function minimizeConsole() {
    const consoleContainer = document.getElementById('console-container');
    if (consoleContainer) {
        consoleContainer.classList.remove('expanded');
    }
}

// Open GUI Demo as a modal overlay
function openGuiDemo() {
    const demoContainer = document.getElementById('interactive-demo-container');
    
    if (demoContainer) {
        demoContainer.classList.remove('hidden');
        
        // Get the interactive demo content element
        const interactiveDemoContent = demoContainer.querySelector('.panel-content');
        const guiDemoContent = document.querySelector('#gui-demo-root .panel-content');
        const editor = document.getElementById('simple-code-editor');
        
        if (interactiveDemoContent) {
            // First try to get content from the hidden GUI demo section
            let content = '';
            
            if (guiDemoContent && guiDemoContent.innerHTML.trim()) {
                content = guiDemoContent.innerHTML;
            } else {
                // If no content is available yet, trigger a request to get it
                if (editor && editor.value && editor.value.length > 20) {
                    // Show loading state
                    interactiveDemoContent.innerHTML = `
                        <div class="interactive-demo-loading">
                            <div class="loading-spinner"></div>
                            <p>Generating interactive demonstration...</p>
                        </div>
                    `;
                    
                    // Generate interactive demo from the current code
                    updateInteractiveDemo(editor.value).then(() => {
                        // After update, copy the content from the hidden section
                        if (guiDemoContent && guiDemoContent.innerHTML.trim()) {
                            interactiveDemoContent.innerHTML = guiDemoContent.innerHTML;
                            
                            // Re-execute any scripts in the demo
                            executeScripts(interactiveDemoContent);
                        }
                    });
                } else {
                    // Not enough code to process
                    content = '<div class="empty-state">Write or run code first to see an interactive GUI demonstration.</div>';
                    interactiveDemoContent.innerHTML = content;
                }
            }
            
            // If we already have content, update immediately
            if (content) {
                interactiveDemoContent.innerHTML = content;
                
                // Execute any scripts in the demo
                executeScripts(interactiveDemoContent);
            }
        }
        
        // Show the demo container by removing the hidden class
        demoContainer.classList.remove('hidden');
        
        // Re-initialize any Feather icons if needed
        if (window.feather) {
            feather.replace();
        }
    }
}

// Helper function to execute scripts in demo content
function executeScripts(container) {
    // Find and execute any scripts in the demo HTML
    const scripts = container.querySelectorAll('script');
    scripts.forEach(script => {
        if (script.textContent) {
            try {
                eval(script.textContent);
            } catch (e) {
                console.error('Error executing demo script:', e);
            }
        }
    });
}

// Close interactive demo function
function closeInteractiveDemo() {
    const demoContainer = document.getElementById('interactive-demo-container');
    if (demoContainer) {
        demoContainer.classList.add('hidden');
    }
}

function loadInitialContent() {
    // Set default code examples based on selected language and concept
    const languageSelector = document.getElementById('language-selector');
    const conceptSelector = document.getElementById('concept-selector');
    
    if (languageSelector && conceptSelector) {
        const language = languageSelector.value;
        const concept = conceptSelector.value;
        
        updateContentByConcept(concept, language);
    }
    
    // Initialize the GUI Demo section with placeholder content
    const guiDemoRoot = document.getElementById('gui-demo-root');
    if (guiDemoRoot) {
        const guiDemoContent = guiDemoRoot.querySelector('.panel-content');
        if (guiDemoContent) {
            guiDemoContent.innerHTML = '<div class="empty-state">Run your code to see a GUI demonstration.</div>';
        }
    }
    
    // Make sure the beginner code tab is active by default
    const beginnerCodeTab = document.querySelector('[data-tab="beginner-code"]');
    if (beginnerCodeTab && !beginnerCodeTab.classList.contains('active')) {
        beginnerCodeTab.click(); // Trigger the tab click to make it active
    }
    
    // Focus the editor after a small delay to ensure it's fully loaded
    setTimeout(() => {
        if (window.editor && typeof window.editor.focus === 'function') {
            window.editor.focus();
            try {
                // Place cursor at the end of the content
                const lastLine = window.editor.lineCount() - 1;
                const lastChar = window.editor.getLine(lastLine).length;
                window.editor.setCursor({line: lastLine, ch: lastChar});
            } catch (err) {
                console.error('Error setting cursor position:', err);
            }
        }
    }, 500);
}

async function executeCode() {
    // Get the code from the editor
    const editor = window.editor; // Assuming the editor instance is stored globally
    if (!editor) return;
    
    const code = editor.getValue();
    const language = document.getElementById('language-selector').value;
    
    // Always force the console container to be expanded using our global function
    window.showConsole();
    
    // Show loading state in console
    const consoleOutput = document.querySelector('.console-output');
    if (consoleOutput) {
        consoleOutput.innerHTML = '<div class="loading-indicator"></div> Running code...';
        // Make sure the console is scrolled to the bottom
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
    }
    
    try {
        // Execute the code via API
        const response = await fetch('/api/execute', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code, language })
        });
        
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        
        const result = await response.json();
        
        // Update the console output
        if (result.success) {
            updateConsoleOutput(result.output || '<div class="output-empty">No output</div>');
        } else {
            // Display error with proper formatting
            updateConsoleOutput(result.error || '<div class="error-message">An unknown error occurred</div>');
        }
        
        // Update the real-world code panel
        updateRealWorldCode(code);
        
        // Update the interactive demo
        updateInteractiveDemo(code);
    } catch (error) {
        // Show error in console
        if (consoleOutput) {
            consoleOutput.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
            consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }
    }
}

async function updateConsoleOutput(output) {
    const consoleOutput = document.querySelector('.console-output');
    if (consoleOutput) {
        consoleOutput.innerHTML = output || '<div class="output-empty">No output</div>';
        
        // Scroll to the bottom of the console to show the latest output
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
        
        // Highlight code blocks if any
        const codeBlocks = consoleOutput.querySelectorAll('pre code');
        if (codeBlocks.length > 0 && window.hljs) {
            codeBlocks.forEach(block => {
                hljs.highlightBlock(block);
            });
        }
    }
}

async function updateRealWorldCode(code) {
    console.log("updateRealWorldCode called with code length:", code ? code.length : 0);
    
    // If our enhanced component function exists, use it
    if (typeof window.updateRealWorldCode === 'function' && window.updateRealWorldCode !== updateRealWorldCode) {
        console.log("Using enhanced updateRealWorldCode implementation");
        return window.updateRealWorldCode(code);
    } else {
        try {
            // Get the current language and concept
            const language = document.getElementById('language-selector').value || 'python';
            const concept = document.getElementById('concept-selector').value || 'general';
            
            // If no code is provided but we have a concept, try to load example code for that concept
            if ((!code || code.length < 30) && concept !== 'general') {
                try {
                    // Dynamically import the concept examples
                    console.log("Attempting to import ConceptExamples.js from updateInteractiveDemo");
                    const module = await import('/static/js/components/ConceptExamples.js');
                    // Get example code for the concept
                    const exampleCode = module.getConceptExamples(concept, language);
                    if (exampleCode) {
                        code = exampleCode;
                        console.log(`Used example code for ${concept} in ${language}`);
                    }
                } catch (e) {
                    console.warn('Error loading concept examples:', e);
                }
            }
            
            // Show loading state
            const realWorldCode = document.querySelector('.realworld-code');
            if (realWorldCode) {
                realWorldCode.innerHTML = `
                    <h3 class="realworld-title">Analyzing your code...</h3>
                    <p class="realworld-description">Generating real-world examples based on your code...</p>
                    <div class="realworld-code-block">
                        <div style="padding: 10px; font-style: italic;">Please wait...</div>
                    </div>
                `;
            }
            
            console.log("Fetching real-world mapping from API");
            // Get real-world mapping from API
            const response = await fetch('/api/realworld', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    code,
                    language,
                    concept
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch real-world mapping: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("Received real-world data:", data.title);
            
            // Update the real-world code panel
            if (realWorldCode) {
                realWorldCode.innerHTML = `
                    <h3 class="realworld-title">${data.title}</h3>
                    <p class="realworld-description">${data.description}</p>
                    <div class="realworld-code-block">
                        <pre><code class="language-${language}">${data.real_world_code || data.code}</code></pre>
                    </div>
                    <button id="open-gui-demo" class="primary-button">
                        <i data-feather="monitor"></i>
                        Open GUI Demo
                    </button>
                `;
                
                // Apply syntax highlighting
                document.querySelectorAll('pre code').forEach((block) => {
                    if (window.hljs && typeof window.hljs.highlightElement === 'function') {
                        hljs.highlightElement(block);
                    } else if (window.hljs && typeof window.hljs.highlightBlock === 'function') {
                        hljs.highlightBlock(block);
                    }
                });
                
                console.log("Real-world code panel updated successfully");
            } else {
                console.warn("Real-world code panel element not found");
            }
        } catch (error) {
            console.error('Error updating real-world code:', error);
            
            // Show error state
            const realWorldCode = document.querySelector('.realworld-code');
            if (realWorldCode) {
                realWorldCode.innerHTML = `
                    <h3 class="realworld-title">Error Loading Example</h3>
                    <p class="realworld-description error-message">An error occurred while generating the example: ${error.message}</p>
                    <div class="realworld-code-block">
                        <pre><code class="language-plaintext">// Try running the code manually or check the console for details.</code></pre>
                    </div>
                `;
            }
        }
    }
}

async function updateInteractiveDemo(code) {
    // If our enhanced component function exists, use it
    if (typeof window.updateInteractiveDemo === 'function' && window.updateInteractiveDemo !== updateInteractiveDemo) {
        return window.updateInteractiveDemo(code);
    } else {
        try {
            console.log("Generating interactive demo for code length:", code ? code.length : 0);
            
            // Get current language and concept
            const language = document.getElementById('language-selector').value || 'python';
            const concept = document.getElementById('concept-selector').value || 'general';
            
            // If no code is provided but we have a concept, try to load example code for that concept
            if ((!code || code.length < 30) && concept !== 'general') {
                try {
                    // Dynamically import the concept examples
                    const module = await import("/static/js/components/ConceptExamples.js");
                    // Get example code for the concept
                    const exampleCode = module.getConceptExamples(concept, language);
                    if (exampleCode) {
                        code = exampleCode;
                        console.log(`Used example code for ${concept} in ${language} for interactive demo`);
                    }
                } catch (e) {
                    console.warn('Error loading concept examples for interactive demo:', e);
                }
            }
            
            // Detect if code is authentication-related for better demo selection
            const isAuthRelated = code && (
                code.toLowerCase().includes('login') || 
                code.toLowerCase().includes('password') || 
                code.toLowerCase().includes('authenticate') ||
                code.toLowerCase().includes('credentials')
            );
            
            console.log(`Code type detected: ${isAuthRelated ? 'Authentication-related' : 'Standard'}, Language: ${language}, Concept: ${concept}`);
            
            // Show loading indicator in the GUI demo section
            const guiDemoRoot = document.getElementById('gui-demo-root');
            if (guiDemoRoot) {
                const guiDemoContent = guiDemoRoot.querySelector('.panel-content');
                if (guiDemoContent) {
                    guiDemoContent.innerHTML = `
                        <div class="loading-spinner-container">
                            <div class="loading-spinner"></div>
                            <p>Generating interactive GUI demonstration...</p>
                        </div>
                    `;
                }
            }
            
            // Get interactive demo from API
            const response = await fetch('/api/realworld/demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    code,
                    language,
                    concept
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch interactive demo: ${response.status} ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log("Received demo data with html length:", data.demo_html ? data.demo_html.length : 0);
            
            // Update the GUI Demo section in the right panel
            if (guiDemoRoot) {
                const guiDemoContent = guiDemoRoot.querySelector('.panel-content');
                if (guiDemoContent) {
                    if (data.demo_html) {
                        guiDemoContent.innerHTML = data.demo_html;
                        console.log("Updated GUI demo content");
                        
                        // Execute any scripts in the demo HTML
                        executeScripts(guiDemoContent);
                    } else {
                        guiDemoContent.innerHTML = '<div class="empty-state">No GUI demo available for this code.</div>';
                    }
                }
            }
            
            // Also update the popup interactive demo panel if it exists
            const interactiveDemo = document.querySelector('.interactive-demo');
            if (interactiveDemo) {
                if (data.demo_html) {
                    interactiveDemo.innerHTML = data.demo_html;
                    
                    // Execute any scripts in the demo HTML
                    executeScripts(interactiveDemo);
                } else {
                    interactiveDemo.innerHTML = '<div class="empty-state">No interactive demo available for this code.</div>';
                }
            }
            
            // Also update the interactive demo container for the modal
            const demoContainer = document.getElementById('interactive-demo-container');
            if (demoContainer) {
                const demoContent = demoContainer.querySelector('.panel-content');
                if (demoContent && data.demo_html) {
                    demoContent.innerHTML = data.demo_html;
                    
                    // Execute any scripts in the demo HTML
                    executeScripts(demoContent);
                }
            }
            
            // Return the data for chaining
            return data;
        } catch (error) {
            console.error('Error updating interactive demo:', error);
            
            // Set fallback content
            const guiDemoRoot = document.getElementById('gui-demo-root');
            if (guiDemoRoot) {
                const guiDemoContent = guiDemoRoot.querySelector('.panel-content');
                if (guiDemoContent) {
                    guiDemoContent.innerHTML = '<div class="error-message">Could not load GUI demo.</div>';
                }
            }
        }
    }
}

function updateContentByConcept(concept, language = 'python') {
    // Fetch concept content from the API
    fetch(`/api/concept/${concept}`)
        .then(response => response.json())
        .then(data => {
            // Update code editor with example
            if (window.editor && data.context && data.context.example) {
                window.editor.setValue(data.context.example);
            }
        })
        .catch(error => {
            console.error('Error fetching concept content:', error);
        });
}

function toggleHelpline() {
    const helplineRoot = document.getElementById('helpline-root');
    if (helplineRoot) {
        helplineRoot.classList.toggle('active');
    }
}

// Add global event listener for helpline close button
document.addEventListener('DOMContentLoaded', () => {
    // Global event listener for the helpline close button
    document.addEventListener('click', (event) => {
        if (event.target.id === 'helpline-close' || 
            (event.target.parentElement && event.target.parentElement.id === 'helpline-close')) {
            const helplineRoot = document.getElementById('helpline-root');
            if (helplineRoot) {
                helplineRoot.classList.remove('active');
            }
        }
    });
});

// Create a global function to show the console that can be called from anywhere
window.showConsole = function() {
    console.log('Showing console globally');
    const consoleContainer = document.getElementById('console-container');
    if (consoleContainer) {
        console.log('Console container found:', consoleContainer);
        // Force the console to be expanded
        consoleContainer.classList.remove('expanded'); // Remove first to force a refresh
        
        // Log the current class state
        console.log('Console container classes after remove:', consoleContainer.className);
        
        // Small delay to ensure the DOM updates
        setTimeout(() => {
            consoleContainer.classList.add('expanded');
            console.log('Console container classes after add:', consoleContainer.className);
            
            // Additional visibility enforcement for practice area
            const practiceArea = document.querySelector('.practice-area.active');
            if (practiceArea) {
                console.log('Practice area is active, enforcing console visibility');
                // Ensure the console is above the practice area
                consoleContainer.style.zIndex = '9999';
                consoleContainer.style.position = 'fixed';
                
                // Flash the console briefly to make it more noticeable
                consoleContainer.style.boxShadow = '0 0 10px var(--primary-color)';
                setTimeout(() => {
                    consoleContainer.style.boxShadow = '';
                }, 300);
            }
        }, 10);
        return true;
    } else {
        console.error('Console container not found');
        return false;
    }
};

function clearConsole() {
    const consoleOutput = document.querySelector('.console-output');
    if (consoleOutput) {
        consoleOutput.innerHTML = '';
    }
}

function onLanguageChange(event) {
    const language = event.target.value;
    const concept = document.getElementById('concept-selector').value;
    
    // Update code editor language
    if (window.editor) {
        // Set language mode for the editor if needed
        // This depends on your editor implementation
    }
    
    // Update content based on the new language
    updateContentByConcept(concept, language);
}

async function onConceptChange(event) {
    const concept = event.target.value;
    const language = document.getElementById('language-selector').value || 'python';
    
    console.log(`Concept changed to: ${concept}, language: ${language}`);
    
    // Special handling for if-else concept with login/signup example
    if (concept === 'if-else') {
        try {
            console.log("Loading specialized if-else login/signup example");
            
            // Import the if-else specific demo module
            const ifElseModule = await import('/static/js/components/if_else_demo.js');
            
            // Call the specialized initialization function directly
            if (typeof ifElseModule.initializeIfElseAuthDemo === 'function') {
                console.log("Found initializeIfElseAuthDemo, calling it directly");
                ifElseModule.initializeIfElseAuthDemo();
                return; // Exit early since everything is handled in the module
            } else {
                console.log("initializeIfElseAuthDemo function not found in module");
            }
            
            // Fallback: Load the regular code example for the editor
            const conceptModule = await import('/static/js/components/ConceptExamples.js');
            const exampleCode = conceptModule.getConceptExamples(concept, language);
            
            // Set the example code in the editor
            if (window.editor && window.editor.setValue) {
                window.editor.setValue(exampleCode);
            }
            
            // Update the real-world code section with authentication example
            const realWorldRoot = document.getElementById('realworld-code-root');
            if (realWorldRoot) {
                const realWorldContent = realWorldRoot.querySelector('.panel-content');
                if (realWorldContent) {
                    realWorldContent.innerHTML = `
                        <h3>User Authentication System</h3>
                        <p>This login/signup system uses if-else statements to validate user credentials and handle different authentication scenarios.</p>
                        <div class="code-block">
                            <pre><code class="language-${language}">${ifElseModule.IF_ELSE_REAL_WORLD_CODE}</code></pre>
                        </div>
                        <button id="open-gui-demo" class="primary-button">
                            <i data-feather="monitor"></i>
                            Open GUI Demo
                        </button>
                    `;
                    
                    // Apply syntax highlighting
                    document.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightBlock(block);
                    });
                    
                    // Reinitialize Feather icons
                    if (window.feather) {
                        feather.replace();
                    }
                    
                    // Add event listener to Open GUI Demo button
                    const openGuiDemoBtn = realWorldContent.querySelector('#open-gui-demo');
                    if (openGuiDemoBtn) {
                        openGuiDemoBtn.addEventListener('click', () => {
                            if (typeof openGuiDemo === 'function') {
                                openGuiDemo();
                            }
                        });
                    }
                }
            }
            
            // Update GUI demo with login form
            const guiDemoRoot = document.getElementById('gui-demo-root');
            if (guiDemoRoot) {
                const guiDemoContent = guiDemoRoot.querySelector('.panel-content');
                if (guiDemoContent) {
                    guiDemoContent.innerHTML = ifElseModule.IF_ELSE_DEMO_HTML;
                    
                    // Execute any scripts in the demo HTML
                    executeScripts(guiDemoContent);
                }
            }
            
            // Also update the interactive demo container for the modal
            const demoContainer = document.getElementById('interactive-demo-container');
            if (demoContainer) {
                const demoContent = demoContainer.querySelector('.panel-content');
                if (demoContent) {
                    demoContent.innerHTML = ifElseModule.IF_ELSE_DEMO_HTML;
                    
                    // Execute any scripts in the demo HTML
                    executeScripts(demoContent);
                }
            }
            
            return; // Done with special if-else handling
        } catch (e) {
            console.warn('Error loading if-else demo:', e);
            // Fall through to standard handling if there's an error
        }
    }
    
    // Standard handling for all other concepts
    try {
        // Dynamically import the concept examples
        console.log("Attempting to import ConceptExamples.js from onConceptChange");
        const module = await import('/static/js/components/ConceptExamples.js');
        // Get example code for the concept
        const exampleCode = module.getConceptExamples(concept, language);
        if (exampleCode) {
            console.log(`Loaded example code for ${concept} in ${language} from ConceptExamples`);
            
            // Set the example code in the editor if available
            if (window.editor && window.editor.setValue) {
                window.editor.setValue(exampleCode);
                
                // Also update real-world code and GUI demo
                if (typeof updateRealWorldCode === 'function') {
                    updateRealWorldCode(exampleCode);
                }
                if (typeof updateInteractiveDemo === 'function') {
                    updateInteractiveDemo(exampleCode);
                }
                
                // Return early since we've loaded everything we need
                return;
            }
        }
    } catch (e) {
        console.warn('Error loading concept examples for concept change:', e);
    }
    
    // Fallback to API-based content if ConceptExamples didn't work
    updateContentByConcept(concept, language);
}

async function loadPracticeProblems() {
    const practiceList = document.getElementById('practice-problems-list');
    if (!practiceList) return;
    
    // Show loading state
    practiceList.innerHTML = '<div class="loading-problems">Loading practice problems...</div>';
    
    try {
        // Get current concept and language
        const concept = document.getElementById('concept-selector').value;
        const language = document.getElementById('language-selector').value;
        
        // Fetch practice problems from API
        const response = await fetch('/api/practice');
        if (!response.ok) {
            throw new Error('Failed to fetch practice problems');
        }
        
        const data = await response.json();
        
        // Check if we have problems
        if (!data || !data.problems || data.problems.length === 0) {
            practiceList.innerHTML = '<div class="empty-state">No practice problems available for this concept yet.</div>';
            return;
        }
        
        // Build the problems list HTML
        let practiceHTML = '';
        data.problems.forEach((problem, index) => {
            const difficulty = problem.difficulty || 'medium';
            practiceHTML += `
                <div class="practice-problem-item" data-id="${index}">
                    <div class="practice-problem-title">${problem.title}</div>
                    <div class="practice-problem-description">${problem.description.substring(0, 150)}${problem.description.length > 150 ? '...' : ''}</div>
                    <div class="practice-problem-difficulty difficulty-${difficulty.toLowerCase()}">${difficulty}</div>
                </div>
            `;
        });
        
        practiceList.innerHTML = practiceHTML;
        
        // Add click event listeners to practice problem items
        document.querySelectorAll('.practice-problem-item').forEach((item, index) => {
            item.addEventListener('click', () => {
                openPracticeEditor(data.problems[index]);
            });
        });
        
    } catch (error) {
        console.error('Error loading practice problems:', error);
        practiceList.innerHTML = `<div class="error-message">Error loading practice problems: ${error.message}</div>`;
    }
}

function openPracticeEditor(problem) {
    // Get the practice area element
    const practiceArea = document.getElementById('practice-area-root');
    if (!practiceArea) return;
    
    // Get the current language
    const language = document.getElementById('language-selector').value;
    
    // Set up the practice area content
    const practiceContent = practiceArea.querySelector('.practice-content');
    if (practiceContent) {
        const practiceHeader = practiceContent.querySelector('.practice-header h2');
        if (practiceHeader) {
            practiceHeader.textContent = problem.title || 'Practice Problem';
        }
        
        const practiceDescription = practiceContent.querySelector('.practice-problem');
        if (practiceDescription) {
            practiceDescription.innerHTML = `
                <h3>${problem.title}</h3>
                <p>${problem.description}</p>
                ${problem.hints ? `<div class="practice-hints"><h4>Hints:</h4><p>${problem.hints}</p></div>` : ''}
            `;
        }
        
        // If there's a starter code, set it in the editor
        const practiceEditor = window.practiceEditor;
        if (practiceEditor) {
            practiceEditor.setValue(problem.starter_code || `# Write your solution for ${problem.title} here`);
        }
    }
    
    // Show the practice area
    practiceArea.querySelector('.practice-area').classList.add('active');
}