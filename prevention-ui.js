/* Parcours distinct : les données de prévention ne passent pas dans les KPI quiz. */
(function () {
  'use strict';
  const commonConditions = [
      ['Réponses individuelles', 'Les élèves ont répondu individuellement.'],
      ['Lecture à voix haute', 'Les questions et les réponses proposées ont été lues à voix haute.'],
      ['Compréhension des consignes', 'Les consignes ont été reformulées et la compréhension vérifiée avant les réponses.'],
      ['Aide à la lecture', 'Une aide à la lecture a été proposée sans orienter les choix de réponse.'],
      ['Échange collectif', 'Un temps d’échange collectif a suivi le recueil des réponses.'],
      ['Recueil sans nom', 'Les réponses ont été recueillies sans nom d’élève.']
  ];
  const themeExamples = [
    {match:/ecran|sommeil|jeux? video/, objectives:[
      ['Sommeil et équilibre', 'Ouvrir le dialogue sur les usages du soir, le sommeil, les pauses et la place des activités sans écran.'],
      ['Régulation des écrans', 'Construire avec les élèves des repères réalistes pour réguler le temps d’écran et organiser un suivi avec l’équipe éducative et les familles.']
    ], condition:['Vocabulaire du temps d’écran', 'Les notions de durée d’écran, de pause et d’usage du soir ont été explicitées avant les réponses.']},
    {match:/harcel/, objectives:[
      ['Reconnaître et réagir', 'Échanger sur les situations de harcèlement, leurs conséquences et les façons de demander de l’aide, sans solliciter de récit personnel.'],
      ['Entraide et adultes ressources', 'Identifier avec les élèves des réactions protectrices pour les victimes et les témoins, ainsi que les adultes ressources à solliciter.']
    ], condition:['Situations de harcèlement fictives', 'Les situations de harcèlement discutées étaient fictives ; aucun récit personnel ni nom de personne impliquée n’a été demandé.']},
    {match:/reseaux? socia|tiktok|instagram|snapchat/, objectives:[
      ['Usages des réseaux sociaux', 'Ouvrir le dialogue sur les pratiques déclarées sur les réseaux sociaux, les interactions et les difficultés rencontrées.'],
      ['Publications et recours', 'Travailler à partir de situations concrètes sur le partage de contenus, le respect d’autrui, les réglages de confidentialité et les moyens de demander de l’aide.']
    ], condition:['Exemples de réseaux sociaux fictifs', 'Les exemples de publications et de profils utilisés étaient fictifs ; aucun compte personnel n’a été consulté.']},
    {match:/vie privee|donnees? personnelles?|identite numerique|droit a l.image|confidential/, objectives:[
      ['Données et vie privée', 'Recueillir les représentations des élèves sur les données personnelles, la vie privée et le consentement au partage d’informations.'],
      ['Choix de protection', 'Construire des repères concrets pour choisir ce que l’on partage, protéger son identité numérique et respecter celle des autres.']
    ], condition:['Données personnelles fictives', 'Les situations utilisaient des données fictives ; aucune information personnelle ni image d’élève n’a été demandée.']},
    {match:/mots? de passe|hameconnage|phishing|cybersecurite|securite numerique/, objectives:[
      ['Comptes et messages', 'Ouvrir le dialogue sur la protection des comptes et les réactions face à un message ou à une demande inhabituelle.'],
      ['Vérifier et demander de l’aide', 'Travailler sur des situations fictives pour choisir un mot de passe protecteur, vérifier une demande et identifier un adulte ou un service ressource.']
    ], condition:['Comptes et messages fictifs', 'Les exemples de comptes, de mots de passe et de messages étaient fictifs ; aucun mot de passe personnel n’a été demandé.']},
    {match:/desinformation|fausses? info|fake news|esprit critique|medias|information/, objectives:[
      ['Rapport à l’information', 'Recueillir les pratiques et représentations des élèves face aux informations rencontrées dans les médias et en ligne.'],
      ['Vérifier avant de partager', 'Faire discuter des indices utiles pour distinguer un fait d’une opinion, identifier une source et vérifier une information avant de la partager.']
    ], condition:['Supports d’information communs', 'Les élèves ont travaillé à partir des mêmes exemples d’informations ; le vocabulaire des sources, des faits et des opinions a été explicité.']}
  ];
  function contextSuggestions(title) {
    const theme=(title||'').trim();
    if(!theme)return {objective:[],conditions:[]};
    const normalized=theme.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[’']/g,' ');
    const profiles=themeExamples.filter(example=>example.match.test(normalized));
    return {
      objective:[['État des lieux',`Recueillir les pratiques et représentations déclarées sur le thème « ${theme} » afin d’identifier les besoins de prévention de la classe.`],
        ...(profiles.length?profiles.flatMap(p=>p.objectives):[
          ['Dialogue sur le thème',`Ouvrir un échange sur « ${theme} » à partir de situations concrètes adaptées aux élèves, sans jugement ni notation.`],
          ['Repères et suivi',`Construire avec les élèves des repères de prévention sur « ${theme} » et prévoir un suivi avec l’équipe éducative.`]
        ])],
      conditions:[...commonConditions,...(profiles.length?profiles.map(p=>p.condition):[
        ['Vocabulaire du thème',`Les mots et situations du questionnaire sur « ${theme} » ont été explicités avant les réponses.`]
      ])]
    };
  }
  window.PreventionApp = function PreventionApp({analyse, unlock}) {
    const e = React.createElement, P = Prevention;
    const [data, setData] = React.useState(() => {
      try { return P.validateSession(JSON.parse(localStorage.getItem('menti_prevention_v1'))); }
      catch { return {version:P.VERSION,meta:{title:'Usages des écrans et besoins de prévention',school:'',group:'',date:'',facilitator:'',classSize:null,objective:'',conditions:'',actions:'',followup:''},questions:[]}; }
    });
    const [draft, setDraft] = React.useState(null);
    const [files,setFiles] = React.useState([]);
    const [selecting,setSelecting] = React.useState(false);
    const fileInput = React.useRef(null);
    const [password,setPassword] = React.useState('');
    const [apiKey,setKey] = React.useState('');
    const [status,setStatus] = React.useState('idle');
    const [progress,setProgress] = React.useState(0);
    const [retry,setRetry] = React.useState(null);
    const [errors,setErrors] = React.useState([]);
    const [message,setMessage] = React.useState('');
    const [ack,setAck] = React.useState(false);
    const [generating,setGenerating] = React.useState(false);
    const busy = status === 'loading' || generating || selecting;
    const latest=React.useRef(data);latest.current=data;
    React.useEffect(()=>{
      try { localStorage.setItem('menti_prevention_v1',JSON.stringify(data)); }
      catch { setMessage('Sauvegarde locale impossible : exporte le JSON pour conserver ton travail.'); }
    },[data]);
    const meta = data.meta, visible = draft === null ? data.questions : draft;
    const suggestions = contextSuggestions(meta.title);
    const style = {border:'1px solid #b6c7d2',borderRadius:7,padding:'8px',font:'inherit',width:'100%',minWidth:0};
    const btn = {border:'1px solid #197d89',borderRadius:8,padding:'9px 13px',background:'#fff',color:'#145b64',fontWeight:600};
    const card = {padding:18,background:'#fff',border:'1px solid #d9e3e9',borderRadius:12,marginBottom:16,minWidth:0};
    const field = (label, value, fn, type='text', extra={}) => e('label',{style:{display:'block',minWidth:0}},
      e('span',{style:{display:'block',fontSize:12,fontWeight:600,marginBottom:4}},label),
      e('input',{disabled:busy,...extra,type,value:value??'',onChange:ev=>fn(ev.target.value),style}));
    const setMeta = (key,value) => setData(d=>({...d,meta:{...d.meta,[key]:value}}));
    const addSuggestion = (key,text) => setData(d=>{
      const current=d.meta[key]||'';
      if(current.includes(text))return d;
      const value=current.trim()?`${current}${current.endsWith('\n')?'':'\n'}${text}`:text;
      return {...d,meta:{...d.meta,[key]:value}};
    });
    const contextField = (label,key,placeholder,help) => e('div',{style:{marginTop:12}},
      e('label',{htmlFor:`prevention-${key}`,style:{display:'block',marginBottom:4}},label),
      e('textarea',{id:`prevention-${key}`,value:meta[key],onChange:ev=>setMeta(key,ev.target.value),placeholder,style,rows:3}),
      e('details',{style:{marginTop:8,padding:10,borderRadius:8,background:'#f4f8fa'}},
        e('summary',{style:{cursor:'pointer',fontWeight:600,color:'#145b64'}},key==='objective'?'Suggestions d’objectifs':'Suggestions de conditions de passation'),
        e('p',{style:{fontSize:13,margin:'8px 0'}},help),
        e('p',{style:{fontSize:13,margin:'8px 0',color:'#475569'}},meta.title.trim()?`Thème utilisé : ${meta.title.trim()}`:'Renseigne le titre / thème de l’atelier pour afficher les suggestions.'),
        ...suggestions[key].map(([title,text])=>{
          const added=(meta[key]||'').includes(text);
          return e('div',{key:title,style:{display:'flex',alignItems:'flex-start',flexWrap:'wrap',gap:8,borderTop:'1px solid #d9e3e9',paddingTop:10,marginTop:10}},
            e('p',{style:{flex:'1 1 260px',minWidth:0,fontSize:13}},e('strong',null,title,' : '),text),
            e('button',{type:'button',style:btn,disabled:busy||added,'aria-label':`${added?'Suggestion ajoutée':'Ajouter la suggestion'} : ${title}`,onClick:()=>addSuggestion(key,text)},added?'Ajoutée':'Ajouter'));
        })));
    const update = (index,patch) => {setAck(false);setDraft(visible.map((q,i)=>i===index?{...q,...patch}:q));};
    const warningRows = visible.flatMap(q=>{
      try {return P.warnings(P.normalizeQuestion(q),Number(meta.classSize)||null).map(w=>`${q.q} — ${w}`);}
      catch(err){return [`${q.q} — ${err.message}`];}
    });
    function download(content,name,type) {
      const url=URL.createObjectURL(new Blob([content],{type}));
      const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    async function getKey() {
      if(apiKey)return apiKey;
      const key=await unlock(password);
      if(!key)throw new Error('Mot de passe IA incorrect ou manquant.');
      setKey(key);setPassword('');return key;
    }
    async function exportReport(withClaude=true, force=false) {
      if(draft!==null){setMessage('Vérifie puis applique les réponses avant de générer le rapport.');return;}
      if(!data.questions.length){setMessage('Ajoute ou importe les résultats du questionnaire.');return;}
      if(!meta.group.trim() || !Number(meta.classSize)){setMessage('Renseigne la classe et son effectif avant de générer le rapport.');return;}
      if(!ack){setMessage('Relis les réponses et les points à clarifier, puis coche la confirmation.');return;}
      let win;
      try {
        let snapshot=P.validateSession(data);
        win=window.open('','_blank');
        if(win){win.opener=null;win.document.write('<p>Préparation du rapport…</p>');}
        if(withClaude && (force || !P.hasCurrentSynthesis(snapshot))) {
          setGenerating(true);setMessage('Claude rédige la synthèse pédagogique à partir des réponses vérifiées…');
          const key=await getKey();
          const synthesis=await P.generateSynthesis(snapshot,key);
          if(P.synthesisSource(P.validateSession(latest.current))!==synthesis.source)
            throw new Error('Les données ont changé pendant la rédaction. Relance le rapport sur les données actuelles.');
          snapshot={...snapshot,synthesis};setData(snapshot);
        }
        if(!withClaude)snapshot={...snapshot,synthesis:null};
        const html=P.reportHTML(snapshot);
        if(!win){download(html,'Rapport_prevention.html','text/html;charset=utf-8');setMessage('Rapport HTML téléchargé : ouvre-le puis choisis Imprimer / Enregistrer en PDF.');return;}
        win.document.open();win.document.write(html);win.document.close();
        setMessage(withClaude?'Rapport avec synthèse Claude et graphiques ouvert. Relis-le avant transmission, puis enregistre-le en PDF.':'Rapport descriptif avec graphiques ouvert.');
      } catch(err){if(win)win.close();setMessage(err.message);}
      finally {setGenerating(false);}
    }
    async function selectFiles(list) {
      if(busy || !list.length)return;
      setSelecting(true);setMessage('');setAck(false);
      try {
        const all=[];
        for(const f of list) {
          if(/\.zip$/i.test(f.name)) {
            const zip=await JSZip.loadAsync(f);
            const entries=Object.values(zip.files).filter(x=>!x.dir && !x.name.startsWith('__MACOSX/') && /\.(png|jpe?g|pdf)$/i.test(x.name));
            const hasImages=entries.some(x=>/\.(png|jpe?g)$/i.test(x.name));
            for(const x of entries.filter(x=>!hasImages || !/\.pdf$/i.test(x.name)))
              all.push(new File([await x.async('blob')],x.name,{type:/\.pdf$/i.test(x.name)?'application/pdf':/\.jpe?g$/i.test(x.name)?'image/jpeg':'image/png'}));
            if(hasImages && entries.some(x=>/\.pdf$/i.test(x.name)))setMessage('Les captures du ZIP sont retenues ; le PDF est écarté pour éviter de réanalyser un rapport déjà généré.');
          } else if(/\.(png|jpe?g|pdf)$/i.test(f.name)) all.push(f);
        }
        setFiles(all);setErrors([]);setStatus('idle');setProgress(0);setRetry(null);
        if(!all.length)setMessage('Aucun fichier PNG, JPEG ou PDF utilisable dans cette sélection.');
      } catch(err){setMessage('Impossible de lire les fichiers : '+err.message);}
      finally {setSelecting(false);}
    }
    function removeFile(index) {
      if(busy)return;
      setFiles(current=>index===null?[]:current.filter((_,i)=>i!==index));
      setErrors([]);setStatus('idle');setProgress(0);setRetry(null);setAck(false);
      setMessage(data.questions.length || draft!==null
        ? 'Sélection mise à jour. Les réponses déjà extraites sont conservées ; retire-les dans « Vérifier les réponses » si nécessaire.'
        : 'Sélection mise à jour. Seuls les fichiers encore affichés seront analysés.');
    }
    async function runAnalysis() {
      if(busy || !files.length)return;
      setStatus('loading');setProgress(0);setRetry(null);
      try {
        const key=await getKey();setMessage('');setAck(false);
        await analyse(files,key,setStatus,setProgress,setRetry,results=>setDraft(results),setErrors,()=>{},'', 'prevention');
      } catch(err){setStatus('idle');setMessage(err.message);}
    }
    let normalized;
    try {normalized=P.validateSession(data);}catch {normalized=null;}
    const noDraft = draft === null;
    return e('main',{style:{maxWidth:1050,margin:'0 auto',padding:'20px 16px',overflowWrap:'anywhere'}},
      e('h1',{style:{fontSize:24,color:'#197d89',marginBottom:8}},'Usages des écrans et prévention'),
      e('p',{style:{marginBottom:16}},'Un bilan des pratiques déclarées et des besoins d’accompagnement, destiné à l’équipe éducative. Les résultats sont conservés dans ce navigateur ; exporte le JSON pour les transférer.'),
      e('style',null,'.prevention-charts .chart-row{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr);align-items:center;gap:10px;margin:10px 0}.prevention-charts .bar-track{background:#edf2f5;border-radius:5px;min-height:14px}.prevention-charts .bar-fill{height:14px;background:#4389bd;border-radius:5px}.prevention-charts article{margin:18px 0}.prevention-charts ol{padding-left:24px}.prevention-charts .source{font-size:12px;color:#475569}.prevention-charts h2{font-size:18px}.prevention-charts h3{font-size:15px}'),
      data.synthesis && normalized && !P.hasCurrentSynthesis(normalized) && e('p',{role:'status',style:card},'Les données ont changé : la synthèse Claude doit être régénérée.'),
      message && e('p',{role:'status',style:{...card,background:'#fff7df'}},message),
      e('section',{style:card},e('h2',{style:{fontSize:18,marginBottom:12}},'1. Contexte du rapport'),
        e('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,240px),1fr))',gap:12}},
          field('Titre / thème de l’atelier',meta.title,v=>setMeta('title',v)),field('Établissement',meta.school,v=>setMeta('school',v)),
          field('Classe / groupe',meta.group,v=>{setAck(false);setMeta('group',v);},'text',{placeholder:'Ex. 6ᵉ SEGPA'}),
          field('Effectif total de la classe',meta.classSize,v=>{setAck(false);setMeta('classSize',v===''?null:Number(v));},'number',{min:1,step:1}),
          field('Date du questionnaire',meta.date,v=>setMeta('date',v),'date'),field('Animateur / animatrice',meta.facilitator,v=>setMeta('facilitator',v))),
        e('p',{style:{fontSize:12,marginTop:12}},'Les suggestions suivent le titre / thème de l’atelier. Si tu le modifies, relis les textes déjà saisis ou ajoutés.'),
        contextField('Objectif de l’atelier','objective','Décrire les pratiques et représentations liées au thème, ouvrir le dialogue et adapter la prévention.',
          'Clique sur « Ajouter » pour insérer une proposition liée au thème à la suite de ton texte, puis adapte-la à ton atelier.'),
        contextField('Conditions de passation (facultatif)','conditions','À renseigner selon la séance : lecture à voix haute, aide à la compréhension, réponses individuelles… Sans nom ni information individuelle.',
          'Ajoute uniquement les conditions qui correspondent au déroulement réel de la séance, puis adapte le texte. Tu peux préciser la durée et l’aide apportée, sans nom ni information individuelle.')),
      e('section',{style:card},e('h2',{style:{fontSize:18,marginBottom:12}},'2. Importer les résultats sources'),
        e('p',null,'Importe les captures de résultats, pas l’ancien rapport. L’analyse IA transmet ces fichiers au service Anthropic : utilise uniquement des résultats anonymes autorisés, sans noms ni informations individuelles.'),
        e('input',{ref:fileInput,type:'file',multiple:true,accept:'.png,.jpg,.jpeg,.zip,.pdf',disabled:busy,'aria-label':'Captures sources',onChange:ev=>{
          const selected=Array.from(ev.target.files||[]);ev.target.value='';selectFiles(selected);
        },style:{display:'none'}}),
        e('div',{style:{display:'flex',gap:10,flexWrap:'wrap',margin:'12px 0'}},
          e('button',{type:'button',style:btn,disabled:busy,onClick:()=>fileInput.current?.click()},selecting?'Ouverture des fichiers…':'Choisir des fichiers'),
          files.length>0 && e('button',{type:'button',style:btn,disabled:busy,onClick:()=>removeFile(null)},'Tout retirer')),
        e('p',{'aria-live':'polite'},`${files.length} fichier(s) source(s) sélectionné(s).`),
        files.length>0 && e('ul',{'aria-label':'Fichiers sélectionnés pour l’analyse',style:{listStyle:'none',padding:0,margin:'10px 0'}},
          ...files.map((file,index)=>e('li',{key:`${file.name}-${index}`,style:{display:'flex',alignItems:'center',flexWrap:'wrap',gap:8,padding:'8px 0',borderBottom:'1px solid #d9e3e9'}},
            e('span',{style:{flex:'1 1 240px',minWidth:0,overflowWrap:'anywhere'}},file.name),
            e('button',{type:'button',style:btn,disabled:busy,'aria-label':`Retirer ${file.name}`,onClick:()=>removeFile(index)},'Retirer')))),
        e('p',{style:{fontSize:12,margin:'8px 0'}},'Un nouveau choix de fichiers remplace cette sélection. Retirer un fichier agit sur la prochaine analyse ; les réponses déjà extraites se retirent dans « Vérifier les réponses ».'),
        field('Mot de passe IA (analyse et rapport Claude)',password,setPassword,'password',{autoComplete:'off',disabled:busy}),
        e('div',{style:{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}},
          e('button',{style:btn,disabled:busy||!files.length,onClick:runAnalysis},status==='loading'?`Analyse ${progress}/${files.length}…`:'Analyser les captures'),
          e('button',{style:btn,disabled:busy,onClick:()=>{setAck(false);setDraft([...visible,{kind:'survey',id:Date.now(),q:'Nouvelle question',theme:'Usages des écrans',responseType:'unknown',respondents:null,options:[{label:'Réponse à compléter',count:null,percent:null}],sourceFile:'Saisie manuelle',note:''}]);}},'Ajouter une question manuellement')),
        retry && e('p',null,retry),
        errors.length>0 && e('div',{role:'alert'},e('p',null,`${errors.length} fichier(s) ou question(s) non restitué(s) : vérifier avant diffusion.`),...errors.map((x,i)=>e('p',{key:i},`${x.file} : ${x.motif}`)))),
      e('section',{style:card},e('h2',{style:{fontSize:18}},'3. Vérifier les réponses'),
        e('p',null,`${visible.length} question(s). Recopie les effectifs et pourcentages visibles ; laisse les inconnus vides. Le nombre de répondants se vérifie pour chaque question, indépendamment de l’effectif de classe. Coche « Retenir dans la synthèse » pour les constats à présenter en première partie du rapport.`),
        ...visible.map((q,i)=>e('article',{key:i,style:{borderTop:'1px solid #ccd9df',marginTop:16,paddingTop:12}},
          field(`Question ${i+1}`,q.q,v=>update(i,{q:v})),
          e('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,220px),1fr))',gap:10,marginTop:8}},
            field('Thème descriptif',q.theme,v=>update(i,{theme:v})),
            field('Répondants visibles sur cette question',q.respondents,v=>update(i,{respondents:v===''?null:Number(v)}),'number',{min:0,step:1}),
            e('label',null,'Type de réponse',e('select',{value:q.responseType,onChange:ev=>update(i,{responseType:ev.target.value}),style},
              ...[['unknown','À confirmer'],['single','Réponse unique'],['multiple','Réponses multiples'],['free','Contributions libres']].map(([v,l])=>e('option',{key:v,value:v},l))))),
          ...q.options.map((o,j)=>e('div',{key:j,style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,145px),1fr))',gap:8,marginTop:10,background:'#f4f8fa',padding:10,borderRadius:8}},
            field('Réponse',o.label,v=>update(i,{options:q.options.map((x,k)=>j===k?{...x,label:v}:x)})),
            field(q.responseType==='free'?'Contributions':'Effectif affiché',o.count,v=>update(i,{options:q.options.map((x,k)=>j===k?{...x,count:v===''?null:Number(v)}:x)}),'number',{min:0,step:1}),
            field('Pourcentage affiché',o.percent,v=>update(i,{options:q.options.map((x,k)=>j===k?{...x,percent:v===''?null:Number(v)}:x)}),'number',{min:0,max:100,step:'any'}),
            e('div',null,e('p',null,P.optionValue(q,o)),e('label',null,e('input',{type:'checkbox',checked:o.highlight===true,onChange:ev=>update(i,{options:q.options.map((x,k)=>j===k?{...x,highlight:ev.target.checked}:x)})}),' Retenir dans la synthèse'),e('button',{style:btn,onClick:()=>update(i,{options:q.options.filter((_,k)=>j!==k)})},'Retirer la réponse')))),
          e('div',{style:{display:'flex',gap:8,flexWrap:'wrap',margin:'8px 0'}},
            e('button',{style:btn,onClick:()=>update(i,{options:[...q.options,{label:'Nouvelle réponse',count:null,percent:null}]})},'Ajouter une réponse'),
            e('button',{style:btn,onClick:()=>{setAck(false);setDraft(visible.filter((_,k)=>i!==k));}},'Retirer la question')),
          field('Observation / ambiguïté à signaler',q.note,v=>update(i,{note:v})),e('p',{style:{fontSize:12}},`Source : ${q.sourceFile||'Saisie manuelle'}`))),
        warningRows.length>0 && e('aside',{style:{background:'#fff7df',padding:12,marginTop:12}},e('strong',null,'Points à clarifier'),e('ul',{style:{paddingLeft:20}},...warningRows.map((w,i)=>e('li',{key:i},w)))),
        !noDraft && e('button',{style:{...btn,marginTop:12},disabled:busy,onClick:()=>{
          try{const questions=visible.map(q=>P.normalizeQuestion(q));setData(d=>({...d,questions}));setDraft(null);setAck(false);setMessage('Réponses appliquées. Relis les points à clarifier avant le rapport.');}
          catch(err){setMessage(err.message);}
        }},'Appliquer les réponses vérifiées')),
      normalized && data.questions.length>0 && e('section',{style:card},e('h2',{style:{fontSize:18,marginBottom:10}},'4. Graphiques et radar'),
        e('p',null,'Les barres décrivent les réponses ; les échelles en nombres sont propres à chaque question. Le radar nécessite des répondants et effectifs vérifiés. L’ordre de ses axes suit les options de la source ; sa surface n’est pas un score.'),
        e('label',null,'Question du radar',e('select',{'aria-label':'Question du radar',value:String(P.selectedRadar(normalized)?.id??''),disabled:busy,style,onChange:ev=>setData(d=>({...d,radarQuestionId:ev.target.value}))},
          ...P.radarCandidates(normalized.questions).map((q,i)=>e('option',{key:String(q.id),value:String(q.id)},`${i+1}. ${q.q}`)))),
        e('div',{className:'prevention-charts',dangerouslySetInnerHTML:{__html:P.chartsHTML(normalized)}})),
      e('section',{style:card},e('h2',{style:{fontSize:18,marginBottom:12}},'5. Préparer le rapport à la direction'),
        e('p',{style:{marginBottom:12}},'La rédaction envoie à Anthropic l’établissement, la classe, la date, l’objectif, les conditions de passation, tes actions et ton suivi, ainsi que les libellés et résultats des réponses, y compris les mots des réponses libres. Le nom de l’animateur n’est pas envoyé. Vérifie tous ces champs avant génération : aucun nom, donnée personnelle ni information individuelle ou confidentielle.'),
        e('label',null,'Actions proposées (à adapter par l’équipe)',e('textarea',{value:meta.actions,rows:4,style,onChange:ev=>setMeta('actions',ev.target.value),placeholder:'Repères sur les usages du soir, sommeil, pauses et activités sans écran ; échange avec les familles. Supports visuels et situations concrètes.'})),
        e('label',null,'Suivi proposé',e('textarea',{value:meta.followup,rows:3,style,onChange:ev=>setMeta('followup',ev.target.value),placeholder:'Reprendre les mêmes questions après les séances et préciser les répondants à chaque passage.'})),
        e('label',{style:{display:'block',margin:'12px 0'}},e('input',{type:'checkbox',checked:ack,onChange:ev=>setAck(ev.target.checked)}),' J’ai vérifié les réponses, les répondants et les points à clarifier. Le rapport sera relu avant transmission.'),
        e('div',{style:{display:'flex',gap:10,flexWrap:'wrap'}},
          e('button',{style:{...btn,background:'#197d89',color:'#fff'},disabled:busy,onClick:()=>exportReport(true)},generating?'Rédaction par Claude…':'Rapport avec Claude / PDF'),
          e('button',{style:btn,disabled:busy,onClick:()=>exportReport(false)},'Rapport descriptif / PDF'),
          normalized && P.hasCurrentSynthesis(normalized) && e('button',{style:btn,disabled:busy,onClick:()=>exportReport(true,true)},'Régénérer la synthèse Claude'),
          e('button',{style:btn,disabled:busy||!noDraft,onClick:()=>download(JSON.stringify(P.validateSession(data),null,2),'Questionnaire_prevention.json','application/json')},'Sauvegarder le JSON'),
          e('label',{style:btn},'Ouvrir un JSON prévention',e('input',{type:'file',accept:'.json',disabled:busy,'aria-label':'Ouvrir un JSON prévention',style:{display:'block',maxWidth:220},onChange:async ev=>{
            try{const file=ev.target.files[0];if(!file)return;const restored=P.validateSession(JSON.parse(await file.text()));
              if((data.questions.length||draft!==null)&&!confirm('Remplacer le questionnaire courant ? Exporte-le auparavant si nécessaire.'))return;
              setData(restored);setDraft(null);setAck(false);setFiles([]);setErrors([]);setMessage('Questionnaire restauré ; vérifie-le avant diffusion.');
            }catch(err){setMessage(err.message);}finally{ev.target.value='';}
          }}))),
        e('p',{style:{fontSize:12,marginTop:12}},'Le rapport avec Claude transmet les résultats, libellés et textes libres décrits ci-dessus à Anthropic pour une rédaction personnalisée. Une synthèse déjà générée est réutilisée tant que les données ne changent pas. Relis les constats et recommandations avant transmission. Les anciennes notes de quiz nécessitent les captures sources.'))
    );
  };
})();
