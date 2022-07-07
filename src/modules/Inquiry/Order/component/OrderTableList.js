'use strict'
app.component('inqOrderTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Inquiry/Order/component/OrderTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        resultOrderHistory: '=?',
        resultOrderStatus: '=?',
        orderHistory: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, inquiryOrderFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        // var viewModel = ;
        // setting column
        var viewModel = inquiryOrderFactory;

        $scope.clearCheck = function (param) {

            for (let index = 0; index < $vm.searchResultModel.length; index++) {

                if (index != param)
                    $vm.searchResultModel[index].selected = false;
            }
        }


        

        $scope.select = function (param) {


            var item = param.filter(c => c.selected);

            if ($vm.providers.invokes)
                $vm.providers.invokes.set(item);

            $vm.isFilter = true;

            // defer.resolve(item);
        }

        $scope.selectedTab = function (tab) {
            if (tab == 1) {
                $scope.colortab1 = "#FDFEFE";
                $scope.colortab2 = "#D3D3D3";
                $vm.filterModel.selected = 1;
            }
            else if (tab == 2) {
                $scope.colortab1 = "#D3D3D3";
                $scope.colortab2 = "#FDFEFE";
                $vm.filterModel.selected = 2;
            }
            $scope.selected = tab;
        }


        $vm.$onInit = function () {

            $scope.selected = 1;
            $vm.filterModel.selected = 1;
            $scope.userName = localStorageService.get('userTokenStorage');
        }


        $scope.getColour = function (param) {
            if (param == '1' || param == '-1')
                return '#C6C0C0';
        }

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];

        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }


        //Order Status

        $scope.changeTableSize = function () {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
        };

        $vm.filterModel = {
            num: 1,
            totalRow: 0,
            currentPage: 1,
            maxSize: 5,
            perPage: $vm.filterModel.perPage,
        };

        $scope.changePage = function () {
            var page = $vm.filterModel;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage(page);
        }
        function serchPage(data) {

            if (data != null) {

                pageLoading.show();

                viewModel.searchOrderStatus(data).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.resultOrderStatus = res.data.items;

                    }
                    else {

                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.resultOrderStatus = res.data.items;

                        }
                    }
                })
            }
        }

        //Order history


        $scope.changeTableSize1 = function () {
            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.orderHistory.perPage
            };
            $vm.orderHistory.perPage = $vm.orderHistory.perPage;
            $scope.changePage1();
        };

        $scope.changePage1 = function () {
            var page = $vm.orderHistory;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.orderHistory.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage1(page);
        }
        function serchPage1(data) {

            if (data != null) {

                pageLoading.show();

                viewModel.searchOrderHistory(data).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.orderHistory.totalRow = res.data[0].count;
                        $vm.resultOrderHistory = res.data.items;

                    }
                    else {

                        if (res.data.pagination != null) {
                            $vm.orderHistory.totalRow = res.data.pagination.totalRow;
                            $vm.orderHistory.currentPage = res.data.pagination.currentPage;
                            $vm.resultOrderHistory = res.data.items;

                        }
                    }
                })
            }
        }


        $scope.model = {
            currentPage: $vm.filterModel.currentPage + 1,
            perPage: $vm.filterModel.perPage,
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


        function getToday() {
            var today = new Date();

            var mm = today.getMonth() + 1;
            var yyyy = today.getUTCFullYear();
            var dd = today.getDate();


            if (dd < 10) dd = '0' + dd;
            if (mm < 10) mm = '0' + mm;

            return yyyy.toString() + mm.toString() + dd.toString();
        }

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            $vm.filterModel.deliveryDateFrom = getToday();
            $vm.filterModel.deliveryDateTo = getToday();
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});