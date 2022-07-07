(function () {
    'use strict'

    app.component('vendorForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterVendor/component/vendorForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, vendorFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = vendorFactory;
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
                    viewModel.getId(param.vendorIndex).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data[0];
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
                if (param.vendorName == null) {
                    msg = ' Vendor Name is required !'
                    defer.resolve(msg);
                }
                else if (param.vendorAddress == null) {
                    msg = ' Vendor Address is required !'
                    defer.resolve(msg);
                }
                else if (param.vendorTypeName == null) {
                    msg = ' VendorType is required !'
                    defer.resolve(msg);
                }
                else if (param.countryName == null) {
                    msg = ' Country is required !'
                    defer.resolve(msg);
                }
                else if (param.provinceName == null) {
                    msg = ' Province is required !'
                    defer.resolve(msg);
                }
                else if (param.districtName == null) {
                    msg = ' District is required !'
                    defer.resolve(msg);
                }
                else if (param.subDistrictName == null) {
                    msg = ' SubDistrict is required !'
                    defer.resolve(msg);
                }
                // else if (param.postCodeName == null) {
                //     msg = ' PostCode Name is required !'
                //     defer.resolve(msg);
                // }
                defer.resolve(msg);

                return defer.promise;
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
                add: true,
                update: false,
                back: true
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

            $scope.popupVendorType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupVendorType.onShow = !$scope.popupVendorType.onShow;
                    $scope.popupVendorType.delegates.vendorTypePopup(param, index);
                },
                config: {
                    title: "vendorType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.vendorTypeIndex = angular.copy(param.vendorTypeIndex);
                        $scope.filterModel.vendorTypeId = angular.copy(param.vendorTypeId);
                        $scope.filterModel.vendorTypeName = angular.copy(param.vendorTypeId) + " - " + angular.copy(param.vendorTypeName);

                    }
                }
            };

            $scope.popupSubDistrict = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.districtIndex != null) {
                        index = $scope.filterModel.districtIndex;
                    };
                    $scope.popupSubDistrict.onShow = !$scope.popupSubDistrict.onShow;
                    $scope.popupSubDistrict.delegates.subDistrictPopup(index);
                },
                config: {
                    title: "subDistrict"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.subDistrictIndex = angular.copy(param.subDistrictIndex);
                        $scope.filterModel.subDistrictId = angular.copy(param.subDistrictId);
                        $scope.filterModel.subDistrictName = angular.copy(param.subDistrictId) + " - " + angular.copy(param.subDistrictName);

                    }
                }
            };

            $scope.popupDistrict = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.provinceIndex != null) {
                        index = $scope.filterModel.provinceIndex;
                    };
                    $scope.popupDistrict.onShow = !$scope.popupDistrict.onShow;
                    $scope.popupDistrict.delegates.districtPopup(index);
                },
                config: {
                    title: "District"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.districtIndex = angular.copy(param.districtIndex);
                        $scope.filterModel.districtId = angular.copy(param.districtId);
                        $scope.filterModel.districtName = angular.copy(param.districtId) + " - " + angular.copy(param.districtName);

                    }
                }
            };

            $scope.popupProvince = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.countryIndex != null) {
                        index = $scope.filterModel.countryIndex;
                    };
                    $scope.popupProvince.onShow = !$scope.popupProvince.onShow;
                    $scope.popupProvince.delegates.provincePopup(index);
                },
                config: {
                    title: "Province"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.provinceIndex = angular.copy(param.provinceIndex);
                        $scope.filterModel.provinceId = angular.copy(param.provinceId);
                        $scope.filterModel.provinceName = angular.copy(param.provinceId) + " - " + angular.copy(param.provinceName);

                    }
                }
            };

            $scope.popupCountry = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupCountry.onShow = !$scope.popupCountry.onShow;
                    $scope.popupCountry.delegates.countryPopup(param, index);
                },
                config: {
                    title: "Country"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.countryIndex = angular.copy(param.countryIndex);
                        $scope.filterModel.countryId = angular.copy(param.countryId);
                        $scope.filterModel.countryName = angular.copy(param.countryId) + " - " + angular.copy(param.countryName);

                    }
                }
            };

            $scope.popupPostCode = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.subDistrictIndex != null) {
                        index = $scope.filterModel.subDistrictIndex;
                    };
                    $scope.popupPostCode.onShow = !$scope.popupPostCode.onShow;
                    $scope.popupPostCode.delegates.postcodePopup(index);
                },
                config: {
                    title: "Postcode"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.postCodeIndex = angular.copy(param.postCodeIndex);
                        $scope.filterModel.postCodeId = angular.copy(param.postCodeId);
                        $scope.filterModel.postCodeName = angular.copy(param.postCodeId) + " - " + angular.copy(param.postCodeName);

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