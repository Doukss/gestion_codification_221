import { Modal } from "../../../components/modal/Modal.js";
import { validators } from "../../../utils/Validator.js";

export class AssignChambreModal {
  constructor(app, config = {}) {
    this.app = app;
    this.controller = app.getController("assignation");
    this.config = config;
    this.service = app.getService("chambres");
    this.etudiantService = app.getService("etudiants");
    this.init();
  }

  open() {
    this.form.reset();
    Object.keys(this.fields).forEach((field) => this.clearError(field));
    this.initForm();
    this.modal.open();
  }

  init() {
    this.createForm();
    this.setupModal();
    this.setupValidation();
    this.setupEvents();
    this.initForm();
  }

  createForm() {
    this.form = document.createElement("form");
    this.form.className = "space-y-4";
    this.form.noValidate = true;
    this.form.innerHTML = this.getFormTemplate();
  }

  getFormTemplate() {
    return `
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Sélection étudiant -->
        <div class="form-control md:col-span-2">
          <label class="label">
            <span class="label-text">Étudiant <span class="text-error">*</span></span>
          </label>
          <select name="etudiantId" class="select select-bordered select-primary" required>
            <option value="">-- Sélectionner --</option>
          </select>
          <div data-error="etudiantId" class="text-error text-sm mt-1 hidden"></div>
        </div>

        <!-- Sélection chambre -->
        <div class="form-control md:col-span-2">
          <label class="label">
            <span class="label-text">Chambre <span class="text-error">*</span></span>
          </label>
          <select name="chambreId" class="select select-bordered select-primary" required>
            <option value="">-- Sélectionner --</option>
          </select>
          <div data-error="chambreId" class="text-error text-sm mt-1 hidden"></div>
        </div>
    </div>
    `;
  }

  setupModal() {
    this.modal = new Modal({
      title: this.config.title || "Assigner une chambre",
      content: this.form,
      size: "lg",
      footerButtons: this.getFooterButtons(),
    });
  }

  getFooterButtons() {
    return [
      {
        text: "Annuler",
        className: "btn-ghost",
        action: "cancel",
        onClick: () => this.close(),
      },
      {
        text: "Assigner",
        className: "btn-primary",
        action: "submit",
        onClick: (e) => this.handleSubmit(e),
        closeOnClick: false,
      },
    ];
  }

  async initForm() {
    // Charger les étudiants éligibles
    const etudiants = await this.etudiantService.getAll();
    const etudiantSelect = this.form.querySelector("[name='etudiantId']");
    etudiants.forEach((e) => {
      const option = document.createElement("option");
      option.value = e.id;
      option.textContent = `${e.nom} ${e.prenom} (Moy: ${e.moyenne})`;
      etudiantSelect.appendChild(option);
    });

    // Charger les chambres libres
    const chambres = await this.service.getDisponibles();
    const chambreSelect = this.form.querySelector("[name='chambreId']");
    chambres.forEach((c) => {
      const option = document.createElement("option");
      option.value = c.id;
      option.textContent = `${c.code} - ${c.bloc} / Étage ${c.etage}`;
      chambreSelect.appendChild(option);
    });
  }

  setupValidation() {
    this.fields = {
      etudiantId: {
        value: "",
        error: "",
        validator: async (v) => {
          if (!validators.required(v)) return "L'étudiant est requis";
          const etudiant = await this.etudiantService.getById(v);
          if (etudiant.moyenne < 11.9) {
            return "Cet étudiant n'est pas éligible (moyenne < 11.90)";
          }
          return null;
        },
      },
      chambreId: {
        value: "",
        error: "",
        validator: (v) =>
          validators.required(v) ? null : "La chambre est requise",
      },
    };
  }

  async handleSubmit(e) {
    e.preventDefault();

    if (!(await this.validateForm())) {
      return;
    }

    this.modal.setButtonLoading("submit", true, "Assignation en cours...");

    try {
      const formData = await this.getFormData();
      await this.processFormData(formData);
      this.close();
    } catch (error) {
      this.handleSubmitError(error);
    } finally {
      this.modal.setButtonLoading("submit", false);
    }
  }

  async getFormData() {
    const formData = new FormData(this.form);
    return {
      etudiantId: formData.get("etudiantId"),
      chambreId: formData.get("chambreId"),
    };
  }

  async processFormData(formData) {
    // Appel API pour affecter
    await this.service.assignerChambre(formData.etudiantId, formData.chambreId);
    this.app.services.notifications.show("Chambre assignée avec succès", "success");
  }

  async validateForm() {
    let isValid = true;
    for (const field of Object.keys(this.fields)) {
      await this.validateField(field);
      if (this.fields[field].error) isValid = false;
    }
    return isValid;
  }

  async validateField(name) {
    if (!this.fields[name]) return;
    const input = this.form.querySelector(`[name="${name}"]`);
    const value = input.value;
    this.fields[name].value = value;
    const result = await this.fields[name].validator(value);
    this.fields[name].error = typeof result === "string" ? result : "";
    this.displayError(name);
  }

  displayError(name, customError = null) {
    const error = customError || this.fields[name]?.error;
    const errorElement = this.form.querySelector(`[data-error="${name}"]`);
    if (errorElement) {
      errorElement.textContent = error || "";
      errorElement.classList.toggle("hidden", !error);
    }
  }

  clearError(name) {
    this.displayError(name, "");
  }

  close() {
    this.modal.close();
  }
}
