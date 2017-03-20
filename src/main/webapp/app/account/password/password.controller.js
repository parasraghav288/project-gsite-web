(function() {
    'use strict';

    angular
        .module('gsiteApp')
        .controller('PasswordController', PasswordController);

    PasswordController.$inject = ['Auth', 'Principal','AlertService'];

    function PasswordController (Auth, Principal,AlertService) {
        var vm = this;

        vm.changePassword = changePassword;

        Principal.identity().then(function(account) {
            vm.account = account;
        });

        function changePassword () {
            Auth.changePassword(vm.password).then(function () {
                AlertService.success("OK !")
            }).catch(function () {
                AlertService.error("Error !")
            });
        }
    }
})();
