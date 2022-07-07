
(function () {
    'use strict'
    app.directive('checkCartonPopup', ['ngAuthSettings', '$window', 'commonService', 'pageLoading', '$timeout',
        function (ngAuthSettings, $window, commonService, pageLoading, $timeout) {
            return {
                restrict: 'E',
                controllerAs: '$ctrl',
                templateUrl: "modules/GI/CartNumber/component/CheckCartonNumber/checkCartonPopup.html",
                scope: {
                    onShow: '=',
                    delegates: '=?',
                    invokes: '=?',
                    config: '=?'
                },
                controller: ['$scope', '$http', '$q', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', '$timeout', '$translate', 'localStorageService', '$interval', 'dpMessageBox', 'cartNumberFactory',
                    function ($scope, $http, $q, ngAuthSettings, $state, pageLoading, $window, commonService, $timeout, $translate, localStorageService, $interval, dpMessageBox, cartNumberFactory) {
                        $scope.delegates = {};
                        $scope.invokes = $scope.invokes || {};
                        $scope.config = $scope.config || {};
                        // var viewModel = cartonFactory;
                        $scope.onShow = false;
                        $scope.onHide = function (param) {
                        };
                        $scope.onClose = function () {
                            if ($scope.carton.cartonNo == "" || $scope.carton.cartonNo == undefined) {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " กรุณายืนยัน CartonNo ที่ถูกต้อง !"
                                }).then(function success() {
                                    $scope.onShow = true;
                                })
                                $scope.onShow = false;
                            }
                            else {
                                dpMessageBox.alert({
                                    ok: 'Yes',
                                    title: 'Information.',
                                    message: " กรุณากดยืนยันก่อนจะออกจากหน้าต่างนี้ !"
                                }).then(function success() {
                                    $scope.onShow = true;
                                })
                                $scope.onShow = false;
                            }
                        };
                        $scope.$watchCollection('onShow', function (newVal, oldVal) {
                            if (newVal !== oldVal) {
                            }
                        });
                        $scope.model = {
                            cartonId: ''
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
                        $scope.delegates.CartonPopup = function (param) {

                            $scope.carton = $scope.carton || {};
                            $scope.carton = angular.copy(param);
                            //$scope.index = angular.copy(index);
                            //$scope.find();
                        }
                        $scope.delegates.edit = function (index) { }
                        $scope.create = function () {
                            if ($scope.invokes.add != undefined)
                                $scope.invokes.add();
                        }
                        // $scope.search = function (model) {
                        //     var deferred = $q.defer();
                        //     viewModel.filter(model).then(
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

                        // $scope.filterSearch = function (){

                        //     $scope.carton = $scope.carton || {};
                        //     $scope.searchFilter($scope.carton).then(function success(res) {
                        //         $scope.datalist.config.paginations = res.data.pagination;
                        //         $scope.datalist.items = res.data;
                        //         if ($scope.datalist.delegates.set)
                        //         $scope.datalist.delegates.set(res.data);
                        //     }, function error(res) { });
                        // }

                        // $scope.filter = function () {                            
                        //     $scope.carton = $scope.carton || {};
                        //     $scope.carton.currentPage = 0;
                        //     $scope.carton.numPerPage = $scope.model.numPerPage;
                        //     $scope.search($scope.carton).then(function success(res) {
                        //         $scope.datalist.config.paginations = res.data.pagination;
                        //         $scope.datalist.items = res.data;
                        //         if ($scope.datalist.delegates.set)
                        //         $scope.datalist.delegates.set(res.data);
                        //     }, function error(res) { });
                        // }
                        // $scope.find = function () {
                        //     $scope.carton = $scope.carton || {};
                        //     $scope.carton.key = $scope.model.key;
                        //     $scope.carton.advanceSearch = false;
                        //     $scope.carton.currentPage = 0;
                        //     $scope.carton.numPerPage = $scope.model.numPerPage;
                        //     $scope.search($scope.carton).then(function success(res) {
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

                                    $scope.carton = $scope.carton || {};
                                    $scope.carton.currentPage = param.currentPage;
                                    $scope.carton.numPerPage = param.numPerPage;
                                    $scope.search($scope.carton).then(function success(res) {
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

                        $scope.selected = function () {
                            if ($scope.carton.cartonNo == "" || $scope.carton.cartonNo == undefined) {
                                dpMessageBox.alert({
                                    ok: 'Close',
                                    title: 'Information.',
                                    message: " CartonNo ต้องไม่เป็นค่าว่าง กรุณาระบุให้ถูกต้องอีกครั้ง !"
                                }).then(function success() {
                                    $scope.onShow = true;
                                })
                                $scope.onShow = false;
                                $scope.carton.cartonNo = "";
                            }
                            else {
                                if ($scope.invokes.selected != undefined) {
                                    $scope.invokes.selected($scope.carton);
                                    $scope.onShow = false;
                                }
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
