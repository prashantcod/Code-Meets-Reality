// Console Output component
export function ConsoleOutput(root) {
    // Create the console output container
    const contentDiv = root.querySelector('.panel-content');
    if (!contentDiv) {
        console.error('Console panel-content not found');
        return;
    }
    
    // Initialize console output
    contentDiv.innerHTML = `
        <div class="console-output">// Console output will appear here after running your code</div>
    `;
    
    // Add clear console functionality
    const clearConsoleBtn = root.querySelector('.btn-clear');
    if (clearConsoleBtn) {
        clearConsoleBtn.addEventListener('click', () => {
            const consoleOutput = contentDiv.querySelector('.console-output');
            if (consoleOutput) {
                consoleOutput.innerHTML = '';
            }
        });
    }
    
    // If the console handle exists, make sure it works properly
    const consoleHandle = document.querySelector('.console-handle');
    if (consoleHandle) {
        // Make sure the click event properly toggles the console
        consoleHandle.addEventListener('click', () => {
            console.log('Console handle clicked');
            const consoleContainer = document.getElementById('console-container');
            if (consoleContainer) {
                consoleContainer.classList.toggle('expanded');
            }
        });
    }
    
    // Make sure minimize console button works
    const minimizeConsoleBtn = document.getElementById('minimize-console');
    if (minimizeConsoleBtn) {
        minimizeConsoleBtn.addEventListener('click', () => {
            const consoleContainer = document.getElementById('console-container');
            if (consoleContainer) {
                consoleContainer.classList.remove('expanded');
            }
        });
    }
    
    console.log('Console Output component initialized');
}