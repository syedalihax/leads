import mongoose from 'mongoose';

export const inMemoryLeads = [];
export const inMemoryUsers = [];

export const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/lead-management';

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection failed. Make sure MongoDB is running locally on port 27017.');
    console.error(error.message);
  }
};
