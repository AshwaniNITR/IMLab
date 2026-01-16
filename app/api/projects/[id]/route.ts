import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Project from '@/app/models/Projects';

export async function PATCH(
  request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

     const params = await context.params; // ✅ await first
  const id = params.id;                // ✅ then access
    
    // Check if publication exists
    const existingPublication = await Project.findById(id);
    if (!existingPublication) {
      return NextResponse.json(
        { error: 'Publication not found' },
        { status: 404 }
      );
    }

    const updateData = await request.json();
    
    // Validate required fields
    if (!updateData.title || !updateData.year || !updateData.type) {
      return NextResponse.json(
        { error: 'Title, Year, and Type are required fields' },
        { status: 400 }
      );
    }

    // Update the publication
    const updatedPublication = await Project.findByIdAndUpdate(
      id,
      {
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true, runValidators: true }
    );

    if (!updatedPublication) {
      return NextResponse.json(
        { error: 'Failed to update publication' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedPublication,
      message: 'Publication updated successfully',
    });

  } catch (error: any) {
    console.error('Error updating publication:', error);
    
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
        { error: 'Invalid publication ID' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Failed to update publication' },
      { status: 500 }
    );
  }
}