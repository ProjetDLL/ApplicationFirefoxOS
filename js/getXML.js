var xhr = new XMLHttpRequest({mozSystem: true});
			xhr.open("GET", "http://xmltv.dtdns.net/alacarte/ddl?fichier=/xmltv_site/xmlPerso/indianboy.xml", true);
			xhr.onreadystatechange = function() {
			  if (xhr.readyState == 4) {
				$("#log").html(xhr.responseText);
			  }
			}
			xhr.send();
