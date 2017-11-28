'use strick';

function PermissionService($cookies, $log, PermRoleStore, PermPermissionStore, $location) {
  // we could do additional work here too
  // var permissionResource = $resource('api/permission/:action/:id', {},
  //   {
  //     gerPermissionByUser: {
  //       method: 'POST',
  //       isArray: false,
  //       params: {
  //         action: 'get-permission-by-user'
  //       }
  //     }
  //   }
  // );
  var domainName = $location.host() + '_';
  var listStatusCert = [
    { name: 'Pending', id: 0 },
    { name: 'Post', id: 1 },
    { name: 'Deliver', id: 2 },
    { name: 'Reject', id: 3 },
    { name: 'Cancel', id: 4 }
  ];
  var listStatusUser = [
    { name: 'Pending', id: 0 },
    { name: 'Active', id: 1 },
    { name: 'Inactive', id: 2 },
    { name: 'Reject', id: 3 },
    { name: 'Removed', id: 4 }
  ];
  var listType = [
    { id: null, name: 'ALL' },
    { id: 0, name: 'VIEWER' },
    { id: 1, name: 'VENDOR' },
    { id: 2, name: 'IS' },
    { id: 3, name: 'DOCTOR AUDITER' },
    { id: 4, name: 'ACCOUNTING' },
    { id: 5, name: 'AUDIT OFFICER' },
    { id: 6, name: 'A ADMIN' },
    { id: 7, name: 'DIRECTOR' },
    { id: 8, name: 'SYSTEM ADMIN' }
  ];
  var listTypeByName = {
    VIEWER: 0,
    VENDOR: 1,
    IS: 2,
    DOCTOR_AUDITER: 3,
    ACCOUNTING: 4,
    AUDIT_OFFICER: 5,
    A_ADMIN: 6,
    DIRECTOR: 7,
    SYSTEM_ADMIN: 8
  };
  // var listRole = ['General', 'Funeral Home', 'A Billing', 'A Service', 'A Admin', 'System Admin', 'Director', 'Super Admin'];
  var listRole = ['VIEWER', 'VENDOR', 'IS', 'DOCTOR AUDITER', 'ACCOUNTING', 'AUDIT OFFICER', 'A ADMIN', 'DIRECTOR', 'SYSTEM ADMIN'];
  return {
    getPermission: _getPermission,
    setPermission: _setPermission,
    getRole: _getRole,
    getRoleName: _getRoleName,
    getStatusName: _getStatusName,
    getListType: _getListType,
    getListLowerType: _getListLowerType,
    getStatusCert: _getStatusCert,
    getListStatusCert: _getListStatusCert,
    getListStatusCertPluck: _getListStatusCertPluck,
    getListStatusUser: _getListStatusUser,
    getListStatusUserPluck: _getListStatusUserPluck,
    getStatusUserByName: _getStatusUserByName,
    getStatusCertByName: _getStatusCertByName,
    getUser: _getUser,
    setUser: _setUser,
    setAuthor: _setAuthor,
    getAuthor: _getAuthor,
    setLoginToken: _setLoginToken,
    getLoginToken: _getLoginToken,
    defineRole: _defineRole,
    logOut: _logOut,
    getRoleIDByName: _getRoleIDByName,
    checkPermission: _checkPermission
  };
  function _logOut() {
    _setAuthor('');
    _setUser({});
    _setLoginToken('');
    _setPermission({});
    PermPermissionStore.clearStore();
    PermRoleStore.clearStore();
  }
  function _getRoleIDByName() {
    return listTypeByName;
  }
  function _getRole(type) {
    // const TYPE_GENERAL = 0;
    // const TYPE_MORTUARY = 1;
    // const TYPE_A = 2;
    type = parseInt(type);
    var role = 'admin';
    if (type === 1) {
      role = 'funeral';
    } else if (type === 0) {
      role = 'general';
    }
    return role;
  }
  function _getStatusName(status) {
    return _getNameObj(listStatusUser, status);
  }
  function _getRoleName(roleId) {
    roleId = parseInt(roleId);
    return listRole[roleId];
  }
  function _setPermission(per) {
    $cookies.putObject(domainName + 'permission', per);
  }
  function _getPermission(author) {
    return $cookies.getObject(domainName + 'permission');
    // api
  }
  function _getListType(except) {
    // 0: TYPE_DEATH
    // 1: TYPE_FETAL
    // 2: TYPE_BURIED
    return _getListObj(listType, except);
  }
  function _getListLowerType(currentRole, except) {
    return _getListLowerObj(listType, currentRole, except);
  }
  function _getStatusCert(status) {
    return _getNameObj(listStatusCert, status);
  }
  function _getListStatusCert(except) {
    return _getListObj(listStatusCert, except);
  }
  function _getListStatusCertPluck(except, propertyName) {
    return _getListPluck(listStatusCert, except, propertyName);
  }
  function _getListStatusUser(except) {
    return _getListObj(listStatusUser, except);
  }
  function _getListStatusUserPluck(except, propertyName) {
    return _getListPluck(listStatusUser, except, propertyName);
  }
  function _getStatusUserByName(name) {
    return _getIdObj(listStatusUser, name);
  }
  function _getStatusCertByName(name) {
    return _getIdObj(listStatusCert, name);
  }
  // private function
  function _getNameObj(obj, id) {
    id = parseInt(id);
    var even = _.find(obj, function (num) { return num.id === id; });
    return even.name;
  }
  function _getIdObj(obj, name) {
    // id = parseInt(id);
    var even = _.find(obj, function (num) { return num.name === name; });
    return even.id;
  }
  function _getListObj(obj, except) {
    if (_.isUndefined(except)) {
      return obj;
    }
    return _.filter(obj, function (num, k) {
      if (_.isArray(except)) {
        return !_.contains(except, num.name);
      } else {
        return except !== num.name;
      }
    });
  }
  function _getListLowerObj(obj, currentRole, except) {
    if (_.isUndefined(except)) {
      return obj;
    }
    return _.filter(obj, function (num, k) {
      if (_.isArray(except)) {
        // $log.info('AAAA', !_.contains(except, num.name));
        // $log.info('BBBBB', parseInt(currentRole));
        return (!_.contains(except, num.name)) && (parseInt(currentRole) > num.id);
      } else {
        var test2 = except !== num.name;
        return test2;
      }
    });
  }
  function _getListPluck(obj, except, propertyName) {
    if (_.isUndefined(propertyName)) {
      propertyName = 'id';
    }
    if (_.isUndefined(except)) {
      return _.pluck(obj, propertyName);
    }
    var objFilet = _.filter(obj, function (num, k) {
      if (_.isArray(except)) {
        return !_.contains(except, num.name);
      } else {
        return except !== num.name;
      }
    });
    return _.pluck(objFilet, propertyName);
  }
  function _getUser() {
    return $cookies.getObject(domainName + 'user');
  }
  function _setUser(user) {
    $cookies.putObject(domainName + 'user', user);
  }
  function _setAuthor(item) {
    $cookies.put(domainName + 'author', item);
  }
  function _getAuthor() {
    return $cookies.get(domainName + 'author');
  }
  function _setLoginToken(accessToken) {
    $cookies.put(domainName + 'loginTokenCookie', accessToken);
  }
  function _getLoginToken() {
    return $cookies.get(domainName + 'loginTokenCookie');
  }
  function _defineRole(permission) {
    PermPermissionStore.clearStore();
    PermRoleStore.clearStore();
    var author = _getAuthor() ? _getAuthor() : 'guest';
    if (author !== 'guest') {
      PermRoleStore.defineRole(author, permission);
      PermPermissionStore.defineManyPermissions(permission, function (permissionName) {
        return _.contains(permission, permissionName);
      });
    } else {
      permission = ['guest', 'seeResubmitBtnDetailRequest'];
      PermRoleStore.defineRole(author, permission);
      PermPermissionStore.defineManyPermissions(permission, function (permissionName) {
        return _.contains(permission, permissionName);
      });
    }
  }
  function _checkPermission(permissionName) {
    var listPermission = _getPermission();
    var hasPermission = _.find(listPermission, function(p) {
      return p === permissionName;
    });
    if (angular.isDefined(hasPermission)) {
      return true;
    }
    return false;
  }
}

module.exports = PermissionService;