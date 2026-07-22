// utils.js — fonctions bas niveau, pures (pas de DOM, pas de React, pas d'état)
// Chargé dans le navigateur via <script> ET sous Node.js via require()

function getColor(t, bas, haut) {
  if (bas === undefined) bas = 60;
  if (haut === undefined) haut = 80;
  return t >= haut ? "#22c55e" : t >= bas ? "#f59e0b" : "#ef4444";
}

function getLevel(t, bas, haut) {
  if (bas === undefined) bas = 60;
  if (haut === undefined) haut = 80;
  return t >= haut
    ? { label:"Acquis",      icon:"✅", color:"#16a34a", bg:"#f0fdf4" }
    : t >= bas
    ? { label:"Fragile",     icon:"⚠️", color:"#d97706", bg:"#fffbeb" }
    : { label:"À renforcer", icon:"🔴", color:"#dc2626", bg:"#fef2f2" };
}

function normStr(s) {
  return String(s || "").toLowerCase().replace(/\s+/g, " ").trim();
}

function rtfEncode(str) {
  return String(str).replace(/[^\x00-\x7E]/g, c => {
    const cp = c.charCodeAt(0);
    return cp < 256 ? `\\'${cp.toString(16).padStart(2, "0")}` : "";
  });
}

function rtfRow(cells, widths, isHeader) {
  if (isHeader === undefined) isHeader = false;
  var pos = 0;
  var cellDefs = widths.map(function(w) {
    pos += w;
    var shade = isHeader ? "\\clcbpat1" : "";
    return "\\clbrdrt\\brdrw15\\brdrs\\clbrdrl\\brdrw15\\brdrs\\clbrdrb\\brdrw15\\brdrs\\clbrdrr\\brdrw15\\brdrs" + shade + "\\cellx" + pos;
  }).join("");
  var cellContents = cells.map(function(c) {
    var fmt = isHeader ? "\\b\\cf2 " : "\\cf0 ";
    return "\\pard\\intbl\\sb40\\sa40\\sl276\\slmult1 " + fmt + "\\fs20 " + rtfEncode(c) + "\\b0\\cell";
  }).join("\n");
  return "\\trowd\\trgaph108\\trrh-320\n" + cellDefs + "\n" + cellContents + "\n\\row\n\\pard";
}

function donutSVG(score, color) {
  var r = 34, c = 2 * Math.PI * r, off = c * (1 - score / 100);
  return '<svg width="92" height="92" viewBox="0 0 92 92">' +
    '<circle cx="46" cy="46" r="' + r + '" fill="none" stroke="#e2e8f0" stroke-width="9"/>' +
    '<circle cx="46" cy="46" r="' + r + '" fill="none" stroke="' + color + '" stroke-width="9"' +
    ' stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '" stroke-linecap="round"' +
    ' transform="rotate(-90 46 46)"/>' +
    '<text x="46" y="51" text-anchor="middle" font-size="17" font-weight="900" fill="' + color + '"' +
    ' font-family="Segoe UI,Arial,sans-serif">' + score + '%</text>' +
    '</svg>';
}

function svgArc(cx, cy, r, startPct, endPct, color) {
  var s = startPct / 100 * 2 * Math.PI - Math.PI / 2;
  var e = endPct   / 100 * 2 * Math.PI - Math.PI / 2;
  var x1 = cx + r * Math.cos(s), y1 = cy + r * Math.sin(s);
  var x2 = cx + r * Math.cos(e), y2 = cy + r * Math.sin(e);
  var lg = (endPct - startPct) > 50 ? 1 : 0;
  return '<path d="M' + cx + ',' + cy + ' L' + x1 + ',' + y1 +
    ' A' + r + ',' + r + ' 0 ' + lg + ',1 ' + x2 + ',' + y2 + ' Z" fill="' + color + '"/>';
}

if (typeof module !== "undefined") {
  module.exports = { getColor, getLevel, normStr, rtfEncode, rtfRow, donutSVG, svgArc };
}
