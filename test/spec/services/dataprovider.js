'use strict';

describe('Service: Dataprovider', function () {

  // load the service's module
  beforeEach(module('tvshowmarkApp'));

  // instantiate service
  var Dataprovider;
  beforeEach(inject(function (_Dataprovider_) {
    Dataprovider = _Dataprovider_;
  }));

  it('should do something', function () {
    expect(!!Dataprovider).toBe(true);
  });

});
