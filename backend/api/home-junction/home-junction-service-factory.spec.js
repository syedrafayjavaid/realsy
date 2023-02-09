import {
    HomeJunctionServiceFactory,
    MOCK_HOME_JUNCTION_CONFIG_KEY
} from "api/home-junction/home-junction-service-factory";
import {HomeJunctionService} from "api/home-junction/home-junction-service";
import {MockHomeJunctionService} from "api/home-junction/mock-home-junction-service";

/**
 * @group unit
 */
describe ('Home Junction Service Factory', () => {
    let savedEnv;

    beforeEach(() => {
        savedEnv = process.env[MOCK_HOME_JUNCTION_CONFIG_KEY];
    });

    afterEach(() => {
        process.env[MOCK_HOME_JUNCTION_CONFIG_KEY] = savedEnv;
    });

    it ('constructs Home Junction Services if not configured to mock in environment', () => {
        process.env[MOCK_HOME_JUNCTION_CONFIG_KEY] = 'false';
        const factory = new HomeJunctionServiceFactory();
        const result = factory.getServiceForEnv({licenseKey: ''});
        expect(result instanceof HomeJunctionService).toBe(true);
    });

    it ('constructs mock Home Junction Services if configured in environment', () => {
        process.env[MOCK_HOME_JUNCTION_CONFIG_KEY] = 'true';
        const factory = new HomeJunctionServiceFactory();
        const result = factory.getServiceForEnv({licenseKey: ''});
        expect(result instanceof MockHomeJunctionService).toBe(true);
    });
});
