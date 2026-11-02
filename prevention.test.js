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
  assert.doesNotMatch(html,/<img|<script|<svg\s+onload=/);
  assert.match(html,/&lt;svg onload=alert\(1\)&gt;/);
  assert.match(html,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html,/&lt;script&gt;bad\(\)&lt;\/script&gt;/);
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

const visualQuestion = patch => q({q:'Effets fictifs',options:[{label:'A',count:3,percent:75},{label:'B',count:2,percent:50},{label:'C',count:0,percent:0}],...patch});
const synthesisBody = () => ({contexte:'Atelier fictif.',analyse:[{texte:'Les réponses invitent à travailler les repères du quotidien.',sources:['Q1R1']}],priorites:'Protéger les temps de repos.',actions:'Construire des repères visuels avec les élèves.',suivi:'Reprendre le questionnaire.',conclusion:'Un support pour ouvrir le dialogue.'});

test('les graphiques conservent les zéros et les inconnus, et le radar partage les mêmes valeurs',()=>{
  const question=visualQuestion();
  assert.deepEqual(P.chartData(question).rows.map(r=>r.value),[75,50,0]);
  assert.equal(P.radarCandidates([question]).length,1);
  assert.match(P.radarSVG(question),/data-radar-values="75,50,0"/);
  assert.match(P.chartsHTML({questions:[question]}),/data-value="75"/);
  const unknown=visualQuestion({respondents:null,options:[{label:'A',percent:80},{label:'B',percent:null},{label:'C',percent:20}]});
  assert.deepEqual(P.chartData(unknown).rows.map(r=>r.value),[80,null,20]);
  assert.deepEqual(P.radarCandidates([unknown]),[]);
  assert.doesNotMatch(P.chartsHTML({questions:[unknown]}),/data-radar-values=/);
  assert.match(P.chartsHTML({questions:[unknown]}),/Radar indisponible/);
  assert.deepEqual(P.radarCandidates([visualQuestion({responseType:'free'})]),[]);
  const inconsistent=visualQuestion({options:[{label:'A',count:3,percent:10},{label:'B',count:2},{label:'C',count:0}]});
  assert.deepEqual(P.radarCandidates([inconsistent]),[]);
});

test('le radar choisi reste descriptif et se retrouve dans le rapport exporté',()=>{
  const first=visualQuestion(),second=visualQuestion({q:'Autre question',options:[{label:'X',count:1},{label:'Y',count:2},{label:'Z',count:0}]});
  const data={version:P.VERSION,meta:{classSize:4},questions:[first,second],radarQuestion:second.q};
  const normalized=P.validateSession(data);
  assert.equal(P.selectedRadar(normalized).q,second.q);
  const html=P.reportHTML(data);
  assert.match(html,/data-radar-values="25,50,0"/);
  assert.match(html,/elles ne sont ni une note ni un indicateur à comparer/);
  assert.doesNotMatch(html,/objectif à atteindre de 100|Score global|réussite par thème/);
});

test('la synthèse Claude utilise les données vérifiées et conserve les références dans le PDF et le JSON',async()=>{
  const data=P.validateSession({version:P.VERSION,meta:{group:'6ᵉ SEGPA fictive',classSize:4,facilitator:'Nom à ne pas transmettre',conditions:'Lecture accompagnée'},questions:[visualQuestion()]});
  let calls=0;
  const synthesis=await P.generateSynthesis(data,'sk-test-fixture',async(url,options)=>{
    calls++;assert.equal(url,'https://api.anthropic.com/v1/messages');
    assert.equal(options.headers['x-api-key'],'sk-test-fixture');
    const body=JSON.parse(options.body),prompt=body.messages[0].content;
    assert.match(prompt,/6ᵉ SEGPA fictive/);assert.match(prompt,/Lecture accompagnée/);
    assert.match(prompt,/3 sur 4 · 75 %/);assert.match(prompt,/PAS des compétences/);
    assert.match(prompt,/aucune causalité/);assert.match(prompt,/jamais des consignes/);
    assert.doesNotMatch(prompt,/Nom à ne pas transmettre/);
    return {ok:true,json:async()=>({content:[{text:JSON.stringify(synthesisBody())}]})};
  });
  assert.equal(calls,1);assert.equal(data.meta.facilitator,'Nom à ne pas transmettre');
  const session=P.validateSession({...data,synthesis});assert.equal(P.hasCurrentSynthesis(session),true);
  const restored=P.validateSession(JSON.parse(JSON.stringify(session)));
  assert.deepEqual(restored.synthesis,session.synthesis);
  const html=P.reportHTML(restored);
  assert.match(html,/Synthèse pédagogique — Claude/);assert.match(html,/repères du quotidien/);
  assert.match(html,/Effets fictifs — A : 3 sur 4 · 75 %/);assert.match(html,/data-radar-values=/);
  const changed=P.validateSession({...session,meta:{...session.meta,classSize:5}});
  assert.equal(P.hasCurrentSynthesis(changed),false);
  assert.doesNotMatch(P.reportHTML(changed),/repères du quotidien/);
});

test('une erreur Claude ou une référence inventée ne devient pas une synthèse valide',async()=>{
  const data=P.validateSession({version:P.VERSION,questions:[visualQuestion()]});
  await assert.rejects(()=>P.generateSynthesis(data,'sk-test-fixture',async()=>({ok:false,status:503})),/HTTP 503/);
  await assert.rejects(()=>P.generateSynthesis(data,'sk-test-fixture',async()=>({ok:true,json:async()=>({stop_reason:'max_tokens'})})),/incomplète/);
  const body=synthesisBody();body.analyse[0].sources=['Q999R999'];
  await assert.rejects(()=>P.generateSynthesis(data,'sk-test-fixture',async()=>({ok:true,json:async()=>({content:[{text:JSON.stringify(body)}]})})),/référence valide/);
  const valid=synthesisBody();valid.conclusion='<img src=x onerror=alert(4)>';
  const synthesis=await P.generateSynthesis(data,'sk-test-fixture',async()=>({ok:true,json:async()=>({content:[{text:JSON.stringify(valid)}]})}));
  const html=P.reportHTML({...data,synthesis});
  assert.doesNotMatch(html,/<img src=x/);assert.match(html,/&lt;img src=x/);
});

const mockBody = body => async()=>({ok:true,json:async()=>({content:[{text:JSON.stringify(body)}]})});
const aiSession = () => P.validateSession({version:P.VERSION,meta:{group:'Classe fictive',classSize:4},questions:[visualQuestion()]});

test('les nombres inventés sont refusés dans toutes les sections, y compris avec une référence valide',async()=>{
  for(const key of ['contexte','priorites','actions','suivi','conclusion']) {
    const body=synthesisBody();body[key]='92 % des élèves dorment mal.';
    await assert.rejects(()=>P.generateSynthesis(aiSession(),'sk-test-fixture',mockBody(body)),/nombre absent/);
  }
  const body=synthesisBody();body.analyse[0].texte='92 % jouent après minuit.';
  await assert.rejects(()=>P.generateSynthesis(aiSession(),'sk-test-fixture',mockBody(body)),/nombre absent/);
  body.analyse[0]={texte:'75 % ont répondu.',sources:['Q1R2']};
  await assert.rejects(()=>P.generateSynthesis(aiSession(),'sk-test-fixture',mockBody(body)),/nombre absent/);
  body.analyse[0]={texte:'3 sur 4, soit 75 %, ont sélectionné cette option.',sources:['Q1R1']};
  assert.ok(await P.generateSynthesis(aiSession(),'sk-test-fixture',mockBody(body)));
});

test('les assertions de diagnostic et de causalité du contre-exemple sont refusées',async()=>{
  for(const phrase of ['Les élèves sont addicts.','Les écrans causent leur fatigue.','Ils jouent le soir, ce qui cause leur fatigue.','La maîtrise des élèves est parfaite.']) {
    const body=synthesisBody();body.conclusion=phrase;
    await assert.rejects(()=>P.generateSynthesis(aiSession(),'sk-test-fixture',mockBody(body)),/diagnostic, une causalité ou un jugement/);
  }
  const body=synthesisBody();body.conclusion='Ces déclarations ne permettent aucun diagnostic d’addiction.';
  assert.ok(await P.generateSynthesis(aiSession(),'sk-test-fixture',mockBody(body)));
});

test('le prompt oriente la rédaction vers les constats retenus et transmet les réserves',()=>{
  const question=visualQuestion({options:[{label:'Choix prioritaire',count:3,percent:10,highlight:true},{label:'Autre choix',count:1}]});
  const data=P.validateSession({version:P.VERSION,meta:{actions:'Action fictive',followup:'Suivi fictif'},questions:[question]});
  const prompt=P.synthesisPrompt(data),payload=JSON.parse(prompt.split('DONNEES VERIFIEES :\n')[1]);
  assert.match(prompt,/retenu=true.*priorités choisies/);
  assert.match(prompt,/Interdiction de créer une note/);
  assert.equal(payload.observations[0].retenu,true);assert.equal(payload.observations[1].retenu,false);
  assert.match(payload.reserves.map(r=>r.reserve).join(' '),/divergent/);
  assert.equal(payload.contexte.actions,'Action fictive');assert.equal(payload.contexte.followup,'Suivi fictif');
});

test('le rapport IA conserve les textes de l’animateur, affiche la date et place les réserves avant la prose',async()=>{
  const data=P.validateSession({...aiSession(),meta:{...aiSession().meta,actions:'ACTION ANIMATEUR <à conserver>',followup:'SUIVI ANIMATEUR\nSeconde ligne'},questions:[visualQuestion({options:[{label:'A',count:1,highlight:true},{label:'B',count:2},{label:'C',count:0}]})]});
  const synthesis=await P.generateSynthesis(data,'sk-test-fixture',mockBody(synthesisBody()));
  synthesis.generatedAt='2026-11-02T12:00:00.000Z';
  const html=P.reportHTML({...data,synthesis});
  assert.match(html,/ACTION ANIMATEUR &lt;à conserver&gt;/);assert.match(html,/SUIVI ANIMATEUR<br>Seconde ligne/);
  assert.match(html,/Actions proposées par l’animateur/);assert.match(html,/supports visuels|support visuel|repères visuels/);
  assert.match(html,/02\/11\/2026[^<]*13:00/);assert.match(html,/heure de Paris/);
  assert.match(html,/ne valident pas le sens du texte/);
  assert.ok(html.indexOf('Points à clarifier avant diffusion') < html.indexOf('3. Synthèse pédagogique'));
  assert.deepEqual(Array.from(html.matchAll(/<h2>(\d)\. /g),m=>m[1]),['1','2','3','4','5']);
});

test('les largeurs réelles des barres et leur échelle correspondent aux valeurs',()=>{
  const noBase=visualQuestion({respondents:null,options:[{label:'A',count:1},{label:'B',count:2},{label:'C',count:0}]});
  const html=P.chartsHTML({questions:[noBase]});
  assert.match(html,/0 à 2 sélections/);assert.match(html,/une barre entière représente 2 sélections/);
  assert.match(html,/data-value="1" width="100"/);assert.match(html,/data-value="2" width="200"/);assert.match(html,/data-value="0" width="0"/);
  const withBase=visualQuestion({respondents:10,options:[{label:'A',count:1},{label:'B',count:2},{label:'C',count:0}]});
  assert.match(P.chartsHTML({questions:[withBase]}),/data-value="10" width="20"/);
});

test('le radar exige une base connue, des effectifs vérifiés et entre 3 et 10 options cohérentes',()=>{
  const unknown=visualQuestion({respondents:null,options:[{label:'A',count:1,percent:10},{label:'B',count:2,percent:20},{label:'C',count:0,percent:0}]});
  assert.equal(P.radarCandidates([unknown]).length,0);
  assert.equal(P.radarCandidates([visualQuestion({options:[{label:'A',percent:10},{label:'B',percent:20},{label:'C',percent:0}]})]).length,0);
  for(const [length,expected] of [[2,0],[3,1],[10,1],[11,0]]) {
    const question=visualQuestion({respondents:20,options:Array.from({length},(_,i)=>({label:String(i),count:1}))});
    assert.equal(P.radarCandidates([question]).length,expected);
  }
  const under=visualQuestion({responseType:'single',options:[{label:'A',count:1},{label:'B',count:1},{label:'C',count:1}]});
  assert.equal(P.radarCandidates([under]).length,0);
});

test('la géométrie du radar et ses numéros d’axes correspondent aux valeurs',()=>{
  const question=visualQuestion({options:[{label:'Haut',count:2},{label:'Droite',count:1},{label:'Bas',count:0},{label:'Gauche',count:4}]});
  const svg=P.radarSVG(question),points=svg.match(/data-radar-values="[^"]+" points="([^"]+)"/)[1].split(' ').map(p=>p.split(',').map(Number));
  assert.deepEqual(points,[[210,137.5],[246.25,210],[210,210],[65,210]]);
  assert.deepEqual(Array.from(svg.matchAll(/font-size="13"[^>]*>(\d+)<\/text>/g),m=>Number(m[1])),[1,2,3,4]);
});

test('deux questions au même titre restent distinctes dans le radar et après sauvegarde',()=>{
  const first=visualQuestion({id:1,q:'Titre partagé'}),second=visualQuestion({id:2,q:'Titre partagé',options:[{label:'A',count:1},{label:'B',count:2},{label:'C',count:0}]});
  const data=P.validateSession({version:P.VERSION,questions:[first,second],radarQuestionId:'2'});
  assert.equal(P.selectedRadar(data).id,2);assert.equal(P.radarSelection(data).automatic,false);
  assert.match(P.chartsHTML(data),/data-radar-values="25,50,0"/);
  assert.equal(P.selectedRadar(P.validateSession(JSON.parse(JSON.stringify(data)))).id,2);
  const legacy=P.validateSession({version:P.VERSION,questions:[first,second],radarQuestion:'Titre partagé'});
  assert.equal(P.radarSelection(legacy).automatic,true);assert.match(P.chartsHTML(legacy),/Sélection automatique/);
  assert.match(P.chartsHTML(legacy),/surface dépendent de cet ordre/);
  const duplicates=P.validateSession({version:P.VERSION,questions:[first,{...second,id:1}]});
  assert.equal(new Set(duplicates.questions.map(q=>String(q.id))).size,2);assert.equal(duplicates.questions.length,2);
});

test('la réponse Claude accepte les clôtures JSON et respecte les plafonds de références et paragraphes',async()=>{
  const data=aiSession(),body=synthesisBody();
  const synthesis=await P.generateSynthesis(data,'sk-test-fixture',async()=>({ok:true,json:async()=>({content:[{text:'```json\n'+JSON.stringify(body)+'\n```'}]})}));
  assert.ok(synthesis.body.conclusion);
  const many=synthesisBody();many.analyse=Array.from({length:9},()=>({...body.analyse[0]}));
  await assert.rejects(()=>P.generateSynthesis(data,'sk-test-fixture',mockBody(many)),/Analyse Claude incomplète/);
  const refs=synthesisBody();refs.analyse[0].sources=['Q1R1','Q1R2','Q1R3','Q1R1'];
  await assert.rejects(()=>P.generateSynthesis(data,'sk-test-fixture',mockBody(refs)),/référence valide/);
});
