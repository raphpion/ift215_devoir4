TOKEN_VENTE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";

function vente_to_html(vente) {

    vente_card = $('<div></div>').addClass('card mb4-rounded-3 shadow-sm');
    vente_head = $('<div></div>').addClass('card-header py-3').append(`<div class="row"><h4 class="my-0 fw-normal col"> Commande No.`+vente.id+`</h4>
    <label class="col status"><h5> `+vente.status+`</h5></label></div>`);
    vente_content = $(`<div class="row">
        <div class="col" id="list_venteProd">
        </div>
    </div>`)
    // lmao = chargerProduits(vente);
    chargerproduits(vente.produits);
    vente_card.append(vente_head).append(vente_body);
    return $('<div></div>').addClass('col').append(vente_card);
}
//            panier.items.findIndex(obj => obj.id === idItem)            <div class"row"><p class="col">`+vente.produits[0].nomProduit+`</p> <p class="col"> `+vente.produits[0].quantite+`</p></div>


// function vente_to_html(vente){
//     vente_card = $('<div></div>')
//         .addClass('card rounded-3 shadow-sm')
//     vente_head = $('<div></div>')
//         .addClass('card-header py-3 headerItem')
//         .append(<div class="row">
//                     <h5 class="my-0 fw-normal col">Commande No. + vente.id + </h5>
//                     <label class="status col"><h5> + vente.status + </h5></label>
//                  </div>)
//     vente_body = $('<div></div>')
//         .append(<div class="row">
//                     <div class="" id="list_venteProd"></div>
//                  </div> 
                    
                    
                    
                
//                     )
  
//     chargerproduits(vente.produits);
//     vente_card.append(vente_head).append(vente_body);
//     return $('<div></div>').addClass('col').append(vente_card);
//   }
  
  function venteProd_to_html(produit){
    vente_body = $('<div></div>')
        .append(`<div class="row">
                    <h6 class="col">`+ produit.nomProduit +` </h6>
                    <h6 class="col">`+ produit.quantite +` </h6>
                 </div>
        `)
  
    return vente_body;
  }
  
  function chargerproduits(produits){
    //   produitHtml=$('');
      produits.forEach(produit => {
        produitHtml = (venteProd_to_html(produit));
        $('#list_venteProd').append(produitHtml);
      });
    //   $('#list_venteProd').append(produitHtml);
  
  }
  
  function chargervente(){
  
      $('<div></div>').addClass('container mb-4 text-center');
      $.ajax({
          url: "/ventes",
          beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_VENTE);
          },
          success: function( result ) {
              console.log(result);
              $.each(result, function (key, value) {
                  vente = vente_to_html(value);
                  console.log(value);
                  $('#list_ventes').append(vente);
              });
  
          }
      });
  
  }