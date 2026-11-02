const {test}=require('node:test'),assert=require('node:assert/strict');
const {recover,EXPIRED,REPOSITORY}=require('./cancel-expired-pages.cjs');
const response=status=>({ok:true,status:200,json:async()=>({status})});
const api=handler=>async(url,options)=>{
 if(url.endsWith('/actions/runs/41508087944'))return {ok:true,json:async()=>({head_sha:EXPIRED})};
 if(url.includes('/jobs?'))return {ok:true,json:async()=>({jobs:[{id:123,name:'deploy'}]})};
 if(url.endsWith('/actions/jobs/123/logs'))return {ok:true,text:async()=>`Created deployment for ${EXPIRED}, ID: 424242`};
 return handler(url,options);
};
test('ne touche pas à une publication terminée et refuse un autre dépôt',async()=>{
 let calls=0;
 await recover({token:'fixture',repository:REPOSITORY,request:api(async()=>{calls++;return response('succeed');}),log:()=>{}});
 assert.equal(calls,1);
 await assert.rejects(()=>recover({token:'fixture',repository:'autre/depot',request:api(async()=>{calls++;}),log:()=>{}}),/invalide/);
 assert.equal(calls,1);
});
test('annule uniquement la publication expirée identifiée, puis vérifie son arrêt',async()=>{
 const calls=[];
 await recover({token:'fixture',repository:REPOSITORY,wait:async()=>{},log:()=>{},request:api(async(url,options)=>{
  calls.push({url,method:options.method||'GET'});
  if(options.method==='POST')return {ok:true,status:200};
  return response(calls.length===1?'deployment_in_progress':'deployment_cancelled');
 })});
 assert.deepEqual(calls.map(x=>x.method),['GET','POST','GET']);
 assert.equal(calls[1].url,`https://api.github.com/repos/${REPOSITORY}/pages/deployments/424242/cancel`);
});
test('un état inconnu ne déclenche pas une annulation',async()=>{
 let posts=0;
 await assert.rejects(()=>recover({token:'fixture',repository:REPOSITORY,log:()=>{},request:api(async(_,options)=>{
  if(options.method==='POST')posts++;
  return response('unknown_status');
 })}),/aucune annulation/);
 assert.equal(posts,0);
});
