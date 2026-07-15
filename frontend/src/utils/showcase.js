const API_BASE = `${import.meta.env.VITE_API_URL}/api`;

export async function publishShowcasePost({ token, title, description, prompt, category, mediaType = 'image', imageBlob }) {
  if (!token) throw new Error('Please sign in before posting to the showcase.');

  const formData = new FormData();
  formData.append('title', title);
  formData.append('description', description || '');
  formData.append('prompt', prompt || '');
  formData.append('category', category);
  formData.append('mediaType', mediaType);

  if (imageBlob) {
    formData.append('image', imageBlob, `pen-ai-showcase-${Date.now()}.png`);
  }

  const response = await fetch(`${API_BASE}/showcase`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  });

  const data = await response.json();
  if (!response.ok) {
    const detail = typeof data.details === 'string' && data.details.trim() ? ` ${data.details}` : '';
    throw new Error(`${data.error || 'Failed to publish to showcase.'}${detail}`);
  }
  return data;
}

export async function urlToBlob(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not prepare the generated image for posting.');
  return response.blob();
}
