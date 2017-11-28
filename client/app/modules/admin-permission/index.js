'use strict';

// Thachlh121
angular.module("app.adminPermission", [])
  .controller('AdminPermissionController', require("./permission.controller.js"))
  .factory('PermissionApi', require("./permissionApi.service.js"))
  .config(function ($stateProvider) {
    $stateProvider.state('permisstionMenu', {
      // url: '/admin/accounting',
      parent: 'menuAdmin',
      views: {
        'content-admin': {
          template: '<div ui-view="page-wrap"></div>'
        }
      }
    });
    $stateProvider.state('permisstionMenu.permissions', {
      url: '/admin/permissions',
      views: {
        'page-wrap': {
          templateUrl: 'static/modules/admin-permission/views/permissions-index.html',
          controller: 'AdminPermissionController',
          controllerAs: 'vm'
        }
      },
      data: {
        permissions: {
          only: ['permisstionMenu.permissions'],
          redirectTo: 'notAuthorized'
        }
      }
    });
  });