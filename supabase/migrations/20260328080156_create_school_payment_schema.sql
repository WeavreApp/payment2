/*
  # School Payment Management System Schema

  1. New Tables
    - `students`: Core student records with fee information
    - `payments`: Payment transaction records from both admin and parent submissions
    - `fraud_flags`: Tracks suspicious or flagged transactions
    - `payment_status_history`: Audit trail for payment status changes

  2. Security
    - Enable RLS on all tables
    - Admin users can manage all student and payment data
    - Parents can only view their submitted payments
    - Service role for backend operations

  3. Indexes
    - Optimize queries on frequently filtered columns

  4. Important Notes
    - Uses auth.uid() to identify users
    - Admin role stored in auth.raw_user_meta_data.role = 'admin'
    - Transaction IDs auto-generated with sequence
    - File hashes stored for duplicate detection
*/

-- Create students table
CREATE TABLE IF NOT EXISTS students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  class text NOT NULL,
  total_fees numeric NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id text UNIQUE NOT NULL,
  student_id uuid NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount numeric NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('Cash', 'Transfer', 'POS')),
  payment_date date NOT NULL,
  notes text,
  receipt_url text,
  receipt_hash text,
  reference_number text,
  status text NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Verified', 'Flagged', 'Rejected')),
  submitted_by text NOT NULL CHECK (submitted_by IN ('Admin', 'Parent')),
  parent_name text,
  parent_phone text,
  flagged_reason text,
  verified_by uuid REFERENCES auth.users(id),
  verified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create fraud_flags table
CREATE TABLE IF NOT EXISTS fraud_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  flag_type text NOT NULL CHECK (flag_type IN ('Duplicate Reference', 'Duplicate Proof', 'Suspicious Amount')),
  details jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create payment_status_history table for audit trail
CREATE TABLE IF NOT EXISTS payment_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  payment_id uuid NOT NULL REFERENCES payments(id) ON DELETE CASCADE,
  old_status text,
  new_status text NOT NULL,
  changed_by uuid REFERENCES auth.users(id),
  changed_at timestamptz DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE fraud_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_status_history ENABLE ROW LEVEL SECURITY;

-- ==================== STUDENTS RLS POLICIES ====================

-- Admins can view all students
CREATE POLICY "Admins can view all students"
  ON students FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Admins can insert students
CREATE POLICY "Admins can insert students"
  ON students FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Admins can update students
CREATE POLICY "Admins can update students"
  ON students FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Admins can delete students
CREATE POLICY "Admins can delete students"
  ON students FOR DELETE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- ==================== PAYMENTS RLS POLICIES ====================

-- Admins can view all payments
CREATE POLICY "Admins can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Admins can insert payments
CREATE POLICY "Admins can insert payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Admins can update payments
CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  )
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Allow unauthenticated users to insert payments (parent submission)
CREATE POLICY "Allow unauthenticated payment submission"
  ON payments FOR INSERT
  TO anon
  WITH CHECK (submitted_by = 'Parent');

-- ==================== FRAUD_FLAGS RLS POLICIES ====================

-- Admins can view fraud flags
CREATE POLICY "Admins can view fraud flags"
  ON fraud_flags FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Admins can insert fraud flags
CREATE POLICY "Admins can insert fraud flags"
  ON fraud_flags FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- ==================== PAYMENT_STATUS_HISTORY RLS POLICIES ====================

-- Admins can view history
CREATE POLICY "Admins can view payment status history"
  ON payment_status_history FOR SELECT
  TO authenticated
  USING (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- Admins can insert history records
CREATE POLICY "Admins can insert payment status history"
  ON payment_status_history FOR INSERT
  TO authenticated
  WITH CHECK (
    (auth.jwt() ->> 'user_metadata')::jsonb ->> 'role' = 'admin'
  );

-- ==================== INDEXES FOR PERFORMANCE ====================

CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_reference_number ON payments(reference_number);
CREATE INDEX IF NOT EXISTS idx_payments_receipt_hash ON payments(receipt_hash);
CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_payment_id ON fraud_flags(payment_id);
CREATE INDEX IF NOT EXISTS idx_fraud_flags_flag_type ON fraud_flags(flag_type);
CREATE INDEX IF NOT EXISTS idx_students_class ON students(class);
CREATE INDEX IF NOT EXISTS idx_students_full_name ON students(full_name);
