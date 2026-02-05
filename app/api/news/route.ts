import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/app/lib/dbConnect'; // Assuming you have a dbConnect utility
import News, { INews } from '@/app/models/News'; // Adjust path as needed

// GET handler to fetch news
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'date';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    
    const skip = (page - 1) * limit;
    const sortOptions: Record<string, any> = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
    
    let query = {};
    
    // Add text search if provided
    if (search) {
      query = {
        $text: { $search: search }
      };
    }
    
    // Get total count for pagination
    const total = await News.countDocuments(query);
    
    // Fetch news with pagination and sorting
    const news = await News.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .select('-__v') // Exclude version key
      .lean();
    
    return NextResponse.json({
      success: true,
      data: news,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
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

// POST handler to create news
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const body = await request.json();
    
    // Validate required fields
    const { title, description, date } = body;
    
    if (!title || !description || !date) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields: title, description, and date are required' 
        },
        { status: 400 }
      );
    }
    
    // Validate date format
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid date format' 
        },
        { status: 400 }
      );
    }
    
    // Create new news
    const newsData: Partial<INews> = {
      title,
      description,
      date: parsedDate,
    };
    
    const news = await News.create(newsData);
    
    // Convert to plain object and remove version key
    const newsObject = news.toObject();
    delete newsObject.__v;
    
    return NextResponse.json({
      success: true,
      data: newsObject,
      message: 'News created successfully'
    }, { status: 201 });
    
  } catch (error) {
    console.error('Error creating news:', error);
    
    // Handle duplicate key errors or validation errors
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
        error: 'Failed to create news',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}