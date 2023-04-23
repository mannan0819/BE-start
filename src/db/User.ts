import { getJWTToken } from "../helpers/jwt";
import { prisma } from "./PrismaClient";

export async function createAdmin() {
  const token =  getJWTToken({ id: 1, isAdmin: true });
  console.log('token');
  console.log(token);
  return prisma.user.create({
    data: {
      name: "mannan",
      email: "tes@test.com",
      password: "mannan",
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
  if (user && user?.password === password) {
    return {user, token: getJWTToken(user)};
  } else {
    return "wrong password";
  }
}
