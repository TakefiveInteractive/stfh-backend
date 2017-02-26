export let formatRoomKey = (key) => `room#${key}`;

export let formatRoomViewerKey = (roomId, viewerId) => `room#${roomId}:viewer:${viewerId}`;

export let formatRoomBroadcasterKey = (roomId) => `room#${roomId}:broadcaster`;

export let formatRoomViewersListKey = roomId => `room#${roomId}:viewers`;

export let formatRoomFileListKey = roomId => `room#${roomId}:files`;

export let formatRoomEditorState = roomId => `room#${roomId}:editorstate`;

export let formatRoomFileState = (roomId, filepath) => `room#${roomId}:file#${filepath}`;

export let formatRoomEditorCursor = roomId => `room#${roomId}:editor:cursor`;