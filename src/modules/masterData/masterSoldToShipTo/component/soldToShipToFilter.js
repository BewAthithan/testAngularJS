(function () {
    'use strict';
    app.component('soldToShipToFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterSoldToShipTo/component/soldToShipToFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, soldToShipToFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = soldToShipToFactory;

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {
                    pageLoading.hide();                    
                    if (res.data.length != 0) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }

                        $vm.searchResultModel = res.data;

                    }
                    else {
                        $vm.searchResultModel = res.data;
                    }
                });
            };

            $scope.model = {
                soldToShipToId: "",
                shipToName: "",
                soldToName: "",
            };
            $scope._models = {
                currentPage: $scope.currentPage + 1,
                numPerPage: $scope.numPerPage,
                totalRow: 0
            };
            $scope.searchFilter = function (item) {
                var deferred = $q.defer();
                if (item == undefined) {
                    item = $scope.model;
                };
                if (item.soldToShipToId == "" || item.soldToName == "" || item.shipToName == "") {
                    item = $scope.model;
                }
                viewModel.search(item).then(
                    function success(res) {
                        pageLoading.hide();                    
                        $vm.filterModel = res.data;
                        $vm.searchResultModel = res.data;
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };


            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }
            //initialize();
            // this.$onInit = function () {
            //     initialize();
            // };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();