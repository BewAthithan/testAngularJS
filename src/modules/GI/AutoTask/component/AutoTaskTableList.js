'use strict'
app.component('autoTaskTableList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, $window, commonService) {
        return "modules/GI/AutoTask/component/AutoTaskTableList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, autoTaskFactory) {
        var $vm = this;
        var viewModel = autoTaskFactory;

        $vm.$onInit = function () {

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

        function dropdownUser() {
            viewModel.dropdownUser({}).then(function (res) {
                $scope.dropdownUser = res.data;
            });
        };

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
            var page = $vm.filterModel;
            var all = {
                currentPage: 0,
                numPerPage: 0
            };
            if ($vm.filterModel.currentPage != 0) {
                page.currentPage = page.currentPage;
            }

            $vm.triggerSearch(page);
        }

        $scope.changeTableSize = function () {
            let ChangeTable = 1;
            var p = $vm.filterModel;

            $vm.triggerSearch(p);
        }

        $vm.filterModel = {
            num: 1,
            totalRow: 0,
            currentPage: 1,
            maxSize: 10,
            perPage: $vm.filterModel.perPage,
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

        $scope.assign = function (parm) {
            if (parm) {
                $vm.searchResultModel.filter(f => f.selected).map(function (element) {
                    element.user_Index = parm.user_Index;
                    element.userGroup_Index = parm.userGroup_Index;
                    element.user_Id = parm.user_Id;
                    element.user_Name = parm.user_Name;
                    element.user = parm.user_Name;

                    return element;
                });

                let items = $vm.searchResultModel.filter(f => f.selected);
                if (items.length > 0) {
                    viewModel.confirm({ items }).then(function success(res) {
                        if (res.data) {
                            var contentArr = res.data.split(',');

                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                messageNewLine: contentArr
                            })
                        }
                        $vm.triggerSearch();
                    },
                        function error(res) {
                            return dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Confirm Error!!"
                            })
                        });
                }
                else {
                    return dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: "กรุณาเลือกออเดอร์ค่ะ"
                    })
                }
            }
            else {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "กรุณาเลือก User ค่ะ"
                })
            }
        }

        $scope.cancel = function () {
            let items = $vm.searchResultModel.filter(f => f.selected);
            if (items.length > 0) {
                viewModel.cancel({ items }).then(function success(res) {
                    if (res.data) {
                        var contentArr = res.data.split(',');

                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            messageNewLine: contentArr
                        })
                    }
                    $vm.triggerSearch();
                },
                    function error(res) {
                        return dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Cancel Error!!"
                        })
                    });
            }
            else {
                return dpMessageBox.alert({
                    ok: 'Close',
                    title: 'Information.',
                    message: "กรุณาเลือกออเดอร์ค่ะ"
                })
            }
        };

        // $scope.confirm = function () {
        //     let items = $vm.searchResultModel.filter(f => f.selected);
        //     if (items.length > 0) {
        //         viewModel.confirm({items}).then(function success(res) {
        //             if (res.data) {
        //                 var contentArr = res.data.split(',');

        //                 dpMessageBox.alert({
        //                     ok: 'Close',
        //                     title: 'Information.',
        //                     messageNewLine: contentArr
        //                 })
        //             }
        //             $vm.triggerSearch();
        //         },
        //             function error(res) {
        //                 dpMessageBox.alert({
        //                     ok: 'Close',
        //                     title: 'Information.',
        //                     message: "Confirm Error!!"
        //                 })
        //             });
        //     }
        //     else {
        //         return dpMessageBox.alert({
        //             ok: 'Close',
        //             title: 'Information.',
        //             message: "กรุณาเลือกออเดอร์ค่ะ"
        //         })
        //     }
        // }

        $scope.back = function () {
            $state.go('tops', {})
        }

        var init = function () {
            dropdownUser();
        };
        init();

    }
});