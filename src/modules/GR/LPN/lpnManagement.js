app.component('lpnManagement', {
    controllerAs: '$vm',
    templateUrl: 'modules/GR/LPN/lpnManagement.html',
    controller: function ($scope, $q, lpnFactory, dpMessageBox, localStorageService, pageLoading) {
        var $vm = this;
        var defer = {};
        var viewModel = lpnFactory;
        var model = $scope.filterModel;
        $vm.isFilterTable = true;

        $vm.$onInit = function () {
            $scope.filter();
            $scope.formData = {};
            $scope.userName = localStorageService.get('userTokenStorage');

            setTimeout(() => {
                $scope.filterModel.warehouseId = localStorageService.get('warehouseVariableId');
                $scope.filterModel.warehouseIndex = localStorageService.get('warehouseVariableIndex');
                $scope.filterModel.warehouseName = localStorageService.get('warehouseVariableName');
                $scope.filterModel.warehouseNameTemp = localStorageService.get('warehouseVariableName');
            }, 500);

            setTimeout(() => {
                document.getElementById("wh_lpn_p").focus();
                document.getElementById("wh_lpn_p").blur();
            }, 1000);
        }

        $scope.checkRePrint = function () {
            $scope.formData = $scope.formData || {};

            $scope.formData.lpnRunning = null;
            $scope.formData.lpnRunningEnd = null;
        }
        $scope.filterModels = function () {
            $scope.filterModel.Tag_Status = 1;
            $scope.filterModel.isDelete = 0;
            $scope.filterModel.isSystem = 0;
            $scope.filterModel.StatusId = 0;
        };
        $scope.goToPrint = function () {
            var model = $scope.filterModel;    
            $scope.filterModel.create_By = localStorageService.get('userTokenStorage');    
            if (model.PrintNumber !== undefined && model.PrintNumber != "") {
                dpMessageBox.confirm({
                    ok: 'Yes',
                    cancel: 'No',
                    title: 'Confirm ?',
                    message: 'Do you want to Running Number !'
                }).then(function () {
                    Add(model).then(function success(res) {
                        $scope.filter();
                        $scope.popupReport.onClick(res);
                        $vm.filterModel = res.config.data;
                        $vm.searchResultModel = res.config.data;
                    }, function error(param) {
                        dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                    });
                });
            }
            else
            (
                dpMessageBox.alert({
                    ok: 'Close',                   
                    title: 'Alert',
                    message: 'กรุณากรอก LPN No.'
                })
            )
        }

        function Add(param) {

            let deferred = $q.defer();
            let item = $scope.filterModels();
            item = param;
            item.create_By = localStorageService.get('userTokenStorage');
            viewModel.add(item).then(
                function success(results) {
                    dpMessageBox.alert({
                        ok: 'Close',
                        title: 'Information.',
                        message: results.data
                    })
                    deferred.resolve(results);

                },
                function error(response) {
                    deferred.reject(response);
                }
            );
            return deferred.promise;
        }

        $scope.search = function (model) {
            var deferred = $q.defer();
            pageLoading.show();
            viewModel.filter(model).then(
                function success(res) {
                    deferred.resolve(res);
                    pageLoading.hide(1000);
                },
                function error(response) {
                    deferred.reject(response);
                    pageLoading.hide(1000);
                });
            return deferred.promise;
        }

        $scope.filter = function () {

            $scope.filterModel = $scope.filterModel || {};

            pageLoading.show();

            $scope.search($scope.filterModel).then(function success(res) {
                pageLoading.hide();
                // $scope.atcom = res.data.atcom;
                // $scope.datalist.config.paginations = res.data.pagination;
                $vm.searchResultModel = res.data;
                // $scope.filterModel = res.data;
                $vm.searchResultModel.lpnLastNo = $vm.searchResultModel[0].tag_No;

                // $scope.datalist.items = res.data;
            }, function error(res) { });
        }


        $scope.goToBack = function () {

        }


        $scope.clearData = function () {

            $scope.filterModel.PrintNumber = "";
        }

        $scope.popupReport = {
            onShow: false,
            delegates: {},
            onClick: function (param) {
                
                // param = param.replace(/\n/g, " ");
                $scope.popupReport.onShow = !$scope.popupReport.onShow;
                $scope.popupReport.delegates.reportPopup(param.data,"blindLPNlabel");
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


        function validate() {
            let defer = $q.defer();
            let valid = true;

            defer.resolve(valid);

            return defer.promise;
        }

    }
})