(function () {
    'use strict'

    app.component('scanPickingToolsSummary', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/ScanPickingTools/scanPickingToolsSummary.html",
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox) {
            var $vm = this;

            $scope.isFilter = true;

            $scope.filterModel = {};
        }
    })
})();