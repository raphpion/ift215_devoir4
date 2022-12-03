async function chargerpayer() {
  if (!SessionManager.getSession()) window.location.replace('#/');
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
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/connexion');

  document.getElementById('name').value = '';
  document.getElementById('adresseCourriel').value = '';
  document.getElementById('adressePostale').value = '';
  document.getElementById('pays').value = '';
  document.getElementById('codePostal').value = '';
  document.getElementById('numeroCarte').value = '';
  document.getElementById('mois').value = '';
  document.getElementById('annee').value = '';

  $('#vente-submit').prop('disabled', true).html('<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');

  $.ajax({
    url: '/ventes',
    method: 'POST',
    data: { idClient: session.idClient },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#payer .submit').prop('disabled', false).html('Soumettre');

      $('#payer .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>${xhr.responseText}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`);
    },
    success: function (result) {
      $('#payer .submit').removeClass('btn-primary').addClass('btn-success').html('<i class="bi bi-check-circle"></i>');

      $('#payer .alertes').append(`<div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Votre commande a été placée avec succès !</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`);
      window.location.replace('#/confirmation');
    },
  });
}
