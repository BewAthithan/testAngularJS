'use strict'
app.component('zonePutAwayLocationTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterZonePutAwayLocation/component/zonePutAwayLocationTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,zonePutAwayLocationFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = zonePutAwayLocationFactory;
        $scope.showColumnSetting = false;


        $vm.triggerCreate = function () {
            if($scope.onShow)
            {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;
                    
                }).catch(function(error) {
                    defer.reject({ 'Message': error });
                });
            }
        };
        $scope.editItem = function (param) {            
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }


        var MessageBox = dpMessageBox;

        $scope.handleDrop = function (draggedData, targetElem) {
            var swapArrayElements = function (array_object, index_a, index_b) {
                var temp = array_object[index_a];
                array_object[index_a] = array_object[index_b];
                array_object[index_b] = temp;
            };
            var srcInd = $scope.tblHeader.findIndex(x => x.name === draggedData);
            var destInd = $scope.tblHeader.findIndex(x => x.name === targetElem.textContent);
            swapArrayElements($scope.tblHeader, srcInd, destInd);
        };
        $scope.handleDrag = function (columnName) {
            $scope.dragHead = columnName.replace(/["']/g, "");
        };

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
        $scope.pageMode = 'Master';
        $scope.toggleSetting = function () {
            $scope.showColumnSetting = $scope.showColumnSetting === false ? true : false;
        };

        $scope.$watch('tblHeader', function (n, o) {
            if (n) {
                localStorageService.set(_storageName, n);
            }
        }, true);

        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }
        


        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };

        $scope.calColor = function (value) {
            if (value) {
                if (value > 10) return '#C1FDC2';
                else if (value > 0) return '#FBFDC0';
                else return '#FF7777';
            }

            return '';
        };

        // coload toggle
        $scope.showCoload = false;
        $scope.pageOption = [{
            'value': 30
        }, {
            'value': 50
        },
        {
            'value': 100
        },
        {
            'value': 500
        },
        ];      

        $scope.changePage = function () {            
            //$vm.filterModel.productIndex = ($vm.filterModel.productId === undefined || $vm.filterModel.productName == "") ? $vm.filterModel.productIndex = "" : $vm.filterModel.productIndex;   
            var page = $vm.filterModel;
           
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }

            var p = {
                
                zonePutAwayLocationId: "",
                zonePutAwayId: "",
                zonePutAwayName: "",
                WarehouseIndex:"72885519-D256-4AAD-9C37-A783B90E1DF6",
                pagination: {
                    currentPage: $vm.filterModel.currentPage,
                    perPage: $vm.filterModel.perPage,
                    totalRow: $vm.filterModel.perPage,
                    key: "",
                    advanceSearch: true
                }
                }
            
            serchPage(p);
        }

        
        
        

        $scope.changeTableSize = function () {
            let ChangeTable = 1;
            if ($scope.model.numPerPage == undefined) {
                $scope.model.numPerPage = $vm.filterModel.perPage;
            }
            // var p = {
            //     currentPage: ChangeTable,
            //     numPerPage: $vm.filterModel.perPage
            // };

            var p = {
                
            zonePutAwayLocationId: "",
            zonePutAwayId: "",
            zonePutAwayName: "",
            WarehouseIndex:"72885519-D256-4AAD-9C37-A783B90E1DF6",
            pagination: {
                currentPage: $vm.filterModel.currentPage,
                perPage: $vm.filterModel.perPage,
                totalRow: $vm.filterModel.perPage,
                key: "",
                advanceSearch: true
            }
            }
           
            
            serchPage(p);
        }

        function serchPage(data) {
           // console.log(data)
            if (data != null) {
                pageLoading.show();
                viewModel.search(data).then(function (res) {                
                    pageLoading.hide();
                    if (res.data.result.length != 0 && res.data.result.length != undefined) {
                        
                            $vm.filterModel.totalRow = res.data.paginationInfo.totalItem;
                            $vm.filterModel.currentPage = res.data.paginationInfo.currentPage;
                            $vm.searchResultModel = res.data.result;
                    }
                    else {
                        if (res.data.paginationInfo != null) {                                                       
                            $vm.filterModel.totalRow = res.data.paginationInfo.totalItem;
                            $vm.filterModel.currentPage = res.data.paginationInfo.currentPage;
                            $vm.searchResultModel = res.data.result;

                        }
                    }
                })
            }
        }

        $scope.delete = function (param) {
            
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
               var item ={
                zonePutAwayLocationId: param.zonePutAwayLocationId,
                ZonePutAwayIndex: param.zonePutAwayIndex,
                ownerIndex: param.ownerIndex,
                updateBy:localStorageService.get('userTokenStorage')
               }
               
             
              
                viewModel.getDelete(item).then(function success(res) {
                    //$vm.triggerSearch();
                    pageLoading.hide();
                    $state.reload($state.current.name);
                }, function error(res) { });
  
            });
        };


     
        
        function validate(param) {
            var msg = "";
            return msg;
        }

        var initForm = function () {
        };
        var init = function () {
            $scope.filterModel = {};
           

          
            //  $vm.filterModel.perPage = $vm.filterModel.perPage
            //  $vm.filterModel.currentPage =  
            //     columnName: $vm.filterModel.columnName,
            //     orderBy: $vm.filterModel.orderBy,
            //     num:$vm.filterModel.num
            

            // console.log($vm.filterModel)
        };
        init();

    }
});