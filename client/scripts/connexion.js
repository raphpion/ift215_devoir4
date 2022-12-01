const pageConnexion = {
  // DOM Elements

  loginForm: null,
  alerts: null,
  submitBtn: null,
  emailInput: null,
  passwordInput: null,

  // Methods

  /**
   * Helper that replaces the login form's button content to an animated spinner.
   */
  setLoading() {
    pageConnexion.submitBtn.disabled = true;
    pageConnexion.submitBtn.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;
  },

  /**
   * Helper that replaces the login form's button content to static text.
   */
  setNotLoading() {
    pageConnexion.submitBtn.disabled = false;
    pageConnexion.submitBtn.innerHTML = 'Soumettre';
  },

  /**
   * Helper that replaces the login form's button content to a checkmark.
   */
  setCompleted() {
    pageConnexion.submitBtn.classList.remove('btn-primary');
    pageConnexion.submitBtn.classList.add('btn-success');
    pageConnexion.submitBtn.innerHTML = '<i class="bi bi-check-circle"></i>';
  },

  /**
   * Helper that appends an error message to the bottom of the form.
   *
   * @param {string} message The error message that will be added as an alert to the form.
   */
  addErrorMessage(message) {
    pageConnexion.alerts.innerHTML += `<div class="alert alert-danger alert-dismissible fade show" role="alert">
      <strong>${message}</strong>
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  },

  /**
   * Helper that appends a success message to the bottom of the form.
   *
   * @param {string} message The success message that will be added as an alert to the form.
   * @param {{ url: string, text: string } | undefined} link A link to add to the success message.
   */
  addSuccessMessage(message, link) {
    pageConnexion.alerts.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>${message}</strong>
      ${link != undefined ? `<a href="${link.url}">${link.text}</a>` : ``}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  },

  /**
   * Handler that manages actions related to submitting the login form.
   *
   * @param {SubmitEvent} event The form submit event, mostly used for preventing the default actions.
   */
  handleLogin(event) {
    event.preventDefault();
    pageConnexion.setLoading();

    const data = {
      courriel: pageConnexion.emailInput.value,
      mdp: pageConnexion.passwordInput.value,
    };

    $.ajax({
      url: '/connexion',
      type: 'post',
      data,
      error: (xhr, ajaxOptions, thrownError) => {
        pageConnexion.setNotLoading();
        pageConnexion.addErrorMessage(xhr.responseText);
      },
      success: result => {
        console.log(result);

        pageConnexion.setCompleted();

        pageConnexion.emailInput.disabled = true;
        pageConnexion.passwordInput.disabled = true;

        pageConnexion.addSuccessMessage('Vous avez été connecté avec succès !');

        SessionManager.setSession(result.idClient, result.token, result.role);

        window.location.reload();
      },
    });
  },
};

/**
 * Fonction qui initie le lancement des fonctions de ce script. Appelée par "chargerSousContenu" dans navigation.js.
 * Remplace le DOMContentLoaded qui est lancé bien avant que le contenu associé à ce script ne soit dans l'écran.
 * @returns {Promise<void>}
 */
async function chargerconnexion() {
  if (SessionManager.getSession()) window.location.replace('#/');

  pageConnexion.loginForm = document.getElementById('formulaire-connexion');
  pageConnexion.alerts = document.getElementById('formulaire-connexion__alertes');
  pageConnexion.submitBtn = document.querySelector('#formulaire-connexion .submit-connexion');

  pageConnexion.emailInput = document.getElementById('courriel');
  pageConnexion.passwordInput = document.getElementById('mot-de-passe');

  pageConnexion.loginForm.addEventListener('submit', pageConnexion.handleLogin);
}
