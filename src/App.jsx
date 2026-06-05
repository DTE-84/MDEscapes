import { useState, useRef, useEffect, useCallback } from "react";

const C = { bg:"#F7F3EE",white:"#FFFFFF",accent:"#C4503A",green:"#2B4438",text:"#1C1712",muted:"#7A6E65",border:"#E5DDD4",card:"#FAF8F5" };

const WALL_COLORS = [
  { name:"Warm White",  hex:"#F5F0E8", filter:"brightness(1.05) saturate(0.9)",                    tint:"rgba(245,240,232,0.18)" },
  { name:"Sage",        hex:"#849E81", filter:"hue-rotate(75deg) saturate(0.65) brightness(0.95)", tint:"rgba(132,158,129,0.24)" },
  { name:"Terracotta",  hex:"#C4735A", filter:"sepia(0.45) hue-rotate(-8deg) saturate(1.3)",        tint:"rgba(196,115,90,0.24)"  },
  { name:"Navy",        hex:"#2C3E6B", filter:"hue-rotate(210deg) saturate(0.75) brightness(0.68)",tint:"rgba(44,62,107,0.30)"   },
  { name:"Blush",       hex:"#D9B0A8", filter:"sepia(0.28) hue-rotate(320deg) saturate(0.85)",     tint:"rgba(217,176,168,0.24)" },
  { name:"Charcoal",    hex:"#4A4440", filter:"grayscale(0.55) brightness(0.65)",                  tint:"rgba(74,68,64,0.30)"    },
  { name:"Cream",       hex:"#EDE0C4", filter:"sepia(0.38) brightness(1.06)",                      tint:"rgba(237,224,196,0.28)" },
  { name:"Forest",      hex:"#2D4A3E", filter:"hue-rotate(115deg) saturate(0.85) brightness(0.6)", tint:"rgba(45,74,62,0.30)"    },
  { name:"Dusty Lilac", hex:"#9D8FA8", filter:"hue-rotate(265deg) saturate(0.5) brightness(0.9)",  tint:"rgba(157,143,168,0.24)" },
  { name:"Camel",       hex:"#C9A87C", filter:"sepia(0.6) hue-rotate(5deg) saturate(0.9)",         tint:"rgba(201,168,124,0.24)" },
];
const STYLES = [
  { name:"Minimalist",    emoji:"◻", desc:"Curated negative space, neutral palette" },
  { name:"Scandinavian",  emoji:"❄", desc:"Natural wood tones, soft whites, hygge warmth" },
  { name:"Boho",          emoji:"✿", desc:"Layered textiles, organic shapes, earth tones" },
  { name:"Industrial",    emoji:"⚙", desc:"Raw concrete, metal accents, exposed structure" },
  { name:"Modern Luxury", emoji:"◆", desc:"Marble, brass, plush textures, statement pieces" },
  { name:"Japandi",       emoji:"☯", desc:"Wabi-sabi simplicity, zen calm, natural materials" },
  { name:"Mediterranean", emoji:"☀", desc:"Warm plaster, arches, sea-bleached linen" },
  { name:"Art Deco",      emoji:"⬡", desc:"Geometric drama, rich jewel tones, gilded details" },
];
const FURNITURE = [
  { name:"Sofa",          cat:"Seating",  icon:"🛋️", sz:52 },
  { name:"Armchair",      cat:"Seating",  icon:"🪑",  sz:38 },
  { name:"Ottoman",       cat:"Seating",  icon:"⬜",   sz:34 },
  { name:"Coffee Table",  cat:"Tables",   icon:"◼",   sz:36 },
  { name:"Side Table",    cat:"Tables",   icon:"◻",   sz:28 },
  { name:"Dining Table",  cat:"Tables",   icon:"▬",   sz:44 },
  { name:"Desk + Chair",  cat:"Work",     icon:"🖥️",  sz:44 },
  { name:"Bookshelf",     cat:"Storage",  icon:"📚",  sz:38 },
  { name:"TV + Stand",    cat:"Tech",     icon:"📺",  sz:46 },
  { name:"Floor Lamp",    cat:"Lighting", icon:"💡",  sz:30 },
  { name:"Pendant Light", cat:"Lighting", icon:"⬡",   sz:26 },
  { name:"Large Plant",   cat:"Décor",    icon:"🌿",  sz:36 },
  { name:"Small Plant",   cat:"Décor",    icon:"🪴",  sz:28 },
  { name:"Area Rug",      cat:"Décor",    icon:"▭",   sz:58 },
  { name:"Mirror",        cat:"Décor",    icon:"🪞",  sz:32 },
  { name:"Art / Wall",    cat:"Décor",    icon:"🖼️", sz:36 },
];
const QUICK_TRANSFORMS = [
  { name:"AirBnb Ready",     emoji:"🏡", desc:"Clean, welcoming, 5-star worthy",        color:"Warm White", style:"Scandinavian",  furniture:["Sofa","Floor Lamp","Large Plant","Area Rug","Mirror"] },
  { name:"Cozy Sanctuary",   emoji:"🕯️", desc:"Warm, intimate, curl-up-and-stay",       color:"Camel",      style:"Boho",           furniture:["Sofa","Ottoman","Floor Lamp","Large Plant","Area Rug"] },
  { name:"Home Office",      emoji:"💼",  desc:"Focused, professional, camera-ready",   color:"Sage",       style:"Minimalist",     furniture:["Desk + Chair","Bookshelf","Floor Lamp","Small Plant"] },
  { name:"Romantic Evening", emoji:"🌹",  desc:"Moody, luxurious, date-night worthy",   color:"Navy",       style:"Modern Luxury",  furniture:["Sofa","Pendant Light","Mirror","Art / Wall"] },
  { name:"Minimal Reset",    emoji:"◻",   desc:"Strip it back, let the space breathe",  color:"Cream",      style:"Minimalist",     furniture:["Sofa","Side Table","Floor Lamp"] },
  { name:"Weekend Retreat",  emoji:"🌲",  desc:"Nature-forward, grounded, restorative", color:"Forest",     style:"Japandi",        furniture:["Sofa","Coffee Table","Large Plant","Area Rug"] },
];
const PROPERTY_TYPES = ["All","Loft","Cottage","Apartment","Villa","Bungalow","Cabin"];

function useFonts() {
  useEffect(() => {
    if (document.getElementById("mde-fonts")) return;
    const l = document.createElement("link");
    l.id="mde-fonts"; l.rel="stylesheet";
    l.href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500;600&display=swap";
    document.head.appendChild(l);
  }, []);
}
function useWidth() {
  const [w,setW]=useState(window.innerWidth);
  useEffect(()=>{const fn=()=>setW(window.innerWidth);window.addEventListener("resize",fn);return()=>window.removeEventListener("resize",fn);},[]);
  return w;
}

export default function MDEscapesApp() {
  useFonts();
  const width=useWidth(); const isMobile=width<768; const isTablet=width<1024;
  const [activePropType,setActivePropType]=useState("All");
  const [activeSection,setActiveSection]=useState("stays");
  const visRef=useRef(null);
  const scrollToVis=()=>{setActiveSection("visualizer");setTimeout(()=>visRef.current?.scrollIntoView({behavior:"smooth",block:"start"}),50);};
  return (
    <div style={{fontFamily:"'DM Sans',sans-serif",background:C.bg,minHeight:"100vh",color:C.text}}>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        @keyframes spin{to{transform:rotate(360deg);}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes shimmer{0%,100%{opacity:.5}50%{opacity:1}}
        .ma:hover{background:#B03D2C!important;}
        .mg:hover{background:rgba(28,23,18,.06)!important;}
        .mchip:hover{transform:scale(1.04);box-shadow:0 2px 10px rgba(0,0,0,.14);}
        .mrow:hover{border-color:#C4503A!important;background:rgba(196,80,58,.04)!important;}
        .mnl:hover{color:#C4503A!important;}
        .mup:hover{border-color:#C4503A!important;background:rgba(196,80,58,.03)!important;}
        .mcard:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(0,0,0,.1);}
        .mqt:hover{border-color:#C4503A!important;transform:translateY(-2px);box-shadow:0 4px 16px rgba(0,0,0,.08);}
      `}</style>
      <Nav activeSection={activeSection} setActiveSection={setActiveSection} scrollToVis={scrollToVis} isMobile={isMobile}/>
      <HeroSection activePropType={activePropType} setActivePropType={setActivePropType} scrollToVis={scrollToVis} isMobile={isMobile} isTablet={isTablet}/>
      <div ref={visRef}><VisualizerSection isMobile={isMobile} isTablet={isTablet}/></div>
      <HowItWorks isMobile={isMobile}/>
      <FeaturedStays isMobile={isMobile} isTablet={isTablet}/>
      <Footer isMobile={isMobile}/>
    </div>
  );
}

function Nav({activeSection,setActiveSection,scrollToVis,isMobile}){
  return(
    <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:isMobile?"14px 20px":"16px 48px",borderBottom:`1px solid ${C.border}`,background:C.bg,position:"sticky",top:0,zIndex:300}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"white",fontSize:12,fontWeight:700}}>M</span></div>
        <span style={{fontFamily:"'Playfair Display',serif",fontWeight:600,fontSize:isMobile?16:19,letterSpacing:"-0.4px"}}>md escapes</span>
      </div>
      {!isMobile&&<div style={{display:"flex",gap:28,alignItems:"center"}}>
        <button className="mnl" onClick={()=>setActiveSection("stays")} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,fontWeight:500,color:activeSection==="stays"?C.accent:C.text,transition:"color .2s",fontFamily:"'DM Sans',sans-serif"}}>Stays</button>
        <button className="mnl" onClick={scrollToVis} style={{background:"none",border:"none",cursor:"pointer",fontSize:15,fontWeight:500,color:activeSection==="visualizer"?C.accent:C.text,transition:"color .2s",display:"flex",alignItems:"center",gap:5,fontFamily:"'DM Sans',sans-serif"}}><span style={{fontSize:10}}>✦</span> AI Visualizer</button>
      </div>}
      <div style={{display:"flex",gap:isMobile?8:14,alignItems:"center"}}>
        {!isMobile&&<button className="mg" style={{background:"none",border:"none",cursor:"pointer",fontSize:15,fontWeight:500,color:C.text,padding:"8px 14px",borderRadius:50,transition:"background .15s",fontFamily:"'DM Sans',sans-serif"}}>Sign in</button>}
        <button className="ma" style={{background:C.accent,color:"white",border:"none",borderRadius:50,padding:isMobile?"9px 16px":"10px 22px",fontSize:isMobile?13:15,fontWeight:600,cursor:"pointer",transition:"background .2s",fontFamily:"'DM Sans',sans-serif"}}>Get started</button>
        {isMobile&&<button onClick={scrollToVis} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:50,padding:"8px 14px",fontSize:12,fontWeight:500,color:C.text,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>✦ Visualize</button>}
      </div>
    </nav>
  );
}

function HeroSection({activePropType,setActivePropType,scrollToVis,isMobile,isTablet}){
  return(
    <section style={{padding:isMobile?"40px 20px 36px":isTablet?"56px 32px 44px":"72px 48px 56px",maxWidth:1140,margin:"0 auto"}}>
      <div style={{display:"grid",gridTemplateColumns:isMobile||isTablet?"1fr":"1fr 1fr",gap:isMobile?32:64,alignItems:"center"}}>
        <div style={{animation:"fadeUp .6s ease both"}}>
          <p style={{color:C.accent,fontSize:11,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",marginBottom:18}}>— Private Escapes, Designed Slowly</p>
          <h1 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?36:isTablet?44:54,lineHeight:1.1,fontWeight:400}}>Stay somewhere <em style={{fontStyle:"italic",color:C.accent}}>designed</em> to be remembered.</h1>
          <p style={{fontSize:isMobile?15:16,color:C.muted,lineHeight:1.75,marginTop:20,maxWidth:440}}>A curated collection of private homes — and a built-in AI visualizer that lets you redesign any room in seconds.</p>
          <div style={{marginTop:28,display:"flex",gap:10}}>
            <input placeholder="Where to? Try Kyoto, Lisbon, Big Sur…" style={{flex:1,minWidth:0,border:`1.5px solid ${C.border}`,borderRadius:50,padding:isMobile?"11px 16px":"13px 22px",fontSize:isMobile?14:15,background:C.white,outline:"none",color:C.text,fontFamily:"'DM Sans',sans-serif"}}/>
            <button className="ma" style={{background:C.accent,color:"white",border:"none",borderRadius:50,padding:isMobile?"11px 18px":"13px 26px",fontSize:isMobile?14:15,fontWeight:600,cursor:"pointer",transition:"background .2s",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>Search</button>
          </div>
          <div style={{marginTop:20,display:"flex",gap:7,flexWrap:"wrap"}}>
            {PROPERTY_TYPES.map((t,i)=>(
              <button key={t} onClick={()=>setActivePropType(t)} style={{border:activePropType===t&&i!==0?`1.5px solid ${C.text}`:i===0&&activePropType==="All"?"none":`1px solid ${C.border}`,background:activePropType===t?(i===0?C.green:"white"):"transparent",color:activePropType===t?(i===0?"white":C.text):C.text,borderRadius:50,padding:isMobile?"7px 14px":"8px 18px",fontSize:isMobile?13:14,cursor:"pointer",fontWeight:activePropType===t?600:400,transition:"all .15s",fontFamily:"'DM Sans',sans-serif"}}>{t}</button>
            ))}
          </div>
        </div>
        {!isMobile&&(
          <div style={{animation:"fadeUp .6s .15s ease both",position:"relative"}}>
            <div style={{borderRadius:22,overflow:"hidden",background:"linear-gradient(135deg,#D4C8B8 0%,#B8A898 100%)",aspectRatio:isTablet?"16/7":"4/3",position:"relative"}}>
              <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
                <svg viewBox="0 0 400 300" style={{width:"100%",height:"100%",opacity:.35}}>
                  <rect x="0" y="200" width="400" height="100" fill="#8B7355"/>
                  <rect x="0" y="0" width="400" height="200" fill="#C9B99A"/>
                  <rect x="270" y="20" width="100" height="130" fill="#D4E8D4" rx="2"/>
                  <line x1="320" y1="20" x2="320" y2="150" stroke="#8B7355" strokeWidth="2"/>
                  <line x1="270" y1="85" x2="370" y2="85" stroke="#8B7355" strokeWidth="2"/>
                  <rect x="50" y="165" width="180" height="55" fill="#8B6F5E" rx="8"/>
                  <rect x="50" y="155" width="180" height="20" fill="#7A5F4E" rx="4"/>
                  <rect x="90" y="225" width="100" height="8" fill="#5C4A3A" rx="2"/>
                  <ellipse cx="350" cy="180" rx="18" ry="25" fill="#5A7A5A"/>
                  <rect x="346" y="200" width="8" height="20" fill="#8B6F5E"/>
                </svg>
              </div>
              <div style={{position:"absolute",inset:0,background:"linear-gradient(transparent 40%,rgba(0,0,0,.65) 100%)"}}/>
              <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"28px 24px"}}>
                <p style={{color:"rgba(255,255,255,.65)",fontSize:11,letterSpacing:".12em",textTransform:"uppercase",marginBottom:6}}>Featured</p>
                <p style={{color:"white",fontFamily:"'Playfair Display',serif",fontSize:20,lineHeight:1.3}}>Terracotta light, the way it should be.</p>
              </div>
            </div>
            <button onClick={scrollToVis} className="ma" style={{position:"absolute",top:18,right:18,background:C.accent,color:"white",border:"none",borderRadius:50,padding:"8px 16px",fontSize:12,fontWeight:600,cursor:"pointer",display:"flex",alignItems:"center",gap:5,transition:"background .2s",fontFamily:"'DM Sans',sans-serif"}}><span style={{fontSize:9}}>✦</span> Try Visualizer</button>
          </div>
        )}
      </div>
    </section>
  );
}

function VisualizerSection({isMobile,isTablet}){
  const [uploaded,setUploaded]=useState(null);
  const [imageB64,setImageB64]=useState(null);
  const [imageMime,setImageMime]=useState("image/jpeg");
  const [isDragging,setIsDragging]=useState(false);
  const fileRef=useRef(null);
  const [activeTab,setActiveTab]=useState("walls");
  const [selectedColor,setSelectedColor]=useState(null);
  const [customHex,setCustomHex]=useState("#C4503A");
  const [useCustom,setUseCustom]=useState(false);
  const [selectedStyle,setSelectedStyle]=useState(null);
  const [selectedFurniture,setSelectedFurniture]=useState([]);
  const [controlsOpen,setControlsOpen]=useState(false);
  const [sliderPos,setSliderPos]=useState(50);
  const sliderDragging=useRef(false);
  const imgContainerRef=useRef(null);
  const [placedItems,setPlacedItems]=useState([]);
  const furnDrag=useRef(null);
  const productResizeDrag=useRef(null);
  const [productImages,setProductImages]=useState([]);
  // each: {id, name, src, x, y, scale, blend}
  const [roomAnalysis,setRoomAnalysis]=useState(null);
  const [isAnalyzing,setIsAnalyzing]=useState(false);
  const [analysisOpen,setAnalysisOpen]=useState(true);
  const [isGenerating,setIsGenerating]=useState(false);
  const [designVision,setDesignVision]=useState(null);
  const [loadingDot,setLoadingDot]=useState(0);
  const [savedVisions,setSavedVisions]=useState([]);
  const [viewingSaved,setViewingSaved]=useState(null);

  useEffect(()=>{if(!isGenerating)return;const t=setInterval(()=>setLoadingDot(d=>(d+1)%4),400);return()=>clearInterval(t);},[isGenerating]);

  const handleFile=(file)=>{
    if(!file||!file.type.startsWith("image/"))return;
    setImageMime(file.type);
    const reader=new FileReader();
    reader.onload=(e)=>{
      setUploaded(e.target.result);
      const b64=e.target.result.split(",")[1];
      setImageB64(b64);
      setDesignVision(null);setViewingSaved(null);setPlacedItems([]);setRoomAnalysis(null);
      if(isMobile)setControlsOpen(true);
      analyzeRoom(b64,file.type);
    };
    reader.readAsDataURL(file);
  };
  const handleDrop=useCallback((e)=>{e.preventDefault();setIsDragging(false);handleFile(e.dataTransfer.files[0]);},[isMobile]);

  const analyzeRoom=async(b64,mime)=>{
    setIsAnalyzing(true);
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-calls":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:600,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:mime,data:b64}},
            {type:"text",text:`Analyze this room photo and return ONLY a raw JSON object with no markdown, no backticks:
{"roomType":"Living Room","currentStyle":"Contemporary","lightQuality":"Warm afternoon light","keyElements":["Gray sofa","Hardwood floors"],"quickWins":["A floor lamp in the corner would anchor the seating","Terracotta walls would balance the cool grays","A large rug defines the zone"],"moodScore":72,"suggestedStyle":"Scandinavian"}`}
          ]}]})
      });
      const data=await res.json();
      const raw=data.content?.find(c=>c.type==="text")?.text||"{}";
      setRoomAnalysis(JSON.parse(raw.replace(/```json|```/g,"").trim()));
    }catch(e){/* silent */}finally{setIsAnalyzing(false);}
  };

  const getSliderPct=(clientX)=>{
    const rect=imgContainerRef.current?.getBoundingClientRect();
    if(!rect)return 50;
    return Math.max(5,Math.min(95,((clientX-rect.left)/rect.width)*100));
  };
  const onContainerMove=(e)=>{
    const cx=e.clientX??e.touches?.[0]?.clientX;
    const cy=e.clientY??e.touches?.[0]?.clientY;
    if(sliderDragging.current)setSliderPos(getSliderPct(cx));
    if(furnDrag.current){
      const rect=imgContainerRef.current?.getBoundingClientRect();
      if(!rect)return;
      const x=Math.max(4,Math.min(96,((cx-rect.left-furnDrag.current.ox)/rect.width)*100));
      const y=Math.max(4,Math.min(96,((cy-rect.top-furnDrag.current.oy)/rect.height)*100));
      if(furnDrag.current.isProduct){
        const pid=furnDrag.current.id.replace("product_","");
        setProductImages(prev=>prev.map(it=>String(it.id)===pid?{...it,x,y}:it));
      }else{
        setPlacedItems(prev=>prev.map(it=>it.id===furnDrag.current.id?{...it,x,y}:it));
      }
    }
    if(productResizeDrag.current){
      const dx=(cx-productResizeDrag.current.startX)/180;
      const ns=Math.max(0.06,Math.min(3,productResizeDrag.current.startScale+dx));
      setProductImages(prev=>prev.map(p=>String(p.id)===String(productResizeDrag.current.id)?{...p,scale:ns}:p));
    }
  };
  const onContainerUp=()=>{sliderDragging.current=false;furnDrag.current=null;productResizeDrag.current=null;};
  const addToCanvas=(f)=>setPlacedItems(prev=>[...prev,{id:Date.now()+Math.random(),name:f.name,icon:f.icon,sz:f.sz,x:50,y:50}]);
  const startFurnDrag=(e,item)=>{
    const rect=imgContainerRef.current?.getBoundingClientRect();
    const cx=e.clientX??e.clientX;
    const cy=e.clientY??e.clientY;
    furnDrag.current={id:item.id,ox:cx-rect.left-(item.x/100*rect.width),oy:cy-rect.top-(item.y/100*rect.height)};
  };
  const removeFromCanvas=(id)=>setPlacedItems(prev=>prev.filter(i=>i.id!==id));
  const handleProductUpload=(files)=>{
    Array.from(files).forEach(file=>{
      if(!file.type.startsWith("image/"))return;
      const reader=new FileReader();
      reader.onload=(e)=>{
        setProductImages(prev=>[...prev,{
          id:Date.now()+Math.random(),
          name:file.name.replace(/\.[^/.]+$/,""),
          src:e.target.result,
          x:50,y:50,scale:0.28,blend:"multiply"
        }]);
      };
      reader.readAsDataURL(file);
    });
  };
  const removeProduct=(id)=>setProductImages(prev=>prev.filter(p=>p.id!==id));
  const toggleBlend=(id)=>setProductImages(prev=>prev.map(p=>p.id===id?{...p,blend:p.blend==="multiply"?"normal":"multiply"}:p));
  const startResizeDrag=(e,prod)=>{
    e.stopPropagation();
    productResizeDrag.current={id:prod.id,startX:e.clientX,startScale:prod.scale};
  };
  const startProductDrag=(e,prod)=>{
    e.stopPropagation();
    const rect=imgContainerRef.current?.getBoundingClientRect();
    if(!rect)return;
    furnDrag.current={
      id:"product_"+prod.id,
      ox:e.clientX-rect.left-(prod.x/100*rect.width),
      oy:e.clientY-rect.top-(prod.y/100*rect.height),
      isProduct:true,
    };
  };
  const applyQuickTransform=(qt)=>{
    setSelectedColor(WALL_COLORS.find(c=>c.name===qt.color)||null);
    setUseCustom(false);setSelectedStyle(qt.style);setSelectedFurniture(qt.furniture);
  };
  const toggleFurniture=(name)=>setSelectedFurniture(prev=>prev.includes(name)?prev.filter(f=>f!==name):[...prev,name]);

  const activeFilter=useCustom?`sepia(0.2) hue-rotate(0deg) saturate(0.8) brightness(0.95)`:selectedColor?.filter||"none";
  const activeTint=useCustom?customHex+"33":selectedColor?.tint||"transparent";

  const generateVision=async()=>{
    if(!imageB64)return;
    setIsGenerating(true);setDesignVision(null);setViewingSaved(null);
    const colorName=useCustom?`custom color ${customHex}`:selectedColor?.name||null;
    const changes=[
      colorName&&`walls repainted ${colorName}`,
      selectedStyle&&`room restyled as ${selectedStyle}`,
      selectedFurniture.length&&`furniture added: ${selectedFurniture.join(", ")}`,
      placedItems.length&&`${placedItems.length} items staged on the canvas`,
    ].filter(Boolean);
    const prompt=changes.length
      ?`You are a world-class interior designer writing for a prestigious architectural magazine.\n\nAnalyze this room, then describe it transformed with:\n${changes.map(c=>"• "+c).join("\n")}\n\nUse exactly these bold markdown headers:\n\n**Room Analysis**\nTwo sentences: the bones — light, proportions, what's working.\n\n**The Transformed Space**\nFive cinematic sentences in present tense. Sensory: how light hits the new wall color, how furniture creates flow, the mood it inhabits.\n\n**Designer's Finishing Touch**\nOne sentence: the one unexpected element that makes this space extraordinary.`
      :`You are a world-class interior designer.\n\nAnalyze this room with exactly these bold markdown headers:\n\n**Room Analysis**\nThree sentences: light quality, proportions, palette, what's working and what isn't.\n\n**Three Design Directions**\nThree labeled directions, two sentences each. Make each feel distinct and surprising.\n\n**The One Thing**\nOne sentence: the single highest-impact change to transform this room immediately.`;
    try{
      const res=await fetch("https://api.anthropic.com/v1/messages",{
        method:"POST",headers:{"Content-Type":"application/json","x-api-key":import.meta.env.VITE_ANTHROPIC_API_KEY,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-calls":"true"},
        body:JSON.stringify({model:"claude-sonnet-4-20250514",max_tokens:1000,
          messages:[{role:"user",content:[
            {type:"image",source:{type:"base64",media_type:imageMime,data:imageB64}},
            {type:"text",text:prompt}
          ]}]})
      });
      const data=await res.json();
      const text=data.content?.find(c=>c.type==="text")?.text||"Unable to generate vision. Please try again.";
      setDesignVision(text);
    }catch{setDesignVision("Something went wrong. Please try again.");}
    finally{setIsGenerating(false);}
  };

  const saveVision=()=>{
    if(!designVision||savedVisions.length>=3)return;
    setSavedVisions(prev=>[...prev,{id:Date.now(),text:designVision,color:useCustom?{name:"Custom",hex:customHex}:selectedColor,style:selectedStyle,furniture:[...selectedFurniture],label:"Vision "+(prev.length+1)}]);
  };
  const reset=()=>{setUploaded(null);setImageB64(null);setDesignVision(null);setSelectedColor(null);setSelectedStyle(null);setSelectedFurniture([]);setUseCustom(false);setPlacedItems([]);setProductImages([]);setRoomAnalysis(null);setSavedVisions([]);setViewingSaved(null);setControlsOpen(false);setSliderPos(50);};
  const activeCount=[selectedColor||useCustom?1:0,selectedStyle?1:0,...selectedFurniture,productImages.length>0?1:0].filter(Boolean).length;
  const px=isMobile?"20px":isTablet?"32px":"48px";

  return(
    <section style={{background:C.white,padding:`${isMobile?52:80}px ${px}`,borderTop:`1px solid ${C.border}`}}>
      <div style={{maxWidth:1140,margin:"0 auto"}}>
        <div style={{textAlign:"center",marginBottom:isMobile?36:52}}>
          <p style={{color:C.accent,fontSize:11,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",marginBottom:14}}>— Built-In Studio</p>
          <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?30:isTablet?38:46,lineHeight:1.15,fontWeight:400}}>See the room <em style={{fontStyle:"italic"}}>before</em> the room exists.</h2>
          <p style={{fontSize:isMobile?14:16,color:C.muted,maxWidth:540,margin:"16px auto 0",lineHeight:1.75}}>Upload any room photo. Repaint walls live, stage furniture on the image, pick a style — then get a cinematic AI design vision.</p>
        </div>

        {!uploaded?(
          <div className="mup" onDragOver={e=>{e.preventDefault();setIsDragging(true);}} onDragLeave={()=>setIsDragging(false)} onDrop={handleDrop} onClick={()=>fileRef.current?.click()}
            style={{border:`2px dashed ${isDragging?C.accent:C.border}`,borderRadius:20,padding:isMobile?"52px 24px":"88px 40px",textAlign:"center",background:isDragging?"rgba(196,80,58,.04)":C.card,transition:"all .2s",cursor:"pointer"}}>
            <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={e=>handleFile(e.target.files[0])}/>
            <div style={{width:64,height:64,borderRadius:"50%",background:"rgba(196,80,58,.1)",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto 18px"}}>
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none"><path d="M16 6v14M10 12l6-6 6 6M6 24h20" stroke={C.accent} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <p style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?20:24,color:C.text,marginBottom:10}}>Drop your room photo here</p>
            <p style={{color:C.muted,fontSize:isMobile?13:15,marginBottom:24}}>or tap to browse — JPG, PNG, WEBP, HEIC</p>
            <button className="ma" style={{background:C.accent,color:"white",border:"none",borderRadius:50,padding:"12px 28px",fontSize:15,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Choose Photo</button>
          </div>
        ):(
          <div style={{display:"grid",gridTemplateColumns:isMobile||isTablet?"1fr":"300px 1fr",gap:isMobile?0:28,alignItems:"start"}}>
            {!isMobile&&(
              <div style={{background:C.card,borderRadius:20,padding:24,border:`1px solid ${C.border}`,position:isTablet?"static":"sticky",top:88}}>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
                  <h3 style={{fontFamily:"'Playfair Display',serif",fontSize:19,fontWeight:600}}>Design Studio</h3>
                  {activeCount>0&&<span style={{fontSize:11,color:C.muted,background:C.border,borderRadius:50,padding:"3px 10px"}}>{activeCount} active</span>}
                </div>
                <ControlTabs activeTab={activeTab} setActiveTab={setActiveTab} selectedColor={selectedColor} setSelectedColor={setSelectedColor} useCustom={useCustom} setUseCustom={setUseCustom} customHex={customHex} setCustomHex={setCustomHex} selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} selectedFurniture={selectedFurniture} toggleFurniture={toggleFurniture} placedItems={placedItems} addToCanvas={addToCanvas} savedVisions={savedVisions} setSavedVisions={setSavedVisions} viewingSaved={viewingSaved} setViewingSaved={setViewingSaved} applyQuickTransform={applyQuickTransform} isMobile={false}/>
                {activeCount>0&&(
                  <div style={{margin:"16px 0",padding:"12px 14px",background:"white",borderRadius:12,border:`1px solid ${C.border}`}}>
                    <p style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Current Selection</p>
                    {(selectedColor||useCustom)&&<div style={{fontSize:12,color:C.text,marginBottom:3,display:"flex",alignItems:"center",gap:6}}><div style={{width:12,height:12,borderRadius:3,background:useCustom?customHex:selectedColor?.hex,border:"1px solid rgba(0,0,0,.1)"}}/>Wall: {useCustom?"Custom "+customHex:selectedColor?.name}</div>}
                    {selectedStyle&&<div style={{fontSize:12,color:C.text,marginBottom:3}}>✦ Style: {selectedStyle}</div>}
                    {selectedFurniture.length>0&&<div style={{fontSize:12,color:C.text,marginBottom:3}}>🛋 AI list: {selectedFurniture.length} items</div>}
                    {placedItems.length>0&&<div style={{fontSize:12,color:C.text}}>📍 Staged: {placedItems.length} on canvas</div>}
                  </div>
                )}
                <ActionButtons isGenerating={isGenerating} loadingDot={loadingDot} generateVision={generateVision} reset={reset}/>
              </div>
            )}
            <div>
              {isMobile&&(
                <div style={{borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:14}}>
                  <button onClick={()=>setControlsOpen(o=>!o)} style={{width:"100%",background:C.card,border:"none",padding:"15px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                    <span style={{fontFamily:"'Playfair Display',serif",fontSize:16,fontWeight:600}}>Design Studio</span>
                    <div style={{display:"flex",alignItems:"center",gap:10}}>
                      {activeCount>0&&<span style={{background:C.accent,color:"white",borderRadius:50,padding:"2px 10px",fontSize:12,fontWeight:600}}>{activeCount}</span>}
                      <span style={{color:C.muted,fontSize:18,display:"inline-block",transform:controlsOpen?"rotate(180deg)":"none",transition:"transform .2s"}}>⌄</span>
                    </div>
                  </button>
                  {controlsOpen&&<div style={{padding:"0 18px 18px",background:C.card}}><ControlTabs activeTab={activeTab} setActiveTab={setActiveTab} selectedColor={selectedColor} setSelectedColor={setSelectedColor} useCustom={useCustom} setUseCustom={setUseCustom} customHex={customHex} setCustomHex={setCustomHex} selectedStyle={selectedStyle} setSelectedStyle={setSelectedStyle} selectedFurniture={selectedFurniture} toggleFurniture={toggleFurniture} placedItems={placedItems} addToCanvas={addToCanvas} savedVisions={savedVisions} setSavedVisions={setSavedVisions} viewingSaved={viewingSaved} setViewingSaved={setViewingSaved} applyQuickTransform={applyQuickTransform} isMobile={true}/></div>}
                </div>
              )}

              <RoomIntelligence analysis={roomAnalysis} isAnalyzing={isAnalyzing} open={analysisOpen} setOpen={setAnalysisOpen} isMobile={isMobile}/>

              <div ref={imgContainerRef} onMouseMove={onContainerMove} onMouseUp={onContainerUp} onMouseLeave={onContainerUp}
                onTouchMove={e=>{e.preventDefault();onContainerMove(e.touches[0]);}} onTouchEnd={onContainerUp}
                style={{borderRadius:isMobile?14:20,overflow:"hidden",position:"relative",background:"#E8DDD0",boxShadow:"0 4px 40px rgba(0,0,0,.08)",userSelect:"none",touchAction:"none"}}>
                <img src={uploaded} alt="before" style={{width:"100%",display:"block"}}/>
                <div style={{position:"absolute",inset:0,clipPath:`inset(0 0 0 ${sliderPos}%)`,pointerEvents:"none"}}>
                  <img src={uploaded} alt="after" style={{width:"100%",display:"block",filter:activeFilter,transition:"filter .5s"}}/>
                  <div style={{position:"absolute",inset:0,background:activeTint,mixBlendMode:"multiply",transition:"background .5s"}}/>
                </div>
                <div style={{position:"absolute",top:0,bottom:0,left:`${sliderPos}%`,transform:"translateX(-50%)",width:2,background:"rgba(255,255,255,.85)",pointerEvents:"none"}}>
                  <div onMouseDown={e=>{e.stopPropagation();sliderDragging.current=true;}} onTouchStart={e=>{e.stopPropagation();sliderDragging.current=true;}}
                    style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:38,height:38,borderRadius:"50%",background:"white",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 2px 12px rgba(0,0,0,.22)",cursor:"ew-resize",pointerEvents:"all",fontSize:14,color:C.muted,zIndex:6}}>⇔</div>
                </div>
                <div onMouseDown={e=>{sliderDragging.current=true;setSliderPos(getSliderPct(e.clientX));}} style={{position:"absolute",inset:0,cursor:"ew-resize",zIndex:4,background:"transparent"}}/>
                {placedItems.map(item=>(
                  <div key={item.id} onMouseDown={e=>{e.stopPropagation();startFurnDrag(e,item);}} onTouchStart={e=>{e.stopPropagation();startFurnDrag(e.touches[0],item);}}
                    style={{position:"absolute",left:`${item.x}%`,top:`${item.y}%`,transform:"translate(-50%,-50%)",zIndex:10,cursor:"grab",filter:"drop-shadow(0 3px 6px rgba(0,0,0,.35))"}}>
                    <div style={{position:"relative",display:"inline-block"}}>
                      <span style={{fontSize:item.sz,display:"block",lineHeight:1}}>{item.icon}</span>
                      <button onClick={e=>{e.stopPropagation();removeFromCanvas(item.id);}} style={{position:"absolute",top:-8,right:-8,width:18,height:18,borderRadius:"50%",background:C.accent,border:"none",color:"white",fontSize:11,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:11}}>×</button>
                    </div>
                  </div>
                ))}
                {productImages.map(prod=>(
                  <div key={prod.id}
                    onMouseDown={e=>startProductDrag(e,prod)}
                    onTouchStart={e=>{e.stopPropagation();const t=e.touches[0];const rect=imgContainerRef.current?.getBoundingClientRect();furnDrag.current={id:"product_"+prod.id,ox:t.clientX-rect.left-(prod.x/100*rect.width),oy:t.clientY-rect.top-(prod.y/100*rect.height),isProduct:true};}}
                    style={{position:"absolute",left:`${prod.x}%`,top:`${prod.y}%`,transform:`translate(-50%,-50%) scale(${prod.scale})`,zIndex:12,cursor:"grab",userSelect:"none",transformOrigin:"center center"}}>
                    <div style={{position:"relative",display:"inline-block"}}>
                      <img src={prod.src} alt={prod.name}
                        style={{maxWidth:240,maxHeight:240,display:"block",mixBlendMode:prod.blend,filter:"drop-shadow(0 4px 10px rgba(0,0,0,0.25))",borderRadius:4}}
                        draggable={false}
                      />
                      {/* × remove */}
                      <button onClick={e=>{e.stopPropagation();removeProduct(prod.id);}} style={{position:"absolute",top:-10,left:-10,width:20,height:20,borderRadius:"50%",background:C.accent,border:"none",color:"white",fontSize:12,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:14,lineHeight:1}}>×</button>
                      {/* blend toggle */}
                      <button onClick={e=>{e.stopPropagation();toggleBlend(prod.id);}} title={prod.blend==="multiply"?"White bg removed (multiply)":"Normal blend"} style={{position:"absolute",top:-10,right:-10,width:20,height:20,borderRadius:"50%",background:prod.blend==="multiply"?C.green:"rgba(0,0,0,.5)",border:"none",color:"white",fontSize:9,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:14,lineHeight:1,fontWeight:700}}>BG</button>
                      {/* resize handle */}
                      <div onMouseDown={e=>{e.stopPropagation();productResizeDrag.current={id:prod.id,startX:e.clientX,startScale:prod.scale};}} onTouchStart={e=>{e.stopPropagation();productResizeDrag.current={id:prod.id,startX:e.touches[0].clientX,startScale:prod.scale};}}
                        style={{position:"absolute",bottom:-8,right:-8,width:16,height:16,background:"white",border:`2px solid ${C.accent}`,borderRadius:3,cursor:"se-resize",zIndex:14,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8,color:C.accent}}>⤡</div>
                      {/* label */}
                      <div style={{position:"absolute",bottom:-26,left:"50%",transform:"translateX(-50%)",background:"rgba(0,0,0,.6)",color:"white",borderRadius:50,padding:"2px 8px",fontSize:9,whiteSpace:"nowrap",fontWeight:500,pointerEvents:"none"}}>{prod.name.slice(0,18)}</div>
                    </div>
                  </div>
                ))}
                <div style={{position:"absolute",top:14,left:14,background:"rgba(0,0,0,.5)",color:"white",borderRadius:50,padding:"4px 11px",fontSize:11,fontWeight:600,zIndex:5,pointerEvents:"none"}}>BEFORE</div>
                <div style={{position:"absolute",top:14,right:14,background:C.accent,color:"white",borderRadius:50,padding:"4px 11px",fontSize:11,fontWeight:600,zIndex:5,pointerEvents:"none"}}>AFTER</div>
                {(placedItems.length>0||productImages.length>0)&&<div style={{position:"absolute",bottom:14,right:14,background:"rgba(255,255,255,.92)",backdropFilter:"blur(8px)",borderRadius:50,padding:"5px 12px",fontSize:12,fontWeight:600,zIndex:5,pointerEvents:"none"}}>📍 {placedItems.length+productImages.length} staged</div>}
              </div>
              <p style={{textAlign:"center",fontSize:12,color:C.muted,marginTop:8}}>← Drag center handle to compare · Tap + in Stage tab to add furniture · Drag pieces to position</p>
              {isMobile&&<ActionButtons isGenerating={isGenerating} loadingDot={loadingDot} generateVision={generateVision} reset={reset}/>}
              {isGenerating&&<div style={{marginTop:20,background:C.green,borderRadius:18,padding:"24px 28px",display:"flex",alignItems:"center",gap:18,animation:"fadeUp .4s ease both"}}><div style={{width:40,height:40,borderRadius:"50%",border:"2px solid rgba(255,255,255,.2)",borderTopColor:C.accent,animation:"spin 1s linear infinite",flexShrink:0}}/><div><p style={{color:"white",fontFamily:"'Playfair Display',serif",fontSize:17}}>Designing your space{".".repeat(loadingDot)}</p><p style={{color:"rgba(255,255,255,.5)",fontSize:13,marginTop:4}}>Reading light, proportions, your selections…</p></div></div>}
              {viewingSaved&&!isGenerating&&<VisionCard text={viewingSaved.text} label={viewingSaved.label} onRegenerate={null} extra={<button onClick={()=>setViewingSaved(null)} style={{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.2)",borderRadius:50,padding:"9px 18px",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back to current</button>} isMobile={isMobile}/>}
              {designVision&&!isGenerating&&!viewingSaved&&<VisionCard text={designVision} label="AI Design Vision" onRegenerate={generateVision} extra={savedVisions.length<3&&<button onClick={saveVision} style={{background:"rgba(255,255,255,.1)",color:"rgba(255,255,255,.8)",border:"1px solid rgba(255,255,255,.2)",borderRadius:50,padding:"9px 18px",fontSize:13,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Save Vision {savedVisions.length+1}/3</button>} isMobile={isMobile}/>}
              {!designVision&&!isGenerating&&!viewingSaved&&<div style={{marginTop:20,padding:isMobile?"22px 20px":"26px 32px",background:C.card,borderRadius:18,border:`1px solid ${C.border}`,textAlign:"center"}}><p style={{fontFamily:"'Playfair Display',serif",fontSize:18,color:C.text,marginBottom:8}}>Your design vision awaits.</p><p style={{fontSize:14,color:C.muted,lineHeight:1.7}}>Drag the slider to preview · Stage furniture · Then hit <strong>Generate AI Vision</strong>.</p></div>}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function RoomIntelligence({analysis,isAnalyzing,open,setOpen,isMobile}){
  if(!isAnalyzing&&!analysis)return null;
  return(
    <div style={{marginBottom:16,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",animation:"fadeUp .5s ease both"}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",background:"linear-gradient(135deg,#2B4438 0%,#1E3028 100%)",border:"none",padding:"14px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:15}}>✦</span>
          <span style={{color:"white",fontWeight:600,fontSize:14}}>Room Intelligence</span>
          {isAnalyzing&&<span style={{color:"rgba(255,255,255,.5)",fontSize:12,animation:"shimmer 1.2s infinite"}}>Analyzing…</span>}
          {analysis&&<span style={{background:C.accent,color:"white",borderRadius:50,padding:"2px 10px",fontSize:11,fontWeight:600}}>{analysis.roomType}</span>}
        </div>
        {analysis&&<span style={{color:"rgba(255,255,255,.5)",fontSize:16,transform:open?"rotate(180deg)":"none",transition:"transform .2s",display:"inline-block"}}>⌄</span>}
      </button>
      {open&&analysis&&(
        <div style={{background:"#F0EDE8",padding:"18px 20px"}}>
          <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            {[["🎨","Current Style",analysis.currentStyle],["☀","Light Quality",analysis.lightQuality],["✦","Suggested Style",analysis.suggestedStyle]].map(([icon,label,val])=>(
              <div key={label} style={{background:"white",borderRadius:10,padding:"10px 12px",border:`1px solid ${C.border}`}}>
                <p style={{fontSize:10,color:C.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:4}}>{icon} {label}</p>
                <p style={{fontSize:13,fontWeight:600,color:C.text}}>{val}</p>
              </div>
            ))}
          </div>
          {analysis.keyElements?.length>0&&(
            <div style={{marginBottom:12}}>
              <p style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>Detected in room</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
                {analysis.keyElements.map(el=><span key={el} style={{background:"white",border:`1px solid ${C.border}`,borderRadius:50,padding:"4px 12px",fontSize:12,color:C.text}}>{el}</span>)}
              </div>
            </div>
          )}
          {analysis.quickWins?.length>0&&(
            <div>
              <p style={{fontSize:11,fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:".1em",marginBottom:8}}>3 Quick Wins</p>
              {analysis.quickWins.map((w,i)=>(
                <div key={i} style={{display:"flex",gap:10,marginBottom:i<2?8:0,alignItems:"flex-start"}}>
                  <span style={{color:C.accent,fontWeight:700,fontSize:13,flexShrink:0,marginTop:1}}>{i+1}</span>
                  <p style={{fontSize:13,color:C.text,lineHeight:1.55}}>{w}</p>
                </div>
              ))}
            </div>
          )}
          {analysis.moodScore&&(
            <div style={{marginTop:14,paddingTop:14,borderTop:`1px solid ${C.border}`}}>
              <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
                <p style={{fontSize:12,color:C.muted}}>Current Mood Score</p>
                <p style={{fontSize:13,fontWeight:600,color:C.text}}>{analysis.moodScore}/100</p>
              </div>
              <div style={{height:6,background:C.border,borderRadius:3,overflow:"hidden"}}>
                <div style={{height:"100%",width:`${analysis.moodScore}%`,background:`linear-gradient(90deg,${C.accent},${C.green})`,borderRadius:3,transition:"width 1s ease"}}/>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ControlTabs({activeTab,setActiveTab,selectedColor,setSelectedColor,useCustom,setUseCustom,customHex,setCustomHex,selectedStyle,setSelectedStyle,selectedFurniture,toggleFurniture,placedItems,addToCanvas,savedVisions,setSavedVisions,viewingSaved,setViewingSaved,applyQuickTransform,isMobile}){
  return(
    <>
      <div style={{display:"flex",borderBottom:`1px solid ${C.border}`,marginBottom:16,overflowX:"auto"}}>
        {[["walls","Walls"],["style","Style"],["stage","Stage"],["quick","Quick"],["saved","Saved"]].map(([key,label])=>(
          <button key={key} onClick={()=>setActiveTab(key)} style={{flex:1,background:"none",border:"none",borderBottom:activeTab===key?`2.5px solid ${C.accent}`:"2.5px solid transparent",padding:"9px 4px",fontSize:12,fontWeight:activeTab===key?600:400,color:activeTab===key?C.accent:C.muted,cursor:"pointer",whiteSpace:"nowrap",fontFamily:"'DM Sans',sans-serif"}}>{label}</button>
        ))}
      </div>

      {activeTab==="walls"&&(
        <div>
          <p style={{fontSize:12,color:C.muted,marginBottom:12}}>Select a wall color — drag the slider on the image to compare</p>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7}}>
            {WALL_COLORS.map(c=>{const active=!useCustom&&selectedColor?.name===c.name;return(
              <button key={c.name} className="mchip" onClick={()=>{setSelectedColor(active?null:c);setUseCustom(false);}}
                style={{border:active?`2px solid ${C.accent}`:`1px solid ${C.border}`,borderRadius:11,padding:"8px 10px",cursor:"pointer",background:active?"rgba(196,80,58,.05)":"white",display:"flex",alignItems:"center",gap:8,textAlign:"left",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
                <div style={{width:20,height:20,borderRadius:5,background:c.hex,border:"1px solid rgba(0,0,0,.1)",flexShrink:0}}/>
                <span style={{fontSize:12,fontWeight:active?600:400,color:active?C.accent:C.text}}>{c.name}</span>
              </button>
            );})}
          </div>
          <div style={{marginTop:10,padding:"12px 14px",background:useCustom?"rgba(196,80,58,.06)":"white",borderRadius:12,border:`${useCustom?2:1}px solid ${useCustom?C.accent:C.border}`,cursor:"pointer"}} onClick={()=>{setUseCustom(true);setSelectedColor(null);}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <input type="color" value={customHex} onChange={e=>{setCustomHex(e.target.value);setUseCustom(true);setSelectedColor(null);}} onClick={e=>e.stopPropagation()} style={{width:28,height:28,border:"none",borderRadius:6,cursor:"pointer",padding:0,background:"none"}}/>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:useCustom?600:400,color:useCustom?C.accent:C.text}}>Custom Color</div>
                <input value={customHex} onChange={e=>{setCustomHex(e.target.value);setUseCustom(true);setSelectedColor(null);}} onClick={e=>e.stopPropagation()} style={{fontSize:11,color:C.muted,background:"none",border:"none",outline:"none",fontFamily:"monospace",width:"100%",marginTop:2}}/>
              </div>
              {useCustom&&<span style={{color:C.accent,fontSize:16}}>✓</span>}
            </div>
          </div>
          {(selectedColor||useCustom)&&<button onClick={()=>{setSelectedColor(null);setUseCustom(false);}} style={{width:"100%",marginTop:8,background:"none",border:`1px solid ${C.border}`,borderRadius:50,padding:"8px",fontSize:12,color:C.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Clear wall color</button>}
        </div>
      )}

      {activeTab==="stage_products_placeholder"&&null}
      {activeTab==="style"&&(
        <div>
          <p style={{fontSize:12,color:C.muted,marginBottom:12}}>Choose a design style for your AI vision</p>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {STYLES.map(s=>{const active=selectedStyle===s.name;return(
              <button key={s.name} className="mrow" onClick={()=>setSelectedStyle(active?null:s.name)}
                style={{border:active?`2px solid ${C.accent}`:`1px solid ${C.border}`,borderRadius:11,padding:"10px 13px",cursor:"pointer",background:active?"rgba(196,80,58,.05)":"white",textAlign:"left",transition:"all .15s",fontFamily:"'DM Sans',sans-serif"}}>
                <div style={{display:"flex",alignItems:"center",gap:7}}><span style={{fontSize:13}}>{s.emoji}</span><span style={{fontWeight:600,fontSize:13,color:active?C.accent:C.text}}>{s.name}</span></div>
                <div style={{fontSize:11,color:C.muted,marginTop:2,paddingLeft:20}}>{s.desc}</div>
              </button>
            );})}
          </div>
        </div>
      )}

      {activeTab==="stage"&&(
        <div>
          {/* ── My Products (real store images) ── */}
          <div style={{marginBottom:14,padding:"12px 14px",background:"white",borderRadius:14,border:`1.5px dashed ${C.border}`}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:8}}>
              <div>
                <p style={{fontSize:13,fontWeight:600,color:C.text}}>📸 My Products</p>
                <p style={{fontSize:11,color:C.muted,marginTop:2}}>Upload saved images from IKEA, Wayfair, Amazon, etc.</p>
              </div>
              <label style={{background:C.accent,color:"white",borderRadius:50,padding:"6px 14px",fontSize:12,fontWeight:600,cursor:"pointer",flexShrink:0,fontFamily:"'DM Sans',sans-serif"}}>
                + Add
                <input type="file" accept="image/*" multiple style={{display:"none"}} onChange={e=>handleProductUpload(e.target.files)}/>
              </label>
            </div>
            {productImages.length>0?(
              <div style={{display:"flex",flexDirection:"column",gap:6}}>
                {productImages.map(prod=>(
                  <div key={prod.id} style={{display:"flex",alignItems:"center",gap:10,padding:"6px 10px",background:C.card,borderRadius:10,border:`1px solid ${C.border}`}}>
                    <img src={prod.src} alt={prod.name} style={{width:36,height:36,objectFit:"contain",borderRadius:6,background:"white",border:`1px solid ${C.border}`,flexShrink:0}}/>
                    <div style={{flex:1,minWidth:0}}>
                      <p style={{fontSize:12,fontWeight:500,color:C.text,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{prod.name}</p>
                      <p style={{fontSize:10,color:C.muted}}>On canvas · drag to position · ⤡ to resize</p>
                    </div>
                    <div style={{display:"flex",gap:5,flexShrink:0}}>
                      <button onClick={()=>toggleBlend(prod.id)} title="Toggle white background removal" style={{background:prod.blend==="multiply"?C.green:C.border,color:"white",border:"none",borderRadius:50,padding:"3px 8px",fontSize:9,fontWeight:700,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>BG {prod.blend==="multiply"?"ON":"OFF"}</button>
                      <button onClick={()=>removeProduct(prod.id)} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:50,width:22,height:22,fontSize:13,color:C.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>×</button>
                    </div>
                  </div>
                ))}
                <p style={{fontSize:10,color:C.muted,textAlign:"center",marginTop:2}}>BG ON removes white backgrounds (best for store photos)</p>
              </div>
            ):(
              <p style={{fontSize:12,color:C.muted,textAlign:"center",paddingTop:4}}>No products added yet</p>
            )}
          </div>

          <div style={{borderTop:`1px solid ${C.border}`,paddingTop:12,marginBottom:8}}>
            <p style={{fontSize:12,fontWeight:600,color:C.text,marginBottom:4}}>🛋 Emoji Furniture</p>
            <p style={{fontSize:11,color:C.muted,marginBottom:10}}>Tap + to place · drag to position · × to remove</p>
          </div>
          {placedItems.length>0&&<p style={{fontSize:11,color:C.accent,fontWeight:600,marginBottom:10}}>{placedItems.length} piece{placedItems.length!==1?"s":""} on canvas</p>}
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {FURNITURE.map(f=>{const placed=placedItems.filter(p=>p.name===f.name).length;return(
              <div key={f.name} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",background:"white",borderRadius:10,border:`1px solid ${C.border}`}}>
                <span style={{fontSize:22,flexShrink:0}}>{f.icon}</span>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontSize:13,fontWeight:500,color:C.text}}>{f.name}</div>
                  <div style={{fontSize:10,color:C.muted}}>{f.cat}{placed>0?` · ${placed} placed`:""}</div>
                </div>
                <button onClick={()=>addToCanvas(f)} className="ma" style={{background:C.accent,color:"white",border:"none",borderRadius:50,width:26,height:26,fontSize:18,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,lineHeight:1,transition:"background .2s"}}>+</button>
              </div>
            );})}
          </div>
        </div>
      )}

      {activeTab==="quick"&&(
        <div>
          <p style={{fontSize:12,color:C.muted,marginBottom:12}}>One-tap transforms — sets wall, style & furniture</p>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {QUICK_TRANSFORMS.map(qt=>(
              <button key={qt.name} className="mqt" onClick={()=>applyQuickTransform(qt)}
                style={{border:`1px solid ${C.border}`,borderRadius:14,padding:"12px 14px",cursor:"pointer",background:"white",textAlign:"left",transition:"all .2s",fontFamily:"'DM Sans',sans-serif"}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <span style={{fontSize:22}}>{qt.emoji}</span>
                  <div style={{flex:1}}><div style={{fontWeight:600,fontSize:14,color:C.text}}>{qt.name}</div><div style={{fontSize:11,color:C.muted,marginTop:2}}>{qt.desc}</div></div>
                  <div style={{width:16,height:16,borderRadius:"50%",background:WALL_COLORS.find(c=>c.name===qt.color)?.hex||"#ccc",border:"1px solid rgba(0,0,0,.1)",flexShrink:0}}/>
                </div>
                <div style={{marginTop:8,display:"flex",gap:5,flexWrap:"wrap"}}>
                  <span style={{background:"rgba(196,80,58,.08)",color:C.accent,borderRadius:50,padding:"2px 8px",fontSize:10,fontWeight:600}}>{qt.style}</span>
                  {qt.furniture.slice(0,3).map(f=><span key={f} style={{background:C.card,color:C.muted,borderRadius:50,padding:"2px 8px",fontSize:10}}>{f}</span>)}
                  {qt.furniture.length>3&&<span style={{color:C.muted,fontSize:10,lineHeight:"20px"}}>+{qt.furniture.length-3}</span>}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab==="saved"&&(
        <div>
          <p style={{fontSize:12,color:C.muted,marginBottom:12}}>Save up to 3 visions to compare directions</p>
          {savedVisions.length===0?(
            <div style={{textAlign:"center",padding:"32px 16px",background:"white",borderRadius:12,border:`1px dashed ${C.border}`}}>
              <p style={{fontFamily:"'Playfair Display',serif",fontSize:15,color:C.text,marginBottom:6}}>No saved visions yet</p>
              <p style={{fontSize:12,color:C.muted}}>Generate a vision and tap "Save Vision" to store it here</p>
            </div>
          ):(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {savedVisions.map(v=>(
                <div key={v.id} style={{border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden"}}>
                  <div style={{padding:"12px 14px",background:C.card,display:"flex",alignItems:"center",gap:10}}>
                    <div style={{flex:1}}>
                      <p style={{fontWeight:600,fontSize:13,color:C.text}}>{v.label}</p>
                      <p style={{fontSize:11,color:C.muted,marginTop:2}}>{[v.color?.name,v.style,v.furniture?.length?v.furniture.length+" items":null].filter(Boolean).join(" · ")||"No selections"}</p>
                    </div>
                    <div style={{display:"flex",gap:7}}>
                      <button onClick={()=>setViewingSaved(v)} style={{background:C.green,color:"white",border:"none",borderRadius:50,padding:"5px 12px",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>View</button>
                      <button onClick={()=>setSavedVisions(prev=>prev.filter(x=>x.id!==v.id))} style={{background:"none",border:`1px solid ${C.border}`,borderRadius:50,padding:"5px 10px",fontSize:12,color:C.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>✕</button>
                    </div>
                  </div>
                  <div style={{padding:"10px 14px",background:"white"}}><p style={{fontSize:12,color:C.muted,lineHeight:1.6}}>{v.text.replace(/\*\*/g,"").slice(0,110)}…</p></div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

function ActionButtons({isGenerating,loadingDot,generateVision,reset}){
  return(
    <div style={{marginTop:16}}>
      <button onClick={generateVision} disabled={isGenerating} className={isGenerating?"":"ma"}
        style={{width:"100%",background:isGenerating?C.muted:C.green,color:"white",border:"none",borderRadius:50,padding:"14px",fontSize:15,fontWeight:600,cursor:isGenerating?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"background .2s",fontFamily:"'DM Sans',sans-serif"}}>
        {isGenerating?<><span style={{display:"inline-block",animation:"spin 1s linear infinite"}}>⟳</span>Designing{".".repeat(loadingDot)}</>:<><span style={{fontSize:10}}>✦</span>Generate AI Vision</>}
      </button>
      <button onClick={reset} style={{width:"100%",background:"none",border:`1px solid ${C.border}`,borderRadius:50,padding:"11px",fontSize:13,color:C.muted,cursor:"pointer",marginTop:8,fontFamily:"'DM Sans',sans-serif"}}>Upload Different Photo</button>
    </div>
  );
}

function VisionCard({text,label,onRegenerate,extra,isMobile}){
  const parts=text.split(/(\*\*[^*]+\*\*)/g);
  return(
    <div style={{marginTop:20,background:C.green,borderRadius:18,padding:isMobile?"22px 20px":"30px 32px",animation:"fadeUp .5s ease both"}}>
      <p style={{color:"rgba(255,255,255,.5)",fontSize:11,letterSpacing:".18em",textTransform:"uppercase",marginBottom:18}}>— {label}</p>
      <div style={{fontFamily:"'Playfair Display',serif",fontSize:16,lineHeight:1.85,color:"rgba(255,255,255,.9)"}}>
        {parts.map((p,i)=>{
          if(p.startsWith("**")&&p.endsWith("**"))return<p key={i} style={{color:"#E8C5A0",fontWeight:600,fontSize:11,letterSpacing:".14em",textTransform:"uppercase",margin:i===0?"0 0 8px":"18px 0 8px",fontFamily:"'DM Sans',sans-serif"}}>{p.slice(2,-2)}</p>;
          if(!p.trim())return null;
          return<p key={i} style={{marginBottom:4}}>{p.trim()}</p>;
        })}
      </div>
      <div style={{marginTop:22,paddingTop:18,borderTop:"1px solid rgba(255,255,255,.12)",display:"flex",gap:10,flexWrap:"wrap"}}>
        {onRegenerate&&<button onClick={onRegenerate} className="ma" style={{background:C.accent,color:"white",border:"none",borderRadius:50,padding:"9px 20px",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Regenerate ⟳</button>}
        {extra}
      </div>
    </div>
  );
}

function HowItWorks({isMobile}){
  const steps=[{n:"01",title:"Upload your room",body:"Any photo — a phone snapshot is all you need."},{n:"02",title:"Choose your vision",body:"Repaint walls live, stage furniture on the image, or hit a Quick Transform preset."},{n:"03",title:"See it transformed",body:"Get instant previews and a cinematic AI design description of the finished space."}];
  return(
    <section style={{background:C.green,padding:isMobile?"48px 20px":"64px 48px"}}>
      <div style={{maxWidth:1140,margin:"0 auto",display:"grid",gridTemplateColumns:isMobile?"1fr":"repeat(3,1fr)",gap:isMobile?32:48}}>
        {steps.map(({n,title,body},i)=>(
          <div key={n} style={isMobile&&i<2?{borderBottom:"1px solid rgba(255,255,255,.1)",paddingBottom:28}:{}}>
            <p style={{color:C.accent,fontSize:13,fontWeight:700,marginBottom:12,letterSpacing:".05em"}}>{n}</p>
            <h3 style={{fontFamily:"'Playfair Display',serif",color:"white",fontSize:isMobile?20:22,marginBottom:10,fontWeight:400}}>{title}</h3>
            <p style={{color:"rgba(255,255,255,.55)",fontSize:15,lineHeight:1.75}}>{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function FeaturedStays({isMobile,isTablet}){
  const stays=[{title:"Loft in the Pines",location:"Big Sur, CA",type:"Loft",price:"$340/night",palette:["#8B9E8B","#D4C8B4"]},{title:"The Terracotta House",location:"Oaxaca, Mexico",type:"Villa",price:"$285/night",palette:["#C47355","#F0E0D0"]},{title:"Scandinavian Cabin",location:"Tromso, Norway",type:"Cabin",price:"$420/night",palette:["#B8C8D4","#E8EEF2"]},{title:"East Village Studio",location:"New York, NY",type:"Loft",price:"$190/night",palette:["#4A4440","#D4C8B4"]}];
  const px=isMobile?"20px":isTablet?"32px":"48px";
  return(
    <section style={{padding:`${isMobile?52:80}px ${px}`,background:C.bg}}>
      <div style={{maxWidth:1140,margin:"0 auto"}}>
        <div style={{display:"flex",alignItems:isMobile?"flex-start":"flex-end",justifyContent:"space-between",marginBottom:28,flexDirection:isMobile?"column":"row",gap:isMobile?14:0}}>
          <div>
            <p style={{color:C.accent,fontSize:11,fontWeight:600,letterSpacing:".18em",textTransform:"uppercase",marginBottom:10}}>— Featured Properties</p>
            <h2 style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?26:36,fontWeight:400}}>Homes designed to be remembered.</h2>
          </div>
          <button className="mg" style={{background:"none",border:`1.5px solid ${C.border}`,borderRadius:50,padding:"10px 20px",fontSize:14,fontWeight:500,color:C.text,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>View all →</button>
        </div>
        <div style={{display:"grid",gridTemplateColumns:isMobile?"1fr 1fr":isTablet?"1fr 1fr":"repeat(4,1fr)",gap:isMobile?12:20}}>
          {stays.map(({title,location,type,price,palette})=>(
            <div key={title} className="mcard" style={{borderRadius:16,overflow:"hidden",background:"white",border:`1px solid ${C.border}`,cursor:"pointer",transition:"transform .2s,box-shadow .2s"}}>
              <div style={{height:isMobile?120:165,background:`linear-gradient(135deg,${palette[0]} 0%,${palette[1]} 100%)`,position:"relative"}}>
                <span style={{position:"absolute",top:10,left:10,background:"rgba(255,255,255,.88)",borderRadius:50,padding:"3px 10px",fontSize:11,fontWeight:600,color:C.text}}>{type}</span>
              </div>
              <div style={{padding:isMobile?"10px 12px":"14px 16px"}}>
                <p style={{fontFamily:"'Playfair Display',serif",fontSize:isMobile?13:15,marginBottom:3,fontWeight:500}}>{title}</p>
                <p style={{fontSize:12,color:C.muted,marginBottom:10}}>{location}</p>
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <span style={{fontSize:isMobile?13:14,fontWeight:600}}>{price}</span>
                  <button className="ma" style={{background:C.accent,color:"white",border:"none",borderRadius:50,padding:"5px 12px",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer({isMobile}){
  return(
    <footer style={{background:C.text,padding:isMobile?"32px 20px":"40px 48px"}}>
      <div style={{maxWidth:1140,margin:"0 auto",display:"flex",alignItems:isMobile?"flex-start":"center",justifyContent:"space-between",flexDirection:isMobile?"column":"row",gap:isMobile?16:0}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:26,height:26,borderRadius:"50%",background:C.accent,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{color:"white",fontSize:11,fontWeight:700}}>M</span></div>
          <span style={{fontFamily:"'Playfair Display',serif",fontWeight:600,fontSize:16,letterSpacing:"-0.3px",color:"white"}}>md escapes</span>
        </div>
        {!isMobile&&<p style={{color:"rgba(255,255,255,.3)",fontSize:13}}>© 2026 MD Escapes. Private stays, designed slowly.</p>}
        <div style={{display:"flex",gap:20}}>{["Privacy","Terms","Contact"].map(l=><a key={l} href="#" style={{color:"rgba(255,255,255,.4)",fontSize:13,textDecoration:"none"}}>{l}</a>)}</div>
        {isMobile&&<p style={{color:"rgba(255,255,255,.25)",fontSize:12}}>© 2026 MD Escapes</p>}
      </div>
    </footer>
  );
}
