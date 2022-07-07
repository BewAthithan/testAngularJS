
(function () {
    'use strict'
    app.directive('zonePutAwayPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/zonePutAwayPopup/zonePutAwayPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'zonePutAwayFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, zonePutAwayFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = zonePutAwayFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                            $scope.zone={};
                        };
                        $scope.onClose = function (param) {
                            // var param = {};
                            // param.zonePutAwayIndex = "";
                            // param.zonePutAwayId = "";
                            // param.zonePutAwayName = "";
                            // $scope.invokes.selected(param);
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
                        $scope.delegates.zonePutAwayPopup = function (param, index) {
                            $scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            viewModel.popupSearch(model).then(
                                function success(res) {
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.filter = function () {
                            $scope.zone = $scope.zone || {};
                            $scope.zone.advanceSearch = true;
                            $scope.zone.currentPage = 0;
                            $scope.zone.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.zone).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.paginationInfo;
                                $scope.datalist.items = res.data.result;
                               
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.result, );
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.zone = $scope.zone || {};
                            $scope.zone.key = $scope.model.key;
                            $scope.zone.advanceSearch = false;
                            $scope.zone.currentPage = 0;
                            $scope.zone.numPerPage = $scope.model.numPerPage;
                            $scope.zone.zonePutAwayName = $scope.index;
                            $scope.actionPS = '2';
                            $scope.search($scope.zone).then(function success(res) {
                                $scope.datalist.items = res.data.result;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.result);
                            }, function error(res) { });
                        };

                      

                        $scope.searchFilter = function (model) {
                            var deferred = $q.defer();
                            viewModel.popupSearch(model).then(
                                function success(res) { 
                                    deferred.resolve(res);                                    
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }

                        $scope.filterSearch = function (){
                            
                            $scope.zone = $scope.zone || {};
                            $scope.searchFilter($scope.zone).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.paginationInfo;
                                $scope.datalist.items = res.data.result;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.result);
                            }, function error(res) { });
                        }
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
                                    $scope.zone = $scope.zone || {};
                                    $scope.zone.currentPage = param.currentPage;
                                    $scope.zone.numPerPage = param.numPerPage;
                                    
                                    $scope.search($scope.zone).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.paginationInfo;
                                        $scope.datalist = res.data.result;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data.result, res.data.paginationInfo);
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
                                clear: function (param){
                                    
                                    if ($scope.invokes.clear != undefined)
                                        $scope.invokes.clear(param);
                                    $scope.onShow = false;
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
