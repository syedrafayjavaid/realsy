const {MockHomeJunctionService} = require("api/home-junction/mock-home-junction-service");

/**
 * @group unit
 * @group home-junction
 */
describe ('Mock Home Junction Service', () => {
    it ('provides mocked home valuations', async () => {
        const mockService = new MockHomeJunctionService();
        const response = await mockService.getHomeValue('1234 Hickory St', 'Omaha', 'NE', '68105');
        expect(response.result.valuations).toBeDefined();
    });

    it ('allows override bedroom and bathroom counts', async () => {
        const mockService = new MockHomeJunctionService();
        const initialResult = await mockService.getHomeValue('1234 Hickory St', 'Omaha', 'NE', '68105');
        const overrideResult = await mockService.getHomeValue('1234 Hickory St', 'Omaha', 'NE', '68105', {
            overrideBedroomCount: 9,
            overrideBathroomCount: 9,
        });

        expect(overrideResult.result.valuations.default.EMV).toBeGreaterThan(initialResult.result.valuations.default.EMV);
    });
});
