musomap.zone.feed = function(args){
    musomap.log('musomap.zone.feed');

    this.init();
    this.bind();
};

musomap.zone.feed.prototype.init = function(){
    musomap.log('musomap.zone.feed.init');
    this.$view =  $('#bodyFrame #zoneFrame #feedZone #feedPage #feedView');
    
    this.pageIndex = 0;
    this.query = '';
    this.label = '';
    this.localOnly = false;
};

musomap.zone.feed.prototype.bind = function(){
    musomap.log('musomap.zone.feed.init');
    
    // scroller
    var scrollerID = $('.iScroll', this.$view).attr('id');
    for(var i = 0; i < musomap.iScrollCollection.length; i++){
        var scroller = musomap.iScrollCollection[i];
        if (scroller.wrapper.id == scrollerID){
            this.scroller = scroller;
        }
    }
    if (this.scroller !== undefined){
        this.scroller.options.onScrollMove = function(){
            if (musomap.client.zone !== undefined){
                musomap.client.zone.feed.scrollMove();
            }
        };
        this.scroller.options.onScrollEnd = function(){
            if (musomap.client.zone !== undefined){
                musomap.client.zone.feed.scrollEnd();
            }
        };
        var pullDownOffset = $('#pullDown', this.$view).height();
        this.scroller.topOffset = -pullDownOffset;
    }
    // next page
    $('#pagination #next', this.$view).bind('tap', function(e){
        var active = $(this).hasClass('active');
        if (!active){
            musomap.client.zone.feed.addPage();
        }
    });
    
};

musomap.zone.feed.prototype.show = function(query){
    musomap.log('musomap.zone.feed.show');

    if ($('#list .post', this.$view).length == 0 || this.query != query || this.label != ''){
        this.query = query;
        this.label = '';
        $('#headerFrame #menu #query #label').html(query);
        this.clean();
        this.search();
    }
    
    this.$view.addClass('active');
};

musomap.zone.feed.prototype.showProfile = function(label){
    musomap.log('musomap.zone.feed.showProfile');
 
    if ($('#list .post', this.$view).length == 0 || this.label != label || this.query != ''){
        this.label = label;
        this.query = '';
        $('#headerFrame #menu #query #label').html('');
        this.clean();
        this.getProfile();
    }
    this.$view.addClass('active');
    
};

musomap.zone.feed.prototype.clean = function(){
    // hide
    this.pageIndex = 0;
    $('#profile', this.$view).removeClass('active');
    $('#profile #image img', this.$view).attr('src', '');
    $('#profile #image img', this.$view).removeClass('active');
    $('#profile #name', this.$view).html('');
    $('#profile #address', this.$view).html('');
    $('#profile #info', this.$view).html('');
    $('#list .post', this.$view).remove();
    $('#pagination', this.$view).addClass('hide');
    
    this.showQuestion();
    this.scrollTop();

};

musomap.zone.feed.prototype.scrollTop = function(){
    var offset = this.scroller.topOffset;
    this.scroller.scrollTo(0, offset, 2000);
};

musomap.zone.feed.prototype.showQuestion = function(){
    // pick random prompt
    $('#prompt #list .question', this.$ivew).removeClass('active');
    var questions = $('#prompt #list .question', this.$ivew);
    var random = Math.floor((Math.random() * questions.length)+1);
    $(questions).eq(random - 1).addClass('active');
};

musomap.zone.feed.prototype.refresh = function(){
    musomap.log('musomap.zone.feed.refresh');
    this.clean();
    if (this.label == '')
    {
        this.search();
    }else{
        this.getProfile(this.label);
    }

};

musomap.zone.feed.prototype.setLocalOnly = function(active){
    this.localOnly = active;
    this.label = '';
    if (window.location.hash = '#/feed/'){
        this.refresh();
    }else{
        window.location.href = '#/feed/';
    }
};

musomap.zone.feed.prototype.addPage = function(){
    musomap.log('musomap.zone.feed.addPage');
    this.pageIndex++;
    this.search();
};

musomap.zone.feed.prototype.search = function(){
    musomap.log('musomap.zone.feed.search');

    var url = musomap.client.webroot + "/json/post/search/query.php";
    var query = this.query;
    var data = {};
    data.pageIndex = this.pageIndex;
    data.local = this.localOnly;    
    data.query =  this.query;
    data.lat = musomap.client.user.Lat;
    data.lng = musomap.client.user.Lng;
    data.deviceReference = musomap.client.user.DeviceReference;
    if (this.label.length) {
        // profile
        url = musomap.client.webroot + "/json/post/search/label.php";
        data.query = this.label;
    }
    musomap.client.splash.loading.show();
    
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        'cache' : false,
        success: function(posts) {
            // success
            musomap.client.zone.feed.renderPosts(posts);
        },
        error: function(Response) {
            // error
            musomap.client.splash.system.show(Response.responseText);
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }        
    });    
};

musomap.zone.feed.prototype.renderPosts = function(posts) {
    musomap.log('musomap.news.feed.stream.renderPosts');

    if (posts.length < 10){
        this.paginationEnabled = false;
    }
    
    for (var i = 0; i < posts.length; i++) {
        this.renderPost(posts[i]);
    }

    // pagination
    if(posts.length < 10){
        $('#pagination', this.$view).addClass('hide');
    }else{
        $('#pagination', this.$view).removeClass('hide');
    }

    // exit
    $('.timeago', this.$view).timeago();
    this.rebind();
    
    // images
    setTimeout(function(){
        musomap.client.zone.feed.renderImages();
    }, 1000);
};

musomap.zone.feed.prototype.renderPost = function(post) {
    var template = $('#stream #template', this.$view).clone();
    var body = post.Body;
    var body = musomap.renderLinks(post.Body);
    if (!body.length) {
        body = 'Just plotted and having a look around...';
    }

    // post
    $('.message .body', template).html(body);
    $('.icon', template).attr('data-href', '#/profile/' + post.Label);
    $('.icon img', template).attr('data-src', musomap.client.baseDomain + '/i/image/profile/dynamic/' + post.UserReference + '_30x30.jpg');
    $('.name', template).attr('data-href', '#/profile/' + post.Label);
    $('.name', template).html(post.Name);
    $('.address', template).html(post.Address);
    $('.timeago', template).attr('data-datetime', post.DateCreated);

    // action
    if (post.PostReference !== null) {
        $('.action .like', template).attr('data-postReference', post.PostReference);
        if (post.Liked !== undefined && post.Liked == "1") {
            $('.action .like', template).addClass('active');
        }
        $('.action .reply', template).attr('data-href', '#/composer/' + post.Label);
        $('.action .delete', template).attr('data-postReference', post.PostReference);
        if (post.UserReference != musomap.client.user.Reference) {
            $('.action .delete', template).remove();
        }
    }
    else {
        $('.action', template).remove();
    }

    //flyer
    $('.flyer .image', template).attr('data-href', '#/profile/' + post.Label);
    $('.flyer .image img', template).attr('data-src', musomap.client.baseDomain + '/i/image/post/original/' + post.Original);
    if (post.Original === null || post.Original.length === 0) {
        $('.flyer', template).remove();
    }
    
    // schedule
    $('.schedule', template).html(post.StartDateTime);
    if (post.StartDateTime === null || post.StartDateTime.length === 0) {
       $('.schedule', template).remove(); 
    }else{
        $('.post', template).addClass('event');
    }

    // external
    $('.external .preview a', template).attr('href', post.ExternalURL);
    $('.external .preview img', template).attr('data-src', post.ExternalImage);
    $('.external .title a', template).attr('href', post.ExternalURL);
    $('.external .title a', template).html(post.ExternalTitle);
    $('.external .host a', template).attr('href', post.ExternalURL);
    $('.external .host a', template).html(post.ExternalHost);
    $('.external .summary', template).html(post.ExternalSummary);    
    if (post.ExternalImage === null || post.ExternalImage.length === 0) {
        $('.external .preview a', template).remove();
    }    
    if (post.ExternalURL === null || post.ExternalURL.length === 0) {
        $('.external', template).remove();
    }

    // append
    $('#stream #list', this.$view).append(template.html());
}

musomap.zone.feed.prototype.rebind = function() {
    // tap
    musomap.rebindTap(this.$view.selector + ' div[data-href]');
    
    // external links.
    $('a', this.$view).unbind();
    $('a', this.$view).on('click', function(e) {
        e.preventDefault();
        var href = $(this).attr('href');
        window.open(href, '_system');
    });
    
    // action
    $('#stream #list .post', this.$view).each(function(){
        // like
        $('.action .like', this).unbind();
        $('.action .like', this).on('tap', function(e) {
            e.preventDefault();
            var reference = $(this).attr('data-postReference');
            var active = $(this).hasClass('active');
            if (active) {
                musomap.client.zone.feed.unlikePost(reference);
                $(this).removeClass('active');
            }
            else {
                musomap.client.zone.feed.likePost(reference);
                $(this).addClass('active');
            }
        });

        // delete
        $('.action .delete', this).unbind();
        $('.action .delete', this).on('tap', function(e) {
            e.preventDefault();
            var c = confirm("Are you sure you want to delete this?");
            if (c) {
                var reference = $(this).attr('data-postReference');
                musomap.client.zone.feed.deletePost(reference);
                $(this).parent().parent().parent().parent().slideUp();
            }
        });
    });
};

musomap.zone.feed.prototype.renderImages = function() {
    musomap.log('musomap.news.feed.stream.renderPosts');
    $('img[data-src]', this.$view).each(function(){
        var src = $(this).attr('data-src');
        $(this).bind('load', function () { 
            // flyer images with no link.
            $(this).parent().removeClass('loading');
            // external images with href link.
            $(this).parent().parent().removeClass('loading');
        });
        $(this).attr('src', src);
        $(this).removeAttr('data-src');
    });
};

musomap.zone.feed.prototype.deletePost = function(postReference) {
    var data = {};
    data.postReference = postReference;
    data.deviceReference = musomap.client.user.DeviceReference;
    var url = musomap.client.webroot + "/json/post/delete.php";
    
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(Response) {
            //
        },
        error: function(Response) {
            musomap.client.splash.system.show(Response.responseText);
        },
        complete: function(jqXHR, textStatus) {
        }
    });
};

musomap.zone.feed.prototype.likePost = function(postReference) {
    var data = {};
    data.postReference = postReference;
    data.deviceReference = musomap.client.user.DeviceReference;
    var url = musomap.client.webroot + "/json/post/like.php";
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(Response) {
            //
        },
        error: function(Response) {
            musomap.client.splash.system.show(Response.responseText);
        },
        complete: function(jqXHR, textStatus) {
        }
    });
};

musomap.zone.feed.prototype.unlikePost = function(postReference) {
    var data = {};
    data.postReference = postReference;
    data.deviceReference = musomap.client.user.DeviceReference;
    var url = musomap.client.webroot + "/json/post/unlike.php";
    $.ajax({
        'type': 'post',
        'url': url,
        'type': 'post',
        'dataType': 'json',
        'timeout': 80000,        
        'data': data,
        success: function(Response) {
            //
        },
        error: function(Response) {
            musomap.client.splash.system.show(Response.responseText);
        },
        complete: function(jqXHR, textStatus) {
            
        }
    });
};

musomap.zone.feed.prototype.getProfile = function(){
    musomap.log('musomap.zone.feed.getProfile');

    var url = musomap.client.webroot + "/json/user/profile.php";
    
    musomap.client.splash.loading.show();
    $.ajax({
        'type': 'post',
        'url': url,
        type: 'post',
        dataType: 'json',
        timeout: 80000,  
        cache : false,
        data: {
            'label': this.label
        },
        success: function(user) {
            // success
            musomap.client.zone.feed.renderProfile(user);
        },
        error: function(Response) {
            // error
            // musomap.client.splash.system.show(Response.responseText);
            window.location.href = '#/fail/' + Response.responseText;
        },
        complete: function(jqXHR, textStatus) {
            musomap.client.splash.loading.hide();
        }        
    });    
};

musomap.zone.feed.prototype.renderProfile = function(user){
    musomap.log('musomap.zone.feed.renderProfile');
    var time = new Date().getTime();
    var image = musomap.client.baseDomain + '/i/image/profile/dynamic/' + user.Reference + '_80x80.jpg?t=' + time;
    $('#profile img', this.$view).attr('src', image);
    $('#profile img', this.$view).addClass('active');
    $('#profile #name', this.$view).html(user.Name);
    $('#profile #label', this.$view).html(user.Label);
    $('#profile #address', this.$view).html(user.Address);
    var info = musomap.renderLinks(user.Info);
    $('#profile #info', this.$view).html(info);
    $('#profile', this.$view).addClass('active');
    
    if (user.Reference == musomap.client.user.Reference){
        // home profile
        $('#profile #action', this.$view).addClass('active');
    }else{
        $('#profile #action', this.$view).removeClass('active');
    }
    
    this.search();
    this.renderMap(user.Lat, user.Lng);
};

musomap.zone.feed.prototype.renderMap = function(lat, lng){
    musomap.log('musomap.zone.feed.renderMap');

    var options = {
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        panControl: false,
        zoomControl: false,
        scaleControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        draggable: false, 
        zoomControl: false, 
        scrollwheel: false, 
        disableDoubleClickZoom: true
    };
    
    var canvas = $('.map .canvas', this.$view);
    canvas.attr('data-href', '#/map/' + lat + '/' + lng);
    canvas.height(80);
    this.gMap  = new google.maps.Map(canvas[0], options);  

    var zoom = 14; 
    var center = new google.maps.LatLng(lat, lng);
    
    this.gMap.setCenter(center);
    this.gMap.setZoom(zoom);
    this.renderMarker(center);
};

musomap.zone.feed.prototype.renderMarker = function(LatLng){
    musomap.log('musomap.zone.feed.renderMarker');
    
    if (this.marker != undefined){
        this.marker.setMap(null);
    }

    var markerIcon = {
        url: 'e/zone/map/image/orangeCircle.png',
        size: new google.maps.Size(20, 20),
        origin: new google.maps.Point(0,0),
        anchor: new google.maps.Point(10, 10)
    };

    this.marker = new google.maps.Marker({
      position: LatLng,
      map: this.gMap,
      icon: markerIcon
    });
};

musomap.zone.feed.prototype.scrollEnd = function(){
    var active = $('#pullDown', this.$view).hasClass('active'); 
    // refresh
    if (active){
        $('#pullDown', this.$view).attr('class', '');
        $('#pullDown #label', this.$view).html('Loading...');        
        musomap.client.zone.feed.refresh();
    }
};

musomap.zone.feed.prototype.scrollMove = function(){
    var loading = $('#pullDown', this.$view).hasClass('loading'); 
    if (this.scroller.y > 5){
        $('#pullDown #label', this.$view).html('Release to refresh...');
        $('#pullDown', this.$view).addClass('active');
        this.scroller.minScrollY = 0;
    }else if (!loading){
        $('#pullDown #label', this.$view).html('Pull down to refresh...');
        $('#pullDown', this.$view).removeClass('active');
        this.scroller.minScrollY = this.scroller.topOffset;
    }
};
