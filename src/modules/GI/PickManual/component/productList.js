(function () {
    'use strict'
    app.component('pickManualProductList', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/PickManual/component/ProductList.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            providers: '=?'
        },
        controller: function ($scope, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, PickManualFactory) {
            var $vm = this;
            var defer = {};
            $scope.items = $scope.items || [];
            var item = $vm.searchResultModel;
            // setting column       
            $scope.isLoading = false;
            var viewModel = PickManualFactory;
            

            var model = $scope.filterModel;

            $scope.clearCheck = function(param) {
                for (let index = 0; index < $scope.filterModel.length; index++) {
                    
                    if (index != param)
                        $scope.filterModel[index].selected = false;
                }
            }

            $scope.detectCheck = function (item) {
                let isCheck = $scope.filterModel;
                for (var i = 0; i <= isCheck.length - 1; i++) {
                    if (item.binBalance_Index == isCheck[i].binBalance_Index && item.selected == isCheck[i].selected) {

                        isCheck[i].selected = true;
                    }
                    else {
                        isCheck[i].selected = false;
                    }
                }
            }

            $scope.select = function (param) {
                
                
                var item = param.filter(c => c.selected);
                
                if ($vm.providers.invokes)
                    $vm.providers.invokes.set(item);

                $vm.isFilter = true;

                // defer.resolve(item);
            }

            $scope.back = function () {
                
                $vm.isFilter = true;
            }

            $scope.productSO = '';
            $scope.productGI = '';

            $scope.m = {};
            $scope.filterModel = {};
            $vm.isLoading = function (param) {
                defer = $q.defer();
                $scope.isLoading = true;

                if (param != undefined)
                {
                    if (param.soNo != undefined)
                        $scope.productSO = param.soNo

                    if (param.giNo != undefined)
                        $scope.productGI = param.giNo

                    $scope.m.planGoodsIssue_No = param.soNo || $scope.productSO;
                    $scope.m.goodsIssue_No = param.giNo || $scope.productGI;
                    $scope.m.barcode = $scope.filterModel.barcode;
                }

                viewModel.filterProductCatchWeight($scope.m).then(function success(res) {
                    // $scope.datalist.config.paginations = res.data.pagination;
                    $scope.filterModel = res.data;
                    // $scope.datalist.config.title = $scope.config.title;
                    // if ($scope.datalist.delegates.set)
                    //     $scope.datalist.delegates.set(res.data);
                }, function error(res) { });

                // if (model != null) {
                //     $scope.filterModel = model;
                //     $scope.filterModel.LocationName = model[0].locationName;
                //     $scope.filterModel.locationIndex = model[0].locationIndex;
                //     $scope.filterModel.locationId = model[0].locationId;
                //     $scope.filterModel.itemStatusIndex = model[0].itemStatus_Index;
                //     $scope.filterModel.itemStatusName = model[0].itemStatus_Name;
                //     $scope.filterModel.itemStatusId = model[0].itemStatus_Id;
                //     $scope.filterModel.productName = model[0].product_Name;
                //     if (Barcode != null) {
                //         $scope.filterModel.product_Id = model[0].product_Id;
                //         $scope.filterModel.product_Name = model[0].product_Name;
                //     }

                //     $scope.SumModel = sum;
                // }
                return defer.promise;
            };

            var init = function () {
            };
            init();

        }
    })
})();