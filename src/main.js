import "./style.css";
import { supabase, supabaseConfigured } from "./supabase.js";

const state = {
  page: "dashboard",
  user: JSON.parse(localStorage.getItem("pl_user") || "null"),
  projects: JSON.parse(localStorage.getItem("pl_projects") || "[]"),
  lastResearch: null
};

const sectors = ["Agriculture","Agro-transformation","Énergie","Construction","Environnement","Numérique","Éducation","Transport","Artisanat","Services","Industrie","Santé","Autre"];
const nav = [
  ["dashboard","⌂","Tableau de bord"],
  ["research","⌕","Rechercher des problèmes"],
  ["idea","✦","Construire une idée"],
  ["market","◫","Étude de marché"],
  ["bmc","▦","Business Model Canvas"],
  ["pmv","◉","PMV"],
  ["pitch","◈","Pitch"],
  ["projects","▤","Mes projets"],
  ["settings","⚙","Configuration"]
];

function esc(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c]))}
function save(){localStorage.setItem("pl_projects",JSON.stringify(state.projects))}
function app(){
  document.querySelector("#app").innerHTML = `
  <div class="app">
    <header class="topbar">
      <div class="brand"><div class="logo">P</div><div>ProblemLab<small>Problèmes → Idées → Projets</small></div></div>
      <div class="profile">${state.user?`<div class="avatar">${esc((state.user.name||"U")[0])}</div><span>${esc(state.user.name)}</span><button class="secondary" id="logout">Sortir</button>`:`<button class="secondary" id="login">Connexion</button>`}</div>
    </header>
    <div class="layout">
      <aside class="sidebar">${nav.map(n=>`<button class="navbtn ${state.page===n[0]?"active":""}" data-page="${n[0]}">${n[1]} &nbsp; ${n[2]}</button>`).join("")}</aside>
      <main class="main" id="main"></main>
    </div>
  </div>`;
  document.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{state.page=b.dataset.page;render()});
  document.querySelector("#logout")?.addEventListener("click",()=>{state.user=null;localStorage.removeItem("pl_user");render()});
  document.querySelector("#login")?.addEventListener("click",()=>{state.page="settings";render()});
  renderMain();
}
function render(){app()}
function renderMain(){
  const m=document.querySelector("#main");
  const pages={dashboard:dashboard,research:research,idea:idea,market:market,bmc:bmc,pmv:pmv,pitch:pitch,projects:projects,settings:settings};
  m.innerHTML=(pages[state.page]||dashboard)();
  bind();
}
function dashboard(){return `<section class="hero"><h1>Transforme un problème en projet.</h1><p>ProblemLab vous accompagne de l'identification d'un besoin jusqu'au projet structuré, au PMV, au BMC et au pitch.</p><div class="actions"><button class="primary" data-go="research">🔎 Commencer une recherche</button><button class="secondary" data-go="idea">✦ Construire une idée</button></div></section>
<div class="grid">
<div class="card"><div class="kpi">${state.projects.length}</div><div class="muted">Projets enregistrés</div></div>
<div class="card"><div class="kpi">11</div><div class="muted">blocs du BMC</div></div>
<div class="card"><div class="kpi">7</div><div class="muted">étapes du parcours</div></div>
</div>
<br><div class="grid">
${[["research","🔎","Recherche de problèmes","Explorer un contexte et faire émerger des opportunités."],["idea","💡","Générateur d'idées","Passer du problème à plusieurs solutions possibles."],["market","📊","Étude de marché","Clarifier clients, alternatives, concurrence et positionnement."],["bmc","🧩","Business Model Canvas","Structurer le modèle économique complet."],["pmv","🧪","PMV","Définir le premier produit testable avec peu de moyens."],["pitch","🎤","Pitch","Préparer une présentation claire et convaincante."]].map(x=>`<div class="card"><h3>${x[1]} ${x[2]}</h3><p class="muted">${x[3]}</p><button class="secondary" data-go="${x[0]}">Ouvrir</button></div>`).join("")}</div>`}

function research(){return `<div class="hero"><h1>Recherche intelligente de problèmes</h1><p>Définissez le contexte. La V1 produit une première analyse locale ; la connexion aux sources Internet/IA sera ajoutée côté serveur.</p></div>
<div class="card"><div class="formgrid">
${field("Identité / statut","status","Entrepreneur")}
${field("Continent","continent","Afrique")}
${field("Pays","country","RDC")}
${field("Province / région","province","Kasaï-Central")}
${field("Ville / territoire","city","Kananga")}
${field("Milieu","environment","Urbain et rural")}
${select("Secteur","sector",sectors)}
${field("Capital disponible (FC)","capital","200000","number")}
${field("Objectif","goal","Créer de l'emploi et une activité durable")}
${field("Compétences / ressources","resources","Ex. agriculture, ingénierie, terrain, réseau local")}
${textarea("Contexte / question","context","Quel problème important voulez-vous comprendre ?")}
</div><div class="actions"><button class="primary" id="runResearch">🔎 Analyser le contexte</button></div></div>
<div id="researchResults"></div>`}

function runResearch(){
  const f=readForm(); const sector=f.sector||"services"; const place=[f.city,f.province,f.country].filter(Boolean).join(", ");
  state.lastResearch={...f,place};
  const items=[
    {title:`Accès, coût ou qualité insuffisante des services liés à ${sector.toLowerCase()}`,why:"Les besoins récurrents peuvent créer un espace pour des solutions locales mieux adaptées.",opp:"Service de proximité, distribution, production locale ou transformation."},
    {title:`Pertes de valeur entre producteurs, prestataires et clients`,why:"Une partie de la valeur peut disparaître à cause de la logistique, de l'information ou du manque de transformation.",opp:"Créer une chaîne plus courte et une offre structurée."},
    {title:`Difficulté à tester une solution avant d'investir fortement`,why:"Les porteurs de projets ont besoin de valider la demande avec peu de moyens.",opp:"PMV, précommandes, prototypes simples et tests terrain."}
  ];
  document.querySelector("#researchResults").innerHTML=`<br><div class="card"><h2>Problèmes à investiguer — ${esc(place||"contexte choisi")}</h2><p class="muted">Résultats exploratoires de la V1. Ils doivent être vérifiés par des données terrain et des sources fiables avant toute décision.</p>${items.map((x,i)=>`<div class="card result"><span class="tag">P${i+1}</span><h3>${x.title}</h3><p><b>Pourquoi l'étudier :</b> ${x.why}</p><p><b>Opportunité :</b> ${x.opp}</p><button class="secondary chooseProblem" data-title="${esc(x.title)}">Utiliser pour construire une idée</button></div>`).join("")}</div>`;
  document.querySelectorAll(".chooseProblem").forEach(b=>b.onclick=()=>{localStorage.setItem("pl_problem",b.dataset.title);state.page="idea";render()});
}

function idea(){const problem=localStorage.getItem("pl_problem")||"";return `<div class="hero"><h1>Construire une idée</h1><p>Décrire le problème, proposer une solution, préciser les clients et définir un premier test.</p></div>
<div class="card"><div class="formgrid">${textarea("Problème","problem",problem,"full")}${textarea("Solution envisagée","solution","")} ${field("Client principal","client","")} ${field("Zone","zone",state.lastResearch?.city||"")} ${field("Avantage / différence","advantage","")} ${field("Prix ou modèle de revenu","revenue","")} ${textarea("Ressources disponibles","resources","")} ${textarea("Premier test PMV","test","")}</div><div class="actions"><button class="primary" id="saveProject">💾 Enregistrer le projet</button><button class="secondary" id="makeBmc">Construire le BMC</button></div></div>`}

function market(){return `<div class="hero"><h1>Étude de marché</h1><p>Une structure de travail pour vérifier le besoin avant de dépenser beaucoup.</p></div><div class="grid">
${["Clients et personas","Besoin et fréquence","Alternatives existantes","Concurrents","Prix pratiqués","Canaux d'accès","Positionnement","Test terrain"].map(t=>`<div class="card"><h3>${t}</h3><textarea placeholder="Vos observations..."></textarea></div>`).join("")}</div>`}

const bmcFields=[
["Segments clients","Qui achète ou utilise ?"],["Proposition de valeur","Quel bénéfice concret ?"],["Canaux","Comment atteindre et servir ?"],["Relation client","Comment attirer, servir, fidéliser ?"],["Flux de revenus","Comment l'activité gagne-t-elle de l'argent ?"],["Ressources clés","Quelles ressources indispensables ?"],["Activités clés","Que faut-il faire régulièrement ?"],["Partenaires clés","Qui peut aider ou compléter ?"],["Structure de coûts","Quelles dépenses principales ?"],["Étude de marché / positionnement","Quelle place face aux alternatives ?"],["PMV","Quel premier produit/service testable ?"]
];
function bmc(){return `<div class="hero"><h1>Business Model Canvas</h1><p>Remplissez les 11 blocs. Commencez simplement puis améliorez après les retours du terrain.</p></div><div class="bmc">${bmcFields.map((x,i)=>`<div class="card ${i===1||i===9?"wide":""}"><h3>${i+1}. ${x[0]}</h3><p class="muted">${x[1]}</p><textarea data-bmc="${i}" placeholder="Écrivez ici..."></textarea></div>`).join("")}</div><div class="actions"><button class="primary" id="saveBmc">💾 Sauvegarder le BMC</button></div>`}

function pmv(){return `<div class="hero"><h1>PMV — Produit Minimum Viable</h1><p>Tester l'hypothèse la plus importante avec le minimum de moyens.</p></div><div class="grid">${["Hypothèse principale","Client test","Prototype / maquette","Test à réaliser","Mesure du résultat","Feedback client"].map(t=>`<div class="card"><h3>${t}</h3><textarea placeholder="Définissez..."></textarea></div>`).join("")}</div><div class="card"><h2>Règle pratique</h2><p>Un PMV n'est pas nécessairement un produit final. Selon le projet, un prototype fonctionnel, une maquette, un schéma, une photo, une page de présentation ou une précommande peuvent servir à tester une hypothèse.</p></div>`}

function pitch(){return `<div class="hero"><h1>Préparer le pitch</h1><p>Construisez une présentation courte à partir de votre projet.</p></div><div class="card"><div class="formgrid">${textarea("Problème","p_problem",localStorage.getItem("pl_problem")||"")}${textarea("Solution","p_solution","")}${field("Client cible","p_client","")}${field("Modèle économique","p_model","")}${field("Impact","p_impact","")}${field("Financement recherché","p_funding","")}</div><div class="actions"><button class="primary" id="generatePitch">🎤 Générer mon pitch</button></div><div id="pitchOut"></div></div>`}

function projects(){return `<div class="hero"><h1>Mes projets</h1><p>Vos projets locaux sont conservés dans ce navigateur dans cette V1.</p></div>${state.projects.length?`<div class="list">${state.projects.map((p,i)=>`<div class="card row"><div><b>${esc(p.name||"Projet sans nom")}</b><div class="muted">${esc(p.problem||"")}</div></div><button class="danger" data-delete="${i}">Supprimer</button></div>`).join("")}</div>`:`<div class="card"><p>Aucun projet enregistré pour le moment.</p></div>`}`}

function settings(){return `<div class="hero"><h1>Configuration</h1><p>Préparation à la mise en ligne réelle.</p></div><div class="card"><h2>Compte</h2>${state.user?`<p>Connecté localement en tant que <b>${esc(state.user.name)}</b>.</p>`:`<p>Pour cette V1, la connexion locale est simulée. Supabase permettra l'authentification réelle.</p><div class="formgrid">${field("Nom","loginName","Jean-Paul")}${field("Email","loginEmail","")}${field("Mot de passe","loginPass","••••••••","password")}</div><div class="actions"><button class="primary" id="localLogin">Créer une session de test</button></div>`}</div><br><div class="card"><h2>Connexion Supabase</h2><p>${supabaseConfigured?'<span class="tag">Configuration détectée</span> Les variables VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY sont présentes.':'<span class="tag">À configurer</span> Les variables Supabase ne sont pas encore présentes dans cet environnement.'}</p><p class="muted">La prochaine étape technique consiste à remplacer la session locale par <code>supabase.auth.signUp()</code>, <code>signInWithPassword()</code> et la récupération de mot de passe, puis à enregistrer les projets dans les tables Supabase.</p></div>`}

function field(label,name,value="",type="text"){return `<div class="field"><label>${label}</label><input name="${name}" type="${type}" value="${esc(value)}"></div>`}
function textarea(label,name,value="",extra=""){return `<div class="field ${extra}"><label>${label}</label><textarea name="${name}" rows="4">${esc(value)}</textarea></div>`}
function select(label,name,opts){return `<div class="field"><label>${label}</label><select name="${name}">${opts.map(x=>`<option>${x}</option>`).join("")}</select></div>`}
function readForm(){const o={};document.querySelectorAll("#main input,#main select,#main textarea").forEach(e=>{if(e.name)o[e.name]=e.value});return o}
function bind(){
  document.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>{state.page=b.dataset.go;render()});
  document.querySelector("#runResearch")?.addEventListener("click",runResearch);
  document.querySelector("#saveProject")?.addEventListener("click",saveProject);
  document.querySelector("#makeBmc")?.addEventListener("click",()=>{state.page="bmc";render()});
  document.querySelector("#saveBmc")?.addEventListener("click",()=>alert("BMC enregistré pour cette session. La sauvegarde cloud sera activée avec Supabase."));
  document.querySelector("#generatePitch")?.addEventListener("click",()=>{
    const f=readForm();document.querySelector("#pitchOut").innerHTML=`<br><div class="pitch"><b>Pitch :</b><br>Nous répondons au problème de <b>${esc(f.p_problem||"notre marché")}</b> grâce à <b>${esc(f.p_solution||"une solution adaptée")}</b>. Nous ciblons <b>${esc(f.p_client||"des clients identifiés")}</b>, avec un modèle économique basé sur <b>${esc(f.p_model||"une offre viable")}</b>. Notre impact recherché est <b>${esc(f.p_impact||"la création de valeur et d'emplois")}</b>. Nous recherchons <b>${esc(f.p_funding||"les ressources nécessaires au lancement")}</b>.</div>`;
  });
  document.querySelector("#localLogin")?.addEventListener("click",()=>{const f=readForm();state.user={name:f.loginName||"Utilisateur",email:f.loginEmail||""};localStorage.setItem("pl_user",JSON.stringify(state.user));render()});
  document.querySelectorAll("[data-delete]").forEach(b=>b.onclick=()=>{state.projects.splice(Number(b.dataset.delete),1);save();render()});
}
function saveProject(){
  const f=readForm();
  state.projects.push({name:f.solution||"Nouveau projet",problem:f.problem||"",createdAt:new Date().toISOString(),data:f});
  save();alert("Projet enregistré dans cette V1.");state.page="projects";render();
}
app();
