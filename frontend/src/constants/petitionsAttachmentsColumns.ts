import { IColumn } from "office-ui-fabric-react";

export const petitionsAttachmentsColumns: IColumn[] = [
  {
    key: "petitionsAttachments",
    name: "Petitions attachments",
    fieldName: "url",
    minWidth: 150,
    maxWidth: 600,
    isResizable: true,
    data: "link"
  }
];
