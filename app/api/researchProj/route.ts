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


export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const formData = await request.formData();
    
    // Extract all projects from form data
    const projects: ProjectInput[] = [];
    let index = 0;
    
    while (true) {
      const name = formData.get(`projects[${index}][name]`) as string;
      // If no name at this index, we've processed all projects
      if (!name) break;

      const status = formData.get(`projects[${index}][status]`) as string;
      const description = formData.get(`projects[${index}][description]`) as string;
      const photo = formData.get(`projects[${index}][photo]`) as File;

      // Validation for this project
      if (!name || !photo || !status || !description) {
        return NextResponse.json(
          { error: `Missing required fields for project ${index + 1}` },
          { status: 400 }
        );
      }

      // Validate status
      if (!['ongoing', 'completed'].includes(status)) {
        return NextResponse.json(
          { error: `Invalid status for project ${index + 1}. Must be "ongoing" or "completed"` },
          { status: 400 }
        );
      }

      projects.push({
        name,
        status,
        description,
        photo,
      });
      
      index++;
    }

    if (projects.length === 0) {
      return NextResponse.json(
        { error: 'No projects to add' },
        { status: 400 }
      );
    }

    // Process all projects in parallel
    const createdProjects = await Promise.all(
      projects.map(async (project) => {
        try {
          // Upload image to Cloudinary
          const { url } = await uploadToCloudinary(project.photo);

          // Create project
          return await RProject.create({
            name: project.name,
            status: project.status,
            description: project.description,
            imageUrl: url,
          });
        } catch (error) {
          console.error(`Error creating project ${project.name}:`, error);
          throw error;
        }
      })
    );

    return NextResponse.json(
      { 
        success: true, 
        data: createdProjects,
        message: `Successfully added ${createdProjects.length} project(s)` 
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Error creating projects:', error);
    
    // Handle specific error types
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { error: 'Validation error: ' + error.message },
        { status: 400 }
      );
    }
    
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate project name found' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: error.message || 'Failed to create projects' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : 20;
    const page = searchParams.get('page') ? parseInt(searchParams.get('page')!) : 1;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: any = {};
    
    if (status && ['ongoing', 'completed'].includes(status)) {
      filter.status = status;
    }
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    // Fetch projects with pagination
    const [projects, total] = await Promise.all([
      RProject.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      RProject.countDocuments(filter),
    ]);

    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return NextResponse.json({
      success: true,
      data: projects,
      pagination: {
        total,
        totalPages,
        currentPage: page,
        hasNextPage,
        hasPreviousPage,
        limit,
      },
    });
  } catch (error: any) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}