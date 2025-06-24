// This file handles the visual output panel functionality

// Initialize visual output
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the visual output container
    const visualOutput = document.getElementById('visual-output');
    
    // Create initial structure for the output panel
    setupOutputPanel();
});

// Setup the output panel structure
function setupOutputPanel() {
    const visualOutput = document.getElementById('visual-output');
    
    // Create GUI display area
    const outputWindow = document.createElement('div');
    outputWindow.className = 'output-window';
    outputWindow.id = 'output-window';
    
    // Create console output area
    const outputConsole = document.createElement('div');
    outputConsole.className = 'output-console';
    outputConsole.id = 'output-console';
    outputConsole.textContent = '// Output will appear here after you run the code...';
    
    // Add elements to the output panel
    visualOutput.appendChild(outputWindow);
    visualOutput.appendChild(outputConsole);
}

// Update visual output based on execution result
function updateVisualOutput(result) {
    const outputWindow = document.getElementById('output-window');
    const outputConsole = document.getElementById('output-console');
    
    // Update console output
    if (result.console_output) {
        outputConsole.innerHTML = formatConsoleOutput(result.console_output);
    }
    
    // Update GUI output
    if (result.visual_output) {
        updateGUIOutput(result.visual_output);
    } else {
        // Default GUI output based on code concept type
        const concept = document.querySelector('.sidebar-btn.active').getAttribute('data-concept');
        generateDefaultVisualization(concept, result.console_output || '');
    }
}

// Format console output with syntax highlighting
function formatConsoleOutput(output) {
    // Replace newlines with <br> tags
    let formattedOutput = output.replace(/\n/g, '<br>');
    
    // Highlight errors in red
    formattedOutput = formattedOutput.replace(/(Error|Exception|Traceback).*$/gm, '<span style="color: #e74c3c;">$&</span>');
    
    // Highlight success messages in green
    formattedOutput = formattedOutput.replace(/(Success|Completed|Done).*$/gm, '<span style="color: #2ecc71;">$&</span>');
    
    return formattedOutput;
}

// Generate default visualization based on concept type
function generateDefaultVisualization(concept, consoleOutput) {
    const outputWindow = document.getElementById('output-window');
    outputWindow.innerHTML = '';
    
    switch (concept) {
        case 'if-else':
            generateIfElseVisualization(consoleOutput);
            break;
        case 'oops':
            generateOOPVisualization(consoleOutput);
            break;
        case 'decorators':
            generateDecoratorsVisualization(consoleOutput);
            break;
        case 'functions':
            generateFunctionsVisualization(consoleOutput);
            break;
        default:
            // Generic visualization
            outputWindow.innerHTML = '<div class="placeholder-text">Run the code to see the output visualization</div>';
    }
}

// Generate visualization for if-else
function generateIfElseVisualization(consoleOutput) {
    const outputWindow = document.getElementById('output-window');
    
    // Parse console output to determine login state
    const isLoginSuccess = consoleOutput.includes('Login successful') || consoleOutput.includes('successful');
    const isPasswordError = consoleOutput.includes('Incorrect password') || consoleOutput.includes('password');
    const isUserNotFound = consoleOutput.includes('User not found') || consoleOutput.includes('not found');
    
    // Create login visualization
    const visualization = document.createElement('div');
    visualization.className = 'login-visualization';
    
    if (isLoginSuccess) {
        visualization.innerHTML = `
            <div class="login-container login-success">
                <div class="login-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#2ecc71" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                </div>
                <div class="login-status">Login Successful</div>
                <div class="login-message">Welcome back! You have full access.</div>
            </div>
        `;
    } else if (isPasswordError) {
        visualization.innerHTML = `
            <div class="login-container login-error">
                <div class="login-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                </div>
                <div class="login-status">Incorrect Password</div>
                <div class="login-message">Please check your password and try again.</div>
            </div>
        `;
    } else if (isUserNotFound) {
        visualization.innerHTML = `
            <div class="login-container login-error">
                <div class="login-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                        <line x1="6" y1="18" x2="18" y2="18"></line>
                    </svg>
                </div>
                <div class="login-status">User Not Found</div>
                <div class="login-message">Please register or check your username.</div>
            </div>
        `;
    } else {
        visualization.innerHTML = `
            <div class="login-container">
                <div class="login-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#3498db" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                </div>
                <div class="login-status">Authentication Status</div>
                <div class="login-message">Run the code to see login results.</div>
            </div>
        `;
    }
    
    outputWindow.appendChild(visualization);
    
    // Add custom styles for the login visualization
    const style = document.createElement('style');
    style.textContent = `
        .login-visualization {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .login-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border-radius: 8px;
            background-color: #f8f9fa;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 80%;
            max-width: 300px;
        }
        .login-success {
            border-left: 4px solid #2ecc71;
        }
        .login-error {
            border-left: 4px solid #e74c3c;
        }
        .login-icon {
            margin-bottom: 15px;
        }
        .login-status {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 5px;
        }
        .login-message {
            text-align: center;
            color: #666;
        }
    `;
    document.head.appendChild(style);
}

// Generate visualization for OOP concepts
function generateOOPVisualization(consoleOutput) {
    const outputWindow = document.getElementById('output-window');
    
    // Create vehicle visualization container
    const visualization = document.createElement('div');
    visualization.className = 'vehicle-visualization';
    
    // Parse console output to determine vehicle state
    const isEngineStarted = consoleOutput.includes('engine started') || consoleOutput.includes('started');
    const isEngineStop = consoleOutput.includes('engine stopped') || consoleOutput.includes('stopped');
    const isDriving = consoleOutput.includes('driving') || consoleOutput.includes('is driving');
    
    // Extract vehicle info if available (looking for patterns like "2020 Toyota Corolla")
    let vehicleInfo = "Vehicle";
    const infoMatch = consoleOutput.match(/\d{4}\s+\w+\s+\w+/);
    if (infoMatch) {
        vehicleInfo = infoMatch[0];
    }
    
    // Create visual representation
    visualization.innerHTML = `
        <div class="vehicle-container">
            <div class="vehicle-info">${vehicleInfo}</div>
            <div class="vehicle-image">
                <svg xmlns="http://www.w3.org/2000/svg" width="150" height="80" viewBox="0 0 24 24" fill="none" stroke="${isEngineStarted ? '#3498db' : '#95a5a6'}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M7 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                    <path d="M17 17m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0"></path>
                    <path d="M5 17h-2v-6l2 -5h9l4 5h1a2 2 0 0 1 2 2v4h-2m-4 0h-6"></path>
                    <path d="M6 9h11m-6 4v-4"></path>
                </svg>
                ${isDriving ? `
                    <div class="motion-lines">
                        <div class="line line1"></div>
                        <div class="line line2"></div>
                        <div class="line line3"></div>
                    </div>
                ` : ''}
            </div>
            <div class="vehicle-status-container">
                <div class="vehicle-status ${isEngineStarted ? 'status-on' : 'status-off'}">
                    Engine: ${isEngineStarted ? 'Running' : 'Off'}
                </div>
                <div class="vehicle-status ${isDriving ? 'status-driving' : ''}">
                    Status: ${isDriving ? 'Driving' : 'Parked'}
                </div>
            </div>
        </div>
    `;
    
    outputWindow.appendChild(visualization);
    
    // Add custom styles for the vehicle visualization
    const style = document.createElement('style');
    style.textContent = `
        .vehicle-visualization {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .vehicle-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px;
            border-radius: 8px;
            background-color: #f8f9fa;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 90%;
            max-width: 350px;
        }
        .vehicle-info {
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .vehicle-image {
            position: relative;
            margin-bottom: 20px;
        }
        .vehicle-status-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
            width: 100%;
        }
        .vehicle-status {
            padding: 8px 15px;
            border-radius: 4px;
            background-color: #eee;
            text-align: center;
        }
        .status-on {
            background-color: #2ecc7133;
            color: #27ae60;
        }
        .status-off {
            background-color: #e74c3c33;
            color: #c0392b;
        }
        .status-driving {
            background-color: #3498db33;
            color: #2980b9;
        }
        .motion-lines {
            position: absolute;
            top: 40%;
            left: -20px;
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .line {
            height: 2px;
            background-color: #3498db;
            animation: moveLines 1s infinite linear;
        }
        .line1 { width: 15px; }
        .line2 { width: 10px; }
        .line3 { width: 20px; }
        @keyframes moveLines {
            0% { transform: translateX(0); opacity: 0; }
            50% { opacity: 1; }
            100% { transform: translateX(-15px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// Generate visualization for Decorators
function generateDecoratorsVisualization(consoleOutput) {
    const outputWindow = document.getElementById('output-window');
    
    // Create decorators visualization container
    const visualization = document.createElement('div');
    visualization.className = 'decorator-visualization';
    
    // Extract execution time if available
    let executionTime = null;
    const timeMatch = consoleOutput.match(/took\s+([\d.]+)\s*(\w+)/i);
    if (timeMatch) {
        executionTime = {
            value: parseFloat(timeMatch[1]),
            unit: timeMatch[2]
        };
    }
    
    // Extract function name if available
    let functionName = "function";
    const nameMatch = consoleOutput.match(/Function\s+(\w+)/i);
    if (nameMatch) {
        functionName = nameMatch[1];
    }
    
    // Extract result if available (looking for "Result: X")
    let resultValue = null;
    const resultMatch = consoleOutput.match(/Result:\s+(\d+)/);
    if (resultMatch) {
        resultValue = resultMatch[1];
    }
    
    // Create visual representation
    visualization.innerHTML = `
        <div class="decorator-container">
            <div class="decorator-header">
                <h3>Function Execution Flow</h3>
            </div>
            <div class="execution-flow">
                <div class="flow-step">
                    <div class="step-number">1</div>
                    <div class="step-description">Call to <span class="code-name">${functionName}()</span></div>
                </div>
                <div class="flow-arrow">↓</div>
                <div class="flow-step decorator-step">
                    <div class="step-number">2</div>
                    <div class="step-description">@timer_decorator intercepts call</div>
                </div>
                <div class="flow-arrow">↓</div>
                <div class="flow-step">
                    <div class="step-number">3</div>
                    <div class="step-description">Original function executes</div>
                </div>
                <div class="flow-arrow">↓</div>
                <div class="flow-step result-step">
                    <div class="step-number">4</div>
                    <div class="step-description">Result: ${resultValue !== null ? resultValue : 'N/A'}</div>
                </div>
            </div>
            ${executionTime !== null ? `
                <div class="execution-time">
                    <div class="timer-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                    </div>
                    <div class="time-value">Execution Time: ${executionTime.value} ${executionTime.unit}</div>
                </div>
            ` : ''}
        </div>
    `;
    
    outputWindow.appendChild(visualization);
    
    // Add custom styles for the decorator visualization
    const style = document.createElement('style');
    style.textContent = `
        .decorator-visualization {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .decorator-container {
            display: flex;
            flex-direction: column;
            padding: 20px;
            border-radius: 8px;
            background-color: #f8f9fa;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 90%;
            max-width: 350px;
        }
        .decorator-header {
            margin-bottom: 15px;
            text-align: center;
        }
        .decorator-header h3 {
            margin: 0;
            color: #3498db;
        }
        .execution-flow {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-bottom: 20px;
        }
        .flow-step {
            display: flex;
            align-items: center;
            padding: 10px;
            border-radius: 4px;
            background-color: #eee;
        }
        .decorator-step {
            background-color: #e74c3c22;
            border-left: 3px solid #e74c3c;
        }
        .result-step {
            background-color: #2ecc7122;
            border-left: 3px solid #2ecc71;
        }
        .step-number {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background-color: #3498db;
            color: white;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right: 10px;
            font-weight: bold;
        }
        .flow-arrow {
            display: flex;
            justify-content: center;
            color: #95a5a6;
            font-size: 20px;
        }
        .code-name {
            font-family: monospace;
            background-color: #f1f1f1;
            padding: 0 4px;
            border-radius: 2px;
        }
        .execution-time {
            display: flex;
            align-items: center;
            background-color: #f1c40f22;
            padding: 10px;
            border-radius: 4px;
            color: #7f8c8d;
        }
        .timer-icon {
            margin-right: 10px;
            color: #f1c40f;
        }
    `;
    document.head.appendChild(style);
}

// Generate visualization for Functions
function generateFunctionsVisualization(consoleOutput) {
    const outputWindow = document.getElementById('output-window');
    
    // Create temperature conversion visualization container
    const visualization = document.createElement('div');
    visualization.className = 'temperature-visualization';
    
    // Extract temperature conversions if available
    const conversions = [];
    
    // Find patterns like "X°C is equal to Y°F"
    const conversionRegex = /(-?[\d.]+)°([CF])\s+is\s+equal\s+to\s+(-?[\d.]+)°([CFK])/gi;
    let match;
    
    while ((match = conversionRegex.exec(consoleOutput)) !== null) {
        conversions.push({
            from: {
                value: parseFloat(match[1]),
                unit: match[2].toUpperCase()
            },
            to: {
                value: parseFloat(match[3]),
                unit: match[4].toUpperCase()
            }
        });
    }
    
    // Create visual representation
    let conversionHtml = '';
    
    if (conversions.length > 0) {
        conversions.forEach(conversion => {
            conversionHtml += `
                <div class="conversion-result">
                    <div class="temp-value">${conversion.from.value}°${conversion.from.unit}</div>
                    <div class="conversion-arrow">→</div>
                    <div class="temp-value result-value">${conversion.to.value.toFixed(2)}°${conversion.to.unit}</div>
                </div>
            `;
        });
    } else {
        conversionHtml = `
            <div class="conversion-placeholder">
                Run temperature conversion code to see results
            </div>
        `;
    }
    
    visualization.innerHTML = `
        <div class="temperature-container">
            <div class="temperature-header">
                <h3>Temperature Conversion</h3>
            </div>
            <div class="temperature-scale">
                <div class="scale celsius">
                    <div class="scale-label">Celsius (°C)</div>
                    <div class="scale-marker">
                        <div class="scale-line"></div>
                        <div class="scale-points">
                            <div class="point">0°</div>
                            <div class="point">25°</div>
                            <div class="point">50°</div>
                            <div class="point">75°</div>
                            <div class="point">100°</div>
                        </div>
                    </div>
                </div>
                <div class="scale fahrenheit">
                    <div class="scale-label">Fahrenheit (°F)</div>
                    <div class="scale-marker">
                        <div class="scale-line"></div>
                        <div class="scale-points">
                            <div class="point">32°</div>
                            <div class="point">77°</div>
                            <div class="point">122°</div>
                            <div class="point">167°</div>
                            <div class="point">212°</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="conversion-results">
                ${conversionHtml}
            </div>
        </div>
    `;
    
    outputWindow.appendChild(visualization);
    
    // Add custom styles for the temperature visualization
    const style = document.createElement('style');
    style.textContent = `
        .temperature-visualization {
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .temperature-container {
            display: flex;
            flex-direction: column;
            padding: 20px;
            border-radius: 8px;
            background-color: #f8f9fa;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            width: 90%;
            max-width: 400px;
        }
        .temperature-header {
            margin-bottom: 15px;
            text-align: center;
        }
        .temperature-header h3 {
            margin: 0;
            color: #3498db;
        }
        .temperature-scale {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 20px;
        }
        .scale {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        .scale-label {
            font-weight: bold;
        }
        .scale-marker {
            position: relative;
            height: 10px;
        }
        .scale-line {
            position: absolute;
            height: 4px;
            width: 100%;
            background-color: #e0e0e0;
            top: 13px;
            border-radius: 2px;
        }
        .celsius .scale-line {
            background-color: #3498db55;
        }
        .fahrenheit .scale-line {
            background-color: #e74c3c55;
        }
        .scale-points {
            display: flex;
            justify-content: space-between;
            position: relative;
        }
        .point {
            position: relative;
            width: 4px;
            height: 10px;
            font-size: 12px;
        }
        .point::before {
            content: '';
            position: absolute;
            width: 2px;
            height: 8px;
            background-color: #aaa;
            left: 1px;
            top: 0;
        }
        .celsius .point {
            color: #3498db;
        }
        .fahrenheit .point {
            color: #e74c3c;
        }
        .conversion-results {
            display: flex;
            flex-direction: column;
            gap: 10px;
            margin-top: 20px;
        }
        .conversion-result {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 10px;
            background-color: #f5f5f5;
            border-radius: 4px;
        }
        .temp-value {
            font-size: 16px;
            font-weight: bold;
            padding: 5px 10px;
            border-radius: 4px;
        }
        .conversion-arrow {
            color: #95a5a6;
            font-size: 20px;
        }
        .result-value {
            background-color: #2ecc7122;
            color: #27ae60;
        }
        .conversion-placeholder {
            text-align: center;
            padding: 20px;
            color: #95a5a6;
            font-style: italic;
        }
    `;
    document.head.appendChild(style);
}

// Update GUI output based on provided data
function updateGUIOutput(visualData) {
    const outputWindow = document.getElementById('output-window');
    
    // Clear existing content
    outputWindow.innerHTML = '';
    
    if (typeof visualData === 'string') {
        // If visualData is just a string, display it
        outputWindow.innerHTML = `<div class="output-text">${visualData}</div>`;
    } else if (typeof visualData === 'object') {
        // If visualData is an object with specific visualization data
        // This would depend on what the backend sends
        // For now, just display as JSON
        outputWindow.innerHTML = `<pre class="output-json">${JSON.stringify(visualData, null, 2)}</pre>`;
    }
}

// Reset the visual output
function resetVisualOutput() {
    const outputWindow = document.getElementById('output-window');
    const outputConsole = document.getElementById('output-console');
    
    // Clear output areas
    outputWindow.innerHTML = '';
    outputConsole.textContent = '// Output will appear here after you run the code...';
    
    // Add placeholder
    const placeholder = document.createElement('div');
    placeholder.className = 'placeholder-text';
    placeholder.textContent = 'Run your code to see the output';
    outputWindow.appendChild(placeholder);
}

// Show execution error in visual output
function showExecutionError(errorMessage) {
    const outputConsole = document.getElementById('output-console');
    outputConsole.innerHTML = `<span style="color: #e74c3c;">Error: ${errorMessage}</span>`;
    
    const outputWindow = document.getElementById('output-window');
    outputWindow.innerHTML = `
        <div class="error-container">
            <div class="error-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="8" x2="12" y2="12"></line>
                    <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
            </div>
            <div class="error-title">Execution Error</div>
            <div class="error-message">${errorMessage}</div>
        </div>
    `;
    
    // Add error styles if not already added
    if (!document.getElementById('error-styles')) {
        const style = document.createElement('style');
        style.id = 'error-styles';
        style.textContent = `
            .error-container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                text-align: center;
                padding: 20px;
            }
            .error-icon {
                margin-bottom: 15px;
            }
            .error-title {
                font-size: 18px;
                font-weight: bold;
                color: #e74c3c;
                margin-bottom: 10px;
            }
            .error-message {
                font-family: monospace;
                background-color: #f9f2f4;
                color: #c0392b;
                padding: 10px;
                border-radius: 4px;
                max-width: 100%;
                overflow-wrap: break-word;
            }
        `;
        document.head.appendChild(style);
    }
}
