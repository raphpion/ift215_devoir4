/**
 * @returns {number | boolean} The product ID, or false.
 */


function getIdProduit() {
  const params = window.location.hash.split("?")[1];
  if (!params) return false;

  const paramsArray = params.split("&");
  const idParam = paramsArray.find((param) => param.includes("id="));
  if (!idParam.length) return false;

  const idValue = parseInt(idParam.replace("id=", ""));
  return idValue;
}
//todo gestion derreur
function chargerproduit() {
  const idProduit = getIdProduit();

  if (idProduit) {
    console.log("afficher le produit");
    $.ajax({
      url: `/produits/${idProduit}`,
      success: function (result) {
        console.log(result);
        item = inner_item(result);
        $("#list_items").append(item);
        $(".caca").append(`
        <div class="container mb-6 ma-classe-speciale-je-suis-special">
          <p>asdasdasd</p>
        </div>`
        );
      },
    });
  } else {
    console.log("afficher tous les produits");
    $.ajax({
      url: "/produits",
      success: function (result) {
        console.log(result);
        $.each(result, function (key, value) {
          item = item_to_html(value);
          $("#list_items").append(item);
        });
      },
    });
  }
}

function incrementValue(e) {
  e.preventDefault();
  var fieldName = $(e.target).data('field');
  var parent = $(e.target).closest('div');
  var currentVal = parseInt(parent.find('input[name=' + fieldName + ']').val(), 10);

  if (!isNaN(currentVal)) {
      parent.find('input[name=' + fieldName + ']').val(currentVal + 1);
  } else {
      parent.find('input[name=' + fieldName + ']').val(0);
  }
}


function inner_item(item) {
  var quantity = 0;
  item_panier = $("<div></div>")
    .addClass("row")
    .append('<div class="col">' + '<img alt class="" src="../images/dumdum.png" > '+ '<h4> Description </h4>' + item.description + "</div>")

    .append('<div class="col">' + '<h3>' + item.nom + '</h3>' + '<h3>' + item.prix +  '$</h3>' +  '<h4> Quantité'+  + '</h4>' +
    '<input type="button" value="-" class="button-minus border rounded-circle  icon-shape icon-sm mx-1 " data-field="quantity"></input>' +
    '<input type="number" step="1" max="10" value="1" name="quantity" class="quantity-field border-0 text-center w-25"></input> ' +
    '<input type="button" value="+" class="button-plus border rounded-circle icon-shape icon-sm " data-field="quantity"></input>' +
    
    "</div>"
    );

  return item_panier.append();
}

function item_to_html(item) {
  item_card = $("<div></div>").addClass("card mb-4 rounded-3 shadow-sm");
  item_head = $("<div></div>")
    .addClass("card-header py-3")
    .append('<h4 class="my-0 fw-normal">' + item.nom + "</h4>");
  item_detail = $("<ul></ul>")
    .addClass("list-unstyled mt-3 mb-4")
    .append('<li id="quantite">Quantite : ' + item.qte_inventaire + "</li>")
    .append('<li id="categorie">Categorie : ' + item.nom + "</li>")
    .append('<li id="description">Description : ' + item.description + "</li>");
  item_body = $("<div></div>")
    .addClass("card-body")
    .append(' <h1 class="card-title text-center"> $' + item.prix + "</h1>");
  item_footer = $("<p></p>")
    .addClass("w-100 display-6 text-center")
    .append(
      '<button type="button" class="btn btn-primary position-relative" onclick="add_item(' +
        item.id +
        ')">' +
        ' <i class="bi bi-cart-plus"></i> </button>'
    )
    .append(
      `<a class="btn btn-warning" href="#/produit?id=${item.id}">En savoir plus</a>`
    );
  item_card
    .append(item_head)
    .append(item_body)
    .append(item_detail)
    .append(item_footer);
  return $("<div></div>").addClass("col-md-3").append(item_card);
}

function add_item(id_item) {
  $.ajax({
    url: "/clients/" + ID_CLIENT + "/panier",
    method: "POST",
    data: { idProduit: id_item, quantite: 1 },
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + TOKEN_CLIENT);
    },
    success: function (result) {
      $("#item_counter").text(result.items.length);
    },
  });
}


function chargerpanier() {
  $.ajax({
    url: "/clients/" + ID_CLIENT + "/panier",
    beforeSend: function (xhr) {
      xhr.setRequestHeader("Authorization", "Basic " + TOKEN_CLIENT);
    },
    success: function (result) {
      console.log(result);
      $.each(result.items, function (key, value) {
        item = panier_to_html(value);
        $("#list_panier").append(item);
      });
      $("#total").append("<b>Total: " + result.valeur.toFixed(2) + "</b>");
    },
  });
}

function panier_to_html(item) {
  item_panier = $("<div></div>")
    .addClass("row")
    .append('<div class="col">' + item.nomProduit + "</div>")
    .append('<div class="col">' + item.prix + "</div>")
    .append('<div class="col">' + item.quantite + "</div")
    .append(
      '<div class="col">' + (item.prix * item.quantite).toFixed(2) + "</div>"
    );
  return item_panier.append("<hr>");
}
