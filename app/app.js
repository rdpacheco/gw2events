"use strict";

angular.module("gw2events", [
    "ngRoute"
])
    .config(function ($routeProvider) {
        $routeProvider
            .when("/", {
                controller: "DashboardCtrl"
            })
            .otherwise({
                redirectTo: "/"
            });
    });
