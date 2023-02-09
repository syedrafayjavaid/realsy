import redirect from "util/redirect";
import {NextApiRequest, NextApiResponse} from "next";

/**
 * Handles an OAuth login
 * Sets the user's auth cookie and redirects the user to their profile page
 */
export default async function oAuthSignInCallback(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Set-Cookie', `apiToken=${req.query.jwt}; ; Path=/, userId=${req.query.userId}; Path=/`);
    if (req.query.newSignUp === 'true') {
        redirect(`/account/profile?newSignup=true`, res);
    }
    else {
        redirect(`/account/dashboard?`, res);
    }
}
