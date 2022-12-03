/**
 * Seems deprecated...
 * @deprecated
 */
function chargerproduits() {
  let urlToCall = '/produits';
  let text = $('#search_produit').val();
  if (text) {
    urlToCall = '/produits?nom=' + text;
  }
  $('#list_items').empty();
  $.ajax({
    url: urlToCall,
    success: function (result) {
      if (result.length == 0) {
        $('#list_items').append('<h4 class="text-center">Aucun résultat trouvé</h4>');
      } else {
        $.each(result, function (key, value) {
          item = item_to_html(value);
          $('#list_items').append(item);
        });
      }
      set_panier();
    },
  });
}

/**
 * @returns {number | boolean} The product ID, or false.
 */
function getIdProduit() {
  const params = window.location.hash.split('?')[1];
  if (!params) return false;

  const paramsArray = params.split('&');
  const idParam = paramsArray.find(param => param.includes('id='));
  if (!idParam.length) return false;

  const idValue = parseInt(idParam.replace('id=', ''));
  return idValue;
}
//todo gestion derreur

function chargerproduit() {
  const idProduit = getIdProduit();

  if (idProduit !== false) {
    console.log('afficher le produit');
    $.ajax({
      url: `/produits/${idProduit}`,
      success: function (result) {
        console.log(result);

        item = inner_item(result);
        dummy = item_to_html(result);
        $('#list_items').append(item);
      },
    });
  } else {
    console.log('afficher tous les produits');
    $.ajax({
      url: '/produits',
      success: function (result) {
        console.log(result);
        $.each(result, function (key, value) {
          item = item_to_html(value);
          $('#list_items').append(item);
        });
      },
    });
  }
}

//Ajouter counter au panier
function ajouterTotalItem(item) {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;

  if (value == 0) return;

  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/connexion');

  $('#submit-qty').prop('disabled', true).html('<div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>');

  $.ajax({
    url: `/clients/${session.idClient}/panier`,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', `Basic ${session.token}`);
    },
    success: result => {
      const produitCourant = result.items.find(item_temp => item_temp.idProduit === item);
      console.log(produitCourant);

      if (!produitCourant) {
        add_item(item, value);
        $('#submit-qty').prop('disabled', false).html('Ajouter au panier');
        return;
      }

      // modifier la quantité si l'item est déjà dans le panier
      $.ajax({
        url: '/clients/' + session.idClient + '/panier/' + item,
        method: 'PUT',
        data: { quantite: value },
        beforeSend: function (xhr) {
          xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
        },
        error: function (xhr) {
          $('#produit .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
            <strong>${xhr.responseText}</strong>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>
          `);
          $('#submit-qty').prop('disabled', false).html('Ajouter au panier');
        },
        success: function (result) {
          $('#produit .alertes').append(`<div class="alert alert-success alert-dismissible fade show" role="alert">
            <strong>${value} produit${value > 1 ? 's' : ''} ajouté${value > 1 ? 's' : ''} au panier !</strong>
            <a href="#/panier">Aller au panier</a>
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
          </div>`);
          $('#submit-qty').prop('disabled', false).html('Ajouter au panier');
          $('#item_counter').text(result.items.length);
        },
      });
    },
  });
}

//incrementer le counter d'un produit singulier avec +
function incrementValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  value++;
  document.getElementById('number').value = value;
}

//Desincrementer le counter d'un produit singulier avec -
function deIncrementValue() {
  var value = parseInt(document.getElementById('number').value, 10);
  value = isNaN(value) ? 0 : value;
  if (value > 0) value--;
  document.getElementById('number').value = value;
}

//Process et affichage d'un produit singulier
function inner_item(item) {
  item_panier = $('<div></div>')
    .addClass('row')
    .append('<div class="col">' + '<img alt class="mb-3" src="../images/dumdum.png" > ' + '<h4> Description </h4>' + item.description + '</div>')

    .append(
      '<div class="col">' +
        '<h3>' +
        item.nom +
        '</h3>' +
        '<h3>' +
        item.prix +
        '$</h3>' +
        '<p><strong>Quantité</strong></p> ' +
        '<div class="boutons mb-3">' +
        '<div><input type="button" onclick="deIncrementValue()" value="-" /></div>' +
        '<div><input type="number" id="number" value="0" min="0" /></div>' +
        '<div><input type="button" onclick="incrementValue()" value="+" /></div>' +
        '</div>' +
        `<a id="submit-qty" class="btn btn-primary" onclick="ajouterTotalItem(` +
        item.id +
        `)">Ajouter au panier</a>` +
        '</div>'
    );

  return item_panier.append();
}

function item_to_html(item) {
  item_card = $('<div></div>').addClass('card mb-4 rounded-3 shadow-sm');
  item_head = $('<div></div>')
    .addClass('card-header py-3')
    .append('<h4 class="my-0 fw-normal">' + item.nom + '</h4>');
  item_detail = $('<ul></ul>')
    .addClass('list-unstyled mt-3 mb-4')
    .append('<li id="quantite">Quantite : ' + item.qte_inventaire + '</li>')
    .append('<li id="categorie">Categorie : ' + item.nom + '</li>')
    .append('<li id="description">Description : ' + item.description + '</li>');
  item_body = $('<div></div>')
    .addClass('card-body')
    .append(' <h1 class="card-title text-center"> $' + item.prix + '</h1>');
  item_footer = $('<p></p>')
    .addClass('w-100 display-6 text-center')
    .append(
      '<button type="button" class="btn btn-primary position-relative" onclick="add_item(' +
        item.id +
        ')">' +
        ' <i class="bi bi-cart-plus"></i> </button>'
    )
    .append(`<a class="btn btn-warning" href="#/produit?id=${item.id}">En savoir plus</a>`);
  item_card.append(item_head).append(item_body).append(item_detail).append(item_footer);
  return $('<div></div>').addClass('col-md-3').append(item_card);
}

function add_item(id_item, value = 1) {
  const session = SessionManager.getSession();
  if (!session) window.location.replace('#/connexion');

  $.ajax({
    url: '/clients/' + session.idClient + '/panier',
    method: 'POST',
    data: { idProduit: id_item, quantite: value },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    error: () => {
      $('#produit .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Erreur !</strong> Nous n'avons pas pu ajouter le produit à votre panier. Veuillez réessayer plus tard.
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `);
    },
    success: function (result) {
      $('#produit .alertes').append(`<div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>${value} produit${value > 1 ? 's' : ''} ajouté${value > 1 ? 's' : ''} au panier !</strong>
          <a href="#/panier">Aller au panier</a>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
      $('#item_counter').text(result.items.length);
    },
  });
}
