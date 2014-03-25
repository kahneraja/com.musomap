musomap.zone.account.email = function(args){
    musomap.log('musomap.zone.account.email');
    this.init();
    this.bind();
};

musomap.zone.account.email.prototype.init = function() {
    musomap.log('musomap.zone.account.email.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .emailPage .view');
};

musomap.zone.account.email.prototype.bind = function() {
    musomap.log('musomap.zone.account.email.init');
    $('.submit', this.$view).bind('tap', function(){
       var valid = musomap.client.zone.account.email.validate(); 
       if (valid){
           musomap.client.zone.account.email.save();
       }
    });
};

musomap.zone.account.email.prototype.show = function() {
    musomap.log('musomap.zone.account.email.show');
    this.lookup();
    this.$view.addClass('active');
};

musomap.zone.account.email.prototype.lookup = function(){
    musomap.log('musomap.zone.feed.getProfile');

    var url = musomap.client.webroot + "/json/account/profile/lookup.php";
    
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;
    
    musomap.client.splash.loading.show();
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(profile) {
            // success
            musomap.client.zone.account.email.fill(profile);
        },
        error: function(Response) {
            // error
            window.location.href = '#/fail/' + Response.responseText;
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }        
    });    
};

musomap.zone.account.email.prototype.fill = function(profile) {
    musomap.log('musomap.zone.account.email.fill');
    $('input', this.$view).val(profile.Email);
};

musomap.zone.account.email.prototype.validate = function() {
    musomap.log('musomap.zone.account.email.validate');
    var valid = true;
    var $email = $('input', this.$view);
    var email = $email.val();
    var emailRegex = new RegExp(/^(("[\w-+\s]+")|([\w-+]+(?:\.[\w-+]+)*)|("[\w-+\s]+")([\w-+]+(?:\.[\w-+]+)*))(@((?:[\w-+]+\.)*\w[\w-+]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][\d]\.|1[\d]{2}\.|[\d]{1,2}\.))((25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\.){2}(25[0-5]|2[0-4][\d]|1[\d]{2}|[\d]{1,2})\]?$)/i);
    if ($.trim(email).length === 0) {
        $email.addClass("invalid");
        valid = false;
    }
    else if (!emailRegex.test(email)) {
        $email.addClass("invalid");
        valid = false;
    }
    else {
        $email.removeClass("invalid");
    }
    
    return valid;
};

musomap.zone.account.email.prototype.save = function(){
    musomap.log('musomap.zone.account.email.save');

    var url = musomap.client.webroot + "/json/account/email/save.php";
    
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;
    data.email = $('input', this.$view).val();

    musomap.client.splash.loading.show();
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(user) {
            // success
            window.location.href = '#/account/confirm';
        },
        error: function(Response) {
            // error
            window.location.href = '#/fail/' + Response.responseText;
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }        
    });    
};