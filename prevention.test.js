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

test('les champs numériques rejettent les conversions implicites en faux zéros',()=>{
  for (const value of [true,false,[],[0],{},'   ','abc',Infinity,NaN]) {
    assert.throws(()=>q({respondents:value}),`respondents: ${JSON.stringify(value)}`);
    assert.throws(()=>q({options:[{label:'A',count:value}]}));
    assert.throws(()=>q({options:[{label:'A',percent:value}]}));
    assert.throws(()=>P.validateSession({version:P.VERSION,meta:{classSize:value},questions:[]}));
  }
  const numeric=q({respondents:' 4 ',options:[{label:'A',count:'0',percent:'12.5'}]});
  assert.equal(numeric.respondents,4);
  assert.equal(numeric.options[0].count,0);
  assert.equal(numeric.options[0].percent,12.5);
  for(const value of [null,undefined,''])assert.equal(q({respondents:value}).respondents,null);
});

test('le pourcentage calculé utilise les effectifs, même si le pourcentage source diverge',()=>{
  const question=q({options:[{label:'A',count:3,percent:10}]});
  assert.equal(P.optionValue(question,question.options[0]),'3 sur 4 · 75 %');
  assert.match(P.warnings(question,4).join(' '),/divergent/);
  const thirds=q({respondents:3,options:[{label:'A',count:1},{label:'B',count:2}]});
  assert.equal(P.optionValue(thirds,thirds.options[0]),'1 sur 3 · 33,3 %');
  assert.equal(P.optionValue(thirds,thirds.options[1]),'2 sur 3 · 66,7 %');
});

test('une réponse unique signale une somme inférieure ou supérieure aux répondants',()=>{
  for(const count of [2,5]) {
    const question=q({responseType:'single',options:[{label:'A',count,percent:null}]});
    assert.match(P.warnings(question,4).join(' '),/somme des effectifs/);
  }
  const exact=q({responseType:'single',options:[{label:'A',count:4,percent:100}]});
  assert.deepEqual(P.warnings(exact,4),[]);
});

test('les pourcentages uniques incohérents sont signalés en respectant les arrondis',()=>{
  for(const percentages of [[20,30],[70,80]]) {
    const question=q({responseType:'single',options:percentages.map((percent,i)=>({label:String(i),count:null,percent}))});
    assert.match(P.warnings(question,4).join(' '),/ne totalisent pas environ 100/);
  }
  const rounded=q({responseType:'single',options:Array.from({length:7},(_,i)=>({label:String(i),count:null,percent:14}))});
  assert.deepEqual(P.warnings(rounded,4),[]);
});

test('les contributions libres peuvent dépasser les répondants sans devenir des personnes',()=>{
  const free=q({responseType:'free',options:[{label:'Mot fictif',count:6,percent:null}]});
  assert.equal(P.optionValue(free,free.options[0]),'6 contribution(s)');
  assert.doesNotMatch(P.warnings(free,4).join(' '),/effectif supérieur aux répondants/);
  assert.match(P.warnings(free,4).join(' '),/aucune moyenne/);
});

test('les petits constats retenus sont signalés sans masquer les valeurs exactes',()=>{
  for(const count of [1,2]) {
    const question=q({options:[{label:'A',count,percent:null,highlight:true}]});
    assert.match(P.warnings(question,4).join(' '),/confidentialité — faible effectif/);
    const html=P.reportHTML({version:P.VERSION,meta:{classSize:4},questions:[question]});
    assert.match(html,new RegExp(`${count} sur 4`));
    assert.match(html,/confidentialité — faible effectif/);
  }
  for(const [count,highlight] of [[0,true],[3,true],[1,false],[null,true]]) {
    assert.doesNotMatch(P.warnings(q({options:[{label:'A',count,highlight}]}),4).join(' '),/confidentialité — faible effectif/);
  }
});

test('la méthode sépare la classe des répondants et conserve les conditions sans les inventer',()=>{
  const data={version:P.VERSION,meta:{classSize:12,conditions:'Lecture collective\n<texte libre>'},questions:[q({respondents:10,options:[{label:'A',count:1,percent:10,highlight:true}]})]};
  const restored=P.validateSession(JSON.parse(JSON.stringify(P.validateSession(data))));
  assert.equal(restored.meta.conditions,data.meta.conditions);
  const html=P.reportHTML(restored);
  assert.match(html,/1 sur 10 · 10 %/);
  assert.doesNotMatch(html,/un élève représente|8,3 %/);
  assert.match(html,/répondants de chaque question/);
  assert.match(html,/Lecture collective<br>&lt;texte libre&gt;/);
  delete data.meta.conditions;
  assert.equal(P.validateSession(data).meta.conditions,'');
  assert.match(P.reportHTML(data),/Conditions de passation : non renseignées/);
});

test('une question PDF invalide ne perd ni les suivantes ni les autres fichiers',async()=>{
  const fs=require('node:fs'),vm=require('node:vm');
  const html=fs.readFileSync(require.resolve('./MentiAnalyser.html'),'utf8');
  const start=html.indexOf('async function analyserPNG(');
  const end=html.indexOf('// ── APP ─',start);
  assert.ok(start>0 && end>start);
  const first=q({q:'Avant'}),bad={...q({q:'Question invalide'}),options:[{label:'A',percent:101}]},last=q({q:'Après'});
  const responses=[[first,bad,last],[q({q:'Autre fichier'})]];
  let calls=0;
  const context=vm.createContext({Prevention:P,FileReader:class {
    readAsDataURL(){this.result='data:application/pdf;base64,AA==';this.onload();}
  },fetch:async()=>({ok:true,status:200,json:async()=>({content:[{text:JSON.stringify(responses[calls++])}]})}),console});
  vm.runInContext(html.slice(start,end),context);
  let status,results,errors,progress;
  await context.analyserPNG([{name:'fictif.pdf',type:'application/pdf'},{name:'autre.png',type:'image/png'}],
    'sk-test-fixture',v=>status=v,v=>progress=v,()=>{},v=>results=v,v=>errors=v,()=>{},'','prevention');
  assert.equal(status,'done');assert.equal(calls,2);assert.equal(progress,2);
  assert.deepEqual(Array.from(results,r=>r.q),['Avant','Après','Autre fichier']);
  assert.deepEqual(Array.from(results,r=>r.id),[1,2,3]);
  assert.equal(errors.length,1);assert.equal(errors[0].file,'fictif.pdf');
  assert.match(errors[0].motif,/Question 2\/3 « Question invalide » ignorée : Pourcentage supérieur à 100/);
});
