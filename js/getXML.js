var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml", true);


xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        
        var channels = xhr.responseXML.getElementsByTagName("channel");//balise chaine - liste de toutes les chaines
         
        //Ces deux variables serviront pour le positionnement des différentes divGeneral
        var wid = 0;
        var tran = 0;
        var divg;
        
        for(i = 0; i < channels.length; i++){
            
            //Création de la div général
            divGeneral = document.createElement('div');
            
            //Positionnement de la div créée en haut pour le défilement horizontal des chaînes
            divGeneral.setAttribute('data-index', i);
            divGeneral.style = 'width: 320px; left: ' + wid + 'px; transition-duration: 300ms; transform: translateX(' + 
            tran + 'px);';
            
            wid = wid - 320;
            if(tran == 0){
                tran = tran + 320;
            }
            
            //Création de la div b qui contiendra la chaîne
            var divB = document.createElement('div');
            divB.id = 'b';
             
            
        
                //On récupère l'ID et le nom de la chaine
                var channelId = channels[i].getAttribute("id");
                var channelName = channels[i].getElementsByTagName("display-name")[0].textContent;
                
                //On récupère le template
                var templateStruc = document.getElementById('structure');
                
                //On récupère la div swipe-wrap pour insérer notre template à jour plus tard
                var divParent = document.getElementsByClassName('swipe-wrap');
                
                //On clone le contenu du template pour insérer nos données
                var templateClone = templateStruc.content.cloneNode(true);
                
                
                //On insère le nom de la chaîne dans notre template
                templateClone.getElementById('channel').textContent = channelName;
                
                //On récupère le contenu des balises programme
                var programmes = xhr.responseXML.getElementsByTagName("programme");
                
                for(j = 0; j < programmes.length; j++){
                    
                    //On stocke le numéro de la chaîne courante
                     var programmeId = programmes[j].getAttribute("channel");
                     
                     //On regarde si le numéro de la chaîne courante match avec le numéro contenu dans l'attribut channel de la balise programme
                     if(programmeId == channelId){
                         var programmeStart = programmes[j].getAttribute("start");
                            var debut = "Le " + programmeStart.substring(6,8) + "/" + 
                            programmeStart.substring(4,6) + "/" + 
                            programmeStart.substring(0,4) + " a " + 
                            programmeStart.substring(8,10) + "h" + 
                            programmeStart.substring(10,12);
                    
                        var programmeTitre = programmes[j].getElementsByTagName("title")[0].textContent;
                        
                        //On teste la présence du sous titre                        
                        var programmeSousTitre = null;
                        try{
                            programmeSousTitre = "("+programmes[j].getElementsByTagName("sub-title")[0].textContent+")";
                        }
                        catch(exceptiondesc){
                            //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                            programmeSousTitre = null;
                        }

                        //On teste la présence d'une description
                        var programmeDesc = null;
                        try{
                            programmeDesc = programmes[j].getElementsByTagName("desc")[0].textContent;
                        }
                        catch(exceptiondesc){
                            //Si la balise description est absente, on informe l'utilisateur
                            programmeDesc = "Pas de description";
                        }
                        
                        var programmeLength = programmes[j].getElementsByTagName("length");
                        var lenghtUnit = programmeLength[0].getAttribute("units");
                        
                        //Instruction temporaire pour récupérer le 1er programme de chaqu chaîne
                        break;
                     }
                        
                    
                }
                
                /*On récupère dans une variable tmp la première position de la balise mainProgram 
                 * pour commencer à insérer nos données. 
                 * Ceci nous permettra d'insérer nos données dans la variable templateClone qui contient notre
                 * template cloné. */
                var tmp =  templateClone.getElementById('mainProgram').firstElementChild;
                
                /* Ici, on parcourt la balise mainProgram du template cloné pour insérer chaque données. */
                
                //Insertion du titre du programme
               tmp.textContent = programmeTitre;
               
               //On passe au voisin suivant
               tmp = tmp.nextElementSibling;
                
                //Insertion du sous-titre du programme
                tmp.textContent = programmeSousTitre;
                
                //Voisin suivant
                tmp = tmp.nextElementSibling;
                    
                //Insertion de la date, l'heure de début et la durée du programme
                tmp.textContent = debut + " (" + programmeLength[0].textContent + " " + lenghtUnit +")";
                
                //Insertion de la description du programme
                templateClone.getElementById('mainProgram').lastElementChild.textContent = programmeDesc;
                
                //On rattache notre template à jour à la divB
                divB.appendChild(templateClone);
                
                //Notre divB qui contient notre template fourni est rattaché à la div générale
                divGeneral.appendChild(divB);
                
                //Rattachement de la divGeneral à divParent (la div swipe-wrap)
                divParent[0].appendChild(divGeneral);
        }
        
        document.getElementById('splashScreen').style.display = 'none';
   }
}

xhr.send();
