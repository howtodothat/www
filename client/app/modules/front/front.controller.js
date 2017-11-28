'use strict';
// , PatternService
function FrontHeaderController($log, $state, $stateParams, $uibModal, ContactService, PermissionService) {
  // Init
  var vm = this;
  vm.$state = $state;
  vm.openContactUs = openContactUs;
  vm.patternEmail = ''; // PatternService.getEmail();
  var body = angular.element('body');
  body.attr('class', 'block-ui block-ui-anim-fade');
  body.addClass('homepage');
  vm.$onInit = function () {
    var cuser = PermissionService.getUser();
    if (!_.isEmpty(cuser)) {
      $state.go('dashboard.index');
    }
  };
  // Open contact form
  function openContactUs() {
    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      backdrop: false,
      keyboard: false,
      size: 'md',
      templateUrl: 'static/modules/front/views/contact-us.html',
      controller: function ($uibModalInstance, patternEmail) {
        var vm = this;
        vm.patternEmail = patternEmail;
        vm.close = function () {
          $uibModalInstance.close();
        };
        vm.listContact = [
          { id: 1, name: 'General Inquiries' },
          { id: 2, name: 'Support' }
        ];
        vm.formContact = {
          Contact: {
            type: vm.listContact[0].name
          }
        };
        // submit form contact
        vm.submit = function () {
          vm.sendFail = false;
          $log.info(vm.formContact);
          ContactService.submit(vm.formContact).then(function (response) {
            vm.sendFail = true;
            vm.failMessage = '';
            if (_.isObject(response.message)) {
              _.each(response.message, function (num, key) {
                vm.failMessage = num[0];
              });
            } else {
              vm.failMessage = response.message;
            }
          });
        };
      },
      controllerAs: 'vm',
      resolve: {
        patternEmail: function () {
          return vm.patternEmail;
        }
      }
    });
    modalInstance.result.then(function () { }, function () { });
  }
}

module.exports = FrontHeaderController;