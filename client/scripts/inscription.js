const pageInscription = {
  // DOM elements

  registerForm: null,
  alerts: null,
  submitBtn: null,
  firstNameInput: null,
  lastNameInput: null,
  ageInput: null,
  addressInput: null,
  countryInput: null,
  emailInput: null,
  passwordInput: null,

  // Methods

  /**
   * Helper that replaces the register form's button content to an animated spinner.
   */
  setLoading() {
    pageInscription.submitBtn.disabled = true;
    pageInscription.submitBtn.innerHTML = `<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>`;
  },

  /**
   * Helper that replaces the register form's button content to static text.
   */
  setNotLoading() {
    pageInscription.submitBtn.disabled = false;
    pageInscription.submitBtn.innerHTML = 'Soumettre';
  },

  /**
   * Helper that replaces the register form's button content to a checkmark.
   */
  setCompleted() {
    pageInscription.submitBtn.disabled = false;
    pageInscription.submitBtn.classList.remove('btn-primary');
    pageInscription.submitBtn.classList.add('btn-success');
    pageInscription.submitBtn.innerHTML = '<i class="bi bi-check-circle"></i>';
  },

  /**
   * Helper that appends an error message to the bottom of the form.
   *
   * @param {string} message The error message that will be added as an alert to the form.
   */
  addErrorMessage(message) {
    pageInscription.alerts.innerHTML += `<div class="alert alert-danger alert-dismissible fade show" role="alert">
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
    pageInscription.alerts.innerHTML += `<div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>${message}</strong>
      ${link && `<a href="${link.url}">${link.text}</a>`}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  },

  /**
   * Handler that manages actions related to submitting the register form.
   *
   * @param {SubmitEvent} event The form submit event, mostly used for preventing the default actions.
   */
  handleRegister(event) {
    event.preventDefault();
    pageInscription.setLoading();

    const data = {
      prenom: pageInscription.firstNameInput.value,
      nom: pageInscription.lastNameInput.value,
      age: pageInscription.ageInput.value,
      adresse: pageInscription.addressInput.value,
      pays: pageInscription.countryInput.value,
      courriel: pageInscription.emailInput.value,
      mdp: pageInscription.passwordInput.value,
    };

    $.ajax({
      url: '/clients',
      type: 'post',
      data,
      error: (xhr, ajaxOptions, thrownError) => {
        pageInscription.setNotLoading();
        pageInscription.addErrorMessage(xhr.responseText);
      },
      success: result => {
        pageInscription.setCompleted();

        pageInscription.firstNameInput.disabled = true;
        pageInscription.lastNameInput.disabled = true;
        pageInscription.ageInput.disabled = true;
        pageInscription.addressInput.disabled = true;
        pageInscription.countryInput.disabled = true;
        pageInscription.emailInput.disabled = true;
        pageInscription.passwordInput.disabled = true;

        pageInscription.addSuccessMessage('Votre compte a été créé avec succès !', { url: '#/connexion', text: 'Aller à la page de connexion' });
      },
    });
  },
};

/**
 * Fonction qui initie le lancement des fonctions de ce script. Appelée par "chargerSousContenu" dans navigation.js.
 * Remplace le DOMContentLoaded qui est lancé bien avant que le contenu associé à ce script ne soit dans l'écran.
 * @returns {Promise<void>}
 */
async function chargerinscription() {
  if (SessionManager.getSession()) window.location.replace('#/');

  pageInscription.registerForm = document.getElementById('formulaire-inscription');
  pageInscription.alerts = document.getElementById('formulaire-inscription__alertes');
  pageInscription.submitBtn = document.querySelector('#formulaire-inscription .submit-inscription');

  pageInscription.firstNameInput = document.getElementById('prenom');
  pageInscription.lastNameInput = document.getElementById('nom');
  pageInscription.ageInput = document.getElementById('age');
  pageInscription.addressInput = document.getElementById('adresse');
  pageInscription.countryInput = document.getElementById('pays');
  pageInscription.emailInput = document.getElementById('courriel');
  pageInscription.passwordInput = document.getElementById('mot-de-passe');

  pageInscription.registerForm.addEventListener('submit', pageInscription.handleRegister);
}
