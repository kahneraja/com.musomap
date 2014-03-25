musomap.zone = function(args) {
    musomap.log('musomap.zone');

    this.init();
    this.bind();
};

musomap.zone.prototype.init = function() {
    musomap.log('musomap.zone.init');
    this.feed = new musomap.zone.feed();
    this.login = new musomap.zone.login();
    this.signup = new musomap.zone.signup();
    this.fail = new musomap.zone.fail();
    this.log = new musomap.zone.log();
    this.account = new musomap.zone.account();
    this.search = new musomap.zone.search();
    this.composer = new musomap.zone.composer();
    this.notify = new musomap.zone.notify();
    this.map = new musomap.zone.map();
    this.resizeFrame();
};

musomap.zone.prototype.bind = function() {
    musomap.log('musomap.zone.init');
};

musomap.zone.prototype.show = function() {
    var hash = window.location.hash;
    if (hash === '') {
        window.location.href = '#/feed/';
    }
    else if (hash.indexOf("#/feed/") > -1) {
        var query = hash.replace("#/feed/", "");
        this.feed.show(query);
    }
    else if (hash.indexOf("#/profile/") > -1) {
        var label = hash.replace("#/profile/", "");
        this.feed.showProfile(label);
    }
    else if (hash.indexOf("#/composer/") > -1) {
        var label = hash.replace("#/composer/", "");
        this.composer.show(label);
    }
    else if (hash.indexOf("#/fail/") > -1) {
        var error = hash.replace("#/fail/", "");
        this.fail.show(error);
    }
    else if (hash.indexOf("#/search") > -1) {
        this.search.show();
    }
    else if (hash == '#/log') {
       this.log.show();
    }
    else if (hash == '#/notify') {
       this.notify.show();
    }
    else if (hash.indexOf("#/map/") > -1) {
        var latLng = hash.replace("#/map/", "");
        var latLngArray = latLng.split("/");
        var lat = latLngArray[0];
        var lng = latLngArray[1];
        this.map.show(lat, lng);
    }    
    else {
        this.login.show();
        this.signup.show();
        this.account.show();
    }
    
    // lookup pending notifications
    if (!this.notify.active && musomap.client.user !== undefined){
        this.notify.refresh();
    }
};

musomap.zone.prototype.resizeFrame = function() {
    var headerHeight = $('#headerFrame').height();
    var windowHeight = $(window).height();
    if (musomap.client.viewport !== undefined) {
        windowHeight = musomap.client.viewport.height;
    }
    var controlHeight = windowHeight - headerHeight;
    $('#zoneFrame .iScroll').height(controlHeight);
    $('#zoneFrame .view').height(controlHeight);
    $('#zoneFrame .view').css('top', headerHeight + 'px');

    for (var i = 0; i < musomap.iScrollCollection.length; i++) {
        var scroller = musomap.iScrollCollection[i];
        scroller.refresh();
    }
};
