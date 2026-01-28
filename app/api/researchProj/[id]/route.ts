import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import RProject from '@/app/models/ResearchProj';
import { uploadToCloudinary } from '@/app/lib/cloudinary';

interface ProjectInput {
  name: string;
  status: string;
  description: string;
  photo: File;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }

): Promise<Response> {
  try {
    await dbConnect();
    const { id } =await context.params;
    
    // Check if project exists
    const existingProject = await RProject.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Research project not found' },
        { status: 404 }
      );
    }

    const contentType = request.headers.get('content-type');
    let updateData: any;
    let imageFile: File | null = null;

    // Handle both JSON and FormData requests
    if (contentType?.includes('multipart/form-data')) {
      // FormData with image upload
      const formData = await request.formData();
      
      updateData = {
        name: formData.get('name') as string,
        status: formData.get('status') as string,
        description: formData.get('description') as string,
      };
      
      imageFile = formData.get('image') as File | null;
    } else {
      // JSON request
      updateData = await request.json();
    }
    
    // Validate required fields
    if (!updateData.name || !updateData.description) {
      return NextResponse.json(
        { error: 'Name and Description are required fields' },
        { status: 400 }
      );
    }

    // Validate status
    if (updateData.status && !['ongoing', 'completed'].includes(updateData.status)) {
      return NextResponse.json(
        { error: 'Status must be either "ongoing" or "completed"' },
        { status: 400 }
      );
    }

    // Prepare update object
    const updateObject: any = {
      name: updateData.name,
      description: updateData.description,
      status: updateData.status || existingProject.status,
      updatedAt: new Date(),
    };

    // Handle image update - either from file upload or URL
    if (imageFile && imageFile.size > 0) {
      // Upload new image to Cloudinary
      try {
        const { url } = await uploadToCloudinary(imageFile);
        updateObject.imageUrl = url;
      } catch (uploadError) {
        console.error('Error uploading image to Cloudinary:', uploadError);
        return NextResponse.json(
          { error: 'Failed to upload image' },
          { status: 500 }
        );
      }
    } else if (updateData.imageUrl) {
      // Use provided URL
      updateObject.imageUrl = updateData.imageUrl;
    }
    // If neither is provided, keep the existing imageUrl (do nothing)

    // Update the project
    const updatedProject = await RProject.findByIdAndUpdate(
      id,
      updateObject,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Failed to update research project' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProject,
      message: 'Research project updated successfully',
    });
  } catch (error: any) {
    console.error('Error updating research project:', error);
    
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
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update research project' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }

): Promise<Response>{
  try {
    await dbConnect();
    const { id } = await context.params;
    
    // Check if project exists
    const existingProject = await RProject.findById(id);
    if (!existingProject) {
      return NextResponse.json(
        { error: 'Research project not found' },
        { status: 404 }
      );
    }

    // Delete the project
    await RProject.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Research project deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting research project:', error);
    
    // Handle CastError (invalid ID)
    if (error.name === 'CastError') {
      return NextResponse.json(
        { error: 'Invalid project ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to delete research project' },
      { status: 500 }
    );
  }
}