// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';

const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect(process.env.MONGODB_URI!);
};

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Get user info from headers (set by middleware)
    const userId = request.headers.get('x-user-id');
    const userEmail = request.headers.get('x-user-email');
    const isAdmin = request.headers.get('x-is-admin');
    
    console.log(`Admin ${userEmail} accessed users endpoint`);
    
    // Get all users (excluding passwords)
    const User = mongoose.models.User || mongoose.model('User');
    const users = await User.find({}, '-password').lean();
    
    return NextResponse.json(
      { 
        success: true,
        users,
        accessedBy: {
          userId,
          email: userEmail,
          timestamp: new Date().toISOString()
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}