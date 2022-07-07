app.component("putawayByLpn", {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/putAway/putAwayByLPN/putawayByLpn.html";
    },
    controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, dpMessageBox, putAwayFactory, locationFactory) {
        var $vm = this;
        var defer = {};
        $scope.putAwayLPN = {};
        var viewModel = putAwayFactory;
        var _viewModel = locationFactory;
        $vm.$onInit = function () {
            console.log("init");
            $scope.userName = localStorageService.get('userTokenStorage');
        }


        this.$onDestroy = function () {

        }
        $scope.goToBack = function () {

        }
        $scope.ScanLPN = function (model) {
            var deferred = $q.defer();

            // if ($scope.putAwayLPN != null) {
            //     $scope.putAwayLPN = {}
            // }
            pageLoading.show();
           
            var items = model;
            
            if($scope.putAwayLPN.chkPalletLocation ){
                $scope.putAwayLPN.locationName = "";
            }
            var items = {
                tagNo: $scope.putAwayLPN.tagNo,
                updateBy: localStorageService.get('userTokenStorage'),
   
            }
            viewModel.RetrieveLocationByProduct(items).then(

                function success(res) {
                    if(parseInt(res.data.statusCode) >= 4000 && parseInt(res.data.statusCode) <= 5999){

                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error.',
                            message: res.data.statusDesc
                        })
                        deferred.reject(response);
                    }else{
                        pageLoading.hide();
                        if (res.data.length != 0) {
                            let countQty = 0;
                            $scope.DataList = res.data.result;
                            $scope.chkLocation = true;
    
                            let item = res.data.result;
    
                        }
                        else {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "LPN No : " + model.tagNo + " not found !!"
                            }).then(function success() {
                                $scope.chkLocation = false;
                                $scope.putAwayLPN = {};
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="putAwayLPN.tagNo"]');
                                    focusElem[0].focus();
    
                                }, 200);
                            });
    
                        };
    
                        $scope.tagnotemp = angular.copy($scope.putAwayLPN.tagNo);
                        deferred.resolve(res);
                       

                    }
                },
                function error(response) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "LPN No Incorrect "
                    })
                    deferred.reject(response);
                });


            return deferred.promise;
        }

        $scope.PutAwayLocation = function (model) {
           
            var deferred = $q.defer();
            pageLoading.show();
            let item ={
                locationName : $scope.putAwayLPN.locationName,
                tagNo: $scope.putAwayLPN.tagNo,
                chkPalletLocation: $scope.putAwayLPN.chkPalletLocation,
            }
            _viewModel.CheckLocation(item).then(
                function success(res) {

                    pageLoading.hide();
                    let item = res.data;
                  
                    checkData(item);

                    deferred.resolve(res);
                },
                function error(response) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Location Incorrect "
                    })
                    deferred.reject(response);
                });
            return deferred.promise;
        }
        function checkData(param) {
            
            if ($scope.putAwayLPN != null) {
                $scope.putAwayLPN = $scope.putAwayLPN;
            };

            if ($scope.putAwayLPN.locationName != "" || $scope.putAwayLPN.locationName != undefined) {
                let item ={
                    locationName : $scope.putAwayLPN.locationName,
                    tagNo: $scope.putAwayLPN.tagNo,
                    chkPalletLocation: $scope.putAwayLPN.chkPalletLocation,
                }
                viewModel.CheckPalletLocationLPN(item).then(
                    function success(res) {


                        $scope.putAwayLPN.chkPalletLocation = res.data;
                        var result = param.filter(function (location) {
                            return location.locationName == $scope.putAwayLPN.locationName;
                        })

                        if (result.length != 0) {
                            for (var i = 0; i <= result.length - 1; i++) {
                                if (result[i].locationIndex != null || result[i].locationIndex != undefined) {
                                    $scope.putAwayLPN.locationIndex = result[i].locationIndex;
                                    $scope.putAwayLPN.locationId = result[i].locationId;
                                    $scope.putAwayLPN.locationName = result[i].locationName;
                                };
                            };
                            $scope.goToSave();
                        }
                        else {
                            $scope.putAwayLPN.locationIndex = undefined;
                            $scope.putAwayLPN.locationId = undefined;
                            $scope.putAwayLPN.locationName = undefined;
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Confirm ?',
                                message: "This Location Can Not found In Database"
                            }).then(function success() {
                                setTimeout(() => {
                                    var focusElem = jQuery('input[ng-model="putAwayLPN.locationName"]');
                                    focusElem[0].focus();
                                }, 200);
                            })
                        }
                    });
            }


        };
        $scope.searchLocation = function () {
            var deferred = $q.defer();
           
            let items = $scope.DataList;
  
            pageLoading.show();
            let item = {
                locationIndex : $scope.DataList.locationIndex,
                locationId : $scope.DataList.locationId,
                locationName : $scope.DataList.locationName,
                tagNO : $scope.putAwayLPN.tagNo,
                updateBy : localStorageService.get('userTokenStorage')
            }
           
            if ($scope.DataList.locationName != null) {
                viewModel.ReSuggest(item).then(
                    function success(res) {
                        if(parseInt(res.data.statusCode) >= 4000 && parseInt(res.data.statusCode) <= 5999){
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Error.',
                                message: res.data.statusDesc
                            })
                             
                        }
                        else{

                        
                            let countQty = 0;
                            $scope.ReSuggestion = res.data.result;
                    

                            $scope.DataList.locationName = res.data.result.locationName;
                            $scope.DataList.locationId = res.data.result.locationId;
                            $scope.DataList.locationIndex = res.data.result.locationIndex
                        
                            
                            pageLoading.hide();
                        }
                    });
            }
            return deferred.promise;
            dpMessageBox.alert({
                ok: 'Close',
                title: 'Information.',
                message: "Location : " + model.tagNo + " not found !!"
            })

        };
        $scope.goToSave = function () {
            var deferred = $q.defer();
            var model = $scope.putAwayLPN;
           
            if (($scope.putAwayLPN.locationName == "" || $scope.putAwayLPN.locationName == undefined) || ($scope.putAwayLPN.tagNo == "" || $scope.putAwayLPN.tagNo == undefined)) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Alert',
                    message: 'โปรดกรอกข้อมูลให้ครบ'
                }).then(function success() {
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="putAwayLPN.locationName"]');
                        focusElem[0].focus();
                    }, 200);
                })
            }
            if ($scope.putAwayLPN.locationIndex == "" || $scope.putAwayLPN.locationIndex == undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Alert',
                    message: 'กรุณา Confirm Location'
                }).then(function success() {
                    setTimeout(() => {
                        var focusElem = jQuery('input[ng-model="putAwayLPN.locationName"]');
                        focusElem[0].focus();
                    }, 200);
                })
            }
            else if ($scope.putAwayLPN.locationName != null && $scope.putAwayLPN.chkPalletLocation == false) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'ตำแหน่งจัดเก็บเกินค่าจำนวนสูงสุดในการเก็บสินค้า ต้องการยืนยันจัดเก็บสินค้าหรือไม่'
                }).then(function () {
                    pageLoading.show();
                    Save(model).then(function success(res) {
                        pageLoading.hide();
                        $scope.DataList = res.data.listGoodsReceiveTagItemPutawayLpnViewModel;
                        $state.reload($state.current.name);
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Confirm',
                            message: 'จัดเก็บสินค้าเสร็จสิ้น'
                        }).then(function success() {
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwayLPN.tagNo"]');
                                focusElem[0].focus();

                            }, 200);
                        });
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            }
            else if ($scope.putAwayLPN.locationName != null && $scope.DataList.locationName == "") {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'ระบบไม่มีการแนะนำตำแหน่ง ต้องการจัดเก็บสินค้าหรือไม่ ?'
                }).then(function () {
                    pageLoading.show();
                    Save(model).then(function success(res) {
                        pageLoading.hide();
                        $scope.DataList = res.data.listGoodsReceiveTagItemPutawayLpnViewModel;
                        $state.reload($state.current.name);
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Confirm',
                            message: 'จัดเก็บสินค้าเสร็จสิ้น'
                        }).then(function success() {
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwayLPN.tagNo"]');
                                focusElem[0].focus();

                            }, 200);
                        });
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            }
            else if ($scope.putAwayLPN.locationName != $scope.DataList.locationName) {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'ต้องการยืนยันจัดเก็บสินค้า ณ ตำแหน่งที่ระบบไม่แนะนำหรือไม่ !'
                }).then(function () {
                    pageLoading.show();
                    Save(model).then(function success(res) {
                        pageLoading.hide();
                        $scope.DataList = res.data.listGoodsReceiveTagItemPutawayLpnViewModel;
                        $state.reload($state.current.name);
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Confirm',
                            message: 'จัดเก็บสินค้าเสร็จสิ้น'
                        }).then(function success() {
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwayLPN.tagNo"]');
                                focusElem[0].focus();

                            }, 200);
                        });
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            }
            else {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    pageLoading.show();
                    Save(model).then(function success(res) {
                        pageLoading.hide();
                        $scope.DataList = res.data.listGoodsReceiveTagItemPutawayLpnViewModel;
                        $state.reload($state.current.name);
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Confirm',
                            message: 'จัดเก็บสินค้าเสร็จสิ้น'
                        }).then(function success() {
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwayLPN.tagNo"]');
                                focusElem[0].focus();

                            }, 200);
                        });
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            }

            return deferred.promise;
        };

        function Save(param) {
            let deferred = $q.defer();
            let item = $scope.DataList;

            let datalist = {
                tagNo: param.tagNo,
                locationId: param.locationId,
                locationName: param.locationName,
                locationIndex: param.locationIndex,
                updateBy:  localStorageService.get('userTokenStorage'),
                ownerId : localStorageService.get('ownerVariableId'),
                ownerIndex : localStorageService.get('ownerVariableIndex'),
                ownerName : localStorageService.get('ownerVariableName'),
                warehouseId : localStorageService.get('warehouseVariableId'),
                warehouseIndex : localStorageService.get('warehouseVariableIndex'),
                warehouseName: localStorageService.get('warehouseVariableName'),
            }
          
            viewModel.Save(datalist).then(
                function success(results) {
                    deferred.resolve(results);
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

    }
})