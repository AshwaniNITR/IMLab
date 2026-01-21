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
    
    const body: VacancyQuery = await request.json();
    
    const {
      search,
      tags,
      type,
      department,
      activeOnly = true,
      page = 1,
      limit = 10,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = body;
    
    // Build query
    const query: any = {};
    
    // Active vacancies filter
    if (activeOnly) {
      query.isActive = true;
      query.$or = [
        { expiryDate: { $exists: false } },
        { expiryDate: { $gt: new Date() } }
      ];
    }
    
    // Text search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Tag filter
    if (tags && tags.length > 0) {
      query.tags = { $all: tags.map(tag => tag.toLowerCase()) };
    }
    
    // Department filter
    if (department) {
      query.department = department;
    }
    
    // Position type filter
    if (type) {
      query['positions.type'] = type;
    }
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Determine sort order
    const sort: any = {};
    sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
    
    // Execute query with pagination
    const [vacancies, total] = await Promise.all([
      Vacancy.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .select('-__v')
        .lean(),
      Vacancy.countDocuments(query)
    ]);
    
    // Format response
    const formattedVacancies = vacancies.map(vacancy => ({
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
    }));
    
    // Calculate total openings across all returned vacancies
    const totalOpenings = vacancies.reduce((sum, vacancy) => {
      return sum + (vacancy.positions?.reduce((posSum, pos) => 
        posSum + (pos.numberOfOpenings || 1), 0) || 0);
    }, 0);
    
    return NextResponse.json({
      success: true,
      message: vacancies.length > 0 
        ? 'Vacancies retrieved successfully' 
        : 'No vacancies found matching your criteria',
      data: formattedVacancies,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
        totalOpenings,
        filtersApplied: {
          search,
          tags,
          type,
          department,
          activeOnly
        }
      }
    });
    
  } catch (error) {
    console.error('POST Error:', error);
    
    // Handle validation errors
    if (error instanceof Error && error.name === 'ValidationError') {
      return NextResponse.json({
        success: false,
        message: 'Invalid query parameters',
        error: error.message
      }, { status: 400 });
    }
    
    return NextResponse.json({
      success: false,
      message: 'Failed to search vacancies',
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