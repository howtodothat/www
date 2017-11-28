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