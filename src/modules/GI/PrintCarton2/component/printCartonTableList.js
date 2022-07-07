'use strict'
app.component('printCartonTableListTwo', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/PrintCarton2/component/printCartonTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, printCartonFactoryTwo) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = printCartonFactoryTwo;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
                numPerPage: $vm.filterModel.numPerPage,
                num: 1,
                maxSize: 2,
                perPage: 20,
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
        }



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

        $scope.detectCheckAll = function () {
            if ($scope.checkAll === true) {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = true;
                });
            } else {
                angular.forEach($vm.searchResultModel, function (v, k) {
                    $vm.searchResultModel[k].selected = false;
                });
            }
        }


        $scope.Print = function (param) {
            
            MessageBox.confirm({
                ok: 'Yes',
                cancel: 'No',
                title: 'Confirm.',
                message: 'Do You Want to Prtint ?'
            }).then(function success() {
                var item = angular.copy($vm.searchResultModel);
                var models = [];
                angular.forEach(item, function(v,k) {
                    if(v.selected){
                        models.push(v);
                    }
                });
                goToPrint(models);
            });
        }

        

        function goToPrint(param) {
            
            var deferred = $q.defer();
            var item = { ListPrintUpdateTagOutViewModel: [] };

            for (let index = 0; index < param.length; index++) {
                item.ListPrintUpdateTagOutViewModel.push(param[index]);
            }
            Progressbar.show();
            var msg = validate();
            if (msg != '') {
                deferred.reject(msg);
            } else {

                viewModel.printCarton(item).then(
                    function success(results) {
                        $scope.popupReport.onClick(results.data);
                        MessageBox.alert({
                            ok:'Close',
                            title: 'Information.',
                            message: "Confirm Success"
                        })
                        Progressbar.hide();
                        deferred.resolve(results);
                    },
                    function error(response) {
                        Progressbar.hide();
                        MessageBox.alert({
                            ok:'Close',
                            title: 'Information.',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    }
                );

            }
            return deferred.promise;
        }

        
        function validate(param) {
            var msg = "";
            return msg;
        }

        var MessageBox = dpMessageBox;
        


        $scope.show = {
            action: true,
            pagination: true,
            checkBox: false
        }


        function isNumber(n) {
            return !isNaN(parseFloat(n)) && isFinite(n);
        }

        $scope.changeTableSize = function() {
            var p = {
              currentPage: 0, //$scope.pagging.num,
              perPage: $vm.filterModel.perPage
            };
            $vm.filterModel.perPage = $vm.filterModel.perPage;
            $scope.changePage();
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
            $scope.serchPage(page);
        }

          $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
          ];


        $scope.PrintReportCarton  = function (param) {

            

            var data = param.filter((p)=>{
                return p.selected === true
            })
            if(data.length == 0)
            {
                MessageBox.alert({
                    ok:'Close',
                    title: 'Carton Label',
                    message: "กรุณาเลือกรายการ"
                })
            }
            else{
                var obj = [];
                //obj.tagOutPickNo = [];
                //obj.tagOutnumber = [];
                for (var index = 0; index < data.length; index++) {
                    obj.push({'tagOutPickNo':data[index].tagOutPickNo,'tagOutnumber':data[index].tagOut});
                }
                $scope.popupReport.onClick(obj)
            }
        }

        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param,type) {
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                if(type == "pickingslip")
                    $scope.popupReport.delegates.reportPopup(param.tagOutPickNo,"pickingslip");
                else
                    $scope.popupReport.delegates.reportPopup(param,"cartonlabel");
            },
            config: {
                title: "ReportView"
            },
            invokes: {
                add: function (param) { },
                edit: function (param) { },
                selected: function (param) {
                }
            }
        };

        $scope.serchPage = function (param){                            
            viewModel.printCartonearch(param).then(function success(res) { 
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage; 
                $vm.filterModel.perPage = res.data.pagination.perPage;   
                $vm.filterModel.numPerPage = res.data.pagination.perPage;   
                $vm.searchResultModel = res.data.items;
                $vm.searchResultModel.map((model) => {
                    if(model.tagOut != null || model.tagOut != undefined || model.tagOut != ''){
                        model.tagOut = 1
                    }
                    return model
                  })
        
            }, function error(res) { });
        } 
        

        var initForm = function () {
        };
        var init = function () {

            
        };
        init();

    }
});