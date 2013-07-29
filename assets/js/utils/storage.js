(function (window, RDP) {
  /*var LS = window.localStorage || {
    getItem: function () {
      return $.cookie.apply($, arguments);
    },
    setItem: function () {
      return $.cookie.apply($, arguments);
    }
  };*/
  var LS = window.localStorage;

  // Constructor
  function Storage(ns) {
    if (this instanceof Storage === false) {
      return new Storage(ns);
    }

    /**
    * Private methods
    */

    // Init
    function init() {
      this.ns = ns;
      this.data = this.fetch();
    }
    init.call(this);
  }

  /**
  * Instance methods
  */

  // Fetch
  Storage.prototype.fetch = function () {
    var data = "{}";
    if (LS) {
      data = LS.getItem(this.ns) || data;
    }
    return JSON.parse(data);
  };

  // Save
  Storage.prototype.save = function () {
    if (LS) {
      LS.setItem(this.ns, JSON.stringify(this.data));
    }
  };

  // Set
  Storage.prototype.set = function (key, value) {
    this.data[key] = value;
    this.save();
  };

  // Get
  Storage.prototype.get = function (key) {
    return this.data[key];
  };
  RDP.Storage = Storage;
}(window, RDP));
