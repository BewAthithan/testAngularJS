(function () {
    'use strict';
    app.component('zonePutAwayLocationFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZonePutAwayLocation/component/zonePutAwayLocationFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, zonePutAwayLocationFactory, warehouseFactory, localStorageService, ownerFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = zonePutAwayLocationFactory;
            var viewModelWh = warehouseFactory;
            var viewModelOwner = ownerFactory;



            $scope.triggerSearch = function () {

                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                // $vm.filterModel.WarehouseIndex = $vm.filterModel.warehouseIndex;
                console.log($vm.filterModel)
                search($vm.filterModel);
            };


            // $scope.model = {
            //     zonePutAwayLocationId: "",
            //     zonePutAwayName: "",
            //     zonePutAwayId: "",
            //     WarehouseIndex: ""

            // };


            $scope.searchFilter = function (item) {
                var deferred = $q.defer();
                console.log(item);
                if (item == undefined) {
                    item = $scope.model;

                };
                if (item.zonePutAwayLocationId == "" || item.zonePutAwayName == "" || item.WarehouseIndex == "") {
                    item = $scope.model;

                }
                item.totalRow = $vm.filterModel.totalRow;
                item.currentPage = $vm.filterModel.currentPage;
                item.perPage = $vm.filterModel.perPage;
                item.numPerPage = $vm.filterModel.numPerPage;
                item.maxSize = $vm.filterModel.maxSize;
                //$vm.filterModel = item;

                console.log($scope.model);
                var items = {
                    zonePutAwayLocationId: item.zonePutAwayLocationId,
                    zonePutAwayId: "",
                    zonePutAwayName: item.zonePutAwayName,
                    WarehouseIndex: $vm.filterModel.WarehouseIndex,
                    ownerIndex: $vm.filterModel.ownerIndex,
                    pagination: {
                        currentPage: $vm.filterModel.currentPage,
                        perPage: $vm.filterModel.perPage,
                        totalRow: $vm.filterModel.perPage,
                        key: "",
                        advanceSearch: true
                    }
                }

                search(items)
                
                // viewModel.search(items).then(
                //     function success(res) {
                //         pageLoading.hide();
                //         $vm.filterModel.totalRow = res.data.paginationInfo.totalIem;
                //         $vm.filterModel.currentPage = res.data.paginationInfo.currentPage;
                //         $vm.filterModel.perPage =  $vm.filterModel.pagination.perPage
                //         $vm.filterModel.numPage =  res.data.paginationInfo.totalPage;
                //         $vm.searchResultModel = res.data.result;

                //         console.log($vm.filterModel)
                //          console.log(res)
                //     },
                //     function error(response) {
                //         deferred.reject(response);
                //     });
                //return deferred.promise;
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

            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.onShow;
                    $scope.popupWarehouse.delegates.warehousePopup(param, index);
                    
                },
                config: {
                    title: "Warehouse"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $vm.filterModel.warehouseIndex = angular.copy(param.warehouseIndex);
                        $vm.filterModel.warehouseId = angular.copy(param.warehouseId);
                        $vm.filterModel.warehouseName = angular.copy(param.warehouseId) + " - " + angular.copy(param.warehouseName);
                      
                        search($vm.filterModel)
                    }
                }
            };

    

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $vm.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $vm.filterModel.ownerId = angular.copy(param.ownerId);
                        $vm.filterModel.ownerName = angular.copy(param.ownerName);

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));

                        search($vm.filterModel)
                    }
                }
            };


            function search(data) {
                viewModel.search(data).then(function (res) {

                    pageLoading.hide();

                    $vm.filterModel.totalRow = res.data.paginationInfo.totalItem;
                    $vm.filterModel.currentPage = res.data.paginationInfo.currentPage;
                    // $vm.filterModel.pagination.num =  res.data.paginationInfo.totalPage;
                    $vm.filterModel.num = res.data.paginationInfo.totalPage;
                    $vm.filterModel.perPage = $vm.filterModel.pagination.perPage;
                    $vm.searchResultModel = res.data.result;



                });
            }

            function warehouseSearch(model) {
                viewModelWh.popupSearch(model).then(function (res) {
                    pageLoading.hide();

                    //$vm.filterModel.warehouseIndex = res.data[0].warehouseIndex;
                    $vm.filterModel.warehouseName = res.data[0].warehouseName;
                    $vm.filterModel.warehouseId = res.data[0].warehouseId;
                    $vm.filterModel.WarehouseIndex = res.data[0].warehouseIndex;


                    $scope.triggerSearch();
                });

            }

            function ownerSearch(model) {
                viewModelOwner.popupSearch(model).then(function (res) {
                    pageLoading.hide();

                    $vm.filterModel.ownerName = res.data[1].ownerName;
                    $vm.filterModel.ownerId = res.data[1].ownerId;
                    $vm.filterModel.ownerIndex = res.data[1].ownerIndex;


                    $scope.triggerSearch();
                });

            }



            function initialize() {
            };

            this.$onInit = function () {

                initialize();
                var body = {
                    userID: localStorageService.get('userTokenStorage')
                }
                 warehouseSearch(body);
                 ownerSearch(body);

            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();