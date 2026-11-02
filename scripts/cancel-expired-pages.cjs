// Récupération ciblée après le timeout constaté du workflow 41508087944.
const EXPIRED = 'ec61cdb16494c902389fcee989046e26e4e6a09f';
const REPOSITORY = 'maswaddpt47-cmyk/MentiAnalyser';
const terminal = new Set(['succeed','deployment_failed','deployment_perms_error','deployment_content_failed','deployment_cancelled','deployment_lost']);
const active = new Set(['queued','in_progress','deployment_queued','deployment_in_progress','deployment_syncing_files']);
async function recover({token,repository,request=fetch,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),log=console.log}) {
  if(repository !== REPOSITORY || !token) throw new Error('Contexte de récupération Pages invalide.');
  const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
  const base=`https://api.github.com/repos/${REPOSITORY}`;
  async function read(path) {
    const r=await request(base+path,{headers});
    if(!r.ok)throw new Error(`Lecture de la publication expirée : HTTP ${r.status}.`);
    return r;
  }
  const run=await (await read('/actions/runs/41508087944')).json();
  if(run.head_sha!==EXPIRED)throw new Error('La publication ne correspond pas au commit expiré : aucune annulation.');
  const jobs=await (await read('/actions/runs/41508087944/jobs?per_page=100')).json();
  const job=jobs.jobs?.find(j=>j.name==='deploy');
  if(!Number.isSafeInteger(job?.id))throw new Error('Étape de publication expirée introuvable.');
  const logs=await (await read(`/actions/jobs/${job.id}/logs`)).text();
  const match=logs.match(new RegExp(`Created deployment for ${EXPIRED}, ID: ([a-zA-Z0-9_-]+)`));
  if(!match)throw new Error('Identifiant interne Pages introuvable : aucune annulation.');
  const deploymentId=match[1];
  const url=`${base}/pages/deployments/${deploymentId}`;

  async function status() {
    const r=await request(url,{headers});
    if(r.status===404)return 'absent';
    if(!r.ok)throw new Error(`Lecture du déploiement expiré : HTTP ${r.status}.`);
    return (await r.json()).status;
  }
  const before=await status();log(`Déploiement expiré ${EXPIRED.slice(0,7)} : ${before}`);
  if(before==='absent' || terminal.has(before))return;
  if(!active.has(before))throw new Error('État Pages inconnu : aucune annulation effectuée.');
  const r=await request(url+'/cancel',{method:'POST',headers});
  if(!r.ok)throw new Error(`Annulation ciblée Pages : HTTP ${r.status}.`);
  for(let i=0;i<15;i++) {
    const current=await status();
    if(current==='absent' || terminal.has(current)){log(`Déploiement expiré libéré : ${current}`);return;}
    await wait(2000);
  }
  throw new Error('Annulation demandée mais déploiement encore actif : publication interrompue.');
}
module.exports={recover,EXPIRED,REPOSITORY};
if(require.main===module)recover({token:process.env.GITHUB_TOKEN,repository:process.env.GITHUB_REPOSITORY}).catch(e=>{console.error('::error::'+e.message.replace(/\r/g,'%0D').replace(/\n/g,'%0A'));process.exitCode=1;});
