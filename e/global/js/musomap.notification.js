musomap.notification = function(args){
    musomap.log('musomap.notification');

    this.init();
    // this.bind();
};

musomap.notification.prototype.init = function() {
    musomap.log('musomap.notification.init');
    this.registrationID = null;
};

musomap.notification.prototype.bind = function() {
    musomap.log('musomap.notification.bind');
    if (window.plugins !== undefined && musomap.client.user == undefined){
        this.pushNotification = window.plugins.pushNotification;
        if (device.platform == 'android' || device.platform == 'Android') {
            this.pushNotification.register(
            function(result){
                // success
                musomap.log('Notification callback success: ' + result);
            }, function(error){
                // error
                musomap.log('Notification callback error: ' + error);
            },
            {"senderID":"709814729665","ecb":"musomap.client.notification.incomingGCM"});
        }
        else {
            this.pushNotification.register(
            function(result){
                // success
                musomap.log('Notification callback success: ' + result);
                musomap.client.notification.updateDevice(result);
                
            }, function(error){
                // error
                musomap.log('Notification callback error: ' + error);
            },                
            {"badge":"true","sound":"true","alert":"true","ecb":"musomap.client.notification.incomingAPN"});
        }    
    }
};

musomap.notification.prototype.incomingGCM = function(e) {
    musomap.log('musomap.notification.incomingGCM');
    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                musomap.log("Notification registration: " + e.regid);
				this.updateDevice(e.regid);
            }
        break;

        case 'message':
          musomap.log('message = '+e.message);
          musomap.client.zone.notify.refresh();
          window.location.href = '#/notify';
        break;

        case 'error':
          musomap.log('GCM error = '+e.msg);
        break;

        default:
          alert('An unknown GCM event has occurred');
          break;
    }
};

musomap.notification.prototype.incomingAPN = function(event) {
    musomap.log('musomap.notification.incomingAPN');
    musomap.log("Running in JS - onNotificationAPN - Received a notification! " + event.alert);
    
    if (event.alert) {
        navigator.notification.alert(event.alert);
    }
    if (event.badge) {
        this.pushNotification.setApplicationIconBadgeNumber(
            function(result){
                // success
                musomap.log('Notification callback success: ' + result);
            }, function(error){
                // error
                musomap.log('Notification callback error: ' + error);
            },
            event.badge);
    }
    if (event.sound) {
        var snd = new Media(event.sound);
        snd.play();
    }
    
    musomap.log('message = ' + event.alert);
    musomap.client.zone.notify.refresh();
    window.location.href = '#/notify';    
    
};

musomap.notification.prototype.updateDevice = function(registrationID) {
    musomap.log('musomap.notification.updateDevice');
    this.registrationID = registrationID;
};