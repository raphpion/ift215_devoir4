TOKEN_VENTE = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac";

function vente_to_html(vente) {
    //client = chercherClient(vente.idClient);
    vente_card = $('<div></div>').addClass('card mb4-rounded-3 shadow-sm');
    vente_head = $('<div></div>').addClass('card-header py-3').append(`<div class="row"><h4 class="my-0 fw-normal col"> Commande No.`+vente.id+`</h4>
    <label class="col status"><h5> `+vente.status+`</h5></label></div>`);
    vente_test = $(`<div class="row">
    <div class="col" >
        <div class="row" id="list_venteProd">
            <h6>`+venteProd_to_html(vente.produits)+`</h6>
        </div>
    </div>
    <div class="col" id="list_userInfo">
        <div class="row">
            <h6>La vente date du : `+vente.date+`</h6>
        </div>
        <div class="row">
            <div class="col" id="nique">
            <h6> Prenom : +client.nom+ </h6>
            <h6> </h6>
            <h6> </h6>
            </div>
        </div>
    </div>
    </div>  `);
    // vente_content = $(`<section>
    //     <div class="row">
    //             <div class="col" id="abcd">
    //             <h6>`+vente.date+`</h6>
    //     <div class="col" id="list_venteProd">

    //     </div>
    //     </div>


    //     </div>
    //     </section>`);
    //chargerproduits(vente.produits);
    //chercherClient(vente.idClient);
    vente_card.append(vente_head).append(vente_test);
    return $('<div></div>').addClass('col').append(vente_card);
}
//                    <button class="btn btn-primary" onclick="chercherClient(`+vente.idClient+`)"></button>
//    panier.items.findIndex(obj => obj.id === idItem)            <div class"row"><p class="col">`+vente.produits[0].nomProduit+`</p> <p class="col"> `+vente.produits[0].quantite+`</p></div>


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
    function chercherClient(id_client){
    $.ajax({
        url: "/clients/" + id_client,
        method:"GET",
        beforeSend: function (xhr){
            xhr.setRequestHeader('Authorization', "Basic "+ TOKEN_VENTE);
        },
        success: function( result ) {
            // client = [result.nom, result.prenom, result.pays];
            return result;
        }});
    }

  function venteProd_to_html(produits){
    produits.forEach(produit => {
    vente_body = $('<div></div>')
        .append(`<div class="">
                    <h6 class="col">`+ produit.nomProduit +` </h6>
                    <h6 class="col">`+ produit.quantite +` </h6>
                 </div>
        `)
        $('#list_venteProd').append(vente_body);
    });
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
                //client = chercherClient(value.idClient);
                  vente = vente_to_html(value);
                  console.log(value);
                  $('#list_ventes').append(vente);
              });
  
          }
      });
  
  }