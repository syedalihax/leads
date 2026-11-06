import Lead from '../models/Lead.js';
import { inMemoryLeads } from '../config/db.js';

const isMongoConnected = () => !!process.env.MONGO_URI && (globalThis.__mongoConnected === true || true);

const generateId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const getLeads = async (req, res) => {
  try {
    if (!process.env.MONGO_URI) {
      return res.json(inMemoryLeads);
    }

    const leads = await Lead.find().sort({ createdAt: -1 });
    return res.json(leads);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const createLead = async (req, res) => {
  try {
    const { name, email, company, status, notes } = req.body;

    if (!name || !email || !company) {
      return res.status(400).json({ message: 'Name, email and company are required.' });
    }

    if (!process.env.MONGO_URI) {
      const newLead = {
        _id: generateId(),
        name,
        email,
        company,
        status: status || 'New',
        notes: notes || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      inMemoryLeads.unshift(newLead);
      return res.status(201).json(newLead);
    }

    const lead = await Lead.create({ name, email, company, status, notes });
    return res.status(201).json(lead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateLead = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, company, status, notes } = req.body;

    if (!process.env.MONGO_URI) {
      const index = inMemoryLeads.findIndex((lead) => String(lead._id) === String(id));
      if (index === -1) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      inMemoryLeads[index] = {
        ...inMemoryLeads[index],
        name: name || inMemoryLeads[index].name,
        email: email || inMemoryLeads[index].email,
        company: company || inMemoryLeads[index].company,
        status: status || inMemoryLeads[index].status,
        notes: notes !== undefined ? notes : inMemoryLeads[index].notes,
        updatedAt: new Date().toISOString(),
      };

      return res.json(inMemoryLeads[index]);
    }

    const lead = await Lead.findByIdAndUpdate(
      id,
      { name, email, company, status, notes },
      { new: true }
    );

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.json(lead);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const deleteLead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!process.env.MONGO_URI) {
      const index = inMemoryLeads.findIndex((lead) => String(lead._id) === String(id));
      if (index === -1) {
        return res.status(404).json({ message: 'Lead not found' });
      }

      inMemoryLeads.splice(index, 1);
      return res.json({ message: 'Lead deleted successfully' });
    }

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
