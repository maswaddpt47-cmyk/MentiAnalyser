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

if (typeof module !== "undefined") {
  module.exports = { byTheme, globalScore };
}
