(function () {
    'use strict'

    app.component('loadToTruckList', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/LoadToTruckList/loadToTruckList.html",
        bindings: {
            loadToTruckCartonList: '=?',
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox,loadTruckListFactory,loadTruckItemFactory) {
            var $vm = this;
            var viewModel = loadTruckListFactory;
            var loadTruckviewModel = loadTruckItemFactory;
            var defer = {};
            defer = $.Deferred();
            $scope.loadToTruckCartonList = false;
            this.$onInit = function () {
                $scope.filter();
            }

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                viewModel.filter($vm.filterModel).then(function (res) {
                    $vm.filterModel = res.data.atcom;
                    $vm.searchResultModel = res.data;
                });;
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            var _GR = {};
            var _index = -98;

            $vm.loadToTruckCartonList = function (param) {

                $scope.filterModel = param;
                var truckLoadNo = $scope.filterModel.truckLoadNo;
                defer = $q.defer();
                $scope.loadToTruckCartonList = true;
                if (param != undefined) {
                    if(truckLoadNo != undefined)
                    {
                        var model = $scope.filterModel;
                        loadTruckviewModel.getTruckLoadCartonbyId(truckLoadNo).then(function (res) {
                            $vm.filterModel = res.data;
                            $vm.searchResultModel = res.data;
                        });
                    }

                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }

                return defer.promise;
            };
            $scope.back = function () {
                $scope.filterModel = {};
                $vm.searchResultModel = {};     
                $scope.loadToTruckCartonList = false;
                defer.resolve('-1');     
            }
            $scope.buttons = {
                back: true
            };
        }
    })
})();