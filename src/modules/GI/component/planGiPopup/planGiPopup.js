
(function () {
    'use strict'
    app.directive('planGoodsIssuePopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/component/planGiPopup/planGiPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'loadTruckFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, loadTruckFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = loadTruckFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.planGoodsIssueNo = "";
                            param.planGoodsIssueDate = "";
                            param.planGoodsIssueDueDate = "";
                            param.ownerName = "";
                            $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 30,
                            totalRow: 1,
                            key: '',
                            advanceSearch: false
                        };
                        $scope.toggleSearch = function () {
                            $scope.model.advanceSearch = $scope.model.advanceSearch === false ? true : false;
                        };
                        $scope.delegates.search = function () {
                            if ($scope.model.advanceSearch)
                                $scope.filter();
                            else
                                $scope.find();
                        }
                        $scope.delegates.planGoodsIssuePopup = function (planGi) {
                            // $scope.dataset = angular.copy(param);
                            // $scope.index = angular.copy(index);
                            $scope.planGi = angular.copy(planGi);
                            $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {                          
                            var deferred = $q.defer();

                            viewModel.filterPopup(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.searchFilter = function (model) {                            
                            var deferred = $q.defer();
                            debugger
                            var planGINo = (model.planGoodsIssueNo == undefined || model.planGoodsIssueNo == '') ? undefined : model.planGoodsIssueNo;
                            viewModel.filterPopup(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function (data){
                            debugger
                            $scope.planGi = $scope.planGi || {};
                            $scope.planGi.PlanGoodsIssueNo = data;
                            $scope.planGi.currentPage = 1;                           
                            $scope.planGi.perPage = $scope.model.numPerPage;  
                            $scope.searchFilter($scope.planGi).then(function success(res) {
                                // $scope.datalist.config.paginations = res.data.pagination;
                                // $scope.datalist.items = res.data;
                                // if ($scope.datalist.delegates.set)
                                // $scope.datalist.delegates.set(res.data);
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.items,res.data.pagination);
                            }, function error(res) { });
                        }
                        $scope.filter = function () {
                            $scope.planGi = $scope.planGi || {};
                            $scope.planGi.advanceSearch = true;
                            $scope.planGi.currentPage = 0;
                            $scope.planGi.PerPage = $scope.model.numPerPage;
                            $scope.search($scope.planGi).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data, );
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.planGi = $scope.planGi || {};
                            //$scope.planGi.Chk =  $scope.index;    
                            $scope.planGi.currentPage = 1;                           
                            $scope.planGi.perPage = $scope.model.numPerPage;                            
                            $scope.search($scope.planGi).then(function success(res) {
                                debugger
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.items,res.data.pagination);
                            }, function error(res) { });
                        };
                        $scope.datalist = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.numPerPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    $scope.planGi = $scope.planGi || {};
                                    $scope.planGi.currentPage = param.currentPage;
                                    $scope.planGi.PerPage = param.numPerPage;
                                    debugger
                                    $scope.search($scope.planGi).then(function success(res) {
                                        // $scope.datalist.config.paginations = res.data.pagination;
                                        // $scope.datalist = res.data.items;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.items, res.data.pagination);
                                    }, function error(res) { });
                                },
                                delete: function (param) {
                                    if ($scope.invokes.delete != undefined)
                                        $scope.invokes.delete(param);
                                },
                                edit: function (param) {
                                    if ($scope.invokes.edit != undefined)
                                        $scope.invokes.edit(param);
                                },
                                selected: function (param) {
                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param);
                                    $scope.onShow = false;
                                }
                            }
                        };
                        var init = function () {

                            $q.all([
                            ]).then(function (values) {
                                var results = values;
                            }, function (reasons) {
                                var results = reasons;
                            });
                        };

                        init();
                        // Local Function
                        // end
                    }
                ],
                link: function ($scope, $element, $attributes) { }
            };
        }
    ]);
}());