(function () {
    'use strict';

    angular
        .module('gsiteApp')
        .controller('MSidenavController', MSidenavController);

    MSidenavController.$inject = ['$state', '$mdSidenav', 'entity'];

    function MSidenavController($state, $mdSidenav, entity) {
        var vm = this;

        vm.homeState = $state.current.name;

        // prevent reload page => make change root state
        if (vm.homeState.indexOf('.') > 0) {
            vm.homeState = vm.homeState.split('.')[0];
        }

        vm.website = entity;
        vm.sidenav = vm.website.custom.sidenav;
        if (vm.sidenav == null)
            loadDefault();
        // sidenav
        vm.toggleLeft = buildToggler('m-sidenav');

        function buildToggler(componentId) {
            return function () {
                $mdSidenav(componentId).toggle();
            }
        }

        function loadDefault() {
            vm.sidenav = {
                isEnable: true,
                title: 'About Person',
                textColor: '#FFFFFF',
                backgroundColor: 'white'
            };
        }
    }
})();
