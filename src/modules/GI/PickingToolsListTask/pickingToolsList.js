'use strict'
app.component('pickingToolsList', {
    controllerAs: '$vm',
    templateUrl: function ($element, $attrs, /*ngAuthSettings,*/ $window, commonService) {
        return "modules/GI/PickingToolsListTask/pickingToolsList.html";
    },
    bindings: {
        isLoading: '=?',
        searchResultModel: '=?',
        filterModel: '=?',
        triggerSearch: "=?",
        triggerCreate: '=?',
        isFilter: '=?',
        pickingToolsList:'=?'
    },
    controller: function ($scope, $filter, $q, $compile, $http, /*ngAuthSettings,*/ $state, /*authService,*/ pageLoading, $window, commonService, localStorageService, $timeout, $translate, dpMessageBox, pickingToolsListTaskFactory) {
        var $vm = this;
        var XFindItem = $filter('findItemList');
        var Progressbar = pageLoading;
        $scope.items = $scope.items || [];
        var viewModel = pickingToolsListTaskFactory;
        var item = $vm.searchResultModel;
        // setting column
        $scope.showColumnSetting = false;
        $scope.pickingToolsList = false;

        var model = $scope.filterModel;

        $vm.triggerSearch = function () {
            $vm.filterModel = $vm.filterModel || {};
            viewModel.filter($vm.filterModel).then(function (res) {
                $vm.filterModel = res.data.atcom;
                $vm.searchResultModel = res.data;
                console.log($vm.searchResultModel)
            });;
        };

        $scope.filter = function () {
            $vm.triggerSearch();
        };


        $vm.$onInit = function () {
            $scope.filter();
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
        }



       

        $vm.pickingTools = function (param, index, owner) {
            $scope.filterModel.ownerIndex = owner;
            defer = $q.defer();
            $scope.pickingTools = true;
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



        $scope.model = {
            currentPage: 1,
            numPerPage: 30,
            totalRow: 0,
            advanceSearch: false
        };





        var initForm = function () {
        };
        var init = function () {
        };
        init();

    }
});