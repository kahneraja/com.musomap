musomap.zone.login.facebook = function(args) {
    musomap.log('musomap.zone.login.facebook');
    this.init();
    this.bind();
};

musomap.zone.login.facebook.prototype.init = function() {
    musomap.log('musomap.zone.login.facebook.init');
    this.$view = $('#bodyFrame #zoneFrame #loginZone .facebookPage .view');

};

musomap.zone.login.facebook.prototype.bind = function() {
    musomap.log('musomap.zone.login.facebook.init');
};

musomap.zone.login.facebook.prototype.show = function() {
    musomap.log('musomap.zone.login.facebook.show');
    this.$view.addClass('active');

    var authenticationUrl = musomap.client.webroot + '/oauth/facebook/request.php';
    this.authWindow = window.open(authenticationUrl, '_blank', 'location=no');

    this.authWindow.addEventListener('loadstop', function(event) { 
        musomap.client.zone.login.facebook.authWindowChanged(event.url);
    });
    
    // web browser hack
    if (musomap.client.desktop){
        setTimeout(function(){
            var url = musomap.client.zone.login.facebook.authWindow.document.location.href;
            musomap.client.zone.login.facebook.authWindowChanged(url);
        }, 8000);
    }
};


musomap.zone.login.facebook.prototype.authWindowChanged = function(location) {
    musomap.log('musomap.zone.login.facebook.authWindowChanged');
    var approveUrl = musomap.client.webroot + '/oauth/pending';
    if (location.indexOf(approveUrl) == 0) {
        this.authWindow.close();
        this.verified(location);
    }
};

musomap.zone.login.facebook.prototype.verified = function(location) {
    musomap.log('musomap.zone.login.facebook.verified');
    var response = '';

    // extract token
    var locationParts = location.split('?');
    var hashParts = locationParts[1].split('#');
    var querystringParts = hashParts[0].split('&'); // first query string
    var valueParts = querystringParts[0].split('=');
    var externalUserID = valueParts[1];

    $.ajax({
        url: musomap.client.webroot + '/json/user/oauth/lookup.php',
        datatype: 'json',
        timeout: 80000,
        data: {
            'externalUserID': externalUserID,
            'typeID': 1
        },
        success: function(result) {
            musomap.client.zone.login.facebook.save(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            musomap.log(errorThrown);
        },
        complete: function(jqXHR, textStatus, errorThrown){
            
        }
    });
};

musomap.zone.login.facebook.prototype.save = function(data) {
    musomap.log('musomap.zone.login.facebook.save');
    this.fbUserID = data.ExternalUserID;
    musomap.log('fbUserID: ' + this.fbUserID);
    window.location.href = '#/login/commit';
};

musomap.zone.login.facebook.prototype.error = function(data) {
    musomap.log('musomap.zone.login.facebook.error');
    window.location.href = '#/fail/' + JSON.stringify(data);
};
