-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public)
VALUES ('resumes', 'resumes', false);

-- Allow anyone to upload resumes (for job applications)
CREATE POLICY "Anyone can upload resumes"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to read resumes (for HR team)
CREATE POLICY "Authenticated users can read resumes"
ON storage.objects
FOR SELECT
USING (bucket_id = 'resumes' AND auth.role() = 'authenticated');