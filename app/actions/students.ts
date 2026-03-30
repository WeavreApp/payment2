"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type Student = Database["public"]["Tables"]["students"]["Row"];
type StudentInsert = Database["public"]["Tables"]["students"]["Insert"];
type StudentUpdate = Database["public"]["Tables"]["students"]["Update"];

// @ts-ignore
export async function createStudent(data: StudentInsert) {
  const supabase = await createClient();

  // @ts-ignore
  const { data: student, error } = await supabase
    .from("students")
    .insert([data] as any)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: student };
}

// @ts-ignore
export async function getStudents(filters?: {
  search?: string;
  class?: string;
}) {
  const supabase = await createClient();

  let query = supabase.from("students").select("*");

  if (filters?.search) {
    query = query.ilike("full_name", `%${filters.search}%`);
  }

  if (filters?.class) {
    query = query.eq("class", filters.class);
  }

  const { data, error } = (await query) as any;

  if (error) {
    return { error: error.message };
  }

  return { data };
}

// @ts-ignore
export async function getStudentById(id: string) {
  const supabase = await createClient();

  // @ts-ignore
  const { data: student, error } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data: student };
}

// @ts-ignore
export async function updateStudent(id: string, data: StudentUpdate) {
  const supabase = await createClient();

  const updateObj: any = { ...data, updated_at: new Date().toISOString() };

  // @ts-ignore: Supabase types issue
  const response = await supabase
    .from("students")
    // @ts-ignore: Supabase types issue
    .update(updateObj)
    .eq("id", id)
    .select()
    .single();

  const { data: student, error } = response as any;

  if (error) {
    return { error: error.message };
  }

  return { data: student };
}

export async function deleteStudent(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("students").delete().eq("id", id);

  if (error) {
    return { error: error.message };
  }

  return { success: true };
}

// @ts-ignore
export async function getStudentPaymentInfo(id: string) {
  const supabase = await createClient();

  // @ts-ignore
  const { data: student, error: studentError } = await supabase
    .from("students")
    .select("*")
    .eq("id", id)
    .single();

  if (studentError) {
    return { error: studentError.message };
  }

  // @ts-ignore
  const { data: payments, error: paymentsError } = await supabase
    .from("payments")
    .select("*")
    .eq("student_id", id)
    .eq("status", "Verified");

  if (paymentsError) {
    return { error: paymentsError.message };
  }

  const totalPaid = ((payments as any) || []).reduce((sum: number, p: any) => sum + p.amount, 0);
  const balance = Math.max(0, (student as any).total_fees - totalPaid);

  return {
    data: {
      student,
      totalPaid,
      balance,
      payments: payments || [],
    },
  };
}

// @ts-ignore
export async function getDistinctClasses() {
  const supabase = await createClient();

  // @ts-ignore
  const { data, error } = await supabase
    .from("students")
    .select("class")
    .order("class");

  if (error) {
    return { error: error.message };
  }

  // @ts-ignore
  const classes = [...new Set(((data as any) || []).map((s: any) => s.class))];
  return { data: classes };
}
