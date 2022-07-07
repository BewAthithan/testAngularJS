'use strict'
app.component('shipToTypeTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window) {
        return "modules/masterData/masterShipToType/component/shipToTypeTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, localStorageService, dpMessageBox,shipToTypeFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = shipToTypeFactory;
        // setting column

        $scope.auto = {
            province: {
                url: 'domesticLoadingItems/SuggestProvince/',
                text: ''
            }

        };

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

        $scope.dragHead = '';
        $scope.dragImageId = "dragtable";
        $scope.revisionList = {};
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

        var init = function () {
            if ($scope.config.pageMode == "Search") {
                $scope.pageMode = "Search";
            }
        }
        
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

        $scope.pagging = {
            totalRow: 0,
            currentPage: 1,
            numPerPage: $vm.filterModel.numPerPage,
            num: 1,
            maxSize: 2,
            perPage: $vm.filterModel.numPerPage,
            change: function () {
                $vm.filterModel.currentPage = this.currentPage - 1;
                if ($vm.triggerSearch) {
                    $vm.triggerSearch();
                }
            },
            changeSize: function () {
                $vm.filterModel.numPerPage = $scope.pagging.perPage
                $vm.triggerSearch();
            }
        }

        $scope.delete = function (param) {
            dpMessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.shipToTypeIndex).then(function success(res) {
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
        var initForm = function () {
        };
        var init = function () {

        };
        init();

    }
});