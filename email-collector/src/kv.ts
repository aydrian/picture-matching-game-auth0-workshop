export interface EmailEntry {
  email: string;
  submittedAt: string;
}

export async function addEmail(
  kv: KVNamespace,
  email: string
): Promise<{ success: boolean; duplicate: boolean }> {
  const normalizedEmail = email.toLowerCase().trim();
  const key = `email:${normalizedEmail}`;

  // Check for duplicate
  const existing = await kv.get(key);
  if (existing) {
    return { success: false, duplicate: true };
  }

  const entry: EmailEntry = {
    email: normalizedEmail,
    submittedAt: new Date().toISOString(),
  };

  // Store individual email entry
  await kv.put(key, JSON.stringify(entry));

  // Update the ordered list
  const listRaw = await kv.get("email_list");
  const list: string[] = listRaw ? JSON.parse(listRaw) : [];
  list.push(normalizedEmail);
  await kv.put("email_list", JSON.stringify(list));

  return { success: true, duplicate: false };
}

export async function getAllEmails(kv: KVNamespace): Promise<EmailEntry[]> {
  const listRaw = await kv.get("email_list");
  const list: string[] = listRaw ? JSON.parse(listRaw) : [];

  const entries: EmailEntry[] = [];
  for (const email of list) {
    const raw = await kv.get(`email:${email}`);
    if (raw) {
      entries.push(JSON.parse(raw));
    }
  }
  return entries;
}

export async function clearAllEmails(kv: KVNamespace): Promise<void> {
  const listRaw = await kv.get("email_list");
  const list: string[] = listRaw ? JSON.parse(listRaw) : [];

  await Promise.all(list.map((email) => kv.delete(`email:${email}`)));
  await kv.delete("email_list");
}

export async function getEmailCount(kv: KVNamespace): Promise<number> {
  const listRaw = await kv.get("email_list");
  if (!listRaw) return 0;
  const list: string[] = JSON.parse(listRaw);
  return list.length;
}
