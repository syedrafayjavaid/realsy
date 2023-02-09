/**
 * Permissions for routes will be set according to this file; format: [<controller>, <method>]
 * (permissions are actually on controller methods, not the routes themselves)
 */

export const PUBLIC_ROLE_NAME = 'Public';
export const AUTHENTICATED_ROLE_NAME = 'Authenticated';

export const routePermissions = [
    {
        controller: 'global-content',
        action: 'find',
        allowedRoles: [PUBLIC_ROLE_NAME],
    },
    {
        controller: 'content-page',
        action: 'findbyslug',
        allowedRoles: [PUBLIC_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'find',
        allowedRoles: [PUBLIC_ROLE_NAME, AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'findone',
        allowedRoles: [PUBLIC_ROLE_NAME, AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-profile',
        action: 'oauthcallback',
        allowedRoles: [PUBLIC_ROLE_NAME],
    },
    {
        controller: 'user-profile',
        action: 'userphoto',
        allowedRoles: [PUBLIC_ROLE_NAME, AUTHENTICATED_ROLE_NAME],
    },
    {
        // this is the Docusign completion webhook -- public so Docusign can hit it
        controller: 'user-document',
        action: 'webhookenvelopecomplete',
        allowedRoles: [PUBLIC_ROLE_NAME],
    },
    {
        controller: 'create-listing-micro-content',
        action: 'find',
        allowedRoles: [PUBLIC_ROLE_NAME, AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'micro-content-set',
        action: 'find',
        allowedRoles: [PUBLIC_ROLE_NAME, AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'form',
        action: 'find',
        allowedRoles: [PUBLIC_ROLE_NAME, AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'agent',
        action: 'getmainphoto',
        allowedRoles: [PUBLIC_ROLE_NAME, AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-profile',
        action: 'me',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-profile',
        action: 'updateme',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'getmysaved',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'create',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'setfavorite',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'checkfavorite',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'checkhomevalue',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'getoffers',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'checkoffer',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'checkvisitrequest',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'listing',
        action: 'marktip',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'offer',
        action: 'getsent',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'offer',
        action: 'getsentpending',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'offer',
        action: 'create',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'offer',
        action: 'accept',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'offer',
        action: 'counter',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'offer',
        action: 'decline',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-activity-record',
        action: 'mine',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    // {
    //     controller: 'user-activity-record',
    //     action: 'findmyrequested',
    //     allowedRoles: [AUTHENTICATED_ROLE_NAME],
    // },
    {
        controller: 'user-activity-record',
        action: 'findmine',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-activity-record',
        action: 'checknew',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-activity-record',
        action: 'markseen',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'scheduled-event',
        action: 'requestvisit',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'scheduled-event',
        action: 'findmine',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'scheduled-event',
        action: 'findmyrequested',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'chat',
        action: 'newmessage',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'chat',
        action: 'findmine',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-document',
        action: 'create',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-document',
        action: 'find',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-document',
        action: 'delete',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-document',
        action: 'findone',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-document',
        action: 'getsigningurl',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'agent',
        action: 'getdefault',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'upload',
        action: 'upload',
        plugin: 'upload',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'scheduled-event',
        action: 'create',
        allowedRoles: process.env.NODE_ENV === 'test' ? [PUBLIC_ROLE_NAME] : [],
    },
    {
        controller: 'user-notifications',
        action: 'find',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-notifications',
        action: 'delete',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
    {
        controller: 'user-notifications',
        action: 'deletemany',
        allowedRoles: [AUTHENTICATED_ROLE_NAME],
    },
];
