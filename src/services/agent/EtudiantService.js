export class EtudiantService {
  constructor({ api }) {
    this.api = api;
  }

  async getEtudiants() {
    try {
      return await this.api.get("/etudiants"); // endpoint backend
    } catch (error) {
      console.error("Erreur récupération étudiants :", error);
      throw error;
    }
  }

//   async getEtudiants() {
//   const response = await fetch("http://localhost:3000/etudiants");
//   const data = await response.json(); 
//   return data;
// }

}
