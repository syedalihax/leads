import mongoose from 'mongoose';

export const inMemoryLeads = [];

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.log('MONGO_URI not found. Starting app in memory mode.');
    return;
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed. Starting app in memory mode.');
    console.error(error.message);
  }
};
