export class EtudiantController {
  constructor(app) {
    this.app = app;
    this.service = app.getService("etudiants");
    this.etudiants = [];
    this.cache = {
      etudiants: null,
      lastUpdated: null,
    };
  }

  async loadEtudiants(forceRefresh = false) {
    try {
      // Si cache valide et pas de force refresh
      if (!forceRefresh && this.cache.etudiants && this.isCacheValid()) {
        this.etudiants = this.cache.etudiants;
        return this.etudiants;
      }

      // Récupération de la liste depuis l'API
      const etudiants = await this.service.getEtudiants();
      this.etudiants = etudiants;

      // Mise en cache
      this.cache.etudiants = etudiants;
      this.cache.lastUpdated = Date.now();

      return etudiants;
    } catch (error) {
      this.app.services.notifications.show(
        "Impossible de charger les étudiants",
        "error"
      );
      throw error;
    }
  }

  async createEtudiant(etudiantData) {
    try {
      const result = await this.service.createEtudiant(etudiantData);

      this.clearCache();
      this.app.services.notifications.show(
        "Étudiant créé avec succès",
        "success"
      );

      this.app.eventBus.publish("etudiant:updated");
      return result;
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la création",
        "error"
      );
      throw error;
    }
  }

  async updateEtudiant(id, data) {
    try {
      const result = await this.service.updateEtudiant(id, data);

      this.clearCache();
      this.app.services.notifications.show(
        "Étudiant mis à jour avec succès",
        "success"
      );

      this.app.eventBus.publish("etudiant:updated");
      return result;
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la mise à jour",
        "error"
      );
      throw error;
    }
  }

  async deleteEtudiant(id) {
    try {
      await this.service.softDeleteEtudiant(id);
      this.clearCache();

      this.app.services.notifications.show(
        "Étudiant désactivé avec succès",
        "success"
      );

      this.app.eventBus.publish("etudiant:updated");
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la désactivation",
        "error"
      );
      throw error;
    }
  }

  async restoreEtudiant(id) {
    try {
      await this.service.restoreEtudiant(id);
      this.clearCache();

      this.app.services.notifications.show(
        "Étudiant restauré avec succès",
        "success"
      );

      this.app.eventBus.publish("etudiant:updated");
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la restauration",
        "error"
      );
      throw error;
    }
  }

  isCacheValid() {
    return (
      this.cache.lastUpdated &&
      Date.now() - this.cache.lastUpdated < 5 * 60 * 1000 // 5 minutes
    );
  }

  clearCache() {
    this.cache.etudiants = null;
  }
}
