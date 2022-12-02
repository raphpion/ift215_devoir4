/**
 * Il se peut qu'on manque l'événement de window hashchange, alors on met aussi notre appel sur DOMContentLoaded
 */
document.addEventListener(
  'DOMContentLoaded',
  function () {
    hashHandler();
    remplirNavigation();
  },
  false
);

/**
 * Fonction qui va afficher les éléments propres à la session dans la barre de navigation.
 */
function remplirNavigation() {
  const session = SessionManager.getSession();
  if (session) {
    $('#nav-auth').html(`<li class="nav-item">
      <button id="btn-logout" class="btn btn-outline-danger" onClick="gererDeconnexion()">Déconnexion</button>
    </li>
  `);
  } else {
    $('#nav-auth').html(`<li class="nav-item">
      <a class="btn btn-outline-primary" href="#/inscription">Inscription</a>
    </li>
    <li class="nav-item">
      <a class="btn btn-success" href="#/connexion">Connexion</a>
    </li>`);
  }
}

/**
 * Fonction chargée de déconnecter un utilisateur de sa session courante.
 */
function gererDeconnexion() {
  const session = SessionManager.getSession();
  if (!session) return;

  $.ajax({
    url: `/connexion/${session.idClient}`,
    type: 'delete',
    success: response => {
      console.log(response);
    },
  });

  SessionManager.clearSession();
  remplirNavigation();
}

/**
 * Fonction qui va provoquer l'appel de la fonction racine du script propre à la page qui vient d'être chargée.
 */
function chargerSousContenu() {
  let nom = 'charger' + location.hash.replace('#/', '');
  nom = nom.split('?')[0];

  if (!window[nom]) return;
  window[nom]();
}

/**
 * Fonction que remplace le contenu intérieur de la balise ayant pour id @idElement par le contenu de @contenu.
 * @param idElement ID de la balise dont on veut remplacer le contenu.
 * @param contenu Contenu qui va remplacer l'ancient.
 */
function remplacerContenu(idElement, contenu) {
  let wrapper = document.getElementById(idElement);
  wrapper.innerHTML = contenu;
  chargerSousContenu();
}

/**
 * Fonction pour gérer la navigation entre les pages. Vous ne devriez pas avoir besoin de la modifier
 * @returns {Promise<void>} Ne retourne rien
 */
async function hashHandler() {
  //La page voulu apparaitra dans le hash (ce qui suit le # dans la barre d'adresse
  let hash = location.hash;

  if (!hash.includes('/')) {
    return;
  }
  //On crée le lien vers le contenu qu'on veut charger
  let addr = '/html' + hash.replace('#', '');
  try {
    //On récupère la page sur le serveur
    let reponse = await fetch(addr);
    //C'est asynchrone, alors on doit attendre que la page arrive. Puis on va la placer au coeur de l'affichage
    if (reponse.ok) {
      contenu = await reponse.text();
      remplacerContenu('corps-principal', contenu);
    }
  } catch (erreur) {
    console.log(erreur.message);
  }
}

//La navigation se fait en utilisant les hash. Il faut donc surveiller l'événement qui dit que le hash a changé.
window.addEventListener('hashchange', hashHandler, false);
