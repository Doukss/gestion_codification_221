import { AbstractAffectationModal } from "./AbstractAffectationModal.js";

export class AffectationModal extends AbstractAffectationModal {
  constructor(app, affectation) {
    super(app, {
      title: affectation ? "Modifier l'affectation" : "Nouvelle affectation",
      affectation,
    });
    this.affectation = affectation;
  }

  initForm() {
    if (!this.affectation) return;

    // Pré-remplir les champs si modification
    this.form.querySelector('[name="etudiant"]').value = this.affectation.etudiantId || "";
    this.form.querySelector('[name="chambre"]').value = this.affectation.chambreId || "";
  }

  getSubmitButtonText() {
    return this.affectation ? "Enregistrer les modifications" : "Affecter";
  }

  getLoadingText() {
    return this.affectation ? "Mise à jour..." : "Affectation en cours...";
  }

  async processFormData(formData) {
    const etudiantId = formData.etudiant;
    const chambreId = formData.chambre;

    // 1. Récupérer la moyenne de l'étudiant
    const etudiant = await this.app.getService("etudiants").getById(etudiantId);
    if (etudiant.moyenne < 11.90) {
      this.app.services.notifications.show(
        "Cet étudiant n'est pas éligible (moyenne < 11.90)",
        "error"
      );
      return;
    }

    // 2. Créer ou mettre à jour l’affectation
    if (this.affectation) {
      await this.controller.updateAffectation(this.affectation.id, { etudiantId, chambreId });
    } else {
      await this.controller.createAffectation({ etudiantId, chambreId });
    }
  }
}
