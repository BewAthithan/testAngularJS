(function () {
    'use strict'

    app.component('cyclecountForm', {
        controllerAs: '$vm',
        templateUrl: "modules/Tranfer/Cyclecount/component/CyclecountForm.html",
        bindings: {
            isLoading: '=?',
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?',
            triggerCreate: '=?',
            isFilter: '=?',

        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, cyclecountFactory, planGoodsIssueItemFactory) {
            var $vm = this;

            var defer = {};
            $vm.isFilterTable = true;
            $scope.onShow = false;
            var viewModel = cyclecountFactory;
            $scope.binModel = {};
            $scope.listBinLoc = {};

            $scope.checkAll = {};

            $scope.$watch("callSearch", function () {
                if ($scope.callSearch) {
                    $scope.callSearch();
                }
            });
            this.$onInit = function () {
                $scope.binModel = {};
                $scope.filterModel = {};
                $scope.userName = localStorageService.get('userTokenStorage');
                $scope.selected = 1;
                $scope.click = 1;
                $scope.binModel.isSku = false;
                $scope.dropdownDocumentType();
            }

            $scope.sku = {
                chk: false
            };

            $scope.hide = function () {
                $scope.sku.chk = $scope.sku.chk === false ? true : false;
                $scope.binModel.isSku = $scope.sku.chk;
            };

            $scope.selectedTab = function (tab) {
                $scope.selected = tab;
            }

            $scope.clickTab = function (tab) {
                $scope.click = tab;
            }

            $vm.onShow = function (param) {
                $scope.listBinLoc = {};
                $scope.listDetail = {};
                $scope.binModel = {};
                $scope.filterModel = {};
                $scope.selected = 1;
                $scope.click = 1;
                $scope.binModel.isSku = false;
                $scope.dropdownDocumentType.model = {};                
                defer = $q.defer();
                $scope.onShow = true;
                if (param != undefined) {
                    viewModel.find(param.cycleCount_Index).then(function (res) {

                        $scope.binModel = res.data.listHeader;
                        $scope.listBinLoc = res.data.listItem;
                        $scope.listDetail = res.data.listDetail;
                        var documentType = $scope.dropdownDocumentType
                        const resultsDocumentType = documentType.filter((documentType) => {
                            return documentType.documentType_Index == res.data.listHeader.documentType_Index;
                        })
                        $scope.dropdownDocumentType.model = resultsDocumentType[0];

                    });

                    return defer.promise;

                }
                else {
                    return defer.promise;

                }

            };

            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            $scope.SearchBin = function (param) {
                var deferred = $q.defer();
                viewModel.BinSearch(param).then(
                    function success(res) {
                        if (res.data.lenght <= 0) {
                            dpMessageBox.alert(
                                {
                                    ok: 'Close',
                                    title: 'success',
                                    message: 'NO DATA'
                                }
                            )
                        }
                        $scope.listBinLoc = res.data;
                        deferred.resolve(res);
                    },
                    function error(response) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Error',
                                message: 'Search Error'
                            }
                        )
                    });
                return deferred.promise;

            }
            $scope.detectCheckAll = function () {
                if ($scope.checkAll.lochk === true) {
                    angular.forEach($scope.listBinLoc, function (v, k) {
                        $scope.listBinLoc[k].selected = true;
                    });
                } else {
                    angular.forEach($scope.listBinLoc, function (v, k) {
                        $scope.listBinLoc[k].selected = false;
                    });
                }
            }
            $scope.add = function (data,param) {

                var item = angular.copy(param);
                var model = {};
                model = data;
                var idx = [];
                model.cycleCount_Date = $scope.binModel.cycleCount_Date;

                model.isSku = $scope.binModel.isSku
                if ($scope.dropdownDocumentType.model == null) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Validate',
                            message: 'Please Choose DocumentType !'
                        }
                    )
                    return "";
                }

                if ($scope.binModel.cycleCount_Date == null
                    || $scope.binModel.cycleCount_Date == undefined
                    || $scope.binModel.cycleCount_Date == "") {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: 'Please Choose cycleCount_Date !'
                            }
                        )
                        return "";

                }
                else {
                    model.documentType_Index = $scope.dropdownDocumentType.model.documentType_Index;
                    model.documentType_Id = $scope.dropdownDocumentType.model.documentType_Id;
                    model.documentType_Name = $scope.dropdownDocumentType.model.documentType_Name;
                }

                angular.forEach(item, function (v, k) {
                    if (v.selected) {
                        idx.push(v)
                    }
                });
                model.listBinLocation = idx;

                model.create_By = $scope.userName;


                viewModel.SaveCycleCount(model).then(function (res) {

                    if (res.data.message == true) {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Success',
                                message: res.data.document_No
                            }
                        )
                        model = {};
                        $scope.binModel = {};
                        $scope.listBinLoc = {};
                        $scope.dropdownDocumentType.model = {};
                        defer.resolve();
                    }
                    else {
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Error',
                                message: 'Save Error'
                            }
                        )
                    }
                }, function error(model) {
                    dpMessageBox.alert(
                        {
                            ok: 'Close',
                            title: 'Error',
                            message: 'Save Error'
                        }
                    )
                });
            }


            $scope.back = function () {
                var model = $scope.filterModel;
                defer.resolve();

            }

            $scope.dropdownDocumentType = function () {
                viewModel.dropdownDocumentType($scope.filterModel).then(function (res) {
                    $scope.dropdownDocumentType = res.data;
                });
            };

            $scope.popupZone = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupZone.onShow = !$scope.popupZone.onShow;
                    $scope.popupZone.delegates.zonePopup(param, index);
                },
                config: {
                    title: "Zone"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.binModel.zone_Index = angular.copy(param.zoneIndex);
                        $scope.binModel.zone_Id = angular.copy(param.zoneId);
                        $scope.binModel.zone_Name = angular.copy(param.zoneName);
                    }
                }
            };

            $scope.popupLocationType = {
                onShow: false,
                delegates: {},
                onClick: function (param, index) {
                    $scope.popupLocationType.onShow = !$scope.popupLocationType.onShow;
                    $scope.popupLocationType.delegates.locationTypePopup(param, index);
                },
                config: {
                    title: "Location Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.binModel.locationType_Index = angular.copy(param.locationTypeIndex);
                        $scope.binModel.locationType_Id = angular.copy(param.locationTypeId);
                        $scope.binModel.locationType_Name = angular.copy(param.locationTypeName);

                    }
                }
            };
            $scope.popupProduct = {
                onShow: false,
                delegates: {},
                onClick: function (index) {
                    if ($scope.filterModel.ownerIndex != null) {
                        index = $scope.filterModel.ownerIndex;
                    };
                    $scope.popupProduct.onShow = !$scope.popupProduct.onShow;
                    $scope.popupProduct.delegates.productPopup(index);

                },
                config: {
                    title: "product"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {

                        $scope.binModel.product_Index = angular.copy(param.productIndex);
                        $scope.binModel.product_Id = angular.copy(param.productId);
                        $scope.binModel.product_Name = angular.copy(param.productName);
                        $scope.binModel.productSecond_Name = angular.copy(param.productSecondName);
                        $scope.binModel.productThird_Name = angular.copy(param.productThirdName);

                    }
                }
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




        }
    })
})();