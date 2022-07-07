'use strict'
app.component('shortPickingTable', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/ShortPickingTools/component/shortPickingTable.html";
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
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, shortPickingFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = shortPickingFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;

        $scope.isFilter = true;
        $scope.reasonCode = false;


        $vm.$onInit = function () {
            $scope.userName = localStorageService.get('userTokenStorage');
        }



        $scope.CloneMarshall = function (param) {
            var models = param;                
                    if (param.userAssign == "" || param.userAssign == undefined
                    || param.userAssign == null || param.userAssign == $scope.userName) {
                        models.userAssign = $scope.userName;
                clone(models);
            }
            else {
                // if (param.userAssignTask != $scope.userName) {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'มี User อื่นทำอยู่ จะทำแทน หรือไม่ !'
                    }).then(function () {
                        models.userAssign = $scope.userName;
                        clone(models).then(function success(res) {
                        }, function error(param) {
                            dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                        });
                    });
                // }
                // else {
                //     clone(models);
                // }
            }
        }



        function clone(param) {
            var deferred = $q.defer();
            var item = param;
            Progressbar.show();
            var msg = validate();
            if (msg != '') {
                deferred.reject(msg);
            } else {
                viewModel.CloneMarshall(item).then(
                    function success(results) {
                        console.log(results);
                        if (results.data == "fasle") {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "มีคนใช้งานอยู่กรุณา ลองใหม่"
                            })
                        }
                        else if(results.data == "true"){
                            $scope.editItem(results.config.data);
                            Progressbar.hide();
                            deferred.resolve(param);
                        }
                        else 
                        {
                            MessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: results.data
                            })
                        }
                        Progressbar.hide();
                        deferred.resolve(param);
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
            if ($scope.onShow) {
                $vm.isFilter = false;
                $scope.onShow(param).then(function (result) {

                    // $vm.isFilter = true;


                    if (result == '1') {
                        $vm.triggerSearch();
                        $vm.isFilter = true;
                    }
                    else {
                        $vm.isFilter = true;
                        $vm.triggerSearch();
                    }

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
            $vm.triggerSearch();
        }

        $scope.pageOption = [
            { value: 30 },
            { value: 50 },
            { value: 100 },
            { value: 500 }
        ];


        var init = function () {
        };
        init();

    }
});