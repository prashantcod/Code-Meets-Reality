// Real-world Code component
export function RealWorldCode(root) {
    // Get the appropriate content div - now we need to look at the nested structure
    // Find the real-world section content first (new layout has realworld divided into sections)
    const realWorldSection = root.querySelector('.realworld-section');
    
    // If this is the new layout, find content in the section
    let contentDiv;
    if (realWorldSection) {
        contentDiv = realWorldSection.querySelector('.panel-content');
    } else {
        // Fallback to the direct content div (original layout)
        contentDiv = root.querySelector('.panel-content');
    }
    
    if (!contentDiv) return;
    
    // Initialize with empty state
    updateRealWorldContent(contentDiv, {
        title: 'Real-World Application',
        description: 'Type your code in the editor or run it to see its real-world application.',
        code: '// Real-world code example will appear here',
        language: 'python'
    });
    
    // Expose a global update function
    window.updateRealWorldCode = async function(code) {
        if (!code || code.length < 30) {
            // Not enough code to process
            return;
        }
        
        // Show loading state
        contentDiv.innerHTML = `
            <div class="realworld-code">
                <h3 class="realworld-title">Analyzing your code...</h3>
                <div class="loading-state">
                    <div class="loading-indicator"></div>
                    <p>Generating real-world application examples...</p>
                </div>
            </div>
        `;
        
        try {
            // Get the current language
            const language = document.getElementById('language-selector').value || 'python';
            const concept = document.getElementById('concept-selector').value || 'general';
            
            // Make the API request
            const response = await fetch('/api/realworld', {
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
            updateRealWorldContent(contentDiv, {
                title: data.title || 'Real-World Application',
                description: data.description || 'Here\'s how your code applies to real-world scenarios.',
                code: data.real_world_code || data.code || '// No real-world example available',
                language: language
            });
            
        } catch (error) {
            console.error('Error fetching real-world code:', error);
            
            // Show error state
            contentDiv.innerHTML = `
                <div class="realworld-code">
                    <h3 class="realworld-title">Error Loading Real-World Example</h3>
                    <p class="realworld-description error-message">${error.message}</p>
                    <div class="realworld-code-block">
                        <pre><code class="language-plaintext">Unable to generate real-world example. Please try again.</code></pre>
                    </div>
                </div>
            `;
            
            // Apply syntax highlighting
            if (window.hljs) {
                contentDiv.querySelectorAll('pre code').forEach((block) => {
                    hljs.highlightElement(block);
                });
            }
        }
    };
    
    // Set up a listener to the editor to automatically update real-world examples
    // This is handled in app.js via debouncing for better performance
}

// Helper function to update real-world content
function updateRealWorldContent(contentDiv, data) {
    contentDiv.innerHTML = `
        <div class="realworld-code">
            <h3 class="realworld-title">${data.title}</h3>
            <p class="realworld-description">${data.description}</p>
            <div class="realworld-code-block">
                <pre><code class="language-${data.language}">${data.code}</code></pre>
            </div>
        </div>
    `;
    
    // Apply syntax highlighting
    if (window.hljs) {
        contentDiv.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }
}