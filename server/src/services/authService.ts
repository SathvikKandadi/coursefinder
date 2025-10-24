import { prisma } from "../prisma/client"
import { hashPassword, verifyPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/jwt";


export const signupService = async (email:string, password:string, name:string) => {
    try {
        const existingUser = await prisma.user.findUnique({where:{email}});
        if(existingUser)
            return null;

        const hashedPassword = await hashPassword(password);

        const user = await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                name,
            },
        })

        const token = generateToken(user.id);

        return { user, token };

    } catch (error) {
        console.error({message:"Error while creating a user",error});
        return null;
    }
}

export const loginService = async (email:string, password:string) => {
    try {
        const user = await prisma.user.findUnique({where:{email}});
        if(!user)
            return null;

        const hashedPassword = user.password;

        const result = await verifyPassword(password,hashedPassword);
        
        if(!result)
            return null;

        const token = generateToken(user.id);

        return token;

    } catch (error) {
        console.error({message:"Error while trying to login",error});
        return null;
    }
}