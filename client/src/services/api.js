const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  getLeads: () => request('/leads'),
  createLead: (lead) => request('/leads', {
    method: 'POST',
    body: JSON.stringify(lead),
  }),
  updateLead: (id, lead) => request(`/leads/${id}`, {
    method: 'PUT',
    body: JSON.stringify(lead),
  }),
  deleteLead: (id) => request(`/leads/${id}`, {
    method: 'DELETE',
  }),
};
