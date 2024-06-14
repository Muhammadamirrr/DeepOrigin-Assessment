import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI =
  (process.env.MONGO_URI as string) ||
  process.env.MONGO_URI ||
  'mongodb+srv://aarondev500:aaron22dev@cluster0.tgl0pxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
    } as mongoose.ConnectOptions)
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    process.exit(1)
  }
}

export default connectDB
