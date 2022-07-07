(function () {
    'use strict'

    app.component('grLoadingForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/GR/component/grLoadingForm.html",
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, goodsReceiveFactory, goodsReceiveItemFactory, planGoodsReceiveItemFactory) {
            var $vm = this;

            $scope.isLoading = false;
            var defer = {};
            var viewModel = goodsReceiveFactory;

            //Component life cycle
            $vm.$onInit = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            }

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });

            var _tempData = {};
            var _GR = {};
            var _index = -99;

            $vm.isLoading = function (param, index, owner) {

                $scope.filterModel.ownerIndex = owner;
                defer = $q.defer();
                $scope.isLoading = true;
                if (param != undefined) {
                    if (!param.flagUpdate) {
                        if (param.goodsReceiveIndex != undefined) {
                            goodsReceiveItemFactory.getByGoodReceiveId(param.goodsReceiveIndex).then(function (res) {
                                _tempData = res.data[index];
                                _GR = res.data[index];
                                _index = index;
                                $scope.filterModel = res.data[index];
                                $scope.filterModel.QtyBefore = res.data[index].qty
                                $scope.filterModel.ownerIndex = angular.copy(owner);
                                $scope.buttons.add = false;
                                $scope.buttons.update = true;
                            });
                        }
                        else if (param.planGoodsReceiveIndex != undefined) {

                            _tempData = param;
                            _GR = param;
                            _index = index;
                            $scope.filterModel = param;
                            $scope.filterModel.refDocumentNo = angular.copy(param.refDocumentNo);
                            $scope.filterModel.ownerIndex = angular.copy(owner);
                            $scope.buttons.add = false;
                            $scope.buttons.update = true;
                        }
                    }
                    else {
                        
                        _tempData = param;
                        _GR = param;
                        _index = index;

                        $scope.filterModel = param;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;
                    }
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }

                return defer.promise;
            };

            // $scope.filterModel.weight = $scope.filterModel.qty * $scope.filterModel.unitWeight;
            // 


            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};

                pageLoading.show();
                viewModel.filter().then(function (res) {

                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;
                });
            };

            $scope.add = function () {
                if (!$scope.filterModel.qty) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Error.',
                        message: "Plaese Check Data"
                    })
                }
                else {
                    console.log("else on add");
                    $scope.filterModel.isActive = true;
                    defer.resolve($scope.filterModel);
                    console.log($scope.filterModel);
                    $scope.filterModel = {};
                }
            }

            // $scope.edit = function (param) {
            //     if ($scope.filterModel.QtyBefore < param.qty) {
            //         dpMessageBox.alert({
            //             ok: 'Close',
            //             title: 'Information.',
            //             message: "QTY เกิน QTY Plan"
            //         })
            //     }
            //     else {
            //         _GR.index = _index;
            //         _GR.flagUpdate = true;
            //         $scope.filterModel = {};
            //         defer.resolve(_GR);
            //     }
            // }

            $scope.edit = function () {                    
                _GR.index = _index;
                _GR.flagUpdate = true;
                $scope.filterModel = {};
                defer.resolve(_GR);                    
            }

            $scope.back = function () {
                $scope.filterModel = {};
                defer.resolve('-99');
            }




            function validate(param) {
                var msg = "";
                return msg;
            }

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

            $scope.toggleSidebar = function () {

                $scope.isCollapsed = $scope.isCollapsed === false ? true : false;

                var _sidebar = angular.element(document.querySelector('#domestic-plant-selected'));
                if (!$scope.isCollapsed) {
                    _sidebar.addClass('show-sidebar');
                } else {
                    _sidebar.removeClass('show-sidebar');
                }

            }

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };


            function Add(param) {
                let deferred = $q.defer();

                //default
                param.isActive = 1;
                param.isDelete = 0;
                param.isSystem = 0;
                param.StatusId = 0;

                viewModel.add(param).then((results) => {
                    deferred.resolve(results);
                }, (error) => {
                    console.log(error)
                    deferred.reject(error);
                });

                return deferred.promise;
            }
            function Edit(param) {
                var deferred = $q.defer();
                viewModel.edit(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            function validate(param) {
                var msg = "";
                return msg;
            }

            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    $scope.filterModel;
                    if ($scope.filterModel.ownerIndex != null) {
                        index = $scope.filterModel.ownerIndex;
                    };

                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    $scope.popupProduct.delegates.productPopup(index);
                },
                config: {
                    title: "product"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.productIndex = angular.copy(param.productIndex);
                        $scope.filterModel.productId = angular.copy(param.productId);
                        $scope.filterModel.productName = angular.copy(param.productName);
                        $scope.filterModel.productSecondName = angular.copy(param.productSecondName);
                        $scope.filterModel.productThirdName = angular.copy(param.productThirdName);
                        $scope.filterModel.productConversionIndex = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversionId = angular.copy(param.productConversionId);
                        $scope.filterModel.productConversionName = angular.copy(param.productConversionName);
                        $scope.filterModel.Ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.unitWeight = angular.copy(param.productConversionWeight);
                        $scope.filterModel.unitWidth = angular.copy(param.productConversionWidth);
                        $scope.filterModel.unitLength = angular.copy(param.productConversionLength);
                        $scope.filterModel.unitHeight = angular.copy(param.productConversionHeight);
                        $scope.filterModel.unitVolume = angular.copy(param.productConversionVolumeRatio);

                    }
                }
            };

            $scope.popupProductConversion = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.productIndex != null) {
                        index = $scope.filterModel.productIndex;
                    };
                    $scope.popupProductConversion.onShow = !$scope.popupProductConversion.onShow;
                    $scope.popupProductConversion.delegates.productConversionPopup(index);
                },
                config: {
                    title: "ProductConversion"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        
                        $scope.filterModel.productConversionIndex = angular.copy(param.productConversionIndex);
                        $scope.filterModel.productConversionId = angular.copy(param.productConversionId);
                        $scope.filterModel.productConversionName = angular.copy(param.productConversionName);
                        $scope.filterModel.ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.unitWeight = angular.copy(param.productConversionWeight);
                        $scope.filterModel.unitWidth = angular.copy(param.productConversionWidth);
                        $scope.filterModel.unitLength = angular.copy(param.productConversionLength);
                        $scope.filterModel.unitHeight = angular.copy(param.productConversionHeight);
                        $scope.filterModel.unitVolume = angular.copy(param.productConversionVolumeRatio);

                    }
                }
            };
            $scope.$watch('filterModel.qty', function () {
                if($scope.filterModel.qty < 0)
                    $scope.filterModel.qty = 0
            })

        }
    })
})();