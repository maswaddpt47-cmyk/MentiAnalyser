const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const { getColor, getLevel, normStr, rtfEncode, rtfRow, donutSVG, svgArc } = require("./utils.js");

describe("getColor", () => {
  it("acquis → vert", () => assert.equal(getColor(80), "#22c55e"));
  it("fragile → orange", () => assert.equal(getColor(60), "#f59e0b"));
  it("à renforcer → rouge", () => assert.equal(getColor(59), "#ef4444"));
  it("exactement haut → vert", () => assert.equal(getColor(80, 60, 80), "#22c55e"));
  it("seuils personnalisés", () => assert.equal(getColor(70, 50, 90), "#f59e0b"));
  it("0% → rouge", () => assert.equal(getColor(0), "#ef4444"));
  it("100% → vert", () => assert.equal(getColor(100), "#22c55e"));
});

describe("getLevel", () => {
  it("acquis label", () => assert.equal(getLevel(80).label, "Acquis"));
  it("fragile label", () => assert.equal(getLevel(70).label, "Fragile"));
  it("à renforcer label", () => assert.equal(getLevel(30).label, "À renforcer"));
  it("retourne icon", () => assert.equal(getLevel(80).icon, "✅"));
  it("retourne bg", () => assert.ok(getLevel(80).bg.startsWith("#")));
});

describe("normStr", () => {
  it("minuscules", () => assert.equal(normStr("HELLO"), "hello"));
  it("espaces multiples", () => assert.equal(normStr("a  b   c"), "a b c"));
  it("trim", () => assert.equal(normStr("  abc  "), "abc"));
  it("null → chaîne vide", () => assert.equal(normStr(null), ""));
  it("undefined → chaîne vide", () => assert.equal(normStr(undefined), ""));
  it("chaîne vide → chaîne vide", () => assert.equal(normStr(""), ""));
});

describe("rtfEncode", () => {
  it("ASCII inchangé", () => assert.equal(rtfEncode("hello"), "hello"));
  it("é encodé", () => assert.equal(rtfEncode("é"), "\\'e9"));
  it("à encodé", () => assert.equal(rtfEncode("à"), "\\'e0"));
  it("null-safe", () => assert.equal(typeof rtfEncode(null), "string"));
  it("chiffres inchangés", () => assert.equal(rtfEncode("123"), "123"));
});

describe("rtfRow", () => {
  it("retourne une chaîne", () => assert.equal(typeof rtfRow(["A", "B"], [2000, 3000]), "string"));
  it("contient \\trowd", () => assert.ok(rtfRow(["A"], [2000]).includes("\\trowd")));
  it("header contient clcbpat1", () => assert.ok(rtfRow(["A"], [2000], true).includes("\\clcbpat1")));
  it("non-header ne contient pas clcbpat1", () => assert.ok(!rtfRow(["A"], [2000], false).includes("\\clcbpat1")));
});

describe("donutSVG", () => {
  it("retourne une chaîne SVG", () => assert.ok(donutSVG(75, "#22c55e").startsWith("<svg")));
  it("contient le score", () => assert.ok(donutSVG(75, "#22c55e").includes("75%")));
  it("contient la couleur", () => assert.ok(donutSVG(75, "#22c55e").includes("#22c55e")));
  it("0% fonctionne", () => assert.ok(donutSVG(0, "#ef4444").includes("0%")));
  it("100% fonctionne", () => assert.ok(donutSVG(100, "#22c55e").includes("100%")));
});

describe("svgArc", () => {
  it("retourne un path SVG", () => assert.ok(svgArc(70, 70, 62, 0, 50, "#22c55e").startsWith("<path")));
  it("contient la couleur", () => assert.ok(svgArc(70, 70, 62, 0, 50, "#22c55e").includes("#22c55e")));
  it("arc > 50% → large-arc-flag 1", () => assert.ok(svgArc(70, 70, 62, 0, 51, "#fff").includes(",1 ")));
  it("arc ≤ 50% → large-arc-flag 0", () => assert.ok(svgArc(70, 70, 62, 0, 50, "#fff").includes(",1 ") === false || svgArc(70, 70, 62, 0, 50, "#fff").includes("0,1")));
});
