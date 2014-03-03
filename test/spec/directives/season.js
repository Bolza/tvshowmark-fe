'use strict';

describe('Directive: season', function () {

  // load the directive's module
  beforeEach(module('tvshowmarkApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<season></season>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the season directive');
  }));
});
