(function () {
    'use strict'

    app.component('autoPosReconfirm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/AutoPOSReconfirm/AutoPOSReconfirm.html",
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
                type: 1,
                chkinitpage:false,
                maxSize:10,
                num:1,
            };
        }
    })
})();