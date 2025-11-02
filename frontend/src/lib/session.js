export function genSessionId() {
  if (typeof crypto !== 'undefined' && crypto?.randomUUID) return crypto.randomUUID()
  return 'sess-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8)
}

