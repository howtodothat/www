'use strict';

function permissionApi($log, $resource, $urlRouter, $httpParamSerializerJQLike, PermPermissionStore, PermRoleStore, PermissionService) {
  var permissionResource = $resource('api/permission/:action/:id', {},
    {
      index: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'index'
        }
      },
      gerPermissionByUser: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'get-permission-by-user'
        }
      },
      listPermission: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'list-permission'
        }
      },
      roles: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'roles'
        }
      },
      getPermissionByRole: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-permission-by-role'
        }
      },
      roleUpdate: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'role-update'
        }
      },
      roleCreate: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'role-create'
        }
      },
      addPermission: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'add-permission-child'
        }
      }
    }
  );
  return {
    listPermission: _listPermission,
    roles: _roles,
    permissionListing: _permissionListing,
    getPermissionByRole: _getPermissionByRole,
    roleCreate: _roleCreate,
    roleUpdate: _roleUpdate,
    permissionRun: _permissionRun,
    addPermission: _addPermission
  };
  function _addPermission(post) {
    return permissionResource.addPermission($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _roleUpdate(post) {
    return permissionResource.roleUpdate($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _roleCreate(post) {
    return permissionResource.roleCreate($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getPermissionByRole(get) {
    return permissionResource.getPermissionByRole(get)
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _roles(get, post) {
    return permissionResource.roles(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _permissionListing() {
    return permissionResource.index({})
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _listPermission() {
    return permissionResource.listPermission({})
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  // function _getPermissionByUser() {
  //   return permissionResource.gerPermissionByUser({})
  //     .$promise.then(function (response) {
  //       return angular.fromJson(angular.toJson(response));
  //     });
  // }
  function _permissionRun() {
    var per = PermissionService.getPermission();
    if (_.isUndefined(per)) {
      PermissionService.setAuthor('');
      PermissionService.setUser({});
      PermissionService.setLoginToken('');
      // $state.go('user.login');
    } else {
      PermissionService.defineRole(per);
    }
    // _getPermissionByUser().then(function (response) {
    //   PermissionService.defineRole(response.data);
    // });
  }
}

module.exports = permissionApi;