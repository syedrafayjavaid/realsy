/**
 * Geocodes a given address
 *
 * @param address
 * @param fullResponse
 * @returns {Promise<{lng: *, lat: *}>}
 * @private
 */
export async function geocodeAddress(address: string, fullResponse = false) {
    const geoCoder = new (window as any).google.maps.Geocoder();
    return new Promise((resolve, reject) => {
        geoCoder.geocode({address}, (results: any, status: any) => {
            if (status === 'OK') {
                if (fullResponse) {
                    resolve(results[0]);
                }
                else {
                    resolve({
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    });
                }
            } else {
                reject();
            }
        });
    });
}
