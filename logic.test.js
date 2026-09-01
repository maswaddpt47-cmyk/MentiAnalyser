const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  byTheme, globalScore,
  filterSessionsByPartenaire, summarizePixArchive, filterPixArchivesByPartenaire, listOrganismes
} = require("./logic.js");

const q = (theme, correct, total, taux) => ({ theme, correct, total, taux: taux !== undefined ? taux : (total > 0 ? Math.round(correct/total*100) : 0) });

describe("globalScore", () => {
  it("liste vide → 0", () => assert.equal(globalScore([]), 0));
  it("undefined → 0", () => assert.equal(globalScore(), 0));
  it("calcul pondéré simple", () => assert.equal(globalScore([q("A",8,10), q("A",6,10)]), 70));
  it("exclut les questions total=0", () => assert.equal(globalScore([q("A",0,0,0), q("A",8,10)]), 80));
  it("ne dépasse pas 100%", () => assert.equal(globalScore([q("A",15,10)]), 100));
  it("toutes à 0 réponses → 0", () => assert.equal(globalScore([q("A",0,0,0)]), 0));
  it("questions uniquement avec taux (total=0 exclu, mais taux direct)", () => {
    // Si toutes ont total=0, score = 0
    const qs = [{ theme:"A", correct:0, total:0, taux:80 }];
    assert.equal(globalScore(qs), 0);
  });
  it("arrondi correct", () => assert.equal(globalScore([q("A",1,3)]), 33));
});

describe("byTheme", () => {
  it("liste vide → tableau vide", () => assert.deepEqual(byTheme([]), []));
  it("undefined → tableau vide", () => assert.deepEqual(byTheme(), []));

  it("agrège par thème", () => {
    const qs = [q("Maths",8,10), q("Maths",6,10)];
    const res = byTheme(qs);
    assert.equal(res.length, 1);
    assert.equal(res[0].theme, "Maths");
    assert.equal(res[0].correct, 14);
    assert.equal(res[0].total, 20);
    assert.equal(res[0].taux, 70);
  });

  it("exclut les questions total=0", () => {
    const qs = [q("A",0,0,0), q("A",8,10)];
    const res = byTheme(qs);
    assert.equal(res.length, 1);
    assert.equal(res[0].total, 10);
  });

  it("ne dépasse pas 100%", () => {
    const qs = [q("A",15,10)]; // correct > total (multi-sélection)
    const res = byTheme(qs);
    assert.ok(res[0].taux <= 100);
  });

  it("tri croissant par taux", () => {
    const qs = [q("B",9,10), q("A",3,10), q("C",6,10)];
    const res = byTheme(qs);
    assert.equal(res[0].theme, "A"); // 30%
    assert.equal(res[1].theme, "C"); // 60%
    assert.equal(res[2].theme, "B"); // 90%
  });

  it("deux thèmes distincts", () => {
    const qs = [q("Maths",8,10), q("Français",4,10)];
    const res = byTheme(qs);
    assert.equal(res.length, 2);
  });

  it("pas de division par zéro si count=0", () => {
    // ne devrait pas arriver (total=0 filtré), mais défense en profondeur
    assert.doesNotThrow(() => byTheme([q("A",0,0,0)]));
  });
});

describe("filterSessionsByPartenaire", () => {
  const s = (partenaire) => ({ id: Math.random(), partenaire, questions: [] });

  it("undefined → tableau vide", () => assert.deepEqual(filterSessionsByPartenaire(undefined, "X"), []));
  it("pas de partenaire → renvoie toutes les sessions", () => {
    const sessions = [s("A"), s("B")];
    assert.equal(filterSessionsByPartenaire(sessions, "").length, 2);
  });
  it("filtre sur le partenaire exact", () => {
    const sessions = [s("Mairie"), s("École"), s("Mairie")];
    const res = filterSessionsByPartenaire(sessions, "Mairie");
    assert.equal(res.length, 2);
    assert.ok(res.every(x => x.partenaire === "Mairie"));
  });
  it("aucune session ne correspond → tableau vide", () => {
    assert.deepEqual(filterSessionsByPartenaire([s("A")], "Z"), []);
  });
});

describe("summarizePixArchive", () => {
  it("payload vide/undefined → null", () => assert.equal(summarizePixArchive(undefined), null));
  it("normalise un export PIX complet", () => {
    const payload = {
      partenaire: "Mairie", exported: "2026-01-15T10:00:00.000Z",
      stats: { nbT1: 12, nbT2: 8, nbOS: 3 },
      fichiers: [{ name: "export1.csv" }, { name: "export2.csv" }]
    };
    const res = summarizePixArchive(payload);
    assert.equal(res.partenaire, "Mairie");
    assert.equal(res.nbT1, 12);
    assert.equal(res.nbT2, 8);
    assert.equal(res.nbOS, 3);
    assert.deepEqual(res.fichiers, ["export1.csv", "export2.csv"]);
  });
  it("champs manquants → valeurs par défaut", () => {
    const res = summarizePixArchive({});
    assert.equal(res.partenaire, "");
    assert.equal(res.nbT1, 0);
    assert.deepEqual(res.fichiers, []);
  });
});

describe("filterPixArchivesByPartenaire", () => {
  const p = (partenaire) => ({ partenaire, stats: {} });

  it("undefined → tableau vide", () => assert.deepEqual(filterPixArchivesByPartenaire(undefined, "X"), []));
  it("filtre sur le partenaire exact", () => {
    const archives = [p("Mairie"), p("École")];
    assert.equal(filterPixArchivesByPartenaire(archives, "École").length, 1);
  });
});

describe("listOrganismes", () => {
  it("aucune donnée → tableau vide", () => assert.deepEqual(listOrganismes([], []), []));
  it("croise sessions Menti et archives PIX, dédoublonne et trie", () => {
    const sessions = [{ partenaire: "Mairie" }, { partenaire: "École" }];
    const pixArchives = [{ partenaire: "Mairie" }, { partenaire: "Association" }];
    assert.deepEqual(listOrganismes(sessions, pixArchives), ["Association", "École", "Mairie"]);
  });
  it("ignore les partenaires vides", () => {
    assert.deepEqual(listOrganismes([{ partenaire: "" }, { partenaire: "Mairie" }], []), ["Mairie"]);
  });
});
