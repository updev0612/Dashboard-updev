import * as Yup from "yup";

const petitionsAttachmentsForm: IFormElement[] = [
  {
    type: "file",
    name: "attachmentsss",
    label: "Petitions Attachments:",
    validation: {} as any
  }
];

export { petitionsAttachmentsForm };
