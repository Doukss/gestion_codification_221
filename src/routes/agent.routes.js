import { AuthGuard } from "../app/core/guard/AuthGuard.js";
import { AgentActifGuard } from "../app/core/guard/AgentActifGuard.js";
import { AgentGuard } from "../app/core/guard/RoleGuard.js";

import { EtudiantListView } from "../views/agent/etudiant/EtudiantListView.js";
import { ChambreListView } from "../views/agent/chambre/ChambreListView.js";
// import { AffectationListView } from "../views/agent/affectation/AbstractAffectationModal.js";
import { AffectationListView } from "../views/agent/affectation/AffectationListView.js";

// import { HistoriqueListView } from "../views/agent/historique/HistoriqueListView.js";

export const agentRoutes = [
  {
    path: "/agent/etudiant",
    component: EtudiantListView,
    meta: {
      layout: "agent",
      requiresAuth: true,
      requiredRole: "agent",
      title: "Liste des étudiants",
    },
    guards: [AgentActifGuard, AuthGuard, AgentGuard],
  },
  {
    path: "/agent/chambre",
    component: ChambreListView,
    meta: {
      layout: "agent",
      requiresAuth: true,
      requiredRole: "agent",
      title: "Liste des chambres",
    },
    guards: [AgentActifGuard, AuthGuard, AgentGuard],
  },
  {
    path: "/agent/affectation",
    component: AffectationListView,
    meta: {
      layout: "agent",
      requiresAuth: true,
      requiredRole: "agent",
      title: "Affectations",
    },
    guards: [AgentActifGuard, AuthGuard, AgentGuard],
  },
  // {
  //   path: "/agent/historiques",
  //   component: HistoriqueListView,
  //   meta: {
  //     layout: "agent",
  //     requiresAuth: true,
  //     requiredRole: "agent",
  //     title: "Historique des opérations",
  //   },
  //   guards: [AgentActifGuard, AuthGuard, AgentGuard],
  // },
];
