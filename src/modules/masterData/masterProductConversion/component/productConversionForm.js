(function () {
    'use strict'

    app.component('productConversionForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProductConversion/component/productConversionForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, productConversionFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = productConversionFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();                
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                    $scope.actionVolumn = "0";
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.getId(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data[0];
                        ConvertData();
                        $scope.update = true;
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                }
                return defer.promise;
            };

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
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();
                            Add(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                });
                $scope.filterModel = {};
            }

            $scope.edit = function () {
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();
                            Edit(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                });
            }
            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.productName == undefined) {
                    msg = ' Product is required !'
                    defer.resolve(msg);
                } 
                else if (param.productConversionName == null){ 
                    msg = ' ProductConversion Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productConversionRatio == null){ 
                    msg = ' ProductConversionRatio is required !'
                    defer.resolve(msg);
                }
                else if (param.productConversionWeight == null){ 
                    msg = ' ProductConversionWeight is required !'
                    defer.resolve(msg);
                }
                else if (param.productConversionWidth == null){ 
                    msg = ' ProductConversionWidth is required !'
                    defer.resolve(msg);
                }
                else if (param.productConversionLength == null){ 
                    msg = ' ProductConversionLength is required !'
                    defer.resolve(msg);
                }
                else if (param.productConversionHeight == null){ 
                    msg = ' ProductConversionHeight is required !'
                    defer.resolve(msg);
                }
                else if (param.productConversionVolume == null){ 
                    msg = ' ProductConversionVolume is required !'
                    defer.resolve(msg);
                }
                else if ($scope.actionVolumn == "0"){ 
                    msg = ' ConvertionVolume Ratio is required !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }
            function ConvertData() {
                let param = $scope.filterModel;
                if (param.productConversionVolumeRatio != null) {
                    $scope.actionVolumn = param.productConversionVolumeRatio.toString();
                }

            };
            $scope.back = function () {
                defer.resolve('1');
            }
            $scope.selectVolumn = function () {
                var item = $scope.actionVolumn;
                if (item != 0) {
                    $scope.filterModel.ProductConversionVolumeRatio = item;
                }
                else {
                    $scope.filterModel.ProductConversionVolumeRatio = item;
                }
            };

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };

            function Add(param) {
                let deferred = $q.defer();
                viewModel.add(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
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
                onClick: function (param, index) {
                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    $scope.popupProduct.delegates.productPopup(param, index);
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
                        $scope.filterModel.productName = angular.copy(param.productId) + " - " + angular.copy(param.productName);

                    }
                }
            };
            var init = function () {
                $scope.filterModel = {};
                $scope.actionVolumn = "0";
            };
            init();
        }
    })
})();