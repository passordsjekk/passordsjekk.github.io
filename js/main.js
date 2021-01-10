var passwordInput = document.getElementById("password-box")
var passwordPlain = '';
var lastPassChecked = '';

window.setInterval(function(){ 
  passwordPlain = passwordInput.value;

  if (lastPassChecked !== passwordPlain) {
    if (passwordPlain !== '') {
      var sha1pass = SHA1(passwordPlain);
      sha1pass = sha1pass.toUpperCase();

      var subsha1pass = sha1pass.substring(5);
      var xhttp = new XMLHttpRequest();

      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          if (this.responseText.indexOf(subsha1pass) !== -1) {

            // Find number of occurences
            var matches = this.responseText.split('\n');
            for(var i = 0;i < matches.length;i++){
                if(matches[i].indexOf(subsha1pass) !== -1) {
                    var occurences = matches[i].split(":")[1];
                }
            }

            // Present user with message - password matched
            PresentCompromised(true, occurences);
          } else {
            // Password not matched
            PresentCompromised(false, occurences);
          }
        } else {
          if (this.status == 404) {
            // No match
            PresentCompromised(false, occurences);
          }
        }
      };

      xhttp.open('GET', 'https://api.pwnedpasswords.com/range/' + sha1pass.substring(0, 5));
      xhttp.send();
    }

    lastPassChecked = passwordPlain;
  }

}, 2500);

function PasswordModified() {
  var modifiedPassword = passwordInput.value;
  if (modifiedPassword !== passwordPlain && modifiedPassword != "") {
    document.getElementById("compromised").innerHTML = '<br/><h2>Sjekker mot lekkasjedatabaser...</h2>';
  }

  if (modifiedPassword == "" || modifiedPassword == " ") {
    document.getElementById("compromised").innerHTML = '<br/>Passordet forlater ikke nettleseren din. <a href="faq">Les mer</a>.';
  }
}

function GetBreachCount()
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", "https://haveibeenpwned.com/api/v2/breaches", false); // Synchronous
    xmlHttp.send(null);
    var response = JSON.parse(xmlHttp.responseText);
    var count = response.length;
    return count;
}

function PresentCompromised(compromised, occurences) {
    if(compromised == true) {
        document.getElementById("compromised").innerHTML = '<br/><h3>Passordet ble funnet ' + occurences + ' gang(er).</h3><br/><h3>Hvis dette er et passord du bruker i dag bør du endre det alle steder det er i bruk.</h3><br/><h3><a href="faq">Klikk her for mer informasjon.</a></h3></font>';
    } else {
        document.getElementById("compromised").innerHTML = '<br/><h2>Det ser ikke ut til at dette passordet har blitt lekket.</h2>';
    }
}