import { success } from "zod";
import { prisma } from "../prisma/client";
import { error } from "console";
import { da } from "zod/v4/locales";

export const createUniversityService = async (data: {
    name: string;
    country: string;
    website?: string;
}) => {
    try {
        
        const existingUniversity = await prisma.university.findFirst({
            where: {
                name: {equals: data.name, mode: 'insensitive'},
                country: {equals: data.country, mode: 'insensitive'}
            }
        });

        if(existingUniversity) {
            return {
                success: false,
                error: 'University with this name and country already exists'
            };
        }

        const university = await prisma.university.create({
            data:{
                name:data.name,
                country:data.country,
                website: data.website || null
            }
        })

        // Invalidate cache for university

        // cacheService.invalidateCache('university');

        return { success: true, data: university };

    } catch (error:any) {
        console.error({ message: "Error creating university", error });
    return { success: false, error: error.message || 'Failed to create university' };
    }
}