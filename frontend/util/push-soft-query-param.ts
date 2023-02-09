import {NextRouter} from "next/router";

/**
 * Pushes query parameters to the router without triggering full page transition (just current page rerender)
 * @param newParams
 * @param router
 */
export async function pushSoftQueryParams(newParams: any, router: NextRouter) {
    const basePath = router.asPath.split('?')[0].split('#')[0] || '';
    const hashPath = router.asPath.match(/#([a-z0-9]+)/gi ) || '';
    const params = new URLSearchParams(router.asPath.split('?')[1]);
    for (const property in newParams) {
        params.set(property, newParams[property]);
    }
    return router.push(
        router.pathname + `?${params.toString()}` + hashPath,
        basePath + `?${params.toString()}` + hashPath,
        {shallow: true}
    );
}
