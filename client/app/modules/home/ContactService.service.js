'use strict';

function ContactService($resource, $httpParamSerializerJQLike, $rootScope) {
  var ContactResource = $resource($rootScope.domain + '/user/:action', {},
    {
      contact: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'contact'
        }
      }
    }
  );
  return {
    submit: _submit
  };
  function _submit(post) {
    return ContactResource.contact($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
}
module.exports = ContactService;