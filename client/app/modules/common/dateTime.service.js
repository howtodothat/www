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