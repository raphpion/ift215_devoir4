/**
 * Fonction qui initie le lancement des fonctions de ce script. Appelée par "chargerSousContenu" dans navigation.js.
 * Remplace le DOMContentLoaded qui est lancé bien avant que le contenu associé à ce script ne soit dans l'écran.
 * @returns {Promise<void>}
 */
async function chargerconnexion() {
  if (SessionManager.getSession()) window.location.replace('#/');
  $('#formulaire-connexion').submit(gererConnexion);
}

/**
 * Fonction qui gère la connexion à la soumission du formulaire.
 * @param {SubmitEvent} event
 */
function gererConnexion(event) {
  event.preventDefault();

  $('#formulaire-connexion .submit')
    .prop('disabled', true)
    .html('<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');

  $.ajax({
    url: '/connexion',
    method: 'post',
    data: {
      courriel: $('#courriel').val(),
      mdp: $('#mot-de-passe').val(),
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#formulaire-connexion .submit').prop('disabled', false).html('Soumettre');

      $('#formulaire-connexion .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>${xhr.responseText}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`);
    },
    success: result => {
      $('#formulaire-connexion .submit').removeClass('btn-primary').addClass('btn-success').html('<i class="bi bi-check-circle"></i>');

      $('#formulaire-connexion .alertes').append(`<div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Vous avez été connecté avec succès !</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`);

      SessionManager.setSession(result.idClient, result.token, result.role);

      window.location.reload();
    },
  });
}
