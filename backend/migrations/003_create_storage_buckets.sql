-- Up Migration

-- Create storage buckets for MugShot Studio
-- Run these commands in the Supabase SQL Editor

-- Create the required storage buckets
-- Note: In newer versions of Supabase, you might need to use the dashboard or CLI to create buckets
-- These commands are for documentation purposes and may need adjustment based on your Supabase version

-- Attempt to create buckets (may not work in all Supabase versions)
SELECT 'NOTE: Bucket creation may need to be done via Supabase Dashboard or CLI' as message;

-- If your Supabase version supports direct bucket creation via SQL:
-- Uncomment and adjust the following lines if applicable
/*
INSERT INTO storage.buckets (id, name, public) 
VALUES 
  ('profile_photos', 'profile_photos', true),
  ('user_assets', 'user_assets', false),
  ('renders', 'renders', true)
ON CONFLICT (id) DO NOTHING;
*/

-- Alternative method using storage.create_bucket function (if available)
-- Uncomment if your Supabase version supports this:
/*
SELECT storage.create_bucket('profile_photos');
SELECT storage.create_bucket('user_assets');
SELECT storage.create_bucket('renders');
*/

-- Verification query - check if buckets exist
SELECT 'Verify buckets exist:' as info;
SELECT id, name, public FROM storage.buckets 
WHERE id IN ('profile_photos', 'user_assets', 'renders');