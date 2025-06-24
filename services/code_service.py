import sys
import io
import contextlib

def run_code(code):
    output = ""
    try:
        with contextlib.redirect_stdout(io.StringIO()) as f:
            exec(code, {})
        output = f.getvalue()
    except Exception as e:
        output = str(e)
    return {"output": output}