(function () {
    'use strict'

    app.component('importStoreToStoreSummary', {
        controllerAs: '$vm',
        bindings: {
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/ImportStoreToStore/ImportStoreToStoreSummary.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 0,
                PerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                chkinitpage:false,
                maxSize:10,
                num:10,
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
        }
    })
})();