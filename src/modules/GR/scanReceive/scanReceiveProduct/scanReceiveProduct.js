(function () {
    'use strict';
    app.component('scanReceiveProduct', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GR/scanReceive/scanReceiveProduct/scanReceiveProduct.html";
        },
        bindings: {
            scanReceive: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanReceiveFactory) {
            var $vm = this;
            var defer = {};
            var viewModel = scanReceiveFactory;


            this.$onInit = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filter();
            }

            this.$onDestroy = function () {
            }
            $vm.filterModel = {
                currentPage: 0,
                perPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1,
                chkinitpage: false,
                maxSize: 5,
                num: 1,
            };

            $scope.search = function (model) {

                var id = model.GoodsReceiveNo;
                var deferred = $q.defer();
                pageLoading.show();
                
                viewModel.filterSacn(model).then(
                    function success(res) {

                        deferred.resolve(res);
                        pageLoading.hide(1000);
                    },
                    function error(response) {
                        deferred.reject(response);
                        pageLoading.hide(1000);
                    });
                return deferred.promise;
            }

            $scope.filter = function () {

                $scope.scan = $scope.scan || {};
                //$vm.scanReceive = $vm.scanReceive || {};
                pageLoading.show();
                var id = $vm.scanReceive.GoodsReceiveNo;
                
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.GoodsReceiveNo = $vm.scanReceive.GoodsReceiveNo;
                // $scope.filterModel.GoodsReceiveNo = $vm.scanReceive.GoodsReceiveNo;
                // $scope.filterModel.perPage = $scope.filterModel.perPage != null ? $scope.filterModel.perPage : $vm.searchResultModel.perPage;

                viewModel.filterSacn($vm.filterModel).then(function success(res) {

                    pageLoading.hide();
                    
                    // $scope.atcom = res.data.atcom;
                    // $scope.datalist.config.paginations = res.data.pagination;
                    
                    $vm.searchResultModel = res.data.items;
                    $vm.searchResultModel.totalRow = res.data.pagination.totalRow;
                    $vm.searchResultModel.currentPage = res.data.pagination.currentPage;
                    $vm.searchResultModel.perPage = res.data.pagination.perPage;
                    $vm.searchResultModel.numPerPage = res.data.pagination.perPage;
                    $vm.searchResultModel.maxSize = $vm.filterModel.maxSize;

                    if ($vm.searchResultModel.length == 0) {
                        if ($vm.scanReceive.GoodsReceiveNo == "") {
                            $vm.scanReceive.GoodsReceiveNo = undefined;
                            $vm.scanReceive.ProductId == "";
                            $vm.scanReceive.productBarcode = "";
                            $vm.scanReceive.product_Index = null;
                            $vm.scanReceive.productName = null;
                            $vm.scanReceive.productConversionName = null;
                            $vm.scanReceive.productqty = null;
                            $vm.scanReceive.ItemStatusName = "";
                            $vm.scanReceive.productConversionName = "";
                            $vm.scanReceive.product_Index = undefined;
                        }
                    }

                    // $scope.datalist.items = res.data;
                }, function error(res) { });
            }
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }
            $scope.pageOption = [
                { value: 30 },
                { value: 50 },
                { value: 100 },
                { value: 500 }
            ];
            $scope.changeTableSize = function () {
                var p = {
                    currentPage: 0, //$scope.pagging.num,
                    perPage: $scope.filterModel.perPage
                };
                
                $vm.searchResultModel.perPage = $scope.filterModel.perPage
                var page = $vm.filterModel;
                serchPage(page);
            };


            $scope.changePage = function () {
                var page = $vm.filterModel;

                var all = {
                    currentPage: 0,
                    perPage: 0
                };
                
                if ($vm.filterModel.currentPage != 0) {
                    page.currentPage = $vm.filterModel.currentPage;
                }
                serchPage(page);
            }

            function serchPage(data) {
                if (data != null) {
                    
                    pageLoading.show();
                    viewModel.filterSacn(data).then(function (res) {
                        
                        pageLoading.hide();
                        if (res.data.items.length != 0 && res.data.items.length != undefined) {
                            $vm.searchResultModel = res.data.items;
                            $vm.searchResultModel.totalRow = res.data.pagination.totalRow;
                            $vm.searchResultModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel.perPage = res.data.pagination.perPage;
                            $vm.searchResultModel.numPerPage = res.data.pagination.perPage;
                            $vm.searchResultModel.maxSize = $vm.filterModel.maxSize;

                            if ($vm.searchResultModel.length == 0) {
                                if ($vm.scanReceive.GoodsReceiveNo == "") {
                                    $vm.scanReceive.GoodsReceiveNo = undefined;
                                    $vm.scanReceive.ProductId == "";
                                    $vm.scanReceive.productBarcode = "";
                                    $vm.scanReceive.product_Index = null;
                                    $vm.scanReceive.productName = null;
                                    $vm.scanReceive.productConversionName = null;
                                    $vm.scanReceive.productqty = null;
                                    $vm.scanReceive.ItemStatusName = "";
                                    $vm.scanReceive.productConversionName = "";
                                    $vm.scanReceive.product_Index = undefined;
                                }
                            }

                        }
                        else {
                            if (res.data.pagination != null) {
                                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                                $vm.searchResultModel = res.data.items;

                            }
                        }
                    })
                }
            }

            $scope.delete = function (param) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'InformaTion',
                    message: 'Do you want to Delete ?'
                }).then(function success() {
                    param.cancelBy = localStorageService.get('userTokenStorage');
                    viewModel.getDeleteScan(param).then(function success(res) {
                        $scope.filter();
                    }, function error(res) { });
                });
            };

        }
    });
})();