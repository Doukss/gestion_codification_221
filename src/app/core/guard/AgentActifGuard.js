export const AgentActifGuard = {
  execute: async (app) => {
    const state = app.store.getState();

    // Vérifie que l'utilisateur est bien un agent
    if (state.role !== "agent") {
      return { redirect: "/unauthorized" };
    }

    // Vérifie que le compte est actif
    if (state.user?.deleted === true) {
      app.services.notifications.show("Votre compte agent est désactivé", "error");
      app.getController("Auth").clearSession();
      return { redirect: "/unauthorized" };
    }

    return { granted: true };
  },
};
