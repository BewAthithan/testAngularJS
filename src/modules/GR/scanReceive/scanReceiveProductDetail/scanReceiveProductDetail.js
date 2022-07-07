(function () {
    'use strict';
    app.component('scanReceiveProductDetail', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GR/scanReceive/scanReceiveProductDetail/scanReceiveProductDetail.html";
        },
        bindings: {
            scanReceive: '=?',
            onShow: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, scanReceiveFactory, goodsReceiveFactory, userFactory) {
            var $vm = this;
            var defer = {};
            var viewModel = scanReceiveFactory;

            $vm.$onInit = function () {
                $vm = this;
                setTimeout(() => {
                    $("#documentNo").focus();
                }, 300);
                if ($vm.scanReceive.GoodsReceiveNo != undefined) {
                    $vm.scanReceive.product_Index = undefined;
                    $vm.scanReceive.TagIndex = undefined;
                    $vm.scanReceive.product_Index = undefined;
                    $vm.scanReceive.productName = undefined;
                    $vm.scanReceive.productSecondName = undefined;
                    $vm.scanReceive.Tag_No = "";
                    $vm.scanReceive.qty = "";
                    $vm.scanReceive.productConversionName = "";
                    $vm.scanReceive.productqty = "";
                    $vm.scanReceive.uomBase = "";
                    $vm.scanReceive.ItemStatusName = "";
                    $vm.scanReceive.remark = undefined;
                    $vm.scanReceive.productBarcode = "";
                    $vm.scanReceive.suggestLocation = "";
                }
                $scope.userName = localStorageService.get('userTokenStorage');
            }

            this.$onDestroy = function () {

            }
            $scope.goToBack = function () {

            }

            $vm.scanReceive.chk = "true"
            $scope.scanreceivealready = false

            $scope.clear = function () {
                $vm.scanReceive = {};
                $state.reload();
                $window.scrollTo(0, 0);
                $vm.scanReceive.chk = "true"
                $scope.scanreceivealready = false
            }

            $scope.ScanDocument = function (model) {
                var deferred = $q.defer();
                viewModel.scanGR(model).then(
                    function success(res) {

                        if(res.data.length > 0) {
                            model.goodsReceiveIndex = res.data[0].goodsReceiveIndex;
                            model.documentTypeIndex = res.data[0].documentTypeIndex;
                            model.userAssign = $scope.userName;
                            viewModel.updateUserAssign(model).then(function (data) {
                                $vm.scanReceive.chk = "true"
                                deferred.resolve(res);
                            });
                        } else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "GoodsReceiveNo not found !!"
                            })
    
                            $vm.scanReceive.chk = "false"
                            $vm.scanReceive.GoodsReceiveNo = undefined;
                            $vm.scanReceive.ownerIndex = undefined;
                            $vm.scanReceive.goodsReceiveIndex = undefined;
                        }                        
                        
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "GoodsReceiveNo not found !!"
                        })

                        $vm.scanReceive.chk = "false"
                        $vm.scanReceive.GoodsReceiveNo = undefined;
                        $vm.scanReceive.ownerIndex = undefined;
                        $vm.scanReceive.goodsReceiveIndex = undefined;
                    });

                return deferred.promise;
            }

            $scope.ScanDocumentNo = function () {
                $scope.scanreceivealready = false
                $vm.scanReceive = $vm.scanReceive || {};
                $scope.ScanDocument($vm.scanReceive).then(function success(res) {
                    if (res.data[0].goodsReceiveIndex != undefined) {
                        $vm.scanReceive.product_Index = null;
                        $vm.scanReceive.productIndex = "00000000-0000-0000-0000-000000000000";
                        $vm.scanReceive.productName = null;
                        $vm.scanReceive.productSecondName = null;
                        $vm.scanReceive.productConversionName = null;
                        $vm.scanReceive.productqty = null;
                        $vm.scanReceive.ItemStatusName = "";
                        $vm.scanReceive.productConversionName = "";
                        $vm.scanReceive.product_Index = undefined;
                        $vm.scanReceive.TagIndex = undefined;
                        $vm.scanReceive.Tag_No = "";
                        $vm.scanReceive.productBarcode = null;
                        $vm.scanReceive.uomBase = null;
                        $vm.scanReceive.suggestLocation = "";
                        $vm.scanReceive.qty = null;
                        $vm.scanReceive.Remark = null;
                    }

                    $vm.scanReceive.ownerIndex = res.data[0].ownerIndex;
                    $vm.scanReceive.goodsReceiveIndex = res.data[0].goodsReceiveIndex;
                    $vm.scanReceive.GoodsReceiveNoTemp = res.data[0].goodsReceiveNo;
                    if (!$scope.chkInternal) {
                        $vm.scanReceive.goodsReceiveIndex = res.data[0].goodsReceiveIndex;
                        // setTimeout(() => {
                        //     var focusElem = jQuery('input[ng-model="$vm.scanReceive.productBarcode"]');
                        //     focusElem[0].focus();

                        // }, 200);
                        document.getElementById("scanProduct").focus();
                        document.getElementById("scanProduct").select();
                    } else {
                        setTimeout(() => {
                            var focusElem = jQuery('input[ng-model="$vm.scanReceive.ProductId"]');
                            focusElem[0].focus();

                        }, 200);
                    }
                },
                    function error(res) {
                    });
            }


            $scope.ScanProductIndex = function () {
                $scope.scanreceivealready = false;
                $vm.scanReceive = $vm.scanReceive || {};
                $vm.scanReceive.chkInternal = $scope.chkInternal;
                $vm.scanReceive.total = null;
                // document.getElementById("tagOutPickNo1").disabled = true;

                $scope.ScanProduct($vm.scanReceive).then(function success(res) {

                    console.log(res);

                    $vm.scanReceive.product_Index = res.data[0].product_Index;
                    $vm.scanReceive.productIndex = res.data[0].product_Index;
                    $vm.scanReceive.productName = res.data[0].product_Name;
                    // capital
                    $vm.scanReceive.ProductConversionIndex = res.data[0].productConversion_Index;
                    $vm.scanReceive.ProductConversionId = res.data[0].productConversion_Id;
                    $vm.scanReceive.ProductConversionName = res.data[0].productConversion_Name;
                    $vm.scanReceive.uomBase = res.data[0].baseProductConversion;
                    // small
                    $vm.scanReceive.productConversionIndex = res.data[0].productConversion_Index;
                    $vm.scanReceive.productConversionId = res.data[0].productConversion_Id;
                    $vm.scanReceive.productConversionName = res.data[0].productConversion_Name;
                    // capital
                    $vm.scanReceive.ProductId = res.data[0].product_Id;
                    // small
                    $vm.scanReceive.productId = res.data[0].product_Id;
                    $vm.scanReceive.productSecondName = res.data[0].product_SecondName;
                    $vm.scanReceive.ProductThirdName = res.data[0].product_ThirdName;
                    $vm.scanReceive.IsLot = res.data[0].isLot;
                    $vm.scanReceive.IsExpDate = res.data[0].isExpDate;
                    $vm.scanReceive.IsMfgDate = res.data[0].isMfgDate;
                    $vm.scanReceive.isCatchWeight = res.data[0].isCatchWeight;
                    $vm.scanReceive.productConversionRatio = res.data[0].productConversion_Ratio;
                    $vm.scanReceive.productitemlife_y = res.data[0].productItemLife_Y;
                    $vm.scanReceive.productitemlife_m = res.data[0].productItemLife_M;
                    $vm.scanReceive.productitemlife_d = res.data[0].productItemLife_D;
                    $vm.scanReceive.suggestLocation = res.data[0].suggestLocation;
                    $vm.scanReceive.userName = localStorageService.get('userTokenStorage');
                    $vm.scanReceive.userGroupName = localStorage.getItem('userGroupName');
                    


                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.scanReceive.Tag_No"]');
                        focusElem[0].focus();

                    }, 200);

                    $scope.ScanGRItem($vm.scanReceive).then(function success(res) {

                        $vm.scanReceive.ratio = res.data[0].ratio;
                        $vm.scanReceive.goodsReceiveItemIndex = res.data[0].goodsReceiveItemIndex;
                        $vm.scanReceive.ItemStatusIndex = res.data[0].itemStatusIndex;
                        $vm.scanReceive.ItemStatusId = res.data[0].itemStatusId;
                        $vm.scanReceive.ItemStatusName = res.data[0].itemStatusName;
                        $vm.scanReceive.Volume = res.data[0].volume;
                        $vm.scanReceive.Weight = res.data[0].weight;
                        $vm.scanReceive.productqty = res.data[0].totalQty;
                        
                        // $vm.scanReceive.productConversionRatio = res.data[0].ratio;
                        // $vm.scanReceive.productConversionIndex = res.data[0].productConversionIndex;
                        // $vm.scanReceive.productConversionId = res.data[0].productConversionId;
                        // $vm.scanReceive.productConversionName = res.data[0].productConversionName;
                    }
                    
                    );
                });
                function error(res) {
                }
            }



            $scope.ScanGRItem = function (model) {
                var deferred = $q.defer();
                viewModel.checkGoodReceiveItem(model).then(
                    function success(res) {
                        if (res.data.length <= 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "ไม่พบสินค้า !!"
                            })
                            // $scope.scanreceivealready = true;
                            $vm.scanReceive.product_Index = null;
                            $vm.scanReceive.productName = null;
                            $vm.scanReceive.productSecondName = null;
                            $vm.scanReceive.uomBase = null;
                            $vm.scanReceive.productConversionName = null;
                            $vm.scanReceive.productqty = null;
                            $vm.scanReceive.product_Index = undefined;
                            $vm.scanReceive.suggestLocation = "";

                        }
                        else if (res.data.length > 1) {

                            var GoodReceive = res.data[0];
                            
                            $scope.popupGoodReceive.onClick(GoodReceive);
                            // deferred.resolve(res)
                        }

                        deferred.resolve(res);
                    },
                    function error(response) {
                        $scope.scanreceivealready = true
                        $vm.scanReceive.product_Index = null;
                        $vm.scanReceive.productName = null;
                        $vm.scanReceive.productSecondName = null;
                        $vm.scanReceive.uomBase = null;
                        $vm.scanReceive.productConversionName = null;
                        $vm.scanReceive.productqty = null;
                        $vm.scanReceive.product_Index = undefined;
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.ScanProduct = function (model) {
                var deferred = $q.defer();

                viewModel.ProductBarcode(model).then(
                    function success(res) {
                        if (res.data.length <= 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Not found!!"
                            })
                        }

                        $vm.scanReceive.product_Index = null;
                        $vm.scanReceive.productName = null;
                        $vm.scanReceive.productSecondName = null;
                        $vm.scanReceive.productConversionName = null;
                        $vm.scanReceive.productqty = null;
                        $vm.scanReceive.ItemStatusName = "";
                        $vm.scanReceive.ProductId = null;
                        $vm.scanReceive.uomBase = null;
                        $vm.scanReceive.suggestLocation = "";


                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }


            $scope.ScanLpn = function (model) {
                var deferred = $q.defer();
                viewModel.CheckTAG(model).then(
                    function success(res) {
                       // console.log(res.data)
                        $scope.tag_no = {};
                        $scope.tag_no = res.data.result.length != 0 ? res.data.result[0].tag_No : "";

                        if ($vm.scanReceive.Tag_No == "" || $vm.scanReceive.Tag_No == null) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'โปรดระบุเลข LPN'
                            }).then(function success() {
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="$vm.scanReceive.Tag_No"]');
                                    focusElem[0].focus();

                                }, 200);
                            });
                        }

                        if ($scope.tag_no == "false") {
                            dpMessageBox.alert({
                                ok: 'Yes',
                                title: 'Cant Create LPN',
                                message: 'ไม่สามารถสร้าง LPN ได้เนื่องจาก Format ไม่ถูกต้อง'
                            }).then(function success() {
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="$vm.scanReceive.Tag_No"]');
                                    focusElem[0].focus();

                                }, 200);
                            });
                            $vm.scanReceive.TagIndex = undefined;
                            return "";
                        }
                        if ($scope.tag_no == "CannotSave") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'LPN มีการใช้งานอยู่'
                            }).then(function success() {
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="$vm.scanReceive.Tag_No"]');
                                    focusElem[0].focus();

                                }, 200);
                            });
                            $vm.scanReceive.TagIndex = undefined;
                            return "";
                        }
                        if ($vm.scanReceive.Tag_No != "" && res.data.length <= 0) {
                            dpMessageBox.confirm({
                                ok: 'Yes',
                                cancel: 'No',
                                title: 'Tag No not found',
                                message: 'Do you want to Create LPN ?'
                            }).then(function success() {
                                $vm.scanReceive.create_By = localStorageService.get('userTokenStorage');
                                viewModel.CreateScanLPN($vm.scanReceive).then(function success(results) {


                                    $scope.ScanLpnNo()
                                    deferred.resolve(results);


                                }, function error(res) { });
                            });
                        }
                        deferred.resolve(res);
                    },
                    function error(results) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Tag No not found !!"
                        })
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.ScanLpnNo = function () {

                $vm.scanReceive = $vm.scanReceive || {};
                $scope.ScanLpn($vm.scanReceive).then(function success(res) {
                    
                    if (res.data != 0) {
                        $vm.scanReceive.TagIndex = res.data.result[0].tag_Index;
                        $vm.scanReceive.TagNo = res.data.result[0].tag_No;
                    }
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="$vm.scanReceive.qty"]');
                        focusElem[0].focus();

                    }, 500);
                }, function error(res) { });
            }


            $scope.ScanQty = function (model) {          
                var deferred = $q.defer();

                $vm.scanReceive.EXPDate = "";
                $vm.scanReceive.MFGDate = "";
                $vm.scanReceive.ProductLot = "";
                $vm.scanReceive.CatchWeight = "";
                $vm.scanReceive.chkrequire = undefined;             

                viewModel.CheckReceiveQty(model).then(
                    function success(results) {
                        if ($vm.scanReceive.qty == 0) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'ไม่สามารถกรอก QTY เป็น 0 ได้'
                            }).then(function success(res) {
                                $vm.scanReceive.qty = null;
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="$vm.scanReceive.qty"]');
                                    focusElem[0].focus();
                                }, 500);
                            });
                        }
                        else if (results.data == false) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: 'QTY เกินไม่สามารถ SAVE ได้'
                            })
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="$vm.scanReceive.qty"]');
                                focusElem[0].focus();
                            }, 500);
                        }
                        else if (results.data == true) {
                            $vm.scanReceive.total = results.config.data.qty * results.config.data.productConversionRatio;
                            $scope.goToSave();
                        }
                    },
                    function error(response) {
                        deferred.reject(response);
                    });
                return deferred.promise;
            }

            $scope.ScanCReceiveQty = function () {
                $vm.scanReceive = $vm.scanReceive || {};

                $scope.ScanQty($vm.scanReceive).then(function success(res) {}, function error(res) {});
            }

            $scope.$watch('$vm.scanReceive.productConversionName', function () {
                if (($vm.scanReceive.productConversionName != undefined && $vm.scanReceive.productConversionName != "") && ($vm.scanReceive.qty != undefined && $vm.scanReceive.qty != "")) {
                    $scope.ScanCReceiveQty();

                }
            })
            $scope.$watch('chkInternal', function () {
                if ($scope.chkInternal == true) {
                    $vm.scanReceive.ProductBarcode = "";
                    $vm.scanReceive.ProductId = "";
                }
                else {
                    $vm.scanReceive.ProductId = "";
                    $vm.scanReceive.ProductBarcode = "";
                }
            })


            $scope.goToSave = function () {
                var model = $vm.scanReceive;
                if ((model.total <= 0 || model.total == undefined) || model.qty === undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: 'ไม่ สามารถ SAVE ได้กรุณาตรวจสอบข้อมูล'
                    })
                }
                else if (((model.EXPDate == undefined || model.EXPDate == "") && $vm.scanReceive.IsExpDate == 1) || ((model.MFGDate == undefined || model.MFGDate == "") && $vm.scanReceive.IsMfgDate == 1)
                    || ((model.ProductLot == undefined || model.ProductLot == "") && $vm.scanReceive.IsLot == 1) || ((model.CatchWeight == undefined || model.CatchWeight == "") && $vm.scanReceive.isCatchWeight == 1)) {
                    if ($vm.scanReceive.chkrequire == undefined) {
                        $scope.popupMaster.onClick();
                        $vm.scanReceive.chkrequire = true;
                    }
                    else {
                        if ((model.EXPDate == undefined || model.EXPDate == "") && $vm.scanReceive.IsExpDate == 1) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'กรุณากรอกข้อมูล Exp Date'
                            }).then(
                                function success() {
                                    $scope.popupMaster.onClick();
                                }
                            )
                        }
                        else if ((model.MFGDate == undefined || model.MFGDate == "") && $vm.scanReceive.IsMfgDate == 1) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'กรุณากรอกข้อมูล MFG Date'
                            }).then(
                                function success() {
                                    $scope.popupMaster.onClick();
                                }
                            )
                        }
                        else if ((model.ProductLot == undefined || model.ProductLot == "") && $vm.scanReceive.IsLot == 1) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'กรุณากรอกข้อมูล Lot'
                            }).then(
                                function success() {
                                    $scope.popupMaster.onClick();
                                }


                            )
                        }

                        else if ((model.CatchWeight == undefined || model.CatchWeight == "") && $vm.scanReceive.isCatchWeight == 1) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'กรุณากรอกข้อมูล CatchWeight'
                            }).then(
                                function success() {
                                    $scope.popupMaster.onClick();
                                }

                            )
                        }
                    }

                }
                else {
                    
                    Add(model).then(function success(res) {}, function error(param) {
                        $vm.scanReceive.chk = "true"
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                }
            }

            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();

                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            function Add(param) {

                let deferred = $q.defer();
                let item = param;
                
                item.createBy = localStorageService.get('userTokenStorage');
                item.weight = param.CatchWeight;
                console.log(item);
                viewModel.SaveTag(item).then(
                    function success(results) {

                        console.log(results);                        

                        if (results.data == ""  ) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'QTY เกินไม่สามารถ SAVE ได้'
                            })
                        }
                    
                        else {
                            $scope.filterModel = results.config.data;
                            $scope.searchResultModel = results.config.data;
                            deferred.resolve(results);
                            
                                   
                            if(results.data.statusCode == 200 || results.data.statusCode == 201) {
                                $scope.ScanDocumentNo();
                                var index, masterRequire = {};
                                masterRequire.results = results.data;
                                $scope.popupMaster.delegates.masterRequirePopup(param, index, masterRequire);
                            } else {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: results.data.statusDesc
                                })
                                var index, masterRequire = {};
                                masterRequire.productyear = $vm.scanReceive.productitemlife_y;
                                masterRequire.productmonth = $vm.scanReceive.productitemlife_m;
                                masterRequire.productday = $vm.scanReceive.productitemlife_d;
                                masterRequire.isExpDate = $vm.scanReceive.IsExpDate;
                                masterRequire.isMfgDate = $vm.scanReceive.IsMfgDate;
                                masterRequire.isLot = $vm.scanReceive.IsLot;
                                masterRequire.isCatchWeight = $vm.scanReceive.isCatchWeight;
                                masterRequire.documentTypeIndex = $vm.scanReceive.documentTypeIndex;
                                masterRequire.results = results.data;
                                $scope.popupMaster.delegates.masterRequirePopup(param, index, masterRequire);
                            }
                        }        
                    },
                    function error(response) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Alert',
                            message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
                        })
                    }
                );
                return deferred.promise;
            }

            $scope.popupProductConversion = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($vm.scanReceive.product_Index != null) {
                        index = $vm.scanReceive.product_Index;
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

                        $vm.scanReceive.productConversionIndex = angular.copy(param.productConversionIndex);
                        $vm.scanReceive.productConversionId = angular.copy(param.productConversionId);
                        $vm.scanReceive.productConversionName = angular.copy(param.productConversionName);
                        $vm.scanReceive.productConversionRatio = angular.copy(param.productConversionRatio);

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
                        $vm.scanReceive.ItemStatusIndex = angular.copy(param.itemStatusIndex);
                        $vm.scanReceive.ItemStatusId = angular.copy(param.itemStatusId);
                        $vm.scanReceive.ItemStatusName = angular.copy(param.itemStatusName);
                    }
                }
            };

            $scope.popupGoodReceive = {
                onShow: false,
                delegates: {},
                onClick: function (GoodReceive, index, productIndex) {
                    
                    if ($vm.scanReceive.goodsReceiveIndex != null) {
                        index = $vm.scanReceive.goodsReceiveIndex;
                        productIndex = $vm.scanReceive.product_Index;
                    };
                    $scope.popupGoodReceive.onShow = !$scope.popupGoodReceive.onShow;
                    $scope.popupGoodReceive.delegates.goodReceivePopup(GoodReceive, index, productIndex);

                },
                config: {
                    title: "GoodReceive"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        if (param.close == true) {
                            // small
                            $vm.scanReceive.product_Index = null;
                            $vm.scanReceive.productName = null;
                            $vm.scanReceive.productSecondName = null;
                            $vm.scanReceive.productConversionName = null;
                            $vm.scanReceive.productqty = null;
                            // capital
                            $vm.scanReceive.Product_Index = null;
                            $vm.scanReceive.ProductName = null;
                            $vm.scanReceive.ProductSecondName = null;
                            $vm.scanReceive.ProductConversionName = null;
                            $vm.scanReceive.Productqty = null;
                            $vm.scanReceive.ItemStatusName = "";
                            // small
                            $vm.scanReceive.productConversionName = "";
                            $vm.scanReceive.product_Index = undefined;
                            $vm.scanReceive.productId = null;
                            // capital
                            $vm.scanReceive.ProductConversionName = "";
                            $vm.scanReceive.Product_Index = undefined;
                            $vm.scanReceive.ProductId = null;
                            $vm.scanReceive.uomBase = null;
                            $vm.scanReceive.suggestLocation = "";
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="$vm.scanReceive.productBarcode"]');
                                focusElem[0].focus();
                            }, 200);
                        }
                        else {
                            $vm.scanReceive.goodsReceiveIndex = angular.copy(param.goodsReceiveIndex);
                            $vm.scanReceive.goodsReceiveItemIndex = angular.copy(param.goodsReceiveItemIndex);
                            // small
                            $vm.scanReceive.productName = angular.copy(param.productName);
                            $vm.scanReceive.productSecondName = angular.copy(param.productSecondName);
                            $vm.scanReceive.productConversionIndex = angular.copy(param.productConversionIndex);
                            $vm.scanReceive.productConversionId = angular.copy(param.productConversionId);
                            $vm.scanReceive.productConversionName = angular.copy(param.productConversionName);
                            // capital
                            $vm.scanReceive.ProductName = angular.copy(param.productName);
                            $vm.scanReceive.ProductSecondName = angular.copy(param.productSecondName);
                            $vm.scanReceive.ProductConversionIndex = angular.copy(param.productConversionIndex);
                            $vm.scanReceive.ProductConversionId = angular.copy(param.productConversionId);
                            $vm.scanReceive.ProductConversionName = angular.copy(param.productConversionName);
                            $vm.scanReceive.ItemStatusIndex = angular.copy(param.itemStatusIndex);
                            $vm.scanReceive.ItemStatusId = angular.copy(param.itemStatusId);
                            $vm.scanReceive.ItemStatusName = angular.copy(param.itemStatusName);
                            $vm.scanReceive.Volume = angular.copy(param.volume);
                            $vm.scanReceive.Weight = angular.copy(param.weight);
                            $vm.scanReceive.ratio = angular.copy(param.ratio);
                            // small
                            $vm.scanReceive.productConversionRatio = param.ratio;
                            $vm.scanReceive.productqty = angular.copy(param.totalQty);
                            // capital
                            $vm.scanReceive.ProductConversionRatio = param.ratio;
                            $vm.scanReceive.Productqty = angular.copy(param.totalQty);
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="$vm.scanReceive.Tag_No"]');
                                focusElem[0].focus();
                            }, 200);
                        }
                    }
                }
            };

            $scope.popupMaster = {
                onShow: false,
                delegates: {},
                onClick: function (param, index, masterRequire) {

                    $scope.masterRequire = $scope.masterRequire || {};
                    $scope.masterRequire.productyear = $vm.scanReceive.productitemlife_y;
                    $scope.masterRequire.productmonth = $vm.scanReceive.productitemlife_m;
                    $scope.masterRequire.productday = $vm.scanReceive.productitemlife_d;
                    $scope.masterRequire.isExpDate = $vm.scanReceive.IsExpDate;
                    $scope.masterRequire.isMfgDate = $vm.scanReceive.IsMfgDate;
                    $scope.masterRequire.isLot = $vm.scanReceive.IsLot;
                    $scope.masterRequire.isCatchWeight = $vm.scanReceive.isCatchWeight;
                    $scope.masterRequire.documentTypeIndex = $vm.scanReceive.documentTypeIndex;
                    var masterRequire = $scope.masterRequire;
                    $scope.popupMaster.onShow = !$scope.popupMaster.onShow;
                    $scope.popupMaster.delegates.masterRequirePopup(param, index, masterRequire);
                    
                },
                config: {
                    title: "masterRequire"
                },
                invokes: {
                    selected: function (param) {

                  

                        

                        if(param.overrideBtn == true && param.checkAuth == true) {
                            $vm.scanReceive.checkOverride = true;
                            $vm.scanReceive.checkAuth = true;
                            $vm.scanReceive.Username = param.username;
                            $vm.scanReceive.UserPassword = param.password;
                            if( $vm.scanReceive.Username == undefined || $vm.scanReceive.UserPassword == undefined){
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: "กรุณากรอก Username หรือ Password"
                                })
                            }
                            userFactory.addUser($vm.scanReceive).then(function success(results) {
                               
                                $vm.scanReceive.userGroupName = results.data.userGroupName;
                                $vm.scanReceive.userName = results.data.userName;
                                $scope.goToSave($vm.scanReceive);
                            }, function error(response) {deferred.reject(response); });
                        } else {

                            if(param.overrideBtn == true) {
                                $vm.scanReceive.checkOverride = true;
                            } else {
                                $vm.scanReceive.checkOverride = false;
                            }

                            if (param === undefined) {
                                $vm.scanReceive.MFGDate = null;
                                $vm.scanReceive.EXPDate = null;
                                $vm.scanReceive.ProductLot = null;
                                $vm.scanReceive.CatchWeight = null;
                            }
                            else {
                                
                                $vm.scanReceive.MFGDate = angular.copy(param.MfgDate);
                                $vm.scanReceive.EXPDate = angular.copy(param.ExpDate);
                                
                                $vm.scanReceive.ProductLot = angular.copy(param.Lot);
                                $vm.scanReceive.CatchWeight = angular.copy(param.CatchWeight);
    
                             
                            }
                            
                            if($vm.scanReceive.EXPDate) var Exp = parseInt($vm.scanReceive.EXPDate.substring(0, 4));
                            if($vm.scanReceive.MFGDate) var Mfg = parseInt($vm.scanReceive.MFGDate.substring(0, 4));
                             
                            
                            if (Exp < 2000 && Exp != "" ) {
                               
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Alert',
                                    message: 'ระบุวันไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง'
                                }).then(
                                    function success() {
                                        
                                        $vm.scanReceive.EXPDate = "";
                                        $scope.popupMaster.onClick();
                                    })
                                return "";
    
                            }
                            else if (Mfg < 2000 && Mfg != "") {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Alert',
                                    message: 'ระบุวันไม่ถูกต้อง กรุณาระบุใหม่อีกครั้ง'
                                }).then(
                                    function success() {
    
                                        $vm.scanReceive.MFGDate = "";
                                        $scope.popupMaster.onClick();
                                    })
                                return "";
                            }
    
                            $scope.goToSave($vm.scanReceive);
                        }
                        
                        
                    }
                }
            };

            $scope.Deleteuser = function () {

                $scope.deleteuser = {};
                $scope.deleteuser.goodsReceiveIndex = $vm.scanReceive.goodsReceiveIndex;
                viewModel.deleteUserAssign($scope.deleteuser).then(
                    function success(results) {

                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
            }

            $("#documentNo").bind("focus", function () {
                setTimeout(() => {
                    $("#documentNo").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#documentNo").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    $("#focusScanLocation").focus();
                }
            });

            $("#scanProduct").bind("focus", function () {
                setTimeout(() => {
                    $("#scanProduct").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#scanProduct").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    $("#focusScanLocation").focus();
                }
            });

            $("#lpnNo").bind("focus", function () {
                setTimeout(() => {
                    $("#lpnNo").removeAttr("readonly");
                }, 200);
            }).bind("blur", function () {
                $("#lpnNo").attr("readonly", "readonly");
            }).bind("keydown", function (e) {
                if (e.key == "Enter") {
                    $("#focusScanLocation").focus();
                }
            });

            $("#visibleField").bind("focus", function (e) {
                // silently shift the focus to the hidden select box
                $("#hiddenField").focus();
                $("#cursorMeasuringDiv").css("font", $("#visibleField").css("font"));
            });

            // whenever the user types on his keyboard in the select box
            // which is natively supported for jumping to an <option>
            $("#hiddenField").bind("keypress", function (e) {
                // get the current value of the readonly field
                var currentValue = $("#visibleField").val();
                // and append the key the user pressed into that field
                if (e.key != "Enter") {
                    $("#visibleField").val(currentValue + e.key);
                    $("#cursorMeasuringDiv").text(currentValue + e.key);
                }
                else {
                    $("#visibleField").val(currentValue);
                    $("#cursorMeasuringDiv").text(currentValue);
                }
                // POpOz set scope
                var scope = angular.element(document.getElementById("cursorMeasuringDiv")).scope();
                scope.filterModel.tagOutPickNo = currentValue;
                scope.filterModel.eevent = e.key;
                scope.$apply();
                // measure the width of the cursor offset
                var offset = 3;
                var textWidth = $("#cursorMeasuringDiv").width();
                $("#hiddenField").css("marginLeft", Math.min(offset + textWidth, $("#visibleField").width()));

            });

            $scope.$watch('$vm.scanReceive.qty', function () {
                if ($vm.scanReceive.qty < 0)
                    $vm.scanReceive.qty = 0
            })

            var init = function () {

                $q.all([
                ]).then(function (values) {
                    var results = values;
                }, function (reasons) {
                    var results = reasons;
                });
            };

            function getExpDate(ExpDate) {
                var ExpDate = ExpDate.toDate();
                ExpDate.add(y, 'years');
                var today = ExpDate.toDate();
                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();
                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;
                return today.toString();
            }
        }
    })
})();