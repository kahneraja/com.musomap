musomap.zone.signup.facebook = function(args) {
    musomap.log('musomap.zone.signup.facebook');
    this.init();
    this.bind();
};

musomap.zone.signup.facebook.prototype.init = function() {
    musomap.log('musomap.zone.signup.facebook.init');
    this.$view = $('#bodyFrame #zoneFrame #signupZone .facebookPage .view');

};

musomap.zone.signup.facebook.prototype.bind = function() {
    musomap.log('musomap.zone.signup.facebook.init');
};

musomap.zone.signup.facebook.prototype.show = function() {
    musomap.log('musomap.zone.signup.facebook.show');
    this.$view.addClass('active');

    var authenticationUrl = musomap.client.webroot + '/oauth/facebook/request.php';
    this.authWindow = window.open(authenticationUrl, '_blank', 'location=yes');

    this.authWindow.addEventListener('loadstop', function(event) { 
        musomap.client.zone.signup.facebook.authWindowChanged(event.url);
    });
    
    // web browser hack
    if (musomap.client.desktop){
        setTimeout(function(){
            var url = musomap.client.zone.signup.facebook.authWindow.document.location.href;
            musomap.client.zone.signup.facebook.authWindowChanged(url);
        }, 8000);
    }
};


musomap.zone.signup.facebook.prototype.authWindowChanged = function(location) {
    musomap.log('musomap.zone.signup.facebook.authWindowChanged');
    var approveUrl = musomap.client.webroot + '/oauth/pending';
    if (location.indexOf(approveUrl) == 0) {
        this.authWindow.close();
        this.verified(location);
    }
};

musomap.zone.signup.facebook.prototype.verified = function(location) {
    musomap.log('musomap.zone.signup.facebook.verified');
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
            musomap.client.zone.signup.facebook.save(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            musomap.log(errorThrown);
        },
        complete: function(jqXHR, textStatus, errorThrown){
            
        }
    });
};

musomap.zone.signup.facebook.prototype.save = function(data) {
    musomap.log('musomap.zone.signup.facebook.save');
    var user = {};
    user.fbUserID = data.ExternalUserID;
    user.email = data.Email;
    user.name = data.Name;
    user.image = data.Image;
    musomap.log('user: ' + JSON.stringify(user));

    musomap.client.zone.signup.regular.fill(user);

    window.location.href = '#/signup/regular';
};

musomap.zone.signup.facebook.prototype.error = function(data) {
    musomap.log('musomap.zone.signup.facebook.error');
    window.location.href = '#/fail/' + JSON.stringify(data);
};
