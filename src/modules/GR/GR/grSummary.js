(function () {
    'use strict'

    app.component('grSummary', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/GR/grSummary.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 0,
                perPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            $window.localStorage['userGuidPlanReceive'] = getGuid();

            function getGuid() {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000);
                }
                return s4() + '' + s4() + '' + s4() + '' + s4() + '' +
                    s4();
            }
        }
    })
})();