
(function () {
    'use strict'
    app.directive('deptPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/masterData/component/deptPopup/deptPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'deptPopupFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, deptPopupFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        var viewModel = deptPopupFactory;

                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function (param) {
                            // var param = {};
                            // param.productTypeIndex = "";
                            // param.productTypeId = "";
                            // param.productTypeName = "";
                            // $scope.invokes.selected(param);
                            $scope.onShow = false;
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            productTypeId:"",
                            productTypeName: ""
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
                        $scope.delegates.deptPopup = function (param, index) {
                           
                           // $scope.dataset = angular.copy(param);
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
                            //console.log($scope.model)
                            viewModel.popupSearch($scope.model).then(
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
                            console.log(model);
                            
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

                        $scope.filter = function () {                            
                            $scope.zone = $scope.zone || {};
                            $scope.zone.currentPage = 0;
                            $scope.zone.numPerPage = $scope.model.currentPage;
                            $scope.search($scope.zone).then(function success(res) {
                                $scope.datalist.config.paginations = res.data.paginationInfo;
                                $scope.datalist.items = res.data.result;
                                if ($scope.datalist.delegates.set)
                                $scope.datalist.delegates.set(res.data.result);
                            }, function error(res) { });
                        }
                        $scope.find = function () {
                            $scope.zone = $scope.zone || {};
                            $scope.zone.key = $scope.model.key;
                            $scope.zone.advanceSearch = false;
                            $scope.zone.currentPage = 0;
                            $scope.zone.numPerPage = $scope.model.numPerPage;
                            $scope.search($scope.zone).then(function success(res) {
                                $scope.datalist.items = res.data.result;
                                if ($scope.datalist.delegates.set)
                                    $scope.datalist.delegates.set(res.data.result);
                            }, function error(res) { });
                        };
                        $scope.datalist = {
                            delegates: {},
                            config: {
                                paginations: {},
                                currentPage: $scope.model.currentPage,
                                numPerPage: $scope.model.currentPage,
                                totalRow: 0,
                            },
                            items: {},
                            invokes: {
                                page: function (param) {
                                    
                                    $scope.zone = $scope.zone || {};
                                    $scope.zone.currentPage = param.currentPage;
                                    $scope.zone.numPerPage = param.currentPage;
                                    $scope.search($scope.zone).then(function success(res) {
                                        $scope.datalist.config.paginations = res.data.paginationInfo;
                                        $scope.datalist = res.data;
                                        if ($scope.datalist.delegates.set)
                                            $scope.datalist.delegates.set(res.data, res.data.paginationInfo);
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

                        $scope.getDefault = function(){

                            if($scope.actionPS == 1){
                                $scope.zone.productTypeName = "";

                            }else($scope.actionPS == 2)
                            {
                                $scope.zone.productTypeId = "";
                            }
                        }

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
