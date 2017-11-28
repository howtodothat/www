'use strict';
function expiredSessionProvider() {
  var $expireProvider = {
    options: {
      timeOut: 1800,
      timeOutContinue: 60
    },
    $get: ['$interval', '$uibModal', '$uibModalStack', 'PermissionService', '$log', '$state', function ($interval, $uibModal, $uibModalStack, PermissionService, $log, $state) {
      var $expired = {};
      var countdown = null;
      $expired.start = _start;
      function _start(modalOptions) {
        var expiredOptions = angular.extend({}, $expireProvider.options, modalOptions);
        var timeNoAction = 0;
        // not loggin then not countdown
        if (_.isUndefined(PermissionService.getUser()) || _.isEmpty(PermissionService.getUser())) {
          return false;
        }
        if (!_.isNull(countdown)) {
          $interval.cancel(countdown);
        }
        countdown = $interval(function () {
          timeNoAction++;
          if (timeNoAction >= expiredOptions.timeOut) {
            $uibModal.open({
              animation: true,
              ariaLabelledBy: 'modal-title',
              ariaDescribedBy: 'modal-body',
              size: 'sm',
              backdrop: false,
              keyboard: false,
              templateUrl: 'static/modules/common/views/confirm-popup.html',
              controller: function ($uibModalInstance, $interval) {
                var vm = this;
                vm.title = 'The session will be expired in 60 seconds. Please click Continue to renew the session.';
                vm.titleBtn = 'Continue';
                var timeout = 0;
                var countdown = $interval(function () {
                  timeout++;
                  vm.title = 'The session will be expired in ' + (expiredOptions.timeOutContinue - timeout) + ' seconds. Please click Continue to renew the session.';
                  if (timeout >= expiredOptions.timeOutContinue) {
                    $interval.cancel(countdown);
                    $uibModalInstance.close('closed');
                  }
                }, 1000);
                vm.close = function () {
                  $uibModalInstance.close('closed');
                };
                vm.submit = function () {
                  $interval.cancel(countdown);
                  $uibModalInstance.dismiss('closed');
                };
              },
              controllerAs: 'vm'
            }).result.then(function (response) {
              // scope.callback();
              PermissionService.logOut();
              $uibModalStack.dismissAll();
              $state.go('user.login');
            }, function (result) {
              _start(modalOptions);
              // reset countdown
            });
            $interval.cancel(countdown);
          }
        }, 1000);
      }
      return $expired;
    }]
  };
  return $expireProvider;
}

module.exports = expiredSessionProvider;