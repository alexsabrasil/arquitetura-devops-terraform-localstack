const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const statuses=[...document.querySelectorAll('.status')];
const nodes=[...document.querySelectorAll('.node')];
const challenges=[...document.querySelectorAll('.challenge')];
const live=document.getElementById('liveMessage');
let running=false;

function reset(){
  running=false;
  document.getElementById('flow').classList.remove('running');
  [...statuses,...nodes,...challenges].forEach(el=>el.classList.remove('active','done'));
  statuses.forEach(el=>el.querySelector('span').textContent='AGUARDANDO');
  challenges.forEach(el=>el.querySelector('.challenge-state').textContent='OFFLINE');
  live.textContent='Ambiente pronto para demonstração.';
}

async function runDemo(){
  if(running) return;
  reset(); running=true;
  document.getElementById('flow').classList.add('running');

  const active=['APLICANDO IaC...','INICIANDO...','HEALTH CHECK...','PUBLICANDO...'];
  const done=['APPLIED ✓','RUNNING ✓','HEALTHY ✓','AVAILABLE ✓'];
  const messages=[
    'Terraform aplicando a configuração declarada...',
    'Docker Desktop disponibilizando o ambiente de containers...',
    'LocalStack iniciando e simulando os serviços AWS localmente...',
    'Amazon S3 disponível para hospedar os recursos dos desafios...'
  ];

  for(let i=0;i<4;i++){
    statuses[i].classList.add('active');
    statuses[i].querySelector('span').textContent=active[i];
    nodes[i].classList.add('active');
    live.textContent=messages[i];
    await sleep(1000);
    statuses[i].classList.remove('active'); statuses[i].classList.add('done');
    statuses[i].querySelector('span').textContent=done[i];
    nodes[i].classList.remove('active'); nodes[i].classList.add('done');
  }

  for(let i=0;i<challenges.length;i++){
    const ch=challenges[i];
    ch.classList.add('active');
    ch.querySelector('.challenge-state').textContent='PROVISIONANDO';
    live.textContent=`Desafio ${i+1}: validando recursos e aplicações...`;
    await sleep(800);
    ch.classList.remove('active'); ch.classList.add('done');
    ch.querySelector('.challenge-state').textContent='ONLINE ✓';
  }

  document.getElementById('flow').classList.remove('running');
  live.textContent='✓ Ambiente integrado demonstrado: Terraform aplicado, Docker ativo, LocalStack healthy e aplicações disponíveis.';
  running=false;
}

document.getElementById('runFlow').addEventListener('click',runDemo);
document.getElementById('resetFlow').addEventListener('click',reset);
document.getElementById('startDemo').addEventListener('click',()=>{
  document.getElementById('arquitetura').scrollIntoView({behavior:'smooth'});
  setTimeout(runDemo,600);
});
reset();
