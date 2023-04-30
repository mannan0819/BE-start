import { getJWTToken } from "../helpers/jwt";
import { prisma } from "./PrismaClient";
import byscpt from "bcrypt";

export async function createAdmin() {
  const token =  getJWTToken({ id: 1, isAdmin: true });
  console.log('token');
  console.log(token);
  return prisma.user.create({
    data: {
      name: "mannan",
      email: "tes@test.com",
      password: await byscpt.hash("!mannan ", 10),
      isAdmin: true,
      token,
    },
  });
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  console.log('user');
  console.log(user);
  if(!user) return null;
  if (await byscpt.compare(`!${password}`, user.password)) {
    console.log('approved')
    return {user, token: getJWTToken(user)};
  } else {
    return undefined;
  }
}
