import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import TeamMember from '@/app/models/TeamMember';
import { uploadToCloudinary, deleteFromCloudinary } from '@/app/lib/cloudinary';

interface UpdateTeamMemberData {
  name?: string;
  image?: string | File; // Could be URL string or new File
  enrolledDate?: string;
  graduatedDate?: string | null;
  designation?: string;
  description?: string;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const params = await context.params; // ✅ await first
  const id = params.id;                // ✅ then access
    
    // Check if team member exists
    const existingMember = await TeamMember.findById(id);
    if (!existingMember) {
      return NextResponse.json(
        { error: 'Team member not found' },
        { status: 404 }
      );
    }

    let updateData: Partial<ITeamMember> = {};
    let newImageData: { url: string; publicId: string } | null = null;

    // Check content type to handle both JSON and FormData
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (if updating image)
      const formData = await request.formData();
      
      updateData = {
        name: formData.get('name') as string || existingMember.name,
        enrolledDate: formData.get('enrolledDate') 
          ? new Date(formData.get('enrolledDate') as string)
          : existingMember.enrolledDate,
        graduatedDate: formData.get('graduatedDate')
          ? new Date(formData.get('graduatedDate') as string)
          : existingMember.graduatedDate,
        designation: formData.get('designation') as string || existingMember.designation,
        description: formData.get('description') as string || existingMember.description,
      };

      // Handle image upload if provided
      const imageFile = formData.get('image') as File;
      if (imageFile && imageFile.size > 0) {
        // Delete old image from Cloudinary
        await deleteFromCloudinary(existingMember.imagePublicId);
        
        // Upload new image
        newImageData = await uploadToCloudinary(imageFile);
        updateData.imageUrl = newImageData.url;
        updateData.imagePublicId = newImageData.publicId;
      }
    } else {
      // Handle JSON data
      const jsonData = await request.json() as UpdateTeamMemberData;
      
      updateData = {
        name: jsonData.name || existingMember.name,
        enrolledDate: jsonData.enrolledDate 
          ? new Date(jsonData.enrolledDate)
          : existingMember.enrolledDate,
        graduatedDate: jsonData.graduatedDate === null 
          ? null 
          : jsonData.graduatedDate 
            ? new Date(jsonData.graduatedDate)
            : existingMember.graduatedDate,
        designation: jsonData.designation || existingMember.designation,
        description: jsonData.description || existingMember.description,
      };

      // Handle image update if new URL is provided
      if (jsonData.image && typeof jsonData.image === 'string') {
        updateData.imageUrl = jsonData.image;
        // Note: If updating only URL, we keep the same publicId
        // If you want to update both, you'd need both fields
      }
    }

    // Validate required fields
    if (!updateData.name || !updateData.enrolledDate || !updateData.designation || !updateData.description) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Update the team member
    const updatedMember = await TeamMember.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedMember) {
      return NextResponse.json(
        { error: 'Failed to update team member' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedMember,
      message: 'Team member updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating team member:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: messages.join(', ') },
        { status: 400 }
      );
    }

    // Handle CastError (invalid ID)
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid team member ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update team member' },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE endpoint as well
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   await dbConnect();

//   // 👇 this satisfies runtime without breaking types
//   const { id } = await Promise.resolve(params);

//   const existingMember = await TeamMember.findById(id);
//   if (!existingMember) {
//     return NextResponse.json(
//       { error: 'Team member not found' },
//       { status: 404 }
//     );
//   }

//   await deleteFromCloudinary(existingMember.imagePublicId);
//   await TeamMember.findByIdAndDelete(id);

//   return NextResponse.json({
//     success: true,
//     message: 'Team member deleted successfully',
//   });
// }


// Helper type for TypeScript
interface ITeamMember {
  name: string;
  imageUrl: string;
  imagePublicId: string;
  enrolledDate: Date;
  graduatedDate?: Date | null;
  designation: string;
  description: string;
}