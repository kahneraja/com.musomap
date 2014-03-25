musomap.zone.signup.twitter = function(args) {
    musomap.log('musomap.zone.signup.twitter');
    this.init();
    this.bind();
};

musomap.zone.signup.twitter.prototype.init = function() {
    musomap.log('musomap.zone.signup.twitter.init');
    this.$view = $('#bodyFrame #zoneFrame #signupZone .twitterPage .view');

};

musomap.zone.signup.twitter.prototype.bind = function() {
    musomap.log('musomap.zone.signup.twitter.init');
};

musomap.zone.signup.twitter.prototype.show = function() {
    musomap.log('musomap.zone.signup.twitter.show');
    this.$view.addClass('active');

    var authenticationUrl = musomap.client.webroot + '/oauth/twitter/request.php';
    this.authWindow = window.open(authenticationUrl, '_blank', 'location=yes');

    this.authWindow.addEventListener('loadstop', function(event) { 
        musomap.client.zone.signup.twitter.authWindowChanged(event.url);
    });
    
    // web browser hack
    if (musomap.client.desktop){
        setTimeout(function(){
            var url = musomap.client.zone.signup.twitter.authWindow.document.location.href;
            musomap.client.zone.signup.twitter.authWindowChanged(url);
        }, 8000);
    }
};


musomap.zone.signup.twitter.prototype.authWindowChanged = function(location) {
    musomap.log('musomap.zone.signup.twitter.authWindowChanged');
    var approveUrl = musomap.client.webroot + '/oauth/pending.php';
    if (location.indexOf(approveUrl) == 0) {
        this.authWindow.close();
        this.verified(location);
    }
};

musomap.zone.signup.twitter.prototype.verified = function(location) {
    musomap.log('musomap.zone.signup.twitter.verified');
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
            musomap.client.zone.signup.twitter.save(result);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            musomap.log(errorThrown);
        }
    });
};

musomap.zone.signup.twitter.prototype.save = function(data) {
    musomap.log('musomap.zone.signup.twitter.save');
    var user = {};
    user.twitterUserID = data.ExternalUserID;
    user.name = data.Name;
    user.image = data.Image;
    user.info = data.Info;
    musomap.log('user: ' + JSON.stringify(user));

    musomap.client.zone.signup.regular.fill(user);

    window.location.href = '#/signup/regular';
};

musomap.zone.signup.twitter.prototype.error = function(data) {
    musomap.log('musomap.zone.signup.twitter.error');
    window.location.href = '#/fail/' + JSON.stringify(data);
};
