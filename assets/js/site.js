(function(){
  const money = n => '₹' + Number(n).toLocaleString('en-IN',{maximumFractionDigits:2});
  const val = id => Number(document.getElementById(id)?.value || 0);

  const sizingBtn=document.getElementById('ksSizingBtn');
  if(sizingBtn){ sizingBtn.addEventListener('click',()=>{
    const pods=val('ksPods'), cpu=val('ksCpu'), mem=val('ksMem'), nodeCpu=val('ksNodeCpu')*1000, nodeMem=val('ksNodeMem')*1024, reserve=val('ksReserve')/100, headroom=val('ksHeadroom')/100;
    if(!pods||!cpu||!mem||!nodeCpu||!nodeMem||reserve>=1||headroom>=1) return;
    const baseCpu=nodeCpu*(1-reserve), baseMem=nodeMem*(1-reserve);
    const totalCpu=pods*cpu, totalMem=pods*mem;
    const min=Math.max(Math.ceil(totalCpu/baseCpu),Math.ceil(totalMem/baseMem));
    const usableCpu=baseCpu*(1-headroom), usableMem=baseMem*(1-headroom);
    const rec=Math.max(Math.ceil(totalCpu/usableCpu),Math.ceil(totalMem/usableMem));
    document.getElementById('ksMinNodes').textContent=min;
    document.getElementById('ksRecNodes').textContent=rec;
    document.getElementById('ksSizingText').textContent=`Workload requests total ${(totalCpu/1000).toFixed(1)} vCPU and ${(totalMem/1024).toFixed(1)} GiB. Minimum uses only the system reserve. Recommended also keeps ${Math.round(headroom*100)}% workload headroom.`;
  }); sizingBtn.click(); }

  const rqBtn=document.getElementById('rqBtn');
  if(rqBtn){rqBtn.addEventListener('click',()=>{
    const ca=val('rqCpuAvg'), cp=val('rqCpuP95'), cx=val('rqCpuPeak'), ma=val('rqMemAvg'), mp=val('rqMemP95'), mx=val('rqMemPeak');
    const cpuReqLo=Math.max(ca*1.15,cp*0.8), cpuReqHi=Math.max(ca*1.3,cp); const cpuLimLo=Math.max(cp*1.2,cx*1.05),cpuLimHi=Math.max(cp*1.5,cx*1.25);
    const memReqLo=Math.max(ma*1.15,mp*0.9), memReqHi=Math.max(ma*1.3,mp); const memLimLo=Math.max(mp*1.15,mx*1.05),memLimHi=Math.max(mp*1.3,mx*1.2);
    const r=(a,b,u)=>`${Math.round(a)}-${Math.round(b)} ${u}`;
    document.getElementById('rqCpuRequest').textContent=r(cpuReqLo,cpuReqHi,'m'); document.getElementById('rqCpuLimit').textContent=r(cpuLimLo,cpuLimHi,'m'); document.getElementById('rqMemRequest').textContent=r(memReqLo,memReqHi,'MiB'); document.getElementById('rqMemLimit').textContent=r(memLimLo,memLimHi,'MiB');
    document.getElementById('rqText').textContent='Start with a small rollout. CPU limits can throttle bursts, while memory limits can trigger OOM kills. Validate with latency, throttling, memory pressure and restarts.';
  });rqBtn.click();}

  const hpaBtn=document.getElementById('hpaBtn');
  if(hpaBtn){hpaBtn.addEventListener('click',()=>{
    const r=val('hpaReplicas'),c=val('hpaCurrent'),t=val('hpaTarget'),mn=val('hpaMin'),mx=val('hpaMax'); if(!r||!c||!t)return;
    const raw=Math.ceil(r*c/t), desired=Math.max(mn,Math.min(mx,raw)); document.getElementById('hpaDesired').textContent=desired; document.getElementById('hpaFormula').textContent=`ceil(${r} × ${c} / ${t}) = ${raw}. Replica bounds produce ${desired}. Real HPA behavior also considers tolerance, missing metrics and configured behavior policies.`;
  });hpaBtn.click();}

  const costBtn=document.getElementById('costBtn');
  if(costBtn){costBtn.addEventListener('click',()=>{
    const compute=val('costNodes')*val('costNodeRate')*val('costHours')*val('costDays'); const subtotal=compute+val('costControl')+val('costStorage')+val('costNetwork')+val('costOther'); const tax=subtotal*val('costGst')/100; const total=subtotal+tax;
    document.getElementById('costCompute').textContent=money(compute); document.getElementById('costSubtotal').textContent=money(subtotal); document.getElementById('costTax').textContent=money(tax); document.getElementById('costTotal').textContent=money(total);
  });costBtn.click();}

  const versionBtn=document.getElementById('versionBtn');
  if(versionBtn){const data={
    '1.37':{status:'Supported',patch:'1.37.0',release:'26 Aug 2026',eol:'28 Oct 2027',advice:'Current upstream minor release. Validate add-on and workload compatibility before upgrading production.'},
    '1.36':{status:'Supported',patch:'1.36.4',release:'23 Apr 2026',eol:'28 Jun 2027',advice:'Supported upstream. Plan routine upgrades rather than waiting for the final support months.'},
    '1.35':{status:'Supported',patch:'1.35.8',release:'17 Dec 2025',eol:'28 Feb 2027',advice:'Supported upstream, but teams should already have the next minor-version upgrade path tested.'},
    '1.34':{status:'Near upstream EOL',patch:'1.34.11',release:'27 Aug 2025',eol:'27 Oct 2026',advice:'Upgrade planning should be active now. Check deprecated APIs and add-on compatibility before moving to a supported newer minor.'}
  }; const render=()=>{const x=data[document.getElementById('versionSelect').value];document.getElementById('versionStatus').textContent=x.status;document.getElementById('versionPatch').textContent=x.patch;document.getElementById('versionRelease').textContent=x.release;document.getElementById('versionEol').textContent=x.eol;document.getElementById('versionAdvice').textContent=x.advice;};versionBtn.addEventListener('click',render);render();}

  const cf=document.getElementById('contactForm');
  if(cf){cf.addEventListener('submit',e=>{e.preventDefault(); const subject=encodeURIComponent(document.getElementById('contactType').value+' - KubeSizer'); const body=encodeURIComponent(`Name: ${document.getElementById('contactName').value}\nEmail: ${document.getElementById('contactEmail').value}\n\n${document.getElementById('contactMessage').value}`); window.location.href=`mailto:support@kubesizer.com?subject=${subject}&body=${body}`;});}
})();