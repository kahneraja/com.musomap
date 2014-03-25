musomap.zone.login.commit = function(args){
    musomap.log('musomap.zone.login.commit');
    this.init();
    this.bind();
};

musomap.zone.login.commit.prototype.init = function() {
    musomap.log('musomap.zone.login.commit.init');
    this.$view = $('#bodyFrame #zoneFrame #loginZone .commitPage .view');
    this.$regularView = $('#bodyFrame #zoneFrame #loginZone .regularPage .view');
};

musomap.zone.login.commit.prototype.bind = function() {
    musomap.log('musomap.zone.login.commit.init');
};

musomap.zone.login.commit.prototype.show = function() {
    musomap.log('musomap.zone.login.commit.show');
    this.$view.addClass('active');
    this.save();
};

musomap.zone.login.commit.prototype.save = function() {
    musomap.log('musomap.zone.login.regular.save');
    
    var email = $('.email', this.$regularView).val();
    var password = $('.password', this.$regularView).val();
    var twitterUserID = musomap.client.zone.login.twitter.twitterUserID;
    var fbUserID = musomap.client.zone.login.facebook.fbUserID;

    var user = {'email': email, 
    'password': password,
    'twitterUserID': twitterUserID,
    'fbUserID': fbUserID,
    'registrationID': musomap.client.notification.registrationID}

    musomap.client.splash.loading.show();

    $.ajax({
        url: musomap.client.webroot + "/json/user/login.php",
        type: 'post',
        dataType: 'json',
        timeout: 80000,
        data: user,
        success: function(user){
            musomap.client.login(user);
            window.location.href = '#/feed/';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            window.location.href = '#/fail/' + jqXHR.responseText;
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }
    });
    
};