'use strict';

describe('Service: Episode', function () {

  // load the service's module
  beforeEach(module('tvshowmarkApp'));

  // instantiate service
  var Episode;
  beforeEach(inject(function (_Episode_) {
    Episode = _Episode_;
  }));

  it('should do something', function () {
    expect(!!Episode).toBe(true);
  });

});
