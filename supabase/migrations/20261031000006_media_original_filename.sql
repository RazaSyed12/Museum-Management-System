-- ============================================================
-- BE-08: Uploads and media associations — original filename
-- ============================================================
-- The only genuinely missing piece of BE-08: the doc asks for a persistent
-- media ID, URL, original filename and alt text on upload. Everything else
-- (upload, magic-byte validation, attach/detach/reorder for collections,
-- events AND artefacts, shared media, non-destructive unlink) already
-- works — see media.ts and its BE-05 extension.
-- ============================================================

alter table media add column original_filename varchar;

comment on column media.original_filename is
  'The filename the uploader sent (e.g. "coin-front.jpg"), for display only — the storage path is independent and never derived from this.';
