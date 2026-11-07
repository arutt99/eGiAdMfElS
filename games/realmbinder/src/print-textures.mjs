// Canvas printing plates: the same card data and complete 4:3 artwork as the binder.
import { cardArt } from '../art.mjs';
import { FACTIONS, KINDS, RARITIES } from '../data.mjs';
const W = 768;
const palette = { sylvan:'#547d60',deephold:'#9b7650',westmarch:'#607f99',horde:'#95584d',conclave:'#86719c',hearth:'#a28a54',wilds:'#7b8b90' };
function plate(h) { const canvas=document.createElement('canvas'); canvas.width=W; canvas.height=h; return [canvas,canvas.getContext('2d')]; }
function rect(c,x,y,w,h,r=0) { c.beginPath(); c.roundRect(x,y,w,h,r); }
function text(c,s,x,y,size,color='#e4d1a2',align='center',font='Georgia') {c.font=`${size}px ${font}`;c.fillStyle=color;c.textAlign=align;c.fillText(s,x,y);}
function lines(c,s,x,y,width,size,lineHeight,color,max=4) {
  c.font=`${size}px Georgia`;c.fillStyle=color;c.textAlign='center';let row='',rows=[];
  for(const word of s.split(' ')) { if(c.measureText(row+word).width>width && row){ rows.push(row.trim());row=''; } row+=word+' '; }
  if(row) rows.push(row.trim());rows=rows.slice(0,max);
  rows.forEach((r,i)=>c.fillText(r,x,y+(i-(rows.length-1)/2)*lineHeight));
}
function crown(c,x,y,s,color='#d7ba77') {
  c.save();c.translate(x,y);c.scale(s,s);c.strokeStyle=color;c.lineWidth=2;
  c.beginPath();c.moveTo(-28,-15);c.lineTo(-15,-4);c.lineTo(0,-25);c.lineTo(15,-4);c.lineTo(28,-15);c.lineTo(21,16);c.lineTo(-21,16);c.closePath();c.stroke();
  c.beginPath();c.moveTo(-19,8);c.lineTo(19,8);c.moveTo(-12,23);c.lineTo(12,23);c.stroke();c.restore();
}
async function artwork(card) {
  const img=new Image(); img.src=`data:image/svg+xml,${encodeURIComponent(cardArt(card))}`;
  await img.decode();return img;
}
function grain(c,h,amount=7000) {
  // Deterministic print grain, not animated noise.
  let seed=91;
  for(let i=0;i<amount;i++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=seed%W;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const y=seed%h;c.fillStyle=i%2?'#ffffff08':'#0000000a';c.fillRect(x,y,1,1);}
}
export async function packPlate(card, back=false) {
  const H=1229,[canvas,c]=plate(H);
  const grad=c.createLinearGradient(0,0,W,H);grad.addColorStop(0,'#3d5646');grad.addColorStop(.35,'#254535');grad.addColorStop(.65,'#183227');grad.addColorStop(1,'#40513b');c.fillStyle=grad;c.fillRect(0,0,W,H);
  for(let x=0;x<W;x+=8){c.fillStyle=`rgba(230,218,174,${.025+.02*Math.sin(x*.17)})`;c.fillRect(x,0,2,H);}
  c.strokeStyle='#bea267';c.lineWidth=2;rect(c,32,106,W-64,H-212,5);c.stroke();rect(c,43,117,W-86,H-234,3);c.strokeStyle='#bea26760';c.stroke();
  if(back) {
    crown(c,W/2,280,2);text(c,'THE SUNDERED CROWN',W/2,445,37);lines(c,'Six factions. A fractured kingdom. A collection waiting to be discovered.',W/2,570,520,29,43,'#d0ceb5');
    text(c,'10 COLLECTIBLE CARDS',W/2,755,23);text(c,'FIRST EDITION · SET 01',W/2,800,20,'#a7b198');
    for(let x=0;x<300;x+=5){c.fillStyle=x%3?'#e3d8b6':'#b6ab8a';c.fillRect(234+x,910,x%4?2:4,68);}
    text(c,'REALMBINDER',W/2,1030,23);
  } else {
    text(c,'REALMBINDER',W/2,190,53);
    text(c,'FIRST EDITION',W/2,235,17,'#c3c6aa');
    const art=await artwork(card);c.drawImage(art,70,320,628,471);
    c.strokeStyle='#c5ad6d';c.lineWidth=3;c.strokeRect(70,320,628,471);
    crown(c,W/2,280,.65);text(c,'THE SUNDERED',W/2,890,52);text(c,'CROWN',W/2,950,60);
    text(c,'10 CARDS  ·  SET 01',W/2,1060,21,'#ccd0b5');
  }
  for(const y of [0,H-74]){
    c.fillStyle='#a48b53';c.fillRect(0,y,W,74);
    for(let x=0;x<W;x+=7){const g=c.createLinearGradient(x,0,x+7,0);g.addColorStop(0,'#80704c');g.addColorStop(.45,'#d5c18b');g.addColorStop(1,'#97814e');c.fillStyle=g;c.fillRect(x,y,7,74);}
    c.fillStyle='#1b2c2180';c.fillRect(0,y+(y===0?64:4),W,2);
  }
  grain(c,H);return canvas;
}
export async function cardPlate(card,copy) {
  const H=1073,[canvas,c]=plate(H);const frame=copy.gilded?'#d2ac58':palette[card.faction];
  const g=c.createLinearGradient(0,0,W,H);g.addColorStop(0,'#e1cf96');g.addColorStop(.24,frame);g.addColorStop(.7,'#263b2c');g.addColorStop(1,'#b6a577');c.fillStyle=g;c.fillRect(0,0,W,H);
  rect(c,22,22,W-44,H-44,12);c.fillStyle='#1b2b22';c.fill();c.strokeStyle='#b5ab77';c.lineWidth=2;c.stroke();
  c.fillStyle=copy.gilded?'#d8be7f':'#dfd8bb';c.fillRect(24,24,W-48,120);
  c.font='bold 37px Georgia';c.textAlign='left';c.fillStyle='#223329';
  // Keep every title readable without clipping the cost medallion.
  const words=card.name.split(' ');let first='';while(words.length && c.measureText(first+words[0]).width<580)first+=words.shift()+' ';
  c.fillText(first.trim(),45,words.length?73:96);if(words.length)c.fillText(words.join(' '),45,116);
  c.beginPath();c.arc(693,82,28,0,Math.PI*2);c.fillStyle='#344d3b';c.fill();c.strokeStyle='#af9357';c.stroke();text(c,String(card.cost),693,94,31,'#eee1b8');
  const img=await artwork(card);c.drawImage(img,24,145,720,540);
  c.fillStyle='#ac996d';c.fillRect(24,684,720,2);c.fillStyle='#344333';c.fillRect(24,686,720,60);
  text(c,`${KINDS[card.kind]} · ${FACTIONS[card.faction].short}`,46,724,22,'#ddd2af','left','system-ui');
  c.save();c.translate(710,716);c.rotate(Math.PI/4);c.fillStyle=RARITIES[card.rarity].color;c.fillRect(-8,-8,16,16);c.restore();
  lines(c,card.flavor,W/2,864,625,30,41,'#d5d1b8');
  text(c,`SC · ${String(card.num).padStart(3,'0')}/130`,46,1026,19,'#b0b59c','left','system-ui');
  if(card.might!=null)text(c,String(card.might),708,1026,28,'#e7d3a0','right');
  if(copy.foil||copy.gilded)text(c,copy.gilded?'GILDED':'FOIL',W/2,1026,16,'#dec386');
  grain(c,H,5000);return canvas;
}
export function backPlate() {
  const H=1073,[canvas,c]=plate(H);c.fillStyle='#18362b';c.fillRect(0,0,W,H);
  for(let i=-H;i<W;i+=27){c.beginPath();c.moveTo(i,0);c.lineTo(i+H,H);c.strokeStyle='#c9b87910';c.lineWidth=1;c.stroke();}
  for(const inset of [22,32,47,59]){rect(c,inset,inset,W-inset*2,H-inset*2,16);c.strokeStyle=inset===32?'#d2bb78':'#ab975c70';c.lineWidth=inset===32?3:1;c.stroke();}
  for(const r of [230,211,185]){c.beginPath();c.arc(W/2,H*.45,r,0,Math.PI*2);c.strokeStyle='#c9b478a0';c.lineWidth=1.5;c.stroke();}
  for(let i=0;i<40;i++){const a=i/40*Math.PI*2;c.save();c.translate(W/2+Math.cos(a)*222,H*.45+Math.sin(a)*222);c.rotate(a);c.fillStyle='#c9b478';c.fillRect(-2,-2,4,4);c.restore();}
  crown(c,W/2,H*.45,4);text(c,'REALMBINDER',W/2,825,45);text(c,'THE SUNDERED CROWN',W/2,875,19,'#adb99a');grain(c,H,5000);return canvas;
}
export function foilBump() {
  const [canvas,c]=plate(1229);c.fillStyle='#808080';c.fillRect(0,0,W,1229);
  for(let x=0;x<W;x+=3){c.fillStyle=`rgb(${128+Math.round(Math.sin(x*.16)*13)},${128+Math.round(Math.sin(x*.16)*13)},${128+Math.round(Math.sin(x*.16)*13)})`;c.fillRect(x,0,1,1229);}
  for(const y of [0,1155])for(let x=0;x<W;x+=7){c.fillStyle='#b8b8b8';c.fillRect(x,y,2,74);c.fillStyle='#555';c.fillRect(x+3,y,2,74);}
  return canvas;
}
