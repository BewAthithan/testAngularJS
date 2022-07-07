(function () {
    'use strict'

    app.component('soldToForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterSoldTo/component/soldToForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?'
        },
        controller: function ($scope, $q, $filter, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, dpMessageBox, soldToFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = soldToFactory;
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
                    viewModel.getId(param.soldToIndex).then(function (res) {
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
                if (param.soldToTypeName == null) {
                    msg = ' SoldToType is required !'
                    defer.resolve(msg);
                }
                else if (param.soldToName == null) {
                    msg = ' SoldTo Name is required !'
                    defer.resolve(msg);
                }
                else if (param.soldToAddress == null) {
                    msg = ' SoldTo Address is required !'
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
            $scope.popupSoldToType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupSoldToType.onShow = !$scope.popupSoldToType.onShow;
                    $scope.popupSoldToType.delegates.soldToTypePopup(param, index);
                },
                config: {
                    title: "soldToType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.soldToTypeIndex = angular.copy(param.soldToTypeIndex);
                        $scope.filterModel.soldToTypeId = angular.copy(param.soldToTypeId);
                        $scope.filterModel.soldToTypeName = angular.copy(param.soldToTypeId) + " - " + angular.copy(param.soldToTypeName);

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
                onClick: function (param, index) {
                    if ($scope.filterModel.countryIndex != null) {
                        index = $scope.filterModel.countryIndex;
                    };
                    $scope.popupProvince.onShow = !$scope.popupProvince.onShow;
                    $scope.popupProvince.delegates.provincePopup(param, index);
                },
                config: {
                    title: "province"
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
                    title: "postcode"
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