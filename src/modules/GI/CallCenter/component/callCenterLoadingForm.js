(function () {
    'use strict'

    app.component('callCenterLoadingForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CallCenter/component/callCenterLoadingForm.html",
        bindings: {

            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilterTable: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsIssueFactory, callCenterItemFactory) {
            var $vm = this;

            $scope.isLoading = false;

            var defer = {};
            var viewModel = planGoodsIssueFactory;

            var _tempData = {};
            var _planGI = {};
            var _index = -99;

            $vm.isLoading = function (param, index, owner) {
                $scope.filterModel.ownerIndex = owner;
                defer = $q.defer();
                $scope.isLoading = true;
                if (param != undefined) {
                    if (!param.flagUpdate) {
                        callCenterItemFactory.getByCallCenterId(param.callCenterIndex).then(function (res) {

                            _tempData = res.data[index];
                            _planGI = res.data[index];
                            _index = index;
                            $scope.filterModel = res.data[index];
                            $scope.filterModel.Checkqty = res.data[index].qty;

                            $scope.buttons.add = false;
                            $scope.buttons.update = true;
                        });
                    }
                    else {
                        _tempData = param;
                        _planGI = param;
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

            $scope.add = function () {
                $scope.filterModel.isActive = true;
                defer.resolve($scope.filterModel);

                $scope.filterModel = {};
            }

            $scope.edit = function (param) {
                if (param.qty > $scope.filterModel.Checkqty) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "QTY เกิน"
                    })
                }
                else {
                    _planGI.index = _index;
                    _planGI.flagUpdate = true;
                    $scope.filterModel = {};
                    defer.resolve(_planGI);
                }

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

                        // $scope.filterModel = angular.copy(param);
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
                        $scope.ratio = angular.copy(param.productConversionRatio);
                    }
                }
            };

            $scope.popupItemStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupItemStatus.onShow = !$scope.popupItemStatus.onShow;
                    $scope.popupItemStatus.delegates.itemStatusPopup(param, index);
                },
                config: {
                    title: "Item Status"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.ItemStatusIndex = angular.copy(param.itemStatusIndex);
                        $scope.filterModel.ItemStatusId = angular.copy(param.itemStatusId);
                        $scope.filterModel.ItemStatusName = angular.copy(param.itemStatusName);

                    }
                }
            };

            var init = function () {

                $scope.filterModel = {};
            };
            init();
        }
    })
})();