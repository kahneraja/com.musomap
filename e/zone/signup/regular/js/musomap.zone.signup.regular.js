musomap.zone.signup.regular = function(args){
    musomap.log('musomap.zone.signup.regular');
    this.init();
    this.bind();
};

musomap.zone.signup.regular.prototype.init = function() {
    musomap.log('musomap.zone.signup.regular.init');
    this.$view = $('#bodyFrame #zoneFrame #signupZone .regularPage .view');
    this.located = false;
    this.twitterUserID = null;
    this.fbUserID = null;
};

musomap.zone.signup.regular.prototype.bind = function() {
    musomap.log('musomap.zone.signup.regular.bind');
    $('.submit', this.$view).click(function(e){
        musomap.client.zone.signup.regular.commit();
    });
};

musomap.zone.signup.regular.prototype.show = function() {
    musomap.log('musomap.zone.signup.regular.show');
    this.$view.addClass('active');
    $('.info', this.$view).trigger('change');
};

musomap.zone.signup.regular.prototype.fill = function(user) {
    // show all fields.
    $('.email', this.$view).parent().removeClass('optional');
    $('.password', this.$view).parent().removeClass('optional');
    
    if (user.name !== undefined){
        $('.name', this.$view).val(user.name);
    }
    if (user.email !== undefined){
        $('.email', this.$view).val(user.email);
        $('.email', this.$view).parent().addClass('optional');
    }
    if (user.info !== undefined){
        $('.info', this.$view).val(user.info);
    }
    if (user.name !== undefined){
        $('.image', this.$view).attr('src', user.image);
    }
    if (user.twitterUserID !== undefined){
        this.twitterUserID = user.twitterUserID;
        this.fbUserID = null;
        $('.password', this.$view).parent().addClass('optional');
    }
    if (user.fbUserID !== undefined){
        this.fbUserID = user.fbUserID;
        this.twitterUserID = null;
        $('.password', this.$view).parent().addClass('optional');
    }    
};

musomap.zone.signup.regular.prototype.commit = function() {
    musomap.log('musomap.zone.signup.regular.commit');
    var valid = this.validate();
    if (valid){
        window.location.href = '#/signup/locate';
    }
};

musomap.zone.signup.regular.prototype.validate = function() {
    musomap.log('musomap.zone.signup.regular.validate');
    var valid = true;
    
    // Name
    var $name = $('.name', this.$view);
    if ($name.length > 0) {
        var name = $name.val();

        if ($.trim(name).length === 0 || $.trim(name).length < 3) {
            $name.addClass("invalid");
            valid = false;
        }
        else {
            $name.removeClass("invalid");
        }
    }    
    
    // Email
    var $email = $('.email', this.$view);
    if ($email.length > 0 && !$email.parent().hasClass('optional')) {
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
    if ($password.length > 0 && !$password.parent().hasClass('optional')) {
        var password = $password.val();

        if ($.trim(password).length === 0 || $.trim(password).length < 6) {
            $password.addClass("invalid");
            valid = false;
        }
        else {
            $password.removeClass("invalid");
        }
    }

    // Info
    var $info = $('.info', this.$view);
    if ($info.length > 0) {
        var info = $info.val(); 

        if ($.trim(info).length === 0) {
            $info.addClass("invalid");
            valid = false;
        }
        else {
            $info.removeClass("invalid");
        }
    }

    return valid;
};

