import { AbstractAffectationModal } from "./AbstractAffectationModal.js";

export class AffectationFormModal extends AbstractAffectationModal {
  constructor(app) {
    super(app, {
      title: "Affecter une chambre",
      requirePassword: true,
    });
  }

  getSubmitButtonText() {
    return "Enregistrer";
  }

  async processFormData(formData) {
    const etudiantId = formData.etudiant;
    const chambreId = formData.chambre;

    // Vérifier si l’étudiant est éligible
    const etudiant = await this.app.getService("etudiants").getById(etudiantId);
    if (etudiant.moyenne < 11.90) {
      this.app.services.notifications.show(
        "Cet étudiant n'est pas éligible (moyenne < 11.90)",
        "error"
      );
      return;
    }

    // Créer l’affectation
    await this.controller.createAffectation({ etudiantId, chambreId });

    // Notifier que la liste a été mise à jour
    this.app.eventBus.publish("affectations:updated");
  }
}
