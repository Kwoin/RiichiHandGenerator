const types = {
  MAN: "m",
  PIN: "p",
  SOU: "s",
  TON: "T",
  NAN: "N",
  SHAA: "S",
  PEI: "P",
  HAKU: "B",
  HATSU: "V",
  CHUN: "R"
}

const map = {
  [types.TON]: "Ton",
  [types.NAN]: "Nan",
  [types.SHAA]: "Shaa",
  [types.PEI]: "Pei",
  [types.HAKU]: "Haku",
  [types.HATSU]: "Hatsu",
  [types.CHUN]: "Chun",
  [types.MAN]: "Man",
  [types.PIN]: "Pin",
  [types.SOU]: "Sou"
}

const regexMan = /(\d+)m/;
const regexPin = /(\d+)p/;
const regexSou = /(\d+)s/;
const regexHonors = /([TNSPBVR]+)/;
const regexSeparator = /\s+/;
const regexInclinaison = /\((\d\))$/;
const regexHiddenKan = /\(h\)$/;
const tilesPath = "./vendor/tiles/ComposedRegular/";

function parse(value) {
  const groups = value.split(regexSeparator)
      .map(parseGroup);
  return groups;
}

function parseGroup(value) {
  const res = [];
  res.push(...parseGroupWithRegex(value, regexMan, types.MAN));
  res.push(...parseGroupWithRegex(value, regexPin, types.PIN));
  res.push(...parseGroupWithRegex(value, regexSou, types.SOU));
  res.push(...parseGroupWithRegex(value, regexHonors));
  const inclinaisonMatch = value.match(regexInclinaison);
  if (inclinaisonMatch) {
    const index = parseInt(inclinaisonMatch[1]) - 1;
    const img = res[index];
    if (img) {
      img.setAttribute("width", img.getAttribute("height"));
      img.removeAttribute("height");
      img.src = img.src.substring(0, img.src.length - 4) + "-e.png";
      if (res.length === 4) {
        const imgNext = res[index + 1];
        imgNext.setAttribute("width", imgNext.getAttribute("height"));
        imgNext.removeAttribute("height");
        imgNext.src = imgNext.src.substring(0, imgNext.src.length - 4) + "-e.png";
        const kanWrapper = document.createElement("div");
        kanWrapper.classList = "kan-tilt";
        kanWrapper.style.width = imgNext.getAttribute("width");
        kanWrapper.append(img, imgNext);
        res[index] = kanWrapper;
        res.splice(index + 1, 1);
      }
    } else {
      res[0].src = tilesPath + "Back.png";
      res[3].src = tilesPath + "Back.png";
    }
  }
  return res;
}

function parseGroupWithRegex(value, regex, type) {
  const res = [];
  const match = value.match(regex);
  if (match) {
    const chars = match[1].split("")
    if (type) {
      res.push(...chars.map(num => getImg(type, num)));
    } else {
      res.push(...chars.map(honorType => getImg(honorType)));
    }
  }
  return res;
}

function getImg(type, num = "") {
  const tileElement = document.createElement("img");
  tileElement.src = tilesPath + map[type] + num + ".png";
  tileElement.setAttribute("height", tileSize);
  return tileElement;
}
