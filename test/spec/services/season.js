'use strict';

describe('Service: Season', function () {

  // load the service's module
  beforeEach(module('tvshowmarkApp'));

  // instantiate service
  var Season;
  beforeEach(inject(function (_Season_) {
    Season = _Season_;
  }));

  it('should do something', function () {
    expect(!!Season).toBe(true);
  });

});
