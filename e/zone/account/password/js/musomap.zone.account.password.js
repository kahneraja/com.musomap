musomap.zone.account.password = function(args){
    musomap.log('musomap.zone.account.password');
    this.init();
    this.bind();
};

musomap.zone.account.password.prototype.init = function() {
    musomap.log('musomap.zone.account.password.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone #passwordPage #passwordView');
};

musomap.zone.account.password.prototype.bind = function() {
    musomap.log('musomap.zone.account.password.init');
    $('#submit', this.$view).bind('tap', function(){
       var valid = musomap.client.zone.account.password.validate(); 
       if (valid){
           musomap.client.zone.account.password.save();
       }
    });
};

musomap.zone.account.password.prototype.show = function() {
    musomap.log('musomap.zone.account.password.show');
    this.$view.addClass('active');
};

musomap.zone.account.password.prototype.validate = function() {
    musomap.log('musomap.zone.account.password.validate');
    var valid = true;
    var $password = $('input', this.$view);
    var password = $password.val();

    if ($.trim(password).length === 0 || $.trim(password).length < 6) {
        $password.addClass("invalid");
        valid = false;
    }
    else {
        $password.removeClass("invalid");
    }
    
    return valid;
};

musomap.zone.account.password.prototype.save = function(){
    musomap.log('musomap.zone.account.password.save');

    var url = musomap.client.webroot + "/json/account/password/save.php";
    
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;
    data.password = $('input', this.$view).val();

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