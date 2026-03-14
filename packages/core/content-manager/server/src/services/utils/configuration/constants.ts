/**
 * System fields for Content Manager configuration.
 * Central definition to avoid scattered hardcoding of id/documentId.
 */
export const SYSTEM_FIELDS = {
  ID: 'id',
  DOCUMENT_ID: 'documentId',
} as const;

export const CONTENT_TYPE_SYSTEM_FIELDS = [
  SYSTEM_FIELDS.ID,
  SYSTEM_FIELDS.DOCUMENT_ID,
] as const;

export const SYSTEM_FIELD_METADATAS: Record<
  string,
  { edit: object; list: { label: string; searchable: boolean; sortable: boolean } }
> = {
  [SYSTEM_FIELDS.ID]: {
    edit: {},
    list: { label: 'id', searchable: true, sortable: true },
  },
  [SYSTEM_FIELDS.DOCUMENT_ID]: {
    edit: {},
    list: { label: 'documentId', searchable: true, sortable: true },
  },
};

export const SYSTEM_FIELD_ATTRIBUTES: Record<string, { type: string }> = {
  [SYSTEM_FIELDS.ID]: { type: 'integer' },
  [SYSTEM_FIELDS.DOCUMENT_ID]: { type: 'string' },
};
