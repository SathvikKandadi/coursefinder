import bcrypt from 'bcrypt';


const saltRounds = 10;

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, saltRounds);
};


export const verifyPassword = async (password:string, hashedPassword:string): Promise<boolean> => {
    return await bcrypt.compare(password, hashedPassword);
}