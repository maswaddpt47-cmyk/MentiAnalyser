// Contre-preuves dans des copies temporaires ; aucun fichier du dépôt n'est modifié.
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const {spawnSync} = require('node:child_process');
const root = path.resolve(__dirname, '..');
const mutations = [
  ['pourcentage utilisé comme effectif', 'prevention.js', 'count: number(o.count, true)', 'count: number(o.percent, true)'],
  ['pourcentage source utilisé à la place du calcul', 'prevention.js', 'Math.round(o.count / q.respondents * 1000) / 10', 'o.percent'],
  ['sous-total en réponse unique ignoré', 'prevention.js', 'sum !== q.respondents', 'sum > q.respondents'],
  ['contrôle du total des pourcentages désactivé', 'prevention.js', "q.responseType === 'single' && percentagesKnown", 'false && percentagesKnown'],
  ['contributions libres comptées comme personnes', 'prevention.js', "q.responseType !== 'free' && q.respondents !== null", 'q.respondents !== null'],
  ['fin du PDF perdue après une question invalide', 'MentiAnalyser.html', 'Prevention.collectQuestions(items, files[i].name, results, errors);', 'for (const item of items) { const survey = Prevention.normalizeQuestion(item, files[i].name); results.push({...survey, id:results.length+1}); }'],
  ['contenus importés non échappés', 'prevention.js', 'const esc = s =>', "const esc = s => String(s ?? ''); const unusedEscape = s =>"],
];
const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'menti-mutations-'));
try {
  const baseline = spawnSync(process.execPath,['--test','prevention.test.js'],{cwd:root,encoding:'utf8',timeout:15000});
  const expectedTests = baseline.stdout?.match(/\btests (\d+)\b/)?.[1];
  if (baseline.error || baseline.status !== 0 || !expectedTests || Number(expectedTests) === 0)
    throw new Error('La suite de référence doit réussir avant de mesurer les mutations.');
  for (const [label, filename, before, after] of mutations) {
    for (const file of ['prevention.js','prevention.test.js','MentiAnalyser.html'])
      fs.copyFileSync(path.join(root,file), path.join(temp,file));
    const target = path.join(temp,filename), source = fs.readFileSync(target,'utf8');
    if (!source.includes(before)) throw new Error(`Mutation à actualiser : ${label}`);
    fs.writeFileSync(target,source.replace(before,after));
    const result = spawnSync(process.execPath,['--test','prevention.test.js'],{cwd:temp,encoding:'utf8',timeout:15000});
    if (result.error || result.signal || result.status === null) throw result.error || new Error(`Exécution interrompue : ${label}`);
    if (result.stdout.match(/\btests (\d+)\b/)?.[1] !== expectedTests || !/\bfail [1-9]\d*\b/.test(result.stdout) || result.status === 0)
      throw new Error(`Mutation non détectée ou tests non exécutés : ${label}\n${result.stdout}\n${result.stderr}`);
    console.log(`Détectée : ${label}`);
  }
  console.log(`${mutations.length} mutations détectées sur ${mutations.length}.`);
} finally { fs.rmSync(temp,{recursive:true,force:true}); }
