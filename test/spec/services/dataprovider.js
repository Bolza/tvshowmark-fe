'use strict';

describe('Service: dataprovider', function () {

  // load the service's module
  beforeEach(module('tvshowmarkApp'));

  // instantiate service
  var dataprovider;
  beforeEach(inject(function (_dataprovider_) {
    dataprovider = _dataprovider_;
  }));

  it('should do something', function () {
    expect(!!dataprovider).toBe(true);
  });

});
