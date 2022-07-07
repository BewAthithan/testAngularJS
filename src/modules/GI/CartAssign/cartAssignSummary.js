(function () {
    'use strict'

    app.component('cartAssignSummary', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CartAssign/cartAssignSummary.html",
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