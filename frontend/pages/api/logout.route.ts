import redirect from "util/redirect";
import {NextApiRequest, NextApiResponse} from "next";

/**
 * Handles a user login request.
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
export default async function handleUserLogin(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', `apiToken=; Path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`);
    redirect('/', res);
}
