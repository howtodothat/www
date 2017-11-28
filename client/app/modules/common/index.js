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
