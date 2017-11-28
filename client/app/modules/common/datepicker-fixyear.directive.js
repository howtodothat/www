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
