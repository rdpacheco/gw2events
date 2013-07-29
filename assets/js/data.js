
/**
* GW2 Events - Data
*/
(function (window, RDP, $) {

    /**
    * Constructor
    */
    function GWData(userOpts) {
        RDP.RDPObject.call(this, userOpts);
    }
    GWData.prototype = Object.create(RDP.RDPObject.prototype);
    GWData.prototype.constructor = GWData;

    /**
    * Static methods and properties
    */

    // Defaults
    GWData.defaults = {
        url: "events.php"
    };
    GWData.storage = new RDP.Storage("GWData");

    /**
    * Instance methods and properties
    */

    // Get remote data
    GWData.prototype.getRemoteData = function (dataOpts) {
        return $.ajax({
            url: this.options.url,
            data: dataOpts,
            dataType: "json"
        });
    };

    // Get data
    GWData.prototype.getData = function (dataOpts, useCache) {
        var
            constr = this.constructor,
            def = new $.Deferred(),
            data;

        // Grab from local storage
        if (useCache) {
            data = constr.storage.get(dataOpts.type);
            data = def.resolve(data ? JSON.parse(data) : data);
        }

        // Grab from server
        if (!data || data.state() !== "resolved") {
            data = this.getRemoteData(dataOpts);

            // Save data to local storage
            if (useCache) {
                data.done(function (results) {
                    constr.storage.set(dataOpts.type, JSON.stringify(results));
                });
            }
        }
        return data;
    };

    // Get data by type
    GWData.prototype.getDataByType = function (type, mapID) {
        var dataOpts = {
            type: type,
            mapID: mapID
        };
        if (type === "event") {
            return this.getData(dataOpts);
        } else {
            return this.getData(dataOpts, true);
        }
    };

    // Expose
    RDP.GWData = GWData;
}(window, RDP, jQuery));
