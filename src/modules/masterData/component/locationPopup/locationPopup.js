
(function () {
    'use strict'
    app.directive('locationPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/locationPopup/locationPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'locationFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, locationFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = locationFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            var param = {};
                            param.locationIndex = "";
                            param.locationId = "";
                            param.locationName = "";
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
                            totalRow: 0,
                            key: '',
                            advanceSearch: false,
                            locationId:"",
                            locationName:""
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
                        $scope.delegates.locationPopup = function (index) {
                            //$scope.dataset = angular.copy(param);
                            $scope.index = angular.copy(index);
                            $scope.find();
                        }
                        $scope.delegates.locationFilter = function (param) {
                            if (param != null) {
                                viewModel.CheckLocation(param).then(function success(res) {
                                    if (res.data.length != 0) {
                                        let checkIndex = res.data[0];
                                        viewModel.setParam(checkIndex);
                                        $state.go('tops.putaway_by_lpn', {

                                        });
                                    };
                                }, function error(res) { });
                            }
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        $scope.search = function (model) {
                            var deferred = $q.defer();
                            
                            viewModel.PopupSearch(model).then(
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
                            viewModel.PopupSearch(model).then(
                                function success(res) {
                                   
                                    deferred.resolve(res);
                                },
                                function error(response) {
                                    deferred.reject(response);
                                });
                            return deferred.promise;
                        }
                        $scope.filterSearch = function () {                            
                            $scope.location = $scope.location || {};
                           

                            var locationPage = {
                                locationId: $scope.location.locationId,
                                locationName: $scope.location.locationName,
                                    pagination: {
                                        currentPage: 1,
                                        perPage :$scope.model.numPerPage,
                                        totalRow: 0,
                                        key: "",
                                        advanceSearch: false
                                    }
                                
                            }

                            
                            $scope.searchFilter(locationPage).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.paginationInfo;
                                $scope.datalist.items = res.data.result;
                                $scope.productType = {};
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.result, res.data.paginationInfo);
                            }, function error(res) { });
                        }
                        $scope.filter = function () {
                            $scope.location = $scope.location || {};
                            $scope.location.advanceSearch = true;
                            $scope.location.currentPage = 0;
                            $scope.location.numPerPage = $scope.model.numPerPage;
                            
                            $scope.search($scope.location).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.pagination;
                                $scope.datalist.items = res.data;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.location = $scope.location || {};
                            $scope.location.key = $scope.model.key;
                            $scope.location.advanceSearch = false;
                            $scope.location.currentPage = 0;
                            $scope.location.numPerPage = $scope.model.numPerPage;
                            
                            var locationPage = {
                                pagination: {
                                    currentPage: 1,
                                    perPage :$scope.model.numPerPage,
                                    totalRow: 0,
                                    key: "",
                                    advanceSearch: false
                                }
                                
                            }
                            $scope.search(locationPage).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.paginationInfo;
                                $scope.datalist.items = res.data.result;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.result, res.data.paginationInfo);
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
                                    $scope.location = $scope.location || {};
                                    var locationPage = {
                                        pagination: {
                                            currentPage: param.currentPage,
                                            perPage :param.numPerPage,
                                            totalRow: 0,
                                            key: "",
                                            advanceSearch: false
                                        }
                                        
                                    }
                                    $scope.location.currentPage = param.currentPage;
                                    $scope.location.numPerPage = param.numPerPage;
                                    
                                    $scope.search(locationPage).then(function success(res) {
                                        
                                        $scope.datalist.config.paginations = res.data.paginationInfo;
                                       
                                        //$scope.datalist = res.data;
                                        $scope.datalist.items = res.data.result;
                                       
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
                                selected: function (param) {
                                    if ($scope.invokes.selected != undefined)
                                        $scope.invokes.selected(param);
                                    $scope.onShow = false;
                                },
                                checkedIndex: function (param) {
                                    if ($scope.invokes.checkedIndex != undefined)
                                        $scope.invokes.checkedIndex(param);
                                    $scope.onShow = false;
                                }
                            }
                        };

                        $scope.listItem = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.numPerPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                checkedIndex: function (param) {
                                    if ($scope.invokes.checkedIndex != undefined)
                                        $scope.invokes.checkedIndex(param);
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
