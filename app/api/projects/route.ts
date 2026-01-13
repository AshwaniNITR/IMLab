import { NextRequest, NextResponse } from 'next/server';
import Project from '@/app/models/Projects';
import { Types } from 'mongoose';
import dbConnect from '@/app/lib/dbConnect';

// POST: Create new projects (multiple)
export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { projects } = body;
    console.log('Received projects:', projects);

    // Validate request body
    if (!projects || !Array.isArray(projects) || projects.length === 0) {
      return NextResponse.json(
        { error: 'Projects array is required and cannot be empty' },
        { status: 400 }
      );
    }

    // Validate each project
    const currentYear = new Date().getFullYear();
    const validTypes = ['Journal', 'Conference', 'book-chapter', 'patent'];
    
    for (let i = 0; i < projects.length; i++) {
      const project = projects[i];
      
      if (!project.title || typeof project.title !== 'string') {
        return NextResponse.json(
          { error: `Project ${i + 1}: Title is required and must be a string` },
          { status: 400 }
        );
      }
      
      if (!project.type || !validTypes.includes(project.type)) {
        return NextResponse.json(
          { error: `Project ${i + 1}: Type must be one of: J, C, book-chapter, patent` },
          { status: 400 }
        );
      }
      project.author = project.author || 'Unknown Author';
      
      if (!project.year || isNaN(Number(project.year))) {
        return NextResponse.json(
          { error: `Project ${i + 1}: Year is required and must be a number` },
          { status: 400 }
        );
      }
      
      const yearNum = parseInt(project.year);
      if (yearNum < 1900 || yearNum > currentYear + 1) {
        return NextResponse.json(
          { error: `Project ${i + 1}: Year must be between 1900 and ${currentYear + 1}` },
          { status: 400 }
        );
      }
      
      // Truncate title if too long
      if (project.title.length > 200) {
        project.title = project.title.substring(0, 200);
      }
    }

    // Create projects
    const createdProjects = await Project.insertMany(projects);
    console.log('Created projects:', createdProjects);

    return NextResponse.json({
      message: `${createdProjects.length} project(s) created successfully`,
      projects: createdProjects,
      count: createdProjects.length,
    }, { status: 201 });

  } catch (error: any) {
    console.error('Error creating projects:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { error: 'Duplicate project found' },
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
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET: Retrieve all projects with optional filtering
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const year = searchParams.get('year');
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    // Build query
    const query: any = {};
    
    if (type) {
      query.type = type;
    }
    
    if (year) {
      query.year = parseInt(year);
    }
    
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const [projects, total] = await Promise.all([
      Project.find(query)
        .sort({ year: -1, createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Project.countDocuments(query),
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

  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}