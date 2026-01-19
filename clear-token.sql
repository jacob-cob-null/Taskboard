-- Run this SQL in your database to clear the old refresh token
-- Replace 'YOUR_USER_ID' with your actual user ID
UPDATE public.profiles 
SET google_refresh_token = NULL 
WHERE id = 'YOUR_USER_ID';

-- Or clear all tokens to force everyone to re-authenticate:
-- UPDATE public.profiles SET google_refresh_token = NULL;
