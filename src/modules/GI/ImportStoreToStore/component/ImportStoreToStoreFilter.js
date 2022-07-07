(function () {
    'use strict';
    app.component('importStoreToStoreFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/ImportStoreToStore/component/ImportStoreToStoreFilter.html";
        },
        bindings: {
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            searchResultModel: '=?',
            pickupFileResultModel: '=?',
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, dpMessageBox, commonService, importStoreToStoreFactory, localStorageService, webServiceAPI) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var model = $scope.filterModel;

            var viewModel = importStoreToStoreFactory;

            $vm.triggerSearch = function () {
                pageLoading.show();
                if($vm.filterModel.chkinitpage) {
                    $scope.filterSearch()
                } else {
                    $vm.filterModel.totalRow = 0;
                    $vm.filterModel.currentPage = 1;
                    $vm.filterModel.numPerPage = 1;
                    $vm.filterModel.num = 10;
                    $vm.filterModel.maxSize = 10;
                    $vm.filterModel.perPage = 30;
                }
            };

            $scope.toggleSearch = function () {
                
                $vm.filterModel.advanceSearch = !$vm.filterModel.advanceSearch;
            };

            $scope.filter = function () {
                
                $vm.triggerSearch();
            };

            $scope.header = {
                Search: true
            };

            $scope.hide = function () {
                $scope.header.Search = $scope.header.Search === false ? true : false;
            };

            $scope.pickupFile = function () {
                if(!$scope.filterModel.documentTypeId) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Please Select Sale Order Type',
                        message: 'กรุณาเลือก Sale Order Type'
                    });
                } else {
                    document.getElementById("pickup_excel").click();
                }                
            };

            $scope.getFilePickup = function (event) {
                // console.log($scope);
                if(!$scope.filterModel.documentTypeId) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Please Select Sale Order Type',
                        message: 'กรุณาเลือก Sale Order Type'
                    });
                    document.getElementById("pickup_excel").value = null;
                } else {
                    // console.log("get file", event.target.files[0]);
                    let formData = new FormData();
                    formData.append('File', event.target.files[0]);
                    formData.append('CreateBy', localStorage.getItem("ls.userTokenStorage"));
                    // console.log($scope.filterModel.documentTypeId);
                    formData.append('OrderType', $scope.filterModel.documentTypeId);
                    // console.log("form data", formData.get("File"),formData.get("CreateBy"),formData.get("OrderType"));
                    
                    let uploadUrl = webServiceAPI.NewOutbound + "/replenishment/importTempSalesOrder";
                    $http.post(uploadUrl, formData, {
                        transformRequest: angular.identity,
                        headers: {'Content-Type': undefined}
                    })
                    .success(function(res){
                        console.log(res);
                        if(res.status == 400) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'กรุณาเลือก Order Type ให้ถูกต้อง',
                                message: res.errors.OrderType[0]
                            });
                        } else if(res.statusCode == "200") {
                            // console.log(res.result, res.result.length);
                            let temp = [];
                            for(var i = 0; i < $vm.filterModel.perPage; i++) {
                                temp.push(res.result[i]);
                            }
                            // console.log(temp);
                            $vm.searchResultModel = angular.copy(temp);
                            $vm.pickupFileResultModel = angular.copy(res.result);
                            $vm.filterModel.totalRow = angular.copy(Math.ceil(res.result.length / $vm.filterModel.perPage));
                            $vm.filterModel.num = angular.copy(10);
                            console.log($vm);
                        } else if(res.statusCode != "200") {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Cannot Insert File',
                                message: res.statusResult + ": " + res.statusReason
                            });
                        }
                    })
                    .error(function(err){
                        console.log(err);
                    });
                     
                    // viewModel.pickupExcel(formData).then(function (res) {
                    //     console.log(res);
                    //     if(res.statusCode == 200) {
                    //         // insert to table
                    //     } else if(res.statusCode != 200) {
                    //         dpMessageBox.alert({
                    //             ok: 'Close',
                    //             title: 'Cannot Insert File',
                    //             message: res.data.statusResult + ": " + res.data.statusReason
                    //         });
                    //     }
                    // });
                }                
            };

            $scope.importFile = function () {
                let body = {
                    CreateBy: localStorage.getItem("ls.userTokenStorage")
                }
                if(!$vm.searchResultModel) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Please Insert File',
                        message: 'กรุณาเลือกไฟล์เพื่อ Upload'
                    });
                } else {
                    viewModel.importExcel(body).then(function (res) {
                        console.log(res);
                        if(res.status == 200) {
                            $scope.filterModel = {};
                            $vm.searchResultModel = [];
                        }
                    });
                }                
            };

            $scope.getSearchParams = function () {
                return angular.copy($vm.filterModel);
            };

            $scope.searchFilter = function (param) {            
                    
                var deferred = $q.defer();
                if ((param.soldToName === undefined || param.soldToName == "") && (param.ownerName === undefined || param.ownerName == "") && (param.shipToName === undefined || param.shipToName =="") && (param.documentTypeName === undefined || param.documentTypeName == "")
                    && (param.warehouseName === undefined || param.warehouseName == "")
                    && (param.warehouseNameTo === undefined || param.warehouseNameTo == "")
                    && (param.routeName === undefined || param.routeName == "") && (param.roundName === undefined || param.roundName  == ""))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {                        
                        viewModel.planGIsearch(param).then(
                            function success(res) {
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else
                    viewModel.planGIsearch(param).then(
                        function success(res) {
                            deferred.resolve(res);
                        },
                        function error(response) {
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
            $scope.filterSearch = function () {
                
                $scope.filterModel = $scope.filterModel || {};
                $scope.filterModel.totalRow = $vm.filterModel.totalRow
                $scope.filterModel.currentPage = $vm.filterModel.currentPage
                $scope.filterModel.perPage = $vm.filterModel.perPage
                $scope.filterModel.numPerPage = $vm.filterModel.numPerPage
                $vm.filterModel.chkinitpage = true;
                
                $scope.searchFilter($scope.filterModel).then(function success(res) {
                    
                    $vm.filterModel = $scope.filterModel;
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                    $vm.filterModel.perPage = res.data.pagination.perPage;   
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;

                }, function error(res) { });
            }
            $scope.clearSearch = function () {
                $scope.filterModel = {};
                $scope.filterSearch();
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

            //Clear Index
            $scope.$watch('filterModel.ownerName', function () {
                if($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp)
                {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.soldToName', function () {
                if($scope.filterModel.soldToName != $scope.filterModel.soldToNameTemp)
                {
                    $scope.filterModel.soldToIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.shipToName', function () {
                if($scope.filterModel.shipToName != $scope.filterModel.shipToNameTemp)
                {
                    $scope.filterModel.shipToIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.documentTypeName', function () {
                if($scope.filterModel.documentTypeName != $scope.filterModel.documentTypeNameTemp)
                {
                    $scope.filterModel.documentTypeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.processStatusName', function () {
                if($scope.filterModel.processStatusName != $scope.filterModel.processStatusNameTemp)
                {
                    $scope.filterModel.processStatusIndex = "00000000-0000-0000-0000-000000000000";
                    $scope.filterModel.documentStatus = "";
                    
                }
            })
            $scope.$watch('filterModel.routeName', function () {
                if($scope.filterModel.routeName != $scope.filterModel.routeNameTemp)
                {
                    $scope.filterModel.routeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.roundName', function () {
                if($scope.filterModel.roundName != $scope.filterModel.roundNameTemp)
                {
                    $scope.filterModel.roundIndex = "00000000-0000-0000-0000-000000000000";
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
           


            function initialize() {
            };

            this.$onInit = function () {
                $scope.filterModel = {};

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
            $scope.popupWarehouse = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupWarehouse.onShow = !$scope.popupWarehouse.popupOwner;
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
                        $scope.filterModel.warehouseNameTemp = $scope.filterModel.warehouseName

                        localStorageService.set('warehouseVariableId', angular.copy(param.warehouseId));
                        localStorageService.set('warehouseVariableIndex', angular.copy(param.warehouseIndex));
                        localStorageService.set('warehouseVariableName', angular.copy(param.warehouseName));
                    }
                }
            };

            $scope.popupRound = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRound.onShow = !$scope.popupRound.onShow;
                    $scope.popupRound.delegates.roundPopup(param, index);
                },
                config: {
                    title: "Round"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.roundIndex = angular.copy(param.roundIndex);
                        $scope.filterModel.roundId = angular.copy(param.roundId);
                        $scope.filterModel.roundName = angular.copy(param.roundName);
                        $scope.filterModel.roundNameTemp = $scope.filterModel.roundName;
                    }
                }
            };

            $scope.popupRoute = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {

                    $scope.popupRoute.onShow = !$scope.popupRoute.onShow;
                    $scope.popupRoute.delegates.routePopup(param, index);
                },
                config: {
                    title: "Route"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.routeIndex = angular.copy(param.routeIndex);
                        $scope.filterModel.routeId = angular.copy(param.routeId);
                        $scope.filterModel.routeName = angular.copy(param.routeName);
                        $scope.filterModel.routeNameTemp = $scope.filterModel.routeName;
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
                        // console.log(param.documentTypeName);
                        $scope.filterModel.documentTypeIndex = angular.copy(param.documentTypeIndex);
                        $scope.filterModel.documentTypeId = angular.copy(param.documentTypeId);
                        $scope.filterModel.documentTypeName = angular.copy(param.documentTypeName);
                        $scope.filterModel.documentTypeNameTemp = $scope.filterModel.documentTypeName;
                    }
                }
            };

        }
    });

})();