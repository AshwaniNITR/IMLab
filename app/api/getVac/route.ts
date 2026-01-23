// app/api/getVac/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect';
import Vacancy, { IVacancy } from '@/app/models/Vacancy';

// Interface for POST request body
interface VacancyQuery {
  search?: string;
  tags?: string[];
  type?: 'full-time' | 'part-time' | 'contract' | 'internship';
  department?: string;
  activeOnly?: boolean;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'expiryDate' | 'positions.applicationDeadline';
  sortOrder?: 'asc' | 'desc';
}

// GET - Fetch current active vacancy
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Get query parameters from URL
    const searchParams = request.nextUrl.searchParams;
    const activeOnly = searchParams.get('activeOnly') !== 'false';
    const department = searchParams.get('department');
    
    // Build query
    const query: any = {};
    
    if (activeOnly) {
      query.isActive = true;
      query.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ];
    }
    
    if (department) {
      query.department = department;
    }
    
    // Find the most recent active vacancy
    const vacancy = await Vacancy.findOne(query)
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();
    
    if (!vacancy) {
      return NextResponse.json({
        success: true,
        message: 'No active vacancies found',
        data: {
          content: 'No vacancies available at the moment. Please check back later.',
          isActive: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      });
    }
    
    // Format dates for response
    const formattedVacancy = {
      ...vacancy,
      _id: vacancy._id.toString(),
      createdAt: vacancy.createdAt.toISOString(),
      updatedAt: vacancy.updatedAt.toISOString(),
      expiryDate: vacancy.expiryDate?.toISOString(),
      positions: vacancy.positions?.map(pos => ({
        ...pos,
        applicationDeadline: pos.applicationDeadline?.toISOString(),
        salaryRange: pos.salaryRange || undefined
      }))
    };
    
    return NextResponse.json({
      success: true,
      message: 'Vacancy retrieved successfully',
      data: formattedVacancy,
      meta: {
        totalPositions: vacancy.positions?.reduce((sum, pos) => sum + pos.numberOfOpenings, 0) || 0,
        hasExpired: vacancy.expiryDate && new Date(vacancy.expiryDate) < new Date()
      }
    });
    
  } catch (error) {
    console.error('GET Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch vacancy data',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST - Search/filter vacancies with pagination
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    if (!body.content || !body.contactEmail || !body.department) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: content, contactEmail, and department are required'
      }, { status: 400 });
    }

    // Validate positions
    if (!body.positions || body.positions.length === 0) {
      return NextResponse.json({
        success: false,
        message: 'At least one position is required'
      }, { status: 400 });
    }

    // Create new vacancy
    const vacancy = new Vacancy({
      content: body.content,
      isActive: body.isActive ?? true,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
      tags: body.tags || [],
      department: body.department,
      positions: body.positions.map((pos: any) => ({
        title: pos.title,
        description: pos.description,
        requirements: pos.requirements.filter((req: string) => req.trim() !== ''),
        type: pos.type,
        location: pos.location,
        salaryRange: pos.salaryRange?.min && pos.salaryRange?.max ? {
          min: parseFloat(pos.salaryRange.min),
          max: parseFloat(pos.salaryRange.max),
          currency: pos.salaryRange.currency || 'USD'
        } : undefined,
        applicationDeadline: new Date(pos.applicationDeadline),
        numberOfOpenings: parseInt(pos.numberOfOpenings) || 1
      })),
      contactEmail: body.contactEmail,
      applicationInstructions: body.applicationInstructions || 'Please submit your CV and cover letter to the email address provided.'
    });

    // Save to database
    const savedVacancy = await vacancy.save();

    return NextResponse.json({
      success: true,
      message: 'Vacancy created successfully',
      data: {
        id: savedVacancy._id.toString(),
        content: savedVacancy.content,
        isActive: savedVacancy.isActive,
        department: savedVacancy.department,
        createdAt: savedVacancy.createdAt.toISOString()
      }
    }, { status: 201 });

  } catch (error) {
    console.error('CREATE Vacancy Error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Validation error',
        error: error.message
      }, { status: 400 });
    }

    // Handle duplicate key errors
    if (error instanceof Error && 'code' in error && error.code === 11000) {
      return NextResponse.json({
        success: false,
        message: 'Duplicate entry',
        error: error.message
      }, { status: 409 });
    }

    return NextResponse.json({
      success: false,
      message: 'Failed to create vacancy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
// Optional: PUT method to update vacancy (admin only)
export async function PUT(request: NextRequest) {
  try {
    await dbConnect();
    
    // Check for admin authentication (you'd implement this)
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }
    
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json({
        success: false,
        message: 'Vacancy ID is required'
      }, { status: 400 });
    }
    
    const updatedVacancy = await Vacancy.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).select('-__v');
    
    if (!updatedVacancy) {
      return NextResponse.json({
        success: false,
        message: 'Vacancy not found'
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: 'Vacancy updated successfully',
      data: updatedVacancy
    });
    
  } catch (error) {
    console.error('PUT Error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to update vacancy',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}