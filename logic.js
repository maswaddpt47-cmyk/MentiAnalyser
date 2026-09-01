// logic.js — logique métier pure (calculs KPI, agrégation par thème)
// Chargé dans le navigateur via <script> ET sous Node.js via require()

const byTheme = function(qs) {
  if (!qs) qs = [];
  var map = {};
  qs.forEach(function(q) {
    var theme = q.theme, correct = q.correct, total = q.total, taux = q.taux;
    if (total === 0) return;
    if (!map[theme]) map[theme] = { theme: theme, correct: 0, total: 0, tauxSum: 0, count: 0 };
    map[theme].correct  += correct;
    map[theme].total    += total;
    map[theme].tauxSum  += (taux || 0);
    map[theme].count++;
  });
  return Object.values(map)
    .map(function(d) {
      return Object.assign({}, d, {
        taux: d.total > 0
          ? Math.min(100, Math.round(d.correct / d.total * 100))
          : (d.count > 0 ? Math.min(100, Math.round(d.tauxSum / d.count)) : 0)
      });
    })
    .sort(function(a, b) { return a.taux - b.taux; });
};

const globalScore = function(qs) {
  if (!qs) qs = [];
  var responded = qs.filter(function(q) { return q.total > 0; });
  var tot = responded.reduce(function(a, q) { return a + q.total; }, 0);
  var cor = responded.reduce(function(a, q) { return a + q.correct; }, 0);
  if (tot > 0) return Math.min(100, Math.round(cor / tot * 100));
  if (responded.length > 0) return Math.min(100, Math.round(
    responded.reduce(function(a, q) { return a + (q.taux || 0); }, 0) / responded.length
  ));
  return 0;
};

// filterSessionsByPartenaire — sous-ensemble des sessions archivées pour un organisme donné
// (mémoire de synthèse finale : regroupe tous les ateliers Menti d'un même organisme)
const filterSessionsByPartenaire = function(sessions, partenaire) {
  if (!sessions) sessions = [];
  if (!partenaire) return sessions.slice();
  return sessions.filter(function(s) { return (s.partenaire || "") === partenaire; });
};

// summarizePixArchive — normalise un export JSON PIX Analyser en résumé exploitable
// pour la synthèse finale (un export PIX = un ou plusieurs ateliers pour un partenaire)
const summarizePixArchive = function(pixPayload) {
  if (!pixPayload) return null;
  var stats = pixPayload.stats || {};
  return {
    partenaire: pixPayload.partenaire || "",
    exported: pixPayload.exported || "",
    nbT1: stats.nbT1 || 0,
    nbT2: stats.nbT2 || 0,
    nbOS: stats.nbOS || 0,
    fichiers: (pixPayload.fichiers || []).map(function(f) { return f.name; })
  };
};

// filterPixArchivesByPartenaire — sous-ensemble des exports PIX importés pour un organisme
const filterPixArchivesByPartenaire = function(pixArchives, partenaire) {
  if (!pixArchives) pixArchives = [];
  if (!partenaire) return pixArchives.slice();
  return pixArchives.filter(function(p) { return (p.partenaire || "") === partenaire; });
};

// listOrganismes — liste triée des organismes (partenaires) connus, croisant sessions Menti
// et archives PIX importées, pour peupler le sélecteur de synthèse finale
const listOrganismes = function(sessions, pixArchives) {
  var set = {};
  (sessions || []).forEach(function(s) { if (s.partenaire) set[s.partenaire] = true; });
  (pixArchives || []).forEach(function(p) { if (p.partenaire) set[p.partenaire] = true; });
  return Object.keys(set).sort(function(a, b) { return a.localeCompare(b, "fr"); });
};

if (typeof module !== "undefined") {
  module.exports = {
    byTheme, globalScore,
    filterSessionsByPartenaire, summarizePixArchive, filterPixArchivesByPartenaire, listOrganismes
  };
}
