(function () {
    'use strict'

    app.component('cartAssignSummaryV2', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CartAssignV2/cartAssignSummaryV2.html",
        controller: function ($scope, $filter, $http, $state, pageLoading, $window, commonService, localStorageService, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {
                currentPage: 0,
                numPerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };
        }
    })
})();