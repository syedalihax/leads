const API_URL = import.meta.env.VITE_API_URL || '/api';

function getAuthHeaders(headers = {}) {
  const token = localStorage.getItem('lead_token');

  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };
}

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: getAuthHeaders(options.headers),
    ...options,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Request failed');
  }

  return response.json();
}

export const api = {
  signup: (payload) => request('/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  login: (payload) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getMe: () => request('/auth/me'),
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
