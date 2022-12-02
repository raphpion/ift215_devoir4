async function chargerpayer() {

}

function displayCredit() {
    //Afficher les bons éléments pour la carte de crédit
    
    $('#paypal').css('display', 'none');
    $('#credit').css('display', 'block');
}

function displayPaypal() {
    //Afficher les bons éléments pour le paypal

    $('#paypal').css('display', 'block');
    $('#credit').css('display', 'none');
}

function placerCommande() {
    let ID_CLIENT = 1;
    let TOKEN_CLIENT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k';

    document.getElementById('name').value = "";
    document.getElementById('adresseCourriel').value = "";
    document.getElementById('adressePostale').value = "";
    document.getElementById('pays').value = "";
    document.getElementById('codePostal').value = "";
    document.getElementById('numeroCarte').value = "";
    document.getElementById('mois').value = "";
    document.getElementById('annee').value = "";

    $.ajax({
        url: '/',
        method: 'POST',
        data: { idClient: ID_CLIENT},
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + TOKEN_CLIENT);
        },
        success: function (result) {
            window.location.replace("#/confirmation");
        },
    });
}