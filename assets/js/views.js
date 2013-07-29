
/**
* GW2 Events - Views
*/
(function (window, RDP, $, _) {

    /**
    * Constructor
    */
    function GWViews(userOpts) {
        RDP.RDPObject.call(this, userOpts);
        this.initVars();
        this.prepTemplates();
    }
    GWViews.prototype = Object.create(RDP.RDPObject.prototype);
    GWViews.prototype.constructor = GWViews;

    /**
    * Static methods and properties
    */

    // Defaults
    GWViews.defaults = {
        formatting: {
            verbs: [
                "bring",
                "capture", "collect",
                "defeat", "defend", "destroy", "drive",
                "eliminate",
                "escort",
                "gather",
                "herd", "hold", "hunt",
                "kill",
                "prevent", "protect",
                "rescue", "retake", "retrieve", "return",
                "slay", "stop"
            ],
            preps: [
                "and",
                "back", "before", "by",
                "for", "from",
                "into",
                "on",
                "to"
            ]
        },
        templates: {
            eventState: "#event-state-template",
            eventEntry: "#event-entry-template",
            mapName: "#map-name-template"
        },
        stateLabels: {
            "Active": "success",
            "Warmup": "warning",
            "Success": "info",
            "Fail": "important"
        },
        container: "#events",
        mapTitle: "#mapTitle",
        mapNav: "#mapNameNav",
        timestamp: "#lastUpdatedTimestamp"
    };

    /**
    * Instance methods and properties
    */

    // Render map title
    GWViews.prototype.renderMapTitle = function () {
        var
            data = this.data,
            nameData = _.where(data.mapNames, {
                id: data.eventData.events[0].map_id.toString()
            }),
            name = typeof nameData[0] !== "undefined" ? nameData.name : "Unknown";
        this.elems.$mapTitle.html(name);
    };

    // Render timestamp
    GWViews.prototype.renderTimestamp = function () {
        var
            d = new Date(),
            hour = parseInt(d.getHours() + 1),
            min = d.getMinutes(),
            sec = d.getSeconds();
        hour = hour > 12 ? hour - 12 : hour;

        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        this.elems.$timestamp.html(hour + ":" + min + ":" + sec);  
    };

    // Render map names
    GWViews.prototype.renderMapNames = function () {
        var
            self = this,
            $mapNav = this.elems.$mapNav;
        $mapNav.empty();
        _.each(this.data.mapNames, function (mapName) {
            var html = self.templates.mapName(mapName);
            $mapNav.append(html);
        });
    };

    // Format event
    GWViews.prototype.formatEvent = function (event) {
        var
            formatting = this.options.formatting,
            verbs = formatting.verbs.join("|"),
            preps = formatting.preps.join("|"),
            regex = new RegExp("(\\b(" + verbs + ")\\b\\s(and)?)+((.(?!(\\b(" + preps + ")\\b)))+)", "gi");
        return event.replace(regex, "<span class=\"action\">$1</span><span class=\"target\">$4</span>");
    };

    // Render events
    GWViews.prototype.renderEvents = function () {
        var
            self = this,
            $elem = this.elems.$container,
            _eventNames = _(this.data.eventNames),
            currentState = "";
        $elem.empty();
        _.each(this.data.eventNames, function (ev, index) {
           if (ev.state !== currentState) {
                ev.label = self.options.stateLabels[ev.state];
                $elem.append(self.templates.eventState(ev));
                currentState = ev.state;
           }
           ev.event_name = _eventNames.where({
               id: ev.event_id
           });
           if (ev.event_name[0]) {
               ev.event_name = self.formatEvent(ev.event_name.name || "Unknown");
               $elem.append(self.templates.eventEntry(ev));
           }
        });
    };

    // Render
    GWViews.prototype.render = function (data) {
        this.data = data;
        this.renderMapTitle();
        this.renderTimestamp();
        this.renderEvents();
        this.renderMapNames();
    };

    // Init vars
    GWViews.prototype.initVars = function () {
        var opts = this.options;
        this.elems = {
            $container: $(opts.container),
            $mapTitle: $(opts.mapTitle),
            $mapNav: $(opts.mapNav),
            $timestamp: $(opts.timestamp)
        };
    };

    // Prep templates
    GWViews.prototype.prepTemplates = function () {
        var
            opts = this.options,
            $template,
            templateText,
            type;
        this.templates = {};
        for (type in opts.templates) {
            $template = $(opts.templates[type]);
            templateText = $template.length ? $template.html() : "";
            this.templates[type] = _.template(templateText);
        }
    };

    // Expose
   RDP.GWViews = GWViews;
}(window, RDP, jQuery, _));
