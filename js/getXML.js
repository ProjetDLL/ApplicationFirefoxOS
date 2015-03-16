var xhr = new XMLHttpRequest({mozSystem: true});
xhr.open("GET", "http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml", true);

for(d = 0; d < 18; d++){
	
    //Création de la div général
    divGeneral = document.createElement('div');
    divGeneral.id = d;
	
    var divB = document.createElement('div');
    divB.id = 'b' + d;
    
    divGeneral.appendChild(divB);
    var doclass = document.getElementsByClassName('swipe-wrap');
    doclass[0].appendChild(divGeneral);
}


xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
        
        var channels = xhr.responseXML.getElementsByTagName("channel");//balise chaine - liste de toutes les chaines
        
        var divg;
        
        
        for(i = 0; i < channels.length; i++){
        		
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
                templateClone.getElementById('channelName').textContent = channelName;
                
                //On récupère la liste d'accès rapide
                
                //ul
                var listeAccesRapide = document.getElementById('accesRapide');
                //li
                var itemListeAccesRapide = document.createElement('li');
                //h1
                var linkItemListeAccesRapide = document.createElement('h1');
                linkItemListeAccesRapide.setAttribute("id", "h"+i);
                linkItemListeAccesRapide.textContent = channelName;
                
                
                                
                
                
                itemListeAccesRapide.appendChild(linkItemListeAccesRapide);
                listeAccesRapide.appendChild(itemListeAccesRapide);
                
                var token = 0;
                var tokenS = 0;
                
                //On récupère le contenu des balises programme
                var programmes = xhr.responseXML.getElementsByTagName("programme");
                
                outer: for(j = 0; j < programmes.length; j++){
                    
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
                    
                    
                    /*On regarde si le numéro de la chaîne courante match avec le numéro contenu dans l'attribut channel
                     * de la balise programme.
                     * De plus, on regarde si la date courante est plus petite que la date de fin du programme
                     * courant --> Si oui, on sait que ce programme passe actuellement donc on l'affiche.
                     */
                    if((programmeId == channelId) && (new Number(dateJour) < new Number(datestop)) && token == 0){
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
                        token = 1;
                     }
                    
                    
                    /*-------------------------PROGRAMMES DU SOIR----------------------*/
                    
                    var dateJourS = new Date();

                    var dateSoir = new Date(dateJourS.getFullYear(), dateJourS.getMonth(), dateJourS.getDate(), 20, 50,0);
                    
                    var programmeDeb = programmes[j].getAttribute("start");
                    var datestart = new Date(parseInt(programmeDeb.substring(0,4)), (parseInt(programmeDeb.substring(4,6))) - 1,
                            parseInt(programmeDeb.substring(6,8)), parseInt(programmeDeb.substring(8,10)), 
                          (programmeDeb.substring(10,12)), 0);
                    
                 // Pour la comparaison, on convertit cette date en millisecondes
                    datestart = datestart.getTime();
                    
                    dateSoir = dateSoir.getTime();
                                        
                    if((programmeId == channelId) && (new Number(dateSoir) <= new Number(datestart)) && tokenS == 0){
                        var programmeStartS = programmes[j].getAttribute("start");
                           var debutS = "Le " + programmeStartS.substring(6,8) + "/" + 
                           programmeStartS.substring(4,6) + "/" + 
                           programmeStartS.substring(0,4) + " a " + 
                           programmeStartS.substring(8,10) + "h" + 
                           programmeStartS.substring(10,12);
                           
                       var programmeTitreS = programmes[j].getElementsByTagName("title")[0].textContent;
                       
                       //On teste la présence du sous titre                        
                       var programmeSousTitreS = null;
                       try{
                           programmeSousTitreS = "("+programmes[j].getElementsByTagName("sub-title")[0].textContent+")";
                       }
                       catch(exceptiondesc){
                           //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                           programmeSousTitreS = null;
                       }

                       
                       var programmeDescS, programmeDirecteurS, programmeCreditsS, programmeActeursS, acteursS, programmeDateS, programmeTypeS = null;
                       
                        //On teste la présence d'une description
                        try{
                            programmeDescS = programmes[j].getElementsByTagName("desc")[0].textContent;
                        }
                        catch(exceptiondesc){
                            //Si la balise description est absente, on informe l'utilisateur
                            programmeDescS = "Pas de description";
                        }
                        
                      //informations complémetaires
                        programmeTypeS = programmes[j].getElementsByTagName("category")[0].textContent;
                        programmeCreditsS = programmes[j].getElementsByTagName("credits")[0];
                        
                        if(programmeTypeS ==  'Documentaire' || programmeTypeS == 'Feuilleton' ||
                        		programmeTypeS == 'Film' || programmeTypeS == 'Téléfilm' ||
                        		programmeTypeS == 'Série'){
                        	
                        	try{
                                programmeDirecteurS = programmeCreditsS.getElementsByTagName("director")[0].textContent;
                                programmeActeursS = programmeCreditsS.getElementsByTagName("actor");
                                
                                for(var x = 0; x < programmeActeursS.length; x++){
                                    acteurs += programmeActeursS[x].textContent + ", ";

                                }

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                        
                        else if(programmeTypeS == 'Magazine' || programmeTypeS == 'Jeu' ||
                        		programmeTypeS == 'Journal' || programmeTypeS == 'Divertissement'){
                        	try{
                                programmeDirecteurS = programmeCreditsS.getElementsByTagName("presenter")[0].textContent;

                            }
                            catch(exceptiondesc){
                                //Si cette balise est absente, on informe l'utilisateur
                            }
                        }
                        
                    	try{
                    		programmeDateS = programmes[j].getElementsByTagName("date")[0].textContent;

                        }
                        catch(exceptiondesc){
                            //Si cette balise est absente, on informe l'utilisateur
                        }
                        
                        
                        
                        
                        var programmeLengthS = programmes[j].getElementsByTagName("length");
                        var lenghtUnitS = programmeLengthS[0].getAttribute("units");
                        
                      //On se positionne sur la balise des prochains programmes dans le template
                        var nextProgS = templateClone.getElementById('programListTonight').firstElementChild;
                        var baliseCouranteS = null;
                        
                        var programmeStartNextS, lenghtUnitNextS, debutNextS, programmeLengthNextS;
                        
                        /* Ici, affichage des prochains programmes de la chaîne courante
                         * La variable q permet de limiter l'affichage auxx 3 prochains programmes correspondant
                         * à la chaîne.
                         * On intialise une variable j au programme suivant et qui correspondant toujours à la
                         * chaîne courante.
                         */
                        for(q = 0, p = j + 1; q < 3 && programmeId == programmes[p].getAttribute("channel"); q++, p++){
                            
                            //On se positionne sur la 1ère balise des next programmes
                            baliseCouranteS = nextProgS.firstElementChild;

                            //On attache le titre de l'émission suivante
                            baliseCouranteS.textContent = programmes[p].getElementsByTagName("title")[0].textContent;
                            
                            //Passage au voisin suivant;
                            baliseCouranteS = baliseCouranteS.nextElementSibling;
                            
                            //On essaye de charger le sous titre.
                            try{
                                baliseCouranteS.textContent = programmes[p].getElementsByTagName("sub-title")[0].textContent;
                            }
                            catch(exceptiondesc){
                                //Si la balise sous titre est absente, on met null pour ne pas bloquer l'exécution du code
                                baliseCouranteS.textContent = null;
                            }
                            
                            //Voisin suivant
                            baliseCouranteS = baliseCouranteS.nextElementSibling;
                            
                            //Formattage de la variable start pour le début de programme
                            programmeStartNextS = programmes[p].getAttribute("start");
                            debutNextS = "Le " + programmeStartNextS.substring(6,8) + "/" + 
                            programmeStartNextS.substring(4,6) + "/" + 
                            programmeStartNextS.substring(0,4) + " a " + 
                            programmeStartNextS.substring(8,10) + "h" + 
                            programmeStartNextS.substring(10,12);
                            
                            programmeLengthNextS = programmes[p].getElementsByTagName("length");
                            lenghtUnitNextS = programmeLengthNextS[0].getAttribute("units");
                            
                            //On écrit dans cette balise les informations sur l'heure de début du programme
                            baliseCouranteS.textContent = debutNextS + " (" + programmeLengthNextS[0].textContent + " " + lenghtUnitNext +")";
                            
                            //On passe à la balise "programJ" suivant
                            nextProgS = nextProgS.nextElementSibling;
                        }
                        /* Cette chaîne contient déjà la liste des prochains programmes
                         * Ceci permettra de sortir de la boucle pour passer à la chaîne suivante
                         */
                        tokenS = 1;
                     }
                    
                    /*---------------------------------------------------------------------------*/
                    
                    if(token == 1 && tokenS == 1){
                    	break outer;
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
                
                /*-------------------------------------------------------------------------*/
                
                var tmpS =  templateClone.getElementById('tonightMainProgram').firstElementChild;
                
                /* Ici, on parcourt la balise mainProgram du template cloné pour insérer chaque données. */
                
                //Insertion du titre du programme
               tmpS.textContent = programmeTitreS;
               
               //On passe au voisin suivant
               tmpS = tmpS.nextElementSibling;
                
                //Insertion du sous-titre du programme
                tmpS.textContent = programmeSousTitreS;
                
                //Voisin suivant
                tmpS = tmpS.nextElementSibling;
                    
                //Insertion de la date, l'heure de début et la durée du programme
                tmpS.textContent = debutS + " (" + programmeLengthS[0].textContent + " " + lenghtUnitS +")";
                
                //Insertion de la description du programme
                //templateClone.getElementById('mainProgram').lastElementChild.textContent = programmeDesc;
                
                var infoComplementaireS = templateClone.getElementById('info_complementaire_tonight').firstElementChild;
                // affichage de la description du programme
                var descriptionS = infoComplementaireS.nextElementSibling;
                descriptionS.textContent = programmeDescS;
                
                //affichage des participants
                var directeurS = descriptionS.nextElementSibling.nextElementSibling.nextElementSibling;
                directeurS.textContent = programmeDirecteurS;
                
                //affichage des acteurs
                var actorsS = directeurS.nextElementSibling.nextElementSibling;
                actorsS.textContent = acteursS;
                
                //affichage date de sortie du programme
                var dateSortieS = actorsS.nextElementSibling.nextElementSibling;
                dateSortieS.textContent = programmeDateS;
                
                //affichage du type du programme
                var typeS = dateSortieS.nextElementSibling.nextElementSibling;
                typeS.textContent = programmeTypeS;
                
                /*------------------------------------------------------------------------------*/
               
                
                //On rattache notre template à jour à la divB en fonction du numéro de la chaîne.
                var itemp = 'b' + i;
                var divbb = document.getElementById(itemp);
                divbb.appendChild(templateClone);
                
                //Notre divB qui contient notre template fourni est rattaché à la div générale
                var divgg = document.getElementById(i);
                divgg.appendChild(divbb);
                
                //Rattachement de la divGeneral à divParent (la div swipe-wrap)
                divParent[0].appendChild(divgg);
        }
        
       
   }    
    
 
        document.getElementById('listIcon').addEventListener("click", function(){document.getElementById('listeProgramme').style.display = "block"; document.getElementsByTagName('body')[0].style.overflowY = "hidden";}, false);
        document.getElementById('closeIcon').addEventListener("click", function(){document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = "";}, false);
  
        //Liste de sélection des chaînes
        //document.getElementById('listeProgramme').style.display = 'none';
        
        for(var i = 0; i <  document.getElementsByClassName("info_complementaire").length; i++){
             
             document.getElementsByClassName("info_complementaire")[i].addEventListener("click", function(){this.style.height = "auto";}, false);
             document.getElementsByClassName("info_complementaire")[i].addEventListener("dblclick", function(){this.style.height = "115px";}, false);
             
        }
        
        
        	
        	document.getElementById("h0").addEventListener("click", function(){mySwipe.slide(0, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	 
        	document.getElementById("h1").addEventListener("click", function(){mySwipe.slide(1, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h2").addEventListener("click", function(){mySwipe.slide(2, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h3").addEventListener("click", function(){mySwipe.slide(3, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h4").addEventListener("click", function(){mySwipe.slide(4, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h5").addEventListener("click", function(){mySwipe.slide(5, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h6").addEventListener("click", function(){mySwipe.slide(6, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h7").addEventListener("click", function(){mySwipe.slide(7, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h8").addEventListener("click", function(){mySwipe.slide(8, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h9").addEventListener("click", function(){mySwipe.slide(9, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h10").addEventListener("click", function(){mySwipe.slide(10, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h11").addEventListener("click", function(){mySwipe.slide(11, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h12").addEventListener("click", function(){mySwipe.slide(12, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h13").addEventListener("click", function(){mySwipe.slide(13, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h14").addEventListener("click", function(){mySwipe.slide(14, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h15").addEventListener("click", function(){mySwipe.slide(15, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h16").addEventListener("click", function(){mySwipe.slide(16, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false);
        	
        	document.getElementById("h17").addEventListener("click", function(){mySwipe.slide(17, 300); document.getElementById('listeProgramme').style.display = "none"; document.getElementsByTagName('body')[0].style.overflowY = ""}, false); 
        
        
        var tonightMainProgram = document.getElementsByClassName('tonightMainProgram');
        var tonightNextPrograms = document.getElementsByClassName('tonightNextPrograms');
        
        var mainProgram = document.getElementsByClassName('mainProgram');
        var nextPrograms = document.getElementsByClassName('nextPrograms');
        
        
        //listeners pour afficher les programmes du soir
            
            document.getElementsByClassName("tonight")[0].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[0].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[0].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[0].style.display = 'block';
                tonightNextPrograms[0].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[0].style.display = 'block';
                
                mainProgram[0].style.display = 'none';
                nextPrograms[0].style.display = 'none';
                document.getElementsByClassName('iconArrow')[0].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[1].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[1].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[1].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[1].style.display = 'block';
                tonightNextPrograms[1].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[1].style.display = 'block';
                
                mainProgram[1].style.display = 'none';
                nextPrograms[1].style.display = 'none';
                document.getElementsByClassName('iconArrow')[1].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[2].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[2].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[2].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[2].style.display = 'block';
                tonightNextPrograms[2].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[2].style.display = 'block';
                
                mainProgram[2].style.display = 'none';
                nextPrograms[2].style.display = 'none';
                document.getElementsByClassName('iconArrow')[2].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[3].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[3].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[3].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[3].style.display = 'block';
                tonightNextPrograms[3].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[3].style.display = 'block';
                
                mainProgram[3].style.display = 'none';
                nextPrograms[3].style.display = 'none';
                document.getElementsByClassName('iconArrow')[3].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[4].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[4].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[4].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[4].style.display = 'block';
                tonightNextPrograms[4].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[4].style.display = 'block';
                
                mainProgram[4].style.display = 'none';
                nextPrograms[4].style.display = 'none';
                document.getElementsByClassName('iconArrow')[4].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[5].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[5].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[5].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[5].style.display = 'block';
                tonightNextPrograms[5].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[5].style.display = 'block';
                
                mainProgram[5].style.display = 'none';
                nextPrograms[5].style.display = 'none';
                document.getElementsByClassName('iconArrow')[5].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[6].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[6].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[6].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[6].style.display = 'block';
                tonightNextPrograms[6].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[6].style.display = 'block';
                
                mainProgram[6].style.display = 'none';
                nextPrograms[6].style.display = 'none';
                document.getElementsByClassName('iconArrow')[6].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[7].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[7].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[7].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[7].style.display = 'block';
                tonightNextPrograms[7].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[7].style.display = 'block';
                
                mainProgram[7].style.display = 'none';
                nextPrograms[7].style.display = 'none';
                document.getElementsByClassName('iconArrow')[7].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[8].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[8].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[8].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[8].style.display = 'block';
                tonightNextPrograms[8].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[8].style.display = 'block';
                
                mainProgram[8].style.display = 'none';
                nextPrograms[8].style.display = 'none';
                document.getElementsByClassName('iconArrow')[8].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[9].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[9].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[9].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[9].style.display = 'block';
                tonightNextPrograms[9].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[9].style.display = 'block';
                
                mainProgram[9].style.display = 'none';
                nextPrograms[9].style.display = 'none';
                document.getElementsByClassName('iconArrow')[9].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[10].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[10].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[10].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[10].style.display = 'block';
                tonightNextPrograms[10].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[10].style.display = 'block';
                
                mainProgram[10].style.display = 'none';
                nextPrograms[10].style.display = 'none';
                document.getElementsByClassName('iconArrow')[10].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[11].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[11].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[11].style.display = 'block';
                tonightNextPrograms[11].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[11].style.display = 'block';
                
                mainProgram[11].style.display = 'none';
                nextPrograms[11].style.display = 'none';
                document.getElementsByClassName('iconArrow')[11].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[12].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[12].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[12].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[12].style.display = 'block';
                tonightNextPrograms[12].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[12].style.display = 'block';
                
                mainProgram[12].style.display = 'none';
                nextPrograms[12].style.display = 'none';
                document.getElementsByClassName('iconArrow')[12].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[13].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[13].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[13].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[13].style.display = 'block';
                tonightNextPrograms[13].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[13].style.display = 'block';
                
                mainProgram[13].style.display = 'none';
                nextPrograms[13].style.display = 'none';
                document.getElementsByClassName('iconArrow')[13].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[14].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[14].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[14].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[14].style.display = 'block';
                tonightNextPrograms[14].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[14].style.display = 'block';
                
                mainProgram[14].style.display = 'none';
                nextPrograms[14].style.display = 'none';
                document.getElementsByClassName('iconArrow')[14].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[15].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[15].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[15].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[15].style.display = 'block';
                tonightNextPrograms[15].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[15].style.display = 'block';
                
                mainProgram[15].style.display = 'none';
                nextPrograms[15].style.display = 'none';
                document.getElementsByClassName('iconArrow')[15].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[16].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[16].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[16].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[16].style.display = 'block';
                tonightNextPrograms[16].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[16].style.display = 'block';
                
                mainProgram[16].style.display = 'none';
                nextPrograms[16].style.display = 'none';
                document.getElementsByClassName('iconArrow')[16].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("tonight")[17].addEventListener("click", function(){
                
                document.getElementsByClassName('tonight')[17].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('now')[17].style.textShadow = "0px 0px 0px white";
                
                tonightMainProgram[17].style.display = 'block';
                tonightNextPrograms[17].style.display = 'block';
                document.getElementsByClassName('tonightIconArrow')[17].style.display = 'block';
                
                mainProgram[17].style.display = 'none';
                nextPrograms[17].style.display = 'none';
                document.getElementsByClassName('iconArrow')[17].style.display = 'none';
            }, false);
            
            
            //listeners pour afficher les programmes en cours
            
            document.getElementsByClassName("now")[0].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[0].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[0].style.textShadow = "0px 0px 0px white";
                
                mainProgram[0].style.display = 'block';
                nextPrograms[0].style.display = 'block';
                document.getElementsByClassName('iconArrow')[0].style.display = 'block';
                
                tonightMainProgram[0].style.display = 'none';
                tonightNextPrograms[0].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[0].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[1].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[1].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[1].style.textShadow = "0px 0px 0px white";
                
                mainProgram[1].style.display = 'block';
                nextPrograms[1].style.display = 'block';
                document.getElementsByClassName('iconArrow')[1].style.display = 'block';
                
                tonightMainProgram[1].style.display = 'none';
                tonightNextPrograms[1].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[1].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[2].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[2].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[2].style.textShadow = "0px 0px 0px white";
                
                mainProgram[2].style.display = 'block';
                nextPrograms[2].style.display = 'block';
                document.getElementsByClassName('iconArrow')[2].style.display = 'block';
                
                tonightMainProgram[2].style.display = 'none';
                tonightNextPrograms[2].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[2].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[3].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[3].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[3].style.textShadow = "0px 0px 0px white";
                
                mainProgram[3].style.display = 'block';
                nextPrograms[3].style.display = 'block';
                document.getElementsByClassName('iconArrow')[3].style.display = 'block';
                
                tonightMainProgram[3].style.display = 'none';
                tonightNextPrograms[3].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[3].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[4].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[4].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[4].style.textShadow = "0px 0px 0px white";
                
                mainProgram[4].style.display = 'block';
                nextPrograms[4].style.display = 'block';
                document.getElementsByClassName('iconArrow')[4].style.display = 'block';
                
                tonightMainProgram[4].style.display = 'none';
                tonightNextPrograms[4].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[4].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[5].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[5].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[5].style.textShadow = "0px 0px 0px white";
                
                mainProgram[5].style.display = 'block';
                nextPrograms[5].style.display = 'block';
                document.getElementsByClassName('iconArrow')[5].style.display = 'block';
                
                tonightMainProgram[5].style.display = 'none';
                tonightNextPrograms[5].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[5].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[6].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[6].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[6].style.textShadow = "0px 0px 0px white";
                
                mainProgram[6].style.display = 'block';
                nextPrograms[6].style.display = 'block';
                document.getElementsByClassName('iconArrow')[6].style.display = 'block';
                
                tonightMainProgram[6].style.display = 'none';
                tonightNextPrograms[6].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[6].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[7].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[7].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[7].style.textShadow = "0px 0px 0px white";
                
                mainProgram[7].style.display = 'block';
                nextPrograms[7].style.display = 'block';
                document.getElementsByClassName('iconArrow')[7].style.display = 'block';
                
                tonightMainProgram[7].style.display = 'none';
                tonightNextPrograms[7].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[7].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[8].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[8].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[8].style.textShadow = "0px 0px 0px white";
                
                mainProgram[8].style.display = 'block';
                nextPrograms[8].style.display = 'block';
                document.getElementsByClassName('iconArrow')[8].style.display = 'block';
                
                tonightMainProgram[8].style.display = 'none';
                tonightNextPrograms[8].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[8].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[9].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[9].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[9].style.textShadow = "0px 0px 0px white";
                
                mainProgram[9].style.display = 'block';
                nextPrograms[9].style.display = 'block';
                document.getElementsByClassName('iconArrow')[9].style.display = 'block';
                
                tonightMainProgram[9].style.display = 'none';
                tonightNextPrograms[9].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[9].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[10].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[10].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[10].style.textShadow = "0px 0px 0px white";
                
                mainProgram[10].style.display = 'block';
                nextPrograms[10].style.display = 'block';
                document.getElementsByClassName('iconArrow')[10].style.display = 'block';
                
                tonightMainProgram[10].style.display = 'none';
                tonightNextPrograms[10].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[10].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[11].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[11].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[11].style.textShadow = "0px 0px 0px white";
                
                mainProgram[11].style.display = 'block';
                nextPrograms[11].style.display = 'block';
                document.getElementsByClassName('iconArrow')[11].style.display = 'block';
                
                tonightMainProgram[11].style.display = 'none';
                tonightNextPrograms[11].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[11].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[12].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[12].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[12].style.textShadow = "0px 0px 0px white";
                
                mainProgram[12].style.display = 'block';
                nextPrograms[12].style.display = 'block';
                document.getElementsByClassName('iconArrow')[12].style.display = 'block';
                
                tonightMainProgram[12].style.display = 'none';
                tonightNextPrograms[12].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[12].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[13].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[13].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[13].style.textShadow = "0px 0px 0px white";
                
                mainProgram[13].style.display = 'block';
                nextPrograms[13].style.display = 'block';
                document.getElementsByClassName('iconArrow')[13].style.display = 'block';
                
                tonightMainProgram[13].style.display = 'none';
                tonightNextPrograms[13].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[13].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[14].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[14].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[14].style.textShadow = "0px 0px 0px white";
                
                mainProgram[14].style.display = 'block';
                nextPrograms[14].style.display = 'block';
                document.getElementsByClassName('iconArrow')[14].style.display = 'block';
                
                tonightMainProgram[14].style.display = 'none';
                tonightNextPrograms[14].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[14].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[15].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[15].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[15].style.textShadow = "0px 0px 0px white";
                
                mainProgram[15].style.display = 'block';
                nextPrograms[15].style.display = 'block';
                document.getElementsByClassName('iconArrow')[15].style.display = 'block';
                
                tonightMainProgram[15].style.display = 'none';
                tonightNextPrograms[15].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[15].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[16].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[16].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[16].style.textShadow = "0px 0px 0px white";
                
                mainProgram[16].style.display = 'block';
                nextPrograms[16].style.display = 'block';
                document.getElementsByClassName('iconArrow')[16].style.display = 'block';
                
                tonightMainProgram[16].style.display = 'none';
                tonightNextPrograms[16].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[16].style.display = 'none';
            }, false);
            
            document.getElementsByClassName("now")[17].addEventListener("click", function(){
                
                document.getElementsByClassName('now')[17].style.textShadow = "0px 0px 10px white";
                document.getElementsByClassName('tonight')[17].style.textShadow = "0px 0px 0px white";
                
                mainProgram[17].style.display = 'block';
                nextPrograms[17].style.display = 'block';
                document.getElementsByClassName('iconArrow')[17].style.display = 'block';
                
                tonightMainProgram[17].style.display = 'none';
                tonightNextPrograms[17].style.display = 'none';
                document.getElementsByClassName('tonightIconArrow')[17].style.display = 'none';
            }, false);
            
            
            
            

        
        document.getElementById('splashScreen').style.display = 'none';
        
        //appTitle.addEventListener("click", mySwipe.slide(16, 300), false);
        
        //mySwipe.slide(4, 300);
        
        

    }

   xhr.send();