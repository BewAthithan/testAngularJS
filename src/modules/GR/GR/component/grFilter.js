(function () {
    'use strict';
    app.component('grFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GR/GR/component/grFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, localStorageService, dpMessageBox, commonService, goodsReceiveFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = goodsReceiveFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {             
                $vm.filterModel = $vm.filterModel || {};
                
                $vm.filterModel.goodsReceiveDate = getToday();
                viewModel.grSearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();       
                    $vm.filterModel.goodsReceiveDate = undefined;
                    
                    if (res.data.length != 0) {
                        
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                        
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                        $vm.filterModel.perPage = res.data.pagination.perPage;   
                        $vm.filterModel.numPerPage = res.data.pagination.perPage;   
                        
                        if (res.paginations != null || res.paginations != undefined) {
                            $vm.filterModel.totalRow = paginations.totalRow;
                        }                  
                    
                        $vm.searchResultModel = res.data.itemsGR;       
                    }
                    else {
                        
                        $vm.searchResultModel = res.data.itemsGR;
                    }
                });
            };
            
            $scope.toggleSearch = function () {
                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };

            $scope.filter = function () {
                //$vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };
            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

        

            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                $scope.filterModel.RefDocumentNo = $scope.filterModel.planGoodsReceiveNo;
                $scope.filterModel.RefDocumentindex = $scope.filterModel.planGoodsReceiveIndex;

                if (param.create_Date == "" && param.create_DateTo == "" && (param.RefDocumentNo === undefined || param.RefDocumentNo == "") && (param.RefDocumentindex === undefined || param.RefDocumentindex !== undefined) && (param.RefDocumentNo === undefined || param.RefDocumentNo == "") && (param.goodsReceiveNo === undefined || param.goodsReceiveNo == "")
                    && (param.ownerIndex === undefined || param.ownerIndex !== undefined) && (param.ownerName === undefined || param.ownerName == "") && (param.goodsReceiveDate === undefined || param.goodsReceiveDate == "") && (param.goodsReceiveDateTo === undefined || param.goodsReceiveDateTo == "") && (param.documentStatus === undefined || param.documentStatus !== undefined) && (param.documentTypeIndex === undefined || param.documentTypeIndex !== undefined) && (param.documentTypeName === undefined || param.documentTypeName == "")
                    && (param.warehouseIndex === undefined || param.warehouseIndex !== undefined) && (param.warehouseName === undefined || param.warehouseName == "") && (param.warehouseIndexTo === undefined || param.warehouseIndexTo !== undefined) && (param.warehouseNameTo === undefined || param.warehouseNameTo == "") && (param.dockDoorIndex === undefined || param.dockDoorIndex !== undefined) && (param.dockDoorName === undefined || param.dockDoorName == "")
                    && (param.vehicleTypeIndex === undefined || param.vehicleTypeIndex !== undefined) && (param.vehicleTypeName === undefined || param.vehicleTypeName == "") && (param.processStatusIndex === undefined || param.processStatusIndex !== undefined) && (param.processStatusName === undefined || param.processStatusName == "") && (param.containerTypeIndex === undefined || param.containerTypeIndex !== undefined) && (param.containerTypeName === undefined || param.containerTypeName == "")
                    && (param.productIndex === undefined || param.productIndex !== undefined) && (param.productName === undefined || param.productName == ""))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {                     
                        viewModel.grSearch(param).then(
                            function success(res) {
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else {
                    
                    viewModel.grSearch(param).then(
                        function success(res) {
                            deferred.resolve(res);
                        },
                        function error(response) {
                            deferred.reject(response);
                        });
                }
                return deferred.promise;
            }
            $scope.filterSearch = function () {
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.columnName = $vm.filterModel.columnName;
                $scope.filterModel.orderby = $vm.filterModel.orderby;
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    // $scope.filterModel = res.data.atcom;
                    //$vm.searchResultModel = res.data;
                    $vm.searchResultModel = res.data.itemsGR;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                    $vm.filterModel.perPage = res.data.pagination.perPage;   
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;   


                }, function error(res) { });
            }

            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();
                $state.reload();
                $window.scrollTo(0, 0);
            }

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
                onClick: function (param, index, chk) {
                    chk = "1";
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypeGRPopup(param, index, chk);
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
                        $scope.filterModel.warehouseName = angular.copy(param.warehouseName);
                        $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');

                        localStorageService.set('warehouseVariableId', angular.copy(param.warehouseId));
                        localStorageService.set('warehouseVariableIndex', angular.copy(param.warehouseIndex));
                        localStorageService.set('warehouseVariableName', angular.copy(param.warehouseName));
                    }
                }
            };
            $scope.popupPlanGr = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    index = "1"
                    $scope.popupPlanGr.onShow = !$scope.popupPlanGr.onShow;
                    $scope.popupPlanGr.delegates.planGrPopup(param, index);
                },
                config: {
                    title: "PlanGr"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.planGoodsReceiveIndex = angular.copy(param.planGoodsReceiveIndex);
                        $scope.filterModel.planGoodsReceiveNo = angular.copy(param.planGoodsReceiveNo);
                        $scope.filterModel.planGoodsReceiveNoTemp = $scope.filterModel.planGoodsReceiveNo;
                    }
                }
            };

            $scope.popupWarehouseTo = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouseTo.onShow = !$scope.popupWarehouseTo.onShow;
                    $scope.popupWarehouseTo.delegates.warehouseToPopup(param, index);
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

            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    $scope.popupProduct.delegates.productPopup(param, index);
                },
                config: {
                    title: "product"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.productIndex = angular.copy(param.productIndex);
                        $scope.filterModel.productId = angular.copy(param.productId);
                        $scope.filterModel.productName = angular.copy(param.productName);
                        $scope.filterModel.productNameTemp = $scope.filterModel.productName;

                    }
                }
            };
            $scope.popupDockDoor = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupDockDoor.onShow = !$scope.popupDockDoor.onShow;
                    $scope.popupDockDoor.delegates.dockDoorPopup(param, index);
                },
                config: {
                    title: "DockDoor"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.dockDoorIndex = angular.copy(param.dockDoorIndex);
                        $scope.filterModel.dockDoorId = angular.copy(param.dockDoorName);
                        $scope.filterModel.dockDoorName = angular.copy(param.dockDoorName);
                        $scope.filterModel.dockDoorNameTemp = $scope.filterModel.dockDoorName;
                    }
                }
            };

            $scope.popupVehicleType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupVehicleType.onShow = !$scope.popupVehicleType.onShow;
                    $scope.popupVehicleType.delegates.vehicleTypePopup(param, index);
                },
                config: {
                    title: "VehicleType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.vehicleTypeIndex = angular.copy(param.vehicleTypeIndex);
                        $scope.filterModel.vehicleTypeId = angular.copy(param.vehicleTypeId);
                        $scope.filterModel.vehicleTypeName = angular.copy(param.vehicleTypeName);
                        $scope.filterModel.vehicleTypeNameTemp = $scope.vehicleTypeName;
                    }   
                }
            };

            $scope.popupContainerType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupContainerType.onShow = !$scope.popupContainerType.onShow;
                    $scope.popupContainerType.delegates.containerTypePopup(param, index);
                },
                config: {
                    title: "VehicleType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.containerTypeIndex = angular.copy(param.containerTypeIndex);
                        $scope.filterModel.containerTypeId = angular.copy(param.containerTypeId);
                        $scope.filterModel.containerTypeName = angular.copy(param.containerTypeName);
                        $scope.filterModel.containerTypeNameTemp = $scope.filterModel.containerTypeName;
                    }
                }
            };

            $scope.popupStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    index = 2;
                    $scope.popupStatus.onShow = !$scope.popupStatus.onShow;
                    $scope.popupStatus.delegates.statusPopup(param, index);
                },
                config: {
                    title: "Status"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.filterModel.processStatusIndex = angular.copy(param.processStatusIndex);
                        $scope.filterModel.documentStatus = angular.copy(param.processStatusId);
                        $scope.filterModel.processStatusName = angular.copy(param.processStatusName);
                        $scope.filterModel.processStatusNameTemp = $scope.filterModel.processStatusName;
                    }
                }
            };

            //Check CreateDate----------------------------
            $scope.$watch('filterModel.create_Date', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.create_Date != undefined && $scope.filterModel.create_DateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.create_Date.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.create_DateTo.replace(pattern, '$1-$2-$3'));
                }
                // var ds = Date.parse($scope.filterModel.planGoodsReceiveDate.replace(pattern, '$1-$2-$3'));
                // var de = Date.parse($scope.filterModel.planGoodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                if (ds > de) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.create_Date = $scope.filterModel.create_DateTo;
                }

            })
            $scope.$watch('filterModel.create_DateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.create_Date != undefined && $scope.filterModel.create_DateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.create_Date.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.create_DateTo.replace(pattern, '$1-$2-$3'));
                }
                // var ds = Date.parse($scope.filterModel.planGoodsReceiveDate.replace(pattern, '$1-$2-$3'));
                // var de = Date.parse($scope.filterModel.planGoodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                if (de < ds) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.create_DateTo = $scope.filterModel.create_Date;
                }
            })

            //Check GRDate----------------------------
            $scope.$watch('filterModel.goodsReceiveDate', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.goodsReceiveDate != undefined && $scope.filterModel.goodsReceiveDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.goodsReceiveDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                }
                if (ds > de) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsReceiveDate = $scope.filterModel.goodsReceiveDateTo;
                }

            })
            $scope.$watch('filterModel.goodsReceiveDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.goodsReceiveDate != undefined && $scope.filterModel.goodsReceiveDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.goodsReceiveDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.goodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                }
                // var ds = Date.parse($scope.filterModel.planGoodsReceiveDueDate.replace(pattern, '$1-$2-$3'));
                // var de = Date.parse($scope.filterModel.planGoodsReceiveDueDateTo.replace(pattern, '$1-$2-$3'));
                if (de < ds) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.goodsReceiveDateTo = $scope.filterModel.goodsReceiveDate;
                }
            })

            //Clear Index
            $scope.$watch('filterModel.ownerName', function () {
                if($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp)
                {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.warehouseName', function () {
                if($scope.filterModel.warehouseName != $scope.filterModel.warehouseNameTemp)
                {
                    $scope.filterModel.warehouseIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.warehouseNameTo', function () {
                if($scope.filterModel.warehouseNameTo != $scope.filterModel.warehouseNameToTemp)
                {
                    $scope.filterModel.warehouseIndexTo = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.processStatusName', function () {
                if($scope.filterModel.processStatusName != $scope.filterModel.processStatusNameTemp)
                {                    
                    $scope.filterModel.processStatusIndex = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentStatus = null;
                }
            })
            $scope.$watch('filterModel.documentTypeName', function () {
                if($scope.filterModel.documentTypeName != $scope.filterModel.documentTypeNameTemp)
                {
                    $scope.filterModel.documentTypeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.productName', function () {
                if($scope.filterModel.productName != $scope.filterModel.productNameTemp)
                {
                    $scope.filterModel.productIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.planGoodsReceiveNo', function () {
                if($scope.filterModel.planGoodsReceiveNo != $scope.filterModel.planGoodsReceiveNoTemp)
                {
                    $scope.filterModel.planGoodsReceiveIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.dockDoorName', function () {
                if($scope.filterModel.dockDoorName != $scope.filterModel.dockDoorNameTemp)
                {
                    $scope.filterModel.dockDoorIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.vehicleTypeName', function () {
                if($scope.filterModel.vehicleTypeName != $scope.filterModel.vehicleTypeNameTemp)
                {
                    $scope.filterModel.vehicleTypeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.containerTypeName', function () {
                if($scope.filterModel.containerTypeName != $scope.filterModel.containerTypeNameTemp)
                {
                    $scope.filterModel.containerTypeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            

            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            this.$onInit = function () {
                // $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

        }
    });

})();