import { Course } from "@prisma/client";
import { prisma } from "../prisma/client"
import { cacheService } from "./cacheService";


interface CourseFilters {
  q?: string;
  country?: string;
  degree?: string;
  feesMin?: number;
  feesMax?: number;
  duration?: number;
  page?: number;
  limit?: number;
  sort?: string;
}

export const getCourseByIdService = async (id: number) => {
  try {

    const cachedResults = await cacheService.getCachedResults(`course:${id}`);
    if (cachedResults) {
      return cachedResults;
    }
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        university: {
          select: {
            id: true,
            name: true,
            country: true,
            website: true
          }
        }
      }
    });

    await cacheService.cacheQueryResults(`course:${id}`, course, 86400);

    return course;
  } catch (error) {
    console.error({ message: "Error fetching course", error });
    return null;
  }

}

export const getCoursesService = async (filters: CourseFilters) => {
  try {

    const queryKey = cacheService.generateQueryKey(filters);

    const cachedIds = await cacheService.getCachedCourseIds(queryKey);

    if (cachedIds) {
      const { page = 1, limit = 10 } = filters;
      const start = (page - 1) * limit;
      const end = start + limit;
      const pageIds = cachedIds.slice(start, end);

      const courses = await Promise.all(
        pageIds.map(id => getCourseByIdService(id))
      )

      return {
        courses: courses.filter(Boolean) as Course[],
        pagination: {
          page,
          limit,
          total: cachedIds.length,
          totalPages: Math.ceil(cachedIds.length / limit),
          hasNext: end < cachedIds.length,
          hasPrev: start > 0
        }
      }
    }

    const {
      q,
      country,
      degree,
      feesMin,
      feesMax,
      duration,
      page = 1,
      limit = 10,
      sort = 'createdAt'
    } = filters;

    const where: any = {};

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { university: { name: { contains: q, mode: 'insensitive' } } }
      ];
    }

    if (country) {
      where.country = { equals: country, mode: 'insensitive' };
    }

    if (degree) {
      where.degree = { equals: degree, mode: 'insensitive' };
    }

    if (feesMin !== undefined || feesMax !== undefined) {
      where.fees = {};
      if (feesMin !== undefined) where.fees.gte = feesMin;
      if (feesMax !== undefined) where.fees.lte = feesMax;
    }

    if (duration) {
      where.duration = duration;
    }

    // Build orderBy clause
    const orderBy: any = {};
    if (sort === 'fees') {
      orderBy.fees = 'asc';
    } else if (sort === '-fees') {
      orderBy.fees = 'desc';
    } else if (sort === 'duration') {
      orderBy.duration = 'asc';
    } else if (sort === '-duration') {
      orderBy.duration = 'desc';
    } else if (sort === 'title') {
      orderBy.title = 'asc';
    } else {
      orderBy.createdAt = 'desc';
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Get courses with count
    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          university: {
            select: {
              id: true,
              name: true,
              country: true,
              website: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.course.count({ where })
    ]);

    const courseIds = courses.map(c => c.id);

    const shouldCache = await cacheService.trackQueryFrequency(queryKey);


    if (shouldCache) {
      await cacheService.cacheCourseIds(queryKey, courseIds);
    }

    return {
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error({ message: "Error fetching courses", error });
    return null;
  }

}

export const getCoursesByUniversityService = async (universityId: number, filters: CourseFilters) => {
  try {
    const {
      q,
      degree,
      feesMin,
      feesMax,
      duration,
      page = 1,
      limit = 10,
      sort = 'createdAt'
    } = filters;

    const where: any = {
      universityId
    };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (degree) {
      where.degree = { equals: degree, mode: 'insensitive' };
    }

    if (feesMin !== undefined || feesMax !== undefined) {
      where.fees = {};
      if (feesMin !== undefined) where.fees.gte = feesMin;
      if (feesMax !== undefined) where.fees.lte = feesMax;
    }

    if (duration) {
      where.duration = duration;
    }

    const orderBy: any = {};
    if (sort === 'fees') {
      orderBy.fees = 'asc';
    }
    else if (sort === '-fees') {
      orderBy.fees = 'desc';
    }
    else if (sort === 'duration') {
      orderBy.duration = 'asc';
    }
    else if (sort === '-duration') {
      orderBy.duration = 'desc';
    }
    else if (sort === 'title') {
      orderBy.title = 'asc';
    }
    else {
      orderBy.createdAt = 'desc';
    }

    const skip = (page - 1) * limit;

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where,
        include: {
          university: {
            select: {
              id: true,
              name: true,
              country: true,
              website: true
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.course.count({ where })
    ]);

    return {
      courses,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1
      }
    };
  } catch (error) {
    console.error({ message: 'Error fetching university courses', error });
    return null;
  }
}

export const createCourseService = async(data: {
  title: string;
  description: string;
  universityId: number;
  degree: string;
  duration: number;
  fees: number;
  country: string;
  eligibility?: any;
})  => {
  try {
    
    const university = await prisma.university.findUnique({
      where: {id: data.universityId}
    })

    if(!university)
    {
      return {success:false, error: 'University not found'};
    }

    const course = await prisma.course.create({
      data:{
        title: data.title,
        description: data.description,
        universityId: data.universityId,
        degree: data.degree,
        duration: data.duration,
        fees: data.fees,
        country: data.country,
        eligibility: data.eligibility || null
      },
      include: {
        university: {
          select:{
            id:true,
            name:true,
            country:true,
            website: true
          }
        }
      }
    })

    // Invalide Cache
    //cacheService.invalidateCache('course');
    
    return {success: true, data: course};
  } catch (error:any) {
    console.error({message: "Error creating course", error});
    return {success: false, error: error.message || 'Failed to create course'};
  }
}