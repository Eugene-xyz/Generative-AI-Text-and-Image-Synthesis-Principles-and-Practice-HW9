export function sha256(content: string | Uint8Array): string;
export function validatePublication(entries: readonly {
  id: string;
  filePath?: string;
  data: {status: string; verification: string; verified_at: string | null};
}[], root?: string): void;
