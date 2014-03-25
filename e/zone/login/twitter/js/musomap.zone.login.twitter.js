musomap.zone.login.twitter = function(args) {
    musomap.log('musomap.zone.login.twitter');
    this.init();
    this.bind();
};

musomap.zone.login.twitter.prototype.init = function() {
    musomap.log('musomap.zone.login.twitter.init');
    this.$view = $('#bodyFrame #zoneFrame #loginZone .twitterPage .view');

};

musomap.zone.login.twitter.prototype.bind = function() {
    musomap.log('musomap.zone.login.twitter.init');
};

musomap.zone.login.twitter.prototype.show = function() {
    musomap.log('musomap.zone.login.twitter.show');
    this.$view.addClass('active');

    var authenticationUrl = musomap.client.webroot + '/oauth/twitter/request.php';
    this.authWindow = window.open(authenticationUrl, '_blank', 'location=no');

    this.authWindow.addEventListener('loadstop', function(event) { 
        musomap.client.zone.login.twitter.authWindowChanged(event.url);
    });
    
    // web browser hack
    if (musomap.client.desktop){
        setTimeout(function(){
            var url = musomap.client.zone.login.twitter.authWindow.document.location.href;
            musomap.client.zone.login.twitter.authWindowChanged(url);
        }, 8000);
    }
};


musomap.zone.login.twitter.prototype.authWindowChanged = function(location) {
    musomap.log('musomap.zone.login.twitter.authWindowChanged');
    var approveUrl = musomap.client.webroot + '/oauth/pending.php';
    if (location.indexOf(approveUrl) == 0) {
        this.authWindow.close();
        this.verified(location);
    }
};

musomap.zone.login.twitter.prototype.verified = function(location) {
    musomap.log('musomap.zone.login.twitter.verified');
    var response = '';

    // extract token
    var locationParts = location.split('?');
    var hashParts = locationParts[1].split('#');
    var querystringParts = hashParts[0].split('&'); // first query string
    var valueParts = querystringParts[0].split('=');
    var externalUserID = valueParts[1];

    $.ajax({
        url: musomap.client.webroot + '/json/user/oauth/lookup.php',
        dataType: 'json',
        timeout: 80000,
        data: {
            'externalUserID': externalUserID,
            'typeID': 2
        },
        success: function(result) {
            musomap.client.zone.login.twitter.save(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            musomap.log(errorThrown);
        }
    });
};

musomap.zone.login.twitter.prototype.save = function(data) {
    musomap.log('musomap.zone.login.twitter.save');
    this.twitterUserID = data.ExternalUserID;
    musomap.log('twitterUserID: ' + this.twitterUserID);
    window.location.href = '#/login/commit';
};

musomap.zone.login.twitter.prototype.error = function(data) {
    musomap.log('musomap.zone.login.twitter.error');
    window.location.href = '#/fail/' + JSON.stringify(data);
};
