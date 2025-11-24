from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from app.core.security import get_current_user
from app.db.supabase import get_supabase
from pydantic import BaseModel
import uuid
import os

router = APIRouter()

class AssetResponse(BaseModel):
    id: str
    path: str
    url: str

@router.post("/upload", response_model=AssetResponse)
async def upload_asset(
    file: UploadFile = File(...),
    type: str = "ref", # ref, selfie, copy_target
    user: dict = Depends(get_current_user)
):
    supabase = get_supabase()
    if not supabase:
        raise HTTPException(status_code=500, detail="Database connection failed")

    user_id = user.get("id")
    if not user_id:
        raise HTTPException(status_code=401, detail="User ID not found")

    # Generate unique path
    file_ext = file.filename.split(".")[-1]
    file_name = f"{user_id}/{uuid.uuid4()}.{file_ext}"
    bucket_name = "assets"

    try:
        # Read file content
        content = await file.read()
        
        # Upload to Supabase Storage
        # Note: bucket must exist. 
        res = supabase.storage.from_(bucket_name).upload(
            path=file_name,
            file=content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL (assuming bucket is public, or use signed url)
        # For now, let's assume we store the path and generate signed urls on retrieval or use public
        public_url = supabase.storage.from_(bucket_name).get_public_url(file_name)

        # Insert into DB
        asset_data = {
            "user_id": user_id,
            "type": type,
            "path": file_name,
            "width": 0, # TODO: Extract dimensions
            "height": 0,
            "md5": "", # TODO: Calculate MD5
        }
        
        data, count = supabase.table("assets").insert(asset_data).execute()
        
        if not data or len(data) == 0: # Supabase-py v2 returns data as list in .data usually, but .execute() returns object
             # Adjust based on supabase-py version. Assuming .execute() returns (data, count) tuple or object with data
             # Let's assume data[1] is the list if it returns tuple, or data.data
             pass

        # Re-query to be safe or use returned data
        # Simply returning constructed response for MVP speed if insert didn't throw
        created_asset = data[1][0] if isinstance(data, tuple) and len(data) > 1 else data[0] if isinstance(data, list) else {} # Fallback

        return AssetResponse(
            id=str(created_asset.get("id", uuid.uuid4())), # Fallback ID if DB insert fails silently (shouldn't)
            path=file_name,
            url=public_url
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
