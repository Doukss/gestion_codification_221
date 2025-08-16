import { AbstractView } from "../../../views/AbstractView.js";
import { AffectationModal } from "./AffectationModal.js";

export class AffectationListView extends AbstractView {
  constructor(app) {
    super(app);
    this.controller = app.getController("affectation");
    this.affectations = [];
  }

  async render() {
    this.initContainer();
    await this.renderHeader();
    await this.renderTable();
    return this.container;
  }

  initContainer() {
    this.container = document.createElement("div");
    this.container.className = "p-6";
  }

  async renderHeader() {
    const header = document.createElement("div");
    header.className = "flex justify-between items-center mb-4";

    const title = document.createElement("h2");
    title.textContent = "Liste des affectations";
    title.className = "text-xl font-bold";

    const addBtn = document.createElement("button");
    addBtn.textContent = "Nouvelle affectation";
    addBtn.className = "btn btn-primary";
    addBtn.onclick = () => this.openAffectationModal();

    header.appendChild(title);
    header.appendChild(addBtn);
    this.container.appendChild(header);
  }

  async renderTable() {
    this.affectations = await this.controller.getAll();
    
    const table = document.createElement("table");
    table.className = "table-auto w-full border border-gray-200";

    const thead = document.createElement("thead");
    thead.innerHTML = `
      <tr class="bg-gray-100">
        <th class="p-2 border">Étudiant</th>
        <th class="p-2 border">Chambre</th>
        <th class="p-2 border">Actions</th>
      </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    this.affectations.forEach((a) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="p-2 border">${a.etudiantNom}</td>
        <td class="p-2 border">${a.chambreCode}</td>
        <td class="p-2 border">
          <button class="btn btn-sm btn-warning">Modifier</button>
          <button class="btn btn-sm btn-error ml-2">Supprimer</button>
        </td>
      `;
      // Event pour modifier
      tr.querySelector(".btn-warning").onclick = () => this.openAffectationModal(a);
      // Event pour supprimer
      tr.querySelector(".btn-error").onclick = async () => {
        if (confirm("Confirmer la suppression ?")) {
          await this.controller.deleteAffectation(a.id);
          this.renderTable();
        }
      };
      tbody.appendChild(tr);
    });

    table.appendChild(tbody);
    this.container.appendChild(table);
  }

  openAffectationModal(affectation = null) {
    const modal = new AffectationModal(this.app, affectation);
    modal.open();
    // Recharger la table après fermeture
    this.app.eventBus.subscribe("affectations:updated", async () => this.renderTable());
  }
}
