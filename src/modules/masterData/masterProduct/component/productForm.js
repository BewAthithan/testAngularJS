(function () {
    'use strict'

    app.component('productForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterProduct/component/productForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            isFilter: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, $stateParams, /*authService*/ pageLoading,
            $window, commonService, localStorageService, $translate, dpMessageBox, productFactory, productConversionFactory) {
            var $vm = this;
            $scope.onShow = false;
            var defer = {};
            var viewModel = productFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {

                defer = $q.defer();
                if ($scope.filterModel != null) {
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;
                    viewModel.getId(param).then(function (res) {
                        pageLoading.hide();
                        console.log(res);
                        console.log($scope.filterModel);
                        $scope.filterModel = res.data[0];                        
                        if($scope.filterModel.customAttribute1DateFrom) {
                            $scope.filterModel.customAttribute1DateFrom = new Date($scope.filterModel.customAttribute1DateFrom);
                        }
                        if($scope.filterModel.customAttribute1DateTo) {
                            $scope.filterModel.customAttribute1DateTo = new Date($scope.filterModel.customAttribute1DateTo);
                        }
                        if($scope.filterModel.customAttribute1 === 1) {
                            $scope.filterModel.customAttribute1 = true;
                        } else {
                            $scope.filterModel.customAttribute1 = false;
                        }
                        if($scope.filterModel.customAttribute2 === 1) {
                            $scope.filterModel.customAttribute2 = true;
                        } else {
                            $scope.filterModel.customAttribute2 = false;
                        }
                        if($scope.filterModel.customAttribute3 === 1) {
                            $scope.filterModel.customAttribute3 = true;
                        } else {
                            $scope.filterModel.customAttribute3 = false;
                        }
                        if($scope.filterModel.customAttribute4 === 1) {
                            $scope.filterModel.customAttribute4 = true;
                        } else {
                            $scope.filterModel.customAttribute4 = false;
                        }
                        if($scope.filterModel.customAttribute5 === 1) {
                            $scope.filterModel.customAttribute5 = true;
                        } else {
                            $scope.filterModel.customAttribute5 = false;
                        }
                        console.log($scope.filterModel);
                        ConvertData();
                        $scope.update = true;
                        $scope.buttons.addConvertion = true;
                    });
                }
                else {
                    
                    $scope.update = false;
                    $scope.create = true;
                    $scope.buttons.addConvertion = false;
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
                // console.log(model);
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
                            Add(model).then(function success(res) {
                                $vm.filterModel = res.config.data;
                                $vm.searchResultModel = res.config.data;
                                $state.reload($state.current.name);
                                $scope.filterModel = {};
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });
                        defer.resolve();
                    }
                });
            }

            $scope.edit = function () {
                console.log("edit scope");
                // is attribute
                if($scope.filterModel.customAttribute1 === "true" || $scope.filterModel.customAttribute1 === true) {
                    $scope.filterModel.customAttribute1 = 1;
                } else {
                    $scope.filterModel.customAttribute1 = 0;
                }
                if($scope.filterModel.customAttribute2 === "true" || $scope.filterModel.customAttribute2 === true) {
                    $scope.filterModel.customAttribute2 = 1;
                } else {
                    $scope.filterModel.customAttribute2 = 0;
                }
                if($scope.filterModel.customAttribute3 === "true" || $scope.filterModel.customAttribute3 === true) {
                    $scope.filterModel.customAttribute3 = 1;
                } else {
                    $scope.filterModel.customAttribute3 = 0;
                }
                if($scope.filterModel.customAttribute4 === "true" || $scope.filterModel.customAttribute4 === true) {
                    $scope.filterModel.customAttribute4 = 1;
                } else {
                    $scope.filterModel.customAttribute4 = 0;
                }
                if($scope.filterModel.customAttribute5 === "true" || $scope.filterModel.customAttribute5 === true) {
                    $scope.filterModel.customAttribute5 = 1;
                } else {
                    $scope.filterModel.customAttribute5 = 0;
                }
                // custom attribute
                if($scope.filterModel.isLot === "true" || $scope.filterModel.isLot === true) {
                    $scope.filterModel.isLot = 1;
                } else {
                    $scope.filterModel.isLot = 0;
                }
                if($scope.filterModel.isExpDate === "true" || $scope.filterModel.isExpDate === true) {
                    $scope.filterModel.isExpDate = 1;
                } else {
                    $scope.filterModel.isExpDate = 0;
                }
                if($scope.filterModel.isMfgDate === "true" || $scope.filterModel.isMfgDate === true) {
                    $scope.filterModel.isMfgDate = 1;
                } else {
                    $scope.filterModel.isMfgDate = 0;
                }
                if($scope.filterModel.isCatchWeight === "true" || $scope.filterModel.isCatchWeight === true) {
                    $scope.filterModel.isCatchWeight = 1;
                } else {
                    $scope.filterModel.isCatchWeight = 0;
                }
                if($scope.filterModel.isSerial === "true" || $scope.filterModel.isSerial === true) {
                    $scope.filterModel.isSerial = 1;
                } else {
                    $scope.filterModel.isSerial = 0;
                }
                var pad = function(num) { return ('00'+num).slice(-2) };
                var customAttribute1DateFrom_date = new Date($scope.filterModel.customAttribute1DateFrom);
                $scope.filterModel.customAttribute1DateFrom = customAttribute1DateFrom_date.getFullYear() + '-' +
                pad(customAttribute1DateFrom_date.getMonth() + 1) + '-' +
                pad(customAttribute1DateFrom_date.getDate()) + 'T' +
                pad(customAttribute1DateFrom_date.getHours()) + ':' +
                pad(customAttribute1DateFrom_date.getMinutes()) + ':' +
                pad(customAttribute1DateFrom_date.getSeconds());
                var customAttribute1DateTo_date = new Date($scope.filterModel.customAttribute1DateTo);
                $scope.filterModel.customAttribute1DateTo = customAttribute1DateTo_date.getFullYear() + '-' +
                pad(customAttribute1DateTo_date.getMonth() + 1) + '-' +
                pad(customAttribute1DateTo_date.getDate()) + 'T' +
                pad(customAttribute1DateTo_date.getHours()) + ':' +
                pad(customAttribute1DateTo_date.getMinutes()) + ':' +
                pad(customAttribute1DateTo_date.getSeconds());
                // console.log(new Date($scope.filterModel.customAttribute1DateTo).toISOString().slice(0, 19));
                var model = $scope.filterModel;                
                console.log(model);
                // console.log(Date.parse($scope.filterModel.customAttribute1DateFrom.replace(pattern, '$1-$2-$3')));
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

            function ConvertData() {
                let param = $scope.filterModel;
                if ($scope.filterModel.isExpDate == 1) {
                    $scope.filterModel.isExpDate = true
                }
                else {
                    $scope.filterModel.isExpDate = false
                }

                if ($scope.filterModel.isMfgDate == 1) {
                    $scope.filterModel.isMfgDate = true
                }
                else {
                    $scope.filterModel.isMfgDate = false
                }

                if ($scope.filterModel.isLot == 1) {
                    $scope.filterModel.isLot = true
                }
                else {
                    $scope.filterModel.isLot = false
                }
                if ($scope.filterModel.isCatchWeight == 1) {
                    $scope.filterModel.isCatchWeight = true
                }
                else {
                    $scope.filterModel.isCatchWeight = false
                }
                if ($scope.filterModel.isSerial == 1) {
                    $scope.filterModel.isSerial = true
                }
                else {
                    $scope.filterModel.isSerial = false
                }
            }
            function validate(param) {                
                let defer = $q.defer();
                let msg = "";
                if (param.productName == null) {
                    msg = ' Product Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productSecondName == null){
                    msg = ' ProductSecond Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productThirdName == null){
                    msg = ' ProductThird Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productCategoryName == null){
                    msg = ' ProductCategory Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productTypeName == null){
                    msg = ' ProductType Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productSubTypeName == null){
                    msg = ' ProductSubType Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productConversionName == null){
                    msg = ' ProductConversion Name is required !'
                    defer.resolve(msg);
                }
                else if (param.productItemLifeY == null){
                    msg = ' ProductItemLife Year is required !'
                    defer.resolve(msg);
                }
                else if (param.productItemLifeM == null){
                    msg = ' ProductItemLife Month is required !'
                    defer.resolve(msg);
                }
                else if (param.productItemLifeD == null){
                    msg = ' ProductItemLife Day is required !'
                    defer.resolve(msg);
                }
                else if (param.productImagePath == null){
                    msg = ' ProductImage Path is required !'
                    defer.resolve(msg);
                }
                if (param.isLot == true) {
                    param.isLot = 1;
                }
                else {
                    param.isLot = 0;
                }

                if (param.isExpDate == true) {
                    param.isExpDate = 1;
                }
                else {
                    param.isExpDate = 0;
                }
                if (param.isMfgDate == true) {
                    param.isMfgDate = 1;
                }
                else {
                    param.isMfgDate = 0;
                }
                if (param.isCatchWeight == true) {
                    param.isCatchWeight = 1;
                }
                else {
                    param.isCatchWeight = 0;
                }
                if (param.isSerial == true) {
                    param.isSerial = 1;
                }
                else {
                    param.isSerial = 0;
                }
                defer.resolve(msg);

                return defer.promise;
            }
            $scope.addConvertion = function (index) {
                let _viewparam = productConversionFactory;
                pageLoading.show();
                _viewparam.setParam(index);
                $state.go('tops.product_conversion', {

                });
            }

            $scope.back = function () {
                defer.resolve('1');
            }

            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };
            $scope.buttons = {
                addConvertion: false,
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
            $scope.popupProductCategory = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupProductCategory.onShow = !$scope.popupProductCategory.onShow;
                    $scope.popupProductCategory.delegates.productCategoryPopup(param, index);
                },
                config: {
                    title: "ProductCategory"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.productCategoryIndex = angular.copy(param.productCategoryIndex);
                        $scope.filterModel.productCategoryId = angular.copy(param.productCategoryId);
                        $scope.filterModel.productCategoryName = angular.copy(param.productCategoryId) + " - " + angular.copy(param.productCategoryName);
                    }
                }
            };

            $scope.popupProductType = {
                onShow: false,
                delegates: {},
                onClick: function (index ,name) {
                    
                    if ($scope.filterModel.productCategoryIndex != null) {
                        index = $scope.filterModel.productCategoryIndex;
                    };
                    if ($scope.filterModel.productCategoryIndex == undefined) {
                        name = '0';
                    };
                    $scope.popupProductType.onShow = !$scope.popupProductType.onShow;
                    $scope.popupProductType.delegates.productTypePopup(index ,name);
                },
                config: {
                    title: "Product Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.productTypeIndex = angular.copy(param.productTypeIndex);
                        $scope.filterModel.productTypeId = angular.copy(param.productTypeId);
                        $scope.filterModel.productTypeName = angular.copy(param.productTypeId) + " - " + angular.copy(param.productTypeName);
                    }
                }
            };

            $scope.popupProductSubType = {
                onShow: false,
                delegates: {},
                onClick: function (index ,name) {
                    if ($scope.filterModel.productTypeIndex != null) {
                        index = $scope.filterModel.productTypeIndex;
                    };
                    if ($scope.filterModel.productTypeIndex == undefined) {
                        name = '0';
                    };
                    $scope.popupProductSubType.onShow = !$scope.popupProductSubType.onShow;
                    $scope.popupProductSubType.delegates.productSubTypePopup(index ,name);
                },
                config: {
                    title: "Product SubType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.productSubTypeIndex = angular.copy(param.productSubTypeIndex);
                        $scope.filterModel.productSubTypeId = angular.copy(param.productSubTypeId);
                        $scope.filterModel.productSubTypeName = angular.copy(param.productSubTypeId) + " - " + angular.copy(param.productSubTypeName);
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