import {NextRouter} from "next/router";

/**
 * Clears query parameters from the router without triggering full page transition - just current page rerender
 * (useful for showing/hiding modals based on query params)
 *
 * @param clearParams
 * @param router
 */
export function clearSoftQueryParams(clearParams: string[], router: NextRouter) {
    const basePath = router.asPath.split('?')[0].split('#')[0] || '';
    const hashPath = router.asPath.match(/#([a-z0-9]+)/gi) || '';
    const params = new URLSearchParams(router.asPath.split('?')[1]);

    let didClearParams = false;
    clearParams.forEach(param => {
        if (params.has(param)) {
            params.delete(param);
            didClearParams = true;
        }
    });

    if (didClearParams) {
        return router.push(
            router.pathname + `?${params.toString()}` + hashPath,
            basePath + `?${params.toString()}` + hashPath,
            {shallow: true}
        );
    }
}
