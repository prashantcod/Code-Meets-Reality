// Global editor variable
let editor;

// Initialize Monaco Editor
function initializeEditor() {
    // Configure the Monaco Editor loader
    require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs' }});
    window.MonacoEnvironment = {
        getWorkerUrl: function(workerId, label) {
            return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
                self.MonacoEnvironment = {
                    baseUrl: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/'
                };
                importScripts('https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.36.1/min/vs/base/worker/workerMain.js');
            `)}`;
        }
    };

    // Load and initialize the editor
    require(['vs/editor/editor.main'], function() {
        editor = monaco.editor.create(document.getElementById('code-editor'), {
            value: '# Write your Python code here\n\ndef greet(name):\n    return f"Hello, {name}!"\n\nprint(greet("World"))',
            language: 'python',
            theme: 'vs',
            automaticLayout: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            folding: true,
            lineNumbers: 'on',
            renderIndentGuides: true,
            tabSize: 4,
            scrollbar: {
                vertical: 'auto',
                horizontal: 'auto'
            }
        });

        // Resize editor on window resize
        window.addEventListener('resize', () => {
            if (editor) {
                editor.layout();
            }
        });
    });
}

// Update editor content
function updateCodeEditor(code) {
    if (editor) {
        editor.setValue(code);
    }
}

// Update editor language
function updateEditorLanguage(language) {
    if (editor) {
        monaco.editor.setModelLanguage(editor.getModel(), language);
    }
}

// Call editor initialization when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeEditor);
