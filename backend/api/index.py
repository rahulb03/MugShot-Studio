import os
import sys

# Add the project root to sys.path to allow importing 'app' (the package) and 'main'
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

# Import the FastAPI application
from main import app

# Vercel expects 'app' or 'handler' to be available
handler = app
