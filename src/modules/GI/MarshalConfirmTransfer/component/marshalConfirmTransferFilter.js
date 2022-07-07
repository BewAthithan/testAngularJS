(function () {
    'use strict';
    app.component('marshalConfirmTransferFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/MarshalConfirmTransfer/component/marshalConfirmTransferFilter.html";
        },
        bindings: {
            isLoading: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            pickingTools: '=?',
            isFilterTable: '=?'

        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading,dpMessageBox, commonService, marshalConfirmTransferFactory, localStorageService) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = marshalConfirmTransferFactory;
            var model = $scope.filterModel;
            $scope.isFilter = true;

            $vm.triggerSearch = function () {
                pageLoading.show();
                if($vm.filterModel.chkinitpage)
                {
                    $scope.filterSearch()
                }
                else
                {
                    
                viewModel.confirmMarshallSearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                    $vm.filterModel.perPage = res.data.pagination.perPage;   
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;   
                    $vm.searchResultModel = res.data.items;
                });
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
            $vm.addItem = function () {

                if ($scope.pickingTools) {
                    $vm.isFilter = false;
                    $scope.pickingTools().then(function () {
                        $vm.isFilter = true;

                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }


            $scope.clearSearch = function () {
                $scope.filterModel = {};
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

            //Check DueDate----------------------------
            $scope.$watch('filterModel.confirmMarshallDate', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.confirmMarshallDate != undefined && $scope.filterModel.confirmMarshallDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.confirmMarshallDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.confirmMarshallDateTo.replace(pattern, '$1-$2-$3'));                    
                }
                if(ds > de)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.confirmMarshallDate = $scope.filterModel.confirmMarshallDateTo;
                }
                    
            })
            $scope.$watch('filterModel.confirmMarshallDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.confirmMarshallDate != undefined && $scope.filterModel.confirmMarshallDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.confirmMarshallDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.confirmMarshallDateTo.replace(pattern, '$1-$2-$3'));                    
                }
                // var ds = Date.parse($scope.filterModel.planGoodsReceiveDueDate.replace(pattern, '$1-$2-$3'));
                // var de = Date.parse($scope.filterModel.planGoodsReceiveDueDateTo.replace(pattern, '$1-$2-$3'));
                if(de < ds)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.confirmMarshallDateTo = $scope.filterModel.confirmMarshallDate;
                }                    
            })

            //Clear Index
            $scope.$watch('filterModel.ownerName', function () {
                if($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp)
                {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.planGoodsIssueNo', function () {
                if($scope.filterModel.planGoodsIssueNo != $scope.filterModel.planGoodsIssueNoTemp)
                {
                    $scope.filterModel.planGoodsIssueIndex = "00000000-0000-0000-0000-000000000000";
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

            $scope.searchFilter = function (param) {
                
                var deferred = $q.defer();
                if ((param.planGoodsIssueNo === undefined || param.planGoodsIssueNo == "") && (param.ownerName === undefined || param.ownerName == "") && (param.confirmMarshallDate === undefined || param.confirmMarshallDate == "")
                    && (param.confirmMarshallDateTo === undefined || param.confirmMarshallDateTo == "") && (param.routeName === undefined || param.routeName == "") && (param.roundName === undefined || param.roundName  == "")
                    && (param.confirmMarshallNo === undefined || param.confirmMarshallNo == ""))
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {                        
                        viewModel.confirmMarshallSearch(param).then(
                            function success(res) {
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else
                    viewModel.confirmMarshallSearch(param).then(
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
                    $vm.searchResultModel = res.data.items;

                }, function error(res) { });
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
            $scope.popupPlanGi = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    index = "4"
                    $scope.popupPlanGi.onShow = !$scope.popupPlanGi.onShow;
                    $scope.popupPlanGi.delegates.planGiPopup(param, index);
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
                    }
                }
            };
            // $scope.popupMarshallno = {
            //     onShow: false,
            //     delegates: {},
            //     onClick: function (param, index) {
                    
            //         index = "2"
            //         $scope.popupMarshallno.onShow = !$scope.popupMarshallno.onShow;
            //         $scope.popupMarshallno.delegates.marshallnoPopup(param, index);
            //     },
            //     config: {
            //         title: "Confirm Marshall"
            //     },
            //     invokes: {
            //         add: function (param) { },
            //         edit: function (param) { },
            //         selected: function (param) {
            //             $scope.filterModel.confirmMarshallIndex = angular.copy(param.marshallIndex);
            //             $scope.filterModel.confirmMarshallNo = angular.copy(param.marshallNo);

            //         }
            //     }
            // };
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

            $scope.popupStatus = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    
                    index = 7;
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



            function initialize() {
            };

            this.$onInit = function () {
                $scope.filter();
                $scope.filterModel = {};
                $scope.filterModel.confirmMarshallDate = getToday();
                $scope.filterModel.confirmMarshallDateTo = getToday();
                initialize();

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