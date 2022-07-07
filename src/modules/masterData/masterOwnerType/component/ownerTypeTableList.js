'use strict'
app.component('ownerTypeTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/masterData/masterOwnerType/component/ownerTypeTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox,ownerTypeFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        var viewModel = ownerTypeFactory;
        // setting column
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

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }
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
                ok:'Yes',
                cancel:'No',
                title: 'InformaTion',
                message: 'Do you want to Cancel ?'
            }).then(function success() {
                viewModel.getDelete(param.ownerTypeIndex).then(function success(res) {
                    $vm.triggerSearch();
                }, function error(res) { });
            });
        };
        function validate(param) {
            var msg = "";
            return msg;
        }

        var init = function () {
            $scope.filterModel = {};           
        };
        init();

    }
});