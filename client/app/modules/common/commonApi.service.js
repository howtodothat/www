'use strict';

function CommonApi($resource, $rootScope, $httpParamSerializerJQLike, Upload) {
  var commonResource = $resource($rootScope.domain + '/common/:action/:id', {},
    {
      stateList: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-list-states'
        }
      },
      uploadMaxFileSize: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-upload-max-file-size'
        }
      },
      cityList: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'get-list-cities'
        }
      },
      eobCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'eob-code-listing'
        }
      },
      divisionList: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-list-divisions'
        }
      },
      cptCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'cpt-code-listing'
        }
      },
      icdCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'icd-code-listing'
        }
      },
      posCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'pos-code-listing'
        }
      },
      eobByCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'eob-by-code'
        }
      }
    }
  );
  return {
    getStateListing: _getStateListing,
    getCityListing: _getCityListing,
    getDivisionListing: _getDivisionListing,
    getEOBListing: _getEOBListing,
    getUploadMaxFileSize: _getUploadMaxFileSize,
    uploadImageEditor: _uploadImageEditor,
    getCPTListing: _getCPTListing,
    getICDListing: _getICDListing,
    getPOSListing: _getPOSListing,
    getEOBByCode: _getEOBByCode
  };

  function _getUploadMaxFileSize() {
    return commonResource.uploadMaxFileSize()
    .$promise.then(function (response) {
      return response;
    });
  }
  function _getStateListing() {
    return commonResource.stateList()
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getCityListing(get, post) {
    return commonResource.cityList(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getEOBListing(get, post) {
    return commonResource.eobCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getDivisionListing() {
    return commonResource.divisionList()
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _uploadImageEditor(params) {
    return Upload.upload({
      url: $rootScope.domain + '/common/upload-image-editor',
      data: params
    });
  }
  function _getCPTListing(get, post) {
    return commonResource.cptCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getICDListing(get, post) {
    return commonResource.icdCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getPOSListing(get, post) {
    return commonResource.posCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getEOBByCode(params) {
    return commonResource.eobByCode(params, {})
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
}

module.exports = CommonApi;
