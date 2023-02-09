import {describe, it} from "@jest/globals";
import {GeoCodingService} from "api/geocoding/geocoding-service";

/**
 * Geocoding service Integration Tests
 * @group integration
 * @group geocoding
 */
describe ('Geocoding Library', () => {
    it ('Geocodes an address', async () => {
        const result = await GeoCodingService.geoCodeAddress('1234 Hickory St. Omaha, NE 68106');
        expect(result.lat).toBeDefined();
        expect(result.lng).toBeDefined();
    });
});
