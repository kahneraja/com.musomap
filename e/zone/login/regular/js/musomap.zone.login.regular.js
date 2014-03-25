musomap.zone.login.regular = function(args){
    musomap.log('musomap.zone.login.regular');
    this.init();
    this.bind();
};

musomap.zone.login.regular.prototype.init = function() {
    musomap.log('musomap.zone.login.regular.init');
    this.$view = $('#bodyFrame #zoneFrame #loginZone .regularPage .view');
};

musomap.zone.login.regular.prototype.bind = function() {
    musomap.log('musomap.zone.login.regular.bind');
    $('.submit', this.$view).bind('tap', function(e){
        musomap.client.zone.login.regular.commit();
    });
};

musomap.zone.login.regular.prototype.show = function() {
    musomap.log('musomap.zone.login.regular.show');
    this.$view.addClass('active');
};

musomap.zone.login.regular.prototype.commit = function() {
    musomap.log('musomap.zone.login.regular.commit');
    var valid = this.validate();
    if (valid){
        window.location.href = '#/login/commit'
    }
};

musomap.zone.login.regular.prototype.validate = function() {
    musomap.log('musomap.zone.login.regular.validate');
    var valid = true;
    
    // Email
    var $email = $('.email', this.$view);
    if ($email.length > 0) {
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
    }

    // Password
    var $password = $('.password', this.$view);
    if ($password.length > 0) {
        var password = $password.val();

        if ($.trim(password).length === 0 || $.trim(password).length < 6) {
            $password.addClass("invalid");
            valid = false;
        }
        else {
            $password.removeClass("invalid");
        }
    }

    return valid;
};
