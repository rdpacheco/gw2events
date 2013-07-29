
/**
* GW2 Events - Events
*/
(function (window, RDP, $, BB, _) {

    /**
    * Constructor
    */
    function GWEvents(userOpts) {
        RDP.RDPObject.call(this, userOpts);
        this.views = new RDP.GWViews();
        this.data = new RDP.GWData();
        this.initRouter();
    }
    GWEvents.prototype = Object.create(RDP.RDPObject.prototype);
    GWEvents.prototype.constructor = GWEvents;

    /**
    * Static methods and properties
    */

    // Defaults
    GWEvents.defaults = {};

    /**
    * Instance methods and properties
    */

    // Get data
    GWEvents.prototype.getData = function (mapID) {
        var
            self = this,
            eventData = this.data.getDataByType("event", mapID),
            eventNameData = this.data.getDataByType("eventName", mapID),
            mapNamesData = this.data.getDataByType("mapName", mapID);
        $.when(
            eventData,
            eventNameData,
            mapNamesData
        )
        .then(function (eventResp, nameResp, mapResp) {
            self.views.render({
                eventData: eventResp.eventData,
                eventNames: nameResp.eventNames,
                mapNames: mapResp.mapNames
            });
        });
    };

    // Init router
    GWEvents.prototype.initRouter = function () {
        var
            self = this,
            Router = BB.Router.extend({
            routes: {
                "": "getData",
                ":mapID": "getData"
            },
            getData: function () {
                self.getData.apply(self, arguments);
            }
        });
        this.router = new Router();
        BB.history.start();
    };

    // Expose
    RDP.GWEvents = GWEvents;
}(window, RDP, jQuery, Backbone, _));
