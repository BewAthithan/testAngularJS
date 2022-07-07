(function () {
    'use strict'

    app.component('taskcyclecountCount', {
        controllerAs: '$vm',
        bindings: {
            isCount: '=?',
            isFormTaskCycleCountSummary: '=?',
        }, templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Tranfer/TaskCyclecount/TaskCyclecountCount.html";
        },
        controller: function ($scope, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, $q, dpMessageBox, taskcyclecountFactory) {
            var $vm = this;

            var viewModel = taskcyclecountFactory;
            $scope.isFilter = true;
            $scope.isCount = false;
            $scope.model = {};
            var defer = {};

            $scope.filterModel = {
                currentPage: 0,
                PerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                chkinitpage: false,
                maxSize: 10,
                num: 1,
            };

            $vm.isCount = function (model) {

                $scope.isCount = true;
                defer = $q.defer();

                if (model != undefined) {
                    $scope.filterModel = model;
                    $scope.filterModel.count = null;
                    $scope.filterModel.location_Name = null;

                }

                setTimeout(() => {
                    var focusElem = jQuery('input[ng-model="filterModel.location_Name"]');
                    focusElem.focus();
                }, 200);
                document.getElementById("Lpn").disabled = true;
                document.getElementById("Barcode").disabled = true;

                return defer.promise;
            }

            $scope.ScanLoc = function (param) {
                $scope.filterModel.location_Name = param.location_Name;

                var deferred = $q.defer();
                viewModel.scanLoc($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'Location ไม่ตรงกับใน Task'
                                }
                            )
                        }
                        else if (res.data.message == true && res.data.active == true) {
                            document.getElementById("Barcode").disabled = false;

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.productConvertionBarcode"]');
                                focusElem.focus();
                            }, 200);
                        }
                        else if (res.data.message == true && res.data.active == false) {
                            document.getElementById("Lpn").disabled = false;

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.lpn_No"]');
                                focusElem.focus();
                            }, 200);
                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.ScanLpn = function (param) {
                $scope.filterModel.location_Name = param.location_Name;

                var deferred = $q.defer();
                viewModel.scanLpn($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'ไม่พบ Lpn ใน Location นี้'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            document.getElementById("Barcode").disabled = false;

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.productConvertionBarcode"]');
                                focusElem.focus();
                            }, 200);
                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.ScanBarcode = function (param) {
                $scope.filterModel.location_Name = param.location_Name;

                var deferred = $q.defer();
                viewModel.scanBarcode($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'ไม่พบ สินค้า ใน Location นี้'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            $scope.filterModel.product_Index = res.data.listBinresult[0].product_Index;
                            $scope.filterModel.product_Id = res.data.listBinresult[0].product_Id;
                            $scope.filterModel.product_Name = res.data.listBinresult[0].product_Name;
                            $scope.filterModel.product_SecondName = res.data.listBinresult[0].product_SecondName;
                            $scope.filterModel.productConversion_Index = res.data.listBinresult[0].productConversion_Index;
                            $scope.filterModel.productConversion_Id = res.data.listBinresult[0].productConversion_Id;
                            $scope.filterModel.productConversion_Name = res.data.listBinresult[0].productConversion_Name;
                            // $scope.filterModel.sumCountQty = res.data.listBinresult[0].sumCountQty;

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.count"]');
                                focusElem.focus();
                            }, 200);

                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.ScanCount = function (param) {
                $scope.filterModel.create_by = $scope.userName;
                var deferred = $q.defer();
                $scope.popupMaster.onClick($scope.filterModel);
            }

            $scope.SaveDetail = function () {
                $scope.filterModel.create_by = $scope.userName;
                var deferred = $q.defer();
                viewModel.scanCount($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'Count Error or Try again'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            $scope.filterModel.location_Name = null;
                            $scope.filterModel.lpn_No = null;
                            $scope.filterModel.count = null;
                            $scope.filterModel.productConvertionBarcode = null;
                            $scope.filterModel.product_Index = null;
                            $scope.filterModel.product_Id = null;
                            $scope.filterModel.product_Name = null;
                            $scope.filterModel.product_SecondName = null;
                            $scope.filterModel.productConversion_Index = null;
                            $scope.filterModel.productConversion_Id = null;
                            $scope.filterModel.productConversion_Name = null;
                            $scope.filterModel.sumCountQty = null;

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="filterModel.location_Name"]');
                                focusElem.focus();
                            }, 200);
                            document.getElementById("Lpn").disabled = true;
                            document.getElementById("Barcode").disabled = true;

                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.ConfirmLocation = function (param) {
                $scope.filterModel.userAssign = $scope.userName;

                var deferred = $q.defer();
                viewModel.confirmLocation($scope.filterModel).then(
                    function success(res) {
                        if (res.data.message == false) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'ConfirmLocation Error'
                                }
                            )
                        }
                        else if (res.data.message == true) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'Error',
                                    message: 'ConfirmLocation Success'
                                }
                            )
                            $scope.isCount = false;
                            defer.resolve();

                        }
                    },
                    function error(response) {
                    });
                return deferred.promise;
            }

            $scope.popupMaster = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupMaster.onShow = !$scope.popupMaster.onShow;
                    $scope.popupMaster.delegates.masterRequirePopup(param);
                },
                config: {
                    title: "masterRequire"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.mFG_Date = param.mFG_Date;
                        $scope.filterModel.eXP_Date = param.eXP_Date;
                        $scope.filterModel.product_Lot = param.lot;
                        $scope.filterModel.itemStatus_Index = param.itemStatus_Index;
                        $scope.filterModel.itemStatus_Id = param.itemStatus_Id;
                        $scope.filterModel.itemStatus_Name = param.itemStatus_Name;
                        $scope.filterModel.isExpDate = param.isExpDate;
                        $scope.filterModel.isMfgDate = param.isMfgDate;
                        viewModel.CheckQtyDiff($scope.filterModel).then(
                            function success(res) {
                                $scope.filterModel.sumCountQty = res.data.sumCountQty;
                                if(res.data.message == false)
                                {
                                    $scope.popupReason.onClick($scope.filterModel);
                                }
                                else
                                {
                        $scope.SaveDetail();
                                }
                            },
                            function error(response) {
                            });
                    }
                }
            };


            $scope.popupReason = {
                onShow: false,
                delegates: {},
                onClick: function (param) {
                    $scope.popupReason.onShow = !$scope.popupReason.onShow;
                    $scope.popupReason.delegates.ReasonPopup(param);
                },
                config: {
                    title: "Reason"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.reasonCode_Index = angular.copy(param[0].reasonCodeIndex);
                        $scope.filterModel.reasonCode_Id = angular.copy(param[0].reasonCodeId);
                        $scope.filterModel.reasonCode_Name = angular.copy(param[0].reasonCodeName);
                        $scope.SaveDetail();

                    }
                }
            };

            this.$onInit = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            }



            $scope.back = function () {
                $scope.isCount = false;
                defer.resolve();
            }
        }
    })
})();