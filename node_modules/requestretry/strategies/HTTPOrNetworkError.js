'use strict';
module.exports = function HTTPOrNetworkError(httpError, networkError) {
  /**
   * @param  {Null | Object} err
   * @param  {Object} response
   * @return {Boolean} true if the request had a recoverable HTTP or network error
   */
  return function HTTPError(err, response) {
    return httpError(err, response) || networkError(err, response);
  };

};
