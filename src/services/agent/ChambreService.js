export class ChambreService {
  constructor({ api, storage }) {
    this.api = api;         // pour les appels HTTP
    this.storage = storage; // si tu veux stocker localement des données
  }

  // Récupérer toutes les chambres
  async getChambres() {
    try {
      return await this.api.get("/chambres");
    } catch (error) {
      console.error("Erreur lors de la récupération des chambres :", error);
      throw error;
    }
  }

  

  // Récupérer une chambre par ID
  async getChambreById(id) {
    try {
      return await this.api.get(`/chambres/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la récupération de la chambre ${id} :`, error);
      throw error;
    }
  }

  // Créer une nouvelle chambre
  async createChambre(data) {
    try {
      return await this.api.post("/chambres", data);
    } catch (error) {
      console.error("Erreur lors de la création de la chambre :", error);
      throw error;
    }
  }

  // Mettre à jour une chambre
  async updateChambre(id, data) {
    try {
      return await this.api.put(`/chambres/${id}`, data);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de la chambre ${id} :`, error);
      throw error;
    }
  }

  // Supprimer une chambre
  async deleteChambre(id) {
    try {
      return await this.api.delete(`/chambres/${id}`);
    } catch (error) {
      console.error(`Erreur lors de la suppression de la chambre ${id} :`, error);
      throw error;
    }
  }
}
