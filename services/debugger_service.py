import logging
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    filename='debugger.log',
    filemode='a'
)

logger = logging.getLogger('debugger')

def log_event(event: Dict[str, Any]) -> None:
    """
    Log a debugging event to the server log.
    
    Args:
        event: The event data to log
    """
    try:
        event_type = event.get('type', 'unknown')
        event_data = event.get('data', {})
        event_context = event.get('context', {})
        
        # Log the event based on its type
        if event_type == 'error':
            logger.error(f"CLIENT ERROR: {event_data.get('message')} | Context: {event_context}")
        elif event_type == 'warning':
            logger.warning(f"CLIENT WARNING: {event_data.get('message')} | Context: {event_context}")
        elif event_type == 'info':
            logger.info(f"CLIENT INFO: {event_data.get('message')} | Context: {event_context}")
        elif event_type == 'code_execution':
            logger.info(f"CODE EXECUTION: {event_data}")
        else:
            logger.info(f"EVENT: {event_type} | Data: {event_data} | Context: {event_context}")
    except Exception as e:
        logger.error(f"Error logging event: {str(e)}")
