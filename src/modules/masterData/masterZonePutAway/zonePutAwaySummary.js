(function () {
    'use strict'

    app.component('masterZonePutAway', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZonePutAway/zonePutAwaySummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            
            $scope.filterModel = {
                    zonePutAwayId: "",
                    zonePutAwayName: "",
                    pagination: {
                    currentPage: 1,
                    perPage: 30,
                    totalRow: 30,
                    key: "",
                    advanceSearch: true
                    }
                
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();