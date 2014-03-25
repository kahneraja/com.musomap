musomap.zone.account.bio = function(args){
    musomap.log('musomap.zone.account.bio');
    this.init();
    this.bind();
};

musomap.zone.account.bio.prototype.init = function() {
    musomap.log('musomap.zone.account.bio.init');
    this.$view = $('#bodyFrame #zoneFrame #accountZone .bioPage .view');
};

musomap.zone.account.bio.prototype.bind = function() {
    musomap.log('musomap.zone.account.bio.init');
    $('.submit', this.$view).bind('tap', function(e){
        musomap.client.zone.account.bio.save();
    });
    
    $('img', this.$view).bind('tap', function(){
        musomap.client.zone.account.bio.uploadImage();
    });
};


musomap.zone.account.bio.prototype.lookup = function(){
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
            musomap.client.zone.account.bio.fill(profile);
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

musomap.zone.account.bio.prototype.fill = function(profile){
    musomap.log('musomap.zone.account.bio.render');
    var time = new Date().getTime();
    var image = musomap.client.baseDomain + '/i/image/profile/dynamic/' + profile.Reference + '.jpg?t=' + time;
    $('img', this.$view).attr('src', image);
    $('img', this.$view).addClass('active');
    $('.name', this.$view).val(profile.Name);
    $('.info', this.$view).val(profile.Info);
    $('.info', this.$view).trigger('change');
};

musomap.zone.account.bio.prototype.show = function() {
    musomap.log('musomap.zone.account.bio.show');
    this.$view.addClass('active');
    this.imageURI = undefined;
    this.lookup();
};

musomap.zone.account.bio.prototype.submit = function() {
    var valid = this.validate();
    if (valid){
        window.location.href = '#/account/locate';
    }
};

musomap.zone.account.bio.prototype.validate = function() {
    musomap.log('musomap.zone.account.bio.validate');
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

    if ($email.length > 0) {
        // confirm email
        if (valid && !confirm('Did we get your email address correct?\n\n' + $email.val())) {
            valid = false;
        }
    }
    
    return valid;
};

musomap.zone.account.bio.prototype.save = function(){
    musomap.log('musomap.zone.account.bio.save');
    musomap.client.splash.loading.show();
    
    var url = musomap.client.webroot + "/json/account/profile/save.php";
    var $name = $('.name', this.$view);
    var $info = $('.info', this.$view);
    
    var data = {};
    data.deviceReference = musomap.client.user.DeviceReference;
    data.name = $name.val();
    data.info = $info.val();
    
    if (this.imageURI !== undefined){
        var options = {};
        options.params = data;
        
        var ft = new FileTransfer();
        ft.upload(this.imageURI,
            url,
            function(r) {
                musomap.log("Code = " + r.responseCode);
                musomap.log("Response = " + r.response);
                musomap.log("Sent = " + r.bytesSent);
                musomap.client.splash.loading.hide();
                window.location.href = '#/account/confirm';
            },
            function(error) {
                musomap.client.splash.loading.hide();
                window.location.href = '#/fail/' + error.code;
            },
            options); 
    }else{
        $.ajax({
            url: url,
            type: 'post',
            dataType: 'json',
            timeout: 80000,
            data: data,
            success: function(user){
                window.location.href = '#/account/confirm';
            },
            error: function(Response) {
                window.location.href = '#/fail/' + Response.responseText;
            },
            complete: function(jqXHR, textStatus) {
                musomap.client.splash.loading.hide();
            }
        });
    }    
};

musomap.zone.account.bio.prototype.uploadImage  = function() {
    musomap.log('musomap.zone.account.bio.uploadImage');
    this.getPicture(Camera.PictureSourceType.PHOTOLIBRARY);
};

musomap.zone.account.bio.prototype.getPicture  = function(source) {
    musomap.log('musomap.zone.account.bio.getPicture');    
    var options = { quality : 25, 
    destinationType: Camera.DestinationType.FILE_URI,
    sourceType : source, 
    encodingType: Camera.EncodingType.JPEG,
    allowEdit : false,
    targetWidth: 1000,
    targetHeight: 1000 };  
  
    navigator.camera.getPicture(
        function(imageURI){
            musomap.client.zone.account.bio.captureSuccess(imageURI);
        }, 
        function(){
            musomap.client.zone.account.bio.captureError(error);    
        },
        options); 
};

musomap.zone.account.bio.prototype.captureSuccess = function(imageURI) {
    musomap.log('musomap.zone.account.bio.captureSuccess');  
    this.imageURI = imageURI;
    this.showImage();  
};

musomap.zone.account.bio.prototype.captureError  = function(error) {
    musomap.log('musomap.zone.account.bio.captureError');
    var msg = 'An error occurred during capture: ' + error.code;
    musomap.log(msg);
};

musomap.zone.account.bio.prototype.showImage = function() {
    musomap.log('musomap.zone.account.bio.showImage');
    $('img',this.$view).attr('src', this.imageURI);
};