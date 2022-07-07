(function () {
    'use strict';
    app.component('planFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GR/planGR/component/planFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, localStorageService, commonService, planGoodsReceiveFactory) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = planGoodsReceiveFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                
                $vm.filterModel = $vm.filterModel || {};
                $vm.filterModel.planGoodsReceiveDate =  getToday();
                pageLoading.show();            
                  
                viewModel.planGrsearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();             
                    $vm.filterModel.planGoodsReceiveDate =  getToday();       
                    
                    if (res.data.length != 0) {                        
                        $scope.filterModel.perPage = $vm.filterModel.perPage;
                        $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        
                        if (res.data.pagination != null || res.data.pagination != undefined) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                        }                  
                    
                        $vm.searchResultModel = res.data.itemsPlanGR;                    
                    }
                    else {
                        
                        $vm.searchResultModel = res.data.itemsPlanGR;
                    }
                });
            };
            $scope.toggleSearch = function () {
                
                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };

            $scope.filter = function () {
                
                $vm.triggerSearch();
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };


            //Check PlanGRDate----------------------------
            $scope.$watch('filterModel.planGoodsReceiveDate', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.planGoodsReceiveDate != undefined && $scope.filterModel.planGoodsReceiveDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.planGoodsReceiveDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                }
                // var ds = Date.parse($scope.filterModel.planGoodsReceiveDate.replace(pattern, '$1-$2-$3'));
                // var de = Date.parse($scope.filterModel.planGoodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                if (ds > de) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsReceiveDate = $scope.filterModel.planGoodsReceiveDateTo;
                }

            })
            $scope.$watch('filterModel.planGoodsReceiveDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.planGoodsReceiveDate != undefined && $scope.filterModel.planGoodsReceiveDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.planGoodsReceiveDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                }
                // var ds = Date.parse($scope.filterModel.planGoodsReceiveDate.replace(pattern, '$1-$2-$3'));
                // var de = Date.parse($scope.filterModel.planGoodsReceiveDateTo.replace(pattern, '$1-$2-$3'));
                if (de < ds) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsReceiveDateTo = $scope.filterModel.planGoodsReceiveDate;
                }
            })

            //Check PlanGRDueDate----------------------------
            $scope.$watch('filterModel.planGoodsReceiveDueDate', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.planGoodsReceiveDueDate != undefined && $scope.filterModel.planGoodsReceiveDueDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.planGoodsReceiveDueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsReceiveDueDateTo.replace(pattern, '$1-$2-$3'));
                }
                if (ds > de) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsReceiveDueDate = $scope.filterModel.planGoodsReceiveDueDateTo;
                }

            })
            $scope.$watch('filterModel.planGoodsReceiveDueDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if ($scope.filterModel.planGoodsReceiveDueDate != undefined && $scope.filterModel.planGoodsReceiveDueDateTo != undefined) {
                    var ds = Date.parse($scope.filterModel.planGoodsReceiveDueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsReceiveDueDateTo.replace(pattern, '$1-$2-$3'));
                }
                // var ds = Date.parse($scope.filterModel.planGoodsReceiveDueDate.replace(pattern, '$1-$2-$3'));
                // var de = Date.parse($scope.filterModel.planGoodsReceiveDueDateTo.replace(pattern, '$1-$2-$3'));
                if (de < ds) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsReceiveDueDateTo = $scope.filterModel.planGoodsReceiveDueDate;
                }
            })

            //Clear Index
            $scope.$watch('filterModel.vendorName', function () {
                if($scope.filterModel.vendorName != $scope.filterModel.vendorNameTemp)
                {
                    $scope.filterModel.vendorIndex = "";
                }
            })
            $scope.$watch('filterModel.ownerName', function () {
                if($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp)
                {
                    $scope.filterModel.ownerIndex = "";
                }
            })
            $scope.$watch('filterModel.documentTypeName', function () {
                if($scope.filterModel.documentTypeName != $scope.filterModel.documentTypeNameTemp)
                {
                    $scope.filterModel.documentTypeIndex = "";
                }
            })
            $scope.$watch('filterModel.processStatusName', function () {
                if($scope.filterModel.processStatusName != $scope.filterModel.processStatusNameTemp)
                {                    
                    $scope.filterModel.processStatusIndex = "";
                    $scope.filterModel.documentStatus = null;
                }
            })
            $scope.$watch('filterModel.warehouseName', function () {
                if($scope.filterModel.warehouseName != $scope.filterModel.warehouseNameTemp)
                {
                    $scope.filterModel.warehouseIndex = "";
                }
            })
            $scope.$watch('filterModel.warehouseNameTo', function () {
                if($scope.filterModel.warehouseNameTo != $scope.filterModel.warehouseNameToTemp)
                {
                    $scope.filterModel.warehouseIndexTo = "";
                }
            })
            



            $scope.searchFilter = function (param) {
                
                var deferred = $q.defer();                    
                if (param.planGoodsReceiveDate == "" && param.planGoodsReceiveDateTo == "" && (param.planGoodsReceiveNo === undefined || param.planGoodsReceiveNo == "")
                    && (param.vendorIndex === undefined || param.vendorIndex !== undefined) && (param.vendorName == "" || param.vendorName === undefined) && (param.ownerIndex === undefined || param.ownerIndex !== undefined) && param.planGoodsReceiveDueDate === undefined
                    && param.planGoodsReceiveDueDateTo === undefined && (param.documentTypeIndex === undefined || param.documentTypeIndex !== undefined ) && (param.documentTypeName == "" || param.documentTypeName === undefined) && (param.processStatusIndex === undefined || param.processStatusIndex !== undefined) && (param.processStatusName === undefined || param.processStatusName == "")
                    && (param.warehouseIndex === undefined || param.warehouseIndex !== undefined) && (param.warehouseName == "" || param.warehouseName === undefined) && (param.warehouseIndexTo === undefined || param.warehouseIndexTo !== undefined) && (param.warehouseNameTo == "" || param.warehouseNameTo === undefined))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {
                        
                        viewModel.planGrsearch(param).then(
                            function success(res) {
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else                          
                {
                    
                    viewModel.planGrsearch(param).then(
                        function success(res) {
                            deferred.resolve(res);
                        },
                        function error(response) {
                            deferred.reject(response);
                        });       
                }                                
                return deferred.promise;
            };
            $scope.filterSearch = function () {
                
                $scope.filterModel = $scope.filterModel || {};          
                $scope.filterModel.columnName = ($vm.filterModel.columnName === undefined || $vm.filterModel.columnName == "") ? $scope.columnName = "" : $vm.filterModel.columnName;               
                $scope.filterModel.orderBy = ($vm.filterModel.orderBy === undefined || $vm.filterModel.orderBy == "") ? $scope.filterModel.orderBy = "" : $vm.filterModel.orderBy;                 
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;  
                          
                $scope.searchFilter($scope.filterModel).then(function success(res) {                    
                    $vm.searchResultModel = res.data.itemsPlanGR;
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                    $vm.filterModel.perPage = res.data.pagination.perPage;                                    
                                   
                }, function error(res) { });
            };
            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterModel.planGoodsReceiveDate = getToday();
                $scope.filterModel.planGoodsReceiveDateTo = getToday();
                $state.reload();
                $window.scrollTo(0, 0);
            }
            // ----------------------------------------------------
            // This local function
            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
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

            

            function initialize() {
            };

            this.$onInit = function () {
                $scope.filterModel = {};
                $scope.filterModel.planGoodsReceiveDate = getToday();
                $scope.filterModel.planGoodsReceiveDateTo = getToday();
                $scope.userName = localStorageService.get('userTokenStorage');
                $vm.filterModel.columnName = "";
                $vm.filterModel.orderBy = "";

                $scope.filterModel.ownerId = localStorageService.get('ownerVariableId');
                $scope.filterModel.ownerIndex = localStorageService.get('ownerVariableIndex');
                $scope.filterModel.ownerName = localStorageService.get('ownerVariableName');
                $scope.filterModel.ownerNameTemp = localStorageService.get('ownerVariableName');
                
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');

                initialize();
            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

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

            $scope.popupVendor = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupVendor.onShow = !$scope.popupVendor.onShow;
                    $scope.popupVendor.delegates.vendorPopup(param, index);
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
            $scope.popupDocumentType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {  
                                      
                    $scope.popupDocumentType.onShow = !$scope.popupDocumentType.onShow;
                    $scope.popupDocumentType.delegates.documentTypePopup(param, index);
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

            $scope.popupPlanGrType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupPlanGrType.onShow = !$scope.popupPlanGrType.onShow;
                    $scope.popupPlanGrType.delegates.planGrTypePopup(param, index);
                },
                config: {
                    title: "planGrType"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.planGrTypeIndex = angular.copy(param.planGrTypeIndex);
                        $scope.filterModel.planGrTypeId = angular.copy(param.planGrTypeId);
                        $scope.filterModel.planGrTypeName = angular.copy(param.planGrTypeName);
                        $scope.filterModel.planGrTypeNameTemp = $scope.filterModel.planGrTypeName;
                    }
                }
            };         

            $scope.popupStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    
                    index = 1;
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


        }
    });

})();