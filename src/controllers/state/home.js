'use strict';
app.controller('homeController', ['$scope', '$state', 'pageLoading', 'userFactory', '$window', '$interval', 'scanReceiveFactory',
    function ($scope, $state, pageLoading, userFactory, $window, $interval, scanReceiveFactory) {

        pageLoading.hide();
        $scope.component = {};
        //$scope.component.user = "นาย เรียนรู้คน เรียนรู้โลก (บริษัท ตัวอย่างจำกัด)";
        //$scope.component.title = "KASCO TRUCK QUEUE";

        initialize();

        $scope.logout = function () {
            userFactory.reset();
            $state.go('login');
        }

        $scope.selected = "Home";

        $scope.selectedMenu = function (selected) {
            $scope.selected = selected;

            $scope.c = '';

            if ($('html').hasClass('sidebar-left-opened')) {
                $('html').toggleClass('sidebar-left-opened');
            }
        }

        // $interval(function(){
        //     // do wahetever you need here
        //     if ($window.localStorage['MaxDelAssignKey'])
        //         {
        //             debugger
        //             var deleteuser = {};
        //             deleteuser.goodsReceiveIndex = $window.localStorage['MaxDelAssignKey'];
        //             scanReceiveFactory.deleteUserAssign(deleteuser).then(
        //                 function success(results) {
        //                     debugger
        //                     $window.localStorage.removeItem('MaxDelAssignKey');
        //                 },
        //                 function error(response) {

        //                 }
        //             );

        //         }
        // },1000);

        $scope.openMenu = function (param) {

            if (param == undefined || param == '')
                $scope.c = 'open';
            else
                $scope.c = '';

        }


        function initialize() {
            if ($scope.$parent.$stateParams != undefined) {
                var Username = $scope.$parent.$stateParams.Username;
                //userFactory.reset();
                $scope.userName = userFactory.getParam();
                $scope.userGroupName = $window.localStorage['userGroupName']
                $scope.component.userName = Username;


                $scope.m3n7 = angular.fromJson($window.localStorage['m3n7']);

            }
        }

    }
]);

app.controller('noHeaderConntroller', ['$scope', 'ngAuthSettings', '$state', 'pageLoading', '$timeout'/*, 'menuItemModel'*/,
    function ($scope, ngAuthSettings, $state, pageLoading, $timeout/*, menuItemModel*/) {


    }
]);