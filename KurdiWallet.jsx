import { useState, useEffect, useCallback } from "react";

// ─── i18n ──────────────────────────────────────────────────────────────────────
const T = {
  ku: {
    appName: "Kurdî ID Wallet",
    tagline: "Nasnameya Kurdî ya Dîjîtal",
    welcome: "Xêr hatî",
    pin_title: "PIN-a xwe binivîse",
    pin_new: "PIN-eke nû çêke (4 hejmar)",
    pin_confirm: "PIN-ê dubare bike",
    pin_mismatch: "PIN ne li hev hat — Ji nû ve biceribîne",
    pin_wrong: "PIN xelet e",
    pin_hint: "Ji bo vekirinê 4 hejmar binivîse",
    create_id: "Nasnameyê Çêke",
    my_wallet: "Wallet-a Min",
    register: "Qeydkirin",
    register_subtitle: "Nasnameya xwe ya dîjîtal a Kurdî çêke",
    name_label: "Nav / First Name",
    name_ph: "Navê xwe binivîse...",
    surname_label: "Paşnav / Surname",
    surname_ph: "Paşnavê xwe binivîse...",
    name_kurdish_note: "Nav û paşnav divê bi Kurdî bin / Name must be in Kurdish",
    dialect_label: "Zarava / Dialect",
    region_label: "Dever / Region",
    affinity_label: "Herem / Region Affinity",
    lang_label: "Ziman / Languages",
    twitter_label: "X / Twitter Handle",
    twitter_ph: "@navê.xwe",
    twitter_verify: "Piştrastkirin / Verify",
    twitter_verified: "✓ Piştrastkirî / Verified",
    twitter_checking: "Tê kontrol kirin...",
    twitter_required: "X/Twitter account required for Kurdî ID",
    twitter_invalid: "Handle ne derbasdar e — @ bê bihêle",
    submit: "Nasnameya min çêke — Create My ID",
    unlock: "Veke / Unlock",
    lock: "Kilît bike / Lock",
    share: "Parve bike / Share",
    copied: "✓ Kopî bû",
    slot_left: "slot mane",
    founding: "Endamê Damezrêner",
    founding_en: "Founding Member",
    did_label: "Decentralized Identifier",
    issued: "Dîroka Derxistinê",
    fields_required: "Hemî xan pêwist in",
    already_registered: "Ev X handle jixwe qeydkirî ye",
    wallet_empty: "Wallet vala ye — Nasnameyê çêke",
    reset: "Wallet-ê Sifir Bike",
    reset_confirm: "Dê hemî dane werin jêbirin. Berdewam bike?",
    genesis: "Serlêdana Genesis",
    genesis_sub: "Yekem 1000 Endamên Kurdî ID",
  },
  en: {
    appName: "Kurdî ID Wallet",
    tagline: "Kurdish Digital Identity",
    welcome: "Welcome",
    pin_title: "Enter your PIN",
    pin_new: "Create a new PIN (4 digits)",
    pin_confirm: "Confirm your PIN",
    pin_mismatch: "PINs don't match — Try again",
    pin_wrong: "Wrong PIN",
    pin_hint: "Enter 4 digits to unlock",
    create_id: "Create Identity",
    my_wallet: "My Wallet",
    register: "Register",
    register_subtitle: "Create your Kurdish digital identity",
    name_label: "First Name / Nav",
    name_ph: "Enter your first name...",
    surname_label: "Surname / Paşnav",
    surname_ph: "Enter your surname...",
    name_kurdish_note: "Name and surname must be in Kurdish / Nav û paşnav divê bi Kurdî bin",
    dialect_label: "Dialect / Zarava",
    region_label: "Region / Dever",
    affinity_label: "Herem / Regional Affinity",
    lang_label: "Languages / Ziman",
    twitter_label: "X / Twitter Handle",
    twitter_ph: "@yourhandle",
    twitter_verify: "Verify",
    twitter_verified: "✓ Verified",
    twitter_checking: "Checking...",
    twitter_required: "X/Twitter account required for Kurdî ID",
    twitter_invalid: "Invalid handle — omit the @",
    submit: "Create My ID — Nasnameya min çêke",
    unlock: "Unlock",
    lock: "Lock",
    share: "Share",
    copied: "✓ Copied",
    slot_left: "slots remaining",
    founding: "Founding Member",
    founding_en: "Endamê Damezrêner",
    did_label: "Decentralized Identifier",
    issued: "Issue Date",
    fields_required: "All fields are required",
    already_registered: "This X handle is already registered",
    wallet_empty: "Wallet is empty — Create an identity",
    reset: "Reset Wallet",
    reset_confirm: "All data will be deleted. Continue?",
    genesis: "Genesis Application",
    genesis_sub: "First 1000 Kurdî ID Members",
  },
};

const DIALECTS = ["Kurmancî","Soranî","Zazakî","Badînî"];
const REGIONS = [
  "Almanya / Berlin","Almanya / Köln","Almanya / Hamburg",
  "İsveç / Stockholm","Hollanda / Amsterdam","Fransa / Paris",
  "İngiltere / Londra","Belçika / Brüksel","Avusturya / Viyana",
  "ABD / Nashville","ABD / New York","ABD / Washington",
  "Kanada / Toronto","Avustralya / Melbourne",
  "Kuzey Irak / Hewlêr","Kuzey Irak / Silêmanî","Kuzey Irak / Duhok",
  "Suriye / Qamişlo","Suriye / Efrîn",
  "Türkiye / Amed","Türkiye / İstanbul","Türkiye / Mêrdîn",
  "İran / Urmiye","İran / Kirmanşah",
];
const AFFINITIES = ["Botan","Baban","Dersim","Cizîr","Serhed","Amed","Şemzînan","Mukrî","Bahdinan","Şarezor","Urmiye","Xoşnaw","Hewraman","Behdînan"];

// Dil grupları: Kurdî altında Kurmancî, Soranî, Zazakî
const LANG_GROUPS = [
  {
    group: "Kurdî",
    langs: ["Kurmancî","Soranî","Zazakî"],
  },
  {
    group: "Zimanên Din / Other Languages",
    langs: ["Inglizî","Almanî","Tirkî","Erebî","Farisî","İswêcî","Fransızî","Hollandî","Italî","Spanyolî"],
  },
];
const LANGS = ["Kurmancî","Soranî","Zazakî","Inglizî","Almanî","Tirkî","Erebî","Farisî","İswêcî","Fransızî","Hollandî","Italî","Spanyolî"];
const DIALECT_COLORS = { "Kurmancî":"#2D7D6F","Soranî":"#8B3A8B","Zazakî":"#C0392B","Badînî":"#1A5276" };

// ─── Helpers ───────────────────────────────────────────────────────────────────
function hashPIN(pin) {
  let h = 0;
  for (let i = 0; i < pin.length; i++) h = (Math.imul(31, h) + pin.charCodeAt(i)) | 0;
  return h.toString(36);
}

function generateDID(handle) {
  const base = handle.toLowerCase().replace(/[^a-z0-9]/g,"");
  const rand = Math.random().toString(36).slice(2,10);
  return `did:kurdi:${base}${rand}`;
}

function todayStr() {
  return new Date().toISOString().slice(0,10);
}

// Storage keys
const SK = { pin:"kurdi_pin", identities:"kurdi_ids", locked:"kurdi_locked", counter:"kurdi_counter" };

function loadStore(key, fallback) {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
}
function saveStore(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
}

// ─── Kurdish Sun SVG ───────────────────────────────────────────────────────────
function KurdSun({ size=40, color="#C8A84B", spin=false }) {
  const rays=21, cx=size/2, cy=size/2, r1=size*.28, r2=size*.38, r3=size*.16;
  const pts = Array.from({length:rays},(_,i)=>{
    const a1=(i*360/rays-90)*Math.PI/180;
    const a2=((i+.5)*360/rays-90)*Math.PI/180;
    return {x1:cx+r1*Math.cos(a1),y1:cy+r1*Math.sin(a1),x2:cx+r2*Math.cos(a2),y2:cy+r2*Math.sin(a2)};
  });
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}
      style={spin?{animation:"spin 20s linear infinite"}:{}}>
      {spin && <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} svg{transform-origin:center}`}</style>}
      {pts.map((p,i)=>(
        <polygon key={i} points={`${cx},${cy} ${p.x1},${p.y1} ${p.x2},${p.y2}`} fill={color}/>
      ))}
      <circle cx={cx} cy={cy} r={r3} fill={color}/>
    </svg>
  );
}

// ─── Geo Pattern ───────────────────────────────────────────────────────────────
function GeoPat() {
  return (
    <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0}} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="gp" x="0" y="0" width="56" height="56" patternUnits="userSpaceOnUse">
          <polygon points="28,2 54,14 54,42 28,54 2,42 2,14" fill="none" stroke="#C8A84B" strokeWidth="0.4" opacity="0.07"/>
          <polygon points="28,10 46,19 46,37 28,46 10,37 10,19" fill="none" stroke="#C8A84B" strokeWidth="0.25" opacity="0.05"/>
          <circle cx="28" cy="28" r="2" fill="#C8A84B" opacity="0.04"/>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#gp)"/>
    </svg>
  );
}

// ─── PIN Pad ───────────────────────────────────────────────────────────────────
function PINPad({ value, onChange, onSubmit, error, label, hint }) {
  const digits = ["1","2","3","4","5","6","7","8","9","","0","⌫"];
  return (
    <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:"20px"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:"13px",color:"#C8A84B",letterSpacing:"3px",textTransform:"uppercase",marginBottom:"8px"}}>{label}</div>
        {hint && <div style={{fontSize:"11px",color:"#5a4a3a"}}>{hint}</div>}
      </div>
      {/* Dots */}
      <div style={{display:"flex",gap:"16px"}}>
        {[0,1,2,3].map(i=>(
          <div key={i} style={{
            width:14,height:14,borderRadius:"50%",
            background: i < value.length ? "#C8A84B" : "transparent",
            border:`2px solid ${i < value.length ? "#C8A84B" : "rgba(200,168,75,0.3)"}`,
            transition:"all 0.15s",
          }}/>
        ))}
      </div>
      {error && <div style={{fontSize:"12px",color:"#C0392B",textAlign:"center"}}>{error}</div>}
      {/* Keypad */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,72px)",gap:"10px"}}>
        {digits.map((d,i)=>(
          <button key={i} onClick={()=>{
            if(d==="") return;
            if(d==="⌫"){onChange(value.slice(0,-1));return;}
            if(value.length>=4) return;
            const next=value+d;
            onChange(next);
            if(next.length===4) setTimeout(()=>onSubmit(next),120);
          }} style={{
            width:72,height:72,
            background: d==="" ? "transparent" : "rgba(200,168,75,0.06)",
            border: d==="" ? "none" : "1px solid rgba(200,168,75,0.15)",
            borderRadius:"12px",
            color: d==="⌫" ? "#C8A84B" : "#e8dcc8",
            fontSize: d==="⌫" ? "20px" : "22px",
            fontFamily:"Georgia,serif",
            cursor: d==="" ? "default" : "pointer",
            transition:"all 0.15s",
          }}
          onMouseEnter={e=>{if(d!=="")e.currentTarget.style.background="rgba(200,168,75,0.12)"}}
          onMouseLeave={e=>{if(d!=="")e.currentTarget.style.background="rgba(200,168,75,0.06)"}}
          >{d}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Identity Card (Full) ──────────────────────────────────────────────────────
function IDCard({ identity, lang }) {
  const t = T[lang];
  const dc = DIALECT_COLORS[identity.dialect] || "#2D7D6F";
  const [copied, setCopied] = useState(false);

  function copyDID() {
    navigator.clipboard?.writeText(identity.did).catch(()=>{});
    setCopied(true);
    setTimeout(()=>setCopied(false),2000);
  }

  return (
    <div style={{
      background:"linear-gradient(145deg,#0d0b05,#1c1608,#0d0b05)",
      border:"1px solid rgba(200,168,75,0.35)",
      borderRadius:"20px",overflow:"hidden",
      boxShadow:"0 24px 64px rgba(0,0,0,0.7),inset 0 1px 0 rgba(200,168,75,0.1)",
      position:"relative",maxWidth:400,width:"100%",margin:"0 auto",
    }}>
      <div style={{height:"3px",background:`linear-gradient(90deg,${dc},#C8A84B,${dc})`}}/>

      {/* Geo bg */}
      <div style={{position:"absolute",right:-20,bottom:-20,opacity:0.04,pointerEvents:"none"}}>
        <KurdSun size={180} color="#C8A84B"/>
      </div>

      {/* Header */}
      <div style={{padding:"18px 22px 14px",borderBottom:"1px solid rgba(200,168,75,0.08)",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <KurdSun size={26} color="#C8A84B"/>
          <div>
            <div style={{fontSize:"10px",letterSpacing:"4px",color:"#C8A84B",textTransform:"uppercase"}}>Kurdî ID</div>
            <div style={{fontSize:"8px",color:"#3a2a1a",letterSpacing:"1px"}}>Nasnameya Kurdî Dîjîtal</div>
          </div>
        </div>
        <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"4px"}}>
          <span style={{background:dc+"22",border:`1px solid ${dc}44`,borderRadius:"20px",padding:"2px 10px",fontSize:"10px",color:dc,fontWeight:"600"}}>{identity.dialect}</span>
          <span style={{background:"rgba(200,168,75,0.08)",border:"1px solid rgba(200,168,75,0.15)",borderRadius:"20px",padding:"2px 10px",fontSize:"9px",color:"#C8A84B"}}>#{identity.serial}</span>
        </div>
      </div>

      {/* Body */}
      <div style={{padding:"22px 22px 16px",position:"relative",zIndex:1}}>
        {/* Avatar + name */}
        <div style={{display:"flex",alignItems:"center",gap:"16px",marginBottom:"22px"}}>
          <div style={{
            width:54,height:54,borderRadius:"50%",
            background:`radial-gradient(circle,${dc}33,${dc}11)`,
            border:`2px solid ${dc}55`,
            display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:"21px",fontWeight:"700",color:dc,fontFamily:"Georgia,serif",
            flexShrink:0,
          }}>{identity.name.charAt(0)}</div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:"20px",fontWeight:"700",color:"#f0e6cc",fontFamily:"Georgia,serif",letterSpacing:"-0.2px"}}>{identity.name}</div>
            <a href={`https://x.com/${identity.twitter}`} target="_blank" rel="noopener noreferrer"
              style={{fontSize:"12px",color:"#4a8ab5",textDecoration:"none",display:"flex",alignItems:"center",gap:"4px",marginTop:"2px"}}>
              <span style={{fontSize:"10px"}}>𝕏</span> @{identity.twitter}
            </a>
          </div>
        </div>

        {/* Fields grid */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"14px",marginBottom:"18px"}}>
          {[
            {label:lang==="ku"?"Dever":"Region", value:identity.region},
            {label:lang==="ku"?"Herem":"Affinity", value:identity.affinity},
          ].map((f,i)=>(
            <div key={i}>
              <div style={{fontSize:"8px",letterSpacing:"2px",color:"#3a2a1a",textTransform:"uppercase",marginBottom:"4px"}}>{f.label}</div>
              <div style={{fontSize:"12px",color:"#c8b898"}}>{f.value}</div>
            </div>
          ))}
        </div>

        {/* Languages */}
        <div style={{marginBottom:"18px"}}>
          <div style={{fontSize:"8px",letterSpacing:"2px",color:"#3a2a1a",textTransform:"uppercase",marginBottom:"7px"}}>{lang==="ku"?"Ziman":"Languages"}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:"5px"}}>
            {identity.languages.map((l,i)=>(
              <span key={i} style={{background:"rgba(200,168,75,0.07)",border:"1px solid rgba(200,168,75,0.15)",borderRadius:"4px",padding:"2px 9px",fontSize:"10px",color:"#a89878"}}>{l}</span>
            ))}
          </div>
        </div>

        {/* Founding badge */}
        <div style={{
          background:"linear-gradient(90deg,rgba(200,168,75,0.08),rgba(200,168,75,0.04))",
          border:"1px solid rgba(200,168,75,0.2)",
          borderRadius:"8px",padding:"8px 14px",marginBottom:"16px",
          display:"flex",alignItems:"center",gap:"10px",
        }}>
          <span style={{fontSize:"16px"}}>⭐</span>
          <div>
            <div style={{fontSize:"11px",fontWeight:"600",color:"#C8A84B"}}>{t.founding}</div>
            <div style={{fontSize:"9px",color:"#5a4a3a"}}>{t.founding_en} · Genesis 1000</div>
          </div>
        </div>

        {/* DID */}
        <div onClick={copyDID} style={{
          background:"rgba(0,0,0,0.4)",border:"1px solid rgba(200,168,75,0.12)",
          borderRadius:"8px",padding:"11px 14px",cursor:"pointer",
          transition:"border-color 0.2s",
        }}
        onMouseEnter={e=>e.currentTarget.style.borderColor="rgba(200,168,75,0.3)"}
        onMouseLeave={e=>e.currentTarget.style.borderColor="rgba(200,168,75,0.12)"}
        >
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"4px"}}>
            <div style={{fontSize:"8px",letterSpacing:"2px",color:"#3a2a1a",textTransform:"uppercase"}}>{t.did_label}</div>
            <div style={{fontSize:"9px",color: copied?"#2D7D6F":"#3a2a1a"}}>{copied ? t.copied : "tap to copy"}</div>
          </div>
          <div style={{fontFamily:"monospace",fontSize:"11px",color:"#C8A84B",wordBreak:"break-all"}}>{identity.did}</div>
        </div>
      </div>

      {/* Footer */}
      <div style={{padding:"10px 22px",borderTop:"1px solid rgba(200,168,75,0.06)",display:"flex",justifyContent:"space-between"}}>
        <div style={{fontSize:"9px",color:"#2a1a0a"}}>W3C DID · Verifiable Credential</div>
        <div style={{fontSize:"9px",color:"#2a1a0a"}}>{identity.issued}</div>
      </div>
    </div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function KurdiWallet() {
  const [lang, setLang] = useState("ku");
  const t = T[lang];

  // Auth state: "setup_pin" | "confirm_pin" | "locked" | "unlocked"
  const [authState, setAuthState] = useState("loading");
  const [pinInput, setPinInput] = useState("");
  const [pinTemp, setPinTemp] = useState("");
  const [pinError, setPinError] = useState("");
  const [storedHash, setStoredHash] = useState(null);

  // App state
  const [screen, setScreen] = useState("wallet"); // wallet | register | card
  const [identities, setIdentities] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [counter, setCounter] = useState(0); // no seed data

  // Form
  const [form, setForm] = useState({ name:"", surname:"", dialect:"Kurmancî", region:"", affinity:"", languages:["Kurmancî"], twitter:"" });
  const [twitterState, setTwitterState] = useState("idle"); // idle | checking | verified | invalid
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Boot
  useEffect(()=>{
    const hash = loadStore(SK.pin, null);
    const ids = loadStore(SK.identities, []);
    const cnt = loadStore(SK.counter, 0);
    setStoredHash(hash);
    setIdentities(ids);
    setCounter(cnt);
    if(!hash) setAuthState("setup_pin");
    else setAuthState("locked");
  },[]);

  // ── PIN flows ──
  function handleSetupPIN(pin) {
    setPinTemp(pin);
    setPinInput("");
    setPinError("");
    setAuthState("confirm_pin");
  }

  function handleConfirmPIN(pin) {
    if(hashPIN(pin) !== hashPIN(pinTemp)) {
      setPinError(t.pin_mismatch);
      setPinInput("");
      setAuthState("setup_pin");
      setPinTemp("");
      return;
    }
    const hash = hashPIN(pin);
    saveStore(SK.pin, hash);
    setStoredHash(hash);
    setPinInput("");
    setPinError("");
    setAuthState("unlocked");
  }

  function handleUnlock(pin) {
    if(hashPIN(pin) !== storedHash) {
      setPinError(t.pin_wrong);
      setPinInput("");
      return;
    }
    setPinError("");
    setPinInput("");
    setAuthState("unlocked");
  }

  function handleLock() {
    setAuthState("locked");
    setPinInput("");
    setScreen("wallet");
  }

  function handleReset() {
    if(!window.confirm(t.reset_confirm)) return;
    localStorage.removeItem(SK.pin);
    localStorage.removeItem(SK.identities);
    localStorage.removeItem(SK.counter);
    setStoredHash(null);
    setIdentities([]);
    setCounter(0);
    setAuthState("setup_pin");
    setPinInput("");
    setPinTemp("");
    setPinError("");
    setScreen("wallet");
  }

  // ── Twitter verify (mock — checks format only, simulates network check) ──
  function verifyTwitter() {
    const handle = form.twitter.replace(/^@/,"").trim();
    if(!handle || handle.length < 2 || !/^[A-Za-z0-9_]{1,15}$/.test(handle)) {
      setTwitterState("invalid");
      return;
    }
    setTwitterState("checking");
    // Simulate async verification
    setTimeout(()=>{
      const alreadyUsed = identities.some(id => id.twitter.toLowerCase() === handle.toLowerCase());
      if(alreadyUsed) { setTwitterState("invalid"); setFormError(t.already_registered); }
      else { setTwitterState("verified"); setFormError(""); }
    }, 1200);
  }

  // ── Register ──
  function handleRegister() {
    setFormError("");
    if(!form.name.trim() || !form.surname.trim() || !form.region || !form.affinity) { setFormError(t.fields_required); return; }
    if(twitterState !== "verified") { setFormError(t.twitter_required); return; }

    setSubmitting(true);
    const handle = form.twitter.replace(/^@/,"").trim();
    const newCounter = counter + 1;
    const fullName = form.name.trim() + " " + form.surname.trim();
    const newId = {
      id: "KRD-" + String(newCounter).padStart(4,"0"),
      serial: newCounter,
      name: fullName,
      dialect: form.dialect,
      region: form.region,
      affinity: form.affinity,
      languages: form.languages.length ? form.languages : ["Kurmancî"],
      twitter: handle,
      did: generateDID(handle),
      issued: todayStr(),
    };

    setTimeout(()=>{
      const updated = [...identities, newId];
      setIdentities(updated);
      setCounter(newCounter);
      saveStore(SK.identities, updated);
      saveStore(SK.counter, newCounter);
      setSelectedId(newId);
      setForm({ name:"", surname:"", dialect:"Kurmancî", region:"", affinity:"", languages:["Kurmancî"], twitter:"" });
      setTwitterState("idle");
      setSubmitting(false);
      setScreen("card");
    }, 800);
  }

  function toggleLang(l) {
    setForm(f=>({...f, languages: f.languages.includes(l) ? f.languages.filter(x=>x!==l) : [...f.languages,l]}));
  }

  const slotsLeft = 1000 - counter;
  const pct = ((counter/1000)*100).toFixed(1);

  // ── Render: Loading ──
  if(authState === "loading") return (
    <div style={{minHeight:"100vh",background:"#080706",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <KurdSun size={48} color="#C8A84B" spin/>
    </div>
  );

  // ── Render: PIN screens ──
  if(authState !== "unlocked") {
    return (
      <div style={{
        minHeight:"100vh",
        background:"linear-gradient(160deg,#080706,#120f08,#080706)",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
        padding:"24px",position:"relative",overflow:"hidden",
        fontFamily:"Georgia,'Times New Roman',serif",color:"#e8dcc8",
      }}>
        <GeoPat/>
        <div style={{position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:"32px",width:"100%",maxWidth:320}}>
          {/* Logo */}
          <div style={{textAlign:"center"}}>
            <KurdSun size={56} color="#C8A84B" spin/>
            <div style={{fontSize:"22px",fontWeight:"700",color:"#f0e6cc",marginTop:"12px",letterSpacing:"0.5px"}}>Kurdî ID</div>
            <div style={{fontSize:"10px",letterSpacing:"3px",color:"#5a4a3a",textTransform:"uppercase",marginTop:"4px"}}>{t.tagline}</div>
          </div>

          {/* Lang toggle */}
          <div style={{display:"flex",gap:"8px"}}>
            {["ku","en"].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{
                background: lang===l?"rgba(200,168,75,0.15)":"transparent",
                border:`1px solid ${lang===l?"rgba(200,168,75,0.4)":"rgba(200,168,75,0.15)"}`,
                borderRadius:"6px",padding:"4px 14px",
                color: lang===l?"#C8A84B":"#3a2a1a",fontSize:"12px",cursor:"pointer",
                fontFamily:"Georgia,serif",
              }}>{l==="ku"?"Kurdî":"English"}</button>
            ))}
          </div>

          <PINPad
            value={pinInput}
            onChange={setPinInput}
            onSubmit={authState==="setup_pin" ? handleSetupPIN : authState==="confirm_pin" ? handleConfirmPIN : handleUnlock}
            error={pinError}
            label={authState==="setup_pin" ? t.pin_new : authState==="confirm_pin" ? t.pin_confirm : t.pin_title}
            hint={authState==="locked" ? t.pin_hint : ""}
          />

          {authState==="locked" && storedHash && (
            <button onClick={handleReset} style={{
              background:"transparent",border:"none",
              color:"#2a1a0a",fontSize:"11px",cursor:"pointer",
              textDecoration:"underline",fontFamily:"Georgia,serif",
            }}>{t.reset}</button>
          )}
        </div>
      </div>
    );
  }

  // ── Render: Unlocked App ──
  return (
    <div style={{
      minHeight:"100vh",
      background:"linear-gradient(160deg,#080706,#120f08,#080706)",
      fontFamily:"Georgia,'Times New Roman',serif",color:"#e8dcc8",
      position:"relative",overflow:"hidden",
    }}>
      <GeoPat/>

      {/* Header */}
      <header style={{
        position:"sticky",top:0,zIndex:100,
        background:"rgba(8,7,6,0.92)",backdropFilter:"blur(12px)",
        borderBottom:"1px solid rgba(200,168,75,0.12)",
        padding:"0 16px",height:"58px",
        display:"flex",alignItems:"center",justifyContent:"space-between",
      }}>
        <div style={{display:"flex",alignItems:"center",gap:"10px"}}>
          <KurdSun size={28} color="#C8A84B"/>
          <div>
            <div style={{fontSize:"15px",fontWeight:"700",color:"#f0e6cc"}}>Kurdî ID</div>
            <div style={{fontSize:"8px",color:"#3a2a1a",letterSpacing:"2px",textTransform:"uppercase"}}>{t.tagline}</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
          <div style={{display:"flex",gap:"4px"}}>
            {["ku","en"].map(l=>(
              <button key={l} onClick={()=>setLang(l)} style={{
                background:lang===l?"rgba(200,168,75,0.12)":"transparent",
                border:`1px solid ${lang===l?"rgba(200,168,75,0.3)":"transparent"}`,
                borderRadius:"4px",padding:"3px 8px",
                color:lang===l?"#C8A84B":"#3a2a1a",fontSize:"10px",cursor:"pointer",
                fontFamily:"Georgia,serif",
              }}>{l==="ku"?"KU":"EN"}</button>
            ))}
          </div>
          <button onClick={handleLock} style={{
            background:"rgba(200,168,75,0.06)",
            border:"1px solid rgba(200,168,75,0.15)",
            borderRadius:"6px",padding:"5px 10px",
            color:"#5a4a3a",fontSize:"11px",cursor:"pointer",
            fontFamily:"Georgia,serif",
          }}>🔒 {t.lock}</button>
        </div>
      </header>

      {/* Progress strip */}
      <div style={{
        background:"rgba(0,0,0,0.3)",
        borderBottom:"1px solid rgba(200,168,75,0.06)",
        padding:"10px 16px",
        display:"flex",alignItems:"center",gap:"14px",
      }}>
        <div style={{flex:1}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:"5px"}}>
            <span style={{fontSize:"9px",color:"#3a2a1a",letterSpacing:"2px",textTransform:"uppercase"}}>{t.genesis} · {t.genesis_sub}</span>
            <span style={{fontSize:"10px",color:"#C8A84B",fontWeight:"600"}}>{counter} / 1000</span>
          </div>
          <div style={{background:"rgba(200,168,75,0.08)",borderRadius:"4px",height:"5px",overflow:"hidden"}}>
            <div style={{
              height:"100%",borderRadius:"4px",
              background:"linear-gradient(90deg,#2D7D6F,#C8A84B)",
              width:`${pct}%`,transition:"width 0.6s ease",
            }}/>
          </div>
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontSize:"16px",fontWeight:"700",color: slotsLeft<100?"#C0392B":"#C8A84B"}}>{slotsLeft}</div>
          <div style={{fontSize:"8px",color:"#3a2a1a",textTransform:"uppercase",letterSpacing:"1px"}}>{t.slot_left}</div>
        </div>
      </div>

      {/* Nav tabs */}
      <div style={{
        display:"flex",
        borderBottom:"1px solid rgba(200,168,75,0.08)",
        background:"rgba(0,0,0,0.2)",
      }}>
        {[
          {key:"wallet",label:t.my_wallet},
          {key:"register",label:t.register},
        ].map(tab=>(
          <button key={tab.key} onClick={()=>setScreen(tab.key)} style={{
            flex:1,padding:"12px",
            background:screen===tab.key?"rgba(200,168,75,0.08)":"transparent",
            border:"none",
            borderBottom:`2px solid ${screen===tab.key?"#C8A84B":"transparent"}`,
            color:screen===tab.key?"#C8A84B":"#3a2a1a",
            fontSize:"12px",cursor:"pointer",
            fontFamily:"Georgia,serif",letterSpacing:"0.5px",
            transition:"all 0.2s",
          }}>{tab.label}</button>
        ))}
      </div>

      <main style={{padding:"20px 16px",maxWidth:480,margin:"0 auto",position:"relative",zIndex:1}}>

        {/* ── WALLET ── */}
        {screen==="wallet" && (
          <div>
            {identities.length === 0 ? (
              <div style={{textAlign:"center",padding:"60px 24px",color:"#2a1a0a"}}>
                <KurdSun size={56} color="#1a1208"/>
                <div style={{marginTop:"16px",fontSize:"14px",color:"#3a2a1a"}}>{t.wallet_empty}</div>
                <button onClick={()=>setScreen("register")} style={{
                  marginTop:"20px",
                  background:"rgba(200,168,75,0.1)",
                  border:"1px solid rgba(200,168,75,0.25)",
                  borderRadius:"8px",padding:"10px 24px",
                  color:"#C8A84B",fontSize:"13px",cursor:"pointer",
                  fontFamily:"Georgia,serif",
                }}>{t.create_id}</button>
              </div>
            ) : (
              <div style={{display:"grid",gap:"10px"}}>
                {identities.map(id=>(
                  <div key={id.id} onClick={()=>{setSelectedId(id);setScreen("card");}} style={{
                    background:"rgba(200,168,75,0.04)",
                    border:"1px solid rgba(200,168,75,0.15)",
                    borderLeft:`3px solid ${DIALECT_COLORS[id.dialect]||"#2D7D6F"}`,
                    borderRadius:"10px",padding:"14px 16px",cursor:"pointer",
                    display:"flex",alignItems:"center",gap:"14px",
                    transition:"all 0.2s",
                  }}
                  onMouseEnter={e=>e.currentTarget.style.background="rgba(200,168,75,0.08)"}
                  onMouseLeave={e=>e.currentTarget.style.background="rgba(200,168,75,0.04)"}
                  >
                    <div style={{
                      width:40,height:40,borderRadius:"50%",
                      background:(DIALECT_COLORS[id.dialect]||"#2D7D6F")+"22",
                      border:`1px solid ${(DIALECT_COLORS[id.dialect]||"#2D7D6F")}44`,
                      display:"flex",alignItems:"center",justifyContent:"center",
                      fontSize:"16px",fontWeight:"700",color:DIALECT_COLORS[id.dialect]||"#2D7D6F",
                      flexShrink:0,
                    }}>{id.name.charAt(0)}</div>
                    <div style={{flex:1,minWidth:0}}>
                      <div style={{fontSize:"15px",fontWeight:"600",color:"#f0e6cc"}}>{id.name}</div>
                      <div style={{fontSize:"11px",color:"#5a4a3a",marginTop:"2px"}}>@{id.twitter} · {id.id}</div>
                    </div>
                    <div style={{fontSize:"10px",color:"#3a2a1a",textAlign:"right",flexShrink:0}}>
                      <div style={{color:"#C8A84B",fontSize:"9px"}}>⭐ #{id.serial}</div>
                      <div style={{marginTop:"2px"}}>{id.dialect}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── REGISTER ── */}
        {screen==="register" && (
          <div>
            <div style={{marginBottom:"22px"}}>
              <div style={{fontSize:"10px",letterSpacing:"4px",color:"#C8A84B",textTransform:"uppercase",marginBottom:"6px"}}>{t.register}</div>
              <div style={{fontSize:"20px",fontWeight:"700",color:"#f0e6cc",marginBottom:"4px"}}>{t.register_subtitle}</div>
              {slotsLeft <= 50 && (
                <div style={{fontSize:"12px",color:"#C0392B",marginTop:"6px"}}>⚠ Tenê {slotsLeft} cih mane / Only {slotsLeft} slots left!</div>
              )}
            </div>

            <div style={{display:"grid",gap:"16px"}}>

              {/* Nav + Paşnav */}
              <div style={{
                background:"rgba(200,168,75,0.04)",
                border:"1px solid rgba(200,168,75,0.15)",
                borderRadius:"10px",
                padding:"14px",
              }}>
                <div style={{
                  fontSize:"9px",color:"#C8A84B",letterSpacing:"2px",
                  textTransform:"uppercase",marginBottom:"12px",
                  display:"flex",alignItems:"center",gap:"6px",
                }}>
                  <span>◈</span> {t.name_kurdish_note}
                </div>
                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"10px"}}>
                  <div>
                    <label style={{fontSize:"9px",letterSpacing:"2px",color:"#5a4a3a",textTransform:"uppercase",display:"block",marginBottom:"7px"}}>{t.name_label} *</label>
                    <input value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder={t.name_ph}
                      style={{width:"100%",boxSizing:"border-box",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(200,168,75,0.2)",borderRadius:"8px",padding:"10px 12px",color:"#e8dcc8",fontSize:"13px",outline:"none",fontFamily:"Georgia,serif"}}/>
                  </div>
                  <div>
                    <label style={{fontSize:"9px",letterSpacing:"2px",color:"#5a4a3a",textTransform:"uppercase",display:"block",marginBottom:"7px"}}>{t.surname_label} *</label>
                    <input value={form.surname} onChange={e=>setForm(f=>({...f,surname:e.target.value}))} placeholder={t.surname_ph}
                      style={{width:"100%",boxSizing:"border-box",background:"rgba(0,0,0,0.3)",border:"1px solid rgba(200,168,75,0.2)",borderRadius:"8px",padding:"10px 12px",color:"#e8dcc8",fontSize:"13px",outline:"none",fontFamily:"Georgia,serif"}}/>
                  </div>
                </div>
              </div>

              {/* X/Twitter */}
              <div>
                <label style={{fontSize:"9px",letterSpacing:"2px",color:"#5a4a3a",textTransform:"uppercase",display:"block",marginBottom:"7px"}}>
                  {t.twitter_label} * <span style={{color:"#3a2a1a",fontSize:"8px",fontWeight:"normal",letterSpacing:"0"}}>(pêwistî / required)</span>
                </label>
                <div style={{display:"flex",gap:"8px"}}>
                  <input
                    value={form.twitter}
                    onChange={e=>{setForm(f=>({...f,twitter:e.target.value}));setTwitterState("idle");setFormError("");}}
                    placeholder={t.twitter_ph}
                    style={{flex:1,background:"rgba(200,168,75,0.05)",border:`1px solid ${twitterState==="verified"?"#2D7D6F44":twitterState==="invalid"?"#C0392B44":"rgba(200,168,75,0.2)"}`,borderRadius:"8px",padding:"11px 14px",color:"#e8dcc8",fontSize:"14px",outline:"none",fontFamily:"monospace"}}
                  />
                  <button onClick={verifyTwitter} disabled={twitterState==="checking"||twitterState==="verified"} style={{
                    background: twitterState==="verified"?"rgba(45,125,111,0.15)":"rgba(200,168,75,0.1)",
                    border:`1px solid ${twitterState==="verified"?"#2D7D6F44":"rgba(200,168,75,0.25)"}`,
                    borderRadius:"8px",padding:"0 14px",
                    color:twitterState==="verified"?"#2D7D6F":twitterState==="checking"?"#5a4a3a":"#C8A84B",
                    fontSize:"11px",cursor:twitterState==="verified"?"default":"pointer",
                    fontFamily:"Georgia,serif",whiteSpace:"nowrap",flexShrink:0,
                  }}>
                    {twitterState==="verified" ? t.twitter_verified : twitterState==="checking" ? t.twitter_checking : t.twitter_verify}
                  </button>
                </div>
                {twitterState==="invalid" && <div style={{fontSize:"11px",color:"#C0392B",marginTop:"5px"}}>{t.twitter_invalid}</div>}
                {twitterState==="verified" && (
                  <div style={{fontSize:"11px",color:"#2D7D6F",marginTop:"5px"}}>
                    ✓ x.com/{form.twitter.replace(/^@/,"")} — {lang==="ku"?"Girêdayî":"Linked"}
                  </div>
                )}
              </div>

              {/* Dialect */}
              <div>
                <label style={{fontSize:"9px",letterSpacing:"2px",color:"#5a4a3a",textTransform:"uppercase",display:"block",marginBottom:"7px"}}>{t.dialect_label} *</label>
                <div style={{display:"flex",gap:"7px",flexWrap:"wrap"}}>
                  {DIALECTS.map(d=>{
                    const dc=DIALECT_COLORS[d];
                    return (
                      <button key={d} onClick={()=>setForm(f=>({...f,dialect:d}))} style={{
                        background:form.dialect===d?dc+"22":"rgba(200,168,75,0.04)",
                        border:`1px solid ${form.dialect===d?dc+"66":"rgba(200,168,75,0.12)"}`,
                        borderRadius:"6px",padding:"7px 14px",
                        color:form.dialect===d?dc:"#4a3a2a",fontSize:"12px",cursor:"pointer",
                        transition:"all 0.15s",fontFamily:"Georgia,serif",
                      }}>{d}</button>
                    );
                  })}
                </div>
              </div>

              {/* Region */}
              <div>
                <label style={{fontSize:"9px",letterSpacing:"2px",color:"#5a4a3a",textTransform:"uppercase",display:"block",marginBottom:"7px"}}>{t.region_label} *</label>
                <select value={form.region} onChange={e=>setForm(f=>({...f,region:e.target.value}))} style={{width:"100%",background:"rgba(200,168,75,0.05)",border:"1px solid rgba(200,168,75,0.2)",borderRadius:"8px",padding:"11px 14px",color:form.region?"#e8dcc8":"#3a2a1a",fontSize:"13px",cursor:"pointer",fontFamily:"Georgia,serif"}}>
                  <option value="">{lang==="ku"?"Devera xwe hilbijêre...":"Select your region..."}</option>
                  {REGIONS.map(r=><option key={r}>{r}</option>)}
                </select>
              </div>

              {/* Affinity */}
              <div>
                <label style={{fontSize:"9px",letterSpacing:"2px",color:"#5a4a3a",textTransform:"uppercase",display:"block",marginBottom:"7px"}}>{t.affinity_label} *</label>
                <select value={form.affinity} onChange={e=>setForm(f=>({...f,affinity:e.target.value}))} style={{width:"100%",background:"rgba(200,168,75,0.05)",border:"1px solid rgba(200,168,75,0.2)",borderRadius:"8px",padding:"11px 14px",color:form.affinity?"#e8dcc8":"#3a2a1a",fontSize:"13px",cursor:"pointer",fontFamily:"Georgia,serif"}}>
                  <option value="">{lang==="ku"?"Hilbijêre...":"Select..."}</option>
                  {AFFINITIES.map(a=><option key={a}>{a}</option>)}
                </select>
              </div>

              {/* Languages — grouped */}
              <div>
                <label style={{fontSize:"9px",letterSpacing:"2px",color:"#5a4a3a",textTransform:"uppercase",display:"block",marginBottom:"10px"}}>{t.lang_label}</label>
                {LANG_GROUPS.map(g=>(
                  <div key={g.group} style={{marginBottom:"12px"}}>
                    <div style={{fontSize:"9px",color: g.group==="Kurdî"?"#C8A84B":"#3a2a1a",letterSpacing:"2px",textTransform:"uppercase",marginBottom:"7px",paddingLeft:"2px"}}>
                      {g.group==="Kurdî" ? "◈ Kurdî" : "◇ "+g.group}
                    </div>
                    <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                      {g.langs.map(l=>(
                        <button key={l} onClick={()=>toggleLang(l)} style={{
                          background:form.languages.includes(l)
                            ? g.group==="Kurdî" ? "rgba(200,168,75,0.18)" : "rgba(200,168,75,0.10)"
                            :"rgba(200,168,75,0.03)",
                          border:`1px solid ${form.languages.includes(l)
                            ? g.group==="Kurdî" ? "rgba(200,168,75,0.5)" : "rgba(200,168,75,0.25)"
                            :"rgba(200,168,75,0.1)"}`,
                          borderRadius:"4px",padding:"4px 11px",
                          color:form.languages.includes(l)
                            ? g.group==="Kurdî" ? "#C8A84B" : "#a89878"
                            :"#3a2a1a",
                          fontSize:"11px",cursor:"pointer",transition:"all 0.15s",fontFamily:"Georgia,serif",
                          fontWeight: g.group==="Kurdî" && form.languages.includes(l) ? "600" : "normal",
                        }}>{l}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {formError && <div style={{fontSize:"12px",color:"#C0392B",padding:"8px 12px",background:"rgba(192,57,43,0.08)",border:"1px solid rgba(192,57,43,0.2)",borderRadius:"6px"}}>{formError}</div>}

              {/* Submit */}
              <button onClick={handleRegister} disabled={submitting||slotsLeft<=0} style={{
                background: submitting ? "rgba(200,168,75,0.1)" : slotsLeft<=0 ? "rgba(200,168,75,0.05)" : "linear-gradient(90deg,#C8A84B,#a07830)",
                border:"none",borderRadius:"10px",padding:"15px",
                color: submitting||slotsLeft<=0 ? "#3a2a1a" : "#000",
                fontSize:"14px",fontWeight:"700",
                cursor:submitting||slotsLeft<=0?"not-allowed":"pointer",
                transition:"all 0.3s",fontFamily:"Georgia,serif",letterSpacing:"0.3px",
              }}>
                {submitting ? "⏳ " + (lang==="ku"?"Tê çêkirin...":"Creating...") : slotsLeft<=0 ? (lang==="ku"?"Cih nemaye":"No slots left") : t.submit}
              </button>

            </div>
          </div>
        )}

        {/* ── CARD ── */}
        {screen==="card" && selectedId && (
          <div>
            <button onClick={()=>setScreen("wallet")} style={{
              background:"transparent",border:"1px solid rgba(200,168,75,0.15)",
              borderRadius:"6px",padding:"5px 12px",
              color:"#5a4a3a",fontSize:"11px",cursor:"pointer",
              marginBottom:"20px",fontFamily:"Georgia,serif",
            }}>← {t.my_wallet}</button>
            <IDCard identity={selectedId} lang={lang}/>
          </div>
        )}

      </main>
    </div>
  );
}
