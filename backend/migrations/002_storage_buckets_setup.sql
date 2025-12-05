-- Up Migration

-- Create storage buckets for MugShot Studio
-- These commands should be run in the Supabase SQL Editor

-- Note: Bucket creation in Supabase is typically done via the dashboard or CLI
-- This file documents the required buckets and provides policy setup

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE IF EXISTS storage.objects ENABLE ROW LEVEL SECURITY;

-- Create indexes to help policy performance
CREATE INDEX IF NOT EXISTS idx_storage_objects_bucket_id ON storage.objects(bucket_id);
CREATE INDEX IF NOT EXISTS idx_storage_objects_name ON storage.objects(name);

-- Define the buckets (Note: In Supabase, buckets are typically created via dashboard/CLI)
-- This is documentation of what buckets are needed:
-- 1. profile_photos - for user profile pictures (public read, owner write)
-- 2. user_assets - for general user assets (private read/write for owners)
-- 3. renders - for generated thumbnail images (public read, backend write only)

-- Storage policies for MugShot Studio

-- Public read access for profile photos
CREATE POLICY "Public read access to profile photos" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'profile_photos');

-- Public read access for renders
CREATE POLICY "Public read access to renders" 
ON storage.objects FOR SELECT 
TO anon 
USING (bucket_id = 'renders');

-- Authenticated users can insert their own profile photos
-- Assumes file path structure: {user_id}/avatar_{uuid}.{ext}
CREATE POLICY "Authenticated users can insert profile photos" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
    bucket_id = 'profile_photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can update their own profile photos
CREATE POLICY "Authenticated users can update profile photos" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
    bucket_id = 'profile_photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'profile_photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can delete their own profile photos
CREATE POLICY "Authenticated users can delete profile photos" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
    bucket_id = 'profile_photos' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can insert their own user assets
-- Assumes file path structure: {user_id}/{asset_type}/{uuid}_{timestamp}.{ext}
CREATE POLICY "Authenticated users can insert user assets" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (
    bucket_id = 'user_assets' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can update their own user assets
CREATE POLICY "Authenticated users can update user assets" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (
    bucket_id = 'user_assets' 
    AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
    bucket_id = 'user_assets' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- Authenticated users can delete their own user assets
CREATE POLICY "Authenticated users can delete user assets" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (
    bucket_id = 'user_assets' 
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- No INSERT policy for 'renders' bucket - only backend (service role) can write to it
-- This ensures that only the server can upload rendered images

-- Refresh policies to ensure they're active
-- SELECT rs.refresh_storage_policies();