import mongoose from 'mongoose'

export async function  databaseConnection()
{
 try {
  const connectingString=await mongoose.connect(`${process.env.MONGODB_URI}/instagram`);
  
 } catch (error) {
 
  throw error
 }
 
}
