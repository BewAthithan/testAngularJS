'use strict';

describe('LPN Management Component Test', function () {

    // var element, scope, $compile, $rootScope, ComponentCtrl;

    beforeEach(module("myApp"));

    var lpnController, scope, q, MocklpnFactory, MockdpMessageBox;

    var $componentController, $controller;

    beforeEach(inject(function(_$componentController_,_$controller_) {
        $componentController = _$componentController_;
        $controller = _$controller_;
    }));

    // beforeEach(inject(function($rootScope, $componentController) {

    //     scope = $rootScope.$new();

    //     lpnController = $componentController(function() {
    //         $scope: scope;
    //         $q: q;
    //         lpnFactory: MocklpnFactory;
    //         dpMessageBox: MockdpMessageBox;
    //     });

    // }));

    it("test run spec", function () {
        expect(true).toBe(true);
    });

    // it('should be', function() {
    //     console.log(lpnController);
    //     expect(scope.formData).not.toBeNull();
    // })

});