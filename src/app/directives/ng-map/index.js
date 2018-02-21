const mapDirective = function () {
    return {
      restrict: 'AE',
      controller: '__MapController',
      controllerAs: 'ngmap'
    };
};

mapDirective.$inject = [];

module.exports = mapDirective;