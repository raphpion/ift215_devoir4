/**
 * @param {string} status
 * @returns {string}
 */
function vente_couleur_status(status) {
  const status_couleur = new Map();
  status_couleur.set('reçue', 'warning');
  status_couleur.set('préparée', 'info');
  status_couleur.set('en route', 'primary');
  status_couleur.set('livrée', 'success');

  if (!status_couleur.has(status)) return status_couleur.get('reçue');

  return status_couleur.get(status);
}

/**
 *
 * @param {Vente} vente
 * @param {Client} client
 * @returns
 */
function vente_to_html(vente, client) {
  console.log(vente.status);
  const couleur = vente_couleur_status(vente.status);

  const vente_html = $(`<div class="card mb4-rounded-3 shadow-sm mb-5" id="vente-${vente.id}">
    <div class="card-header py-3">
      <div class="row mb-3">
        <h4 class="my-0 fw-normal col">Commande No.${vente.id}</h4>
        <button class="btn btn-${couleur} col status" onclick="changerstatus(${vente.id})">${vente.status}</button>
      </div>
    </div>
    <div class="row vente">
      <div class="col">
        <div class="row" style="margin-left: 1rem" id="list_venteProd_${vente.id}">
          ${vente.produits.map(produit => {
            return ` ${produit.quantite}x ${produit.nomProduit}`;
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
          <button type="button" class="btn btn-outline-danger" id="endButton" ${
            vente.status === 'reçue' ? '' : 'disabled'
          } style="margin-bottom = 5px" 
          onclick="annulerVente(${vente.id}, ${vente.idClient})"> Annuler la commande</button>
        </div>
      </div>
    </div>
  </div>
  `);

  return vente_html;
}

function annulerVente(idVente, idClient) {
  const session = SessionManager.getSession();
  if (!session || session.role !== 'admin') window.location.replace('#/');

  $.ajax({
    url: '/ventes/' + idVente,
    method: 'DELETE',
    data: { idClient: idVente },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#vente .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>${xhr.responseText}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `);
    },
    success: function (result) {
      $('#vente .alertes').append(`<div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>La vente a bien été annulée !</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
      $(`#vente-${idVente}`).fadeOut(400, () => {
        $(this).remove();
      });
    },
  });
}

function changerstatus(idVente) {
  const session = SessionManager.getSession();
  if (!session || session.role !== 'admin') window.location.replace('#/');

  const status = ['reçue', 'préparée', 'en route', 'livrée'];

  const btnStatus = $(`#vente-${idVente} .status`);
  const oldStatus = btnStatus.text();
  let index = status.indexOf(oldStatus) + 1;
  if (index === 0 || index >= status.length - 2) index = 0;
  const newStatus = status[index];

  $.ajax({
    url: `/ventes/${idVente}`,
    method: 'PUT',
    data: { status: newStatus },
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#vente .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>${xhr.responseText}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `);
    },
    success: () => {
      const ancienneCouleur = vente_couleur_status(oldStatus);
      const couleur = vente_couleur_status(newStatus);
      btnStatus.removeClass(`btn-${ancienneCouleur}`).addClass(`btn-${couleur}`).text(newStatus);
      $('#vente .alertes').append(`<div class="alert alert-success alert-dismissible fade show" role="alert">
          <strong>Le statut de la vente a bien été changé pour : ${newStatus}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>`);
    },
  });
}

function chargervente() {
  const session = SessionManager.getSession();
  if (!session || session.role !== 'admin') window.location.replace('#/');

  $.ajax({
    url: '/ventes',
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
    },
    error: (xhr, ajaxOptions, thrownError) => {
      $('#vente .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>${xhr.responseText}</strong>
          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
      `);
    },
    success: function (result) {
      console.table(result);
      $.each(result, function (key, value) {
        $.ajax({
          url: '/clients/' + value.idClient,
          method: 'GET',
          beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', 'Basic ' + session.token);
          },
          error: (xhr, ajaxOptions, thrownError) => {
            $('#vente .alertes').append(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <strong>${xhr.responseText}</strong>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
              </div>
            `);
          },
          success: function (result) {
            // client = [result.nom, result.prenom, result.pays];
            client = result;
            console.log(value);
            vente = vente_to_html(value, client);
            $('#list_ventes').append(vente);
          },
        });
      });
    },
  });
}
