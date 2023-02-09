import Router from 'next/router';
import {ServerResponse} from "http";

/**
 * Handles user redirects, both on client-side and during server-side rendering
 */
export default function redirect(
    newPath: string,
    res?: ServerResponse,
    httpStatus = 302
) {
    if (!newPath) {
        return;
    }

    if (process.browser) {
        Router.push(newPath);
    }
    else if (res) {
        res.writeHead(httpStatus, { Location: newPath });
        res.end();
    }
}
