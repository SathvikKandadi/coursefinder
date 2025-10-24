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

export const getCourseByIdService = async (id:number) => {
    try {
        const course = await prisma.course.findUnique({
            where:{id},
            include:{
                university:{
                    select:{
                        id:true,
                        name:true,
                        country:true,
                        website:true
                    }
                }
            }
        });
    
        return course;
    } catch (error) {
        console.error({ message: "Error fetching course", error });
    return null;
    }
    
}

export const getCoursesService = async (filters:CourseFilters) => {
    try {

      const queryKey = cacheService.generateQueryKey(filters);

      const shouldCache = await cacheService.trackQueryFrequency(queryKey);

      if(shouldCache)
      {
        const cachedResults = await cacheService.getCachedResults(queryKey);

        if(cachedResults) return cachedResults;
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

export const getCoursesByUniversityService = async(universityId:number, filters:CourseFilters) => {
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

        if(q)
        {
            where.OR = [
                { title:{contains:q, mode:'insensitive'} },
                { description:{contains:q, mode:'insensitive'}}
            ];
        }

        if(degree)
        {
            where.degree = {equals:degree, mode:'insensitive'};
        }

        if(feesMin !== undefined || feesMax !== undefined) {
            where.fees = {};
            if(feesMin !== undefined) where.fees.gte = feesMin;
            if(feesMax !== undefined) where.fees.lte = feesMax;
        }

        if(duration) {
            where.duration = duration;
        }

        const orderBy:any = {};
        if(sort === 'fees') {
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
            orderBy.title === 'asc';
        }
        else {
            orderBy.createdAt = 'desc';
        }

        const skip = (page -1) * limit;

        const [courses, total] = await Promise.all([
            prisma.course.findMany({
                where,
                include:{
                    university:{
                        select:{
                            id:true,
                            name:true,
                            country:true,
                            website:true
                        }
                    }
                },
                orderBy,
                skip,
                take:limit
            }),
            prisma.course.count({where})
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
        console.error({message: 'Error fetching university courses', error});
        return null;
    }
}