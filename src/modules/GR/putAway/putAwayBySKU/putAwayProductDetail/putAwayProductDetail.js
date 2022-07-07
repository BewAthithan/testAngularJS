app.component('putawayProductDetail', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GR/putAway/putAwayBySKU/putAwayProductDetail/putAwayProductDetail.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        config: '=',
        isItem: "=?",
    },
    controller: function ($scope, $q, $filter, $http, $state, pageLoading, dpMessageBox, localStorageService, putAwayFactory, locationFactory, productConversionBarcodeFactory) {
        var $vm = this;
        var viewModel = putAwayFactory;
        var viewModelProductBarcode = productConversionBarcodeFactory;

        this.$onInit = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
        }

        this.$onDestroy = function () {

        }
        $scope.buttons = {
            save: true,
            update: false,
            back: true
        };
        //เลือกได้แต่ SuggestLocation ที่ระบบแนะนำ---------------------------------

        // $scope.PutAwayLocation = function (model) {                   
        //     var deferred = $q.defer();
        //     let item = $vm.searchResultModel;
        //     pageLoading.show();
        //     let count = 0;
        //     for (var i = 0; i <= item.length - 1; i++) {
        //         if (model.locationName == item[i].suggestLocation) {
        //             count++;
        //         }


        //         if (item[i].suggestLocation != model.locationName) {
        //             $scope.buttons.save = false;
        //         }
        //         else {
        //             $scope.buttons.save = true;
        //         };
        //     };
        //     if (count > 1) {
        //         $scope.popupLocation.onClick(item);
        //     }
        //     // dpMessageBox.confirm({
        //     //     ok: 'Yes',
        //     //     cancel: 'No',
        //     //     title: 'Confirm ?',
        //     //     message: "'Do you want to Confirm this Location !"
        //     // })            
        //     $scope.putAwaySku.locationName = model.locationName;
        //     pageLoading.hide();
        //     return deferred.promise;
        // }
        $scope.CheckProductBarcode = function (model) {
            viewModelProductBarcode.scanProductCon($scope.putAwaySku.productBarcode).then(
                function success(results) {
                    if (results.data.length > 0)
                    {
                        $scope.putAwaySku.productIndex = results.data[0].productIndex;
                        $scope.putAwaySku.productID = results.data[0].productId;
                        $scope.putAwaySku.productName = results.data[0].productName;
                        

                        var found = $vm.filterModel.find(function (element) {
                            return element.productId == $scope.putAwaySku.productID;
                        });
                        
                        if (found == undefined ) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Alert',
                                message: 'ไม่พบ Product Barcode เลขนี้บน LPN ปัจจุบัน'
                            });

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwaySku.productBarcode"]');
                                focusElem[0].focus();        
                            }, 200);
                        }else
                        {
                            $vm.location_id = found.suggestLocation;
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwaySku.locationName"]');
                                focusElem[0].focus();        
                            }, 200);
                        }
                        
                    }else
                    {
                        $scope.putAwaySku.productIndex = '';
                        $scope.putAwaySku.productID = '';
                        $scope.putAwaySku.productName = '';

                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " Product Barcode is invalid "
                        })
                    }
                },
                function error(response) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " Product Barcode is invalid "
                    })
                }
            );
        }

        $scope.PutAwayLocation = function (model) {
            let item = $scope.putAwaySku;
                       
            var deferred = $q.defer();
            locationFactory.CheckPutAwayLocation(model).then(
                function success(res) {
                    console.log(res);
                    pageLoading.hide();
                    let item = res.data;
                    var found1 = item.find(function (element) {
                        return element.locationName == "";
                    });                    
                    
                    if (item == "" || item == null || item === undefined) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Alert',
                            message: "ไม่พบ Location ในระบบ"
                        }).then(function success(){
                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwaySku.locationName"]');
                                focusElem[0].focus();        
                            }, 200);
                        });     
                        model.locationName = "";
                        return;
                    }
                    else {
                        checkData(item);
                    }
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
            
            $vm.filterModel;
            if ($scope.putAwaySku != null) {
                $scope.putAwaySku = $scope.putAwaySku;                
                var found = $vm.filterModel.find(function (element) {
                    return element.productId == $scope.putAwaySku.productID;
                });
                
                if (found == undefined) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Alert',
                        message: 'ไม่บน Product Barcode นี้บน LPN ปัจจุบัน'
                    })
                }
                else {
                    
                    if(found.suggestLocation != $scope.putAwaySku.locationName)
                    {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'ยืนยัน Direct Putaway หรือไม่'
                        }).then(function () {
                            if (param.length != 0) {
                                
                                for (var i = 0; i <= param.length - 1; i++) {
                                    if (param[i].locationIndex != null || param[i].locationIndex != undefined) {
                                        $scope.putAwaySku.locationIndex = param[i].locationIndex;
                                        $scope.putAwaySku.locationId = param[i].locationId;
                                        $scope.putAwaySku.locationName = param[i].locationName;
                                        $scope.putAwaySku.locationNameTemp = $scope.putAwaySku.locationName;
                                    };
                                };
                            }
                            $scope.goToSave();
                        });
                    }else
                    {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'ต้องการยืนยันจัดเก็บสินค้า ณ ตำแหน่งที่ระบบแนะนำหรือไม่'
                        }).then(function () {
                            if (param.length != 0) {
                                
                                for (var i = 0; i <= param.length - 1; i++) {
                                    if (param[i].locationIndex != null || param[i].locationIndex != undefined) {
                                        $scope.putAwaySku.locationIndex = param[i].locationIndex;
                                        $scope.putAwaySku.locationId = param[i].locationId;
                                        $scope.putAwaySku.locationName = param[i].locationName;
                                        $scope.putAwaySku.locationNameTemp = $scope.putAwaySku.locationName;
                                    };
                                };
                            }
                            $scope.goToSave();
                        });
                    }
                    
                }
                return;
            }
            else {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Alert',
                    message: "ไม่พบ Location ในระบบ"
                })
            };
        };

        

        $scope.goToSave = function () {
            var deferred = $q.defer();
            $scope.putAwaySku = $scope.putAwaySku || {};
            var model = $scope.putAwaySku;
            
            model.locationName = model.locationName != model.locationNameTemp ? model.locationName = '' : model.locationName;
                        
            if (model == "" || model == null || model === undefined || model.locationName == "" || model.locationName === undefined) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Alert',
                    message: 'ไม่สามารถ Save ได้เนื่องจากยังไม่ได้ทำการ Confirm Location'
                })
                return "";
            }
            else {                
                    pageLoading.show();
                    Save(model).then(function success(res) {
                        pageLoading.hide();
                        var lpn = res.config.data.listGoodsReceiveTagItemPutawaySkuViewModel[0].tagNo;
                        var chkputaway = true;
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Confirm',
                            message: 'จัดเก็บสินค้าเสร็จสิ้น'
                        }).then(function success(){
                            $scope.putAwaySku.productIndex = '';
                            $scope.putAwaySku.productID = '';
                            $scope.putAwaySku.productName = '';
                            $vm.location_id = '';

                            setTimeout(() => {
                                var focusElem = jQuery('input[ng-model="putAwaySku.productBarcode"]');
                                focusElem[0].focus();        
                            }, 200);
                        });                  
                              
                        $scope.putAwaySku = {};
                        $vm.triggerSearch(lpn,chkputaway);
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
               
            }
            return deferred.promise;
        };

        function Save(param) {

            let deferred = $q.defer();
            let item = $vm.searchResultModel;
            if (param != null) {
                
                var found = $vm.filterModel.find(function (element) {
                    return element.productId == $scope.putAwaySku.productID;
                });
                  
                // for (var i = 0; i <= item.length - 1; i++) {
                //     item[i].qty = param.qty;
                //     item[i].locationName = param.locationName;
                //     item[i].createBy = localStorageService.get('userTokenStorage');
                //     item[i].updateBy = localStorageService.get('userTokenStorage');
                // } 
            }   
            
            
            let dataList = {
                listGoodsReceiveTagItemPutawaySkuViewModel: [found]
            }
            dataList.listGoodsReceiveTagItemPutawaySkuViewModel.map(function(element) {                
                element.qty = param.qty;
                element.locationName = param.locationName;
                element.createBy = localStorageService.get('userTokenStorage');
                element.updateBy = localStorageService.get('userTokenStorage');
                element.locationIndex = param.locationIndex;
                element.ownerId = localStorageService.get('ownerVariableId');
                element.ownerIndex = localStorageService.get('ownerVariableIndex');
                element.ownerName = localStorageService.get('ownerVariableName');
                element.warehouseId = localStorageService.get('warehouseVariableId');
                element.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                element.warehouseName = localStorageService.get('warehouseVariableName');
                return element;
              });
              
            
            viewModel.SaveSku(dataList).then(
                function success(results) {
                    deferred.resolve(results);
                    if(parseInt(results.data.statusCode) >= 4000 && parseInt(results.data.statusCode) <= 5999) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Error.',
                            message: results.data.statusDesc
                        });
                    }
                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        $scope.popupLocation = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                $scope.popupLocation.onShow = !$scope.popupLocation.onShow;
                $scope.popupLocation.delegates.suggestLocationPopup(param);
            },
            config: {
                title: "Suggest Location"
            },
            invokes: {
                selected: function (param) {
                    $scope.putAwaySku.tagIndex = angular.copy(param.tagIndex);
                    $scope.putAwaySku.tagItemIndex = angular.copy(param.tagItemIndex);
                    $scope.putAwaySku.locationName = angular.copy(param.suggestLocation);

                    // $scope.putAwaySku.CatchWeight = angular.copy(param.CatchWeight);



                }
            }
        };
    }
});