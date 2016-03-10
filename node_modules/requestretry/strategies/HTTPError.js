'use strict';

/**
 * @param  {Null | Object} err
 * @param  {Object} response
 * @return {Boolean} true if the request had a recoverable HTTP error
 */
module.exports = function HTTPError(err, response) {
  return response && 500 <= response.statusCode && response.statusCode < 600;
};
