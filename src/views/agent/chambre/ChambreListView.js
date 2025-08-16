import { AbstractView } from "../../AbstractView.js";

export class ChambreListView extends AbstractView {
  constructor(app, { params, route } = {}) {
    super(app, { params, route });
    this.controller = app.getController("chambre");
    this.chambres = [];
  }

  async render() {
    this.initContainer();
    await this.renderWelcomeMessage();
    await this.renderChambres();
    return this.container;
  }

  initContainer() {
    this.container = document.createElement("div");
    this.container.className = "p-6";
  }

  async renderWelcomeMessage() {
    const welcome = document.createElement("div");
    welcome.className = "mb-8";
    welcome.innerHTML = `
      <h1 class="text-2xl font-bold text-gray-800 dark:text-white">
        Bienvenue, ${this.app.store.state.user?.nom || "Utilisateur"} !
      </h1>
      <p class="text-gray-600 dark:text-gray-300">
        Voici la liste complète des chambres disponibles et occupées.
      </p>
    `;
    this.container.appendChild(welcome);
  }

  async renderChambres() {
    const loader = this.showLoading();

    try {
      this.chambres = await this.controller.loadChambres();

      if (!this.chambres || this.chambres.length === 0) {
        this.showError("Aucune chambre trouvée.");
        return;
      }

      const listContainer = document.createElement("div");
      listContainer.className = "overflow-x-auto bg-white shadow-md rounded-lg";

      const table = document.createElement("table");
      table.className = "min-w-full divide-y divide-gray-200";

      table.innerHTML = `
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Numéro</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Capacité</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">État</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Étage</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          ${this.chambres.map(c => `
            <tr>
              <td class="px-6 py-4 whitespace-nowrap">${c.code}</td>
              <td class="px-6 py-4 whitespace-nowrap">${c.numero}</td>
              <td class="px-6 py-4 whitespace-nowrap">${c.type}</td>
              <td class="px-6 py-4 whitespace-nowrap">${c.capacite}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  c.etat === "occuper" 
                  ? "bg-red-100 text-red-800" 
                  : "bg-green-100 text-green-800"
                }">
                  ${c.etat}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">Étage ${c.id_etage}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button class="text-blue-600 hover:text-blue-900" data-action="edit" data-id="${c.id}"><i class="ri-edit-2-line"></i></button>
                <button class="text-red-600 hover:text-red-900 ml-2" data-action="delete" data-id="${c.id}"><i class="ri-delete-bin-5-line"></i></button>
              </td>
            </tr>
          `).join("")}
        </tbody>
      `;

      listContainer.appendChild(table);
      this.container.appendChild(listContainer);

      // Ajout gestion des actions
      this.addEventListeners();

    } catch (error) {
      console.error(error);
      this.showError("Impossible de charger les chambres");
    } finally {
      this.hideLoading(loader);
    }
  }

  addEventListeners() {
    this.container.querySelectorAll("button[data-action]").forEach(button => {
      button.addEventListener("click", async (e) => {
        const action = e.target.dataset.action;
        const id = e.target.dataset.id;

        if (action === "delete") {
          if (confirm("Voulez-vous vraiment supprimer cette chambre ?")) {
            await this.controller.service.deleteChambre(id);
            this.app.eventBus.publish("chambres:updated");
            this.render();
          }
        }

        if (action === "edit") {
          alert("Ouvrir la modale pour modifier la chambre " + id);
          // Ici tu pourras intégrer un `ChambreEditModal` comme tu l’as fait pour les articles
        }
      });
    });
  }
}
