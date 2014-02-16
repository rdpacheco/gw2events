"use strict";

angular.module("gw2events")
    .controller("DashboardCtrl", function ($scope) {
        $scope.events = [{
            state: "Active",
            stateLabel: "success",
            id: "01234",
            name: "Eliminate the champion bandit lieutenant.",
            nickname: "Bandit Lieutenant"
        }];
    });
