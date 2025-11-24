from fastapi import APIRouter, Depends, HTTPException
from app.core.security import get_current_user
from app.db.supabase import get_supabase
from app.utils.exceptions import handle_exception
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

router = APIRouter()

class ProjectCreate(BaseModel):
    mode: str  # design, copy
    platform: str
    width: int
    height: int
    headline: Optional[str] = None
    subtext: Optional[str] = None
    vibe: Optional[str] = None
    model_pref: Optional[str] = "nano_banana"  # Default to Nano Banana
    refs: Optional[List[str]] = []  # List of asset IDs
    copy_target: Optional[str] = None  # Asset ID

class ProjectUpdate(BaseModel):
    mode: Optional[str] = None
    platform: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    headline: Optional[str] = None
    subtext: Optional[str] = None
    vibe: Optional[str] = None
    model_pref: Optional[str] = None
    refs: Optional[List[str]] = None
    copy_target: Optional[str] = None

class ProjectResponse(BaseModel):
    id: str
    status: str
    mode: str
    platform: str
    width: int
    height: int

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project_in: ProjectCreate,
    user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    user_id = user.get("id")
    
    try:
        # Validate model preference
        available_models = ["nano_banana", "nano_banana_pro", "seedream", "gemini_flash", "gemini_pro", "fal_flux"]
        model_pref = project_in.model_pref or "nano_banana"
        if model_pref not in available_models:
            model_pref = "nano_banana"  # Default fallback
        
        # 1. Create Project
        project_data = {
            "user_id": user_id,
            "mode": project_in.mode,
            "platform": project_in.platform,
            "width": project_in.width,
            "height": project_in.height,
            "status": "draft"
        }
        
        res = supabase.table("projects").insert(project_data).execute()
        project = res.data[0]
        
        # 2. Save Prompt/Config
        prompt_data = {
            "project_id": project["id"],
            "raw": project_in.dict(),
            "model_pref": model_pref
        }
        supabase.table("prompts").insert(prompt_data).execute()
        
        return ProjectResponse(
            id=project["id"],
            status=project["status"],
            mode=project["mode"],
            platform=project["platform"],
            width=project["width"],
            height=project["height"]
        )
        
    except Exception as e:
        raise handle_exception(e)

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(project_id: str, user: dict = Depends(get_current_user)):
    supabase = get_supabase()
    try:
        res = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user["id"]).execute()
        if not res.data:
            raise HTTPException(status_code=404, detail="Project not found")
        project = res.data[0]
        
        return ProjectResponse(
            id=project["id"],
            status=project["status"],
            mode=project["mode"],
            platform=project["platform"],
            width=project["width"],
            height=project["height"]
        )
    except Exception as e:
        raise handle_exception(e)

@router.patch("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    try:
        # Verify project ownership
        proj_res = supabase.table("projects").select("*").eq("id", project_id).eq("user_id", user["id"]).execute()
        if not proj_res.data:
            raise HTTPException(status_code=404, detail="Project not found")
        
        # Update project data
        update_data = project_update.dict(exclude_unset=True)
        
        # Handle model preference update
        if "model_pref" in update_data:
            available_models = ["nano_banana", "nano_banana_pro", "seedream", "gemini_flash", "gemini_pro", "fal_flux"]
            if update_data["model_pref"] not in available_models:
                update_data["model_pref"] = "nano_banana"
        
        if update_data:  # Only update if there's data to update
            supabase.table("projects").update(update_data).eq("id", project_id).execute()
        
        # Update prompt data if needed
        if any(field in update_data for field in ["headline", "subtext", "vibe", "refs", "copy_target"]):
            # Get existing prompt
            prompt_res = supabase.table("prompts").select("*").eq("project_id", project_id).execute()
            if prompt_res.data:
                prompt_id = prompt_res.data[0]["id"]
                existing_raw = prompt_res.data[0]["raw"] or {}
                
                # Merge updates
                updated_raw = {**existing_raw, **update_data}
                
                # Update prompt
                supabase.table("prompts").update({
                    "raw": updated_raw
                }).eq("id", prompt_id).execute()
        
        # Return updated project
        res = supabase.table("projects").select("*").eq("id", project_id).execute()
        project = res.data[0]
        
        return ProjectResponse(
            id=project["id"],
            status=project["status"],
            mode=project["mode"],
            platform=project["platform"],
            width=project["width"],
            height=project["height"]
        )
        
    except Exception as e:
        raise handle_exception(e)