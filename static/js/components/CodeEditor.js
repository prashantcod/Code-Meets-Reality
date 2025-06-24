// Code Editor component
export function CodeEditor(root) {
    console.log('Initializing CodeEditor component');
    
    // Create the code editor container
    const editorContainer = root.querySelector('.panel-content');
    if (!editorContainer) {
        console.error('Editor container not found');
        return;
    }
    
    // Create a simple textarea editor that will definitely work
    editorContainer.innerHTML = `
        <div class="code-editor">
            <textarea id="code-textarea" class="code-textarea" spellcheck="false" 
                placeholder="Write your code here..."
                style="width: 100%; height: 100%; padding: 10px; font-family: monospace; 
                       font-size: 14px; line-height: 1.5; border: none; resize: none; 
                       background-color: #0f172a; color: #e2e8f0;">#Write your Python code here

def greeting(name):
    """Returns a greeting message"""
    return f"Hello, {name}!"

# Test the function
result = greeting("World")
print(result)</textarea>
        </div>
    `;
    
    const textarea = document.getElementById('code-textarea');
    
    // Create a simple editor interface that's guaranteed to work
    window.editor = {
        getValue: function() {
            return textarea.value;
        },
        setValue: function(value) {
            textarea.value = value;
        },
        focus: function() {
            textarea.focus();
        },
        lineCount: function() {
            return textarea.value.split('\n').length;
        },
        getLine: function(line) {
            return textarea.value.split('\n')[line] || '';
        },
        setCursor: function() {
            // Position cursor at the end
            textarea.selectionStart = textarea.value.length;
            textarea.selectionEnd = textarea.value.length;
        }
    };
    
    // Focus the textarea and make sure it's visible
    setTimeout(() => {
        textarea.focus();
        console.log('Focusing textarea');
        
        // Handle tab key for indentation
        textarea.addEventListener('keydown', function(e) {
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
        
        // Simple auto-indentation for Enter key
        textarea.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const start = this.selectionStart;
                const lineStart = this.value.lastIndexOf('\n', start - 1) + 1;
                const currentLine = this.value.substring(lineStart, start);
                const indent = currentLine.match(/^\s*/)[0]; // Get leading whitespace
                
                // Handle auto-indentation for blocks (lines ending with colon)
                if (currentLine.trim().endsWith(':')) {
                    e.preventDefault();
                    const insertion = '\n' + indent + '    '; // Add 4 more spaces for new block
                    this.value = this.value.substring(0, start) + insertion + this.value.substring(start);
                    this.selectionStart = this.selectionEnd = start + insertion.length;
                } else if (indent.length > 0) {
                    // Just maintain the current indentation level
                    e.preventDefault();
                    const insertion = '\n' + indent;
                    this.value = this.value.substring(0, start) + insertion + this.value.substring(start);
                    this.selectionStart = this.selectionEnd = start + insertion.length;
                }
            }
        });
        
        // Setup change handler for automatic updating of real-world examples
        textarea.addEventListener('input', function() {
            // Debounce the updates
            if (window.codeChangeTimer) {
                clearTimeout(window.codeChangeTimer);
            }
            
            window.codeChangeTimer = setTimeout(function() {
                const code = textarea.value;
                if (code && code.length > 50) {
                    // Update real-world examples if there's substantive code
                    try {
                        updateRealTimeExamples(code, 'python', 'general');
                    } catch (e) {
                        console.error('Error updating real-time examples:', e);
                    }
                }
            }, 1000); // 1 second delay
        });
    }, 200);
    
    // Function to update real-time examples
    async function updateRealTimeExamples(code, language, concept) {
        try {
            // Get real-world mapping from API
            const response = await fetch('/api/realworld', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch real-world mapping');
            }
            
            const data = await response.json();
            
            // Update the real-world code panel
            const realWorldCode = document.querySelector('.realworld-code');
            if (realWorldCode) {
                realWorldCode.innerHTML = `
                    <h3 class="realworld-title">${data.title || 'Real-World Example'}</h3>
                    <p class="realworld-description">${data.description || 'How this code appears in professional applications.'}</p>
                    <div class="realworld-code-block">
                        <pre><code class="language-${language}">${data.real_world_code || '// No real-world example available yet'}</code></pre>
                    </div>
                `;
                
                // Apply syntax highlighting
                if (window.hljs) {
                    document.querySelectorAll('pre code').forEach((block) => {
                        hljs.highlightBlock(block);
                    });
                }
            }
            
            // Also update interactive demo if available
            updateGUIDemoRealTime(code, language, concept);
        } catch (error) {
            console.error('Error updating real-time examples:', error);
        }
    }
    
    // Function to update GUI demo
    async function updateGUIDemoRealTime(code, language, concept) {
        try {
            // Get interactive demo from API
            const response = await fetch('/api/realworld/demo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ code })
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch interactive demo');
            }
            
            const data = await response.json();
            
            // Update the GUI Demo section in the right panel
            const guiDemoRoot = document.getElementById('gui-demo-root');
            if (guiDemoRoot) {
                const guiDemoContent = guiDemoRoot.querySelector('.panel-content');
                if (guiDemoContent) {
                    guiDemoContent.innerHTML = data.demo_html || '<div class="empty-state">No GUI demo available for this code.</div>';
                }
            }
        } catch (error) {
            console.error('Error updating GUI demo:', error);
        }
    }
}