(function () {
    'use strict';
    app.component('productconversionbarcodeFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterproductConversionBarcode/component/productconversionbarcodeFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, commonService, productConversionBarcodeFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object        
            var viewModel = productConversionBarcodeFactory;

            // $vm.triggerSearch = function () {
            //     $vm.filterModel =  $vm.filterModel || {};                
            //     pageLoading.show();  
            //     viewModel.filter($vm.filterModel).then(function (res) {
            //         pageLoading.hide();
            //         $vm.filterModel = res.data.atcom;
            //         $vm.searchResultModel = res.data;
            //     });
            // };
            $vm.triggerSearch = function () {
                $vm.filterModel = $scope.model || {};
                pageLoading.show();
                viewModel.filter($vm.filterModel).then(function (res) {

                    pageLoading.hide();
                    if (res.data.itemsProductConversionBarcode.length != 0) {
                        $scope.filterModel = $vm.filterModel;
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        if ($scope.filterModel.perPage == undefined) {
                            $scope.filterModel.perPage = $vm.filterModel.numPerPage
                        }

                        //$vm.filterModel.totalRow = res.data.pagination.totalRow;

                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }

                        $vm.searchResultModel = res.data.itemsProductConversionBarcode;
                    }
                    else {

                        $vm.searchResultModel = res.data.itemsProductConversionBarcode;
                    }
                });
            };
            $scope.model = {               
                currentPage: 1,
                numPerPage: 30,
                PerPage: 30,
                totalRow: 0,
                maxSize: 5
            };
            
            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                var item = $scope.actionPS;
                var Data = param;
                switch (item) {
                    case "1": {                       
                        Data.productConversionBarcodeId;
                        Data.productConversionBarcode = ""
                        Data.productName = ""
                        Data.ownerName = ""
                        Data.productConversionName = ""
                    }
                    break;
                    case "2": {
                        Data.productConversionBarcode;
                        Data.productConversionBarcodeId= ""
                        Data.productName = ""
                        Data.ownerName = ""
                        Data.productConversionName = ""
                    }
                    break;
                    case "3": {
                        Data.productName = param.productName;
                        Data.productConversionBarcodeId= ""   
                        Data.productConversionBarcode = ""                     
                        Data.ownerName = ""
                        Data.productConversionName = ""
                    }
                    break;
                    case "4": {
                        Data.ownerName = param.ownerName;
                        Data.productName = "";
                        Data.productConversionBarcodeId= ""   
                        Data.productConversionBarcode = ""                   
                        Data.productConversionName = ""
                    }
                    break;
                    case "5": {
                        Data.productConversionName ;
                        Data.ownerName = "";
                        Data.productName = "";
                        Data.productConversionBarcodeId= ""   
                        Data.productConversionBarcode = ""    
                    }
                    break;
                }
                viewModel.search(Data).then(
                    function success(res) {
                        pageLoading.hide();
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.searchResultModel = res.data.itemsProductConversionBarcode;
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

            function initialize() {
            };

            this.$onInit = function () {
                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });
        }
    });

})();