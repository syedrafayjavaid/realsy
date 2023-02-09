import {NextPage} from "next";

/**
 * Adds extra static properties to pages
 */
export type AppPage<PropType = {}> = NextPage<PropType>
    & {
        defaultLayout?: ({globalContent}: {globalContent: any}) => any,
        requiresAuth?: boolean,
    };
