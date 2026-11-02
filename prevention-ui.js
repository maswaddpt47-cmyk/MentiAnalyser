/* Parcours distinct : les données de prévention ne passent pas dans les KPI quiz. */
(function () {
  'use strict';
  window.PreventionApp = function PreventionApp({analyse, unlock}) {
    const e = React.createElement, P = Prevention;
    const [data, setData] = React.useState(() => {
      try { return P.validateSession(JSON.parse(localStorage.getItem('menti_prevention_v1'))); }
      catch { return {version:P.VERSION,meta:{title:'Usages des écrans et besoins de prévention',school:'',group:'',date:'',facilitator:'',classSize:null,objective:'',conditions:'',actions:'',followup:''},questions:[]}; }
    });
    const [draft, setDraft] = React.useState(null);
    const [files,setFiles] = React.useState([]);
    const [password,setPassword] = React.useState('');
    const [apiKey,setKey] = React.useState('');
    const [status,setStatus] = React.useState('idle');
    const [progress,setProgress] = React.useState(0);
    const [retry,setRetry] = React.useState(null);
    const [errors,setErrors] = React.useState([]);
    const [message,setMessage] = React.useState('');
    const [ack,setAck] = React.useState(false);
    const busy = status === 'loading';
    React.useEffect(()=>{
      try { localStorage.setItem('menti_prevention_v1',JSON.stringify(data)); }
      catch { setMessage('Sauvegarde locale impossible : exporte le JSON pour conserver ton travail.'); }
    },[data]);
    const meta = data.meta, visible = draft === null ? data.questions : draft;
    const style = {border:'1px solid #b6c7d2',borderRadius:7,padding:'8px',font:'inherit',width:'100%',minWidth:0};
    const btn = {border:'1px solid #197d89',borderRadius:8,padding:'9px 13px',background:'#fff',color:'#145b64',fontWeight:600};
    const card = {padding:18,background:'#fff',border:'1px solid #d9e3e9',borderRadius:12,marginBottom:16,minWidth:0};
    const field = (label, value, fn, type='text', extra={}) => e('label',{style:{display:'block',minWidth:0}},
      e('span',{style:{display:'block',fontSize:12,fontWeight:600,marginBottom:4}},label),
      e('input',{...extra,type,value:value??'',onChange:ev=>fn(ev.target.value),style}));
    const setMeta = (key,value) => setData(d=>({...d,meta:{...d.meta,[key]:value}}));
    const update = (index,patch) => {setAck(false);setDraft(visible.map((q,i)=>i===index?{...q,...patch}:q));};
    const warningRows = visible.flatMap(q=>{
      try {return P.warnings(P.normalizeQuestion(q),Number(meta.classSize)||null).map(w=>`${q.q} — ${w}`);}
      catch(err){return [`${q.q} — ${err.message}`];}
    });
    function download(content,name,type) {
      const url=URL.createObjectURL(new Blob([content],{type}));
      const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
    }
    function exportReport() {
      if(draft!==null){setMessage('Vérifie puis applique les réponses avant de générer le rapport.');return;}
      if(!data.questions.length){setMessage('Ajoute ou importe les résultats du questionnaire.');return;}
      if(!meta.group.trim() || !Number(meta.classSize)){setMessage('Renseigne la classe et son effectif avant de générer le rapport.');return;}
      if(!ack){setMessage('Relis les réponses et les points à clarifier, puis coche la confirmation.');return;}
      try {
        const html=P.reportHTML(data), win=window.open('','_blank');
        if(!win) {download(html,'Rapport_prevention.html','text/html;charset=utf-8');setMessage('Rapport HTML téléchargé : ouvre-le puis choisis Imprimer / Enregistrer en PDF.');return;}
        win.opener=null;win.document.open();win.document.write(html);win.document.close();
        setMessage('Rapport ouvert. Utilise Imprimer / Enregistrer en PDF après relecture.');
      } catch(err){setMessage(err.message);}
    }
    async function selectFiles(list) {
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
        setFiles(all);setErrors([]);setStatus('idle');
      } catch(err){setMessage('Impossible de lire les fichiers : '+err.message);}
    }
    async function runAnalysis() {
      let key=apiKey;
      if(!key) {
        key=await unlock(password);
        if(!key){setMessage('Mot de passe IA incorrect. Tu peux aussi saisir les réponses manuellement.');return;}
        setKey(key);setPassword('');
      }
      setMessage('');setAck(false);
      await analyse(files,key,setStatus,setProgress,setRetry,results=>setDraft(results),setErrors,()=>{},'', 'prevention');
    }
    const noDraft = draft === null;
    return e('main',{style:{maxWidth:1050,margin:'0 auto',padding:'20px 16px',overflowWrap:'anywhere'}},
      e('h1',{style:{fontSize:24,color:'#197d89',marginBottom:8}},'Usages des écrans et prévention'),
      e('p',{style:{marginBottom:16}},'Un bilan des pratiques déclarées et des besoins d’accompagnement, destiné à l’équipe éducative. Les résultats sont conservés dans ce navigateur ; exporte le JSON pour les transférer.'),
      message && e('p',{role:'status',style:{...card,background:'#fff7df'}},message),
      e('section',{style:card},e('h2',{style:{fontSize:18,marginBottom:12}},'1. Contexte du rapport'),
        e('div',{style:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,240px),1fr))',gap:12}},
          field('Titre',meta.title,v=>setMeta('title',v)),field('Établissement',meta.school,v=>setMeta('school',v)),
          field('Classe / groupe',meta.group,v=>{setAck(false);setMeta('group',v);},'text',{placeholder:'Ex. 6ᵉ SEGPA'}),
          field('Effectif total de la classe',meta.classSize,v=>{setAck(false);setMeta('classSize',v===''?null:Number(v));},'number',{min:1,step:1}),
          field('Date du questionnaire',meta.date,v=>setMeta('date',v),'date'),field('Animateur / animatrice',meta.facilitator,v=>setMeta('facilitator',v))),
        e('label',{style:{display:'block',marginTop:12}},'Objectif de l’atelier',e('textarea',{value:meta.objective,onChange:ev=>setMeta('objective',ev.target.value),placeholder:'Recueillir les habitudes, ouvrir le dialogue et adapter la prévention.',style,rows:2})),
        e('label',{style:{display:'block',marginTop:12}},'Conditions de passation (facultatif)',e('textarea',{value:meta.conditions,onChange:ev=>setMeta('conditions',ev.target.value),placeholder:'À renseigner selon la séance : lecture à voix haute, aide à la compréhension, réponses individuelles… Sans nom ni information individuelle.',style,rows:2}))),
      e('section',{style:card},e('h2',{style:{fontSize:18,marginBottom:12}},'2. Importer les résultats sources'),
        e('p',null,'Importe les captures de résultats, pas l’ancien rapport. L’analyse IA transmet ces fichiers au service Anthropic : utilise uniquement des résultats anonymes autorisés, sans noms ni informations individuelles.'),
        e('input',{type:'file',multiple:true,accept:'.png,.jpg,.jpeg,.zip,.pdf',disabled:busy,'aria-label':'Captures sources',onChange:ev=>selectFiles(Array.from(ev.target.files||[])),style:{margin:'12px 0',maxWidth:'100%'}}),
        e('p',null,`${files.length} fichier(s) source(s) sélectionné(s).`),
        field('Mot de passe IA (pour analyser les captures)',password,setPassword,'password',{autoComplete:'off',disabled:busy}),
        e('div',{style:{display:'flex',gap:10,flexWrap:'wrap',marginTop:12}},
          e('button',{style:btn,disabled:busy||!files.length,onClick:runAnalysis},busy?`Analyse ${progress}/${files.length}…`:'Analyser les captures'),
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
      e('section',{style:card},e('h2',{style:{fontSize:18,marginBottom:12}},'4. Préparer le rapport à la direction'),
        e('label',null,'Actions proposées (à adapter par l’équipe)',e('textarea',{value:meta.actions,rows:4,style,onChange:ev=>setMeta('actions',ev.target.value),placeholder:'Repères sur les usages du soir, sommeil, pauses et activités sans écran ; échange avec les familles. Supports visuels et situations concrètes.'})),
        e('label',null,'Suivi proposé',e('textarea',{value:meta.followup,rows:3,style,onChange:ev=>setMeta('followup',ev.target.value),placeholder:'Reprendre les mêmes questions après les séances et préciser les répondants à chaque passage.'})),
        e('label',{style:{display:'block',margin:'12px 0'}},e('input',{type:'checkbox',checked:ack,onChange:ev=>setAck(ev.target.checked)}),' J’ai vérifié les réponses, les répondants et les points à clarifier. Le rapport sera relu avant transmission.'),
        e('div',{style:{display:'flex',gap:10,flexWrap:'wrap'}},
          e('button',{style:{...btn,background:'#197d89',color:'#fff'},disabled:busy,onClick:exportReport},'Rapport pour la direction / PDF'),
          e('button',{style:btn,disabled:busy||!noDraft,onClick:()=>download(JSON.stringify(P.validateSession(data),null,2),'Questionnaire_prevention.json','application/json')},'Sauvegarder le JSON'),
          e('label',{style:btn},'Ouvrir un JSON prévention',e('input',{type:'file',accept:'.json',disabled:busy,'aria-label':'Ouvrir un JSON prévention',style:{display:'block',maxWidth:220},onChange:async ev=>{
            try{const file=ev.target.files[0];if(!file)return;const restored=P.validateSession(JSON.parse(await file.text()));
              if((data.questions.length||draft!==null)&&!confirm('Remplacer le questionnaire courant ? Exporte-le auparavant si nécessaire.'))return;
              setData(restored);setDraft(null);setAck(false);setFiles([]);setErrors([]);setMessage('Questionnaire restauré ; vérifie-le avant diffusion.');
            }catch(err){setMessage(err.message);}finally{ev.target.value='';}
          }}))),
        e('p',{style:{fontSize:12,marginTop:12}},'Le rapport utilise les réponses vérifiées et les pistes saisies, sans génération IA supplémentaire. Les anciennes notes de quiz ne peuvent pas être converties : réimporte les captures sources.'))
    );
  };
})();
