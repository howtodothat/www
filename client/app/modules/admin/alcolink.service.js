'use strict';

function AlcolinkService($resource, $rootScope, $httpParamSerializerJQLike, Utils) {
  var AlcolinkResource = $resource($rootScope.domain + '/alcolink/:action/:id', {},
    {
      list: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'index'
        }
      },
      upload: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'upload'
        },
        headers: {
          'Content-Type': undefined
        }
      }
    }
  );

  return {
    getAlcolinkList: _getAlcolinkList,
    uploadFile: _uploadFile,
    downloadFile: _downloadFile,
    getAlcolinkDetail: _getAlcolinkDetail
  };

  /**
   * Alcolink get list
   *
   * @return json format
   */
  function _getAlcolinkList(get, post) {
    return AlcolinkResource.list(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }

    /**
   * Alcolink upload file
   *
   * @return json format
   */
  function _uploadFile(params) {
    return AlcolinkResource.upload({}, params)
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  /**
   * Alcolink download file
   *
   * @return json format
   */
  function _downloadFile(params) {
    return Utils.downloadFile($rootScope.domain + '/alcolink/download', params);
  }

  /**
   * Alcolink download file
   *
   * @return json format
   */
  function _getAlcolinkDetail(params) {
    return AlcolinkResource.detail({}, params)
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
}
module.exports = AlcolinkService;