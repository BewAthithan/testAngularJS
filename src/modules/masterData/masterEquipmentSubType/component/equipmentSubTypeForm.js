(function () {
    'use strict'

    app.component('masterEquipmentSubtypeForm', {
        controllerAs: '$vm',
        templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
            return "modules/masterData/masterEquipmentSubType/component/equipmentSubTypeForm.html";
        },
        bindings: {
            onShow: '=?',
            searchResultModel: '=?',
            filterModel: '=?',
            triggerSearch: '=?'
        },
        controller: function ($scope, $q, $filter, $http, /*ngAuthSettings,*/ $state, /*authService*/ pageLoading, $window, commonService,  dpMessageBox,equipmentSubTypeFactory) {
            var $vm = this;

            $scope.onShow = false;
            var defer = {};
            var viewModel = equipmentSubTypeFactory;
            $scope.Cancel = true;
            $scope.update = false;
            $scope.create = true;
            $vm.onShow = function (param) {
                defer = $q.defer();
                if($scope.filterModel != null){
                    $scope.filterModel = {};
                }
                $scope.onShow = true;
                if (param != undefined) {
                    pageLoading.show();
                    $scope.create = false;      
                    viewModel.getId(param).then(function (res) {
                        pageLoading.hide();
                        $scope.filterModel = res.data[0];
                        $scope.update = true;
                    });
                }
                else {
                    $scope.update = false
                    $scope.create = true;
                }
                return defer.promise;
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

            $scope.add = function(){
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();
                            Add(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                });

                $scope.filterModel = {};    
            }

            $scope.edit = function(){
                var model = $scope.filterModel;
                $scope.validateMsg = "";
                validate(model).then(function (result) {
                    if (result) {
                        $scope.validateMsg = result;
                        dpMessageBox.alert(
                            {
                                ok: 'Close',
                                title: 'Validate',
                                message: result
                            }
                        )
                    }
                    else {
                        dpMessageBox.confirm({
                            ok: 'Yes',
                            cancel: 'No',
                            title: 'Confirm ?',
                            message: 'Do you want to save !'
                        }).then(function () {
                            pageLoading.show();
                            Edit(model).then(function success(res) {
                                pageLoading.hide();
                                $state.reload($state.current.name);
                            }, function error(param) {
                                dpMessageBox.alert(param).then(function (param) { }, function (param) { });
                            });
                        });

                        defer.resolve();
                    }
                });
            }

            $scope.back = function () {
                defer.resolve('');
            }

            function validate(param) {
                let defer = $q.defer();
                let msg = "";
                if (param.equipmentSubTypeName == null) {
                    msg = ' Equipment SubType Name is required !'
                    defer.resolve(msg);
                }
                else if (param.equipmentTypeName == null){
                    msg = ' EquipmentType is required !'
                    defer.resolve(msg);
                }
                defer.resolve(msg);

                return defer.promise;
            }
            $scope.show = {
                main: true,
                transport: false,
                warehouse: false
            };
            $scope.buttons = {
                add: true,
                update: false,
                back: true
            };

            function Add(param) {
                let deferred = $q.defer();                
                viewModel.add(param).then(
                    function success(results) {
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }
            function Edit(param) {
                var deferred = $q.defer();
                viewModel.edit(param).then(
                    function success(results) {
                        $state.reload($state.current.name); 
                        deferred.resolve(results);
                    },
                    function error(response) {
                        deferred.reject(response);
                    }
                );
                return deferred.promise;
            }

            $scope.popupEquipmentType = {
                onShow: false,
                delegates: {},
                onClick: function (index) {                
                    $scope.popupEquipmentType.onShow = !$scope.popupEquipmentType.onShow;
                    $scope.popupEquipmentType.delegates.equipmentTypePopup(index);
                },
                config: {
                    title: "Equipment Type"
                },
                invokes: {
                    add: function (param) { },
                    edit: function (param) { },
                    selected: function (param) {
                        $scope.filterModel.equipmentTypeIndex = angular.copy(param.equipmentTypeIndex);
                        $scope.filterModel.equipmentTypeId = angular.copy(param.equipmentTypeId);
                        $scope.filterModel.equipmentTypeName = angular.copy(param.equipmentTypeId) + " - " + angular.copy(param.equipmentTypeName);
                    }
                }
            };


            var init = function () {

                $scope.filterModel = {};
            };
            init();
        }
    })
})();