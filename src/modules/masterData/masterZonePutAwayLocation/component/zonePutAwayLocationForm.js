(function () {
    'use strict'

    app.component('zonePutAwayLocationForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterZonePutAwayLocation/component/zonePutAwayLocationForm.html";
        },
        bindings: {
            onShow: '=?',
            filterModel: '=?',
            searchResultModel: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, zonePutAwayLocationFactory,deptPopupFactory,subDeptPopupFactory,brandPopupFactory,itemStatusFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = zonePutAwayLocationFactory;
            var viewModelDept = deptPopupFactory;
            var viewModelSubDept = subDeptPopupFactory;
            var viewModelBrand = brandPopupFactory;
            var viewModelItem = itemStatusFactory;
            
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
               
                if($scope.filterModel != null){
                    $scope.filterModel = {
                        isDelete : 0,
                        createBy : ""

                    };
                }

               
                $scope.onShow = true;
                if (param != undefined) {
                    
                    // pageLoading.show();
                    // pageLoading.hide();
                    $scope.create = false;
                    $scope.update = true;
                   
                    
                    $scope.filterModel.zonePutAwayLocationId = param.zonePutAwayLocationId
                    $scope.filterModel.zonePutAwayId = param.zonePutAwayId
                    $scope.filterModel.zonePutAwayName = param.zonePutAwayName
                    $scope.filterModel.zonePutAwayIndex = param.zonePutAwayIndex
                    $scope.filterModel.locationIndexFrom = param.locationFromIndex
                    $scope.filterModel.locationIdFrom = param.locationIdFrom
                    $scope.filterModel.locationNameFrom = param.locationNameFrom
                    $scope.filterModel.locationIndexTo = param.locationToIndex
                    $scope.filterModel.locationIdTo = param.locationIdTo
                    $scope.filterModel.locationNameTo = param.locationNameTo
                    $scope.filterModel.warehouseIndex = param.warehouseIndex
                    $scope.filterModel.warehouseId = param.warehouseId
                    $scope.filterModel.warehouseName = param.warehouseName
                    $scope.filterModel.createBy = localStorageService.get('userTokenStorage');
                    $scope.filterModel.ownerIndex = param.ownerIndex
                    $scope.filterModel.ownerId = param.ownerId
                    $scope.filterModel.ownerName = param.ownerName
                    $scope.filterModel.productTypeIndex = param.productTypeIndex
                    $scope.filterModel.productTypeId = param.productTypeId
                    $scope.filterModel.productTypeName = param.productTypeName
                    $scope.filterModel.productSubTypeIndex = param.productSubTypeIndex
                    $scope.filterModel.productSubTypeId = param.productSubTypeId
                    $scope.filterModel.productSubTypeName = param.productSubTypeName
                    $scope.filterModel.brandIndex = param.brandIndex
                    $scope.filterModel.brandId = param.brandId
                    $scope.filterModel.brandName = param.brandName
                    $scope.filterModel.itemStatusIndex = param.itemStatusIndex
                    $scope.filterModel.itemStatusId = param.itemStatusId
                    $scope.filterModel.itemStatusName = param.itemStatusName
                    
                    
                 
                    // viewModel.getId(param).then(function (res) {
                    //     pageLoading.hide();
                    //     $scope.filterModel = res.data.result[0];
                    //     $scope.update = true;
                    // });
                   
                
                }
                else {
                    var model = {
                        userID: localStorageService.get('userTokenStorage')
                    }
                    viewModelDept.popupSearch(model).then(function (res) {
                       pageLoading.hide();
                      
                        $scope.filterModel.isDelete = 0;
                        $scope.filterModel.createBy = localStorageService.get('userTokenStorage')
                        $scope.filterModel.productTypeId = res.data.result[0].productTypeId;
                        $scope.filterModel.productTypeIndex = res.data.result[0].productTypeIndex;
                        $scope.filterModel.productTypeName = res.data.result[0].productTypeName ;
                        // $scope.triggerSearch();
                    });

                    var body ={
                        userID: localStorageService.get('userTokenStorage'),
                        productTypeIndex: "e4c3e666-99bd-4584-935e-b37b399e550f",
                        productSubTypeId: "0000"
                    }

                    // viewModelSubDept.popupSearch(body).then(function (res) {
                        
                    //     pageLoading.hide();
                    //     $scope.filterModel.productSubTypeId = res.data.result[0].productSubTypeId;
                    //     $scope.filterModel.productSubTypeIndex = res.data.result[0].productSubTypeIndex;
                    //     $scope.filterModel.productSubTypeName =  res.data.result[0].productSubTypeName ;
                    // });

                    viewModelBrand.popupSearch(model).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel.brandId = res.data.result[0].brandId;
                        $scope.filterModel.brandIndex = res.data.result[0].brandIndex;
                        $scope.filterModel.brandName = res.data.result[0].brandName;
                    });

                    // viewModelItem.PopupSearch(model).then(function (res) {
                    //     pageLoading.hide();
                       
                    //     $scope.filterModel.itemStatusId = res.data.result[0].itemStatusId;
                    //     $scope.filterModel.itemStatusIndex = res.data.result[0].itemStatusIndex;
                    //     $scope.filterModel.itemStatusName = res.data.result[0].itemStatusName;
                    // });

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
                    $vm.searchResultModel = res.data.result;
                });
            };


            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
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
                       
                        if( !$scope.filterModel.warehouseName || !$scope.filterModel.zonePutAwayLocationId || !$scope.filterModel.locationNameFrom || !$scope.filterModel.locationNameTo ||  !$scope.filterModel.productTypeName  ){
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Validate',
                                message: 'กรุณากรอกข้อมูลให้ครบถ้วน'
                            })
                        }
                       else{
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
                    }
                });
            }


            $scope.back = function () {
                defer.resolve('1');
                $scope.filterModel = {}
                
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.zonePutAwayName == undefined) {
                    msg = ' Zone Name is required !'
                    defer.resolve(msg);
                } 
                defer.resolve(msg);

                return defer.promise;
            }

            function Add(param) {
                let deferred = $q.defer();
                let item = param;
                
                viewModel.add(item).then(
                    function success(results) {
                        if(results.data.statusCode != "200"){
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: results.data.statusDesc
                            })
                        }
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
                        
                        if(results.data.statusCode != "200"){
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: results.data.statusDesc
                            })
                        }
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.popupZone = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZone.onShow = !$scope.popupZone.onShow;
                    $scope.popupZone.delegates.zonePopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.zoneIndex = angular.copy(param.zoneIndex);
                        $scope.filterModel.zoneId = angular.copy(param.zoneId);
                        $scope.filterModel.zoneName = angular.copy(param.zoneId) + " - " + angular.copy(param.zoneName);

                    }
                }
            };

            $scope.popupLocationFrom = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupLocationFrom.onShow = !$scope.popupLocationFrom.onShow;
                    $scope.popupLocationFrom.delegates.locationPopup(param, index);
                },
                config: {
                    title: "location"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.locationIndexFrom = angular.copy(param.locationIndex);
                        $scope.filterModel.locationIdFrom = angular.copy(param.locationId);
                        $scope.filterModel.locationNameFrom = angular.copy(param.locationId) + " - " + angular.copy(param.locationName);
                      
                    }
                }
            };

            $scope.popupLocationTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupLocationTo.onShow = !$scope.popupLocationTo.onShow;
                    $scope.popupLocationTo.delegates.locationPopup(param, index);
                },
                config: {
                    title: "location"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.locationIndexTo = angular.copy(param.locationIndex);
                        $scope.filterModel.locationIdTo = angular.copy(param.locationId);
                        $scope.filterModel.locationNameTo = angular.copy(param.locationId) + " - " + angular.copy(param.locationName);
                      
                    }
                }
            };

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                    $scope.popupOwner.delegates.ownerPopup(param, index);
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex);
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerId) + " - " + angular.copy(param.ownerName);

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));
                    }
                }
            };

            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.onShow;
                    $scope.popupWarehouse.delegates.warehousePopup(param, index);
                },
                config: {
                    title: "Warehouse"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndex = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseId = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseId) + " - " + angular.copy(param.warehouseName);

                    }
                }
            };

            $scope.popupZonePutAway = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZonePutAway.onShow = !$scope.popupZonePutAway.onShow;
                    $scope.popupZonePutAway.delegates.zonePutAwayPopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.zonePutAwayIndex = angular.copy(param.zonePutAwayIndex);
                        $scope.filterModel.zonePutAwayId = angular.copy(param.zonePutAwayId);
                        $scope.filterModel.zonePutAwayName = angular.copy(param.zonePutAwayId) + " - " + angular.copy(param.zonePutAwayName);

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
                    title: "ItemStatus"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.itemStatusIndex = angular.copy(param.itemStatusIndex);
                        $scope.filterModel.itemStatusId = angular.copy(param.itemStatusId);
                        $scope.filterModel.itemStatusName = angular.copy(param.itemStatusName)
                    }
                }
            };

            $scope.popupDept = {
                onShow: false,
                delegates: {
                    
                },
                onClick: function (param, index) {
                    $scope.popupDept.onShow = !$scope.popupDept.onShow;
                    $scope.popupDept.delegates.deptPopup(param, index);
                    
                    if($scope.filterModel.productTypeId !== "0000"){
                        $scope.filterModel.productSubTypeIndex = ""
                        $scope.filterModel.productSubTypeId = ""
                        $scope.filterModel.productSubTypeName = ""
                    }
                    
                },
                config: {
                    title: "Dept"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.productTypeIndex = angular.copy(param.productTypeIndex);
                        $scope.filterModel.productTypeId = angular.copy(param.productTypeId);
                        $scope.filterModel.productTypeName = angular.copy(param.productTypeName);

                        if($scope.filterModel.productTypeId !== "0000"){
                            $scope.filterModel.productSubTypeIndex = ""
                            $scope.filterModel.productSubTypeId = ""
                            $scope.filterModel.productSubTypeName = ""
                        }
                    }
                }
            };

            $scope.popupSubDept = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupSubDept.onShow = !$scope.popupSubDept.onShow;
                    $scope.popupSubDept.delegates.subDeptPopup(param, index, $scope.filterModel.productTypeIndex);
                
                },
                config: {
                    title: "Sub Dept"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {                      
                        $scope.filterModel.productSubTypeIndex = angular.copy(param.productSubTypeIndex);
                        $scope.filterModel.productSubTypeId = angular.copy(param.productSubTypeId);
                        $scope.filterModel.productSubTypeName = angular.copy(param.productSubTypeName);

                    }
                }
            };

            $scope.popupBrand = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupBrand.onShow = !$scope.popupBrand.onShow;
                    $scope.popupBrand.delegates.brandPopup(param, index);
                },
                config: {
                    title: "Brand"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.brandIndex = angular.copy(param.brandIndex);
                        $scope.filterModel.brandId = angular.copy(param.brandId);
                        $scope.filterModel.brandName = angular.copy(param.brandName);

                    }
                }
            };

            var init = function () {
                $scope.filterModel = {}
            
    
            };
            init();
        }
    })
})();