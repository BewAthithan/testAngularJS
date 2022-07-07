(function () {
    'use strict'

    app.component('packConfirmPWBForm', {
        controllerAs: '$vm',
        templateUrl: "modules/GI/packConfirmPWB/component/packConfirmPWBForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, packConfirmPWBFactory, callCenterItemFactory) {
            var $vm = this;

            var defer = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            var viewModel = packConfirmPWBFactory;

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            this.$onInit = function () {
                $scope.selected = 2;
                $scope.filterModel = {};
                $scope.ConfirmBy = localStorageService.get('userTokenStorage');
                $scope.userName = localStorageService.get('userTokenStorage');
            }


            $scope.getColor = function (SO, POS, replace, catchWeight) {
                if (replace == 1) {
                    return "rgb(248, 175, 255)";
                }
                else if (catchWeight == 1) {
                    return "rgb(255, 255, 0)";
                }
                else if (SO == POS) {
                    return "rgb(102, 255, 102)";
                }
                else if (SO > POS) {
                    return "rgb(255, 102, 102)";
                }
            }

            $vm.onShow = function (param) {
                $scope.selected = 2;
                $scope.Model = param;
                $scope.popupTheOneCard.onClick();

                defer = $q.defer();
                if ($scope.filterModel != null) {
                    // $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    viewModel.getId(param.posIndex).then(function (res) {
                        var param = res.data;

                        const pay = param.find((param) => {
                            return param.paymentCode != null
                        })
                        $scope.payModel = pay;


                        const results = param.filter((param) => {
                            return param.productIndex != null
                        })
                        $scope.filterModel = results;



                        const result = param.filter((param) => {
                            return param.promotionsBarcode != null
                        })
                        $scope.promotionModel = result;


                    });;
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $vm.triggerSearch = function () {
                $vm.filterModel = $vm.filterModel || {};
                pageLoading.show();
                viewModel.filter().then(function (res) {
                    pageLoading.hide();
                    $vm.filterModel = res.data;
                    $vm.searchResultModel = res.data;
                });
            };

            $scope.selectedTab = function (tab) {
                if (tab == 1) {
                    $scope.colortab1 = "#FDFEFE";
                    $scope.colortab2 = "#D3D3D3";
                }
                else if (tab == 2) {
                    $scope.colortab1 = "#D3D3D3";
                    $scope.colortab2 = "#FDFEFE";
                }
                $scope.selected = tab;
            }


            $scope.editItem = function (param, index, owner) {
                var owner = $scope.filterModel.ownerIndex;
                if ($scope.isLoading) {
                    $vm.isFilterTable = false;
                    $scope.isLoading(param, index, owner).then(function (result) {
                        $vm.isFilterTable = true;
                        $scope.filterModel.listPlanGoodIssueViewModelItem[result.index] = result;
                    }).catch(function (error) {
                        defer.reject({ 'Message': error });
                    });
                }
            }
            $scope.deleteItem = function (param, index) {
                param.splice(index, 1);
            }




            $scope.filterModels = function () {
                $scope.filterModel.isActive = 1;
                $scope.filterModel.isDelete = 0;
                $scope.filterModel.isSystem = 0;
                $scope.filterModel.StatusId = 0;
            };



            $scope.back = function () {
                var model = $scope.filterModel;
                if (model[0].posIndex != undefined) {
                    viewModel.resetUser(model[0].posIndex).then(function (res) {
                        $scope.filterModel = {};
                        defer.resolve('-99');
                    });
                }
                else {
                    defer.resolve('-99');
                }
                // defer.resolve('-99');
                // $state.reload();
            }

            $vm.onShowAfterClose = function (param) {
                $scope.Model = param;

                defer = $q.defer();

                $scope.onShow = true;
                if (param != undefined) {

                    const results = param.filter((param) => {
                        return param.close != 1;
                    })
                    $scope.filterModel = results;

                    viewModel.getId(param.posIndex).then(function (res) {
                        var model = res.data;
                        $scope.filterModel = {};
                        const results = model.filter((model) => {
                            return model.productIndex != null && model.posIndex != "00000000-0000-0000-0000-000000000000";
                        })
                        $scope.filterModel = results;
                    });
                }
                else {
                    $scope.buttons.add = true;
                    $scope.buttons.update = false;
                }
                return defer.promise;
            };

            $scope.Close = function (param, index, posItemIndex) {
                // viewModel.Close(posItemIndex).then(function success(res) {
                // }, function error(res) { });

                param.splice(index, 1);
                if (param.length > 0) {
                    for (var i = 0; i <= param.length - 1; i++) {
                        param[i].isDelete = 1;
                    }
                }

                // $vm.onShowAfterClose(param);

                // dpMessageBox.confirm({
                //     ok: 'Yes',
                //     cancel: 'No',
                //     title: 'Close',
                //     message: 'Do you want to Close ?'
                // }).then(function success() {


                //     viewModel.Close(param.posItemIndex).then(function success(res) {
                //         $vm.onShowAfterClose(param);
                //     }, function error(res) { });
                // });
            };


            $scope.Confirm = function () {
                $scope.Model.ConfirmBy = $scope.ConfirmBy;
                var item = $scope.Model;
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Close',
                    message: 'Do you want to Confirm ?'
                }).then(function success() {
                    viewModel.checkUser(item.posIndex).then(function (res) {
                        
                        if (res.data != $scope.userName) {
                            dpMessageBox.alert({
                                ok: 'Close',
                                title: 'Information.',
                                message: "User ไม่ตรงกับ UserAssign"
                            })
                            defer.resolve('-99');
                        }
                        else {
                            viewModel.Confirm(item).then(function success(res) {
                                if (res.data == "Success") {
                                    // $state.reload();
                                    defer.resolve('1');
                                }
                                else {
                                    dpMessageBox.confirm({
                                        ok: 'Yes',
                                        cancel: 'No',
                                        title: 'Information',
                                        message: res.data
                                    }).then(function success() {
                                        viewModel.ConfirmCloseNotSuccess(posIndex).then(function success(res) {
                                            // $state.reload();
                                            defer.resolve('-99');
                                        }, function error(res) { });
                                    });
                                }
                            }, function error(res) { });
                        }
                    });
                });
            };

            $scope.popupTheOneCard = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.Model.planGoodsIssueIndex != null) {
                        index = $scope.Model.planGoodsIssueIndex;
                    };
                    $scope.popupTheOneCard.onShow = !$scope.popupTheOneCard.onShow;
                    $scope.popupTheOneCard.delegates.theOneCardPopup(index);
                },
                config: {
                    title: "TheOneCard"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                    }
                }
            };


            var init = function () {
                $scope.Model = {};
            };

            init();



        }
    })
})();