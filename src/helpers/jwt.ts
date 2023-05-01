import { Context } from "koa";
import jwt from 'jsonwebtoken';

export const validateAndReturnUSER = async (ctx: Context, expires: boolean = false): Promise<any | undefined> => {
  const userJWT = ctx.state.userJWT ? ctx.state.userJWT : ctx.cookies.get('userToken');
  console.log('userJWT')
  console.log(userJWT)

  if (userJWT === undefined || userJWT === '') {
    return undefined;
  }

  const pem = process.env.JWT_SECRET as string;

  try {
    return jwt.verify(userJWT, pem);
  } catch (e: any) {
    ctx.throw(401, e);
  }
};

function isValidUserData(userData: object | any) {
  const { id } = userData;
  if (typeof id !== 'undefined') {
    return true;
  }
  return false;
}

export const getJWTToken = (userData: object | any) => 
{
  console.log('GETTING THE TOKEN');
    return jwt.sign({
      data: {
        userid: userData.id,
        isAdmin: userData.isAdmin,
      },
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
    }, process.env.JWT_SECRET ?? '');
  }
