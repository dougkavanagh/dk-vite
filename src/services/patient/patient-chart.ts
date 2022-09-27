import { getHnSystem, Identifier } from "../core/core-model";
import { Patient, HN_CODE } from "./patient-model";
import { PtResource } from "./pt-resource-model";

export type { Patient };
export { HN_CODE };
export class PatientChartClass {
  public patient: Patient;
  public resources?: PtResource[];
  constructor({
    patient,
    resources,
  }: {
    patient: Patient;
    resources?: PtResource[];
  }) {
    this.patient = patient;
    this.resources = resources;
  }

  getId(patient: Patient, code: string): Identifier | undefined {
    return patient.ids?.find((i) => i.type?.value === code);
  }
  setId(patient: Patient, id: Identifier): Identifier {
    const existingId = this.getId(patient, id.type?.value ?? "");
    if (!existingId) {
      if (!patient.ids) {
        patient.ids = [];
      }
      patient.ids.push(id);
    }
    return id;
  }
  getHn() {
    return this.getId(this.patient, HN_CODE);
  }
  setHn(hn: string, province?: string): Identifier {
    const id = this.setId(this.patient, {
      type: { value: HN_CODE },
      value: hn,
    });
    if (province) {
      id.type!.system = getHnSystem(province);
    }
    return id;
  }
  addNewResource(resource: PtResource) {
    if (!this.resources) {
      this.resources = [];
    }
    this.resources.push(resource);
    return resource;
  }
}

export function PatientChart(chartData: {
  patient: Patient;
  resources?: PtResource[];
}): PatientChartI {
  const patient = chartData.patient;
  function getId(patient: Patient, code: string): Identifier | undefined {
    return patient.ids?.find((i) => i.type?.value === code);
  }
  function setId(patient: Patient, id: Identifier): Identifier {
    const existingId = getId(patient, id.type?.value ?? "");
    if (!existingId) {
      if (!patient.ids) {
        patient.ids = [];
      }
      patient.ids.push(id);
    }
    return id;
  }
  function getHn() {
    return getId(patient, HN_CODE);
  }
  function setHn(hn: string, province?: string): Identifier {
    const id = setId(patient, { type: { value: HN_CODE }, value: hn });
    if (province) {
      id.type!.system = getHnSystem(province);
    }
    return id;
  }
  function addNewResource(resource: PtResource) {
    if (!chartData.resources) {
      chartData.resources = [];
    }
    chartData.resources.push(resource);
    return resource;
  }
  return {
    patient,
    resources: chartData.resources,
    addNewResource,
    getHn,
    setHn,
    getId,
    setId,
  };
}
export interface PatientChartI {
  patient: Patient;
  resources?: PtResource[];
  setId: (patient: Patient, id: Identifier) => Identifier;
  getId: (patient: Patient, code: string) => Identifier | undefined;
  getHn: () => Identifier | undefined;
  setHn: (hn: string, province?: string | undefined) => Identifier;
  addNewResource(args: { sourceId?: string }): PtResource;
}
