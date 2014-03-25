musomap.splash.composer = function(args){
    musomap.log('musomap.splash.composer');

    this.init();
    this.bind();
};

musomap.splash.composer.prototype.init = function() {
    musomap.log('musomap.splash.composer.init');
    this.$view = $('#bodyFrame #splashFrame #composerSplash .composerPage .view');
    this.initHeight = 50;
};

musomap.splash.composer.prototype.bind = function() {
    musomap.log('musomap.splash.composer.init');
    
    // type dropdown
    $('.panel .type .dropPaddle, .panel .type .value', this.$view).bind('tap', function(e) {
        e.preventDefault();
        musomap.client.splash.composer.toggleTypeDropdown();
    }); 

    // type dropdown select
    $('.option', this.$view).bind('tap', function(e) {    
        e.preventDefault();
        var type = $(this).html();
        var name = $(this).html();
        musomap.client.splash.composer.selectType(type, name);
    }); 
    
    // camera
    $('.panel .camera', this.$view).bind('tap', function(e){
        musomap.client.splash.composer.captureImage();
    });
    
    // folder
    $('.panel .folder', this.$view).bind('tap', function(e){
        musomap.client.splash.composer.uploadImage();
    });    
    
    // flyer
    $('.flyer .clear', this.$view).bind('tap', function(e){
        musomap.client.splash.composer.clearFlyer();
    });    

    // schedule
    $('.schedule .date input', this.$view).change(function(e){
        musomap.client.splash.composer.setDate();
    });
    $('.schedule .date', this.$view).bind('tap', function(e){
        musomap.client.splash.composer.showDatePicker();
    });  

    // Save
    $('.save', this.$view).bind('tap', function(e){
        var active = $('.save', this.$view).hasClass('active');
        if (!active && musomap.client.splash.composer.validate()){
            musomap.client.splash.composer.save();
        }
    });
    
    // Cancel
    $('.cancel', this.$view).bind('tap', function(e){
        musomap.client.splash.composer.clear();
        window.location.href = '#/feed/';
    });    
        
};

musomap.splash.composer.prototype.validate = function() {
    musomap.log('musomap.splash.composer.validate');
    var valid = true;
    var text = $('textarea', this.$view).val();
    if (text.trim().length == 0){
        $('textarea', this.$view).addClass('invalid');
        valid = false;
    } else {
        $('textarea', this.$view).removeClass('invalid');
    }
    
    return valid;
};


musomap.splash.composer.prototype.show = function($source) {
    musomap.log('musomap.splash.composer.show');
    if($source.length){
        $('textarea', this.$view).val('@' + $source + ' ');
    }
    // show
    $(this.$view).addClass('active');

};

musomap.splash.composer.prototype.hide = function() {
    musomap.log('musomap.splash.composer.hide');

    // exit
    $(this.$view).removeClass('active');
};

musomap.splash.composer.prototype.captureImage  = function() {
    musomap.log('musomap.splash.composer.captureImage');
    this.getPicture(Camera.PictureSourceType.CAMERA);
};

musomap.splash.composer.prototype.uploadImage  = function() {
    musomap.log('musomap.splash.composer.uploadImage');
    this.getPicture(Camera.PictureSourceType.PHOTOLIBRARY);
};

musomap.splash.composer.prototype.getPicture  = function(source) {
    var options = { 
        quality : 25, 
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType : source,
        encodingType: Camera.EncodingType.JPEG,
        allowEdit : false,
        targetWidth: 1000,
        targetHeight: 1000
    };  
  
    navigator.camera.getPicture(
        function(imageURI){
            musomap.client.splash.composer.captureSuccess(imageURI);
        }, 
        function(){
            musomap.client.splash.composer.captureError(error);    
        },
        options); 
};

musomap.splash.composer.prototype.captureSuccess = function(imageURI) {
    musomap.log('musomap.splash.composer.captureSuccess');
    this.imageURI = imageURI;
    this.showFlyer();  
};


musomap.splash.composer.prototype.captureError  = function(error) {
    musomap.log('musomap.splash.composer.captureError');
    var msg = 'An error occurred during capture: ' + error.code;
    musomap.log(msg);
};

musomap.splash.composer.prototype.showFlyer = function() {
    musomap.log('musomap.splash.composer.showFlyer');
    $('.flyer img',this.$view).attr('src', this.imageURI);
    $('.flyer',this.$view).addClass('active');
};

musomap.splash.composer.prototype.save  = function() {
    musomap.log('musomap.splash.composer.save');
    
    musomap.client.splash.loading.show();
    $('.save', this.$view).addClass('active');
    
    var body = $('textarea', this.$view).val();
    var date = $('.schedule .date input', this.$view).val();
    
    var data = {};
    data.body = body;
    data.date = date;
    data.timezoneOffset = new Date().getTimezoneOffset();
    data.deviceReference = musomap.client.user.DeviceReference;
    
    var url = musomap.client.webroot + "/json/post/save.php";
    
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
                musomap.client.splash.composer.clear();
                musomap.client.zone.feed.clean();
                window.location.href = '#/feed/';
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
                musomap.client.splash.composer.clear();
                musomap.client.zone.feed.clean();
                window.location.href = '#/feed/';
            },
            error: function(jqXHR, textStatus, errorThrown) {
                window.location.href = '#/fail/' + jqXHR.responseText;
            },
            complete: function(jqXHR, textStatus) {
                musomap.client.splash.loading.hide();
            }
        });
    }
};


musomap.splash.composer.prototype.clear = function() {
    // type, textarea, schedule, flyer.
    this.clearFlyer();
    this.hideSchedule();
    $('textarea', this.$view).val('');
    $('textarea', this.$view).height(this.initHeight);
    $('.type .menu .post', this.$view).trigger('tap');
    $('.save', this.$view).removeClass('active');
};

musomap.splash.composer.prototype.clearFlyer = function() {
    musomap.log('musomap.splash.composer.clearFlyer');
    $('.flyer img',this.$view).attr('src', '');
    $('.flyer',this.$view).removeClass('active');
    this.imageURI = undefined;
};

musomap.splash.composer.prototype.showDatePicker = function() {
    musomap.log('musomap.splash.composer.showDatePicker');
    // mobiscroll
    var now = new Date();
    $('.schedule .date input', this.$view).mobiscroll().datetime({
        minDate: new Date(now.getFullYear(), now.getMonth(), now.getDate()),
        theme: 'android-ics light',
        display: 'modal',
        mode: 'scroller'
    });
    
    $('.schedule .date input', this.$view).mobiscroll('show'); 
};

musomap.splash.composer.prototype.setDate = function() {
    musomap.log('musomap.splash.composer.setDate');
    var text = $('.schedule .date input', this.$view).val();
    var eventDate = new Date(text);
    var formatted = dateFormat(eventDate , "dddd dS mmm yyyy h:MM tt"); 
    $('.schedule .date .value', this.$view).html(formatted);
    $('.schedule .date .label', this.$view).removeClass('active');
    $('.schedule .date .value', this.$view).addClass('active');
};

musomap.splash.composer.prototype.toggleTypeDropdown = function() {
    musomap.log('musomap.splash.composer.toggleTypeDropdown');
    var $menu = $('.panel .type .menu', this.$view);
    if ($menu.hasClass("active")){
       $menu.removeClass('active');
       $('textarea', this.$view).attr('placeholder','Write a post...');
    } else {
       $menu.addClass('active');
    }
};

musomap.splash.composer.prototype.selectType = function(type, name) {
    musomap.log('musomap.splash.composer.selectType');
    $('.panel .type .menu', this.$view).removeClass('active');
    if (type == 'Event'){
        this.showSchedule();
        $('textarea', this.$view).attr('placeholder','Event details...');
    }else{
        this.hideSchedule();
        $('textarea', this.$view).attr('placeholder','Write a post...');        
    }
    $('.panel .type .value', this.$type).html(name);
};


musomap.splash.composer.prototype.showSchedule = function() {
    musomap.log('musomap.news.feed.composer.clearSchedule');
    $('.schedule', this.$view).addClass('active');
    $('.schedule .label', this.$view).addClass('active');
};

musomap.splash.composer.prototype.hideSchedule = function() {
    musomap.log('musomap.news.feed.composer.clearSchedule');
    $('.schedule input', this.$view).val('');
    $('.schedule .date .value', this.$view).html('');
    $('.schedule .date .value', this.$view).removeClass('active');
    $('.schedule .label', this.$view).addClass('active');
    $('.schedule', this.$view).removeClass('active');
};