(function() {
    'use strict'

    app.component('cartonSummary', {
        controllerAs: '$vm',
        bindings: {},
        templateUrl: function($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/Carton/CartonSummary.html";
        },
        controller: function($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            pageLoading.hide();
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 1,
                perPage: "All",
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1,
                chkinitpage: false,
                maxSize: 10,
                num: 1,
            };

            $scope.$watch("callSearch", function() {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();