var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml", true);

xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
                              
        var channels = xhr.responseXML.getElementsByTagName("display-name");
        var programmes = xhr.responseXML.getElementsByTagName("channel");
        
        $("#channel").html(programmes[0]);
        //$("#title").html(channels);
        //$("#description").html(channels);
			
    }
}

xhr.send();
