'use strict';

function AdminController($state, $log, $cookies, PermissionService, LoginService, $interval, NotificationService, $scope, $rootScope) {
  var vm = this;
  var body = angular.element('body');
  $log.info('AdminController');
  vm.logout = logout;
  body.removeClass('homepage');
  body.addClass('hold-transition layout-top-nav adminpage');
  vm.$state = $state;
  $rootScope.avatar = 'static/images/avatar5.png';
  // REMOVE INTERVAL WHEN CHANGE STATE OR RELOAD PAGE
  $scope.$on("$destroy", function() {
    if (angular.isDefined(vm.interval)) {
      $interval.cancel(vm.interval);
    }
  });
  vm.$onInit = function () {
    var author = PermissionService.getAuthor();
    if (author) {
      vm.user = PermissionService.getUser('user');
      if (angular.isDefined(vm.user)) {
        if (angular.isDefined(vm.user.profile)) {
          vm.fullname = vm.user.profile.firstname + ' ' + vm.user.profile.lastname;
          if (!_.isEmpty(vm.user.profile.avatar)) {
            $rootScope.avatar = vm.user.profile.avatar;
          }
        }
      }
    } else {
      $state.go('user.login');
    }
  };
  var cuser = PermissionService.getUser();
  if (angular.isObject(cuser) && angular.isDefined(cuser)) {
    // $log.info(cuser);
    getNotifications();
    var interval = $interval(function () {
      getNotifications();
    }, 5000);
    vm.interval = interval;
    $interval.cancel(interval);
  }

  function logout() {
    LoginService.postLogout().then(function () {
      $cookies.put('isLogin', undefined);
      PermissionService.logOut();
      $state.go('user.login');
    }).catch(function (error) {
      $log.error(error.data);
    });
  }

  function getNotifications() {
    // $log.info(vm.interval);
    NotificationService.getNotifications().then(function (response) {
      if (!response.error) {
        vm.totalNotify = response.data.length === 0 ? null : response.data.length;
      }
    }).catch(function (error) {
      $log.error(error.data);
    });
  }
}

module.exports = AdminController;
