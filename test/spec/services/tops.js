'use strict';

describe('Service: Tops', function () {

  // load the service's module
  beforeEach(module('tvshowmarkApp'));

  // instantiate service
  var Tops;
  beforeEach(inject(function (_Tops_) {
    Tops = _Tops_;
  }));

  it('should do something', function () {
    expect(!!Tops).toBe(true);
  });

});
