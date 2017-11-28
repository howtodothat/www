'use strict';

// Thachlh121
angular.module("app.admin", [])
  .controller('AdminController', require("./admin.controller.js"))
  // .factory('NotificationService', require("./admin.notificationService.service.js"))
  .config(function ($stateProvider) {
    $stateProvider.state('admin', {
      // url: '/',
      abstract: true,
      views: {
        'main': {
          templateUrl: "static/modules/admin/views/admin.html",
          controller: 'AdminController',
          controllerAs: 'vm'
        }
      }
    });
    $stateProvider.state('menuAdmin', {
      // url: '/',
      parent: 'admin',
      views: {
        'content': {
          template: "<div ui-view='content-admin'></div>"
        }
      }
      // data: {
      //   permissions: {
      //     only: ['menuAdmin'],
      //     redirectTo: 'notAuthorized'
      //   }
      // }
    });
    $stateProvider.state('notAuthorized', {
      url: '/not-authorized',
      parent: 'admin',
      views: {
        'content': {
          templateUrl: "static/modules/admin/views/not-authorized.html"
        }
      }
    });
  });