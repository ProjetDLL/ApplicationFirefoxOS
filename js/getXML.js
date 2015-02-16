var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml", true);


xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
         
        // balise chaine
        var channels = xhr.responseXML.getElementsByTagName("channel");//balise chaine - liste de toutes leschaines
            var channelId = channels[0].getAttribute("id");
            var channelName = channels[0].getElementsByTagName("display-name");
            
        //balise programme
        var programmes = xhr.responseXML.getElementsByTagName("programme");
            var programmeId = programmes[0].getAttribute("channel");
            var programmeStart = programmes[0].getAttribute("start");
                var debut = "Le " + programmeStart.substring(6,8) + "/" + 
                programmeStart.substring(4,6) + "/" + 
                programmeStart.substring(0,4) + " a " + 
                programmeStart.substring(8,10) + "h" + 
                programmeStart.substring(10,12);
        
            var programmeTitre = programmes[0].getElementsByTagName("title");
            var programmeSousTitre = programmes[0].getElementsByTagName("sub-title");
            var programmeDesc = programmes[0].getElementsByTagName("desc");
            var programmeLength = programmes[0].getElementsByTagName("length");
            var lenghtUnit = programmeLength[0].getAttribute("units");
            
        
        
        
        //$("#channel").html(channels[0].getElementsByTagName("display-name")); //Nom chaine
        $("#channel").html(channelName);
        $("#title").html(programmeTitre);
        $("#startANDduration").html(debut+" ("+programmeLength+" "+lenghtUnit+")");
        $("#description").html(programmeDesc);
        
			
    }
}

xhr.send();
