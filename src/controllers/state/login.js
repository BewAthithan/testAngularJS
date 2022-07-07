
'use strict';
app.controller('loginController', ['$scope', '$location', 'ngAuthSettings', '$state', 'pageLoading', '$window', 'commonService', 'authService', 'localStorageService', 'dpMessageBox', 'userFactory',
    function ($scope, $location, ngAuthSettings, $state, pageLoading, $window, commonService, authService, localStorageService, dpMessageBox, userFactory) {
        $scope.loginData = {};
        $scope.component = {};

        var viewModel = userFactory;
        pageLoading.hide();
        $scope.login = function (username, password) {
            var loginData = {
                "Username": username,
                "UserPassword": password
            }

            //let data = $scope.loginData;
            if (loginData.Username != undefined && loginData.Username.length < 6) {
                alert("Username must be atleast 6 charactrs long, Please Try Again");
            }

            else if (loginData.UserPassword != undefined && loginData.UserPassword.length < 6) {
                alert("Password must be atleast 6 charactrs long, Please Try Again");
            }
            else if (loginData.Username != null && loginData.UserPassword != null) {
                pageLoading.show();

                viewModel.addUser(loginData).then(function (res) {
                    pageLoading.hide();
                    if (res.data.userName == "") {
                        alert("Username and Password Incorrect !!");
                    }
                    else {
                        viewModel.setParam(res.data.userName);                 
                        $scope.component.username = res.data.userName;                       
                        if (viewModel.getParam()) {                                                       
                            $window.localStorage['isReload'] = 1; 
                            $window.localStorage['userGroupName'] = res.data.userGroupName; 
                            $window.localStorage['m3n7'] = JSON.stringify(res.data.userMenuViewModel);
                            $state.go('tops.index');
                        }
                    }
                });
            }
            // $state.go('tops.index');       
        };

        var init = function () {
            var rememberMe = viewModel.getParam();
            if (rememberMe != undefined) {
                $scope.loginData.User = rememberMe;
                $scope.loginData.Rememberme = true;


                // $state.go('tops.index');
                $state.transitionTo('tops.index', {}, {
                    reload: true, inherit: false, notify: true
                });
            }
        }

        init();
    }]);
