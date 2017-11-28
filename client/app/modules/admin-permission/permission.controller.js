'use strict';

function AdminPermissionController($log, $state, $uibModal, PermissionApi, DateTime, Utils) {
  var vm = this;
  vm.cancelSearch = cancelSearch;
  vm.resetSearch = resetSearch;
  vm.onSort = onSort;
  vm.onChangePage = onChangePage;
  vm.onSearch = onSearch;
  vm.format = "MM/dd/yy";
  // vm.totalItems = 5;
  vm.$onInit = function () {
    vm.roleListing = [];
    vm.params = {
      CertificateFileSearch: {
        state_file_number: '',
        cert_number: '',
        deceased: '',
        start_date_of_death: null,
        end_date_of_death: null,
        city_of_death: '',
        social_security_number: '',
        funeral_name: '',
        funeral_license: '',
        start_register_date: null,
        end_register_date: null,
        is_request: ''
      }
    };
    vm.paging = {
      order_by: 'register_date',
      order_method: 'DESC',
      limit: 10,
      offset: 0
    };
    vm.paramsClone = angular.copy(vm.params);
    vm.pagingClone = angular.copy(vm.paging);
    getRoles();
  };
  // function public into views
  /**
   * handel cancel search
   * @return void
   */
  function cancelSearch() {
    vm.showSearch = false;
    resetSearch();
    getRoles();
  }
  /**
   * reset params
   * @return {Number} void
   */
  function resetSearch() {
    vm.params = angular.copy(vm.paramsClone);
    // vm.paging = angular.copy(vm.pagingClone);
  }
  /**
   * handel sort
   * @return void
   */
  function onSort(item) {
    vm.paging.order_by = item.orderBy;
    vm.paging.order_method = item.orderMethod;
    getRoles();
  }
  /**
   * handel change page
   * @return void
   */
  function onChangePage(item) {
    vm.paging.limit = item.pageLength;
    // vm.paging.limit = item.pageLength;
    vm.paging.offset = (item.currentPage - 1) * item.pageLength;
    // $log.info(vm.params.CertificateSearch.offset);
    getRoles();
  }
  /**
   * handel search
   * @return void
   */
  function onSearch() {
    vm.paging.offset = 0;
    getRoles();
  }
  vm.popup1 = {
    opened: false
  };
  vm.open1 = function () {
    vm.popup1.opened = true;
  };
  // popup 2
  vm.popup2 = {
    opened: false
  };
  vm.open2 = function () {
    vm.popup2.opened = true;
  };
  // popup 3
  vm.popup3 = {
    opened: false
  };
  vm.open3 = function () {
    vm.popup3.opened = true;
  };
  // popup 4
  vm.popup4 = {
    opened: false
  };
  vm.open4 = function () {
    vm.popup4.opened = true;
  };
  // end function public into views
  function getRoles() {
    var post = getParams();
    PermissionApi.roles({}, post).then(function (response) {
      vm.roleListing = [];
      if (!response.error) {
        _.each(response.data, function (v) {
          vm.roleListing.push(getObjectRole(v));
        });
        vm.totalItems = response.data.total;
        vm.pageNum = response.data.total_page;
      }
    });
  }
  function getParams() {
    vm.paramsSearch = angular.copy(vm.params);
    _.extend(vm.paramsSearch.CertificateFileSearch, vm.paging);
    vm.paramsSearch.CertificateFileSearch.start_date_of_death = DateTime.getStartTime(vm.paramsSearch.CertificateFileSearch.start_date_of_death);
    vm.paramsSearch.CertificateFileSearch.end_date_of_death = DateTime.getEndTime(vm.paramsSearch.CertificateFileSearch.end_date_of_death);
    vm.paramsSearch.CertificateFileSearch.end_register_date = DateTime.getEndTime(vm.paramsSearch.CertificateFileSearch.end_register_date);
    vm.paramsSearch.CertificateFileSearch.start_register_date = DateTime.getStartTime(vm.paramsSearch.CertificateFileSearch.start_register_date);
    if (!_.isEmpty(vm.requestParams)) {
      _.extend(vm.paramsSearch.CertificateFileSearch, vm.requestParams);
    }
    return vm.paramsSearch;
  }
  function getObjectRole(data) {
    return {
      'name': data.name,
      'description': data.description,
      'createdAt': DateTime.unix2Date(data.created_at),
      'updatedAt': DateTime.unix2Date(data.updated_at),
      'id': data.id
    };
  }
  vm.addNewRole = addNewRole;
  vm.addNewPermission = addNewPermission;
  function addNewRole(roleId) {
    $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      size: 'lg',
      backdrop: false,
      keyboard: false,
      templateUrl: 'static/modules/admin-permission/views/add-new-role.html',
      resolve: {
        roleId: function() {
          return roleId;
        }
      },
      controller: function ($log, $uibModalInstance, roleId) {
        var vm = this;
        vm.roleId = roleId;
        vm.close = close;
        vm.submit = submit;
        vm.toggleSelected = toggleSelected;
        vm.$onInit = function () {
          vm.permissions = [];
          vm.permissionSelected = [];
          getPermission();
          if (!_.isNull(roleId)) {
            PermissionApi.getPermissionByRole({id: roleId}).then(function (response) {
              if (!response.error) {
                vm.permissionSelected = _.pluck(response.data, 'permission_id');
              }
            });
          }
        };
        function getPermission() {
          PermissionApi.listPermission().then(function (response) {
            if (!response.error) {
              vm.permissions = response.data;
            }
          });
        }
        function close() {
          $uibModalInstance.close('closed');
        }
        function submit() {
          var post = {};
          if (!_.isNull(roleId)) {
            post = {
              role_id: roleId,
              selected: vm.permissionSelected
            };
            PermissionApi.roleUpdate(post).then(function (response) {
              if (!response.error) {
                $uibModalInstance.close('closed');
              }
            });
            // update
          } else {
            post = {
              role_name: vm.form.name,
              selected: vm.permissionSelected
            };
            PermissionApi.roleCreate(post).then(function (response) {
              if (!response.error) {
                $uibModalInstance.close('closed');
              }
            });
            // create
          }
        }
        function toggleSelected(select) {
          var selectId = select.id;
          var idx = vm.permissionSelected.indexOf(selectId);
          var idxPer = null;
          // Is currently selected
          if (idx > -1) {
            vm.permissionSelected.splice(idx, 1);
            idxPer = _.find(vm.permissions, function (v) {
              return v.id === selectId;
            });
            if (idxPer) {
              _.each(idxPer.parent, function (v) {
                var idxC = vm.permissionSelected.indexOf(v.id);
                vm.permissionSelected.splice(idxC, 1);
              });
            } else {
              // TODO
              var parent = _.find(vm.permissions, function (v) {
                return v.id === select.parent_id;
              });
              var listParentId = _.pluck(parent.parent, 'id');
              var diff = _.difference(listParentId, vm.permissionSelected);
              if (_.isEqual(listParentId, diff)) {
                var idd = vm.permissionSelected.indexOf(select.parent_id);
                vm.permissionSelected.splice(idd, 1);
              }
            }
          } else {
            vm.permissionSelected.push(selectId);
            // if parent then selected all child
            idxPer = _.find(vm.permissions, function (v) {
              return v.id === selectId;
            });
            if (idxPer) {
              _.each(idxPer.parent, function (v) {
                vm.permissionSelected.push(v.id);
              });
            } else {
              if (vm.permissionSelected.indexOf(select.parent_id) === -1) {
                vm.permissionSelected.push(select.parent_id);
              }
            }
          }
        }
      },
      controllerAs: 'vm'
    }).result.then(function () {
      // scope.callback();
    }, function (result) { });
  }
  function addNewPermission() {
    $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      size: 'sm',
      backdrop: false,
      keyboard: false,
      templateUrl: 'static/modules/admin-permission/views/add-permission.html',
      controller: function ($log, $uibModalInstance, PermissionApi) {
        var vm = this;
        vm.close = close;
        vm.submit = submit;
        vm.$onInit = function() {
          vm.listGroup = [];
          getPermission();
        };
        function getPermission() {
          PermissionApi.listPermission().then(function (response) {
            if (!response.error) {
              vm.listGroup = response.data;
            }
          });
        }
        function close() {
          $uibModalInstance.close('closed');
        }
        function submit() {
          // save
          PermissionApi.addPermission(vm.form).then(function (response) {
            if (!response.erorr) {
              $uibModalInstance.close('closed');
            }
          });
        }
      },
      controllerAs: 'vm'
    }).result.then(function () {
      // scope.callback();
    }, function (result) { });
  }
}

module.exports = AdminPermissionController;