TOKEN_VENTE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZENsaWVudCI6MCwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjM2NzUyMzAxLCJleHAiOjE4MzY3NTk1MDF9.QYtVOl6o87doRiT2EsezLqtSpz27K-nEZ4KqcmZV5Ac';

/**
 *
 * @param {Vente} vente
 * @param {Client} client
 * @returns
 */
function vente_to_html(vente, client) {
  endIt = false;
  if (vente.status == "prepare") {couleur = "red"; desc = "Préparée"; }
  if (vente.status == "en_route") {couleur = "orange"; desc = "En cours de livraison";}
  if (vente.status == "livree") {couleur = "green"; desc = "Livrée"; endIt = true;}
  if (vente.status == "reçue"){couleur = "aqua"; desc = "Nouvelle commande";}

  const vente_html = $(`<div class="card mb4-rounded-3 shadow-sm mb-5" id="vente-${vente.id}">
    <div class="card-header py-3">
      <div class="row">
        <h4 class="my-0 fw-normal col">Commande No.${vente.id}</h4>
        <button class="btn col status" style="background-color:${couleur};">${desc}</button>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <div class="row" style="margin-left: 1rem" id="list_venteProd_${vente.id}">
          ${vente.produits.map(produit => {
            return `${produit.quantite}x ${produit.nomProduit}`;
          })}
        </div>
        <div class="row" style="margin-left: 1rem">
        <h6>total : ${vente.montant}$</h6>
        </div>
      </div>
      <div class="col" id="list_userInfo">
        <div class="row">
          <h6>La vente date du : ${new Date(vente.date).toLocaleString('fr-CA')}</h6>
        </div>
        <div class="row">
          <div class="col" id="informationClient">
            <h6>Prenom : ${client.prenom}</h6>
            <h6>Nom : ${client.nom}</h6>
            <h6>Pays : ${client.pays} Adresse : ${client.adresse}</h6>
          </div>
        </div>
        <div class="deleteButton">
          <button type="button" class="btn btn-secondary" id="endButton" ${vente.status === 'reçue' ? '' : 'disabled'} style="margin-bottom = 5px" 
          onclick="annulerVente(${vente.id}, ${vente.idClient})"> Annuler la commande</button>
        </div>
      </div>
    </div>
  </div>
  `);

  return vente_html;
}

function annulerVente(idVente, idClient) {
  $.ajax({
    url: '/ventes/' + idVente,
    method: "DELETE",
    data:{idClient : idVente},
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + TOKEN_VENTE);
    },
    success: function(result){
      $(`#vente-${idVente}`).fadeOut(400, () => { $(this).remove(); });
    }
  })
}

function chargervente() {
  $.ajax({
    url: '/ventes',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + TOKEN_VENTE);
    },
    success: function (result) {
      console.table(result);
      $.each(result, function (key, value) {
        $.ajax({
          url: '/clients/' + value.idClient,
          method: 'GET',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + TOKEN_VENTE);
          },
          success: function (result) {
            // client = [result.nom, result.prenom, result.pays];
            client = result;
            vente = vente_to_html(value, client);
            $('#list_ventes').append(vente);
          },
        });
      });
    },
  });
}
