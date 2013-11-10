/* @TODO: Convert all this code into a class */
(function ($) {
    "use strict";
    var
        Router,
        router,
        eventData,
        eventNameData,
        mapNameData,
        containerID = "events",

        // Selectors
        eventStateTemplateID = "event-state-template",
        eventEntryTemplateID = "event-entry-template",
        mapNameTemplateID = "map-name-template",
        mapNameNavID = "mapNameNav",

        // Templates
        stateTemplate,
        entryTemplate,
        mapNameTemplate,
        mainEvents = {

            // Queensdale
            "04084490-0117-4D56-8D67-C4FFFE933C0C": "Oakheart",
            "A1122EFD-3FDF-43F0-BE57-D6B4A7A08125": "Bandits",
            "3C3915FB-E2E4-4794-A700-E3B5FCFE0404": "Wasp Queen",
            "D17D47E9-0A87-4189-B02A-54E23AA91A82": "Troll",
            "69D031A8-7AD2-4419-B564-48457841A57C": "Boar",
            "31CEBA08-E44D-472F-81B0-7143D73797F5": "Shadow Behemoth",
            "24D4545D-2963-41DA-A54F-A457535FC822": "Grubs"
        };
    function getEventsByState(state) {
        return _(eventData.events).where({
            "state": state
        });
    }
    function sortEventData(evData) {
        var stateOrder = [
            "Active",
            "Preparation",
            "Warmup",
            "Inactive",
            "Success",
            "Fail"
        ];
        /* @TODO: Would like to code well */
        
        return _(evData).sortBy(function (ev) {
            var order = (stateOrder.indexOf(ev.state) + 1) * 10;
            ev.nickname = false;
            if (_(mainEvents).has(ev.event_id)) {
                ev.nickname = mainEvents[ev.event_id];
                order -= 1;
            }
            return order;
        });
    }
    function sortMapData(mapData) {
        return _(mapData).sortBy(function (map) {
            return map.name;
        });
    }

    function formatEvent(event) {
        return event.replace(/(\b(bring|capture|collect|defeat|defend|destroy|drive|eliminate|escort|gather|herd|hold|hunt|kill|prevent|protect|rescue|retake|retrieve|return|slay|stop)\b\s(and)?)+((.(?!(\b(and|back|before|by|for|from|into|on|to)\b)))+)/gi, "<span class=\"action\">$1</span><span class=\"target\">$4</span>");
    }

    function displayEvents(evData) {
        evData = evData || eventData.events;
        var
            $elem = $("#" + containerID),
            _eventNameData = _(eventNameData),
            currentState = "",
            stateLabels = {
                "Active": "success",
                "Warmup": "warning",
                "Success": "info",
                "Fail": "important"
            };
        $elem.empty();

        evData = sortEventData(evData);
        _(evData).each(function (ev, index) {
            if (ev.state !== currentState) {
                ev.label = stateLabels[ev.state];
                $elem.append(stateTemplate(ev));
                currentState = ev.state;
            }
            ev.event_name = _eventNameData.where({
                "id": ev.event_id
            })[0];
            //console.log(ev);
            if (ev.event_name) {
                ev.event_name = formatEvent(ev.event_name.name || "Unknown");
                $elem.append(entryTemplate(ev));
            }
        });
    }
    function displayMapNames() {
        var $mapNav = $("#" + mapNameNavID);
        $mapNav.empty();
        mapNameData = sortMapData(mapNameData);
        _(mapNameData).each(function (mapName, index) {
            //console.log(mapName, $mapNav);
            $mapNav.append(mapNameTemplate(mapName));
        });
    }
    function prepTemplates() {
        stateTemplate = _.template($("#" + eventStateTemplateID).html());
        entryTemplate = _.template($("#" + eventEntryTemplateID).html());
        mapNameTemplate = _.template($("#" + mapNameTemplateID).html());
    }
    function updateTimestamp() {
        var
            d = new Date(),
            hour = parseInt(d.getHours() + 1),
            min = d.getMinutes(),
            sec = d.getSeconds();
        hour = hour > 12 ? hour - 12 : hour;

        hour = hour < 10 ? "0" + hour : hour;
        min = min < 10 ? "0" + min : min;
        sec = sec < 10 ? "0" + sec : sec;
        $("#lastUpdatedTimestamp").html(hour + ":" + min + ":" + sec);
    }
    function updateMapName() {
        var name = _(mapNameData).where({
            id: eventData.events[0].map_id.toString()
        })[0];
        name = name.name || "Unknown";
        $("#mapTitle").html(name);
    }
    function render(data) {
        eventData = data.eventData;
        eventNameData = data.eventNames;
        mapNameData = data.mapNames;
        updateMapName();
        updateTimestamp();
        displayEvents();
        displayMapNames();
    }
    function getDataFromServer(dataType, mapID) {
        var
            data = mapID ? { mapID: mapID } : {},
            def = new $.Deferred(),
            ls;
        data.dataType = dataType;
        if (dataType !== "event") {
            ls = localStorage.getItem(dataType);
            if (ls) {
                ls = JSON.parse(ls);
                def.resolve(ls);
            }
        }
        if (!ls) {
            $
                .ajax({
                    url: "events.php",
                    data: data,
                    dataType: "json"
                })
                .done(function (response) {
                    def.resolve(response);
                    if (dataType !== "event") {
                        localStorage.setItem(dataType, JSON.stringify(response));
                    }
                });
        }
        return def;
    }
    function initRouter() {
        var
        	autoUpdateCounter = 0,
        	timer;
        Router = Backbone.Router.extend({
            routes: {
            	"": "getData",
                ":mapID": "getData"
            },
            getData: function(mapID) {
                var
                    self = this,
                    data = mapID ? { mapID: mapID } : {};
                $
                    .when(
                        getDataFromServer("event", mapID),
                        getDataFromServer("eventName", mapID),
                        getDataFromServer("mapName", mapID)
                    )
                    .then(function (resp1, resp2, resp3) {
                        render({
                            eventData: resp1.eventData,
                            eventNames: resp2.eventNames,
                            mapNames: resp3.mapNames
                        });
                    });
                console.log(autoUpdateCounter);
                if (autoUpdateCounter < 60) {
                    autoUpdateCounter += 1;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        self.getData(mapID);
                    }, 60000);
                }
            }
        });
        router = new Router();
        Backbone.history.start();
    }
    function init() {
        initRouter();
        prepTemplates();
    }
    $(init);
}(jQuery));
