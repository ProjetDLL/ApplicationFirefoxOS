var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml", true);


xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        
        var channels = xhr.responseXML.getElementsByTagName("channel");//balise chaine - liste de toutes les chaines
         
        //Ces deux variables serviront pour le positionnement des différentes divGeneral
        var wid = 0;
        var tran = 0;
        var divg;
        
        //Cette variable servira à quitter la boucle des programmes quand une chaîne est totalement renseignée
        var nextP = 0;
        
        for(i = 0; i < channels.length; i++){
            
            //Création de la div général
            divGeneral = document.createElement('div');
            
            //Positionnement de la div créée en haut pour le défilement horizontal des chaînes
            divGeneral.setAttribute('data-index', i);
            divGeneral.style = 'width: 320px; left: ' + wid + 'px; transition-duration: 300ms; transform: translateX(' + 
            tran + 'px);';
            
            wid = wid - screen.width;
            if(tran == 0){
                tran = tran + screen.width;
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
                    
                    // On sauvegarde la date et l'heure de fin du programme courant
                    var programmeStop = programmes[j].getAttribute("stop");
                    var datestop = new Date(parseInt(programmeStop.substring(0,4)), (parseInt(programmeStop.substring(4,6))) - 1,
                            parseInt(programmeStop.substring(6,8)), parseInt(programmeStop.substring(8,10)), 
                          (programmeStop.substring(10,12)), 0);
                    
                    // Pour la comparaison, on convertit cette date en millisecondes
                    datestop = datestop.getTime();
                    
                    // Date du jour en millisecondes
                    var dateJour = new Date().getTime();
                    
                    // On positionne notre variable à 0 --> Chaîne non complétée
                    nextP = 0;
                    
                    /*On regarde si le numéro de la chaîne courante match avec le numéro contenu dans l'attribut channel
                     * de la balise programme.
                     * De plus, on regarde si la date courante est plus petite que la date de fin du programme
                     * courant --> Si oui, on sait que ce programme passe actuellement donc on l'affiche.
                     */
                    if((programmeId == channelId) && (new Number(dateJour) < new Number(datestop))){
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

                       
                       var programmeDesc, programmeDirecteur, programmeCredits, programmeActeurs, acteurs, programmeDate, programmeType = null;
                       
                        //On teste la présence d'une description
                        try{
                            programmeDesc = programmes[j].getElementsByTagName("desc")[0].textContent;
                        }
                        catch(exceptiondesc){
                            //Si la balise description est absente, on informe l'utilisateur
                            programmeDesc = "Pas de description";
                        }
                        
                      //informations complémetaires
                        programmeType = programmes[j].getElementsByTagName("category")[0].textContent;
                        programmeCredits = programmes[j].getElementsByTagName("credits")[0];
                        
                        if(programmeType ==  'Documentaire' || programmeType == 'Feuilleton' ||
                        		programmeType == 'Film' || programmeType == 'Téléfilm' ||
                        		programmeType == 'Série'){
                        	
                        	try{
                                programmeDirecteur = programmeCredits.getElementsByTagName("director")[0].textContent;
                                programmeActeurs = programmeCredits.getElementsByTagName("actor");
                                
                                for(var x = 0; x < programmeActeurs.length; x++){
                                    acteurs += programmeActeurs[x].textContent + ", ";

                                }

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                        
                        else if(programmeType == 'Magazine' || programmeType == 'Jeu' ||
                        		programmeType == 'Journal' || programmeType == 'Divertissement'){
                        	try{
                                programmeDirecteur = programmeCredits.getElementsByTagName("presenter")[0].textContent;

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                    	try{
                    		programmeDate = programmes[j].getElementsByTagName("date")[0].textContent;

                        }
                        catch(exceptiondesc){
                            //Si cette balise est absente, on informe l'utilisateur
                        }
                        
                        
                        
                        
                        var programmeLength = programmes[j].getElementsByTagName("length");
                        var lenghtUnit = programmeLength[0].getAttribute("units");
                        
                      //On se positionne sur la balise des prochains programmes dans le template
                        var nextProg = templateClone.getElementById('programList').firstElementChild;
                        var baliseCourante = null;
                        
                        var programmeStartNext, lenghtUnitNext, debutNext, programmeLengthNext;
                        
                        /* Ici, affichage des prochains programmes de la chaîne courante
                         * La variable q permet de limiter l'affichage auxx 3 prochains programmes correspondant
                         * à la chaîne.
                         * On intialise une variable j au programme suivant et qui correspondant toujours à la
                         * chaîne courante.
                         */
                        for(q = 0, p = j + 1; q < 3 && programmeId == programmes[p].getAttribute("channel"); q++, p++){
                            
                            //On se positionne sur la 1ère balise des next programmes
                            baliseCourante = nextProg.firstElementChild;
                            
                            //On attache le titre de l'émission suivante
                            baliseCourante.textContent = programmes[p].getElementsByTagName("title")[0].textContent;
                            
                            //Passage au voisin suivant;
                            baliseCourante = baliseCourante.nextElementSibling;
                            
                            //On essaye de charger le sous titre.
                            try{
                                baliseCourante.textContent = programmes[p].getElementsByTagName("sub-title")[0].textContent;
                            }
                            catch(exceptiondesc){
                                //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                                baliseCourante.textContent = null;
                            }
                            
                            //Voisin suivant
                            baliseCourante = baliseCourante.nextElementSibling;
                            
                            //Formattage de la variable start pour le début de programme
                            programmeStartNext = programmes[p].getAttribute("start");
                            debutNext = "Le " + programmeStartNext.substring(6,8) + "/" + 
                            programmeStartNext.substring(4,6) + "/" + 
                            programmeStartNext.substring(0,4) + " a " + 
                            programmeStartNext.substring(8,10) + "h" + 
                            programmeStartNext.substring(10,12);
                            
                            programmeLengthNext = programmes[p].getElementsByTagName("length");
                            lenghtUnitNext = programmeLengthNext[0].getAttribute("units");
                            
                            //On écrit dans cette balise les informations sur l'heure de début du programme
                            baliseCourante.textContent = debutNext + " (" + programmeLengthNext[0].textContent + " " + lenghtUnitNext +")";
                            
                            //On passe à la balise "programJ" suivant
                            nextProg = nextProg.nextElementSibling;
                        }
                        /* Cette chaîne contient déjà la liste des prochains programmes
                         * Ceci permettra de sortir de la boucle pour passer à la chaîne suivante
                         */
                        nextP = 1;
                     }
                    //On met cette conition pour quitter la boucle des programmes et passer à la chaîne suivante
                    if(nextP == 1){
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
                //templateClone.getElementById('mainProgram').lastElementChild.textContent = programmeDesc;
                
                var infoComplementaire = templateClone.getElementById('info_complementaire').firstElementChild;
                // affichage de la description du programme
                var description = infoComplementaire.nextElementSibling;
                description.textContent = programmeDesc;
                
                //affichage des participants
                var directeur = description.nextElementSibling.nextElementSibling.nextElementSibling;
                directeur.textContent = programmeDirecteur;
                
                //affichage des acteurs
                var actors = directeur.nextElementSibling.nextElementSibling;
                actors.textContent = acteurs;
                
                //affichage date de sortie du programme
                var dateSortie = actors.nextElementSibling.nextElementSibling;
                dateSortie.textContent = programmeDate;
                
                //affichage du type du programme
                var type = dateSortie.nextElementSibling.nextElementSibling;
                type.textContent = programmeType;
                
               
                
                //On rattache notre template à jour à la divB
                divB.appendChild(templateClone);
                
                //Notre divB qui contient notre template fourni est rattaché à la div générale
                divGeneral.appendChild(divB);
                
                //Rattachement de la divGeneral à divParent (la div swipe-wrap)
                divParent[0].appendChild(divGeneral);
        }
        
       
   }
        document.getElementById("info_complementaire").addEventListener("click", function(){document.getElementById("info_complementaire").style.height = "auto";}, false);
        document.getElementById("info_complementaire").addEventListener("dblclick", function(){document.getElementById("info_complementaire").style.height = "115px";}, false);
        document.getElementById('listIcon').addEventListener("click", function(){document.getElementById('listeProgramme').style.display = "block";}, false);
        document.getElementById('closeIcon').addEventListener("click", function(){document.getElementById('listeProgramme').style.display = "none";}, false);
        document.getElementById('splashScreen').style.display = 'none';
        
        //document.getElementById('splashScreen').style.zindex = '0'; //test
  
        //Liste de sélection des chaînes
        //document.getElementById('listeProgramme').style.display = 'none';
    }



xhr.send();
