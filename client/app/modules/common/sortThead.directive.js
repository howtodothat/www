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

