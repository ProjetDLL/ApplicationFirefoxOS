var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml", true);


xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
    	
    	var channels = xhr.responseXML.getElementsByTagName("channel");//balise chaine - liste de toutes les chaines
         
    	var wid = 0;
    	var tran = 0;
    	var divg;
    	
    	for(i = 0; i < channels.length; i++){
         	
            divg = document.createElement('div');
            
            //Positionnement de la div générale pour le défilement horizontal des chaînes
            divg.setAttribute('data-index', i);
            divg.style = 'width: 320px; left: ' + wid + 'px; transition-duration: 300ms; transform: translateX(' + 
            tran + 'px);';
    		
            wid = wid - 320;
            if(tran == 0){
            	tran = tran + 320;
            }
            
    		var dive = document.createElement('div');
             dive.id = 'b';
             
            
    	
             	// balise chaine
	            var channelId = channels[i].getAttribute("id");
	            var channelName = channels[i].getElementsByTagName("display-name")[0].textContent;
	            
	            var tpl = document.getElementById('structure');
	            
	            var div = document.getElementsByClassName('swipe-wrap');
	            
	            var btn = tpl.content.cloneNode(true);
	            
	            
	            //On insère le nom de la chaîne
	            btn.getElementById('channel').textContent = channelName;
	            
		        //balise programme
		        var programmes = xhr.responseXML.getElementsByTagName("programme");
		        
		        for(j = 0; j < programmes.length; j++){
		        	
		        	 var programmeId = programmes[j].getAttribute("channel");
		        	 
		        	 if(programmeId == channelId){
		        		 var programmeStart = programmes[j].getAttribute("start");
			                var debut = "Le " + programmeStart.substring(6,8) + "/" + 
			                programmeStart.substring(4,6) + "/" + 
			                programmeStart.substring(0,4) + " a " + 
			                programmeStart.substring(8,10) + "h" + 
			                programmeStart.substring(10,12);
			        
			            var programmeTitre = programmes[j].getElementsByTagName("title")[0].textContent;
			            var programmeSousTitre = programmes[j].getElementsByTagName("sub-title")[0].textContent;
			            var programmeDesc = programmes[j].getElementsByTagName("desc")[0].textContent;
			            var programmeLength = programmes[j].getElementsByTagName("length");
			            var lenghtUnit = programmeLength[0].getAttribute("units");
			            
			            break;
		        	 }
			            
		        	
		        }
	            
		        var tmp =  btn.getElementById('mainProgram').firstElementChild;
		        
		        //Insertion du titre du programme
	           tmp.textContent = programmeTitre;
	           
	           //Voisin suivant
	           tmp = tmp.nextElementSibling;
	            
		        //Insertion du sous-titre du programme
	            tmp.textContent = "("+programmeSousTitre+")";
	            
		        //Voisin suivant
		        tmp = tmp.nextElementSibling;
		            
			    //Insertion de la date, l'heure de début et la durée du programme
		        tmp.textContent = debut + " (" + programmeLength[0].textContent + " " + lenghtUnit +")";
		        
			    //Insertion de la description du programme
		        btn.getElementById('mainProgram').lastElementChild.textContent = programmeDesc;
	            
	            dive.appendChild(btn);
	            
	            divg.appendChild(dive);

	            div[0].appendChild(divg);
    	}
    	
			
   }
}

xhr.send();