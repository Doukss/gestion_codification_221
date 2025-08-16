// services/AffectationService.js
import  ApiService  from "../../config/ApiService.js";

export class AffectationService extends ApiService {
  constructor(baseUrl = "/api/affectations") {
    super(baseUrl);
  }

  /**
   * Récupérer toutes les affectations
   */
  async getAll() {
    try {
      return await this.get("/");
    } catch (error) {
      console.error("Erreur récupération affectations :", error);
      throw error;
    }
  }

  /**
   * Récupérer une affectation par ID
   * @param {number|string} id
   */
  async getById(id) {
    try {
      return await this.get(`/${id}`);
    } catch (error) {
      console.error("Erreur récupération affectation :", error);
      throw error;
    }
  }

  /**
   * Créer une nouvelle affectation
   * @param {object} data { etudiantId, chambreId, dateAffectation }
   */
  async create(data) {
    try {
      return await this.post("/", data);
    } catch (error) {
      console.error("Erreur création affectation :", error);
      throw error;
    }
  }

  /**
   * Mettre à jour une affectation existante
   * @param {number|string} id
   * @param {object} data
   */
  async update(id, data) {
    try {
      return await this.put(`/${id}`, data);
    } catch (error) {
      console.error("Erreur mise à jour affectation :", error);
      throw error;
    }
  }

  /**
   * Supprimer une affectation
   * @param {number|string} id
   */
  async delete(id) {
    try {
      return await this.delete(`/${id}`);
    } catch (error) {
      console.error("Erreur suppression affectation :", error);
      throw error;
    }
  }
}
