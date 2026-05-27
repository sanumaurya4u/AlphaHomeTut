-- ============================================
-- Alpha Home Tuition — Supabase Migration
-- Run this in your Supabase SQL Editor
-- ============================================

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_admin_users_user_id ON admin_users(user_id);

-- ============================================
-- 2. DEMO REQUESTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS demo_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_class TEXT NOT NULL,
  subject TEXT NOT NULL,
  location TEXT,
  timing TEXT,
  budget TEXT,
  mode TEXT DEFAULT 'home',
  status TEXT DEFAULT 'Pending',
  assigned_tutor_id UUID,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_demo_requests_status ON demo_requests(status);
CREATE INDEX idx_demo_requests_created_at ON demo_requests(created_at DESC);

-- ============================================
-- 3. TUTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tutors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  city TEXT,
  address TEXT,
  gender TEXT,
  tenth_marks TEXT,
  twelfth_marks TEXT,
  degree TEXT,
  college TEXT,
  subjects TEXT,
  experience TEXT,
  preferred_classes TEXT,
  preferred_subjects TEXT,
  expected_salary TEXT,
  teaching_mode TEXT DEFAULT 'home',
  membership_plan TEXT,
  status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tutors_status ON tutors(status);
CREATE INDEX idx_tutors_email ON tutors(email);
CREATE INDEX idx_tutors_created_at ON tutors(created_at DESC);

-- ============================================
-- 4. TUTOR DOCUMENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS tutor_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  document_type TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tutor_documents_tutor_id ON tutor_documents(tutor_id);

-- ============================================
-- 5. MEMBERSHIPS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL,
  amount INTEGER NOT NULL,
  status TEXT DEFAULT 'Active',
  purchased_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ
);

CREATE INDEX idx_memberships_tutor_id ON memberships(tutor_id);
CREATE INDEX idx_memberships_status ON memberships(status);

-- ============================================
-- 6. ASSIGNED TUTORS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS assigned_tutors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  demo_request_id UUID NOT NULL REFERENCES demo_requests(id) ON DELETE CASCADE,
  tutor_id UUID NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'Active',
  notes TEXT,
  assigned_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_assigned_tutors_demo_request_id ON assigned_tutors(demo_request_id);
CREATE INDEX idx_assigned_tutors_tutor_id ON assigned_tutors(tutor_id);

-- ============================================
-- 7. CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contact_messages_is_read ON contact_messages(is_read);
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================
-- 8. NOTIFICATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  is_read BOOLEAN DEFAULT false,
  reference_id UUID,
  reference_type TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);


-- ============================================
-- 9. ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE demo_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE assigned_tutors ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM admin_users WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ---- ADMIN_USERS ----
CREATE POLICY "Admin users: admin full access"
  ON admin_users FOR ALL
  USING (is_admin());

-- ---- DEMO_REQUESTS ----
-- Anyone can insert (public form)
CREATE POLICY "Demo requests: public insert"
  ON demo_requests FOR INSERT
  WITH CHECK (true);

-- Only admin can read/update/delete
CREATE POLICY "Demo requests: admin select"
  ON demo_requests FOR SELECT
  USING (is_admin());

CREATE POLICY "Demo requests: admin update"
  ON demo_requests FOR UPDATE
  USING (is_admin());

CREATE POLICY "Demo requests: admin delete"
  ON demo_requests FOR DELETE
  USING (is_admin());

-- ---- TUTORS ----
-- Anyone can insert (public registration)
CREATE POLICY "Tutors: public insert"
  ON tutors FOR INSERT
  WITH CHECK (true);

-- Only admin can read/update/delete
CREATE POLICY "Tutors: admin select"
  ON tutors FOR SELECT
  USING (is_admin());

CREATE POLICY "Tutors: admin update"
  ON tutors FOR UPDATE
  USING (is_admin());

CREATE POLICY "Tutors: admin delete"
  ON tutors FOR DELETE
  USING (is_admin());

-- ---- TUTOR_DOCUMENTS ----
-- Anyone can insert (during registration)
CREATE POLICY "Tutor documents: public insert"
  ON tutor_documents FOR INSERT
  WITH CHECK (true);

-- Only admin can read/delete
CREATE POLICY "Tutor documents: admin select"
  ON tutor_documents FOR SELECT
  USING (is_admin());

CREATE POLICY "Tutor documents: admin delete"
  ON tutor_documents FOR DELETE
  USING (is_admin());

-- ---- MEMBERSHIPS ----
-- Anyone can insert (public registration creates membership)
CREATE POLICY "Memberships: public insert"
  ON memberships FOR INSERT
  WITH CHECK (true);

-- Only admin can read/update/delete
CREATE POLICY "Memberships: admin select"
  ON memberships FOR SELECT
  USING (is_admin());

CREATE POLICY "Memberships: admin update"
  ON memberships FOR UPDATE
  USING (is_admin());

CREATE POLICY "Memberships: admin delete"
  ON memberships FOR DELETE
  USING (is_admin());

-- ---- ASSIGNED_TUTORS ----
CREATE POLICY "Assigned tutors: admin full access"
  ON assigned_tutors FOR ALL
  USING (is_admin());

-- ---- CONTACT_MESSAGES ----
-- Anyone can insert (public form)
CREATE POLICY "Contact messages: public insert"
  ON contact_messages FOR INSERT
  WITH CHECK (true);

-- Only admin can read/update/delete
CREATE POLICY "Contact messages: admin select"
  ON contact_messages FOR SELECT
  USING (is_admin());

CREATE POLICY "Contact messages: admin update"
  ON contact_messages FOR UPDATE
  USING (is_admin());

CREATE POLICY "Contact messages: admin delete"
  ON contact_messages FOR DELETE
  USING (is_admin());

-- ---- NOTIFICATIONS ----
-- Anyone can insert (triggered by form submissions)
CREATE POLICY "Notifications: public insert"
  ON notifications FOR INSERT
  WITH CHECK (true);

-- Only admin can read/update/delete
CREATE POLICY "Notifications: admin select"
  ON notifications FOR SELECT
  USING (is_admin());

CREATE POLICY "Notifications: admin update"
  ON notifications FOR UPDATE
  USING (is_admin());

CREATE POLICY "Notifications: admin delete"
  ON notifications FOR DELETE
  USING (is_admin());


-- ============================================
-- 10. SUPABASE STORAGE BUCKET
-- ============================================
-- Create storage bucket for tutor documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('tutor-documents', 'tutor-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: anyone can upload to tutor-documents
CREATE POLICY "Tutor docs: public upload"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'tutor-documents');

-- Storage policy: admin can read all files
CREATE POLICY "Tutor docs: admin read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'tutor-documents' AND is_admin());

-- Storage policy: admin can delete files
CREATE POLICY "Tutor docs: admin delete"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'tutor-documents' AND is_admin());


-- ============================================
-- 11. AUTO-UPDATE updated_at TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_demo_requests_updated_at
  BEFORE UPDATE ON demo_requests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER trigger_tutors_updated_at
  BEFORE UPDATE ON tutors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================
-- SETUP INSTRUCTIONS
-- ============================================
-- After running this migration:
--
-- 1. Create an admin user in Supabase Auth:
--    Go to Authentication > Users > Add User
--    Enter your admin email and password
--
-- 2. Copy the user's UUID from the users list
--
-- 3. Insert into admin_users:
--    INSERT INTO admin_users (user_id, email, name)
--    VALUES ('paste-user-uuid-here', 'your-admin@email.com', 'Admin Name');
--
-- 4. Your admin can now login at /admin/login
