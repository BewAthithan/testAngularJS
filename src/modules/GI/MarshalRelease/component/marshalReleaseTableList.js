'use strict'
app.component('marshalReleaseTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/MarshalRelease/component/marshalReleaseTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        pickingTools: '=?'

    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, marshallReleaseFactory,planGoodsIssueFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = marshallReleaseFactory;
        var userassignviewModel = planGoodsIssueFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $scope.isFilter = true;

        $scope.ResultModel = {};

        $vm.$onInit = function () {
            $scope.pagging = {
                totalRow: 0,
                currentPage: 1,
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

            $scope.userName = localStorageService.get('userTokenStorage');

            

            // setTimeout(
            //     function () {
            //         $scope.addMarshal();
            //     }, 100000);
        }

        $vm.release = function () {

            if ($scope.pickingTools) {
                $vm.isFilter = false;
                $scope.pickingTools().then(function () {
                    $vm.isFilter = true;

                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        }


        $vm.triggerCreate = function () {
            if ($scope.pickingTools) {
                $vm.isFilter = false;
                $scope.pickingTools().then(function (result) {
                    $vm.isFilter = true;
                }).catch(function (error) {
                    defer.reject({ 'Message': error });
                });
            }
        };


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


        $scope.ConfirmMarshall = function (param) {
            var validateChk = "";
            for (let index = 0; index < $vm.searchResultModel.length; index++) {
                if ($vm.searchResultModel[index].selected) {
                    // if ($vm.searchResultModel[index].documentStatus != "-1")
                    validateChk = validateChk + ' ' + $vm.searchResultModel[index].planGoodsIssueNo;
                }

            }
            if (validateChk == "") {
                dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Close Document',
                    message: 'กรุณาเลือกข้อมูล !!'
                });
                return;
            }
            else {
                MessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm.',
                    message: 'Do You Want to ConfirmMarshall ?'
                }).then(function success() {
                    var item = angular.copy($vm.searchResultModel);
                    var models = [];
                    angular.forEach(item, function (v, k) {
                        if (v.selected) {
                            models.push(v);
                        }
                    });
                    models[0].userAssign = $scope.userName;
                    confirm(models);
                });
            }
        }


        $scope.addMarshal = function () {
            $scope.ResultModel = getToday();
            var model = $scope.ResultModel;
            viewModel.GetMarshallAuto(model).then(function (res) {
                debugger
                $vm.triggerSearch();
            }, function error(model) {
            });
        }


        function confirm(param) {
            var deferred = $q.defer();
            var item = { MarshalReleaseViewModel: [] };

            for (let index = 0; index < param.length; index++) {
                item.MarshalReleaseViewModel.push(param[index]);
            }

            Progressbar.show();
            var msg = validate();
            if (msg != '') {
                deferred.reject(msg);
            } else {
                viewModel.GetMarshall(item).then(
                    function success(results) {
                        if (results.data == "ready") {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "SO นี้ มีการ Marshal แล้ว"
                            })
                            setTimeout(() => {
                                $vm.triggerSearch();                                
                            }, 500);
                        }
                        else {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: results.data
                            })
                            $vm.triggerSearch();
                            Progressbar.hide();
                            deferred.resolve(results);
                        }

                    },
                    function error(response) {
                        Progressbar.hide();
                        MessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "ERROR"
                        })
                        deferred.reject(response);
                    }
                );

            }
            return deferred.promise;
        }

        $scope.editItem = function (param) {
            userassignviewModel.getId(param.planGoodsIssueIndex).then(function (res) {
                if (res.data.userAssign == "" || res.data.userAssign == undefined
                    || res.data.userAssign == null || res.data.userAssign == $scope.userName) {
                    param.UserAssign = $scope.userName;
                    userassignviewModel.updateUserAssign(param).then(function (res) {
                        if ($scope.onShow) {
                            $vm.isFilter = false;
                            $scope.onShow(param).then(function (result) {
                                $vm.isFilter = true;
                            }).catch(function (error) {
                                defer.reject({ 'Message': error });
                            });
                        }
                    });
                }
                // if (res.data.userAssign != $scope.UserName) {
                else {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'InformaTion',
                        message: 'มี User อื่นทำอยู่ จะ ทำแทน หรือไม่ ?'
                    }).then(function success() {
                        param.UserAssign = $scope.userName;
                        userassignviewModel.updateUserAssign(param).then(function (res) {
                            if ($scope.onShow) {
                                $vm.isFilter = false;
                                $scope.onShow(param).then(function (result) {
                                    $vm.isFilter = true;
                                }).catch(function (error) {
                                    defer.reject({ 'Message': error });
                                });
                            }
                        }, function error(res) { });
                    });
                }
            });
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
        $scope.pageMode = 'Master';

        $scope.$watch('tblHeader', function (n, o) {
            if (n) {
                localStorageService.set(_storageName, n);
            }
        }, true);



        $scope.changeTableSize = function () {
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

        $scope.serchPage = function (param) {

            viewModel.marshallSearch(param).then(function success(res) {
                $vm.filterModel.totalRow = res.data.pagination.totalRow;
                $vm.filterModel.currentPage = res.data.pagination.currentPage;
                $vm.filterModel.perPage = res.data.pagination.perPage;
                $vm.filterModel.numPerPage = res.data.pagination.perPage;
                $vm.searchResultModel = res.data.items;
            }, function error(res) { });
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

        var initForm = function () {

        };
        var init = function () {
        };
        init();

    }
});