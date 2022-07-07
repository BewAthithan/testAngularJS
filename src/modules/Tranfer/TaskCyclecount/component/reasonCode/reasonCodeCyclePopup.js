
(function () {
    'use strict'
    app.directive('reasonCodeCycle', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/Tranfer/TaskCyclecount/component/reasonCode/reasonCodeCyclePopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'taskcyclecountFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, taskcyclecountFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = taskcyclecountFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            currentPage: 0,
                            numPerPage: 5,
                            totalRow: 0,
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
                        $scope.delegates.ReasonPopup = function (param, index) {
                            debugger
                            viewModel.filterReasonCode(param).then(
                                function success(res) {
                                    debugger
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                                },
                                function error(response) {
                                });
                        }

                        // $scope.searchMarShall = function (model) {

                        //     var deferred = $q.defer();
                        //     viewModel.filterMarshall(model).then(
                        //         function success(res) {
                        //             deferred.resolve(res);
                        //         },
                        //         function error(response) {
                        //             deferred.reject(response);
                        //         });
                        //     return deferred.promise;
                        // }

                        // $scope.searchFilter = function (model) {
                        //     var deferred = $q.defer();
                        //     viewModel.search(model).then(
                        //         function success(res) {
                        //             deferred.resolve(res);
                        //         },
                        //         function error(response) {
                        //             deferred.reject(response);
                        //         });
                        //     return deferred.promise;
                        // }

                        // $scope.findMarShall = function () {
                        //     $scope.reasonCode = $scope.reasonCode || {};
                        //     $scope.reasonCode.Chk = $scope.index;
                        //     $scope.searchMarShall($scope.reasonCode.Chk).then(function success(res) {
                        //         $scope.datalist.items = res.data;
                        //         if ($scope.datalist.delegates.set)
                        //             $scope.datalist.delegates.set(res.data);
                        //     }, function error(res) { });
                        // };

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
                                    $scope.reasonCode = $scope.reasonCode || {};
                                    $scope.reasonCode.currentPage = param.currentPage;
                                    $scope.reasonCode.numPerPage = param.numPerPage;
                                    $scope.search($scope.reasonCode).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.pagination;
                                        $scope.datalist = res.data;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data, res.data.pagination);
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
