const BASE_URL = "https://images.unsplash.com/";
const QUERY_STRING = "?w=800&blur=20";

const PHOTO_IDS = [
    "photo-1554629947-334ff61d85dc",
    "photo-1494783367193-149034c05e8f",
    "photo-1454372182658-c712e4c5a1db",
    "photo-1464822759023-fed622ff2c3b",
    "photo-1619441207978-3d326c46e2c9",
    "photo-1500964757637-c85e8a162699",
    "photo-1472213984618-c79aaec7fef0",
    "photo-1682685797736-dabb341dc7de",
    "photo-1601694090572-98694c8b3b85",
    "photo-1614586125858-e695dd97d1b6",
    "photo-1541890289-b86df5bafd81",
    "photo-1472214103451-9374bd1c798e",
    "photo-1490750967868-88aa4486c946",
    "photo-1606821061030-9eedf225857b",
    "photo-1592248939980-5babf7d54eb9"
];

export const BACKGROUND_IMAGES = PHOTO_IDS.map(photoId => `${BASE_URL}${photoId}${QUERY_STRING}`);
