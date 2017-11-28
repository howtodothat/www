'use strict';

function HomeFaqController($log, FaqsService) {
  var vm = this;
  vm.toggleElement = toggleElement;
  vm.showList = false;

  /** Init
   *
   * @author: HungVT
   */
  vm.$onInit = function() {
    getList();
  };

  /** Get list object from server and append to html
   *
   * @author: HungVT
   */
  function getList() {
    FaqsService.list().then(function (response) {
      if (!response.error) {
        vm.models = _.groupBy(response.data, function(v) {
          return v.group_name;
        });
        if (!angular.equals({}, vm.models)) {
          vm.showList = true;
        }
      } else {
        // TODO: Show error
      }
    }).catch(function () {});
  }

  // Add or remove class show
  function toggleElement() {
    // Check is click tag I or H4
    var element = event.target.localName === 'i' ? angular.element(event.target).parent() : angular.element(event.target);
    element.find('i').toggleClass('fa-caret-right').toggleClass('fa-caret-down');
    element.next().slideToggle('slow');
  }
}

module.exports = HomeFaqController;