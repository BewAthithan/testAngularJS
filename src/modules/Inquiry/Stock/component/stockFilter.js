(function () {
    'use strict';
    app.component('stockFilter', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/Inquiry/Stock/component/stockFilter.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            filterSearch: '=?'
        },
        controller: function ($scope, $q, $http, $filter, $state, $window, $element, $timeout, $translate, /*ngAuthSettings,*/ pageLoading, localStorageService, dpMessageBox, commonService, stockFactory) {
            var $vm = this;
            // ----------------------------------------------------
            // This default object
            var xString = commonService.string;
            var xObject = commonService.objects;
            var loading = commonService.loading;
            var MessageBox = commonService.messageBox;
            var viewModel = stockFactory;
            var model = $scope.filterModel;
//             $vm.triggerSearch = function () {
//                 $vm.filterModel = $vm.filterModel || {};
//                 // $vm.filterModel.goodsReceiveDate = getToday();
                
//                 viewModel.search($vm.filterModel).then(function (res) {

//                     pageLoading.hide();                    
//                     if (res.data.items.length != 0) {
                      
//                         $scope.filterModel.perPage = $vm.filterModel.perPage;
//                         $scope.filterModel.currentPage = $vm.filterModel.currentPage;
//                         $vm.filterModel.totalRow = res.data.pagination.totalRow;
//                         $vm.filterModel.currentPage = res.data.pagination.currentPage;
//                         $vm.filterModel.perPage = res.data.pagination.perPage;
//                         $vm.filterModel.numPerPage = res.data.pagination.perPage;
//                         $vm.filterModel.maxSize = 5;

//                         if (res.paginations != null || res.paginations != undefined) {
//                             $vm.filterModel.totalRow = paginations.totalRow;
//                         }

//                         $vm.searchResultModel = res.data.items;
//                         // var param = res.data.items;

//                         // const results = param.filter((param) => {
//                         //     return param.transactionType !=  "Begin"
//                         // })
//                         // $vm.searchResultModel = results;
//                     }
//                     else {

//                         $vm.searchResultModel = res.data.items;
//                     }
//                 });
//             };


            function getToday() {
                var today = new Date();

                var mm = today.getMonth() + 1;
                var yyyy = today.getUTCFullYear();
                var dd = today.getDate();


                if (dd < 10) dd = '0' + dd;
                if (mm < 10) mm = '0' + mm;

                return yyyy.toString() + mm.toString() + dd.toString();
            }



            $scope.searchFilter = function (param) {
                var deferred = $q.defer();
                
                viewModel.search(param).then(
                    function success(res) {
                        deferred.resolve(res);
                    },
                    function error(response) {
                        deferred.reject(response);
                    });

                return deferred.promise;
            }
            $scope.filterSearch = function () {
                

                    var isValidateMsg = '';
                    if ($vm.filterModel.createDate_From == '' || $vm.filterModel.createDate_To == '' || $vm.filterModel.productConversionBarcode == ''
                    || $vm.filterModel.createDate_From == undefined || $vm.filterModel.createDate_To == undefined || $vm.filterModel.productConversionBarcode == undefined 
                    ) {
                        isValidateMsg = 'กรุณากรอกข้อมูลค้นหาให้ครบถ้วน';
                    }

                    if (isValidateMsg.length > 0) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Validate',
                            message: isValidateMsg
                        });
                        return;
                    }
                    else {

                        // $scope.filterModel = $scope.filterModel || {};
                        // $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                        // $scope.filterModel.perPage = $vm.filterModel.perPage;
                        // $vm.filterModel.productConversionBarcode = $scope.filterModel.productConversionBarcode;
                        // $vm.filterModel.createDate_From = $scope.filterModel.createDate_From;
                        // $vm.filterModel.createDate_To = $scope.filterModel.createDate_To;

                        viewModel.search($vm.filterModel).then(function success(res) {
                            $vm.filterModel.totalRow = res.data.pagination.totalRow;
                            $vm.filterModel.currentPage = res.data.pagination.currentPage;
                            $vm.filterModel.perPage = res.data.pagination.perPage;
                            $vm.filterModel.numPerPage = res.data.pagination.perPage;
                            $vm.filterModel.maxSize = 5;
                            $vm.searchResultModel = res.data.items;

                            // var param = res.data.items;

                            // const results = param.filter((param) => {
                            //     return param.transactionType !=  "Begin"
                            // })
                            // $vm.searchResultModel = results;

                        

                        }, function error(res) { });
                    }
                
            }

            $scope.clearSearch = function (param) {
                $scope.filterModel = {};
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();
                $state.reload();
                $window.scrollTo(0, 0);
            }


            //----------------------------------------------------
            // Export Excel
            $scope.exportFile = {

                ExportStockMovement: function (fileType) {
                    dpMessageBox.confirm({
                        title: 'Confirm.',
                        message: 'Do you want to download?'
                    }).then(function success() {
                        // var item = $vm.searchResultModel;
                        ExportStockMovement(fileType);
                    });
                },
            }
    
            function ExportStockMovement(fileType) {
                var item = angular.copy($vm.searchResultModel);
                var model = {};
                var aa = {};
                // $vm.filterModel.Type = 'StockMovement';
                // model = { 'listInquiryStockMovement': $vm.searchResultModel};
    
                
                // let dataList = model.listInquiryStockMovement;
                // for (var i = 0; i <= dataList.length - 1; i++) {
                //     model.listInquiryStockMovement[i].rowIndex = i + 1
                //     model.listInquiryStockMovement[i].Type = 'StockMovement';
                // }
    
                var deferred = $q.defer();
                $vm.filterModel.excelName = 'StockMovement';  
                $vm.filterModel.reportType = fileType
                viewModel.ExportStockMovement($vm.filterModel).then(
                    function success(results) {
                        $vm.triggerSearch
                        deferred.resolve(results);
                    },
                    function error(response) {
    
                        dpMessageBox.alert({
                            title: 'Information.',
                            message: "Connect Service Fail."
                        })
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
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

            this.$onInit = function () {
                // $vm.triggerSearch();
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel.perPage = $vm.filterModel.perPage;
                $scope.filterModel.currentPage = $vm.filterModel.currentPage;
                $scope.filterModel.create_Date = getToday();
                $scope.filterModel.create_DateTo = getToday();
                $vm.filterModel.createDate_From = getToday();
                $vm.filterModel.createDate_To = getToday();

            };

            this.$onDestroy = function () {
            };

            $scope.$on('$destroy', function () {
                $vm.$onDestroy();
            });

        }
    });

})();