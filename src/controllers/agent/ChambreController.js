export class ChambreController {
  constructor(app) {
    this.app = app;
    this.service = app.getService("chambres");
    this.chambres = [];
    this.cache = {
      chambres: null,
      lastUpdated: null,
    };
  }

  async loadChambres(forceRefresh = false) {
    try {
      if (!forceRefresh && this.cache.chambres && this.isCacheValid()) {
        this.chambres = this.cache.chambres;
        return this.chambres;
      }

      const chambres = await this.service.getChambres();
      this.chambres = chambres;
      this.cache.chambres = chambres;
      this.cache.lastUpdated = Date.now();

      return chambres;
    } catch (error) {
      this.app.services.notifications.show(
        "Impossible de charger les chambres",
        "error"
      );
      throw error;
    }
  }

  async createChambre(chambreData) {
    try {
      const result = await this.service.createChambre(chambreData);

      this.clearCache();
      this.app.services.notifications.show(
        "Chambre créée avec succès",
        "success"
      );

      this.app.eventBus.publish("chambres:updated");
      return result;
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la création",
        "error"
      );
      throw error;
    }
  }

  isCacheValid() {
    return (
      this.cache.lastUpdated &&
      Date.now() - this.cache.lastUpdated < 5 * 60 * 1000
    );
  }

  async updateChambre(id, data) {
    try {
      const result = await this.service.updateChambre(id, data);

      this.clearCache();
      this.app.services.notifications.show(
        "Chambre mise à jour avec succès",
        "success"
      );

      this.app.eventBus.publish("chambres:updated");
      return result;
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la mise à jour",
        "error"
      );
      throw error;
    }
  }

  clearCache() {
    this.cache.chambres = null;
  }

  async libererChambre(id) {
    try {
      await this.service.libererChambre(id);
      this.clearCache();

      this.app.services.notifications.show(
        "Chambre libérée avec succès",
        "success"
      );

      this.app.eventBus.publish("chambres:updated");
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de la libération",
        "error"
      );
      throw error;
    }
  }

  async occuperChambre(id) {
    try {
      await this.service.occuperChambre(id);
      this.clearCache();

      this.app.services.notifications.show(
        "Chambre occupée avec succès",
        "success"
      );

      this.app.eventBus.publish("chambres:updated");
    } catch (error) {
      this.app.services.notifications.show(
        error.message || "Erreur lors de l'occupation",
        "error"
      );
      throw error;
    }
  }
}
