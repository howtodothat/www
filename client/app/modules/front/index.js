'use strict';

// Thachlh121
angular.module("app.front", [])
  .controller('FrontController', require("./front.controller.js"))
  .config(function ($stateProvider) {
    $stateProvider.state('front', {
      // url: '/',
      abstract: true,
      views: {
        'main': {
          templateUrl: "static/modules/front/views/front.html",
          controller: 'FrontController',
          controllerAs: 'vm'
        }
      }
    });
    $stateProvider.state('notFound', {
      url: '/not-found',
      views: {
        'main': {
          templateUrl: "static/modules/front/views/not-found.html"
        }
      }
    });
    $stateProvider.state('notAuthorizedHome', {
      url: '/not-authorized-request',
      parent: 'front',
      views: {
        'content': {
          templateUrl: "static/modules/front/views/not-author.html"
        }
      }
    });
  });
