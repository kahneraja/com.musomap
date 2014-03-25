var musomap = {};
musomap.log = function(message){
    console.log(message);
    if (musomap.client.zone !== undefined){
        musomap.client.zone.log.write(message);
    }
};

musomap.renderLinks = function(Text){
  var result = Text;
  
  // Linkify
  var options = {
    callback: function( text, href ) {
      var result = text;
      if (href){
        // ignore if previously linkified
        if (Text.indexOf('href="' + href + '"') == -1){
          result = '<a href="' + href + '" target="_blank">' + text + '</a>';
        }
      }
      
      return result;
    }
  };
  
  result = linkify(Text, options);
  
  // New Line
  result = result.replace(/(\r\n|[\r\n])/g, "<br />");
  
  // HashTags 
  var hashRegEx = /\B#(\w*[A-Za-z_]+\w*)/ig; 
  result = result.replace(hashRegEx, function(hashtag) {
    var color = musomap.getColor(hashtag.substring(1));
    return '<div data-href="#/feed/'+hashtag.substring(1)+'" style="color:' + color + ';" class="hashtag">'+hashtag+'</div>'; 
  });
  
  // Labels
  var labelRegEx = /\B@(\w*[A-Za-z_]+\w*)/ig; 
  result = result.replace(labelRegEx, function(label) {
    return '<div data-href="#/profile/'+label.substring(1)+'" class="label">@'+label.substring(1)+'</div>'; 
  });
  return result;
};

musomap.getColor = function(Word){
  var hash = 0;
  Word = Word.toLowerCase();    
  for (var i = 0; i < Word.length; i++) {
    hash = Word.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  var hex = ((hash >>24)&0xFF).toString(16) +
      ((hash >>16)&0xFF).toString(16) +
      ((hash >>8)&0xFF).toString(16) +
      (hash&0xFF).toString(16);

  var color = hex.substring(0, 6);
  // hack: correct length.
  while(color.length < 6){
    color += '0';
  }
  
  return '#' + color;
};

musomap.extractLinks = function(text){
    var ex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(ex);
    var matches = text.match(regex);
    return matches;
};

musomap.shorten = function(str, count) {
    var result = str;
    if(result.length > count){
        result = result.substring(0, count)  + '&hellip;';
    }
    return result;
};

musomap.alignChildImage = function(image) {
    musomap.log('musomap.alignImage');
    // size
    width = $(image).width();
    height = $(image).height();
    // larger than parent
    parentWidth = $(image).parent().parent().width();
    parentHeight = $(image).parent().parent().height();
    
    // horizontal offset
    if (width > parentWidth){
        var widthDiff = width - parentWidth;
        $(image).css('margin-left',-widthDiff / 2);
    }
    // vertical offset
    if (height > parentHeight){
        var heightDiff = height - parentHeight;
        $(image).css('margin-top',-heightDiff / 2);
    }    
};

musomap.rebindTap = function(elem){
    musomap.log('musomap.rebindTap');
    
    // tap
    $(elem).unbind('tap');
    $(elem).on('tap', function() {
        var href = $(this).attr('data-href');
        window.location.href = href;
    });   
};