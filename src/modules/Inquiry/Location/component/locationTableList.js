'use strict'
app.component('inqLocationTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/Inquiry/Location/component/locationTableList.html";
    },
    bindings: {
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        resultLocationDetail: '=?',
        resultPutawaySuggestion: '=?',
        putAwaySug: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, inquiryLocationFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = [];
        $scope.items = $scope.items || [];
        $scope.ddl = "";

        // var viewModel = ;
        // setting column
        var viewModel = inquiryLocationFactory;

        $scope.clearCheck = function (param) {

            for (let index = 0; index < $vm.resultLocationDetail.length; index++) {

                if (index != param)
                    $vm.resultLocationDetail[index].selected = false;
            }
        }

        // $vm.triggerSearch = function () {
        //     $vm.filterModel = $vm.filterModel || {};
        //     viewModel.search($vm.filterModel).then(function (res) {

        //         pageLoading.hide();

        //         $vm.filterModel.totalRow = res.data.pagination.totalRow;
        //         $vm.filterModel.currentPage = res.data.pagination.currentPage;
        //         $vm.filterModel.perPage = res.data.pagination.perPage;
        //         $vm.filterModel.numPerPage = res.data.pagination.perPage;
        //         $vm.filterModel.maxSize = 3;

        //         if (res.paginations != null || res.paginations != undefined) {
        //             $vm.filterModel.totalRow = paginations.totalRow;
        //         }

        //         $vm.resultLocationDetail = res.data.items;

        //     });
        // };

        $scope.filterSearch = function () {
            $vm.filterModel = $vm.filterModel || {};
            viewModel.search($vm.filterModel).then(function (res) {

                pageLoading.hide();
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.filterModel.maxSize = 5;
                if (res.paginations != null || res.paginations != undefined) {
                    $vm.filterModel.totalRow = paginations.totalRow;
                }
                $vm.resultLocationDetail = res.data.items;

            });
        }


        $scope.select = function (param) {


            var item = param.filter(c => c.selected);

            if ($vm.providers.invokes)
                $vm.providers.invokes.set(item);

            $vm.isFilter = true;

            // defer.resolve(item);
        }



        $vm.$onInit = function () {
            // $vm.triggerSearch();
            $scope.selected = 1;
            $vm.filterModel.selected = 1;
        }



        $vm.stockdetail = function (param) {
            var item = param.filter(c => c.selected);

            if (item.length == 0) {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information',
                    message: 'กรุณาติ๊กเลือกก่อนกด Action'
                })
            }
            else {

                $vm.isFilter = false;
                $scope.isStock(item).then(function (result) {
                    $vm.isFilter = true;
                    $scope.ddl = "";
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }

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

        //Location Detail

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
                viewModel.search(data).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.filterModel.totalRow = res.data[0].count;
                        $vm.resultLocationDetail = res.data.items;

                    }
                    else {

                        if (res.data.pagination != null) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.resultLocationDetail = res.data.items;

                        }
                    }
                })
            }
        }


        //PutawaySuggest

        $scope.changeTableSize1 = function () {

            var p = {
                currentPage: 0, //$scope.pagging.num,
                perPage: $vm.putAwaySug.perPage
            };
            $vm.putAwaySug.perPage = $vm.putAwaySug.perPage;
            $scope.changePage1();
        };

        // $vm.putAwaySug = {
        //     num: 1,
        //     totalRow: 0,
        //     currentPage: 1,
        //     maxSize: 5,
        //     perPage: $vm.putAwaySug.perPage,
        // };

        $scope.changePage1 = function () {
            2

            var page = $vm.putAwaySug;

            var all = {
                currentPage: 0,
                perPage: 0
            };
            if ($vm.putAwaySug.currentPage != 0) {
                page.currentPage = page.currentPage;
            }
            serchPage1(page);
        }
        function serchPage1(data) {

            if (data != null) {

                pageLoading.show();
                viewModel.searchPutawaySuggest(data).then(function (res) {
                    pageLoading.hide();

                    if (res.data.length != 0 && res.data.length != undefined) {
                        $vm.putAwaySug.totalRow = res.data[0].count;
                        $vm.resultPutawaySuggestion = res.data.items;

                    }
                    else {

                        if (res.data.pagination != null) {
                            $vm.putAwaySug.totalRow = res.data.pagination.totalRow;
                            $vm.putAwaySug.currentPage = res.data.pagination.currentPage;
                            $vm.resultPutawaySuggestion = res.data.items;

                        }
                    }
                })
            }
        }

        // $scope.exportExcelFile = {
        //     ExportExcelLocationDetails: function () {
        //         dpMessageBox.confirm({
        //             title: 'Confirm.',
        //             message: 'Do you want to download?'
        //         }).then(function success() {
        //             // var item = $vm.searchResultModel;
        //             ExportExcelLocationDetails();
        //         });
        //     },
        //     ExportExcelPutawaySuggestionLocation: function () {
        //         dpMessageBox.confirm({
        //             title: 'Confirm.',
        //             message: 'Do you want to download?'
        //         }).then(function success() {
        //             // var item = $vm.searchResultModel;
        //             ExportExcelPutawaySuggestionLocation();
        //         });
        //     },
        // }

        // function ExportExcelLocationDetails() {
        //     var item = angular.copy($vm.resultLocationDetail);
        //     // var model = {};

        //     // model = { 'listInquiryLocationDetails': $vm.resultLocationDetail, 'locationName': $vm.filterModel.locationName };

        //     // debugger
        //     // let dataList = model.listInquiryLocationDetails;
        //     // for (var i = 0; i <= dataList.length - 1; i++) {
        //     //     model.listInquiryLocationDetails[i].rowIndex = i + 1
        //     //     model.listInquiryLocationDetails[i].Type = 'LocationDetails';
        //     // }

        //     var deferred = $q.defer();
        //     $vm.filterModel.excelName = 'LocationDetails'
        //     viewModel.ExportLocationDetails($vm.filterModel).then(
        //         function success(results) {
        //             $vm.triggerSearch
        //             deferred.resolve(results);
        //         },
        //         function error(response) {

        //             dpMessageBox.alert({
        //                 title: 'Information.',
        //                 message: "Connect Service Fail."
        //             })
        //             deferred.reject(response);
        //         }
        //     );
        //     return deferred.promise;
        // }

        // function ExportExcelPutawaySuggestionLocation() {
        //     var item = angular.copy($vm.resultPutawaySuggestion);
        //     // var model = {};

        //     // model = { 'listInquiryPutawaySuggestionLocation': $vm.resultPutawaySuggestion, 'locationName': $vm.putAwaySug.locationName };

        //     // debugger
        //     // let dataList = model.listInquiryPutawaySuggestionLocation;
        //     // for (var i = 0; i <= dataList.length - 1; i++) {
        //     //     model.listInquiryPutawaySuggestionLocation[i].rowIndex = i + 1
        //     //     model.listInquiryPutawaySuggestionLocation[i].Type = 'PutawaySuggestionLocation';
        //     // }

        //     var deferred = $q.defer();
        //     // 
        //     $vm.putAwaySug.excelName = 'PutawaySuggestionLocation';
        //     viewModel.ExportPutawaySuggestionLocation($vm.putAwaySug).then(
        //         function success(results) {
        //             $vm.triggerSearch
        //             deferred.resolve(results);
        //         },
        //         function error(response) {

        //             dpMessageBox.alert({
        //                 title: 'Information.',
        //                 message: "Connect Service Fail."
        //             })
        //             deferred.reject(response);
        //         }
        //     );
        //     return deferred.promise;
        // }



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

        $scope.ddlClick = function()
        {
            $scope.ddl = $scope.ddl == "" ? "open" : "";
        }

        var init = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
            //initForm();
            //loadConfig();
            //$scope.listviewFunc.filter();
            // example data
        };
        init();

    }
});