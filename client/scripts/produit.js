let ID_CLIENT = 1;
let TOKEN_CLIENT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k';

$(function () {
  console.log('ift215');
});

function chargerproduit() {
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

function item_to_html(item) {
  item_card = $('<div></div>').addClass('card mb-4 rounded-3 shadow-sm');
  item_head = $('<div></div>')
    .addClass('card-header py-3')
    .append('<h4 class="my-0 fw-normal">' + item.nom + '</h4>');
  item_detail = $('<ul></ul>')
    .addClass('list-unstyled mt-3 mb-4')
    .append('<li id="quantite">Quantite : ' + item.qte_inventaire + '</li>')
    .append('<li id="categorie">Categorie : ' + item.categorie.nom + '</li>')
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
    );
  item_card.append(item_head).append(item_body).append(item_detail).append(item_footer);
  return $('<div></div>').addClass('col-md-3').append(item_card);
}

function add_item(id_item) {
  $.ajax({
    url: '/clients/' + ID_CLIENT + '/panier',
    method: 'POST',
    data: { idProduit: id_item, quantite: 1 },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + TOKEN_CLIENT);
    },
    success: function (result) {
      $('#item_counter').text(result.items.length);
    },
  });
}

function chargerpanier() {
  $.ajax({
    url: '/clients/' + ID_CLIENT + '/panier',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + TOKEN_CLIENT);
    },
    success: function (result) {
      console.log(result);
      $.each(result.items, function (key, value) {
        item = panier_to_html(value);
        $('#list_panier').append(item);
      });
      $('#total').append('<b>Total: ' + result.valeur.toFixed(2) + '</b>');
    },
  });
}

function panier_to_html(item) {
  item_panier = $('<div></div>')
    .addClass('row')
    .append('<div class="col">' + item.nomProduit + '</div>')
    .append('<div class="col">' + item.prix + '</div>')
    .append('<div class="col">' + item.quantite + '</div')
    .append('<div class="col">' + (item.prix * item.quantite).toFixed(2) + '</div>');
  return item_panier.append('<hr>');
}
