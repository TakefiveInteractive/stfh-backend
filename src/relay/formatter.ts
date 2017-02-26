export let formatRoomKey = (key) => `room#${key}`;

export let formatRoomViewerKey = (roomId, viewerId) => `room#${roomId}:viewer:${viewerId}`;

export let formatRoomBroadcasterKey = (roomId) => `room#${roomId}:broadcaster`;

export let formatRoomViewersList = roomId => `room#${roomId}:viewers`;