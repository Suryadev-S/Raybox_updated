// schema.ts

export const schema = `
CREATE TABLE IF NOT EXISTS bins (
    id TEXT PRIMARY KEY,
    parent_id TEXT REFERENCES bins(id)
        ON DELETE CASCADE,
    name TEXT NOT NULL,
    ancestor_path TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,

    UNIQUE(parent_id, name)
);

CREATE INDEX IF NOT EXISTS idx_bins_parent_id
ON bins(parent_id);

CREATE INDEX IF NOT EXISTS idx_bins_ancestor_path
ON bins(ancestor_path);

-----------------------------------------------------

CREATE TABLE IF NOT EXISTS files (
    id TEXT PRIMARY KEY,

    parent_bin_id TEXT NOT NULL
        REFERENCES bins(id)
        ON DELETE CASCADE,

    -- Immutable name from the original imported file
    original_name TEXT NOT NULL,

    -- User-controlled logical/display name
    file_name TEXT NOT NULL,

    storage_path TEXT NOT NULL,
    ancestor_path TEXT NOT NULL,

    mime_type TEXT NOT NULL,

    type TEXT NOT NULL CHECK (
        type IN (
            'image',
            'video',
            'audio',
            'document',
            'archive',
            'other'
        )
    ),

    extension TEXT,

    size_bytes INTEGER NOT NULL,

    checksum TEXT NOT NULL,

    width INTEGER,
    height INTEGER,

    duration REAL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at DATETIME,

    UNIQUE(parent_bin_id, file_name)
);

CREATE INDEX IF NOT EXISTS idx_files_parent_bin_id
ON files(parent_bin_id);

CREATE INDEX IF NOT EXISTS idx_files_checksum
ON files(checksum);

-----------------------------------------------------

CREATE TABLE IF NOT EXISTS thumbs (
    id TEXT PRIMARY KEY,

    file_id TEXT NOT NULL
        REFERENCES files(id)
        ON DELETE CASCADE,

    kind TEXT NOT NULL,

    storage_path TEXT NOT NULL,

    mime_type TEXT NOT NULL,

    width INTEGER,
    height INTEGER,

    size_bytes INTEGER,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    UNIQUE(file_id, kind)
);

CREATE INDEX IF NOT EXISTS idx_thumbs_file_id
ON thumbs(file_id);
`;