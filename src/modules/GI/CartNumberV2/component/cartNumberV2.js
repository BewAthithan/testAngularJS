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
        controller: function ($scope, $filter, $state, pageLoading, localStorageService, $timeout, $q, dpMessageBox, cartNumberFactory, cartAssignFactory,$window, productConversionBarcodeFactory, taskListFactory,productFactory, $interval, globalVariable) {
            var $vm = this;
            var viewModel = cartNumberFactory;
            var viewModelTaskList = taskListFactory;
            var isSerialRequired = false;
            $scope.isFilter = true;
            $scope.filterModel = {};
            $scope.pickingTools = true;
            $scope.ischkScan = false;
            $scope.isSerialHide = true;
            $scope.hideComponent = true;
            


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
                    if(globalVariable.validateBarcodeDigit == 1) {
                        $scope.filterModel.scanProductConversionBarcodeName = pad($scope.filterModel.scanProductConversionBarcodeName);
                    }
                    $scope.filterModel.userName = $scope.userName
                    if ($scope.userName != undefined) {
                        if (!$scope.ischkScan) {
                            $scope.ischkScan = true;
                            viewModel.cartDataScanPickingV2($scope.filterModel).then(function success(res) {
                                document.getElementById("myTextBar").focus();
                                document.getElementById("myText").focus();
                                $scope.ischkScan = false;
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
                                else if (res.data.msgResult == "Pick") {
                                    $vm.searchResultModel = res.data;
                                    $scope.filterModel = res.data
                                    $scope.filterModel.isCheckCartonPopup = 0;
                                }
                            }, function error(param) {
                                $scope.ischkScan = false;
                                document.getElementById("myTextBar").focus();
                                document.getElementById("myText").focus();
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " Error !!"
                                })
                            });
                        }
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
            
            $vm.HideModal = function HideModal(){
            
                var completeSerial = ($window.localStorage['CompleteSerial']=="Y")?true:false;

                $window.localStorage['OwnerIndex'] = ""; 
                $window.localStorage['OrderIndex'] = ""; 
                $window.localStorage['TaskItemIndex'] = ""; 
                $window.localStorage['CompleteSerial'] = "N";

                $scope.isSerialHide = true;


                if (completeSerial)
                {
                    $scope.ValidateAndConfirmCarton();
                    console.log("completed serial");
                }else
                {
                    $vm.isFilter = true;
                    console.log("not complete serial");
                }

            }
            $scope.ScanConfirmCarton = function () {
                if ($scope.filterModel.ScanCartonNo != "" && $scope.filterModel.ScanCartonNo != undefined) {

                        
                        $scope.SerialChecking().then(function(){
                            if (!$vm.isSerialRequired || ($vm.isSerialRequired && filterModel.numberOfScan >= 1))
                            {
                            $scope.ValidateAndConfirmCarton();
                            }
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
            $scope.$watch('$vm.isFilter', function() {
                $scope.hideComponent = !(!$vm.isFilter && $scope.isSerialHide);
            });

            $scope.$watch('hideComponent', function() {
                $scope.hideFilter = !($scope.isSerialHide && $scope.hideComponent);
            });
            
            $scope.back = function () {
                var _viewModel = cartAssignFactory;
                _viewModel.setParam("");
                $state.go('tops.cart_assign_picking', {
                })
            }

            $scope.GetProductAttribute = function (model) {
                var deferred = $q.defer();
                var _productViewModel = productFactory;
                _productViewModel.getProductAttributeDAL(model).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error!!"
                        })
                    });

                return deferred.promise;
            }
            $scope.SerialChecking = function(){
                   ///// begin serial checking
                   $scope.productModel = {
                    ProductIndex : $scope.filterModel.productIndex
                };

                var deferred = $q.defer();
                $scope.GetProductAttribute($scope.productModel).then(function success(res) {

                    if (res.data.length > 0) {
                        $vm.isSerialRequired = (res.data[0].isSerial.toString() == "1")?true:false;
                    }
                    else {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Invalid Product"
                        })
                        $scope.filterModel.cartonNo = "";
                        document.getElementById("confirmCarton").focus();

                    }

                    if($vm.isSerialRequired)
                    {
                        $window.localStorage['OwnerIndex'] = "8B8B6203-A634-4769-A247-C0346350A963"; 
                        $window.localStorage['OrderIndex'] = $scope.filterModel.planGoodsIssueIndex; 
                        $window.localStorage['TaskItemIndex'] = $scope.filterModel.planGoodsIssueItemIndex; 
                        $window.localStorage['QtyScan'] = $scope.filterModel.numberOfScan; 
                        $window.localStorage['CompleteSerial'] = "N";

                        $scope.$broadcast("initChild");
                        $scope.isSerialHide = false;
                        $vm.isFilter = false;
                        
                        
                    }

                    deferred.resolve(res);

                },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Confirm Carton Error!!"
                        });
                        
                    });
                    
                    return deferred.promise;
                    //// end serial checking
            }
            $scope.ValidateAndConfirmCarton = function(){
                $scope.filterModel.userName = $scope.userName
                    $scope.filterModel.isCheckCartonPopup = 1;
                    if ($scope.filterModel.numberOfScan != $scope.filterModel.qty) {
                        var DataList = $scope.filterModel;
                        if ($scope.isLoading) {
                            $vm.isFilter = false;
                            $scope.hideComponent = false;
                            $scope.isLoading(DataList).then(function (param) {
                                $vm.isFilter = true;
                                init();
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    }
                    else {
                        $scope.filterModel.reasonCodeIndex = "00000000-0000-0000-0000-000000000000";
                        $scope.filterModel.reasonCodeId = "";
                        $scope.filterModel.reasonCodeName = "";

                        $vm.isFilter = true;

                        $scope.ConfirmCarton();

                    }
            }
            $scope.ConfirmCarton = function(){

                viewModel.CartDataScanConfirmV2($scope.filterModel).then(function success(res) {
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
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Confirm Carton Error!!"
                        })
                    });
            }

            
            var init = function () {

                $scope.filterModel = {};
                // document.getElementById("myTextBar").focus();
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
                            if (res.data.msgResult == "Drop") {
                                if ($scope.filterModel != null) {
                                    viewModel.setParam(item);
                                    $state.go('tops.put_to_staging', {})
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