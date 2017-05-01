(function () {
    'use strict';
    angular
        .module('gsiteApp')
        .factory('MyWebsiteOffline', MyWebsiteOffline);

    MyWebsiteOffline.$inject = ['$rootScope', '$state', 'MyWebsite', 'Principal', 'MyWebsiteStorage'];

    function MyWebsiteOffline($rootScope, $state, MyWebsite, Principal, MyWebsiteStorage) {
        var service = {
            subscribe: subscribe,
            all: all,
            update: update,
            updateWebViewAll: updateWebViewAll,
            deleteWeb: deleteWeb,
            refuse: refuse,
            loadAll: loadAll,
            reloadAll: reloadAll
        };
        var userId = null;
        var userEmail = null;
        var websites = [];

        checkUser();


        function all() {
            return websites;
        }

        function checkUser() {
            Principal.identity().then(function (account) {
                if(account == null)
                    return;
                userId = account.id;
                userEmail = account.email;
                loadAll();
            });
        }

        function reloadAll() {
            websites = [];
            checkUser();
        }

        function loadAll() {
            websites = [];
            MyWebsite.query({
                user_id: userId
            }, onAllSuccess);

            function onAllSuccess(result) {
                loadImages(result);
                websites = result;
                notify();
            }

            MyWebsite.share({
                user_email: userEmail
            }, onShareSuccess);

            function onShareSuccess(result) {
                loadImages(result);
                websites = websites.concat(result);
                notify();
            }
        }

        function loadImages(list) {
            for (var i = 0; i < list.length; i++) {
                var web = list[i];
                if (web.custom.homepage != null && web.custom.homepage.mainImage != null) {
                    MyWebsiteStorage.loadImageForWebItem(userId, web.id, web, "mainImage.jpg");
                }
            }

        }

        function updateWebViewAll(website) {
            MyWebsite.update(website, success);
            function success() {
                    loadAll();
                $state.go("my-website");
            }
        }

        function update(website) {
            MyWebsite.update(website, success);
            function success() {
                loadAll();
            }
        }

        function deleteWeb(id) {
           MyWebsite.delete({
                id: id
            }, success);

            function success() {
                loadAll();
                $state.go("my-website");
                MyWebsiteStorage.deleteUserWebImageFolder(userId, id);
            }
        }

        function refuse(id) {
           MyWebsite.get({
                id: id
            }, function (web) {
                var index = web.sharedUsers.indexOf(userEmail);
                web.sharedUsers.splice(index, 1);
               MyWebsite.update(web, onRefuseSuccess);
            });
        }

        function onRefuseSuccess(result) {
            notify();
        }


        function subscribe(scope, callback) {
            var handler = $rootScope.$on('notifying-service-event', callback);
            scope.$on('$destroy', handler);
        }

        function notify() {
            $rootScope.$emit('notifying-service-event');
        }


        return service;
    }
})();

