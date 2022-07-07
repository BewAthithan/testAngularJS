(function () {
    'use strict'

    app.component('planForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GR/planGR/component/planForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, planGoodsReceiveFactory, planGoodsReceiveItemFactory, planGoodsIssueItemFactory, ownerFactory) {
            var $vm = this;

            var defer = {};
            var viewModel = planGoodsReceiveFactory;
            var ownerModel = ownerFactory
            $vm.isFilterTable = true;
            $scope.onShow = false;

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            $vm.onShow = function (param) {
                defer = $q.defer();
                $scope.onShow = true;
                if (param != undefined) {
                    viewModel.getId(param.planGoodsReceiveIndex).then(function (res) {
                        $scope.filterModel = res.data;
                        $scope.buttons.add = false;
                        $scope.buttons.update = true;


                        if ($scope.filterModel.documentStatus == 1 || $scope.filterModel.documentStatus == 2 || $scope.filterModel.documentStatus == -1 || $scope.filterModel.documentStatus == 3)
                            $scope.buttons.update = false;

                        planGoodsReceiveItemFactory.getByPlanGoodReceiveId(param.planGoodsReceiveIndex).then(function (res) {
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel = res.data;
                            let CountPlanGRTotalQty = 0
                            
                            for (let index = 0; index < $scope.filterModel.listPlanGoodsReceiveItemViewModel.length; index++) {
                                CountPlanGRTotalQty += $scope.filterModel.listPlanGoodsReceiveItemViewModel[index].qty;                              
                            }
                            $scope.filterModel.CountPlanGRTotalQty = CountPlanGRTotalQty;
                        });
                        planGoodsReceiveItemFactory.GetGoodsReceiveItem(param.planGoodsReceiveIndex).then(function (res) {
                            $scope.filterModel.listGoodsReceiveItemViewModel = res.data;
                            let CountGRTotalQty = 0

                            for (let index = 0; index < $scope.filterModel.listGoodsReceiveItemViewModel.length; index++) {
                                CountGRTotalQty += $scope.filterModel.listGoodsReceiveItemViewModel[index].qty;                              
                            }
                            $scope.filterModel.CountGRTotalQty = CountGRTotalQty;
                        });
                        planGoodsReceiveItemFactory.GetRemainQty(param.planGoodsReceiveIndex).then(function (res) {
                            $scope.filterModel.listRemainQtyViewModel = res.data;
                            let CountRemainTotalQty = 0

                            for (let index = 0; index < $scope.filterModel.listRemainQtyViewModel.length; index++) {
                                CountRemainTotalQty += $scope.filterModel.listRemainQtyViewModel[index].qty;                              
                            }
                            $scope.filterModel.CountRemainTotalQty = CountRemainTotalQty;
                        });

                    });
                }
                else {
                    $scope.buttons.add = true;
                    if ($scope.buttons.add) {
                        ownerModel.popupSearch({}).then(function (res) {
                            let owner = res.data.find(function (value) {
                                return value.ownerIndex.toUpperCase() == "8B8B6203-A634-4769-A247-C0346350A963";
                            })
                            $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                            $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                            $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                            $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');

                            $scope.filterModel.planGoodsReceiveDate = getToday();
                            $scope.filterModel.planGoodsReceiveDueDate = getToday();
                        });
                        $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                        $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                        $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                        $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
                    }
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };
            $scope.show = {
                action: true,
                pagination: true,
                checkBox: false
            }

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }


            $vm.addItem = function (param, index, owner) {
                var owner = $scope.filterModel.ownerIndex;

                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || []
                        if (result != '-99') {
                            if (result.planGoodsReceiveIndex == undefined)
                                result.flagUpdate = true;
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(result));
                        }

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }
            $scope.editItem = function (param, index, owner) {
                var owner = $scope.filterModel.ownerIndex;
                if ($scope.isLoading) {
                    
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {
                        
                        $vm.isFilterTable = true;
                        $scope.filterModel.listPlanGoodsReceiveItemViewModel[result.index] = result;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }
            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }


            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;
                });
            };

            $scope.filter = function () {
                $vm.triggerSearch();
            };

            $scope.add = function () {
                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;

                if (model.ownerName == undefined || model.ownerName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Owner !'
                        }
                    )
                    return "";
                }
                if ((model.vendorName != $scope.filterModel.vendorNameTemp) || model.vendorName == undefined || model.vendorIndex == "") {

                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Supplier !'
                        }
                    )
                    return "";

                }

                if (($scope.filterModel.documentTypeNameTemp == "Transfer from FDC (ASN)" || $scope.filterModel.documentTypeNameTemp == "Transfer from DC (ASN)") && ((model.warehouseName != $scope.filterModel.warehouseNameTemp) || model.warehouseName == undefined || model.warehouseIndex == "")) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose From Warehouse !'
                        }
                    )
                    return "";
                }
                if ((model.warehouseNameTo != $scope.filterModel.warehouseNameToTemp) || model.warehouseNameTo == undefined || model.warehouseIndexTo == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose To Warehouse !'
                        }
                    )
                    return "";
                }
                if ((model.documentTypeName != $scope.filterModel.documentTypeNameTemp) || model.documentTypeName == undefined || model.documentTypeIndex == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose DocumentType !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceiveDate == undefined || model.planGoodsReceiveDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Pre Receiving Date !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceiveDueDate == undefined || model.planGoodsReceiveDueDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Due Date !'
                        }
                    )
                    return "";
                }
                if (listmodel == undefined || listmodel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    for (let index = 0; index < model.listPlanGoodsReceiveItemViewModel.length; index++) {
                        model.listPlanGoodsReceiveItemViewModel[index].uDF1 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueNo;
                        model.listPlanGoodsReceiveItemViewModel[index].uDF4 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueIndex;
                        model.listPlanGoodsReceiveItemViewModel[index].uDF5 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueItemIndex;

                    }
                    Add(model).then(function success(res) {
                        $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                        $state.reload($state.current.name);
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                    defer.resolve();
                    $scope.filterModel = {};
                    $scope.filterModel.planGoodsReceiveDate = getToday();
                    $scope.filterModel.planGoodsReceiveDueDate = getToday();
                }, function error(param) {});

            };

            $scope.edit = function () {
                var model = $scope.filterModel;
                var listmodel = $scope.filterModel.listPlanGoodsReceiveItemViewModel;
                if (model.documentTypeName == undefined || model.documentTypeName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose DocumentType !'
                        }
                    )
                    return "";
                }
                if (model.vendorName == undefined || model.vendorName == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Supplier !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceiveDate == undefined || model.planGoodsReceiveDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose planGoodsReceiveDate !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceiveDueDate == undefined || model.planGoodsReceiveDueDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose planGoodsReceiveDueDate !'
                        }
                    )
                    return "";
                }

                for (let index = 0; index < model.listPlanGoodsReceiveItemViewModel.length; index++) {
                    model.listPlanGoodsReceiveItemViewModel[index].uDF1 = model.planGoodsIssueNo;
                }
                if (listmodel == undefined || listmodel.length == 0) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Error: Add at least 1 Item'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceiveDate == undefined || model.planGoodsReceiveDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Pre Receiving Date !'
                        }
                    )
                    return "";
                }
                if (model.planGoodsReceiveDueDate == undefined || model.planGoodsReceiveDueDate == "") {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose Due Date !'
                        }
                    )
                    return "";
                }
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to save !'
                }).then(function () {
                    viewModel.getId(model.planGoodsReceiveIndex).then(function (res) {
                        if (res.data.userAssign != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })
                            $state.reload();
                        }
                        else {
                            
                            for (let index = 0; index < model.listPlanGoodsReceiveItemViewModel.length; index++) {
                                model.listPlanGoodsReceiveItemViewModel[index].uDF1 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueNo;
                                model.listPlanGoodsReceiveItemViewModel[index].uDF4 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueIndex;
                                model.listPlanGoodsReceiveItemViewModel[index].uDF5 = model.listPlanGoodsReceiveItemViewModel[index].planGoodsIssueItemIndex;
        
                            }
                            Edit(model).then(function success(res) {
                                $vm.filterModel = res.config.data;
                                $vm.searchResultModel = res.config.data;
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                            defer.resolve();
                        }
                    });
                },
                    function error(param) {
                    });
            }


            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.selected = 1;
                $scope.click = 1;

                // if ($scope.buttons.add) {
                // $scope.filterModel.planGoodsReceiveDate = getToday();
                // $scope.filterModel.planGoodsReceiveDueDate = getToday();
                // }
                $scope.userName = localStorageService.get('userTokenStorage');

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            };

            $scope.back = function () {
                $scope.deleteuser = {};
                $scope.deleteuser.planGoodsReceiveIndex = $scope.filterModel.planGoodsReceiveIndex;
                viewModel.deleteUserAssign($scope.deleteuser).then(
                    function success(results) {                        
                        $scope.filterModel = {};
                        defer.resolve('-99');
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
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


            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };


            function Add(param) {
                let deferred = $q.defer();
                let item = $scope.filterModels();
                param.create_By = localStorageService.get('userTokenStorage');
                item = param;
                viewModel.add(item).then(
                    function success(results) {
                        $state.reload();
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
                param.update_By = localStorageService.get('userTokenStorage');
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

            $scope.popupOwner = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'คุณต้องการเปลี่ยน Owner ใช่หรือไม่\n(ข้อมูลสินค้าจะโดนลบ!!)'
                    }).then(function () {
                        $scope.popupOwner.onShow = !$scope.popupOwner.onShow;
                        $scope.popupOwner.delegates.ownerPopup(param, index);
                    }, function error(param) {});
                },
                config: {
                    title: "owner"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        if($scope.filterModel.ownerIndex != angular.copy(param.ownerIndex)) {
                            clear("vendor");
                            clear("listModel");
                            clear("warehouse");
                            clear("warehouseTo");                    
                        }
                        
                        $scope.filterModel.ownerIndex = angular.copy(param.ownerIndex)
                        $scope.filterModel.ownerId = angular.copy(param.ownerId);
                        $scope.filterModel.ownerName = angular.copy(param.ownerName);
                        $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');

                        localStorageService.set('ownerVariableId', angular.copy(param.ownerId));
                        localStorageService.set('ownerVariableIndex', angular.copy(param.ownerIndex));
                        localStorageService.set('ownerVariableName', angular.copy(param.ownerName));

                    }
                }
            };
            

            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, $scope.filterModel.documentTypeName);
                },
                config: {
                    title: "DocumentType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                        $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                        $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                        $scope.filterModel.documentTypeNameTemp = $scope.filterModel.documentTypeName;
                    }
                }
            };
            $scope.popupVendor = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.ownerIndex != null) {
                        index = $scope.filterModel.ownerIndex;
                    };
                    $scope.popupVendor.onShow = !$scope.popupVendor.onShow;
                    $scope.popupVendor.delegates.vendorPopupFilter(index, $scope.filterModel.vendorName);
                },
                config: {
                    title: "vendor"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.vendorIndex = angular.copy(param.vendorIndex);
                        $scope.filterModel.vendorId = angular.copy(param.vendorId);
                        $scope.filterModel.vendorName = angular.copy(param.vendorName);
                        $scope.filterModel.vendorNameTemp = $scope.filterModel.vendorName;
                    }
                }
            };
            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.onShow;
                    $scope.popupWarehouse.delegates.warehousePopup(param, $scope.filterModel.warehouseName);
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
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseName);
                        $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');

                        localStorageService.set('warehouseVariableId', angular.copy(param.warehouseId));
                        localStorageService.set('warehouseVariableIndex', angular.copy(param.warehouseIndex));
                        localStorageService.set('warehouseVariableName', angular.copy(param.warehouseName));
                    }
                }
            };
            $scope.popupWarehouseTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupWarehouseTo.onShow = !$scope.popupWarehouseTo.onShow;
                    $scope.popupWarehouseTo.delegates.warehouseToPopup(param, $scope.filterModel.warehouseNameTo);
                },
                config: {
                    title: "WarehouseTo"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.warehouseIndexTo = angular.copy(param.warehouseIndex);
                        $scope.filterModel.warehouseIdTo = angular.copy(param.warehouseId);
                        $scope.filterModel.warehouseNameTo = angular.copy(param.warehouseName);
                        $scope.filterModel.warehouseNameToTemp = $scope.filterModel.warehouseNameTo;
                    }
                }
            };

            $scope.popupPlanGi = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    index = 2;
                    $scope.popupPlanGi.onShow = !$scope.popupPlanGi.onShow;
                    $scope.popupPlanGi.delegates.planGiPopup($scope.filterModel.documentTypeName, index);
                },
                config: {
                    title: "PlanGI"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.planGoodsIssueIndex = angular.copy(param.planGoodsIssueIndex);
                        $scope.filterModel.planGoodsIssueNo = angular.copy(param.planGoodsIssueNo);
                        $scope.filterModel.planGoodsIssueNoTemp = $scope.filterModel.planGoodsIssueNo;

                        if ($scope.filterModel.listPlanGoodsReceiveItemViewModel == undefined)
                            $scope.filterModel.listPlanGoodsReceiveItemViewModel = [];

                        planGoodsIssueItemFactory.GetPlanGoodsIssueItemPopup($scope.filterModel).then((response) => {
                            if (response.data) {
                                var checkSO = $scope.filterModel.listPlanGoodsReceiveItemViewModel.find(function (checkSO) {
                                    return checkSO.planGoodsIssueIndex == response.data[0].planGoodsIssueIndex;
                                })

                                if (checkSO == undefined) {
                                    for (let index = 0; index < response.data.length; index++) {
                                        if (response.data[index].qty != 0) {
                                            $scope.filterModel.listPlanGoodsReceiveItemViewModel.push(angular.copy(response.data[index]));
                                        }
                                    }
                                }

                                // $scope.filterModel.listPlanGoodsReceiveItemViewModel = $scope.filterModel.listPlanGoodsReceiveItemViewModel || [];
                                // $scope.filterModel.listPlanGoodsReceiveItemViewModel = response.data;

                            }


                        }, (error) => {
                            console.log(error);
                        })
                    }
                }
            };

            function clear(modal) {
                switch(modal) {
                    case "owner":
                        $scope.filterModel.ownerId = null;
                        $scope.filterModel.ownerIndex = null;
                        $scope.filterModel.ownerName = null;
                        $scope.filterModel.ownerNameTemp = null;
                        break;
                    case "warehouse":
                        $scope.filterModel.warehouseId = null;
                        $scope.filterModel.warehouseIndex = null;
                        $scope.filterModel.warehouseName = null;
                        $scope.filterModel.warehouseNameTemp = null;
                        break;
                    case "warehouseTo":
                        $scope.filterModel.warehouseIndexTo = null;
                        $scope.filterModel.warehouseIdTo = null;
                        $scope.filterModel.warehouseNameTo = null;
                        $scope.filterModel.warehouseNameToTemp = null;
                        break;
                    case "vendor":
                        $scope.filterModel.vendorIndex = null;
                        $scope.filterModel.vendorId = null;
                        $scope.filterModel.vendorName = null;
                        $scope.filterModel.vendorNameTemp = null;
                        break;
                    case "listModel":
                        $scope.filterModel.listPlanGoodsReceiveItemViewModel = [];
                        break;
                    default:
                }
            }


            var init = function () {
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');

            };
            init();
        }
    })
})();