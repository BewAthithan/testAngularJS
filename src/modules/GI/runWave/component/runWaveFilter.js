(function () {
    'use strict';
    app.component('runWaveFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/runWave/component/runWaveFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading,dpMessageBox, commonService, runWaveFactory, localStorageService) {
            var $vm = this;

            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = runWaveFactory;
            var model = $scope.filterModel;
            $vm.triggerSearch = function () {
                pageLoading.show();
                if($vm.filterModel.chkinitpage)
                {
                    $scope.filterSearch()
                }
                else
                {
                viewModel.runWavesearch($vm.filterModel).then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel.totalRow = res.data.pagination.totalRow;
                    $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                    $vm.filterModel.perPage = res.data.pagination.perPage;   
                    $vm.filterModel.numPerPage = res.data.pagination.perPage;   
                    $vm.searchResultModel = res.data.items;
                });
            }
            };


            $scope.header = {
                Search: true
            };

            $scope.hide = function () {
                $scope.header.Search = $scope.header.Search === false ? true : false;
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
            
            $scope.filterSearch = function (){               
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
            $scope.searchFilter = function (param) {
                
                var deferred = $q.defer();
                if (param.planGoodsIssueDate == "" && param.planGoodsIssueDateTo == "" && (param.ownerName === undefined || param.ownerName == "") && (param.documentTypeName === undefined || param.documentTypeName == "")
                    && (param.planGoodsIssueDueDate === undefined || param.planGoodsIssueDueDate == "") && (param.planGoodsIssueDueDateTo === undefined || param.planGoodsIssueDueDateTo == "")                 
                    && (param.routeName === undefined || param.routeName == "") && (param.roundName === undefined || param.roundName  == "") && !param.planGoodsIssueNo)
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm.',
                        message: 'Do you want to Search Data ?'
                    }).then(function success() {                        
                        viewModel.runWavesearch(param).then(
                            function success(res) {
                                deferred.resolve(res);
                            },
                            function error(response) {
                                deferred.reject(response);
                            });
                    });
                else
                    viewModel.runWavesearch(param).then(
                        function success(res) {
                            deferred.resolve(res);
                        },
                        function error(response) {
                            deferred.reject(response);
                        });
                return deferred.promise;
            }
            

            $scope.clearSearch = function (){ 
                $scope.filterModel = {};
                $scope.filterModel.planGoodsIssueDueDate = getToday();
                $scope.filterModel.planGoodsIssueDueDateTo = getToday();    
                $scope.filterSearch();                
                $window.scrollTo(0, 0);  
            }  

            $vm.setDateFormate = function (v) {
                try {
                    return $filter("dateFormate")(v);
                } catch (e) {
                    return "-";
                }
            }

            // -----------------SET DAY default-----------------//
            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }

            //Check PlanGIDate----------------------------
            $scope.$watch('filterModel.planGoodsIssueDate', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.planGoodsIssueDate != undefined && $scope.filterModel.planGoodsIssueDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.planGoodsIssueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsIssueDateTo.replace(pattern, '$1-$2-$3'));                    
                }
           
                if(ds > de)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsIssueDate = $scope.filterModel.planGoodsIssueDateTo;
                }
                    
            })
            $scope.$watch('filterModel.planGoodsIssueDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.planGoodsIssueDate != undefined && $scope.filterModel.planGoodsIssueDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.planGoodsIssueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsIssueDateTo.replace(pattern, '$1-$2-$3'));                    
                }
              
                if(de < ds)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsIssueDateTo = $scope.filterModel.planGoodsIssueDate;
                }                    
            })

            //Check PlanGIDueDate----------------------------
            $scope.$watch('filterModel.planGoodsIssueDueDate', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.planGoodsIssueDueDate != undefined && $scope.filterModel.planGoodsIssueDueDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.planGoodsIssueDueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsIssueDueDateTo.replace(pattern, '$1-$2-$3'));                    
                }
                if(ds > de)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsIssueDueDate = $scope.filterModel.planGoodsIssueDueDateTo;
                }
                    
            })
            $scope.$watch('filterModel.planGoodsIssueDueDateTo', function () {
                var pattern = /(\d{4})(\d{2})(\d{2})/;
                if($scope.filterModel.planGoodsIssueDueDate != undefined && $scope.filterModel.planGoodsIssueDueDateTo != undefined){
                    var ds = Date.parse($scope.filterModel.planGoodsIssueDueDate.replace(pattern, '$1-$2-$3'));
                    var de = Date.parse($scope.filterModel.planGoodsIssueDueDateTo.replace(pattern, '$1-$2-$3'));                    
                }
          
                if(de < ds)
                {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Validate',
                        message: 'ระบุวันที่ไม่ถูกต้อง !'
                    })
                    $scope.filterModel.planGoodsIssueDueDateTo = $scope.filterModel.planGoodsIssueDueDate;
                }                    
            })

            //Clear Index
            $scope.$watch('filterModel.ownerName', function () {
                if($scope.filterModel.ownerName != $scope.filterModel.ownerNameTemp)
                {
                    $scope.filterModel.ownerIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.documentTypeName', function () {
                if($scope.filterModel.documentTypeName != $scope.filterModel.documentTypeNameTemp)
                {
                    $scope.filterModel.documentTypeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.roundName', function () {
                if($scope.filterModel.roundName != $scope.filterModel.roundNameTemp)
                {
                    $scope.filterModel.roundIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            $scope.$watch('filterModel.routeName', function () {
                if($scope.filterModel.routeName != $scope.filterModel.routeNameTemp)
                {
                    $scope.filterModel.routeIndex = "00000000-0000-0000-0000-000000000000";
                }
            })
            

            // -----------------ALL POPUP IN PAGE-----------------//


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


            

            this.$onInit = function () {
                $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.filterModel.planGoodsIssueDueDate = getToday();
                $scope.filterModel.planGoodsIssueDueDateTo = getToday();       
                $vm.filterModel.planGoodsIssueDueDate = getToday();
                $vm.filterModel.planGoodsIssueDueDateTo = getToday();
                
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