(function () {
    'use strict'
    app.component('cartAssignListV2', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/GI/CartAssignV2/component/cartAssignListV2.html";
        },
        bindings: {
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: "=?",
            triggerCreate: '=?',
            isFilter: '=?',
            isLoading: '=?',
            isLoadingPicking: '=?'

        },
        controller: function ($scope, $filter, $q, $compile, $http, $state, pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, cartAssignFactory) {
            var $vm = this;
            $scope.items = [];
            $scope.items = $scope.items || [];
            // setting column
            $scope.showColumnSetting = false;
            $scope.isLoading = false;

            var viewModel = cartAssignFactory;
            $vm.$onInit = function () {
            }
            var defer = {};

            $scope.filterModel = {
                currentPage: 0,
                numPerPage: 30,
                totalRow: 0,
                key: '',
                advanceSearch: false,
                showError: false,
                type: 1
            };
            $vm.isLoading = function (param) {
                $scope.filterModel.equipmentName = param.equipmentName;
                defer = $q.defer();
                $vm.isLoadingPicking = false;
                $scope.isLoading = true;
                if (param != undefined) {

                }
                else {
                    // $scope.buttons.add = true;
                    // $scope.buttons.update = false;
                }
                return defer.promise;
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
            $scope.ClearMany = function () {
                let models = $vm.searchResultModel;
                var countChecked = 0;
                if (models.length > 0) {
                    for (var i = 0; i <= models.length - 1; i++) {
                        if (models[i].selected == true) {
                            countChecked = countChecked + 1;
                            $scope.filterModel.planGoodsIssueNo = models[i].planGoodsIssueNo;
                            $scope.filterModel.equipmentId = models[i].equipmentId;
                            $scope.filterModel.tagOutPickNo = models[i].tagOutPickNo;
                            $scope.filterModel.equipmentItemName = models[i].equipmentItemName;
                        }
                    }
                    if (countChecked > 0) {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to Clear '
                        }).then(function () {
                            pageLoading.show();
                            viewModel.checkAssignPicking($scope.filterModel).then(function success(res) {
                                if (res.data == true) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: " Cart Location นี้กำลังทำการหยิบสินค้าอยู่ !"
                                    })
                                }
                                else {
                                    ClearMany(models).then(function success(res) {
                                        pageLoading.hide();
                                        CheckCartNumberList($scope.filterModel.equipmentItemName);

                                    }, function error(param) {
                                        dpMessageBox.alert({
                                            ok: 'Close',
                                            title: 'Information.',
                                            message: " Error !!"
                                        })
                                    });
                                }
                            })
                        });

                    }
                    if (countChecked == 0) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: " กรุณาเลือกข้อมูลที่ต้องการลบ "
                        })
                    }
                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " No Data for Delete !"
                    })
                }

            }

            $scope.ClearAll = function () {
                var defer = $q.defer();
                var countChecked = 0;
                let models = $vm.searchResultModel;
                if (models.length > 0) {
                    dpMessageBox.confirm({
                        ok: 'Yes',
                        cancel: 'No',
                        title: 'Confirm ?',
                        message: 'Do you want to Clear All ?'
                    }).then(function () {
                        pageLoading.show();
                        if (models.length > 0) {
                            for (var i = 0; i <= models.length - 1; i++) {
                                $scope.filterModel.planGoodsIssueNo = models[i].planGoodsIssueNo;
                                $scope.filterModel.equipmentId = models[i].equipmentId;
                                $scope.filterModel.tagOutPickNo = models[i].tagOutPickNo;
                            }
                        }
                        viewModel.checkAssignPicking($scope.filterModel).then(function success(res) {
                            if (res.data == true) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " Cart Location นี้กำลังทำการหยิบสินค้าอยู่ !"
                                })
                            }
                            else {
                                ClearAll(models).then(function success(res) {
                                    pageLoading.hide();
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "Success"
                                    })
                                }, function error(param) {
                                    dpMessageBox.alert({
                                        ok: 'Close',
                                        title: 'Information.',
                                        message: "ClearAll Error !!"
                                    })
                                });
                            }
                        })

                    });
                    // for (var i = 0; i <= models.length - 1; i++) {
                    //     if (models[i].selected == true) {
                    //         countChecked = countChecked + 1;
                    //     }                        
                    // }
                    // if (countChecked > 0) {
                    //     dpMessageBox.confirm({
                    //         ok: 'Yes',
                    //         cancel: 'No',
                    //         title: 'Confirm ?',
                    //         message: 'Do you want to Clear All ?'
                    //     }).then(function () {
                    //         pageLoading.show();
                    //         ClearAll(models).then(function success(res) {
                    //             pageLoading.hide();
                    //             dpMessageBox.alert({
                    //                 ok: 'Close',
                    //                 title: 'Information.',
                    //                 message: "Success"
                    //             })
                    //         }, function error(param) {
                    //             dpMessageBox.alert({
                    //                 ok: 'Close',
                    //                 title: 'Information.',
                    //                 message: "ClearAll Error !!"
                    //             })
                    //         });
                    //     });
                    // }
                    // if (countChecked == 0) {
                    //     dpMessageBox.alert({
                    //         ok: 'Close',
                    //         title: 'Information.',
                    //         message: " กรุณาเลือกเลือกทั้งหมดเพื่อลบข้อมูล "
                    //     })
                    // }

                }
                else {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: " No Data for Delete !"
                    })
                }

            }
            function CheckCartNumberList(param) {
                viewModel.CheckCartNumberList(param).then(
                    function success(res) {
                        if (res.data.length > 0) {
                            $vm.searchResultModel = res.data;
                        }
                        else {
                            $vm.searchResultModel = {};
                            if ($scope.isClear != 1) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: "Data " + " " + $scope.filterModel.equipmentItemName + " Not Found "
                                })
                            }
                        }
                    },
                    function error(res) {
                        dpMessageBox.alert({
                            ok: 'Close',
                            title: 'Information.',
                            message: "Error"
                        })
                    });
            }
            function ClearAll(item) {
                let deferred = $q.defer();

                let dataList = {
                    listCartAssignViewModel: item
                }

                viewModel.clearData(dataList).then(
                    function success(results) {
                        $vm.searchResultModel = {};
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            function ClearMany(item) {
                let deferred = $q.defer();
                let param = "";
                if (item.length > 0) {
                    var Activity = [];
                    for (var i = 0; i <= item.length - 1; i++) {
                        let newItem = {};
                        if (item[i].selected == true) {
                            newItem.planGoodsIssueNo = item[i].planGoodsIssueNo;
                            newItem.equipmentId = item[i].equipmentId;
                            newItem.equipmentIndex = item[i].equipmentIndex;
                            newItem.equipmentName = item[i].equipmentName;
                            newItem.equipmentItemId = item[i].equipmentItemId;
                            newItem.equipmentItemIndex = item[i].equipmentItemIndex;
                            newItem.equipmentItemName = item[i].equipmentItemName;
                            newItem.tagOutPickNo = item[i].tagOutPickNo;
                            newItem.refDocumentItemIndex = item[i].refDocumentItemIndex;
                            newItem.tagOutPickIndex = item[i].tagOutPickIndex;

                            newItem.updateBy = $scope.userName;
                        }
                        else {
                            newItem.emtry = 1;
                        }
                        if (newItem.emtry != 1) {
                            Activity.push(newItem);
                        }
                    }
                    if (Activity) {
                        param = Activity;
                    }
                    let dataList = {
                        listCartAssignViewModel: param
                    }

                    viewModel.clearData(dataList).then(
                        function success(results) {
                            $scope.isClear = 1;
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "Clear Complete"
                            })
                            deferred.resolve(results);
                        },
                        function error(response) {
                            deferred.reject(response);
                        }
                    );
                    return deferred.promise;
                }
            }

            $scope.back = function () {
                $vm.searchResultModel = {};
                defer.resolve('0');
            }

            

            var init = function () {
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.filterModel = {};
            };

          
            init();

        }
    })
})();