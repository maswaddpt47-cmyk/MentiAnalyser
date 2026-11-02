// Récupération ciblée après le timeout constaté du workflow 41508087944.
const EXPIRED = 'ec61cdb16494c902389fcee989046e26e4e6a09f';
const REPOSITORY = 'maswaddpt47-cmyk/MentiAnalyser';
const terminal = new Set(['succeed','deployment_failed','deployment_perms_error','deployment_content_failed','deployment_cancelled','deployment_lost']);
const active = new Set(['queued','in_progress','deployment_queued','deployment_in_progress','deployment_syncing_files']);
async function recover({token,repository,request=fetch,wait=ms=>new Promise(resolve=>setTimeout(resolve,ms)),log=console.log}) {
  if(repository !== REPOSITORY || !token) throw new Error('Contexte de récupération Pages invalide.');
  const url=`https://api.github.com/repos/${REPOSITORY}/pages/deployments/${EXPIRED}`;
  const headers={Authorization:`Bearer ${token}`,Accept:'application/vnd.github+json','X-GitHub-Api-Version':'2022-11-28'};
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
if(require.main===module)recover({token:process.env.GITHUB_TOKEN,repository:process.env.GITHUB_REPOSITORY}).catch(e=>{console.error(e.message);process.exitCode=1;});
