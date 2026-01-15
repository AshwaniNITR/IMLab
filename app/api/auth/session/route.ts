// app/api/auth/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { JWT } from '@/app/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    // Try to get token from cookie first
    const token = request.cookies.get('admin-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { 
          isAuthenticated: false, 
          error: 'No active session' 
        },
        { status: 401 }
      );
    }
    
    const decoded = JWT.verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json(
        { 
          isAuthenticated: false, 
          error: 'Invalid or expired session' 
        },
        { status: 401 }
      );
    }
    
    return NextResponse.json(
      { 
        isAuthenticated: true,
        user: {
          id: decoded.userId,
          email: decoded.email,
          isAdmin: decoded.isAdmin
        }
      },
      { status: 200 }
    );
    
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      { 
        isAuthenticated: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  }
}