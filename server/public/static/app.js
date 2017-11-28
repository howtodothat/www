(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

require('./modules/home');
require('./modules/common');
require('./modules/front');
// require('./modules/user');

require('./modules/admin');
require('./modules/admin-permission');
// require('./modules/admin-faqs');
// require('./modules/admin-profile');
// require('./modules/admin-user');
// require('./modules/admin-announcement');
// require('./modules/claims');
// require('./modules/vendor');
// require('./modules/admin-icd');
// require('./modules/admin-funding-source');
// require('./modules/admin-validation-rule');
// require('./modules/admin-eob');
// require('./modules/admin-medicare');
// require('./modules/admin-cpt');
// require('./modules/dashboard');
// require('./modules/auditing');
// require('./modules/accounting');
// require('./modules/reports');
// require('./modules/editor-upload');
// require('./modules/admin-pos');
// require('./modules/admin-paid-rate');
// require('./modules/admin-system-default');
// require('./modules/admin-alcolink');
var appName = 'LEVANCHO';
// aabb
angular.module(appName, [
  // load lib
  'ui.router',
  'ui.bootstrap',
  'ngSanitize',
  'ngResource',
  'highcharts-ng',
  'permission',
  'permission.ui',
  'blockUI',
  'ui.utils.masks',
  'idf.br-filters',
  'ngclipboard',
  'ngCookies',
  'ngTagsInput',
  'yaru22.angular-timeago',
  // 'ngQuill',
  'textAngular',
  'ngToast',
  'ngFileUpload',
  'angularjs-dropdown-multiselect',
  // load module
  'app.common',
  'app.front',
  'app.home',
  // 'app.adminFaqs',
  // 'app.user',
  'app.adminPermission',
  'app.admin'
  // 'app.adminUser',
  // 'app.adminProfile',
  // 'app.adminAnnouncement',
  // 'app.adminClaims',
  // 'app.vendor',
  // 'app.adminICD',
  // 'app.adminValidationRule',
  // 'app.adminFundingSource',
  // 'app.adminEob',
  // 'app.adminMedicare',
  // 'app.adminCPT',
  // 'app.dashboard',
  // 'app.auditing',
  // 'app.accounting',
  // 'app.reports',
  // 'app.editorUpload',
  // 'app.adminPOS',
  // 'app.adminPaidRate',
  // 'app.adminAlcolink',
  // 'app.adminSystemDefault'
]);
angular.module(appName).config(function ($urlRouterProvider, $permissionProvider, $httpProvider, $locationProvider,
  blockUIConfig, $uibTooltipProvider, uibDatepickerPopupConfig, $uibModalProvider, $provide, ngToastProvider) {
  $urlRouterProvider.otherwise("/");
  var appVersionScript = angular.element('input[name="app_version_script"]').val();
  // set default permission
  $permissionProvider.suppressUndefinedPermissionWarning(true);
  $permissionProvider.setDefaultOnUnauthorizedMethod('detachElement');
  $uibModalProvider.options = {
    backdrop: false,
    keyboard: false
  };
  $uibTooltipProvider.options({
    trigger: 'focus',
    appendToBody: true
  });

  uibDatepickerPopupConfig.appendToBody = true;
  // add access token into header request
  $httpProvider.interceptors.push(function ($q, $location, PermissionService, ngToast) {
    return {
      'request': function (config) {
        var accesTokken = PermissionService.getLoginToken();
        // config.headers['Access-Control-Allow-Methods'] = '*';
        if (accesTokken) {
          config.headers['access-token'] = accesTokken;
        }
        if (_.isUndefined(config.headers['Content-Type'])) {
          //
        } else {
          config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        if (config.url.match(/^static\/.*/)) {
          // s
          config.url = config.url + "?v=" + appVersionScript;
        }
        return config;
      },
      'responseError': function (response) {
        if (response.status === 403) {
          // handel eror response
          PermissionService.logOut();
          $location.path('/user/login');
        } else if (response.status === 401) {
          $location.path('/not-authorized-request');
        } else {
          // show error
          ngToast.danger(response.status + ': Internal Server Error');
        }
        return $q.reject(response);
      }
    };
  });
  // remove # on URL
  // NOTE enabled when deploy to host
  $locationProvider.html5Mode({
    enabled: true,
    requireBase: false
  });
  // auto show blockui
  blockUIConfig.autoBlock = true;
  blockUIConfig.requestFilter = function (config) {
    // If the request starts with '/api/common' ..
    if (config.url.match(/^\/api\/common.*/) || (config.url.indexOf('get-list-cities') !== -1) || (config.url.indexOf('get-list-states') !== -1)) {
      return false;
    }
    // if the request content param is off_auto_blockUI then return false
    if (config.url.match(/off_auto_blockUI/)) {
      return false;
    }
    if (angular.isDefined(config.params) && config.params.off_auto_blockUI) {
      return false;
    }
    if (config.url.match(/^\/api\/.*/)) {
      return true; // ... don't block it.
    }
  };
  // flash mgs
  // FlashProvider.setTimeout(5000);
  // FlashProvider.setShowClose(true);
  // icon svg

  $provide.decorator('taOptions', ['taRegisterTool', '$delegate', '$log', '$uibModal', function(taRegisterTool, taOptions, $log, $uibModal) {
    // $delegate is the taOptions we are decorating
    // here we override the default toolbars and classes specified in taOptions.
    taOptions.forceTextAngularSanitize = true; // set false to allow the textAngular-sanitize provider to be replaced
    taOptions.keyMappings = []; // allow customizable keyMappings for specialized key boards or languages
    taOptions.toolbar = [
      ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'pre', 'quote', 'bold', 'italics', 'underline', 'ul', 'ol', 'redo', 'undo', 'clear', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull', 'html', 'insertImage', 'insertLink']
      // 'wordcount', 'charcount'
    ];
    taOptions.classes = {
      focussed: 'focussed',
      toolbar: 'btn-toolbar',
      toolbarGroup: 'btn-group',
      toolbarButton: 'btn btn-default',
      toolbarButtonActive: 'active',
      disabled: 'disabled',
      textEditor: 'form-control',
      htmlEditor: 'form-control'
    };
    // register the tool with textAngular
    taRegisterTool('uploadImage', {
      iconclass: "fa fa-file-image-o",
      tooltiptext: "Upload image",
      action: function($deferred) {
        var t = this;
        $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'static/modules/editor-upload/views/upload-image-modal.html',
          controller: 'UploadImageModalController',
          controllerAs: 'vm'
        })
        .result
        .then(
          function (result) { },
          function (imgUrl) {
            // restoreSelection();
            $log.info(imgUrl);
            if (imgUrl !== 'closed') {
              t.$editor().wrapSelection('insertImage', imgUrl);
            }
            $deferred.resolve();
          }
        );
        return false;
      }
    });
    // add the button to the default toolbar definition
    taOptions.toolbar[0].push('uploadImage');
    return taOptions; // whatever you return will be the taOptions
  }]);

  // config for Toasts
  ngToastProvider.configure({
    horizontalPosition: 'center', // or 'fade'
    maxNumber: '1'
  });
});
// PermissionApi,
angular.module(appName).run(function ($log, $rootScope, PermissionApi, PermPermissionStrategies, $state) {
  $log.info($state);
  $rootScope.domain = "/api";
  // define role
  var deregisterationCallback = $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    // Utils.lossActivity();
    PermissionApi.permissionRun();
  });
  // $rootScope.$apply();
  $rootScope.$on('$destroy', deregisterationCallback);
  // permission default
  PermPermissionStrategies.detachElement = function ($element) {
    // s
    if (!_.isUndefined($element.attr('disabled-auth'))) {
      $element.css('pointer-events', 'none');
      $element.css('opacity', '0.8');
      $element.css('background', '#eee');
      $element.css('cursor', 'not-allowed');
      $element.prop('disabled', true);
    } else {
      $element.remove();
    }
  };
});
},{"./modules/admin":6,"./modules/admin-permission":2,"./modules/common":12,"./modules/front":19,"./modules/home":23}],2:[function(require,module,exports){
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
},{"./permission.controller.js":3,"./permissionApi.service.js":4}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
'use strict';

function permissionApi($log, $resource, $urlRouter, $httpParamSerializerJQLike, PermPermissionStore, PermRoleStore, PermissionService) {
  var permissionResource = $resource('api/permission/:action/:id', {},
    {
      index: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'index'
        }
      },
      gerPermissionByUser: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'get-permission-by-user'
        }
      },
      listPermission: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'list-permission'
        }
      },
      roles: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'roles'
        }
      },
      getPermissionByRole: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-permission-by-role'
        }
      },
      roleUpdate: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'role-update'
        }
      },
      roleCreate: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'role-create'
        }
      },
      addPermission: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'add-permission-child'
        }
      }
    }
  );
  return {
    listPermission: _listPermission,
    roles: _roles,
    permissionListing: _permissionListing,
    getPermissionByRole: _getPermissionByRole,
    roleCreate: _roleCreate,
    roleUpdate: _roleUpdate,
    permissionRun: _permissionRun,
    addPermission: _addPermission
  };
  function _addPermission(post) {
    return permissionResource.addPermission($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _roleUpdate(post) {
    return permissionResource.roleUpdate($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _roleCreate(post) {
    return permissionResource.roleCreate($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getPermissionByRole(get) {
    return permissionResource.getPermissionByRole(get)
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _roles(get, post) {
    return permissionResource.roles(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _permissionListing() {
    return permissionResource.index({})
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _listPermission() {
    return permissionResource.listPermission({})
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  // function _getPermissionByUser() {
  //   return permissionResource.gerPermissionByUser({})
  //     .$promise.then(function (response) {
  //       return angular.fromJson(angular.toJson(response));
  //     });
  // }
  function _permissionRun() {
    var per = PermissionService.getPermission();
    if (_.isUndefined(per)) {
      PermissionService.setAuthor('');
      PermissionService.setUser({});
      PermissionService.setLoginToken('');
      // $state.go('user.login');
    } else {
      PermissionService.defineRole(per);
    }
    // _getPermissionByUser().then(function (response) {
    //   PermissionService.defineRole(response.data);
    // });
  }
}

module.exports = permissionApi;
},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
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
},{"./admin.controller.js":5}],7:[function(require,module,exports){
'use strict';

function CommonApi($resource, $rootScope, $httpParamSerializerJQLike, Upload) {
  var commonResource = $resource($rootScope.domain + '/common/:action/:id', {},
    {
      stateList: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-list-states'
        }
      },
      uploadMaxFileSize: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-upload-max-file-size'
        }
      },
      cityList: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'get-list-cities'
        }
      },
      eobCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'eob-code-listing'
        }
      },
      divisionList: {
        method: 'GET',
        isArray: false,
        params: {
          action: 'get-list-divisions'
        }
      },
      cptCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'cpt-code-listing'
        }
      },
      icdCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'icd-code-listing'
        }
      },
      posCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'pos-code-listing'
        }
      },
      eobByCode: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'eob-by-code'
        }
      }
    }
  );
  return {
    getStateListing: _getStateListing,
    getCityListing: _getCityListing,
    getDivisionListing: _getDivisionListing,
    getEOBListing: _getEOBListing,
    getUploadMaxFileSize: _getUploadMaxFileSize,
    uploadImageEditor: _uploadImageEditor,
    getCPTListing: _getCPTListing,
    getICDListing: _getICDListing,
    getPOSListing: _getPOSListing,
    getEOBByCode: _getEOBByCode
  };

  function _getUploadMaxFileSize() {
    return commonResource.uploadMaxFileSize()
    .$promise.then(function (response) {
      return response;
    });
  }
  function _getStateListing() {
    return commonResource.stateList()
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getCityListing(get, post) {
    return commonResource.cityList(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getEOBListing(get, post) {
    return commonResource.eobCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getDivisionListing() {
    return commonResource.divisionList()
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _uploadImageEditor(params) {
    return Upload.upload({
      url: $rootScope.domain + '/common/upload-image-editor',
      data: params
    });
  }
  function _getCPTListing(get, post) {
    return commonResource.cptCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getICDListing(get, post) {
    return commonResource.icdCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getPOSListing(get, post) {
    return commonResource.posCode(get, $httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
  function _getEOBByCode(params) {
    return commonResource.eobByCode(params, {})
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
}

module.exports = CommonApi;

},{}],8:[function(require,module,exports){
'use strick';

function dateFormat() {
  return {
    require: 'ngModel',
    link: function (scope, elem, attr, ngModel) {
      function validate(value) {
        if (attr.maxDate) {
          if (angular.isDefined(value) && !_.isNull(value)) {
            ngModel.$setValidity('maxDate', true);
            var flag = true;
            flag = moment(value).isSameOrBefore(attr.maxDate);
            ngModel.$setValidity('maxDate', flag);
          }
        }
        if (attr.minDate) {
          if (angular.isDefined(value) && !_.isNull(value)) {
            ngModel.$setValidity('minDate', true);
            var flagMin = true;
            flagMin = moment(value).isSameOrAfter(attr.minDate);
            ngModel.$setValidity('minDate', flagMin);
          }
        }
      }
      scope.$watch(function () {
        return ngModel.$viewValue;
      }, validate);
    }
  };
}
module.exports = dateFormat;
},{}],9:[function(require,module,exports){
'use strict';

function DateTime($sce, $log) {
  // moment().utcOffset("-11:00");
  var timeZone = moment().format("Z");
  return {
    unix2DateTime: _unix2DateTime,
    unix2Date: _unix2Date,
    unix2DateFormat: _unix2DateFormat,
    unix2UtcDate: _unix2UtcDate,
    unix2DateA: _unix2DateA,
    unix2MonthYear: _unix2MonthYear,
    date2Date: _date2Date,
    date2DateSql: _date2DateSql,
    getTimeZone: _getTimeZone,
    getStartTime: _getStartTime,
    getEndTime: _getEndTime,
    getThisQuarter: _getThisQuarter,
    getListMonthOfYear: _getListMonthOfYear,
    getDayOfMonth: _getDayOfMonth,
    getQuarterStartEnd: _getQuarterStartEnd,
    getMonthStartEnd: _getMonthStartEnd,
    getStartTimeUTC: _getStartTimeUTC,
    getEndTimeUTC: _getEndTimeUTC,
    getListQuarter: _getListQuarter,
    getEachMonthOfQuarter: _getEachMonthOfQuarter,
    now2Unix: _now2Unix,
    formatDate: _formatDate,
    nowDate: _nowDate,
    formatRequest: _formatRequest
  };
  function _nowDate() {
    return moment().format('MM/DD/YY');
  }
  function _formatDate(date) {
    return (date && date !== '0000-00-00') ? moment(date).format('MM/DD/YY') : '';
  }
  function _formatRequest(date) {
    return date ? moment(date).format('YYYY-MM-DD') : null;
  }
  function _getEachMonthOfQuarter(quarter, year) {
    var listMonthOfQuater = {
      1: [0, 1, 2],
      2: [3, 4, 5],
      3: [6, 7, 8],
      4: [9, 10, 11]
    };
    var month = listMonthOfQuater[quarter];
    return {
      first: {
        start: moment().year(year).month(month[0]).startOf('month').format('DD-MM-YYYY 00:00:00'),
        end: moment().year(year).month(month[0]).endOf('month').format('DD-MM-YYYY 23:59:59'),
        name: moment().year(year).month(month[0]).startOf('month').format('MMM') + ' ' + year
      },
      second: {
        start: moment().year(year).month(month[1]).startOf('month').format('DD-MM-YYYY 00:00:00'),
        end: moment().year(year).month(month[1]).endOf('month').format('DD-MM-YYYY 23:59:59'),
        name: moment().year(year).month(month[1]).startOf('month').format('MMM') + ' ' + year
      },
      last: {
        start: moment().year(year).month(month[2]).startOf('month').format('DD-MM-YYYY 00:00:00'),
        end: moment().year(year).month(month[2]).endOf('month').format('DD-MM-YYYY 23:59:59'),
        name: moment().year(year).month(month[2]).startOf('month').format('MMM') + ' ' + year
      }
    };
  }
  function _getListQuarter() {
    return [
      { name: 'Jan - Feb - Mar', id: 1, alias: 'Jan_Mar', aliasMonth: 'January-February-March', file: 'Jan-Feb-Mar' },
      { name: 'Apr - May - Jun', id: 2, alias: 'Apr_Jun', aliasMonth: 'April-May-June', file: 'Apr-May-Jun' },
      { name: 'Jul - Aug - Sep', id: 3, alias: 'Jul_Sep', aliasMonth: 'July-August-September', file: 'Jul-Aug-Sep' },
      { name: 'Oct - Nov - Dec', id: 4, alias: 'Oct_Dec', aliasMonth: 'October-November-December', file: 'Oct-Nov-Dec' }
    ];
  }
  function _date2Date(value) {
    if (value) {
      return moment(value).utcOffset(timeZone).format('MM/DD/YY');
    }
    return '';
  }
  function _date2DateSql(value) {
    if (value) {
      return moment(value).utcOffset(timeZone).format('YYYY-MM-DD');
    }
    return '';
  }
  function _unix2DateTime(value) {
    if (value) {
      value = parseInt(value);
      return convert2Date(value, 'MM/DD/YY hh:mm A');
    }
    return '';
  }
  function _unix2Date(value) {
    if (value) {
      value = parseInt(value);
      return convert2Date(value, 'MM/DD/YY');
    }
    return '';
  }
  function _unix2DateFormat(value, format) {
    // = 'MM/DD/YY'
    if (_.isUndefined(format) || _.isNull(format)) {
      format = 'MM/DD/YY';
    }
    if (value) {
      value = parseInt(value);
      return convert2Date(value, format);
    }
    return '';
  }
  function _unix2UtcDate(value) {
    if (value) {
      value = parseInt(value);
      return convert2UtcDate(value, 'MM/DD/YY');
    }
    return '';
  }
  function _unix2DateA(value) {
    if (value) {
      value = parseInt(value);
      // MAY 09 2017
      return convert2Date(value, 'MMM DD Y');
    }
    return '';
  }
  function _unix2MonthYear(value) {
    if (value) {
      value = parseInt(value);
      return convert2Date(value, 'MM/YY');
    }
    return '';
  }
  function _now2Unix(d) {
    return moment(d).utcOffset("0").unix();
  }
  function convert2Date(value, format) {
    return moment.unix(value).utcOffset(timeZone).format(format);
  }
  function convert2UtcDate(value, format) {
    return moment.unix(value).utcOffset(0).format(format);
  }
  function _getTimeZone() {
    return timeZone;
  }
  function _getStartTime(d) {
    if (_.isNull(d) || _.isUndefined(d)) {
      return null;
    }
    return moment(d).utcOffset("+0").hour(0).minute(0).seconds(0).unix();
  }
  function _getEndTime(d) {
    if (_.isNull(d) || _.isUndefined(d)) {
      return null;
    }
    return moment(d).utcOffset("+0").hour(23).minute(59).seconds(59).unix();
  }
  function _getStartTimeUTC(d) {
    if (_.isNull(d) || _.isUndefined(d)) {
      return null;
    }
    return moment.utc(d.toString()).startOf('day').unix();
  }
  function _getEndTimeUTC(d) {
    if (_.isNull(d) || _.isUndefined(d)) {
      return null;
    }
    return moment.utc(d.toString()).endOf('day').unix();
  }
  function _getThisQuarter() {
    // get start year
    var result = [];
    var _current = moment();
    // var now = _current.unix();
    var thisYear = _current.year();
    var thisQuarty = _current.quarter();
    var startQuarty = moment(thisYear + '-01-01 00:00:00').quarter(thisQuarty);
    var endDateOfStartQuarty = _getDayOfMonth(startQuarty.format('M'), null);
    var obj = {
      month: startQuarty.format('MMM'),
      start: startQuarty.unix(),
      end: _getEndTime(endDateOfStartQuarty.lastDay)
    };
    var endCurrentMonth = _getDayOfMonth(_current.format('M'), null);
    endCurrentMonth = moment(endCurrentMonth.firstDay).unix();
    result.push(obj);
    for (var i = 0; i <= 1; i++) {
      var nextMonth = parseInt(startQuarty.format('M'));
      nextMonth = startQuarty.month(nextMonth);
      if (nextMonth.unix() < endCurrentMonth) {
        endDateOfStartQuarty = _getDayOfMonth(startQuarty.format('M'), null);
        obj = {
          month: startQuarty.format('MMM'),
          start: startQuarty.unix(),
          end: _getEndTime(endDateOfStartQuarty.lastDay)
        };
        result.push(obj);
      }
    }
    return result;
  }

  function _getQuarterStartEnd(year, quarter) {
    return {
      startQuarter: moment().year(year).quarter(quarter).startOf('quarter').format('MM-DD-YYYY'),
      endQuarter: moment().year(year).quarter(quarter).endOf('quarter').format('MM-DD-YYYY'),
      startQuarterDate: moment().year(year).quarter(quarter).startOf('quarter'),
      endQuarterDate: moment().year(year).quarter(quarter).endOf('quarter')
    };
  }

  function _getMonthStartEnd(year, month) {
    return {
      startMonth: moment().year(year).month(month).startOf('month').format('MM-DD-YYYY'),
      endMonth: moment().year(year).month(month).endOf('month').format('MM-DD-YYYY'),
      startMonthDate: moment().year(year).month(month).startOf('month').toDate(),
      endMonthDate: moment().year(year).month(month).endOf('month').toDate()
    };
  }

  function _getListMonthOfYear(thisYear) {
    var result = [];
    var _current = moment();
    if (thisYear < (_current.format('Y') - 0)) {
      _current = moment(thisYear + '-12-31 23:59:59');
    }
    var startQuarty = moment(thisYear + '-01-01 00:00:00');
    var obj, endDateOfStartQuarty;
    var endCurrentMonth = _getDayOfMonth(_current.format('M'), thisYear);
    endCurrentMonth = moment(endCurrentMonth.lastDay).unix();

    endDateOfStartQuarty = _getDayOfMonth(startQuarty.format('M'), thisYear);
    obj = {
      month: startQuarty.format('MMM'),
      start: startQuarty.unix(),
      end: _getEndTime(endDateOfStartQuarty.lastDay)
    };
    result.push(obj);
    for (var i = 0; i <= 10; i++) {
      var nextMonth = parseInt(startQuarty.format('M'));
      nextMonth = startQuarty.month(nextMonth);
      if (nextMonth.unix() < endCurrentMonth) {
        endDateOfStartQuarty = _getDayOfMonth(startQuarty.format('M'), thisYear);
        obj = {
          month: startQuarty.format('MMM'),
          start: startQuarty.unix(),
          end: _getEndTime(endDateOfStartQuarty.lastDay)
        };
        result.push(obj);
      }
    }
    return result;
  }
  function _getDayOfMonth(m, y) {
    var date = new Date();
    m = m || date.getMonth();
    y = y || date.getFullYear();
    m = parseInt(m);
    y = parseInt(y);
    return {
      firstDay: new Date(y, m, 1),
      lastDay: new Date(y, m, 0)
    };
  }
}
module.exports = DateTime;
},{}],10:[function(require,module,exports){
'use strick';

function datepickerFixyear($log, DateTime, $timeout) {
  return {
    restrict: 'A',
    require: 'ngModel',
    link: function (scope, element, attrs, ctrl) {
      function parser(value) {
        if (ctrl.$isEmpty(value)) {
          return value;
        } else {
          element.val(DateTime.formatDate(value));
          return new Date(value);
        }
      }
      function formatter(value) {
        if (ctrl.$isEmpty(value)) {
          return value;
        } else {
          ctrl.$setViewValue(value);
          return value;
        }
      }
      // unbind parser and formatter of datepicker
      ctrl.$parsers = [];
      ctrl.$formatters = [];
      // view to model
      ctrl.$parsers.push(parser);
      // model to view
      ctrl.$formatters.push(formatter);
      // run first time
      // $timeout(function () {
      //   if (!_.isEmpty(element.val())) {
      //     element.val(DateTime.formatDate(element.val()));
      //   }
      // });
    }
  };
}
module.exports = datepickerFixyear;

},{}],11:[function(require,module,exports){
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
},{}],12:[function(require,module,exports){
'use strict';

// Thachlh121
angular.module("app.common", [])
  .provider('expiredSession', require("./expiredSession.provider.js"))
  // .provider('sysAlert', require("./sysAlert.provider.js"))
  // .provider('confirmAlert', require("./confirmAlert.provider.js"))
  // fatory
  .factory('PermissionService', require("./permission.service.js"))
  // .factory('PatternService', require("./pattern.service.js"))
  .factory('CommonApiService', require("./commonApi.service.js"))
  .factory('DateTime', require("./dateTime.service.js"))
  .factory('Utils', require("./utils.service.js"))
  .factory('MessageService', require("./message.service.js"))
  // .factory('MasterDataService', require("./masterData.service.js"))
  // director
  // .directive('confirmPopup', require("./confirmPopup.directive.js"))
  // .directive('backBtn', require("./backBtn.directive.js"))
  // .directive('compareTo', require("./compareTo.directive.js"))
  // .directive('expirationDate', require("./expirationDate.directive.js"))
  // .directive('goTo', require("./goTo.directive.js"))
  .directive('sortThead', require("./sortThead.directive.js"))
  .directive('pagination', require("./pagination.directive.js"))
  .directive('dateFormat', require("./dateFormat.directive.js"))
  // .directive('isObject', require("./isObject.directive.js"))
  // .directive('fileModel', require("./fileModle.directive.js"))
  // .directive('isObjectOrNull', require("./isObjectOrNull.directive.js"))
  // .directive('getSizeBlock', require("./getSizeBlock.directive.js"))
  // .directive('affix', require("./affix.direcive.js"))
  // .directive('fileModelMultiple', require("./fileModelMultiple.directive.js"))
  // .directive('markCreditCard', require("./markCreditCard.directive.js"))
  // .directive('capitalize', require("./capitalize.directive.js"))
  // .directive('alwayFooter', require("./alway-footer.directive.js"))
  .directive('datepickerFixyear', require("./datepicker-fixyear.directive.js"))
  // filter
  // .filter('usPhone', [require("./usPhoneNumber.filter.js")])
  // .filter('hidenText', [require("./hidenText.filter.js")])
  // .filter('limitWord', [require("./limitWord.filter.js")])
  // contants
  // .constant('appConstant', require("./appConstant.js"));
  .run(function ($templateCache) {
    $templateCache.put("typeahead-eob-code.html",
      "<a href\n" +
      "   tabindex=\"-1\"\n" +
      "   ng-bind-html=\"(match.label + ' - ' + match.model.description) | limitWord:true:30: '...' | uibTypeaheadHighlight:query \"\n" +
      "   ng-attr-title=\"{{match.model.description}}\"></a>\n" +
      "");
  });

},{"./commonApi.service.js":7,"./dateFormat.directive.js":8,"./dateTime.service.js":9,"./datepicker-fixyear.directive.js":10,"./expiredSession.provider.js":11,"./message.service.js":13,"./pagination.directive.js":14,"./permission.service.js":15,"./sortThead.directive.js":16,"./utils.service.js":17}],13:[function(require,module,exports){
'use strict';

function MessageService() {
  // we could do additional work here too
  var message = {
    Us: {
      'notJSON': 'Internal Error.',
      'user.profile-update.successful': 'Edit Profile successfully.',
      'user.login.inactived': 'This user has been inactived.',
      'user.login.rejected': 'This user has been rejected.',
      'contact.successful': 'contact successful.',
      'signup.certificate_file.isrequired': 'Attach Certification is required.',
      'signup.esignature.isrequired': 'eSignature is required.',
      'M-01': 'This action will clear all your inputted data. Are you sure?',
      'M-02': 'Update has been saved successfully.',
      'M-03': 'This email address has already been taken.',
      'M-04': 'Internet Error',
      'M-05': 'Request reset password successfully! Please check your email. Thank you!',
      'M-08': 'Reset password successfully! Thank you!',
      'M-06': 'Your account has been registered successfully! Thank you!',
      'M-07': 'Token invalid!',
      'login.incorrect': 'Wrong username or password. Please check!',
      'hover-explain-cancel': 'Remove and Close this request service',
      'hover-explain-reject': 'Send back to Requester for update',
      'hover-explain-post': 'Assign banknotes number and Print the certificates',
      'hover-explain-deliver': 'Pick up at the office or Send post mail - Request Service completed',
      'hover-explain-resubmit': 'Submit back to Mortician System',
      'hover-explain-clone': 'Clone this request',
      'hover-explain-duplicate': 'Duplicate this request',
      'request.required.add-burial-permit': 'Please add Burial Permit',
      'request.required.veteran_once': 'Veteran copy allowed ONLY once',
      'request.required.veteran_same_death': "The number of Death Certificate should be greater than 1 if Veteran's copy is checked!",
      'certificate.refund.payment_not_found': "The payment was not found",
      'certificate.refund.cannot_be_issued': "The refund cannot be issued",
      'certificate.refund.authentication_failed': "Authentication failed",
      'message.compose.success': "Your message was sent",
      'message.cancel.success': "Your message has been saved to Cancel Box.",
      'certificates.verify.successful': "Verify successfully.",
      'certificates.un-verify.successful': "Unverify successfully.",
      'select.verified.certificate.only': "Please select verified certificate only.",
      'select.certificate.non-verified.only': "Please select non-verified certificate only.",
      'confirm.save-message-to-cancel-box': "Do you want to save change to Cancel Box?",
      'certificate.change_status.banknote_not_enought': "Banknotes is not enough.",
      'certificate.change_status.banknote_no_invalid': "Banknote ID is invalid.",
      'certificate.create.verify_sign_fail': 'Signature is invalid.',
      'banknote.avoid.banknote_series_invalid': 'Banknote is invalid.',
      'banknote.avoid.banknote_not_enought': 'Banknotes is not enough.',
      'request.required.need-pay-burial-permit': 'You have registered :num Burial Permits from State. Please input them into this request.',
      'post-certificate.not-enough-paid-burial': 'Warning! This request has not paid for :num Burial Permits before.',
      'post-certificate.overwrite-amend-file': 'Do you want to overwrite Amend File?',
      'certificate.void-banknotes.success': 'Banknote (:void) is void and replaced by (:use) successfully',
      'post-certificate.amend-not-same-death-file': 'The state file number of Death Certificate is not matching Amend File',
      'download.file-not-found': 'File not found',
      'claim.save.success': 'Claim has been saved successfully.',
      'claim.submit.success': 'Claim has been submitted successfully.',
      'claim.editted.success': 'Edited successfully',
      'claim.save.invaildInput': 'Please enter data.',
      'claim.save.validate.atLeastOneRowService': 'Please enter at least one row service.',
      'claim.esign.reponse.error': 'Error: cannot make e-sign.',
      'claim.update.success': 'Claim has been saved successfully.',
      'claim.update.status.ask': 'Do you want to :type this claim?',
      'claim.update.status.success': 'The Claim [:name] has been :type',
      'claim.state.change.confirm': "You haven't finished your claim yet. Do you want to leave without finishing?",
      'payment.edit.status.missing-claim': 'There is no claim in this batch. Please add claim!',
      'eob.save.success': 'EOB code [:code] has been added successfully.',
      'eob.edit.success': 'EOB code [:code] has been edited successfully.',
      'eob.delete.confirm': 'Do you want to remove EOB code [:code]?',
      'eob.in-active.success': 'Change status successfully',
      'eob.active.success': 'Change status successfully',
      'eob.in-active.selected-empty': 'Please select at least one row',
      'cpt.save.success': 'CPT code [:code] has been added successfully.',
      'cpt.edit.success': 'CPT code [:code] has been edited successfully.',
      'cpt.delete.confirm': 'Do you want to remove CPT code [:code]?',
      'cpt.import.success': '[:name] has been imported successfully.',
      'cpt.edit.not_found': 'This item has removed.',
      'medicare.save.success': 'Added successfully.',
      'medicare.edit.success': 'Edited successfully.',
      'medicare.delete.confirm': 'Do you want to remove this Medicare?',
      'medicare.import.success': 'Medicare has been imported successfully.',
      'medicare.edit.not_found': 'This item has removed.',
      'funding-source.remove.success': 'Removed [:name] successfully.',
      'funding-source.remove.ask': 'Do you want to remove FUNDING SOURCE ID [:name]?',
      'funding-source.add.success': 'FUNDING SOURCE ID [:name] has been added successfully.',
      'funding-source.edit.success': 'FUNDING SOURCE ID [:name] has been edited successfully.',
      'icd.save.success': 'ICD code [:code] has been added successfully.',
      'icd.edit.success': 'ICD code [:code] has been edited successfully.',
      'icd.delete.confirm': 'Do you want to remove ICD code [:code]?',
      'common.import.success': '[:name] has been imported successfully.',
      'validation-rule.inactive.ask': 'Do you want to inactive in Rule ID [:name]?',
      'validation-rule.active.ask': 'Do you want to active in Rule ID [:name]?',
      'validation-rule.active.success': 'Rule ID [:name] active successfully',
      'validation-rule.inactive.success': 'Rule ID [:name] inactive successfully',
      'pos.save.success': 'POS code [:code] has been added successfully.',
      'pos.edit.success': 'POS code [:code] has been edited successfully.',
      'pos.delete.confirm': 'Do you want to remove POS code [:code]?',
      'paid-rate.save.success': 'Added successfully.',
      'paid-rate.edit.success': 'Edited successfully.',
      'paid-rate.delete.confirm': 'Do you want to remove it?',
      'paid-rate.import.success': '[:name] has been imported successfully.',
      'paid-rate.update-config.success': 'Edited successfully.',
      'system-default.edit.success': 'Edited successfully.',
      'system-default.save.success': 'Added successfully.',
      'system-default.delete.confirm': 'Do you want to remove this item?',
      'vendor.renew-reject.success': 'Reject successfully',
      'vendor.approve.success': 'Approve successfully',
      'vendor.renew.success': 'Upload certificate successfully'
    }
  };
  var paymentMethod = ['Check', 'Cash', 'Credit Card'];
  var paymentMethodListing = [
    { id: 0, name: 'Check' },
    { id: 1, name: 'Cash' },
    { id: 2, name: 'Credit Card' }
  ];
  return {
    getContent: _getContent,
    getNamePaymentMethod: _getNamePaymentMethod,
    getFailMessage: _getFailMessage,
    getListPaymentMethod: _getListPaymentMethod
  };
  function _getListPaymentMethod() {
    return paymentMethodListing;
  }
  function _getContent(id, $arr) {
    var text = id;
    if (!_.isUndefined($arr)) {
      if (message.Us[id]) {
        text = message.Us[id];
        _.each($arr, function (v, k) {
          text = text.replace(':' + k, v);
        });
      }
    } else {
      if (message.Us[id]) {
        text = message.Us[id];
      }
    }
    return text;
  }
  function _getNamePaymentMethod(id) {
    return paymentMethod[id];
  }
  function _getFailMessage(message) {
    var failAuthorMsg = '';
    if (_.isObject(message)) {
      _.each(message, function (num, key) {
        failAuthorMsg = num[0];
      });
    } else {
      failAuthorMsg = message;
    }
    return _getContent(failAuthorMsg);
  }
}

module.exports = MessageService;
},{}],14:[function(require,module,exports){
'use strict';

function pagination($log, $templateCache) {
  $templateCache.put("pagination-template.html",
  "<li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-first\"><a href=\"#\" ng-click=\"selectPage(1, $event)\" ng-disabled=\"noPrevious()||ngDisabled\" uib-tabindex-toggle>{{::getText('first')}}</a></li>\n" +
  "<li ng-if=\"::directionLinks\" ng-class=\"{disabled: noPrevious()||ngDisabled}\" class=\"pagination-prev\"><a href=\"#\" ng-click=\"selectPage(page - 1, $event)\" ng-disabled=\"noPrevious()||ngDisabled\" uib-tabindex-toggle>{{::getText('previous')}}</a></li>\n" +
  "<li ng-repeat=\"page in pages track by $index\" ng-class=\"{active: page.active,disabled: ngDisabled&&!page.active}\" class=\"pagination-page\"><a href=\"#\" ng-click=\"selectPage(page.number, $event)\" ng-disabled=\"ngDisabled&&!page.active\" uib-tabindex-toggle>{{page.text}}</a></li>\n" +
  "<li ng-if=\"::directionLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-next\"><a href=\"#\" ng-click=\"selectPage(page + 1, $event)\" ng-disabled=\"noNext()||ngDisabled\" uib-tabindex-toggle>{{::getText('next')}}</a></li>\n" +
  "<li ng-if=\"::boundaryLinks\" ng-class=\"{disabled: noNext()||ngDisabled}\" class=\"pagination-last\"><a href=\"#\" ng-click=\"selectPage(totalPages, $event)\" ng-disabled=\"noNext()||ngDisabled\" uib-tabindex-toggle>{{::getText('last')}}</a></li>\n" +
  "");
  var listPage = [
    {id: 10, value: 10},
    {id: 25, value: 25},
    {id: 50, value: 50},
    {id: 100, value: 100}
  ];
  return {
    restrict: 'AE',
    scope: {
      totalItems: '=',
      pageNum: '=',
      currentPage: '=',
      callback: '&onChanged',
      pageLength: '=?'
      // selectedOpt: '=?'
    },
    templateUrl: 'static/modules/common/views/pagination.html',
    link: function ($scope) {
      $scope.pageLength = $scope.pageLength || 10;
      $scope.pageOption = listPage;
      if (_.isNull($scope.currentPage) || _.isUndefined($scope.currentPage) || _.isEmpty($scope.currentPage)) {
        $scope.currentPage = 1;
      }
      $scope.onPageChange = function () {
        $scope.finish();
      };
      $scope.changePageLength = function () {
        $scope.currentPage = 1;
        $scope.finish();
      };
      $scope.finish = function () {
        var obj = {
          currentPage: $scope.currentPage,
          pageLength: $scope.pageLength
        };
        $scope.callback({
          item: obj
        });
      };
    }
  };
}
module.exports = pagination;
},{}],15:[function(require,module,exports){
'use strick';

function PermissionService($cookies, $log, PermRoleStore, PermPermissionStore, $location) {
  // we could do additional work here too
  // var permissionResource = $resource('api/permission/:action/:id', {},
  //   {
  //     gerPermissionByUser: {
  //       method: 'POST',
  //       isArray: false,
  //       params: {
  //         action: 'get-permission-by-user'
  //       }
  //     }
  //   }
  // );
  var domainName = $location.host() + '_';
  var listStatusCert = [
    { name: 'Pending', id: 0 },
    { name: 'Post', id: 1 },
    { name: 'Deliver', id: 2 },
    { name: 'Reject', id: 3 },
    { name: 'Cancel', id: 4 }
  ];
  var listStatusUser = [
    { name: 'Pending', id: 0 },
    { name: 'Active', id: 1 },
    { name: 'Inactive', id: 2 },
    { name: 'Reject', id: 3 },
    { name: 'Removed', id: 4 }
  ];
  var listType = [
    { id: null, name: 'ALL' },
    { id: 0, name: 'VIEWER' },
    { id: 1, name: 'VENDOR' },
    { id: 2, name: 'IS' },
    { id: 3, name: 'DOCTOR AUDITER' },
    { id: 4, name: 'ACCOUNTING' },
    { id: 5, name: 'AUDIT OFFICER' },
    { id: 6, name: 'A ADMIN' },
    { id: 7, name: 'DIRECTOR' },
    { id: 8, name: 'SYSTEM ADMIN' }
  ];
  var listTypeByName = {
    VIEWER: 0,
    VENDOR: 1,
    IS: 2,
    DOCTOR_AUDITER: 3,
    ACCOUNTING: 4,
    AUDIT_OFFICER: 5,
    A_ADMIN: 6,
    DIRECTOR: 7,
    SYSTEM_ADMIN: 8
  };
  // var listRole = ['General', 'Funeral Home', 'A Billing', 'A Service', 'A Admin', 'System Admin', 'Director', 'Super Admin'];
  var listRole = ['VIEWER', 'VENDOR', 'IS', 'DOCTOR AUDITER', 'ACCOUNTING', 'AUDIT OFFICER', 'A ADMIN', 'DIRECTOR', 'SYSTEM ADMIN'];
  return {
    getPermission: _getPermission,
    setPermission: _setPermission,
    getRole: _getRole,
    getRoleName: _getRoleName,
    getStatusName: _getStatusName,
    getListType: _getListType,
    getListLowerType: _getListLowerType,
    getStatusCert: _getStatusCert,
    getListStatusCert: _getListStatusCert,
    getListStatusCertPluck: _getListStatusCertPluck,
    getListStatusUser: _getListStatusUser,
    getListStatusUserPluck: _getListStatusUserPluck,
    getStatusUserByName: _getStatusUserByName,
    getStatusCertByName: _getStatusCertByName,
    getUser: _getUser,
    setUser: _setUser,
    setAuthor: _setAuthor,
    getAuthor: _getAuthor,
    setLoginToken: _setLoginToken,
    getLoginToken: _getLoginToken,
    defineRole: _defineRole,
    logOut: _logOut,
    getRoleIDByName: _getRoleIDByName,
    checkPermission: _checkPermission
  };
  function _logOut() {
    _setAuthor('');
    _setUser({});
    _setLoginToken('');
    _setPermission({});
    PermPermissionStore.clearStore();
    PermRoleStore.clearStore();
  }
  function _getRoleIDByName() {
    return listTypeByName;
  }
  function _getRole(type) {
    // const TYPE_GENERAL = 0;
    // const TYPE_MORTUARY = 1;
    // const TYPE_A = 2;
    type = parseInt(type);
    var role = 'admin';
    if (type === 1) {
      role = 'funeral';
    } else if (type === 0) {
      role = 'general';
    }
    return role;
  }
  function _getStatusName(status) {
    return _getNameObj(listStatusUser, status);
  }
  function _getRoleName(roleId) {
    roleId = parseInt(roleId);
    return listRole[roleId];
  }
  function _setPermission(per) {
    $cookies.putObject(domainName + 'permission', per);
  }
  function _getPermission(author) {
    return $cookies.getObject(domainName + 'permission');
    // api
  }
  function _getListType(except) {
    // 0: TYPE_DEATH
    // 1: TYPE_FETAL
    // 2: TYPE_BURIED
    return _getListObj(listType, except);
  }
  function _getListLowerType(currentRole, except) {
    return _getListLowerObj(listType, currentRole, except);
  }
  function _getStatusCert(status) {
    return _getNameObj(listStatusCert, status);
  }
  function _getListStatusCert(except) {
    return _getListObj(listStatusCert, except);
  }
  function _getListStatusCertPluck(except, propertyName) {
    return _getListPluck(listStatusCert, except, propertyName);
  }
  function _getListStatusUser(except) {
    return _getListObj(listStatusUser, except);
  }
  function _getListStatusUserPluck(except, propertyName) {
    return _getListPluck(listStatusUser, except, propertyName);
  }
  function _getStatusUserByName(name) {
    return _getIdObj(listStatusUser, name);
  }
  function _getStatusCertByName(name) {
    return _getIdObj(listStatusCert, name);
  }
  // private function
  function _getNameObj(obj, id) {
    id = parseInt(id);
    var even = _.find(obj, function (num) { return num.id === id; });
    return even.name;
  }
  function _getIdObj(obj, name) {
    // id = parseInt(id);
    var even = _.find(obj, function (num) { return num.name === name; });
    return even.id;
  }
  function _getListObj(obj, except) {
    if (_.isUndefined(except)) {
      return obj;
    }
    return _.filter(obj, function (num, k) {
      if (_.isArray(except)) {
        return !_.contains(except, num.name);
      } else {
        return except !== num.name;
      }
    });
  }
  function _getListLowerObj(obj, currentRole, except) {
    if (_.isUndefined(except)) {
      return obj;
    }
    return _.filter(obj, function (num, k) {
      if (_.isArray(except)) {
        // $log.info('AAAA', !_.contains(except, num.name));
        // $log.info('BBBBB', parseInt(currentRole));
        return (!_.contains(except, num.name)) && (parseInt(currentRole) > num.id);
      } else {
        var test2 = except !== num.name;
        return test2;
      }
    });
  }
  function _getListPluck(obj, except, propertyName) {
    if (_.isUndefined(propertyName)) {
      propertyName = 'id';
    }
    if (_.isUndefined(except)) {
      return _.pluck(obj, propertyName);
    }
    var objFilet = _.filter(obj, function (num, k) {
      if (_.isArray(except)) {
        return !_.contains(except, num.name);
      } else {
        return except !== num.name;
      }
    });
    return _.pluck(objFilet, propertyName);
  }
  function _getUser() {
    return $cookies.getObject(domainName + 'user');
  }
  function _setUser(user) {
    $cookies.putObject(domainName + 'user', user);
  }
  function _setAuthor(item) {
    $cookies.put(domainName + 'author', item);
  }
  function _getAuthor() {
    return $cookies.get(domainName + 'author');
  }
  function _setLoginToken(accessToken) {
    $cookies.put(domainName + 'loginTokenCookie', accessToken);
  }
  function _getLoginToken() {
    return $cookies.get(domainName + 'loginTokenCookie');
  }
  function _defineRole(permission) {
    PermPermissionStore.clearStore();
    PermRoleStore.clearStore();
    var author = _getAuthor() ? _getAuthor() : 'guest';
    if (author !== 'guest') {
      PermRoleStore.defineRole(author, permission);
      PermPermissionStore.defineManyPermissions(permission, function (permissionName) {
        return _.contains(permission, permissionName);
      });
    } else {
      permission = ['guest', 'seeResubmitBtnDetailRequest'];
      PermRoleStore.defineRole(author, permission);
      PermPermissionStore.defineManyPermissions(permission, function (permissionName) {
        return _.contains(permission, permissionName);
      });
    }
  }
  function _checkPermission(permissionName) {
    var listPermission = _getPermission();
    var hasPermission = _.find(listPermission, function(p) {
      return p === permissionName;
    });
    if (angular.isDefined(hasPermission)) {
      return true;
    }
    return false;
  }
}

module.exports = PermissionService;
},{}],16:[function(require,module,exports){
'use strick';

function sortThead($log) {
  return {
    link: link,
    scope: {
      callback: '&onSort',
      dataSearch: '=sortThead'
    }
  };
  function link(scope, element, attrs) {
    init();
    function init() {
      var elems = element.children();
      var def = attrs.sortThead;
      if (_.isEmpty(def)) {
        def = 'desc';
      } else {
        def = def.toLocaleLowerCase();
      }
      if (!scope.dataSearch) {
        return false;
      }
      _.each(elems, function (el) {
        if (!el.hasAttribute('no-sort')) {
          angular.element(el).addClass('sorting');
        }
      });
      scope.$watch('dataSearch', function() {
        if (!scope.dataSearch) {
          return false;
        }
        var desc = element.children("th[class='sorting_desc']");
        desc.removeClass('sorting_desc');
        desc.addClass('sorting');
        var asc = element.children("th[class='sorting_asc']").removeClass('sorting_asc');
        asc.removeClass('sorting_desc');
        asc.addClass('sorting');
        element.children("th[key='" + scope.dataSearch.order_by + "']").addClass('sorting_' + scope.dataSearch.order_method.toLocaleLowerCase());
        element.children("th[key='" + scope.dataSearch.order_by + "']").removeClass('sorting');
      }, true);
      elems.on('click', function () {
        var self = angular.element(this);
        if (this.hasAttribute('no-sort')) {
          return;
        }
        var notMe = element.children().not(angular.element(this)).not('[no-sort]');
        notMe.removeClass('sorting_desc');
        notMe.removeClass('sorting_asc');
        notMe.addClass('sorting');

        if (self.hasClass('sorting')) {
          self.addClass('sorting_desc');
          self.removeClass('sorting');
          scope.callback({
            item: {
              orderBy: self.attr('key'),
              orderMethod: 'DESC'
            }
          });
        } else if (self.hasClass('sorting_desc')) {
          self.removeClass('sorting_desc');
          self.addClass('sorting_asc');
          scope.callback({
            item: {
              orderBy: self.attr('key'),
              orderMethod: 'ASC'
            }
          });
        } else {
          self.removeClass('sorting_asc');
          self.addClass('sorting_desc');
          scope.callback({
            item: {
              orderBy: self.attr('key'),
              orderMethod: 'DESC'
            }
          });
        }
      });
    }
  }
}

module.exports = sortThead;


},{}],17:[function(require,module,exports){
'use strict';

function Utils($sce, $uibModal, PermissionService, $q, blockUI, $interval, $state, $uibModalStack, $timeout) {
  var timeNoAction = 0;
  var HALF_HOUR = 1800;
  var countdown = null;
  var timer = null;
  var _fullNameDefaultSetting = {
    stringEmpty: ''
  };
  function PagingModel() {
    var self = this;
    // function model() {}
    // model.prototype = self;

    self.state = {
      showSearch: false,
      selectedRow: null,
      totalItems: 0,
      pageNum: 0,
      currentPage: 0,
      dataPage: {}
    };
    self.params = {};
    self.paging = {
      order_by: 'id',
      order_method: 'DESC',
      limit: 10,
      offset: 0
    };
    // self.paramsRequest =
    self.paramsRequest = {};
    self.paramsClone = {};
    self.pagingClone = {};
    // list function
    self.resetSearch = resetSearch;
    self.cancelSearch = cancelSearch;
    self.onSort = onSort;
    self.onChangePage = onChangePage;
    self.onSearch = onSearch;
    self.getListing = function () { };
    self.getSearchParams = getSearchParams;
    self.setData = setData;
    self.covertData = covertData;
    self.setParams = _setParams;
    self.setPaging = _setPaging;
    function _setPaging(obj) {
      if (obj) {
        self.paging = obj;
        self.pagingClone = angular.copy(obj);
        _.extend(self.paramsRequest, self.paging);
      }
    }
    function _setParams(obj) {
      if (obj) {
        self.params = obj;
        self.paramsClone = angular.copy(obj);
        _.extend(self.paramsRequest, self.params);
      }
    }
    /**
     * reset params
     * @return {Number} void
     */
    function resetSearch() {
      self.params = angular.copy(self.paramsClone);
      // self.paging = angular.copy(self.pagingClone);
    }
    /**
    * handel cancel search
    * @return void
    */
    function cancelSearch() {
      self.state.showSearch = false;
      self.resetSearch();
      self.paging = angular.copy(self.pagingClone);
      setSearchParams();
      self.onSearch();
    }
    /**
    * handel sort
    * @return void
    */
    function onSort(item) {
      self.paging.order_by = item.orderBy;
      self.paging.order_method = item.orderMethod;
      // self.state.currentPage = 0;
      // self.paging.offset = 0;
      self.paramsRequest = _.extend(self.paramsRequest, self.paging);
      self.getListing();
    }
    /**
     * handel change page
     * @return void
     */
    function onChangePage(item) {
      self.paging.limit = item.pageLength;
      self.paging.offset = (item.currentPage - 1) * item.pageLength;
      self.paramsRequest = _.extend(self.paramsRequest, self.paging);
      self.getListing();
    }
    /**
     * handel search
     * @return void
     */
    function onSearch() {
      self.state.currentPage = 0;
      self.paging.offset = 0;
      self.state.selectedRow = false;
      setSearchParams();
      self.getListing();
    }
    /**
     * get params
     * @return void
     */
    function setSearchParams() {
      var params = _.extend(self.params, self.paging);
      self.paramsRequest = angular.copy(params);
      if (!_.isUndefined(self.iConvertParams) && _.isFunction(self.iConvertParams)) {
        self.paramsRequest = self.iConvertParams(self.paramsRequest);
      }
      self.paramsRequest;
    }
    function getSearchParams() {
      return self.paramsRequest;
    }
    // define out provider
    function covertData() {
      if (!_.isUndefined(self.iConvertData) && _.isFunction(self.iConvertData)) {
        self.state.dataPage = self.iConvertData(self.state);
      } else {
        self.state.dataPage = angular.copy(self.state.list);
      }
    }
    function setData(data) {
      self.state = _.extend(self.state, data);
      self.covertData(data);
    }
  }
  return {
    hidenCreditCard: _hidenCreditCard,
    confirmPopup: _confirmPopup,
    hidenText: _hidenText,
    downloadFile: _downloadFile,
    fullname: _fullname,
    lossActivity: lossActivity,
    resetTimeOut: _resetTimeOut,
    excelFileExtension: _excelFileExtension,
    pdfFileExtension: _pdfFileExtension,
    getListStatusClaim: _getListStatusClaim,
    getListStatusBatchDateClaims: _getListStatusBatchDateClaims,
    getLimitFileSizeInfo: _getLimitFileSizeInfo,
    getListStatusClaimByName: _getListStatusClaimByName,
    getListStatusBatchDateByName: _getListStatusBatchDateByName,
    getTypeOfClaimList: _getTypeOfClaimList,
    getListStatusForPulldown: _getListStatusForPulldown,
    uiblockStart: _uiblockStart,
    pagingHelper: function () { return new PagingModel(); }
  };
  function _uiblockStart() {
    blockUI.start();
    $timeout.cancel(timer);
    timer = $timeout(function () {
      blockUI.stop();
    }, 5000);
  }
  function _getLimitFileSizeInfo() {
    return true;
  }
  function _getListStatusClaim() {
    return [
      { id: -1, name: '', classCss: 'label-default' },
      { id: 1, name: 'Pending', classCss: 'label-warning' },
      { id: 2, name: 'Assigned', classCss: 'label-warning' },
      { id: 3, name: 'Audited', classCss: 'label-warning' },
      { id: 4, name: 'Rejected', classCss: 'label-danger' },
      { id: 5, name: 'Approved', classCss: 'label-primary' },
      { id: 6, name: 'Paid', classCss: 'label-success' }
    ];
  }
  function _getListStatusBatchDateClaims() {
    return [
      { id: -1, name: '', classCss: 'label-default' },
      { id: 1, name: 'Pending', classCss: 'label-warning' },
      // { id: 2, name: 'Assigned', classCss: 'label-warning' },
      // { id: 3, name: 'Audited', classCss: 'label-warning' },
      // { id: 4, name: 'Rejected', classCss: 'label-danger' },
      // { id: 5, name: 'Approved', classCss: 'label-primary' },
      { id: 2, name: 'Posted', classCss: 'label-success' }
    ];
  }
  function _getListStatusClaimByName() {
    return {
      Pending: 1,
      Assigned: 2,
      Audited: 3,
      Rejected: 4,
      Approved: 5,
      Paid: 6
    };
  }
  function _getListStatusBatchDateByName() {
    return {
      Pending: 1,
      Posted: 2
    };
  }
  function _getListStatusForPulldown() {
    var sttList = _getListStatusClaim();
    angular.forEach(sttList, function (val, key) {
      if (val.id !== -1) {
        sttList[key]['label'] = val.name;
      } else {
        delete sttList[key];
      }
    });
    return sttList;
  }
  /**
   * get type of claim list
   *
   * @return array
   */
  function _getTypeOfClaimList() {
    return [
      { id: -1, name: 'All' },
      { id: 0, name: '1500' },
      { id: 1, name: 'CJ' }
    ];
  }
  function _resetTimeOut() {
    timeNoAction = 0;
  }
  function _fullname(one, two, three, settings) {
    var customSettings = $.extend({}, _fullNameDefaultSetting, settings);
    var arr = [];
    if (_.isUndefined(one) || one === '') {
      arr.push(customSettings.stringEmpty || '');
    } else {
      arr.push(one);
    }
    if (_.isUndefined(two) || two === '') {
      arr.push(customSettings.stringEmpty || '');
    } else {
      arr.push(two);
    }
    if (_.isUndefined(three) || three === '') {
      arr.push(customSettings.stringEmpty || '');
    } else {
      arr.push(three);
    }
    return arr.join(' ').trim();
  }
  function _hidenText(value) {
    if (_.isNull(value) || _.isUndefined(value)) {
      return '';
    }
    value = value + '';
    return value.replace(/[\w\W]/g, '*');
  }
  function _hidenCreditCard(value) {
    if (_.isUndefined(value) || value === "" || _.isNull(value)) {
      return '';
    }
    return '****' + value.substr(-4, 4);
    // var len = value.length;
    // var result = '';
    // for (var i = 0; i < len; i++) {
    //   if (i > len - 5) {
    //     result += value[i];
    //   } else {
    //     result += 'x';
    //   }
    // }
    // return result;
  }
  function _confirmPopup(data) {
    return $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      size: 'sm',
      backdrop: false,
      keyboard: false,
      templateUrl: 'static/modules/common/views/confirm-popup.html',
      controller: function ($uibModalInstance, data) {
        var vm = this;
        vm.title = data.title;
        vm.titleBtn = data.titleBtn;
        vm.close = function () {
          $uibModalInstance.close('closed');
        };
        vm.submit = function () {
          $uibModalInstance.dismiss('closed');
        };
      },
      controllerAs: 'vm',
      resolve: {
        data: function () {
          return data;
        }
      }
    });
  }
  /**
   * download file use $.fileDownload
   * @param {string} url
   * @param {object} post
   * @return {promise}
   */
  function _downloadFile(url, post) {
    return $q(function (resolve, reject) {
      var accesTokken = PermissionService.getLoginToken();
      if (accesTokken) {
        post['access-token'] = accesTokken;
      }
      $.fileDownload(url, {
        httpMethod: "POST",
        data: post
      }).done(function (response) {
        resolve('');
      }).fail(function (response, link) {
        reject(response);
      });
    });
  }
  function lossActivity() {
    timeNoAction = 0;
    // not loggin then not countdown
    if (_.isUndefined(PermissionService.getUser()) || _.isEmpty(PermissionService.getUser())) {
      return false;
    }
    if (!_.isNull(countdown)) {
      $interval.cancel(countdown);
    }
    countdown = $interval(function () {
      timeNoAction++;
      if (timeNoAction >= HALF_HOUR) {
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
              vm.title = 'The session will be expired in ' + (60 - timeout) + ' seconds. Please click Continue to renew the session.';
              if (timeout >= 60) {
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
          lossActivity();
          // reset countdown
        });
        $interval.cancel(countdown);
      }
    }, 1000);
  }

  /**
   * excel extension
   * @return string
   */
  function _excelFileExtension() {
    return '.xlsx,.xls,.csv';
  }

  /**
   * pdf extension
   * @return string
   */
  function _pdfFileExtension() {
    return '.pdf';
  }
}
module.exports = Utils;
},{}],18:[function(require,module,exports){
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
},{}],19:[function(require,module,exports){
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

},{"./front.controller.js":18}],20:[function(require,module,exports){
'use strict';

function ContactService($resource, $httpParamSerializerJQLike, $rootScope) {
  var ContactResource = $resource($rootScope.domain + '/user/:action', {},
    {
      contact: {
        method: 'POST',
        isArray: false,
        params: {
          action: 'contact'
        }
      }
    }
  );
  return {
    submit: _submit
  };
  function _submit(post) {
    return ContactResource.contact($httpParamSerializerJQLike(post))
      .$promise.then(function (response) {
        return angular.fromJson(angular.toJson(response));
      });
  }
}
module.exports = ContactService;
},{}],21:[function(require,module,exports){
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
},{}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
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

},{"./ContactService.service.js":20,"./home.controller.js":21,"./homeFaqController.js":22}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJhcHAvYXBwLmpzIiwiYXBwL21vZHVsZXMvYWRtaW4tcGVybWlzc2lvbi9pbmRleC5qcyIsImFwcC9tb2R1bGVzL2FkbWluLXBlcm1pc3Npb24vcGVybWlzc2lvbi5jb250cm9sbGVyLmpzIiwiYXBwL21vZHVsZXMvYWRtaW4tcGVybWlzc2lvbi9wZXJtaXNzaW9uQXBpLnNlcnZpY2UuanMiLCJhcHAvbW9kdWxlcy9hZG1pbi9hZG1pbi5jb250cm9sbGVyLmpzIiwiYXBwL21vZHVsZXMvYWRtaW4vaW5kZXguanMiLCJhcHAvbW9kdWxlcy9jb21tb24vY29tbW9uQXBpLnNlcnZpY2UuanMiLCJhcHAvbW9kdWxlcy9jb21tb24vZGF0ZUZvcm1hdC5kaXJlY3RpdmUuanMiLCJhcHAvbW9kdWxlcy9jb21tb24vZGF0ZVRpbWUuc2VydmljZS5qcyIsImFwcC9tb2R1bGVzL2NvbW1vbi9kYXRlcGlja2VyLWZpeHllYXIuZGlyZWN0aXZlLmpzIiwiYXBwL21vZHVsZXMvY29tbW9uL2V4cGlyZWRTZXNzaW9uLnByb3ZpZGVyLmpzIiwiYXBwL21vZHVsZXMvY29tbW9uL2luZGV4LmpzIiwiYXBwL21vZHVsZXMvY29tbW9uL21lc3NhZ2Uuc2VydmljZS5qcyIsImFwcC9tb2R1bGVzL2NvbW1vbi9wYWdpbmF0aW9uLmRpcmVjdGl2ZS5qcyIsImFwcC9tb2R1bGVzL2NvbW1vbi9wZXJtaXNzaW9uLnNlcnZpY2UuanMiLCJhcHAvbW9kdWxlcy9jb21tb24vc29ydFRoZWFkLmRpcmVjdGl2ZS5qcyIsImFwcC9tb2R1bGVzL2NvbW1vbi91dGlscy5zZXJ2aWNlLmpzIiwiYXBwL21vZHVsZXMvZnJvbnQvZnJvbnQuY29udHJvbGxlci5qcyIsImFwcC9tb2R1bGVzL2Zyb250L2luZGV4LmpzIiwiYXBwL21vZHVsZXMvaG9tZS9Db250YWN0U2VydmljZS5zZXJ2aWNlLmpzIiwiYXBwL21vZHVsZXMvaG9tZS9ob21lLmNvbnRyb2xsZXIuanMiLCJhcHAvbW9kdWxlcy9ob21lL2hvbWVGYXFDb250cm9sbGVyLmpzIiwiYXBwL21vZHVsZXMvaG9tZS9pbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDelFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMVBBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcclxuXHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9ob21lJyk7XHJcbnJlcXVpcmUoJy4vbW9kdWxlcy9jb21tb24nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2Zyb250Jyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy91c2VyJyk7XHJcblxyXG5yZXF1aXJlKCcuL21vZHVsZXMvYWRtaW4nKTtcclxucmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLXBlcm1pc3Npb24nKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLWZhcXMnKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLXByb2ZpbGUnKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLXVzZXInKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLWFubm91bmNlbWVudCcpO1xyXG4vLyByZXF1aXJlKCcuL21vZHVsZXMvY2xhaW1zJyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy92ZW5kb3InKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLWljZCcpO1xyXG4vLyByZXF1aXJlKCcuL21vZHVsZXMvYWRtaW4tZnVuZGluZy1zb3VyY2UnKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLXZhbGlkYXRpb24tcnVsZScpO1xyXG4vLyByZXF1aXJlKCcuL21vZHVsZXMvYWRtaW4tZW9iJyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy9hZG1pbi1tZWRpY2FyZScpO1xyXG4vLyByZXF1aXJlKCcuL21vZHVsZXMvYWRtaW4tY3B0Jyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy9kYXNoYm9hcmQnKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2F1ZGl0aW5nJyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy9hY2NvdW50aW5nJyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy9yZXBvcnRzJyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy9lZGl0b3ItdXBsb2FkJyk7XHJcbi8vIHJlcXVpcmUoJy4vbW9kdWxlcy9hZG1pbi1wb3MnKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLXBhaWQtcmF0ZScpO1xyXG4vLyByZXF1aXJlKCcuL21vZHVsZXMvYWRtaW4tc3lzdGVtLWRlZmF1bHQnKTtcclxuLy8gcmVxdWlyZSgnLi9tb2R1bGVzL2FkbWluLWFsY29saW5rJyk7XHJcbnZhciBhcHBOYW1lID0gJ0xFVkFOQ0hPJztcclxuLy8gYWFiYlxyXG5hbmd1bGFyLm1vZHVsZShhcHBOYW1lLCBbXHJcbiAgLy8gbG9hZCBsaWJcclxuICAndWkucm91dGVyJyxcclxuICAndWkuYm9vdHN0cmFwJyxcclxuICAnbmdTYW5pdGl6ZScsXHJcbiAgJ25nUmVzb3VyY2UnLFxyXG4gICdoaWdoY2hhcnRzLW5nJyxcclxuICAncGVybWlzc2lvbicsXHJcbiAgJ3Blcm1pc3Npb24udWknLFxyXG4gICdibG9ja1VJJyxcclxuICAndWkudXRpbHMubWFza3MnLFxyXG4gICdpZGYuYnItZmlsdGVycycsXHJcbiAgJ25nY2xpcGJvYXJkJyxcclxuICAnbmdDb29raWVzJyxcclxuICAnbmdUYWdzSW5wdXQnLFxyXG4gICd5YXJ1MjIuYW5ndWxhci10aW1lYWdvJyxcclxuICAvLyAnbmdRdWlsbCcsXHJcbiAgJ3RleHRBbmd1bGFyJyxcclxuICAnbmdUb2FzdCcsXHJcbiAgJ25nRmlsZVVwbG9hZCcsXHJcbiAgJ2FuZ3VsYXJqcy1kcm9wZG93bi1tdWx0aXNlbGVjdCcsXHJcbiAgLy8gbG9hZCBtb2R1bGVcclxuICAnYXBwLmNvbW1vbicsXHJcbiAgJ2FwcC5mcm9udCcsXHJcbiAgJ2FwcC5ob21lJyxcclxuICAvLyAnYXBwLmFkbWluRmFxcycsXHJcbiAgLy8gJ2FwcC51c2VyJyxcclxuICAnYXBwLmFkbWluUGVybWlzc2lvbicsXHJcbiAgJ2FwcC5hZG1pbidcclxuICAvLyAnYXBwLmFkbWluVXNlcicsXHJcbiAgLy8gJ2FwcC5hZG1pblByb2ZpbGUnLFxyXG4gIC8vICdhcHAuYWRtaW5Bbm5vdW5jZW1lbnQnLFxyXG4gIC8vICdhcHAuYWRtaW5DbGFpbXMnLFxyXG4gIC8vICdhcHAudmVuZG9yJyxcclxuICAvLyAnYXBwLmFkbWluSUNEJyxcclxuICAvLyAnYXBwLmFkbWluVmFsaWRhdGlvblJ1bGUnLFxyXG4gIC8vICdhcHAuYWRtaW5GdW5kaW5nU291cmNlJyxcclxuICAvLyAnYXBwLmFkbWluRW9iJyxcclxuICAvLyAnYXBwLmFkbWluTWVkaWNhcmUnLFxyXG4gIC8vICdhcHAuYWRtaW5DUFQnLFxyXG4gIC8vICdhcHAuZGFzaGJvYXJkJyxcclxuICAvLyAnYXBwLmF1ZGl0aW5nJyxcclxuICAvLyAnYXBwLmFjY291bnRpbmcnLFxyXG4gIC8vICdhcHAucmVwb3J0cycsXHJcbiAgLy8gJ2FwcC5lZGl0b3JVcGxvYWQnLFxyXG4gIC8vICdhcHAuYWRtaW5QT1MnLFxyXG4gIC8vICdhcHAuYWRtaW5QYWlkUmF0ZScsXHJcbiAgLy8gJ2FwcC5hZG1pbkFsY29saW5rJyxcclxuICAvLyAnYXBwLmFkbWluU3lzdGVtRGVmYXVsdCdcclxuXSk7XHJcbmFuZ3VsYXIubW9kdWxlKGFwcE5hbWUpLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyLCAkcGVybWlzc2lvblByb3ZpZGVyLCAkaHR0cFByb3ZpZGVyLCAkbG9jYXRpb25Qcm92aWRlcixcclxuICBibG9ja1VJQ29uZmlnLCAkdWliVG9vbHRpcFByb3ZpZGVyLCB1aWJEYXRlcGlja2VyUG9wdXBDb25maWcsICR1aWJNb2RhbFByb3ZpZGVyLCAkcHJvdmlkZSwgbmdUb2FzdFByb3ZpZGVyKSB7XHJcbiAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XHJcbiAgdmFyIGFwcFZlcnNpb25TY3JpcHQgPSBhbmd1bGFyLmVsZW1lbnQoJ2lucHV0W25hbWU9XCJhcHBfdmVyc2lvbl9zY3JpcHRcIl0nKS52YWwoKTtcclxuICAvLyBzZXQgZGVmYXVsdCBwZXJtaXNzaW9uXHJcbiAgJHBlcm1pc3Npb25Qcm92aWRlci5zdXBwcmVzc1VuZGVmaW5lZFBlcm1pc3Npb25XYXJuaW5nKHRydWUpO1xyXG4gICRwZXJtaXNzaW9uUHJvdmlkZXIuc2V0RGVmYXVsdE9uVW5hdXRob3JpemVkTWV0aG9kKCdkZXRhY2hFbGVtZW50Jyk7XHJcbiAgJHVpYk1vZGFsUHJvdmlkZXIub3B0aW9ucyA9IHtcclxuICAgIGJhY2tkcm9wOiBmYWxzZSxcclxuICAgIGtleWJvYXJkOiBmYWxzZVxyXG4gIH07XHJcbiAgJHVpYlRvb2x0aXBQcm92aWRlci5vcHRpb25zKHtcclxuICAgIHRyaWdnZXI6ICdmb2N1cycsXHJcbiAgICBhcHBlbmRUb0JvZHk6IHRydWVcclxuICB9KTtcclxuXHJcbiAgdWliRGF0ZXBpY2tlclBvcHVwQ29uZmlnLmFwcGVuZFRvQm9keSA9IHRydWU7XHJcbiAgLy8gYWRkIGFjY2VzcyB0b2tlbiBpbnRvIGhlYWRlciByZXF1ZXN0XHJcbiAgJGh0dHBQcm92aWRlci5pbnRlcmNlcHRvcnMucHVzaChmdW5jdGlvbiAoJHEsICRsb2NhdGlvbiwgUGVybWlzc2lvblNlcnZpY2UsIG5nVG9hc3QpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgICdyZXF1ZXN0JzogZnVuY3Rpb24gKGNvbmZpZykge1xyXG4gICAgICAgIHZhciBhY2Nlc1Rva2tlbiA9IFBlcm1pc3Npb25TZXJ2aWNlLmdldExvZ2luVG9rZW4oKTtcclxuICAgICAgICAvLyBjb25maWcuaGVhZGVyc1snQWNjZXNzLUNvbnRyb2wtQWxsb3ctTWV0aG9kcyddID0gJyonO1xyXG4gICAgICAgIGlmIChhY2Nlc1Rva2tlbikge1xyXG4gICAgICAgICAgY29uZmlnLmhlYWRlcnNbJ2FjY2Vzcy10b2tlbiddID0gYWNjZXNUb2trZW47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKGNvbmZpZy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSkpIHtcclxuICAgICAgICAgIC8vXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbmZpZy5oZWFkZXJzWydDb250ZW50LVR5cGUnXSA9ICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY29uZmlnLnVybC5tYXRjaCgvXnN0YXRpY1xcLy4qLykpIHtcclxuICAgICAgICAgIC8vIHNcclxuICAgICAgICAgIGNvbmZpZy51cmwgPSBjb25maWcudXJsICsgXCI/dj1cIiArIGFwcFZlcnNpb25TY3JpcHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBjb25maWc7XHJcbiAgICAgIH0sXHJcbiAgICAgICdyZXNwb25zZUVycm9yJzogZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAzKSB7XHJcbiAgICAgICAgICAvLyBoYW5kZWwgZXJvciByZXNwb25zZVxyXG4gICAgICAgICAgUGVybWlzc2lvblNlcnZpY2UubG9nT3V0KCk7XHJcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL3VzZXIvbG9naW4nKTtcclxuICAgICAgICB9IGVsc2UgaWYgKHJlc3BvbnNlLnN0YXR1cyA9PT0gNDAxKSB7XHJcbiAgICAgICAgICAkbG9jYXRpb24ucGF0aCgnL25vdC1hdXRob3JpemVkLXJlcXVlc3QnKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgLy8gc2hvdyBlcnJvclxyXG4gICAgICAgICAgbmdUb2FzdC5kYW5nZXIocmVzcG9uc2Uuc3RhdHVzICsgJzogSW50ZXJuYWwgU2VydmVyIEVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAkcS5yZWplY3QocmVzcG9uc2UpO1xyXG4gICAgICB9XHJcbiAgICB9O1xyXG4gIH0pO1xyXG4gIC8vIHJlbW92ZSAjIG9uIFVSTFxyXG4gIC8vIE5PVEUgZW5hYmxlZCB3aGVuIGRlcGxveSB0byBob3N0XHJcbiAgJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKHtcclxuICAgIGVuYWJsZWQ6IHRydWUsXHJcbiAgICByZXF1aXJlQmFzZTogZmFsc2VcclxuICB9KTtcclxuICAvLyBhdXRvIHNob3cgYmxvY2t1aVxyXG4gIGJsb2NrVUlDb25maWcuYXV0b0Jsb2NrID0gdHJ1ZTtcclxuICBibG9ja1VJQ29uZmlnLnJlcXVlc3RGaWx0ZXIgPSBmdW5jdGlvbiAoY29uZmlnKSB7XHJcbiAgICAvLyBJZiB0aGUgcmVxdWVzdCBzdGFydHMgd2l0aCAnL2FwaS9jb21tb24nIC4uXHJcbiAgICBpZiAoY29uZmlnLnVybC5tYXRjaCgvXlxcL2FwaVxcL2NvbW1vbi4qLykgfHwgKGNvbmZpZy51cmwuaW5kZXhPZignZ2V0LWxpc3QtY2l0aWVzJykgIT09IC0xKSB8fCAoY29uZmlnLnVybC5pbmRleE9mKCdnZXQtbGlzdC1zdGF0ZXMnKSAhPT0gLTEpKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIC8vIGlmIHRoZSByZXF1ZXN0IGNvbnRlbnQgcGFyYW0gaXMgb2ZmX2F1dG9fYmxvY2tVSSB0aGVuIHJldHVybiBmYWxzZVxyXG4gICAgaWYgKGNvbmZpZy51cmwubWF0Y2goL29mZl9hdXRvX2Jsb2NrVUkvKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoY29uZmlnLnBhcmFtcykgJiYgY29uZmlnLnBhcmFtcy5vZmZfYXV0b19ibG9ja1VJKSB7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuICAgIGlmIChjb25maWcudXJsLm1hdGNoKC9eXFwvYXBpXFwvLiovKSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTsgLy8gLi4uIGRvbid0IGJsb2NrIGl0LlxyXG4gICAgfVxyXG4gIH07XHJcbiAgLy8gZmxhc2ggbWdzXHJcbiAgLy8gRmxhc2hQcm92aWRlci5zZXRUaW1lb3V0KDUwMDApO1xyXG4gIC8vIEZsYXNoUHJvdmlkZXIuc2V0U2hvd0Nsb3NlKHRydWUpO1xyXG4gIC8vIGljb24gc3ZnXHJcblxyXG4gICRwcm92aWRlLmRlY29yYXRvcigndGFPcHRpb25zJywgWyd0YVJlZ2lzdGVyVG9vbCcsICckZGVsZWdhdGUnLCAnJGxvZycsICckdWliTW9kYWwnLCBmdW5jdGlvbih0YVJlZ2lzdGVyVG9vbCwgdGFPcHRpb25zLCAkbG9nLCAkdWliTW9kYWwpIHtcclxuICAgIC8vICRkZWxlZ2F0ZSBpcyB0aGUgdGFPcHRpb25zIHdlIGFyZSBkZWNvcmF0aW5nXHJcbiAgICAvLyBoZXJlIHdlIG92ZXJyaWRlIHRoZSBkZWZhdWx0IHRvb2xiYXJzIGFuZCBjbGFzc2VzIHNwZWNpZmllZCBpbiB0YU9wdGlvbnMuXHJcbiAgICB0YU9wdGlvbnMuZm9yY2VUZXh0QW5ndWxhclNhbml0aXplID0gdHJ1ZTsgLy8gc2V0IGZhbHNlIHRvIGFsbG93IHRoZSB0ZXh0QW5ndWxhci1zYW5pdGl6ZSBwcm92aWRlciB0byBiZSByZXBsYWNlZFxyXG4gICAgdGFPcHRpb25zLmtleU1hcHBpbmdzID0gW107IC8vIGFsbG93IGN1c3RvbWl6YWJsZSBrZXlNYXBwaW5ncyBmb3Igc3BlY2lhbGl6ZWQga2V5IGJvYXJkcyBvciBsYW5ndWFnZXNcclxuICAgIHRhT3B0aW9ucy50b29sYmFyID0gW1xyXG4gICAgICBbJ2gxJywgJ2gyJywgJ2gzJywgJ2g0JywgJ2g1JywgJ2g2JywgJ3AnLCAncHJlJywgJ3F1b3RlJywgJ2JvbGQnLCAnaXRhbGljcycsICd1bmRlcmxpbmUnLCAndWwnLCAnb2wnLCAncmVkbycsICd1bmRvJywgJ2NsZWFyJywgJ2p1c3RpZnlMZWZ0JywgJ2p1c3RpZnlDZW50ZXInLCAnanVzdGlmeVJpZ2h0JywgJ2p1c3RpZnlGdWxsJywgJ2h0bWwnLCAnaW5zZXJ0SW1hZ2UnLCAnaW5zZXJ0TGluayddXHJcbiAgICAgIC8vICd3b3JkY291bnQnLCAnY2hhcmNvdW50J1xyXG4gICAgXTtcclxuICAgIHRhT3B0aW9ucy5jbGFzc2VzID0ge1xyXG4gICAgICBmb2N1c3NlZDogJ2ZvY3Vzc2VkJyxcclxuICAgICAgdG9vbGJhcjogJ2J0bi10b29sYmFyJyxcclxuICAgICAgdG9vbGJhckdyb3VwOiAnYnRuLWdyb3VwJyxcclxuICAgICAgdG9vbGJhckJ1dHRvbjogJ2J0biBidG4tZGVmYXVsdCcsXHJcbiAgICAgIHRvb2xiYXJCdXR0b25BY3RpdmU6ICdhY3RpdmUnLFxyXG4gICAgICBkaXNhYmxlZDogJ2Rpc2FibGVkJyxcclxuICAgICAgdGV4dEVkaXRvcjogJ2Zvcm0tY29udHJvbCcsXHJcbiAgICAgIGh0bWxFZGl0b3I6ICdmb3JtLWNvbnRyb2wnXHJcbiAgICB9O1xyXG4gICAgLy8gcmVnaXN0ZXIgdGhlIHRvb2wgd2l0aCB0ZXh0QW5ndWxhclxyXG4gICAgdGFSZWdpc3RlclRvb2woJ3VwbG9hZEltYWdlJywge1xyXG4gICAgICBpY29uY2xhc3M6IFwiZmEgZmEtZmlsZS1pbWFnZS1vXCIsXHJcbiAgICAgIHRvb2x0aXB0ZXh0OiBcIlVwbG9hZCBpbWFnZVwiLFxyXG4gICAgICBhY3Rpb246IGZ1bmN0aW9uKCRkZWZlcnJlZCkge1xyXG4gICAgICAgIHZhciB0ID0gdGhpcztcclxuICAgICAgICAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgICAgICBhcmlhTGFiZWxsZWRCeTogJ21vZGFsLXRpdGxlJyxcclxuICAgICAgICAgIGFyaWFEZXNjcmliZWRCeTogJ21vZGFsLWJvZHknLFxyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvbW9kdWxlcy9lZGl0b3ItdXBsb2FkL3ZpZXdzL3VwbG9hZC1pbWFnZS1tb2RhbC5odG1sJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdVcGxvYWRJbWFnZU1vZGFsQ29udHJvbGxlcicsXHJcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICB9KVxyXG4gICAgICAgIC5yZXN1bHRcclxuICAgICAgICAudGhlbihcclxuICAgICAgICAgIGZ1bmN0aW9uIChyZXN1bHQpIHsgfSxcclxuICAgICAgICAgIGZ1bmN0aW9uIChpbWdVcmwpIHtcclxuICAgICAgICAgICAgLy8gcmVzdG9yZVNlbGVjdGlvbigpO1xyXG4gICAgICAgICAgICAkbG9nLmluZm8oaW1nVXJsKTtcclxuICAgICAgICAgICAgaWYgKGltZ1VybCAhPT0gJ2Nsb3NlZCcpIHtcclxuICAgICAgICAgICAgICB0LiRlZGl0b3IoKS53cmFwU2VsZWN0aW9uKCdpbnNlcnRJbWFnZScsIGltZ1VybCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJGRlZmVycmVkLnJlc29sdmUoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICApO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAvLyBhZGQgdGhlIGJ1dHRvbiB0byB0aGUgZGVmYXVsdCB0b29sYmFyIGRlZmluaXRpb25cclxuICAgIHRhT3B0aW9ucy50b29sYmFyWzBdLnB1c2goJ3VwbG9hZEltYWdlJyk7XHJcbiAgICByZXR1cm4gdGFPcHRpb25zOyAvLyB3aGF0ZXZlciB5b3UgcmV0dXJuIHdpbGwgYmUgdGhlIHRhT3B0aW9uc1xyXG4gIH1dKTtcclxuXHJcbiAgLy8gY29uZmlnIGZvciBUb2FzdHNcclxuICBuZ1RvYXN0UHJvdmlkZXIuY29uZmlndXJlKHtcclxuICAgIGhvcml6b250YWxQb3NpdGlvbjogJ2NlbnRlcicsIC8vIG9yICdmYWRlJ1xyXG4gICAgbWF4TnVtYmVyOiAnMSdcclxuICB9KTtcclxufSk7XHJcbi8vIFBlcm1pc3Npb25BcGksXHJcbmFuZ3VsYXIubW9kdWxlKGFwcE5hbWUpLnJ1bihmdW5jdGlvbiAoJGxvZywgJHJvb3RTY29wZSwgUGVybWlzc2lvbkFwaSwgUGVybVBlcm1pc3Npb25TdHJhdGVnaWVzLCAkc3RhdGUpIHtcclxuICAkbG9nLmluZm8oJHN0YXRlKTtcclxuICAkcm9vdFNjb3BlLmRvbWFpbiA9IFwiL2FwaVwiO1xyXG4gIC8vIGRlZmluZSByb2xlXHJcbiAgdmFyIGRlcmVnaXN0ZXJhdGlvbkNhbGxiYWNrID0gJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKSB7XHJcbiAgICAvLyBVdGlscy5sb3NzQWN0aXZpdHkoKTtcclxuICAgIFBlcm1pc3Npb25BcGkucGVybWlzc2lvblJ1bigpO1xyXG4gIH0pO1xyXG4gIC8vICRyb290U2NvcGUuJGFwcGx5KCk7XHJcbiAgJHJvb3RTY29wZS4kb24oJyRkZXN0cm95JywgZGVyZWdpc3RlcmF0aW9uQ2FsbGJhY2spO1xyXG4gIC8vIHBlcm1pc3Npb24gZGVmYXVsdFxyXG4gIFBlcm1QZXJtaXNzaW9uU3RyYXRlZ2llcy5kZXRhY2hFbGVtZW50ID0gZnVuY3Rpb24gKCRlbGVtZW50KSB7XHJcbiAgICAvLyBzXHJcbiAgICBpZiAoIV8uaXNVbmRlZmluZWQoJGVsZW1lbnQuYXR0cignZGlzYWJsZWQtYXV0aCcpKSkge1xyXG4gICAgICAkZWxlbWVudC5jc3MoJ3BvaW50ZXItZXZlbnRzJywgJ25vbmUnKTtcclxuICAgICAgJGVsZW1lbnQuY3NzKCdvcGFjaXR5JywgJzAuOCcpO1xyXG4gICAgICAkZWxlbWVudC5jc3MoJ2JhY2tncm91bmQnLCAnI2VlZScpO1xyXG4gICAgICAkZWxlbWVudC5jc3MoJ2N1cnNvcicsICdub3QtYWxsb3dlZCcpO1xyXG4gICAgICAkZWxlbWVudC5wcm9wKCdkaXNhYmxlZCcsIHRydWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJGVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgfTtcclxufSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gVGhhY2hsaDEyMVxyXG5hbmd1bGFyLm1vZHVsZShcImFwcC5hZG1pblBlcm1pc3Npb25cIiwgW10pXHJcbiAgLmNvbnRyb2xsZXIoJ0FkbWluUGVybWlzc2lvbkNvbnRyb2xsZXInLCByZXF1aXJlKFwiLi9wZXJtaXNzaW9uLmNvbnRyb2xsZXIuanNcIikpXHJcbiAgLmZhY3RvcnkoJ1Blcm1pc3Npb25BcGknLCByZXF1aXJlKFwiLi9wZXJtaXNzaW9uQXBpLnNlcnZpY2UuanNcIikpXHJcbiAgLmNvbmZpZyhmdW5jdGlvbiAoJHN0YXRlUHJvdmlkZXIpIHtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdwZXJtaXNzdGlvbk1lbnUnLCB7XHJcbiAgICAgIC8vIHVybDogJy9hZG1pbi9hY2NvdW50aW5nJyxcclxuICAgICAgcGFyZW50OiAnbWVudUFkbWluJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGVudC1hZG1pbic6IHtcclxuICAgICAgICAgIHRlbXBsYXRlOiAnPGRpdiB1aS12aWV3PVwicGFnZS13cmFwXCI+PC9kaXY+J1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgncGVybWlzc3Rpb25NZW51LnBlcm1pc3Npb25zJywge1xyXG4gICAgICB1cmw6ICcvYWRtaW4vcGVybWlzc2lvbnMnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdwYWdlLXdyYXAnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9tb2R1bGVzL2FkbWluLXBlcm1pc3Npb24vdmlld3MvcGVybWlzc2lvbnMtaW5kZXguaHRtbCcsXHJcbiAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5QZXJtaXNzaW9uQ29udHJvbGxlcicsXHJcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGRhdGE6IHtcclxuICAgICAgICBwZXJtaXNzaW9uczoge1xyXG4gICAgICAgICAgb25seTogWydwZXJtaXNzdGlvbk1lbnUucGVybWlzc2lvbnMnXSxcclxuICAgICAgICAgIHJlZGlyZWN0VG86ICdub3RBdXRob3JpemVkJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQWRtaW5QZXJtaXNzaW9uQ29udHJvbGxlcigkbG9nLCAkc3RhdGUsICR1aWJNb2RhbCwgUGVybWlzc2lvbkFwaSwgRGF0ZVRpbWUsIFV0aWxzKSB7XHJcbiAgdmFyIHZtID0gdGhpcztcclxuICB2bS5jYW5jZWxTZWFyY2ggPSBjYW5jZWxTZWFyY2g7XHJcbiAgdm0ucmVzZXRTZWFyY2ggPSByZXNldFNlYXJjaDtcclxuICB2bS5vblNvcnQgPSBvblNvcnQ7XHJcbiAgdm0ub25DaGFuZ2VQYWdlID0gb25DaGFuZ2VQYWdlO1xyXG4gIHZtLm9uU2VhcmNoID0gb25TZWFyY2g7XHJcbiAgdm0uZm9ybWF0ID0gXCJNTS9kZC95eVwiO1xyXG4gIC8vIHZtLnRvdGFsSXRlbXMgPSA1O1xyXG4gIHZtLiRvbkluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2bS5yb2xlTGlzdGluZyA9IFtdO1xyXG4gICAgdm0ucGFyYW1zID0ge1xyXG4gICAgICBDZXJ0aWZpY2F0ZUZpbGVTZWFyY2g6IHtcclxuICAgICAgICBzdGF0ZV9maWxlX251bWJlcjogJycsXHJcbiAgICAgICAgY2VydF9udW1iZXI6ICcnLFxyXG4gICAgICAgIGRlY2Vhc2VkOiAnJyxcclxuICAgICAgICBzdGFydF9kYXRlX29mX2RlYXRoOiBudWxsLFxyXG4gICAgICAgIGVuZF9kYXRlX29mX2RlYXRoOiBudWxsLFxyXG4gICAgICAgIGNpdHlfb2ZfZGVhdGg6ICcnLFxyXG4gICAgICAgIHNvY2lhbF9zZWN1cml0eV9udW1iZXI6ICcnLFxyXG4gICAgICAgIGZ1bmVyYWxfbmFtZTogJycsXHJcbiAgICAgICAgZnVuZXJhbF9saWNlbnNlOiAnJyxcclxuICAgICAgICBzdGFydF9yZWdpc3Rlcl9kYXRlOiBudWxsLFxyXG4gICAgICAgIGVuZF9yZWdpc3Rlcl9kYXRlOiBudWxsLFxyXG4gICAgICAgIGlzX3JlcXVlc3Q6ICcnXHJcbiAgICAgIH1cclxuICAgIH07XHJcbiAgICB2bS5wYWdpbmcgPSB7XHJcbiAgICAgIG9yZGVyX2J5OiAncmVnaXN0ZXJfZGF0ZScsXHJcbiAgICAgIG9yZGVyX21ldGhvZDogJ0RFU0MnLFxyXG4gICAgICBsaW1pdDogMTAsXHJcbiAgICAgIG9mZnNldDogMFxyXG4gICAgfTtcclxuICAgIHZtLnBhcmFtc0Nsb25lID0gYW5ndWxhci5jb3B5KHZtLnBhcmFtcyk7XHJcbiAgICB2bS5wYWdpbmdDbG9uZSA9IGFuZ3VsYXIuY29weSh2bS5wYWdpbmcpO1xyXG4gICAgZ2V0Um9sZXMoKTtcclxuICB9O1xyXG4gIC8vIGZ1bmN0aW9uIHB1YmxpYyBpbnRvIHZpZXdzXHJcbiAgLyoqXHJcbiAgICogaGFuZGVsIGNhbmNlbCBzZWFyY2hcclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICBmdW5jdGlvbiBjYW5jZWxTZWFyY2goKSB7XHJcbiAgICB2bS5zaG93U2VhcmNoID0gZmFsc2U7XHJcbiAgICByZXNldFNlYXJjaCgpO1xyXG4gICAgZ2V0Um9sZXMoKTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogcmVzZXQgcGFyYW1zXHJcbiAgICogQHJldHVybiB7TnVtYmVyfSB2b2lkXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gcmVzZXRTZWFyY2goKSB7XHJcbiAgICB2bS5wYXJhbXMgPSBhbmd1bGFyLmNvcHkodm0ucGFyYW1zQ2xvbmUpO1xyXG4gICAgLy8gdm0ucGFnaW5nID0gYW5ndWxhci5jb3B5KHZtLnBhZ2luZ0Nsb25lKTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogaGFuZGVsIHNvcnRcclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICBmdW5jdGlvbiBvblNvcnQoaXRlbSkge1xyXG4gICAgdm0ucGFnaW5nLm9yZGVyX2J5ID0gaXRlbS5vcmRlckJ5O1xyXG4gICAgdm0ucGFnaW5nLm9yZGVyX21ldGhvZCA9IGl0ZW0ub3JkZXJNZXRob2Q7XHJcbiAgICBnZXRSb2xlcygpO1xyXG4gIH1cclxuICAvKipcclxuICAgKiBoYW5kZWwgY2hhbmdlIHBhZ2VcclxuICAgKiBAcmV0dXJuIHZvaWRcclxuICAgKi9cclxuICBmdW5jdGlvbiBvbkNoYW5nZVBhZ2UoaXRlbSkge1xyXG4gICAgdm0ucGFnaW5nLmxpbWl0ID0gaXRlbS5wYWdlTGVuZ3RoO1xyXG4gICAgLy8gdm0ucGFnaW5nLmxpbWl0ID0gaXRlbS5wYWdlTGVuZ3RoO1xyXG4gICAgdm0ucGFnaW5nLm9mZnNldCA9IChpdGVtLmN1cnJlbnRQYWdlIC0gMSkgKiBpdGVtLnBhZ2VMZW5ndGg7XHJcbiAgICAvLyAkbG9nLmluZm8odm0ucGFyYW1zLkNlcnRpZmljYXRlU2VhcmNoLm9mZnNldCk7XHJcbiAgICBnZXRSb2xlcygpO1xyXG4gIH1cclxuICAvKipcclxuICAgKiBoYW5kZWwgc2VhcmNoXHJcbiAgICogQHJldHVybiB2b2lkXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gb25TZWFyY2goKSB7XHJcbiAgICB2bS5wYWdpbmcub2Zmc2V0ID0gMDtcclxuICAgIGdldFJvbGVzKCk7XHJcbiAgfVxyXG4gIHZtLnBvcHVwMSA9IHtcclxuICAgIG9wZW5lZDogZmFsc2VcclxuICB9O1xyXG4gIHZtLm9wZW4xID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdm0ucG9wdXAxLm9wZW5lZCA9IHRydWU7XHJcbiAgfTtcclxuICAvLyBwb3B1cCAyXHJcbiAgdm0ucG9wdXAyID0ge1xyXG4gICAgb3BlbmVkOiBmYWxzZVxyXG4gIH07XHJcbiAgdm0ub3BlbjIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2bS5wb3B1cDIub3BlbmVkID0gdHJ1ZTtcclxuICB9O1xyXG4gIC8vIHBvcHVwIDNcclxuICB2bS5wb3B1cDMgPSB7XHJcbiAgICBvcGVuZWQ6IGZhbHNlXHJcbiAgfTtcclxuICB2bS5vcGVuMyA9IGZ1bmN0aW9uICgpIHtcclxuICAgIHZtLnBvcHVwMy5vcGVuZWQgPSB0cnVlO1xyXG4gIH07XHJcbiAgLy8gcG9wdXAgNFxyXG4gIHZtLnBvcHVwNCA9IHtcclxuICAgIG9wZW5lZDogZmFsc2VcclxuICB9O1xyXG4gIHZtLm9wZW40ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdm0ucG9wdXA0Lm9wZW5lZCA9IHRydWU7XHJcbiAgfTtcclxuICAvLyBlbmQgZnVuY3Rpb24gcHVibGljIGludG8gdmlld3NcclxuICBmdW5jdGlvbiBnZXRSb2xlcygpIHtcclxuICAgIHZhciBwb3N0ID0gZ2V0UGFyYW1zKCk7XHJcbiAgICBQZXJtaXNzaW9uQXBpLnJvbGVzKHt9LCBwb3N0KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICB2bS5yb2xlTGlzdGluZyA9IFtdO1xyXG4gICAgICBpZiAoIXJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgXy5lYWNoKHJlc3BvbnNlLmRhdGEsIGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICB2bS5yb2xlTGlzdGluZy5wdXNoKGdldE9iamVjdFJvbGUodikpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHZtLnRvdGFsSXRlbXMgPSByZXNwb25zZS5kYXRhLnRvdGFsO1xyXG4gICAgICAgIHZtLnBhZ2VOdW0gPSByZXNwb25zZS5kYXRhLnRvdGFsX3BhZ2U7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBnZXRQYXJhbXMoKSB7XHJcbiAgICB2bS5wYXJhbXNTZWFyY2ggPSBhbmd1bGFyLmNvcHkodm0ucGFyYW1zKTtcclxuICAgIF8uZXh0ZW5kKHZtLnBhcmFtc1NlYXJjaC5DZXJ0aWZpY2F0ZUZpbGVTZWFyY2gsIHZtLnBhZ2luZyk7XHJcbiAgICB2bS5wYXJhbXNTZWFyY2guQ2VydGlmaWNhdGVGaWxlU2VhcmNoLnN0YXJ0X2RhdGVfb2ZfZGVhdGggPSBEYXRlVGltZS5nZXRTdGFydFRpbWUodm0ucGFyYW1zU2VhcmNoLkNlcnRpZmljYXRlRmlsZVNlYXJjaC5zdGFydF9kYXRlX29mX2RlYXRoKTtcclxuICAgIHZtLnBhcmFtc1NlYXJjaC5DZXJ0aWZpY2F0ZUZpbGVTZWFyY2guZW5kX2RhdGVfb2ZfZGVhdGggPSBEYXRlVGltZS5nZXRFbmRUaW1lKHZtLnBhcmFtc1NlYXJjaC5DZXJ0aWZpY2F0ZUZpbGVTZWFyY2guZW5kX2RhdGVfb2ZfZGVhdGgpO1xyXG4gICAgdm0ucGFyYW1zU2VhcmNoLkNlcnRpZmljYXRlRmlsZVNlYXJjaC5lbmRfcmVnaXN0ZXJfZGF0ZSA9IERhdGVUaW1lLmdldEVuZFRpbWUodm0ucGFyYW1zU2VhcmNoLkNlcnRpZmljYXRlRmlsZVNlYXJjaC5lbmRfcmVnaXN0ZXJfZGF0ZSk7XHJcbiAgICB2bS5wYXJhbXNTZWFyY2guQ2VydGlmaWNhdGVGaWxlU2VhcmNoLnN0YXJ0X3JlZ2lzdGVyX2RhdGUgPSBEYXRlVGltZS5nZXRTdGFydFRpbWUodm0ucGFyYW1zU2VhcmNoLkNlcnRpZmljYXRlRmlsZVNlYXJjaC5zdGFydF9yZWdpc3Rlcl9kYXRlKTtcclxuICAgIGlmICghXy5pc0VtcHR5KHZtLnJlcXVlc3RQYXJhbXMpKSB7XHJcbiAgICAgIF8uZXh0ZW5kKHZtLnBhcmFtc1NlYXJjaC5DZXJ0aWZpY2F0ZUZpbGVTZWFyY2gsIHZtLnJlcXVlc3RQYXJhbXMpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZtLnBhcmFtc1NlYXJjaDtcclxuICB9XHJcbiAgZnVuY3Rpb24gZ2V0T2JqZWN0Um9sZShkYXRhKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAnbmFtZSc6IGRhdGEubmFtZSxcclxuICAgICAgJ2Rlc2NyaXB0aW9uJzogZGF0YS5kZXNjcmlwdGlvbixcclxuICAgICAgJ2NyZWF0ZWRBdCc6IERhdGVUaW1lLnVuaXgyRGF0ZShkYXRhLmNyZWF0ZWRfYXQpLFxyXG4gICAgICAndXBkYXRlZEF0JzogRGF0ZVRpbWUudW5peDJEYXRlKGRhdGEudXBkYXRlZF9hdCksXHJcbiAgICAgICdpZCc6IGRhdGEuaWRcclxuICAgIH07XHJcbiAgfVxyXG4gIHZtLmFkZE5ld1JvbGUgPSBhZGROZXdSb2xlO1xyXG4gIHZtLmFkZE5ld1Blcm1pc3Npb24gPSBhZGROZXdQZXJtaXNzaW9uO1xyXG4gIGZ1bmN0aW9uIGFkZE5ld1JvbGUocm9sZUlkKSB7XHJcbiAgICAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgYXJpYUxhYmVsbGVkQnk6ICdtb2RhbC10aXRsZScsXHJcbiAgICAgIGFyaWFEZXNjcmliZWRCeTogJ21vZGFsLWJvZHknLFxyXG4gICAgICBzaXplOiAnbGcnLFxyXG4gICAgICBiYWNrZHJvcDogZmFsc2UsXHJcbiAgICAgIGtleWJvYXJkOiBmYWxzZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvbW9kdWxlcy9hZG1pbi1wZXJtaXNzaW9uL3ZpZXdzL2FkZC1uZXctcm9sZS5odG1sJyxcclxuICAgICAgcmVzb2x2ZToge1xyXG4gICAgICAgIHJvbGVJZDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gcm9sZUlkO1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCRsb2csICR1aWJNb2RhbEluc3RhbmNlLCByb2xlSWQpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnJvbGVJZCA9IHJvbGVJZDtcclxuICAgICAgICB2bS5jbG9zZSA9IGNsb3NlO1xyXG4gICAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuICAgICAgICB2bS50b2dnbGVTZWxlY3RlZCA9IHRvZ2dsZVNlbGVjdGVkO1xyXG4gICAgICAgIHZtLiRvbkluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB2bS5wZXJtaXNzaW9ucyA9IFtdO1xyXG4gICAgICAgICAgdm0ucGVybWlzc2lvblNlbGVjdGVkID0gW107XHJcbiAgICAgICAgICBnZXRQZXJtaXNzaW9uKCk7XHJcbiAgICAgICAgICBpZiAoIV8uaXNOdWxsKHJvbGVJZCkpIHtcclxuICAgICAgICAgICAgUGVybWlzc2lvbkFwaS5nZXRQZXJtaXNzaW9uQnlSb2xlKHtpZDogcm9sZUlkfSkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICBpZiAoIXJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wZXJtaXNzaW9uU2VsZWN0ZWQgPSBfLnBsdWNrKHJlc3BvbnNlLmRhdGEsICdwZXJtaXNzaW9uX2lkJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG4gICAgICAgIGZ1bmN0aW9uIGdldFBlcm1pc3Npb24oKSB7XHJcbiAgICAgICAgICBQZXJtaXNzaW9uQXBpLmxpc3RQZXJtaXNzaW9uKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgIHZtLnBlcm1pc3Npb25zID0gcmVzcG9uc2UuZGF0YTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIGNsb3NlKCkge1xyXG4gICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2Nsb3NlZCcpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmdW5jdGlvbiBzdWJtaXQoKSB7XHJcbiAgICAgICAgICB2YXIgcG9zdCA9IHt9O1xyXG4gICAgICAgICAgaWYgKCFfLmlzTnVsbChyb2xlSWQpKSB7XHJcbiAgICAgICAgICAgIHBvc3QgPSB7XHJcbiAgICAgICAgICAgICAgcm9sZV9pZDogcm9sZUlkLFxyXG4gICAgICAgICAgICAgIHNlbGVjdGVkOiB2bS5wZXJtaXNzaW9uU2VsZWN0ZWRcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgUGVybWlzc2lvbkFwaS5yb2xlVXBkYXRlKHBvc3QpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgaWYgKCFyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIC8vIHVwZGF0ZVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcG9zdCA9IHtcclxuICAgICAgICAgICAgICByb2xlX25hbWU6IHZtLmZvcm0ubmFtZSxcclxuICAgICAgICAgICAgICBzZWxlY3RlZDogdm0ucGVybWlzc2lvblNlbGVjdGVkXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIFBlcm1pc3Npb25BcGkucm9sZUNyZWF0ZShwb3N0KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgIGlmICghcmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCdjbG9zZWQnKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAvLyBjcmVhdGVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gdG9nZ2xlU2VsZWN0ZWQoc2VsZWN0KSB7XHJcbiAgICAgICAgICB2YXIgc2VsZWN0SWQgPSBzZWxlY3QuaWQ7XHJcbiAgICAgICAgICB2YXIgaWR4ID0gdm0ucGVybWlzc2lvblNlbGVjdGVkLmluZGV4T2Yoc2VsZWN0SWQpO1xyXG4gICAgICAgICAgdmFyIGlkeFBlciA9IG51bGw7XHJcbiAgICAgICAgICAvLyBJcyBjdXJyZW50bHkgc2VsZWN0ZWRcclxuICAgICAgICAgIGlmIChpZHggPiAtMSkge1xyXG4gICAgICAgICAgICB2bS5wZXJtaXNzaW9uU2VsZWN0ZWQuc3BsaWNlKGlkeCwgMSk7XHJcbiAgICAgICAgICAgIGlkeFBlciA9IF8uZmluZCh2bS5wZXJtaXNzaW9ucywgZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdi5pZCA9PT0gc2VsZWN0SWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaWR4UGVyKSB7XHJcbiAgICAgICAgICAgICAgXy5lYWNoKGlkeFBlci5wYXJlbnQsIGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaWR4QyA9IHZtLnBlcm1pc3Npb25TZWxlY3RlZC5pbmRleE9mKHYuaWQpO1xyXG4gICAgICAgICAgICAgICAgdm0ucGVybWlzc2lvblNlbGVjdGVkLnNwbGljZShpZHhDLCAxKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAvLyBUT0RPXHJcbiAgICAgICAgICAgICAgdmFyIHBhcmVudCA9IF8uZmluZCh2bS5wZXJtaXNzaW9ucywgZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2LmlkID09PSBzZWxlY3QucGFyZW50X2lkO1xyXG4gICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgIHZhciBsaXN0UGFyZW50SWQgPSBfLnBsdWNrKHBhcmVudC5wYXJlbnQsICdpZCcpO1xyXG4gICAgICAgICAgICAgIHZhciBkaWZmID0gXy5kaWZmZXJlbmNlKGxpc3RQYXJlbnRJZCwgdm0ucGVybWlzc2lvblNlbGVjdGVkKTtcclxuICAgICAgICAgICAgICBpZiAoXy5pc0VxdWFsKGxpc3RQYXJlbnRJZCwgZGlmZikpIHtcclxuICAgICAgICAgICAgICAgIHZhciBpZGQgPSB2bS5wZXJtaXNzaW9uU2VsZWN0ZWQuaW5kZXhPZihzZWxlY3QucGFyZW50X2lkKTtcclxuICAgICAgICAgICAgICAgIHZtLnBlcm1pc3Npb25TZWxlY3RlZC5zcGxpY2UoaWRkLCAxKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZtLnBlcm1pc3Npb25TZWxlY3RlZC5wdXNoKHNlbGVjdElkKTtcclxuICAgICAgICAgICAgLy8gaWYgcGFyZW50IHRoZW4gc2VsZWN0ZWQgYWxsIGNoaWxkXHJcbiAgICAgICAgICAgIGlkeFBlciA9IF8uZmluZCh2bS5wZXJtaXNzaW9ucywgZnVuY3Rpb24gKHYpIHtcclxuICAgICAgICAgICAgICByZXR1cm4gdi5pZCA9PT0gc2VsZWN0SWQ7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBpZiAoaWR4UGVyKSB7XHJcbiAgICAgICAgICAgICAgXy5lYWNoKGlkeFBlci5wYXJlbnQsIGZ1bmN0aW9uICh2KSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wZXJtaXNzaW9uU2VsZWN0ZWQucHVzaCh2LmlkKTtcclxuICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICBpZiAodm0ucGVybWlzc2lvblNlbGVjdGVkLmluZGV4T2Yoc2VsZWN0LnBhcmVudF9pZCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wZXJtaXNzaW9uU2VsZWN0ZWQucHVzaChzZWxlY3QucGFyZW50X2lkKTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgfSkucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBzY29wZS5jYWxsYmFjaygpO1xyXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkgeyB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gYWRkTmV3UGVybWlzc2lvbigpIHtcclxuICAgICR1aWJNb2RhbC5vcGVuKHtcclxuICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICBhcmlhTGFiZWxsZWRCeTogJ21vZGFsLXRpdGxlJyxcclxuICAgICAgYXJpYURlc2NyaWJlZEJ5OiAnbW9kYWwtYm9keScsXHJcbiAgICAgIHNpemU6ICdzbScsXHJcbiAgICAgIGJhY2tkcm9wOiBmYWxzZSxcclxuICAgICAga2V5Ym9hcmQ6IGZhbHNlLFxyXG4gICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9tb2R1bGVzL2FkbWluLXBlcm1pc3Npb24vdmlld3MvYWRkLXBlcm1pc3Npb24uaHRtbCcsXHJcbiAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkbG9nLCAkdWliTW9kYWxJbnN0YW5jZSwgUGVybWlzc2lvbkFwaSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY2xvc2UgPSBjbG9zZTtcclxuICAgICAgICB2bS5zdWJtaXQgPSBzdWJtaXQ7XHJcbiAgICAgICAgdm0uJG9uSW5pdCA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgdm0ubGlzdEdyb3VwID0gW107XHJcbiAgICAgICAgICBnZXRQZXJtaXNzaW9uKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICBmdW5jdGlvbiBnZXRQZXJtaXNzaW9uKCkge1xyXG4gICAgICAgICAgUGVybWlzc2lvbkFwaS5saXN0UGVybWlzc2lvbigpLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmICghcmVzcG9uc2UuZXJyb3IpIHtcclxuICAgICAgICAgICAgICB2bS5saXN0R3JvdXAgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gY2xvc2UoKSB7XHJcbiAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgnY2xvc2VkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpIHtcclxuICAgICAgICAgIC8vIHNhdmVcclxuICAgICAgICAgIFBlcm1pc3Npb25BcGkuYWRkUGVybWlzc2lvbih2bS5mb3JtKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICBpZiAoIXJlc3BvbnNlLmVyb3JyKSB7XHJcbiAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgfSkucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkge1xyXG4gICAgICAvLyBzY29wZS5jYWxsYmFjaygpO1xyXG4gICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkgeyB9KTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQWRtaW5QZXJtaXNzaW9uQ29udHJvbGxlcjsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBwZXJtaXNzaW9uQXBpKCRsb2csICRyZXNvdXJjZSwgJHVybFJvdXRlciwgJGh0dHBQYXJhbVNlcmlhbGl6ZXJKUUxpa2UsIFBlcm1QZXJtaXNzaW9uU3RvcmUsIFBlcm1Sb2xlU3RvcmUsIFBlcm1pc3Npb25TZXJ2aWNlKSB7XHJcbiAgdmFyIHBlcm1pc3Npb25SZXNvdXJjZSA9ICRyZXNvdXJjZSgnYXBpL3Blcm1pc3Npb24vOmFjdGlvbi86aWQnLCB7fSxcclxuICAgIHtcclxuICAgICAgaW5kZXg6IHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ2luZGV4J1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZ2VyUGVybWlzc2lvbkJ5VXNlcjoge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgYWN0aW9uOiAnZ2V0LXBlcm1pc3Npb24tYnktdXNlcidcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGxpc3RQZXJtaXNzaW9uOiB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBhY3Rpb246ICdsaXN0LXBlcm1pc3Npb24nXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByb2xlczoge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgYWN0aW9uOiAncm9sZXMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBnZXRQZXJtaXNzaW9uQnlSb2xlOiB7XHJcbiAgICAgICAgbWV0aG9kOiAnR0VUJyxcclxuICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ2dldC1wZXJtaXNzaW9uLWJ5LXJvbGUnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICByb2xlVXBkYXRlOiB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBhY3Rpb246ICdyb2xlLXVwZGF0ZSdcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHJvbGVDcmVhdGU6IHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ3JvbGUtY3JlYXRlJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgYWRkUGVybWlzc2lvbjoge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgYWN0aW9uOiAnYWRkLXBlcm1pc3Npb24tY2hpbGQnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKTtcclxuICByZXR1cm4ge1xyXG4gICAgbGlzdFBlcm1pc3Npb246IF9saXN0UGVybWlzc2lvbixcclxuICAgIHJvbGVzOiBfcm9sZXMsXHJcbiAgICBwZXJtaXNzaW9uTGlzdGluZzogX3Blcm1pc3Npb25MaXN0aW5nLFxyXG4gICAgZ2V0UGVybWlzc2lvbkJ5Um9sZTogX2dldFBlcm1pc3Npb25CeVJvbGUsXHJcbiAgICByb2xlQ3JlYXRlOiBfcm9sZUNyZWF0ZSxcclxuICAgIHJvbGVVcGRhdGU6IF9yb2xlVXBkYXRlLFxyXG4gICAgcGVybWlzc2lvblJ1bjogX3Blcm1pc3Npb25SdW4sXHJcbiAgICBhZGRQZXJtaXNzaW9uOiBfYWRkUGVybWlzc2lvblxyXG4gIH07XHJcbiAgZnVuY3Rpb24gX2FkZFBlcm1pc3Npb24ocG9zdCkge1xyXG4gICAgcmV0dXJuIHBlcm1pc3Npb25SZXNvdXJjZS5hZGRQZXJtaXNzaW9uKCRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlKHBvc3QpKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JvbGVVcGRhdGUocG9zdCkge1xyXG4gICAgcmV0dXJuIHBlcm1pc3Npb25SZXNvdXJjZS5yb2xlVXBkYXRlKCRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlKHBvc3QpKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JvbGVDcmVhdGUocG9zdCkge1xyXG4gICAgcmV0dXJuIHBlcm1pc3Npb25SZXNvdXJjZS5yb2xlQ3JlYXRlKCRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlKHBvc3QpKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldFBlcm1pc3Npb25CeVJvbGUoZ2V0KSB7XHJcbiAgICByZXR1cm4gcGVybWlzc2lvblJlc291cmNlLmdldFBlcm1pc3Npb25CeVJvbGUoZ2V0KVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3JvbGVzKGdldCwgcG9zdCkge1xyXG4gICAgcmV0dXJuIHBlcm1pc3Npb25SZXNvdXJjZS5yb2xlcyhnZXQsICRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlKHBvc3QpKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3Blcm1pc3Npb25MaXN0aW5nKCkge1xyXG4gICAgcmV0dXJuIHBlcm1pc3Npb25SZXNvdXJjZS5pbmRleCh7fSlcclxuICAgICAgLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oYW5ndWxhci50b0pzb24ocmVzcG9uc2UpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9saXN0UGVybWlzc2lvbigpIHtcclxuICAgIHJldHVybiBwZXJtaXNzaW9uUmVzb3VyY2UubGlzdFBlcm1pc3Npb24oe30pXHJcbiAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGFuZ3VsYXIudG9Kc29uKHJlc3BvbnNlKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICAvLyBmdW5jdGlvbiBfZ2V0UGVybWlzc2lvbkJ5VXNlcigpIHtcclxuICAvLyAgIHJldHVybiBwZXJtaXNzaW9uUmVzb3VyY2UuZ2VyUGVybWlzc2lvbkJ5VXNlcih7fSlcclxuICAvLyAgICAgLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgLy8gICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oYW5ndWxhci50b0pzb24ocmVzcG9uc2UpKTtcclxuICAvLyAgICAgfSk7XHJcbiAgLy8gfVxyXG4gIGZ1bmN0aW9uIF9wZXJtaXNzaW9uUnVuKCkge1xyXG4gICAgdmFyIHBlciA9IFBlcm1pc3Npb25TZXJ2aWNlLmdldFBlcm1pc3Npb24oKTtcclxuICAgIGlmIChfLmlzVW5kZWZpbmVkKHBlcikpIHtcclxuICAgICAgUGVybWlzc2lvblNlcnZpY2Uuc2V0QXV0aG9yKCcnKTtcclxuICAgICAgUGVybWlzc2lvblNlcnZpY2Uuc2V0VXNlcih7fSk7XHJcbiAgICAgIFBlcm1pc3Npb25TZXJ2aWNlLnNldExvZ2luVG9rZW4oJycpO1xyXG4gICAgICAvLyAkc3RhdGUuZ28oJ3VzZXIubG9naW4nKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFBlcm1pc3Npb25TZXJ2aWNlLmRlZmluZVJvbGUocGVyKTtcclxuICAgIH1cclxuICAgIC8vIF9nZXRQZXJtaXNzaW9uQnlVc2VyKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgIC8vICAgUGVybWlzc2lvblNlcnZpY2UuZGVmaW5lUm9sZShyZXNwb25zZS5kYXRhKTtcclxuICAgIC8vIH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBwZXJtaXNzaW9uQXBpOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbmZ1bmN0aW9uIEFkbWluQ29udHJvbGxlcigkc3RhdGUsICRsb2csICRjb29raWVzLCBQZXJtaXNzaW9uU2VydmljZSwgTG9naW5TZXJ2aWNlLCAkaW50ZXJ2YWwsIE5vdGlmaWNhdGlvblNlcnZpY2UsICRzY29wZSwgJHJvb3RTY29wZSkge1xyXG4gIHZhciB2bSA9IHRoaXM7XHJcbiAgdmFyIGJvZHkgPSBhbmd1bGFyLmVsZW1lbnQoJ2JvZHknKTtcclxuICAkbG9nLmluZm8oJ0FkbWluQ29udHJvbGxlcicpO1xyXG4gIHZtLmxvZ291dCA9IGxvZ291dDtcclxuICBib2R5LnJlbW92ZUNsYXNzKCdob21lcGFnZScpO1xyXG4gIGJvZHkuYWRkQ2xhc3MoJ2hvbGQtdHJhbnNpdGlvbiBsYXlvdXQtdG9wLW5hdiBhZG1pbnBhZ2UnKTtcclxuICB2bS4kc3RhdGUgPSAkc3RhdGU7XHJcbiAgJHJvb3RTY29wZS5hdmF0YXIgPSAnc3RhdGljL2ltYWdlcy9hdmF0YXI1LnBuZyc7XHJcbiAgLy8gUkVNT1ZFIElOVEVSVkFMIFdIRU4gQ0hBTkdFIFNUQVRFIE9SIFJFTE9BRCBQQUdFXHJcbiAgJHNjb3BlLiRvbihcIiRkZXN0cm95XCIsIGZ1bmN0aW9uKCkge1xyXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZtLmludGVydmFsKSkge1xyXG4gICAgICAkaW50ZXJ2YWwuY2FuY2VsKHZtLmludGVydmFsKTtcclxuICAgIH1cclxuICB9KTtcclxuICB2bS4kb25Jbml0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgdmFyIGF1dGhvciA9IFBlcm1pc3Npb25TZXJ2aWNlLmdldEF1dGhvcigpO1xyXG4gICAgaWYgKGF1dGhvcikge1xyXG4gICAgICB2bS51c2VyID0gUGVybWlzc2lvblNlcnZpY2UuZ2V0VXNlcigndXNlcicpO1xyXG4gICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodm0udXNlcikpIHtcclxuICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQodm0udXNlci5wcm9maWxlKSkge1xyXG4gICAgICAgICAgdm0uZnVsbG5hbWUgPSB2bS51c2VyLnByb2ZpbGUuZmlyc3RuYW1lICsgJyAnICsgdm0udXNlci5wcm9maWxlLmxhc3RuYW1lO1xyXG4gICAgICAgICAgaWYgKCFfLmlzRW1wdHkodm0udXNlci5wcm9maWxlLmF2YXRhcikpIHtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS5hdmF0YXIgPSB2bS51c2VyLnByb2ZpbGUuYXZhdGFyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgJHN0YXRlLmdvKCd1c2VyLmxvZ2luJyk7XHJcbiAgICB9XHJcbiAgfTtcclxuICB2YXIgY3VzZXIgPSBQZXJtaXNzaW9uU2VydmljZS5nZXRVc2VyKCk7XHJcbiAgaWYgKGFuZ3VsYXIuaXNPYmplY3QoY3VzZXIpICYmIGFuZ3VsYXIuaXNEZWZpbmVkKGN1c2VyKSkge1xyXG4gICAgLy8gJGxvZy5pbmZvKGN1c2VyKTtcclxuICAgIGdldE5vdGlmaWNhdGlvbnMoKTtcclxuICAgIHZhciBpbnRlcnZhbCA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGdldE5vdGlmaWNhdGlvbnMoKTtcclxuICAgIH0sIDUwMDApO1xyXG4gICAgdm0uaW50ZXJ2YWwgPSBpbnRlcnZhbDtcclxuICAgICRpbnRlcnZhbC5jYW5jZWwoaW50ZXJ2YWwpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gbG9nb3V0KCkge1xyXG4gICAgTG9naW5TZXJ2aWNlLnBvc3RMb2dvdXQoKS50aGVuKGZ1bmN0aW9uICgpIHtcclxuICAgICAgJGNvb2tpZXMucHV0KCdpc0xvZ2luJywgdW5kZWZpbmVkKTtcclxuICAgICAgUGVybWlzc2lvblNlcnZpY2UubG9nT3V0KCk7XHJcbiAgICAgICRzdGF0ZS5nbygndXNlci5sb2dpbicpO1xyXG4gICAgfSkuY2F0Y2goZnVuY3Rpb24gKGVycm9yKSB7XHJcbiAgICAgICRsb2cuZXJyb3IoZXJyb3IuZGF0YSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGdldE5vdGlmaWNhdGlvbnMoKSB7XHJcbiAgICAvLyAkbG9nLmluZm8odm0uaW50ZXJ2YWwpO1xyXG4gICAgTm90aWZpY2F0aW9uU2VydmljZS5nZXROb3RpZmljYXRpb25zKCkudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgaWYgKCFyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgIHZtLnRvdGFsTm90aWZ5ID0gcmVzcG9uc2UuZGF0YS5sZW5ndGggPT09IDAgPyBudWxsIDogcmVzcG9uc2UuZGF0YS5sZW5ndGg7XHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uIChlcnJvcikge1xyXG4gICAgICAkbG9nLmVycm9yKGVycm9yLmRhdGEpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFkbWluQ29udHJvbGxlcjtcclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gVGhhY2hsaDEyMVxyXG5hbmd1bGFyLm1vZHVsZShcImFwcC5hZG1pblwiLCBbXSlcclxuICAuY29udHJvbGxlcignQWRtaW5Db250cm9sbGVyJywgcmVxdWlyZShcIi4vYWRtaW4uY29udHJvbGxlci5qc1wiKSlcclxuICAvLyAuZmFjdG9yeSgnTm90aWZpY2F0aW9uU2VydmljZScsIHJlcXVpcmUoXCIuL2FkbWluLm5vdGlmaWNhdGlvblNlcnZpY2Uuc2VydmljZS5qc1wiKSlcclxuICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2FkbWluJywge1xyXG4gICAgICAvLyB1cmw6ICcvJyxcclxuICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ21haW4nOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJzdGF0aWMvbW9kdWxlcy9hZG1pbi92aWV3cy9hZG1pbi5odG1sXCIsXHJcbiAgICAgICAgICBjb250cm9sbGVyOiAnQWRtaW5Db250cm9sbGVyJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbWVudUFkbWluJywge1xyXG4gICAgICAvLyB1cmw6ICcvJyxcclxuICAgICAgcGFyZW50OiAnYWRtaW4nLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250ZW50Jzoge1xyXG4gICAgICAgICAgdGVtcGxhdGU6IFwiPGRpdiB1aS12aWV3PSdjb250ZW50LWFkbWluJz48L2Rpdj5cIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICAvLyBkYXRhOiB7XHJcbiAgICAgIC8vICAgcGVybWlzc2lvbnM6IHtcclxuICAgICAgLy8gICAgIG9ubHk6IFsnbWVudUFkbWluJ10sXHJcbiAgICAgIC8vICAgICByZWRpcmVjdFRvOiAnbm90QXV0aG9yaXplZCdcclxuICAgICAgLy8gICB9XHJcbiAgICAgIC8vIH1cclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ25vdEF1dGhvcml6ZWQnLCB7XHJcbiAgICAgIHVybDogJy9ub3QtYXV0aG9yaXplZCcsXHJcbiAgICAgIHBhcmVudDogJ2FkbWluJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGVudCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInN0YXRpYy9tb2R1bGVzL2FkbWluL3ZpZXdzL25vdC1hdXRob3JpemVkLmh0bWxcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSk7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gQ29tbW9uQXBpKCRyZXNvdXJjZSwgJHJvb3RTY29wZSwgJGh0dHBQYXJhbVNlcmlhbGl6ZXJKUUxpa2UsIFVwbG9hZCkge1xyXG4gIHZhciBjb21tb25SZXNvdXJjZSA9ICRyZXNvdXJjZSgkcm9vdFNjb3BlLmRvbWFpbiArICcvY29tbW9uLzphY3Rpb24vOmlkJywge30sXHJcbiAgICB7XHJcbiAgICAgIHN0YXRlTGlzdDoge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBhY3Rpb246ICdnZXQtbGlzdC1zdGF0ZXMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICB1cGxvYWRNYXhGaWxlU2l6ZToge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBhY3Rpb246ICdnZXQtdXBsb2FkLW1heC1maWxlLXNpemUnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjaXR5TGlzdDoge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgYWN0aW9uOiAnZ2V0LWxpc3QtY2l0aWVzJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgZW9iQ29kZToge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgYWN0aW9uOiAnZW9iLWNvZGUtbGlzdGluZydcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIGRpdmlzaW9uTGlzdDoge1xyXG4gICAgICAgIG1ldGhvZDogJ0dFVCcsXHJcbiAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBhY3Rpb246ICdnZXQtbGlzdC1kaXZpc2lvbnMnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBjcHRDb2RlOiB7XHJcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgICBhY3Rpb246ICdjcHQtY29kZS1saXN0aW5nJ1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgaWNkQ29kZToge1xyXG4gICAgICAgIG1ldGhvZDogJ1BPU1QnLFxyXG4gICAgICAgIGlzQXJyYXk6IGZhbHNlLFxyXG4gICAgICAgIHBhcmFtczoge1xyXG4gICAgICAgICAgYWN0aW9uOiAnaWNkLWNvZGUtbGlzdGluZydcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIHBvc0NvZGU6IHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ3Bvcy1jb2RlLWxpc3RpbmcnXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBlb2JCeUNvZGU6IHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ2VvYi1ieS1jb2RlJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICk7XHJcbiAgcmV0dXJuIHtcclxuICAgIGdldFN0YXRlTGlzdGluZzogX2dldFN0YXRlTGlzdGluZyxcclxuICAgIGdldENpdHlMaXN0aW5nOiBfZ2V0Q2l0eUxpc3RpbmcsXHJcbiAgICBnZXREaXZpc2lvbkxpc3Rpbmc6IF9nZXREaXZpc2lvbkxpc3RpbmcsXHJcbiAgICBnZXRFT0JMaXN0aW5nOiBfZ2V0RU9CTGlzdGluZyxcclxuICAgIGdldFVwbG9hZE1heEZpbGVTaXplOiBfZ2V0VXBsb2FkTWF4RmlsZVNpemUsXHJcbiAgICB1cGxvYWRJbWFnZUVkaXRvcjogX3VwbG9hZEltYWdlRWRpdG9yLFxyXG4gICAgZ2V0Q1BUTGlzdGluZzogX2dldENQVExpc3RpbmcsXHJcbiAgICBnZXRJQ0RMaXN0aW5nOiBfZ2V0SUNETGlzdGluZyxcclxuICAgIGdldFBPU0xpc3Rpbmc6IF9nZXRQT1NMaXN0aW5nLFxyXG4gICAgZ2V0RU9CQnlDb2RlOiBfZ2V0RU9CQnlDb2RlXHJcbiAgfTtcclxuXHJcbiAgZnVuY3Rpb24gX2dldFVwbG9hZE1heEZpbGVTaXplKCkge1xyXG4gICAgcmV0dXJuIGNvbW1vblJlc291cmNlLnVwbG9hZE1heEZpbGVTaXplKClcclxuICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldFN0YXRlTGlzdGluZygpIHtcclxuICAgIHJldHVybiBjb21tb25SZXNvdXJjZS5zdGF0ZUxpc3QoKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldENpdHlMaXN0aW5nKGdldCwgcG9zdCkge1xyXG4gICAgcmV0dXJuIGNvbW1vblJlc291cmNlLmNpdHlMaXN0KGdldCwgJGh0dHBQYXJhbVNlcmlhbGl6ZXJKUUxpa2UocG9zdCkpXHJcbiAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGFuZ3VsYXIudG9Kc29uKHJlc3BvbnNlKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0RU9CTGlzdGluZyhnZXQsIHBvc3QpIHtcclxuICAgIHJldHVybiBjb21tb25SZXNvdXJjZS5lb2JDb2RlKGdldCwgJGh0dHBQYXJhbVNlcmlhbGl6ZXJKUUxpa2UocG9zdCkpXHJcbiAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGFuZ3VsYXIudG9Kc29uKHJlc3BvbnNlKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0RGl2aXNpb25MaXN0aW5nKCkge1xyXG4gICAgcmV0dXJuIGNvbW1vblJlc291cmNlLmRpdmlzaW9uTGlzdCgpXHJcbiAgICAgIC4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJldHVybiBhbmd1bGFyLmZyb21Kc29uKGFuZ3VsYXIudG9Kc29uKHJlc3BvbnNlKSk7XHJcbiAgICAgIH0pO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfdXBsb2FkSW1hZ2VFZGl0b3IocGFyYW1zKSB7XHJcbiAgICByZXR1cm4gVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgIHVybDogJHJvb3RTY29wZS5kb21haW4gKyAnL2NvbW1vbi91cGxvYWQtaW1hZ2UtZWRpdG9yJyxcclxuICAgICAgZGF0YTogcGFyYW1zXHJcbiAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldENQVExpc3RpbmcoZ2V0LCBwb3N0KSB7XHJcbiAgICByZXR1cm4gY29tbW9uUmVzb3VyY2UuY3B0Q29kZShnZXQsICRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlKHBvc3QpKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldElDRExpc3RpbmcoZ2V0LCBwb3N0KSB7XHJcbiAgICByZXR1cm4gY29tbW9uUmVzb3VyY2UuaWNkQ29kZShnZXQsICRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlKHBvc3QpKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldFBPU0xpc3RpbmcoZ2V0LCBwb3N0KSB7XHJcbiAgICByZXR1cm4gY29tbW9uUmVzb3VyY2UucG9zQ29kZShnZXQsICRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlKHBvc3QpKVxyXG4gICAgICAuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICByZXR1cm4gYW5ndWxhci5mcm9tSnNvbihhbmd1bGFyLnRvSnNvbihyZXNwb25zZSkpO1xyXG4gICAgICB9KTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldEVPQkJ5Q29kZShwYXJhbXMpIHtcclxuICAgIHJldHVybiBjb21tb25SZXNvdXJjZS5lb2JCeUNvZGUocGFyYW1zLCB7fSlcclxuICAgICAgLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oYW5ndWxhci50b0pzb24ocmVzcG9uc2UpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IENvbW1vbkFwaTtcclxuIiwiJ3VzZSBzdHJpY2snO1xyXG5cclxuZnVuY3Rpb24gZGF0ZUZvcm1hdCgpIHtcclxuICByZXR1cm4ge1xyXG4gICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtLCBhdHRyLCBuZ01vZGVsKSB7XHJcbiAgICAgIGZ1bmN0aW9uIHZhbGlkYXRlKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGF0dHIubWF4RGF0ZSkge1xyXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSAmJiAhXy5pc051bGwodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdtYXhEYXRlJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciBmbGFnID0gdHJ1ZTtcclxuICAgICAgICAgICAgZmxhZyA9IG1vbWVudCh2YWx1ZSkuaXNTYW1lT3JCZWZvcmUoYXR0ci5tYXhEYXRlKTtcclxuICAgICAgICAgICAgbmdNb2RlbC4kc2V0VmFsaWRpdHkoJ21heERhdGUnLCBmbGFnKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGF0dHIubWluRGF0ZSkge1xyXG4gICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKHZhbHVlKSAmJiAhXy5pc051bGwodmFsdWUpKSB7XHJcbiAgICAgICAgICAgIG5nTW9kZWwuJHNldFZhbGlkaXR5KCdtaW5EYXRlJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciBmbGFnTWluID0gdHJ1ZTtcclxuICAgICAgICAgICAgZmxhZ01pbiA9IG1vbWVudCh2YWx1ZSkuaXNTYW1lT3JBZnRlcihhdHRyLm1pbkRhdGUpO1xyXG4gICAgICAgICAgICBuZ01vZGVsLiRzZXRWYWxpZGl0eSgnbWluRGF0ZScsIGZsYWdNaW4pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBzY29wZS4kd2F0Y2goZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcbiAgICAgIH0sIHZhbGlkYXRlKTtcclxuICAgIH1cclxuICB9O1xyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gZGF0ZUZvcm1hdDsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBEYXRlVGltZSgkc2NlLCAkbG9nKSB7XHJcbiAgLy8gbW9tZW50KCkudXRjT2Zmc2V0KFwiLTExOjAwXCIpO1xyXG4gIHZhciB0aW1lWm9uZSA9IG1vbWVudCgpLmZvcm1hdChcIlpcIik7XHJcbiAgcmV0dXJuIHtcclxuICAgIHVuaXgyRGF0ZVRpbWU6IF91bml4MkRhdGVUaW1lLFxyXG4gICAgdW5peDJEYXRlOiBfdW5peDJEYXRlLFxyXG4gICAgdW5peDJEYXRlRm9ybWF0OiBfdW5peDJEYXRlRm9ybWF0LFxyXG4gICAgdW5peDJVdGNEYXRlOiBfdW5peDJVdGNEYXRlLFxyXG4gICAgdW5peDJEYXRlQTogX3VuaXgyRGF0ZUEsXHJcbiAgICB1bml4Mk1vbnRoWWVhcjogX3VuaXgyTW9udGhZZWFyLFxyXG4gICAgZGF0ZTJEYXRlOiBfZGF0ZTJEYXRlLFxyXG4gICAgZGF0ZTJEYXRlU3FsOiBfZGF0ZTJEYXRlU3FsLFxyXG4gICAgZ2V0VGltZVpvbmU6IF9nZXRUaW1lWm9uZSxcclxuICAgIGdldFN0YXJ0VGltZTogX2dldFN0YXJ0VGltZSxcclxuICAgIGdldEVuZFRpbWU6IF9nZXRFbmRUaW1lLFxyXG4gICAgZ2V0VGhpc1F1YXJ0ZXI6IF9nZXRUaGlzUXVhcnRlcixcclxuICAgIGdldExpc3RNb250aE9mWWVhcjogX2dldExpc3RNb250aE9mWWVhcixcclxuICAgIGdldERheU9mTW9udGg6IF9nZXREYXlPZk1vbnRoLFxyXG4gICAgZ2V0UXVhcnRlclN0YXJ0RW5kOiBfZ2V0UXVhcnRlclN0YXJ0RW5kLFxyXG4gICAgZ2V0TW9udGhTdGFydEVuZDogX2dldE1vbnRoU3RhcnRFbmQsXHJcbiAgICBnZXRTdGFydFRpbWVVVEM6IF9nZXRTdGFydFRpbWVVVEMsXHJcbiAgICBnZXRFbmRUaW1lVVRDOiBfZ2V0RW5kVGltZVVUQyxcclxuICAgIGdldExpc3RRdWFydGVyOiBfZ2V0TGlzdFF1YXJ0ZXIsXHJcbiAgICBnZXRFYWNoTW9udGhPZlF1YXJ0ZXI6IF9nZXRFYWNoTW9udGhPZlF1YXJ0ZXIsXHJcbiAgICBub3cyVW5peDogX25vdzJVbml4LFxyXG4gICAgZm9ybWF0RGF0ZTogX2Zvcm1hdERhdGUsXHJcbiAgICBub3dEYXRlOiBfbm93RGF0ZSxcclxuICAgIGZvcm1hdFJlcXVlc3Q6IF9mb3JtYXRSZXF1ZXN0XHJcbiAgfTtcclxuICBmdW5jdGlvbiBfbm93RGF0ZSgpIHtcclxuICAgIHJldHVybiBtb21lbnQoKS5mb3JtYXQoJ01NL0REL1lZJyk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9mb3JtYXREYXRlKGRhdGUpIHtcclxuICAgIHJldHVybiAoZGF0ZSAmJiBkYXRlICE9PSAnMDAwMC0wMC0wMCcpID8gbW9tZW50KGRhdGUpLmZvcm1hdCgnTU0vREQvWVknKSA6ICcnO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZm9ybWF0UmVxdWVzdChkYXRlKSB7XHJcbiAgICByZXR1cm4gZGF0ZSA/IG1vbWVudChkYXRlKS5mb3JtYXQoJ1lZWVktTU0tREQnKSA6IG51bGw7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRFYWNoTW9udGhPZlF1YXJ0ZXIocXVhcnRlciwgeWVhcikge1xyXG4gICAgdmFyIGxpc3RNb250aE9mUXVhdGVyID0ge1xyXG4gICAgICAxOiBbMCwgMSwgMl0sXHJcbiAgICAgIDI6IFszLCA0LCA1XSxcclxuICAgICAgMzogWzYsIDcsIDhdLFxyXG4gICAgICA0OiBbOSwgMTAsIDExXVxyXG4gICAgfTtcclxuICAgIHZhciBtb250aCA9IGxpc3RNb250aE9mUXVhdGVyW3F1YXJ0ZXJdO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgZmlyc3Q6IHtcclxuICAgICAgICBzdGFydDogbW9tZW50KCkueWVhcih5ZWFyKS5tb250aChtb250aFswXSkuc3RhcnRPZignbW9udGgnKS5mb3JtYXQoJ0RELU1NLVlZWVkgMDA6MDA6MDAnKSxcclxuICAgICAgICBlbmQ6IG1vbWVudCgpLnllYXIoeWVhcikubW9udGgobW9udGhbMF0pLmVuZE9mKCdtb250aCcpLmZvcm1hdCgnREQtTU0tWVlZWSAyMzo1OTo1OScpLFxyXG4gICAgICAgIG5hbWU6IG1vbWVudCgpLnllYXIoeWVhcikubW9udGgobW9udGhbMF0pLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KCdNTU0nKSArICcgJyArIHllYXJcclxuICAgICAgfSxcclxuICAgICAgc2Vjb25kOiB7XHJcbiAgICAgICAgc3RhcnQ6IG1vbWVudCgpLnllYXIoeWVhcikubW9udGgobW9udGhbMV0pLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KCdERC1NTS1ZWVlZIDAwOjAwOjAwJyksXHJcbiAgICAgICAgZW5kOiBtb21lbnQoKS55ZWFyKHllYXIpLm1vbnRoKG1vbnRoWzFdKS5lbmRPZignbW9udGgnKS5mb3JtYXQoJ0RELU1NLVlZWVkgMjM6NTk6NTknKSxcclxuICAgICAgICBuYW1lOiBtb21lbnQoKS55ZWFyKHllYXIpLm1vbnRoKG1vbnRoWzFdKS5zdGFydE9mKCdtb250aCcpLmZvcm1hdCgnTU1NJykgKyAnICcgKyB5ZWFyXHJcbiAgICAgIH0sXHJcbiAgICAgIGxhc3Q6IHtcclxuICAgICAgICBzdGFydDogbW9tZW50KCkueWVhcih5ZWFyKS5tb250aChtb250aFsyXSkuc3RhcnRPZignbW9udGgnKS5mb3JtYXQoJ0RELU1NLVlZWVkgMDA6MDA6MDAnKSxcclxuICAgICAgICBlbmQ6IG1vbWVudCgpLnllYXIoeWVhcikubW9udGgobW9udGhbMl0pLmVuZE9mKCdtb250aCcpLmZvcm1hdCgnREQtTU0tWVlZWSAyMzo1OTo1OScpLFxyXG4gICAgICAgIG5hbWU6IG1vbWVudCgpLnllYXIoeWVhcikubW9udGgobW9udGhbMl0pLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KCdNTU0nKSArICcgJyArIHllYXJcclxuICAgICAgfVxyXG4gICAgfTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldExpc3RRdWFydGVyKCkge1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgeyBuYW1lOiAnSmFuIC0gRmViIC0gTWFyJywgaWQ6IDEsIGFsaWFzOiAnSmFuX01hcicsIGFsaWFzTW9udGg6ICdKYW51YXJ5LUZlYnJ1YXJ5LU1hcmNoJywgZmlsZTogJ0phbi1GZWItTWFyJyB9LFxyXG4gICAgICB7IG5hbWU6ICdBcHIgLSBNYXkgLSBKdW4nLCBpZDogMiwgYWxpYXM6ICdBcHJfSnVuJywgYWxpYXNNb250aDogJ0FwcmlsLU1heS1KdW5lJywgZmlsZTogJ0Fwci1NYXktSnVuJyB9LFxyXG4gICAgICB7IG5hbWU6ICdKdWwgLSBBdWcgLSBTZXAnLCBpZDogMywgYWxpYXM6ICdKdWxfU2VwJywgYWxpYXNNb250aDogJ0p1bHktQXVndXN0LVNlcHRlbWJlcicsIGZpbGU6ICdKdWwtQXVnLVNlcCcgfSxcclxuICAgICAgeyBuYW1lOiAnT2N0IC0gTm92IC0gRGVjJywgaWQ6IDQsIGFsaWFzOiAnT2N0X0RlYycsIGFsaWFzTW9udGg6ICdPY3RvYmVyLU5vdmVtYmVyLURlY2VtYmVyJywgZmlsZTogJ09jdC1Ob3YtRGVjJyB9XHJcbiAgICBdO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZGF0ZTJEYXRlKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgcmV0dXJuIG1vbWVudCh2YWx1ZSkudXRjT2Zmc2V0KHRpbWVab25lKS5mb3JtYXQoJ01NL0REL1lZJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9kYXRlMkRhdGVTcWwodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICByZXR1cm4gbW9tZW50KHZhbHVlKS51dGNPZmZzZXQodGltZVpvbmUpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfdW5peDJEYXRlVGltZSh2YWx1ZSkge1xyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHZhbHVlID0gcGFyc2VJbnQodmFsdWUpO1xyXG4gICAgICByZXR1cm4gY29udmVydDJEYXRlKHZhbHVlLCAnTU0vREQvWVkgaGg6bW0gQScpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfdW5peDJEYXRlKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgIHJldHVybiBjb252ZXJ0MkRhdGUodmFsdWUsICdNTS9ERC9ZWScpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfdW5peDJEYXRlRm9ybWF0KHZhbHVlLCBmb3JtYXQpIHtcclxuICAgIC8vID0gJ01NL0REL1lZJ1xyXG4gICAgaWYgKF8uaXNVbmRlZmluZWQoZm9ybWF0KSB8fCBfLmlzTnVsbChmb3JtYXQpKSB7XHJcbiAgICAgIGZvcm1hdCA9ICdNTS9ERC9ZWSc7XHJcbiAgICB9XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgIHJldHVybiBjb252ZXJ0MkRhdGUodmFsdWUsIGZvcm1hdCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF91bml4MlV0Y0RhdGUodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlKTtcclxuICAgICAgcmV0dXJuIGNvbnZlcnQyVXRjRGF0ZSh2YWx1ZSwgJ01NL0REL1lZJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF91bml4MkRhdGVBKHZhbHVlKSB7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgdmFsdWUgPSBwYXJzZUludCh2YWx1ZSk7XHJcbiAgICAgIC8vIE1BWSAwOSAyMDE3XHJcbiAgICAgIHJldHVybiBjb252ZXJ0MkRhdGUodmFsdWUsICdNTU0gREQgWScpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfdW5peDJNb250aFllYXIodmFsdWUpIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB2YWx1ZSA9IHBhcnNlSW50KHZhbHVlKTtcclxuICAgICAgcmV0dXJuIGNvbnZlcnQyRGF0ZSh2YWx1ZSwgJ01NL1lZJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9ub3cyVW5peChkKSB7XHJcbiAgICByZXR1cm4gbW9tZW50KGQpLnV0Y09mZnNldChcIjBcIikudW5peCgpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjb252ZXJ0MkRhdGUodmFsdWUsIGZvcm1hdCkge1xyXG4gICAgcmV0dXJuIG1vbWVudC51bml4KHZhbHVlKS51dGNPZmZzZXQodGltZVpvbmUpLmZvcm1hdChmb3JtYXQpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBjb252ZXJ0MlV0Y0RhdGUodmFsdWUsIGZvcm1hdCkge1xyXG4gICAgcmV0dXJuIG1vbWVudC51bml4KHZhbHVlKS51dGNPZmZzZXQoMCkuZm9ybWF0KGZvcm1hdCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRUaW1lWm9uZSgpIHtcclxuICAgIHJldHVybiB0aW1lWm9uZTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldFN0YXJ0VGltZShkKSB7XHJcbiAgICBpZiAoXy5pc051bGwoZCkgfHwgXy5pc1VuZGVmaW5lZChkKSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBtb21lbnQoZCkudXRjT2Zmc2V0KFwiKzBcIikuaG91cigwKS5taW51dGUoMCkuc2Vjb25kcygwKS51bml4KCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRFbmRUaW1lKGQpIHtcclxuICAgIGlmIChfLmlzTnVsbChkKSB8fCBfLmlzVW5kZWZpbmVkKGQpKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1vbWVudChkKS51dGNPZmZzZXQoXCIrMFwiKS5ob3VyKDIzKS5taW51dGUoNTkpLnNlY29uZHMoNTkpLnVuaXgoKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldFN0YXJ0VGltZVVUQyhkKSB7XHJcbiAgICBpZiAoXy5pc051bGwoZCkgfHwgXy5pc1VuZGVmaW5lZChkKSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBtb21lbnQudXRjKGQudG9TdHJpbmcoKSkuc3RhcnRPZignZGF5JykudW5peCgpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0RW5kVGltZVVUQyhkKSB7XHJcbiAgICBpZiAoXy5pc051bGwoZCkgfHwgXy5pc1VuZGVmaW5lZChkKSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiBtb21lbnQudXRjKGQudG9TdHJpbmcoKSkuZW5kT2YoJ2RheScpLnVuaXgoKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldFRoaXNRdWFydGVyKCkge1xyXG4gICAgLy8gZ2V0IHN0YXJ0IHllYXJcclxuICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgIHZhciBfY3VycmVudCA9IG1vbWVudCgpO1xyXG4gICAgLy8gdmFyIG5vdyA9IF9jdXJyZW50LnVuaXgoKTtcclxuICAgIHZhciB0aGlzWWVhciA9IF9jdXJyZW50LnllYXIoKTtcclxuICAgIHZhciB0aGlzUXVhcnR5ID0gX2N1cnJlbnQucXVhcnRlcigpO1xyXG4gICAgdmFyIHN0YXJ0UXVhcnR5ID0gbW9tZW50KHRoaXNZZWFyICsgJy0wMS0wMSAwMDowMDowMCcpLnF1YXJ0ZXIodGhpc1F1YXJ0eSk7XHJcbiAgICB2YXIgZW5kRGF0ZU9mU3RhcnRRdWFydHkgPSBfZ2V0RGF5T2ZNb250aChzdGFydFF1YXJ0eS5mb3JtYXQoJ00nKSwgbnVsbCk7XHJcbiAgICB2YXIgb2JqID0ge1xyXG4gICAgICBtb250aDogc3RhcnRRdWFydHkuZm9ybWF0KCdNTU0nKSxcclxuICAgICAgc3RhcnQ6IHN0YXJ0UXVhcnR5LnVuaXgoKSxcclxuICAgICAgZW5kOiBfZ2V0RW5kVGltZShlbmREYXRlT2ZTdGFydFF1YXJ0eS5sYXN0RGF5KVxyXG4gICAgfTtcclxuICAgIHZhciBlbmRDdXJyZW50TW9udGggPSBfZ2V0RGF5T2ZNb250aChfY3VycmVudC5mb3JtYXQoJ00nKSwgbnVsbCk7XHJcbiAgICBlbmRDdXJyZW50TW9udGggPSBtb21lbnQoZW5kQ3VycmVudE1vbnRoLmZpcnN0RGF5KS51bml4KCk7XHJcbiAgICByZXN1bHQucHVzaChvYmopO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gMTsgaSsrKSB7XHJcbiAgICAgIHZhciBuZXh0TW9udGggPSBwYXJzZUludChzdGFydFF1YXJ0eS5mb3JtYXQoJ00nKSk7XHJcbiAgICAgIG5leHRNb250aCA9IHN0YXJ0UXVhcnR5Lm1vbnRoKG5leHRNb250aCk7XHJcbiAgICAgIGlmIChuZXh0TW9udGgudW5peCgpIDwgZW5kQ3VycmVudE1vbnRoKSB7XHJcbiAgICAgICAgZW5kRGF0ZU9mU3RhcnRRdWFydHkgPSBfZ2V0RGF5T2ZNb250aChzdGFydFF1YXJ0eS5mb3JtYXQoJ00nKSwgbnVsbCk7XHJcbiAgICAgICAgb2JqID0ge1xyXG4gICAgICAgICAgbW9udGg6IHN0YXJ0UXVhcnR5LmZvcm1hdCgnTU1NJyksXHJcbiAgICAgICAgICBzdGFydDogc3RhcnRRdWFydHkudW5peCgpLFxyXG4gICAgICAgICAgZW5kOiBfZ2V0RW5kVGltZShlbmREYXRlT2ZTdGFydFF1YXJ0eS5sYXN0RGF5KVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmVzdWx0LnB1c2gob2JqKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIF9nZXRRdWFydGVyU3RhcnRFbmQoeWVhciwgcXVhcnRlcikge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgc3RhcnRRdWFydGVyOiBtb21lbnQoKS55ZWFyKHllYXIpLnF1YXJ0ZXIocXVhcnRlcikuc3RhcnRPZigncXVhcnRlcicpLmZvcm1hdCgnTU0tREQtWVlZWScpLFxyXG4gICAgICBlbmRRdWFydGVyOiBtb21lbnQoKS55ZWFyKHllYXIpLnF1YXJ0ZXIocXVhcnRlcikuZW5kT2YoJ3F1YXJ0ZXInKS5mb3JtYXQoJ01NLURELVlZWVknKSxcclxuICAgICAgc3RhcnRRdWFydGVyRGF0ZTogbW9tZW50KCkueWVhcih5ZWFyKS5xdWFydGVyKHF1YXJ0ZXIpLnN0YXJ0T2YoJ3F1YXJ0ZXInKSxcclxuICAgICAgZW5kUXVhcnRlckRhdGU6IG1vbWVudCgpLnllYXIoeWVhcikucXVhcnRlcihxdWFydGVyKS5lbmRPZigncXVhcnRlcicpXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gX2dldE1vbnRoU3RhcnRFbmQoeWVhciwgbW9udGgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHN0YXJ0TW9udGg6IG1vbWVudCgpLnllYXIoeWVhcikubW9udGgobW9udGgpLnN0YXJ0T2YoJ21vbnRoJykuZm9ybWF0KCdNTS1ERC1ZWVlZJyksXHJcbiAgICAgIGVuZE1vbnRoOiBtb21lbnQoKS55ZWFyKHllYXIpLm1vbnRoKG1vbnRoKS5lbmRPZignbW9udGgnKS5mb3JtYXQoJ01NLURELVlZWVknKSxcclxuICAgICAgc3RhcnRNb250aERhdGU6IG1vbWVudCgpLnllYXIoeWVhcikubW9udGgobW9udGgpLnN0YXJ0T2YoJ21vbnRoJykudG9EYXRlKCksXHJcbiAgICAgIGVuZE1vbnRoRGF0ZTogbW9tZW50KCkueWVhcih5ZWFyKS5tb250aChtb250aCkuZW5kT2YoJ21vbnRoJykudG9EYXRlKClcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBfZ2V0TGlzdE1vbnRoT2ZZZWFyKHRoaXNZZWFyKSB7XHJcbiAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICB2YXIgX2N1cnJlbnQgPSBtb21lbnQoKTtcclxuICAgIGlmICh0aGlzWWVhciA8IChfY3VycmVudC5mb3JtYXQoJ1knKSAtIDApKSB7XHJcbiAgICAgIF9jdXJyZW50ID0gbW9tZW50KHRoaXNZZWFyICsgJy0xMi0zMSAyMzo1OTo1OScpO1xyXG4gICAgfVxyXG4gICAgdmFyIHN0YXJ0UXVhcnR5ID0gbW9tZW50KHRoaXNZZWFyICsgJy0wMS0wMSAwMDowMDowMCcpO1xyXG4gICAgdmFyIG9iaiwgZW5kRGF0ZU9mU3RhcnRRdWFydHk7XHJcbiAgICB2YXIgZW5kQ3VycmVudE1vbnRoID0gX2dldERheU9mTW9udGgoX2N1cnJlbnQuZm9ybWF0KCdNJyksIHRoaXNZZWFyKTtcclxuICAgIGVuZEN1cnJlbnRNb250aCA9IG1vbWVudChlbmRDdXJyZW50TW9udGgubGFzdERheSkudW5peCgpO1xyXG5cclxuICAgIGVuZERhdGVPZlN0YXJ0UXVhcnR5ID0gX2dldERheU9mTW9udGgoc3RhcnRRdWFydHkuZm9ybWF0KCdNJyksIHRoaXNZZWFyKTtcclxuICAgIG9iaiA9IHtcclxuICAgICAgbW9udGg6IHN0YXJ0UXVhcnR5LmZvcm1hdCgnTU1NJyksXHJcbiAgICAgIHN0YXJ0OiBzdGFydFF1YXJ0eS51bml4KCksXHJcbiAgICAgIGVuZDogX2dldEVuZFRpbWUoZW5kRGF0ZU9mU3RhcnRRdWFydHkubGFzdERheSlcclxuICAgIH07XHJcbiAgICByZXN1bHQucHVzaChvYmopO1xyXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPD0gMTA7IGkrKykge1xyXG4gICAgICB2YXIgbmV4dE1vbnRoID0gcGFyc2VJbnQoc3RhcnRRdWFydHkuZm9ybWF0KCdNJykpO1xyXG4gICAgICBuZXh0TW9udGggPSBzdGFydFF1YXJ0eS5tb250aChuZXh0TW9udGgpO1xyXG4gICAgICBpZiAobmV4dE1vbnRoLnVuaXgoKSA8IGVuZEN1cnJlbnRNb250aCkge1xyXG4gICAgICAgIGVuZERhdGVPZlN0YXJ0UXVhcnR5ID0gX2dldERheU9mTW9udGgoc3RhcnRRdWFydHkuZm9ybWF0KCdNJyksIHRoaXNZZWFyKTtcclxuICAgICAgICBvYmogPSB7XHJcbiAgICAgICAgICBtb250aDogc3RhcnRRdWFydHkuZm9ybWF0KCdNTU0nKSxcclxuICAgICAgICAgIHN0YXJ0OiBzdGFydFF1YXJ0eS51bml4KCksXHJcbiAgICAgICAgICBlbmQ6IF9nZXRFbmRUaW1lKGVuZERhdGVPZlN0YXJ0UXVhcnR5Lmxhc3REYXkpXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXN1bHQucHVzaChvYmopO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0RGF5T2ZNb250aChtLCB5KSB7XHJcbiAgICB2YXIgZGF0ZSA9IG5ldyBEYXRlKCk7XHJcbiAgICBtID0gbSB8fCBkYXRlLmdldE1vbnRoKCk7XHJcbiAgICB5ID0geSB8fCBkYXRlLmdldEZ1bGxZZWFyKCk7XHJcbiAgICBtID0gcGFyc2VJbnQobSk7XHJcbiAgICB5ID0gcGFyc2VJbnQoeSk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBmaXJzdERheTogbmV3IERhdGUoeSwgbSwgMSksXHJcbiAgICAgIGxhc3REYXk6IG5ldyBEYXRlKHksIG0sIDApXHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IERhdGVUaW1lOyIsIid1c2Ugc3RyaWNrJztcclxuXHJcbmZ1bmN0aW9uIGRhdGVwaWNrZXJGaXh5ZWFyKCRsb2csIERhdGVUaW1lLCAkdGltZW91dCkge1xyXG4gIHJldHVybiB7XHJcbiAgICByZXN0cmljdDogJ0EnLFxyXG4gICAgcmVxdWlyZTogJ25nTW9kZWwnLFxyXG4gICAgbGluazogZnVuY3Rpb24gKHNjb3BlLCBlbGVtZW50LCBhdHRycywgY3RybCkge1xyXG4gICAgICBmdW5jdGlvbiBwYXJzZXIodmFsdWUpIHtcclxuICAgICAgICBpZiAoY3RybC4kaXNFbXB0eSh2YWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZWxlbWVudC52YWwoRGF0ZVRpbWUuZm9ybWF0RGF0ZSh2YWx1ZSkpO1xyXG4gICAgICAgICAgcmV0dXJuIG5ldyBEYXRlKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgZnVuY3Rpb24gZm9ybWF0dGVyKHZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGN0cmwuJGlzRW1wdHkodmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGN0cmwuJHNldFZpZXdWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIC8vIHVuYmluZCBwYXJzZXIgYW5kIGZvcm1hdHRlciBvZiBkYXRlcGlja2VyXHJcbiAgICAgIGN0cmwuJHBhcnNlcnMgPSBbXTtcclxuICAgICAgY3RybC4kZm9ybWF0dGVycyA9IFtdO1xyXG4gICAgICAvLyB2aWV3IHRvIG1vZGVsXHJcbiAgICAgIGN0cmwuJHBhcnNlcnMucHVzaChwYXJzZXIpO1xyXG4gICAgICAvLyBtb2RlbCB0byB2aWV3XHJcbiAgICAgIGN0cmwuJGZvcm1hdHRlcnMucHVzaChmb3JtYXR0ZXIpO1xyXG4gICAgICAvLyBydW4gZmlyc3QgdGltZVxyXG4gICAgICAvLyAkdGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgIC8vICAgaWYgKCFfLmlzRW1wdHkoZWxlbWVudC52YWwoKSkpIHtcclxuICAgICAgLy8gICAgIGVsZW1lbnQudmFsKERhdGVUaW1lLmZvcm1hdERhdGUoZWxlbWVudC52YWwoKSkpO1xyXG4gICAgICAvLyAgIH1cclxuICAgICAgLy8gfSk7XHJcbiAgICB9XHJcbiAgfTtcclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IGRhdGVwaWNrZXJGaXh5ZWFyO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcbmZ1bmN0aW9uIGV4cGlyZWRTZXNzaW9uUHJvdmlkZXIoKSB7XHJcbiAgdmFyICRleHBpcmVQcm92aWRlciA9IHtcclxuICAgIG9wdGlvbnM6IHtcclxuICAgICAgdGltZU91dDogMTgwMCxcclxuICAgICAgdGltZU91dENvbnRpbnVlOiA2MFxyXG4gICAgfSxcclxuICAgICRnZXQ6IFsnJGludGVydmFsJywgJyR1aWJNb2RhbCcsICckdWliTW9kYWxTdGFjaycsICdQZXJtaXNzaW9uU2VydmljZScsICckbG9nJywgJyRzdGF0ZScsIGZ1bmN0aW9uICgkaW50ZXJ2YWwsICR1aWJNb2RhbCwgJHVpYk1vZGFsU3RhY2ssIFBlcm1pc3Npb25TZXJ2aWNlLCAkbG9nLCAkc3RhdGUpIHtcclxuICAgICAgdmFyICRleHBpcmVkID0ge307XHJcbiAgICAgIHZhciBjb3VudGRvd24gPSBudWxsO1xyXG4gICAgICAkZXhwaXJlZC5zdGFydCA9IF9zdGFydDtcclxuICAgICAgZnVuY3Rpb24gX3N0YXJ0KG1vZGFsT3B0aW9ucykge1xyXG4gICAgICAgIHZhciBleHBpcmVkT3B0aW9ucyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCAkZXhwaXJlUHJvdmlkZXIub3B0aW9ucywgbW9kYWxPcHRpb25zKTtcclxuICAgICAgICB2YXIgdGltZU5vQWN0aW9uID0gMDtcclxuICAgICAgICAvLyBub3QgbG9nZ2luIHRoZW4gbm90IGNvdW50ZG93blxyXG4gICAgICAgIGlmIChfLmlzVW5kZWZpbmVkKFBlcm1pc3Npb25TZXJ2aWNlLmdldFVzZXIoKSkgfHwgXy5pc0VtcHR5KFBlcm1pc3Npb25TZXJ2aWNlLmdldFVzZXIoKSkpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKCFfLmlzTnVsbChjb3VudGRvd24pKSB7XHJcbiAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGNvdW50ZG93bik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvdW50ZG93biA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICB0aW1lTm9BY3Rpb24rKztcclxuICAgICAgICAgIGlmICh0aW1lTm9BY3Rpb24gPj0gZXhwaXJlZE9wdGlvbnMudGltZU91dCkge1xyXG4gICAgICAgICAgICAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgIGFyaWFMYWJlbGxlZEJ5OiAnbW9kYWwtdGl0bGUnLFxyXG4gICAgICAgICAgICAgIGFyaWFEZXNjcmliZWRCeTogJ21vZGFsLWJvZHknLFxyXG4gICAgICAgICAgICAgIHNpemU6ICdzbScsXHJcbiAgICAgICAgICAgICAgYmFja2Ryb3A6IGZhbHNlLFxyXG4gICAgICAgICAgICAgIGtleWJvYXJkOiBmYWxzZSxcclxuICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9tb2R1bGVzL2NvbW1vbi92aWV3cy9jb25maXJtLXBvcHVwLmh0bWwnLFxyXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgkdWliTW9kYWxJbnN0YW5jZSwgJGludGVydmFsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdm0udGl0bGUgPSAnVGhlIHNlc3Npb24gd2lsbCBiZSBleHBpcmVkIGluIDYwIHNlY29uZHMuIFBsZWFzZSBjbGljayBDb250aW51ZSB0byByZW5ldyB0aGUgc2Vzc2lvbi4nO1xyXG4gICAgICAgICAgICAgICAgdm0udGl0bGVCdG4gPSAnQ29udGludWUnO1xyXG4gICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSAwO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvdW50ZG93biA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgIHRpbWVvdXQrKztcclxuICAgICAgICAgICAgICAgICAgdm0udGl0bGUgPSAnVGhlIHNlc3Npb24gd2lsbCBiZSBleHBpcmVkIGluICcgKyAoZXhwaXJlZE9wdGlvbnMudGltZU91dENvbnRpbnVlIC0gdGltZW91dCkgKyAnIHNlY29uZHMuIFBsZWFzZSBjbGljayBDb250aW51ZSB0byByZW5ldyB0aGUgc2Vzc2lvbi4nO1xyXG4gICAgICAgICAgICAgICAgICBpZiAodGltZW91dCA+PSBleHBpcmVkT3B0aW9ucy50aW1lT3V0Q29udGludWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgnY2xvc2VkJyk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgICAgICB9KS5yZXN1bHQudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAvLyBzY29wZS5jYWxsYmFjaygpO1xyXG4gICAgICAgICAgICAgIFBlcm1pc3Npb25TZXJ2aWNlLmxvZ091dCgpO1xyXG4gICAgICAgICAgICAgICR1aWJNb2RhbFN0YWNrLmRpc21pc3NBbGwoKTtcclxuICAgICAgICAgICAgICAkc3RhdGUuZ28oJ3VzZXIubG9naW4nKTtcclxuICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgIF9zdGFydChtb2RhbE9wdGlvbnMpO1xyXG4gICAgICAgICAgICAgIC8vIHJlc2V0IGNvdW50ZG93blxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChjb3VudGRvd24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIDEwMDApO1xyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiAkZXhwaXJlZDtcclxuICAgIH1dXHJcbiAgfTtcclxuICByZXR1cm4gJGV4cGlyZVByb3ZpZGVyO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGV4cGlyZWRTZXNzaW9uUHJvdmlkZXI7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gVGhhY2hsaDEyMVxyXG5hbmd1bGFyLm1vZHVsZShcImFwcC5jb21tb25cIiwgW10pXHJcbiAgLnByb3ZpZGVyKCdleHBpcmVkU2Vzc2lvbicsIHJlcXVpcmUoXCIuL2V4cGlyZWRTZXNzaW9uLnByb3ZpZGVyLmpzXCIpKVxyXG4gIC8vIC5wcm92aWRlcignc3lzQWxlcnQnLCByZXF1aXJlKFwiLi9zeXNBbGVydC5wcm92aWRlci5qc1wiKSlcclxuICAvLyAucHJvdmlkZXIoJ2NvbmZpcm1BbGVydCcsIHJlcXVpcmUoXCIuL2NvbmZpcm1BbGVydC5wcm92aWRlci5qc1wiKSlcclxuICAvLyBmYXRvcnlcclxuICAuZmFjdG9yeSgnUGVybWlzc2lvblNlcnZpY2UnLCByZXF1aXJlKFwiLi9wZXJtaXNzaW9uLnNlcnZpY2UuanNcIikpXHJcbiAgLy8gLmZhY3RvcnkoJ1BhdHRlcm5TZXJ2aWNlJywgcmVxdWlyZShcIi4vcGF0dGVybi5zZXJ2aWNlLmpzXCIpKVxyXG4gIC5mYWN0b3J5KCdDb21tb25BcGlTZXJ2aWNlJywgcmVxdWlyZShcIi4vY29tbW9uQXBpLnNlcnZpY2UuanNcIikpXHJcbiAgLmZhY3RvcnkoJ0RhdGVUaW1lJywgcmVxdWlyZShcIi4vZGF0ZVRpbWUuc2VydmljZS5qc1wiKSlcclxuICAuZmFjdG9yeSgnVXRpbHMnLCByZXF1aXJlKFwiLi91dGlscy5zZXJ2aWNlLmpzXCIpKVxyXG4gIC5mYWN0b3J5KCdNZXNzYWdlU2VydmljZScsIHJlcXVpcmUoXCIuL21lc3NhZ2Uuc2VydmljZS5qc1wiKSlcclxuICAvLyAuZmFjdG9yeSgnTWFzdGVyRGF0YVNlcnZpY2UnLCByZXF1aXJlKFwiLi9tYXN0ZXJEYXRhLnNlcnZpY2UuanNcIikpXHJcbiAgLy8gZGlyZWN0b3JcclxuICAvLyAuZGlyZWN0aXZlKCdjb25maXJtUG9wdXAnLCByZXF1aXJlKFwiLi9jb25maXJtUG9wdXAuZGlyZWN0aXZlLmpzXCIpKVxyXG4gIC8vIC5kaXJlY3RpdmUoJ2JhY2tCdG4nLCByZXF1aXJlKFwiLi9iYWNrQnRuLmRpcmVjdGl2ZS5qc1wiKSlcclxuICAvLyAuZGlyZWN0aXZlKCdjb21wYXJlVG8nLCByZXF1aXJlKFwiLi9jb21wYXJlVG8uZGlyZWN0aXZlLmpzXCIpKVxyXG4gIC8vIC5kaXJlY3RpdmUoJ2V4cGlyYXRpb25EYXRlJywgcmVxdWlyZShcIi4vZXhwaXJhdGlvbkRhdGUuZGlyZWN0aXZlLmpzXCIpKVxyXG4gIC8vIC5kaXJlY3RpdmUoJ2dvVG8nLCByZXF1aXJlKFwiLi9nb1RvLmRpcmVjdGl2ZS5qc1wiKSlcclxuICAuZGlyZWN0aXZlKCdzb3J0VGhlYWQnLCByZXF1aXJlKFwiLi9zb3J0VGhlYWQuZGlyZWN0aXZlLmpzXCIpKVxyXG4gIC5kaXJlY3RpdmUoJ3BhZ2luYXRpb24nLCByZXF1aXJlKFwiLi9wYWdpbmF0aW9uLmRpcmVjdGl2ZS5qc1wiKSlcclxuICAuZGlyZWN0aXZlKCdkYXRlRm9ybWF0JywgcmVxdWlyZShcIi4vZGF0ZUZvcm1hdC5kaXJlY3RpdmUuanNcIikpXHJcbiAgLy8gLmRpcmVjdGl2ZSgnaXNPYmplY3QnLCByZXF1aXJlKFwiLi9pc09iamVjdC5kaXJlY3RpdmUuanNcIikpXHJcbiAgLy8gLmRpcmVjdGl2ZSgnZmlsZU1vZGVsJywgcmVxdWlyZShcIi4vZmlsZU1vZGxlLmRpcmVjdGl2ZS5qc1wiKSlcclxuICAvLyAuZGlyZWN0aXZlKCdpc09iamVjdE9yTnVsbCcsIHJlcXVpcmUoXCIuL2lzT2JqZWN0T3JOdWxsLmRpcmVjdGl2ZS5qc1wiKSlcclxuICAvLyAuZGlyZWN0aXZlKCdnZXRTaXplQmxvY2snLCByZXF1aXJlKFwiLi9nZXRTaXplQmxvY2suZGlyZWN0aXZlLmpzXCIpKVxyXG4gIC8vIC5kaXJlY3RpdmUoJ2FmZml4JywgcmVxdWlyZShcIi4vYWZmaXguZGlyZWNpdmUuanNcIikpXHJcbiAgLy8gLmRpcmVjdGl2ZSgnZmlsZU1vZGVsTXVsdGlwbGUnLCByZXF1aXJlKFwiLi9maWxlTW9kZWxNdWx0aXBsZS5kaXJlY3RpdmUuanNcIikpXHJcbiAgLy8gLmRpcmVjdGl2ZSgnbWFya0NyZWRpdENhcmQnLCByZXF1aXJlKFwiLi9tYXJrQ3JlZGl0Q2FyZC5kaXJlY3RpdmUuanNcIikpXHJcbiAgLy8gLmRpcmVjdGl2ZSgnY2FwaXRhbGl6ZScsIHJlcXVpcmUoXCIuL2NhcGl0YWxpemUuZGlyZWN0aXZlLmpzXCIpKVxyXG4gIC8vIC5kaXJlY3RpdmUoJ2Fsd2F5Rm9vdGVyJywgcmVxdWlyZShcIi4vYWx3YXktZm9vdGVyLmRpcmVjdGl2ZS5qc1wiKSlcclxuICAuZGlyZWN0aXZlKCdkYXRlcGlja2VyRml4eWVhcicsIHJlcXVpcmUoXCIuL2RhdGVwaWNrZXItZml4eWVhci5kaXJlY3RpdmUuanNcIikpXHJcbiAgLy8gZmlsdGVyXHJcbiAgLy8gLmZpbHRlcigndXNQaG9uZScsIFtyZXF1aXJlKFwiLi91c1Bob25lTnVtYmVyLmZpbHRlci5qc1wiKV0pXHJcbiAgLy8gLmZpbHRlcignaGlkZW5UZXh0JywgW3JlcXVpcmUoXCIuL2hpZGVuVGV4dC5maWx0ZXIuanNcIildKVxyXG4gIC8vIC5maWx0ZXIoJ2xpbWl0V29yZCcsIFtyZXF1aXJlKFwiLi9saW1pdFdvcmQuZmlsdGVyLmpzXCIpXSlcclxuICAvLyBjb250YW50c1xyXG4gIC8vIC5jb25zdGFudCgnYXBwQ29uc3RhbnQnLCByZXF1aXJlKFwiLi9hcHBDb25zdGFudC5qc1wiKSk7XHJcbiAgLnJ1bihmdW5jdGlvbiAoJHRlbXBsYXRlQ2FjaGUpIHtcclxuICAgICR0ZW1wbGF0ZUNhY2hlLnB1dChcInR5cGVhaGVhZC1lb2ItY29kZS5odG1sXCIsXHJcbiAgICAgIFwiPGEgaHJlZlxcblwiICtcclxuICAgICAgXCIgICB0YWJpbmRleD1cXFwiLTFcXFwiXFxuXCIgK1xyXG4gICAgICBcIiAgIG5nLWJpbmQtaHRtbD1cXFwiKG1hdGNoLmxhYmVsICsgJyAtICcgKyBtYXRjaC5tb2RlbC5kZXNjcmlwdGlvbikgfCBsaW1pdFdvcmQ6dHJ1ZTozMDogJy4uLicgfCB1aWJUeXBlYWhlYWRIaWdobGlnaHQ6cXVlcnkgXFxcIlxcblwiICtcclxuICAgICAgXCIgICBuZy1hdHRyLXRpdGxlPVxcXCJ7e21hdGNoLm1vZGVsLmRlc2NyaXB0aW9ufX1cXFwiPjwvYT5cXG5cIiArXHJcbiAgICAgIFwiXCIpO1xyXG4gIH0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBNZXNzYWdlU2VydmljZSgpIHtcclxuICAvLyB3ZSBjb3VsZCBkbyBhZGRpdGlvbmFsIHdvcmsgaGVyZSB0b29cclxuICB2YXIgbWVzc2FnZSA9IHtcclxuICAgIFVzOiB7XHJcbiAgICAgICdub3RKU09OJzogJ0ludGVybmFsIEVycm9yLicsXHJcbiAgICAgICd1c2VyLnByb2ZpbGUtdXBkYXRlLnN1Y2Nlc3NmdWwnOiAnRWRpdCBQcm9maWxlIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAndXNlci5sb2dpbi5pbmFjdGl2ZWQnOiAnVGhpcyB1c2VyIGhhcyBiZWVuIGluYWN0aXZlZC4nLFxyXG4gICAgICAndXNlci5sb2dpbi5yZWplY3RlZCc6ICdUaGlzIHVzZXIgaGFzIGJlZW4gcmVqZWN0ZWQuJyxcclxuICAgICAgJ2NvbnRhY3Quc3VjY2Vzc2Z1bCc6ICdjb250YWN0IHN1Y2Nlc3NmdWwuJyxcclxuICAgICAgJ3NpZ251cC5jZXJ0aWZpY2F0ZV9maWxlLmlzcmVxdWlyZWQnOiAnQXR0YWNoIENlcnRpZmljYXRpb24gaXMgcmVxdWlyZWQuJyxcclxuICAgICAgJ3NpZ251cC5lc2lnbmF0dXJlLmlzcmVxdWlyZWQnOiAnZVNpZ25hdHVyZSBpcyByZXF1aXJlZC4nLFxyXG4gICAgICAnTS0wMSc6ICdUaGlzIGFjdGlvbiB3aWxsIGNsZWFyIGFsbCB5b3VyIGlucHV0dGVkIGRhdGEuIEFyZSB5b3Ugc3VyZT8nLFxyXG4gICAgICAnTS0wMic6ICdVcGRhdGUgaGFzIGJlZW4gc2F2ZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdNLTAzJzogJ1RoaXMgZW1haWwgYWRkcmVzcyBoYXMgYWxyZWFkeSBiZWVuIHRha2VuLicsXHJcbiAgICAgICdNLTA0JzogJ0ludGVybmV0IEVycm9yJyxcclxuICAgICAgJ00tMDUnOiAnUmVxdWVzdCByZXNldCBwYXNzd29yZCBzdWNjZXNzZnVsbHkhIFBsZWFzZSBjaGVjayB5b3VyIGVtYWlsLiBUaGFuayB5b3UhJyxcclxuICAgICAgJ00tMDgnOiAnUmVzZXQgcGFzc3dvcmQgc3VjY2Vzc2Z1bGx5ISBUaGFuayB5b3UhJyxcclxuICAgICAgJ00tMDYnOiAnWW91ciBhY2NvdW50IGhhcyBiZWVuIHJlZ2lzdGVyZWQgc3VjY2Vzc2Z1bGx5ISBUaGFuayB5b3UhJyxcclxuICAgICAgJ00tMDcnOiAnVG9rZW4gaW52YWxpZCEnLFxyXG4gICAgICAnbG9naW4uaW5jb3JyZWN0JzogJ1dyb25nIHVzZXJuYW1lIG9yIHBhc3N3b3JkLiBQbGVhc2UgY2hlY2shJyxcclxuICAgICAgJ2hvdmVyLWV4cGxhaW4tY2FuY2VsJzogJ1JlbW92ZSBhbmQgQ2xvc2UgdGhpcyByZXF1ZXN0IHNlcnZpY2UnLFxyXG4gICAgICAnaG92ZXItZXhwbGFpbi1yZWplY3QnOiAnU2VuZCBiYWNrIHRvIFJlcXVlc3RlciBmb3IgdXBkYXRlJyxcclxuICAgICAgJ2hvdmVyLWV4cGxhaW4tcG9zdCc6ICdBc3NpZ24gYmFua25vdGVzIG51bWJlciBhbmQgUHJpbnQgdGhlIGNlcnRpZmljYXRlcycsXHJcbiAgICAgICdob3Zlci1leHBsYWluLWRlbGl2ZXInOiAnUGljayB1cCBhdCB0aGUgb2ZmaWNlIG9yIFNlbmQgcG9zdCBtYWlsIC0gUmVxdWVzdCBTZXJ2aWNlIGNvbXBsZXRlZCcsXHJcbiAgICAgICdob3Zlci1leHBsYWluLXJlc3VibWl0JzogJ1N1Ym1pdCBiYWNrIHRvIE1vcnRpY2lhbiBTeXN0ZW0nLFxyXG4gICAgICAnaG92ZXItZXhwbGFpbi1jbG9uZSc6ICdDbG9uZSB0aGlzIHJlcXVlc3QnLFxyXG4gICAgICAnaG92ZXItZXhwbGFpbi1kdXBsaWNhdGUnOiAnRHVwbGljYXRlIHRoaXMgcmVxdWVzdCcsXHJcbiAgICAgICdyZXF1ZXN0LnJlcXVpcmVkLmFkZC1idXJpYWwtcGVybWl0JzogJ1BsZWFzZSBhZGQgQnVyaWFsIFBlcm1pdCcsXHJcbiAgICAgICdyZXF1ZXN0LnJlcXVpcmVkLnZldGVyYW5fb25jZSc6ICdWZXRlcmFuIGNvcHkgYWxsb3dlZCBPTkxZIG9uY2UnLFxyXG4gICAgICAncmVxdWVzdC5yZXF1aXJlZC52ZXRlcmFuX3NhbWVfZGVhdGgnOiBcIlRoZSBudW1iZXIgb2YgRGVhdGggQ2VydGlmaWNhdGUgc2hvdWxkIGJlIGdyZWF0ZXIgdGhhbiAxIGlmIFZldGVyYW4ncyBjb3B5IGlzIGNoZWNrZWQhXCIsXHJcbiAgICAgICdjZXJ0aWZpY2F0ZS5yZWZ1bmQucGF5bWVudF9ub3RfZm91bmQnOiBcIlRoZSBwYXltZW50IHdhcyBub3QgZm91bmRcIixcclxuICAgICAgJ2NlcnRpZmljYXRlLnJlZnVuZC5jYW5ub3RfYmVfaXNzdWVkJzogXCJUaGUgcmVmdW5kIGNhbm5vdCBiZSBpc3N1ZWRcIixcclxuICAgICAgJ2NlcnRpZmljYXRlLnJlZnVuZC5hdXRoZW50aWNhdGlvbl9mYWlsZWQnOiBcIkF1dGhlbnRpY2F0aW9uIGZhaWxlZFwiLFxyXG4gICAgICAnbWVzc2FnZS5jb21wb3NlLnN1Y2Nlc3MnOiBcIllvdXIgbWVzc2FnZSB3YXMgc2VudFwiLFxyXG4gICAgICAnbWVzc2FnZS5jYW5jZWwuc3VjY2Vzcyc6IFwiWW91ciBtZXNzYWdlIGhhcyBiZWVuIHNhdmVkIHRvIENhbmNlbCBCb3guXCIsXHJcbiAgICAgICdjZXJ0aWZpY2F0ZXMudmVyaWZ5LnN1Y2Nlc3NmdWwnOiBcIlZlcmlmeSBzdWNjZXNzZnVsbHkuXCIsXHJcbiAgICAgICdjZXJ0aWZpY2F0ZXMudW4tdmVyaWZ5LnN1Y2Nlc3NmdWwnOiBcIlVudmVyaWZ5IHN1Y2Nlc3NmdWxseS5cIixcclxuICAgICAgJ3NlbGVjdC52ZXJpZmllZC5jZXJ0aWZpY2F0ZS5vbmx5JzogXCJQbGVhc2Ugc2VsZWN0IHZlcmlmaWVkIGNlcnRpZmljYXRlIG9ubHkuXCIsXHJcbiAgICAgICdzZWxlY3QuY2VydGlmaWNhdGUubm9uLXZlcmlmaWVkLm9ubHknOiBcIlBsZWFzZSBzZWxlY3Qgbm9uLXZlcmlmaWVkIGNlcnRpZmljYXRlIG9ubHkuXCIsXHJcbiAgICAgICdjb25maXJtLnNhdmUtbWVzc2FnZS10by1jYW5jZWwtYm94JzogXCJEbyB5b3Ugd2FudCB0byBzYXZlIGNoYW5nZSB0byBDYW5jZWwgQm94P1wiLFxyXG4gICAgICAnY2VydGlmaWNhdGUuY2hhbmdlX3N0YXR1cy5iYW5rbm90ZV9ub3RfZW5vdWdodCc6IFwiQmFua25vdGVzIGlzIG5vdCBlbm91Z2guXCIsXHJcbiAgICAgICdjZXJ0aWZpY2F0ZS5jaGFuZ2Vfc3RhdHVzLmJhbmtub3RlX25vX2ludmFsaWQnOiBcIkJhbmtub3RlIElEIGlzIGludmFsaWQuXCIsXHJcbiAgICAgICdjZXJ0aWZpY2F0ZS5jcmVhdGUudmVyaWZ5X3NpZ25fZmFpbCc6ICdTaWduYXR1cmUgaXMgaW52YWxpZC4nLFxyXG4gICAgICAnYmFua25vdGUuYXZvaWQuYmFua25vdGVfc2VyaWVzX2ludmFsaWQnOiAnQmFua25vdGUgaXMgaW52YWxpZC4nLFxyXG4gICAgICAnYmFua25vdGUuYXZvaWQuYmFua25vdGVfbm90X2Vub3VnaHQnOiAnQmFua25vdGVzIGlzIG5vdCBlbm91Z2guJyxcclxuICAgICAgJ3JlcXVlc3QucmVxdWlyZWQubmVlZC1wYXktYnVyaWFsLXBlcm1pdCc6ICdZb3UgaGF2ZSByZWdpc3RlcmVkIDpudW0gQnVyaWFsIFBlcm1pdHMgZnJvbSBTdGF0ZS4gUGxlYXNlIGlucHV0IHRoZW0gaW50byB0aGlzIHJlcXVlc3QuJyxcclxuICAgICAgJ3Bvc3QtY2VydGlmaWNhdGUubm90LWVub3VnaC1wYWlkLWJ1cmlhbCc6ICdXYXJuaW5nISBUaGlzIHJlcXVlc3QgaGFzIG5vdCBwYWlkIGZvciA6bnVtIEJ1cmlhbCBQZXJtaXRzIGJlZm9yZS4nLFxyXG4gICAgICAncG9zdC1jZXJ0aWZpY2F0ZS5vdmVyd3JpdGUtYW1lbmQtZmlsZSc6ICdEbyB5b3Ugd2FudCB0byBvdmVyd3JpdGUgQW1lbmQgRmlsZT8nLFxyXG4gICAgICAnY2VydGlmaWNhdGUudm9pZC1iYW5rbm90ZXMuc3VjY2Vzcyc6ICdCYW5rbm90ZSAoOnZvaWQpIGlzIHZvaWQgYW5kIHJlcGxhY2VkIGJ5ICg6dXNlKSBzdWNjZXNzZnVsbHknLFxyXG4gICAgICAncG9zdC1jZXJ0aWZpY2F0ZS5hbWVuZC1ub3Qtc2FtZS1kZWF0aC1maWxlJzogJ1RoZSBzdGF0ZSBmaWxlIG51bWJlciBvZiBEZWF0aCBDZXJ0aWZpY2F0ZSBpcyBub3QgbWF0Y2hpbmcgQW1lbmQgRmlsZScsXHJcbiAgICAgICdkb3dubG9hZC5maWxlLW5vdC1mb3VuZCc6ICdGaWxlIG5vdCBmb3VuZCcsXHJcbiAgICAgICdjbGFpbS5zYXZlLnN1Y2Nlc3MnOiAnQ2xhaW0gaGFzIGJlZW4gc2F2ZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdjbGFpbS5zdWJtaXQuc3VjY2Vzcyc6ICdDbGFpbSBoYXMgYmVlbiBzdWJtaXR0ZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdjbGFpbS5lZGl0dGVkLnN1Y2Nlc3MnOiAnRWRpdGVkIHN1Y2Nlc3NmdWxseScsXHJcbiAgICAgICdjbGFpbS5zYXZlLmludmFpbGRJbnB1dCc6ICdQbGVhc2UgZW50ZXIgZGF0YS4nLFxyXG4gICAgICAnY2xhaW0uc2F2ZS52YWxpZGF0ZS5hdExlYXN0T25lUm93U2VydmljZSc6ICdQbGVhc2UgZW50ZXIgYXQgbGVhc3Qgb25lIHJvdyBzZXJ2aWNlLicsXHJcbiAgICAgICdjbGFpbS5lc2lnbi5yZXBvbnNlLmVycm9yJzogJ0Vycm9yOiBjYW5ub3QgbWFrZSBlLXNpZ24uJyxcclxuICAgICAgJ2NsYWltLnVwZGF0ZS5zdWNjZXNzJzogJ0NsYWltIGhhcyBiZWVuIHNhdmVkIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAnY2xhaW0udXBkYXRlLnN0YXR1cy5hc2snOiAnRG8geW91IHdhbnQgdG8gOnR5cGUgdGhpcyBjbGFpbT8nLFxyXG4gICAgICAnY2xhaW0udXBkYXRlLnN0YXR1cy5zdWNjZXNzJzogJ1RoZSBDbGFpbSBbOm5hbWVdIGhhcyBiZWVuIDp0eXBlJyxcclxuICAgICAgJ2NsYWltLnN0YXRlLmNoYW5nZS5jb25maXJtJzogXCJZb3UgaGF2ZW4ndCBmaW5pc2hlZCB5b3VyIGNsYWltIHlldC4gRG8geW91IHdhbnQgdG8gbGVhdmUgd2l0aG91dCBmaW5pc2hpbmc/XCIsXHJcbiAgICAgICdwYXltZW50LmVkaXQuc3RhdHVzLm1pc3NpbmctY2xhaW0nOiAnVGhlcmUgaXMgbm8gY2xhaW0gaW4gdGhpcyBiYXRjaC4gUGxlYXNlIGFkZCBjbGFpbSEnLFxyXG4gICAgICAnZW9iLnNhdmUuc3VjY2Vzcyc6ICdFT0IgY29kZSBbOmNvZGVdIGhhcyBiZWVuIGFkZGVkIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAnZW9iLmVkaXQuc3VjY2Vzcyc6ICdFT0IgY29kZSBbOmNvZGVdIGhhcyBiZWVuIGVkaXRlZCBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ2VvYi5kZWxldGUuY29uZmlybSc6ICdEbyB5b3Ugd2FudCB0byByZW1vdmUgRU9CIGNvZGUgWzpjb2RlXT8nLFxyXG4gICAgICAnZW9iLmluLWFjdGl2ZS5zdWNjZXNzJzogJ0NoYW5nZSBzdGF0dXMgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgJ2VvYi5hY3RpdmUuc3VjY2Vzcyc6ICdDaGFuZ2Ugc3RhdHVzIHN1Y2Nlc3NmdWxseScsXHJcbiAgICAgICdlb2IuaW4tYWN0aXZlLnNlbGVjdGVkLWVtcHR5JzogJ1BsZWFzZSBzZWxlY3QgYXQgbGVhc3Qgb25lIHJvdycsXHJcbiAgICAgICdjcHQuc2F2ZS5zdWNjZXNzJzogJ0NQVCBjb2RlIFs6Y29kZV0gaGFzIGJlZW4gYWRkZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdjcHQuZWRpdC5zdWNjZXNzJzogJ0NQVCBjb2RlIFs6Y29kZV0gaGFzIGJlZW4gZWRpdGVkIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAnY3B0LmRlbGV0ZS5jb25maXJtJzogJ0RvIHlvdSB3YW50IHRvIHJlbW92ZSBDUFQgY29kZSBbOmNvZGVdPycsXHJcbiAgICAgICdjcHQuaW1wb3J0LnN1Y2Nlc3MnOiAnWzpuYW1lXSBoYXMgYmVlbiBpbXBvcnRlZCBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ2NwdC5lZGl0Lm5vdF9mb3VuZCc6ICdUaGlzIGl0ZW0gaGFzIHJlbW92ZWQuJyxcclxuICAgICAgJ21lZGljYXJlLnNhdmUuc3VjY2Vzcyc6ICdBZGRlZCBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ21lZGljYXJlLmVkaXQuc3VjY2Vzcyc6ICdFZGl0ZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdtZWRpY2FyZS5kZWxldGUuY29uZmlybSc6ICdEbyB5b3Ugd2FudCB0byByZW1vdmUgdGhpcyBNZWRpY2FyZT8nLFxyXG4gICAgICAnbWVkaWNhcmUuaW1wb3J0LnN1Y2Nlc3MnOiAnTWVkaWNhcmUgaGFzIGJlZW4gaW1wb3J0ZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdtZWRpY2FyZS5lZGl0Lm5vdF9mb3VuZCc6ICdUaGlzIGl0ZW0gaGFzIHJlbW92ZWQuJyxcclxuICAgICAgJ2Z1bmRpbmctc291cmNlLnJlbW92ZS5zdWNjZXNzJzogJ1JlbW92ZWQgWzpuYW1lXSBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ2Z1bmRpbmctc291cmNlLnJlbW92ZS5hc2snOiAnRG8geW91IHdhbnQgdG8gcmVtb3ZlIEZVTkRJTkcgU09VUkNFIElEIFs6bmFtZV0/JyxcclxuICAgICAgJ2Z1bmRpbmctc291cmNlLmFkZC5zdWNjZXNzJzogJ0ZVTkRJTkcgU09VUkNFIElEIFs6bmFtZV0gaGFzIGJlZW4gYWRkZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdmdW5kaW5nLXNvdXJjZS5lZGl0LnN1Y2Nlc3MnOiAnRlVORElORyBTT1VSQ0UgSUQgWzpuYW1lXSBoYXMgYmVlbiBlZGl0ZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdpY2Quc2F2ZS5zdWNjZXNzJzogJ0lDRCBjb2RlIFs6Y29kZV0gaGFzIGJlZW4gYWRkZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdpY2QuZWRpdC5zdWNjZXNzJzogJ0lDRCBjb2RlIFs6Y29kZV0gaGFzIGJlZW4gZWRpdGVkIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAnaWNkLmRlbGV0ZS5jb25maXJtJzogJ0RvIHlvdSB3YW50IHRvIHJlbW92ZSBJQ0QgY29kZSBbOmNvZGVdPycsXHJcbiAgICAgICdjb21tb24uaW1wb3J0LnN1Y2Nlc3MnOiAnWzpuYW1lXSBoYXMgYmVlbiBpbXBvcnRlZCBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ3ZhbGlkYXRpb24tcnVsZS5pbmFjdGl2ZS5hc2snOiAnRG8geW91IHdhbnQgdG8gaW5hY3RpdmUgaW4gUnVsZSBJRCBbOm5hbWVdPycsXHJcbiAgICAgICd2YWxpZGF0aW9uLXJ1bGUuYWN0aXZlLmFzayc6ICdEbyB5b3Ugd2FudCB0byBhY3RpdmUgaW4gUnVsZSBJRCBbOm5hbWVdPycsXHJcbiAgICAgICd2YWxpZGF0aW9uLXJ1bGUuYWN0aXZlLnN1Y2Nlc3MnOiAnUnVsZSBJRCBbOm5hbWVdIGFjdGl2ZSBzdWNjZXNzZnVsbHknLFxyXG4gICAgICAndmFsaWRhdGlvbi1ydWxlLmluYWN0aXZlLnN1Y2Nlc3MnOiAnUnVsZSBJRCBbOm5hbWVdIGluYWN0aXZlIHN1Y2Nlc3NmdWxseScsXHJcbiAgICAgICdwb3Muc2F2ZS5zdWNjZXNzJzogJ1BPUyBjb2RlIFs6Y29kZV0gaGFzIGJlZW4gYWRkZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdwb3MuZWRpdC5zdWNjZXNzJzogJ1BPUyBjb2RlIFs6Y29kZV0gaGFzIGJlZW4gZWRpdGVkIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAncG9zLmRlbGV0ZS5jb25maXJtJzogJ0RvIHlvdSB3YW50IHRvIHJlbW92ZSBQT1MgY29kZSBbOmNvZGVdPycsXHJcbiAgICAgICdwYWlkLXJhdGUuc2F2ZS5zdWNjZXNzJzogJ0FkZGVkIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAncGFpZC1yYXRlLmVkaXQuc3VjY2Vzcyc6ICdFZGl0ZWQgc3VjY2Vzc2Z1bGx5LicsXHJcbiAgICAgICdwYWlkLXJhdGUuZGVsZXRlLmNvbmZpcm0nOiAnRG8geW91IHdhbnQgdG8gcmVtb3ZlIGl0PycsXHJcbiAgICAgICdwYWlkLXJhdGUuaW1wb3J0LnN1Y2Nlc3MnOiAnWzpuYW1lXSBoYXMgYmVlbiBpbXBvcnRlZCBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ3BhaWQtcmF0ZS51cGRhdGUtY29uZmlnLnN1Y2Nlc3MnOiAnRWRpdGVkIHN1Y2Nlc3NmdWxseS4nLFxyXG4gICAgICAnc3lzdGVtLWRlZmF1bHQuZWRpdC5zdWNjZXNzJzogJ0VkaXRlZCBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ3N5c3RlbS1kZWZhdWx0LnNhdmUuc3VjY2Vzcyc6ICdBZGRlZCBzdWNjZXNzZnVsbHkuJyxcclxuICAgICAgJ3N5c3RlbS1kZWZhdWx0LmRlbGV0ZS5jb25maXJtJzogJ0RvIHlvdSB3YW50IHRvIHJlbW92ZSB0aGlzIGl0ZW0/JyxcclxuICAgICAgJ3ZlbmRvci5yZW5ldy1yZWplY3Quc3VjY2Vzcyc6ICdSZWplY3Qgc3VjY2Vzc2Z1bGx5JyxcclxuICAgICAgJ3ZlbmRvci5hcHByb3ZlLnN1Y2Nlc3MnOiAnQXBwcm92ZSBzdWNjZXNzZnVsbHknLFxyXG4gICAgICAndmVuZG9yLnJlbmV3LnN1Y2Nlc3MnOiAnVXBsb2FkIGNlcnRpZmljYXRlIHN1Y2Nlc3NmdWxseSdcclxuICAgIH1cclxuICB9O1xyXG4gIHZhciBwYXltZW50TWV0aG9kID0gWydDaGVjaycsICdDYXNoJywgJ0NyZWRpdCBDYXJkJ107XHJcbiAgdmFyIHBheW1lbnRNZXRob2RMaXN0aW5nID0gW1xyXG4gICAgeyBpZDogMCwgbmFtZTogJ0NoZWNrJyB9LFxyXG4gICAgeyBpZDogMSwgbmFtZTogJ0Nhc2gnIH0sXHJcbiAgICB7IGlkOiAyLCBuYW1lOiAnQ3JlZGl0IENhcmQnIH1cclxuICBdO1xyXG4gIHJldHVybiB7XHJcbiAgICBnZXRDb250ZW50OiBfZ2V0Q29udGVudCxcclxuICAgIGdldE5hbWVQYXltZW50TWV0aG9kOiBfZ2V0TmFtZVBheW1lbnRNZXRob2QsXHJcbiAgICBnZXRGYWlsTWVzc2FnZTogX2dldEZhaWxNZXNzYWdlLFxyXG4gICAgZ2V0TGlzdFBheW1lbnRNZXRob2Q6IF9nZXRMaXN0UGF5bWVudE1ldGhvZFxyXG4gIH07XHJcbiAgZnVuY3Rpb24gX2dldExpc3RQYXltZW50TWV0aG9kKCkge1xyXG4gICAgcmV0dXJuIHBheW1lbnRNZXRob2RMaXN0aW5nO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0Q29udGVudChpZCwgJGFycikge1xyXG4gICAgdmFyIHRleHQgPSBpZDtcclxuICAgIGlmICghXy5pc1VuZGVmaW5lZCgkYXJyKSkge1xyXG4gICAgICBpZiAobWVzc2FnZS5Vc1tpZF0pIHtcclxuICAgICAgICB0ZXh0ID0gbWVzc2FnZS5Vc1tpZF07XHJcbiAgICAgICAgXy5lYWNoKCRhcnIsIGZ1bmN0aW9uICh2LCBrKSB7XHJcbiAgICAgICAgICB0ZXh0ID0gdGV4dC5yZXBsYWNlKCc6JyArIGssIHYpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAobWVzc2FnZS5Vc1tpZF0pIHtcclxuICAgICAgICB0ZXh0ID0gbWVzc2FnZS5Vc1tpZF07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0ZXh0O1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0TmFtZVBheW1lbnRNZXRob2QoaWQpIHtcclxuICAgIHJldHVybiBwYXltZW50TWV0aG9kW2lkXTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldEZhaWxNZXNzYWdlKG1lc3NhZ2UpIHtcclxuICAgIHZhciBmYWlsQXV0aG9yTXNnID0gJyc7XHJcbiAgICBpZiAoXy5pc09iamVjdChtZXNzYWdlKSkge1xyXG4gICAgICBfLmVhY2gobWVzc2FnZSwgZnVuY3Rpb24gKG51bSwga2V5KSB7XHJcbiAgICAgICAgZmFpbEF1dGhvck1zZyA9IG51bVswXTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBmYWlsQXV0aG9yTXNnID0gbWVzc2FnZTtcclxuICAgIH1cclxuICAgIHJldHVybiBfZ2V0Q29udGVudChmYWlsQXV0aG9yTXNnKTtcclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWVzc2FnZVNlcnZpY2U7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gcGFnaW5hdGlvbigkbG9nLCAkdGVtcGxhdGVDYWNoZSkge1xyXG4gICR0ZW1wbGF0ZUNhY2hlLnB1dChcInBhZ2luYXRpb24tdGVtcGxhdGUuaHRtbFwiLFxyXG4gIFwiPGxpIG5nLWlmPVxcXCI6OmJvdW5kYXJ5TGlua3NcXFwiIG5nLWNsYXNzPVxcXCJ7ZGlzYWJsZWQ6IG5vUHJldmlvdXMoKXx8bmdEaXNhYmxlZH1cXFwiIGNsYXNzPVxcXCJwYWdpbmF0aW9uLWZpcnN0XFxcIj48YSBocmVmPVxcXCIjXFxcIiBuZy1jbGljaz1cXFwic2VsZWN0UGFnZSgxLCAkZXZlbnQpXFxcIiBuZy1kaXNhYmxlZD1cXFwibm9QcmV2aW91cygpfHxuZ0Rpc2FibGVkXFxcIiB1aWItdGFiaW5kZXgtdG9nZ2xlPnt7OjpnZXRUZXh0KCdmaXJzdCcpfX08L2E+PC9saT5cXG5cIiArXHJcbiAgXCI8bGkgbmctaWY9XFxcIjo6ZGlyZWN0aW9uTGlua3NcXFwiIG5nLWNsYXNzPVxcXCJ7ZGlzYWJsZWQ6IG5vUHJldmlvdXMoKXx8bmdEaXNhYmxlZH1cXFwiIGNsYXNzPVxcXCJwYWdpbmF0aW9uLXByZXZcXFwiPjxhIGhyZWY9XFxcIiNcXFwiIG5nLWNsaWNrPVxcXCJzZWxlY3RQYWdlKHBhZ2UgLSAxLCAkZXZlbnQpXFxcIiBuZy1kaXNhYmxlZD1cXFwibm9QcmV2aW91cygpfHxuZ0Rpc2FibGVkXFxcIiB1aWItdGFiaW5kZXgtdG9nZ2xlPnt7OjpnZXRUZXh0KCdwcmV2aW91cycpfX08L2E+PC9saT5cXG5cIiArXHJcbiAgXCI8bGkgbmctcmVwZWF0PVxcXCJwYWdlIGluIHBhZ2VzIHRyYWNrIGJ5ICRpbmRleFxcXCIgbmctY2xhc3M9XFxcInthY3RpdmU6IHBhZ2UuYWN0aXZlLGRpc2FibGVkOiBuZ0Rpc2FibGVkJiYhcGFnZS5hY3RpdmV9XFxcIiBjbGFzcz1cXFwicGFnaW5hdGlvbi1wYWdlXFxcIj48YSBocmVmPVxcXCIjXFxcIiBuZy1jbGljaz1cXFwic2VsZWN0UGFnZShwYWdlLm51bWJlciwgJGV2ZW50KVxcXCIgbmctZGlzYWJsZWQ9XFxcIm5nRGlzYWJsZWQmJiFwYWdlLmFjdGl2ZVxcXCIgdWliLXRhYmluZGV4LXRvZ2dsZT57e3BhZ2UudGV4dH19PC9hPjwvbGk+XFxuXCIgK1xyXG4gIFwiPGxpIG5nLWlmPVxcXCI6OmRpcmVjdGlvbkxpbmtzXFxcIiBuZy1jbGFzcz1cXFwie2Rpc2FibGVkOiBub05leHQoKXx8bmdEaXNhYmxlZH1cXFwiIGNsYXNzPVxcXCJwYWdpbmF0aW9uLW5leHRcXFwiPjxhIGhyZWY9XFxcIiNcXFwiIG5nLWNsaWNrPVxcXCJzZWxlY3RQYWdlKHBhZ2UgKyAxLCAkZXZlbnQpXFxcIiBuZy1kaXNhYmxlZD1cXFwibm9OZXh0KCl8fG5nRGlzYWJsZWRcXFwiIHVpYi10YWJpbmRleC10b2dnbGU+e3s6OmdldFRleHQoJ25leHQnKX19PC9hPjwvbGk+XFxuXCIgK1xyXG4gIFwiPGxpIG5nLWlmPVxcXCI6OmJvdW5kYXJ5TGlua3NcXFwiIG5nLWNsYXNzPVxcXCJ7ZGlzYWJsZWQ6IG5vTmV4dCgpfHxuZ0Rpc2FibGVkfVxcXCIgY2xhc3M9XFxcInBhZ2luYXRpb24tbGFzdFxcXCI+PGEgaHJlZj1cXFwiI1xcXCIgbmctY2xpY2s9XFxcInNlbGVjdFBhZ2UodG90YWxQYWdlcywgJGV2ZW50KVxcXCIgbmctZGlzYWJsZWQ9XFxcIm5vTmV4dCgpfHxuZ0Rpc2FibGVkXFxcIiB1aWItdGFiaW5kZXgtdG9nZ2xlPnt7OjpnZXRUZXh0KCdsYXN0Jyl9fTwvYT48L2xpPlxcblwiICtcclxuICBcIlwiKTtcclxuICB2YXIgbGlzdFBhZ2UgPSBbXHJcbiAgICB7aWQ6IDEwLCB2YWx1ZTogMTB9LFxyXG4gICAge2lkOiAyNSwgdmFsdWU6IDI1fSxcclxuICAgIHtpZDogNTAsIHZhbHVlOiA1MH0sXHJcbiAgICB7aWQ6IDEwMCwgdmFsdWU6IDEwMH1cclxuICBdO1xyXG4gIHJldHVybiB7XHJcbiAgICByZXN0cmljdDogJ0FFJyxcclxuICAgIHNjb3BlOiB7XHJcbiAgICAgIHRvdGFsSXRlbXM6ICc9JyxcclxuICAgICAgcGFnZU51bTogJz0nLFxyXG4gICAgICBjdXJyZW50UGFnZTogJz0nLFxyXG4gICAgICBjYWxsYmFjazogJyZvbkNoYW5nZWQnLFxyXG4gICAgICBwYWdlTGVuZ3RoOiAnPT8nXHJcbiAgICAgIC8vIHNlbGVjdGVkT3B0OiAnPT8nXHJcbiAgICB9LFxyXG4gICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvbW9kdWxlcy9jb21tb24vdmlld3MvcGFnaW5hdGlvbi5odG1sJyxcclxuICAgIGxpbms6IGZ1bmN0aW9uICgkc2NvcGUpIHtcclxuICAgICAgJHNjb3BlLnBhZ2VMZW5ndGggPSAkc2NvcGUucGFnZUxlbmd0aCB8fCAxMDtcclxuICAgICAgJHNjb3BlLnBhZ2VPcHRpb24gPSBsaXN0UGFnZTtcclxuICAgICAgaWYgKF8uaXNOdWxsKCRzY29wZS5jdXJyZW50UGFnZSkgfHwgXy5pc1VuZGVmaW5lZCgkc2NvcGUuY3VycmVudFBhZ2UpIHx8IF8uaXNFbXB0eSgkc2NvcGUuY3VycmVudFBhZ2UpKSB7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgfVxyXG4gICAgICAkc2NvcGUub25QYWdlQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICRzY29wZS5maW5pc2goKTtcclxuICAgICAgfTtcclxuICAgICAgJHNjb3BlLmNoYW5nZVBhZ2VMZW5ndGggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgJHNjb3BlLmN1cnJlbnRQYWdlID0gMTtcclxuICAgICAgICAkc2NvcGUuZmluaXNoKCk7XHJcbiAgICAgIH07XHJcbiAgICAgICRzY29wZS5maW5pc2ggPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIG9iaiA9IHtcclxuICAgICAgICAgIGN1cnJlbnRQYWdlOiAkc2NvcGUuY3VycmVudFBhZ2UsXHJcbiAgICAgICAgICBwYWdlTGVuZ3RoOiAkc2NvcGUucGFnZUxlbmd0aFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgJHNjb3BlLmNhbGxiYWNrKHtcclxuICAgICAgICAgIGl0ZW06IG9ialxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH07XHJcbn1cclxubW9kdWxlLmV4cG9ydHMgPSBwYWdpbmF0aW9uOyIsIid1c2Ugc3RyaWNrJztcclxuXHJcbmZ1bmN0aW9uIFBlcm1pc3Npb25TZXJ2aWNlKCRjb29raWVzLCAkbG9nLCBQZXJtUm9sZVN0b3JlLCBQZXJtUGVybWlzc2lvblN0b3JlLCAkbG9jYXRpb24pIHtcclxuICAvLyB3ZSBjb3VsZCBkbyBhZGRpdGlvbmFsIHdvcmsgaGVyZSB0b29cclxuICAvLyB2YXIgcGVybWlzc2lvblJlc291cmNlID0gJHJlc291cmNlKCdhcGkvcGVybWlzc2lvbi86YWN0aW9uLzppZCcsIHt9LFxyXG4gIC8vICAge1xyXG4gIC8vICAgICBnZXJQZXJtaXNzaW9uQnlVc2VyOiB7XHJcbiAgLy8gICAgICAgbWV0aG9kOiAnUE9TVCcsXHJcbiAgLy8gICAgICAgaXNBcnJheTogZmFsc2UsXHJcbiAgLy8gICAgICAgcGFyYW1zOiB7XHJcbiAgLy8gICAgICAgICBhY3Rpb246ICdnZXQtcGVybWlzc2lvbi1ieS11c2VyJ1xyXG4gIC8vICAgICAgIH1cclxuICAvLyAgICAgfVxyXG4gIC8vICAgfVxyXG4gIC8vICk7XHJcbiAgdmFyIGRvbWFpbk5hbWUgPSAkbG9jYXRpb24uaG9zdCgpICsgJ18nO1xyXG4gIHZhciBsaXN0U3RhdHVzQ2VydCA9IFtcclxuICAgIHsgbmFtZTogJ1BlbmRpbmcnLCBpZDogMCB9LFxyXG4gICAgeyBuYW1lOiAnUG9zdCcsIGlkOiAxIH0sXHJcbiAgICB7IG5hbWU6ICdEZWxpdmVyJywgaWQ6IDIgfSxcclxuICAgIHsgbmFtZTogJ1JlamVjdCcsIGlkOiAzIH0sXHJcbiAgICB7IG5hbWU6ICdDYW5jZWwnLCBpZDogNCB9XHJcbiAgXTtcclxuICB2YXIgbGlzdFN0YXR1c1VzZXIgPSBbXHJcbiAgICB7IG5hbWU6ICdQZW5kaW5nJywgaWQ6IDAgfSxcclxuICAgIHsgbmFtZTogJ0FjdGl2ZScsIGlkOiAxIH0sXHJcbiAgICB7IG5hbWU6ICdJbmFjdGl2ZScsIGlkOiAyIH0sXHJcbiAgICB7IG5hbWU6ICdSZWplY3QnLCBpZDogMyB9LFxyXG4gICAgeyBuYW1lOiAnUmVtb3ZlZCcsIGlkOiA0IH1cclxuICBdO1xyXG4gIHZhciBsaXN0VHlwZSA9IFtcclxuICAgIHsgaWQ6IG51bGwsIG5hbWU6ICdBTEwnIH0sXHJcbiAgICB7IGlkOiAwLCBuYW1lOiAnVklFV0VSJyB9LFxyXG4gICAgeyBpZDogMSwgbmFtZTogJ1ZFTkRPUicgfSxcclxuICAgIHsgaWQ6IDIsIG5hbWU6ICdJUycgfSxcclxuICAgIHsgaWQ6IDMsIG5hbWU6ICdET0NUT1IgQVVESVRFUicgfSxcclxuICAgIHsgaWQ6IDQsIG5hbWU6ICdBQ0NPVU5USU5HJyB9LFxyXG4gICAgeyBpZDogNSwgbmFtZTogJ0FVRElUIE9GRklDRVInIH0sXHJcbiAgICB7IGlkOiA2LCBuYW1lOiAnQSBBRE1JTicgfSxcclxuICAgIHsgaWQ6IDcsIG5hbWU6ICdESVJFQ1RPUicgfSxcclxuICAgIHsgaWQ6IDgsIG5hbWU6ICdTWVNURU0gQURNSU4nIH1cclxuICBdO1xyXG4gIHZhciBsaXN0VHlwZUJ5TmFtZSA9IHtcclxuICAgIFZJRVdFUjogMCxcclxuICAgIFZFTkRPUjogMSxcclxuICAgIElTOiAyLFxyXG4gICAgRE9DVE9SX0FVRElURVI6IDMsXHJcbiAgICBBQ0NPVU5USU5HOiA0LFxyXG4gICAgQVVESVRfT0ZGSUNFUjogNSxcclxuICAgIEFfQURNSU46IDYsXHJcbiAgICBESVJFQ1RPUjogNyxcclxuICAgIFNZU1RFTV9BRE1JTjogOFxyXG4gIH07XHJcbiAgLy8gdmFyIGxpc3RSb2xlID0gWydHZW5lcmFsJywgJ0Z1bmVyYWwgSG9tZScsICdBIEJpbGxpbmcnLCAnQSBTZXJ2aWNlJywgJ0EgQWRtaW4nLCAnU3lzdGVtIEFkbWluJywgJ0RpcmVjdG9yJywgJ1N1cGVyIEFkbWluJ107XHJcbiAgdmFyIGxpc3RSb2xlID0gWydWSUVXRVInLCAnVkVORE9SJywgJ0lTJywgJ0RPQ1RPUiBBVURJVEVSJywgJ0FDQ09VTlRJTkcnLCAnQVVESVQgT0ZGSUNFUicsICdBIEFETUlOJywgJ0RJUkVDVE9SJywgJ1NZU1RFTSBBRE1JTiddO1xyXG4gIHJldHVybiB7XHJcbiAgICBnZXRQZXJtaXNzaW9uOiBfZ2V0UGVybWlzc2lvbixcclxuICAgIHNldFBlcm1pc3Npb246IF9zZXRQZXJtaXNzaW9uLFxyXG4gICAgZ2V0Um9sZTogX2dldFJvbGUsXHJcbiAgICBnZXRSb2xlTmFtZTogX2dldFJvbGVOYW1lLFxyXG4gICAgZ2V0U3RhdHVzTmFtZTogX2dldFN0YXR1c05hbWUsXHJcbiAgICBnZXRMaXN0VHlwZTogX2dldExpc3RUeXBlLFxyXG4gICAgZ2V0TGlzdExvd2VyVHlwZTogX2dldExpc3RMb3dlclR5cGUsXHJcbiAgICBnZXRTdGF0dXNDZXJ0OiBfZ2V0U3RhdHVzQ2VydCxcclxuICAgIGdldExpc3RTdGF0dXNDZXJ0OiBfZ2V0TGlzdFN0YXR1c0NlcnQsXHJcbiAgICBnZXRMaXN0U3RhdHVzQ2VydFBsdWNrOiBfZ2V0TGlzdFN0YXR1c0NlcnRQbHVjayxcclxuICAgIGdldExpc3RTdGF0dXNVc2VyOiBfZ2V0TGlzdFN0YXR1c1VzZXIsXHJcbiAgICBnZXRMaXN0U3RhdHVzVXNlclBsdWNrOiBfZ2V0TGlzdFN0YXR1c1VzZXJQbHVjayxcclxuICAgIGdldFN0YXR1c1VzZXJCeU5hbWU6IF9nZXRTdGF0dXNVc2VyQnlOYW1lLFxyXG4gICAgZ2V0U3RhdHVzQ2VydEJ5TmFtZTogX2dldFN0YXR1c0NlcnRCeU5hbWUsXHJcbiAgICBnZXRVc2VyOiBfZ2V0VXNlcixcclxuICAgIHNldFVzZXI6IF9zZXRVc2VyLFxyXG4gICAgc2V0QXV0aG9yOiBfc2V0QXV0aG9yLFxyXG4gICAgZ2V0QXV0aG9yOiBfZ2V0QXV0aG9yLFxyXG4gICAgc2V0TG9naW5Ub2tlbjogX3NldExvZ2luVG9rZW4sXHJcbiAgICBnZXRMb2dpblRva2VuOiBfZ2V0TG9naW5Ub2tlbixcclxuICAgIGRlZmluZVJvbGU6IF9kZWZpbmVSb2xlLFxyXG4gICAgbG9nT3V0OiBfbG9nT3V0LFxyXG4gICAgZ2V0Um9sZUlEQnlOYW1lOiBfZ2V0Um9sZUlEQnlOYW1lLFxyXG4gICAgY2hlY2tQZXJtaXNzaW9uOiBfY2hlY2tQZXJtaXNzaW9uXHJcbiAgfTtcclxuICBmdW5jdGlvbiBfbG9nT3V0KCkge1xyXG4gICAgX3NldEF1dGhvcignJyk7XHJcbiAgICBfc2V0VXNlcih7fSk7XHJcbiAgICBfc2V0TG9naW5Ub2tlbignJyk7XHJcbiAgICBfc2V0UGVybWlzc2lvbih7fSk7XHJcbiAgICBQZXJtUGVybWlzc2lvblN0b3JlLmNsZWFyU3RvcmUoKTtcclxuICAgIFBlcm1Sb2xlU3RvcmUuY2xlYXJTdG9yZSgpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0Um9sZUlEQnlOYW1lKCkge1xyXG4gICAgcmV0dXJuIGxpc3RUeXBlQnlOYW1lO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0Um9sZSh0eXBlKSB7XHJcbiAgICAvLyBjb25zdCBUWVBFX0dFTkVSQUwgPSAwO1xyXG4gICAgLy8gY29uc3QgVFlQRV9NT1JUVUFSWSA9IDE7XHJcbiAgICAvLyBjb25zdCBUWVBFX0EgPSAyO1xyXG4gICAgdHlwZSA9IHBhcnNlSW50KHR5cGUpO1xyXG4gICAgdmFyIHJvbGUgPSAnYWRtaW4nO1xyXG4gICAgaWYgKHR5cGUgPT09IDEpIHtcclxuICAgICAgcm9sZSA9ICdmdW5lcmFsJztcclxuICAgIH0gZWxzZSBpZiAodHlwZSA9PT0gMCkge1xyXG4gICAgICByb2xlID0gJ2dlbmVyYWwnO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJvbGU7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRTdGF0dXNOYW1lKHN0YXR1cykge1xyXG4gICAgcmV0dXJuIF9nZXROYW1lT2JqKGxpc3RTdGF0dXNVc2VyLCBzdGF0dXMpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0Um9sZU5hbWUocm9sZUlkKSB7XHJcbiAgICByb2xlSWQgPSBwYXJzZUludChyb2xlSWQpO1xyXG4gICAgcmV0dXJuIGxpc3RSb2xlW3JvbGVJZF07XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9zZXRQZXJtaXNzaW9uKHBlcikge1xyXG4gICAgJGNvb2tpZXMucHV0T2JqZWN0KGRvbWFpbk5hbWUgKyAncGVybWlzc2lvbicsIHBlcik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRQZXJtaXNzaW9uKGF1dGhvcikge1xyXG4gICAgcmV0dXJuICRjb29raWVzLmdldE9iamVjdChkb21haW5OYW1lICsgJ3Blcm1pc3Npb24nKTtcclxuICAgIC8vIGFwaVxyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0TGlzdFR5cGUoZXhjZXB0KSB7XHJcbiAgICAvLyAwOiBUWVBFX0RFQVRIXHJcbiAgICAvLyAxOiBUWVBFX0ZFVEFMXHJcbiAgICAvLyAyOiBUWVBFX0JVUklFRFxyXG4gICAgcmV0dXJuIF9nZXRMaXN0T2JqKGxpc3RUeXBlLCBleGNlcHQpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0TGlzdExvd2VyVHlwZShjdXJyZW50Um9sZSwgZXhjZXB0KSB7XHJcbiAgICByZXR1cm4gX2dldExpc3RMb3dlck9iaihsaXN0VHlwZSwgY3VycmVudFJvbGUsIGV4Y2VwdCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRTdGF0dXNDZXJ0KHN0YXR1cykge1xyXG4gICAgcmV0dXJuIF9nZXROYW1lT2JqKGxpc3RTdGF0dXNDZXJ0LCBzdGF0dXMpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0TGlzdFN0YXR1c0NlcnQoZXhjZXB0KSB7XHJcbiAgICByZXR1cm4gX2dldExpc3RPYmoobGlzdFN0YXR1c0NlcnQsIGV4Y2VwdCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMaXN0U3RhdHVzQ2VydFBsdWNrKGV4Y2VwdCwgcHJvcGVydHlOYW1lKSB7XHJcbiAgICByZXR1cm4gX2dldExpc3RQbHVjayhsaXN0U3RhdHVzQ2VydCwgZXhjZXB0LCBwcm9wZXJ0eU5hbWUpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0TGlzdFN0YXR1c1VzZXIoZXhjZXB0KSB7XHJcbiAgICByZXR1cm4gX2dldExpc3RPYmoobGlzdFN0YXR1c1VzZXIsIGV4Y2VwdCk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMaXN0U3RhdHVzVXNlclBsdWNrKGV4Y2VwdCwgcHJvcGVydHlOYW1lKSB7XHJcbiAgICByZXR1cm4gX2dldExpc3RQbHVjayhsaXN0U3RhdHVzVXNlciwgZXhjZXB0LCBwcm9wZXJ0eU5hbWUpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0U3RhdHVzVXNlckJ5TmFtZShuYW1lKSB7XHJcbiAgICByZXR1cm4gX2dldElkT2JqKGxpc3RTdGF0dXNVc2VyLCBuYW1lKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldFN0YXR1c0NlcnRCeU5hbWUobmFtZSkge1xyXG4gICAgcmV0dXJuIF9nZXRJZE9iaihsaXN0U3RhdHVzQ2VydCwgbmFtZSk7XHJcbiAgfVxyXG4gIC8vIHByaXZhdGUgZnVuY3Rpb25cclxuICBmdW5jdGlvbiBfZ2V0TmFtZU9iaihvYmosIGlkKSB7XHJcbiAgICBpZCA9IHBhcnNlSW50KGlkKTtcclxuICAgIHZhciBldmVuID0gXy5maW5kKG9iaiwgZnVuY3Rpb24gKG51bSkgeyByZXR1cm4gbnVtLmlkID09PSBpZDsgfSk7XHJcbiAgICByZXR1cm4gZXZlbi5uYW1lO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0SWRPYmoob2JqLCBuYW1lKSB7XHJcbiAgICAvLyBpZCA9IHBhcnNlSW50KGlkKTtcclxuICAgIHZhciBldmVuID0gXy5maW5kKG9iaiwgZnVuY3Rpb24gKG51bSkgeyByZXR1cm4gbnVtLm5hbWUgPT09IG5hbWU7IH0pO1xyXG4gICAgcmV0dXJuIGV2ZW4uaWQ7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMaXN0T2JqKG9iaiwgZXhjZXB0KSB7XHJcbiAgICBpZiAoXy5pc1VuZGVmaW5lZChleGNlcHQpKSB7XHJcbiAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBmdW5jdGlvbiAobnVtLCBrKSB7XHJcbiAgICAgIGlmIChfLmlzQXJyYXkoZXhjZXB0KSkge1xyXG4gICAgICAgIHJldHVybiAhXy5jb250YWlucyhleGNlcHQsIG51bS5uYW1lKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gZXhjZXB0ICE9PSBudW0ubmFtZTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMaXN0TG93ZXJPYmoob2JqLCBjdXJyZW50Um9sZSwgZXhjZXB0KSB7XHJcbiAgICBpZiAoXy5pc1VuZGVmaW5lZChleGNlcHQpKSB7XHJcbiAgICAgIHJldHVybiBvYmo7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gXy5maWx0ZXIob2JqLCBmdW5jdGlvbiAobnVtLCBrKSB7XHJcbiAgICAgIGlmIChfLmlzQXJyYXkoZXhjZXB0KSkge1xyXG4gICAgICAgIC8vICRsb2cuaW5mbygnQUFBQScsICFfLmNvbnRhaW5zKGV4Y2VwdCwgbnVtLm5hbWUpKTtcclxuICAgICAgICAvLyAkbG9nLmluZm8oJ0JCQkJCJywgcGFyc2VJbnQoY3VycmVudFJvbGUpKTtcclxuICAgICAgICByZXR1cm4gKCFfLmNvbnRhaW5zKGV4Y2VwdCwgbnVtLm5hbWUpKSAmJiAocGFyc2VJbnQoY3VycmVudFJvbGUpID4gbnVtLmlkKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB2YXIgdGVzdDIgPSBleGNlcHQgIT09IG51bS5uYW1lO1xyXG4gICAgICAgIHJldHVybiB0ZXN0MjtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMaXN0UGx1Y2sob2JqLCBleGNlcHQsIHByb3BlcnR5TmFtZSkge1xyXG4gICAgaWYgKF8uaXNVbmRlZmluZWQocHJvcGVydHlOYW1lKSkge1xyXG4gICAgICBwcm9wZXJ0eU5hbWUgPSAnaWQnO1xyXG4gICAgfVxyXG4gICAgaWYgKF8uaXNVbmRlZmluZWQoZXhjZXB0KSkge1xyXG4gICAgICByZXR1cm4gXy5wbHVjayhvYmosIHByb3BlcnR5TmFtZSk7XHJcbiAgICB9XHJcbiAgICB2YXIgb2JqRmlsZXQgPSBfLmZpbHRlcihvYmosIGZ1bmN0aW9uIChudW0sIGspIHtcclxuICAgICAgaWYgKF8uaXNBcnJheShleGNlcHQpKSB7XHJcbiAgICAgICAgcmV0dXJuICFfLmNvbnRhaW5zKGV4Y2VwdCwgbnVtLm5hbWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiBleGNlcHQgIT09IG51bS5uYW1lO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBfLnBsdWNrKG9iakZpbGV0LCBwcm9wZXJ0eU5hbWUpO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0VXNlcigpIHtcclxuICAgIHJldHVybiAkY29va2llcy5nZXRPYmplY3QoZG9tYWluTmFtZSArICd1c2VyJyk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9zZXRVc2VyKHVzZXIpIHtcclxuICAgICRjb29raWVzLnB1dE9iamVjdChkb21haW5OYW1lICsgJ3VzZXInLCB1c2VyKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3NldEF1dGhvcihpdGVtKSB7XHJcbiAgICAkY29va2llcy5wdXQoZG9tYWluTmFtZSArICdhdXRob3InLCBpdGVtKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldEF1dGhvcigpIHtcclxuICAgIHJldHVybiAkY29va2llcy5nZXQoZG9tYWluTmFtZSArICdhdXRob3InKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3NldExvZ2luVG9rZW4oYWNjZXNzVG9rZW4pIHtcclxuICAgICRjb29raWVzLnB1dChkb21haW5OYW1lICsgJ2xvZ2luVG9rZW5Db29raWUnLCBhY2Nlc3NUb2tlbik7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMb2dpblRva2VuKCkge1xyXG4gICAgcmV0dXJuICRjb29raWVzLmdldChkb21haW5OYW1lICsgJ2xvZ2luVG9rZW5Db29raWUnKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2RlZmluZVJvbGUocGVybWlzc2lvbikge1xyXG4gICAgUGVybVBlcm1pc3Npb25TdG9yZS5jbGVhclN0b3JlKCk7XHJcbiAgICBQZXJtUm9sZVN0b3JlLmNsZWFyU3RvcmUoKTtcclxuICAgIHZhciBhdXRob3IgPSBfZ2V0QXV0aG9yKCkgPyBfZ2V0QXV0aG9yKCkgOiAnZ3Vlc3QnO1xyXG4gICAgaWYgKGF1dGhvciAhPT0gJ2d1ZXN0Jykge1xyXG4gICAgICBQZXJtUm9sZVN0b3JlLmRlZmluZVJvbGUoYXV0aG9yLCBwZXJtaXNzaW9uKTtcclxuICAgICAgUGVybVBlcm1pc3Npb25TdG9yZS5kZWZpbmVNYW55UGVybWlzc2lvbnMocGVybWlzc2lvbiwgZnVuY3Rpb24gKHBlcm1pc3Npb25OYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMocGVybWlzc2lvbiwgcGVybWlzc2lvbk5hbWUpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBlcm1pc3Npb24gPSBbJ2d1ZXN0JywgJ3NlZVJlc3VibWl0QnRuRGV0YWlsUmVxdWVzdCddO1xyXG4gICAgICBQZXJtUm9sZVN0b3JlLmRlZmluZVJvbGUoYXV0aG9yLCBwZXJtaXNzaW9uKTtcclxuICAgICAgUGVybVBlcm1pc3Npb25TdG9yZS5kZWZpbmVNYW55UGVybWlzc2lvbnMocGVybWlzc2lvbiwgZnVuY3Rpb24gKHBlcm1pc3Npb25OYW1lKSB7XHJcbiAgICAgICAgcmV0dXJuIF8uY29udGFpbnMocGVybWlzc2lvbiwgcGVybWlzc2lvbk5hbWUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbiAgZnVuY3Rpb24gX2NoZWNrUGVybWlzc2lvbihwZXJtaXNzaW9uTmFtZSkge1xyXG4gICAgdmFyIGxpc3RQZXJtaXNzaW9uID0gX2dldFBlcm1pc3Npb24oKTtcclxuICAgIHZhciBoYXNQZXJtaXNzaW9uID0gXy5maW5kKGxpc3RQZXJtaXNzaW9uLCBmdW5jdGlvbihwKSB7XHJcbiAgICAgIHJldHVybiBwID09PSBwZXJtaXNzaW9uTmFtZTtcclxuICAgIH0pO1xyXG4gICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGhhc1Blcm1pc3Npb24pKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBQZXJtaXNzaW9uU2VydmljZTsiLCIndXNlIHN0cmljayc7XHJcblxyXG5mdW5jdGlvbiBzb3J0VGhlYWQoJGxvZykge1xyXG4gIHJldHVybiB7XHJcbiAgICBsaW5rOiBsaW5rLFxyXG4gICAgc2NvcGU6IHtcclxuICAgICAgY2FsbGJhY2s6ICcmb25Tb3J0JyxcclxuICAgICAgZGF0YVNlYXJjaDogJz1zb3J0VGhlYWQnXHJcbiAgICB9XHJcbiAgfTtcclxuICBmdW5jdGlvbiBsaW5rKHNjb3BlLCBlbGVtZW50LCBhdHRycykge1xyXG4gICAgaW5pdCgpO1xyXG4gICAgZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgICAgdmFyIGVsZW1zID0gZWxlbWVudC5jaGlsZHJlbigpO1xyXG4gICAgICB2YXIgZGVmID0gYXR0cnMuc29ydFRoZWFkO1xyXG4gICAgICBpZiAoXy5pc0VtcHR5KGRlZikpIHtcclxuICAgICAgICBkZWYgPSAnZGVzYyc7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVmID0gZGVmLnRvTG9jYWxlTG93ZXJDYXNlKCk7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFzY29wZS5kYXRhU2VhcmNoKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIF8uZWFjaChlbGVtcywgZnVuY3Rpb24gKGVsKSB7XHJcbiAgICAgICAgaWYgKCFlbC5oYXNBdHRyaWJ1dGUoJ25vLXNvcnQnKSkge1xyXG4gICAgICAgICAgYW5ndWxhci5lbGVtZW50KGVsKS5hZGRDbGFzcygnc29ydGluZycpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICAgIHNjb3BlLiR3YXRjaCgnZGF0YVNlYXJjaCcsIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICghc2NvcGUuZGF0YVNlYXJjaCkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB2YXIgZGVzYyA9IGVsZW1lbnQuY2hpbGRyZW4oXCJ0aFtjbGFzcz0nc29ydGluZ19kZXNjJ11cIik7XHJcbiAgICAgICAgZGVzYy5yZW1vdmVDbGFzcygnc29ydGluZ19kZXNjJyk7XHJcbiAgICAgICAgZGVzYy5hZGRDbGFzcygnc29ydGluZycpO1xyXG4gICAgICAgIHZhciBhc2MgPSBlbGVtZW50LmNoaWxkcmVuKFwidGhbY2xhc3M9J3NvcnRpbmdfYXNjJ11cIikucmVtb3ZlQ2xhc3MoJ3NvcnRpbmdfYXNjJyk7XHJcbiAgICAgICAgYXNjLnJlbW92ZUNsYXNzKCdzb3J0aW5nX2Rlc2MnKTtcclxuICAgICAgICBhc2MuYWRkQ2xhc3MoJ3NvcnRpbmcnKTtcclxuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKFwidGhba2V5PSdcIiArIHNjb3BlLmRhdGFTZWFyY2gub3JkZXJfYnkgKyBcIiddXCIpLmFkZENsYXNzKCdzb3J0aW5nXycgKyBzY29wZS5kYXRhU2VhcmNoLm9yZGVyX21ldGhvZC50b0xvY2FsZUxvd2VyQ2FzZSgpKTtcclxuICAgICAgICBlbGVtZW50LmNoaWxkcmVuKFwidGhba2V5PSdcIiArIHNjb3BlLmRhdGFTZWFyY2gub3JkZXJfYnkgKyBcIiddXCIpLnJlbW92ZUNsYXNzKCdzb3J0aW5nJyk7XHJcbiAgICAgIH0sIHRydWUpO1xyXG4gICAgICBlbGVtcy5vbignY2xpY2snLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdmFyIHNlbGYgPSBhbmd1bGFyLmVsZW1lbnQodGhpcyk7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQXR0cmlidXRlKCduby1zb3J0JykpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgdmFyIG5vdE1lID0gZWxlbWVudC5jaGlsZHJlbigpLm5vdChhbmd1bGFyLmVsZW1lbnQodGhpcykpLm5vdCgnW25vLXNvcnRdJyk7XHJcbiAgICAgICAgbm90TWUucmVtb3ZlQ2xhc3MoJ3NvcnRpbmdfZGVzYycpO1xyXG4gICAgICAgIG5vdE1lLnJlbW92ZUNsYXNzKCdzb3J0aW5nX2FzYycpO1xyXG4gICAgICAgIG5vdE1lLmFkZENsYXNzKCdzb3J0aW5nJyk7XHJcblxyXG4gICAgICAgIGlmIChzZWxmLmhhc0NsYXNzKCdzb3J0aW5nJykpIHtcclxuICAgICAgICAgIHNlbGYuYWRkQ2xhc3MoJ3NvcnRpbmdfZGVzYycpO1xyXG4gICAgICAgICAgc2VsZi5yZW1vdmVDbGFzcygnc29ydGluZycpO1xyXG4gICAgICAgICAgc2NvcGUuY2FsbGJhY2soe1xyXG4gICAgICAgICAgICBpdGVtOiB7XHJcbiAgICAgICAgICAgICAgb3JkZXJCeTogc2VsZi5hdHRyKCdrZXknKSxcclxuICAgICAgICAgICAgICBvcmRlck1ldGhvZDogJ0RFU0MnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSBpZiAoc2VsZi5oYXNDbGFzcygnc29ydGluZ19kZXNjJykpIHtcclxuICAgICAgICAgIHNlbGYucmVtb3ZlQ2xhc3MoJ3NvcnRpbmdfZGVzYycpO1xyXG4gICAgICAgICAgc2VsZi5hZGRDbGFzcygnc29ydGluZ19hc2MnKTtcclxuICAgICAgICAgIHNjb3BlLmNhbGxiYWNrKHtcclxuICAgICAgICAgICAgaXRlbToge1xyXG4gICAgICAgICAgICAgIG9yZGVyQnk6IHNlbGYuYXR0cigna2V5JyksXHJcbiAgICAgICAgICAgICAgb3JkZXJNZXRob2Q6ICdBU0MnXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWxmLnJlbW92ZUNsYXNzKCdzb3J0aW5nX2FzYycpO1xyXG4gICAgICAgICAgc2VsZi5hZGRDbGFzcygnc29ydGluZ19kZXNjJyk7XHJcbiAgICAgICAgICBzY29wZS5jYWxsYmFjayh7XHJcbiAgICAgICAgICAgIGl0ZW06IHtcclxuICAgICAgICAgICAgICBvcmRlckJ5OiBzZWxmLmF0dHIoJ2tleScpLFxyXG4gICAgICAgICAgICAgIG9yZGVyTWV0aG9kOiAnREVTQydcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gc29ydFRoZWFkO1xyXG5cclxuIiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gVXRpbHMoJHNjZSwgJHVpYk1vZGFsLCBQZXJtaXNzaW9uU2VydmljZSwgJHEsIGJsb2NrVUksICRpbnRlcnZhbCwgJHN0YXRlLCAkdWliTW9kYWxTdGFjaywgJHRpbWVvdXQpIHtcclxuICB2YXIgdGltZU5vQWN0aW9uID0gMDtcclxuICB2YXIgSEFMRl9IT1VSID0gMTgwMDtcclxuICB2YXIgY291bnRkb3duID0gbnVsbDtcclxuICB2YXIgdGltZXIgPSBudWxsO1xyXG4gIHZhciBfZnVsbE5hbWVEZWZhdWx0U2V0dGluZyA9IHtcclxuICAgIHN0cmluZ0VtcHR5OiAnJ1xyXG4gIH07XHJcbiAgZnVuY3Rpb24gUGFnaW5nTW9kZWwoKSB7XHJcbiAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAvLyBmdW5jdGlvbiBtb2RlbCgpIHt9XHJcbiAgICAvLyBtb2RlbC5wcm90b3R5cGUgPSBzZWxmO1xyXG5cclxuICAgIHNlbGYuc3RhdGUgPSB7XHJcbiAgICAgIHNob3dTZWFyY2g6IGZhbHNlLFxyXG4gICAgICBzZWxlY3RlZFJvdzogbnVsbCxcclxuICAgICAgdG90YWxJdGVtczogMCxcclxuICAgICAgcGFnZU51bTogMCxcclxuICAgICAgY3VycmVudFBhZ2U6IDAsXHJcbiAgICAgIGRhdGFQYWdlOiB7fVxyXG4gICAgfTtcclxuICAgIHNlbGYucGFyYW1zID0ge307XHJcbiAgICBzZWxmLnBhZ2luZyA9IHtcclxuICAgICAgb3JkZXJfYnk6ICdpZCcsXHJcbiAgICAgIG9yZGVyX21ldGhvZDogJ0RFU0MnLFxyXG4gICAgICBsaW1pdDogMTAsXHJcbiAgICAgIG9mZnNldDogMFxyXG4gICAgfTtcclxuICAgIC8vIHNlbGYucGFyYW1zUmVxdWVzdCA9XHJcbiAgICBzZWxmLnBhcmFtc1JlcXVlc3QgPSB7fTtcclxuICAgIHNlbGYucGFyYW1zQ2xvbmUgPSB7fTtcclxuICAgIHNlbGYucGFnaW5nQ2xvbmUgPSB7fTtcclxuICAgIC8vIGxpc3QgZnVuY3Rpb25cclxuICAgIHNlbGYucmVzZXRTZWFyY2ggPSByZXNldFNlYXJjaDtcclxuICAgIHNlbGYuY2FuY2VsU2VhcmNoID0gY2FuY2VsU2VhcmNoO1xyXG4gICAgc2VsZi5vblNvcnQgPSBvblNvcnQ7XHJcbiAgICBzZWxmLm9uQ2hhbmdlUGFnZSA9IG9uQ2hhbmdlUGFnZTtcclxuICAgIHNlbGYub25TZWFyY2ggPSBvblNlYXJjaDtcclxuICAgIHNlbGYuZ2V0TGlzdGluZyA9IGZ1bmN0aW9uICgpIHsgfTtcclxuICAgIHNlbGYuZ2V0U2VhcmNoUGFyYW1zID0gZ2V0U2VhcmNoUGFyYW1zO1xyXG4gICAgc2VsZi5zZXREYXRhID0gc2V0RGF0YTtcclxuICAgIHNlbGYuY292ZXJ0RGF0YSA9IGNvdmVydERhdGE7XHJcbiAgICBzZWxmLnNldFBhcmFtcyA9IF9zZXRQYXJhbXM7XHJcbiAgICBzZWxmLnNldFBhZ2luZyA9IF9zZXRQYWdpbmc7XHJcbiAgICBmdW5jdGlvbiBfc2V0UGFnaW5nKG9iaikge1xyXG4gICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgc2VsZi5wYWdpbmcgPSBvYmo7XHJcbiAgICAgICAgc2VsZi5wYWdpbmdDbG9uZSA9IGFuZ3VsYXIuY29weShvYmopO1xyXG4gICAgICAgIF8uZXh0ZW5kKHNlbGYucGFyYW1zUmVxdWVzdCwgc2VsZi5wYWdpbmcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBfc2V0UGFyYW1zKG9iaikge1xyXG4gICAgICBpZiAob2JqKSB7XHJcbiAgICAgICAgc2VsZi5wYXJhbXMgPSBvYmo7XHJcbiAgICAgICAgc2VsZi5wYXJhbXNDbG9uZSA9IGFuZ3VsYXIuY29weShvYmopO1xyXG4gICAgICAgIF8uZXh0ZW5kKHNlbGYucGFyYW1zUmVxdWVzdCwgc2VsZi5wYXJhbXMpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIHJlc2V0IHBhcmFtc1xyXG4gICAgICogQHJldHVybiB7TnVtYmVyfSB2b2lkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIHJlc2V0U2VhcmNoKCkge1xyXG4gICAgICBzZWxmLnBhcmFtcyA9IGFuZ3VsYXIuY29weShzZWxmLnBhcmFtc0Nsb25lKTtcclxuICAgICAgLy8gc2VsZi5wYWdpbmcgPSBhbmd1bGFyLmNvcHkoc2VsZi5wYWdpbmdDbG9uZSk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICogaGFuZGVsIGNhbmNlbCBzZWFyY2hcclxuICAgICogQHJldHVybiB2b2lkXHJcbiAgICAqL1xyXG4gICAgZnVuY3Rpb24gY2FuY2VsU2VhcmNoKCkge1xyXG4gICAgICBzZWxmLnN0YXRlLnNob3dTZWFyY2ggPSBmYWxzZTtcclxuICAgICAgc2VsZi5yZXNldFNlYXJjaCgpO1xyXG4gICAgICBzZWxmLnBhZ2luZyA9IGFuZ3VsYXIuY29weShzZWxmLnBhZ2luZ0Nsb25lKTtcclxuICAgICAgc2V0U2VhcmNoUGFyYW1zKCk7XHJcbiAgICAgIHNlbGYub25TZWFyY2goKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgKiBoYW5kZWwgc29ydFxyXG4gICAgKiBAcmV0dXJuIHZvaWRcclxuICAgICovXHJcbiAgICBmdW5jdGlvbiBvblNvcnQoaXRlbSkge1xyXG4gICAgICBzZWxmLnBhZ2luZy5vcmRlcl9ieSA9IGl0ZW0ub3JkZXJCeTtcclxuICAgICAgc2VsZi5wYWdpbmcub3JkZXJfbWV0aG9kID0gaXRlbS5vcmRlck1ldGhvZDtcclxuICAgICAgLy8gc2VsZi5zdGF0ZS5jdXJyZW50UGFnZSA9IDA7XHJcbiAgICAgIC8vIHNlbGYucGFnaW5nLm9mZnNldCA9IDA7XHJcbiAgICAgIHNlbGYucGFyYW1zUmVxdWVzdCA9IF8uZXh0ZW5kKHNlbGYucGFyYW1zUmVxdWVzdCwgc2VsZi5wYWdpbmcpO1xyXG4gICAgICBzZWxmLmdldExpc3RpbmcoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGVsIGNoYW5nZSBwYWdlXHJcbiAgICAgKiBAcmV0dXJuIHZvaWRcclxuICAgICAqL1xyXG4gICAgZnVuY3Rpb24gb25DaGFuZ2VQYWdlKGl0ZW0pIHtcclxuICAgICAgc2VsZi5wYWdpbmcubGltaXQgPSBpdGVtLnBhZ2VMZW5ndGg7XHJcbiAgICAgIHNlbGYucGFnaW5nLm9mZnNldCA9IChpdGVtLmN1cnJlbnRQYWdlIC0gMSkgKiBpdGVtLnBhZ2VMZW5ndGg7XHJcbiAgICAgIHNlbGYucGFyYW1zUmVxdWVzdCA9IF8uZXh0ZW5kKHNlbGYucGFyYW1zUmVxdWVzdCwgc2VsZi5wYWdpbmcpO1xyXG4gICAgICBzZWxmLmdldExpc3RpbmcoKTtcclxuICAgIH1cclxuICAgIC8qKlxyXG4gICAgICogaGFuZGVsIHNlYXJjaFxyXG4gICAgICogQHJldHVybiB2b2lkXHJcbiAgICAgKi9cclxuICAgIGZ1bmN0aW9uIG9uU2VhcmNoKCkge1xyXG4gICAgICBzZWxmLnN0YXRlLmN1cnJlbnRQYWdlID0gMDtcclxuICAgICAgc2VsZi5wYWdpbmcub2Zmc2V0ID0gMDtcclxuICAgICAgc2VsZi5zdGF0ZS5zZWxlY3RlZFJvdyA9IGZhbHNlO1xyXG4gICAgICBzZXRTZWFyY2hQYXJhbXMoKTtcclxuICAgICAgc2VsZi5nZXRMaXN0aW5nKCk7XHJcbiAgICB9XHJcbiAgICAvKipcclxuICAgICAqIGdldCBwYXJhbXNcclxuICAgICAqIEByZXR1cm4gdm9pZFxyXG4gICAgICovXHJcbiAgICBmdW5jdGlvbiBzZXRTZWFyY2hQYXJhbXMoKSB7XHJcbiAgICAgIHZhciBwYXJhbXMgPSBfLmV4dGVuZChzZWxmLnBhcmFtcywgc2VsZi5wYWdpbmcpO1xyXG4gICAgICBzZWxmLnBhcmFtc1JlcXVlc3QgPSBhbmd1bGFyLmNvcHkocGFyYW1zKTtcclxuICAgICAgaWYgKCFfLmlzVW5kZWZpbmVkKHNlbGYuaUNvbnZlcnRQYXJhbXMpICYmIF8uaXNGdW5jdGlvbihzZWxmLmlDb252ZXJ0UGFyYW1zKSkge1xyXG4gICAgICAgIHNlbGYucGFyYW1zUmVxdWVzdCA9IHNlbGYuaUNvbnZlcnRQYXJhbXMoc2VsZi5wYXJhbXNSZXF1ZXN0KTtcclxuICAgICAgfVxyXG4gICAgICBzZWxmLnBhcmFtc1JlcXVlc3Q7XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBnZXRTZWFyY2hQYXJhbXMoKSB7XHJcbiAgICAgIHJldHVybiBzZWxmLnBhcmFtc1JlcXVlc3Q7XHJcbiAgICB9XHJcbiAgICAvLyBkZWZpbmUgb3V0IHByb3ZpZGVyXHJcbiAgICBmdW5jdGlvbiBjb3ZlcnREYXRhKCkge1xyXG4gICAgICBpZiAoIV8uaXNVbmRlZmluZWQoc2VsZi5pQ29udmVydERhdGEpICYmIF8uaXNGdW5jdGlvbihzZWxmLmlDb252ZXJ0RGF0YSkpIHtcclxuICAgICAgICBzZWxmLnN0YXRlLmRhdGFQYWdlID0gc2VsZi5pQ29udmVydERhdGEoc2VsZi5zdGF0ZSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgc2VsZi5zdGF0ZS5kYXRhUGFnZSA9IGFuZ3VsYXIuY29weShzZWxmLnN0YXRlLmxpc3QpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBmdW5jdGlvbiBzZXREYXRhKGRhdGEpIHtcclxuICAgICAgc2VsZi5zdGF0ZSA9IF8uZXh0ZW5kKHNlbGYuc3RhdGUsIGRhdGEpO1xyXG4gICAgICBzZWxmLmNvdmVydERhdGEoZGF0YSk7XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB7XHJcbiAgICBoaWRlbkNyZWRpdENhcmQ6IF9oaWRlbkNyZWRpdENhcmQsXHJcbiAgICBjb25maXJtUG9wdXA6IF9jb25maXJtUG9wdXAsXHJcbiAgICBoaWRlblRleHQ6IF9oaWRlblRleHQsXHJcbiAgICBkb3dubG9hZEZpbGU6IF9kb3dubG9hZEZpbGUsXHJcbiAgICBmdWxsbmFtZTogX2Z1bGxuYW1lLFxyXG4gICAgbG9zc0FjdGl2aXR5OiBsb3NzQWN0aXZpdHksXHJcbiAgICByZXNldFRpbWVPdXQ6IF9yZXNldFRpbWVPdXQsXHJcbiAgICBleGNlbEZpbGVFeHRlbnNpb246IF9leGNlbEZpbGVFeHRlbnNpb24sXHJcbiAgICBwZGZGaWxlRXh0ZW5zaW9uOiBfcGRmRmlsZUV4dGVuc2lvbixcclxuICAgIGdldExpc3RTdGF0dXNDbGFpbTogX2dldExpc3RTdGF0dXNDbGFpbSxcclxuICAgIGdldExpc3RTdGF0dXNCYXRjaERhdGVDbGFpbXM6IF9nZXRMaXN0U3RhdHVzQmF0Y2hEYXRlQ2xhaW1zLFxyXG4gICAgZ2V0TGltaXRGaWxlU2l6ZUluZm86IF9nZXRMaW1pdEZpbGVTaXplSW5mbyxcclxuICAgIGdldExpc3RTdGF0dXNDbGFpbUJ5TmFtZTogX2dldExpc3RTdGF0dXNDbGFpbUJ5TmFtZSxcclxuICAgIGdldExpc3RTdGF0dXNCYXRjaERhdGVCeU5hbWU6IF9nZXRMaXN0U3RhdHVzQmF0Y2hEYXRlQnlOYW1lLFxyXG4gICAgZ2V0VHlwZU9mQ2xhaW1MaXN0OiBfZ2V0VHlwZU9mQ2xhaW1MaXN0LFxyXG4gICAgZ2V0TGlzdFN0YXR1c0ZvclB1bGxkb3duOiBfZ2V0TGlzdFN0YXR1c0ZvclB1bGxkb3duLFxyXG4gICAgdWlibG9ja1N0YXJ0OiBfdWlibG9ja1N0YXJ0LFxyXG4gICAgcGFnaW5nSGVscGVyOiBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUGFnaW5nTW9kZWwoKTsgfVxyXG4gIH07XHJcbiAgZnVuY3Rpb24gX3VpYmxvY2tTdGFydCgpIHtcclxuICAgIGJsb2NrVUkuc3RhcnQoKTtcclxuICAgICR0aW1lb3V0LmNhbmNlbCh0aW1lcik7XHJcbiAgICB0aW1lciA9ICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgYmxvY2tVSS5zdG9wKCk7XHJcbiAgICB9LCA1MDAwKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldExpbWl0RmlsZVNpemVJbmZvKCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMaXN0U3RhdHVzQ2xhaW0oKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICB7IGlkOiAtMSwgbmFtZTogJycsIGNsYXNzQ3NzOiAnbGFiZWwtZGVmYXVsdCcgfSxcclxuICAgICAgeyBpZDogMSwgbmFtZTogJ1BlbmRpbmcnLCBjbGFzc0NzczogJ2xhYmVsLXdhcm5pbmcnIH0sXHJcbiAgICAgIHsgaWQ6IDIsIG5hbWU6ICdBc3NpZ25lZCcsIGNsYXNzQ3NzOiAnbGFiZWwtd2FybmluZycgfSxcclxuICAgICAgeyBpZDogMywgbmFtZTogJ0F1ZGl0ZWQnLCBjbGFzc0NzczogJ2xhYmVsLXdhcm5pbmcnIH0sXHJcbiAgICAgIHsgaWQ6IDQsIG5hbWU6ICdSZWplY3RlZCcsIGNsYXNzQ3NzOiAnbGFiZWwtZGFuZ2VyJyB9LFxyXG4gICAgICB7IGlkOiA1LCBuYW1lOiAnQXBwcm92ZWQnLCBjbGFzc0NzczogJ2xhYmVsLXByaW1hcnknIH0sXHJcbiAgICAgIHsgaWQ6IDYsIG5hbWU6ICdQYWlkJywgY2xhc3NDc3M6ICdsYWJlbC1zdWNjZXNzJyB9XHJcbiAgICBdO1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0TGlzdFN0YXR1c0JhdGNoRGF0ZUNsYWltcygpIHtcclxuICAgIHJldHVybiBbXHJcbiAgICAgIHsgaWQ6IC0xLCBuYW1lOiAnJywgY2xhc3NDc3M6ICdsYWJlbC1kZWZhdWx0JyB9LFxyXG4gICAgICB7IGlkOiAxLCBuYW1lOiAnUGVuZGluZycsIGNsYXNzQ3NzOiAnbGFiZWwtd2FybmluZycgfSxcclxuICAgICAgLy8geyBpZDogMiwgbmFtZTogJ0Fzc2lnbmVkJywgY2xhc3NDc3M6ICdsYWJlbC13YXJuaW5nJyB9LFxyXG4gICAgICAvLyB7IGlkOiAzLCBuYW1lOiAnQXVkaXRlZCcsIGNsYXNzQ3NzOiAnbGFiZWwtd2FybmluZycgfSxcclxuICAgICAgLy8geyBpZDogNCwgbmFtZTogJ1JlamVjdGVkJywgY2xhc3NDc3M6ICdsYWJlbC1kYW5nZXInIH0sXHJcbiAgICAgIC8vIHsgaWQ6IDUsIG5hbWU6ICdBcHByb3ZlZCcsIGNsYXNzQ3NzOiAnbGFiZWwtcHJpbWFyeScgfSxcclxuICAgICAgeyBpZDogMiwgbmFtZTogJ1Bvc3RlZCcsIGNsYXNzQ3NzOiAnbGFiZWwtc3VjY2VzcycgfVxyXG4gICAgXTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2dldExpc3RTdGF0dXNDbGFpbUJ5TmFtZSgpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIFBlbmRpbmc6IDEsXHJcbiAgICAgIEFzc2lnbmVkOiAyLFxyXG4gICAgICBBdWRpdGVkOiAzLFxyXG4gICAgICBSZWplY3RlZDogNCxcclxuICAgICAgQXBwcm92ZWQ6IDUsXHJcbiAgICAgIFBhaWQ6IDZcclxuICAgIH07XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9nZXRMaXN0U3RhdHVzQmF0Y2hEYXRlQnlOYW1lKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgUGVuZGluZzogMSxcclxuICAgICAgUG9zdGVkOiAyXHJcbiAgICB9O1xyXG4gIH1cclxuICBmdW5jdGlvbiBfZ2V0TGlzdFN0YXR1c0ZvclB1bGxkb3duKCkge1xyXG4gICAgdmFyIHN0dExpc3QgPSBfZ2V0TGlzdFN0YXR1c0NsYWltKCk7XHJcbiAgICBhbmd1bGFyLmZvckVhY2goc3R0TGlzdCwgZnVuY3Rpb24gKHZhbCwga2V5KSB7XHJcbiAgICAgIGlmICh2YWwuaWQgIT09IC0xKSB7XHJcbiAgICAgICAgc3R0TGlzdFtrZXldWydsYWJlbCddID0gdmFsLm5hbWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGVsZXRlIHN0dExpc3Rba2V5XTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gc3R0TGlzdDtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogZ2V0IHR5cGUgb2YgY2xhaW0gbGlzdFxyXG4gICAqXHJcbiAgICogQHJldHVybiBhcnJheVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIF9nZXRUeXBlT2ZDbGFpbUxpc3QoKSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICB7IGlkOiAtMSwgbmFtZTogJ0FsbCcgfSxcclxuICAgICAgeyBpZDogMCwgbmFtZTogJzE1MDAnIH0sXHJcbiAgICAgIHsgaWQ6IDEsIG5hbWU6ICdDSicgfVxyXG4gICAgXTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX3Jlc2V0VGltZU91dCgpIHtcclxuICAgIHRpbWVOb0FjdGlvbiA9IDA7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIF9mdWxsbmFtZShvbmUsIHR3bywgdGhyZWUsIHNldHRpbmdzKSB7XHJcbiAgICB2YXIgY3VzdG9tU2V0dGluZ3MgPSAkLmV4dGVuZCh7fSwgX2Z1bGxOYW1lRGVmYXVsdFNldHRpbmcsIHNldHRpbmdzKTtcclxuICAgIHZhciBhcnIgPSBbXTtcclxuICAgIGlmIChfLmlzVW5kZWZpbmVkKG9uZSkgfHwgb25lID09PSAnJykge1xyXG4gICAgICBhcnIucHVzaChjdXN0b21TZXR0aW5ncy5zdHJpbmdFbXB0eSB8fCAnJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBhcnIucHVzaChvbmUpO1xyXG4gICAgfVxyXG4gICAgaWYgKF8uaXNVbmRlZmluZWQodHdvKSB8fCB0d28gPT09ICcnKSB7XHJcbiAgICAgIGFyci5wdXNoKGN1c3RvbVNldHRpbmdzLnN0cmluZ0VtcHR5IHx8ICcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFyci5wdXNoKHR3byk7XHJcbiAgICB9XHJcbiAgICBpZiAoXy5pc1VuZGVmaW5lZCh0aHJlZSkgfHwgdGhyZWUgPT09ICcnKSB7XHJcbiAgICAgIGFyci5wdXNoKGN1c3RvbVNldHRpbmdzLnN0cmluZ0VtcHR5IHx8ICcnKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGFyci5wdXNoKHRocmVlKTtcclxuICAgIH1cclxuICAgIHJldHVybiBhcnIuam9pbignICcpLnRyaW0oKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2hpZGVuVGV4dCh2YWx1ZSkge1xyXG4gICAgaWYgKF8uaXNOdWxsKHZhbHVlKSB8fCBfLmlzVW5kZWZpbmVkKHZhbHVlKSkge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgICB2YWx1ZSA9IHZhbHVlICsgJyc7XHJcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvW1xcd1xcV10vZywgJyonKTtcclxuICB9XHJcbiAgZnVuY3Rpb24gX2hpZGVuQ3JlZGl0Q2FyZCh2YWx1ZSkge1xyXG4gICAgaWYgKF8uaXNVbmRlZmluZWQodmFsdWUpIHx8IHZhbHVlID09PSBcIlwiIHx8IF8uaXNOdWxsKHZhbHVlKSkge1xyXG4gICAgICByZXR1cm4gJyc7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyoqKionICsgdmFsdWUuc3Vic3RyKC00LCA0KTtcclxuICAgIC8vIHZhciBsZW4gPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAvLyB2YXIgcmVzdWx0ID0gJyc7XHJcbiAgICAvLyBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XHJcbiAgICAvLyAgIGlmIChpID4gbGVuIC0gNSkge1xyXG4gICAgLy8gICAgIHJlc3VsdCArPSB2YWx1ZVtpXTtcclxuICAgIC8vICAgfSBlbHNlIHtcclxuICAgIC8vICAgICByZXN1bHQgKz0gJ3gnO1xyXG4gICAgLy8gICB9XHJcbiAgICAvLyB9XHJcbiAgICAvLyByZXR1cm4gcmVzdWx0O1xyXG4gIH1cclxuICBmdW5jdGlvbiBfY29uZmlybVBvcHVwKGRhdGEpIHtcclxuICAgIHJldHVybiAkdWliTW9kYWwub3Blbih7XHJcbiAgICAgIGFuaW1hdGlvbjogdHJ1ZSxcclxuICAgICAgYXJpYUxhYmVsbGVkQnk6ICdtb2RhbC10aXRsZScsXHJcbiAgICAgIGFyaWFEZXNjcmliZWRCeTogJ21vZGFsLWJvZHknLFxyXG4gICAgICBzaXplOiAnc20nLFxyXG4gICAgICBiYWNrZHJvcDogZmFsc2UsXHJcbiAgICAgIGtleWJvYXJkOiBmYWxzZSxcclxuICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvbW9kdWxlcy9jb21tb24vdmlld3MvY29uZmlybS1wb3B1cC5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCBkYXRhKSB7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS50aXRsZSA9IGRhdGEudGl0bGU7XHJcbiAgICAgICAgdm0udGl0bGVCdG4gPSBkYXRhLnRpdGxlQnRuO1xyXG4gICAgICAgIHZtLmNsb3NlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2Nsb3NlZCcpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuZGlzbWlzcygnY2xvc2VkJyk7XHJcbiAgICAgICAgfTtcclxuICAgICAgfSxcclxuICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICByZXNvbHZlOiB7XHJcbiAgICAgICAgZGF0YTogZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbiAgLyoqXHJcbiAgICogZG93bmxvYWQgZmlsZSB1c2UgJC5maWxlRG93bmxvYWRcclxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXHJcbiAgICogQHBhcmFtIHtvYmplY3R9IHBvc3RcclxuICAgKiBAcmV0dXJuIHtwcm9taXNlfVxyXG4gICAqL1xyXG4gIGZ1bmN0aW9uIF9kb3dubG9hZEZpbGUodXJsLCBwb3N0KSB7XHJcbiAgICByZXR1cm4gJHEoZnVuY3Rpb24gKHJlc29sdmUsIHJlamVjdCkge1xyXG4gICAgICB2YXIgYWNjZXNUb2trZW4gPSBQZXJtaXNzaW9uU2VydmljZS5nZXRMb2dpblRva2VuKCk7XHJcbiAgICAgIGlmIChhY2Nlc1Rva2tlbikge1xyXG4gICAgICAgIHBvc3RbJ2FjY2Vzcy10b2tlbiddID0gYWNjZXNUb2trZW47XHJcbiAgICAgIH1cclxuICAgICAgJC5maWxlRG93bmxvYWQodXJsLCB7XHJcbiAgICAgICAgaHR0cE1ldGhvZDogXCJQT1NUXCIsXHJcbiAgICAgICAgZGF0YTogcG9zdFxyXG4gICAgICB9KS5kb25lKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgIHJlc29sdmUoJycpO1xyXG4gICAgICB9KS5mYWlsKGZ1bmN0aW9uIChyZXNwb25zZSwgbGluaykge1xyXG4gICAgICAgIHJlamVjdChyZXNwb25zZSk7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG4gIGZ1bmN0aW9uIGxvc3NBY3Rpdml0eSgpIHtcclxuICAgIHRpbWVOb0FjdGlvbiA9IDA7XHJcbiAgICAvLyBub3QgbG9nZ2luIHRoZW4gbm90IGNvdW50ZG93blxyXG4gICAgaWYgKF8uaXNVbmRlZmluZWQoUGVybWlzc2lvblNlcnZpY2UuZ2V0VXNlcigpKSB8fCBfLmlzRW1wdHkoUGVybWlzc2lvblNlcnZpY2UuZ2V0VXNlcigpKSkge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBpZiAoIV8uaXNOdWxsKGNvdW50ZG93bikpIHtcclxuICAgICAgJGludGVydmFsLmNhbmNlbChjb3VudGRvd24pO1xyXG4gICAgfVxyXG4gICAgY291bnRkb3duID0gJGludGVydmFsKGZ1bmN0aW9uICgpIHtcclxuICAgICAgdGltZU5vQWN0aW9uKys7XHJcbiAgICAgIGlmICh0aW1lTm9BY3Rpb24gPj0gSEFMRl9IT1VSKSB7XHJcbiAgICAgICAgJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICAgICAgYW5pbWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgYXJpYUxhYmVsbGVkQnk6ICdtb2RhbC10aXRsZScsXHJcbiAgICAgICAgICBhcmlhRGVzY3JpYmVkQnk6ICdtb2RhbC1ib2R5JyxcclxuICAgICAgICAgIHNpemU6ICdzbScsXHJcbiAgICAgICAgICBiYWNrZHJvcDogZmFsc2UsXHJcbiAgICAgICAgICBrZXlib2FyZDogZmFsc2UsXHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9tb2R1bGVzL2NvbW1vbi92aWV3cy9jb25maXJtLXBvcHVwLmh0bWwnLFxyXG4gICAgICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCAkaW50ZXJ2YWwpIHtcclxuICAgICAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICAgICAgdm0udGl0bGUgPSAnVGhlIHNlc3Npb24gd2lsbCBiZSBleHBpcmVkIGluIDYwIHNlY29uZHMuIFBsZWFzZSBjbGljayBDb250aW51ZSB0byByZW5ldyB0aGUgc2Vzc2lvbi4nO1xyXG4gICAgICAgICAgICB2bS50aXRsZUJ0biA9ICdDb250aW51ZSc7XHJcbiAgICAgICAgICAgIHZhciB0aW1lb3V0ID0gMDtcclxuICAgICAgICAgICAgdmFyIGNvdW50ZG93biA9ICRpbnRlcnZhbChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgdGltZW91dCsrO1xyXG4gICAgICAgICAgICAgIHZtLnRpdGxlID0gJ1RoZSBzZXNzaW9uIHdpbGwgYmUgZXhwaXJlZCBpbiAnICsgKDYwIC0gdGltZW91dCkgKyAnIHNlY29uZHMuIFBsZWFzZSBjbGljayBDb250aW51ZSB0byByZW5ldyB0aGUgc2Vzc2lvbi4nO1xyXG4gICAgICAgICAgICAgIGlmICh0aW1lb3V0ID49IDYwKSB7XHJcbiAgICAgICAgICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGNvdW50ZG93bik7XHJcbiAgICAgICAgICAgICAgICAkdWliTW9kYWxJbnN0YW5jZS5jbG9zZSgnY2xvc2VkJyk7XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCAxMDAwKTtcclxuICAgICAgICAgICAgdm0uY2xvc2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgJHVpYk1vZGFsSW5zdGFuY2UuY2xvc2UoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB2bS5zdWJtaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgJGludGVydmFsLmNhbmNlbChjb3VudGRvd24pO1xyXG4gICAgICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmRpc21pc3MoJ2Nsb3NlZCcpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgIH0pLnJlc3VsdC50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgLy8gc2NvcGUuY2FsbGJhY2soKTtcclxuICAgICAgICAgIFBlcm1pc3Npb25TZXJ2aWNlLmxvZ091dCgpO1xyXG4gICAgICAgICAgJHVpYk1vZGFsU3RhY2suZGlzbWlzc0FsbCgpO1xyXG4gICAgICAgICAgJHN0YXRlLmdvKCd1c2VyLmxvZ2luJyk7XHJcbiAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3VsdCkge1xyXG4gICAgICAgICAgbG9zc0FjdGl2aXR5KCk7XHJcbiAgICAgICAgICAvLyByZXNldCBjb3VudGRvd25cclxuICAgICAgICB9KTtcclxuICAgICAgICAkaW50ZXJ2YWwuY2FuY2VsKGNvdW50ZG93bik7XHJcbiAgICAgIH1cclxuICAgIH0sIDEwMDApO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZXhjZWwgZXh0ZW5zaW9uXHJcbiAgICogQHJldHVybiBzdHJpbmdcclxuICAgKi9cclxuICBmdW5jdGlvbiBfZXhjZWxGaWxlRXh0ZW5zaW9uKCkge1xyXG4gICAgcmV0dXJuICcueGxzeCwueGxzLC5jc3YnO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogcGRmIGV4dGVuc2lvblxyXG4gICAqIEByZXR1cm4gc3RyaW5nXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gX3BkZkZpbGVFeHRlbnNpb24oKSB7XHJcbiAgICByZXR1cm4gJy5wZGYnO1xyXG4gIH1cclxufVxyXG5tb2R1bGUuZXhwb3J0cyA9IFV0aWxzOyIsIid1c2Ugc3RyaWN0JztcclxuLy8gLCBQYXR0ZXJuU2VydmljZVxyXG5mdW5jdGlvbiBGcm9udEhlYWRlckNvbnRyb2xsZXIoJGxvZywgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICR1aWJNb2RhbCwgQ29udGFjdFNlcnZpY2UsIFBlcm1pc3Npb25TZXJ2aWNlKSB7XHJcbiAgLy8gSW5pdFxyXG4gIHZhciB2bSA9IHRoaXM7XHJcbiAgdm0uJHN0YXRlID0gJHN0YXRlO1xyXG4gIHZtLm9wZW5Db250YWN0VXMgPSBvcGVuQ29udGFjdFVzO1xyXG4gIHZtLnBhdHRlcm5FbWFpbCA9ICcnOyAvLyBQYXR0ZXJuU2VydmljZS5nZXRFbWFpbCgpO1xyXG4gIHZhciBib2R5ID0gYW5ndWxhci5lbGVtZW50KCdib2R5Jyk7XHJcbiAgYm9keS5hdHRyKCdjbGFzcycsICdibG9jay11aSBibG9jay11aS1hbmltLWZhZGUnKTtcclxuICBib2R5LmFkZENsYXNzKCdob21lcGFnZScpO1xyXG4gIHZtLiRvbkluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICB2YXIgY3VzZXIgPSBQZXJtaXNzaW9uU2VydmljZS5nZXRVc2VyKCk7XHJcbiAgICBpZiAoIV8uaXNFbXB0eShjdXNlcikpIHtcclxuICAgICAgJHN0YXRlLmdvKCdkYXNoYm9hcmQuaW5kZXgnKTtcclxuICAgIH1cclxuICB9O1xyXG4gIC8vIE9wZW4gY29udGFjdCBmb3JtXHJcbiAgZnVuY3Rpb24gb3BlbkNvbnRhY3RVcygpIHtcclxuICAgIHZhciBtb2RhbEluc3RhbmNlID0gJHVpYk1vZGFsLm9wZW4oe1xyXG4gICAgICBhbmltYXRpb246IHRydWUsXHJcbiAgICAgIGFyaWFMYWJlbGxlZEJ5OiAnbW9kYWwtdGl0bGUnLFxyXG4gICAgICBhcmlhRGVzY3JpYmVkQnk6ICdtb2RhbC1ib2R5JyxcclxuICAgICAgYmFja2Ryb3A6IGZhbHNlLFxyXG4gICAgICBrZXlib2FyZDogZmFsc2UsXHJcbiAgICAgIHNpemU6ICdtZCcsXHJcbiAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL21vZHVsZXMvZnJvbnQvdmlld3MvY29udGFjdC11cy5odG1sJyxcclxuICAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCR1aWJNb2RhbEluc3RhbmNlLCBwYXR0ZXJuRW1haWwpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLnBhdHRlcm5FbWFpbCA9IHBhdHRlcm5FbWFpbDtcclxuICAgICAgICB2bS5jbG9zZSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICR1aWJNb2RhbEluc3RhbmNlLmNsb3NlKCk7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5saXN0Q29udGFjdCA9IFtcclxuICAgICAgICAgIHsgaWQ6IDEsIG5hbWU6ICdHZW5lcmFsIElucXVpcmllcycgfSxcclxuICAgICAgICAgIHsgaWQ6IDIsIG5hbWU6ICdTdXBwb3J0JyB9XHJcbiAgICAgICAgXTtcclxuICAgICAgICB2bS5mb3JtQ29udGFjdCA9IHtcclxuICAgICAgICAgIENvbnRhY3Q6IHtcclxuICAgICAgICAgICAgdHlwZTogdm0ubGlzdENvbnRhY3RbMF0ubmFtZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcbiAgICAgICAgLy8gc3VibWl0IGZvcm0gY29udGFjdFxyXG4gICAgICAgIHZtLnN1Ym1pdCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHZtLnNlbmRGYWlsID0gZmFsc2U7XHJcbiAgICAgICAgICAkbG9nLmluZm8odm0uZm9ybUNvbnRhY3QpO1xyXG4gICAgICAgICAgQ29udGFjdFNlcnZpY2Uuc3VibWl0KHZtLmZvcm1Db250YWN0KS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICB2bS5zZW5kRmFpbCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLmZhaWxNZXNzYWdlID0gJyc7XHJcbiAgICAgICAgICAgIGlmIChfLmlzT2JqZWN0KHJlc3BvbnNlLm1lc3NhZ2UpKSB7XHJcbiAgICAgICAgICAgICAgXy5lYWNoKHJlc3BvbnNlLm1lc3NhZ2UsIGZ1bmN0aW9uIChudW0sIGtleSkge1xyXG4gICAgICAgICAgICAgICAgdm0uZmFpbE1lc3NhZ2UgPSBudW1bMF07XHJcbiAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgdm0uZmFpbE1lc3NhZ2UgPSByZXNwb25zZS5tZXNzYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgICB9LFxyXG4gICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgIHJlc29sdmU6IHtcclxuICAgICAgICBwYXR0ZXJuRW1haWw6IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgIHJldHVybiB2bS5wYXR0ZXJuRW1haWw7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIG1vZGFsSW5zdGFuY2UucmVzdWx0LnRoZW4oZnVuY3Rpb24gKCkgeyB9LCBmdW5jdGlvbiAoKSB7IH0pO1xyXG4gIH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBGcm9udEhlYWRlckNvbnRyb2xsZXI7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuLy8gVGhhY2hsaDEyMVxyXG5hbmd1bGFyLm1vZHVsZShcImFwcC5mcm9udFwiLCBbXSlcclxuICAuY29udHJvbGxlcignRnJvbnRDb250cm9sbGVyJywgcmVxdWlyZShcIi4vZnJvbnQuY29udHJvbGxlci5qc1wiKSlcclxuICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Zyb250Jywge1xyXG4gICAgICAvLyB1cmw6ICcvJyxcclxuICAgICAgYWJzdHJhY3Q6IHRydWUsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ21haW4nOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJzdGF0aWMvbW9kdWxlcy9mcm9udC92aWV3cy9mcm9udC5odG1sXCIsXHJcbiAgICAgICAgICBjb250cm9sbGVyOiAnRnJvbnRDb250cm9sbGVyJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbm90Rm91bmQnLCB7XHJcbiAgICAgIHVybDogJy9ub3QtZm91bmQnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdtYWluJzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6IFwic3RhdGljL21vZHVsZXMvZnJvbnQvdmlld3Mvbm90LWZvdW5kLmh0bWxcIlxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnbm90QXV0aG9yaXplZEhvbWUnLCB7XHJcbiAgICAgIHVybDogJy9ub3QtYXV0aG9yaXplZC1yZXF1ZXN0JyxcclxuICAgICAgcGFyZW50OiAnZnJvbnQnLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250ZW50Jzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6IFwic3RhdGljL21vZHVsZXMvZnJvbnQvdmlld3Mvbm90LWF1dGhvci5odG1sXCJcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBDb250YWN0U2VydmljZSgkcmVzb3VyY2UsICRodHRwUGFyYW1TZXJpYWxpemVySlFMaWtlLCAkcm9vdFNjb3BlKSB7XHJcbiAgdmFyIENvbnRhY3RSZXNvdXJjZSA9ICRyZXNvdXJjZSgkcm9vdFNjb3BlLmRvbWFpbiArICcvdXNlci86YWN0aW9uJywge30sXHJcbiAgICB7XHJcbiAgICAgIGNvbnRhY3Q6IHtcclxuICAgICAgICBtZXRob2Q6ICdQT1NUJyxcclxuICAgICAgICBpc0FycmF5OiBmYWxzZSxcclxuICAgICAgICBwYXJhbXM6IHtcclxuICAgICAgICAgIGFjdGlvbjogJ2NvbnRhY3QnXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgKTtcclxuICByZXR1cm4ge1xyXG4gICAgc3VibWl0OiBfc3VibWl0XHJcbiAgfTtcclxuICBmdW5jdGlvbiBfc3VibWl0KHBvc3QpIHtcclxuICAgIHJldHVybiBDb250YWN0UmVzb3VyY2UuY29udGFjdCgkaHR0cFBhcmFtU2VyaWFsaXplckpRTGlrZShwb3N0KSlcclxuICAgICAgLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgcmV0dXJuIGFuZ3VsYXIuZnJvbUpzb24oYW5ndWxhci50b0pzb24ocmVzcG9uc2UpKTtcclxuICAgICAgfSk7XHJcbiAgfVxyXG59XHJcbm1vZHVsZS5leHBvcnRzID0gQ29udGFjdFNlcnZpY2U7IiwiJ3VzZSBzdHJpY3QnO1xyXG5cclxuZnVuY3Rpb24gSG9tZUNvbnRyb2xsZXIoJGxvZywgJHN0YXRlLCAkc3RhdGVQYXJhbXMsICR1aWJNb2RhbCxcclxuICBDb21tb25BcGlTZXJ2aWNlLCAkcSwgVXRpbHMpIHtcclxuICB2YXIgdm0gPSB0aGlzO1xyXG4gIHZtLiRvbkluaXQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAvLyBzXHJcbiAgICAkbG9nLmluZm8oJ0hvbWVDb250cm9sbGVyJyk7XHJcbiAgfTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBIb21lQ29udHJvbGxlcjsiLCIndXNlIHN0cmljdCc7XHJcblxyXG5mdW5jdGlvbiBIb21lRmFxQ29udHJvbGxlcigkbG9nLCBGYXFzU2VydmljZSkge1xyXG4gIHZhciB2bSA9IHRoaXM7XHJcbiAgdm0udG9nZ2xlRWxlbWVudCA9IHRvZ2dsZUVsZW1lbnQ7XHJcbiAgdm0uc2hvd0xpc3QgPSBmYWxzZTtcclxuXHJcbiAgLyoqIEluaXRcclxuICAgKlxyXG4gICAqIEBhdXRob3I6IEh1bmdWVFxyXG4gICAqL1xyXG4gIHZtLiRvbkluaXQgPSBmdW5jdGlvbigpIHtcclxuICAgIGdldExpc3QoKTtcclxuICB9O1xyXG5cclxuICAvKiogR2V0IGxpc3Qgb2JqZWN0IGZyb20gc2VydmVyIGFuZCBhcHBlbmQgdG8gaHRtbFxyXG4gICAqXHJcbiAgICogQGF1dGhvcjogSHVuZ1ZUXHJcbiAgICovXHJcbiAgZnVuY3Rpb24gZ2V0TGlzdCgpIHtcclxuICAgIEZhcXNTZXJ2aWNlLmxpc3QoKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICBpZiAoIXJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgdm0ubW9kZWxzID0gXy5ncm91cEJ5KHJlc3BvbnNlLmRhdGEsIGZ1bmN0aW9uKHYpIHtcclxuICAgICAgICAgIHJldHVybiB2Lmdyb3VwX25hbWU7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKCFhbmd1bGFyLmVxdWFscyh7fSwgdm0ubW9kZWxzKSkge1xyXG4gICAgICAgICAgdm0uc2hvd0xpc3QgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBUT0RPOiBTaG93IGVycm9yXHJcbiAgICAgIH1cclxuICAgIH0pLmNhdGNoKGZ1bmN0aW9uICgpIHt9KTtcclxuICB9XHJcblxyXG4gIC8vIEFkZCBvciByZW1vdmUgY2xhc3Mgc2hvd1xyXG4gIGZ1bmN0aW9uIHRvZ2dsZUVsZW1lbnQoKSB7XHJcbiAgICAvLyBDaGVjayBpcyBjbGljayB0YWcgSSBvciBINFxyXG4gICAgdmFyIGVsZW1lbnQgPSBldmVudC50YXJnZXQubG9jYWxOYW1lID09PSAnaScgPyBhbmd1bGFyLmVsZW1lbnQoZXZlbnQudGFyZ2V0KS5wYXJlbnQoKSA6IGFuZ3VsYXIuZWxlbWVudChldmVudC50YXJnZXQpO1xyXG4gICAgZWxlbWVudC5maW5kKCdpJykudG9nZ2xlQ2xhc3MoJ2ZhLWNhcmV0LXJpZ2h0JykudG9nZ2xlQ2xhc3MoJ2ZhLWNhcmV0LWRvd24nKTtcclxuICAgIGVsZW1lbnQubmV4dCgpLnNsaWRlVG9nZ2xlKCdzbG93Jyk7XHJcbiAgfVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEhvbWVGYXFDb250cm9sbGVyOyIsIid1c2Ugc3RyaWN0JztcclxuXHJcbi8vIFRoYWNobGgxMjFcclxuYW5ndWxhci5tb2R1bGUoXCJhcHAuaG9tZVwiLCBbXSlcclxuICAuY29udHJvbGxlcignSG9tZUNvbnRyb2xsZXInLCByZXF1aXJlKFwiLi9ob21lLmNvbnRyb2xsZXIuanNcIikpXHJcbiAgLmNvbnRyb2xsZXIoJ0hvbWVGYXFDb250cm9sbGVyJywgcmVxdWlyZShcIi4vaG9tZUZhcUNvbnRyb2xsZXIuanNcIikpXHJcbiAgLmZhY3RvcnkoJ0NvbnRhY3RTZXJ2aWNlJywgcmVxdWlyZShcIi4vQ29udGFjdFNlcnZpY2Uuc2VydmljZS5qc1wiKSlcclxuICAuY29uZmlnKGZ1bmN0aW9uICgkc3RhdGVQcm92aWRlcikge1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Zyb250LmhvbWUnLCB7XHJcbiAgICAgIHVybDogJy8nLFxyXG4gICAgICB2aWV3czoge1xyXG4gICAgICAgICdjb250ZW50QGZyb250Jzoge1xyXG4gICAgICAgICAgdGVtcGxhdGVVcmw6ICdzdGF0aWMvbW9kdWxlcy9ob21lL3ZpZXdzL2hvbWUuaHRtbCcsXHJcbiAgICAgICAgICBjb250cm9sbGVyOiAnSG9tZUNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgY29udHJvbGxlckFzOiAndm0nXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdmcm9udC5ob21lUmVzdWJtaXQnLCB7XHJcbiAgICAgIHVybDogJy9yZXN1Ym1pdC1yZXF1ZXN0P3BvcElkJyxcclxuICAgICAgcGFyYW1zOiB7XHJcbiAgICAgICAgcG9wSWQ6ICcnXHJcbiAgICAgIH0sXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRlbnRAZnJvbnQnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9tb2R1bGVzL2hvbWUvdmlld3MvaG9tZS5odG1sJyxcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lQ29udHJvbGxlcicsXHJcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Zyb250LnNlcnZpY2UnLCB7XHJcbiAgICAgIHVybDogJy9zZXJ2aWNlJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGVudEBmcm9udCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiAnc3RhdGljL21vZHVsZXMvaG9tZS92aWV3cy9ibGFuay5odG1sJ1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnZnJvbnQuYWJvdXQnLCB7XHJcbiAgICAgIHVybDogJy9hYm91dCcsXHJcbiAgICAgIHZpZXdzOiB7XHJcbiAgICAgICAgJ2NvbnRlbnRAZnJvbnQnOiB7XHJcbiAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3N0YXRpYy9tb2R1bGVzL2hvbWUvdmlld3MvYWJvdXQtdXMuaHRtbCdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2Zyb250LmZhcXMnLCB7XHJcbiAgICAgIHVybDogJy9mYXFzJyxcclxuICAgICAgdmlld3M6IHtcclxuICAgICAgICAnY29udGVudEBmcm9udCc6IHtcclxuICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInN0YXRpYy9tb2R1bGVzL2hvbWUvdmlld3MvZnJvbnQtZmFxLmh0bWxcIixcclxuICAgICAgICAgIGNvbnRyb2xsZXI6ICdIb21lRmFxQ29udHJvbGxlcicsXHJcbiAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bSdcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0pO1xyXG4iXX0=
