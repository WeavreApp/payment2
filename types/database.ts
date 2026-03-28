export type Database = {
  public: {
    Tables: {
      students: {
        Row: {
          id: string;
          full_name: string;
          class: string;
          total_fees: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          full_name: string;
          class: string;
          total_fees?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          class?: string;
          total_fees?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      payments: {
        Row: {
          id: string;
          transaction_id: string;
          student_id: string;
          amount: number;
          payment_method: "Cash" | "Transfer" | "POS";
          payment_date: string;
          notes: string | null;
          receipt_url: string | null;
          receipt_hash: string | null;
          reference_number: string | null;
          status: "Pending" | "Verified" | "Flagged" | "Rejected";
          submitted_by: "Admin" | "Parent";
          parent_name: string | null;
          parent_phone: string | null;
          flagged_reason: string | null;
          verified_by: string | null;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          transaction_id: string;
          student_id: string;
          amount: number;
          payment_method: "Cash" | "Transfer" | "POS";
          payment_date: string;
          notes?: string | null;
          receipt_url?: string | null;
          receipt_hash?: string | null;
          reference_number?: string | null;
          status?: "Pending" | "Verified" | "Flagged" | "Rejected";
          submitted_by: "Admin" | "Parent";
          parent_name?: string | null;
          parent_phone?: string | null;
          flagged_reason?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          transaction_id?: string;
          student_id?: string;
          amount?: number;
          payment_method?: "Cash" | "Transfer" | "POS";
          payment_date?: string;
          notes?: string | null;
          receipt_url?: string | null;
          receipt_hash?: string | null;
          reference_number?: string | null;
          status?: "Pending" | "Verified" | "Flagged" | "Rejected";
          submitted_by?: "Admin" | "Parent";
          parent_name?: string | null;
          parent_phone?: string | null;
          flagged_reason?: string | null;
          verified_by?: string | null;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      fraud_flags: {
        Row: {
          id: string;
          payment_id: string;
          flag_type: "Duplicate Reference" | "Duplicate Proof" | "Suspicious Amount";
          details: Record<string, any> | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          flag_type: "Duplicate Reference" | "Duplicate Proof" | "Suspicious Amount";
          details?: Record<string, any> | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          flag_type?: "Duplicate Reference" | "Duplicate Proof" | "Suspicious Amount";
          details?: Record<string, any> | null;
          created_at?: string;
        };
      };
      payment_status_history: {
        Row: {
          id: string;
          payment_id: string;
          old_status: string | null;
          new_status: string;
          changed_by: string | null;
          changed_at: string;
        };
        Insert: {
          id?: string;
          payment_id: string;
          old_status?: string | null;
          new_status: string;
          changed_by?: string | null;
          changed_at?: string;
        };
        Update: {
          id?: string;
          payment_id?: string;
          old_status?: string | null;
          new_status?: string;
          changed_by?: string | null;
          changed_at?: string;
        };
      };
    };
    Views: Record<string, unknown>;
    Functions: Record<string, unknown>;
    Enums: Record<string, unknown>;
  };
};
