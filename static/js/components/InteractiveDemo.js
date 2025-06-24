// Interactive Demo component
export function InteractiveDemo(root) {
    // Create the interactive demo container
    const contentDiv = root.querySelector('.panel-content');
    if (!contentDiv) return;
    
    // Initialize with empty state
    contentDiv.innerHTML = `
        <div class="interactive-demo">
            <div class="empty-state">
                <div class="demo-header">
                    <h3>Interactive Demonstration</h3>
                    <p>Type or run your code to see a practical, domain-specific demo based on real-world usage.</p>
                </div>
                <div class="demo-info">
                    <p>Our AI will analyze your code and generate a custom, interactive demo showing how similar code works in real-world applications.</p>
                </div>
            </div>
        </div>
    `;
    
    // Add some base styles for the demo containers
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .interactive-demo {
            font-family: 'Segoe UI', Arial, sans-serif;
        }
        .demo-header {
            margin-bottom: 15px;
        }
        .demo-header h3 {
            margin-top: 0;
            margin-bottom: 8px;
            color: #333;
        }
        .demo-info {
            padding: 12px;
            background: #f0f5ff;
            border-radius: 6px;
            margin: 15px 0;
        }
        .demo-preview {
            margin-top: 20px;
            padding: 15px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
        }
        .empty-state {
            padding: 20px;
            text-align: center;
            color: #555;
        }
        .loading-state {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 30px;
        }
        .loading-indicator {
            width: 40px;
            height: 40px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid #3498db;
            border-radius: 50%;
            animation: spin 1s linear infinite;
            margin-bottom: 15px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `;
    document.head.appendChild(styleEl);
    
    // Expose a global update function
    window.updateInteractiveDemo = async function(code) {
        if (!code || code.length < 30) {
            // Not enough code to process
            return;
        }
        
        // Show loading state
        contentDiv.innerHTML = `
            <div class="interactive-demo">
                <div class="loading-state">
                    <div class="loading-indicator"></div>
                    <p>Generating interactive demo...</p>
                </div>
            </div>
        `;
        
        try {
            // Get the current language
            const language = document.getElementById('language-selector').value || 'python';
            const concept = document.getElementById('concept-selector').value || 'general';
            
            // Make the API request
            const response = await fetch('/api/realworld/demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code, language, concept })
            });
            
            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Update the UI with the response
            if (data && data.demo_html) {
                // Get the real-world details from the API to display alongside the demo
                let realWorldTitle = "Interactive Demo";
                let realWorldDescription = "This demo shows how your code works in a real-world scenario.";
                
                try {
                    // Get the real-world code example that the demo is based on
                    const rwResponse = await fetch('/api/realworld', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ code, language, concept })
                    });
                    
                    if (rwResponse.ok) {
                        const rwData = await rwResponse.json();
                        realWorldTitle = rwData.title || realWorldTitle;
                        realWorldDescription = rwData.description || realWorldDescription;
                    }
                } catch (e) {
                    console.error('Error fetching real-world details:', e);
                }
                
                // Render demo with context and details
                contentDiv.innerHTML = `
                    <div class="interactive-demo">
                        <div class="demo-header">
                            <h3>${realWorldTitle}</h3>
                            <p>${realWorldDescription}</p>
                        </div>
                        <div class="demo-preview">
                            ${data.demo_html}
                        </div>
                    </div>
                `;
                
                // Execute any scripts in the demo HTML
                const scripts = contentDiv.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.textContent) {
                        try {
                            eval(script.textContent);
                        } catch (e) {
                            console.error('Error executing demo script:', e);
                        }
                    }
                });
            } else if (data && data.html) {
                // Fallback for older API format
                contentDiv.innerHTML = `
                    <div class="interactive-demo">
                        <div class="demo-preview">
                            ${data.html}
                        </div>
                    </div>
                `;
                
                // Execute any scripts in the demo HTML
                const scripts = contentDiv.querySelectorAll('script');
                scripts.forEach(script => {
                    if (script.textContent) {
                        try {
                            eval(script.textContent);
                        } catch (e) {
                            console.error('Error executing demo script:', e);
                        }
                    }
                });
            } else {
                contentDiv.innerHTML = `
                    <div class="interactive-demo">
                        <div class="empty-state">
                            <p>No interactive demo available for this code.</p>
                        </div>
                    </div>
                `;
            }
            
        } catch (error) {
            console.error('Error fetching interactive demo:', error);
            
            // Show error state with a simple fallback
            let fallbackDemo = '';
            
            // Determine code type for fallback
            if (code.includes('class')) {
                fallbackDemo = '<div style="padding:20px; border:1px solid #ddd; border-radius:8px">\n                    <h4>Object Creator</h4>\n                    <div>\n                        <div style="margin-bottom:10px;">\n                            <label>Object Name:</label>\n                            <input type="text" id="obj-name" value="MyObject" style="margin-left:10px;" />\n                        </div>\n                        <div style="margin-bottom:10px;">\n                            <label>Property Name:</label>\n                            <input type="text" id="obj-prop" value="value" style="margin-left:10px;" />\n                        </div>\n                        <div style="margin-bottom:10px;">\n                            <label>Property Value:</label>\n                            <input type="text" id="obj-val" value="true" style="margin-left:10px;" />\n                        </div>\n                        <button onclick="createSimpleObject()" style="padding:8px 16px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Create Object</button>\n                    </div>\n                    <div id="obj-result" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px; font-family:monospace;">\n                        Object will appear here\n                    </div>\n                    <script>\n                        function createSimpleObject() {\n                            const name = document.getElementById(\'obj-name\').value || \'MyObject\';\n                            const prop = document.getElementById(\'obj-prop\').value || \'value\';\n                            const val = document.getElementById(\'obj-val\').value || \'true\';\n                            const resultEl = document.getElementById(\'obj-result\');\n                            \n                            resultEl.innerHTML = `const ${name} = {<br>    ${prop}: ${val},<br>    created: "${new Date().toISOString()}",<br>    toString() { return "${name} object"; }<br>}`;\n                        }\n                    </script>\n                </div>';
            } else if (code.includes('if') && code.includes('else')) {
                fallbackDemo = '<div style="padding:20px; border:1px solid #ddd; border-radius:8px">\n                    <h4>Conditional Flow Simulator</h4>\n                    <div>\n                        <label>Input value:</label>\n                        <input type="text" id="simple-input" placeholder="Enter a value" style="margin-left:10px;" />\n                        <button onclick="runSimpleCondition()" style="margin-left:10px; padding:5px 10px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Test</button>\n                    </div>\n                    <div id="simple-result" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;">\n                        Enter a value and click Test\n                    </div>\n                    <script>\n                        function runSimpleCondition() {\n                            const input = document.getElementById(\'simple-input\').value;\n                            const resultEl = document.getElementById(\'simple-result\');\n                            \n                            if (!input) {\n                                resultEl.innerHTML = \'<span style="color:red;">Please enter a value!</span>\';\n                            } else if (isNaN(input)) {\n                                resultEl.innerHTML = `<span style="color:blue;">"${input}" is text - entered branch 1</span>`;\n                            } else if (Number(input) > 10) {\n                                resultEl.innerHTML = `<span style="color:green;">${input} is greater than 10 - entered branch 2</span>`;\n                            } else {\n                                resultEl.innerHTML = `<span style="color:orange;">${input} is a number <= 10 - entered branch 3</span>`;\n                            }\n                        }\n                    </script>\n                </div>';
            } else if (code.includes('for') || code.includes('while')) {
                fallbackDemo = '<div style="padding:20px; border:1px solid #ddd; border-radius:8px">\n                    <h4>Loop Visualizer</h4>\n                    <div>\n                        <div style="margin-bottom:10px;">\n                            <label>Number of iterations:</label>\n                            <input type="number" id="loop-count" min="1" max="20" value="5" style="margin-left:10px; width:60px;" />\n                        </div>\n                        <div style="margin-bottom:10px;">\n                            <label>Loop type:</label>\n                            <select id="loop-type" style="margin-left:10px;">\n                                <option value="for">For Loop</option>\n                                <option value="while">While Loop</option>\n                            </select>\n                        </div>\n                        <button onclick="visualizeLoop()" style="padding:5px 10px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Run Loop</button>\n                    </div>\n                    <div id="loop-visualization" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;">\n                        Configure and run the loop\n                    </div>\n                    <script>\n                        function visualizeLoop() {\n                            const count = parseInt(document.getElementById(\'loop-count\').value) || 5;\n                            const type = document.getElementById(\'loop-type\').value;\n                            const visualEl = document.getElementById(\'loop-visualization\');\n                            \n                            visualEl.innerHTML = `<div style="font-family:monospace; margin-bottom:10px;">${type === \'for\' ? \n                                `for (let i = 0; i < ${count}; i++) {<br>    // Loop body<br>}` : \n                                `let i = 0;<br>while (i < ${count}) {<br>    // Loop body<br>    i++;<br>}`\n                            }</div><div>Execution:</div>`;\n                            \n                            // Simulate loop execution with delays\n                            let i = 0;\n                            const interval = setInterval(() => {\n                                visualEl.innerHTML += `<div>Iteration ${i}: Processing item ${i}</div>`;\n                                i++;\n                                if (i >= count) {\n                                    clearInterval(interval);\n                                    visualEl.innerHTML += `<div style="margin-top:10px;">Loop completed after ${count} iterations</div>`;\n                                }\n                            }, 500);\n                        }\n                    </script>\n                </div>';
            } else {
                fallbackDemo = '<div style="padding:20px; border:1px solid #ddd; border-radius:8px">\n                    <h4>Code Execution Simulator</h4>\n                    <div style="margin-bottom:15px;">\n                        <p>This interactive demo simulates the execution of your code.</p>\n                    </div>\n                    <div style="display:flex; margin-bottom:15px;">\n                        <div style="flex:1; margin-right:10px;">\n                            <label>Input 1:</label>\n                            <input type="text" id="input1" value="Test" style="display:block; margin-top:5px; width:100%;" />\n                        </div>\n                        <div style="flex:1;">\n                            <label>Input 2:</label>\n                            <input type="number" id="input2" value="42" style="display:block; margin-top:5px; width:100%;" />\n                        </div>\n                    </div>\n                    <button onclick="processInputs()" style="padding:8px 16px; background:#4a6bdf; color:white; border:none; border-radius:4px;">Process</button>\n                    <div id="generic-result" style="margin-top:15px; padding:10px; background:#f5f5f5; border-radius:4px;">\n                        Results will appear here\n                    </div>\n                    <script>\n                        function processInputs() {\n                            const input1 = document.getElementById(\'input1\').value;\n                            const input2 = parseInt(document.getElementById(\'input2\').value);\n                            const resultEl = document.getElementById(\'generic-result\');\n                            \n                            // Simulate processing\n                            resultEl.innerHTML = \'<div>Processing...</div>\';\n                            \n                            setTimeout(() => {\n                                resultEl.innerHTML = `\n                                    <div style="margin-bottom:10px;"><strong>Input Processing Results:</strong></div>\n                                    <div>Text Input: "${input1}" (${input1.length} characters)</div>\n                                    <div>Number Input: ${input2} (${input2 % 2 === 0 ? \'even\' : \'odd\'} number)</div>\n                                    <div style="margin-top:10px;">Combined Result: "${input1}-${input2}"</div>\n                                    <div>Timestamp: ${new Date().toLocaleTimeString()}</div>\n                                `;\n                            }, 1000);\n                        }\n                    </script>\n                </div>';
            }
            
            contentDiv.innerHTML = `
                <div class="interactive-demo">
                    <div class="demo-header">
                        <h3>Interactive Demonstration</h3>
                        <div class="demo-info">
                            <p>We couldn't generate a custom demo using OpenAI, but here's a fallback demonstration for your code:</p>
                        </div>
                    </div>
                    <div class="demo-preview">
                        ${fallbackDemo}
                    </div>
                </div>
            `;
            
            // Execute scripts in the fallback demo
            const scripts = contentDiv.querySelectorAll('script');
            scripts.forEach(script => {
                if (script.textContent) {
                    try {
                        eval(script.textContent);
                    } catch (e) {
                        console.error('Error executing fallback demo script:', e);
                    }
                }
            });
        }
    };
}