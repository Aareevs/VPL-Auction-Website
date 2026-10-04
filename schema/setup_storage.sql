-- 1. Create a Storage Bucket named 'vpl-images' if it doesn't already exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('vpl-images', 'vpl-images', true) 
ON CONFLICT (id) DO NOTHING;

-- 2. Allow all users (public) to READ the images from this bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'vpl-images' );

-- 3. Allow Authenticated users (Admins) to UPLOAD/INSERT images to this bucket
CREATE POLICY "Auth Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'vpl-images' AND auth.role() = 'authenticated' );

-- 4. Allow Authenticated users to UPDATE images
CREATE POLICY "Auth Update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'vpl-images' AND auth.role() = 'authenticated' );

-- 5. Allow Authenticated users to DELETE images
CREATE POLICY "Auth Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'vpl-images' AND auth.role() = 'authenticated' );
