'use strict'
app.component('productTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterProduct/component/productTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, productFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        let viewModel = productFactory;
        // setting column
        $scope.showColumnSetting = false;
        // $scope.auto = {
        //     province: {
        //         url: 'domesticLoadingItems/SuggestProvince/',
        //         text: ''
        //     }

        // };

        $vm.triggerCreate = function () {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow().then(function (result) {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };

        //var MessageBox = dpMessageBox;

        // $scope.handleDrop = function (draggedData, targetElem) {

        //     var swapArrayElements = function (array_object, index_a, index_b) {
        //         var temp = array_object[index_a];
        //         array_object[index_a] = array_object[index_b];
        //         array_object[index_b] = temp;
        //     };
        //     var srcInd = $scope.tblHeader.findIndex(x => x.name === draggedData);
        //     var destInd = $scope.tblHeader.findIndex(x => x.name === targetElem.textContent);
        //     swapArrayElements($scope.tblHeader, srcInd, destInd);
        // };
        // $scope.handleDrag = function (columnName) {
        //     $scope.dragHead = columnName.replace(/["']/g, "");
        // };
        // const _storageName = 'master-product';

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
            // if (isNumber(value)) {
            //     if (value > 10) return '#C1FDC2';
            //     else if (value > 0) return '#FBFDC0';
            //     else return '#FF7777';
            // }
            if (value) {
                if (value > 10) return '#C1FDC2';
                else if (value > 0) return '#FBFDC0';
                else return '#FF7777';
            }

            return '';
        };
        $scope.editItem = function (param) {
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param.productIndex).then(function (result) {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }

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
            serchPage(page);
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

            var p = $vm.filterModel;

            serchPage(p);
        }

        $vm.filterModel = {
            num: 1,
            maxSize: 5,
            currentPage: $vm.filterModel.perPage,
            columnName: $vm.filterModel.columnName,
            orderBy: $vm.filterModel.orderBy
        };

        function serchPage(data) {
            if (data != null) {
                pageLoading.show();
                viewModel.search(data).then(function (res) {

                    pageLoading.hide();
                    if (res.data.length != 0 && res.data.length != undefined) {
                        if (res.data.itemsProduct.count != undefined) {
                            $vm.filterModel.totalRow = res.data.itemsProduct[0].count;
                        }
                        else {
                            $vm.filterModel.totalRow = res.data.itemsProduct.length;
                        }
                        $vm.searchResultModel = res.data;
                    }
                    else {
                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.searchResultModel = res.data.itemsProduct;

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
                viewModel.getDelete(param.productIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };
        function validate(param) {
            var msg = "";
            return msg;
        }

        $scope.autoComplete = {
            material: 'domesticDeliveryPlan/MaterialCode/',
            suggestionTrucktype: 'domesticPlantSelected/SuggestTrucktype/',
        }

        var init = function () {
            // $scope.column.getConfig();

        };
        init();

    }
});