import type { Database } from "@/types/database";

type Payment = Database["public"]["Tables"]["payments"]["Row"];

const SUSPICIOUS_AMOUNT_THRESHOLD = 500000;
const AMOUNT_DEVIATION_THRESHOLD = 1000000;

export async function checkDuplicateReference(
  referenceNumber: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ isDuplicate: boolean; existingTransactionId?: string }> {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/payments?reference_number=eq.${encodeURIComponent(referenceNumber)}&select=transaction_id`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) return { isDuplicate: false };

    const data = await response.json();
    return {
      isDuplicate: data.length > 0,
      existingTransactionId: data[0]?.transaction_id,
    };
  } catch {
    return { isDuplicate: false };
  }
}

export async function checkDuplicateHash(
  hash: string,
  supabaseUrl: string,
  supabaseKey: string
): Promise<{ isDuplicate: boolean; existingTransactionId?: string }> {
  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/payments?receipt_hash=eq.${encodeURIComponent(hash)}&select=transaction_id`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
      }
    );

    if (!response.ok) return { isDuplicate: false };

    const data = await response.json();
    return {
      isDuplicate: data.length > 0,
      existingTransactionId: data[0]?.transaction_id,
    };
  } catch {
    return { isDuplicate: false };
  }
}

export function checkSuspiciousAmount(
  amount: number,
  totalFees: number
): { isSuspicious: boolean; reason?: string } {
  if (amount > SUSPICIOUS_AMOUNT_THRESHOLD) {
    return {
      isSuspicious: true,
      reason: `Amount (${amount}) exceeds reasonable threshold`,
    };
  }

  if (amount > totalFees * 2) {
    return {
      isSuspicious: true,
      reason: `Amount exceeds double the total fees`,
    };
  }

  return { isSuspicious: false };
}

export function checkFormattingIssues(
  referenceNumber: string,
  amount: number
): { hasIssues: boolean; reason?: string } {
  if (!referenceNumber || referenceNumber.length < 3) {
    return {
      hasIssues: true,
      reason: "Invalid reference number format",
    };
  }

  if (amount <= 0) {
    return {
      hasIssues: true,
      reason: "Amount must be greater than zero",
    };
  }

  return { hasIssues: false };
}

export async function performFraudChecks(
  amount: number,
  referenceNumber: string,
  receiptHash: string,
  totalFees: number,
  supabaseUrl: string,
  supabaseKey: string
): Promise<
  Array<{
    type: "Duplicate Reference" | "Duplicate Proof" | "Suspicious Amount";
    details: Record<string, any>;
  }>
> {
  const flags = [];

  const formattingIssue = checkFormattingIssues(referenceNumber, amount);
  if (formattingIssue.hasIssues) {
    flags.push({
      type: "Suspicious Amount" as const,
      details: { reason: formattingIssue.reason },
    });
  }

  const suspiciousAmount = checkSuspiciousAmount(amount, totalFees);
  if (suspiciousAmount.isSuspicious) {
    flags.push({
      type: "Suspicious Amount" as const,
      details: { reason: suspiciousAmount.reason },
    });
  }

  const duplicateRef = await checkDuplicateReference(
    referenceNumber,
    supabaseUrl,
    supabaseKey
  );
  if (duplicateRef.isDuplicate) {
    flags.push({
      type: "Duplicate Reference" as const,
      details: {
        existingTransactionId: duplicateRef.existingTransactionId,
        referenceNumber,
      },
    });
  }

  const duplicateHash = await checkDuplicateHash(
    receiptHash,
    supabaseUrl,
    supabaseKey
  );
  if (duplicateHash.isDuplicate) {
    flags.push({
      type: "Duplicate Proof" as const,
      details: {
        existingTransactionId: duplicateHash.existingTransactionId,
      },
    });
  }

  return flags;
}
