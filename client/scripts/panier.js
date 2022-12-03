/**
 * Fonction qui initie le lancement des fonctions de ce script. Appelée par "chargerSousContenu" dans navigation.js.
 * Remplace le DOMContentLoaded qui est lancé bien avant que le contenu associé à ce script ne soit dans l'écran.
 * @returns {Promise<void>}
 */
function chargerpanier() {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/');

  $.ajax({
    url: '/clients/' + session.idClient + '/panier',
    method: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    success: function (result) {
      // $('#body_table').empty();

      if (result.items.length == 0) {
        $('#panier-inner').html(`<h4>Il semblerait que votre panier soit vide.</h4>`);
        return;
      }

      $('#panier-inner').html(`<div class="row" id="liste_panier">
        <i className="bi bi-trash"></i>
        <table class="table table-panier" id="table_panier">
          <thead>
            <tr>
              <th>Nom de l'article</th>
              <th>Prix à l'unité</th>
              <th>Quantité</th>
              <th class="centrer">Total</th>
              <th></th>
            </tr>
          </thead>
    
          <tbody id="body_table"></tbody>
        </table>
      </div>
      <div>
        <h2 class="prixTot" id="prixTOT"></h2>
      </div>
      <div class="buttonConfirmation">
        <a class="btn btn-primary" id="buttonConfirmer" href="#/confirmationcommande">Confirmer la commande</a>
      </div>`);

      $.each(result.items, function (key, value) {
        item = panier_item_to_html(value);
        $('#body_table').append(item);
        chargerTotal();
      });
    },
  });
}

/**
 * Transforme un Produit en HTML.
 * @param {Produit} item Le produit à transformer
 * @returns {string}
 */
function panier_item_to_html(item) {
  nom = $('<td></td>').append(item.nomProduit);
  prix = $('<td></td>').append(item.prix);
  qte = $(
    `<td> <div class="row">
    <button class="btn btn-primary qty-button" id="bouton_panier" onclick="enleverItem(` +
      item.id +
      `)"><i class="bi bi-dash-lg"></i></button>             
    <p class="col center">` +
      item.quantite +
      `</p>
    <button class="btn btn-primary qty-button" id="bouton_panier" onclick="ajouterItem(` +
      item.id +
      `)"><i class="bi bi-plus-lg"></i></button>
    </div> </td>`
  );
  total = $('<td class="centrer fixer"></td>').append(Math.round(item.quantite * item.prix * 100) / 100);
  trash = $('<td class="onSide"></td>').append(
    '<button type="button" class="btn btn-danger" onClick="remove_item([' +
      item.id +
      '])">Retirer <span class="bi bi-trash" aria-hidden="true"></span></button>'
  );

  return $('<tr></tr>').append(nom).append(prix).append(qte).append(total).append(trash);
}

function set_panier() {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/');

  $.ajax({
    url: '/clients/' + session.idClient + '/panier',
    method: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    success: function (result) {
      $('#item_counter').text(result.items.length);
      $('#nav_item_counter').text(result.items.length);
    },
  });
}

function remove_item(item) {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/');

  let id_item = item[0];

  $.ajax({
    url: '/clients/' + session.idClient + '/panier/' + id_item,
    method: 'DELETE',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#panier .alertes').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>${xhr.responseText}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`);
    },
    success: function (result) {
      $('#panier .alertes').html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>L'article a bien été retiré !</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`);
      chargerpanier();
    },
  });
}

function ajouterItem(item) {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/');

  $.ajax({
    url: '/clients/' + session.idClient + '/panier/' + item,
    method: 'PUT',
    data: { quantite: 1 },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#panier .alertes').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
        <strong>${xhr.responseText}</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`);
    },
    success: function (result) {
      $('#panier .alertes').html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
        <strong>Quantité mise à jour !</strong>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`);
      chargerpanier();
    },
  });
}

function isItemLeft(item) {
  prod = recupereProduit(item);
  return prod.qte_inventaire > 0;
}

function enleverItem(item) {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/');

  getItem(item).then(function (result) {
    if (result.quantite > 1) {
      $.ajax({
        url: '/clients/' + session.idClient + '/panier/' + item,
        method: 'PUT',
        data: { quantite: -1 },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
        },
        error: (xhr, ajaxOptions, thrownError) => {
          $('#panier .alertes').html(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>${xhr.responseText}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          `);
        },
        success: function () {
          $('#panier .alertes').html(`<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>Quantité mise à jour !</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`);
          chargerpanier();
        },
      });
    }
  });
}

function getItem(idItem) {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/');

  return new Promise(function (resolve) {
    $.ajax({
      url: '/clients/' + session.idClient + '/panier/' + idItem,
      method: 'GET',
      beforeSend: function (xhr) {
        xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
      },
      success: function (result) {
        resolve(result);
      },
    });
  });
}

function chargerTotal() {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/');

  $.ajax({
    url: '/clients/' + session.idClient + '/panier',
    method: 'GET',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    success: function (result) {
      $('#prixTOT').text('Total de la commande : ' + Math.round(result.valeur * 100) / 100 + ' $');
      // $('#buttonConfirmer').text('Confirmer la commande');
      for (let i in result.items) {
        item = item_to_html(result.items[i]);
        $('#list_panier').append(item);
      }
    },
  });
}

function confirmation() {
  window.location.replace('#/confirmationcommande');
}
