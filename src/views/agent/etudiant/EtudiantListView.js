import { AbstractView } from "../../AbstractView.js";
import { ModernTable } from "../../../components/table/Table.js"; // ajuste le chemin si besoin

export class EtudiantListView extends AbstractView {
  constructor(app, { params, route } = {}) {
    super(app, { params, route });
    this.controller = app.getController("etudiant");
    this.etudiants = [];
    this.table = null;
  }

  async render() {
    this.initContainer();
    await this.renderWelcomeMessage();
    await this.renderEtudiants();
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
        Voici la liste complète des étudiants enregistrés.
      </p>
    `;
    this.container.appendChild(welcome);
  }

  async renderEtudiants() {
    const loader = this.showLoading();

    try {
      this.etudiants = await this.controller.loadEtudiants();
     console.log(this.etudiants);
      if (!this.etudiants || this.etudiants.length === 0) {
        this.showError("Aucun étudiant trouvé.");
        return;
      }

      // Préparer les données pour ModernTable
      const data = this.etudiants.map(e => {

        const utilisateur = e.utilisateur || {};
        const affectation = e.affectation || {};
        const chambre = affectation.chambre || null;

        return {
          id: e.id,
          matricule: e.matricule,
          nom: `${utilisateur.nom || "-"} ${utilisateur.prenom || ""}`,
          email: utilisateur.email || "-",
          sexe: e.sexe,
          filiere: e.filiere,
          niveau: e.niveau,
          chambre: chambre ? chambre.code : "Non attribuée",
          statut: utilisateur.deleted ? "Inactif" : "Actif",
          statutClass: utilisateur.deleted
            ? "badge badge-error"
            : "badge badge-success",
        };
      });

      // Créer la table moderne
      this.table = new ModernTable({
        columns: [
          { key: "matricule", header: "Matricule" },
          { key: "nom", header: "Nom complet" },
          { key: "email", header: "Email" },
          { key: "sexe", header: "Sexe" },
          { key: "filiere", header: "Filière" },
          { key: "niveau", header: "Niveau" },
          { key: "chambre", header: "Chambre" },
          {
            key: "statut",
            header: "Statut",
            render: (item) =>
              `<span class="${item.statutClass}">${item.statut}</span>`,
          },
        ],

        data:this.etudiants,
        searchable: true,
        sortable: true,
        striped: true,
        hoverEffect: true,
        itemsPerPage: 5,
      });

      const tableDom = await this.table.getDom();
                this.container.appendChild(tableDom);

      setTimeout(()=>{
      this.table.update(this.etudiants)
      },100)
    

    } catch (error) {
      console.error("Erreur chargement étudiants:", error);
      this.showError("Impossible de charger les étudiants");
    } finally {
      this.hideLoading(loader);
    }
  }
}
