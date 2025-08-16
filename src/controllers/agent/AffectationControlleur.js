// controllers/AffectationController.js
import { AffectationService } from "../../services/agent/affectationService.js";

export class AffectationController {
  constructor(view) {
    this.view = view; // La vue (AffectationListView, AffectationFormView, etc.)
    this.service = new AffectationService();
  }

  /**
   * Charger toutes les affectations et les afficher dans la vue
   */
  async loadAffectations() {
    try {
      const affectations = await this.service.getAll();
      this.view.renderAffectations(affectations);
    } catch (error) {
      console.error("Erreur lors du chargement des affectations :", error);
      this.view.showError("Impossible de charger les affectations.");
    }
  }

  /**
   * Créer une nouvelle affectation
   * @param {object} data { etudiantId, chambreId, dateAffectation }
   */
  async createAffectation(data) {
    try {
      const affectation = await this.service.create(data);
      this.view.showSuccess("Affectation créée avec succès !");
      this.loadAffectations();
      return affectation;
    } catch (error) {
      console.error("Erreur lors de la création d’une affectation :", error);
      this.view.showError("Impossible de créer l’affectation.");
    }
  }

  /**
   * Mettre à jour une affectation
   * @param {number|string} id
   * @param {object} data
   */
  async updateAffectation(id, data) {
    try {
      await this.service.update(id, data);
      this.view.showSuccess("Affectation mise à jour avec succès !");
      this.loadAffectations();
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l’affectation :", error);
      this.view.showError("Impossible de mettre à jour l’affectation.");
    }
  }

  /**
   * Supprimer une affectation
   * @param {number|string} id
   */
  async deleteAffectation(id) {
    try {
      await this.service.delete(id);
      this.view.showSuccess("Affectation supprimée avec succès !");
      this.loadAffectations();
    } catch (error) {
      console.error("Erreur lors de la suppression d’une affectation :", error);
      this.view.showError("Impossible de supprimer l’affectation.");
    }
  }
}
