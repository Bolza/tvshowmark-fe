'use strict';

describe('Controller: TopsCtrl', function () {

  // load the controller's module
  beforeEach(module('tvshowmarkApp'));

  var TopsCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    TopsCtrl = $controller('TopsCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
