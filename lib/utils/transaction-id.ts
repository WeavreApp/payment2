let transactionCounter = 0;

export function generateTransactionId(): string {
  transactionCounter++;
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 1000);
  const combined = transactionCounter * 1000 + random;
  return `TXN-${String(combined).padStart(8, "0")}`;
}
