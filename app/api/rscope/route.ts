import { NextRequest, NextResponse } from 'next/server';
import RScope from '@/app/models/ResearchScope'; // Update import
import dbConnect from '@/app/lib/dbConnect';

// POST: Create new RScope projects (multiple)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { projects } = body;
    console.log('Received RScope projects:', projects);

    // Validate request body
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json(
        { error: 'Projects array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate each project according to RScope schema
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      
      // Check required fields
      const requiredFields = ['imageUrlOne', 'title', 'brief', 'description', 'imageUrlTwo'];
      for (const field of requiredFields) {
        if (!project[field] || typeof project[field] !== 'string') {
          return NextResponse.json(
            { error: `Project ${i + 1}: ${field} is required and must be a string` },
            { status: 400 }
          );
        }
      }

      // Validate brief length (max 2000 characters)
      if (project.brief.length > 2000) {
        return NextResponse.json(
          { error: `Project ${i + 1}: Brief cannot exceed 2000 characters` },
          { status: 400 }
        );
      }

      // Validate image URLs (basic URL validation)
      const imageFields = ['imageUrlOne', 'imageUrlTwo'];
      for (const field of imageFields) {
        if (!project[field].startsWith('http') && !project[field].startsWith('data:image')) {
          return NextResponse.json(
            { error: `Project ${i + 1}: ${field} must be a valid URL or base64 image data` },
            { status: 400 }
          );
        }
      }

      // Truncate title if too long
      if (project.title.length > 200) {
        project.title = project.title.substring(0, 200);
      }
    }

    // Create projects
    const createdProjects = await RScope.insertMany(projects);
    console.log('Created RScope projects:', createdProjects);

    return NextResponse.json({
      message: `${createdProjects.length} RScope project(s) created successfully`,
      projects: createdProjects,
      count: createdProjects.length,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating RScope projects:', error);
    
    // Handle duplicate key errors (if you have unique constraints)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return NextResponse.json(
        { error: `Duplicate value found for field: ${field}` },
        { status: 409 }
      );
    }
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation error', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// GET: Retrieve all RScope projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (search) {
      // Search in title, brief, and description
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { brief: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Execute query with pagination
    const [projects, total] = await Promise.all([
      RScope.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RScope.countDocuments(query),
    ]);

    return NextResponse.json({
      projects,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    });

  } catch (error: any) {
    console.error('Error fetching RScope projects:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update a RScope project
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Validate brief length if provided
    if (updateData.brief && updateData.brief.length > 2000) {
      return NextResponse.json(
        { error: 'Brief cannot exceed 2000 characters' },
        { status: 400 }
      );
    }

    const updatedProject = await RScope.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project updated successfully',
      project: updatedProject,
    });

  } catch (error: any) {
    console.error('Error updating RScope project:', error);
    
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { error: 'Validation error', details: errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Delete a RScope project
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const deletedProject = await RScope.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Project deleted successfully',
      project: deletedProject,
    });

  } catch (error: any) {
    console.error('Error deleting RScope project:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}