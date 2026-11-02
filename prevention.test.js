const {test} = require('node:test');
const assert = require('node:assert/strict');
const P = require('./prevention.js');
const q = patch => P.normalizeQuestion({q:'Habitudes fictives',responseType:'multiple',respondents:4,options:[{label:'Option A',count:3,percent:75},{label:'Option B',count:2,percent:50}],...patch});

test('les réponses multiples restent des déclarations, sans cumul ni note',()=>{
  const question=q();
  assert.deepEqual(P.warnings(question,4),[]);
  assert.equal(P.optionValue(question,question.options[0]),'3 sur 4 · 75 %');
  const html=P.reportHTML({version:P.VERSION,meta:{group:'Groupe fictif',classSize:4},questions:[question]});
  assert.match(html,/3 sur 4 · 75 %/);
  assert.match(html,/2 sur 4 · 50 %/);
  assert.doesNotMatch(html,/score global|Parfaitement maîtrisés|Acquis|Fragile|bonne.s. réponse/i);
});

test('un pourcentage visible ne devient ni effectif ni dénominateur',()=>{
  const question=q({respondents:null,options:[{label:'Effet déclaré',count:null,percent:80}]});
  assert.equal(question.respondents,null);
  assert.equal(question.options[0].count,null);
  assert.equal(P.optionValue(question,question.options[0]),'80 % affichés');
  assert.match(P.warnings(question,4).join(' '),/non visible/);
  const unknown=q({options:[{label:'Inconnu',count:null,percent:null},{label:'Zéro réel',count:0,percent:0}]});
  assert.equal(P.optionValue(unknown,unknown.options[0]),'Valeur non visible');
  assert.equal(P.optionValue(unknown,unknown.options[1]),'0 sur 4 · 0 %');
});

test('les erreurs de dénominateur et contributions libres restent signalées',()=>{
  assert.match(P.warnings(q({responseType:'single'}),4).join(' '),/somme des effectifs/);
  assert.match(P.warnings(q({options:[{label:'A',count:3,percent:10}]}),4).join(' '),/divergent/);
  assert.match(P.warnings(q({respondents:6}),4).join(' '),/Plus de répondants/);
  const free=q({responseType:'free',options:[{label:'0',count:2},{label:'8',count:3}]});
  assert.match(P.warnings(free,4).join(' '),/aucune moyenne/);
  assert.equal(P.optionValue(free,free.options[0]),'2 contribution(s)');
  assert.throws(()=>q({options:[{label:'A',count:-1}]}));
  assert.throws(()=>q({options:[{label:'A',percent:150}]}));
});

test('JSON versionné : conservation des options et rejet des anciennes notes',()=>{
  const session={version:P.VERSION,meta:{classSize:4,group:'Groupe fictif'},questions:[q()]};
  assert.deepEqual(P.validateSession(JSON.parse(JSON.stringify(P.validateSession(session)))),P.validateSession(session));
  assert.throws(()=>P.validateSession({questions:[{q:'Ancien quiz',correct:4,total:4}]}),/réimportation/);
  assert.throws(()=>P.normalizeQuestion({q:'Ancien quiz',correct:4,total:4}),/ancienne note/);
});

test('le rapport échappe toutes les données importées et garde la provenance',()=>{
  const html=P.reportHTML({version:P.VERSION,meta:{title:'<img src=x onerror=alert(1)>',actions:'<script>bad()</script>',classSize:4},questions:[q({q:'<svg onload=alert(1)>',sourceFile:'source.png',note:'<img src=x>'})]});
  assert.doesNotMatch(html,/<img|<script|<svg/);
  assert.match(html,/&lt;svg/);
  assert.match(html,/source.png/);
  assert.match(html,/ne constituent pas un diagnostic médical/);
});
