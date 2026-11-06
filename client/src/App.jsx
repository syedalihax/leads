import { useEffect, useState } from 'react';
import { api } from './services/api';

const emptyForm = {
  name: '',
  email: '',
  company: '',
  status: 'New',
  notes: '',
};

function App() {
  const [leads, setLeads] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.getLeads();
      setLeads(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (editingId) {
        await api.updateLead(editingId, form);
      } else {
        await api.createLead(form);
      }

      setForm(emptyForm);
      setEditingId(null);
      await loadLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (lead) => {
    setEditingId(lead._id || lead.id);
    setForm({
      name: lead.name,
      email: lead.email,
      company: lead.company,
      status: lead.status || 'New',
      notes: lead.notes || '',
    });
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteLead(id);
      await loadLeads();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">L</span>
          LeadFlow
        </div>
        <nav className="nav">
          <button className="nav-item active">Dashboard</button>
          <button className="nav-item">Leads</button>
          <button className="nav-item">Reports</button>
        </nav>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <h1>Lead Management</h1>
        </header>

        <section className="content-grid">
          <form className="lead-form" onSubmit={handleSubmit}>
            <h2>{editingId ? 'Edit Lead' : 'Add Lead'}</h2>

            <label>
              Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>

            <label>
              Email
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </label>

            <label>
              Company
              <input name="company" value={form.company} onChange={handleChange} required />
            </label>

            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                <option>New</option>
                <option>Contacted</option>
                <option>Qualified</option>
                <option>Proposal</option>
                <option>Won</option>
                <option>Lost</option>
              </select>
            </label>

            <label>
              Notes
              <textarea name="notes" value={form.notes} onChange={handleChange} rows="4" />
            </label>

            <div className="form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? 'Update Lead' : 'Add Lead'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => {
                    setEditingId(null);
                    setForm(emptyForm);
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="lead-list">
            <h2>Recent Leads</h2>

            {error && <div className="error-box">{error}</div>}

            {loading ? (
              <p>Loading leads...</p>
            ) : leads.length === 0 ? (
              <p>No leads yet.</p>
            ) : (
              leads.map((lead) => (
                <div className="lead-card" key={lead._id || lead.id}>
                  <div>
                    <h3>{lead.name}</h3>
                    <p>{lead.email}</p>
                    <p>{lead.company}</p>
                  </div>

                  <div className="lead-meta">
                    <span className="status-badge">{lead.status || 'New'}</span>
                    <div className="lead-actions">
                      <button onClick={() => handleEdit(lead)}>Edit</button>
                      <button className="danger" onClick={() => handleDelete(lead._id || lead.id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
