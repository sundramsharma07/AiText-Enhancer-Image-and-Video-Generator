const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

// History is best-effort: a successful generation must never be hidden because
// saving its archive entry has a temporary problem.
export async function saveGenerationHistory({ token, title, originalText, enhancedText, tone = 'Generated' }) {
  if (!token) return;

  const response = await fetch(`${API_BASE}/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ title, originalText, enhancedText, tone })
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.error || 'Could not save this item to history.');
  }
  return response.json();
}
