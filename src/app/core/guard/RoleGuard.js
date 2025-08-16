export class RoleGuard {
  static requiredRole(role) {
    return async (app) => {
      if (app.store.getState().role !== role) {
        app.services.notifications.show(`Rôle ${role} requis`, "error");
        return { redirect: "/unauthorized" };
      }
      return { granted: true };
    };
  }
}

export const AdminGuard = {
  execute: RoleGuard.requiredRole("admin"),
};

export const AgentGuard = {
  execute: RoleGuard.requiredRole("agent"),
};

export const EtudiantGuard = {
  execute: RoleGuard.requiredRole("etudiant"),
};
