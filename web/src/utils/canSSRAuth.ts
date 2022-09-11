import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { parseCookies, destroyCookie } from "nookies";
import { AuthTokenError } from '../services/errors/AuthtokenError'

// Função para pagina que só users logados podem ter acesso

export function canSSRAuth<P>(fn: GetServerSideProps<P>) {
    return async (ctx: GetServerSidePropsContext): Promise<GetServerSidePropsResult<P>> => {
        const cookies = parseCookies(ctx);

        const token = cookies['@nextauth.token']  //Se ele tiver token ele deixa proseguir

        if (!token) {  //Se o usuario não tiver token
            return {
                redirect: {
                    destination: '/',
                    permanent: false,
                }
            }
        }
        try {
            return await fn(ctx);
        } catch (err) {  //Deslogando o usuario
            if (err instanceof AuthTokenError) {
                destroyCookie(ctx, '@nextauth.token')

                return {
                    redirect: {
                        destination: '/',
                        permanent: false
                    }
                }
            }

        }

    }
}
