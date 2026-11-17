(function(scope){
 'use strict';
 function flags(c){return {domicile:c.domicile_confirme===true,whatsapp:c.whatsapp.confirme===true&&/^\+?\d{8,15}$/.test(c.whatsapp.numero||''),youtube:c.youtube_actif===true,smartphone:c.smartphone_propose===true,tarifsNote:c.tarifs_valides!==true};}
 function format(t){const p=t.prix_publie;return typeof p==='number'?p+' €':p&&typeof p==='object'?p.min+'–'+p.max+' €':p;}
 function estimate(tarifs,ids){
  const items=tarifs.filter(t=>t.estimable&&ids.includes(t.id));let min=0,devis=false,range=false;
  for(const t of items){const p=t.prix_publie;if(typeof p==='number')min+=p;else if(p&&typeof p==='object'){min+=p.min;range=true;}else devis=true;}
  const text=!items.length?'Sélectionne une prestation.':`À partir de ${min} €${range?' (fourchette : montant minimum retenu)':''}${devis?' + prestation sur devis (non chiffrée)':''}. Pièces en sus, estimation non contractuelle, prix nets, TVA non applicable.`;
  return {min,devis,range,items,text};
 }
 function testMode(loc){return loc.protocol==='file:'||['localhost','127.0.0.1','[::1]'].includes(loc.hostname)||new URLSearchParams(loc.search).get('test')==='1';}
 function suivi(date,crypto){const stamp=[date.getFullYear(),String(date.getMonth()+1).padStart(2,'0'),String(date.getDate()).padStart(2,'0')].join('');const a=new Uint8Array(4);crypto.getRandomValues(a);return 'PD-'+stamp+'-'+Array.from(a,x=>x.toString(16).padStart(2,'0')).join('');}
 async function transmit({isTest,consent,message,body,send}){
  if(!consent||message.length<10||message.length>2000)return {state:'invalid'};
  if(isTest)return {state:'test'};
  try {const res=await send('/',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body});return {state:res.ok?'success':'error'};}catch{return {state:'error'};}
 }
 function applyConfig(doc,c){
  const f=flags(c);const visibility=(selector,on)=>doc.querySelectorAll(selector).forEach(x=>x.hidden=!on);
  visibility('[data-domicile]',f.domicile);visibility('[data-domicile-inconnu]',!f.domicile);visibility('[data-whatsapp]',f.whatsapp);visibility('[data-youtube]',f.youtube);visibility('[data-smartphone]',f.smartphone);visibility('[data-tarifs-note]',f.tarifsNote);
  doc.querySelectorAll('[data-wa-link]').forEach(x=>{if(f.whatsapp)x.href='https://wa.me/'+c.whatsapp.numero.replace(/\D/g,'');else x.removeAttribute('href');});
  doc.querySelectorAll('[data-statut]').forEach(x=>x.textContent=c.statut==='pre-ouverture'?'Ouverture prochainement':'Statut à confirmer');
  doc.querySelectorAll('[data-siret]').forEach(x=>x.textContent=c.siret?'SIRET : '+c.siret:'SIRET en cours d’immatriculation');
  doc.querySelectorAll('[data-date-ouverture]').forEach(x=>{x.hidden=!c.date_ouverture;x.textContent=c.date_ouverture?'Date d’ouverture : '+c.date_ouverture:'';});
  return f;
 }
 function init(doc,data,loc){
  const c=data.config,tarifs=data.tarifs;applyConfig(doc,c);
  const options=doc.getElementById('estimateur-options');
  tarifs.filter(t=>t.estimable&&(!t.domicile||c.domicile_confirme)).forEach(t=>{const label=doc.createElement('label'),input=doc.createElement('input');input.type='checkbox';input.value=t.id;input.id='est-'+t.id;label.htmlFor=input.id;label.append(input,doc.createTextNode(' '+t.nom+' — '+format(t)));options.append(label);});
  const selected=()=>Array.from(options.querySelectorAll('input:checked'),x=>x.value);
  const update=()=>{const e=estimate(tarifs,selected());doc.getElementById('estimation-total').textContent=e.text;return e;};
  options.addEventListener('change',update);
  doc.getElementById('estimation-devis').addEventListener('click',()=>{const e=update();if(!e.items.length){options.querySelector('input')?.focus();return;}const message=doc.getElementById('f-message');message.value=('Estimation : '+e.items.map(t=>t.nom+' ('+format(t)+')').join(', ')+'. '+e.text+'\nSymptômes : ').slice(0,2000);doc.getElementById('contact').scrollIntoView();message.focus();});
  const form=doc.getElementById('devis-form'),isTest=testMode(loc),ok=doc.getElementById('formOk'),err=doc.getElementById('formErr');let busy=false;
  doc.getElementById('mode-test').hidden=!isTest;
  form.addEventListener('submit',async event=>{
   event.preventDefault();if(busy)return;ok.style.display='none';err.style.display='none';if(!form.reportValidity())return;
   const tracking=doc.getElementById('suivi');if(!tracking.value)tracking.value=suivi(new Date(),scope.crypto);
   const fields=new FormData(form);fields.set('message',doc.getElementById('f-message').value+'\nNuméro de suivi : '+tracking.value);
   busy=true;const button=form.querySelector('[type=submit]');button.disabled=true;
   const result=await transmit({isTest,consent:doc.getElementById('consentement').checked,message:doc.getElementById('f-message').value,body:new URLSearchParams(fields).toString(),send:(...args)=>scope.fetch(...args)});
   busy=false;button.disabled=false;
   const ref=' Référence : '+tracking.value+'.';
   if(result.state==='success'){ok.textContent='Merci ! Ta demande a été transmise au service de formulaires.'+ref+' Conserve cette référence ; elle ne garantit pas la réception d’une notification e-mail.';ok.style.display='block';form.reset();}
   else{err.textContent=(result.state==='test'?'MODE TEST — rien n’est envoyé.':result.state==='invalid'?'Vérifie le consentement et le message (10 à 2000 caractères).':'Échec de l’envoi. Ta demande n’est pas confirmée. Contacte '+c.coordonnees.telephone+' ou '+c.coordonnees.email+'.')+ref;err.style.display='block';}
  });
 }
 const api={flags,estimate,testMode,suivi,transmit,applyConfig,init};
 if(typeof module!=='undefined')module.exports=api;
 else{scope.PixelDoc=api;init(scope.document,scope.PIXELDOC_DATA,scope.location);}
})(typeof window!=='undefined'?window:globalThis);
