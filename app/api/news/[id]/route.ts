import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app//lib/dbConnect';
import News, { INews } from '@/app/models/News';
import mongoose from 'mongoose';

// GET handler to fetch a single news item by ID
export async function GET(
  request: NextRequest,
   context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const params = await context.params; // ✅ await first
     const id = params.id;   
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid news ID format' 
        },
        { status: 400 }
      );
    }
    
    // Find news by ID
    const news = await News.findById(id).select('-__v').lean();
    
    if (!news) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'News not found' 
        },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: news
    });
    
  } catch (error) {
    console.error('Error fetching news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// PATCH handler to update a news item
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
     const params = await context.params; // ✅ await first
     const id = params.id;   
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid news ID format' 
        },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    
    // Check if news exists
    const existingNews = await News.findById(id);
    
    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'News not found' 
        },
        { status: 404 }
      );
    }
    
    // Prepare update data
    const updateData: Partial<INews> = {};
    
    // Validate and add fields if provided
    if (body.title !== undefined) {
      if (typeof body.title !== 'string' || body.title.trim() === '') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Title must be a non-empty string' 
          },
          { status: 400 }
        );
      }
      updateData.title = body.title.trim();
    }
    
    if (body.description !== undefined) {
      if (typeof body.description !== 'string' || body.description.trim() === '') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Description must be a non-empty string' 
          },
          { status: 400 }
        );
      }
      updateData.description = body.description.trim();
    }
    
    if (body.date !== undefined) {
      const parsedDate = new Date(body.date);
      if (isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid date format' 
          },
          { status: 400 }
        );
      }
      updateData.date = parsedDate;
    }
    
    // Check if there's any data to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No fields to update provided' 
        },
        { status: 400 }
      );
    }
    
    // Update the news item
    const updatedNews = await News.findByIdAndUpdate(
      id,
      { $set: updateData },
      { 
        new: true, // Return the updated document
        runValidators: true, // Run schema validators
        context: 'query' 
      }
    ).select('-__v');
    
    return NextResponse.json({
      success: true,
      data: updatedNews,
      message: 'News updated successfully'
    });
    
  } catch (error) {
    console.error('Error updating news:', error);
    
    // Handle validation errors
    if (error instanceof Error) {
      if (error.name === 'ValidationError') {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Validation error',
            details: error.message 
          },
          { status: 400 }
        );
      }
      
      // Handle MongoDB duplicate key error
      if ((error as any).code === 11000) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Duplicate entry',
            details: 'A news item with similar data already exists' 
          },
          { status: 409 }
        );
      }
    }
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to update news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// DELETE handler to remove a news item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    
    const params = await context.params; // ✅ await first
    const id = params.id;
    
    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid news ID format' 
        },
        { status: 400 }
      );
    }
    
    // Check if news exists
    const existingNews = await News.findById(id);
    
    if (!existingNews) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'News not found' 
        },
        { status: 404 }
      );
    }
    
    // Delete the news item
    await News.findByIdAndDelete(id);
    
    return NextResponse.json({
      success: true,
      message: 'News deleted successfully',
      data: {
        id,
        title: existingNews.title
      }
    });
    
  } catch (error) {
    console.error('Error deleting news:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to delete news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}