'use strict';

// Thachlh121
angular.module("app.home", [])
  .controller('HomeController', require("./home.controller.js"))
  .controller('HomeFaqController', require("./homeFaqController.js"))
  .factory('ContactService', require("./ContactService.service.js"))
  .config(function ($stateProvider) {
    $stateProvider.state('front.home', {
      url: '/',
      views: {
        'content@front': {
          templateUrl: 'static/modules/home/views/home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
        }
      }
    });
    $stateProvider.state('front.homeResubmit', {
      url: '/resubmit-request?popId',
      params: {
        popId: ''
      },
      views: {
        'content@front': {
          templateUrl: 'static/modules/home/views/home.html',
          controller: 'HomeController',
          controllerAs: 'vm'
        }
      }
    });
    $stateProvider.state('front.service', {
      url: '/service',
      views: {
        'content@front': {
          templateUrl: 'static/modules/home/views/blank.html'
        }
      }
    });
    $stateProvider.state('front.about', {
      url: '/about',
      views: {
        'content@front': {
          templateUrl: 'static/modules/home/views/about-us.html'
        }
      }
    });
    $stateProvider.state('front.faqs', {
      url: '/faqs',
      views: {
        'content@front': {
          templateUrl: "static/modules/home/views/front-faq.html",
          controller: 'HomeFaqController',
          controllerAs: 'vm'
        }
      }
    });
  });
