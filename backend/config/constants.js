export const roadKeywords = [
  "pothole",
  "tar",
  "asphalt",
  "crack",
  "damaged",
  "broken",
  "pavement",
  "puddle",
  "mudflat",
  "road",
  "street",
  "lane",
  "highway",
  "path",
  "trail",
  "distress",
  "surface",
  "rut",
  "erosion",
];

export const garbageKeywords = [
  "garbage",
  "trash",
  "waste",
  "dump",
  "litter",
  "junk",
  "plastic",
  "bin",
  "rubbish",
  "debris",
  "pollution",
];

export const waterKeywords = [
  "water",
  "leak",
  "pipe",
  "flood",
  "overflow",
  "sewage",
  "drain",
  "wet floor",
  "puddle",
  "spill",
];

export const electricityKeywords = [
  "light",
  "lamp",
  "bulb",
  "streetlight",
  "electrical",
  "wire",
  "cable",
  "transformer",
  "pole",
  "dark",
  "shadow",
];

export const treeKeywords = [
  "tree",
  "fallen",
  "branch",
  "log",
  "forest",
  "timber",
  "collapse",
];

export const fireKeywords = [
  "fire",
  "flame",
  "burn",
  "smoke",
  "heat",
  "explosion",
];

export const accidentKeywords = [
  "accident",
  "vehicle",
  "car",
  "bike",
  "crash",
  "collision",
  "wreck",
  "damage",
];

export const noiseKeywords = [
  "crowd",
  "horn",
  "speaker",
  "concert",
  "traffic",
  "festival",
  "party",
];

export const hasKeyword = (tags, keywords) => {
  return keywords.some((keyword) => tags.includes(keyword));
};
