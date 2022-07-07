(function () {
    'use strict'
    app.component('transferLpnList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TransferPallet/component/transferLpnList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $filter, $q, $compile, $state, pageLoading, commonService, localStorageService, $timeout, $translate, dpMessageBox, tranferPalletFactory) {
            var $vm = this;
            var defer = {};
            let viewModelTransferPallet = tranferPalletFactory
            // setting column       
            $scope.isLoading = false;

            $vm.isLoading = function (datalist, items, newItems , sumQty) {
                defer = $q.defer();
                $vm.searchResultModel = datalist;
                $scope.filterModel = items;
                $vm.filterModel = newItems;
                $scope.SumModel = sumQty;
                $scope.isLoading = true;    

                return defer.promise;
            };

            

            $scope.selectTask = function () {
                defer.resolve('Selected');
            }

            $scope.back = function () {
                if ($scope.checkAll === true) {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                }

                defer.resolve();
            }

            $scope.detectCheckAll = function () {
                if ($scope.checkAll === true) {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = true;
                    });
                } else {
                    angular.forEach($vm.searchResultModel, function (v, k) {
                        $vm.searchResultModel[k].selected = false;
                    });
                }
            }

            var init = function () {
            };
            init();

        }
    })
})();