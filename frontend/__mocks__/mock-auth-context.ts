import {AuthContextInterface} from "api/auth/auth-context";

/**
 * Generates a mock auth context with the given overrides
 */
export const mockAuthContext = (overrides: Partial<AuthContextInterface> = {}): AuthContextInterface => {
    const defaultContext: AuthContextInterface = {
        isSignedIn: false,
        getStarted: () => {},
        signIn: () => {},
        showSignIn: () => {},
        signOut: () => {},
        clearAuthStatus: () => {},
        setProfile: () => {},
        checkListingFavorited: () => false,
        setListingFavorited: () => {},
    };

    return {
        ...defaultContext,
        ...overrides,
    };
}
