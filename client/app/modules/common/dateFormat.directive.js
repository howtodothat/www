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