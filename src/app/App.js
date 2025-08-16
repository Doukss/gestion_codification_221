import { AuthLayout } from "../layout/AuthLayout.js";
import { NotificationService } from "../config/NotificationService.js";
import StorageService from "../config/StorageService.js";
import { hydrateStoreFromLocalStorage } from "../utils/HydrateStore.js";
import { EventBus } from "./core/EventBus.js";
import Router from "./core/Router.js";
import { Store } from "./core/Store.js";
import ApiService from "../config/ApiService.js";
import { AuthService } from "../services/auth/AuthService.js";
import { AuthController } from "../controllers/AuthController.js";
import { authRoutes } from "../routes/auth.routes.js";
import { AdminService } from "../services/admin/AdminService.js";
import { AdminController } from "../controllers/AdminController.js";
import { adminRoutes } from "../routes/admin.routes.js";
import { AdminLayout } from "../layout/AdminLayout.js";
import { Cloudinary } from "./core/Cloudinary.js";
import { errorRoutes } from "../routes/error.routes.js";
import { ErrorLayout } from "../layout/ErrorLayout.js";
import { agentRoutes } from "../routes/agent.routes.js";
import { AgentLayout } from "../layout/AgentLayout.js";
import { EtudiantService } from "../services/agent/EtudiantService.js";
import { EtudiantController } from "../controllers/agent/EtudiantController.js";
import { AgentController } from "../controllers/agent/AgentController.js";
import { ChambreService } from "../services/agent/ChambreService.js";
import { ChambreController } from "../controllers/agent/ChambreController.js";
import { AffectationService } from "../services/agent/affectationService.js";
import { AffectationController } from "../controllers/agent/AffectationControlleur.js";
// import { AffectationController } from "../controllers/agent/AffectationControlleur.js";
// import { AffectationService } from "../services/agent/affectationService.js";




export class App {
  constructor(config) {
    this.config = config;
    this.eventBus = new EventBus();
    this.store = new Store(config.initialState || {});

    this.services = {
      api: new ApiService(config.apiBaseUrl),
      storage: new StorageService(),
      notifications: new NotificationService(this),
    };

    this.services.auth = new AuthService({
      api: this.services.api,
      storage: this.services.storage,
    });

    //les services de l'applications

    this.services.admins = new AdminService({
      api: this.services.api,
      storage: this.services.storage,
    });

    this.services.etudiants = new EtudiantService({ 
    api: this.services.api 
    });

    this.services.cloudinary = new Cloudinary(this);
    
    this.services.chambres = new ChambreService({
      api: this.services.api,
      storage: this.services.storage,
    });

    this.services.etudiant = new EtudiantService({
      api: this.services.api,
      storage: this.services.storage,
    });

    this.services.affectation = new AffectationService({
      api: this.services.api,
      storage: this.services.storage,
    });
  
  


    //les controllers de l'applications

    this.controllers = {
      Auth: new AuthController(this),
      admin: new AdminController(this),
      agent: new AgentController(this),
      etudiant: new EtudiantController(this),
      chambre: new ChambreController(this),
      affectation: new AffectationController(this),
    };

    this.router = new Router(this, {
      mode: "history",
    });

    this.router.addLayout("auth", AuthLayout);
    this.router.addLayout("admin", AdminLayout)
    this.router.addLayout("error", ErrorLayout)
    this.router.addLayout("agent", AgentLayout)

    this.router.addRoutes(authRoutes);
    this.router.addRoutes(adminRoutes)
    this.router.addRoutes(errorRoutes)
    this.router.addRoutes(agentRoutes)


    this.initModules();
    hydrateStoreFromLocalStorage(this.store, this.services.storage);
    this.router.start();
  }

  initModules() {}

  getService(name) {
    return this.services[name];
  }

  getController(name) {
    return this.controllers[name];
  }

}
