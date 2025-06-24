import subprocess
import tempfile
import os
import traceback
from typing import Dict, Any, Tuple, List, Optional

def execute_python_code(code: str) -> Dict[str, Any]:
    """
    Execute Python code in a safe environment with improved error reporting.
    
    Args:
        code (str): Python code to execute
        
    Returns:
        Dict[str, Any]: Dictionary containing execution results with detailed error information
    """
    # First check for syntax errors before execution
    try:
        compile(code, '<string>', 'exec')
    except SyntaxError as e:
        # Extract error details
        line_num = e.lineno if hasattr(e, 'lineno') else 0
        col_num = e.offset if hasattr(e, 'offset') else 0
        error_msg = str(e)
        error_type = "SyntaxError"
        
        # Format error with line highlighting
        error_details = format_python_error(code, error_type, error_msg, line_num, col_num, "syntax")
        
        return {
            "output": "",
            "error": error_details,
            "success": False,
            "error_type": "syntax",
            "line_number": line_num,
            "column": col_num
        }
    
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix=".py", delete=False) as temp_file:
            # Add line numbering debug helper to help locate errors
            debug_code = """import sys, traceback
def excepthook(exc_type, exc_value, exc_traceback):
    tb_lines = traceback.format_exception(exc_type, exc_value, exc_traceback)
    print('---- ERROR TRACEBACK ----', file=sys.stderr)
    for line in tb_lines:
        print(line, end='', file=sys.stderr)
    print('----- END TRACEBACK -----', file=sys.stderr)
sys.excepthook = excepthook

""" + code
            
            temp_file.write(debug_code.encode('utf-8'))
            temp_file_path = temp_file.name
        
        # Execute the code with restrictions
        process = subprocess.Popen(
            ["python", temp_file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            env=os.environ.copy()
        )
        
        # Get output with timeout
        stdout, stderr = process.communicate(timeout=5)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        if process.returncode != 0 and stderr:
            # Parse the error message to extract line number
            error_type, error_msg, line_num, col_num = parse_python_error(stderr, len(debug_code.split('\n')) - 1)
            error_details = format_python_error(code, error_type, error_msg, line_num, col_num, "runtime")
            
            return {
                "output": stdout,
                "error": error_details,
                "success": False,
                "error_type": "runtime",
                "line_number": line_num,
                "raw_error": stderr
            }
        
        # Format successful output with line numbers
        formatted_output = ""
        if stdout:
            formatted_output = format_output(stdout)
        
        return {
            "output": formatted_output,
            "error": stderr,
            "success": process.returncode == 0
        }
    except subprocess.TimeoutExpired:
        # Make sure process exists before trying to kill it
        if 'process' in locals():
            process.kill()
        return {
            "output": "",
            "error": "<div class='error-timeout'>Execution timed out (5 seconds). Your code might have an infinite loop.</div>",
            "success": False,
            "error_type": "timeout"
        }
    except Exception as e:
        return {
            "output": "",
            "error": f"<div class='execution-error'>Execution error: {str(e)}</div><div class='error-traceback'>{traceback.format_exc()}</div>",
            "success": False,
            "error_type": "system"
        }

def execute_javascript_code(code: str) -> Dict[str, Any]:
    """
    Execute JavaScript code using Node.js.
    
    Args:
        code (str): JavaScript code to execute
        
    Returns:
        Dict[str, Any]: Dictionary containing execution results
    """
    try:
        # Create a temporary file
        with tempfile.NamedTemporaryFile(suffix=".js", delete=False) as temp_file:
            temp_file.write(code.encode('utf-8'))
            temp_file_path = temp_file.name
        
        # Execute with Node.js
        process = subprocess.Popen(
            ["node", temp_file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        # Get output with timeout
        stdout, stderr = process.communicate(timeout=5)
        
        # Clean up temporary file
        os.unlink(temp_file_path)
        
        return {
            "output": stdout,
            "error": stderr,
            "success": process.returncode == 0
        }
    except subprocess.TimeoutExpired:
        # Make sure process exists before trying to kill it
        if 'process' in locals():
            process.kill()
        return {
            "output": "",
            "error": "<div class='error-timeout'>Execution timed out (5 seconds). Your code might have an infinite loop.</div>",
            "success": False,
            "error_type": "timeout"
        }
    except Exception as e:
        return {
            "output": "",
            "error": f"Execution error: {str(e)}\n{traceback.format_exc()}",
            "success": False
        }

def format_output(output: str) -> str:
    """
    Format output with line numbers for better readability.
    
    Args:
        output (str): Raw output from code execution
        
    Returns:
        str: Formatted output with line numbers
    """
    formatted_lines = []
    lines = output.strip().split('\n')
    
    for i, line in enumerate(lines):
        # Skip empty lines at the end
        if i == len(lines) - 1 and not line.strip():
            continue
        formatted_lines.append(f"<div class='output-line'>{line}</div>")
    
    if not formatted_lines:
        return "<div class='output-empty'>No output</div>"
    
    return "<div class='output-stdout'>" + ''.join(formatted_lines) + "</div>"

def parse_python_error(stderr: str, debug_line_offset: int) -> Tuple[str, str, int, int]:  # type: ignore
    """
    Parse Python error messages to extract error details.
    
    Args:
        stderr (str): Error output from Python interpreter
        debug_line_offset (int): Number of debug lines added to the code
        
    Returns:
        Tuple[str, str, int, int]: Error type, message, line number, column number
    """
    # Default values
    error_type = "Error"
    error_msg = stderr
    line_num = 0
    col_num = 0
    
    try:
        if "---- ERROR TRACEBACK ----" in stderr:
            # Find the exception type and message
            traceback_section = stderr.split("---- ERROR TRACEBACK ----")[1].split("----- END TRACEBACK -----")[0]
            last_line = traceback_section.strip().split('\n')[-1]
            
            if ':' in last_line:
                error_parts = last_line.split(':', 1)
                error_type = error_parts[0].strip()
                error_msg = error_parts[1].strip() if len(error_parts) > 1 else ""
            
            # Find the line number
            for line in traceback_section.split('\n'):
                if "File " in line and ", line " in line:
                    try:
                        line_parts = line.split(", line ")
                        line_num_str = line_parts[1].split(',')[0].strip()
                        raw_line_num = int(line_num_str)
                        
                        # Adjust for debug code lines added at the beginning
                        if raw_line_num > debug_line_offset:
                            line_num = raw_line_num - debug_line_offset
                        break
                    except (ValueError, IndexError):
                        pass
        else:
            # Simple error parsing for direct error messages
            if "line " in stderr:
                try:
                    line_start = stderr.find("line ") + 5
                    line_end = stderr.find("\n", line_start)
                    if line_end == -1:
                        line_end = len(stderr)
                    line_str = stderr[line_start:line_end].split()[0].rstrip(',')
                    raw_line_num = int(line_str)
                    
                    # Adjust for debug code lines added at the beginning
                    if raw_line_num > debug_line_offset:
                        line_num = raw_line_num - debug_line_offset
                except (ValueError, IndexError):
                    pass
            
            # Extract error type
            if ":" in stderr:
                first_line = stderr.strip().split('\n')[0]
                error_parts = first_line.split(':', 1)
                error_type = error_parts[0].strip().split()[-1]  # Get the last word which should be the error type
                error_msg = error_parts[1].strip() if len(error_parts) > 1 else ""
    
    except Exception as e:
        # If parsing fails, return default values
        print(f"Error parsing error message: {e}")
    
    return error_type, error_msg, line_num, col_num

def format_python_error(code: str, error_type: str, error_msg: str, line_num: int, col_num: int, error_category: str) -> str:  # type: ignore
    """
    Format Python error messages with line highlighting for better readability.
    
    Args:
        code (str): Original code
        error_type (str): Type of error (e.g., SyntaxError, TypeError)
        error_msg (str): Error message
        line_num (int): Line number where error occurred
        col_num (int): Column number where error occurred
        error_category (str): Category of error (syntax or runtime)
        
    Returns:
        str: Formatted HTML error message with line highlighting
    """
    result = f"<div class='error-header'><span class='error-type'>{error_type}</span>: {error_msg}</div>"
    
    if line_num > 0:
        code_lines = code.split('\n')
        if 0 <= line_num-1 < len(code_lines):
            # Determine the range of lines to show for context
            start_line = max(0, line_num - 3)
            end_line = min(len(code_lines), line_num + 2)
            context_lines = []
            
            # Add line numbers and highlight the error line
            for i in range(start_line, end_line):
                line = code_lines[i]
                line_class = 'error-line' if i == line_num-1 else ''
                line_num_display = str(i+1).rjust(3)
                context_lines.append(f"<pre class='{line_class}'><span class='line-number'>{line_num_display}</span> {html_escape(line)}</pre>")
                
                # Add caret indicator for syntax errors if column is known
                if i == line_num-1 and col_num > 0 and error_category == 'syntax':
                    # Highlight the exact position of the error
                    error_pos = min(col_num - 1, len(line))  # Ensure we don't go beyond line length
                    caret_spacing = ' ' * error_pos
                    context_lines.append(f"<pre class='error-indicator'><span class='line-number'>   </span> {caret_spacing}^</pre>")
            
            result += f"<div class='code-context'>{''.join(context_lines)}</div>"
    
    if error_category == 'runtime':
        result += f"<div class='error-explanation'>This is a {error_category} error. Your code syntax is valid, but there was a problem during execution.</div>"
    else:
        result += f"<div class='error-explanation'>This is a {error_category} error. You need to fix the syntax before the code can run.</div>"
    
    return result

def html_escape(text: str) -> str:
    """
    Escape HTML special characters in text.
    
    Args:
        text (str): Text to escape
        
    Returns:
        str: Escaped text safe for HTML insertion
    """
    return (text
        .replace("&", "&amp;")
        .replace("<", "&lt;")
        .replace(">", "&gt;")
        .replace('"', "&quot;")
        .replace("'", "&#39;")
    )
    
def execute_java_code(code: str) -> Dict[str, Any]:
    """
    Execute Java code.
    
    Args:
        code (str): Java code to execute
        
    Returns:
        Dict[str, Any]: Dictionary containing execution results
    """
    # Extract class name from the code
    class_name = "Main"  # Default class name
    lines = code.split('\n')
    for line in lines:
        if "class " in line and "{" in line:
            parts = line.split("class ")[1].split("{")[0].strip()
            class_name = parts.split()[0]
            break
    
    try:
        # Create a temporary directory
        temp_dir = tempfile.mkdtemp()
        java_file_path = os.path.join(temp_dir, f"{class_name}.java")
        
        # Write the Java code to a file
        with open(java_file_path, 'w') as java_file:
            java_file.write(code)
        
        # Compile the Java code
        compile_process = subprocess.Popen(
            ["javac", java_file_path],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        _, compile_stderr = compile_process.communicate(timeout=5)
        
        if compile_process.returncode != 0:
            return {
                "output": "",
                "error": f"Compilation error: {compile_stderr}",
                "success": False
            }
        
        # Run the Java program
        run_process = subprocess.Popen(
            ["java", "-cp", temp_dir, class_name],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        
        run_stdout, run_stderr = run_process.communicate(timeout=5)
        
        return {
            "output": run_stdout,
            "error": run_stderr,
            "success": run_process.returncode == 0
        }
    except subprocess.TimeoutExpired:
        # Make sure processes are properly cleaned up if they exist
        if 'compile_process' in locals() and compile_process is not None:
            compile_process.kill()
        if 'run_process' in locals() and run_process is not None:
            run_process.kill()
        return {
            "output": "",
            "error": "<div class='error-timeout'>Execution timed out (5 seconds). Your code might have an infinite loop.</div>",
            "success": False,
            "error_type": "timeout"
        }
    except Exception as e:
        return {
            "output": "",
            "error": f"Execution error: {str(e)}\n{traceback.format_exc()}",
            "success": False
        }