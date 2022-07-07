(function () {
    'use strict'

    app.component('masterZonePutAwayLocation', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZonePutAwayLocation/zonePutAwayLocationSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;
            $scope.filterModel = {};
            $scope.isFilter = true;

            

            $scope.filterModel = {
                zonePutAwayLocationId: "",
                zonePutAwayId: "",
                zonePutAwayName: "",
                pagination: {
                    currentPage: 1,
                    perPage: 30,
                    totalRow: 0,
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