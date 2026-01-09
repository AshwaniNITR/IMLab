import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import TeamMember from '@/app/models/TeamMember';
import { uploadToCloudinary } from '@/app/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    
    // Extract all members from form data
    const members: any[] = [];
    let index = 0;
    
    while (true) {
      const name = formData.get(`members[${index}][name]`) as string;
      // If no name at this index, we've processed all members
      if (!name) break;

      const image = formData.get(`members[${index}][image]`) as File;
      const enrolledDate = formData.get(`members[${index}][enrolledDate]`) as string;
      const graduatedDate = formData.get(`members[${index}][graduatedDate]`) as string;
      const designation = formData.get(`members[${index}][designation]`) as string;
      const description = formData.get(`members[${index}][description]`) as string;

      // Validation for this member
      if (!name || !image || !enrolledDate || !designation || !description) {
        return NextResponse.json(
          { error: `Missing required fields for member ${index + 1}` },
          { status: 400 }
        );
      }

      members.push({
        name,
        image,
        enrolledDate,
        graduatedDate,
        designation,
        description,
      });
      
      index++;
    }

    if (members.length === 0) {
      return NextResponse.json(
        { error: 'No members to add' },
        { status: 400 }
      );
    }

    // Process all members in parallel
    const teamMembers = await Promise.all(
      members.map(async (member) => {
        try {
          // Upload image to Cloudinary
          const { url, publicId } = await uploadToCloudinary(member.image);

          // Create team member
          return await TeamMember.create({
            name: member.name,
            imageUrl: url,
            imagePublicId: publicId,
            enrolledDate: new Date(member.enrolledDate),
            graduatedDate: member.graduatedDate ? new Date(member.graduatedDate) : null,
            designation: member.designation,
            description: member.description,
          });
        } catch (error) {
          console.error(`Error creating member ${member.name}:`, error);
          throw error;
        }
      })
    );

    return NextResponse.json(
      { 
        success: true, 
        data: teamMembers,
        message: `Successfully added ${teamMembers.length} member(s)` 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating team members:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create team members' },
      { status: 500 }
    );
  }
}
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
