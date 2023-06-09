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

export async function getUser(id: number) {
  const user = await prisma.user.findFirst({
    where: {
      id: id,
    },
  });
  if (user) return {
    ...user,
    password: undefined,
    token: undefined,
  }
  return null;
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      email: email,
    },
  });
  if(!user) return null;
  if (await byscpt.compare(`!${password}`, user.password)) {
    const token = getJWTToken({ id: user.id, isAdmin: user.isAdmin });
    user.token = token;
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        token,
      },
    });
    return user;
  } else {
    return undefined;
  }
}

// get all users, select their name, id and email
export async function getAllUsers() {
  return prisma.user.findMany({
    select: {
      name: true,
      id: true,
      email: true,
      isAdmin: true,
    },
  });
}
