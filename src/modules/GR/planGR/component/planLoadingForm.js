(function () {
    'use strict'

    app.component('planLoadingForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/planGR/component/planLoadingForm.html",
        bindings: {

            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsReceiveFactory, planGoodsReceiveItemFactory, planGoodsIssueItemFactory, productOwnerFactory) {
            var $vm = this;

            $scope.isLoading = false;

            var defer = {};
            var viewModel = planGoodsReceiveFactory;

            var _tempData = {};
            var _planGR = {};
            var _index = -99;

            $vm.isLoading = function (param, index, owner) {
                $scope.filterModel.ownerIndex = owner;
                defer = $q.defer();
                $scope.isLoading = true;
                
                if (param != undefined) {

                    if (!param.flagUpdate) {

                        if (param.planGoodsReceiveIndex != undefined) {
                            
                            planGoodsReceiveItemFactory.getByPlanGoodReceiveId(param.planGoodsReceiveIndex).then(function (res) {
                                
                                _tempData = res.data[index];
                                _planGR = res.data[index];
                                _index = index;
                                $scope.filterModel = res.data[index];
                                $scope.filterModel.ownerIndex = owner;
                                $scope.buttons.add = false;
                                $scope.buttons.update = true;
                            });
                        }
                        else if (param.planGoodsIssueIndex != undefined) {
                            
                            // planGoodsIssueItemFactory.getByPlanGoodIssueId(param.planGoodsIssueIndex).then(function (res) {

                            //     _tempData = res.data[index];
                            //     _planGR = res.data[index];
                            //     _index = index;
                            //     $scope.filterModel = res.data[index];


                            //     $scope.buttons.add = false;
                            //     $scope.buttons.update = true;

                            // });
                                _tempData = param;
                                _planGR = param;
                                _index = index;
                                $scope.filterModel = param;
                                // $scope.filterModel.refDocumentNo = angular.copy(param.refDocumentNo);
                                // $scope.filterModel.ownerIndex = angular.copy(owner);
                                $scope.buttons.add = false;
                                $scope.buttons.update = true;
                            
                        }
                    }
                    else {
                        
                        _tempData = param;
                        _planGR = param;
                        _index = index;
                        $scope.filterModel = param;
                        $scope.filterModel.ownerIndex = owner;
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

            $scope.add = function (param) {
                if (param.productId == undefined || param.productName == undefined ||
                    param.qty == undefined || param.productConversionName == undefined || param.productName == ""
                    || param.productIndex == "") {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Error.',
                        message: "Plaese Check Data"
                    })
                }
                // if (param.productId == undefined && param != undefined) {
                //     dpMessageBox.alert({
                //         ok: 'Close',
                //         title: 'Error.',
                //         message: "Plaese Check Data"
                //     })
                // }
                else {
                    $scope.filterModel.isActive = true;
                    defer.resolve($scope.filterModel);
                    $scope.filterModel = {};
                }
            }

            // //Clear Index
            // $scope.$watch('filterModel.productId', function () {
            //     if ($scope.filterModel.productId != $scope.filterModel.productIdTemp) {
            //         $scope.filterModel.productIndex = "";
            //         $scope.filterModel.productName = "";
            //         $scope.filterModel.productConversionName = "";
            //         $scope.filterModel.productConversionId = "";
            //         $scope.filterModel.productConversionIndex = null;
            //     }
            // })

            $scope.edit = function () {
                _planGR.index = _index;
                _planGR.flagUpdate = true;
                $scope.filterModel = {};
                defer.resolve(_planGR);
            }

            $scope.back = function () {
                $scope.filterModel = {};
                defer.resolve('-99');
            }


            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

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

            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
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
                        $scope.filterModel.ratio = angular.copy(param.productConversionRatio);
                        $scope.filterModel.unitWeight = angular.copy(param.productConversionWeight);
                        $scope.filterModel.unitWidth = angular.copy(param.productConversionWidth);
                        $scope.filterModel.unitLength = angular.copy(param.productConversionLength);
                        $scope.filterModel.unitHeight = angular.copy(param.productConversionHeight);
                        $scope.filterModel.unitVolume = angular.copy(param.productConversionVolumeRatio);
                        $scope.filterModel.productIdTemp = $scope.filterModel.productId;
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

            $scope.ScanProductIndex = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.ScanProduct($scope.filterModel).then(function success(res) {
                    var param = res.data;
                    if (param.length != 0) {
                        
                        $scope.filterModel.productIndex = angular.copy(param.itemsProduct[0].productIndex);
                        $scope.filterModel.productId = angular.copy(param.itemsProduct[0].productId);
                        $scope.filterModel.productName = angular.copy(param.itemsProduct[0].productName);
                        $scope.filterModel.productSecondName = angular.copy(param.itemsProduct[0].productSecondName);
                        $scope.filterModel.productThirdName = angular.copy(param.itemsProduct[0].productThirdName);
                        $scope.filterModel.productConversionIndex = angular.copy(param.itemsProduct[0].productConversionIndex);
                        $scope.filterModel.productConversionId = angular.copy(param.itemsProduct[0].productConversionId);
                        $scope.filterModel.productConversionName = angular.copy(param.itemsProduct[0].productConversionName);
                        $scope.filterModel.ratio = angular.copy(param.itemsProduct[0].productConversionRatio);
                        $scope.filterModel.unitWeight = angular.copy(param.itemsProduct[0].productConversionWeight);
                        $scope.filterModel.unitWidth = angular.copy(param.itemsProduct[0].productConversionWidth);
                        $scope.filterModel.unitLength = angular.copy(param.itemsProduct[0].productConversionLength);
                        $scope.filterModel.unitHeight = angular.copy(param.itemsProduct[0].productConversionHeight);
                        $scope.filterModel.unitVolume = angular.copy(param.itemsProduct[0].productConversionVolumeRatio);
                    }
                });
                function error(res) {
                }
            }

            $scope.ScanProduct = function (model) {
                var deferred = $q.defer();
                model.chk = "1";                
                if (model.productId != "" && model.productId !== undefined) {
                    model.currentPage = 1;
                    model.numperPage = 30;
                    productOwnerFactory.getProduct(model).then(
                        function success(res) {
                            if (res.data.length <= 0) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Alert',
                                    message: "Product Not found!!"
                                })
                            }
                            $scope.filterModel.productId = "";
                            $scope.filterModel.productName = "";
                            $scope.filterModel.productConversionName = "";
                            deferred.resolve(res);
                        },
                        function error(response) {
                            deferred.reject(response);
                        });
                }
                else
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Alert',
                        message: "ไม่สามารถค้นหาได้"
                    })
                }
                return deferred.promise;
            }

            $scope.$watch('filterModel.qty', function () {
                if($scope.filterModel.qty < 0)
                    $scope.filterModel.qty = 0
            })

            var init = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
            };
            init();
        }
    })
})();