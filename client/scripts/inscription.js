/**
 * Fonction qui initie le lancement des fonctions de ce script. Appelée par "chargerSousContenu" dans navigation.js.
 * Remplace le DOMContentLoaded qui est lancé bien avant que le contenu associé à ce script ne soit dans l'écran.
 * @returns {Promise<void>}
 */
async function chargerinscription() {
  if (SessionManager.getSession()) window.location.replace('#/');
  $('#formulaire-inscription').submit(gererInscription);
}

/**
 * Fonction qui gère l'inscription à la soumission du formulaire.
 * @param {SubmitEvent} event
 */
function gererInscription(event) {
  event.preventDefault();

  $('#formulaire-inscription .submit')
    .prop('disabled', true)
    .html('<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');

  $.ajax({
    url: '/clients',
    type: 'post',
    data: {
      prenom: $('#prenom').val(),
      nom: $('#nom').val(),
      age: $('#age').val(),
      adresse: $('#adresse').val(),
      pays: $('#pays').val(),
      courriel: $('#courriel').val(),
      mdp: $('#mot-de-passe').val(),
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#formulaire-inscription .submit').prop('disabled', false).html('Soumettre');
      $('#formulaire-inscription .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>${xhr.responseText}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `);
    },
    success: result => {
      $('#formulaire-inscription .submit')
        .prop('disabled', false)
        .addClass('btn-success')
        .removeClass('btn-primary')
        .html('<i class="bi bi-check-circle"></i>');

      $('#prenom').prop('disabled', true);
      $('#nom').prop('disabled', true);
      $('#age').prop('disabled', true);
      $('#adresse').prop('disabled', true);
      $('#pays').prop('disabled', true);
      $('#courriel').prop('disabled', true);
      $('#mot-de-passe').prop('disabled', true);

      $('#formulaire-inscription .alertes').append(`<div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Votre compte a été créé avec succès !</strong>
          <a href="#/connexion">Aller à la page de connexion</a>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
    },
  });
}
