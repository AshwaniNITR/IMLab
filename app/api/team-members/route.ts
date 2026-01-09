import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import TeamMember from '@/app/models/TeamMember';
import { uploadToCloudinary } from '@/app/lib/cloudinary';

// POST - Create new team member
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    
    const name = formData.get('name') as string;
    const image = formData.get('image') as File;
    const enrolledDate = formData.get('enrolledDate') as string;
    const graduatedDate = formData.get('graduatedDate') as string;
    const designation = formData.get('designation') as string;
    const description = formData.get('description') as string;

    // Validation
    if (!name || !image || !enrolledDate || !designation || !description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Upload image to Cloudinary
    const { url, publicId } = await uploadToCloudinary(image);

    // Create team member
    const teamMember = await TeamMember.create({
      name,
      imageUrl: url,
      imagePublicId: publicId,
      enrolledDate: new Date(enrolledDate),
      graduatedDate: graduatedDate ? new Date(graduatedDate) : null,
      designation,
      description,
    });

    return NextResponse.json(
      { 
        success: true, 
        data: teamMember 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating team member:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create team member' },
      { status: 500 }
    );
  }
}

// GET - Fetch all team members
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const designation = searchParams.get('designation');

    const filter = designation ? { designation } : {};
    
    const teamMembers = await TeamMember.find(filter)
      .sort({ enrolledDate: -1 });

    return NextResponse.json({
      success: true,
      data: teamMembers,
    });
  } catch (error: any) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
