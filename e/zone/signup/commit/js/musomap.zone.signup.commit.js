musomap.zone.signup.commit = function(args){
    musomap.log('musomap.zone.signup.commit');
    this.init();
    this.bind();
};

musomap.zone.signup.commit.prototype.init = function() {
    musomap.log('musomap.zone.signup.commit.init');
    this.$view = $('#bodyFrame #zoneFrame #signupZone .commitPage .view');
    this.$regularView = $('#bodyFrame #zoneFrame #signupZone .regularPage .view');
};

musomap.zone.signup.commit.prototype.bind = function() {
    musomap.log('musomap.zone.signup.commit.init');
};

musomap.zone.signup.commit.prototype.show = function() {
    musomap.log('musomap.zone.signup.commit.show');
    this.$view.addClass('active');
    this.save();
};

musomap.zone.signup.commit.prototype.save = function() {
    musomap.log('musomap.zone.signup.regular.save');
    
    musomap.client.splash.loading.show();
    
    var email = $('.email', this.$regularView).val();
    var password = $('.password', this.$regularView).val();
    var name = $('.name', this.$regularView).val();
    var info = $('.info', this.$regularView).val();
    var lat = musomap.client.zone.signup.locate.lat;
    var lng = musomap.client.zone.signup.locate.lng;
    var twitterUserID = musomap.client.zone.signup.regular.twitterUserID;
    var fbUserID = musomap.client.zone.signup.regular.fbUserID;
    var image = $('img', this.$regularView).attr('src');

    var user = {'email': email, 
    'password': password,
    'name': name,
    'info': info,
    'lat': lat,
    'lng': lng,
    'twitterUserID': twitterUserID,
    'fbUserID': fbUserID,
    'image': image}

    $.ajax({
        url: musomap.client.webroot + "/json/user/signup.php",
        type: 'post',
        dataType: 'json',
        timeout: 80000,
        data: user,
        success: function(response){
            musomap.client.zone.signup.confirm.fill(response);
            window.location.href = '#/signup/confirm';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            window.location.href = '#/fail/' + jqXHR.responseText;
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }
    });
    
};