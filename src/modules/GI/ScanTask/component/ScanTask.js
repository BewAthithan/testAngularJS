(function () {
    'use strict'

    app.component('scanTask', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/ScanTask/component/ScanTask.html",
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
            pickingTools: '=?',
            pickingToolsList: '=?',
            isLoading: '=?',

        },
        controller: function ($scope, $filter, $state, pageLoading, localStorageService, $timeout, $q, dpMessageBox, scanTaskFactory, assignTaskFactory,assignCartFactory, $interval) {
            var $vm = this;
            var viewModel = scanTaskFactory;
            var assignTaskviewModel = assignTaskFactory;
            var assignCartviewModel = assignCartFactory;
            $scope.isFilter = true;
            $vm.isFilter = true;
            $scope.filterModel = {};
            $scope.pickingTools = true;

            $scope.ScanBarcode = function () {
                $scope.validateMsg = "";
                if ($scope.filterModel != null) {
                    if ($scope.filterModel.numberOfScan + 1 > $scope.filterModel.qty) {
                        return dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " จำนวนสินค้าเกิน"
                        })
                    }
                    document.getElementById("myTextBar").blur;
                    document.getElementById("myText").blur;
                    $scope.filterModel.scanProductConversionBarcodeName = pad($scope.filterModel.scanProductConversionBarcodeName);
                    $scope.filterModel.userName = $scope.userName
                    if ($scope.userName != undefined) {
                        viewModel.cartDataScanPicking($scope.filterModel).then(function success(res) {
                            document.getElementById("myTextBar").focus();
                            document.getElementById("myText").focus();
                            // $vm.searchResultModel = res.data;
                            // $scope.filterModel = res.data
                            // $scope.filterModel.isCheckCartonPopup = 0;
                            if (res.data.msgResult == "Qty Limit") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " จำนวนสินค้าเกิน กรุณาสแกนใหม่ !"
                                })
                            }
                            else if (res.data.msgResult.substring(0, 19) == "Cannot find barcode") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                })
                            }
                            else if (res.data.msgResult.substring(0, 18) == "Scan Barcode Error") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                })
                            }
                            else if (res.data.msgResult.substring(0, 19) == "Barcode not match") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                })
                            }
                            else if (res.data.msgResult.substring(0, 16) == "Invalid Username") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                }).then(function () {
                                    $scope.back();
                                })
                            }
                            else if (res.data.msgResult == "Confirm") {
                                $vm.searchResultModel = res.data;
                                $scope.filterModel = res.data
                                $scope.filterModel.isCheckCartonPopup = 0;
                                document.getElementById("confirmCarton").focus();
                                document.getElementById("myconfirmCarton").focus();
                                document.getElementById("myTextBar").disabled = true;
                                document.getElementById("myTextBar").style.backgroundColor = "#DDDDDD";
                                document.getElementById("myText").disabled = true;
                            }
                            else if (res.data.numberOfScan == $scope.filterModel.qty) {
                                $vm.searchResultModel = res.data;
                                $scope.filterModel = res.data
                                $scope.filterModel.isCheckCartonPopup = 0;
                                document.getElementById("confirmCarton").focus();
                                document.getElementById("myconfirmCarton").focus();
                                document.getElementById("myTextBar").disabled = true;
                                document.getElementById("myTextBar").style.backgroundColor = "#DDDDDD";
                                document.getElementById("myText").disabled = true;
                            }
                            else if (res.data.msgResult == "Pick") {
                                $vm.searchResultModel = res.data;
                                $scope.filterModel = res.data
                                $scope.filterModel.isCheckCartonPopup = 0;
                            }
                        }, function error(param) {
                            document.getElementById("myTextBar").focus();
                            document.getElementById("myText").focus();
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " Error !!"
                            })
                        });
                    } else {
                        document.getElementById("myTextBar").focus();
                        document.getElementById("myText").focus();
                    }
                }
                else {
                    document.getElementById("myTextBar").focus();
                    document.getElementById("myText").focus();
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: " Barcode is required !!"
                    })
                }
            }

            function pad(str) {
                str = str.toString();
                return str.length < 13 ? pad("0" + str, 13) : str;
            }

            $scope.ScanConfirmCarton = function () {

                if ($scope.filterModel.numberOfScan == 0 && $scope.filterModel.qty != 0) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Please Scan Barcode "
                    })
                }

                if ($scope.filterModel.ScanCartonNo == "" || $scope.filterModel.ScanCartonNo == null) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Alert',
                        message: 'โปรดระบุเลข CTN'
                    });
                }

                if ($scope.filterModel.ScanCartonNo != "" && $scope.filterModel.ScanCartonNo != undefined) {
                    $scope.filterModel.userName = $scope.userName
                    $scope.filterModel.isCheckCartonPopup = 1;
                    viewModel.checkFormateTagout($scope.filterModel.ScanCartonNo,$scope.filterModel.taskIndex,$scope.filterModel.equipmentIndex).then(function success(res) {

                        if (res.data == "false") {
                            return dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Cant Create CTN',
                                message: 'ไม่สามารถสร้าง CTN ได้เนื่องจาก Format ไม่ถูกต้อง'
                            });
                        }
                        if (res.data == "work") {
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'CTN มีการใช้งานอยู่'
                            });
                        }

                        if (res.data == "new") {
                            return dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Tagout No not found',
                                message: 'Do you want to Create CTN ?'
                            }).then(function success() {
                                $scope.filterModel.userName = localStorageService.get('userTokenStorage');
                                viewModel.createCarton($scope.filterModel).then(function success(results) {
                                    $scope.filterModel.tagOut_Index = results.data;
                                    $scope.ScanConfirmCarton();

                                }, function error(res) { });
                            });
                        }

                        if (res.data == "true") {
                            $scope.filterModel.reasonCodeIndex = "00000000-0000-0000-0000-000000000000";
                            $scope.filterModel.reasonCodeId = "";
                            $scope.filterModel.reasonCodeName = "";
                            viewModel.CartDataScanConfirm($scope.filterModel).then(function success(res) {
                                $scope.filterModel.isError = false;
                                if (res.data.msgResult == "Input Carton No") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: res.data.msgResult
                                    })
                                }
                                else if (res.data.msgResult.substring(0, 21) == "Cannot find Carton No") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: res.data.msgResult
                                    })
                                }
                                else if (res.data.msgResult.substring(0, 16) == "Invalid Username") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: res.data.msgResult
                                    })
                                }
                                else if (res.data.msgResult == "Next") {
                                    init();
                                }
                                else if (res.data.msgResult == "ReasonCode") {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: res.data.msgResult
                                    })
                                }
                            },
                                function error(res) {
                                    $scope.filterModel.isError = true;
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "Confirm Carton Error!!"
                                    })
                                });
                        }
                    },
                        function error(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Confirm Carton Error!!"
                            })
                        });
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " CartonNo ต้องไม่เท่ากับค่าว่าง !"
                    })
                    $scope.filterModel.isCheckCartonPopup = 0;
                }

            }

            $scope.back = function () {
                let item = assignTaskviewModel.getParam();
                let item2 = assignCartviewModel.getParam();
                if (item != undefined) {
                    assignTaskviewModel.setParam("");
                    $state.go('tops.assign_task', {
                    })
                }
                if (item2) {
                    assignCartviewModel.setParam("");
                    $state.go('tops.assign_cart', {
                    })
                }
              
            }
            var init = function () {
                $scope.filterModel = {};
                // document.getElementById("myTextBar").focus();
                $scope.userName = localStorageService.get('userTokenStorage');
                let item = assignTaskviewModel.getParam();
                let item2 = assignCartviewModel.getParam();
                if (item != undefined || item2 != undefined) {
                    var objitem = {};
                    objitem.item = item || item2;
                    objitem.item.userName = localStorageService.get('userTokenStorage');
                    viewModel.cartDataPicking(objitem).then(function success(res) {
                        if (res.data != null) {
                            $vm.searchResultModel = res.data;
                            $scope.filterModel = res.data
                            $scope.filterModel.isCheckCartonPopup = 0;
                            if (res.data.msgResult == "Drop") {
                                if ($scope.filterModel != null) {
                                    let data = item ||item2 ; 
                                    viewModel.setParam(data);
                                    $state.go('tops.scan_task_drop', {})
                                }
                            }
                            else {
                                if (res.data.numberOfScan == res.data.qty) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "คุณยังไม่ได้สแกนเลข CartonNo กรุณาสแกนอีกครั้ง !"
                                    })
                                    document.getElementById("myTextBar").disabled = true;
                                    document.getElementById("myTextBar").style.backgroundColor = "#DDDDDD";
                                    document.getElementById("myText").disabled = true;
                                    document.getElementById("confirmCarton").focus();
                                    document.getElementById("myconfirmCarton").focus();
                                } else {
                                    document.getElementById("myTextBar").disabled = false;
                                    document.getElementById("myTextBar").style.backgroundColor = "#FFFFFF";
                                    document.getElementById("myText").disabled = false;
                                    document.getElementById("myTextBar").focus();
                                    document.getElementById("myText").focus();

                                }
                            }
                        }
                        else {
                            $state.go('tops.put_to_staging', {})
                        }
                    }, function error(param) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "SearchTask Error !!!"
                        })
                    });
                }


            };

            $scope.shotpick = function () {
                $scope.filterModel.userName = $scope.userName;
                if ($scope.filterModel.numberOfScan != 0) {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "Please Confrim Carton "
                    })
                }
                if ($scope.filterModel.numberOfScan != $scope.filterModel.qty) {
                    var DataList = $scope.filterModel;
                    if ($scope.isLoading) {
                        $vm.isFilter = false;
                        $scope.isLoading(DataList).then(function (param) {
                            $vm.isFilter = true;
                            if (param == "ConfrimDrop") {
                                $state.go('tops.assign_task', {})
                            }
                            else {
                                init();
                            }
                        }).catch(function (error) {
                            defer.reject({ 'Message': error });
                        });
                    }
                }
                else {
                    $scope.filterModel.reasonCodeIndex = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.reasonCodeId = "";
                    $scope.filterModel.reasonCodeName = "";
                    viewModel.CartDataScanConfirm($scope.filterModel).then(function success(res) {
                        if (res.data.msgResult == "Input Carton No") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
                        }
                        else if (res.data.msgResult.substring(0, 21) == "Cannot find Carton No") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
                        }
                        else if (res.data.msgResult.substring(0, 16) == "Invalid Username") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
                        }
                        else if (res.data.msgResult == "Next") {
                            init();
                        }
                        else if (res.data.msgResult == "ReasonCode") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
                        }
                        else if (res.data.msgResult == "ConfrimDrop") {
                            $state.go('tops.assign_task', {})
                        }
                    },
                        function error(res) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Confirm Carton Error!!"
                            })
                        });
                }
            }



            $("#myTextBar").bind("focus", function () {
                setTimeout(() => {
                    $("#myTextBar").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#myTextBar").attr("readonly", "readonly");
            });

            $("#myText").bind("focus", function () {
                setTimeout(() => {
                    $("#myText").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#myText").attr("readonly", "readonly");
            });

            $("#confirmCarton").bind("focus", function () {
                setTimeout(() => {
                    $("#confirmCarton").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#confirmCarton").attr("readonly", "readonly");
            });

            $("#myconfirmCarton").bind("focus", function () {
                setTimeout(() => {
                    $("#myconfirmCarton").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#myconfirmCarton").attr("readonly", "readonly");
            });

            init();
        }
    })
})();