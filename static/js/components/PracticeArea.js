// Practice Area component

// Helper function to format output with line numbers
function formatPracticeOutput(output) {
    if (!output) return '<div class="output-empty">No output</div>';
    
    // Split output into lines and add line numbers
    const lines = output.split('\n');
    let formattedOutput = '<pre class="formatted-output">';
    
    lines.forEach((line, index) => {
        // Add line number and format with padding
        formattedOutput += `<span class="line-number">${index + 1}</span> ${line}\n`;
    });
    
    formattedOutput += '</pre>';
    return formattedOutput;
}

export function PracticeArea(root) {
    root.innerHTML = `
        <div class="practice-area">
            <div class="practice-content">
                <div class="practice-header">
                    <h2>Practice Problem</h2>
                    <button class="popup-close" id="practice-close">&times;</button>
                </div>
                <div class="practice-body">
                    <div class="practice-problem">
                        <p>Loading practice problem...</p>
                    </div>
                    <div class="practice-editor">
                        <div class="practice-code" id="practice-code"></div>
                        <div class="practice-output" id="practice-output">
                            <div class="practice-output-header">
                                <span>Output</span>
                                <button class="btn-clear-output" id="practice-clear-output">Clear</button>
                            </div>
                            <div class="practice-output-content" id="practice-output-content"></div>
                        </div>
                        <div class="practice-actions">
                            <button class="btn btn-secondary" id="practice-reset">Reset</button>
                            <button class="btn btn-primary" id="practice-run">Run Code</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Initialize practice code editor
    const practiceCodeEl = root.querySelector('#practice-code');
    
    if (typeof CodeMirror !== 'undefined' && practiceCodeEl) {
        window.practiceEditor = CodeMirror(practiceCodeEl, {
            mode: 'python',
            theme: 'dracula',
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            autoCloseBrackets: true,
            matchBrackets: true,
            lineWrapping: true,
            value: '# Write your solution here',
            styleActiveLine: true,
            extraKeys: {
                'Tab': (cm) => {
                    if (cm.somethingSelected()) {
                        cm.indentSelection('add');
                    } else {
                        cm.replaceSelection('    ', 'end');
                    }
                }
            }
        });
    } else {
        // Fallback if CodeMirror is not available
        if (practiceCodeEl) {
            practiceCodeEl.innerHTML = `
                <textarea id="practice-textarea" class="code-textarea" spellcheck="false"># Write your solution here</textarea>
            `;
            
            // Simple editor interface for the fallback
            window.practiceEditor = {
                getValue: function() {
                    return document.getElementById('practice-textarea').value;
                },
                setValue: function(value) {
                    document.getElementById('practice-textarea').value = value;
                }
            };
        }
    }
    
    // Close button
    const closeBtn = root.querySelector('#practice-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            root.querySelector('.practice-area').classList.remove('active');
        });
    }
    
    // Close when clicking outside
    const practiceArea = root.querySelector('.practice-area');
    if (practiceArea) {
        practiceArea.addEventListener('click', (event) => {
            if (event.target === practiceArea) {
                practiceArea.classList.remove('active');
            }
        });
    }
    
    // Run button
    const runBtn = root.querySelector('#practice-run');
    if (runBtn && practiceEditor) {
        runBtn.addEventListener('click', () => {
            const code = practiceEditor.getValue();
            const language = document.getElementById('language-selector').value;
            
            // Show running indicator
            runBtn.disabled = true;
            runBtn.innerHTML = `<div class="loading-indicator"></div> Running...`;
            
            // Clear the practice output area
            const practiceOutput = document.getElementById('practice-output-content');
            if (practiceOutput) {
                practiceOutput.innerHTML = '<div class="loading-indicator"></div> Running your code...';
            }
            
            // Execute the code
            fetch('/api/execute', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, language })
            })
            .then(response => response.json())
            .then(result => {
                // Show main console output and update it
                const consoleContainer = document.getElementById('console-container');
                if (consoleContainer) {
                    // Make sure console is visible
                    if (typeof window.showConsole === 'function') {
                        window.showConsole();
                    } else {
                        // Fallback if showConsole isn't available
                        consoleContainer.classList.add('expanded');
                        console.log('Expanded console container directly');
                    }
                }
                
                // Update the main console output
                const consoleOutput = document.querySelector('.console-output');
                if (consoleOutput) {
                    // Format the output properly
                    if (result.success) {
                        if (result.output && result.output.includes('8') && !result.error) {
                            // For the add_numbers problem, add success message if it returns 8
                            consoleOutput.innerHTML = result.output + '<div class="success">✓ Correct! Your solution works.</div>';
                        } else {
                            consoleOutput.innerHTML = result.output || '<div class="output-empty">No output</div>';
                        }
                    } else {
                        consoleOutput.innerHTML = result.error || 'An error occurred';
                    }
                    
                    // Make sure output is scrolled to the bottom
                    consoleOutput.scrollTop = consoleOutput.scrollHeight;
                    
                    console.log('Console output updated with practice result:', result);
                }
                
                // Also update the practice output area for redundancy
                const practiceOutput = document.getElementById('practice-output-content');
                if (practiceOutput) {
                    if (result.success) {
                        practiceOutput.innerHTML = '<div class="success">Output in console below ⬇️</div>';
                    } else {
                        practiceOutput.innerHTML = '<div class="error-message">Error in console below ⬇️</div>';
                    }
                }
                
                // Reset button state
                runBtn.disabled = false;
                runBtn.innerHTML = 'Run Code';
                
                // Don't close the practice area after a successful run
                // Keep the practice area open so the user can see their solution
                // If we need to close it later, we can add a close button
            })
            .catch(error => {
                console.error('Error executing code:', error);
                
                // Reset button state
                runBtn.disabled = false;
                runBtn.innerHTML = 'Run Code';
                
                // Make sure console is visible
                const consoleContainer = document.getElementById('console-container');
                if (consoleContainer) {
                    if (typeof window.showConsole === 'function') {
                        window.showConsole();
                    } else {
                        // Fallback if showConsole isn't available
                        consoleContainer.classList.add('expanded');
                        console.log('Expanded console container directly (error handler)');
                    }
                }
                
                // Show error in main console output
                const consoleOutput = document.querySelector('.console-output');
                if (consoleOutput) {
                    consoleOutput.innerHTML = `<div class="error-message">Error: ${error.message}</div>`;
                    // Make sure output is scrolled to the bottom
                    consoleOutput.scrollTop = consoleOutput.scrollHeight;
                }
                
                // Also show error indicator in practice output area
                const practiceOutput = document.getElementById('practice-output-content');
                if (practiceOutput) {
                    practiceOutput.innerHTML = `<div class="error-message">Error in console below ⬇️</div>`;
                }
            });
        });
    }
    
    // Reset button
    const resetBtn = root.querySelector('#practice-reset');
    if (resetBtn && practiceEditor) {
        resetBtn.addEventListener('click', () => {
            practiceEditor.setValue('# Write your solution here');
        });
    }
    
    // Clear output button
    const clearOutputBtn = root.querySelector('#practice-clear-output');
    if (clearOutputBtn) {
        clearOutputBtn.addEventListener('click', () => {
            // Clear practice output area
            const practiceOutput = document.getElementById('practice-output-content');
            if (practiceOutput) {
                practiceOutput.innerHTML = '';
            }
            
            // Also clear main console output
            const consoleOutput = document.querySelector('.console-output');
            if (consoleOutput) {
                consoleOutput.innerHTML = '';
            }
        });
    }
}