import mongoose from "mongoose";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

async function check() {
  await mongoose.connect(MONGODB_URI as string);
  console.log("Connected to MongoDB.");

  const User = mongoose.connection.collection("users");
  const Role = mongoose.connection.collection("roles");
  
  const users = await User.find({}).limit(5).toArray();
  const roles = await Role.find({}).toArray();

  const getRole = (id: any) => roles.find((r: any) => r._id.toString() === id.toString())?.role_name || id;

  const summary = users.map((u: any) => ({
    email: u.email,
    role: getRole(u.role_id)
  }));

  console.log("Users:", summary);
  
  await mongoose.disconnect();
}
check().catch(console.error);
