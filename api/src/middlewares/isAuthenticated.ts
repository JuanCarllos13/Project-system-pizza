import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
  sub: string; // Id do usuario
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Receber o Token

  const authtoken = req.headers.authorization; // O Token sempre vem na requisão e no cabeçalho e da authorization

  if (!authtoken) {
    // Se não tiver token ele retorna erro
    return res.status(401).end(); //Parando o usuario
  }
  // console.log(authtoken)

  const [, token] = authtoken.split(" "); //Dividindo o authtoken em um array, ignorano a primeria palavra antes o espaço e só aceitando o token

  try {
    //Validar o token
    const { sub } = verify(token, process.env.JWT_SECRET) as Payload; // Pegando a chave screta do arquivo env

    //Recuperar o id do token dentro de uma variavel user_id dentro do req.
    req.user_id = sub;

    return next(); // Pra não deixar a aplicação parar
  } catch (err) {
    return res.status(401).end(); //Não autorizado
  }
}
