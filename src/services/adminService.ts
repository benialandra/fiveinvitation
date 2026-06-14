export const adminHeaders = (token: string | null, extra?: Record<string, string>): Record<string, string> => ({
  'Authorization': `Bearer ${token}`,
  ...extra
});

export const fetchOrders = async (token: string | null) => {
  const res = await fetch('/api/orders', { headers: adminHeaders(token) });
  if (!res.ok) throw new Error('Failed to load orders');
  return res.json();
};

export const fetchThemes = async (token: string | null) => {
  const res = await fetch('/api/themes', { headers: adminHeaders(token) });
  if (!res.ok) throw new Error('Failed to load themes');
  return res.json();
};

export const seedThemes = async (themesToSeed: any[], token: string | null) => {
  const res = await fetch('/api/admin/themes/seed', {
    method: 'POST',
    headers: adminHeaders(token, { 'Content-Type': 'application/json' }),
    body: JSON.stringify({ themes: themesToSeed })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to seed');
  return data;
};

export const updateTheme = async (id: string, formData: FormData, token: string | null) => {
  const res = await fetch(`/api/admin/themes/${id}`, {
    method: 'PUT',
    headers: adminHeaders(token),
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to update theme');
  return data;
};

export const createTheme = async (formData: FormData, token: string | null) => {
  const res = await fetch('/api/admin/themes', {
    method: 'POST',
    headers: adminHeaders(token),
    body: formData
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to create theme');
  return data;
};

export const deleteTheme = async (id: string, token: string | null) => {
  const res = await fetch(`/api/admin/themes/${id}`, {
    method: 'DELETE',
    headers: adminHeaders(token)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Failed to delete theme');
  return data;
};
