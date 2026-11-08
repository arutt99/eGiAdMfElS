import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { packPlate, cardPlate, backPlate, foilBump } from './print-textures.mjs';

const clamp=THREE.MathUtils.clamp, ease=t=>t*t*(3-2*t), out=t=>1-(1-t)**3;
const PW=2.3,PH=3.68,CW=2.2,CH=CW*88/63;

export async function createOpener3D(host, { feature, getStage, onTear, onFallback }) {
  let renderer;
  try { renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,powerPreference:'low-power'}); }
  catch { return null; }
  const resources=new Set(), track=v=>(resources.add(v),v);
  let disposed=false, frame=0, tween=null, mode='sealed', card=null, cardMap=null, foilMaterial=null;
  let drag=null, dragAmount=0, lastTime=0, gestureConsumed=false, faceUp=false, preview=null;
  const inspect={x:0,y:0};
  const canvas=renderer.domElement;
  canvas.setAttribute('aria-hidden','true');host.appendChild(canvas);
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));
  renderer.setClearColor(0x000000,0);
  renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
  renderer.shadowMap.enabled=false;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  try {
  const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,100), root=new THREE.Group();scene.add(root);
  const pmrem=new THREE.PMREMGenerator(renderer), room=new RoomEnvironment();
  const environment=track(pmrem.fromScene(room,.06));scene.environment=environment.texture;
  scene.environmentIntensity=.55;room.dispose();pmrem.dispose();
  const key=new THREE.DirectionalLight(0xffe2ad,1.8);key.position.set(-3,5,5);key.castShadow=false;key.shadow.mapSize.set(1024,1024);key.shadow.radius=4;key.shadow.normalBias=.025;key.shadow.camera.left=-5;key.shadow.camera.right=5;key.shadow.camera.top=5;key.shadow.camera.bottom=-5;scene.add(key);
  const fill=new THREE.DirectionalLight(0xc9e7de,.85);fill.position.set(4,1,2);scene.add(fill);
  const rim=new THREE.DirectionalLight(0xffda91,1.5);rim.position.set(-2,3,-3);scene.add(rim);
  scene.add(new THREE.HemisphereLight(0xe4ead9,0x18261b,.6));
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=64;
  const sc=shadowCanvas.getContext('2d'),sg=sc.createRadialGradient(64,32,1,64,32,62);
  sg.addColorStop(0,'#00000090');sg.addColorStop(.4,'#00000050');sg.addColorStop(1,'#00000000');sc.fillStyle=sg;sc.fillRect(0,0,128,64);
  const shadowTexture=track(new THREE.CanvasTexture(shadowCanvas));
  const shadowMaterial=track(new THREE.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false,opacity:.5}));
  const floor=new THREE.Mesh(track(new THREE.PlaneGeometry(3.7,.6)),shadowMaterial);
  floor.position.set(0,-2.0,-.35);root.add(floor);
  function texture(plate) {const t=track(new THREE.CanvasTexture(plate));t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(renderer.capabilities.getMaxAnisotropy(),4);return t;}
  const backTexture=texture(backPlate());
  // The pouch has a curved, pinched cross-section, not a flat plane with a pack image.
  const pack=new THREE.Group();root.add(pack);pack.rotation.set(-.045,-.18,-.045);
  const top=new THREE.Group();pack.add(top);
  const body=new THREE.Group();pack.add(body);
  const frontTexture=texture(await packPlate(feature));
  const rearTexture=texture(await packPlate(feature,true));
  const bump=track(new THREE.CanvasTexture(foilBump()));
  const wrapperMaterial=map=>track(new THREE.MeshPhysicalMaterial({map,bumpMap:bump,bumpScale:.012,metalness:.48,roughness:.4,clearcoat:.55,clearcoatRoughness:.3,side:THREE.DoubleSide,envMapIntensity:.6}));
  const frontMat=wrapperMaterial(frontTexture),rearMat=wrapperMaterial(rearTexture);
  const membranes=[];
  function pouchSection(y0,y1,isTop,back=false) {
    const geo=track(new THREE.PlaneGeometry(PW,y1-y0,48,isTop?8:54));
    const pos=geo.attributes.position,uv=geo.attributes.uv;
    for(let i=0;i<pos.count;i++) {
      const x=pos.getX(i), y=pos.getY(i)+(y0+y1)/2;
      // Both cut edges share an irregular tear line.
      const cut=PH/2-.25, seam=Math.abs(y-cut)<.0001;
      const jitter=Math.sin(x*67)*.013+Math.sin(x*37)*.008;
      const xx=x/(PW/2), yy=y/(PH/2);
      const bulge=.11*Math.max(0,1-xx**6)*Math.max(.2,1-Math.abs(yy)**8);
      const crease=(Math.sin(x*47+y*4)*.012+Math.sin(x*23-y*7)*.009)*Math.abs(xx)**3;
      pos.setXYZ(i,x,y+(seam?jitter:0),(back?-1:1)*(bulge+crease+.014));
      uv.setXY(i,back?.5-x/PW:.5+x/PW,.5+y/PH);
    }
    geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,back?rearMat:frontMat);mesh.castShadow=true;mesh.receiveShadow=true;(isTop?top:body).add(mesh);
    membranes.push({geo,base:pos.array.slice(),isTop,back});return mesh;
  }
  const cut=PH/2-.25;
  pouchSection(-PH/2,cut,false);pouchSection(-PH/2,cut,false,true);
  pouchSection(cut,PH/2,true);pouchSection(cut,PH/2,true,true);
  // A visible golden tear notch and stitched-looking side seals.
  const seamMat=track(new THREE.MeshStandardMaterial({color:0xb6a16c,metalness:.7,roughness:.38}));
  const sideGeo=track(new THREE.BoxGeometry(.025,PH-.12,.038));
  for(const x of [-PW/2,PW/2]){const seam=new THREE.Mesh(sideGeo,seamMat);seam.position.x=x;body.add(seam);}
  const notch=new THREE.Mesh(track(new THREE.ConeGeometry(.045,.1,3)),seamMat);notch.position.set(-PW/2,cut+.05,.035);notch.rotation.z=-Math.PI/2;pack.add(notch);

  function shape() {
    const s=new THREE.Shape(),x=-CW/2,y=-CH/2,r=.055,w=CW,h=CH;
    s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;
  }
  const cardShape=shape(),faceGeo=track(new THREE.ShapeGeometry(cardShape,16));
  const uv=faceGeo.attributes.uv,pos=faceGeo.attributes.position;
  for(let i=0;i<pos.count;i++)uv.setXY(i,(pos.getX(i)+CW/2)/CW,(pos.getY(i)+CH/2)/CH);
  const edgeGeo=track(new THREE.ExtrudeGeometry(cardShape,{depth:.017,steps:1,bevelEnabled:true,bevelSegments:2,bevelSize:.003,bevelThickness:.003,curveSegments:12}));
  const edgeMat=track(new THREE.MeshStandardMaterial({color:0xc9c5a9,roughness:.8}));
  const backMat=track(new THREE.MeshPhysicalMaterial({map:backTexture,roughness:.65,clearcoat:.18,clearcoatRoughness:.55,metalness:.02,envMapIntensity:.3}));
  const deck=new THREE.Group();root.add(deck);deck.rotation.y=Math.PI+.05;
  const stack=new THREE.Group();deck.add(stack);stack.visible=false;
  const backs=[];
  function cardboard(frontMat=backMat) {
    const group=new THREE.Group();
    const edge=new THREE.Mesh(edgeGeo,edgeMat);edge.position.z=-.009;group.add(edge);edge.castShadow=true;
    const f=new THREE.Mesh(faceGeo,frontMat);f.position.z=.013;f.castShadow=true;group.add(f);
    const b=new THREE.Mesh(faceGeo,backMat);b.position.z=-.013;b.rotation.y=Math.PI;group.add(b);return group;
  }
  for(let i=0;i<9;i++){const b=cardboard();b.position.set((i+1)*.014,-(i+1)*.012,-(i+1)*.025);b.rotation.z=-(i+1)*.003;stack.add(b);backs.push(b);}
  function releaseCard() {
    if(card){deck.remove(card);card=null;}
    if(cardMap){cardMap.dispose();resources.delete(cardMap);cardMap=null;}
    if(foilMaterial){foilMaterial.dispose();resources.delete(foilMaterial);foilMaterial=null;}
  }
  async function printedFace(data,copy) {
    const plate=await cardPlate(data,copy);if(disposed)return null;
    const map=texture(plate), material=track(new THREE.MeshPhysicalMaterial({map,roughness:copy.foil ? .43 : .65,metalness:copy.gilded ? .55 : copy.foil ? .22 : .01,clearcoat:copy.foil ? .18 : 0,clearcoatRoughness:.55,envMapIntensity:copy.foil ? .3 : .12,color:0xdddddd,iridescence:copy.foil ? .65 : 0,iridescenceIOR:1.4,iridescenceThicknessRange:[120,400]}));
    return {uid:copy.uid,map,material};
  }
  function resize() {
    if(disposed)return;
    const r=host.getBoundingClientRect(), stage=getStage()?.getBoundingClientRect();
    if(!stage||!r.width||!r.height)return;
    renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;
    // Fit to the semantic stage; never measure a mesh while rotating it.
    const worldHeight=r.height/Math.max(stage.height,80)*(mode==='sealed'||mode==='opening'?4.2:3.45);
    camera.position.z=worldHeight/(2*Math.tan(THREE.MathUtils.degToRad(16)));
    camera.updateProjectionMatrix();root.position.set((stage.x+stage.width/2-r.x-r.width/2)*worldHeight/r.height,-(stage.y+stage.height/2-r.y-r.height/2)*worldHeight/r.height,0);
    renderer.render(scene,camera);
  }
  const observer=new ResizeObserver(resize);observer.observe(host);
  function animate(ms,update) {
    if(disposed)return Promise.resolve(false);
    if(tween)tween.resolve(false);
    return new Promise(resolve=>{tween={start:performance.now(),duration:ms,update,resolve};update(0);requestFrame();});
  }
  function requestFrame(){if(!frame&&!disposed&&!document.hidden)frame=requestAnimationFrame(tick);}
  function tick(now) {
    frame=0;if(disposed)return;
    if(tween){const t=clamp((now-tween.start)/tween.duration,0,1);const current=tween;current.update(t);if(t===1&&tween===current){tween=null;current.resolve(true);}}
    let inspecting=false;
    if (faceUp && card && !tween) {
      const dt=Math.min(.04,Math.max(.008,(now-lastTime)/1000));
      card.rotation.x=THREE.MathUtils.damp(card.rotation.x,-.035+inspect.y,14,dt);
      card.rotation.y=THREE.MathUtils.damp(card.rotation.y,inspect.x,14,dt);
      inspecting=Math.abs(card.rotation.x+.035-inspect.y)+Math.abs(card.rotation.y-inspect.x)>.0001;
    }
    if(drag){pack.rotation.y=THREE.MathUtils.damp(pack.rotation.y,-.18+dragAmount*.23,12,Math.min(.04,(now-lastTime)/1000));}
    lastTime=now;renderer.render(scene,camera);if(tween||drag||inspecting)requestFrame();
  }
  function deform(amount) {
    for(const part of membranes){if(part.isTop)continue;const a=part.geo.attributes.position;
      for(let i=0;i<a.count;i++){const x=part.base[i*3],y=part.base[i*3+1],z=part.base[i*3+2];const mouth=clamp((y-cut+.55)/.55,0,1);a.setZ(i,z+(part.back?-1:1)*mouth*amount*(.08+.08*Math.cos(x*4)));}
      part.geo.computeVertexNormals();a.needsUpdate=true;
    }
  }
  function setDrag(value) {
    dragAmount=value;top.rotation.z=-value*.12;top.position.set(value*.1,value*.04,value*.08);deform(value*.35);requestFrame();
  }
  function down(e) {
    if(e.button>0 || e.target.closest('button'))return;
    if(faceUp && !tween) {
      const r=getStage().getBoundingClientRect();
      if(e.clientX>=r.left && e.clientX<=r.right && e.clientY>=r.top && e.clientY<=r.bottom) {
        drag={x:e.clientX,y:e.clientY,id:e.pointerId,kind:'card'};dragAmount=0;
      }
      return;
    }
    if(mode!=='sealed')return;
    const r=getStage().getBoundingClientRect();
    if(e.clientY<r.top || e.clientY>r.top+r.height*.42 || e.clientX<r.left ||e.clientX>r.right)return;
    drag={x:e.clientX,y:e.clientY,id:e.pointerId};setDrag(0);
  }
  function move(e) {
    if(drag && Math.hypot(e.clientX-drag.x,e.clientY-drag.y)>8 && !eventRoot.hasPointerCapture?.(e.pointerId)) eventRoot.setPointerCapture?.(e.pointerId);
    if(drag?.kind==='card') {
      dragAmount=Math.max(dragAmount,Math.abs(e.clientX-drag.x)/100,Math.abs(e.clientY-drag.y)/100);
      inspect.x=clamp((e.clientX-drag.x)/500,-.15,.15);inspect.y=clamp((e.clientY-drag.y)/500,-.12,.12);requestFrame();
    } else if(drag) setDrag(clamp(Math.abs(e.clientX-drag.x)/Math.min(170,innerWidth*.38),0,1));
  }
  function up(e) {
    if(!drag||drag.id!==e.pointerId)return;
    if(drag.kind==='card') { gestureConsumed=dragAmount>.08;drag=null;inspect.x=0;inspect.y=0;requestFrame();return; }
    const committed=dragAmount>.6;gestureConsumed=dragAmount>.08;drag=null;
    if(eventRoot.hasPointerCapture?.(e.pointerId))eventRoot.releasePointerCapture(e.pointerId);
    if(committed)onTear();else animate(220,t=>{setDrag(dragAmount*(1-ease(t)));pack.rotation.y=-.18;});
  }
  const eventRoot=host.parentElement;
  eventRoot.addEventListener('pointerdown',down);eventRoot.addEventListener('pointermove',move);eventRoot.addEventListener('pointerup',up);
  const cancel=()=>{drag=null;inspect.x=0;inspect.y=0;setDrag(0);};eventRoot.addEventListener('pointercancel',cancel);
  const contextLost=e=>{e.preventDefault();if(!disposed)onFallback();};canvas.addEventListener('webglcontextlost',contextLost);
  const visibility=()=>{if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;}else{resize();requestFrame();}};document.addEventListener('visibilitychange',visibility);
  resize();renderer.render(scene,camera);

  return {
    consumeGesture(){const v=gestureConsumed;gestureConsumed=false;return v;},
    resize,
    async tear() {
      if(disposed)return false;mode='opening';drag=null;
      const start=top.position.clone(),rotation=top.rotation.z;
      const ok=await animate(1650,t=>{
        const rip=ease(clamp(t/.45,0,1)),fall=out(clamp((t-.45)/.55,0,1));
        top.position.set(start.x+rip*.7+fall*2.4,start.y+rip*.42-fall*2.2,rip*.25+fall*.55);
        top.rotation.set(-rip*.3,fall*1.8,rotation-rip*.32-fall*1.2);deform(rip);
        pack.rotation.y=-.18+rip*.1;body.position.set(fall*.7,-fall*4.8,fall*.2);body.rotation.z=fall*.24;
        stack.visible=t>.35;stack.position.set(0,-.65+(out(clamp((t-.35)/.65,0,1))*.65),.05);stack.rotation.x=.02*(1-fall);
      });
      if(ok){pack.visible=false;mode='cards';}return ok;
    },
    async deal(data,copy,left,turned=false,next=null) {
      if(disposed)return false;mode='cards';faceUp=false;inspect.x=0;inspect.y=0;releaseCard();
      const printed=preview?.uid===copy.uid ? preview : await printedFace(data,copy);
      if(!printed||disposed)return false;
      preview=null;cardMap=printed.map;foilMaterial=printed.material;
      card=cardboard(foilMaterial);deck.add(card);card.rotation.set(-.035,0,-.018);card.position.set(-.08,-.08,.22);
      deck.rotation.set(0,turned ? Math.PI*2 : Math.PI+.05,0);deck.position.set(0,0,0);
      pack.visible=false;stack.visible=left>0;backs.forEach((b,i)=>b.visible=i<left);
      // The next front is printed beneath the top card before it slides away.
      // Only two fronts are kept in GPU memory; no card back flashes between reveals.
      if(next) {
        preview=await printedFace(next.card,next.copy);if(!preview||disposed)return false;
        backs[0].children[1].material=preview.material;
      }
      resize();
      const complete=await animate(240,t=>{const e=out(t);card.position.set(-.08*(1-e),-.08*(1-e),.22);card.rotation.z=-.018*(1-e);});
      if(complete)faceUp=turned;return complete;
    },
    async flip() {
      if(!card||disposed)return false;
      // Turn the complete stack together exactly once, including its edges and backs.
      const complete=await animate(750,t=>{
        const e=ease(t),lift=Math.sin(t*Math.PI);
        deck.rotation.set(lift*.09,Math.PI+.05+e*(Math.PI-.05),-lift*.025);
        deck.position.set(-lift*.08,lift*.08,lift*.48);shadowMaterial.opacity=.5-lift*.15;
      });
      if(complete)faceUp=true;return complete;
    },
    next() {
      faceUp=false;drag=null;
      if(!card||disposed)return Promise.resolve(false);const target=card;
      return animate(430,t=>{const e=t*t;target.position.set(e*4.8,-e*1.7,.22+Math.sin(t*Math.PI)*.5);target.rotation.z=-e*.4;target.rotation.y=e*.5;});
    },
    dispose() {
      if(disposed)return;disposed=true;if(frame)cancelAnimationFrame(frame);if(tween){tween.resolve(false);tween=null;}
      observer.disconnect();eventRoot.removeEventListener('pointerdown',down);eventRoot.removeEventListener('pointermove',move);eventRoot.removeEventListener('pointerup',up);eventRoot.removeEventListener('pointercancel',cancel);document.removeEventListener('visibilitychange',visibility);canvas.removeEventListener('webglcontextlost',contextLost);
      for(const r of resources)r.dispose();resources.clear();key.shadow.dispose();renderer.dispose();renderer.forceContextLoss();canvas.remove();
    },
  };
  } catch {
    // Initialization failures release partial GPU resources before the app uses simple mode.
    for(const r of resources)r.dispose();resources.clear();
    renderer.dispose();renderer.forceContextLoss();canvas.remove();
    return null;
  }
}
