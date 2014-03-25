musomap.splash.editor = function(args){
    musomap.log('musomap.splash.editor');

    this.init();
    this.bind();
};

musomap.splash.editor.prototype.init = function() {
    musomap.log('musomap.splash.editor.init');
    this.$view = $('#bodyFrame #splashFrame #editorSplash #editorPage #editorView');
    this.initHeight = $('textarea', this.$view).height();
};

musomap.splash.editor.prototype.bind = function() {
    musomap.log('musomap.splash.editor.init');
    
    // bind all inputs and textareas
    $('#zoneFrame input, #zoneFrame textarea').bind('tap', function(e){
        var $source = $(this);
        //musomap.client.splash.editor.show($source);
    });
    
    // avoid focus    
    $('#zoneFrame input, #zoneFrame textarea').bind('focus', function(e){
       //$(this).blur();
    });

    // keypress
    $('textarea', this.$view).keypress(function() {
        clearTimeout(musomap.client.splash.editor.delayKeypress);
        musomap.client.splash.editor.delayKeypress = setTimeout(function() {
            musomap.client.splash.editor.idle();
        }, 50);
    });    

    // Save
    $('#save', this.$view).bind('tap', function(e){
        musomap.client.splash.editor.hide();
    });    
};

musomap.splash.editor.prototype.show = function($source) {
    musomap.log('musomap.splash.editor.show');
    //enable
    $('textarea', this.$view).removeAttr('readonly');
    $('textarea', this.$view).removeAttr('disabled');
    // fill text
    $('textarea', this.$view).focus().select();

    var text = $source.val();
    $('textarea', this.$view).val(text); 
    // watermark
    var watermark = $source.attr('data-watermark');
    $('#watermark #message', this.$view).html(watermark);     
    
    
    // show
    $('textarea', this.$view).height(this.initHeight);
    $(this.$view).addClass('active');
    
    // retain source
    this.$source = $source;
};

musomap.splash.editor.prototype.hide = function() {
    musomap.log('musomap.splash.editor.hide');
    
    var text = $('textarea', this.$view).val();
    this.$source.val(text);
    
    $('textarea', this.$view).blur();
    $('textarea', this.$view).attr('readonly', 'readonly'); // Force keyboard to hide on input field.
    $('textarea', this.$view).attr('disabled', 'true'); // Force keyboard to hide on textarea field.
    $('textarea', this.$view).blur();

    // exit
    $(this.$view).removeClass('active');
};

musomap.splash.editor.prototype.idle = function() {
    // rollDown
    var scrollTop = $('textarea', this.$view).scrollTop();
    if (scrollTop > 0) {
        this.rollDown(scrollTop);
    }
};

musomap.splash.editor.prototype.rollUp = function() {
    $('textarea', this.$view).height(this.initHeight);
};

musomap.splash.editor.prototype.rollDown = function(scrollHeight) {
    var height = $('textarea', this.$view).height();
    $('textarea', this.$view).height(height + scrollHeight);
};