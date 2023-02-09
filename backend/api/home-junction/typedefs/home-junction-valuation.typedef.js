/**
 * @typedef HomeJunctionValuationResponse
 *
 * @property {boolean} success
 * @property {HomeJunctionValuationResult} [result]
 * @property {HomeJunctionError} [error]
 */

/**
 * @typedef HomeJunctionValuationResult
 *
 * @property {HomeJunctionValuation} valuations
 * @property {HomeJunctionAddress} address
 * @property {Coordinates} coordinates
 * @property {HomeJunctionAttributes} attributes
 */

/**
 * @typedef HomeJunctionValuation
 *
 * @property {HomeJunctionGeneralValuation} general
 * @property {HomeJunctionDefaultValuation} default
 */

/**
 * @typedef HomeJunctionGeneralValuation
 *
 * @property {number} EMV
 * @property {number} low
 * @property {number} high
 * @property {number} accuracy
 */

/**
 * @typedef HomeJunctionDefaultValuation
 *
 * @property {number} EMV
 */

/**
 * @typedef HomeJunctionAddress
 *
 * @property {string} deliveryLine
 * @property {string} city
 * @property {string} state
 * @property {string} zip
 * @property {string} street
 */

/**
 * @typedef Coordinates
 *
 * @property {number} latitude
 * @property {number} longitude
 */

/**
 * @typedef HomeJunctionAttributes
 *
 * @property {number} beds
 * @property {number} baths
 * @property {number} size
 */

/**
 * @typedef HomeJunctionError
 *
 * @property {string} message
 */
