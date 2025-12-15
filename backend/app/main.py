from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.core.config import settings
from app.api.v1.endpoints import projects, jobs, assets, auth, chat, profile
from datetime import datetime
import os

from app.core.logging import setup_logging

setup_logging()

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url=f"{settings.API_V1_STR}/docs",
    redoc_url=f"{settings.API_V1_STR}/redoc",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(origin) for origin in settings.BACKEND_CORS_ORIGINS],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(jobs.router, prefix=f"{settings.API_V1_STR}/jobs", tags=["jobs"])
app.include_router(assets.router, prefix=f"{settings.API_V1_STR}/assets", tags=["assets"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(profile.router, prefix=f"{settings.API_V1_STR}/profile", tags=["profile"])


def get_landing_page_html() -> str:
    """Load the landing page HTML from external file."""
    template_path = os.path.join(os.path.dirname(__file__), "templates", "landing_page.html")
    with open(template_path, "r", encoding="utf-8") as file:
        return file.read()


def get_health_page_html(status: str = "healthy") -> str:
    """Generate the health check page HTML."""
    is_healthy = status == "healthy"
    status_color = "#10b981" if is_healthy else "#ef4444"
    status_bg = "rgba(16, 185, 129, 0.15)" if is_healthy else "rgba(239, 68, 68, 0.15)"
    status_border = "rgba(16, 185, 129, 0.3)" if is_healthy else "rgba(239, 68, 68, 0.3)"
    status_text = "All Systems Operational" if is_healthy else "System Issues Detected"
    
    return f'''
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Health Check - {settings.PROJECT_NAME}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
    <style>
        * {{ margin: 0; padding: 0; box-sizing: border-box; }}
        
        body {{
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
        }}
        
        .container {{
            text-align: center;
            padding: 2rem;
            max-width: 600px;
        }}
        
        .health-icon {{
            width: 100px;
            height: 100px;
            margin: 0 auto 2rem;
            background: {status_bg};
            border: 2px solid {status_border};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: pulse 2s ease-in-out infinite;
        }}
        
        @keyframes pulse {{
            0%, 100% {{ box-shadow: 0 0 0 0 {status_border}; transform: scale(1); }}
            50% {{ box-shadow: 0 0 0 20px transparent; transform: scale(1.02); }}
        }}
        
        .health-icon svg {{
            width: 48px;
            height: 48px;
            stroke: {status_color};
        }}
        
        h1 {{
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
            color: #ffffff;
        }}
        
        .status-badge {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            background: {status_bg};
            border: 1px solid {status_border};
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            margin: 1.5rem 0;
            font-weight: 600;
            font-size: 1.1rem;
            color: {status_color};
        }}
        
        .status-dot {{
            width: 12px;
            height: 12px;
            background: {status_color};
            border-radius: 50%;
            animation: blink 1.5s ease-in-out infinite;
        }}
        
        @keyframes blink {{
            0%, 100% {{ opacity: 1; }}
            50% {{ opacity: 0.5; }}
        }}
        
        .metrics {{
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
            margin: 2rem 0;
        }}
        
        .metric {{
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.08);
            border-radius: 12px;
            padding: 1.25rem;
            backdrop-filter: blur(10px);
        }}
        
        .metric-label {{
            font-size: 0.75rem;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 0.5rem;
        }}
        
        .metric-value {{
            font-size: 1.5rem;
            font-weight: 700;
            color: #a5b4fc;
        }}
        
        .back-link {{
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            color: #a5b4fc;
            text-decoration: none;
            font-weight: 500;
            margin-top: 2rem;
            padding: 0.75rem 1.5rem;
            border-radius: 8px;
            transition: all 0.2s;
        }}
        
        .back-link:hover {{
            background: rgba(165, 180, 252, 0.1);
        }}
        
        .timestamp {{
            font-size: 0.875rem;
            color: #64748b;
            margin-top: 1.5rem;
        }}
    </style>
</head>
<body>
    <div class="container">
        <div class="health-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                {"<polyline points='20 6 9 17 4 12'></polyline>" if is_healthy else "<line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line>"}
            </svg>
        </div>
        
        <h1>Health Check</h1>
        
        <div class="status-badge">
            <span class="status-dot"></span>
            {status_text}
        </div>
        
        <div class="metrics">
            <div class="metric">
                <div class="metric-label">Status</div>
                <div class="metric-value" style="color: {status_color};">{status.upper()}</div>
            </div>
            <div class="metric">
                <div class="metric-label">API Version</div>
                <div class="metric-value">v1.0.0</div>
            </div>
            <div class="metric">
                <div class="metric-label">Environment</div>
                <div class="metric-value">Production</div>
            </div>
            <div class="metric">
                <div class="metric-label">Response</div>
                <div class="metric-value">&lt;50ms</div>
            </div>
        </div>
        
        <p class="timestamp">Last checked: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC</p>
        
        <a href="/" class="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="19" y1="12" x2="5" y2="12"></line>
                <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back to Home
        </a>
    </div>
</body>
</html>
'''


@app.get("/", response_class=HTMLResponse)
def read_root():
    """
    Root endpoint - Returns a beautiful landing page with API information and links.
    """
    return get_landing_page_html()


@app.get("/health", response_class=HTMLResponse)
def health_check():
    """
    Health check endpoint - Returns the current health status of the API.
    """
    return get_health_page_html("healthy")


@app.get("/api/health")
async def api_health_check():
    """
    JSON health check endpoint for programmatic access.
    Includes Redis connectivity status.
    """
    # Check Redis health
    redis_status = {"healthy": False, "provider": "upstash", "status": "not_configured"}
    try:
        from app.core.redis import check_redis_health
        redis_status = await check_redis_health()
    except Exception as e:
        redis_status = {"healthy": False, "error": str(e)}
    
    return {
        "status": "healthy",
        "version": "1.0.0",
        "service": settings.PROJECT_NAME,
        "timestamp": datetime.utcnow().isoformat(),
        "components": {
            "api": {"healthy": True},
            "redis": redis_status
        }
    }

