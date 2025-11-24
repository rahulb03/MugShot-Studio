# Thumbnail Factory Backend

## Overview

This is the backend implementation for the Thumbnail Factory, a production-grade thumbnail generation system that integrates multiple AI image generation models including Google's Gemini (Nano Banana), ByteDance's Seedream, and FLUX.1.

## Features

- **Multi-Model Support**: Integrates Nano Banana, Seedream 4.0, and FLUX.1
- **Credit System**: Comprehensive credit management with audit trail
- **Modular Architecture**: Clean separation of concerns with reusable components
- **Robust Error Handling**: Consistent error handling across all services
- **Proper Logging**: Structured logging for monitoring and debugging
- **Supabase Integration**: Full database and storage integration

## Architecture

```
backend/
├── app/
│   ├── api/              # API endpoints
│   ├── core/             # Core configuration and security
│   ├── db/               # Database schema and Supabase integration
│   ├── services/         # Model-specific services
│   ├── utils/            # Utility functions
│   ├── worker.py         # Background job processing
│   └── main.py           # Application entry point
├── requirements.txt      # Python dependencies
└── .env.example          # Environment variable examples
```

## Models

### Nano Banana (Default)

Google's Gemini models used as the default generation engine:
- **Nano Banana**: Fast, cost-effective generation
- **Nano Banana Pro**: Higher quality with advanced features

### Seedream 4.0

ByteDance's model optimized for identity preservation and style consistency.

### FLUX.1

Open-weight model via Fal.ai, good for template-style edits and layout-aware changes.

## Installation

1. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment variables**:
   Copy `.env.example` to `.env` and fill in your credentials:
   ```bash
   cp .env.example .env
   ```

3. **Start the server**:
   ```bash
   uvicorn app.main:app --reload
   ```

## API Endpoints

### Projects
- `POST /api/v1/projects/` - Create a new project
- `GET /api/v1/projects/{id}` - Get project details
- `PATCH /api/v1/projects/{id}` - Update project

### Jobs
- `POST /api/v1/jobs/` - Create and queue a generation job
- `GET /api/v1/jobs/{id}` - Get job status
- `GET /api/v1/jobs/{id}/models` - Get available models

### Assets
- `POST /api/v1/assets/upload` - Upload reference images

## Credit System

The system implements a comprehensive credit system:
- **Draft (512-768px)**: 1 credit
- **Standard (1080p)**: 2 credits
- **4K**: 4 credits

Additional surcharges apply for:
- Copy mode: +1 credit
- Premium models: +1-2 credits

See [CREDIT_SYSTEM.md](../docs/CREDIT_SYSTEM.md) for detailed information.

## Development

### Code Structure

- **Services**: Model-specific implementations in `app/services/`
- **Utilities**: Reusable components in `app/utils/`
- **Error Handling**: Centralized exception handling
- **Logging**: Structured logging throughout

### Adding New Models

1. Create a new service in `app/services/`
2. Implement the required methods
3. Add model to the worker routing logic
4. Update documentation

## Environment Variables

```env
PROJECT_NAME="Thumbnail Factory"
API_V1_STR="/api/v1"

# Supabase
SUPABASE_URL="https://your-project.supabase.co"
SUPABASE_KEY="your-anon-key"

# Gemini
GEMINI_API_KEY="your-gemini-api-key"

# ByteDance/Seedream
BYTEDANCE_API_KEY="your-bytedance-api-key"

# Fal.ai
FAL_KEY="your-fal-api-key"

# Redis/Celery
REDIS_URL="redis://localhost:6379/0"
```

## Documentation

- [Credit System](../docs/CREDIT_SYSTEM.md)
- [Model Integration](../docs/MODEL_INTEGRATION.md)
- [Database Schema](app/db/schema.sql)