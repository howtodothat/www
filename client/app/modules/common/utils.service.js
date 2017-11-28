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