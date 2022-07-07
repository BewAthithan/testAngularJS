(function () {
    'use strict'

    app.component('cartNumberV2', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/CartNumberV2/component/cartNumberV2.html",
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
        controller: function ($scope, $filter, $state, pageLoading, localStorageService, $timeout, $q, dpMessageBox, cartNumberFactory, cartAssignFactory, productConversionBarcodeFactory, taskListFactory, $interval) {
            var $vm = this;
            var viewModel = cartNumberFactory;
            var viewModelTaskList = taskListFactory;
            $scope.isFilter = true;
            $scope.filterModel = {};
            $scope.pickingTools = true;
            
            $scope.ScanBarcode = function () {
                $scope.validateMsg = "";
                if ($scope.filterModel != null) {
                    $scope.filterModel.scanProductConversionBarcodeName = pad($scope.filterModel.scanProductConversionBarcodeName);
                    $scope.filterModel.userName = $scope.userName
                    if ($scope.userName != undefined) {
                        viewModel.cartDataScanPickingV2($scope.filterModel).then(function success(res) {
                            // $vm.searchResultModel = res.data;
                            // $scope.filterModel = res.data
                            // $scope.filterModel.isCheckCartonPopup = 0;
                            if(res.data.msgResult == "Qty Limit")
                            {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " จำนวนสินค้าเกิน กรุณาสแกนใหม่ !"
                                })
                            }
                            else if(res.data.msgResult.substring(0, 19) == "Cannot find barcode")
                            {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                })
                            }
                            else if(res.data.msgResult.substring(0, 18) == "Scan Barcode Error")
                            {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                })
                            }
		                    else if(res.data.msgResult.substring(0, 19) == "Barcode not match")
                            {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                })
                            }
                            else if(res.data.msgResult.substring(0, 16) == "Invalid Username")
                            {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: res.data.msgResult
                                }).then(function () {
                                    $scope.back();
                                })
                            }
                            else if(res.data.msgResult == "Confirm")
                            {
                                $vm.searchResultModel = res.data;
                                $scope.filterModel = res.data
                                $scope.filterModel.isCheckCartonPopup = 0;
                                document.getElementById("confirmCarton").focus();
                                document.getElementById("myText").disabled = true;
                                document.getElementById("myTextBar").disabled = true;
                            }
                            else if(res.data.msgResult == "Pick")
                            {
                                $vm.searchResultModel = res.data;
                                $scope.filterModel = res.data
                                $scope.filterModel.isCheckCartonPopup = 0;
                            }
                        }, function error(param) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: " Error !!"
                            })
                        });
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Yes',
                        title: 'Information.',
                        message: " Barcode is required !!"
                    })
                }
            }

            function pad (str) {
                str = str.toString();
                return str.length < 13 ? pad("0" + str, 13) : str;
              }

            $scope.ScanConfirmCarton = function () {
                if ($scope.filterModel.ScanCartonNo != "" && $scope.filterModel.ScanCartonNo != undefined) {
                    $scope.filterModel.userName = $scope.userName
                    $scope.filterModel.isCheckCartonPopup = 1;
                    if($scope.filterModel.numberOfScan != $scope.filterModel.qty)
                    {
                        var DataList = $scope.filterModel;
                        if ($scope.isLoading) {
                            $vm.isFilter = false;
                            $scope.isLoading(DataList).then(function (param) {
                                $vm.isFilter = true;
                                init();
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    }
                    else
                    {
                        $scope.filterModel.reasonCodeIndex = "00000000-0000-0000-0000-000000000000";
                        $scope.filterModel.reasonCodeId = "";
                        $scope.filterModel.reasonCodeName = "";
                        viewModel.CartDataScanConfirmV2($scope.filterModel).then(function success(res) {
                        if(res.data.msgResult == "Input Carton No")
                        {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
                       }
                       else if(res.data.msgResult.substring(0, 21) == "Cannot find Carton No")
                       {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
                       }
                       else if(res.data.msgResult.substring(0, 16) == "Invalid Username")
                       {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
                       }
                       else if(res.data.msgResult == "Next")
                       {
                            init();
                       }
                       else if(res.data.msgResult == "ReasonCode")
                       {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: res.data.msgResult
                            })
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
                var _viewModel = cartAssignFactory;
                _viewModel.setParam("");
                $state.go('tops.cart_assign_picking', {
                })
            }
            var init = function () {
                $scope.filterModel = {};
                document.getElementById("myTextBar").focus();
                var _viewModel = cartAssignFactory;
                $scope.userName = localStorageService.get('userTokenStorage');
                let item = _viewModel.getParam();
                if (item != undefined) {
                    item.map(c => c.userName = localStorageService.get('userTokenStorage'))
                    var objitem = {};
                    objitem.item = item;
                    viewModel.cartDataPickingV2(objitem).then(function success(res) {
                        if (res.data != null) {
                            $vm.searchResultModel = res.data;
                            $scope.filterModel = res.data
                            $scope.filterModel.isCheckCartonPopup = 0;
                            if(res.data.msgResult == "Drop")
                            {
                                if ($scope.filterModel != null) {
                                    viewModel.setParam(item);
                                    $state.go('tops.put_to_staging', { })
                                }
                            }
                            else
                            {
                                if(res.data.numberOfScan == res.data.qty)
                                {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "คุณยังไม่ได้สแกนเลข CartonNo กรุณาสแกนอีกครั้ง !"
                                    })
                                    document.getElementById("confirmCarton").focus();
                                    document.getElementById("myText").disabled = true;
                                    document.getElementById("myTextBar").disabled = true;
                                }else{
                                    document.getElementById("myTextBar").disabled = false;
                                    document.getElementById("myTextBar").focus();
                                    document.getElementById("myText").disabled = false;
                                }
                            }
                        }
                        else
                        {
                            $state.go('tops.put_to_staging', { })
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

            $("#myTextBar").bind("focus", function () {
                setTimeout(() => {
                    $("#myTextBar").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#myTextBar").attr("readonly", "readonly");
            });

            $("#confirmCarton").bind("focus", function () {
                setTimeout(() => {
                    $("#confirmCarton").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#confirmCarton").attr("readonly", "readonly");
            });

            init();
        }
    })
})();