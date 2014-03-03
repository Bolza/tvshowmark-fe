'use strict';

describe('Service: remote', function () {

  // load the service's module
  beforeEach(module('tvshowmarkApp'));

  // instantiate service
  var remote;
  beforeEach(inject(function (_remote_) {
    remote = _remote_;
  }));

  it('should do something', function () {
    expect(!!remote).toBe(true);
  });

});
