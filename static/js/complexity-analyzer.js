/**
 * Code Complexity Analyzer Module
 * 
 * This module provides an AI-powered code complexity analysis feature
 * that explains code complexity factors and provides suggestions for improvement.
 */

// Make functions accessible globally
window.analyzeCodeComplexity = analyzeCodeComplexity;
window.showComplexityAnalysis = showComplexityAnalysis;
window.closeComplexityAnalysis = closeComplexityAnalysis;

// Initialize the module on document load
document.addEventListener('DOMContentLoaded', () => {
    console.log('Code Complexity Analyzer module initialized');
    initializeComplexityAnalyzer();
});

/**
 * Initialize the complexity analyzer components
 */
function initializeComplexityAnalyzer() {
    // The container is now added in HTML, just find the analyze button and attach events
    const analyzeButton = document.getElementById('analyze-complexity-btn');
    
    if (analyzeButton) {
        // Add the click event listener to the button
        analyzeButton.addEventListener('click', () => {
            // Try to get code from different possible editor implementations
            let code = '';
            
            // Try Monaco editor
            if (window.editor && typeof window.editor.getValue === 'function') {
                code = window.editor.getValue();
            } 
            // Try CodeMirror
            else if (window.codeEditor && typeof window.codeEditor.getValue === 'function') {
                code = window.codeEditor.getValue();
            }
            // Try simple textarea
            else {
                const codeTextarea = document.getElementById('simple-code-editor');
                if (codeTextarea) {
                    code = codeTextarea.value || codeTextarea.textContent;
                }
            }
            
            // Get language
            const languageSelector = document.getElementById('language-selector');
            const language = languageSelector ? languageSelector.value : 'python';
            
            if (code && code.trim()) {
                analyzeCodeComplexity(code, language);
            } else {
                alert('Please write some code before analyzing complexity.');
            }
        });
        
        console.log('Complexity analyzer initialized and ready');
    } else {
        console.warn('Complexity analyzer button not found in the DOM');
    }
}

// The button is now included directly in the HTML template

/**
 * Analyze code complexity using the AI service
 * @param {string} code - The code to analyze
 * @param {string} language - The programming language
 */
async function analyzeCodeComplexity(code, language = 'python') {
    // Show loading state
    showLoadingAnalysis();
    
    try {
        // Call the API
        const response = await fetch('/api/analyze-complexity', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                code: code,
                language: language
            })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Complexity analysis result:', data);
        
        // Update the UI with the analysis
        showComplexityAnalysis(data);
    } catch (error) {
        console.error('Error analyzing code complexity:', error);
        showAnalysisError(error);
    }
}

/**
 * Show loading state while analysis is in progress
 */
function showLoadingAnalysis() {
    const container = document.querySelector('.complexity-analyzer-container');
    
    // Find or create the analyzer component
    let analyzer = container.querySelector('.complexity-analyzer');
    if (!analyzer) {
        // Structure should already exist in HTML, but just in case
        container.innerHTML = `
            <div class="complexity-analyzer">
                <div class="complexity-analyzer-header">
                    <h2>Code Complexity Analysis</h2>
                    <button class="complexity-analyzer-close" onclick="closeComplexityAnalysis()">&times;</button>
                </div>
                <div class="complexity-analyzer-body"></div>
            </div>
        `;
        analyzer = container.querySelector('.complexity-analyzer');
    }
    
    // Update the body content to show loading state
    const analyzerBody = analyzer.querySelector('.complexity-analyzer-body');
    if (analyzerBody) {
        analyzerBody.innerHTML = `
            <div class="analysis-loading">
                <div class="loading-spinner"></div>
                <p>Analyzing code complexity, please wait...</p>
            </div>
        `;
    }
    
    // Activate with a slight delay for animation
    setTimeout(() => {
        container.classList.add('active');
        analyzer.classList.add('active');
    }, 10);
}

/**
 * Show error state
 * @param {Error} error - The error that occurred
 */
function showAnalysisError(error) {
    const container = document.querySelector('.complexity-analyzer-container');
    
    container.querySelector('.complexity-analyzer-body').innerHTML = `
        <div class="analysis-error">
            <div class="error-icon">❌</div>
            <h3>Error Analyzing Code</h3>
            <p>Sorry, we couldn't analyze your code. Please try again later.</p>
            ${error ? `<div class="error-details">${error.message}</div>` : ''}
            <button class="btn btn-primary" onclick="closeComplexityAnalysis()">Close</button>
        </div>
    `;
}

/**
 * Display the complexity analysis results with enhanced visuals and interactions
 * @param {Object} analysis - The analysis results from the API
 */
function showComplexityAnalysis(analysis) {
    const container = document.querySelector('.complexity-analyzer-container');
    
    if (!analysis || analysis.status === 'error') {
        showAnalysisError(new Error(analysis?.message || 'Unknown error'));
        return;
    }
    
    // Generate complexity score visualization
    const scoreBarWidth = (analysis.complexity_score / 10) * 100;
    const scoreColorClass = getScoreColorClass(analysis.complexity_score);
    
    // Build HTML content for the analysis with enhanced visuals
    let content = `
        <div class="complexity-summary">
            <div class="complexity-score-container">
                <div class="score-circle ${scoreColorClass}">
                    <div class="score-number">${analysis.complexity_score}</div>
                    <div class="score-label">complexity</div>
                </div>
                <div class="score-details">
                    <h3>${getComplexityLabel(analysis.complexity_score)}</h3>
                    <div class="complexity-score-bar">
                        <div class="complexity-score-fill ${scoreColorClass}" style="width: ${scoreBarWidth}%"></div>
                    </div>
                    <p class="complexity-score-description">
                        This code is <span class="${scoreColorClass}">${getComplexityDescription(analysis.complexity_score)}</span>
                    </p>
                </div>
            </div>
        </div>
        
        <div class="complexity-tabs">
            <div class="tabs-header">
                <button class="tab-btn active" data-tab="explanation">Analysis</button>
                <button class="tab-btn" data-tab="suggestions">Suggestions</button>
                <button class="tab-btn" data-tab="concepts">Key Concepts</button>
                <button class="tab-btn" data-tab="visualization">Visual</button>
            </div>
            
            <div class="tabs-content">
                <div class="tab-pane active" id="explanation-tab">
                    <div class="complexity-explanation">
                        <h3>Why This Code is ${getComplexityLabel(analysis.complexity_score)}</h3>
                        <p>${analysis.explanation}</p>
                        
                        <h4>Complexity Factors</h4>
                        <ul class="factor-list">
                            ${analysis.complexity_factors.map(factor => 
                                `<li>
                                    <svg class="factor-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
                                    </svg>
                                    ${factor}
                                </li>`
                            ).join('')}
                        </ul>
                    </div>
                    
                    <div class="complexity-analogy">
                        <h4>Real-World Comparison</h4>
                        <div class="analogy-box">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" 
                                stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-globe">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="2" y1="12" x2="22" y2="12"></line>
                                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                            </svg>
                            <p>${analysis.real_world_comparison}</p>
                        </div>
                    </div>
                </div>
                
                <div class="tab-pane" id="suggestions-tab">
                    <div class="complexity-suggestions">
                        <h3>How to Simplify This Code</h3>
                        <p>Try these techniques to reduce complexity and make your code more maintainable:</p>
                        <ul class="suggestion-list">
                            ${analysis.simplification_suggestions.map((suggestion, index) => 
                                `<li>
                                    <div class="suggestion-number">${index + 1}</div>
                                    <div class="suggestion-content">${suggestion}</div>
                                </li>`
                            ).join('')}
                        </ul>
                        
                        <div class="tips-box">
                            <h4>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M9.663 17h4.673M12 3v1M3.343 7.343l.707.707M4 12H3M20.657 7.343l-.707.707M20 12h1M5.121 19.364l1.414-1.414M17.464 17.95l1.414 1.414M16 5l-4 4-4-4"></path>
                                </svg>
                                Pro Tips
                            </h4>
                            <p>Remember that simpler code is usually better code. Aim for readability and maintainability over cleverness.</p>
                        </div>
                    </div>
                </div>
                
                <div class="tab-pane" id="concepts-tab">
                    <div class="complexity-concepts">
                        <h3>Programming Concepts Used</h3>
                        <p>This code demonstrates the following concepts:</p>
                        <div class="concept-grid">
                            ${analysis.key_concepts && analysis.key_concepts.map(concept => 
                                `<div class="concept-card">
                                    <div class="concept-card-inner">
                                        <div class="concept-name">${concept}</div>
                                        <div class="concept-info">Click to learn more</div>
                                    </div>
                                </div>`
                            ).join('') || '<p>No specific concepts detected.</p>'}
                        </div>
                        
                        <div class="learning-resources">
                            <h4>Learning Resources</h4>
                            <p>Explore these concepts further to enhance your programming skills.</p>
                            <button class="resource-btn" onclick="showConceptResources()">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                </svg>
                                Show Resources
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="tab-pane" id="visualization-tab">
                    <div class="complexity-visualization">
                        <h3>Visual Complexity Breakdown</h3>
                        <div class="visualization-container">
                            <canvas id="complexity-chart" width="400" height="250"></canvas>
                        </div>
                        <div class="visualization-legend">
                            <div class="legend-item">
                                <div class="legend-color legend-structure"></div>
                                <div class="legend-label">Structure Complexity</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color legend-logic"></div>
                                <div class="legend-label">Logic Complexity</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color legend-naming"></div>
                                <div class="legend-label">Naming/Documentation</div>
                            </div>
                        </div>
                        <p class="visualization-note">This visual representation breaks down the different aspects of code complexity.</p>
                    </div>
                </div>
            </div>
        </div>
        
        <div class="analysis-actions">
            <button class="action-btn download-btn" onclick="downloadAnalysis()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
                Download Report
            </button>
            <button class="action-btn share-btn" onclick="shareAnalysis()">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="18" cy="5" r="3"></circle>
                    <circle cx="6" cy="12" r="3"></circle>
                    <circle cx="18" cy="19" r="3"></circle>
                    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Share
            </button>
        </div>
    `;
    
    // Update content
    container.querySelector('.complexity-analyzer-body').innerHTML = content;
    
    // Set up tab switching
    setupAnalysisTabs();
    
    // Create visualization chart
    setTimeout(() => {
        createComplexityChart(analysis);
    }, 100);
    
    // Add event listeners for the concept cards
    setupConceptCards();
}

/**
 * Set up the tabs in the complexity analyzer
 */
function setupAnalysisTabs() {
    // Find all tab buttons
    const tabButtons = document.querySelectorAll('.complexity-tabs .tab-btn');
    
    // Add click event listeners to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons and panes
            document.querySelectorAll('.complexity-tabs .tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            document.querySelectorAll('.complexity-tabs .tab-pane').forEach(pane => {
                pane.classList.remove('active');
            });
            
            // Add active class to clicked button
            button.classList.add('active');
            
            // Show the corresponding tab pane
            const tabId = button.getAttribute('data-tab');
            document.getElementById(`${tabId}-tab`).classList.add('active');
        });
    });
}

/**
 * Create a chart visualizing code complexity aspects
 * @param {Object} analysis - The analysis data
 */
function createComplexityChart(analysis) {
    const canvas = document.getElementById('complexity-chart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Mock data - in a real implementation, this would come from the analysis
    const structureComplexity = Math.min(10, Math.round(analysis.complexity_score * 1.2)) || 5;
    const logicComplexity = Math.min(10, Math.round(analysis.complexity_score * 0.9)) || 4;
    const namingComplexity = Math.min(10, Math.round(analysis.complexity_score * 0.7)) || 3;
    
    // Colors
    const structureColor = '#1DB954'; // Neon green
    const logicColor = '#BB9AF7';     // Purple
    const namingColor = '#7AA2F7';    // Blue
    
    // Draw the bar chart
    const barWidth = 80;
    const spacing = 60;
    const maxHeight = 180;
    const baseline = 220;
    
    // Draw structure complexity bar
    drawBar(ctx, canvas.width/2 - spacing - barWidth, baseline, barWidth, maxHeight, structureComplexity, 10, structureColor, 'Structure');
    
    // Draw logic complexity bar
    drawBar(ctx, canvas.width/2, baseline, barWidth, maxHeight, logicComplexity, 10, logicColor, 'Logic');
    
    // Draw naming complexity bar
    drawBar(ctx, canvas.width/2 + spacing + barWidth, baseline, barWidth, maxHeight, namingComplexity, 10, namingColor, 'Naming');
    
    // Draw title
    ctx.fillStyle = '#c0caf5';
    ctx.font = '16px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Code Complexity Breakdown', canvas.width/2, 30);
}

/**
 * Draw a single bar for the chart
 */
function drawBar(ctx, x, baseline, width, maxHeight, value, maxValue, color, label) {
    const height = (value / maxValue) * maxHeight;
    
    // Draw background bar
    ctx.fillStyle = 'rgba(65, 72, 104, 0.5)';
    ctx.fillRect(x, baseline - maxHeight, width, maxHeight);
    
    // Draw value bar
    ctx.fillStyle = color;
    ctx.fillRect(x, baseline - height, width, height);
    
    // Draw value text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(value, x + width/2, baseline - height - 10);
    
    // Draw label
    ctx.fillStyle = '#a9b1d6';
    ctx.font = '14px "Segoe UI", Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(label, x + width/2, baseline + 20);
}

/**
 * Set up interactive behavior for concept cards
 */
function setupConceptCards() {
    const conceptCards = document.querySelectorAll('.concept-card');
    
    conceptCards.forEach(card => {
        card.addEventListener('click', () => {
            // Toggle the active class
            conceptCards.forEach(c => c.classList.remove('active'));
            card.classList.add('active');
            
            // Get the concept name
            const conceptName = card.querySelector('.concept-name').textContent;
            
            // Show a dialog with information about the concept
            showConceptInfo(conceptName);
        });
    });
}

/**
 * Show information about a programming concept
 * @param {string} concept - The name of the concept
 */
function showConceptInfo(concept) {
    // In a real implementation, this would fetch concept information
    // For now, we'll just show an alert
    alert(`Information about ${concept} would be displayed here.`);
}

/**
 * Show learning resources for the detected concepts
 */
function showConceptResources() {
    // In a real implementation, this would show learning resources
    // For now, we'll just show an alert
    alert('Learning resources would be displayed here.');
}

/**
 * Download the analysis as a report
 */
function downloadAnalysis() {
    // In a real implementation, this would generate and download a report
    alert('Analysis report would be downloaded here.');
}

/**
 * Share the analysis
 */
function shareAnalysis() {
    // In a real implementation, this would share the analysis
    alert('Analysis would be shared here.');
}

/**
 * Get a more detailed description based on complexity score
 * @param {number} score - The complexity score (1-10)
 * @returns {string} Detailed description
 */
function getComplexityDescription(score) {
    if (score <= 2) return 'very straightforward and easy to understand';
    if (score <= 4) return 'relatively simple with clear patterns';
    if (score <= 6) return 'moderately complex with some challenging elements';
    if (score <= 8) return 'quite complex and would benefit from simplification';
    return 'highly complex and may be difficult to maintain';
}

/**
 * Close the complexity analyzer
 */
function closeComplexityAnalysis() {
    const container = document.querySelector('.complexity-analyzer-container');
    const analyzer = container.querySelector('.complexity-analyzer');
    
    // Animate closing
    analyzer.classList.remove('active');
    setTimeout(() => {
        container.classList.remove('active');
    }, 300);
}

/**
 * Get the color class based on complexity score
 * @param {number} score - The complexity score (1-10)
 * @returns {string} CSS class for the score color
 */
function getScoreColorClass(score) {
    if (score <= 3) return 'score-low';
    if (score <= 6) return 'score-medium';
    return 'score-high';
}

/**
 * Get a descriptive label for the complexity score
 * @param {number} score - The complexity score (1-10)
 * @returns {string} Descriptive label
 */
function getComplexityLabel(score) {
    if (score <= 2) return 'Very Simple';
    if (score <= 4) return 'Simple';
    if (score <= 6) return 'Moderate Complexity';
    if (score <= 8) return 'Complex';
    return 'Very Complex';
}