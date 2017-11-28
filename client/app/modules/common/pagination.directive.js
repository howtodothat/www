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