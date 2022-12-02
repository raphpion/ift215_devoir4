let ID_CLIENT = 1;
let TOKEN_CLIENT = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MSwicm9sZSI6ImNsaWVudCIsImlhdCI6MTYzNjc1MjI1MywiZXhwIjoxODM2NzUyMjUzfQ.qMcKC0NeuVseNSeGtyaxUvadutNAfzxlhL5LYPsRB8k";
let itemGlobal;


function load_panier(item) {
    nom = $('<td></td>').append(item.nomProduit);
    prix = $('<td></td>').append(item.prix);
    qte = $(`<td> <div class="row">
    <button class="btn btn-primary rounded col" id="bouton_panier" onclick="enleverItem(`+ item.id + `)"><i class="bi bi-dash-lg"></i></button>             
    <p class="col center">` + item.quantite + `</p>
    <button class="btn btn-primary rounded col" id="bouton_panier" onclick="ajouterItem(`+ item.id + `)"><i class="bi bi-plus-lg"></i></button>
    </div> </td>`);
    total = $('<td class="centrer fixer"></td>').append(Math.round(item.quantite * item.prix * 100) / 100);
    trash = $('<td class="onSide"></td>')
      .append('<button type="button" class="btn btn-danger" onClick="remove_item([' + item.id + '])">Retirer <span class="bi bi-trash" aria-hidden="true"></span></button>')

   return $('<tr></tr>').append(nom).append(prix).append(qte).append(total).append(trash);
}

function chargerproduits(){
    let urlToCall = "/produits";
    let text = $('#search_produit').val();
    if (text) {
        urlToCall = "/produits?nom=" + text;
    }
    $('#list_items').empty();
    $.ajax({
        url: urlToCall,
        success: function( result ) {
            if (result.length == 0) {
                $('#list_items').append('<h4 class="text-center">Aucun résultat trouvé</h4>');
            }
            else {
                $.each(result, function (key, value) {
                    item = item_to_html(value);
                    $('#list_items').append(item);
                });
            }
            set_panier();
        }
    });
}

function chargerpanier(){
    $.ajax({
        url: "/clients/"+ID_CLIENT+"/panier",
        method:"GET",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {
            $('#body_table').empty();
            console.log(result);
            if (result.items.length == 0) {
                document.getElementById("buttonConfirmer").disabled = true;
                document.getElementById("empty_panier").style.display = "true";
                document.getElementById("liste_panier").style.display = "none";
                document.getElementById("basicRetour").style.display = "none";
                document.getElementById("prixTOT").style.display = "none";
                document.getElementById("empty_panier").innerHTML = `<h4>Il semblerait que votre panier soit vide</h4> 
                <a href="#/produit"><i class="bi bi-arrow-left-short"/i> Retourner a la boutique </a>`;
            }
            $.each(result.items, function (key, value) {
                //document.getElementById("empty_panier").style.display = "none";
                item = load_panier(value);
                $('#body_table').append(item);
                chargerTotal();
            });
        }
    });
}


function set_panier() {
    $.ajax({
        url: "/clients/"+ID_CLIENT+"/panier",
        method:"GET",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {
            $('#item_counter').text(result.items.length);
        }
    });
}

function item_to_html(item){
    item_card = $('<div></div>')
        .addClass('card mb-4 rounded-3 shadow-sm');
    item_head = $('<div</div>')
        .addClass('card-header py-3')
        .append('<h4 class="my-0 fw-normal">' + item.nom + '</h4>');

    item_body = $('<div></div>')
        .addClass('card-body')
        .append(' <h1 class="card-title text-center"> $' + item.prix +'</h1>');

    description = $('<div></div>')
        .addClass('list-unstyled mt-3 mb-4')
        .append('<li>Qte dispo:' + item.qte_inventaire + '</li>');
    if (item.categorie) {
        description.append('<li>Catégorie:' + item.categorie.nom + '</li>');
    }
    description
        .append('<br />')
        .append('<li>' + item.description + '</li>');

    cart = $('<p class="w-100 display-6 text-center">\n' +
        ' <button type="button" class="btn btn-primary position-relative" onclick="add_item(['+item.id+'])">\n' +
        ' <i class="bi bi-cart-plus"></i>\n' +
        ' </button>\n' +
        '</p>')
    item_body.append(description).append(cart);



    item_card.append(item_head).append(item_body);



    return $('<div></div>').addClass('col-md-3') .append(item_card);
}


function add_item(item) {
    let id_item = item[0];
    $.ajax({
        url: "/clients/"+ID_CLIENT+"/panier",
        method:"POST",
        data: {"idProduit": id_item, "quantite": 1},
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {
            $('#item_counter').text(result.items.length);
        },
        statusCode: {
            400: function() {
                $('#inventaireVide').modal('show');
            }
        },
    });
}

function remove_item(item) {
    let id_item = item[0];

    $.ajax({
        url: "/clients/"+ID_CLIENT+"/panier/" + id_item,
        method:"DELETE",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {
            chargerpanier();
            $('#successSuppressionItemModal').modal('toggle');
        },
        error : function (result){
            $('#erreurSuppressionItemModal').modal('toggle');
        }
    });
}

function ajouterItem(item){        
    $.ajax({
        url:"/clients/"+ID_CLIENT+"/panier/" + item,
        method:"PUT",
        data: {'quantite': 1},
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result ) {

            chargerpanier();
        }});
}


function isItemLeft(item){

    prod = recupereProduit(item)
    if( prod.qte_inventaire >= 1) {
        return true;
    }
    else {
        return false;
}
}


function enleverItem(item){
    getItem(item).then(function(result) {
        if (result.quantite > 1) {
            $.ajax({
                url:"/clients/"+ID_CLIENT+"/panier/" + item,
                method:"PUT",
                data: {'quantite': -1},
                beforeSend: function (xhr){
                    xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
                },
                success: function() {

                    chargerpanier();
                }});
        }
    });
}

function getItem(idItem) {
    return new Promise(function(resolve) {
        $.ajax({
            url: "/clients/" + ID_CLIENT + "/panier/" + idItem,
            method: "GET",
            beforeSend: function (xhr){
                xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
            },
            success: function( result ) {
                resolve(result);
            },
        });
    });
}

function setItemGlobal(item) {
    itemGlobal = item;
    $('#supprimerItemModal').modal('show');
}

function chargerTotal(){
    $.ajax({
        url: "/clients/"+ID_CLIENT+"/panier",
        method:"GET",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_CLIENT);
        },
        success: function( result){
            $('#prixTOT').text('Total de la commande : '+ Math.round(result.valeur * 100) / 100 + ' $');
            // $('#buttonConfirmer').text('Confirmer la commande');
            for( let i in result.items){
                item = item_to_html(result.items[i])
                $('#list_panier').append(item);
            }
        }
    });
}

function confirmation(){
    window.location.replace('#/confirmationcommande');
}