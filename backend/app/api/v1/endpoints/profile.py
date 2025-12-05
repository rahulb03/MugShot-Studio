from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, status
from pydantic import BaseModel, Field
from typing import Optional
from datetime import date
from app.core.security import get_current_user
from app.db.supabase import get_supabase
import uuid

router = APIRouter()

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    username: Optional[str] = Field(None, min_length=3, max_length=30, pattern="^[a-zA-Z0-9._-]+$")
    dob: Optional[date] = None

class ProfileResponse(BaseModel):
    id: str
    email: str
    username: str
    full_name: Optional[str]
    dob: Optional[date]
    profile_photo_url: Optional[str]
    plan: str
    credits: int
    created_at: str

@router.get("/", response_model=ProfileResponse)
async def get_profile(user: dict = Depends(get_current_user)):
    """
    Retrieve the authenticated user's profile information.
    """
    supabase = get_supabase()
    
    # Fetch latest user data to ensure we have up-to-date info
    response = supabase.table("users").select("*").eq("id", user["id"]).execute()
    if not response.data:
        raise HTTPException(status_code=404, detail="User not found")
        
    user_data = response.data[0]
    
    # Get profile photo URL if exists
    profile_photo_url = None
    if user_data.get("profile_photo_asset_id"):
        asset_res = supabase.table("assets").select("storage_path").eq("id", user_data["profile_photo_asset_id"]).execute()
        if asset_res.data:
            path = asset_res.data[0]["storage_path"]
            # Generate signed URL or public URL depending on bucket config
            # Assuming public bucket for profile photos for now, or use create_signed_url
            # For now, let's assume we return the public URL if bucket is public
            # Or generate a signed URL valid for 1 hour
            try:
                profile_photo_url = supabase.storage.from_("profile_photos").get_public_url(path)
            except:
                pass

    return {
        "id": user_data["id"],
        "email": user_data["email"],
        "username": user_data["username"],
        "full_name": user_data.get("full_name"),
        "dob": user_data.get("dob"),
        "profile_photo_url": profile_photo_url,
        "plan": user_data.get("plan", "free"),
        "credits": user_data.get("credits", 0),
        "created_at": user_data["created_at"]
    }

@router.put("/", response_model=ProfileResponse)
async def update_profile(
    profile_update: ProfileUpdate,
    user: dict = Depends(get_current_user)
):
    """
    Update the authenticated user's profile information.
    """
    supabase = get_supabase()
    
    update_data = profile_update.dict(exclude_unset=True)
    
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")
        
    # Check username uniqueness if changing
    if "username" in update_data and update_data["username"] != user["username"]:
        check = supabase.table("users").select("id").eq("username", update_data["username"]).neq("id", user["id"]).execute()
        if check.data:
            raise HTTPException(status_code=409, detail="Username already taken")
            
    if "dob" in update_data:
        update_data["dob"] = update_data["dob"].isoformat()

    try:
        response = supabase.table("users").update(update_data).eq("id", user["id"]).execute()
        updated_user = response.data[0]
        
        # Re-fetch to get formatted response similar to GET
        return await get_profile(user=updated_user)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_profile(user: dict = Depends(get_current_user)):
    """
    Delete the authenticated user's account.
    """
    supabase = get_supabase()
    
    try:
        # We might want to soft delete or just delete. 
        # Given requirements say "Delete", we'll attempt hard delete.
        # Note: This might fail if there are foreign key constraints without cascade.
        # Ideally, we should clean up assets first or rely on DB cascade.
        
        supabase.table("users").delete().eq("id", user["id"]).execute()
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete account: {str(e)}")

@router.post("/avatar")
async def upload_avatar(
    file: UploadFile = File(...),
    user: dict = Depends(get_current_user)
):
    """
    Upload a profile picture image for the user.
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/gif"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only JPEG, PNG, and GIF allowed.")
        
    # Validate file size (approximate, read chunks or check header if possible, but for now read content)
    # 5MB limit
    MAX_SIZE = 5 * 1024 * 1024
    content = await file.read()
    
    if len(content) > MAX_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 5MB limit.")
        
    supabase = get_supabase()
    file_ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    file_path = f"{user['id']}/avatar_{uuid.uuid4()}.{file_ext}"
    
    try:
        # Upload to Supabase Storage
        supabase.storage.from_("profile_photos").upload(
            path=file_path,
            file=content,
            file_options={"content-type": file.content_type}
        )
        
        # Create Asset Record
        asset_data = {
            "user_id": user["id"],
            "type": "profile_photo",
            "storage_path": file_path,
            "width": 0, # We could use PIL to get dimensions if needed
            "height": 0,
            "md5": "" # Calculate if needed
        }
        
        asset_res = supabase.table("assets").insert(asset_data).execute()
        asset_id = asset_res.data[0]["id"]
        
        # Update User Profile
        supabase.table("users").update({"profile_photo_asset_id": asset_id}).eq("id", user["id"]).execute()
        
        return {"message": "Avatar uploaded successfully", "url": supabase.storage.from_("profile_photos").get_public_url(file_path)}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/avatar")
async def delete_avatar(user: dict = Depends(get_current_user)):
    """
    Remove the user's profile picture.
    """
    supabase = get_supabase()
    
    if not user.get("profile_photo_asset_id"):
        raise HTTPException(status_code=404, detail="No avatar to delete")
        
    try:
        # Get asset to find path
        asset_res = supabase.table("assets").select("*").eq("id", user["profile_photo_asset_id"]).execute()
        if asset_res.data:
            path = asset_res.data[0]["storage_path"]
            
            # Remove from storage
            supabase.storage.from_("profile_photos").remove([path])
            
            # Remove asset record (optional, or keep for history)
            supabase.table("assets").delete().eq("id", user["profile_photo_asset_id"]).execute()
            
        # Update user
        supabase.table("users").update({"profile_photo_asset_id": None}).eq("id", user["id"]).execute()
        
        return {"message": "Avatar removed successfully"}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
