'use strict';

function HomeController($log, $state, $stateParams, $uibModal,
  CommonApiService, $q, Utils) {
  var vm = this;
  vm.$onInit = function () {
    // s
    $log.info('HomeController');
  };
}

module.exports = HomeController;