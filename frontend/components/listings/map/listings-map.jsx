import React, {useEffect, useState} from 'react';
import {arrayOf, number} from 'prop-types';
import Listings from 'api/listings';
import ListingThumbnail from "components/listings/thumbnail";
import ArrowUpIcon from "components/icons/arrow-up";
import ArrowDownIcon from "components/icons/arrow-down";
import {Button} from "components/button";
import {useListingsMapStyles} from './listings-map.styles';
import PlacesAutocomplete from 'react-places-autocomplete';
import {geocodeAddress} from "util/geocode-address";
import {pushSoftQueryParams} from "util/push-soft-query-param";
import {useRouter} from "next/router";
import {Loader} from "components/loader";
import Colors from "styles/colors";
import {clearSoftQueryParams} from "util/clear-soft-query-param";
import {GoogleMap, OverlayView} from '@react-google-maps/api';
import {useViewListingContext} from "contexts/view-listing-context";
import MapMarker from "./marker";
import {googleMapStyles} from "components/listings/map/google-map-styles";
import CreatableSelect from "components/form-fields/select/creatable-select";
import Select from "components/form-fields/select";
import {formatCurrency} from "util/format-currency";
import MobileFiltersForm from "components/listings/map/mobile-filters-form";
import {numericCharsOnly} from "util/numeric-chars-only";
import {Modal} from "components/modal";
import {ApiClient} from "api/api-client";

const MAP_STATE_STORAGE_KEY = 'listings-map-state'; // local storage key for listings map saved state
const CENTER_OF_US = {lat: 38.41202999999999, lng: -94.15477};
const DEFAULT_MAP_CENTER = CENTER_OF_US;
const DEFAULT_MAP_ZOOM = 4;

/**
 * An interactive map of home listings
 */
const ListingsMap = (props) => {
    const router = useRouter();
    const styleClasses = useListingsMapStyles(props);
    const viewListingContext = useViewListingContext();
    const [listings, setListings] = useState([]);
    const [loadingListings, setLoadingListings] = useState(true);
    const [showSideBySide, setShowSideBySide] = useState(true);
    const [showFiltersModal, setShowFiltersModal] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [googleMap, setGoogleMap] = useState(null);
    const [geoLocating, setGeoLocating] = useState(false);
    const [minPriceOptions, setMinPriceOptions] = useState(props.minPriceOptions);
    const [maxPriceOptions, setMaxPriceOptions] = useState(props.maxPriceOptions);

    const minPrice = parseInt(router.query.minPrice) ? parseInt(router.query.minPrice) : null;
    const maxPrice = parseInt(router.query.maxPrice) ? parseInt(router.query.maxPrice) : null;
    const minPriceOptionsWithAny = [{value: null, label: 'Min: Any'}].concat(
        minPriceOptions.map(price => (
            {
                value: price,
                label: 'Min: ' + formatCurrency(price, {omitDecimal: true}),
                isDisabled: maxPrice && maxPrice <= price,
            }
        ))
    );
    if (minPrice && !minPriceOptions.includes(minPrice)) {
        minPriceOptionsWithAny.push({value: minPrice, label: 'Min: ' + formatCurrency(minPrice, {omitDecimal: true})});
    }
    const maxPriceOptionsWithAny = maxPriceOptions.map(price => (
            {
                value: price,
                label: 'Max: ' + formatCurrency(price, {omitDecimal: true}),
                isDisabled: minPrice && minPrice >= price,
            }
    ));
    if (maxPrice && !maxPriceOptions.includes(maxPrice)) {
        maxPriceOptionsWithAny.push({value: maxPrice, label: 'Max: ' + formatCurrency(maxPrice, {omitDecimal: true}), isDisabled: false});
    }
    maxPriceOptionsWithAny.push({value: null, label: 'Max: Any', isDisabled: false});

    /**
     * Init effect
     */
    useEffect(() => {
        // register listener for window size changes, to toggle between side-by-side and mobile views
        function handleUpdatedWindowDimensions() {
            setShowSideBySide(window.innerWidth >= props.sideBySideBreakpoint);
        }
        window.addEventListener('resize', handleUpdatedWindowDimensions);
        handleUpdatedWindowDimensions(); // call once to set initially

        return () => {
            // unregister when component dismounts
            window.removeEventListener('resize', handleUpdatedWindowDimensions);
        };
    }, []);

    /**
     * On min price set
     */
    useEffect(() => {
        if (minPrice > 0) {
            setMaxPriceOptions([
                minPrice + 25000,
                minPrice + 50000,
                minPrice + 75000,
                minPrice + 100000,
                minPrice + 125000,
                minPrice + 150000,
            ]);
        }
        if (!minPrice && !maxPrice) {
            setMinPriceOptions(props.minPriceOptions);
            setMaxPriceOptions(props.maxPriceOptions);
        }
    }, [minPrice]);

    /**
     * On max price set
     */
    useEffect(() => {
        if (maxPrice > 0) {
            const newOptions = [
                maxPrice - 150000,
                maxPrice - 125000,
                maxPrice - 100000,
                maxPrice - 75000,
                maxPrice - 50000,
                maxPrice - 25000,
            ];
            setMinPriceOptions(newOptions.filter(option => option > 0));
        }
        if (!minPrice && !maxPrice) {
            setMinPriceOptions(props.minPriceOptions);
            setMaxPriceOptions(props.maxPriceOptions);
        }
    }, [maxPrice]);

    /**
     * Map parameters change effect
     */
    useEffect(() => {
        // ensure min and max are not inverted (eg. min greater than max)
        if (router.query.minPrice && router.query.maxPrice) {
            const minPrice = parseInt(router.query.minPrice);
            const maxPrice = parseInt(router.query.maxPrice);
            if (minPrice >= maxPrice) {
                pushSoftQueryParams({minPrice: (maxPrice - 100).toString()}, router);
            }
        }

        loadListingsInViewport();
    }, [
        router.query.latitude,
        router.query.longitude,
        router.query.zoom,
        router.query.minPrice,
        router.query.maxPrice,
        router.query.bedroomCountFilter,
        router.query.bathroomCountFilter,
        router.query.sortField,
        router.query.sortOrder
    ]);

    /**
     * On Google Maps loaded effect
     * (this happens after the initial page render)
     */
    useEffect(() => {
        if (!googleMap) { return; }

        if (router.query.latitude && router.query.longitude) {
            googleMap.setCenter({lat: parseFloat(router.query.latitude), lng: parseFloat(router.query.longitude)});
            googleMap.setZoom(parseInt(router.query.zoom || 8));
            setTimeout(loadListingsInViewport, 200); // without timeout listings will not load initially
        }
        else {
            // restore state from local storage, if exists
            const savedMapState = JSON.parse(localStorage.getItem(MAP_STATE_STORAGE_KEY));
            if (savedMapState) {
                googleMap.setCenter({lat: savedMapState.lat, lng: savedMapState.lng});
                googleMap.setZoom(savedMapState.zoom || 8);
                setTimeout(updateMapParams, 200); // without timeout listings will not load initially
            }
            else {
                // otherwise request browser location
                if (navigator.geolocation) {
                    setGeoLocating(true);
                    navigator.geolocation.getCurrentPosition(position => {
                        googleMap.setCenter({lat: position.coords.latitude, lng: position.coords.longitude});
                        googleMap.setZoom(12);
                        pushSoftQueryParams({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                            zoom: 12
                        }, router);
                        setGeoLocating(false);
                        setTimeout(updateMapParams, 200); // without timeout listings will not load initially
                    }, err => setGeoLocating(false));
                }
            }
        }

        // persist map state when map dismounts
        return () => persistMapState();
    }, [googleMap]);

    /**
     * Persists the map state in local storage
     */
    function persistMapState() {
        const mapState = {
            lat: googleMap?.getCenter().lat(),
            lng: googleMap?.getCenter().lng(),
            zoom: googleMap?.getZoom()
        };
        if (mapState.lat && mapState.lng && mapState.zoom) {
            localStorage.setItem(MAP_STATE_STORAGE_KEY, JSON.stringify(mapState));
        }
    }

    /**
     * Updates query params for the current map state
     */
    function updateMapParams() {
        const latitude = googleMap?.center?.lat();
        const longitude = googleMap?.center?.lng();
        const zoom = googleMap?.zoom;
        if (latitude && longitude && zoom) {
            pushSoftQueryParams({
                latitude,
                longitude,
                zoom
            }, router);
        }
    }

    /**
     * Loads listings within the current map viewport
     */
    async function loadListingsInViewport() {
        if (!googleMap) {
            return;
        }

        let filterString = '';
        if (parseInt(router.query.minPrice)) {
            filterString += `&askingPrice_gte=${parseInt(router.query.minPrice)}`;
        }
        if (parseInt(router.query.maxPrice) && router.query.maxPrice !== '-1') {
            filterString += `&askingPrice_lte=${parseInt(router.query.maxPrice)}`;
        }
        if (router.query.bedroomCountFilter) {
            filterString += `&${router.query.bedroomCountFilter}`;
        }
        if (router.query.bathroomCountFilter) {
            filterString += `&${router.query.bathroomCountFilter}`;
        }

        const northEastPoint = googleMap?.getBounds()?.getNorthEast();
        const southWestPoint = googleMap?.getBounds()?.getSouthWest();
        if (!northEastPoint || !southWestPoint) {
            setTimeout(loadListingsInViewport, 200);
        }
        if (northEastPoint && southWestPoint) {
            setLoadingListings(true);
            const listingResult = await Listings.findListingsWithinGeographicBounds(
                {
                    minLatitude: southWestPoint.lat(),
                    minLongitude: southWestPoint.lng(),
                    maxLatitude: northEastPoint.lat(),
                    maxLongitude: northEastPoint.lng(),
                },
                router.query.sortField ? `${router.query.sortField}:${router.query.sortOrder}` : '',
                filterString
            );
            setListings(listingResult.listings || []);
            setLoadingListings(false);
        }
    }

    /**
     * Search for a given address
     * @param address
     */
    async function searchAddress(address) {
        const location = await geocodeAddress(address, true);
        const isPreciseAddress = ['street_address', 'premise'].includes(location?.types?.[0]);
        if (isPreciseAddress) {
            // search was for an individual location, see if an active listing exists
            const streetNumber = location.address_components
                .filter(component => component.types?.[0] === 'street_number')?.[0].long_name;
            const streetComponent = location.address_components
                .filter(component => component.types?.[0] === 'route')?.[0];
            const city = location.address_components
                .filter(component => component.types?.[0] === 'locality')?.[0].long_name;
            const state = location.address_components
                .filter(component => component.types?.[0] === 'administrative_area_level_1')?.[0].short_name;

            const listingQuery = new URLSearchParams({
                address_in: [
                    `${streetNumber} ${streetComponent.short_name}`,
                    `${streetNumber} ${streetComponent.long_name}`
                ],
                city,
                state,
                status: 'active',
            });
            let queryString = listingQuery.toString();
            queryString += `&address_in=${streetNumber} ${streetComponent.short_name}`;
            queryString += `&address_in=${streetNumber} ${streetComponent.long_name}`;

            const activeListingResponse = await ApiClient.get(`/listings?${queryString}`);
            const activeListings = activeListingResponse.data;
            if (activeListings?.length > 0) {
                pushSoftQueryParams({viewedListingId: activeListings[0].id}, router);
            }
        }
        googleMap.setCenter({
            lat: location.geometry.location.lat(),
            lng: location.geometry.location.lng()
        });
        if (isPreciseAddress) {
            googleMap.setZoom(19);
        } else {
            googleMap.setZoom(13);
        }
    }

    /**
     * Render
     */
    return (
        <div className={styleClasses.listingsMapContainer}>
            <div className={styleClasses.mobileMapToggle}>
                <a
                    style={{color: router.query.mobileMap !== '1' ? '#fff' : Colors.lightBlue}}
                    onClick={() => clearSoftQueryParams(['mobileMap'], router)}
                    children={'List'}
                />
                <a
                    style={{color: router.query.mobileMap === '1' ? '#fff' : Colors.lightBlue}}
                    onClick={() => pushSoftQueryParams({mobileMap: '1'}, router)}
                    children={'Map'}
                />
            </div>

            <div className={styleClasses.searchBar}>
                <div className={styleClasses.searchContainer}>
                    <form
                        className={styleClasses.searchForm}
                        onSubmit={async e => {
                            e.preventDefault();
                            if (searchInput.length > 0) {
                                await searchAddress(searchInput);
                            }
                        }}
                    >
                        <div className={styleClasses.searchInput}>
                            <PlacesAutocomplete
                                value={searchInput}
                                onChange={newValue => setSearchInput(newValue)}
                                onSelect={selected => {
                                    setSearchInput(selected);
                                    searchAddress(selected);
                                }}
                            >
                                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                                    <div>
                                        <input
                                            {...getInputProps({
                                                placeholder: 'Address or Zipcode',
                                                className: 'location-search-input',
                                            })}
                                        />
                                        <div
                                            style={{position: 'absolute', zIndex: 9999999}}
                                            className={`autocomplete-dropdown-container ${suggestions?.length > 0 ? styleClasses.autoCompleteResults : ''}`}
                                        >
                                            {loading && <div style={{width: 30}}><Loader/></div>}
                                            {suggestions.map(suggestion => {
                                                const className = suggestion.active
                                                    ? 'suggestion-item--active'
                                                    : 'suggestion-item';
                                                const style = suggestion.active
                                                    ? { backgroundColor: '#fafafa', cursor: 'pointer', padding: '8px' }
                                                    : { backgroundColor: '#ffffff', cursor: 'pointer', padding: '8px' };
                                                return (
                                                    <div
                                                        {...getSuggestionItemProps(suggestion, {
                                                            className,
                                                            style
                                                        })}
                                                    >
                                                        <span style={{color: '#444'}}>{suggestion.description}</span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </PlacesAutocomplete>
                        </div>
                        <button type={'submit'}/>
                    </form>
                </div>

                {/***** DESKTOP FILTER CONTROLS *****/}
                <div className={styleClasses.fullResolutionPriceFilters}>
                    <CreatableSelect
                        placeholder={'Minimum price'}
                        className={styleClasses.fullResolutionPriceFilter}
                        height={'40px'}
                        padding={'0'}
                        value={minPrice}
                        options={minPriceOptionsWithAny}
                        onChange={selected => {
                            if (!selected.value) {
                                clearSoftQueryParams(['minPrice'], router);
                            }
                            else {
                                pushSoftQueryParams({minPrice: selected.value}, router)
                            }
                        }}
                        onCreateNew={newInput => {
                            pushSoftQueryParams({minPrice: numericCharsOnly(newInput)}, router);
                        }}
                        onTextChange={manualInput => {
                            if (manualInput) {
                                return 'Min: ' + formatCurrency(numericCharsOnly(manualInput), {omitDecimal: true})
                            }
                        }}
                    />
                    <CreatableSelect
                        placeholder={'Maximum price'}
                        className={styleClasses.fullResolutionPriceFilter}
                        height={'40px'}
                        padding={'0'}
                        value={maxPrice}
                        options={maxPriceOptionsWithAny}
                        onChange={selected => {
                            if (!selected.value) {
                                clearSoftQueryParams(['maxPrice'], router);
                            }
                            else {
                                pushSoftQueryParams({maxPrice: selected.value}, router)
                            }
                        }}
                        onCreateNew={newInput => {
                            pushSoftQueryParams({maxPrice: numericCharsOnly(newInput)}, router);
                        }}
                        onTextChange={newValue => {
                            if (newValue) {
                                return 'Max: ' + formatCurrency(numericCharsOnly(newValue), {omitDecimal: true})
                            }
                        }}
                    />
                    <Select
                        height={'40px'}
                        padding={'0'}
                        placeholder={'Beds'}
                        className={styleClasses.fullResolutionPriceFilter}
                        value={router.query.bedroomCountFilter}
                        onChange={selected => pushSoftQueryParams({bedroomCountFilter: selected.value}, router)}
                        options={[
                            {value: 'bedroomCount_gte=1', label: 'Beds: 1+'},
                            {value: 'bedroomCount_gte=2', label: 'Beds: 2+'},
                            {value: 'bedroomCount_gte=3', label: 'Beds: 3+'},
                            {value: 'bedroomCount_gte=4', label: 'Beds: 4+'},
                            {value: 'bedroomCount_gte=5', label: 'Beds: 5+'},
                            {value: 'bedroomCount_gte=6', label: 'Beds: 6+'},
                            {value: 'bedroomCount_gte=7', label: 'Beds: 7+'},
                            {value: 'bedroomCount_gte=8', label: 'Beds: 8+'},
                        ]}
                    />
                    <Select
                        height={'40px'}
                        padding={'0'}
                        placeholder={'Bathrooms'}
                        className={styleClasses.fullResolutionPriceFilter}
                        value={router.query.bathroomCountFilter}
                        onChange={selected => pushSoftQueryParams({bathroomCountFilter: selected.value}, router)}
                        options={[
                            {value: 'bathroomCount_gte=1', label: 'Bathrooms: 1+'},
                            {value: 'bathroomCount_gte=2', label: 'Bathrooms: 2+'},
                            {value: 'bathroomCount_gte=3', label: 'Bathrooms: 3+'},
                            {value: 'bathroomCount_gte=4', label: 'Bathrooms: 4+'},
                        ]}
                    />
                </div>
            </div>

            <div className={styleClasses.listingsMapBody}>
                <div
                    className={styleClasses.sidebar}
                    style={{
                        display: ((router.query.mobileMap !== '1') || showSideBySide) ? 'block' : 'none',
                    }}
                >
                    {((router.query.mobileMap !== '1') || showSideBySide) &&
                    <>
                        {/**** SORT CONTROLS ****/}
                        <ul className={styleClasses.sortControlsContainer}>
                            {[
                                {code: 'askingPrice', label: 'Price'},
                                {code: 'bedroomCount', label: 'Bedrooms'},
                                {code: 'squareFootage', label: 'Square Footage'}
                            ].map(field => {
                                return <li key={field.code} className={`${styleClasses.sortControl} ${field.code}`}
                                           onClick={() => {
                                               if (router.query.sortField !== field.code) {
                                                   pushSoftQueryParams({
                                                       sortField: field.code,
                                                       sortOrder: 'ASC'
                                                   }, router);
                                               }
                                               else {
                                                   if (router.query.sortOrder === 'ASC') {
                                                       pushSoftQueryParams({sortOrder: 'DESC'}, router);
                                                   }
                                                   else {
                                                       clearSoftQueryParams(['sortField', 'sortOrder'], router);
                                                   }
                                               }
                                           }}
                                >
                                    <span className={styleClasses.sortText}>{field.label}</span>
                                    <span className={styleClasses.sortArrows}>
                                        <ArrowUpIcon className={router.query.sortField === field.code && router.query.sortOrder === 'ASC' ? 'active' : ''} />
                                        <ArrowDownIcon className={router.query.sortField === field.code && router.query.sortOrder === 'DESC' ? 'active' : ''} />
                                    </span>
                                </li>
                            })}

                            {/***** MOBILE FILTER CONTROLS *****/}
                            <li className='sort-control-filters'>
                                <Button
                                    className={styleClasses.filterButton}
                                    onClick={() => setShowFiltersModal(true)}
                                >
                                    Filters
                                </Button>
                            </li>
                        </ul>
                        {showFiltersModal &&
                            <Modal
                                onClose={() => setShowFiltersModal(false)}
                            >
                                <MobileFiltersForm
                                    initialState={{
                                        minPrice: minPrice,
                                        maxPrice: maxPrice,
                                        bedroomCountFilter: router.query.bedroomCountFilter,
                                        bathroomCountFilter: router.query.bathroomCountFilter,
                                    }}
                                    onComplete={(newFilters) => {
                                        pushSoftQueryParams(newFilters, router);
                                        setShowFiltersModal(false);
                                    }}
                                />
                            </Modal>
                        }

                        {/**** THUMBNAILS SIDEBAR ****/}
                        <div className={styleClasses.thumbnails}>
                            {loadingListings && (
                                <div style={{width: 40}}>
                                    <Loader label={'Loading...'}/>
                                </div>
                            )}
                            {!loadingListings && listings?.length === 0 && <h3>No Listings in this Area</h3>}
                            {!loadingListings && listings?.map((listing) => {
                                return <div key={listing.id}><ListingThumbnail
                                listing={listing}
                                onClick={() => this._showListing(listing)}
                                /></div>;
                            })}
                        </div>
                    </>
                    }
                </div>

                {/**** MAIN MAP BODY ****/}
                {geoLocating &&
                <div style={{width: '100%', height: '100%', backgroundColor: '#ddd', textAlign: 'center', margin: '0 auto', paddingTop: 50}}>
                    <Loader style={{width: 100, margin: '0 auto'}} />
                    <p style={{color: '#aaa'}}>Determining your location...</p>
                </div>
                }
                <div
                    className={styleClasses.listingsMap}
                    style={{
                        visibility: (!geoLocating && (showSideBySide || (router.query.mobileMap === '1')) ? 'visible' : 'hidden'),
                        display: ((router.query.mobileMap === '1') || showSideBySide) ? 'block' : 'none',
                    }}
                >
                    <GoogleMap
                        mapContainerStyle={{width: '100%', height: '100%'}}
                        options={{
                            fullscreenControl: false,
                            mapTypeControl: false,
                            streetViewControl: true,
                            styles: googleMapStyles,
                        }}
                        center={DEFAULT_MAP_CENTER}
                        zoom={DEFAULT_MAP_ZOOM}
                        onLoad={(map) => {
                            persistMapState();
                            setGoogleMap(map);
                            updateMapParams();
                        }}
                        onUnmount={() => setGoogleMap(null)}
                        onDragEnd={updateMapParams}
                        onZoomChanged={updateMapParams}
                    >
                        {listings?.map((listing) => (
                            <React.Fragment key={listing.id}>
                            <OverlayView
                                position={{lat: listing.latitude, lng: listing.longitude}}
                                mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                            >
                                <MapMarker
                                    listing={listing}
                                    onClick={() => {
                                        viewListingContext.showListing(listing);
                                    }}
                                >
                                </MapMarker>
                            </OverlayView>
                            </React.Fragment>
                        ))}
                    </GoogleMap>
                </div>
            </div>
        </div>
    );
}

/**
 * Props
 */
ListingsMap.propTypes = {
    sideBySideBreakpoint: number,
    minPriceOptions: arrayOf(number),
    maxPriceOptions: arrayOf(number),
    minBedroomCount: number,
    maxBedroomCount: number,
    minBathroomCount: number,
    maxBathroomCount: number,
};

ListingsMap.defaultProps = {
    sideBySideBreakpoint: 700,
    minPriceOptions: [
        100000,
        200000,
        300000,
        400000,
        500000,
        600000,
    ],
    maxPriceOptions: [
        500000,
        600000,
        700000,
        800000,
        900000,
        1000000,
        1250000,
        1500000,
    ],
    minBedroomCount: 1,
    maxBedroomCount: 8,
    minBathroomCount: 1,
    maxBathroomCount: 4,
};

export default ListingsMap;
