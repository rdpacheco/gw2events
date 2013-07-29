
/**
* RDP Object
*/
(function (window, RDP, $) {

    /**
    * Constructor
    */
    function RDPObject(userObj) {

        /**
        * Variables
        */
        var self = this;
        
        // Init
        function init() {
            var constr = self.constructor;

            // Merge options
            self.options = $.extend({}, constr.defaults, userObj);

            // Resolve el
            //self.resolveEl();
        }
        init();
    }

    /**
    * Static properties and methods
    */

    // Defaults
    RDPObject.defaults = {};

    /**
    * Instance properties and methods
    */

    // Resolve el
    RDPObject.prototype.resolveEl = function () {
        var opts = this.options.
        this.$el = opts.$el || $(opts.el);
        this.el = this.$el[0];
    };

    // Trigger
    RDPObject.prototype.trigger = function (ev, data, context) {
        this.$el.trigger.call(context || this, ev, data);
    };

    // Expose
    RDP.RDPObject = RDPObject;
}(window, RDP, jQuery));
