export class AgentController {
  constructor(app) {
    this.app = app;
    this.service = app.getService("agents");
    this.cache = {
      etudiants: null,
      lastUpdated: null,
    };
  }


  // === Gestion des étudiants ===
  async loadEtudiants(forceRefresh = false) {
    try {
      if (!forceRefresh && this.cache.etudiants && this.isCacheValid()) {
        return this.cache.etudiants;
      }

      const etudiants = await this.service.getAllEtudiants();
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

  async createEtudiant(formData) {
    try {
      const result = await this.service.createEtudiant(formData);
      this.clearCache();
      this.app.eventBus.publish("etudiants:updated");
      this.app.services.notifications.show("Étudiant créé avec succès", "success");
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
      this.app.eventBus.publish("etudiants:updated");
      this.app.services.notifications.show("Étudiant mis à jour avec succès", "success");
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
      this.app.eventBus.publish("etudiants:updated");
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
      this.app.eventBus.publish("etudiants:updated");
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la restauration",
        "error"
      );
      throw error;
    }
  }

  // === Cache ===
  clearCache() {
    this.cache.etudiants = null;
  }

  isCacheValid() {
    return (
      this.cache.lastUpdated &&
      Date.now() - this.cache.lastUpdated < 5 * 60 * 1000 // 5 min
    );
  }
}
