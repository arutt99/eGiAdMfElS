var Kc=0,ml=1,Qc=2;var sr=1,Pa=2,is=3,oi=0,Be=1,an=2,bi=0,ss=1,gl=2,_l=3,xl=4,jc=5;var wi=100,th=101,eh=102,nh=103,ih=104,sh=200,rh=201,ah=202,oh=203,yl=204,vl=205,lh=206,ch=207,hh=208,uh=209,dh=210,fh=211,ph=212,mh=213,gh=214,Jr=0,Kr=1,Qr=2,Xi=3,jr=4,ta=5,ea=6,na=7,Da=0,_h=1,xh=2,Rn=0,Ml=1,Sl=2,bl=3,rr=4,wl=5,Tl=6,El=7;var Al=300,Ti=301,rs=302,Na=303,Ua=304,ia=1e3,vn=1001,sa=1002,De=1003,yh=1004;var ar=1005;var Ye=1006,Fa=1007;var Vn=1008;var Ke=1009,Cl=1010,Rl=1011,as=1012,Oa=1013,mn=1014,on=1015,gn=1016,Ba=1017,ka=1018,Ei=1020,Ll=35902,Il=35899,Pl=1021,Dl=1022,_n=1023,$n=1026,Wn=1027,za=1028,$a=1029,li=1030,Ga=1031;var Ha=1033,or=33776,lr=33777,cr=33778,hr=33779,Va=35840,Wa=35841,Xa=35842,qa=35843,Za=36196,Ya=37492,Ja=37496,Ka=37488,Qa=37489,ur=37490,ja=37491,to=37808,eo=37809,no=37810,io=37811,so=37812,ro=37813,ao=37814,oo=37815,lo=37816,co=37817,ho=37818,uo=37819,fo=37820,po=37821,mo=36492,go=36494,_o=36495,xo=36283,yo=36284,dr=36285,vo=36286;var Es=2300,ra=2301,Zr=2302,il=2303,sl=2400,rl=2401,al=2402;var vh=3200;var fr=0,Mh=1,Xn="",He="srgb",As="srgb-linear",Cs="linear",ue="srgb";var Yr=7680;var Sh=519,bh=512,wh=513,Th=514,Nl=515,Eh=516,Ah=517,Ul=518,Fl=519,Ch=35044;var Ol="300 es",rn=2e3,qi=2001;function Fu(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Ou(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}function Rs(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Rh(){let i=Rs("canvas");return i.style.display="block",i}var yc={},Zi=null;function Bl(...i){let t="THREE."+i.shift();Zi?Zi("log",t,...i):console.log(t,...i)}function Lh(i){let t=i[0];if(typeof t=="string"&&t.startsWith("TSL:")){let e=i[1];e&&e.isStackTrace?i[0]+=" "+e.getLocation():i[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return i}function zt(...i){i=Lh(i);let t="THREE."+i.shift();if(Zi)Zi("warn",t,...i);else{let e=i[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...i)}}function Gt(...i){i=Lh(i);let t="THREE."+i.shift();if(Zi)Zi("error",t,...i);else{let e=i[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...i)}}function gi(...i){let t=i.join(" ");t in yc||(yc[t]=!0,zt(...i))}function Ih(i,t,e){return new Promise(function(n,s){function a(){switch(i.clientWaitSync(t,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:s();break;case i.TIMEOUT_EXPIRED:setTimeout(a,e);break;default:n()}}setTimeout(a,e)})}var Ph={[Jr]:Jr,[Qr]:ea,[jr]:jr,[Xi]:ta,[Kr]:Kr,[ea]:Qr,[na]:na,[ta]:Xi},Sn=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){let n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){let n=this._listeners;if(n===void 0)return;let s=n[t];if(s!==void 0){let a=s.indexOf(e);a!==-1&&s.splice(a,1)}}dispatchEvent(t){let e=this._listeners;if(e===void 0)return;let n=e[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let a=0,r=s.length;a<r;a++)s[a].call(this,t);t.target=null}}},$e=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],vc=1234567,Ss=Math.PI/180,Yi=180/Math.PI;function Ai(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return($e[i&255]+$e[i>>8&255]+$e[i>>16&255]+$e[i>>24&255]+"-"+$e[t&255]+$e[t>>8&255]+"-"+$e[t>>16&15|64]+$e[t>>24&255]+"-"+$e[e&63|128]+$e[e>>8&255]+"-"+$e[e>>16&255]+$e[e>>24&255]+$e[n&255]+$e[n>>8&255]+$e[n>>16&255]+$e[n>>24&255]).toLowerCase()}function te(i,t,e){return Math.max(t,Math.min(e,i))}function kl(i,t){return(i%t+t)%t}function Bu(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function ku(i,t,e){return i!==t?(e-i)/(t-i):0}function bs(i,t,e){return(1-e)*i+e*t}function zu(i,t,e,n){return bs(i,t,1-Math.exp(-e*n))}function $u(i,t=1){return t-Math.abs(kl(i,t*2)-t)}function Gu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Hu(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Vu(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Wu(i,t){return i+Math.random()*(t-i)}function Xu(i){return i*(.5-Math.random())}function qu(i){i!==void 0&&(vc=i);let t=vc+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Zu(i){return i*Ss}function Yu(i){return i*Yi}function Ju(i){return i>0&&Number.isInteger(i)&&2**Math.round(Math.log2(i))===i}function Ku(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function zl(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Qu(i,t,e,n,s){let a=Math.cos,r=Math.sin,o=a(e/2),l=r(e/2),c=a((t+n)/2),h=r((t+n)/2),u=a((t-n)/2),d=r((t-n)/2),f=a((n-t)/2),_=r((n-t)/2);switch(s){case"XYX":i.set(o*h,l*u,l*d,o*c);break;case"YZY":i.set(l*d,o*h,l*u,o*c);break;case"ZXZ":i.set(l*u,l*d,o*h,o*c);break;case"XZX":i.set(o*h,l*_,l*f,o*c);break;case"YXY":i.set(l*f,o*h,l*_,o*c);break;case"ZYZ":i.set(l*_,l*f,o*h,o*c);break;default:zt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function $l(i){switch(i.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Dh(i,t){if(t.constructor===Float32Array)return i;let e=$l(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(i/e,-1)}function Nh(i,t){if(t.constructor===Float32Array)return i;let e=$l(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(i*e)}var Ci={DEG2RAD:Ss,RAD2DEG:Yi,generateUUID:Ai,clamp:te,euclideanModulo:kl,mapLinear:Bu,inverseLerp:ku,lerp:bs,damp:zu,pingpong:$u,smoothstep:Gu,smootherstep:Hu,randInt:Vu,randFloat:Wu,randFloatSpread:Xu,seededRandom:qu,degToRad:Zu,radToDeg:Yu,isPowerOfTwo:Ju,ceilPowerOfTwo:Ku,floorPowerOfTwo:zl,setQuaternionFromProperEuler:Qu,normalize:Nh,denormalize:Dh},Mt=class{static{this.prototype.isVector2=!0}constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),a=this.x-t.x,r=this.y-t.y;return this.x=a*n-r*s+t.x,this.y=a*s+r*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},bn=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,a,r,o){let l=n[s+0],c=n[s+1],h=n[s+2],u=n[s+3],d=a[r+0],f=a[r+1],_=a[r+2],x=a[r+3];if(u!==x||l!==d||c!==f||h!==_){let p=l*d+c*f+h*_+u*x;p<0&&(d=-d,f=-f,_=-_,x=-x,p=-p);let m=1-o;if(p<.9995){let M=Math.acos(p),w=Math.sin(M);m=Math.sin(m*M)/w,o=Math.sin(o*M)/w,l=l*m+d*o,c=c*m+f*o,h=h*m+_*o,u=u*m+x*o}else{l=l*m+d*o,c=c*m+f*o,h=h*m+_*o,u=u*m+x*o;let M=1/Math.sqrt(l*l+c*c+h*h+u*u);l*=M,c*=M,h*=M,u*=M}}t[e]=l,t[e+1]=c,t[e+2]=h,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,s,a,r){let o=n[s],l=n[s+1],c=n[s+2],h=n[s+3],u=a[r],d=a[r+1],f=a[r+2],_=a[r+3];return t[e]=o*_+h*u+l*f-c*d,t[e+1]=l*_+h*d+c*u-o*f,t[e+2]=c*_+h*f+o*d-l*u,t[e+3]=h*_-o*u-l*d-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,a=t._z,r=t._order,o=Math.cos,l=Math.sin,c=o(n/2),h=o(s/2),u=o(a/2),d=l(n/2),f=l(s/2),_=l(a/2);switch(r){case"XYZ":this._x=d*h*u+c*f*_,this._y=c*f*u-d*h*_,this._z=c*h*_+d*f*u,this._w=c*h*u-d*f*_;break;case"YXZ":this._x=d*h*u+c*f*_,this._y=c*f*u-d*h*_,this._z=c*h*_-d*f*u,this._w=c*h*u+d*f*_;break;case"ZXY":this._x=d*h*u-c*f*_,this._y=c*f*u+d*h*_,this._z=c*h*_+d*f*u,this._w=c*h*u-d*f*_;break;case"ZYX":this._x=d*h*u-c*f*_,this._y=c*f*u+d*h*_,this._z=c*h*_-d*f*u,this._w=c*h*u+d*f*_;break;case"YZX":this._x=d*h*u+c*f*_,this._y=c*f*u+d*h*_,this._z=c*h*_-d*f*u,this._w=c*h*u-d*f*_;break;case"XZY":this._x=d*h*u-c*f*_,this._y=c*f*u-d*h*_,this._z=c*h*_+d*f*u,this._w=c*h*u+d*f*_;break;default:zt("Quaternion: .setFromEuler() encountered an unknown order: "+r)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],a=e[8],r=e[1],o=e[5],l=e[9],c=e[2],h=e[6],u=e[10],d=n+o+u;if(d>0){let f=.5/Math.sqrt(d+1);this._w=.25/f,this._x=(h-l)*f,this._y=(a-c)*f,this._z=(r-s)*f}else if(n>o&&n>u){let f=2*Math.sqrt(1+n-o-u);this._w=(h-l)/f,this._x=.25*f,this._y=(s+r)/f,this._z=(a+c)/f}else if(o>u){let f=2*Math.sqrt(1+o-n-u);this._w=(a-c)/f,this._x=(s+r)/f,this._y=.25*f,this._z=(l+h)/f}else{let f=2*Math.sqrt(1+u-n-o);this._w=(r-s)/f,this._x=(a+c)/f,this._y=(l+h)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(te(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,a=t._z,r=t._w,o=e._x,l=e._y,c=e._z,h=e._w;return this._x=n*h+r*o+s*c-a*l,this._y=s*h+r*l+a*o-n*c,this._z=a*h+r*c+n*l-s*o,this._w=r*h-n*o-s*l-a*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,s=t._y,a=t._z,r=t._w,o=this.dot(t);o<0&&(n=-n,s=-s,a=-a,r=-r,o=-o);let l=1-e;if(o<.9995){let c=Math.acos(o),h=Math.sin(c);l=Math.sin(l*c)/h,e=Math.sin(e*c)/h,this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+a*e,this._w=this._w*l+r*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+s*e,this._z=this._z*l+a*e,this._w=this._w*l+r*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),s=Math.sqrt(1-n),a=Math.sqrt(n);return this.set(s*Math.sin(t),s*Math.cos(t),a*Math.sin(e),a*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},B=class{static{this.prototype.isVector3=!0}constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Mc.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Mc.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[3]*n+a[6]*s,this.y=a[1]*e+a[4]*n+a[7]*s,this.z=a[2]*e+a[5]*n+a[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,a=t.elements,r=1/(a[3]*e+a[7]*n+a[11]*s+a[15]);return this.x=(a[0]*e+a[4]*n+a[8]*s+a[12])*r,this.y=(a[1]*e+a[5]*n+a[9]*s+a[13])*r,this.z=(a[2]*e+a[6]*n+a[10]*s+a[14])*r,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,a=t.x,r=t.y,o=t.z,l=t.w,c=2*(r*s-o*n),h=2*(o*e-a*s),u=2*(a*n-r*e);return this.x=e+l*c+r*u-o*h,this.y=n+l*h+o*c-a*u,this.z=s+l*u+a*h-r*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s,this.y=a[1]*e+a[5]*n+a[9]*s,this.z=a[2]*e+a[6]*n+a[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,a=t.z,r=e.x,o=e.y,l=e.z;return this.x=s*l-a*o,this.y=a*r-n*l,this.z=n*o-s*r,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return No.copy(this).projectOnVector(t),this.sub(No)}reflect(t){return this.sub(No.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(te(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},No=new B,Mc=new bn,Ht=class{static{this.prototype.isMatrix3=!0}constructor(t,e,n,s,a,r,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,l,c)}set(t,e,n,s,a,r,o,l,c){let h=this.elements;return h[0]=t,h[1]=s,h[2]=o,h[3]=e,h[4]=a,h[5]=l,h[6]=n,h[7]=r,h[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[3],l=n[6],c=n[1],h=n[4],u=n[7],d=n[2],f=n[5],_=n[8],x=s[0],p=s[3],m=s[6],M=s[1],w=s[4],b=s[7],A=s[2],E=s[5],g=s[8];return a[0]=r*x+o*M+l*A,a[3]=r*p+o*w+l*E,a[6]=r*m+o*b+l*g,a[1]=c*x+h*M+u*A,a[4]=c*p+h*w+u*E,a[7]=c*m+h*b+u*g,a[2]=d*x+f*M+_*A,a[5]=d*p+f*w+_*E,a[8]=d*m+f*b+_*g,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8];return e*r*h-e*o*c-n*a*h+n*o*l+s*a*c-s*r*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=h*r-o*c,d=o*l-h*a,f=c*a-r*l,_=e*u+n*d+s*f;if(_===0)return this.set(0,0,0,0,0,0,0,0,0);let x=1/_;return t[0]=u*x,t[1]=(s*c-h*n)*x,t[2]=(o*n-s*r)*x,t[3]=d*x,t[4]=(h*e-s*l)*x,t[5]=(s*a-o*e)*x,t[6]=f*x,t[7]=(n*l-c*e)*x,t[8]=(r*e-n*a)*x,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,a,r,o){let l=Math.cos(a),c=Math.sin(a);return this.set(n*l,n*c,-n*(l*r+c*o)+r+t,-s*c,s*l,-s*(-c*r+l*o)+o+e,0,0,1),this}scale(t,e){return gi("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Uo.makeScale(t,e)),this}rotate(t){return gi("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Uo.makeRotation(-t)),this}translate(t,e){return gi("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Uo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Uo=new Ht,Sc=new Ht().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),bc=new Ht().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function ju(){let i={enabled:!0,workingColorSpace:As,spaces:{},convert:function(s,a,r){return this.enabled===!1||a===r||!a||!r||(this.spaces[a].transfer===ue&&(s.r=zn(s.r),s.g=zn(s.g),s.b=zn(s.b)),this.spaces[a].primaries!==this.spaces[r].primaries&&(s.applyMatrix3(this.spaces[a].toXYZ),s.applyMatrix3(this.spaces[r].fromXYZ)),this.spaces[r].transfer===ue&&(s.r=Wi(s.r),s.g=Wi(s.g),s.b=Wi(s.b))),s},workingToColorSpace:function(s,a){return this.convert(s,this.workingColorSpace,a)},colorSpaceToWorking:function(s,a){return this.convert(s,a,this.workingColorSpace)},getPrimaries:function(s){return this.spaces[s].primaries},getTransfer:function(s){return s===Xn?Cs:this.spaces[s].transfer},getToneMappingMode:function(s){return this.spaces[s].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(s,a=this.workingColorSpace){return s.fromArray(this.spaces[a].luminanceCoefficients)},define:function(s){Object.assign(this.spaces,s)},_getMatrix:function(s,a,r){return s.copy(this.spaces[r].fromXYZ).multiply(this.spaces[a].toXYZ)},_getDrawingBufferColorSpace:function(s){return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(s=this.workingColorSpace){return this.spaces[s].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[As]:{primaries:t,whitePoint:n,transfer:Cs,toXYZ:Sc,fromXYZ:bc,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:He},outputColorSpaceConfig:{drawingBufferColorSpace:He}},[He]:{primaries:t,whitePoint:n,transfer:ue,toXYZ:Sc,fromXYZ:bc,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:He}}}),i}var oe=ju();function zn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Wi(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Ii,aa=class{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{Ii===void 0&&(Ii=Rs("canvas")),Ii.width=t.width,Ii.height=t.height;let s=Ii.getContext("2d");t instanceof ImageData?s.putImageData(t,0,0):s.drawImage(t,0,0,t.width,t.height),n=Ii}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Rs("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),a=s.data;for(let r=0;r<a.length;r++)a[r]=zn(a[r]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(zn(e[n]/255)*255):e[n]=zn(e[n]);return{data:e,width:t.width,height:t.height}}else return zt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},td=0,Ji=class{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:td++}),this.uuid=Ai(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){let e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let a;if(Array.isArray(s)){a=[];for(let r=0,o=s.length;r<o;r++)s[r].isDataTexture?a.push(Fo(s[r].image)):a.push(Fo(s[r]))}else a=Fo(s);n.url=a}return e||(t.images[this.uuid]=n),n}};function Fo(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?aa.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(zt("Texture: Unable to serialize Texture."),{})}var ed=0,Oo=new B,Je=class i extends Sn{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=vn,s=vn,a=Ye,r=Vn,o=_n,l=Ke,c=i.DEFAULT_ANISOTROPY,h=Xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:ed++}),this.uuid=Ai(),this.name="",this.source=new Ji(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=a,this.minFilter=r,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Mt(0,0),this.repeat=new Mt(1,1),this.center=new Mt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ht,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=h,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Oo).x}get height(){return this.source.getSize(Oo).y}get depth(){return this.source.getSize(Oo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let e in t){let n=t[e];if(n===void 0){zt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){zt(`Texture.setValues(): property '${e}' does not exist.`);continue}s&&n&&s.isVector2&&n.isVector2||s&&n&&s.isVector3&&n.isVector3||s&&n&&s.isMatrix3&&n.isMatrix3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Al)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ia:t.x=t.x-Math.floor(t.x);break;case vn:t.x=t.x<0?0:1;break;case sa:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ia:t.y=t.y-Math.floor(t.y);break;case vn:t.y=t.y<0?0:1;break;case sa:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}};Je.DEFAULT_IMAGE=null;Je.DEFAULT_MAPPING=Al;Je.DEFAULT_ANISOTROPY=1;var Me=class{static{this.prototype.isVector4=!0}constructor(t=0,e=0,n=0,s=1){this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,a=this.w,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s+r[12]*a,this.y=r[1]*e+r[5]*n+r[9]*s+r[13]*a,this.z=r[2]*e+r[6]*n+r[10]*s+r[14]*a,this.w=r[3]*e+r[7]*n+r[11]*s+r[15]*a,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,a,l=t.elements,c=l[0],h=l[4],u=l[8],d=l[1],f=l[5],_=l[9],x=l[2],p=l[6],m=l[10];if(Math.abs(h-d)<.01&&Math.abs(u-x)<.01&&Math.abs(_-p)<.01){if(Math.abs(h+d)<.1&&Math.abs(u+x)<.1&&Math.abs(_+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let w=(c+1)/2,b=(f+1)/2,A=(m+1)/2,E=(h+d)/4,g=(u+x)/4,S=(_+p)/4;return w>b&&w>A?w<.01?(n=0,s=.707106781,a=.707106781):(n=Math.sqrt(w),s=E/n,a=g/n):b>A?b<.01?(n=.707106781,s=0,a=.707106781):(s=Math.sqrt(b),n=E/s,a=S/s):A<.01?(n=.707106781,s=.707106781,a=0):(a=Math.sqrt(A),n=g/a,s=S/a),this.set(n,s,a,e),this}let M=Math.sqrt((p-_)*(p-_)+(u-x)*(u-x)+(d-h)*(d-h));return Math.abs(M)<.001&&(M=1),this.x=(p-_)/M,this.y=(u-x)/M,this.z=(d-h)/M,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=te(this.x,t.x,e.x),this.y=te(this.y,t.y,e.y),this.z=te(this.z,t.z,e.z),this.w=te(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=te(this.x,t,e),this.y=te(this.y,t,e),this.z=te(this.z,t,e),this.w=te(this.w,t,e),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(te(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},oa=class extends Sn{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ye,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Me(0,0,t,e),this.scissorTest=!1,this.viewport=new Me(0,0,t,e),this.textures=[];let s=n.count;for(let a=0;a<s;a++)this.textures[a]=new Je({width:t,height:e,depth:n.depth}),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){let e={minFilter:Ye,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let s=0,a=this.textures.length;s<a;s++)this.textures[s].image.width=t,this.textures[s].image.height=e,this.textures[s].image.depth=n,this.textures[s].isData3DTexture!==!0&&(this.textures[s].isArrayTexture=this.textures[s].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;let s=Object.assign({},t.textures[e].image);this.textures[e].source=new Ji(s)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){let e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}},tn=class extends oa{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Ls=class extends Je{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}};var la=class extends Je{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=De,this.minFilter=De,this.wrapR=vn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}};var fe=class i{static{this.prototype.isMatrix4=!0}constructor(t,e,n,s,a,r,o,l,c,h,u,d,f,_,x,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,a,r,o,l,c,h,u,d,f,_,x,p)}set(t,e,n,s,a,r,o,l,c,h,u,d,f,_,x,p){let m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=s,m[1]=a,m[5]=r,m[9]=o,m[13]=l,m[2]=c,m[6]=h,m[10]=u,m[14]=d,m[3]=f,m[7]=_,m[11]=x,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();let e=this.elements,n=t.elements,s=1/Pi.setFromMatrixColumn(t,0).length(),a=1/Pi.setFromMatrixColumn(t,1).length(),r=1/Pi.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*a,e[5]=n[5]*a,e[6]=n[6]*a,e[7]=0,e[8]=n[8]*r,e[9]=n[9]*r,e[10]=n[10]*r,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,a=t.z,r=Math.cos(n),o=Math.sin(n),l=Math.cos(s),c=Math.sin(s),h=Math.cos(a),u=Math.sin(a);if(t.order==="XYZ"){let d=r*h,f=r*u,_=o*h,x=o*u;e[0]=l*h,e[4]=-l*u,e[8]=c,e[1]=f+_*c,e[5]=d-x*c,e[9]=-o*l,e[2]=x-d*c,e[6]=_+f*c,e[10]=r*l}else if(t.order==="YXZ"){let d=l*h,f=l*u,_=c*h,x=c*u;e[0]=d+x*o,e[4]=_*o-f,e[8]=r*c,e[1]=r*u,e[5]=r*h,e[9]=-o,e[2]=f*o-_,e[6]=x+d*o,e[10]=r*l}else if(t.order==="ZXY"){let d=l*h,f=l*u,_=c*h,x=c*u;e[0]=d-x*o,e[4]=-r*u,e[8]=_+f*o,e[1]=f+_*o,e[5]=r*h,e[9]=x-d*o,e[2]=-r*c,e[6]=o,e[10]=r*l}else if(t.order==="ZYX"){let d=r*h,f=r*u,_=o*h,x=o*u;e[0]=l*h,e[4]=_*c-f,e[8]=d*c+x,e[1]=l*u,e[5]=x*c+d,e[9]=f*c-_,e[2]=-c,e[6]=o*l,e[10]=r*l}else if(t.order==="YZX"){let d=r*l,f=r*c,_=o*l,x=o*c;e[0]=l*h,e[4]=x-d*u,e[8]=_*u+f,e[1]=u,e[5]=r*h,e[9]=-o*h,e[2]=-c*h,e[6]=f*u+_,e[10]=d-x*u}else if(t.order==="XZY"){let d=r*l,f=r*c,_=o*l,x=o*c;e[0]=l*h,e[4]=-u,e[8]=c*h,e[1]=d*u+x,e[5]=r*h,e[9]=f*u-_,e[2]=_*u-f,e[6]=o*h,e[10]=x*u+d}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(nd,t,id)}lookAt(t,e,n){let s=this.elements;return Qe.subVectors(t,e),Qe.lengthSq()===0&&(Qe.z=1),Qe.normalize(),Yn.crossVectors(n,Qe),Yn.lengthSq()===0&&(Math.abs(n.z)===1?Qe.x+=1e-4:Qe.z+=1e-4,Qe.normalize(),Yn.crossVectors(n,Qe)),Yn.normalize(),Tr.crossVectors(Qe,Yn),s[0]=Yn.x,s[4]=Tr.x,s[8]=Qe.x,s[1]=Yn.y,s[5]=Tr.y,s[9]=Qe.y,s[2]=Yn.z,s[6]=Tr.z,s[10]=Qe.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,a=this.elements,r=n[0],o=n[4],l=n[8],c=n[12],h=n[1],u=n[5],d=n[9],f=n[13],_=n[2],x=n[6],p=n[10],m=n[14],M=n[3],w=n[7],b=n[11],A=n[15],E=s[0],g=s[4],S=s[8],O=s[12],I=s[1],U=s[5],k=s[9],V=s[13],L=s[2],F=s[6],X=s[10],H=s[14],rt=s[3],q=s[7],tt=s[11],it=s[15];return a[0]=r*E+o*I+l*L+c*rt,a[4]=r*g+o*U+l*F+c*q,a[8]=r*S+o*k+l*X+c*tt,a[12]=r*O+o*V+l*H+c*it,a[1]=h*E+u*I+d*L+f*rt,a[5]=h*g+u*U+d*F+f*q,a[9]=h*S+u*k+d*X+f*tt,a[13]=h*O+u*V+d*H+f*it,a[2]=_*E+x*I+p*L+m*rt,a[6]=_*g+x*U+p*F+m*q,a[10]=_*S+x*k+p*X+m*tt,a[14]=_*O+x*V+p*H+m*it,a[3]=M*E+w*I+b*L+A*rt,a[7]=M*g+w*U+b*F+A*q,a[11]=M*S+w*k+b*X+A*tt,a[15]=M*O+w*V+b*H+A*it,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],a=t[12],r=t[1],o=t[5],l=t[9],c=t[13],h=t[2],u=t[6],d=t[10],f=t[14],_=t[3],x=t[7],p=t[11],m=t[15],M=l*f-c*d,w=o*f-c*u,b=o*d-l*u,A=r*f-c*h,E=r*d-l*h,g=r*u-o*h;return e*(x*M-p*w+m*b)-n*(_*M-p*A+m*E)+s*(_*w-x*A+m*g)-a*(_*b-x*E+p*g)}determinantAffine(){let t=this.elements,e=t[0],n=t[4],s=t[8],a=t[1],r=t[5],o=t[9],l=t[2],c=t[6],h=t[10];return e*(r*h-o*c)-n*(a*h-o*l)+s*(a*c-r*l)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],a=t[3],r=t[4],o=t[5],l=t[6],c=t[7],h=t[8],u=t[9],d=t[10],f=t[11],_=t[12],x=t[13],p=t[14],m=t[15],M=e*o-n*r,w=e*l-s*r,b=e*c-a*r,A=n*l-s*o,E=n*c-a*o,g=s*c-a*l,S=h*x-u*_,O=h*p-d*_,I=h*m-f*_,U=u*p-d*x,k=u*m-f*x,V=d*m-f*p,L=M*V-w*k+b*U+A*I-E*O+g*S;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let F=1/L;return t[0]=(o*V-l*k+c*U)*F,t[1]=(s*k-n*V-a*U)*F,t[2]=(x*g-p*E+m*A)*F,t[3]=(d*E-u*g-f*A)*F,t[4]=(l*I-r*V-c*O)*F,t[5]=(e*V-s*I+a*O)*F,t[6]=(p*b-_*g-m*w)*F,t[7]=(h*g-d*b+f*w)*F,t[8]=(r*k-o*I+c*S)*F,t[9]=(n*I-e*k-a*S)*F,t[10]=(_*E-x*b+m*M)*F,t[11]=(u*b-h*E-f*M)*F,t[12]=(o*O-r*U-l*S)*F,t[13]=(e*U-n*O+s*S)*F,t[14]=(x*w-_*A-p*M)*F,t[15]=(h*A-u*w+d*M)*F,this}scale(t){let e=this.elements,n=t.x,s=t.y,a=t.z;return e[0]*=n,e[4]*=s,e[8]*=a,e[1]*=n,e[5]*=s,e[9]*=a,e[2]*=n,e[6]*=s,e[10]*=a,e[3]*=n,e[7]*=s,e[11]*=a,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),a=1-n,r=t.x,o=t.y,l=t.z,c=a*r,h=a*o;return this.set(c*r+n,c*o-s*l,c*l+s*o,0,c*o+s*l,h*o+n,h*l-s*r,0,c*l-s*o,h*l+s*r,a*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,a,r){return this.set(1,n,a,0,t,1,r,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,a=e._x,r=e._y,o=e._z,l=e._w,c=a+a,h=r+r,u=o+o,d=a*c,f=a*h,_=a*u,x=r*h,p=r*u,m=o*u,M=l*c,w=l*h,b=l*u,A=n.x,E=n.y,g=n.z;return s[0]=(1-(x+m))*A,s[1]=(f+b)*A,s[2]=(_-w)*A,s[3]=0,s[4]=(f-b)*E,s[5]=(1-(d+m))*E,s[6]=(p+M)*E,s[7]=0,s[8]=(_+w)*g,s[9]=(p-M)*g,s[10]=(1-(d+x))*g,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements;t.x=s[12],t.y=s[13],t.z=s[14];let a=this.determinantAffine();if(a===0)return n.set(1,1,1),e.identity(),this;let r=Pi.set(s[0],s[1],s[2]).length(),o=Pi.set(s[4],s[5],s[6]).length(),l=Pi.set(s[8],s[9],s[10]).length();a<0&&(r=-r),cn.copy(this);let c=1/r,h=1/o,u=1/l;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=h,cn.elements[5]*=h,cn.elements[6]*=h,cn.elements[8]*=u,cn.elements[9]*=u,cn.elements[10]*=u,e.setFromRotationMatrix(cn),n.x=r,n.y=o,n.z=l,this}makePerspective(t,e,n,s,a,r,o=rn,l=!1){let c=this.elements,h=2*a/(e-t),u=2*a/(n-s),d=(e+t)/(e-t),f=(n+s)/(n-s),_,x;if(l)_=a/(r-a),x=r*a/(r-a);else if(o===rn)_=-(r+a)/(r-a),x=-2*r*a/(r-a);else if(o===qi)_=-r/(r-a),x=-r*a/(r-a);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,a,r,o=rn,l=!1){let c=this.elements,h=2/(e-t),u=2/(n-s),d=-(e+t)/(e-t),f=-(n+s)/(n-s),_,x;if(l)_=1/(r-a),x=r/(r-a);else if(o===rn)_=-2/(r-a),x=-(r+a)/(r-a);else if(o===qi)_=-1/(r-a),x=-a/(r-a);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=_,c[14]=x,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},Pi=new B,cn=new fe,nd=new B(0,0,0),id=new B(1,1,1),Yn=new B,Tr=new B,Qe=new B,wc=new fe,Tc=new bn,wn=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,a=s[0],r=s[4],o=s[8],l=s[1],c=s[5],h=s[9],u=s[2],d=s[6],f=s[10];switch(e){case"XYZ":this._y=Math.asin(te(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-h,f),this._z=Math.atan2(-r,a)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-te(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(o,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,a),this._z=0);break;case"ZXY":this._x=Math.asin(te(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-r,c)):(this._y=0,this._z=Math.atan2(l,a));break;case"ZYX":this._y=Math.asin(-te(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(d,f),this._z=Math.atan2(l,a)):(this._x=0,this._z=Math.atan2(-r,c));break;case"YZX":this._z=Math.asin(te(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-h,c),this._y=Math.atan2(-u,a)):(this._x=0,this._y=Math.atan2(o,f));break;case"XZY":this._z=Math.asin(-te(r,-1,1)),Math.abs(r)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,a)):(this._x=Math.atan2(-h,f),this._y=0);break;default:zt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return wc.makeRotationFromQuaternion(t),this.setFromRotationMatrix(wc,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Tc.setFromEuler(this),this.setFromQuaternion(Tc,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};wn.DEFAULT_ORDER="XYZ";var Is=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},sd=0,Ec=new B,Di=new bn,Un=new fe,Er=new B,ms=new B,rd=new B,ad=new bn,Ac=new B(1,0,0),Cc=new B(0,1,0),Rc=new B(0,0,1),Lc={type:"added"},od={type:"removed"},Ni={type:"childadded",child:null},Bo={type:"childremoved",child:null},Ne=class i extends Sn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:sd++}),this.uuid=Ai(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new B,e=new wn,n=new bn,s=new B(1,1,1);function a(){n.setFromEuler(e,!1)}function r(){e.setFromQuaternion(n,void 0,!1)}e._onChange(a),n._onChange(r),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new fe},normalMatrix:{value:new Ht}}),this.matrix=new fe,this.matrixWorld=new fe,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Is,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.multiply(Di),this}rotateOnWorldAxis(t,e){return Di.setFromAxisAngle(t,e),this.quaternion.premultiply(Di),this}rotateX(t){return this.rotateOnAxis(Ac,t)}rotateY(t){return this.rotateOnAxis(Cc,t)}rotateZ(t){return this.rotateOnAxis(Rc,t)}translateOnAxis(t,e){return Ec.copy(t).applyQuaternion(this.quaternion),this.position.add(Ec.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ac,t)}translateY(t){return this.translateOnAxis(Cc,t)}translateZ(t){return this.translateOnAxis(Rc,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Un.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Er.copy(t):Er.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ms.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Un.lookAt(ms,Er,this.up):Un.lookAt(Er,ms,this.up),this.quaternion.setFromRotationMatrix(Un),s&&(Un.extractRotation(s.matrixWorld),Di.setFromRotationMatrix(Un),this.quaternion.premultiply(Di.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(Gt("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Lc),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null):Gt("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(od),Bo.child=t,this.dispatchEvent(Bo),Bo.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Un.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Un.multiply(t.parent.matrixWorld)),t.applyMatrix4(Un),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Lc),Ni.child=t,this.dispatchEvent(Ni),Ni.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let r=this.children[n].getObjectByProperty(t,e);if(r!==void 0)return r}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let a=0,r=s.length;a<r;a++)s[a].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,t,rd),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ms,ad,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);let t=this.pivot;if(t!==null){let e=t.x,n=t.y,s=t.z,a=this.matrix.elements;a[12]+=e-a[0]*e-a[4]*n-a[8]*s,a[13]+=n-a[1]*e-a[5]*n-a[9]*s,a[14]+=s-a[2]*e-a[6]*n-a[10]*s}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){let s=this.parent;if(t===!0&&s!==null&&s.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){let a=this.children;for(let r=0,o=a.length;r<o;r++)a[r].updateWorldMatrix(!1,!0,n)}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,s.name=this.name,s.castShadow=this.castShadow,s.receiveShadow=this.receiveShadow,s.visible=this.visible,s.frustumCulled=this.frustumCulled,s.renderOrder=this.renderOrder,s.static=this.static,s.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.pivot!==null&&(s.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(s.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(s.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),s.instanceInfo=this._instanceInfo.map(o=>({...o})),s.availableInstanceIds=this._availableInstanceIds.slice(),s.availableGeometryIds=this._availableGeometryIds.slice(),s.nextIndexStart=this._nextIndexStart,s.nextVertexStart=this._nextVertexStart,s.geometryCount=this._geometryCount,s.maxInstanceCount=this._maxInstanceCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.matricesTexture=this._matricesTexture.toJSON(t),s.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(s.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(s.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(s.boundingBox=this.boundingBox.toJSON()));function a(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=a(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let c=0,h=l.length;c<h;c++){let u=l[c];a(t.shapes,u)}else a(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(a(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(a(t.materials,this.material[l]));s.material=o}else s.material=a(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(a(t.animations,l))}}if(e){let o=r(t.geometries),l=r(t.materials),c=r(t.textures),h=r(t.images),u=r(t.shapes),d=r(t.skeletons),f=r(t.animations),_=r(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),h.length>0&&(n.images=h),u.length>0&&(n.shapes=u),d.length>0&&(n.skeletons=d),f.length>0&&(n.animations=f),_.length>0&&(n.nodes=_)}return n.object=s,n;function r(o){let l=[];for(let c in o){let h=o[c];delete h.metadata,l.push(h)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}};Ne.DEFAULT_UP=new B(0,1,0);Ne.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ne.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ze=class extends Ne{constructor(){super(),this.isGroup=!0,this.type="Group"}},ld={type:"move"},Ki=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ze,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ze,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ze,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,a=null,r=null,o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){r=!0;for(let x of t.hand.values()){let p=e.getJointPose(x,n),m=this._getHandJoint(c,x);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}let h=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],d=h.position.distanceTo(u.position),f=.02,_=.005;c.inputState.pinching&&d>f+_?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&d<=f-_&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(a=e.getPose(t.gripSpace,n),a!==null&&(l.matrix.fromArray(a.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,a.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(a.linearVelocity)):l.hasLinearVelocity=!1,a.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(a.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&a!==null&&(s=a),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(ld)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=a!==null),c!==null&&(c.visible=r!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Ze;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Uh={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Jn={h:0,s:0,l:0},Ar={h:0,s:0,l:0};function ko(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var Zt=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=He){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,s=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.colorSpaceToWorking(this,s),this}setHSL(t,e,n,s=oe.workingColorSpace){if(t=kl(t,1),e=te(e,0,1),n=te(n,0,1),e===0)this.r=this.g=this.b=n;else{let a=n<=.5?n*(1+e):n+e-n*e,r=2*n-a;this.r=ko(r,a,t+1/3),this.g=ko(r,a,t),this.b=ko(r,a,t-1/3)}return oe.colorSpaceToWorking(this,s),this}setStyle(t,e=He){function n(a){a!==void 0&&parseFloat(a)<1&&zt("Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let a,r=s[1],o=s[2];switch(r){case"rgb":case"rgba":if(a=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(255,parseInt(a[1],10))/255,Math.min(255,parseInt(a[2],10))/255,Math.min(255,parseInt(a[3],10))/255,e);if(a=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(a[4]),this.setRGB(Math.min(100,parseFloat(a[1]))/100,Math.min(100,parseFloat(a[2]))/100,Math.min(100,parseFloat(a[3]))/100,e);break;case"hsl":case"hsla":if(a=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(a[4]),this.setHSL(parseFloat(a[1])/360,parseFloat(a[2])/100,parseFloat(a[3])/100,e);break;default:zt("Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let a=s[1],r=a.length;if(r===3)return this.setRGB(parseInt(a.charAt(0),16)/15,parseInt(a.charAt(1),16)/15,parseInt(a.charAt(2),16)/15,e);if(r===6)return this.setHex(parseInt(a,16),e);zt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=He){let n=Uh[t.toLowerCase()];return n!==void 0?this.setHex(n,e):zt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=zn(t.r),this.g=zn(t.g),this.b=zn(t.b),this}copyLinearToSRGB(t){return this.r=Wi(t.r),this.g=Wi(t.g),this.b=Wi(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=He){return oe.workingToColorSpace(Ge.copy(this),t),Math.round(te(Ge.r*255,0,255))*65536+Math.round(te(Ge.g*255,0,255))*256+Math.round(te(Ge.b*255,0,255))}getHexString(t=He){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(Ge.copy(this),e);let n=Ge.r,s=Ge.g,a=Ge.b,r=Math.max(n,s,a),o=Math.min(n,s,a),l,c,h=(o+r)/2;if(o===r)l=0,c=0;else{let u=r-o;switch(c=h<=.5?u/(r+o):u/(2-r-o),r){case n:l=(s-a)/u+(s<a?6:0);break;case s:l=(a-n)/u+2;break;case a:l=(n-s)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=h,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(Ge.copy(this),e),t.r=Ge.r,t.g=Ge.g,t.b=Ge.b,t}getStyle(t=He){oe.workingToColorSpace(Ge.copy(this),t);let e=Ge.r,n=Ge.g,s=Ge.b;return t!==He?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Jn),this.setHSL(Jn.h+t,Jn.s+e,Jn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Jn),t.getHSL(Ar);let n=bs(Jn.h,Ar.h,e),s=bs(Jn.s,Ar.s,e),a=bs(Jn.l,Ar.l,e);return this.setHSL(n,s,a),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,a=t.elements;return this.r=a[0]*e+a[3]*n+a[6]*s,this.g=a[1]*e+a[4]*n+a[7]*s,this.b=a[2]*e+a[5]*n+a[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ge=new Zt;Zt.NAMES=Uh;var _i=class extends Ne{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new wn,this.environmentIntensity=1,this.environmentRotation=new wn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}},hn=new B,Fn=new B,zo=new B,On=new B,Ui=new B,Fi=new B,Ic=new B,$o=new B,Go=new B,Ho=new B,Vo=new Me,Wo=new Me,Xo=new Me,ti=class i{constructor(t=new B,e=new B,n=new B){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),hn.subVectors(t,e),s.cross(hn);let a=s.lengthSq();return a>0?s.multiplyScalar(1/Math.sqrt(a)):s.set(0,0,0)}static getBarycoord(t,e,n,s,a){hn.subVectors(s,e),Fn.subVectors(n,e),zo.subVectors(t,e);let r=hn.dot(hn),o=hn.dot(Fn),l=hn.dot(zo),c=Fn.dot(Fn),h=Fn.dot(zo),u=r*c-o*o;if(u===0)return a.set(0,0,0),null;let d=1/u,f=(c*l-o*h)*d,_=(r*h-o*l)*d;return a.set(1-f-_,_,f)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,On)===null?!1:On.x>=0&&On.y>=0&&On.x+On.y<=1}static getInterpolation(t,e,n,s,a,r,o,l){return this.getBarycoord(t,e,n,s,On)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(a,On.x),l.addScaledVector(r,On.y),l.addScaledVector(o,On.z),l)}static getInterpolatedAttribute(t,e,n,s,a,r){return Vo.setScalar(0),Wo.setScalar(0),Xo.setScalar(0),Vo.fromBufferAttribute(t,e),Wo.fromBufferAttribute(t,n),Xo.fromBufferAttribute(t,s),r.setScalar(0),r.addScaledVector(Vo,a.x),r.addScaledVector(Wo,a.y),r.addScaledVector(Xo,a.z),r}static isFrontFacing(t,e,n,s){return hn.subVectors(n,e),Fn.subVectors(t,e),hn.cross(Fn).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return hn.subVectors(this.c,this.b),Fn.subVectors(this.a,this.b),hn.cross(Fn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,s,a){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,a)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,a=this.c,r,o;Ui.subVectors(s,n),Fi.subVectors(a,n),$o.subVectors(t,n);let l=Ui.dot($o),c=Fi.dot($o);if(l<=0&&c<=0)return e.copy(n);Go.subVectors(t,s);let h=Ui.dot(Go),u=Fi.dot(Go);if(h>=0&&u<=h)return e.copy(s);let d=l*u-h*c;if(d<=0&&l>=0&&h<=0&&l-h>0)return r=l/(l-h),e.copy(n).addScaledVector(Ui,r);Ho.subVectors(t,a);let f=Ui.dot(Ho),_=Fi.dot(Ho);if(_>=0&&f<=_)return e.copy(a);let x=f*c-l*_;if(x<=0&&c>=0&&_<=0)return o=c/(c-_),e.copy(n).addScaledVector(Fi,o);let p=h*_-f*u;if(p<=0&&u-h>=0&&f-_>=0)return Ic.subVectors(a,s),o=(u-h)/(u-h+(f-_)),e.copy(s).addScaledVector(Ic,o);let m=1/(p+x+d);return r=x*m,o=d*m,e.copy(n).addScaledVector(Ui,r).addScaledVector(Fi,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},Tn=class{constructor(t=new B(1/0,1/0,1/0),e=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(un.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(un.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=un.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let a=n.getAttribute("position");if(e===!0&&a!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let r=0,o=a.count;r<o;r++)t.isMesh===!0?t.getVertexPosition(r,un):un.fromBufferAttribute(a,r),un.applyMatrix4(t.matrixWorld),this.expandByPoint(un);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),Cr.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Cr.copy(n.boundingBox)),Cr.applyMatrix4(t.matrixWorld),this.union(Cr)}let s=t.children;for(let a=0,r=s.length;a<r;a++)this.expandByObject(s[a],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,un),un.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(gs),Rr.subVectors(this.max,gs),Oi.subVectors(t.a,gs),Bi.subVectors(t.b,gs),ki.subVectors(t.c,gs),Kn.subVectors(Bi,Oi),Qn.subVectors(ki,Bi),di.subVectors(Oi,ki);let e=[0,-Kn.z,Kn.y,0,-Qn.z,Qn.y,0,-di.z,di.y,Kn.z,0,-Kn.x,Qn.z,0,-Qn.x,di.z,0,-di.x,-Kn.y,Kn.x,0,-Qn.y,Qn.x,0,-di.y,di.x,0];return!qo(e,Oi,Bi,ki,Rr)||(e=[1,0,0,0,1,0,0,0,1],!qo(e,Oi,Bi,ki,Rr))?!1:(Lr.crossVectors(Kn,Qn),e=[Lr.x,Lr.y,Lr.z],qo(e,Oi,Bi,ki,Rr))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,un).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(un).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Bn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}},Bn=[new B,new B,new B,new B,new B,new B,new B,new B],un=new B,Cr=new Tn,Oi=new B,Bi=new B,ki=new B,Kn=new B,Qn=new B,di=new B,gs=new B,Rr=new B,Lr=new B,fi=new B;function qo(i,t,e,n,s){for(let a=0,r=i.length-3;a<=r;a+=3){fi.fromArray(i,a);let o=s.x*Math.abs(fi.x)+s.y*Math.abs(fi.y)+s.z*Math.abs(fi.z),l=t.dot(fi),c=e.dot(fi),h=n.dot(fi);if(Math.max(-Math.max(l,c,h),Math.min(l,c,h))>o)return!1}return!0}var Ae=new B,Ir=new Mt,cd=0,fn=class extends Sn{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:cd++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ch,this.updateRanges=[],this.gpuType=on,this.version=0,this._normalizationScale=t!==void 0?$l(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,a=this.itemSize;s<a;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ir.fromBufferAttribute(this,e),Ir.applyMatrix3(t),this.setXY(e,Ir.x,Ir.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix3(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyMatrix4(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.applyNormalMatrix(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ae.fromBufferAttribute(this,e),Ae.transformDirection(t),this.setXYZ(e,Ae.x,Ae.y,Ae.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,a){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),s=this._normalize(s),a=this._normalize(a)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=a,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){let e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Dh(t,this.array)}_normalize(t){let e=this._normalizationScale;return e!==void 0?Math.round(t*e):Nh(t,this.array)}};var Ps=class extends fn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var Ds=class extends fn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Ce=class extends fn{constructor(t,e,n){super(new Float32Array(t),e,n)}},hd=new Tn,_s=new B,Zo=new B,ei=class{constructor(t=new B,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):hd.setFromPoints(t).getCenter(n);let s=0;for(let a=0,r=t.length;a<r;a++)s=Math.max(s,n.distanceToSquared(t[a]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;_s.subVectors(t,this.center);let e=_s.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(_s,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Zo.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(_s.copy(t.center).add(Zo)),this.expandByPoint(_s.copy(t.center).sub(Zo))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}},ud=0,sn=new fe,Yo=new Ne,zi=new B,je=new Tn,xs=new Tn,Pe=new B,pn=class i extends Sn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ud++}),this.uuid=Ai(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Fu(t)?Ds:Ps)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let a=new Ht().getNormalMatrix(t);n.applyNormalMatrix(a),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return sn.makeRotationFromQuaternion(t),this.applyMatrix4(sn),this}rotateX(t){return sn.makeRotationX(t),this.applyMatrix4(sn),this}rotateY(t){return sn.makeRotationY(t),this.applyMatrix4(sn),this}rotateZ(t){return sn.makeRotationZ(t),this.applyMatrix4(sn),this}translate(t,e,n){return sn.makeTranslation(t,e,n),this.applyMatrix4(sn),this}scale(t,e,n){return sn.makeScale(t,e,n),this.applyMatrix4(sn),this}lookAt(t){return Yo.lookAt(t),Yo.updateMatrix(),this.applyMatrix4(Yo.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(zi).negate(),this.translate(zi.x,zi.y,zi.z),this}setFromPoints(t){let e=this.getAttribute("position");if(e===void 0){let n=[];for(let s=0,a=t.length;s<a;s++){let r=t[s];n.push(r.x,r.y,r.z||0)}this.setAttribute("position",new Ce(n,3))}else{let n=Math.min(t.length,e.count);for(let s=0;s<n;s++){let a=t[s];e.setXYZ(s,a.x,a.y,a.z||0)}t.length>e.count&&zt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Tn);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let a=e[n];je.setFromBufferAttribute(a),this.morphTargetsRelative?(Pe.addVectors(this.boundingBox.min,je.min),this.boundingBox.expandByPoint(Pe),Pe.addVectors(this.boundingBox.max,je.max),this.boundingBox.expandByPoint(Pe)):(this.boundingBox.expandByPoint(je.min),this.boundingBox.expandByPoint(je.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&Gt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ei);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){Gt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(t){let n=this.boundingSphere.center;if(je.setFromBufferAttribute(t),e)for(let a=0,r=e.length;a<r;a++){let o=e[a];xs.setFromBufferAttribute(o),this.morphTargetsRelative?(Pe.addVectors(je.min,xs.min),je.expandByPoint(Pe),Pe.addVectors(je.max,xs.max),je.expandByPoint(Pe)):(je.expandByPoint(xs.min),je.expandByPoint(xs.max))}je.getCenter(n);let s=0;for(let a=0,r=t.count;a<r;a++)Pe.fromBufferAttribute(t,a),s=Math.max(s,n.distanceToSquared(Pe));if(e)for(let a=0,r=e.length;a<r;a++){let o=e[a],l=this.morphTargetsRelative;for(let c=0,h=o.count;c<h;c++)Pe.fromBufferAttribute(o,c),l&&(zi.fromBufferAttribute(t,c),Pe.add(zi)),s=Math.max(s,n.distanceToSquared(Pe))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&Gt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){Gt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=e.position,s=e.normal,a=e.uv,r=this.getAttribute("tangent");(r===void 0||r.count!==n.count)&&(r=new fn(new Float32Array(4*n.count),4),this.setAttribute("tangent",r));let o=[],l=[],c=new Uint8Array(n.count);for(let O=0;O<n.count;O++)o[O]=new B,l[O]=new B;let h=new B,u=new B,d=new B,f=new Mt,_=new Mt,x=new Mt,p=new B,m=new B;function M(O,I,U){c[O]=c[I]=c[U]=1,h.fromBufferAttribute(n,O),u.fromBufferAttribute(n,I),d.fromBufferAttribute(n,U),f.fromBufferAttribute(a,O),_.fromBufferAttribute(a,I),x.fromBufferAttribute(a,U),u.sub(h),d.sub(h),_.sub(f),x.sub(f);let k=1/(_.x*x.y-x.x*_.y);isFinite(k)&&(p.copy(u).multiplyScalar(x.y).addScaledVector(d,-_.y).multiplyScalar(k),m.copy(d).multiplyScalar(_.x).addScaledVector(u,-x.x).multiplyScalar(k),o[O].add(p),o[I].add(p),o[U].add(p),l[O].add(m),l[I].add(m),l[U].add(m))}let w=this.groups;w.length===0&&(w=[{start:0,count:t.count}]);for(let O=0,I=w.length;O<I;++O){let U=w[O],k=U.start,V=U.count;for(let L=k,F=k+V;L<F;L+=3)M(t.getX(L+0),t.getX(L+1),t.getX(L+2))}let b=new B,A=new B,E=new B,g=new B;function S(O){E.fromBufferAttribute(s,O),g.copy(E);let I=o[O];b.copy(I),b.sub(E.multiplyScalar(E.dot(I))).normalize(),A.crossVectors(g,I);let k=A.dot(l[O])<0?-1:1;r.setXYZW(O,b.x,b.y,b.z,k)}for(let O=0,I=n.count;O<I;++O)c[O]&&S(O);this._transformed=!0}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new fn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let d=0,f=n.count;d<f;d++)n.setXYZ(d,0,0,0);let s=new B,a=new B,r=new B,o=new B,l=new B,c=new B,h=new B,u=new B;if(t)for(let d=0,f=t.count;d<f;d+=3){let _=t.getX(d+0),x=t.getX(d+1),p=t.getX(d+2);s.fromBufferAttribute(e,_),a.fromBufferAttribute(e,x),r.fromBufferAttribute(e,p),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),o.fromBufferAttribute(n,_),l.fromBufferAttribute(n,x),c.fromBufferAttribute(n,p),o.add(h),l.add(h),c.add(h),n.setXYZ(_,o.x,o.y,o.z),n.setXYZ(x,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let d=0,f=e.count;d<f;d+=3)s.fromBufferAttribute(e,d+0),a.fromBufferAttribute(e,d+1),r.fromBufferAttribute(e,d+2),h.subVectors(r,a),u.subVectors(s,a),h.cross(u),n.setXYZ(d+0,h.x,h.y,h.z),n.setXYZ(d+1,h.x,h.y,h.z),n.setXYZ(d+2,h.x,h.y,h.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Pe.fromBufferAttribute(t,e),Pe.normalize(),t.setXYZ(e,Pe.x,Pe.y,Pe.z)}toNonIndexed(){function t(o,l){let c=o.array,h=o.itemSize,u=o.normalized,d=new c.constructor(l.length*h),f=0,_=0;for(let x=0,p=l.length;x<p;x++){o.isInterleavedBufferAttribute?f=l[x]*o.data.stride+o.offset:f=l[x]*h;for(let m=0;m<h;m++)d[_++]=c[f++]}return new fn(d,h,u)}if(this.index===null)return zt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],c=t(l,n);e.setAttribute(o,c)}let a=this.morphAttributes;for(let o in a){let l=[],c=a[o];for(let h=0,u=c.length;h<u;h++){let d=c[h],f=t(d,n);l.push(f)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let r=this.groups;for(let o=0,l=r.length;o<l;o++){let c=r[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){let t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){let l=this.parameters;for(let c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let c=n[l];t.data.attributes[l]=c.toJSON(t.data)}let s={},a=!1;for(let l in this.morphAttributes){let c=this.morphAttributes[l],h=[];for(let u=0,d=c.length;u<d;u++){let f=c[u];h.push(f.toJSON(t.data))}h.length>0&&(s[l]=h,a=!0)}a&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let r=this.groups;r.length>0&&(t.data.groups=JSON.parse(JSON.stringify(r)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone());let s=t.attributes;for(let c in s){let h=s[c];this.setAttribute(c,h.clone(e))}let a=t.morphAttributes;for(let c in a){let h=[],u=a[c];for(let d=0,f=u.length;d<f;d++)h.push(u[d].clone(e));this.morphAttributes[c]=h}this.morphTargetsRelative=t.morphTargetsRelative;let r=t.groups;for(let c=0,h=r.length;c<h;c++){let u=r[c];this.addGroup(u.start,u.count,u.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}};var Jo=new B,dd=new B,fd=new Ht,dn=class{constructor(t=new B(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Jo.subVectors(n,e).cross(dd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){let s=t.delta(Jo),a=this.normal.dot(s);if(a===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/a;return n===!0&&(r<0||r>1)?null:e.copy(t.start).addScaledVector(s,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||fd.getNormalMatrix(t),s=this.coplanarPoint(Jo).applyMatrix4(t),a=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(a),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}},pd=0,Gn=class extends Sn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:pd++}),this.uuid=Ai(),this.name="",this.type="Material",this.blending=ss,this.side=oi,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=yl,this.blendDst=vl,this.blendEquation=wi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Zt(0,0,0),this.blendAlpha=0,this.depthFunc=Xi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Sh,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Yr,this.stencilZFail=Yr,this.stencilZPass=Yr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){zt(`Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){zt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector2&&n&&n.isVector2||s&&s.isEuler&&n&&n.isEuler||s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(a=>a.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(a){let r=[];for(let o in a){let l=a[o];delete l.metadata,r.push(l)}return r}if(e){let a=s(t.textures),r=s(t.images);a.length>0&&(n.textures=a),r.length>0&&(n.images=r)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Zt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new dn().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new Mt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new Mt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let a=0;a!==s;++a)n[a]=e[a].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}};var kn=new B,Ko=new B,Pr=new B,Dr=new B,ca=class{constructor(t=new B,e=new B(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,kn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=kn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(kn.copy(this.origin).addScaledVector(this.direction,e),kn.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){Ko.copy(t).add(e).multiplyScalar(.5),Pr.copy(e).sub(t).normalize(),Dr.copy(this.origin).sub(Ko);let a=t.distanceTo(e)*.5,r=-this.direction.dot(Pr),o=Dr.dot(this.direction),l=-Dr.dot(Pr),c=Dr.lengthSq(),h=Math.abs(1-r*r),u,d,f,_;if(h>0)if(u=r*l-o,d=r*o-l,_=a*h,u>=0)if(d>=-_)if(d<=_){let x=1/h;u*=x,d*=x,f=u*(u+r*d+2*o)+d*(r*u+d+2*l)+c}else d=a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d=-a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;else d<=-_?(u=Math.max(0,-(-r*a+o)),d=u>0?-a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c):d<=_?(u=0,d=Math.min(Math.max(-a,-l),a),f=d*(d+2*l)+c):(u=Math.max(0,-(r*a+o)),d=u>0?a:Math.min(Math.max(-a,-l),a),f=-u*u+d*(d+2*l)+c);else d=r>0?-a:a,u=Math.max(0,-(r*d+o)),f=-u*u+d*(d+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),s&&s.copy(Ko).addScaledVector(Pr,d),f}intersectSphere(t,e){if(t.radius<0)return null;kn.subVectors(t.center,this.origin);let n=kn.dot(this.direction),s=kn.dot(kn)-n*n,a=t.radius*t.radius;if(s>a)return null;let r=Math.sqrt(a-s),o=n-r,l=n+r;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,a,r,o,l,c=1/this.direction.x,h=1/this.direction.y,u=1/this.direction.z,d=this.origin;return c>=0?(n=(t.min.x-d.x)*c,s=(t.max.x-d.x)*c):(n=(t.max.x-d.x)*c,s=(t.min.x-d.x)*c),h>=0?(a=(t.min.y-d.y)*h,r=(t.max.y-d.y)*h):(a=(t.max.y-d.y)*h,r=(t.min.y-d.y)*h),n>r||a>s||((a>n||isNaN(n))&&(n=a),(r<s||isNaN(s))&&(s=r),u>=0?(o=(t.min.z-d.z)*u,l=(t.max.z-d.z)*u):(o=(t.max.z-d.z)*u,l=(t.min.z-d.z)*u),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,kn)!==null}intersectTriangle(t,e,n,s,a){let r=this.origin,o=this.direction,l=o.x,c=o.y,h=o.z,u=t.x-r.x,d=t.y-r.y,f=t.z-r.z,_=e.x-r.x,x=e.y-r.y,p=e.z-r.z,m=n.x-r.x,M=n.y-r.y,w=n.z-r.z,b=Math.abs(l),A=Math.abs(c),E=Math.abs(h),g,S,O,I,U,k,V,L,F,X,H,rt;if(b>=A&&b>=E?(O=l,k=u,F=_,rt=m,l>=0?(g=c,S=h,I=d,U=f,V=x,L=p,X=M,H=w):(g=h,S=c,I=f,U=d,V=p,L=x,X=w,H=M)):A>=E?(O=c,k=d,F=x,rt=M,c>=0?(g=h,S=l,I=f,U=u,V=p,L=_,X=w,H=m):(g=l,S=h,I=u,U=f,V=_,L=p,X=m,H=w)):(O=h,k=f,F=p,rt=w,h>=0?(g=l,S=c,I=u,U=d,V=_,L=x,X=m,H=M):(g=c,S=l,I=d,U=u,V=x,L=_,X=M,H=m)),O===0)return null;let q=g/O,tt=S/O,it=1/O,wt=I-q*k,Ut=U-tt*k,J=V-q*F,ft=L-tt*F,At=X-q*rt,Ot=H-tt*rt,bt=At*ft-Ot*J,Bt=wt*Ot-Ut*At,de=J*Ut-ft*wt;if(s){if(bt<0||Bt<0||de<0)return null}else if((bt<0||Bt<0||de<0)&&(bt>0||Bt>0||de>0))return null;let kt=bt+Bt+de;if(kt===0)return null;let Yt=it*(bt*k+Bt*F+de*rt);return(kt>0?Yt<0:Yt>0)?null:this.at(Yt/kt,a)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Qi=class extends Gn{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=Da,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}},Pc=new fe,pi=new ca,Nr=new ei,Dc=new B,Ur=new B,Fr=new B,Or=new B,Qo=new B,Br=new B,Nc=new B,kr=new B,pe=class extends Ne{constructor(t=new pn,e=new Qi){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,r=s.length;a<r;a++){let o=s[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,a=n.morphAttributes.position,r=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(a&&o){Br.set(0,0,0);for(let l=0,c=a.length;l<c;l++){let h=o[l],u=a[l];h!==0&&(Qo.fromBufferAttribute(u,t),r?Br.addScaledVector(Qo,h):Br.addScaledVector(Qo.sub(e),h))}e.add(Br)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){let n=this.geometry,s=this.material,a=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Nr.copy(n.boundingSphere),Nr.applyMatrix4(a),pi.copy(t.ray).recast(t.near),!(Nr.containsPoint(pi.origin)===!1&&(pi.intersectSphere(Nr,Dc)===null||pi.origin.distanceToSquared(Dc)>(t.far-t.near)**2))&&(Pc.copy(a).invert(),pi.copy(t.ray).applyMatrix4(Pc),!(n.boundingBox!==null&&pi.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,pi)))}_computeIntersections(t,e,n){let s,a=this.geometry,r=this.material,o=a.index,l=a.attributes.position,c=a.attributes.uv,h=a.attributes.uv1,u=a.attributes.normal,d=a.groups,f=a.drawRange;if(o!==null)if(Array.isArray(r))for(let _=0,x=d.length;_<x;_++){let p=d[_],m=r[p.materialIndex],M=Math.max(p.start,f.start),w=Math.min(o.count,Math.min(p.start+p.count,f.start+f.count));for(let b=M,A=w;b<A;b+=3){let E=o.getX(b),g=o.getX(b+1),S=o.getX(b+2);s=zr(this,m,t,n,c,h,u,E,g,S),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let _=Math.max(0,f.start),x=Math.min(o.count,f.start+f.count);for(let p=_,m=x;p<m;p+=3){let M=o.getX(p),w=o.getX(p+1),b=o.getX(p+2);s=zr(this,r,t,n,c,h,u,M,w,b),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(r))for(let _=0,x=d.length;_<x;_++){let p=d[_],m=r[p.materialIndex],M=Math.max(p.start,f.start),w=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let b=M,A=w;b<A;b+=3){let E=b,g=b+1,S=b+2;s=zr(this,m,t,n,c,h,u,E,g,S),s&&(s.faceIndex=Math.floor(b/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let _=Math.max(0,f.start),x=Math.min(l.count,f.start+f.count);for(let p=_,m=x;p<m;p+=3){let M=p,w=p+1,b=p+2;s=zr(this,r,t,n,c,h,u,M,w,b),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function md(i,t,e,n,s,a,r,o){let l;if(t.side===Be?l=n.intersectTriangle(r,a,s,!0,o):l=n.intersectTriangle(s,a,r,t.side===oi,o),l===null)return null;kr.copy(o),kr.applyMatrix4(i.matrixWorld);let c=e.ray.origin.distanceTo(kr);return c<e.near||c>e.far?null:{distance:c,point:kr.clone(),object:i}}function zr(i,t,e,n,s,a,r,o,l,c){i.getVertexPosition(o,Ur),i.getVertexPosition(l,Fr),i.getVertexPosition(c,Or);let h=md(i,t,e,n,Ur,Fr,Or,Nc);if(h){let u=new B;ti.getBarycoord(Nc,Ur,Fr,Or,u),s&&(h.uv=ti.getInterpolatedAttribute(s,o,l,c,u,new Mt)),a&&(h.uv1=ti.getInterpolatedAttribute(a,o,l,c,u,new Mt)),r&&(h.normal=ti.getInterpolatedAttribute(r,o,l,c,u,new B),h.normal.dot(n.direction)>0&&h.normal.multiplyScalar(-1));let d={a:o,b:l,c,normal:new B,materialIndex:0};ti.getNormal(Ur,Fr,Or,d.normal),h.face=d,h.barycoord=u}return h}var Ns=class extends Je{constructor(t=null,e=1,n=1,s,a,r,o,l,c=De,h=De,u,d){super(null,r,o,l,c,h,s,a,u,d),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Us=class extends fn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},$i=new fe,Uc=new fe,$r=[],Fc=new Tn,gd=new fe,ys=new pe,vs=new ei,Fs=class extends pe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Us(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,gd)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Tn),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$i),Fc.copy(t.boundingBox).applyMatrix4($i),this.boundingBox.union(Fc)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ei),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,$i),vs.copy(t.boundingSphere).applyMatrix4($i),this.boundingSphere.union(vs)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){let n=e.morphTargetInfluences,s=this.morphTexture.source.data.data,a=n.length+1,r=t*a+1;for(let o=0;o<n.length;o++)n[o]=s[r+o]}raycast(t,e){let n=this.matrixWorld,s=this.count;if(ys.geometry=this.geometry,ys.material=this.material,ys.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vs.copy(this.boundingSphere),vs.applyMatrix4(n),t.ray.intersectsSphere(vs)!==!1))for(let a=0;a<s;a++){this.getMatrixAt(a,$i),Uc.multiplyMatrices(n,$i),ys.matrixWorld=Uc,ys.raycast(t,$r);for(let r=0,o=$r.length;r<o;r++){let l=$r[r];l.instanceId=a,l.object=this,e.push(l)}$r.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new Us(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){let n=e.morphTargetInfluences,s=n.length+1;this.morphTexture===null&&(this.morphTexture=new Ns(new Float32Array(s*this.count),s,this.count,za,on));let a=this.morphTexture.source.data.data,r=0;for(let c=0;c<n.length;c++)r+=n[c];let o=this.geometry.morphTargetsRelative?1:1-r,l=s*t;return a[l]=o,a.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},mi=new ei,_d=new Mt(.5,.5),Gr=new B,ni=class{constructor(t=new dn,e=new dn,n=new dn,s=new dn,a=new dn,r=new dn){this.planes=[t,e,n,s,a,r]}set(t,e,n,s,a,r){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(a),o[5].copy(r),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=rn,n=!1){let s=this.planes,a=t.elements,r=a[0],o=a[1],l=a[2],c=a[3],h=a[4],u=a[5],d=a[6],f=a[7],_=a[8],x=a[9],p=a[10],m=a[11],M=a[12],w=a[13],b=a[14],A=a[15];if(s[0].setComponents(c-r,f-h,m-_,A-M).normalize(),s[1].setComponents(c+r,f+h,m+_,A+M).normalize(),s[2].setComponents(c+o,f+u,m+x,A+w).normalize(),s[3].setComponents(c-o,f-u,m-x,A-w).normalize(),n)s[4].setComponents(l,d,p,b).normalize(),s[5].setComponents(c-l,f-d,m-p,A-b).normalize();else if(s[4].setComponents(c-l,f-d,m-p,A-b).normalize(),e===rn)s[5].setComponents(c+l,f+d,m+p,A+b).normalize();else if(e===qi)s[5].setComponents(l,d,p,b).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),mi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),mi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(mi)}intersectsSprite(t){mi.center.set(0,0,0);let e=_d.distanceTo(t.center);return mi.radius=.7071067811865476+e,mi.applyMatrix4(t.matrixWorld),this.intersectsSphere(mi)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let a=0;a<6;a++)if(e[a].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Gr.x=s.normal.x>0?t.max.x:t.min.x,Gr.y=s.normal.y>0?t.max.y:t.min.y,Gr.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Gr)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}},Oc=new fe,ha=class i{constructor(){this.coordinateSystem=rn,this._frustums=[],this._count=0}setFromArrayCamera(t){let e=t.cameras,n=this._frustums;for(let s=0;s<e.length;s++){let a=e[s];Oc.multiplyMatrices(a.projectionMatrix,a.matrixWorldInverse),n[s]===void 0&&(n[s]=new ni),n[s].setFromProjectionMatrix(Oc,a.coordinateSystem,a.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){let e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;let e=this._frustums,n=t._frustums;for(let s=0;s<t._count;s++)e[s]===void 0&&(e[s]=new ni),e[s].copy(n[s]);return this._count=t._count,this}clone(){return new i().copy(this)}};var Os=class extends Je{constructor(t=[],e=Ti,n,s,a,r,o,l,c,h){super(t,e,n,s,a,r,o,l,c,h),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},xi=class extends Je{constructor(t,e,n,s,a,r,o,l,c){super(t,e,n,s,a,r,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}};var Hn=class extends Je{constructor(t,e,n=mn,s,a,r,o=De,l=De,c,h=$n,u=1){if(h!==$n&&h!==Wn)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let d={width:t,height:e,depth:u};super(d,s,a,r,o,l,h,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Ji(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}},Bs=class extends Hn{constructor(t,e=mn,n=Ti,s,a,r=De,o=De,l,c=$n){let h={width:t,height:t,depth:1},u=[h,h,h,h,h,h];super(t,t,e,n,s,a,r,o,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}},ks=class extends Je{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}},En=class i extends pn{constructor(t=1,e=1,n=1,s=1,a=1,r=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:a,depthSegments:r};let o=this;s=Math.floor(s),a=Math.floor(a),r=Math.floor(r);let l=[],c=[],h=[],u=[],d=0,f=0;_("z","y","x",-1,-1,n,e,t,r,a,0),_("z","y","x",1,-1,n,e,-t,r,a,1),_("x","z","y",1,1,t,n,e,s,r,2),_("x","z","y",1,-1,t,n,-e,s,r,3),_("x","y","z",1,-1,t,e,n,s,a,4),_("x","y","z",-1,-1,t,e,-n,s,a,5),this.setIndex(l),this.setAttribute("position",new Ce(c,3)),this.setAttribute("normal",new Ce(h,3)),this.setAttribute("uv",new Ce(u,2));function _(x,p,m,M,w,b,A,E,g,S,O){let I=b/g,U=A/S,k=b/2,V=A/2,L=E/2,F=g+1,X=S+1,H=0,rt=0,q=new B;for(let tt=0;tt<X;tt++){let it=tt*U-V;for(let wt=0;wt<F;wt++){let Ut=wt*I-k;q[x]=Ut*M,q[p]=it*w,q[m]=L,c.push(q.x,q.y,q.z),q[x]=0,q[p]=0,q[m]=E>0?1:-1,h.push(q.x,q.y,q.z),u.push(wt/g),u.push(1-tt/S),H+=1}}for(let tt=0;tt<S;tt++)for(let it=0;it<g;it++){let wt=d+it+F*tt,Ut=d+it+F*(tt+1),J=d+(it+1)+F*(tt+1),ft=d+(it+1)+F*tt;l.push(wt,Ut,ft),l.push(Ut,J,ft),rt+=6}o.addGroup(f,rt,O),f+=rt,d+=H}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};var ua=class i extends pn{constructor(t=1,e=1,n=1,s=32,a=1,r=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:a,openEnded:r,thetaStart:o,thetaLength:l};let c=this;s=Math.floor(s),a=Math.floor(a);let h=[],u=[],d=[],f=[],_=0,x=[],p=n/2,m=0;M(),r===!1&&(t>0&&w(!0),e>0&&w(!1)),this.setIndex(h),this.setAttribute("position",new Ce(u,3)),this.setAttribute("normal",new Ce(d,3)),this.setAttribute("uv",new Ce(f,2));function M(){let b=new B,A=new B,E=0,g=(e-t)/n;for(let S=0;S<=a;S++){let O=[],I=S/a,U=I*(e-t)+t;for(let k=0;k<=s;k++){let V=k/s,L=V*l+o,F=Math.sin(L),X=Math.cos(L);A.x=U*F,A.y=-I*n+p,A.z=U*X,u.push(A.x,A.y,A.z),b.set(F,g,X).normalize(),d.push(b.x,b.y,b.z),f.push(V,1-I),O.push(_++)}x.push(O)}for(let S=0;S<s;S++)for(let O=0;O<a;O++){let I=x[O][S],U=x[O+1][S],k=x[O+1][S+1],V=x[O][S+1];(t>0||O!==0)&&(h.push(I,U,V),E+=3),(e>0||O!==a-1)&&(h.push(U,k,V),E+=3)}c.addGroup(m,E,0),m+=E}function w(b){let A=_,E=new Mt,g=new B,S=0,O=b===!0?t:e,I=b===!0?1:-1;for(let k=1;k<=s;k++)u.push(0,p*I,0),d.push(0,I,0),f.push(.5,.5),_++;let U=_;for(let k=0;k<=s;k++){let L=k/s*l+o,F=Math.cos(L),X=Math.sin(L);g.x=O*X,g.y=p*I,g.z=O*F,u.push(g.x,g.y,g.z),d.push(0,I,0),E.x=F*.5+.5,E.y=X*.5*I+.5,f.push(E.x,E.y),_++}for(let k=0;k<s;k++){let V=A+k,L=U+k;b===!0?h.push(L,L+1,V):h.push(L+1,L,V),S+=3}c.addGroup(m,S,b===!0?1:2),m+=S}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},zs=class i extends ua{constructor(t=1,e=1,n=32,s=1,a=!1,r=0,o=Math.PI*2){super(0,t,e,n,s,a,r,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:a,thetaStart:r,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}};var en=class{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){zt("Curve: .getPoint() not implemented.")}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),a=0;e.push(0);for(let r=1;r<=t;r++)n=this.getPoint(r/t),a+=n.distanceTo(s),e.push(a),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){let n=this.getLengths(),s=0,a=n.length,r;e?r=e:r=t*n[a-1];let o=0,l=a-1,c;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),c=n[s]-r,c<0)o=s+1;else if(c>0)l=s-1;else{l=s;break}if(s=l,n[s]===r)return s/(a-1);let h=n[s],d=n[s+1]-h,f=(r-h)/d;return(s+f)/(a-1)}getTangent(t,e){let s=t-1e-4,a=t+1e-4;s<0&&(s=0),a>1&&(a=1);let r=this.getPoint(s),o=this.getPoint(a),l=e||(r.isVector2?new Mt:new B);return l.copy(o).sub(r).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){let n=new B,s=[],a=[],r=[],o=new B,l=new fe;for(let f=0;f<=t;f++){let _=f/t;s[f]=this.getTangentAt(_,new B)}a[0]=new B,r[0]=new B;let c=Number.MAX_VALUE,h=Math.abs(s[0].x),u=Math.abs(s[0].y),d=Math.abs(s[0].z);h<=c&&(c=h,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),d<=c&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),a[0].crossVectors(s[0],o),r[0].crossVectors(s[0],a[0]);for(let f=1;f<=t;f++){if(a[f]=a[f-1].clone(),r[f]=r[f-1].clone(),o.crossVectors(s[f-1],s[f]),o.length()>Number.EPSILON){o.normalize();let _=Math.acos(te(s[f-1].dot(s[f]),-1,1));a[f].applyMatrix4(l.makeRotationAxis(o,_))}r[f].crossVectors(s[f],a[f])}if(e===!0){let f=Math.acos(te(a[0].dot(a[t]),-1,1));f/=t,s[0].dot(o.crossVectors(a[0],a[t]))>0&&(f=-f);for(let _=1;_<=t;_++)a[_].applyMatrix4(l.makeRotationAxis(s[_],f*_)),r[_].crossVectors(s[_],a[_])}return{tangents:s,normals:a,binormals:r}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){let t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}},ji=class extends en{constructor(t=0,e=0,n=1,s=1,a=0,r=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=a,this.aEndAngle=r,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new Mt){let n=e,s=Math.PI*2,a=this.aEndAngle-this.aStartAngle,r=Math.abs(a)<Number.EPSILON;for(;a<0;)a+=s;for(;a>s;)a-=s;a<Number.EPSILON&&(r?a=0:a=s),this.aClockwise===!0&&!r&&(a===s?a=-s:a=a-s);let o=this.aStartAngle+t*a,l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let h=Math.cos(this.aRotation),u=Math.sin(this.aRotation),d=l-this.aX,f=c-this.aY;l=d*h-f*u+this.aX,c=d*u+f*h+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},da=class extends ji{constructor(t,e,n,s,a,r){super(t,e,n,n,s,a,r),this.isArcCurve=!0,this.type="ArcCurve"}};function Gl(){let i=0,t=0,e=0,n=0;function s(a,r,o,l){i=a,t=o,e=-3*a+3*r-2*o-l,n=2*a-2*r+o+l}return{initCatmullRom:function(a,r,o,l,c){s(r,o,c*(o-a),c*(l-r))},initNonuniformCatmullRom:function(a,r,o,l,c,h,u){let d=(r-a)/c-(o-a)/(c+h)+(o-r)/h,f=(o-r)/h-(l-r)/(h+u)+(l-o)/u;d*=h,f*=h,s(r,o,d,f)},calc:function(a){let r=a*a,o=r*a;return i+t*a+e*r+n*o}}}var Bc=new B,kc=new B,jo=new Gl,tl=new Gl,el=new Gl,fa=class extends en{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new B){let n=e,s=this.points,a=s.length,r=(a-(this.closed?0:1))*t,o=Math.floor(r),l=r-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/a)+1)*a:l===0&&o===a-1&&(o=a-2,l=1);let c,h;this.closed||o>0?c=s[(o-1)%a]:(kc.subVectors(s[0],s[1]).add(s[0]),c=kc);let u=s[o%a],d=s[(o+1)%a];if(this.closed||o+2<a?h=s[(o+2)%a]:(Bc.subVectors(s[a-1],s[a-2]).add(s[a-1]),h=Bc),this.curveType==="centripetal"||this.curveType==="chordal"){let f=this.curveType==="chordal"?.5:.25,_=Math.pow(c.distanceToSquared(u),f),x=Math.pow(u.distanceToSquared(d),f),p=Math.pow(d.distanceToSquared(h),f);x<1e-4&&(x=1),_<1e-4&&(_=x),p<1e-4&&(p=x),jo.initNonuniformCatmullRom(c.x,u.x,d.x,h.x,_,x,p),tl.initNonuniformCatmullRom(c.y,u.y,d.y,h.y,_,x,p),el.initNonuniformCatmullRom(c.z,u.z,d.z,h.z,_,x,p)}else this.curveType==="catmullrom"&&(jo.initCatmullRom(c.x,u.x,d.x,h.x,this.tension),tl.initCatmullRom(c.y,u.y,d.y,h.y,this.tension),el.initCatmullRom(c.z,u.z,d.z,h.z,this.tension));return n.set(jo.calc(l),tl.calc(l),el.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new B().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function zc(i,t,e,n,s){let a=(n-t)*.5,r=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+a+r)*l+(-3*e+3*n-2*a-r)*o+a*i+e}function xd(i,t){let e=1-i;return e*e*t}function yd(i,t){return 2*(1-i)*i*t}function vd(i,t){return i*i*t}function ws(i,t,e,n){return xd(i,t)+yd(i,e)+vd(i,n)}function Md(i,t){let e=1-i;return e*e*e*t}function Sd(i,t){let e=1-i;return 3*e*e*i*t}function bd(i,t){return 3*(1-i)*i*i*t}function wd(i,t){return i*i*i*t}function Ts(i,t,e,n,s){return Md(i,t)+Sd(i,e)+bd(i,n)+wd(i,s)}var $s=class extends en{constructor(t=new Mt,e=new Mt,n=new Mt,s=new Mt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new Mt){let n=e,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return n.set(Ts(t,s.x,a.x,r.x,o.x),Ts(t,s.y,a.y,r.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},pa=class extends en{constructor(t=new B,e=new B,n=new B,s=new B){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new B){let n=e,s=this.v0,a=this.v1,r=this.v2,o=this.v3;return n.set(Ts(t,s.x,a.x,r.x,o.x),Ts(t,s.y,a.y,r.y,o.y),Ts(t,s.z,a.z,r.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Gs=class extends en{constructor(t=new Mt,e=new Mt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new Mt){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new Mt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ma=class extends en{constructor(t=new B,e=new B){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new B){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new B){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Hs=class extends en{constructor(t=new Mt,e=new Mt,n=new Mt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new Mt){let n=e,s=this.v0,a=this.v1,r=this.v2;return n.set(ws(t,s.x,a.x,r.x),ws(t,s.y,a.y,r.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ga=class extends en{constructor(t=new B,e=new B,n=new B){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new B){let n=e,s=this.v0,a=this.v1,r=this.v2;return n.set(ws(t,s.x,a.x,r.x),ws(t,s.y,a.y,r.y),ws(t,s.z,a.z,r.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Vs=class extends en{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new Mt){let n=e,s=this.points,a=(s.length-1)*t,r=Math.floor(a),o=a-r,l=s[r===0?r:r-1],c=s[r],h=s[r>s.length-2?s.length-1:r+1],u=s[r>s.length-3?s.length-1:r+2];return n.set(zc(o,l.x,c.x,h.x,u.x),zc(o,l.y,c.y,h.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new Mt().fromArray(s))}return this}},ol=Object.freeze({__proto__:null,ArcCurve:da,CatmullRomCurve3:fa,CubicBezierCurve:$s,CubicBezierCurve3:pa,EllipseCurve:ji,LineCurve:Gs,LineCurve3:ma,QuadraticBezierCurve:Hs,QuadraticBezierCurve3:ga,SplineCurve:Vs}),_a=class extends en{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new ol[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),a=0;for(;a<s.length;){if(s[a]>=n){let r=s[a]-n,o=this.curves[a],l=o.getLength(),c=l===0?0:1-r/l;return o.getPointAt(c,e)}a++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,a=this.curves;s<a.length;s++){let r=a[s],o=r.isEllipseCurve?t*2:r.isLineCurve||r.isLineCurve3?1:r.isSplineCurve?t*r.points.length:t,l=r.getPoints(o);for(let c=0;c<l.length;c++){let h=l[c];n&&n.equals(h)||(e.push(h),n=h)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this.cacheLengths=null,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new ol[s.type]().fromJSON(s))}return this.cacheLengths=null,this}},Ws=class extends _a{constructor(t){super(),this.type="Path",this.currentPoint=new Mt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new Gs(this.currentPoint.clone(),new Mt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let a=new Hs(this.currentPoint.clone(),new Mt(t,e),new Mt(n,s));return this.curves.push(a),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,a,r){let o=new $s(this.currentPoint.clone(),new Mt(t,e),new Mt(n,s),new Mt(a,r));return this.curves.push(o),this.currentPoint.set(a,r),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new Vs(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,a,r){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,a,r),this}absarc(t,e,n,s,a,r){return this.absellipse(t,e,n,n,s,a,r),this}ellipse(t,e,n,s,a,r,o,l){let c=this.currentPoint.x,h=this.currentPoint.y;return this.absellipse(t+c,e+h,n,s,a,r,o,l),this}absellipse(t,e,n,s,a,r,o,l){let c=new ji(t,e,n,s,a,r,o,l);if(this.curves.length>0){let u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);let h=c.getPoint(1);return this.currentPoint.copy(h),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}},yi=class extends Ws{constructor(t){super(t),this.uuid=Ai(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Ws().fromJSON(s))}return this}};function Td(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,a=Fh(i,0,s,e,!0),r=[];if(!a||a.next===a.prev)return r;let o,l,c;if(n&&(a=Ld(i,t,a,e)),i.length>80*e){o=i[0],l=i[1];let h=o,u=l;for(let d=e;d<s;d+=e){let f=i[d],_=i[d+1];f<o&&(o=f),_<l&&(l=_),f>h&&(h=f),_>u&&(u=_)}c=Math.max(h-o,u-l),c=c!==0?32767/c:0}return Xs(a,r,e,o,l,c,0),r}function Fh(i,t,e,n,s){let a;if(s===$d(i,t,e,n)>0)for(let r=t;r<e;r+=n)a=$c(r/n|0,i[r],i[r+1],a);else for(let r=e-n;r>=t;r-=n)a=$c(r/n|0,i[r],i[r+1],a);return a&&ts(a,a.next)&&(Zs(a),a=a.next),a}function vi(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(ts(e,e.next)||be(e.prev,e,e.next)===0)){if(Zs(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Xs(i,t,e,n,s,a,r){if(!i)return;!r&&a&&Ud(i,n,s,a);let o=i;for(;i.prev!==i.next;){let l=i.prev,c=i.next;if(a?Ad(i,n,s,a):Ed(i)){t.push(l.i,i.i,c.i),Zs(i),i=c.next,o=c.next;continue}if(i=c,i===o){r?r===1?(i=Cd(vi(i),t),Xs(i,t,e,n,s,a,2)):r===2&&Rd(i,t,e,n,s,a):Xs(vi(i),t,e,n,s,a,1);break}}}function Ed(i){let t=i.prev,e=i,n=i.next;if(be(t,e,n)>=0)return!1;let s=t.x,a=e.x,r=n.x,o=t.y,l=e.y,c=n.y,h=Math.min(s,a,r),u=Math.min(o,l,c),d=Math.max(s,a,r),f=Math.max(o,l,c),_=n.next;for(;_!==t;){if(_.x>=h&&_.x<=d&&_.y>=u&&_.y<=f&&Ms(s,o,a,l,r,c,_.x,_.y)&&be(_.prev,_,_.next)>=0)return!1;_=_.next}return!0}function Ad(i,t,e,n){let s=i.prev,a=i,r=i.next;if(be(s,a,r)>=0)return!1;let o=s.x,l=a.x,c=r.x,h=s.y,u=a.y,d=r.y,f=Math.min(o,l,c),_=Math.min(h,u,d),x=Math.max(o,l,c),p=Math.max(h,u,d),m=ll(f,_,t,e,n),M=ll(x,p,t,e,n),w=i.prevZ,b=i.nextZ;for(;w&&w.z>=m&&b&&b.z<=M;){if(w.x>=f&&w.x<=x&&w.y>=_&&w.y<=p&&w!==s&&w!==r&&Ms(o,h,l,u,c,d,w.x,w.y)&&be(w.prev,w,w.next)>=0||(w=w.prevZ,b.x>=f&&b.x<=x&&b.y>=_&&b.y<=p&&b!==s&&b!==r&&Ms(o,h,l,u,c,d,b.x,b.y)&&be(b.prev,b,b.next)>=0))return!1;b=b.nextZ}for(;w&&w.z>=m;){if(w.x>=f&&w.x<=x&&w.y>=_&&w.y<=p&&w!==s&&w!==r&&Ms(o,h,l,u,c,d,w.x,w.y)&&be(w.prev,w,w.next)>=0)return!1;w=w.prevZ}for(;b&&b.z<=M;){if(b.x>=f&&b.x<=x&&b.y>=_&&b.y<=p&&b!==s&&b!==r&&Ms(o,h,l,u,c,d,b.x,b.y)&&be(b.prev,b,b.next)>=0)return!1;b=b.nextZ}return!0}function Cd(i,t){let e=i;do{let n=e.prev,s=e.next.next;!ts(n,s)&&Bh(n,e,e.next,s)&&qs(n,s)&&qs(s,n)&&(t.push(n.i,e.i,s.i),Zs(e),Zs(e.next),e=i=s),e=e.next}while(e!==i);return vi(e)}function Rd(i,t,e,n,s,a){let r=i;do{let o=r.next.next;for(;o!==r.prev;){if(r.i!==o.i&&Bd(r,o)){let l=kh(r,o);r=vi(r,r.next),l=vi(l,l.next),Xs(r,t,e,n,s,a,0),Xs(l,t,e,n,s,a,0);return}o=o.next}r=r.next}while(r!==i)}function Ld(i,t,e,n){let s=[];for(let a=0,r=t.length;a<r;a++){let o=t[a]*n,l=a<r-1?t[a+1]*n:i.length,c=Fh(i,o,l,n,!1);c===c.next&&(c.steiner=!0),s.push(Od(c))}s.sort(Id);for(let a=0;a<s.length;a++)e=Pd(s[a],e);return e}function Id(i,t){let e=i.x-t.x;if(e===0&&(e=i.y-t.y,e===0)){let n=(i.next.y-i.y)/(i.next.x-i.x),s=(t.next.y-t.y)/(t.next.x-t.x);e=n-s}return e}function Pd(i,t){let e=Dd(i,t);if(!e)return t;let n=kh(e,i);return vi(n,n.next),vi(e,e.next)}function Dd(i,t){let e=t,n=i.x,s=i.y,a=-1/0,r;if(ts(i,e))return e;do{if(ts(i,e.next))return e.next;if(s<=e.y&&s>=e.next.y&&e.next.y!==e.y){let u=e.x+(s-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>a&&(a=u,r=e.x<e.next.x?e:e.next,u===n))return r}e=e.next}while(e!==t);if(!r)return null;let o=r,l=r.x,c=r.y,h=1/0;e=r;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Oh(s<c?n:a,s,l,c,s<c?a:n,s,e.x,e.y)){let u=Math.abs(s-e.y)/(n-e.x);qs(e,i)&&(u<h||u===h&&(e.x>r.x||e.x===r.x&&Nd(r,e)))&&(r=e,h=u)}e=e.next}while(e!==o);return r}function Nd(i,t){return be(i.prev,i,t.prev)<0&&be(t.next,i,i.next)<0}function Ud(i,t,e,n){let s=i;do s.z===0&&(s.z=ll(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,Fd(s)}function Fd(i){let t,e=1;do{let n=i,s;i=null;let a=null;for(t=0;n;){t++;let r=n,o=0;for(let c=0;c<e&&(o++,r=r.nextZ,!!r);c++);let l=e;for(;o>0||l>0&&r;)o!==0&&(l===0||!r||n.z<=r.z)?(s=n,n=n.nextZ,o--):(s=r,r=r.nextZ,l--),a?a.nextZ=s:i=s,s.prevZ=a,a=s;n=r}a.nextZ=null,e*=2}while(t>1);return i}function ll(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function Od(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Oh(i,t,e,n,s,a,r,o){return(s-r)*(t-o)>=(i-r)*(a-o)&&(i-r)*(n-o)>=(e-r)*(t-o)&&(e-r)*(a-o)>=(s-r)*(n-o)}function Ms(i,t,e,n,s,a,r,o){return!(i===r&&t===o)&&Oh(i,t,e,n,s,a,r,o)}function Bd(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!kd(i,t)&&(qs(i,t)&&qs(t,i)&&zd(i,t)&&(be(i.prev,i,t.prev)||be(i,t.prev,t))||ts(i,t)&&be(i.prev,i,i.next)>0&&be(t.prev,t,t.next)>0)}function be(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function ts(i,t){return i.x===t.x&&i.y===t.y}function Bh(i,t,e,n){let s=Vr(be(i,t,e)),a=Vr(be(i,t,n)),r=Vr(be(e,n,i)),o=Vr(be(e,n,t));return!!(s!==a&&r!==o||s===0&&Hr(i,e,t)||a===0&&Hr(i,n,t)||r===0&&Hr(e,i,n)||o===0&&Hr(e,t,n))}function Hr(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Vr(i){return i>0?1:i<0?-1:0}function kd(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&Bh(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function qs(i,t){return be(i.prev,i,i.next)<0?be(i,t,i.next)>=0&&be(i,i.prev,t)>=0:be(i,t,i.prev)<0||be(i,i.next,t)<0}function zd(i,t){let e=i,n=!1,s=(i.x+t.x)/2,a=(i.y+t.y)/2;do e.y>a!=e.next.y>a&&e.next.y!==e.y&&s<(e.next.x-e.x)*(a-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function kh(i,t){let e=cl(i.i,i.x,i.y),n=cl(t.i,t.x,t.y),s=i.next,a=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,a.next=n,n.prev=a,n}function $c(i,t,e,n){let s=cl(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Zs(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function cl(i,t,e){return{i,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function $d(i,t,e,n){let s=0;for(let a=t,r=e-n;a<e;a+=n)s+=(i[r]-i[a])*(i[a+1]+i[r+1]),r=a;return s}var hl=class{static triangulate(t,e,n=2){return Td(t,e,n)}},Mn=class i{static area(t){let e=t.length,n=0;for(let s=e-1,a=0;a<e;s=a++)n+=t[s].x*t[a].y-t[a].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],a=[];Gc(t),Hc(n,t);let r=t.length;e.forEach(Gc);for(let l=0;l<e.length;l++)s.push(r),r+=e[l].length,Hc(n,e[l]);let o=hl.triangulate(n,s);for(let l=0;l<o.length;l+=3)a.push(o.slice(l,l+3));return a}};function Gc(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function Hc(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Ys=class i extends pn{constructor(t=new yi([new Mt(.5,.5),new Mt(-.5,.5),new Mt(-.5,-.5),new Mt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],a=[];for(let o=0,l=t.length;o<l;o++){let c=t[o];r(c)}this.setAttribute("position",new Ce(s,3)),this.setAttribute("uv",new Ce(a,2)),this.computeVertexNormals();function r(o){let l=[],c=e.curveSegments!==void 0?e.curveSegments:12,h=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1,d=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,_=e.bevelSize!==void 0?e.bevelSize:f-.1,x=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,m=e.extrudePath,M=e.UVGenerator!==void 0?e.UVGenerator:Gd,w,b=!1,A,E,g,S;if(m){w=m.getSpacedPoints(h),b=!0,d=!1;let st=m.isCatmullRomCurve3?m.closed:!1;A=m.computeFrenetFrames(h,st),E=new B,g=new B,S=new B}d||(p=0,f=0,_=0,x=0);let O=o.extractPoints(c),I=O.shape,U=O.holes;if(!Mn.isClockWise(I)){I=I.reverse();for(let st=0,ct=U.length;st<ct;st++){let ut=U[st];Mn.isClockWise(ut)&&(U[st]=ut.reverse())}}function V(st){let ut=10000000000000001e-36,Rt=st[0];for(let xt=1;xt<=st.length;xt++){let Vt=xt%st.length,Dt=st[Vt],qt=Dt.x-Rt.x,ne=Dt.y-Rt.y,se=qt*qt+ne*ne,D=Math.max(Math.abs(Dt.x),Math.abs(Dt.y),Math.abs(Rt.x),Math.abs(Rt.y)),we=ut*D*D;if(se<=we){st.splice(Vt,1),xt--;continue}Rt=Dt}}V(I),U.forEach(V);let L=U.length,F=I;for(let st=0;st<L;st++){let ct=U[st];I=I.concat(ct)}function X(st,ct,ut){return ct||Gt("ExtrudeGeometry: vec does not exist"),st.clone().addScaledVector(ct,ut)}let H=I.length;function rt(st,ct,ut){let Rt,xt,Vt,Dt=st.x-ct.x,qt=st.y-ct.y,ne=ut.x-st.x,se=ut.y-st.y,D=Dt*Dt+qt*qt,we=Dt*se-qt*ne;if(Math.abs(we)>Number.EPSILON){let Jt=Math.sqrt(D),ie=Math.sqrt(ne*ne+se*se),ht=ct.x-qt/Jt,ge=ct.y+Dt/Jt,Ft=ut.x-se/ie,$t=ut.y+ne/ie,T=((Ft-ht)*se-($t-ge)*ne)/(Dt*se-qt*ne);Rt=ht+Dt*T-st.x,xt=ge+qt*T-st.y;let y=Rt*Rt+xt*xt;if(y<=2)return new Mt(Rt,xt);Vt=Math.sqrt(y/2)}else{let Jt=!1;Dt>Number.EPSILON?ne>Number.EPSILON&&(Jt=!0):Dt<-Number.EPSILON?ne<-Number.EPSILON&&(Jt=!0):Math.sign(qt)===Math.sign(se)&&(Jt=!0),Jt?(Rt=-qt,xt=Dt,Vt=Math.sqrt(D)):(Rt=Dt,xt=qt,Vt=Math.sqrt(D/2))}return new Mt(Rt/Vt,xt/Vt)}let q=[];for(let st=0,ct=F.length,ut=ct-1,Rt=st+1;st<ct;st++,ut++,Rt++)ut===ct&&(ut=0),Rt===ct&&(Rt=0),q[st]=rt(F[st],F[ut],F[Rt]);let tt=[],it,wt=q.concat();for(let st=0,ct=L;st<ct;st++){let ut=U[st];it=[];for(let Rt=0,xt=ut.length,Vt=xt-1,Dt=Rt+1;Rt<xt;Rt++,Vt++,Dt++)Vt===xt&&(Vt=0),Dt===xt&&(Dt=0),it[Rt]=rt(ut[Rt],ut[Vt],ut[Dt]);tt.push(it),wt=wt.concat(it)}let Ut;if(p===0)Ut=Mn.triangulateShape(F,U);else{let st=[],ct=[];for(let ut=0;ut<p;ut++){let Rt=ut/p,xt=f*Math.cos(Rt*Math.PI/2),Vt=_*Math.sin(Rt*Math.PI/2)+x;for(let Dt=0,qt=F.length;Dt<qt;Dt++){let ne=X(F[Dt],q[Dt],Vt);Bt(ne.x,ne.y,-xt),Rt===0&&st.push(ne)}for(let Dt=0,qt=L;Dt<qt;Dt++){let ne=U[Dt];it=tt[Dt];let se=[];for(let D=0,we=ne.length;D<we;D++){let Jt=X(ne[D],it[D],Vt);Bt(Jt.x,Jt.y,-xt),Rt===0&&se.push(Jt)}Rt===0&&ct.push(se)}}Ut=Mn.triangulateShape(st,ct)}let J=Ut.length,ft=_+x;for(let st=0;st<H;st++){let ct=d?X(I[st],wt[st],ft):I[st];b?(g.copy(A.normals[0]).multiplyScalar(ct.x),E.copy(A.binormals[0]).multiplyScalar(ct.y),S.copy(w[0]).add(g).add(E),Bt(S.x,S.y,S.z)):Bt(ct.x,ct.y,0)}for(let st=1;st<=h;st++)for(let ct=0;ct<H;ct++){let ut=d?X(I[ct],wt[ct],ft):I[ct];b?(g.copy(A.normals[st]).multiplyScalar(ut.x),E.copy(A.binormals[st]).multiplyScalar(ut.y),S.copy(w[st]).add(g).add(E),Bt(S.x,S.y,S.z)):Bt(ut.x,ut.y,u/h*st)}for(let st=p-1;st>=0;st--){let ct=st/p,ut=f*Math.cos(ct*Math.PI/2),Rt=_*Math.sin(ct*Math.PI/2)+x;for(let xt=0,Vt=F.length;xt<Vt;xt++){let Dt=X(F[xt],q[xt],Rt);Bt(Dt.x,Dt.y,u+ut)}for(let xt=0,Vt=U.length;xt<Vt;xt++){let Dt=U[xt];it=tt[xt];for(let qt=0,ne=Dt.length;qt<ne;qt++){let se=X(Dt[qt],it[qt],Rt);b?Bt(se.x,se.y+w[h-1].y,w[h-1].x+ut):Bt(se.x,se.y,u+ut)}}}At(),Ot();function At(){let st=s.length/3;if(d){let ct=0,ut=H*ct;for(let Rt=0;Rt<J;Rt++){let xt=Ut[Rt];de(xt[2]+ut,xt[1]+ut,xt[0]+ut)}ct=h+p*2,ut=H*ct;for(let Rt=0;Rt<J;Rt++){let xt=Ut[Rt];de(xt[0]+ut,xt[1]+ut,xt[2]+ut)}}else{for(let ct=0;ct<J;ct++){let ut=Ut[ct];de(ut[2],ut[1],ut[0])}for(let ct=0;ct<J;ct++){let ut=Ut[ct];de(ut[0]+H*h,ut[1]+H*h,ut[2]+H*h)}}n.addGroup(st,s.length/3-st,0)}function Ot(){let st=s.length/3,ct=0;bt(F,ct),ct+=F.length;for(let ut=0,Rt=U.length;ut<Rt;ut++){let xt=U[ut];bt(xt,ct),ct+=xt.length}n.addGroup(st,s.length/3-st,1)}function bt(st,ct){let ut=st.length;for(;--ut>=0;){let Rt=ut,xt=ut-1;xt<0&&(xt=st.length-1);for(let Vt=0,Dt=h+p*2;Vt<Dt;Vt++){let qt=H*Vt,ne=H*(Vt+1),se=ct+Rt+qt,D=ct+xt+qt,we=ct+xt+ne,Jt=ct+Rt+ne;kt(se,D,we,Jt)}}}function Bt(st,ct,ut){l.push(st),l.push(ct),l.push(ut)}function de(st,ct,ut){Yt(st),Yt(ct),Yt(ut);let Rt=s.length/3,xt=M.generateTopUV(n,s,Rt-3,Rt-2,Rt-1);Kt(xt[0]),Kt(xt[1]),Kt(xt[2])}function kt(st,ct,ut,Rt){Yt(st),Yt(ct),Yt(Rt),Yt(ct),Yt(ut),Yt(Rt);let xt=s.length/3,Vt=M.generateSideWallUV(n,s,xt-6,xt-3,xt-2,xt-1);Kt(Vt[0]),Kt(Vt[1]),Kt(Vt[3]),Kt(Vt[1]),Kt(Vt[2]),Kt(Vt[3])}function Yt(st){s.push(l[st*3+0]),s.push(l[st*3+1]),s.push(l[st*3+2])}function Kt(st){a.push(st.x),a.push(st.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Hd(e,n,t)}static fromJSON(t,e){let n=[];for(let a=0,r=t.shapes.length;a<r;a++){let o=e[t.shapes[a]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new ol[s.type]().fromJSON(s)),new i(n,t.options)}},Gd={generateTopUV:function(i,t,e,n,s){let a=t[e*3],r=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[s*3],h=t[s*3+1];return[new Mt(a,r),new Mt(o,l),new Mt(c,h)]},generateSideWallUV:function(i,t,e,n,s,a){let r=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],h=t[n*3+1],u=t[n*3+2],d=t[s*3],f=t[s*3+1],_=t[s*3+2],x=t[a*3],p=t[a*3+1],m=t[a*3+2];return Math.abs(o-h)<Math.abs(r-c)?[new Mt(r,1-l),new Mt(c,1-u),new Mt(d,1-_),new Mt(x,1-m)]:[new Mt(o,1-l),new Mt(h,1-u),new Mt(f,1-_),new Mt(p,1-m)]}};function Hd(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let a=i[n];e.shapes.push(a.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var ii=class i extends pn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let a=t/2,r=e/2,o=Math.floor(n),l=Math.floor(s),c=o+1,h=l+1,u=t/o,d=e/l,f=[],_=[],x=[],p=[];for(let m=0;m<h;m++){let M=m*d-r;for(let w=0;w<c;w++){let b=w*u-a;_.push(b,-M,0),x.push(0,0,1),p.push(w/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let M=0;M<o;M++){let w=M+c*m,b=M+c*(m+1),A=M+1+c*(m+1),E=M+1+c*m;f.push(w,b,E),f.push(b,A,E)}this.setIndex(f),this.setAttribute("position",new Ce(_,3)),this.setAttribute("normal",new Ce(x,3)),this.setAttribute("uv",new Ce(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}};var Js=class i extends pn{constructor(t=new yi([new Mt(0,.5),new Mt(-.5,-.5),new Mt(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],a=[],r=[],o=0,l=0;if(Array.isArray(t)===!1)c(t);else for(let h=0;h<t.length;h++)c(t[h]),this.addGroup(o,l,h),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Ce(s,3)),this.setAttribute("normal",new Ce(a,3)),this.setAttribute("uv",new Ce(r,2));function c(h){let u=s.length/3,d=h.extractPoints(e),f=d.shape,_=d.holes;Mn.isClockWise(f)===!1&&(f=f.reverse());for(let p=0,m=_.length;p<m;p++){let M=_[p];Mn.isClockWise(M)===!0&&(_[p]=M.reverse())}let x=Mn.triangulateShape(f,_);for(let p=0,m=_.length;p<m;p++){let M=_[p];f=f.concat(M)}for(let p=0,m=f.length;p<m;p++){let M=f[p];s.push(M.x,M.y,0),a.push(0,0,1),r.push(M.x,M.y)}for(let p=0,m=x.length;p<m;p++){let M=x[p],w=M[0]+u,b=M[1]+u,A=M[2]+u;n.push(w,b,A),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return Vd(e,t)}static fromJSON(t,e){let n=[];for(let s=0,a=t.shapes.length;s<a;s++){let r=e[t.shapes[s]];n.push(r)}return new i(n,t.curveSegments)}};function Vd(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}function Ri(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];if(Vc(s))s.isRenderTargetTexture?(zt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone();else if(Array.isArray(s))if(Vc(s[0])){let a=[];for(let r=0,o=s.length;r<o;r++)a[r]=s[r].clone();t[e][n]=a}else t[e][n]=s.slice();else t[e][n]=s}}return t}function We(i){let t={};for(let e=0;e<i.length;e++){let n=Ri(i[e]);for(let s in n)t[s]=n[s]}return t}function Vc(i){return i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)}function Wd(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function Hl(i){let t=i.getRenderTarget();return t===null?i.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}var zh={clone:Ri,merge:We},Xd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,qd=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,An=class extends Gn{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Xd,this.fragmentShader=qd,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ri(t.uniforms),this.uniformsGroups=Wd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let r=this.uniforms[s].value;r&&r.isTexture?e.uniforms[s]={type:"t",value:r.toJSON(t).uuid}:r&&r.isColor?e.uniforms[s]={type:"c",value:r.getHex()}:r&&r.isVector2?e.uniforms[s]={type:"v2",value:r.toArray()}:r&&r.isVector3?e.uniforms[s]={type:"v3",value:r.toArray()}:r&&r.isVector4?e.uniforms[s]={type:"v4",value:r.toArray()}:r&&r.isMatrix3?e.uniforms[s]={type:"m3",value:r.toArray()}:r&&r.isMatrix4?e.uniforms[s]={type:"m4",value:r.toArray()}:e.uniforms[s]={value:r}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(let n in t.uniforms){let s=t.uniforms[n];switch(this.uniforms[n]={},s.type){case"t":this.uniforms[n].value=e[s.value]||null;break;case"c":this.uniforms[n].value=new Zt().setHex(s.value);break;case"v2":this.uniforms[n].value=new Mt().fromArray(s.value);break;case"v3":this.uniforms[n].value=new B().fromArray(s.value);break;case"v4":this.uniforms[n].value=new Me().fromArray(s.value);break;case"m3":this.uniforms[n].value=new Ht().fromArray(s.value);break;case"m4":this.uniforms[n].value=new fe().fromArray(s.value);break;default:this.uniforms[n].value=s.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(let n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}},xa=class extends An{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}},Cn=class extends Gn{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Zt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fr,this.normalScale=new Mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},Mi=class extends Cn{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Mt(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return te(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Zt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Zt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Zt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return gi('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){gi('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}};var Ks=class extends Gn{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Zt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Zt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=fr,this.normalScale=new Mt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new wn,this.combine=Da,this.reflectivity=1,this.envMapIntensity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.envMapIntensity=t.envMapIntensity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}},ya=class extends Gn{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=vh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},va=class extends Gn{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}};function Gi(i,t){return!i||i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function Wr(i){return i!==void 0&&i.inTangents!==void 0&&i.outTangents!==void 0}var si=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],a=e[n-1];n:{t:{let r;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<a)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(a=s,s=e[++n],t<s)break t}r=e.length;break e}if(!(t>=a)){let o=e[1];t<o&&(n=2,a=o);for(let l=n-2;;){if(a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=a,a=e[--n-1],t>=a)break t}r=n,n=0;break e}break n}for(;n<r;){let o=n+r>>>1;t<e[o]?r=o:n=o+1}if(s=e[n],a=e[n-1],a===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,a,s)}return this.interpolate_(n,a,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,a=t*s;for(let r=0;r!==s;++r)e[r]=n[a+r];return e}interpolate_(){throw new Error("THREE.Interpolant: Call to abstract method.")}intervalChanged_(){}},Ma=class extends si{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:sl,endingEnd:sl}}intervalChanged_(t,e,n){let s=this.parameterPositions,a=t-2,r=t+1,o=s[a],l=s[r];if(o===void 0)switch(this.getSettings_().endingStart){case rl:a=t,o=2*e-n;break;case al:a=s.length-2,o=e+s[a]-s[a+1];break;default:a=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case rl:r=t,l=2*n-e;break;case al:r=1,l=n+s[1]-s[0];break;default:r=t-1,l=e}let c=(n-e)*.5,h=this.valueSize;this._weightPrev=c/(e-o),this._weightNext=c/(l-n),this._offsetPrev=a*h,this._offsetNext=r*h}interpolate_(t,e,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this._offsetPrev,u=this._offsetNext,d=this._weightPrev,f=this._weightNext,_=(n-e)/(s-e),x=_*_,p=x*_,m=-d*p+2*d*x-d*_,M=(1+d)*p+(-1.5-2*d)*x+(-.5+d)*_+1,w=(-1-f)*p+(1.5+f)*x+.5*_,b=f*p-f*x;for(let A=0;A!==o;++A)a[A]=m*r[h+A]+M*r[c+A]+w*r[l+A]+b*r[u+A];return a}},Sa=class extends si{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=(n-e)/(s-e),u=1-h;for(let d=0;d!==o;++d)a[d]=r[c+d]*u+r[l+d]*h;return a}},ba=class extends si{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},wa=class extends si{interpolate_(t,e,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=t*o,c=l-o,h=this.inTangents,u=this.outTangents;if(!h||!u){let _=(n-e)/(s-e),x=1-_;for(let p=0;p!==o;++p)a[p]=r[c+p]*x+r[l+p]*_;return a}let d=o*2,f=t-1;for(let _=0;_!==o;++_){let x=r[c+_],p=r[l+_],m=f*d+_*2,M=u[m],w=u[m+1],b=t*d+_*2,A=h[b],E=h[b+1],g=Yd(n,e,M,A,s);a[_]=$h(g,x,w,E,p)}return a}};function $h(i,t,e,n,s){let a=1-i;return a*a*a*t+3*a*a*i*e+3*a*i*i*n+i*i*i*s}function Zd(i,t,e,n,s){let a=1-i;return 3*a*a*(e-t)+6*a*i*(n-e)+3*i*i*(s-n)}function Yd(i,t,e,n,s){let a=(i-t)/(s-t);for(let r=0;r<8;r++){let o=$h(a,t,e,n,s)-i;if(Math.abs(o)<1e-10)break;let l=Zd(a,t,e,n,s);if(Math.abs(l)<1e-10)break;a=Math.max(0,Math.min(1,a-o/l))}return a}var nn=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Gi(e,this.TimeBufferType),this.values=Gi(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Gi(t.times,Array),values:Gi(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s),Wr(t.settings)&&(n.settings={inTangents:Gi(t.settings.inTangents,Array),outTangents:Gi(t.settings.outTangents,Array)})}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ba(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new Sa(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new Ma(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodBezier(t){let e=new wa(this.times,this.values,this.getValueSize(),t);return this.settings&&(e.inTangents=this.settings.inTangents,e.outTangents=this.settings.outTangents),e}setInterpolation(t){let e;switch(t){case Es:e=this.InterpolantFactoryMethodDiscrete;break;case ra:e=this.InterpolantFactoryMethodLinear;break;case Zr:e=this.InterpolantFactoryMethodSmooth;break;case il:e=this.InterpolantFactoryMethodBezier;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return zt("KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Es;case this.InterpolantFactoryMethodLinear:return ra;case this.InterpolantFactoryMethodSmooth:return Zr;case this.InterpolantFactoryMethodBezier:return il}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t;Wr(this.settings)&&(Wc(this.settings.inTangents,t),Wc(this.settings.outTangents,t))}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t;Wr(this.settings)&&(Xc(this.settings.inTangents,t),Xc(this.settings.outTangents,t))}return this}trim(t,e){let n=this.times,s=n.length,a=0,r=s-1;for(;a!==s&&n[a]<t;)++a;for(;r!==-1&&n[r]>e;)--r;if(++r,a!==0||r!==s){a>=r&&(r=Math.max(r,1),a=r-1);let o=this.getValueSize();this.times=n.slice(a,r),this.values=this.values.slice(a*o,r*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(Gt("KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,a=n.length;a===0&&(Gt("KeyframeTrack: Track is empty.",this),t=!1);let r=null;for(let o=0;o!==a;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){Gt("KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(r!==null&&r>l){Gt("KeyframeTrack: Out of order keys.",this,o,l,r),t=!1;break}r=l}if(s!==void 0&&Ou(s))for(let o=0,l=s.length;o!==l;++o){let c=s[o];if(isNaN(c)){Gt("KeyframeTrack: Value is not a valid number.",this,o,c),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Zr,a=t.length-1,r=1;for(let o=1;o<a;++o){let l=!1,c=t[o],h=t[o+1];if(c!==h&&(o!==1||c!==t[0]))if(s)l=!0;else{let u=o*n,d=u-n,f=u+n;for(let _=0;_!==n;++_){let x=e[u+_];if(x!==e[d+_]||x!==e[f+_]){l=!0;break}}}if(l){if(o!==r){t[r]=t[o];let u=o*n,d=r*n;for(let f=0;f!==n;++f)e[d+f]=e[u+f]}++r}}if(a>0){t[r]=t[a];for(let o=a*n,l=r*n,c=0;c!==n;++c)e[l+c]=e[o+c];++r}return r!==t.length?(this.times=t.slice(0,r),this.values=e.slice(0,r*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,Wr(this.settings)&&(s.settings={inTangents:this.settings.inTangents.slice(),outTangents:this.settings.outTangents.slice()}),s}};function Wc(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]+=t}function Xc(i,t){for(let e=0,n=i.length;e!==n;e+=2)i[e]*=t}nn.prototype.ValueTypeName="";nn.prototype.TimeBufferType=Float32Array;nn.prototype.ValueBufferType=Float32Array;nn.prototype.DefaultInterpolation=ra;var ri=class extends nn{constructor(t,e,n){super(t,e,n)}};ri.prototype.ValueTypeName="bool";ri.prototype.ValueBufferType=Array;ri.prototype.DefaultInterpolation=Es;ri.prototype.InterpolantFactoryMethodLinear=void 0;ri.prototype.InterpolantFactoryMethodSmooth=void 0;var Ta=class extends nn{constructor(t,e,n,s){super(t,e,n,s)}};Ta.prototype.ValueTypeName="color";var Ea=class extends nn{constructor(t,e,n,s){super(t,e,n,s)}};Ea.prototype.ValueTypeName="number";var Aa=class extends si{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let a=this.resultBuffer,r=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),c=t*o;for(let h=c+o;c!==h;c+=4)bn.slerpFlat(a,0,r,c-o,r,c,l);return a}},Qs=class extends nn{constructor(t,e,n,s){super(t,e,n,s)}InterpolantFactoryMethodLinear(t){return new Aa(this.times,this.values,this.getValueSize(),t)}};Qs.prototype.ValueTypeName="quaternion";Qs.prototype.InterpolantFactoryMethodSmooth=void 0;var ai=class extends nn{constructor(t,e,n){super(t,e,n)}};ai.prototype.ValueTypeName="string";ai.prototype.ValueBufferType=Array;ai.prototype.DefaultInterpolation=Es;ai.prototype.InterpolantFactoryMethodLinear=void 0;ai.prototype.InterpolantFactoryMethodSmooth=void 0;var Ca=class extends nn{constructor(t,e,n,s){super(t,e,n,s)}};Ca.prototype.ValueTypeName="vector";var Ra=class{constructor(t,e,n){let s=this,a=!1,r=0,o=0,l,c=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this._abortController=null,this.itemStart=function(h){o++,a===!1&&s.onStart!==void 0&&s.onStart(h,r,o),a=!0},this.itemEnd=function(h){r++,s.onProgress!==void 0&&s.onProgress(h,r,o),r===o&&(a=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(h){s.onError!==void 0&&s.onError(h)},this.resolveURL=function(h){return h=h.normalize("NFC"),l?l(h):h},this.setURLModifier=function(h){return l=h,this},this.addHandler=function(h,u){return c.push(h,u),this},this.removeHandler=function(h){let u=c.indexOf(h);return u!==-1&&c.splice(u,2),this},this.getHandler=function(h){for(let u=0,d=c.length;u<d;u+=2){let f=c[u],_=c[u+1];if(f.global&&(f.lastIndex=0),f.test(h))return _}return null},this.abort=function(){return this.abortController.abort(),this._abortController=null,this}}get abortController(){return this._abortController||(this._abortController=new AbortController),this._abortController}},Gh=new Ra,La=class{constructor(t){this.manager=t!==void 0?t:Gh,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={},this.priority="auto",this.cache="default",typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,a){n.load(t,s,e,a)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}setPriority(t){return this.priority=t,this}setCache(t){return this.cache=t,this}abort(){return this}};La.DEFAULT_MATERIAL_NAME="__DEFAULT";var es=class extends Ne{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Zt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}},js=class extends es{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ne.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Zt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){let e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}},nl=new fe,qc=new B,Zc=new B,tr=class{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Mt(512,512),this.mapType=Ke,this.map=null,this.mapPass=null,this.matrix=new fe,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new ni,this._frameExtents=new Mt(1,1),this._viewportCount=1,this._viewports=[new Me(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera;qc.setFromMatrixPosition(t.matrixWorld),e.position.copy(qc),Zc.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Zc),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,s){nl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(nl,t.coordinateSystem,t.reversedDepth);let a=this._frameExtents,r=s?s.z/a.x:1,o=s?s.w/a.y:1,l=s?s.x/a.x:0,c=s?s.y/a.y:0;t.coordinateSystem===qi||t.reversedDepth?e.set(.5*r,0,0,.5*r+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*r,0,0,.5*r+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(nl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}},Xr=new B,qr=new bn,yn=new B,er=class extends Ne{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new fe,this.projectionMatrix=new fe,this.projectionMatrixInverse=new fe,this.coordinateSystem=rn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Xr,qr,yn),yn.x===1&&yn.y===1&&yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xr,qr,yn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Xr,qr,yn),yn.x===1&&yn.y===1&&yn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Xr,qr,yn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}},jn=new B,Yc=new Mt,Jc=new Mt,Ve=class extends er{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Yi*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(Ss*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Yi*2*Math.atan(Math.tan(Ss*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){jn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(jn.x,jn.y).multiplyScalar(-t/jn.z),jn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(jn.x,jn.y).multiplyScalar(-t/jn.z)}getViewSize(t,e){return this.getViewBounds(t,Yc,Jc),e.subVectors(Jc,Yc)}setViewOffset(t,e,n,s,a,r){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(Ss*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,a=-.5*s,r=this.view;if(this.view!==null&&this.view.enabled){let l=r.fullWidth,c=r.fullHeight;a+=r.offsetX*s/l,e-=r.offsetY*n/c,s*=r.width/l,n*=r.height/c}let o=this.filmOffset;o!==0&&(a+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(a,a+s,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}};var ul=class extends tr{constructor(){super(new Ve(90,1,.5,500)),this.isPointLightShadow=!0}},nr=class extends es{constructor(t,e,n=0,s=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=s,this.shadow=new ul}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}},ir=class extends er{constructor(t=-1,e=1,n=1,s=-1,a=.1,r=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=a,this.far=r,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,a,r){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=a,this.view.height=r,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,a=n-t,r=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let c=(this.right-this.left)/this.view.fullWidth/this.zoom,h=(this.top-this.bottom)/this.view.fullHeight/this.zoom;a+=c*this.view.offsetX,r=a+c*this.view.width,o-=h*this.view.offsetY,l=o-h*this.view.height}this.projectionMatrix.makeOrthographic(a,r,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},dl=class extends tr{constructor(){super(new ir(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Si=class extends es{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ne.DEFAULT_UP),this.updateMatrix(),this.target=new Ne,this.shadow=new dl}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){let e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}};var Hi=-90,Vi=1,ns=class extends Ne{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Ve(Hi,Vi,t,e);s.layers=this.layers,this.add(s);let a=new Ve(Hi,Vi,t,e);a.layers=this.layers,this.add(a);let r=new Ve(Hi,Vi,t,e);r.layers=this.layers,this.add(r);let o=new Ve(Hi,Vi,t,e);o.layers=this.layers,this.add(o);let l=new Ve(Hi,Vi,t,e);l.layers=this.layers,this.add(l);let c=new Ve(Hi,Vi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,a,r,o,l]=e;for(let c of e)this.remove(c);if(t===rn)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),a.up.set(0,0,-1),a.lookAt(0,1,0),r.up.set(0,0,1),r.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===qi)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),a.up.set(0,0,1),a.lookAt(0,1,0),r.up.set(0,0,-1),r.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[a,r,o,l,c,h]=this.children,u=t.getRenderTarget(),d=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),_=t.xr.enabled;t.xr.enabled=!1;let x=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,1,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,2,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=x,t.setRenderTarget(n,5,s),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,h),t.setRenderTarget(u,d,f),t.xr.enabled=_,n.texture.needsPMREMUpdate=!0}},Ia=class extends Ve{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}};var Vl="\\[\\]\\.:\\/",Jd=new RegExp("["+Vl+"]","g"),Wl="[^"+Vl+"]",Kd="[^"+Vl.replace("\\.","")+"]",Qd=/((?:WC+[\/:])*)/.source.replace("WC",Wl),jd=/(WCOD+)?/.source.replace("WCOD",Kd),tf=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Wl),ef=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Wl),nf=new RegExp("^"+Qd+jd+tf+ef+"$"),sf=["material","materials","bones","map"],fl=class{constructor(t,e,n){let s=n||ve.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,a=n.length;s!==a;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ve=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Jd,"")}static parseTrackName(t){let e=nf.exec(t);if(e===null)throw new Error("THREE.PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let a=n.nodeName.substring(s+1);sf.indexOf(a)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=a)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("THREE.PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(a){for(let r=0;r<a.length;r++){let o=a[r];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,a=n.length;s!==a;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,a=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){zt("PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let c=e.objectIndex;switch(n){case"materials":if(!t.material){Gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){Gt("PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){Gt("PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let h=0;h<t.length;h++)if(t[h].name===c){c=h;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){Gt("PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){Gt("PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){Gt("PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(c!==void 0){if(t[c]===void 0){Gt("PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[c]}}let r=t[s];if(r===void 0){let c=e.nodeName;Gt("PropertyBinding: Trying to update property for track: "+c+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?o=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(a!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){Gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){Gt("PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[a]!==void 0&&(a=t.morphTargetDictionary[a])}l=this.BindingType.ArrayElement,this.resolvedProperty=r,this.propertyIndex=a}else r.fromArray!==void 0&&r.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=r):Array.isArray(r)?(l=this.BindingType.EntireArray,this.resolvedProperty=r):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ve.Composite=fl;ve.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ve.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ve.prototype.GetterByBindingType=[ve.prototype._getValue_direct,ve.prototype._getValue_array,ve.prototype._getValue_arrayElement,ve.prototype._getValue_toArray];ve.prototype.SetterByBindingTypeAndVersioning=[[ve.prototype._setValue_direct,ve.prototype._setValue_direct_setNeedsUpdate,ve.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_array,ve.prototype._setValue_array_setNeedsUpdate,ve.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_arrayElement,ve.prototype._setValue_arrayElement_setNeedsUpdate,ve.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ve.prototype._setValue_fromArray,ve.prototype._setValue_fromArray_setNeedsUpdate,ve.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var y_=new Float32Array(1);var pl=class{static{this.prototype.isMatrix2=!0}constructor(t,e,n,s){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,s)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,s){let a=this.elements;return a[0]=t,a[2]=e,a[1]=n,a[3]=s,this}};function Xl(i,t,e,n){let s=rf(n);switch(e){case Pl:return i*t;case za:return i*t/s.components*s.byteLength;case $a:return i*t/s.components*s.byteLength;case li:return i*t*2/s.components*s.byteLength;case Ga:return i*t*2/s.components*s.byteLength;case Dl:return i*t*3/s.components*s.byteLength;case _n:return i*t*4/s.components*s.byteLength;case Ha:return i*t*4/s.components*s.byteLength;case or:case lr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case cr:case hr:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case Wa:case qa:return Math.max(i,16)*Math.max(t,8)/4;case Va:case Xa:return Math.max(i,8)*Math.max(t,8)/2;case Za:case Ya:case Ka:case Qa:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*8;case Ja:case ur:case ja:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case to:return Math.floor((i+3)/4)*Math.floor((t+3)/4)*16;case eo:return Math.floor((i+4)/5)*Math.floor((t+3)/4)*16;case no:return Math.floor((i+4)/5)*Math.floor((t+4)/5)*16;case io:return Math.floor((i+5)/6)*Math.floor((t+4)/5)*16;case so:return Math.floor((i+5)/6)*Math.floor((t+5)/6)*16;case ro:return Math.floor((i+7)/8)*Math.floor((t+4)/5)*16;case ao:return Math.floor((i+7)/8)*Math.floor((t+5)/6)*16;case oo:return Math.floor((i+7)/8)*Math.floor((t+7)/8)*16;case lo:return Math.floor((i+9)/10)*Math.floor((t+4)/5)*16;case co:return Math.floor((i+9)/10)*Math.floor((t+5)/6)*16;case ho:return Math.floor((i+9)/10)*Math.floor((t+7)/8)*16;case uo:return Math.floor((i+9)/10)*Math.floor((t+9)/10)*16;case fo:return Math.floor((i+11)/12)*Math.floor((t+9)/10)*16;case po:return Math.floor((i+11)/12)*Math.floor((t+11)/12)*16;case mo:case go:case _o:return Math.ceil(i/4)*Math.ceil(t/4)*16;case xo:case yo:return Math.ceil(i/4)*Math.ceil(t/4)*8;case dr:case vo:return Math.ceil(i/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function rf(i){switch(i){case Ke:case Cl:return{byteLength:1,components:1};case as:case Rl:case gn:return{byteLength:2,components:1};case Ba:case ka:return{byteLength:2,components:4};case mn:case Oa:case on:return{byteLength:4,components:1};case Ll:case Il:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"187"}}));typeof window<"u"&&(window.__THREE__?zt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="187");function hu(){let i=null,t=!1,e=null,n=null;function s(a,r){n=i.requestAnimationFrame(s),e(a,r)}return{start:function(){t!==!0&&e!==null&&i!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i!==null&&i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(a){e=a},setContext:function(a){i=a}}}function of(i){let t=new WeakMap;function e(o,l){let c=o.array,h=o.usage,u=c.byteLength,d=i.createBuffer();i.bindBuffer(l,d),i.bufferData(l,c,h),o.onUploadCallback();let f;if(c instanceof Float32Array)f=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?f=i.HALF_FLOAT:f=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=i.SHORT;else if(c instanceof Uint32Array)f=i.UNSIGNED_INT;else if(c instanceof Int32Array)f=i.INT;else if(c instanceof Int8Array)f=i.BYTE;else if(c instanceof Uint8Array)f=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:u}}function n(o,l,c){let h=l.array,u=l.updateRanges;if(i.bindBuffer(c,o),u.length===0)i.bufferSubData(c,0,h);else{u.sort((f,_)=>f.start-_.start);let d=0;for(let f=1;f<u.length;f++){let _=u[d],x=u[f];x.start<=_.start+_.count+1?_.count=Math.max(_.count,x.start+x.count-_.start):(++d,u[d]=x)}u.length=d+1;for(let f=0,_=u.length;f<_;f++){let x=u[f];i.bufferSubData(c,x.start*h.BYTES_PER_ELEMENT,h,x.start,x.count)}l.clearUpdateRanges()}l.onUploadCallback()}function s(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function a(o){o.isInterleavedBufferAttribute&&(o=o.data);let l=t.get(o);l&&(i.deleteBuffer(l.buffer),t.delete(o))}function r(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){let h=t.get(o);(!h||h.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}let c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:s,remove:a,update:r}}var lf=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,cf=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,hf=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,uf=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,df=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ff=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,pf=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,mf=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,gf=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,_f=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,xf=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,yf=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,vf=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Mf=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Sf=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,bf=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,wf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Tf=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Ef=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Af=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Cf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Rf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Lf=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,If=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Pf=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Df=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Nf=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Uf=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ff=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Of="gl_FragColor = linearToOutputTexel( gl_FragColor );",Bf=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,kf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,zf=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,$f=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Gf=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Hf=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Vf=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wf=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xf=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qf=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Zf=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Yf=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Jf=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Kf=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Qf=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,jf=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,tp=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ep=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,np=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ip=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sp=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rp=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,ap=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,op=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lp=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cp=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,hp=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,up=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,dp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,fp=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pp=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mp=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gp=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_p=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,xp=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yp=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,vp=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Mp=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sp=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bp=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,wp=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tp=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Ep=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Ap=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cp=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rp=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,Lp=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Ip=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pp=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Dp=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Np=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Up=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fp=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Op=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bp=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kp=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zp=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,$p=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gp=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hp=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Vp=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Wp=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Xp=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,qp=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zp=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Yp=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jp=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Kp=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qp=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jp=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tm=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,em=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,nm=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,im=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rm=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,am=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,om=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lm=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cm=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hm=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,um=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dm=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,pm=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,mm=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gm=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,_m=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,xm=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ym=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,vm=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Mm=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Sm=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bm=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wm=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tm=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,Em=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Am=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Cm=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Rm=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Lm=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Im=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Pm=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dm=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Nm=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Um=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Fm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Om=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bm=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,km=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zm=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jt={alphahash_fragment:lf,alphahash_pars_fragment:cf,alphamap_fragment:hf,alphamap_pars_fragment:uf,alphatest_fragment:df,alphatest_pars_fragment:ff,aomap_fragment:pf,aomap_pars_fragment:mf,batching_pars_vertex:gf,batching_vertex:_f,begin_vertex:xf,beginnormal_vertex:yf,bsdfs:vf,iridescence_fragment:Mf,bumpmap_pars_fragment:Sf,clipping_planes_fragment:bf,clipping_planes_pars_fragment:wf,clipping_planes_pars_vertex:Tf,clipping_planes_vertex:Ef,color_fragment:Af,color_pars_fragment:Cf,color_pars_vertex:Rf,color_vertex:Lf,common:If,defaultnormal_vertex:Pf,displacementmap_pars_vertex:Df,displacementmap_vertex:Nf,emissivemap_fragment:Uf,emissivemap_pars_fragment:Ff,colorspace_fragment:Of,colorspace_pars_fragment:Bf,envmap_fragment:kf,envmap_common_pars_fragment:zf,envmap_pars_fragment:$f,envmap_pars_vertex:Gf,envmap_physical_pars_fragment:jf,envmap_vertex:Hf,fog_vertex:Vf,fog_pars_vertex:Wf,fog_fragment:Xf,fog_pars_fragment:qf,gradientmap_pars_fragment:Zf,lightmap_pars_fragment:Yf,lights_lambert_fragment:Jf,lights_lambert_pars_fragment:Kf,lights_pars_begin:Qf,lights_toon_fragment:tp,lights_toon_pars_fragment:ep,lights_phong_fragment:np,lights_phong_pars_fragment:ip,lights_physical_fragment:sp,lights_physical_pars_fragment:rp,lights_fragment_begin:ap,lights_fragment_maps:op,lights_fragment_end:lp,lightprobes_pars_fragment:cp,logdepthbuf_fragment:hp,logdepthbuf_pars_fragment:up,logdepthbuf_pars_vertex:dp,logdepthbuf_vertex:fp,map_fragment:pp,map_pars_fragment:mp,map_particle_fragment:gp,map_particle_pars_fragment:_p,metalnessmap_fragment:xp,metalnessmap_pars_fragment:yp,morphinstance_vertex:vp,morphcolor_vertex:Mp,morphnormal_vertex:Sp,morphtarget_pars_vertex:bp,morphtarget_vertex:wp,normal_fragment_begin:Tp,normal_fragment_maps:Ep,normal_pars_fragment:Ap,normal_pars_vertex:Cp,normal_vertex:Rp,normalmap_pars_fragment:Lp,clearcoat_normal_fragment_begin:Ip,clearcoat_normal_fragment_maps:Pp,clearcoat_pars_fragment:Dp,iridescence_pars_fragment:Np,opaque_fragment:Up,packing:Fp,premultiplied_alpha_fragment:Op,project_vertex:Bp,dithering_fragment:kp,dithering_pars_fragment:zp,roughnessmap_fragment:$p,roughnessmap_pars_fragment:Gp,shadowmap_pars_fragment:Hp,shadowmap_pars_vertex:Vp,shadowmap_vertex:Wp,shadowmask_pars_fragment:Xp,skinbase_vertex:qp,skinning_pars_vertex:Zp,skinning_vertex:Yp,skinnormal_vertex:Jp,specularmap_fragment:Kp,specularmap_pars_fragment:Qp,tonemapping_fragment:jp,tonemapping_pars_fragment:tm,transmission_fragment:em,transmission_pars_fragment:nm,uv_pars_fragment:im,uv_pars_vertex:sm,uv_vertex:rm,worldpos_vertex:am,background_vert:om,background_frag:lm,backgroundCube_vert:cm,backgroundCube_frag:hm,cube_vert:um,cube_frag:dm,depth_vert:fm,depth_frag:pm,distance_vert:mm,distance_frag:gm,equirect_vert:_m,equirect_frag:xm,linedashed_vert:ym,linedashed_frag:vm,meshbasic_vert:Mm,meshbasic_frag:Sm,meshlambert_vert:bm,meshlambert_frag:wm,meshmatcap_vert:Tm,meshmatcap_frag:Em,meshnormal_vert:Am,meshnormal_frag:Cm,meshphong_vert:Rm,meshphong_frag:Lm,meshphysical_vert:Im,meshphysical_frag:Pm,meshtoon_vert:Dm,meshtoon_frag:Nm,points_vert:Um,points_frag:Fm,shadow_vert:Om,shadow_frag:Bm,sprite_vert:km,sprite_frag:zm},Tt={common:{diffuse:{value:new Zt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ht}},envmap:{envMap:{value:null},envMapRotation:{value:new Ht},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ht}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ht}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ht},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ht},normalScale:{value:new Mt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ht},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ht}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ht}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ht}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Zt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Zt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0},uvTransform:{value:new Ht}},sprite:{diffuse:{value:new Zt(16777215)},opacity:{value:1},center:{value:new Mt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ht},alphaMap:{value:null},alphaMapTransform:{value:new Ht},alphaTest:{value:0}}},In={basic:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.fog]),vertexShader:jt.meshbasic_vert,fragmentShader:jt.meshbasic_frag},lambert:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)},envMapIntensity:{value:1}}]),vertexShader:jt.meshlambert_vert,fragmentShader:jt.meshlambert_frag},phong:{uniforms:We([Tt.common,Tt.specularmap,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)},specular:{value:new Zt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:jt.meshphong_vert,fragmentShader:jt.meshphong_frag},standard:{uniforms:We([Tt.common,Tt.envmap,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.roughnessmap,Tt.metalnessmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag},toon:{uniforms:We([Tt.common,Tt.aomap,Tt.lightmap,Tt.emissivemap,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.gradientmap,Tt.fog,Tt.lights,{emissive:{value:new Zt(0)}}]),vertexShader:jt.meshtoon_vert,fragmentShader:jt.meshtoon_frag},matcap:{uniforms:We([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,Tt.fog,{matcap:{value:null}}]),vertexShader:jt.meshmatcap_vert,fragmentShader:jt.meshmatcap_frag},points:{uniforms:We([Tt.points,Tt.fog]),vertexShader:jt.points_vert,fragmentShader:jt.points_frag},dashed:{uniforms:We([Tt.common,Tt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:jt.linedashed_vert,fragmentShader:jt.linedashed_frag},depth:{uniforms:We([Tt.common,Tt.displacementmap]),vertexShader:jt.depth_vert,fragmentShader:jt.depth_frag},normal:{uniforms:We([Tt.common,Tt.bumpmap,Tt.normalmap,Tt.displacementmap,{opacity:{value:1}}]),vertexShader:jt.meshnormal_vert,fragmentShader:jt.meshnormal_frag},sprite:{uniforms:We([Tt.sprite,Tt.fog]),vertexShader:jt.sprite_vert,fragmentShader:jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Ht},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:jt.background_vert,fragmentShader:jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ht}},vertexShader:jt.backgroundCube_vert,fragmentShader:jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:jt.cube_vert,fragmentShader:jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:jt.equirect_vert,fragmentShader:jt.equirect_frag},distance:{uniforms:We([Tt.common,Tt.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:jt.distance_vert,fragmentShader:jt.distance_frag},shadow:{uniforms:We([Tt.lights,Tt.fog,{color:{value:new Zt(0)},opacity:{value:1}}]),vertexShader:jt.shadow_vert,fragmentShader:jt.shadow_frag}};In.physical={uniforms:We([In.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ht},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ht},clearcoatNormalScale:{value:new Mt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ht},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Ht},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ht},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ht},sheen:{value:0},sheenColor:{value:new Zt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ht},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ht},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ht},transmissionSamplerSize:{value:new Mt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ht},attenuationDistance:{value:0},attenuationColor:{value:new Zt(0)},specularColor:{value:new Zt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ht},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ht},anisotropyVector:{value:new Mt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ht}}]),vertexShader:jt.meshphysical_vert,fragmentShader:jt.meshphysical_frag};var Mo={r:0,b:0,g:0},$m=new fe,uu=new Ht;uu.set(-1,0,0,0,1,0,0,0,1);function Gm(i,t,e,n,s,a){let r=new Zt(0),o=s===!0?0:1,l,c,h=null,u=0,d=null;function f(M){let w=M.isScene===!0?M.background:null;if(w&&w.isTexture){let b=M.backgroundBlurriness>0;w=t.get(w,b)}return w}function _(M){let w=!1,b=f(M);b===null?p(r,o):b&&b.isColor&&(p(b,1),w=!0);let A=i.xr.getEnvironmentBlendMode();A==="additive"?e.buffers.color.setClear(0,0,0,1,a):A==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,a),(i.autoClear||w)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function x(M,w){let b=f(w);b&&b.isCubeTexture?(c===void 0&&(c=new pe(new En(1,1,1),new An({name:"BackgroundCubeMaterial",uniforms:Ri(In.backgroundCube.uniforms),vertexShader:In.backgroundCube.vertexShader,fragmentShader:In.backgroundCube.fragmentShader,side:Be,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(A,E,g){this.matrixWorld.copyPosition(g.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=b,c.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4($m.makeRotationFromEuler(w.backgroundRotation)).transpose(),b.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(uu),c.material.toneMapped=oe.getTransfer(b.colorSpace)!==ue,(h!==b||u!==b.version||d!==i.toneMapping)&&(c.material.needsUpdate=!0,h=b,u=b.version,d=i.toneMapping),c.layers.enableAll(),M.unshift(c,c.geometry,c.material,0,0,null)):b&&b.isTexture&&(l===void 0&&(l=new pe(new ii(2,2),new An({name:"BackgroundMaterial",uniforms:Ri(In.background.uniforms),vertexShader:In.background.vertexShader,fragmentShader:In.background.fragmentShader,side:oi,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=b,l.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,l.material.toneMapped=oe.getTransfer(b.colorSpace)!==ue,b.matrixAutoUpdate===!0&&b.updateMatrix(),l.material.uniforms.uvTransform.value.copy(b.matrix),(h!==b||u!==b.version||d!==i.toneMapping)&&(l.material.needsUpdate=!0,h=b,u=b.version,d=i.toneMapping),l.layers.enableAll(),M.unshift(l,l.geometry,l.material,0,0,null))}function p(M,w){M.getRGB(Mo,Hl(i)),e.buffers.color.setClear(Mo.r,Mo.g,Mo.b,w,a)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return r},setClearColor:function(M,w=1){r.set(M),o=w,p(r,o)},getClearAlpha:function(){return o},setClearAlpha:function(M){o=M,p(r,o)},render:_,addToRenderList:x,dispose:m}}function Hm(i,t){let e=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},s=d(null),a=s,r=!1;function o(U,k,V,L,F){let X=!1,H=u(U,L,V,k);a!==H&&(a=H,c(a.object)),X=f(U,L,V,F),X&&_(U,L,V,F),F!==null&&t.update(F,i.ELEMENT_ARRAY_BUFFER),(X||r)&&(r=!1,b(U,k,V,L),F!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,t.get(F).buffer))}function l(){return i.createVertexArray()}function c(U){return i.bindVertexArray(U)}function h(U){return i.deleteVertexArray(U)}function u(U,k,V,L){let F=L.wireframe===!0,X=n[k.id];X===void 0&&(X={},n[k.id]=X);let H=U.isInstancedMesh===!0?U.id:0,rt=X[H];rt===void 0&&(rt={},X[H]=rt);let q=rt[V.id];q===void 0&&(q={},rt[V.id]=q);let tt=q[F];return tt===void 0&&(tt=d(l()),q[F]=tt),tt}function d(U){let k=[],V=[],L=[];for(let F=0;F<e;F++)k[F]=0,V[F]=0,L[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:k,enabledAttributes:V,attributeDivisors:L,object:U,attributes:{},index:null}}function f(U,k,V,L){let F=a.attributes,X=k.attributes,H=0,rt=V.getAttributes();for(let q in rt)if(rt[q].location>=0){let it=F[q],wt=X[q];if(wt===void 0&&(q==="instanceMatrix"&&U.instanceMatrix&&(wt=U.instanceMatrix),q==="instanceColor"&&U.instanceColor&&(wt=U.instanceColor)),it===void 0||it.attribute!==wt||wt&&it.data!==wt.data)return!0;H++}return a.attributesNum!==H||a.index!==L}function _(U,k,V,L){let F={},X=k.attributes,H=0,rt=V.getAttributes();for(let q in rt)if(rt[q].location>=0){let it=X[q];it===void 0&&(q==="instanceMatrix"&&U.instanceMatrix&&(it=U.instanceMatrix),q==="instanceColor"&&U.instanceColor&&(it=U.instanceColor));let wt={};wt.attribute=it,it&&it.data&&(wt.data=it.data),F[q]=wt,H++}a.attributes=F,a.attributesNum=H,a.index=L}function x(){let U=a.newAttributes;for(let k=0,V=U.length;k<V;k++)U[k]=0}function p(U){m(U,0)}function m(U,k){let V=a.newAttributes,L=a.enabledAttributes,F=a.attributeDivisors;V[U]=1,L[U]===0&&(i.enableVertexAttribArray(U),L[U]=1),F[U]!==k&&(i.vertexAttribDivisor(U,k),F[U]=k)}function M(){let U=a.newAttributes,k=a.enabledAttributes;for(let V=0,L=k.length;V<L;V++)k[V]!==U[V]&&(i.disableVertexAttribArray(V),k[V]=0)}function w(U,k,V,L,F,X,H){H===!0?i.vertexAttribIPointer(U,k,V,F,X):i.vertexAttribPointer(U,k,V,L,F,X)}function b(U,k,V,L){x();let F=L.attributes,X=V.getAttributes(),H=k.defaultAttributeValues;for(let rt in X){let q=X[rt];if(q.location>=0){let tt=F[rt];if(tt===void 0&&(rt==="instanceMatrix"&&U.instanceMatrix&&(tt=U.instanceMatrix),rt==="instanceColor"&&U.instanceColor&&(tt=U.instanceColor)),tt!==void 0){let it=tt.normalized,wt=tt.itemSize,Ut=t.get(tt);if(Ut===void 0)continue;let J=Ut.buffer,ft=Ut.type,At=Ut.bytesPerElement,Ot=ft===i.INT||ft===i.UNSIGNED_INT||tt.gpuType===Oa;if(tt.isInterleavedBufferAttribute){let bt=tt.data,Bt=bt.isInterleavedBuffer===!0?bt.stride:bt.itemSize,de=tt.offset;if(bt.isInstancedInterleavedBuffer||bt.isInstancedBufferAttribute){for(let kt=0;kt<q.locationSize;kt++)m(q.location+kt,bt.meshPerAttribute);U.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=bt.meshPerAttribute*bt.count)}else for(let kt=0;kt<q.locationSize;kt++)p(q.location+kt);i.bindBuffer(i.ARRAY_BUFFER,J);for(let kt=0;kt<q.locationSize;kt++)w(q.location+kt,wt/q.locationSize,ft,it,Bt*At,(de+wt/q.locationSize*kt)*At,Ot)}else{if(tt.isInstancedBufferAttribute){for(let bt=0;bt<q.locationSize;bt++)m(q.location+bt,tt.meshPerAttribute);U.isInstancedMesh!==!0&&L._maxInstanceCount===void 0&&(L._maxInstanceCount=tt.meshPerAttribute*tt.count)}else for(let bt=0;bt<q.locationSize;bt++)p(q.location+bt);i.bindBuffer(i.ARRAY_BUFFER,J);for(let bt=0;bt<q.locationSize;bt++)w(q.location+bt,wt/q.locationSize,ft,it,wt*At,wt/q.locationSize*bt*At,Ot)}}else if(H!==void 0){let it=H[rt];if(it!==void 0)switch(it.length){case 2:i.vertexAttrib2fv(q.location,it);break;case 3:i.vertexAttrib3fv(q.location,it);break;case 4:i.vertexAttrib4fv(q.location,it);break;default:i.vertexAttrib1fv(q.location,it)}}}}M()}function A(){O();for(let U in n){let k=n[U];for(let V in k){let L=k[V];for(let F in L){let X=L[F];for(let H in X)h(X[H].object),delete X[H];delete L[F]}}delete n[U]}}function E(U){if(n[U.id]===void 0)return;let k=n[U.id];for(let V in k){let L=k[V];for(let F in L){let X=L[F];for(let H in X)h(X[H].object),delete X[H];delete L[F]}}delete n[U.id]}function g(U){for(let k in n){let V=n[k];for(let L in V){let F=V[L];if(F[U.id]===void 0)continue;let X=F[U.id];for(let H in X)h(X[H].object),delete X[H];delete F[U.id]}}}function S(U){for(let k in n){let V=n[k],L=U.isInstancedMesh===!0?U.id:0,F=V[L];if(F!==void 0){for(let X in F){let H=F[X];for(let rt in H)h(H[rt].object),delete H[rt];delete F[X]}delete V[L],Object.keys(V).length===0&&delete n[k]}}}function O(){I(),r=!0,a!==s&&(a=s,c(a.object))}function I(){s.geometry=null,s.program=null,s.wireframe=!1}return{setup:o,reset:O,resetDefaultState:I,dispose:A,releaseStatesOfGeometry:E,releaseStatesOfObject:S,releaseStatesOfProgram:g,initAttributes:x,enableAttribute:p,disableUnusedAttributes:M}}function Vm(i,t,e){let n;function s(l){n=l}function a(l,c){i.drawArrays(n,l,c),e.update(c,n,1)}function r(l,c,h){h!==0&&(i.drawArraysInstanced(n,l,c,h),e.update(c,n,h))}function o(l,c,h){if(h===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,h);let d=0;for(let f=0;f<h;f++)d+=c[f];e.update(d,n,1)}this.setMode=s,this.render=a,this.renderInstances=r,this.renderMultiDraw=o}function Wm(i,t,e,n){let s;function a(){if(s!==void 0)return s;if(t.has("EXT_texture_filter_anisotropic")===!0){let g=t.get("EXT_texture_filter_anisotropic");s=i.getParameter(g.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else s=0;return s}function r(g){return!(g!==_n&&n.convert(g)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(g){let S=g===gn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(g!==Ke&&g!==on&&!S&&n.convert(g)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE))}function l(g){if(g==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";g="mediump"}return g==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp",h=l(c);h!==c&&(zt("WebGLRenderer:",c,"not supported, using",h,"instead."),c=h);let u=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),d=e.logarithmicDepthBuffer===!0&&u===!1;e.reversedDepthBuffer===!0&&u===!1&&zt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&u===!0&&zt("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");let f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),p=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),m=i.getParameter(i.MAX_VERTEX_ATTRIBS),M=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),w=i.getParameter(i.MAX_VARYING_VECTORS),b=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),A=i.getParameter(i.MAX_SAMPLES),E=i.getParameter(i.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:a,getMaxPrecision:l,textureFormatReadable:r,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:d,reversedDepthBuffer:u,maxTextures:f,maxVertexTextures:_,maxTextureSize:x,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:M,maxVaryings:w,maxFragmentUniforms:b,maxSamples:A,samples:E}}function Xm(i){let t=this,e=null,n=0,s=!1,a=!1,r=new dn,o=new Ht,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,d){let f=u.length!==0||d||n!==0||s;return s=d,n=u.length,f},this.beginShadows=function(){a=!0,h(null)},this.endShadows=function(){a=!1},this.setGlobalState=function(u,d){e=h(u,d,0)},this.setState=function(u,d,f){let _=u.clippingPlanes,x=u.clipIntersection,p=u.clipShadows,m=i.get(u);if(!s||_===null||_.length===0||a&&!p)a?h(null):c();else{let M=a?0:n,w=M*4,b=m.clippingState||null;l.value=b,b=h(_,d,w,f);for(let A=0;A!==w;++A)b[A]=e[A];m.clippingState=b,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=M}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function h(u,d,f,_){let x=u!==null?u.length:0,p=null;if(x!==0){if(p=l.value,_!==!0||p===null){let m=f+x*4,M=d.matrixWorldInverse;o.getNormalMatrix(M),(p===null||p.length<m)&&(p=new Float32Array(m));for(let w=0,b=f;w!==x;++w,b+=4)r.copy(u[w]).applyMatrix4(M,o),r.normal.toArray(p,b),p[b+3]=r.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=x,t.numIntersection=0,p}}var gr=class extends tn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];this.texture=new Os(s),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new En(5,5,5),a=new An({name:"CubemapFromEquirect",uniforms:Ri(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Be,blending:bi});a.uniforms.tEquirect.value=e;let r=new pe(s,a),o=e.minFilter;return e.minFilter===Vn&&(e.minFilter=Ye),new ns(1,10,this).update(t,r),e.minFilter=o,r.geometry.dispose(),r.material.dispose(),this}clear(t,e=!0,n=!0,s=!0){let a=t.getRenderTarget();for(let r=0;r<6;r++)t.setRenderTarget(this,r),t.clear(e,n,s);t.setRenderTarget(a)}},Hh=256,qm=3,Zm=20,du=256,fu=16,Ym=3,Jm=new B,Km=new Zt,ls=class i{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new ns(1,10,null),this._boxMesh=new pe(new En(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,s=100,a={}){let{size:r=256,position:o=Jm}=a,l=this._renderer;this._setSize(r);let c=this._allocateTarget(),h=this._getSourceTarget(!0);e>0&&(h.texture.mipmapsAutoUpdate=!1);let u=l.autoClear,d=l.autoClearColor,f=l.autoClearDepth,_=l.autoClearStencil,x=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,x===null&&(t.background=l.getClearColor(Km));let p=new ns(n,s,h);return p.position.copy(o),p.update(l,t),l.autoClear=u,l.autoClearColor=d,l.autoClearDepth=f,l.autoClearStencil=_,t.background=x,e>0&&(h.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Xh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Wh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(Hh,zl(t))}_fromTexture(t,e){t.mapping===Ti||t.mapping===rs?this._setSize(t.image.length===0?Hh:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);let n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){let t=this._cubeSize,e=Vh(t,!1,!1),n=Math.log2(t)-qm;for(let s=0;s<=n;s++)e.texture.mipmaps.push({width:t>>s,height:t>>s});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){let e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Vh(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){let s=this._boxMesh,a=this._cubeCamera;s.material=n,a.renderTarget=t,a.activeMipmapLevel=e;let r=t.width>>e;t.viewport.set(0,0,r,r),a.update(this._renderer,s),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===Ti||t.mapping===rs?(this._cubemapMaterial===null&&(this._cubemapMaterial=Xh()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Wh()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Qm(),this._integrationMaterial=jm());let e=this._cubeSize,n=t.texture.mipmaps.length-1,s=this._ggxMaterial.uniforms;s.envMap.value=this._sourceTarget.texture;let a=this._integrationMaterial.uniforms;a.envMap.value=this._sourceTarget.texture,a.sourceLod.value=Math.log2(e/fu);for(let r=0;r<=n;r++){let o=i.lodToRoughness(r,n);if(r>n-Ym)a.roughness.value=o,this._renderCube(t,r,this._integrationMaterial);else{let l=o>0?Math.log2(e)+.5*Math.log2(6/(du*Math.pow(o,4)))+.5:0;s.roughness.value=o,s.lodBias.value=l,this._renderCube(t,r,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=t0());let n=this._blurMaterial,s=n.uniforms,a=this._sourceTarget;s.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,s.envMap.value=a.texture,this._renderCube(t,0,n),s.envMap.value=t.texture,this._renderCube(a,0,n)}};function Vh(i,t,e){return new gr(i,{minFilter:Vn,generateMipmaps:t,type:gn,colorSpace:As,depthBuffer:e})}function _r(i,t,e){return new An({name:i,uniforms:t,vertexShader:jt.cube_vert,fragmentShader:e,side:Be,blending:bi,depthTest:!1,depthWrite:!1})}function Qm(){return _r("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${du}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function jm(){return _r("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:fu}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function t0(){return _r("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Zm}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Wh(){return _r("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Xh(){return _r("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function e0(i){let t=new WeakMap,e=new WeakMap,n=null;function s(d,f=!1){return d==null?null:f?r(d):a(d)}function a(d){if(d&&d.isTexture){let f=d.mapping;if(f===Na||f===Ua)if(t.has(d)){let _=t.get(d).texture;return o(_,d.mapping)}else{let _=d.image;if(_&&_.height>0){let x=new gr(_.height);return x.fromEquirectangularTexture(i,d),t.set(d,x),d.addEventListener("dispose",c),o(x.texture,d.mapping)}else return null}}return d}function r(d){if(d&&d.isTexture&&d.isPMREMTexture!==!0){let f=d.mapping,_=f===Na||f===Ua,x=f===Ti||f===rs;if(_||x){let p=e.get(d),m=p!==void 0?p.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==m)return n===null&&(n=new ls(i)),p=_?n.fromEquirectangular(d,p):n.fromCubemap(d,p),p.texture.pmremVersion=d.pmremVersion,e.set(d,p),p.texture;if(p!==void 0)return p.texture;{let M=d.image;return _&&M&&M.height>0||x&&M&&l(M)?(n===null&&(n=new ls(i)),p=_?n.fromEquirectangular(d):n.fromCubemap(d),p.texture.pmremVersion=d.pmremVersion,e.set(d,p),d.addEventListener("dispose",h),p.texture):null}}}return d}function o(d,f){return f===Na?d.mapping=Ti:f===Ua&&(d.mapping=rs),d}function l(d){let f=0,_=6;for(let x=0;x<_;x++)d[x]!==void 0&&f++;return f===_}function c(d){let f=d.target;f.removeEventListener("dispose",c);let _=t.get(f);_!==void 0&&(t.delete(f),_.dispose())}function h(d){let f=d.target;f.removeEventListener("dispose",h);let _=e.get(f);_!==void 0&&(e.delete(f),_.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:s,dispose:u}}function n0(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s=i.getExtension(n);return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){let s=e(n);return s===null&&gi("WebGLRenderer: "+n+" extension not supported."),s}}}function i0(i,t,e,n){let s={},a=new WeakMap,r=new FinalizationRegistry(_=>delete s[_]);function o(_){l(_.target)}function l(_){_.index!==null&&t.remove(_.index);for(let p in _.attributes)t.remove(_.attributes[p]);_.removeEventListener("dispose",o),delete s[_.id],r.unregister(_);let x=a.get(_);x&&(t.remove(x),a.delete(_)),n.releaseStatesOfGeometry(_),_.isInstancedBufferGeometry===!0&&delete _._maxInstanceCount,e.memory.geometries--}function c(_,x){return s[x.id]!==void 0||(x.addEventListener("dispose",o),s[x.id]=new WeakRef(x),r.register(x,x.id,x),e.memory.geometries++),x}function h(_){let x=_.attributes;for(let p in x)t.update(x[p],i.ARRAY_BUFFER)}function u(_){let x=_.index,p=_.attributes.position,m=0;if(p===void 0)return;let M=x!==null?x.array.length:p.array.length/3-1,w=p.count>=65535?Ds:Ps,b=new w(Math.ceil(M/3)*6,1),A=b.array;if(x!==null){let g=x.array;m=x.version;for(let S=0,O=0;S<M;S+=3){let I=g[S+0],U=g[S+1],k=g[S+2];A[O++]=I,A[O++]=U,A[O++]=U,A[O++]=k,A[O++]=k,A[O++]=I}}else{m=p.version;for(let g=0,S=0;g<M;g+=3){let O=g+0,I=g+1,U=g+2;A[S++]=O,A[S++]=I,A[S++]=I,A[S++]=U,A[S++]=U,A[S++]=O}}b.version=m;let E=a.get(_);E&&t.remove(E),a.set(_,b)}function d(_){let x=a.get(_);if(x){let p=_.index;p!==null&&x.version<p.version&&u(_)}else u(_);return a.get(_)}function f(){for(let _ in s){let x=s[_].deref();x!==void 0&&l(x)}}return{get:c,update:h,getWireframeAttribute:d,dispose:f}}function s0(i,t,e){let n;function s(u){n=u}let a,r;function o(u){a=u.type,r=u.bytesPerElement}function l(u,d){i.drawElements(n,d,a,u*r),e.update(d,n,1)}function c(u,d,f){f!==0&&(i.drawElementsInstanced(n,d,a,u*r,f),e.update(d,n,f))}function h(u,d,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,d,0,a,u,0,f);let x=0;for(let p=0;p<f;p++)x+=d[p];e.update(x,n,1)}this.setMode=s,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=h}function r0(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(a,r,o){switch(e.calls++,r){case i.TRIANGLES:e.triangles+=o*(a/3);break;case i.LINES:e.lines+=o*(a/2);break;case i.LINE_STRIP:e.lines+=o*(a-1);break;case i.LINE_LOOP:e.lines+=o*a;break;case i.POINTS:e.points+=o*a;break;default:Gt("WebGLInfo: Unknown draw mode:",r);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function a0(i,t,e){let n=new WeakMap,s=new Me;function a(r,o,l){let c=r.morphTargetInfluences,h=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,u=h!==void 0?h.length:0,d=n.get(o);if(d===void 0||d.count!==u){let O=function(){g.dispose(),n.delete(o),o.removeEventListener("dispose",O)};d!==void 0&&d.texture.dispose();let f=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,x=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],M=o.morphAttributes.color||[],w=0;f===!0&&(w=1),_===!0&&(w=2),x===!0&&(w=3);let b=o.attributes.position.count*w,A=1;b>t.maxTextureSize&&(A=Math.ceil(b/t.maxTextureSize),b=t.maxTextureSize);let E=new Float32Array(b*A*4*u),g=new Ls(E,b,A,u);g.type=on,g.needsUpdate=!0;let S=w*4;for(let I=0;I<u;I++){let U=p[I],k=m[I],V=M[I],L=b*A*4*I;for(let F=0;F<U.count;F++){let X=F*S;f===!0&&(s.fromBufferAttribute(U,F),E[L+X+0]=s.x,E[L+X+1]=s.y,E[L+X+2]=s.z,E[L+X+3]=0),_===!0&&(s.fromBufferAttribute(k,F),E[L+X+4]=s.x,E[L+X+5]=s.y,E[L+X+6]=s.z,E[L+X+7]=0),x===!0&&(s.fromBufferAttribute(V,F),E[L+X+8]=s.x,E[L+X+9]=s.y,E[L+X+10]=s.z,E[L+X+11]=V.itemSize===4?s.w:1)}}d={count:u,texture:g,size:new Mt(b,A)},n.set(o,d),o.addEventListener("dispose",O)}if(r.isInstancedMesh===!0&&r.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",r.morphTexture,e);else{let f=0;for(let x=0;x<c.length;x++)f+=c[x];let _=o.morphTargetsRelative?1:1-f;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",d.texture,e),l.getUniforms().setValue(i,"morphTargetsTextureSize",d.size)}return{update:a}}function o0(i,t,e,n,s){let a=new WeakMap;function r(c){let h=s.render.frame,u=c.geometry,d=t.get(c,u);if(a.get(d)!==h&&(t.update(d),a.set(d,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),a.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),a.set(c,h))),c.isSkinnedMesh){let f=c.skeleton;a.get(f)!==h&&(f.update(),a.set(f,h))}return d}function o(){a=new WeakMap}function l(c){let h=c.target;h.removeEventListener("dispose",l),n.releaseStatesOfObject(h),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:o}}var l0={[Ml]:"LINEAR_TONE_MAPPING",[Sl]:"REINHARD_TONE_MAPPING",[bl]:"CINEON_TONE_MAPPING",[rr]:"ACES_FILMIC_TONE_MAPPING",[Tl]:"AGX_TONE_MAPPING",[El]:"NEUTRAL_TONE_MAPPING",[wl]:"CUSTOM_TONE_MAPPING"};function c0(i,t,e,n,s,a){let r=new tn(t,e,{type:i,depthBuffer:s,stencilBuffer:a,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1}),o=null,l=null,c=null,h=new pn;h.setAttribute("position",new Ce([-1,3,0,-1,-1,0,3,-1,0],3)),h.setAttribute("uv",new Ce([0,2,0,0,2,0],2));let u=new xa({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),d=new pe(h,u),f=new ir(-1,1,1,-1,0,1),_=null,x=null,p=!1,m,M=null,w=[],b=!1;this.setSize=function(A,E){r.setSize(A,E),o!==null&&o.setSize(A,E),l!==null&&l.setSize(A,E);for(let g=0;g<w.length;g++){let S=w[g];S.setSize&&S.setSize(A,E)}},this.setEffects=function(A){w=A,b=w.length>0&&w[0].isRenderPass===!0;let E=r.width,g=r.height;w.length>0&&o===null&&(o=new tn(E,g,{type:gn,depthBuffer:!1,stencilBuffer:!1}),l=new tn(E,g,{type:gn,depthBuffer:!1,stencilBuffer:!1}));let S=s===!0&&w.some(O=>O.needsDepthTexture===!0);S!==(r.depthTexture!==null)&&(S===!0&&c===null&&(c=new Hn(E,g),a===!0&&(c.format=Wn,c.type=Ei)),r.dispose(),r.depthTexture=S?c:null,r.resolveDepthBuffer=S,r.storeMultisampledDepthBuffer=S);for(let O=0;O<w.length;O++){let I=w[O];I.setSize&&I.setSize(E,g),S&&I.needsDepthTexture===!0&&I.setDepthTexture&&I.setDepthTexture(c)}},this.begin=function(A,E){if(p||A.toneMapping===Rn&&w.length===0)return!1;if(M=E,E!==null){let g=E.width,S=E.height;(r.width!==g||r.height!==S)&&this.setSize(g,S)}return b===!1&&A.setRenderTarget(r),m=A.toneMapping,A.toneMapping=Rn,!0},this.hasRenderPass=function(){return b},this.end=function(A,E){A.toneMapping=m,p=!0;let g=r,S=o;for(let O=0;O<w.length;O++){let I=w[O];I.enabled!==!1&&(I.render(A,S,g,E),I.needsSwap!==!1&&(g=S,S=S===o?l:o))}if(_!==A.outputColorSpace||x!==A.toneMapping){_=A.outputColorSpace,x=A.toneMapping,u.defines={},oe.getTransfer(_)===ue&&(u.defines.SRGB_TRANSFER="");let O=l0[x];O&&(u.defines[O]=""),u.needsUpdate=!0}u.uniforms.tDiffuse.value=g.texture,A.setRenderTarget(M),A.render(d,f),M=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){r.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),h.dispose(),u.dispose()}}var pu=new Je,mu=new Hn(1,1),gu=new Bs(1),_u=new Ls,xu=new la,yu=new Os,qh=[],Zh=[],Yh=new Float32Array(16),Jh=new Float32Array(9),Kh=new Float32Array(4);function cs(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,a=qh[s];if(a===void 0&&(a=new Float32Array(s),qh[s]=a),t!==0){n.toArray(a,0);for(let r=1,o=0;r!==t;++r)o+=e,i[r].toArray(a,o)}return a}function Re(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Le(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function wo(i,t){let e=Zh[t];e===void 0&&(e=new Int32Array(t),Zh[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function h0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function u0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2fv(this.addr,t),Le(e,t)}}function d0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Re(e,t))return;i.uniform3fv(this.addr,t),Le(e,t)}}function f0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4fv(this.addr,t),Le(e,t)}}function p0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Le(e,t)}else{if(Re(e,n))return;Kh.set(n),i.uniformMatrix2fv(this.addr,!1,Kh),Le(e,n)}}function m0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Le(e,t)}else{if(Re(e,n))return;Jh.set(n),i.uniformMatrix3fv(this.addr,!1,Jh),Le(e,n)}}function g0(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Re(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Le(e,t)}else{if(Re(e,n))return;Yh.set(n),i.uniformMatrix4fv(this.addr,!1,Yh),Le(e,n)}}function _0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function x0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2iv(this.addr,t),Le(e,t)}}function y0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3iv(this.addr,t),Le(e,t)}}function v0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4iv(this.addr,t),Le(e,t)}}function M0(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function S0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Re(e,t))return;i.uniform2uiv(this.addr,t),Le(e,t)}}function b0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Re(e,t))return;i.uniform3uiv(this.addr,t),Le(e,t)}}function w0(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Re(e,t))return;i.uniform4uiv(this.addr,t),Le(e,t)}}function To(i){return i.version===0&&(i.compareFunction=Fl,i.needsUpdate=!0),i}function T0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_2D_SHADOW?a=To(mu):a=pu,e.setTexture2D(t||a,s)}function E0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||xu,s)}function A0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let a;this.type===i.SAMPLER_CUBE_SHADOW?a=To(gu):a=yu,e.setTextureCube(t||a,s)}function C0(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||_u,s)}function R0(i){switch(i){case 5126:return h0;case 35664:return u0;case 35665:return d0;case 35666:return f0;case 35674:return p0;case 35675:return m0;case 35676:return g0;case 5124:case 35670:return _0;case 35667:case 35671:return x0;case 35668:case 35672:return y0;case 35669:case 35673:return v0;case 5125:return M0;case 36294:return S0;case 36295:return b0;case 36296:return w0;case 35678:case 36198:case 36298:case 36306:case 35682:return T0;case 35679:case 36299:case 36307:return E0;case 35680:case 36300:case 36308:case 36293:return A0;case 36289:case 36303:case 36311:case 36292:return C0}}function L0(i,t){i.uniform1fv(this.addr,t)}function I0(i,t){let e=cs(t,this.size,2);i.uniform2fv(this.addr,e)}function P0(i,t){let e=cs(t,this.size,3);i.uniform3fv(this.addr,e)}function D0(i,t){let e=cs(t,this.size,4);i.uniform4fv(this.addr,e)}function N0(i,t){let e=cs(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function U0(i,t){let e=cs(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function F0(i,t){let e=cs(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function O0(i,t){i.uniform1iv(this.addr,t)}function B0(i,t){i.uniform2iv(this.addr,t)}function k0(i,t){i.uniform3iv(this.addr,t)}function z0(i,t){i.uniform4iv(this.addr,t)}function $0(i,t){i.uniform1uiv(this.addr,t)}function G0(i,t){i.uniform2uiv(this.addr,t)}function H0(i,t){i.uniform3uiv(this.addr,t)}function V0(i,t){i.uniform4uiv(this.addr,t)}function W0(i,t,e){let n=this.cache,s=t.length,a=wo(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Le(n,a));let r;this.type===i.SAMPLER_2D_SHADOW?r=To(mu):r=pu;for(let o=0;o!==s;++o)e.setTexture2D(t[o]||r,a[o])}function X0(i,t,e){let n=this.cache,s=t.length,a=wo(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Le(n,a));for(let r=0;r!==s;++r)e.setTexture3D(t[r]||xu,a[r])}function q0(i,t,e){let n=this.cache,s=t.length,a=wo(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Le(n,a));let r;this.type===i.SAMPLER_CUBE_SHADOW?r=To(gu):r=yu;for(let o=0;o!==s;++o)e.setTextureCube(t[o]||r,a[o])}function Z0(i,t,e){let n=this.cache,s=t.length,a=wo(e,s);Re(n,a)||(i.uniform1iv(this.addr,a),Le(n,a));for(let r=0;r!==s;++r)e.setTexture2DArray(t[r]||_u,a[r])}function Y0(i){switch(i){case 5126:return L0;case 35664:return I0;case 35665:return P0;case 35666:return D0;case 35674:return N0;case 35675:return U0;case 35676:return F0;case 5124:case 35670:return O0;case 35667:case 35671:return B0;case 35668:case 35672:return k0;case 35669:case 35673:return z0;case 5125:return $0;case 36294:return G0;case 36295:return H0;case 36296:return V0;case 35678:case 36198:case 36298:case 36306:case 35682:return W0;case 35679:case 36299:case 36307:return X0;case 35680:case 36300:case 36308:case 36293:return q0;case 36289:case 36303:case 36311:case 36292:return Z0}}var Yl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=R0(e.type)}},Jl=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Y0(e.type)}},Kl=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let a=0,r=s.length;a!==r;++a){let o=s[a];o.setValue(t,e[o.id],n)}}},ql=/(\w+)(\])?(\[|\.)?/g;function Qh(i,t){i.seq.push(t),i.map[t.id]=t}function J0(i,t,e){let n=i.name,s=n.length;for(ql.lastIndex=0;;){let a=ql.exec(n),r=ql.lastIndex,o=a[1],l=a[2]==="]",c=a[3];if(l&&(o=o|0),c===void 0||c==="["&&r+2===s){Qh(e,c===void 0?new Yl(o,i,t):new Jl(o,i,t));break}else{let u=e.map[o];u===void 0&&(u=new Kl(o),Qh(e,u)),e=u}}}var os=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let r=0;r<n;++r){let o=t.getActiveUniform(e,r),l=t.getUniformLocation(e,o.name);J0(o,l,this)}let s=[],a=[];for(let r of this.seq)r.type===t.SAMPLER_2D_SHADOW||r.type===t.SAMPLER_CUBE_SHADOW||r.type===t.SAMPLER_2D_ARRAY_SHADOW?s.push(r):a.push(r);s.length>0&&(this.seq=s.concat(a))}setValue(t,e,n,s){let a=this.map[e];a!==void 0&&a.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let a=0,r=e.length;a!==r;++a){let o=e[a],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,a=t.length;s!==a;++s){let r=t[s];r.id in e&&n.push(r)}return n}};function jh(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var K0=37297,Q0=0;function j0(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),a=Math.min(t+6,e.length);for(let r=s;r<a;r++){let o=r+1;n.push(`${o===t?">":" "} ${o}: ${e[r]}`)}return n.join(`
`)}var tu=new Ht;function tg(i){oe._getMatrix(tu,oe.workingColorSpace,i);let t=`mat3( ${tu.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(i)){case Cs:return[t,"LinearTransferOETF"];case ue:return[t,"sRGBTransferOETF"];default:return zt("WebGLProgram: Unsupported color space: ",i),[t,"LinearTransferOETF"]}}function eu(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),a=(i.getShaderInfoLog(t)||"").trim();if(n&&a==="")return"";let r=/ERROR: 0:(\d+)/.exec(a);if(r){let o=parseInt(r[1]);return e.toUpperCase()+`

`+a+`

`+j0(i.getShaderSource(t),o)}else return a}function eg(i,t){let e=tg(t);return[`vec4 ${i}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}var ng={[Ml]:"Linear",[Sl]:"Reinhard",[bl]:"Cineon",[rr]:"ACESFilmic",[Tl]:"AgX",[El]:"Neutral",[wl]:"Custom"};function ig(i,t){let e=ng[t];return e===void 0?(zt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+i+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}var So=new B;function sg(){oe.getLuminanceCoefficients(So);let i=So.x.toFixed(4),t=So.y.toFixed(4),e=So.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rg(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(mr).join(`
`)}function ag(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function og(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let a=i.getActiveAttrib(t,s),r=a.name,o=1;a.type===i.FLOAT_MAT2&&(o=2),a.type===i.FLOAT_MAT3&&(o=3),a.type===i.FLOAT_MAT4&&(o=4),e[r]={type:a.type,location:i.getAttribLocation(t,r),locationSize:o}}return e}function mr(i){return i!==""}function nu(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function iu(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var lg=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ql(i){return i.replace(lg,cg)}function cg(i,t){let e=jt[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Ql(e)}var hg=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function su(i){return i.replace(hg,ug)}function ug(i,t,e,n){let s="";for(let a=parseInt(t);a<parseInt(e);a++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+a+" ]").replace(/UNROLLED_LOOP_INDEX/g,a);return s}function ru(i){let t=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}var dg={[sr]:"SHADOWMAP_TYPE_PCF",[is]:"SHADOWMAP_TYPE_VSM"};function fg(i){return dg[i.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}var pg={[rs]:"ENVMAP_MODE_REFRACTION"};function mg(i){return i.envMap===!1?"ENVMAP_MODE_REFLECTION":pg[i.envMapMode]||"ENVMAP_MODE_REFLECTION"}var gg={[Da]:"ENVMAP_BLENDING_MULTIPLY",[_h]:"ENVMAP_BLENDING_MIX",[xh]:"ENVMAP_BLENDING_ADD"};function _g(i){return i.envMap===!1?"ENVMAP_BLENDING_NONE":gg[i.combine]||"ENVMAP_BLENDING_NONE"}function xg(i,t,e,n){let s=i.getContext(),a=e.defines,r=e.vertexShader,o=e.fragmentShader,l=fg(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",h=mg(e),u=_g(e),d=rg(e),f=ag(a),_=s.createProgram(),x,p,m=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(mr).join(`
`),x.length>0&&(x+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f].filter(mr).join(`
`),p.length>0&&(p+=`
`)):(x=[ru(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(mr).join(`
`),p=[ru(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,f,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Rn?"#define TONE_MAPPING":"",e.toneMapping!==Rn?jt.tonemapping_pars_fragment:"",e.toneMapping!==Rn?ig("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",jt.colorspace_pars_fragment,eg("linearToOutputTexel",e.outputColorSpace),sg(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(mr).join(`
`)),r=Ql(r),r=nu(r,e),r=iu(r,e),o=Ql(o),o=nu(o,e),o=iu(o,e),r=su(r),o=su(o),e.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,x=[d,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,p=["#define varying in",e.glslVersion===Ol?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ol?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=m+x+r,w=m+p+o,b=jh(s,s.VERTEX_SHADER,M),A=jh(s,s.FRAGMENT_SHADER,w);s.attachShader(_,b),s.attachShader(_,A),e.index0AttributeName!==void 0?s.bindAttribLocation(_,0,e.index0AttributeName):e.hasPositionAttribute===!0&&s.bindAttribLocation(_,0,"position"),s.linkProgram(_);function E(I){if(i.debug.checkShaderErrors){let U=s.getProgramInfoLog(_)||"",k=s.getShaderInfoLog(b)||"",V=s.getShaderInfoLog(A)||"",L=U.trim(),F=k.trim(),X=V.trim(),H=!0,rt=!0;if(s.getProgramParameter(_,s.LINK_STATUS)===!1)if(H=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,_,b,A);else{let q=eu(s,b,"vertex"),tt=eu(s,A,"fragment");Gt("WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(_,s.VALIDATE_STATUS)+`

Material Name: `+I.name+`
Material Type: `+I.type+`

Program Info Log: `+L+`
`+q+`
`+tt)}else L!==""?zt("WebGLProgram: Program Info Log:",L):(F===""||X==="")&&(rt=!1);rt&&(I.diagnostics={runnable:H,programLog:L,vertexShader:{log:F,prefix:x},fragmentShader:{log:X,prefix:p}})}s.deleteShader(b),s.deleteShader(A),g=new os(s,_),S=og(s,_)}let g;this.getUniforms=function(){return g===void 0&&E(this),g};let S;this.getAttributes=function(){return S===void 0&&E(this),S};let O=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return O===!1&&(O=s.getProgramParameter(_,K0)),O},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(_),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Q0++,this.cacheKey=t,this.usedTimes=1,this.program=_,this.vertexShader=b,this.fragmentShader=A,this}var yg=0,jl=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){let s=this._getShaderCacheForMaterial(t);return s.has(e)===!1&&(s.add(e),e.usedTimes++),s.has(n)===!1&&(s.add(n),n.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new tc(t),e.set(t,n)),n}},tc=class{constructor(t){this.id=yg++,this.code=t,this.usedTimes=0}};function vg(i){return i===li||i===ur||i===dr}function Mg(i,t,e,n,s,a){let r=new Is,o=new jl,l=new Set,c=[],h=new Map,u=n.logarithmicDepthBuffer,d={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(g){return l.add(g),g===0?"uv":`uv${g}`}function _(g,S,O,I,U,k){let V=I.fog,L=U.geometry,F=g.isMeshStandardMaterial||g.isMeshLambertMaterial||g.isMeshPhongMaterial?I.environment:null,X=g.isMeshStandardMaterial||g.isMeshLambertMaterial&&!g.envMap||g.isMeshPhongMaterial&&!g.envMap,H=t.get(g.envMap||F,X),rt=d[g.type],q=n.precision;g.precision!==null&&(q=n.getMaxPrecision(g.precision),q!==g.precision&&zt("WebGLProgram.getParameters:",g.precision,"not supported, using",q,"instead."));let tt=L.morphAttributes.position||L.morphAttributes.normal||L.morphAttributes.color,it=tt!==void 0?tt.length:0,wt=0;L.morphAttributes.position!==void 0&&(wt=1),L.morphAttributes.normal!==void 0&&(wt=2),L.morphAttributes.color!==void 0&&(wt=3);let Ut,J,ft,At;if(rt){let yt=In[rt];Ut=yt.vertexShader,J=yt.fragmentShader}else{Ut=g.vertexShader,J=g.fragmentShader;let yt=o.getVertexShaderStage(g),Qt=o.getFragmentShaderStage(g);o.update(g,yt,Qt),ft=yt.id,At=Qt.id}let Ot=i.getRenderTarget(),bt=i.state.buffers.depth.getReversed(),Bt=U.isInstancedMesh===!0,de=U.isBatchedMesh===!0,kt=!!g.map,Yt=!!g.matcap,Kt=!!H,st=Kt&&H.isPMREMTexture===!0,ct=!!g.aoMap,ut=!!g.lightMap,Rt=!!g.bumpMap&&g.wireframe===!1,xt=!!g.normalMap,Vt=!!g.displacementMap,Dt=!!g.emissiveMap,qt=!!g.metalnessMap,ne=!!g.roughnessMap,se=g.anisotropy>0,D=g.clearcoat>0,we=g.diffuseRoughness>0,Jt=g.dispersion>0,ie=g.retroreflectivity>0,ht=g.iridescence>0,ge=g.sheen>0,Ft=g.transmission>0,$t=se&&!!g.anisotropyMap,T=D&&!!g.clearcoatMap,y=D&&!!g.clearcoatNormalMap,z=D&&!!g.clearcoatRoughnessMap,at=we&&!!g.diffuseRoughnessMap,nt=ht&&!!g.iridescenceMap,pt=ht&&!!g.iridescenceThicknessMap,_t=ge&&!!g.sheenColorMap,j=ge&&!!g.sheenRoughnessMap,et=!!g.specularMap,mt=!!g.specularColorMap,R=!!g.specularIntensityMap,Q=Ft&&!!g.transmissionMap,K=Ft&&!!g.thicknessMap,gt=!!g.gradientMap,lt=!!g.alphaMap,N=g.alphaTest>0,Z=!!g.alphaHash,ot=!!g.extensions,Y=Rn;g.toneMapped&&(Ot===null||Ot.isXRRenderTarget===!0)&&(Y=i.toneMapping);let dt=st?H.isCompressedCubeTexture?H.image[0].mipmaps:H.mipmaps:null,Ct={shaderID:rt,shaderType:g.type,shaderName:g.name,vertexShader:Ut,fragmentShader:J,defines:g.defines,customVertexShaderID:ft,customFragmentShaderID:At,isRawShaderMaterial:g.isRawShaderMaterial===!0,glslVersion:g.glslVersion,precision:q,batching:de,batchingColor:de&&U._colorsTexture!==null,instancing:Bt,instancingColor:Bt&&U.instanceColor!==null,instancingMorph:Bt&&U.morphTexture!==null,outputColorSpace:Ot===null?i.outputColorSpace:Ot.isXRRenderTarget===!0?Ot.texture.colorSpace:oe.workingColorSpace,alphaToCoverage:!!g.alphaToCoverage,map:kt,matcap:Yt,envMap:Kt,envMapMode:Kt&&H.mapping,envMapPMREM:st,envMapMaxLod:st?dt.length-1:null,envMapSize:st?dt[0].width:null,aoMap:ct,lightMap:ut,bumpMap:Rt,normalMap:xt,displacementMap:Vt,emissiveMap:Dt,normalMapObjectSpace:xt&&g.normalMapType===Mh,normalMapTangentSpace:xt&&g.normalMapType===fr,packedNormalMap:xt&&g.normalMapType===fr&&vg(g.normalMap.format),metalnessMap:qt,roughnessMap:ne,anisotropy:se,anisotropyMap:$t,clearcoat:D,clearcoatMap:T,clearcoatNormalMap:y,clearcoatRoughnessMap:z,diffuseRoughness:we,diffuseRoughnessMap:at,dispersion:Jt,retroreflection:ie,iridescence:ht,iridescenceMap:nt,iridescenceThicknessMap:pt,sheen:ge,sheenColorMap:_t,sheenRoughnessMap:j,specularMap:et,specularColorMap:mt,specularIntensityMap:R,transmission:Ft,transmissionMap:Q,thicknessMap:K,gradientMap:gt,opaque:g.transparent===!1&&g.blending===ss&&g.alphaToCoverage===!1,alphaMap:lt,alphaTest:N,alphaHash:Z,combine:g.combine,mapUv:kt&&f(g.map.channel),aoMapUv:ct&&f(g.aoMap.channel),lightMapUv:ut&&f(g.lightMap.channel),bumpMapUv:Rt&&f(g.bumpMap.channel),normalMapUv:xt&&f(g.normalMap.channel),displacementMapUv:Vt&&f(g.displacementMap.channel),emissiveMapUv:Dt&&f(g.emissiveMap.channel),metalnessMapUv:qt&&f(g.metalnessMap.channel),roughnessMapUv:ne&&f(g.roughnessMap.channel),anisotropyMapUv:$t&&f(g.anisotropyMap.channel),clearcoatMapUv:T&&f(g.clearcoatMap.channel),clearcoatNormalMapUv:y&&f(g.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:z&&f(g.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:at&&f(g.diffuseRoughnessMap.channel),iridescenceMapUv:nt&&f(g.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&f(g.iridescenceThicknessMap.channel),sheenColorMapUv:_t&&f(g.sheenColorMap.channel),sheenRoughnessMapUv:j&&f(g.sheenRoughnessMap.channel),specularMapUv:et&&f(g.specularMap.channel),specularColorMapUv:mt&&f(g.specularColorMap.channel),specularIntensityMapUv:R&&f(g.specularIntensityMap.channel),transmissionMapUv:Q&&f(g.transmissionMap.channel),thicknessMapUv:K&&f(g.thicknessMap.channel),alphaMapUv:lt&&f(g.alphaMap.channel),vertexTangents:!!L.attributes.tangent&&(xt||se),vertexNormals:!!L.attributes.normal,vertexColors:g.vertexColors,vertexAlphas:g.vertexColors===!0&&!!L.attributes.color&&L.attributes.color.itemSize===4,pointsUvs:U.isPoints===!0&&!!L.attributes.uv&&(kt||lt),fog:!!V,useFog:g.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:g.wireframe===!1&&(g.flatShading===!0||L.attributes.normal===void 0&&xt===!1&&(g.isMeshLambertMaterial||g.isMeshPhongMaterial||g.isMeshStandardMaterial||g.isMeshPhysicalMaterial)),sizeAttenuation:g.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:bt,skinning:U.isSkinnedMesh===!0,hasPositionAttribute:L.attributes.position!==void 0,morphTargets:L.morphAttributes.position!==void 0,morphNormals:L.morphAttributes.normal!==void 0,morphColors:L.morphAttributes.color!==void 0,morphTargetsCount:it,morphTextureStride:wt,numSunLights:S.sun.length,numDirLights:S.directional.length,numPointLights:S.point.length,numSpotLights:S.spot.length,numSpotLightMaps:S.spotLightMap.length,numRectAreaLights:S.rectArea.length,numHemiLights:S.hemi.length,numSunLightShadows:S.sunShadowMap.length,numDirLightShadows:S.directionalShadowMap.length,numPointLightShadows:S.pointShadowMap.length,numSpotLightShadows:S.spotShadowMap.length,numSpotLightShadowsWithMaps:S.numSpotLightShadowsWithMaps,numLightProbes:S.numLightProbes,numLightProbeGrids:k.filter(yt=>yt.texture!==null).length,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:g.dithering,shadowMapEnabled:i.shadowMap.enabled&&O.length>0,shadowMapType:i.shadowMap.type,toneMapping:Y,decodeVideoTexture:kt&&g.map.isVideoTexture===!0&&oe.getTransfer(g.map.colorSpace)===ue,decodeVideoTextureEmissive:Dt&&g.emissiveMap.isVideoTexture===!0&&oe.getTransfer(g.emissiveMap.colorSpace)===ue,premultipliedAlpha:g.premultipliedAlpha,doubleSided:g.side===an,flipSided:g.side===Be,useDepthPacking:g.depthPacking>=0,depthPacking:g.depthPacking||0,index0AttributeName:g.index0AttributeName,extensionClipCullDistance:ot&&g.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ot&&g.extensions.multiDraw===!0||de)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:g.customProgramCacheKey()};return Ct.vertexUv1s=l.has(1),Ct.vertexUv2s=l.has(2),Ct.vertexUv3s=l.has(3),l.clear(),Ct}function x(g){let S=[];if(g.shaderID?S.push(g.shaderID):(S.push(g.customVertexShaderID),S.push(g.customFragmentShaderID)),g.defines!==void 0)for(let O in g.defines)S.push(O),S.push(g.defines[O]);return g.isRawShaderMaterial===!1&&(p(S,g),m(S,g),S.push(i.outputColorSpace)),S.push(g.customProgramCacheKey),S.join()}function p(g,S){g.push(S.precision),g.push(S.outputColorSpace),g.push(S.envMapMode),g.push(S.envMapPMREM),g.push(S.envMapMaxLod),g.push(S.envMapSize),g.push(S.mapUv),g.push(S.alphaMapUv),g.push(S.lightMapUv),g.push(S.aoMapUv),g.push(S.bumpMapUv),g.push(S.normalMapUv),g.push(S.displacementMapUv),g.push(S.emissiveMapUv),g.push(S.metalnessMapUv),g.push(S.roughnessMapUv),g.push(S.anisotropyMapUv),g.push(S.clearcoatMapUv),g.push(S.clearcoatNormalMapUv),g.push(S.clearcoatRoughnessMapUv),g.push(S.diffuseRoughnessMapUv),g.push(S.iridescenceMapUv),g.push(S.iridescenceThicknessMapUv),g.push(S.sheenColorMapUv),g.push(S.sheenRoughnessMapUv),g.push(S.specularMapUv),g.push(S.specularColorMapUv),g.push(S.specularIntensityMapUv),g.push(S.transmissionMapUv),g.push(S.thicknessMapUv),g.push(S.combine),g.push(S.fogExp2),g.push(S.sizeAttenuation),g.push(S.morphTargetsCount),g.push(S.numSunLights),g.push(S.numDirLights),g.push(S.numPointLights),g.push(S.numSpotLights),g.push(S.numSpotLightMaps),g.push(S.numHemiLights),g.push(S.numRectAreaLights),g.push(S.numSunLightShadows),g.push(S.numDirLightShadows),g.push(S.numPointLightShadows),g.push(S.numSpotLightShadows),g.push(S.numSpotLightShadowsWithMaps),g.push(S.numLightProbes),g.push(S.numLightProbeGrids),g.push(S.shadowMapType),g.push(S.toneMapping),g.push(S.numClippingPlanes),g.push(S.numClipIntersection),g.push(S.depthPacking)}function m(g,S){r.disableAll(),S.instancing&&r.enable(0),S.instancingColor&&r.enable(1),S.instancingMorph&&r.enable(2),S.matcap&&r.enable(3),S.envMap&&r.enable(4),S.normalMapObjectSpace&&r.enable(5),S.normalMapTangentSpace&&r.enable(6),S.clearcoat&&r.enable(7),S.iridescence&&r.enable(8),S.alphaTest&&r.enable(9),S.vertexColors&&r.enable(10),S.vertexAlphas&&r.enable(11),S.vertexUv1s&&r.enable(12),S.vertexUv2s&&r.enable(13),S.vertexUv3s&&r.enable(14),S.vertexTangents&&r.enable(15),S.anisotropy&&r.enable(16),S.alphaHash&&r.enable(17),S.batching&&r.enable(18),S.dispersion&&r.enable(19),S.retroreflection&&r.enable(24),S.diffuseRoughness&&r.enable(25),S.batchingColor&&r.enable(20),S.gradientMap&&r.enable(21),S.packedNormalMap&&r.enable(22),S.vertexNormals&&r.enable(23),g.push(r.mask),r.disableAll(),S.fog&&r.enable(0),S.useFog&&r.enable(1),S.flatShading&&r.enable(2),S.logarithmicDepthBuffer&&r.enable(3),S.reversedDepthBuffer&&r.enable(4),S.skinning&&r.enable(5),S.morphTargets&&r.enable(6),S.morphNormals&&r.enable(7),S.morphColors&&r.enable(8),S.premultipliedAlpha&&r.enable(9),S.shadowMapEnabled&&r.enable(10),S.doubleSided&&r.enable(11),S.flipSided&&r.enable(12),S.useDepthPacking&&r.enable(13),S.dithering&&r.enable(14),S.transmission&&r.enable(15),S.sheen&&r.enable(16),S.opaque&&r.enable(17),S.pointsUvs&&r.enable(18),S.decodeVideoTexture&&r.enable(19),S.decodeVideoTextureEmissive&&r.enable(20),S.alphaToCoverage&&r.enable(21),S.numLightProbeGrids>0&&r.enable(22),S.hasPositionAttribute&&r.enable(23),g.push(r.mask)}function M(g){let S=d[g.type],O;if(S){let I=In[S];O=zh.clone(I.uniforms)}else O=g.uniforms;return O}function w(g,S){let O=h.get(S);return O!==void 0?++O.usedTimes:(O=new xg(i,S,g,s),c.push(O),h.set(S,O)),O}function b(g){if(--g.usedTimes===0){let S=c.indexOf(g);c[S]=c[c.length-1],c.pop(),h.delete(g.cacheKey),g.destroy()}}function A(g){o.remove(g)}function E(){o.dispose()}return{getParameters:_,getProgramCacheKey:x,getUniforms:M,acquireProgram:w,releaseProgram:b,releaseShaderCache:A,programs:c,dispose:E}}function Sg(){let i=new WeakMap;function t(r){return i.has(r)}function e(r){let o=i.get(r);return o===void 0&&(o={},i.set(r,o)),o}function n(r){i.delete(r)}function s(r,o,l){i.get(r)[o]=l}function a(){i=new WeakMap}return{has:t,get:e,remove:n,update:s,dispose:a}}function bg(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.materialVariant!==t.materialVariant?i.materialVariant-t.materialVariant:i.z!==t.z?i.z-t.z:i.id-t.id}function au(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function ou(){let i=[],t=0,e=[],n=[],s=[];function a(){t=0,e.length=0,n.length=0,s.length=0}function r(d){let f=0;return d.isInstancedMesh&&(f+=2),d.isSkinnedMesh&&(f+=1),f}function o(d,f,_,x,p,m){let M=i[t];return M===void 0?(M={id:d.id,object:d,geometry:f,material:_,materialVariant:r(d),groupOrder:x,renderOrder:d.renderOrder,z:p,group:m},i[t]=M):(M.id=d.id,M.object=d,M.geometry=f,M.material=_,M.materialVariant=r(d),M.groupOrder=x,M.renderOrder=d.renderOrder,M.z=p,M.group=m),t++,M}function l(d,f,_,x,p,m,M){M.reversedDepth===!0&&(p=-p);let w=o(d,f,_,x,p,m);_.transmission>0?n.push(w):_.transparent===!0?s.push(w):e.push(w)}function c(d,f,_,x,p,m){let M=o(d,f,_,x,p,m);_.transmission>0?n.unshift(M):_.transparent===!0?s.unshift(M):e.unshift(M)}function h(d,f){e.length>1&&e.sort(d||bg),n.length>1&&n.sort(f||au),s.length>1&&s.sort(f||au)}function u(){for(let d=t,f=i.length;d<f;d++){let _=i[d];if(_.id===null)break;_.id=null,_.object=null,_.geometry=null,_.material=null,_.group=null}}return{opaque:e,transmissive:n,transparent:s,init:a,push:l,unshift:c,finish:u,sort:h}}function wg(){let i=new WeakMap;function t(n,s){let a=i.get(n),r;return a===void 0?(r=new ou,i.set(n,[r])):s>=a.length?(r=new ou,a.push(r)):r=a[s],r}function e(){i=new WeakMap}return{get:t,dispose:e}}function Tg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new B,color:new Zt};break;case"SpotLight":e={position:new B,direction:new B,color:new Zt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new B,color:new Zt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new B,skyColor:new Zt,groundColor:new Zt};break;case"RectAreaLight":e={color:new Zt,position:new B,halfWidth:new B,halfHeight:new B};break}return i[t.id]=e,e}}}function Eg(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Mt,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var Ag=0;function Cg(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function Rg(i){let t=new Tg,e=Eg(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new B);let s=new B,a=new fe,r=new fe;function o(c){let h=0,u=0,d=0;for(let k=0;k<9;k++)n.probe[k].set(0,0,0);let f=0,_=0,x=0,p=0,m=0,M=0,w=0,b=0,A=0,E=0,g=0,S=0,O=0,I=0;c.sort(Cg);for(let k=0,V=c.length;k<V;k++){let L=c[k],F=L.color,X=L.intensity,H=L.distance,rt=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===li?rt=L.shadow.map.texture:rt=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)h+=F.r*X,u+=F.g*X,d+=F.b*X;else if(L.isLightProbe){for(let q=0;q<9;q++)n.probe[q].addScaledVector(L.sh.coefficients[q],X);I++}else if(L.isSunLight){let q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let tt=L.shadow,it=e.get(L);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize.copy(tt.mapSize).multiply(tt.getFrameExtents()),n.sunShadow[_]=it,n.sunShadowMap[_]=rt;let wt=tt.getViewportCount();for(let Ut=0;Ut<wt;Ut++)n.sunShadowMatrix[x+Ut]=tt.getMatrix(Ut),n.sunShadowCascade[x+Ut]=tt._cascadeData[Ut];x+=wt,_++}n.sun[f]=q,f++}else if(L.isDirectionalLight){let q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){let tt=L.shadow,it=e.get(L);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize=tt.mapSize,n.directionalShadow[p]=it,n.directionalShadowMap[p]=rt,n.directionalShadowMatrix[p]=L.shadow.matrix,A++}n.directional[p]=q,p++}else if(L.isSpotLight){let q=t.get(L);q.position.setFromMatrixPosition(L.matrixWorld),q.color.copy(F).multiplyScalar(X),q.distance=H,q.coneCos=Math.cos(L.angle),q.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),q.decay=L.decay,n.spot[M]=q;let tt=L.shadow;if(L.map&&(n.spotLightMap[S]=L.map,S++,tt.updateMatrices(L),L.castShadow&&O++),n.spotLightMatrix[M]=tt.matrix,L.castShadow){let it=e.get(L);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize=tt.mapSize,n.spotShadow[M]=it,n.spotShadowMap[M]=rt,g++}M++}else if(L.isRectAreaLight){let q=t.get(L);q.color.copy(F).multiplyScalar(X),q.halfWidth.set(L.width*.5,0,0),q.halfHeight.set(0,L.height*.5,0),n.rectArea[w]=q,w++}else if(L.isPointLight){let q=t.get(L);if(q.color.copy(L.color).multiplyScalar(L.intensity),q.distance=L.distance,q.decay=L.decay,L.castShadow){let tt=L.shadow,it=e.get(L);it.shadowIntensity=tt.intensity,it.shadowBias=tt.bias,it.shadowNormalBias=tt.normalBias,it.shadowRadius=tt.radius,it.shadowMapSize=tt.mapSize,it.shadowCameraNear=tt.camera.near,it.shadowCameraFar=tt.camera.far,n.pointShadow[m]=it,n.pointShadowMap[m]=rt,n.pointShadowMatrix[m]=L.shadow.matrix,E++}n.point[m]=q,m++}else if(L.isHemisphereLight){let q=t.get(L);q.skyColor.copy(L.color).multiplyScalar(X),q.groundColor.copy(L.groundColor).multiplyScalar(X),n.hemi[b]=q,b++}}w>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Tt.LTC_FLOAT_1,n.rectAreaLTC2=Tt.LTC_FLOAT_2):(n.rectAreaLTC1=Tt.LTC_HALF_1,n.rectAreaLTC2=Tt.LTC_HALF_2)),n.ambient[0]=h,n.ambient[1]=u,n.ambient[2]=d;let U=n.hash;(U.sunLength!==f||U.directionalLength!==p||U.pointLength!==m||U.spotLength!==M||U.rectAreaLength!==w||U.hemiLength!==b||U.numSunShadows!==_||U.numDirectionalShadows!==A||U.numPointShadows!==E||U.numSpotShadows!==g||U.numSpotMaps!==S||U.numLightProbes!==I)&&(n.sun.length=f,n.directional.length=p,n.spot.length=M,n.rectArea.length=w,n.point.length=m,n.hemi.length=b,n.sunShadow.length=_,n.sunShadowMap.length=_,n.sunShadowMatrix.length=x,n.sunShadowCascade.length=x,n.directionalShadow.length=A,n.directionalShadowMap.length=A,n.directionalShadowMatrix.length=A,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=g,n.spotShadowMap.length=g,n.spotLightMatrix.length=g+S-O,n.spotLightMap.length=S,n.numSpotLightShadowsWithMaps=O,n.numLightProbes=I,U.sunLength=f,U.directionalLength=p,U.pointLength=m,U.spotLength=M,U.rectAreaLength=w,U.hemiLength=b,U.numSunShadows=_,U.numDirectionalShadows=A,U.numPointShadows=E,U.numSpotShadows=g,U.numSpotMaps=S,U.numLightProbes=I,n.version=Ag++)}function l(c,h){let u=0,d=0,f=0,_=0,x=0,p=0,m=h.matrixWorldInverse;for(let M=0,w=c.length;M<w;M++){let b=c[M];if(b.isSunLight){let A=n.sun[u];A.direction.setFromMatrixPosition(b.matrixWorld),A.direction.transformDirection(m),u++}else if(b.isDirectionalLight){let A=n.directional[d];A.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(m),d++}else if(b.isSpotLight){let A=n.spot[_];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(m),A.direction.setFromMatrixPosition(b.matrixWorld),s.setFromMatrixPosition(b.target.matrixWorld),A.direction.sub(s),A.direction.transformDirection(m),_++}else if(b.isRectAreaLight){let A=n.rectArea[x];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(m),r.identity(),a.copy(b.matrixWorld),a.premultiply(m),r.extractRotation(a),A.halfWidth.set(b.width*.5,0,0),A.halfHeight.set(0,b.height*.5,0),A.halfWidth.applyMatrix4(r),A.halfHeight.applyMatrix4(r),x++}else if(b.isPointLight){let A=n.point[f];A.position.setFromMatrixPosition(b.matrixWorld),A.position.applyMatrix4(m),f++}else if(b.isHemisphereLight){let A=n.hemi[p];A.direction.setFromMatrixPosition(b.matrixWorld),A.direction.transformDirection(m),p++}}}return{setup:o,setupView:l,state:n}}function lu(i){let t=new Rg(i),e=[],n=[],s=[];function a(u){h.camera=u,e.length=0,n.length=0,s.length=0}function r(u){u.isLightProbeGrid?s.push(u):e.push(u)}function o(u){n.push(u)}function l(){t.setup(e),s.sort((u,d)=>u.priority-d.priority||u.id-d.id)}function c(u){t.setupView(e,u)}let h={lightsArray:e,shadowsArray:n,lightProbeGridArray:s,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:a,state:h,setupLights:l,setupLightsView:c,pushLight:r,pushShadow:o}}function Lg(i){let t=new WeakMap;function e(s,a=0){let r=t.get(s),o;return r===void 0?(o=new lu(i),t.set(s,[o])):a>=r.length?(o=new lu(i),r.push(o)):o=r[a],o}function n(){t=new WeakMap}return{get:e,dispose:n}}var Ig=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,Pg=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,Dg=[new B(1,0,0),new B(-1,0,0),new B(0,1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1)],Ng=[new B(0,-1,0),new B(0,-1,0),new B(0,0,1),new B(0,0,-1),new B(0,-1,0),new B(0,-1,0)],cu=new fe,pr=new B,Zl=new B;function Ug(i,t,e){let n=new ni,s=new Mt,a=new Mt,r=new Me,o=new ya,l=new va,c={},h=e.maxTextureSize,u={[oi]:Be,[Be]:oi,[an]:an},d=new An({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Mt},radius:{value:4}},vertexShader:Ig,fragmentShader:Pg}),f=d.clone();f.defines.HORIZONTAL_PASS=1;let _=new pn;_.setAttribute("position",new fn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let x=new pe(_,d),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=sr;let m=this.type;this.render=function(E,g,S){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===Pa&&(zt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=sr);let O=i.getRenderTarget(),I=i.getActiveCubeFace(),U=i.getActiveMipmapLevel(),k=i.state;k.setBlending(bi),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let V=m!==this.type;V&&g.traverse(function(L){L.material&&(Array.isArray(L.material)?L.material.forEach(F=>F.needsUpdate=!0):L.material.needsUpdate=!0)});for(let L=0,F=E.length;L<F;L++){let X=E[L],H=X.shadow;if(H===void 0){zt("WebGLShadowMap:",X,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;s.copy(H.mapSize);let rt=H.getFrameExtents();s.multiply(rt),a.copy(H.mapSize),(s.x>h||s.y>h)&&(s.x>h&&(a.x=Math.floor(h/rt.x),s.x=a.x*rt.x,H.mapSize.x=a.x),s.y>h&&(a.y=Math.floor(h/rt.y),s.y=a.y*rt.y,H.mapSize.y=a.y));let q=i.state.buffers.depth.getReversed();if(H.camera._reversedDepth=q,H.map===null||V===!0){if(H.map!==null&&(H.map.depthTexture!==null&&(H.map.depthTexture.dispose(),H.map.depthTexture=null),H.map.dispose()),this.type===is){if(X.isPointLight){zt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}H.map=new tn(s.x,s.y,{format:li,type:gn,minFilter:Ye,magFilter:Ye,generateMipmaps:!1}),H.map.texture.name=X.name+".shadowMap",H.map.depthTexture=new Hn(s.x,s.y,on),H.map.depthTexture.name=X.name+".shadowMapDepth",H.map.depthTexture.format=$n,H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=De,H.map.depthTexture.magFilter=De}else X.isPointLight?(H.map=new gr(s.x),H.map.depthTexture=new Bs(s.x,mn)):(H.map=new tn(s.x,s.y),H.map.depthTexture=new Hn(s.x,s.y,mn)),H.map.depthTexture.name=X.name+".shadowMap",H.map.depthTexture.format=$n,this.type===sr?(H.map.depthTexture.compareFunction=q?Ul:Nl,H.map.depthTexture.minFilter=Ye,H.map.depthTexture.magFilter=Ye):(H.map.depthTexture.compareFunction=null,H.map.depthTexture.minFilter=De,H.map.depthTexture.magFilter=De);H.camera.updateProjectionMatrix()}H.map.isWebGLCubeRenderTarget!==!0&&(H.map.width!==s.x||H.map.height!==s.y)&&H.map.setSize(s.x,s.y);let tt=H.map.isWebGLCubeRenderTarget?6:H.getViewportCount();X.isPointLight!==!0&&H.updateMatrices(X,S);let it=(H.camera.layers.mask&4294967294)!==0?H.camera.layers:S.layers;for(let wt=0;wt<tt;wt++){let Ut=H.getCamera(wt);if(X.isPointLight){let J=H.camera,ft=H.matrix,At=X.distance||J.far;At!==J.far&&(J.far=At,J.updateProjectionMatrix()),pr.setFromMatrixPosition(X.matrixWorld),J.position.copy(pr),Zl.copy(J.position),Zl.add(Dg[wt]),J.up.copy(Ng[wt]),J.lookAt(Zl),J.updateMatrixWorld(),ft.makeTranslation(-pr.x,-pr.y,-pr.z),cu.multiplyMatrices(J.projectionMatrix,J.matrixWorldInverse),H._frustum.setFromProjectionMatrix(cu,J.coordinateSystem,J.reversedDepth)}if(H.map.isWebGLCubeRenderTarget)i.setRenderTarget(H.map,wt),i.clear();else{wt===0&&(i.setRenderTarget(H.map),i.clear());let J=H.getViewport(wt);r.set(a.x*J.x,a.y*J.y,a.x*J.z,a.y*J.w),k.viewport(r)}n=H.getFrustum(wt),b(g,S,Ut,X,it,this.type)}H.isPointLightShadow!==!0&&this.type===is&&M(H,S),H.needsUpdate=!1}m=this.type,p.needsUpdate=!1,i.setRenderTarget(O,I,U)};function M(E,g){let S=t.update(x);d.defines.VSM_SAMPLES!==E.blurSamples&&(d.defines.VSM_SAMPLES=E.blurSamples,f.defines.VSM_SAMPLES=E.blurSamples,d.needsUpdate=!0,f.needsUpdate=!0),E.mapPass===null?E.mapPass=new tn(s.x,s.y,{format:li,type:gn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),d.uniforms.shadow_pass.value=E.map.depthTexture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,i.setRenderTarget(E.mapPass),i.clear(),i.renderBufferDirect(g,null,S,d,x,null),f.uniforms.shadow_pass.value=E.mapPass.texture,f.uniforms.resolution.value.set(E.map.width,E.map.height),f.uniforms.radius.value=E.radius,i.setRenderTarget(E.map),i.clear(),i.renderBufferDirect(g,null,S,f,x,null)}function w(E,g,S,O){let I=null,U=S.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(U!==void 0)I=U;else if(I=S.isPointLight===!0?l:o,i.localClippingEnabled&&g.clipShadows===!0&&Array.isArray(g.clippingPlanes)&&g.clippingPlanes.length!==0||g.displacementMap&&g.displacementScale!==0||g.alphaMap&&g.alphaTest>0||g.map&&g.alphaTest>0||g.alphaToCoverage===!0){let k=I.uuid,V=g.uuid,L=c[k];L===void 0&&(L={},c[k]=L);let F=L[V];F===void 0&&(F=I.clone(),L[V]=F,g.addEventListener("dispose",A)),I=F}if(I.visible=g.visible,I.wireframe=g.wireframe,O===is?I.side=g.shadowSide!==null?g.shadowSide:g.side:I.side=g.shadowSide!==null?g.shadowSide:u[g.side],I.alphaMap=g.alphaMap,I.alphaTest=g.alphaToCoverage===!0?.5:g.alphaTest,I.map=g.map,I.clipShadows=g.clipShadows,I.clippingPlanes=g.clippingPlanes,I.clipIntersection=g.clipIntersection,I.displacementMap=g.displacementMap,I.displacementScale=g.displacementScale,I.displacementBias=g.displacementBias,I.wireframeLinewidth=g.wireframeLinewidth,I.linewidth=g.linewidth,S.isPointLight===!0&&I.isMeshDistanceMaterial===!0){let k=i.properties.get(I);k.light=S}return I}function b(E,g,S,O,I,U){if(E.visible===!1)return;if(E.layers.test(I)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&U===is)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,E.matrixWorld);let L=t.update(E),F=E.material;if(Array.isArray(F)){let X=L.groups;for(let H=0,rt=X.length;H<rt;H++){let q=X[H],tt=F[q.materialIndex];if(tt&&tt.visible){let it=w(E,tt,O,U);E.onBeforeShadow(i,E,g,S,L,it,q),i.renderBufferDirect(S,null,L,it,E,q),E.onAfterShadow(i,E,g,S,L,it,q)}}}else if(F.visible){let X=w(E,F,O,U);E.onBeforeShadow(i,E,g,S,L,X,null),i.renderBufferDirect(S,null,L,X,E,null),E.onAfterShadow(i,E,g,S,L,X,null)}}let V=E.children;for(let L=0,F=V.length;L<F;L++)b(V[L],g,S,O,I,U)}function A(E){E.target.removeEventListener("dispose",A);for(let S in c){let O=c[S],I=E.target.uuid;I in O&&(O[I].dispose(),delete O[I])}}}function Fg(i,t){function e(){let R=!1,Q=new Me,K=null,gt=new Me(0,0,0,0);return{setMask:function(lt){K!==lt&&!R&&(i.colorMask(lt,lt,lt,lt),K=lt)},setLocked:function(lt){R=lt},setClear:function(lt,N,Z,ot,Y){Y===!0&&(lt*=ot,N*=ot,Z*=ot),Q.set(lt,N,Z,ot),gt.equals(Q)===!1&&(i.clearColor(lt,N,Z,ot),gt.copy(Q))},reset:function(){R=!1,K=null,gt.set(-1,0,0,0)}}}function n(){let R=!1,Q=!1,K=null,gt=null,lt=null;return{setReversed:function(N){if(Q!==N){let Z=t.get("EXT_clip_control");N?Z.clipControlEXT(Z.LOWER_LEFT_EXT,Z.ZERO_TO_ONE_EXT):Z.clipControlEXT(Z.LOWER_LEFT_EXT,Z.NEGATIVE_ONE_TO_ONE_EXT),Q=N;let ot=lt;lt=null,this.setClear(ot)}},getReversed:function(){return Q},setTest:function(N){N?bt(i.DEPTH_TEST):Bt(i.DEPTH_TEST)},setMask:function(N){K!==N&&!R&&(i.depthMask(N),K=N)},setFunc:function(N){if(Q&&(N=Ph[N]),gt!==N){switch(N){case Jr:i.depthFunc(i.NEVER);break;case Kr:i.depthFunc(i.ALWAYS);break;case Qr:i.depthFunc(i.LESS);break;case Xi:i.depthFunc(i.LEQUAL);break;case jr:i.depthFunc(i.EQUAL);break;case ta:i.depthFunc(i.GEQUAL);break;case ea:i.depthFunc(i.GREATER);break;case na:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}gt=N}},setLocked:function(N){R=N},setClear:function(N){lt!==N&&(lt=N,Q&&(N=1-N),i.clearDepth(N))},reset:function(){R=!1,K=null,gt=null,lt=null,Q=!1}}}function s(){let R=!1,Q=null,K=null,gt=null,lt=null,N=null,Z=null,ot=null,Y=null;return{setTest:function(dt){R||(dt?bt(i.STENCIL_TEST):Bt(i.STENCIL_TEST))},setMask:function(dt){Q!==dt&&!R&&(i.stencilMask(dt),Q=dt)},setFunc:function(dt,Ct,yt){(K!==dt||gt!==Ct||lt!==yt)&&(i.stencilFunc(dt,Ct,yt),K=dt,gt=Ct,lt=yt)},setOp:function(dt,Ct,yt){(N!==dt||Z!==Ct||ot!==yt)&&(i.stencilOp(dt,Ct,yt),N=dt,Z=Ct,ot=yt)},setLocked:function(dt){R=dt},setClear:function(dt){Y!==dt&&(i.clearStencil(dt),Y=dt)},reset:function(){R=!1,Q=null,K=null,gt=null,lt=null,N=null,Z=null,ot=null,Y=null}}}let a=new e,r=new n,o=new s,l={},c=new WeakMap,h={},u={},d={},f=new WeakMap,_=[],x=null,p=!1,m=null,M=null,w=null,b=null,A=null,E=null,g=null,S=new Zt(0,0,0),O=0,I=!1,U=null,k=null,V=null,L=null,F=null,X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),H=!1,rt=0,q=i.getParameter(i.VERSION);q.indexOf("WebGL")!==-1?(rt=parseFloat(/^WebGL (\d)/.exec(q)[1]),H=rt>=1):q.indexOf("OpenGL ES")!==-1&&(rt=parseFloat(/^OpenGL ES (\d)/.exec(q)[1]),H=rt>=2);let tt=null,it={},wt=i.getParameter(i.SCISSOR_BOX),Ut=i.getParameter(i.VIEWPORT),J=new Me().fromArray(wt),ft=new Me().fromArray(Ut);function At(R,Q,K,gt){let lt=new Uint8Array(4),N=i.createTexture();i.bindTexture(R,N),i.texParameteri(R,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(R,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Z=0;Z<K;Z++)R===i.TEXTURE_3D||R===i.TEXTURE_2D_ARRAY?i.texImage3D(Q,0,i.RGBA,1,1,gt,0,i.RGBA,i.UNSIGNED_BYTE,lt):i.texImage2D(Q+Z,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,lt);return N}let Ot={};Ot[i.TEXTURE_2D]=At(i.TEXTURE_2D,i.TEXTURE_2D,1),Ot[i.TEXTURE_CUBE_MAP]=At(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ot[i.TEXTURE_2D_ARRAY]=At(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Ot[i.TEXTURE_3D]=At(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),r.setClear(1),o.setClear(0),bt(i.DEPTH_TEST),r.setFunc(Xi),Rt(!1),xt(ml),bt(i.CULL_FACE),ct(bi);function bt(R){h[R]!==!0&&(i.enable(R),h[R]=!0)}function Bt(R){h[R]!==!1&&(i.disable(R),h[R]=!1)}function de(R,Q){return d[R]!==Q?(i.bindFramebuffer(R,Q),d[R]=Q,R===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=Q),R===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=Q),!0):!1}function kt(R,Q){let K=_,gt=!1;if(R){K=f.get(Q),K===void 0&&(K=[],f.set(Q,K));let lt=R.textures;if(K.length!==lt.length||K[0]!==i.COLOR_ATTACHMENT0){for(let N=0,Z=lt.length;N<Z;N++)K[N]=i.COLOR_ATTACHMENT0+N;K.length=lt.length,gt=!0}}else K[0]!==i.BACK&&(K[0]=i.BACK,gt=!0);gt&&i.drawBuffers(K)}function Yt(R){return x!==R?(i.useProgram(R),x=R,!0):!1}let Kt={[wi]:i.FUNC_ADD,[th]:i.FUNC_SUBTRACT,[eh]:i.FUNC_REVERSE_SUBTRACT};Kt[nh]=i.MIN,Kt[ih]=i.MAX;let st={[sh]:i.ZERO,[rh]:i.ONE,[ah]:i.SRC_COLOR,[yl]:i.SRC_ALPHA,[dh]:i.SRC_ALPHA_SATURATE,[hh]:i.DST_COLOR,[lh]:i.DST_ALPHA,[oh]:i.ONE_MINUS_SRC_COLOR,[vl]:i.ONE_MINUS_SRC_ALPHA,[uh]:i.ONE_MINUS_DST_COLOR,[ch]:i.ONE_MINUS_DST_ALPHA,[fh]:i.CONSTANT_COLOR,[ph]:i.ONE_MINUS_CONSTANT_COLOR,[mh]:i.CONSTANT_ALPHA,[gh]:i.ONE_MINUS_CONSTANT_ALPHA};function ct(R,Q,K,gt,lt,N,Z,ot,Y,dt){if(R===bi){p===!0&&(Bt(i.BLEND),p=!1);return}if(p===!1&&(bt(i.BLEND),p=!0),R!==jc){if(R!==m||dt!==I){if((M!==wi||A!==wi)&&(i.blendEquation(i.FUNC_ADD),M=wi,A=wi),dt)switch(R){case ss:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case gl:i.blendFunc(i.ONE,i.ONE);break;case _l:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xl:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:Gt("WebGLState: Invalid blending: ",R);break}else switch(R){case ss:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case gl:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case _l:Gt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case xl:Gt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:Gt("WebGLState: Invalid blending: ",R);break}w=null,b=null,E=null,g=null,S.set(0,0,0),O=0,m=R,I=dt}return}lt=lt||Q,N=N||K,Z=Z||gt,(Q!==M||lt!==A)&&(i.blendEquationSeparate(Kt[Q],Kt[lt]),M=Q,A=lt),(K!==w||gt!==b||N!==E||Z!==g)&&(i.blendFuncSeparate(st[K],st[gt],st[N],st[Z]),w=K,b=gt,E=N,g=Z),(ot.equals(S)===!1||Y!==O)&&(i.blendColor(ot.r,ot.g,ot.b,Y),S.copy(ot),O=Y),m=R,I=!1}function ut(R,Q){R.side===an?Bt(i.CULL_FACE):bt(i.CULL_FACE);let K=R.side===Be;Q&&(K=!K),Rt(K),R.blending===ss&&R.transparent===!1?ct(bi):ct(R.blending,R.blendEquation,R.blendSrc,R.blendDst,R.blendEquationAlpha,R.blendSrcAlpha,R.blendDstAlpha,R.blendColor,R.blendAlpha,R.premultipliedAlpha),r.setFunc(R.depthFunc),r.setTest(R.depthTest),r.setMask(R.depthWrite),a.setMask(R.colorWrite);let gt=R.stencilWrite;o.setTest(gt),gt&&(o.setMask(R.stencilWriteMask),o.setFunc(R.stencilFunc,R.stencilRef,R.stencilFuncMask),o.setOp(R.stencilFail,R.stencilZFail,R.stencilZPass)),Dt(R.polygonOffset,R.polygonOffsetFactor,R.polygonOffsetUnits),R.alphaToCoverage===!0?bt(i.SAMPLE_ALPHA_TO_COVERAGE):Bt(i.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(R){U!==R&&(R?i.frontFace(i.CW):i.frontFace(i.CCW),U=R)}function xt(R){R!==Kc?(bt(i.CULL_FACE),R!==k&&(R===ml?i.cullFace(i.BACK):R===Qc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Bt(i.CULL_FACE),k=R}function Vt(R){R!==V&&(H&&i.lineWidth(R),V=R)}function Dt(R,Q,K){R?(bt(i.POLYGON_OFFSET_FILL),(L!==Q||F!==K)&&(L=Q,F=K,r.getReversed()&&(Q=-Q,K=-K),i.polygonOffset(Q,K))):Bt(i.POLYGON_OFFSET_FILL)}function qt(R){R?bt(i.SCISSOR_TEST):Bt(i.SCISSOR_TEST)}function ne(R){R===void 0&&(R=i.TEXTURE0+X-1),tt!==R&&(i.activeTexture(R),tt=R)}function se(R,Q,K){K===void 0&&(tt===null?K=i.TEXTURE0+X-1:K=tt);let gt=it[K];gt===void 0&&(gt={type:void 0,texture:void 0},it[K]=gt),(gt.type!==R||gt.texture!==Q)&&(tt!==K&&(i.activeTexture(K),tt=K),i.bindTexture(R,Q||Ot[R]),gt.type=R,gt.texture=Q)}function D(){let R=it[tt];R!==void 0&&R.type!==void 0&&(i.bindTexture(R.type,null),R.type=void 0,R.texture=void 0)}function we(){try{i.compressedTexImage2D(...arguments)}catch(R){Gt("WebGLState:",R)}}function Jt(){try{i.compressedTexImage3D(...arguments)}catch(R){Gt("WebGLState:",R)}}function ie(){try{i.texSubImage2D(...arguments)}catch(R){Gt("WebGLState:",R)}}function ht(){try{i.texSubImage3D(...arguments)}catch(R){Gt("WebGLState:",R)}}function ge(){try{i.compressedTexSubImage2D(...arguments)}catch(R){Gt("WebGLState:",R)}}function Ft(){try{i.compressedTexSubImage3D(...arguments)}catch(R){Gt("WebGLState:",R)}}function $t(){try{i.texStorage2D(...arguments)}catch(R){Gt("WebGLState:",R)}}function T(){try{i.texStorage3D(...arguments)}catch(R){Gt("WebGLState:",R)}}function y(){try{i.texImage2D(...arguments)}catch(R){Gt("WebGLState:",R)}}function z(){try{i.texImage3D(...arguments)}catch(R){Gt("WebGLState:",R)}}function at(R){return u[R]!==void 0?u[R]:i.getParameter(R)}function nt(R,Q){u[R]!==Q&&(i.pixelStorei(R,Q),u[R]=Q)}function pt(R){J.equals(R)===!1&&(i.scissor(R.x,R.y,R.z,R.w),J.copy(R))}function _t(R){ft.equals(R)===!1&&(i.viewport(R.x,R.y,R.z,R.w),ft.copy(R))}function j(R,Q){let K=c.get(Q);K===void 0&&(K=new WeakMap,c.set(Q,K));let gt=K.get(R);gt===void 0&&(gt=i.getUniformBlockIndex(Q,R.name),i.uniformBlockBinding(Q,gt,gt),K.set(R,gt))}function et(R,Q,K){let lt=c.get(Q).get(R);l[lt]!==K&&(i.bindBufferBase(i.UNIFORM_BUFFER,lt,K),l[lt]=K)}function mt(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),r.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),i.pixelStorei(i.PACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_ALIGNMENT,4),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,i.BROWSER_DEFAULT_WEBGL),i.pixelStorei(i.PACK_ROW_LENGTH,0),i.pixelStorei(i.PACK_SKIP_PIXELS,0),i.pixelStorei(i.PACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_ROW_LENGTH,0),i.pixelStorei(i.UNPACK_IMAGE_HEIGHT,0),i.pixelStorei(i.UNPACK_SKIP_PIXELS,0),i.pixelStorei(i.UNPACK_SKIP_ROWS,0),i.pixelStorei(i.UNPACK_SKIP_IMAGES,0),h={},u={},tt=null,it={},d={},l={},f=new WeakMap,_=[],x=null,p=!1,m=null,M=null,w=null,b=null,A=null,E=null,g=null,S=new Zt(0,0,0),O=0,I=!1,U=null,k=null,V=null,L=null,F=null,J.set(0,0,i.canvas.width,i.canvas.height),ft.set(0,0,i.canvas.width,i.canvas.height),a.reset(),r.reset(),o.reset()}return{buffers:{color:a,depth:r,stencil:o},enable:bt,disable:Bt,bindFramebuffer:de,drawBuffers:kt,useProgram:Yt,setBlending:ct,setMaterial:ut,setFlipSided:Rt,setCullFace:xt,setLineWidth:Vt,setPolygonOffset:Dt,setScissorTest:qt,activeTexture:ne,bindTexture:se,unbindTexture:D,compressedTexImage2D:we,compressedTexImage3D:Jt,texImage2D:y,texImage3D:z,pixelStorei:nt,getParameter:at,updateUBOMapping:j,uniformBlockBinding:et,texStorage2D:$t,texStorage3D:T,texSubImage2D:ie,texSubImage3D:ht,compressedTexSubImage2D:ge,compressedTexSubImage3D:Ft,scissor:pt,viewport:_t,reset:mt}}function Og(i,t,e,n,s,a,r){let o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Mt,h=new WeakMap,u=new Set,d,f=new WeakMap,_=new Set,x=new FinalizationRegistry(T=>_.delete(T)),p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(T,y){return p?new OffscreenCanvas(T,y):Rs("canvas")}function M(T,y,z){let at=1,nt=$t(T);if((nt.width>z||nt.height>z)&&(at=z/Math.max(nt.width,nt.height)),at<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){let pt=Math.floor(at*nt.width),_t=Math.floor(at*nt.height);d===void 0&&(d=m(pt,_t));let j=y?m(pt,_t):d;return j.width=pt,j.height=_t,j.getContext("2d").drawImage(T,0,0,pt,_t),zt("WebGLRenderer: Texture has been resized from ("+nt.width+"x"+nt.height+") to ("+pt+"x"+_t+")."),j}else return"data"in T&&zt("WebGLRenderer: Image in DataTexture is too big ("+nt.width+"x"+nt.height+")."),T;return T}function w(T){return T.generateMipmaps}function b(T){i.generateMipmap(T)}function A(T){return T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?i.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function E(T,y,z,at,nt,pt=!1){if(T!==null){if(i[T]!==void 0)return i[T];zt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let _t;at&&(_t=t.get("EXT_texture_norm16"),_t||zt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=y;if(y===i.RED&&(z===i.FLOAT&&(j=i.R32F),z===i.HALF_FLOAT&&(j=i.R16F),z===i.UNSIGNED_BYTE&&(j=i.R8),z===i.UNSIGNED_SHORT&&_t&&(j=_t.R16_EXT),z===i.SHORT&&_t&&(j=_t.R16_SNORM_EXT)),y===i.RED_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.R8UI),z===i.UNSIGNED_SHORT&&(j=i.R16UI),z===i.UNSIGNED_INT&&(j=i.R32UI),z===i.BYTE&&(j=i.R8I),z===i.SHORT&&(j=i.R16I),z===i.INT&&(j=i.R32I)),y===i.RG&&(z===i.FLOAT&&(j=i.RG32F),z===i.HALF_FLOAT&&(j=i.RG16F),z===i.UNSIGNED_BYTE&&(j=i.RG8),z===i.UNSIGNED_SHORT&&_t&&(j=_t.RG16_EXT),z===i.SHORT&&_t&&(j=_t.RG16_SNORM_EXT)),y===i.RG_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.RG8UI),z===i.UNSIGNED_SHORT&&(j=i.RG16UI),z===i.UNSIGNED_INT&&(j=i.RG32UI),z===i.BYTE&&(j=i.RG8I),z===i.SHORT&&(j=i.RG16I),z===i.INT&&(j=i.RG32I)),y===i.RGB_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.RGB8UI),z===i.UNSIGNED_SHORT&&(j=i.RGB16UI),z===i.UNSIGNED_INT&&(j=i.RGB32UI),z===i.BYTE&&(j=i.RGB8I),z===i.SHORT&&(j=i.RGB16I),z===i.INT&&(j=i.RGB32I)),y===i.RGBA_INTEGER&&(z===i.UNSIGNED_BYTE&&(j=i.RGBA8UI),z===i.UNSIGNED_SHORT&&(j=i.RGBA16UI),z===i.UNSIGNED_INT&&(j=i.RGBA32UI),z===i.BYTE&&(j=i.RGBA8I),z===i.SHORT&&(j=i.RGBA16I),z===i.INT&&(j=i.RGBA32I)),y===i.RGB&&(z===i.UNSIGNED_SHORT&&_t&&(j=_t.RGB16_EXT),z===i.SHORT&&_t&&(j=_t.RGB16_SNORM_EXT),z===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),z===i.UNSIGNED_INT_10F_11F_11F_REV&&(j=i.R11F_G11F_B10F)),y===i.RGBA){let et=pt?Cs:oe.getTransfer(nt);z===i.FLOAT&&(j=i.RGBA32F),z===i.HALF_FLOAT&&(j=i.RGBA16F),z===i.UNSIGNED_BYTE&&(j=et===ue?i.SRGB8_ALPHA8:i.RGBA8),z===i.UNSIGNED_SHORT&&_t&&(j=_t.RGBA16_EXT),z===i.SHORT&&_t&&(j=_t.RGBA16_SNORM_EXT),z===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),z===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function g(T,y){let z;return T?y===null||y===mn||y===Ei?z=i.DEPTH24_STENCIL8:y===on?z=i.DEPTH32F_STENCIL8:y===as&&(z=i.DEPTH24_STENCIL8,zt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):y===null||y===mn||y===Ei?z=i.DEPTH_COMPONENT24:y===on?z=i.DEPTH_COMPONENT32F:y===as&&(z=i.DEPTH_COMPONENT16),z}function S(T,y){return w(T)===!0||T.isFramebufferTexture&&T.minFilter!==De&&T.minFilter!==Ye?Math.log2(Math.max(y.width,y.height))+1:T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?y.mipmaps.length:1}function O(T){let y=new WeakRef(T);n.get(T).__ref=y,_.add(y),x.register(T,y,y)}function I(T){let y=n.get(T).__ref;y!==void 0&&(_.delete(y),x.unregister(y))}function U(T){V(T.target)}function k(T){L(T.target)}function V(T){T.removeEventListener("dispose",U),I(T),X(T),T.isVideoTexture&&h.delete(T),T.isHTMLTexture&&u.delete(T)}function L(T){T.removeEventListener("dispose",k),I(T),rt(T)}function F(){for(let T of _){let y=T.deref();y!==void 0&&(y.isRenderTarget===!0?L(y):V(y))}_.clear(),u.clear()}function X(T){let y=n.get(T);if(y.__webglInit===void 0)return;let z=T.source,at=f.get(z);if(at){let nt=at[y.__cacheKey];nt.usedTimes--,nt.usedTimes===0&&H(T),Object.keys(at).length===0&&f.delete(z)}n.remove(T)}function H(T){let y=n.get(T);i.deleteTexture(y.__webglTexture);let z=T.source,at=f.get(z);delete at[y.__cacheKey],r.memory.textures--}function rt(T){let y=n.get(T);y.__depthDisposeCallback&&y.__depthDisposeCallback();let z=T.depthTexture;if(z&&z.renderTarget===T&&V(z),T.isWebGLCubeRenderTarget)for(let nt=0;nt<6;nt++){if(Array.isArray(y.__webglFramebuffer[nt]))for(let pt=0;pt<y.__webglFramebuffer[nt].length;pt++)i.deleteFramebuffer(y.__webglFramebuffer[nt][pt]);else i.deleteFramebuffer(y.__webglFramebuffer[nt]);y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer[nt])}else{if(Array.isArray(y.__webglFramebuffer))for(let nt=0;nt<y.__webglFramebuffer.length;nt++)i.deleteFramebuffer(y.__webglFramebuffer[nt]);else i.deleteFramebuffer(y.__webglFramebuffer);if(y.__webglDepthbuffer&&i.deleteRenderbuffer(y.__webglDepthbuffer),y.__webglMultisampledFramebuffer&&i.deleteFramebuffer(y.__webglMultisampledFramebuffer),y.__webglColorRenderbuffer)for(let nt=0;nt<y.__webglColorRenderbuffer.length;nt++)y.__webglColorRenderbuffer[nt]&&i.deleteRenderbuffer(y.__webglColorRenderbuffer[nt]);y.__webglDepthRenderbuffer&&i.deleteRenderbuffer(y.__webglDepthRenderbuffer)}let at=T.textures;for(let nt=0,pt=at.length;nt<pt;nt++){let _t=n.get(at[nt]);_t.__webglTexture&&(i.deleteTexture(_t.__webglTexture),r.memory.textures--),n.remove(at[nt])}n.remove(T)}let q=0;function tt(){q=0}function it(){return q}function wt(T){q=T}function Ut(){let T=q;return T>=s.maxTextures&&zt("WebGLTextures: Trying to use "+(T+1)+" texture units while this GPU supports only "+s.maxTextures),q+=1,T}function J(T){let y=[];return y.push(T.wrapS),y.push(T.wrapT),y.push(T.wrapR||0),y.push(T.magFilter),y.push(T.minFilter),y.push(T.anisotropy),y.push(T.internalFormat),y.push(T.format),y.push(T.type),y.push(T.generateMipmaps),y.push(T.mipmapsAutoUpdate),y.push(T.premultiplyAlpha),y.push(T.flipY),y.push(T.unpackAlignment),y.push(T.colorSpace),y.join()}function ft(T,y){let z=n.get(T);if(T.isVideoTexture&&ge(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&z.__version!==T.version){let at=T.image;if(at===null)zt("WebGLRenderer: Texture marked for update but no image data found.");else if(at.complete===!1)zt("WebGLRenderer: Texture marked for update but image is incomplete");else{ut(z,T,y);return}}else T.isExternalTexture&&(z.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D,z.__webglTexture,i.TEXTURE0+y)}function At(T,y){let z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){ut(z,T,y);return}else T.isExternalTexture&&(z.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(i.TEXTURE_2D_ARRAY,z.__webglTexture,i.TEXTURE0+y)}function Ot(T,y){let z=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&z.__version!==T.version){ut(z,T,y);return}e.bindTexture(i.TEXTURE_3D,z.__webglTexture,i.TEXTURE0+y)}function bt(T,y){let z=n.get(T);if(T.version>0&&z.__version!==T.version){Rt(z,T,y);return}e.bindTexture(i.TEXTURE_CUBE_MAP,z.__webglTexture,i.TEXTURE0+y)}let Bt={[ia]:i.REPEAT,[vn]:i.CLAMP_TO_EDGE,[sa]:i.MIRRORED_REPEAT},de={[De]:i.NEAREST,[yh]:i.NEAREST_MIPMAP_NEAREST,[ar]:i.NEAREST_MIPMAP_LINEAR,[Ye]:i.LINEAR,[Fa]:i.LINEAR_MIPMAP_NEAREST,[Vn]:i.LINEAR_MIPMAP_LINEAR},kt={[bh]:i.NEVER,[Fl]:i.ALWAYS,[wh]:i.LESS,[Nl]:i.LEQUAL,[Th]:i.EQUAL,[Ul]:i.GEQUAL,[Eh]:i.GREATER,[Ah]:i.NOTEQUAL};function Yt(T,y){if(y.type===on&&t.has("OES_texture_float_linear")===!1&&(y.magFilter===Ye||y.magFilter===Fa||y.magFilter===ar||y.magFilter===Vn||y.minFilter===Ye||y.minFilter===Fa||y.minFilter===ar||y.minFilter===Vn)&&zt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,Bt[y.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,Bt[y.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,Bt[y.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,de[y.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,de[y.minFilter]),y.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,kt[y.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(y.magFilter===De||y.minFilter!==ar&&y.minFilter!==Vn||y.type===on&&t.has("OES_texture_float_linear")===!1)return;if(y.anisotropy>1||n.get(y).__currentAnisotropy){let z=t.get("EXT_texture_filter_anisotropic");i.texParameterf(T,z.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(y.anisotropy,s.getMaxAnisotropy())),n.get(y).__currentAnisotropy=y.anisotropy}}}function Kt(T,y){let z=!1;T.__webglInit===void 0&&(T.__webglInit=!0,y.addEventListener("dispose",U),O(y));let at=y.source,nt=f.get(at);nt===void 0&&(nt={},f.set(at,nt));let pt=J(y);if(pt!==T.__cacheKey){nt[pt]===void 0&&(nt[pt]={texture:i.createTexture(),usedTimes:0},r.memory.textures++,z=!0),nt[pt].usedTimes++;let _t=nt[T.__cacheKey];_t!==void 0&&(nt[T.__cacheKey].usedTimes--,_t.usedTimes===0&&H(y)),T.__cacheKey=pt,T.__webglTexture=nt[pt].texture}return z}function st(T,y,z){return Math.floor(Math.floor(T/z)/y)}function ct(T,y,z,at){let pt=T.updateRanges;if(pt.length===0)e.texSubImage2D(i.TEXTURE_2D,0,0,0,y.width,y.height,z,at,y.data);else{pt.sort((R,Q)=>R.start-Q.start);let _t=0;for(let R=1;R<pt.length;R++){let Q=pt[_t],K=pt[R],gt=Q.start+Q.count,lt=st(K.start,y.width,4),N=st(Q.start,y.width,4);K.start<=gt+1&&lt===N&&st(K.start+K.count-1,y.width,4)===lt?Q.count=Math.max(Q.count,K.start+K.count-Q.start):(++_t,pt[_t]=K)}pt.length=_t+1;let j=e.getParameter(i.UNPACK_ROW_LENGTH),et=e.getParameter(i.UNPACK_SKIP_PIXELS),mt=e.getParameter(i.UNPACK_SKIP_ROWS);e.pixelStorei(i.UNPACK_ROW_LENGTH,y.width);for(let R=0,Q=pt.length;R<Q;R++){let K=pt[R],gt=Math.floor(K.start/4),lt=Math.ceil(K.count/4),N=gt%y.width,Z=Math.floor(gt/y.width),ot=lt,Y=1;e.pixelStorei(i.UNPACK_SKIP_PIXELS,N),e.pixelStorei(i.UNPACK_SKIP_ROWS,Z),e.texSubImage2D(i.TEXTURE_2D,0,N,Z,ot,Y,z,at,y.data)}T.clearUpdateRanges(),e.pixelStorei(i.UNPACK_ROW_LENGTH,j),e.pixelStorei(i.UNPACK_SKIP_PIXELS,et),e.pixelStorei(i.UNPACK_SKIP_ROWS,mt)}}function ut(T,y,z){let at=i.TEXTURE_2D;(y.isDataArrayTexture||y.isCompressedArrayTexture)&&(at=i.TEXTURE_2D_ARRAY),y.isData3DTexture&&(at=i.TEXTURE_3D);let nt=Kt(T,y),pt=y.source;e.bindTexture(at,T.__webglTexture,i.TEXTURE0+z);let _t=n.get(pt);if(pt.version!==_t.__version||nt===!0){if(e.activeTexture(i.TEXTURE0+z),(typeof ImageBitmap<"u"&&y.image instanceof ImageBitmap)===!1){let Y=oe.getPrimaries(oe.workingColorSpace),dt=y.colorSpace===Xn?null:oe.getPrimaries(y.colorSpace),Ct=y.colorSpace===Xn||Y===dt?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ct)}e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment);let et=M(y.image,!1,s.maxTextureSize);et=Ft(y,et);let mt=a.convert(y.format,y.colorSpace),R=a.convert(y.type),Q=E(y.internalFormat,mt,R,y.normalized,y.colorSpace,y.isVideoTexture);Yt(at,y);let K,gt=y.mipmaps,lt=y.isVideoTexture!==!0,N=_t.__version===void 0||nt===!0,Z=pt.dataReady,ot=S(y,et);if(y.isDepthTexture)Q=g(y.format===Wn,y.type),N&&(lt?e.texStorage2D(i.TEXTURE_2D,1,Q,et.width,et.height):e.texImage2D(i.TEXTURE_2D,0,Q,et.width,et.height,0,mt,R,null));else if(y.isDataTexture)if(gt.length>0){lt&&N&&e.texStorage2D(i.TEXTURE_2D,ot,Q,gt[0].width,gt[0].height);for(let Y=0,dt=gt.length;Y<dt;Y++)K=gt[Y],lt?Z&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,K.width,K.height,mt,R,K.data):e.texImage2D(i.TEXTURE_2D,Y,Q,K.width,K.height,0,mt,R,K.data);y.generateMipmaps=!1}else lt?(N&&e.texStorage2D(i.TEXTURE_2D,ot,Q,et.width,et.height),Z&&ct(y,et,mt,R)):e.texImage2D(i.TEXTURE_2D,0,Q,et.width,et.height,0,mt,R,et.data);else if(y.isCompressedTexture)if(y.isCompressedArrayTexture){lt&&N&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ot,Q,gt[0].width,gt[0].height,et.depth);for(let Y=0,dt=gt.length;Y<dt;Y++)if(K=gt[Y],y.format!==_n)if(mt!==null)if(lt){if(Z)if(y.layerUpdates.size>0){let Ct=Xl(K.width,K.height,y.format,y.type);for(let yt of y.layerUpdates){let Qt=K.data.subarray(yt*Ct/K.data.BYTES_PER_ELEMENT,(yt+1)*Ct/K.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,yt,K.width,K.height,1,mt,Qt)}}else e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,K.width,K.height,et.depth,mt,K.data)}else e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,Y,Q,K.width,K.height,et.depth,0,K.data,0,0);else zt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else lt?Z&&e.texSubImage3D(i.TEXTURE_2D_ARRAY,Y,0,0,0,K.width,K.height,et.depth,mt,R,K.data):e.texImage3D(i.TEXTURE_2D_ARRAY,Y,Q,K.width,K.height,et.depth,0,mt,R,K.data);y.layerUpdates.size>0&&y.clearLayerUpdates()}else{lt&&N&&e.texStorage2D(i.TEXTURE_2D,ot,Q,gt[0].width,gt[0].height);for(let Y=0,dt=gt.length;Y<dt;Y++)K=gt[Y],y.format!==_n?mt!==null?lt?Z&&e.compressedTexSubImage2D(i.TEXTURE_2D,Y,0,0,K.width,K.height,mt,K.data):e.compressedTexImage2D(i.TEXTURE_2D,Y,Q,K.width,K.height,0,K.data):zt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):lt?Z&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,K.width,K.height,mt,R,K.data):e.texImage2D(i.TEXTURE_2D,Y,Q,K.width,K.height,0,mt,R,K.data)}else if(y.isDataArrayTexture)if(lt){if(N&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ot,Q,et.width,et.height,et.depth),Z)if(y.layerUpdates.size>0){let Y=Xl(et.width,et.height,y.format,y.type);for(let dt of y.layerUpdates){let Ct=et.data.subarray(dt*Y/et.data.BYTES_PER_ELEMENT,(dt+1)*Y/et.data.BYTES_PER_ELEMENT);e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,dt,et.width,et.height,1,mt,R,Ct)}y.clearLayerUpdates()}else e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,et.width,et.height,et.depth,mt,R,et.data)}else e.texImage3D(i.TEXTURE_2D_ARRAY,0,Q,et.width,et.height,et.depth,0,mt,R,et.data);else if(y.isData3DTexture)lt?(N&&e.texStorage3D(i.TEXTURE_3D,ot,Q,et.width,et.height,et.depth),Z&&e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,et.width,et.height,et.depth,mt,R,et.data)):e.texImage3D(i.TEXTURE_3D,0,Q,et.width,et.height,et.depth,0,mt,R,et.data);else if(y.isFramebufferTexture){if(N)if(lt)e.texStorage2D(i.TEXTURE_2D,ot,Q,et.width,et.height);else{let Y=et.width,dt=et.height;for(let Ct=0;Ct<ot;Ct++)e.texImage2D(i.TEXTURE_2D,Ct,Q,Y,dt,0,mt,R,null),Y>>=1,dt>>=1}}else if(y.isHTMLTexture){if("texElementImage2D"in i){let Y=i.canvas;if(Y.hasAttribute("layoutsubtree")||Y.setAttribute("layoutsubtree","true"),et.parentNode!==Y){Y.appendChild(et),u.add(y),Y.onpaint=dt=>{let Ct=dt.changedElements;for(let yt of u)Ct.includes(yt.image)&&(yt.needsUpdate=!0)},Y.requestPaint();return}if(i.texElementImage2D.length===3)i.texElementImage2D(i.TEXTURE_2D,i.RGBA8,et);else{let Ct=i.RGBA,yt=i.RGBA,Qt=i.UNSIGNED_BYTE;i.texElementImage2D(i.TEXTURE_2D,0,Ct,yt,Qt,et)}i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE)}}else if(gt.length>0){if(lt&&N){let Y=$t(gt[0]);e.texStorage2D(i.TEXTURE_2D,ot,Q,Y.width,Y.height)}for(let Y=0,dt=gt.length;Y<dt;Y++)K=gt[Y],lt?Z&&e.texSubImage2D(i.TEXTURE_2D,Y,0,0,mt,R,K):e.texImage2D(i.TEXTURE_2D,Y,Q,mt,R,K);y.generateMipmaps=!1}else if(lt){if(N){let Y=$t(et);e.texStorage2D(i.TEXTURE_2D,ot,Q,Y.width,Y.height)}Z&&e.texSubImage2D(i.TEXTURE_2D,0,0,0,mt,R,et)}else e.texImage2D(i.TEXTURE_2D,0,Q,mt,R,et);w(y)&&y.mipmapsAutoUpdate===!0&&b(at),_t.__version=pt.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function Rt(T,y,z){if(y.image.length!==6)return;let at=Kt(T,y),nt=y.source;e.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+z);let pt=n.get(nt);if(nt.version!==pt.__version||at===!0){e.activeTexture(i.TEXTURE0+z);let _t=oe.getPrimaries(oe.workingColorSpace),j=y.colorSpace===Xn?null:oe.getPrimaries(y.colorSpace),et=y.colorSpace===Xn||_t===j?i.NONE:i.BROWSER_DEFAULT_WEBGL;e.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,y.flipY),e.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,y.premultiplyAlpha),e.pixelStorei(i.UNPACK_ALIGNMENT,y.unpackAlignment),e.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,et);let mt=y.isCompressedTexture||y.image[0].isCompressedTexture,R=y.image[0]&&y.image[0].isDataTexture,Q=[];for(let yt=0;yt<6;yt++)!mt&&!R?Q[yt]=M(y.image[yt],!0,s.maxCubemapSize):Q[yt]=R?y.image[yt].image:y.image[yt],Q[yt]=Ft(y,Q[yt]);let K=Q[0],gt=a.convert(y.format,y.colorSpace),lt=a.convert(y.type),N=E(y.internalFormat,gt,lt,y.normalized,y.colorSpace),Z=y.isVideoTexture!==!0,ot=pt.__version===void 0||at===!0,Y=nt.dataReady,dt=S(y,K);Yt(i.TEXTURE_CUBE_MAP,y);let Ct;if(y.isDepthTexture){if(N=g(y.format===Wn,y.type),ot)if(Z)e.texStorage2D(i.TEXTURE_CUBE_MAP,1,N,K.width,K.height);else for(let yt=0;yt<6;yt++)e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,N,K.width,K.height,0,gt,lt,null)}else if(mt){Z&&ot&&e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,N,K.width,K.height);for(let yt=0;yt<6;yt++){Ct=Q[yt].mipmaps;for(let Qt=0;Qt<Ct.length;Qt++){let ce=Ct[Qt];y.format!==_n?gt!==null?Z?Y&&e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt,0,0,ce.width,ce.height,gt,ce.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt,N,ce.width,ce.height,0,ce.data):zt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Z?Y&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt,0,0,ce.width,ce.height,gt,lt,ce.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt,N,ce.width,ce.height,0,gt,lt,ce.data)}}}else{if(Ct=y.mipmaps,Z&&ot){Ct.length>0&&dt++;let yt=$t(Q[0]);e.texStorage2D(i.TEXTURE_CUBE_MAP,dt,N,yt.width,yt.height)}for(let yt=0;yt<6;yt++)if(R){Z?Y&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,Q[yt].width,Q[yt].height,gt,lt,Q[yt].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,N,Q[yt].width,Q[yt].height,0,gt,lt,Q[yt].data);for(let Qt=0;Qt<Ct.length;Qt++){let Fe=Ct[Qt].image[yt].image;Z?Y&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt+1,0,0,Fe.width,Fe.height,gt,lt,Fe.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt+1,N,Fe.width,Fe.height,0,gt,lt,Fe.data)}}else{Z?Y&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,gt,lt,Q[yt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,N,gt,lt,Q[yt]);for(let Qt=0;Qt<Ct.length;Qt++){let ce=Ct[Qt];Z?Y&&e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt+1,0,0,gt,lt,ce.image[yt]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+yt,Qt+1,N,gt,lt,ce.image[yt])}}}w(y)&&y.mipmapsAutoUpdate===!0&&b(i.TEXTURE_CUBE_MAP),pt.__version=nt.version,y.onUpdate&&y.onUpdate(y)}T.__version=y.version}function xt(T,y,z,at,nt,pt){let _t=a.convert(z.format,z.colorSpace),j=a.convert(z.type),et=E(z.internalFormat,_t,j,z.normalized,z.colorSpace),mt=n.get(y),R=n.get(z);if(R.__renderTarget=y,!mt.__hasExternalTextures){let Q=Math.max(1,y.width>>pt),K=Math.max(1,y.height>>pt);nt===i.TEXTURE_3D||nt===i.TEXTURE_2D_ARRAY?e.texImage3D(nt,pt,et,Q,K,y.depth,0,_t,j,null):e.texImage2D(nt,pt,et,Q,K,0,_t,j,null)}e.bindFramebuffer(i.FRAMEBUFFER,T),ht(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,at,nt,R.__webglTexture,0,ie(y)):(nt===i.TEXTURE_2D||nt>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&nt<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,at,nt,R.__webglTexture,pt),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Vt(T,y,z){if(i.bindRenderbuffer(i.RENDERBUFFER,T),y.depthBuffer){let at=y.depthTexture,nt=at&&at.isDepthTexture?at.type:null,pt=g(y.stencilBuffer,nt),_t=y.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;ht(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ie(y),pt,y.width,y.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,ie(y),pt,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,pt,y.width,y.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,_t,i.RENDERBUFFER,T)}else{let at=y.textures;for(let nt=0;nt<at.length;nt++){let pt=at[nt],_t=a.convert(pt.format,pt.colorSpace),j=a.convert(pt.type),et=E(pt.internalFormat,_t,j,pt.normalized,pt.colorSpace);ht(y)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ie(y),et,y.width,y.height):z?i.renderbufferStorageMultisample(i.RENDERBUFFER,ie(y),et,y.width,y.height):i.renderbufferStorage(i.RENDERBUFFER,et,y.width,y.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Dt(T,y,z){let at=y.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(i.FRAMEBUFFER,T),!(y.depthTexture&&y.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");let nt=n.get(y.depthTexture);nt.__renderTarget=y;let pt=at?y.depthTexture.image[0]:y.depthTexture.image;(!nt.__webglTexture||pt.width!==y.width||pt.height!==y.height)&&(pt.width=y.width,pt.height=y.height,y.depthTexture.needsUpdate=!0),at?bt(y.depthTexture,0):ft(y.depthTexture,0);let _t=nt.__webglTexture,j=ie(y),et=at?i.TEXTURE_CUBE_MAP_POSITIVE_X+z:i.TEXTURE_2D,mt=y.depthTexture.format===Wn?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;if(y.depthTexture.format===$n)ht(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,mt,et,_t,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,mt,et,_t,0);else if(y.depthTexture.format===Wn)ht(y)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,mt,et,_t,0,j):i.framebufferTexture2D(i.FRAMEBUFFER,mt,et,_t,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function qt(T){let y=n.get(T),z=T.isWebGLCubeRenderTarget===!0;if(y.__boundDepthTexture!==T.depthTexture){let at=T.depthTexture;if(y.__depthDisposeCallback&&y.__depthDisposeCallback(),at){let nt=()=>{delete y.__boundDepthTexture,delete y.__depthDisposeCallback,at.removeEventListener("dispose",nt)};at.addEventListener("dispose",nt),y.__depthDisposeCallback=nt}y.__boundDepthTexture=at}if(T.depthTexture&&!y.__autoAllocateDepthBuffer)if(z)for(let at=0;at<6;at++)Dt(y.__webglFramebuffer[at],T,at);else T.texture.mipmaps.length>0?Dt(y.__webglFramebuffer[0],T,0):Dt(y.__webglFramebuffer,T,0);else if(z){y.__webglDepthbuffer=[];for(let at=0;at<6;at++)if(e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[at]),y.__webglDepthbuffer[at]===void 0)y.__webglDepthbuffer[at]=i.createRenderbuffer(),Vt(y.__webglDepthbuffer[at],T,!1);else{let nt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=y.__webglDepthbuffer[at];i.bindRenderbuffer(i.RENDERBUFFER,pt),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,pt)}}else if(T.texture.mipmaps.length>0?e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer[0]):e.bindFramebuffer(i.FRAMEBUFFER,y.__webglFramebuffer),y.__webglDepthbuffer===void 0)y.__webglDepthbuffer=i.createRenderbuffer(),Vt(y.__webglDepthbuffer,T,!1);else{let nt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,pt=y.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,pt),i.framebufferRenderbuffer(i.FRAMEBUFFER,nt,i.RENDERBUFFER,pt)}e.bindFramebuffer(i.FRAMEBUFFER,null)}function ne(T,y,z){let at=n.get(T);y!==void 0&&xt(at.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),z!==void 0&&qt(T)}function se(T){let y=T.texture,z=n.get(T),at=n.get(y);T.addEventListener("dispose",k),O(T);let nt=T.textures,pt=T.isWebGLCubeRenderTarget===!0,_t=nt.length>1;if(_t||(at.__webglTexture===void 0&&(at.__webglTexture=i.createTexture()),at.__version=y.version,r.memory.textures++),pt){z.__webglFramebuffer=[];for(let j=0;j<6;j++)if(y.mipmaps.length>0){z.__webglFramebuffer[j]=[];for(let et=0;et<y.mipmaps.length;et++)z.__webglFramebuffer[j][et]=i.createFramebuffer()}else z.__webglFramebuffer[j]=i.createFramebuffer()}else{if(y.mipmaps.length>0){z.__webglFramebuffer=[];for(let j=0;j<y.mipmaps.length;j++)z.__webglFramebuffer[j]=i.createFramebuffer()}else z.__webglFramebuffer=i.createFramebuffer();if(_t)for(let j=0,et=nt.length;j<et;j++){let mt=n.get(nt[j]);mt.__webglTexture===void 0&&(mt.__webglTexture=i.createTexture(),r.memory.textures++)}if(T.samples>0&&ht(T)===!1){z.__webglMultisampledFramebuffer=i.createFramebuffer(),z.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,z.__webglMultisampledFramebuffer);for(let j=0;j<nt.length;j++){let et=nt[j];z.__webglColorRenderbuffer[j]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,z.__webglColorRenderbuffer[j]);let mt=a.convert(et.format,et.colorSpace),R=a.convert(et.type),Q=E(et.internalFormat,mt,R,et.normalized,et.colorSpace,T.isXRRenderTarget===!0),K=ie(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,K,Q,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+j,i.RENDERBUFFER,z.__webglColorRenderbuffer[j])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(z.__webglDepthRenderbuffer=i.createRenderbuffer(),Vt(z.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(pt){e.bindTexture(i.TEXTURE_CUBE_MAP,at.__webglTexture),Yt(i.TEXTURE_CUBE_MAP,y);for(let j=0;j<6;j++)if(y.mipmaps.length>0)for(let et=0;et<y.mipmaps.length;et++)xt(z.__webglFramebuffer[j][et],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,et);else xt(z.__webglFramebuffer[j],T,y,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);w(y)?b(i.TEXTURE_CUBE_MAP):y.mipmaps.length>0&&i.texParameteri(i.TEXTURE_CUBE_MAP,i.TEXTURE_MAX_LEVEL,y.mipmaps.length-1),e.unbindTexture()}else if(_t){for(let j=0,et=nt.length;j<et;j++){let mt=nt[j],R=n.get(mt),Q=i.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(Q=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(Q,R.__webglTexture),Yt(Q,mt),xt(z.__webglFramebuffer,T,mt,i.COLOR_ATTACHMENT0+j,Q,0),w(mt)&&b(Q)}e.unbindTexture()}else{let j=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(j=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),e.bindTexture(j,at.__webglTexture),Yt(j,y),y.mipmaps.length>0)for(let et=0;et<y.mipmaps.length;et++)xt(z.__webglFramebuffer[et],T,y,i.COLOR_ATTACHMENT0,j,et);else xt(z.__webglFramebuffer,T,y,i.COLOR_ATTACHMENT0,j,0);w(y)?b(j):y.mipmaps.length>0&&i.texParameteri(j,i.TEXTURE_MAX_LEVEL,y.mipmaps.length-1),e.unbindTexture()}T.depthBuffer&&qt(T)}function D(T){let y=T.textures;for(let z=0,at=y.length;z<at;z++){let nt=y[z];if(w(nt)&&nt.mipmapsAutoUpdate===!0){let pt=A(T),_t=n.get(nt).__webglTexture;e.bindTexture(pt,_t),b(pt),e.unbindTexture()}}}let we=[];function Jt(T){if(T.samples>0){if(ht(T)===!1){let y=T.textures,z=T.width,at=T.height,nt=i.COLOR_BUFFER_BIT,pt=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,_t=n.get(T),j=y.length>1;if(j)for(let mt=0;mt<y.length;mt++)e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,_t.__webglMultisampledFramebuffer),T.texture.mipmaps.length>0?e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer[0]):e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglFramebuffer);for(let mt=0;mt<y.length;mt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(nt|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(nt|=i.STENCIL_BUFFER_BIT)),j){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,_t.__webglColorRenderbuffer[mt]);let R=n.get(y[mt]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,R,0)}i.blitFramebuffer(0,0,z,at,0,0,z,at,nt,i.NEAREST),l===!0&&(we.length=0,we.push(i.COLOR_ATTACHMENT0+mt),T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&we.push(pt),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,we))}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),j)for(let mt=0;mt<y.length;mt++){e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.RENDERBUFFER,_t.__webglColorRenderbuffer[mt]);let R=n.get(y[mt]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+mt,i.TEXTURE_2D,R,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,_t.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.storeMultisampledDepthBuffer===!1&&l){let y=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[y])}}}function ie(T){return Math.min(s.maxSamples,T.samples)}function ht(T){let y=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&y.__useRenderToTexture!==!1}function ge(T){let y=r.render.frame;h.get(T)!==y&&(h.set(T,y),T.update())}function Ft(T,y){let z=T.colorSpace,at=T.format,nt=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||z!==As&&z!==Xn&&(oe.getTransfer(z)===ue?(at!==_n||nt!==Ke)&&zt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):Gt("WebGLTextures: Unsupported texture color space:",z)),y}function $t(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=Ut,this.resetTextureUnits=tt,this.getTextureUnits=it,this.setTextureUnits=wt,this.setTexture2D=ft,this.setTexture2DArray=At,this.setTexture3D=Ot,this.setTextureCube=bt,this.rebindTextures=ne,this.setupRenderTarget=se,this.updateRenderTargetMipmap=D,this.updateMultisampleRenderTarget=Jt,this.setupDepthRenderbuffer=qt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=ht,this.dispose=F}function Bg(i,t){function e(n,s=Xn){let a,r=oe.getTransfer(s);if(n===Ke)return i.UNSIGNED_BYTE;if(n===Ba)return i.UNSIGNED_SHORT_4_4_4_4;if(n===ka)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Ll)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Il)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Cl)return i.BYTE;if(n===Rl)return i.SHORT;if(n===as)return i.UNSIGNED_SHORT;if(n===Oa)return i.INT;if(n===mn)return i.UNSIGNED_INT;if(n===on)return i.FLOAT;if(n===gn)return i.HALF_FLOAT;if(n===Pl)return i.ALPHA;if(n===Dl)return i.RGB;if(n===_n)return i.RGBA;if(n===$n)return i.DEPTH_COMPONENT;if(n===Wn)return i.DEPTH_STENCIL;if(n===za)return i.RED;if(n===$a)return i.RED_INTEGER;if(n===li)return i.RG;if(n===Ga)return i.RG_INTEGER;if(n===Ha)return i.RGBA_INTEGER;if(n===or||n===lr||n===cr||n===hr)if(r===ue)if(a=t.get("WEBGL_compressed_texture_s3tc_srgb"),a!==null){if(n===or)return a.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===lr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===cr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===hr)return a.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(a=t.get("WEBGL_compressed_texture_s3tc"),a!==null){if(n===or)return a.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===lr)return a.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===cr)return a.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===hr)return a.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Va||n===Wa||n===Xa||n===qa)if(a=t.get("WEBGL_compressed_texture_pvrtc"),a!==null){if(n===Va)return a.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Wa)return a.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Xa)return a.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===qa)return a.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Za||n===Ya||n===Ja||n===Ka||n===Qa||n===ur||n===ja)if(a=t.get("WEBGL_compressed_texture_etc"),a!==null){if(n===Za||n===Ya)return r===ue?a.COMPRESSED_SRGB8_ETC2:a.COMPRESSED_RGB8_ETC2;if(n===Ja)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:a.COMPRESSED_RGBA8_ETC2_EAC;if(n===Ka)return a.COMPRESSED_R11_EAC;if(n===Qa)return a.COMPRESSED_SIGNED_R11_EAC;if(n===ur)return a.COMPRESSED_RG11_EAC;if(n===ja)return a.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===to||n===eo||n===no||n===io||n===so||n===ro||n===ao||n===oo||n===lo||n===co||n===ho||n===uo||n===fo||n===po)if(a=t.get("WEBGL_compressed_texture_astc"),a!==null){if(n===to)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:a.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===eo)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:a.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===no)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:a.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===io)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:a.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===so)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:a.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ro)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:a.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===ao)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:a.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===oo)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:a.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===lo)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:a.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===co)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:a.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ho)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:a.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===uo)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:a.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===fo)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:a.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===po)return r===ue?a.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:a.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===mo||n===go||n===_o)if(a=t.get("EXT_texture_compression_bptc"),a!==null){if(n===mo)return r===ue?a.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:a.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===go)return a.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===_o)return a.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===xo||n===yo||n===dr||n===vo)if(a=t.get("EXT_texture_compression_rgtc"),a!==null){if(n===xo)return a.COMPRESSED_RED_RGTC1_EXT;if(n===yo)return a.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===dr)return a.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===vo)return a.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ei?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:e}}var kg=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zg=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,ec=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){let n=new ks(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){let e=t.cameras[0].viewport,n=new An({vertexShader:kg,fragmentShader:zg,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new pe(new ii(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},nc=class extends Sn{constructor(t,e){super();let n=this,s=null,a=1,r=null,o="local-floor",l=1,c=null,h=null,u=null,d=null,f=null,_=null,x=typeof XRWebGLBinding<"u",p=new ec,m={},M=e.getContextAttributes(),w=null,b=null,A=[],E=[],g=new Mt,S=null,O=null,I=new Ve;I.viewport=new Me;let U=new Ve;U.viewport=new Me;let k=[I,U],V=new Ia,L=null,F=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let ft=A[J];return ft===void 0&&(ft=new Ki,A[J]=ft),ft.getTargetRaySpace()},this.getControllerGrip=function(J){let ft=A[J];return ft===void 0&&(ft=new Ki,A[J]=ft),ft.getGripSpace()},this.getHand=function(J){let ft=A[J];return ft===void 0&&(ft=new Ki,A[J]=ft),ft.getHandSpace()};function X(J){let ft=E.indexOf(J.inputSource);if(ft===-1)return;let At=A[ft];At!==void 0&&(At.update(J.inputSource,J.frame,c||r),At.dispatchEvent({type:J.type,data:J.inputSource}))}function H(){s.removeEventListener("select",X),s.removeEventListener("selectstart",X),s.removeEventListener("selectend",X),s.removeEventListener("squeeze",X),s.removeEventListener("squeezestart",X),s.removeEventListener("squeezeend",X),s.removeEventListener("end",H),s.removeEventListener("inputsourceschange",rt);for(let J=0;J<A.length;J++){let ft=E[J];ft!==null&&(E[J]=null,A[J].disconnect(ft))}L=null,F=null,p.reset();for(let J in m)delete m[J];if(t.setRenderTarget(w),f=null,d=null,u=null,s=null,b=null,Ut.stop(),n.isPresenting=!1,t.setPixelRatio(S),t.setSize(g.width,g.height,!1),O!==null){let J=O.camera;J.fov=O.fov,J.zoom=O.zoom,J.updateProjectionMatrix(),O=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){a=J,n.isPresenting===!0&&zt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){o=J,n.isPresenting===!0&&zt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||r},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return d!==null?d:f},this.getBinding=function(){return u===null&&x&&(u=new XRWebGLBinding(s,e)),u},this.getFrame=function(){return _},this.getSession=function(){return s},this.setSession=async function(J){if(s=J,s!==null){if(w=t.getRenderTarget(),s.addEventListener("select",X),s.addEventListener("selectstart",X),s.addEventListener("selectend",X),s.addEventListener("squeeze",X),s.addEventListener("squeezestart",X),s.addEventListener("squeezeend",X),s.addEventListener("end",H),s.addEventListener("inputsourceschange",rt),M.xrCompatible!==!0&&await e.makeXRCompatible(),S=t.getPixelRatio(),t.getSize(g),x&&"createProjectionLayer"in XRWebGLBinding.prototype){let At=null,Ot=null,bt=null;M.depth&&(bt=M.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,At=M.stencil?Wn:$n,Ot=M.stencil?Ei:mn);let Bt={colorFormat:e.RGBA8,depthFormat:bt,scaleFactor:a};u=this.getBinding(),d=u.createProjectionLayer(Bt),s.updateRenderState({layers:[d]}),t.setPixelRatio(1),t.setSize(d.textureWidth,d.textureHeight,!1),b=new tn(d.textureWidth,d.textureHeight,{format:_n,type:Ke,depthTexture:new Hn(d.textureWidth,d.textureHeight,Ot,void 0,void 0,void 0,void 0,void 0,void 0,At),stencilBuffer:M.stencil,colorSpace:t.outputColorSpace,samples:M.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}else{let At={antialias:M.antialias,alpha:!0,depth:M.depth,stencil:M.stencil,framebufferScaleFactor:a};f=new XRWebGLLayer(s,e,At),s.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),b=new tn(f.framebufferWidth,f.framebufferHeight,{format:_n,type:Ke,colorSpace:t.outputColorSpace,stencilBuffer:M.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1,storeMultisampledDepthBuffer:f.ignoreDepthValues===!1,storeMultisampledStencilBuffer:f.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,r=await s.requestReferenceSpace(o),Ut.setContext(s),Ut.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function rt(J){for(let ft=0;ft<J.removed.length;ft++){let At=J.removed[ft],Ot=E.indexOf(At);Ot>=0&&(E[Ot]=null,A[Ot].disconnect(At))}for(let ft=0;ft<J.added.length;ft++){let At=J.added[ft],Ot=E.indexOf(At);if(Ot===-1){for(let Bt=0;Bt<A.length;Bt++)if(Bt>=E.length){E.push(At),Ot=Bt;break}else if(E[Bt]===null){E[Bt]=At,Ot=Bt;break}if(Ot===-1)break}let bt=A[Ot];bt&&bt.connect(At)}}function q(J,ft){ft===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(ft.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(s===null)return;let ft=J.near,At=J.far;p.texture!==null&&(p.depthNear>0&&(ft=p.depthNear),p.depthFar>0&&(At=p.depthFar)),V.near=U.near=I.near=ft,V.far=U.far=I.far=At,(L!==V.near||F!==V.far)&&(s.updateRenderState({depthNear:V.near,depthFar:V.far}),L=V.near,F=V.far),V.layers.mask=J.layers.mask|6,I.layers.mask=V.layers.mask&-5,U.layers.mask=V.layers.mask&-3;let Ot=J.parent,bt=V.cameras;q(V,Ot);for(let Bt=0;Bt<bt.length;Bt++)q(bt[Bt],Ot);V.projectionMatrix.copy(I.projectionMatrix),V.projectionMatrixInverse.copy(I.projectionMatrixInverse),O===null&&J.isPerspectiveCamera&&(O={camera:J,fov:J.fov,zoom:J.zoom}),tt(J,V,Ot)};function tt(J,ft,At){At===null?J.matrix.copy(ft.matrixWorld):(J.matrix.copy(At.matrixWorld),J.matrix.invert(),J.matrix.multiply(ft.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(ft.projectionMatrix),J.projectionMatrixInverse.copy(ft.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Yi*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return V},this.getFoveation=function(){if(!(d===null&&f===null))return l},this.setFoveation=function(J){l=J,d!==null&&(d.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(V)},this.getCameraTexture=function(J){return m[J]};let it=null;function wt(J,ft){if(h=ft.getViewerPose(c||r),_=ft,h!==null){let At=h.views;f!==null&&(t.setRenderTargetFramebuffer(b,f.framebuffer),t.setRenderTarget(b));let Ot=!1;At.length!==V.cameras.length&&(V.cameras.length=0,Ot=!0);for(let kt=0;kt<At.length;kt++){let Yt=At[kt],Kt=null;if(f!==null)Kt=f.getViewport(Yt);else{let ct=u.getViewSubImage(d,Yt);Kt=ct.viewport,kt===0&&(t.setRenderTargetTextures(b,ct.colorTexture,ct.depthStencilTexture),t.setRenderTarget(b))}let st=k[kt];st===void 0&&(st=new Ve,st.layers.enable(kt),st.viewport=new Me,k[kt]=st),st.matrix.fromArray(Yt.transform.matrix),st.matrix.decompose(st.position,st.quaternion,st.scale),st.projectionMatrix.fromArray(Yt.projectionMatrix),st.projectionMatrixInverse.copy(st.projectionMatrix).invert(),st.viewport.set(Kt.x,Kt.y,Kt.width,Kt.height),kt===0&&(V.matrix.copy(st.matrix),V.matrix.decompose(V.position,V.quaternion,V.scale)),Ot===!0&&V.cameras.push(st)}let bt=s.enabledFeatures;if(bt&&bt.includes("depth-sensing")&&s.depthUsage=="gpu-optimized"&&x){u=n.getBinding();let kt=u.getDepthInformation(At[0]);kt&&kt.isValid&&kt.texture&&p.init(kt,s.renderState)}if(bt&&bt.includes("camera-access")&&x){t.state.unbindTexture(),u=n.getBinding();for(let kt=0;kt<At.length;kt++){let Yt=At[kt].camera;if(Yt){let Kt=m[Yt];Kt||(Kt=new ks,m[Yt]=Kt);let st=u.getCameraImage(Yt);Kt.sourceTexture=st}}}}for(let At=0;At<A.length;At++){let Ot=E[At],bt=A[At];Ot!==null&&bt!==void 0&&bt.update(Ot,ft,c||r)}it&&it(J,ft),ft.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:ft}),_=null}let Ut=new hu;Ut.setAnimationLoop(wt),this.setAnimationLoop=function(J){it=J},this.dispose=function(){}}},$g=new fe,vu=new Ht;vu.set(-1,0,0,0,1,0,0,0,1);function Gg(i,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,Hl(i)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function s(p,m,M,w,b){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?a(p,m):m.isMeshLambertMaterial?(a(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(a(p,m),u(p,m)):m.isMeshPhongMaterial?(a(p,m),h(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(a(p,m),d(p,m),m.isMeshPhysicalMaterial&&f(p,m,b)):m.isMeshMatcapMaterial?(a(p,m),_(p,m)):m.isMeshDepthMaterial?a(p,m):m.isMeshDistanceMaterial?(a(p,m),x(p,m)):m.isMeshNormalMaterial?a(p,m):m.isLineBasicMaterial?(r(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,M,w):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function a(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Be&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Be&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);let M=t.get(m),w=M.envMap,b=M.envMapRotation;w&&(p.envMap.value=w,p.envMapRotation.value.setFromMatrix4($g.makeRotationFromEuler(b)).transpose(),w.isCubeTexture&&w.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(vu),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function r(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,M,w){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*M,p.scale.value=w*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function h(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function d(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,M){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,e(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Be&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=M.texture,p.transmissionSamplerSize.value.set(M.width,M.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function _(p,m){m.matcap&&(p.matcap.value=m.matcap)}function x(p,m){let M=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(M.matrixWorld),p.nearDistance.value=M.shadow.camera.near,p.farDistance.value=M.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function Hg(i,t,e,n){let s={},a={};function r(M,w){let b=w.program;n.uniformBlockBinding(M,b,s[M.id])}function o(M,w){let b=s[M.id];b===void 0&&(_(M),b=l(M),s[M.id]=b,M.addEventListener("dispose",p));let A=w.program;n.updateUBOMapping(M,A);let E=t.render.frame;a[M.id]!==E&&(c(M),a[M.id]=E)}function l(M){let w=i.createBuffer(),b=M.__size,A=M.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,b,A),i.bindBuffer(i.UNIFORM_BUFFER,null),w}function c(M){let w=s[M.id],b=M.uniforms,A=M.__cache;i.bindBuffer(i.UNIFORM_BUFFER,w);for(let E=0,g=b.length;E<g;E++){let S=b[E];if(Array.isArray(S))for(let O=0,I=S.length;O<I;O++)h(S[O],E,O,A);else h(S,E,0,A)}i.bindBuffer(i.UNIFORM_BUFFER,null)}function h(M,w,b,A){if(d(M,w,b,A)===!0){let E=M.__offset,g=M.value;if(Array.isArray(g)){let S=0;for(let O=0;O<g.length;O++){let I=g[O],U=x(I,!0);u(I,M.__data,S),S+=U.storage/Float32Array.BYTES_PER_ELEMENT}}else u(g,M.__data,0);i.bufferSubData(i.UNIFORM_BUFFER,E,M.__data)}}function u(M,w,b){typeof M=="number"||typeof M=="boolean"?w[b]=M:M.isMatrix3?(w[b]=M.elements[0],w[b+1]=M.elements[1],w[b+2]=M.elements[2],w[b+3]=0,w[b+4]=M.elements[3],w[b+5]=M.elements[4],w[b+6]=M.elements[5],w[b+7]=0,w[b+8]=M.elements[6],w[b+9]=M.elements[7],w[b+10]=M.elements[8],w[b+11]=0):ArrayBuffer.isView(M)?w.set(M.subarray(0,w.length-b),b):M.toArray(w,b)}function d(M,w,b,A){let E=M.value,g=w+"_"+b;if(Array.isArray(E)){A[g]===void 0&&(A[g]=[]);let S=A[g],O=!1;for(let I=0;I<E.length;I++)f(E[I],S,I)===!0&&(O=!0);return O}return f(E,A,g)}function f(M,w,b){if(w[b]===void 0)return typeof M=="number"||typeof M=="boolean"?w[b]=M:ArrayBuffer.isView(M)?w[b]=M.slice():w[b]=M.clone(),!0;{let A=w[b];if(typeof M=="number"||typeof M=="boolean"){if(A!==M)return w[b]=M,!0}else{if(ArrayBuffer.isView(M))return!0;if(A.equals(M)===!1)return A.copy(M),!0}}return!1}function _(M){let w=M.uniforms,b=0,A=16;for(let g=0,S=w.length;g<S;g++){let O=Array.isArray(w[g])?w[g]:[w[g]];for(let I=0,U=O.length;I<U;I++){let k=O[I],V=Array.isArray(k.value)?k.value:[k.value],L=Array.isArray(w[g])||Array.isArray(k.value),F=b;for(let H=0,rt=V.length;H<rt;H++){let q=V[H],tt=x(q,L),it=b%A,wt=it%tt.boundary,Ut=it+wt;b+=wt,Ut!==0&&A-Ut<tt.storage&&(b+=A-Ut),H===0&&(F=b),b+=tt.storage}let X=k.type==="int"?Int32Array:k.type==="uint"?Uint32Array:Float32Array;k.__data=new X((b-F)/Float32Array.BYTES_PER_ELEMENT),k.__offset=F}}let E=b%A;return E>0&&(b+=A-E),M.__size=b,M.__cache={},this}function x(M,w){let b={boundary:0,storage:0};return typeof M=="number"||typeof M=="boolean"?(b.boundary=4,b.storage=4):M.isVector2?(b.boundary=8,b.storage=8):M.isVector3||M.isColor?(b.boundary=16,b.storage=12):M.isVector4?(b.boundary=16,b.storage=16):M.isMatrix3?(b.boundary=16,b.storage=48):M.isMatrix4?(b.boundary=16,b.storage=64):M.isTexture?zt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(M)?(b.boundary=16,b.storage=M.byteLength):zt("WebGLRenderer: Unsupported uniform value type.",M),w===!0&&(b.boundary=16,b.storage=Math.ceil(b.storage/16)*16),b}function p(M){let w=M.target;w.removeEventListener("dispose",p),i.deleteBuffer(s[w.id]),delete s[w.id],delete a[w.id]}function m(){for(let M in s)i.deleteBuffer(s[M]);s={},a={}}return{bind:r,update:o,dispose:m}}var Vg=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]),Ln=null;function Wg(){return Ln===null&&(Ln=new Ns(Vg,16,16,li,gn),Ln.name="DFG_LUT",Ln.minFilter=Ye,Ln.magFilter=Ye,Ln.wrapS=vn,Ln.wrapT=vn,Ln.generateMipmaps=!1,Ln.needsUpdate=!0),Ln}var bo=class{constructor(t={}){let{canvas:e=Rh(),context:n=null,depth:s=!0,stencil:a=!1,alpha:r=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:h="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:d=!1,outputBufferType:f=Ke}=t;this.isWebGLRenderer=!0;let _;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");_=n.getContextAttributes().alpha}else _=r;let x=f,p=new Set([Ha,Ga,$a]),m=new Set([Ke,mn,as,Ei,Ba,ka]),M=new Uint32Array(4),w=new Int32Array(4),b={textures:[],min:[],max:[],resolution:[]},A=null,E=null,g=[],S=[],O=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Rn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let I=this,U=!1,k=null,V=null,L=null,F=null;this._outputColorSpace=He;let X=0,H=0,rt=null,q=-1,tt=null,it=new Me,wt=new Me,Ut=null,J=new Zt(0),ft=0,At=e.width,Ot=e.height,bt=1,Bt=null,de=null,kt=new Me(0,0,At,Ot),Yt=new Me(0,0,At,Ot),Kt=!1,st=new ni,ct=new ha,ut=!1,Rt=!1,xt=new fe,Vt=new B,Dt=new Me,qt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},ne=!1;function se(){return rt===null?bt:1}let D=n;function we(v,P){return e.getContext(v,P)}let Jt,ie,ht,ge,Ft,$t,T,y,z,at,nt,pt,_t,j,et,mt,R,Q,K,gt,lt,N,Z;try{let v={alpha:!0,depth:s,stencil:a,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:h,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${"187"}`),e.addEventListener("webglcontextlost",dt,!1),e.addEventListener("webglcontextrestored",Ct,!1),e.addEventListener("webglcontextcreationerror",yt,!1),D===null){let P="webgl2";if(D=we(P,v),D===null)throw we(P)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}ot()}catch(v){throw e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),Gt("WebGLRenderer: "+v.message),v}function ot(){Jt=new n0(D),Jt.init(),lt=new Bg(D,Jt),ie=new Wm(D,Jt,t,lt),ht=new Fg(D,Jt),ie.reversedDepthBuffer&&d&&ht.buffers.depth.setReversed(!0),V=D.createFramebuffer(),L=D.createFramebuffer(),F=D.createFramebuffer(),ge=new r0(D),Ft=new Sg,$t=new Og(D,Jt,ht,Ft,ie,lt,ge),T=new e0(I),y=new of(D),N=new Hm(D,y),z=new i0(D,y,ge,N),at=new o0(D,z,y,N,ge),Q=new a0(D,ie,$t),et=new Xm(Ft),nt=new Mg(I,T,Jt,ie,N,et),pt=new Gg(I,Ft),_t=new wg,j=new Lg(Jt),R=new Gm(I,T,ht,at,_,l),mt=new Ug(I,at,ie),Z=new Hg(D,ge,ie,ht),K=new Vm(D,Jt,ge),gt=new s0(D,Jt,ge),ge.programs=nt.programs,I.capabilities=ie,I.extensions=Jt,I.properties=Ft,I.renderLists=_t,I.shadowMap=mt,I.state=ht,I.info=ge}x!==Ke&&(O=new c0(x,e.width,e.height,o,s,a));let Y=new nc(I,D);this.xr=Y,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){let v=Jt.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){let v=Jt.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return bt},this.setPixelRatio=function(v){v!==void 0&&(bt=v,this.setSize(At,Ot,!1))},this.getSize=function(v){return v.set(At,Ot)},this.setSize=function(v,P,W=!0){if(Y.isPresenting){zt("WebGLRenderer: Can't change size while VR device is presenting.");return}At=v,Ot=P,e.width=Math.floor(v*bt),e.height=Math.floor(P*bt),W===!0&&(e.style.width=v+"px",e.style.height=P+"px"),O!==null&&O.setSize(e.width,e.height),this.setViewport(0,0,v,P)},this.getDrawingBufferSize=function(v){return v.set(At*bt,Ot*bt).floor()},this.setDrawingBufferSize=function(v,P,W){At=v,Ot=P,bt=W,e.width=Math.floor(v*W),e.height=Math.floor(P*W),this.setViewport(0,0,v,P)},this.setEffects=function(v){if(x===Ke){Gt("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(v){for(let P=0;P<v.length;P++)if(v[P].isOutputPass===!0){zt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}O.setEffects(v||[])},this.getCurrentViewport=function(v){return v.copy(it)},this.getViewport=function(v){return v.copy(kt)},this.setViewport=function(v,P,W,$){v.isVector4?kt.set(v.x,v.y,v.z,v.w):kt.set(v,P,W,$),ht.viewport(it.copy(kt).multiplyScalar(se()).round())},this.getScissor=function(v){return v.copy(Yt)},this.setScissor=function(v,P,W,$){v.isVector4?Yt.set(v.x,v.y,v.z,v.w):Yt.set(v,P,W,$),ht.scissor(wt.copy(Yt).multiplyScalar(se()).round())},this.getScissorTest=function(){return Kt},this.setScissorTest=function(v){ht.setScissorTest(Kt=v)},this.setOpaqueSort=function(v){Bt=v},this.setTransparentSort=function(v){de=v},this.getClearColor=function(v){return v.copy(R.getClearColor())},this.setClearColor=function(){R.setClearColor(...arguments)},this.getClearAlpha=function(){return R.getClearAlpha()},this.setClearAlpha=function(){R.setClearAlpha(...arguments)},this.clear=function(v=!0,P=!0,W=!0){let $=0;if(v){let G=!1;if(rt!==null){let St=rt.texture.format;G=p.has(St)}if(G){let St=rt.texture.type,Lt=m.has(St),vt=R.getClearColor(),Et=R.getClearAlpha(),Nt=vt.r,Wt=vt.g,re=vt.b;Lt?(M[0]=Nt,M[1]=Wt,M[2]=re,M[3]=Et,D.clearBufferuiv(D.COLOR,0,M)):(w[0]=Nt,w[1]=Wt,w[2]=re,w[3]=Et,D.clearBufferiv(D.COLOR,0,w))}else $|=D.COLOR_BUFFER_BIT}P&&($|=D.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),W&&($|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),$!==0&&D.clear($)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(v){v.setRenderer(this),k=v},this.dispose=function(){e.removeEventListener("webglcontextlost",dt,!1),e.removeEventListener("webglcontextrestored",Ct,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),R.dispose(),_t.dispose(),j.dispose(),$t.dispose(),Ft.dispose(),T.dispose(),at.dispose(),z.dispose(),N.dispose(),Z.dispose(),nt.dispose(),Y.dispose(),Y.removeEventListener("sessionstart",Mr),Y.removeEventListener("sessionend",ds),Dn.stop()};function dt(v){v.preventDefault(),Bl("WebGLRenderer: Context Lost."),U=!0}function Ct(){Bl("WebGLRenderer: Context Restored."),U=!1;let v=ge.autoReset,P=mt.enabled,W=mt.autoUpdate,$=mt.needsUpdate,G=mt.type;ot(),ge.autoReset=v,mt.enabled=P,mt.autoUpdate=W,mt.needsUpdate=$,mt.type=G}function yt(v){Gt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Qt(v){let P=v.target;P.removeEventListener("dispose",Qt),ce(P)}function ce(v){Fe(v),Ft.remove(v)}function Fe(v){let P=Ft.get(v).programs;P!==void 0&&(P.forEach(function(W){nt.releaseProgram(W)}),v.isShaderMaterial&&nt.releaseShaderCache(v))}this.renderBufferDirect=function(v,P,W,$,G,St){P===null&&(P=qt);let Lt=G.isMesh&&G.matrixWorld.determinantAffine()<0,vt=Du(v,P,W,$,G);ht.setMaterial($,Lt);let Et=W.index,Nt=1;if($.wireframe===!0){if(Et=z.getWireframeAttribute(W),Et===void 0)return;Nt=2}let Wt=W.drawRange,re=W.attributes.position,It=Wt.start*Nt,ae=(Wt.start+Wt.count)*Nt;St!==null&&(It=Math.max(It,St.start*Nt),ae=Math.min(ae,(St.start+St.count)*Nt)),Et!==null?(It=Math.max(It,0),ae=Math.min(ae,Et.count)):re!=null&&(It=Math.max(It,0),ae=Math.min(ae,re.count));let Ee=ae-It;if(Ee<0||Ee===1/0)return;N.setup(G,$,vt,W,Et);let _e,me=K;if(Et!==null&&(_e=y.get(Et),me=gt,me.setIndex(_e)),G.isMesh)$.wireframe===!0?(ht.setLineWidth($.wireframeLinewidth*se()),me.setMode(D.LINES)):me.setMode(D.TRIANGLES);else if(G.isLine){let ke=$.linewidth;ke===void 0&&(ke=1),ht.setLineWidth(ke*se()),G.isLineSegments?me.setMode(D.LINES):G.isLineLoop?me.setMode(D.LINE_LOOP):me.setMode(D.LINE_STRIP)}else G.isPoints?me.setMode(D.POINTS):G.isSprite&&me.setMode(D.TRIANGLES);if(G.isBatchedMesh)if(Jt.get("WEBGL_multi_draw"))me.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{let ke=G._multiDrawStarts,Pt=G._multiDrawCounts,qe=G._multiDrawCount,he=Et?y.get(Et).bytesPerElement:1,hi=Ft.get($).currentProgram.getUniforms();for(let ze=0;ze<qe;ze++)hi.setValue(D,"_gl_DrawID",ze),me.render(ke[ze]/he,Pt[ze])}else if(G.isInstancedMesh)me.renderInstances(It,Ee,G.count);else if(W.isInstancedBufferGeometry){let ke=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,Pt=Math.min(W.instanceCount,ke);me.renderInstances(It,Ee,Pt)}else me.render(It,Ee)};function Pn(v,P,W,$){k!==null&&v.isNodeMaterial&&k.setObject($,v),ut===!0&&et.setState(v,W,!1),v.transparent===!0&&v.side===an&&v.forceSinglePass===!1?(v.side=Be,v.needsUpdate=!0,ps(v,P,$),v.side=oi,v.needsUpdate=!0,ps(v,P,$),v.side=an):ps(v,P,$)}this.compile=function(v,P,W=null){W===null&&(W=v),k!==null&&k.renderStart(v,P,W),E=j.get(W),E.init(P),S.push(E),W.traverseVisible(function(G){G.isLight&&G.layers.test(P.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),v!==W&&v.traverseVisible(function(G){G.isLight&&G.layers.test(P.layers)&&(E.pushLight(G),G.castShadow&&E.pushShadow(G))}),E.setupLights(),k!==null&&k.updateLights(E.state.lightsArray),Rt=this.localClippingEnabled,ut=et.init(this.clippingPlanes,Rt),ut===!0&&et.setGlobalState(this.clippingPlanes,P),k!==null&&mt.render(E.state.shadowsArray,W,P);let $=new Set;return v.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;let St=G.material;if(St)if(Array.isArray(St))for(let Lt=0;Lt<St.length;Lt++){let vt=St[Lt];Pn(vt,W,P,G),$.add(vt)}else Pn(St,W,P,G),$.add(St)}),E=S.pop(),k!==null&&k.renderEnd(),$},this.compileAsync=function(v,P,W=null){let $=this.compile(v,P,W);return new Promise(G=>{function St(){if($.forEach(function(Lt){let Et=Ft.get(Lt).currentProgram;(Et===void 0||Et.isReady())&&$.delete(Lt)}),$.size===0){G(v);return}setTimeout(St,10)}Jt.get("KHR_parallel_shader_compile")!==null?St():setTimeout(St,10)})};let us=null;function Do(v){us&&us(v)}function Mr(){Dn.stop()}function ds(){Dn.start()}let Dn=new hu;Dn.setAnimationLoop(Do),typeof self<"u"&&Dn.setContext(self),this.setAnimationLoop=function(v){us=v,Y.setAnimationLoop(v),v===null?Dn.stop():Dn.start()},Y.addEventListener("sessionstart",Mr),Y.addEventListener("sessionend",ds),this.render=function(v,P){if(P!==void 0&&P.isCamera!==!0){Gt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(U===!0)return;k!==null&&k.renderStart(v,P);let W=Y.enabled===!0&&Y.isPresenting===!0,$=O!==null&&(rt===null||W)&&O.begin(I,rt);if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),P.parent===null&&P.matrixWorldAutoUpdate===!0&&P.updateMatrixWorld(),Y.enabled===!0&&Y.isPresenting===!0&&(O===null||O.isCompositing()===!1)&&(Y.cameraAutoUpdate===!0&&Y.updateCamera(P),P=Y.getCamera()),v.isScene===!0&&v.onBeforeRender(I,v,P,rt),E=j.get(v,S.length),E.init(P),E.state.textureUnits=$t.getTextureUnits(),S.push(E),xt.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),P.isArrayCamera?ct.setFromArrayCamera(P):st.setFromProjectionMatrix(xt,rn,P.reversedDepth),Rt=this.localClippingEnabled,ut=et.init(this.clippingPlanes,Rt),A=_t.get(v,g.length),A.init(),g.push(A),this.info.render.frame++,Y.enabled===!0&&Y.isPresenting===!0){let Lt=I.xr.getDepthSensingMesh();Lt!==null&&fs(Lt,P,-1/0,I.sortObjects)}fs(v,P,0,I.sortObjects),A.finish(),k!==null&&k.updateLights(E.state.lightsArray),I.sortObjects===!0&&A.sort(Bt,de),ne=Y.enabled===!1||Y.isPresenting===!1||Y.hasDepthSensing()===!1,ne&&R.addToRenderList(A,v),this.info.autoReset===!0&&this.info.reset(),ut===!0&&et.beginShadows();let G=E.state.shadowsArray;if(mt.render(G,v,P),ut===!0&&et.endShadows(),($&&O.hasRenderPass())===!1){let Lt=A.opaque,vt=A.transmissive;if(E.setupLights(),P.isArrayCamera){let Et=P.cameras;if(vt.length>0)for(let Nt=0,Wt=Et.length;Nt<Wt;Nt++){let re=Et[Nt];dc(Lt,vt,v,re)}ne&&R.render(v);for(let Nt=0,Wt=Et.length;Nt<Wt;Nt++){let re=Et[Nt];Sr(A,v,re,re.viewport)}}else vt.length>0&&dc(Lt,vt,v,P),ne&&R.render(v),Sr(A,v,P)}rt!==null&&H===0&&($t.updateMultisampleRenderTarget(rt),$t.updateRenderTargetMipmap(rt)),$&&O.end(I),v.isScene===!0&&v.onAfterRender(I,v,P),N.resetDefaultState(),q=-1,tt=null,S.pop(),S.length>0?(E=S[S.length-1],$t.setTextureUnits(E.state.textureUnits),ut===!0&&et.setGlobalState(I.clippingPlanes,E.state.camera)):E=null,g.pop(),g.length>0?A=g[g.length-1]:A=null,k!==null&&k.renderEnd()};function fs(v,P,W,$){if(v.visible===!1)return;if(v.layers.test(P.layers)){if(v.isGroup)W=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(P);else if(v.isLight)E.pushLight(v),v.castShadow&&E.pushShadow(v);else if(v.isSprite){let Lt=P.isArrayCamera?ct:st;if(!v.frustumCulled||v.intersectsFrustum(Lt)){$&&Dt.setFromMatrixPosition(v.matrixWorld).applyMatrix4(xt);let vt=at.update(v),Et=v.material;Et.visible&&A.push(v,vt,Et,W,Dt.z,null,P)}}else if(v.isMesh||v.isLine||v.isPoints){let Lt=P.isArrayCamera?ct:st;if(!v.frustumCulled||v.intersectsFrustum(Lt)){let vt=at.update(v),Et=v.material;if($&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Dt.copy(v.boundingSphere.center)):(vt.boundingSphere===null&&vt.computeBoundingSphere(),Dt.copy(vt.boundingSphere.center)),Dt.applyMatrix4(v.matrixWorld).applyMatrix4(xt)),Array.isArray(Et)){let Nt=vt.groups;for(let Wt=0,re=Nt.length;Wt<re;Wt++){let It=Nt[Wt],ae=Et[It.materialIndex];ae&&ae.visible&&A.push(v,vt,ae,W,Dt.z,It,P)}}else Et.visible&&A.push(v,vt,Et,W,Dt.z,null,P)}}}let St=v.children;for(let Lt=0,vt=St.length;Lt<vt;Lt++)fs(St[Lt],P,W,$)}function Sr(v,P,W,$){let{opaque:G,transmissive:St,transparent:Lt}=v;E.setupLightsView(W),ut===!0&&et.setGlobalState(I.clippingPlanes,W),$&&ht.viewport(it.copy($)),G.length>0&&br(G,P,W),St.length>0&&br(St,P,W),Lt.length>0&&br(Lt,P,W),ht.buffers.depth.setTest(!0),ht.buffers.depth.setMask(!0),ht.buffers.color.setMask(!0),ht.setPolygonOffset(!1)}function dc(v,P,W,$){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[$.id]===void 0){let It=Jt.has("EXT_color_buffer_half_float")||Jt.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[$.id]=new tn(1,1,{generateMipmaps:!0,type:It?gn:Ke,minFilter:Vn,samples:Math.max(4,ie.samples),stencilBuffer:a,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:oe.workingColorSpace})}let St=E.state.transmissionRenderTarget[$.id],Lt=$.viewport||it;St.setSize(Lt.z*I.transmissionResolutionScale,Lt.w*I.transmissionResolutionScale);let vt=I.getRenderTarget(),Et=I.getActiveCubeFace(),Nt=I.getActiveMipmapLevel();I.setRenderTarget(St),I.getClearColor(J),ft=I.getClearAlpha(),ft<1&&I.setClearColor(16777215,.5),I.clear(),ne&&R.render(W);let Wt=I.toneMapping;I.toneMapping=Rn;let re=$.viewport;if($.viewport!==void 0&&($.viewport=void 0),E.setupLightsView($),ut===!0&&et.setGlobalState(I.clippingPlanes,$),br(v,W,$),$t.updateMultisampleRenderTarget(St),$t.updateRenderTargetMipmap(St),Jt.has("WEBGL_multisampled_render_to_texture")===!1){let It=!1;for(let ae=0,Ee=P.length;ae<Ee;ae++){let _e=P[ae],{object:me,geometry:ke,material:Pt,group:qe}=_e;if(Pt.side===an&&me.layers.test($.layers)){let he=Pt.side;Pt.side=Be,Pt.needsUpdate=!0,fc(me,W,$,ke,Pt,qe),Pt.side=he,Pt.needsUpdate=!0,It=!0}}It===!0&&($t.updateMultisampleRenderTarget(St),$t.updateRenderTargetMipmap(St))}I.setRenderTarget(vt,Et,Nt),I.setClearColor(J,ft),re!==void 0&&($.viewport=re),I.toneMapping=Wt}function br(v,P,W){let $=P.isScene===!0?P.overrideMaterial:null;for(let G=0,St=v.length;G<St;G++){let Lt=v[G],{object:vt,geometry:Et,group:Nt}=Lt,Wt=Lt.material;Wt.allowOverride===!0&&$!==null&&(Wt=$),vt.layers.test(W.layers)&&fc(vt,P,W,Et,Wt,Nt)}}function fc(v,P,W,$,G,St){k!==null&&G.isNodeMaterial&&k.setObject(v,G),v.onBeforeRender(I,P,W,$,G,St),v.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),G.onBeforeRender(I,P,W,$,v,St),G.transparent===!0&&G.side===an&&G.forceSinglePass===!1?(G.side=Be,G.needsUpdate=!0,I.renderBufferDirect(W,P,$,G,v,St),G.side=oi,G.needsUpdate=!0,I.renderBufferDirect(W,P,$,G,v,St),G.side=an):I.renderBufferDirect(W,P,$,G,v,St),v.onAfterRender(I,P,W,$,G,St)}function pc(v){let P=0;for(let W of v)W.texture!==null&&P++;return P}function ps(v,P,W){P.isScene!==!0&&(P=qt);let $=Ft.get(v),G=E.state.lights,St=E.state.shadowsArray,Lt=G.state.version,vt=nt.getParameters(v,G.state,St,P,W,E.state.lightProbeGridArray),Et=nt.getProgramCacheKey(vt),Nt=$.programs;$.environment=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?P.environment:null,$.fog=P.fog;let Wt=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap;$.envMap=T.get(v.envMap||$.environment,Wt),$.envMapRotation=$.environment!==null&&v.envMap===null?P.environmentRotation:v.envMapRotation,Nt===void 0&&(v.addEventListener("dispose",Qt),Nt=new Map,$.programs=Nt,$.programVariants=new Map);let re=Nt.get(Et);if(re!==void 0){if($.currentProgram===re&&$.lightsStateVersion===Lt)return gc(v,vt),re}else vt.uniforms=nt.getUniforms(v),k!==null&&v.isNodeMaterial&&k.build(v,W,vt),v.onBeforeCompile(vt,I),re=nt.acquireProgram(vt,Et),Nt.set(Et,re),$.uniforms=vt.uniforms;let It=$.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(It.clippingPlanes=et.uniform),gc(v,vt),$.needsLights=Uu(v),$.lightsStateVersion=Lt,$.needsLights&&(It.ambientLightColor.value=G.state.ambient,It.lightProbe.value=G.state.probe,It.sunLights.value=G.state.sun,It.sunLightShadows.value=G.state.sunShadow,It.directionalLights.value=G.state.directional,It.directionalLightShadows.value=G.state.directionalShadow,It.spotLights.value=G.state.spot,It.spotLightShadows.value=G.state.spotShadow,It.rectAreaLights.value=G.state.rectArea,It.ltc_1.value=G.state.rectAreaLTC1,It.ltc_2.value=G.state.rectAreaLTC2,It.pointLights.value=G.state.point,It.pointLightShadows.value=G.state.pointShadow,It.hemisphereLights.value=G.state.hemi,It.sunShadowMatrix.value=G.state.sunShadowMatrix,It.sunShadowCascade.value=G.state.sunShadowCascade,It.directionalShadowMatrix.value=G.state.directionalShadowMatrix,It.spotLightMatrix.value=G.state.spotLightMatrix,It.spotLightMap.value=G.state.spotLightMap,It.pointShadowMatrix.value=G.state.pointShadowMatrix),$.numLightProbeGrids=pc(E.state.lightProbeGridArray),$.currentProgram=re,$.uniformsList=null,re}function Pu(v,P,W,$,G){let St=Ft.get(v),Lt=St.currentProgram.id+","+$+","+G,vt=St.programVariants.get(Lt);return vt===void 0?(vt=ps(v,P,W),St.programVariants.set(Lt,vt)):(St.currentProgram=vt,St.uniformsList=null,St.outputColorSpace=$,St.toneMapping=G),vt}function mc(v){if(v.uniformsList===null){let P=v.currentProgram.getUniforms();v.uniformsList=os.seqWithValue(P.seq,v.uniforms)}return v.uniformsList}function gc(v,P){let W=Ft.get(v);W.outputColorSpace=P.outputColorSpace,W.batching=P.batching,W.batchingColor=P.batchingColor,W.instancing=P.instancing,W.instancingColor=P.instancingColor,W.instancingMorph=P.instancingMorph,W.skinning=P.skinning,W.morphTargets=P.morphTargets,W.morphNormals=P.morphNormals,W.morphColors=P.morphColors,W.morphTargetsCount=P.morphTargetsCount,W.numClippingPlanes=P.numClippingPlanes,W.numIntersection=P.numClipIntersection,W.vertexAlphas=P.vertexAlphas,W.vertexTangents=P.vertexTangents,W.toneMapping=P.toneMapping}function Du(v,P,W,$,G){P.isScene!==!0&&(P=qt),$t.resetTextureUnits();let St=P.fog,Lt=$.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial?P.environment:null,vt=rt===null?I.outputColorSpace:rt.isXRRenderTarget===!0?rt.texture.colorSpace:oe.workingColorSpace,Et=$.isMeshStandardMaterial||$.isMeshLambertMaterial&&!$.envMap||$.isMeshPhongMaterial&&!$.envMap,Nt=T.get($.envMap||Lt,Et),Wt=$.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,re=!!W.attributes.tangent&&(!!$.normalMap||$.anisotropy>0),It=!!W.morphAttributes.position,ae=!!W.morphAttributes.normal,Ee=!!W.morphAttributes.color,_e=Rn;$.toneMapped&&(rt===null||rt.isXRRenderTarget===!0)&&(_e=I.toneMapping);let me=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,ke=me!==void 0?me.length:0,Pt=Ft.get($),qe=E.state.lights;if(ut===!0&&(Rt===!0||v!==tt)){let Se=v===tt&&$.id===q;et.setState($,v,Se)}let he=!1,hi=!1;$.version===Pt.__version?Pt.needsLights&&Pt.lightsStateVersion!==qe.state.version||G.isBatchedMesh&&Pt.batching===!1||!G.isBatchedMesh&&Pt.batching===!0||G.isBatchedMesh&&Pt.batchingColor===!0&&G._colorsTexture===null||G.isBatchedMesh&&Pt.batchingColor===!1&&G._colorsTexture!==null||G.isInstancedMesh&&Pt.instancing===!1||!G.isInstancedMesh&&Pt.instancing===!0||G.isSkinnedMesh&&Pt.skinning===!1||!G.isSkinnedMesh&&Pt.skinning===!0||G.isInstancedMesh&&Pt.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Pt.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Pt.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Pt.instancingMorph===!1&&G.morphTexture!==null||Pt.envMap!==Nt||$.fog===!0&&Pt.fog!==St||Pt.numClippingPlanes!==void 0&&(Pt.numClippingPlanes!==et.numPlanes||Pt.numIntersection!==et.numIntersection)||Pt.vertexAlphas!==Wt||Pt.vertexTangents!==re||Pt.morphTargets!==It||Pt.morphNormals!==ae||Pt.morphColors!==Ee||Pt.morphTargetsCount!==ke||Pt.numLightProbeGrids!==pc(E.state.lightProbeGridArray)?he=!0:(Pt.outputColorSpace!==vt||Pt.toneMapping!==_e)&&(hi=!0):(he=!0,Pt.__version=$.version);let ze=Pt.currentProgram;(he===!0||hi===!0)&&(ze=hi===!0?Pu($,P,G,vt,_e):ps($,P,G),k&&$.isNodeMaterial&&k.onUpdateProgram($,ze,Pt));let wr=!1,Zn=!1,ui=!1,le=ze.getUniforms(),Oe=Pt.uniforms;if(ht.useProgram(ze.program)&&(wr=!0,Zn=!0,ui=!0),$.id!==q&&(q=$.id,Zn=!0),wr||tt!==v){ht.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),le.setValue(D,"projectionMatrix",v.projectionMatrix),le.setValue(D,"viewMatrix",v.matrixWorldInverse);let Ie=le.map.cameraPosition;Ie!==void 0&&Ie.setValue(D,Vt.setFromMatrixPosition(v.matrixWorld)),ie.logarithmicDepthBuffer&&le.setValue(D,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),($.isMeshPhongMaterial||$.isMeshToonMaterial||$.isMeshLambertMaterial||$.isMeshBasicMaterial||$.isMeshStandardMaterial||$.isShaderMaterial)&&le.setValue(D,"isOrthographic",v.isOrthographicCamera===!0),tt!==v&&(tt=v,Zn=!0,ui=!0)}if(Pt.needsLights&&(qe.state.sunShadowMap.length>0&&le.setValue(D,"sunShadowMap",qe.state.sunShadowMap,$t),qe.state.directionalShadowMap.length>0&&le.setValue(D,"directionalShadowMap",qe.state.directionalShadowMap,$t),qe.state.spotShadowMap.length>0&&le.setValue(D,"spotShadowMap",qe.state.spotShadowMap,$t),qe.state.pointShadowMap.length>0&&le.setValue(D,"pointShadowMap",qe.state.pointShadowMap,$t)),G.isSkinnedMesh){le.setOptional(D,G,"bindMatrix"),le.setOptional(D,G,"bindMatrixInverse");let Se=G.skeleton;Se&&(Se.boneTexture===null&&Se.computeBoneTexture(),le.setValue(D,"boneTexture",Se.boneTexture,$t))}G.isBatchedMesh&&(le.setOptional(D,G,"batchingTexture"),le.setValue(D,"batchingTexture",G._matricesTexture,$t),le.setOptional(D,G,"batchingIdTexture"),le.setValue(D,"batchingIdTexture",G._indirectTexture,$t),le.setOptional(D,G,"batchingColorTexture"),G._colorsTexture!==null&&le.setValue(D,"batchingColorTexture",G._colorsTexture,$t));let ln=W.morphAttributes;if((ln.position!==void 0||ln.normal!==void 0||ln.color!==void 0)&&Q.update(G,W,ze),(Zn||Pt.receiveShadow!==G.receiveShadow)&&(Pt.receiveShadow=G.receiveShadow,le.setValue(D,"receiveShadow",G.receiveShadow)),($.isMeshStandardMaterial||$.isMeshLambertMaterial||$.isMeshPhongMaterial)&&$.envMap===null&&P.environment!==null&&(Oe.envMapIntensity.value=P.environmentIntensity),Oe.dfgLUT!==void 0&&(Oe.dfgLUT.value=Wg()),Zn){if(le.setValue(D,"toneMappingExposure",I.toneMappingExposure),Pt.needsLights&&Nu(Oe,ui),St&&$.fog===!0&&pt.refreshFogUniforms(Oe,St),pt.refreshMaterialUniforms(Oe,$,bt,Ot,E.state.transmissionRenderTarget[v.id]),Pt.needsLights&&Pt.numLightProbeGrids>0){let Se=b,Ie=0;for(let Nn of E.state.lightProbeGridArray)Nn.texture!==null&&(Se.textures[Ie]=Nn.texture,Se.min[Ie]=Nn.boundingBox.min,Se.max[Ie]=Nn.boundingBox.max,Se.resolution[Ie]=Nn.resolution,Ie++);for(let Nn in Se)Se[Nn].length=Ie;Oe.probesSH.value=Se.textures,Oe.probesMin.value=Se.min,Oe.probesMax.value=Se.max,Oe.probesResolution.value=Se.resolution}os.upload(D,mc(Pt),Oe,$t)}if($.isShaderMaterial&&$.uniformsNeedUpdate===!0&&(os.upload(D,mc(Pt),Oe,$t),$.uniformsNeedUpdate=!1),$.isSpriteMaterial&&le.setValue(D,"center",G.center),le.setValue(D,"modelViewMatrix",G.modelViewMatrix),le.setValue(D,"normalMatrix",G.normalMatrix),le.setValue(D,"modelMatrix",G.matrixWorld),$.uniformsGroups!==void 0){let Se=$.uniformsGroups;for(let Ie=0,Nn=Se.length;Ie<Nn;Ie++){let xc=Se[Ie];Z.update(xc,ze),Z.bind(xc,ze)}}return ze}function Nu(v,P){v.ambientLightColor.needsUpdate=P,v.lightProbe.needsUpdate=P,v.sunLights.needsUpdate=P,v.sunLightShadows.needsUpdate=P,v.directionalLights.needsUpdate=P,v.directionalLightShadows.needsUpdate=P,v.pointLights.needsUpdate=P,v.pointLightShadows.needsUpdate=P,v.spotLights.needsUpdate=P,v.spotLightShadows.needsUpdate=P,v.rectAreaLights.needsUpdate=P,v.hemisphereLights.needsUpdate=P}function Uu(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return H},this.getRenderTarget=function(){return rt},this.setRenderTargetTextures=function(v,P,W){let $=Ft.get(v);$.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,$.__autoAllocateDepthBuffer===!1&&($.__useRenderToTexture=!1),Ft.get(v.texture).__webglTexture=P,Ft.get(v.depthTexture).__webglTexture=$.__autoAllocateDepthBuffer?void 0:W,$.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,P){let W=Ft.get(v);W.__webglFramebuffer=P,W.__useDefaultFramebuffer=P===void 0},this.setRenderTarget=function(v,P=0,W=0){rt=v,X=P,H=W;let $=null,G=!1,St=!1;if(v){let vt=Ft.get(v);if(vt.__useDefaultFramebuffer!==void 0){ht.bindFramebuffer(D.FRAMEBUFFER,vt.__webglFramebuffer),it.copy(v.viewport),wt.copy(v.scissor),Ut=v.scissorTest,ht.viewport(it),ht.scissor(wt),ht.setScissorTest(Ut),q=-1;return}else if(vt.__webglFramebuffer===void 0)$t.setupRenderTarget(v);else if(vt.__hasExternalTextures)$t.rebindTextures(v,Ft.get(v.texture).__webglTexture,Ft.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){let Wt=v.depthTexture;if(vt.__boundDepthTexture!==Wt){if(Wt!==null&&Ft.has(Wt)&&(v.width!==Wt.image.width||v.height!==Wt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");$t.setupDepthRenderbuffer(v)}}let Et=v.texture;(Et.isData3DTexture||Et.isDataArrayTexture||Et.isCompressedArrayTexture)&&(St=!0);let Nt=Ft.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Nt[P])?$=Nt[P][W]:$=Nt[P],G=!0):v.samples>0&&$t.useMultisampledRTT(v)===!1?$=Ft.get(v).__webglMultisampledFramebuffer:Array.isArray(Nt)?$=Nt[W]:$=Nt,it.copy(v.viewport),wt.copy(v.scissor),Ut=v.scissorTest}else it.copy(kt).multiplyScalar(bt).floor(),wt.copy(Yt).multiplyScalar(bt).floor(),Ut=Kt;if(W!==0&&($=V),ht.bindFramebuffer(D.FRAMEBUFFER,$)&&ht.drawBuffers(v,$),ht.viewport(it),ht.scissor(wt),ht.setScissorTest(Ut),G){let vt=Ft.get(v.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+P,vt.__webglTexture,W)}else if(St){let vt=P;for(let Et=0;Et<v.textures.length;Et++){let Nt=Ft.get(v.textures[Et]);D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0+Et,Nt.__webglTexture,W,vt)}}else if(v!==null&&W!==0){let vt=Ft.get(v.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,vt.__webglTexture,W)}q=-1};function _c(v){let P=Ft.get(v);return(P.__readFormat!==v.format||P.__readType!==v.type)&&(P.__readFormat=v.format,P.__readType=v.type,P.__formatReadable=ie.textureFormatReadable(v.format),P.__typeReadable=ie.textureTypeReadable(v.type)),P}this.readRenderTargetPixels=function(v,P,W,$,G,St,Lt,vt=0){if(!(v&&v.isWebGLRenderTarget)){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Et=Ft.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&Lt!==void 0&&(Et=Et[Lt],Array.isArray(Et)&&(Et=Et[0])),Et){ht.bindFramebuffer(D.FRAMEBUFFER,Et);try{let Nt=v.textures[vt],Wt=Nt.format,re=Nt.type;v.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+vt);let It=_c(Nt);if(It.__formatReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(It.__typeReadable===!1){Gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}P>=0&&P<=v.width-$&&W>=0&&W<=v.height-G&&D.readPixels(P,W,$,G,lt.convert(Wt),lt.convert(re),St)}finally{let Nt=rt!==null?Ft.get(rt).__webglFramebuffer:null;ht.bindFramebuffer(D.FRAMEBUFFER,Nt)}}},this.readRenderTargetPixelsAsync=async function(v,P,W,$,G,St,Lt,vt=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Et=Ft.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&Lt!==void 0&&(Et=Et[Lt],Array.isArray(Et)&&(Et=Et[0])),Et)if(P>=0&&P<=v.width-$&&W>=0&&W<=v.height-G){ht.bindFramebuffer(D.FRAMEBUFFER,Et);let Nt=v.textures[vt],Wt=Nt.format,re=Nt.type;v.textures.length>1&&D.readBuffer(D.COLOR_ATTACHMENT0+vt);let It=_c(Nt);if(It.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(It.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let ae=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,ae),D.bufferData(D.PIXEL_PACK_BUFFER,St.byteLength,D.STREAM_READ),D.readPixels(P,W,$,G,lt.convert(Wt),lt.convert(re),0),D.bindBuffer(D.PIXEL_PACK_BUFFER,null);let Ee=rt!==null?Ft.get(rt).__webglFramebuffer:null;ht.bindFramebuffer(D.FRAMEBUFFER,Ee);let _e=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await Ih(D,_e,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,ae),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,St),D.bindBuffer(D.PIXEL_PACK_BUFFER,null),D.deleteBuffer(ae),D.deleteSync(_e),St}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,P=null,W=0){let $=Math.pow(2,-W),G=Math.floor(v.image.width*$),St=Math.floor(v.image.height*$),Lt=P!==null?P.x:0,vt=P!==null?P.y:0;$t.setTexture2D(v,0),D.copyTexSubImage2D(D.TEXTURE_2D,W,0,0,Lt,vt,G,St),ht.unbindTexture()},this.copyTextureToTexture=function(v,P,W=null,$=null,G=0,St=0){let Lt,vt,Et,Nt,Wt,re,It,ae,Ee,_e=v.isCompressedTexture?v.mipmaps[St]:v.image;if(W!==null)Lt=W.max.x-W.min.x,vt=W.max.y-W.min.y,Et=W.isBox3?W.max.z-W.min.z:1,Nt=W.min.x,Wt=W.min.y,re=W.isBox3?W.min.z:0;else{let le=Math.pow(2,-G);Lt=Math.floor(_e.width*le),vt=Math.floor(_e.height*le),v.isDataArrayTexture?Et=_e.depth:v.isData3DTexture?Et=Math.floor(_e.depth*le):Et=1,Nt=0,Wt=0,re=0}$!==null?(It=$.x,ae=$.y,Ee=$.z):(It=0,ae=0,Ee=0);let me=lt.convert(P.format),ke=lt.convert(P.type),Pt;P.isData3DTexture?($t.setTexture3D(P,0),Pt=D.TEXTURE_3D):P.isDataArrayTexture||P.isCompressedArrayTexture?($t.setTexture2DArray(P,0),Pt=D.TEXTURE_2D_ARRAY):($t.setTexture2D(P,0),Pt=D.TEXTURE_2D),ht.activeTexture(D.TEXTURE0),ht.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,P.flipY),ht.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,P.premultiplyAlpha),ht.pixelStorei(D.UNPACK_ALIGNMENT,P.unpackAlignment);let qe=ht.getParameter(D.UNPACK_ROW_LENGTH),he=ht.getParameter(D.UNPACK_IMAGE_HEIGHT),hi=ht.getParameter(D.UNPACK_SKIP_PIXELS),ze=ht.getParameter(D.UNPACK_SKIP_ROWS),wr=ht.getParameter(D.UNPACK_SKIP_IMAGES);ht.pixelStorei(D.UNPACK_ROW_LENGTH,_e.width),ht.pixelStorei(D.UNPACK_IMAGE_HEIGHT,_e.height),ht.pixelStorei(D.UNPACK_SKIP_PIXELS,Nt),ht.pixelStorei(D.UNPACK_SKIP_ROWS,Wt),ht.pixelStorei(D.UNPACK_SKIP_IMAGES,re);let Zn=v.isDataArrayTexture||v.isData3DTexture,ui=P.isDataArrayTexture||P.isData3DTexture;if(v.isDepthTexture){let le=Ft.get(v),Oe=Ft.get(P),ln=Ft.get(le.__renderTarget),Se=Ft.get(Oe.__renderTarget);ht.bindFramebuffer(D.READ_FRAMEBUFFER,ln.__webglFramebuffer),ht.bindFramebuffer(D.DRAW_FRAMEBUFFER,Se.__webglFramebuffer);for(let Ie=0;Ie<Et;Ie++)Zn&&(D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ft.get(v).__webglTexture,G,re+Ie),D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ft.get(P).__webglTexture,St,Ee+Ie)),D.blitFramebuffer(Nt,Wt,Nt+Lt,Wt+vt,It,ae,It+Lt,ae+vt,D.DEPTH_BUFFER_BIT,D.NEAREST);ht.bindFramebuffer(D.READ_FRAMEBUFFER,null),ht.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else if(G!==0||v.isRenderTargetTexture||Ft.has(v)){let le=Ft.get(v),Oe=Ft.get(P);ht.bindFramebuffer(D.READ_FRAMEBUFFER,L),ht.bindFramebuffer(D.DRAW_FRAMEBUFFER,F);for(let ln=0;ln<Et;ln++)Zn?D.framebufferTextureLayer(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,le.__webglTexture,G,re+ln):D.framebufferTexture2D(D.READ_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,le.__webglTexture,G),ui?D.framebufferTextureLayer(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,Oe.__webglTexture,St,Ee+ln):D.framebufferTexture2D(D.DRAW_FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_2D,Oe.__webglTexture,St),G!==0?D.blitFramebuffer(Nt,Wt,Nt+Lt,Wt+vt,It,ae,It+Lt,ae+vt,D.COLOR_BUFFER_BIT,D.NEAREST):ui?D.copyTexSubImage3D(Pt,St,It,ae,Ee+ln,Nt,Wt,Lt,vt):D.copyTexSubImage2D(Pt,St,It,ae,Nt,Wt,Lt,vt);ht.bindFramebuffer(D.READ_FRAMEBUFFER,null),ht.bindFramebuffer(D.DRAW_FRAMEBUFFER,null)}else ui?v.isDataTexture||v.isData3DTexture?D.texSubImage3D(Pt,St,It,ae,Ee,Lt,vt,Et,me,ke,_e.data):P.isCompressedArrayTexture?D.compressedTexSubImage3D(Pt,St,It,ae,Ee,Lt,vt,Et,me,_e.data):D.texSubImage3D(Pt,St,It,ae,Ee,Lt,vt,Et,me,ke,_e):v.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,St,It,ae,Lt,vt,me,ke,_e.data):v.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,St,It,ae,_e.width,_e.height,me,_e.data):D.texSubImage2D(D.TEXTURE_2D,St,It,ae,Lt,vt,me,ke,_e);ht.pixelStorei(D.UNPACK_ROW_LENGTH,qe),ht.pixelStorei(D.UNPACK_IMAGE_HEIGHT,he),ht.pixelStorei(D.UNPACK_SKIP_PIXELS,hi),ht.pixelStorei(D.UNPACK_SKIP_ROWS,ze),ht.pixelStorei(D.UNPACK_SKIP_IMAGES,wr),St===0&&P.generateMipmaps===!0&&P.mipmapsAutoUpdate===!0&&D.generateMipmap(Pt),ht.unbindTexture()},this.initRenderTarget=function(v){Ft.get(v).__webglFramebuffer===void 0&&$t.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?$t.setTextureCube(v,0):v.isData3DTexture?$t.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?$t.setTexture2DArray(v,0):$t.setTexture2D(v,0),ht.unbindTexture()},this.resetState=function(){X=0,H=0,rt=null,ht.reset(),N.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return rn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}};var Eo=class extends _i{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;let t=new En;t.deleteAttribute("uv");let e=new Cn({side:Be}),n=new Cn,s=new nr(16777215,900,28,2);s.position.set(.418,16.199,.3),this.add(s);let a=new pe(t,e);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);let r=new Fs(t,n,6),o=new Ne;o.position.set(-10.906,2.009,1.846),o.rotation.set(0,-.195,0),o.scale.set(2.328,7.905,4.651),o.updateMatrix(),r.setMatrixAt(0,o.matrix),o.position.set(-5.607,-.754,-.758),o.rotation.set(0,.994,0),o.scale.set(1.97,1.534,3.955),o.updateMatrix(),r.setMatrixAt(1,o.matrix),o.position.set(6.167,.857,7.803),o.rotation.set(0,.561,0),o.scale.set(3.927,6.285,3.687),o.updateMatrix(),r.setMatrixAt(2,o.matrix),o.position.set(-2.017,.018,6.124),o.rotation.set(0,.333,0),o.scale.set(2.002,4.566,2.064),o.updateMatrix(),r.setMatrixAt(3,o.matrix),o.position.set(2.291,-.756,-2.621),o.rotation.set(0,-.286,0),o.scale.set(1.546,1.552,1.496),o.updateMatrix(),r.setMatrixAt(4,o.matrix),o.position.set(-2.193,-.369,-5.547),o.rotation.set(0,.516,0),o.scale.set(3.875,3.487,2.986),o.updateMatrix(),r.setMatrixAt(5,o.matrix),this.add(r);let l=new pe(t,hs(50));l.position.set(-16.116,14.37,8.208),l.scale.set(.1,2.428,2.739),this.add(l);let c=new pe(t,hs(50));c.position.set(-16.109,18.021,-8.207),c.scale.set(.1,2.425,2.751),this.add(c);let h=new pe(t,hs(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);let u=new pe(t,hs(43));u.position.set(-.462,8.89,14.52),u.scale.set(4.38,5.441,.088),this.add(u);let d=new pe(t,hs(20));d.position.set(3.235,11.486,-12.541),d.scale.set(2.5,2,.1),this.add(d);let f=new pe(t,hs(100));f.position.set(0,20,0),f.scale.set(1,.1,1),this.add(f)}dispose(){let t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(let e of t)e.dispose()}};function hs(i){return new Ks({color:0,emissive:16777215,emissiveIntensity:i})}var xr=Object.freeze({C:{key:"C",name:"Common",rank:0,base:4,color:"#b9b2a2"},U:{key:"U",name:"Uncommon",rank:1,base:12,color:"#7fc7a0"},R:{key:"R",name:"Rare",rank:2,base:55,color:"#6fa8ff"},L:{key:"L",name:"Legendary",rank:3,base:240,color:"#f3c75d"},M:{key:"M",name:"Mythic",rank:4,base:1e3,color:"#ff6f91"}}),Mu=Object.freeze({hero:"Hero",beast:"Beast",realm:"Realm",relic:"Relic",spell:"Spell"}),Su=Object.freeze({sylvan:{key:"sylvan",name:"Sylvan Courts",short:"Sylvan",home:"Aelwood"},deephold:{key:"deephold",name:"Deephold",short:"Deephold",home:"the Kharuun Deeps"},westmarch:{key:"westmarch",name:"Westmarch",short:"Westmarch",home:"the Marches"},horde:{key:"horde",name:"Ashen Horde",short:"Horde",home:"the Ashlands"},conclave:{key:"conclave",name:"Starward Conclave",short:"Conclave",home:"the Spires"},hearth:{key:"hearth",name:"Hearthfolk",short:"Hearthfolk",home:"Bramblebury"},wilds:{key:"wilds",name:"Unbound",short:"Unbound",home:"the Wide World"}}),qg={sylvan:[["C","hero:elf:bow","Glade Sentry"],["C","hero:elf:dagger","Leafwhisper Scout"],["C","hero:elf:bow","Moonbow Archer"],["C","hero:elf:staff","Thornveil Warden"],["C","beast:stag","Silverwood Stag"],["C","beast:owl","Hollow Oak Owl"],["C","realm:tree","Mistfen Hollow"],["C","spell:nature","Blessing of Dew"],["C","relic:amulet","Elderleaf Brooch"],["C","realm:lake","Starlit Mere"],["U","hero:elf:staff","Aelindra, Leafsinger"],["U","hero:elf:sword","Ithilor, Bladedancer"],["U","beast:treant","Thornback Treant"],["U","realm:bridge","Wardens' Crossing"],["U","relic:bow","Bow of Falling Stars"],["U","spell:frost","Veil of Mists"],["R","hero:elf:bow","Lady Nyrael, Moon Warden","The moon has one keeper. She has never missed."],["R","realm:tree","The Eventide Tree","Its leaves hold the light of every sunset since the world was young."],["R","spell:light","Song of the First Spring","Sung once each thousand years, and the frost forgets its way."],["L","hero:elf:staff","Queen Elaswen of Aelwood",'"We do not rule the forest. We remember it, so that it may remember us."']],deephold:[["C","hero:dwarf:hammer","Deepdelver Miner"],["C","hero:dwarf:shield","Ironhold Shieldbearer"],["C","hero:dwarf:axe","Ale-Hall Brawler"],["C","hero:dwarf:lantern","Tunnel Lamplighter"],["C","beast:ram","Mountain Ram"],["C","beast:golem","Stone Sentinel"],["C","realm:peak","Grey Peak Pass"],["C","spell:earth","Hammerfall"],["C","relic:chalice","Runed Tankard"],["C","realm:hall","The Lantern Deep"],["U","hero:dwarf:axe","Brannoc Stonebeard"],["U","hero:dwarf:hammer","Thrana, Runesmith"],["U","realm:forge","The Cinderforge"],["U","beast:golem","Oathstone Golem"],["U","spell:rune","Rune of Warding"],["U","relic:horn","Ancestor's Warhorn"],["R","hero:dwarf:axe","Thane Durgrim the Unbowed","Seven sieges. Seven victories. One very dented helmet."],["R","realm:gate","Gates of Kharuun","Carved from a single stone, and opened only twice in recorded memory."],["R","relic:gem","Heartstone of the Deep","Miners say it beats, slow as a mountain, once every hundred years."],["L","hero:dwarf:hammer","High King Ostmund Ironcrown",'"Gold is soft. Iron is honest. Stone is forever. Choose your friends likewise."']],westmarch:[["C","hero:human:spear","Westmarch Pikeman"],["C","hero:human:sword","Road Warden"],["C","hero:human:bow","Marsh Ranger"],["C","hero:human:lantern","Hedge Witch"],["C","beast:horse","Marcher Destrier"],["C","beast:eagle","Hawk of the Marches"],["C","realm:tower","Tollgate Keep"],["C","realm:village","Millbrook Village"],["C","spell:light","Rallying Cry"],["C","relic:shield","Squire's Shield"],["U","hero:human:sword","Sir Cedric of the Dawn"],["U","hero:human:spear","Rowena, Captain of the Wall"],["U","realm:tower","Watchtower of Edrin"],["U","beast:griffin","Royal Griffin"],["U","relic:sword","Oathkeeper Blade"],["U","spell:light","Shieldwall"],["R","hero:human:sword","Lord Commander Aldric Vane","He has buried more friends than most men have met. He still stands the first watch."],["R","realm:citadel","The Sunken Citadel","When the tide is low, its bells still ring for a king who never came home."],["R","relic:crown","Crown of the Marches","Light as a promise. Heavy as one, too."],["L","hero:human:sword","Isolde, the Last Queen",'"Let them call it a lost cause. I have won every one I ever fought."']],horde:[["C","hero:orc:axe","Horde Raider"],["C","hero:goblin:dagger","Goblin Skulker"],["C","hero:goblin:spear","Bonepicker"],["C","hero:orc:hammer","Ashland Brute"],["C","beast:wolf","Ash Warg"],["C","beast:crow","Carrion Crow"],["C","realm:camp","The Burning Fields"],["C","spell:fire","Smoke and Cinders"],["C","relic:staff","Iron Skull Totem"],["C","realm:peak","Cinderjaw Rocks"],["U","hero:orc:staff","Skarn Bonecaller"],["U","hero:orc:axe","Grokk the Pitfighter"],["U","beast:troll","Hill Troll"],["U","realm:camp","Warcamp of the Red Hand"],["U","spell:shadow","Cursed Ember"],["U","relic:axe","Warchief's Cleaver"],["R","hero:orc:spear","Vraska, Warg Mother","Her pack is two hundred strong, and every one of them would die for her. Most already have."],["R","beast:wyvern","Ashmaw Wyvern","It does not hunt. It simply flies over, and later it comes back to eat."],["R","realm:gate","The Burning Gate","No one built it. It was simply there one morning, and it was already on fire."],["L","hero:orc:axe","Mogrot, Warlord of Ash",'"The world is a cold, grey thing. I mean to warm it."']],conclave:[["C","hero:mage:staff","Conclave Initiate"],["C","hero:mage:tome","Star Reader"],["C","hero:mage:staff","Ember Adept"],["C","beast:wisp","Wandering Wisp"],["C","realm:tower","Hall of Lenses"],["C","spell:storm","Arcane Bolt"],["C","spell:light","Spark of Insight"],["C","relic:tome","Apprentice's Tome"],["C","relic:gem","Crystal Focus"],["C","realm:citadel","The Floating Library"],["U","hero:mage:staff","Meridan the Stormcaller"],["U","hero:mage:tome","Selvara of the Ninth Seal"],["U","beast:elemental","Storm Elemental"],["U","realm:lake","The Starwell"],["U","spell:frost","Chains of Frost"],["U","relic:gem","Orb of Far Seeing"],["R","hero:mage:staff","Archmage Ozric Venn","He has read every book in the Conclave, including several that have not been written yet."],["R","realm:tower","The Sky Observatory","From its roof you can count every star. It takes four hundred years."],["R","relic:tome","Tome of Unwritten Names","Each page holds a name that will one day be famous. Some are yours."],["L","hero:mage:staff","Thalassar, the Star-Eyed",'"I have seen how this ends. Do not worry. You are wonderful in it."']],hearth:[["C","hero:halfling:none","Burrow Lookout"],["C","hero:halfling:pipe","Pipeleaf Farmer"],["C","hero:halfling:dagger","Pantry Thief"],["C","hero:halfling:lantern","Lantern Carrier"],["C","beast:badger","Hedge Badger"],["C","beast:horse","Stout Pony"],["C","realm:village","Bramblebury Hollow"],["C","spell:nature","Second Breakfast"],["C","relic:amulet","Lucky Acorn"],["C","realm:lake","Old Mill Pond"],["U","hero:halfling:dagger","Tamsin Thistlewick"],["U","hero:halfling:pipe","Old Barnaby, Storyteller"],["U","realm:village","The Round Door Inn"],["U","relic:chalice","Kettle of Plenty"],["U","spell:nature","Hidden Paths"],["U","realm:bridge","Brandle Ford"],["R","hero:halfling:lantern","Rosalind Fairbarrow, Mapkeeper","She has mapped every road in the realm, and three that lead somewhere else."],["R","relic:tome","The Map of Elsewhere","Fold it right and you are already there. Fold it wrong and you are already late."],["R","spell:light","Feast of Lanterns","One night a year, every window in Bramblebury is left open for whoever is lost."],["L","hero:halfling:sword","Wendel Greenhill, the Unlikely",'"I only went out for mushrooms. Then there was a dragon, and, well. You know how it is."']],wilds:[["R","hero:human:lantern","The Wandering Merchant","Everything has a price. Fortunately, she accepts stories."],["R","realm:village","The Crossroads Inn","Every road in the realm passes its door eventually. So does every rumour."],["L","beast:wolf","Frostfang, the White Wolf","When winter walks the high passes, it walks on four legs."],["L","beast:phoenix","Emberwing Phoenix","It has died nine hundred times. It has never once been late."],["L","realm:citadel","The Drowned Throne","The king who sat here bargained with the sea. The sea has a long memory."],["L","relic:gem","Eye of the Long Night","Look into it and it looks back, and it remembers your face."],["M","beast:dragon","Valdrak, the World-Ender","The old songs call him a story told to frighten children. The children were right."],["M","relic:crown","The Sundered Crown","Broken in two at the end of the First Age. Whoever joins it again will rule all that the sky touches."],["M","hero:mage:staff","Aurelion, First of Stars","Before the sun, there was a light. Before the light, there was him."],["M","beast:treant","Sylvaris, Heart of the Wood","The oldest tree in the world is not a tree at all. It is simply very patient."]]},Zg={sylvan:["In Aelwood, even the silence has a song.","The elves count time in rings, not years.","Step lightly. The forest is listening.","Moonlight is a road, if you know how to walk it.","An arrow, a whisper, and then nothing at all.","The oldest trees remember your grandmother\u2019s grandmother."],deephold:["Deeper. Always deeper. That is where the good stone sleeps.","A dwarf\u2019s word is carved, never spoken.","The mountain does not forgive. It does, however, provide.","Every hall in Kharuun has a hearth, and every hearth has a song.","Measure twice. Strike once. Then strike again, to be sure.","Under the mountain, the lamps never go out."],westmarch:["For the Marches, and for the morning.","The road is long, but the inns are good.","Hold the line. The dawn always comes.","In Westmarch, every farmer keeps a sword above the door.","Kings come and go. The wall remains.","A banner is only cloth until someone carries it."],horde:["The Horde does not march. It spreads.","Ash on the wind means the drums are near.","Strength is the only law the Ashlands keep.","They do not burn the fields. They simply forget to stop.","Count the fires on the hills. Then run.","Every goblin is a coward. Ten goblins are an army."],conclave:["Knowledge is a lantern. Some rooms should stay dark.","The stars are not far. They are simply patient.","Read carefully. Some books read you back.","In the Spires, every question costs a little starlight.","Power is easy. Precision is the art.","The Conclave keeps nine seals. Do not ask about the tenth."],hearth:["No adventure was ever improved by skipping lunch.","The best maps in Bramblebury are drawn on napkins.","Small feet. Big hearts. Bigger pantries.","A warm kettle has ended more wars than any sword.","Nothing ever happens in Bramblebury, and everyone likes it that way.","Always pack a spare handkerchief. And a spare pie."]},Yg=Object.freeze({code:"SC",name:"The Sundered Crown",number:1,size:130});function Jg(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function Kg(){let i=[],t=0;for(let[e,n]of Object.entries(qg))for(let[s,a,r,o]of n){t++;let[l]=a.split(":"),c=Jg(r),h=xr[s].rank,u=Math.min(9,1+c%3+h+(l==="realm"?1:0)),d=l==="hero"||l==="beast"?Math.min(15,1+h*2+(c>>>3)%4+(l==="beast"?1:0)):null,f=Zg[e];i.push(Object.freeze({id:`${Yg.code}-${String(t).padStart(3,"0")}`,num:t,name:r,faction:e,rarity:s,kind:l,subject:a,cost:u,might:d,flavor:o||(f?f[c%f.length]:""),pop:.65+(c>>>7)%1e3/1e3*1.1}))}return Object.freeze(i)}var ic=Kg(),N1=Object.freeze(Object.fromEntries(ic.map(i=>[i.id,i])));var ye=200,Ue=150;function Qg(i){let t=2166136261;for(let e=0;e<i.length;e++)t^=i.charCodeAt(e),t=Math.imul(t,16777619);return t>>>0}function jg(i){return()=>{i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296}}var C=i=>Math.round(i*10)/10;function bu(i){let t=parseInt(i.slice(1),16);return[t>>16&255,t>>8&255,t&255]}function t_([i,t,e]){return"#"+[i,t,e].map(n=>Math.max(0,Math.min(255,Math.round(n))).toString(16).padStart(2,"0")).join("")}function xe(i,t,e){let n=bu(i),s=bu(t);return t_(n.map((a,r)=>a+(s[r]-a)*e))}var Xt=(i,t)=>xe(i,"#000000",t),Te=(i,t)=>xe(i,"#ffffff",t),e_={dawn:{top:"#26345f",bot:"#f0a27a",sun:"#ffd9a0",night:!1},day:{top:"#3d78b8",bot:"#cfe3df",sun:"#fff6d8",night:!1},dusk:{top:"#2a1c46",bot:"#e06e4e",sun:"#ffb070",night:!1},night:{top:"#060b1e",bot:"#24395e",sun:"#e8eeff",night:!0}},n_={sylvan:{tint:"#3f9a72",accent:"#b8f5d2",metal:"#d9e6e8",times:["night","dawn","day","night"],particles:"fireflies"},deephold:{tint:"#b07a3c",accent:"#ffcf7a",metal:"#c99a52",times:["dusk","dawn","dusk","night"],particles:"embers"},westmarch:{tint:"#4f7fc2",accent:"#ffe7a3",metal:"#dfe4ec",times:["day","dawn","day","dusk"],particles:"motes"},horde:{tint:"#b8402c",accent:"#ff8a4a",metal:"#7d746e",times:["dusk","night","dusk","dusk"],particles:"embers"},conclave:{tint:"#7a4fc2",accent:"#9ff0ff",metal:"#cdb8ff",times:["night","night","dusk","night"],particles:"stars"},hearth:{tint:"#c79a45",accent:"#ffe08a",metal:"#d8a85a",times:["day","dusk","day","dawn"],particles:"fireflies"},wilds:{tint:"#5d8796",accent:"#ffffff",metal:"#e6e9ee",times:["night","dusk","dawn","night"],particles:"motes"}},wu={fire:["#ff7a2f","#ffd27a"],frost:["#6fd8ff","#e8fbff"],light:["#ffd76a","#fffbe6"],shadow:["#8a4dff","#e0c8ff"],nature:["#6ed27a","#e2ffd8"],storm:["#5aa6ff","#e6f2ff"],rune:["#ffb347","#fff0c8"],earth:["#c98a4a","#ffe2b0"]};function i_(i,t=!1){let e=`M${C(i[0][0])},${C(i[0][1])}`;for(let n=0;n<i.length-1;n++){let s=i[n-1]||i[n],a=i[n],r=i[n+1],o=i[n+2]||r,l=[a[0]+(r[0]-s[0])/6,a[1]+(r[1]-s[1])/6],c=[r[0]-(o[0]-a[0])/6,r[1]-(o[1]-a[1])/6];e+=`C${C(l[0])},${C(l[1])} ${C(c[0])},${C(c[1])} ${C(r[0])},${C(r[1])}`}return t?e+"Z":e}function Ao(i,t,e,n,s){let a=[],r=t+(i()-.5)*e;for(let o=-10;o<=ye+10;o+=n)r+=(i()-.5)*e*s,r=t+(r-t)*.75+(i()-.5)*e*.5,a.push([o,r]);return a}var Co=(i,t)=>(t?"M"+i.map(e=>`${C(e[0])},${C(e[1])}`).join(" L"):i_(i))+` L${ye+10},${Ue+2} L-10,${Ue+2} Z`;function s_(i,t,e,n,s){let a="";for(let r=0;r<3;r++){let o=t-e*(.35+r*.3),l=t-e*(r*.25),c=n*(1-r*.22);a+=`M${C(i)},${C(o-e*.12)} L${C(i+c/2)},${C(l)} L${C(i-c/2)},${C(l)} Z `}return`<path d="${a}" fill="${s}"/>`}function sc(i,t,e,n,s){return`<rect x="${C(i-n*.12)}" y="${C(t-e)}" width="${C(n*.24)}" height="${C(e)}" fill="${s}"/><ellipse cx="${C(i)}" cy="${C(t-e)}" rx="${C(n)}" ry="${C(n*1.25)}" fill="${s}"/>`}function rc(i,t,e=.9){return`<radialGradient id="${i}"><stop offset="0" stop-color="${t}" stop-opacity="${e}"/><stop offset=".35" stop-color="${t}" stop-opacity="${e*.35}"/><stop offset="1" stop-color="${t}" stop-opacity="0"/></radialGradient>`}function r_(i){let t=jg(Qg(i.id+i.name)),e=n_[i.faction],n=xr[i.rarity].rank,[s,a,r]=i.subject.split(":"),o=i.id.replace(/[^a-z0-9]/gi,""),l=S=>`${o}${S}`,c=e.times[Math.floor(t()*e.times.length)];s==="spell"&&(c=t()<.6?"night":c),(r==="lantern"||a==="lantern")&&(c="night");let h=e_[c],u=xe(h.top,e.tint,.18),d=xe(h.bot,e.tint,.22),f=xe(d,u,.25),_=xe(Xt(xe(d,e.tint,.4),.35),d,.35),x=Xt(xe(d,e.tint,.5),.62),p=Xt(xe(u,e.tint,.4),.8),m=Xt(xe(u,e.tint,.35),.72),M=25+t()*150,w=18+t()*30,b=M<100,A=s==="spell"?wu[a][0]:e.accent,E=[],g=[];if(E.push(`<linearGradient id="${l("sky")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${u}"/><stop offset="1" stop-color="${d}"/></linearGradient>`),E.push(rc(l("sun"),h.sun,.95)),E.push(rc(l("acc"),A,1)),E.push(rc(l("dot"),Te(A,.3),1)),E.push(`<linearGradient id="${l("fig")}" x1="${b?0:1}" y1="0" x2="${b?1:0}" y2="0"><stop offset="0" stop-color="${Te(xe(m,h.sun,.25),.08)}"/><stop offset=".55" stop-color="${m}"/><stop offset="1" stop-color="${Xt(m,.45)}"/></linearGradient>`),E.push(`<linearGradient id="${l("metal")}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${Te(e.metal,.55)}"/><stop offset=".45" stop-color="${e.metal}"/><stop offset=".55" stop-color="${Xt(e.metal,.35)}"/><stop offset="1" stop-color="${Te(e.metal,.2)}"/></linearGradient>`),E.push(`<radialGradient id="${l("vig")}" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>`),E.push(`<linearGradient id="${l("mist")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${f}" stop-opacity="0"/><stop offset=".5" stop-color="${f}" stop-opacity=".5"/><stop offset="1" stop-color="${f}" stop-opacity="0"/></linearGradient>`),g.push(`<rect width="${ye}" height="${Ue}" fill="url(#${l("sky")})"/>`),h.night||s==="spell"){let S="";for(let O=0;O<40+n*15;O++)S+=`<circle cx="${C(t()*ye)}" cy="${C(t()*Ue*.6)}" r="${C(.2+t()*.7)}" opacity="${C(.3+t()*.7)}"/>`;g.push(`<g fill="#fff">${S}</g>`)}if(s!=="spell"&&s!=="relic"&&(g.push(`<circle cx="${C(M)}" cy="${C(w)}" r="${h.night?34:48}" fill="url(#${l("sun")})"/>`),h.night?g.push(`<circle cx="${C(M)}" cy="${C(w)}" r="7" fill="${h.sun}"/><circle cx="${C(M+3)}" cy="${C(w-2)}" r="6" fill="${xe(u,d,.25)}"/>`):g.push(`<circle cx="${C(M)}" cy="${C(w)}" r="${c==="day"?7:9}" fill="${h.sun}" opacity=".95"/>`),!h.night||t()<.4)){let S="";for(let O=0;O<2+Math.floor(t()*3);O++){let I=t()*ye,U=10+t()*50,k=30+t()*50;S+=`<ellipse cx="${C(I)}" cy="${C(U)}" rx="${C(k)}" ry="${C(2+t()*3)}"/>`}g.push(`<g fill="${Te(d,.25)}" opacity="${h.night?.12:.35}">${S}</g>`)}if(s==="relic"||s==="spell")g.push(`<rect width="${ye}" height="${Ue}" fill="${Xt(u,.35)}" opacity=".55"/>`),g.push(`<circle cx="100" cy="72" r="${80+n*8}" fill="url(#${l("acc")})" opacity="${.45+n*.08}"/>`),g.push(a_(t,A,n,100,72)),s==="relic"?(g.push(`<path d="${Co(Ao(t,128,10,18,.6))}" fill="${p}" opacity=".9"/>`),g.push(p_(x,A)),g.push(m_(a,t,l,A,e,n))):g.push(g_(a,t,l,n));else{let S=i.faction==="deephold"||i.faction==="horde";g.push(`<path d="${Co(Ao(t,78+t()*10,22,S?9:16,S?1.6:.8),S)}" fill="${_}"/>`),g.push(`<rect y="70" width="${ye}" height="40" fill="url(#${l("mist")})"/>`),g.push(`<path d="${Co(Ao(t,98+t()*6,16,S?11:20,S?1.3:.7),S)}" fill="${xe(_,x,.55)}"/>`),g.push(l_(i.faction,t,x,p,A,s==="realm"?.6:1)),s==="realm"?g.push(f_(a,t,l,{landMid:x,landNear:p,accent:A,fac:e,skyBot:d,skyTop:u,rank:n,t:h})):(g.push(`<path d="${Co(Ao(t,128,8,25,.6))}" fill="${p}"/>`),s==="hero"&&g.push(h_(a,r,t,l,{figure:m,accent:A,fac:e,rank:n,card:i})),s==="beast"&&g.push(d_(a,t,l,{figure:m,accent:A,fac:e,rank:n,landNear:p,card:i})))}return g.push(o_(t,s==="spell"?"stars":e.particles,l,n)),g.push(`<rect width="${ye}" height="${Ue}" fill="url(#${l("vig")})"/>`),`<svg viewBox="0 0 ${ye} ${Ue}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" aria-hidden="true"><defs>${E.join("")}</defs>${g.join("")}</svg>`}function a_(i,t,e,n,s){let a=8+e*4,r="";for(let o=0;o<a;o++){let l=o/a*Math.PI*2+i()*.2,c=.04+i()*.06,h=140;r+=`M${n},${s} L${C(n+Math.cos(l-c)*h)},${C(s+Math.sin(l-c)*h)} L${C(n+Math.cos(l+c)*h)},${C(s+Math.sin(l+c)*h)} Z`}return`<path d="${r}" fill="${t}" opacity="${.06+e*.025}"/>`}function o_(i,t,e,n){let s=8+n*7,a="";for(let r=0;r<s;r++){let o=i()*ye,l=t==="embers"?40+i()*110:i()*Ue,c=t==="stars"?.6+i()*1.6:.8+i()*2.2;a+=`<circle cx="${C(o)}" cy="${C(l)}" r="${C(c*2.2)}" fill="url(#${e("dot")})" opacity="${C(.4+i()*.6)}"/>`}return`<g>${a}</g>`}function l_(i,t,e,n,s,a){let r="",o=112+t()*6;if(i==="sylvan"||i==="wilds")for(let l=0;l<14*a;l++){let c=t()*ye,h=30+t()*45;r+=t()<.55?s_(c,o+t()*8,h,12+t()*8,e):sc(c,o+t()*8,h*.8,7+t()*6,e)}else if(i==="deephold")for(let l=0;l<3;l++){let c=20+t()*160,h=40+t()*40,u=30+t()*30;r+=`<path d="M${C(c-u)},${o+10} L${C(c-u*.2)},${C(o-h)} L${C(c+u*.1)},${C(o-h+6)} L${C(c+u)},${o+10} Z" fill="${e}"/>`,t()<.6&&(r+=`<rect x="${C(c-3)}" y="${C(o-h*.35)}" width="6" height="8" rx="3" fill="${s}" opacity=".85"/>`)}else if(i==="westmarch"){let l=20+t()*160;r+=`<path d="M${C(l-40)},${o} L${C(l-40)},${o-14} L${C(l+40)},${o-14} L${C(l+40)},${o} Z" fill="${e}"/>`;for(let c=0;c<4;c++){let h=l-40+c*26.6,u=22+t()*18;r+=`<rect x="${C(h-4)}" y="${C(o-u)}" width="8" height="${C(u)}" fill="${e}"/><path d="M${C(h-6)},${C(o-u)} L${C(h)},${C(o-u-9)} L${C(h+6)},${C(o-u)} Z" fill="${e}"/>`,t()<.5&&(r+=`<rect x="${C(h-1)}" y="${C(o-u+5)}" width="2" height="3" fill="${s}" opacity=".8"/>`)}for(let c=0;c<6*a;c++)r+=sc(t()*ye,o+6,10+t()*10,5+t()*4,e)}else if(i==="horde"){for(let l=0;l<9;l++){let c=t()*ye,h=14+t()*34,u=4+t()*8;r+=`<path d="M${C(c-u)},${o+10} L${C(c+(t()-.5)*8)},${C(o-h)} L${C(c+u)},${o+10} Z" fill="${e}"/>`}for(let l=0;l<2;l++){let c=t()*ye;r+=`<path d="M${C(c)},${o} C${C(c-10)},${o-30} ${C(c+15)},${o-50} ${C(c+5)},${o-90}" stroke="${e}" stroke-width="${C(8+t()*6)}" fill="none" opacity=".35" stroke-linecap="round"/>`}}else if(i==="conclave"){for(let c=0;c<4;c++){let h=t()*ye,u=40+t()*50,d=8+t()*14;r+=`<path d="M${C(h-d)},${C(u)} L${C(h+d)},${C(u)} L${C(h+d*.3)},${C(u+d*1.2)} L${C(h-d*.4)},${C(u+d)} Z" fill="${e}"/>`,r+=`<path d="M${C(h-2)},${C(u)} L${C(h)},${C(u-d)} L${C(h+2)},${C(u)} Z" fill="${s}" opacity=".8"/>`}let l=20+t()*160;r+=`<path d="M${C(l-6)},${o} L${C(l-3)},${o-60} L${C(l)},${o-72} L${C(l+3)},${o-60} L${C(l+6)},${o} Z" fill="${e}"/><circle cx="${C(l)}" cy="${o-62}" r="2" fill="${s}"/>`}else if(i==="hearth"){for(let l=0;l<4;l++){let c=t()*ye,h=30+t()*30;r+=`<ellipse cx="${C(c)}" cy="${o+8}" rx="${C(h)}" ry="${C(h*.45)}" fill="${e}"/>`,t()<.7&&(r+=`<circle cx="${C(c+(t()-.5)*h*.6)}" cy="${C(o-h*.1)}" r="3.4" fill="${s}" opacity=".85"/>`)}for(let l=0;l<5*a;l++)r+=sc(t()*ye,o-2,8+t()*10,5+t()*5,e)}return r}var c_={elf:{hy:76,rx:12.5,ry:17,sw:50,sy:112},dwarf:{hy:88,rx:15,ry:15,sw:64,sy:116},human:{hy:78,rx:13.5,ry:16.5,sw:56,sy:112},orc:{hy:80,rx:17,ry:17,sw:70,sy:112},goblin:{hy:92,rx:13,ry:12,sw:44,sy:122},mage:{hy:78,rx:13.5,ry:16.5,sw:54,sy:112},halfling:{hy:92,rx:14,ry:14,sw:46,sy:124}};function h_(i,t,e,n,s){let a=c_[i],{hy:r,rx:o,ry:l,sw:c,sy:h}=a,u=`url(#${n("fig")})`,d=`stroke="${s.accent}" stroke-opacity=".45" stroke-width=".8"`,f=Xt(s.fac.tint,.45),_=e()<.5,x=[],p=[],m=[],M={elf:["#eadbc6","#d9c1a4","#c9b8d8"],human:["#e3bb96","#c58c62","#8d5a3b","#f0cfb0"],halfling:["#e8b98e","#b9784e","#f1caa4"],dwarf:["#dca47e","#b97a56"],orc:["#6f8a4a","#7d7458","#5a7a52"],goblin:["#86a64a","#9a9a44"],mage:["#d9b49a"]}[i],w=M[Math.floor(e()*M.length)],b=s.card.subject.includes("lantern")?s.accent:"#fff3dc",A=`url(#${n("skin")})`,E=`<defs><linearGradient id="${n("skin")}" x1="${_?1:0}" y1="0" x2="${_?0:1}" y2="0"><stop offset="0" stop-color="${xe(w,b,.15)}"/><stop offset=".6" stop-color="${xe(w,s.figure,.35)}"/><stop offset="1" stop-color="${xe(w,s.figure,.7)}"/></linearGradient></defs>`,g=[s.fac.tint,s.fac.metal,xe(s.fac.tint,"#7a2020",.5),xe(s.fac.tint,"#20304a",.6),"#5a4a3a"],S=Xt(g[Math.floor(e()*g.length)],.35),O=["sword","spear","shield","hammer","axe"].includes(t)&&i!=="halfling"&&i!=="goblin",I=C((e()-.5)*36),U=C(.92+e()*.14);s.rank>=2&&x.push(`<path d="M${100-c*.7},${h-8} C${100-c*1.3},${h+10} ${100-c*1.5},${Ue} ${100-c*1.6},${Ue} L${100+c*1.6},${Ue} C${100+c*1.5},${Ue} ${100+c*1.3},${h+10} ${100+c*.7},${h-8} Z" fill="${f}" ${d}/>`);let k=u_(t,e,n,s,a);x.push(k.back);let V=Xt(["#efe6c4","#d9b26a","#b8b8c8","#2a2018","#8a4a2a"][Math.floor(e()*5)],.3);i==="elf"&&x.push(`<path d="M${100-o-1},${r-6} Q${100-o-9},${r+26} ${100-o-16},${h+10} L${100+o+16},${h+10} Q${100+o+9},${r+26} ${100+o+1},${r-6} Z" fill="${V}"/>`);let L=i==="dwarf"||i==="orc"?9:6;p.push(`<rect x="${100-L}" y="${r+l*.5}" width="${L*2}" height="${h-r-l*.5}" fill="${u}"/>`),p.push(`<path d="M${100-c},${Ue+2} C${100-c},${h-4} ${100-c*.75},${h-12} ${100-L-4},${h-14} L${100+L+4},${h-14} C${100+c*.75},${h-12} ${100+c},${h-4} ${100+c},${Ue+2} Z" fill="${u}" ${d}/>`),p.push(`<path d="M${100-c*.88},${Ue+2} C${100-c*.82},${h} ${100-c*.5},${h-10} ${100-L-2},${h-13} L100,${h+14} L${100+L+2},${h-13} C${100+c*.5},${h-10} ${100+c*.82},${h} ${100+c*.88},${Ue+2} Z" fill="${S}" opacity=".7"/>`),p.push(`<path d="M${100-L-2},${h-13} L100,${h+14} L${100+L+2},${h-13}" fill="none" stroke="${s.accent}" stroke-opacity=".45" stroke-width="1"/>`),O&&p.push(`<path d="M${100-c},${h+10} C${100-c},${h-8} ${100-c*.6},${h-14} ${100-c*.35},${h-12} C${100-c*.4},${h} ${100-c*.6},${h+8} ${100-c},${h+10} Z M${100+c},${h+10} C${100+c},${h-8} ${100+c*.6},${h-14} ${100+c*.35},${h-12} C${100+c*.4},${h} ${100+c*.6},${h+8} ${100+c},${h+10} Z" fill="url(#${n("metal")})" opacity=".75"/>`),s.rank>=1&&p.push(`<circle cx="100" cy="${h+12}" r="${2+s.rank}" fill="${s.accent}" opacity=".75"/><circle cx="100" cy="${h+12}" r="${8+s.rank*3}" fill="url(#${n("acc")})" opacity=".5"/>`);let F=[];i==="elf"&&F.push(`<path d="M${100-o+2},${r-1} L${100-o-11},${r-13} L${100-o+1},${r+6} Z M${100+o-2},${r-1} L${100+o+11},${r-13} L${100+o-1},${r+6} Z" fill="${A}" ${d}/>`),i==="orc"&&F.push(`<path d="M${100-o+2},${r-2} L${100-o-8},${r-6} L${100-o+2},${r+5} Z M${100+o-2},${r-2} L${100+o+8},${r-6} L${100+o-2},${r+5} Z" fill="${A}"/>`),i==="goblin"&&F.push(`<path d="M${100-o+2},${r-2} L${100-o-24},${r-12} L${100-o+1},${r+5} Z M${100+o-2},${r-2} L${100+o+24},${r-12} L${100+o-1},${r+5} Z" fill="${A}" ${d}/>`);let X=i==="orc"?1.15:i==="elf"?.82:.95;F.push(`<path d="M${100-o},${r-2} C${100-o},${r-l*1.25} ${100+o},${r-l*1.25} ${100+o},${r-2} C${100+o},${r+l*.55} ${100+o*X*.5},${r+l} 100,${r+l} C${100-o*X*.5},${r+l} ${100-o},${r+l*.55} ${100-o},${r-2} Z" fill="${i==="mage"?u:A}" ${d}/>`);let H=`<circle cx="${100-o*.4}" cy="${r+1}" r="1.1" fill="#1a120c"/><circle cx="${100+o*.4}" cy="${r+1}" r="1.1" fill="#1a120c"/><path d="M${100-o*.62},${r-2.6} l${C(o*.4)},-.6 M${100+o*.62},${r-2.6} l-${C(o*.4)},-.6" stroke="#1a120c" stroke-opacity=".6" stroke-width=".7"/><path d="M${100-2.6},${r+l*.62} q2.6,1.2 5.2,0" stroke="#3a1a14" stroke-opacity=".5" stroke-width=".7" fill="none"/>`,rt=(tt,it=1.3,wt=0)=>`<circle cx="${100-o*.4}" cy="${r+wt}" r="${it}" fill="${tt}"/><circle cx="${100+o*.4}" cy="${r+wt}" r="${it}" fill="${tt}"/>`;if(i==="elf"&&(F.push(H),F.push(`<path d="M${100-o-1.5},${r+12} Q${100-o-3},${r-l*1.35} 100,${r-l*1.18} Q${100+o+3},${r-l*1.35} ${100+o+1.5},${r+12} L${100+o-1.5},${r-3} Q104,${r-l*.8} 100,${r-l*.95} Q96,${r-l*.8} ${100-o+1.5},${r-3} Z" fill="${V}"/>`)),i==="elf"&&s.rank>=1&&(F.push(`<path d="M${100-o},${r-7} Q100,${r-12} ${100+o},${r-7}" stroke="url(#${n("metal")})" stroke-width="1.6" fill="none"/><circle cx="100" cy="${r-10}" r="1.8" fill="${s.accent}"/>`),s.rank>=3&&F.push(yr(100,r-12,o*1.1,n))),i==="dwarf"){let tt=["#7a4a26","#a8452a","#9a9aa0","#e8e4da","#3a2a1e"][Math.floor(e()*5)];F.push(`<path d="M${100-o-1},${r} Q${100-o-6},${r+26} 100,${h+18} Q${100+o+6},${r+26} ${100+o+1},${r} Q100,${r+9} ${100-o-1},${r} Z" fill="${Xt(tt,.35)}" stroke="${Te(tt,.2)}" stroke-opacity=".5" stroke-width=".8"/>`),F.push(`<path d="M96,${r+12} L100,${h+14} M104,${r+12} L101,${h+12}" stroke="${Te(tt,.15)}" stroke-opacity=".35" stroke-width="1"/>`),s.rank>=3?F.push(yr(100,r-10,o*1.15,n)):(F.push(`<path d="M${100-o-2},${r-3} Q100,${r-l*1.9} ${100+o+2},${r-3} Z" fill="url(#${n("metal")})" opacity=".9"/>`),e()<.6&&F.push(`<path d="M${100-o},${r-7} Q${100-o-14},${r-10} ${100-o-12},${r-26} Q${100-o-5},${r-13} ${100-o+4},${r-11} Z M${100+o},${r-7} Q${100+o+14},${r-10} ${100+o+12},${r-26} Q${100+o+5},${r-13} ${100+o-4},${r-11} Z" fill="#e9dcc0"/>`)),F.push(`<circle cx="${100-o*.4}" cy="${r+1}" r="1.1" fill="#1a120c"/><circle cx="${100+o*.4}" cy="${r+1}" r="1.1" fill="#1a120c"/><path d="M${100-o*.7},${r-3} L98,${r-1.5} M${100+o*.7},${r-3} L102,${r-1.5}" stroke="${Xt(w,.5)}" stroke-width="1.6"/>`)}if(i==="human"&&(t==="sword"||t==="spear"||t==="shield"?s.rank>=3?(F.push(`<path d="M${100-o-1},${r-4} C${100-o-2},${r-l*1.4} ${100+o+2},${r-l*1.4} ${100+o+1},${r-4} L${100+o+2},${r+14} L104,${r+4} L96,${r+4} L${100-o-2},${r+14} Z" fill="${Xt(s.fac.metal,.5)}"/>`),F.push(yr(100,r-12,o*1.05,n))):(F.push(`<path d="M${100-o-2},${r+l*.7} L${100-o-2},${r-4} C${100-o-2},${r-l*1.45} ${100+o+2},${r-l*1.45} ${100+o+2},${r-4} L${100+o+2},${r+l*.7} Z" fill="url(#${n("metal")})" opacity=".85"/>`),F.push(`<rect x="${100-o+1}" y="${r-2}" width="${o*2-2}" height="2.2" fill="#000" opacity=".85"/><rect x="${100-o+3}" y="${r-1.6}" width="${o*2-6}" height="1" fill="${s.accent}" opacity=".7"/>`),s.rank>=1&&F.push(`<path d="M100,${r-l*1.1} C106,${r-l*1.9} 122,${r-l*1.6} 128,${r-l*.4} C118,${r-l*1.1} 108,${r-l*1.2} 100,${r-l*1.1} Z" fill="${s.fac.tint}"/>`)):t==="lantern"?(F.push(H),F.push(`<path d="M${100-o-1},${r+10} Q${100-o-3},${r-8} 100,${r-9} Q${100+o+3},${r-8} ${100+o+1},${r+10} L${100+o-2},${r-2} Q100,${r-6} ${100-o+2},${r-2} Z" fill="${Xt("#5a3a2a",.3)}"/>`),F.push(`<path d="M${100-o-14},${r-5} L${100+o+14},${r-5} L${100+o},${r-9} L106,${r-l*2.6} L${100-o},${r-9} Z" fill="${u}" ${d}/>`)):(F.push(H),F.push(`<path d="M${100-o-5},${r+l} Q${100-o-6},${r-l*1.5} 100,${r-l*1.55} Q${100+o+6},${r-l*1.5} ${100+o+5},${r+l} L${100+o-2},${r+l*.4} Q100,${r-l*.9} ${100-o+2},${r+l*.4} Z" fill="${S}" ${d}/>`))),i==="orc"&&(F.push(`<path d="M${100-o+1},${r-4} L${100+o-1},${r-4} L${100+o-3},${r-1} L${100-o+3},${r-1} Z" fill="#000" opacity=".5"/>`),F.push(rt("#ff4a2a",1.5,1)),F.push(`<path d="M93,${r+l-4} L94,${r+l-12} L96,${r+l-4} Z M107,${r+l-4} L106,${r+l-12} L104,${r+l-4} Z" fill="#efe6cf"/>`),F.push(`<path d="M97,${r-l*1.05} Q102,${r-l*1.9} 112,${r-l*2.1} Q104,${r-l*1.4} 103,${r-l*1.02} Z" fill="${u}"/>`),s.rank>=3&&F.push(yr(100,r-13,o*1.05,n,!0)),p.push(`<path d="M${100-c*.9},${h-2} L${100-c*.85},${h-22} L${100-c*.6},${h-8} L${100-c*.5},${h-24} L${100-c*.35},${h-10} Z M${100+c*.9},${h-2} L${100+c*.85},${h-22} L${100+c*.6},${h-8} L${100+c*.5},${h-24} L${100+c*.35},${h-10} Z" fill="url(#${n("metal")})" opacity=".8"/>`)),i==="goblin"&&(F.push(rt("#ffd84a",2,0)),F.push(`<path d="M95,${r+l-4} L97,${r+l-1} L99,${r+l-4} L101,${r+l-1} L103,${r+l-4} L105,${r+l-1}" stroke="#efe6cf" stroke-width=".8" fill="none"/>`)),i==="mage"){let tt=e()<.5,it=100+(e()-.5)*20;F.push(`<path d="M${100-o-6},${r+l+4} Q${100-o-9},${r-8} ${C(it)},${r-l*(tt?2.2:3.2)} Q${100+o+9},${r-8} ${100+o+6},${r+l+4} Z" fill="${Xt(s.fac.tint,.5)}" ${d}/>`),F.push(`<ellipse cx="100" cy="${r+3}" rx="${o-2}" ry="${l-3}" fill="#05030a"/>`),F.push(rt(s.accent,1.3,1)),(e()<.5||s.rank>=2)&&F.push(`<path d="M${100-o+3},${r+7} Q96,${h+16} 100,${h+26} Q104,${h+16} ${100+o-3},${r+7} Q100,${r+11} ${100-o+3},${r+7} Z" fill="#d9d4cc" opacity=".8"/>`),tt||F.push(`<path d="M${100-o-16},${r-4} Q100,${r-12} ${100+o+16},${r-4} Q100,${r-6} ${100-o-16},${r-4} Z" fill="${Xt(s.fac.tint,.5)}" ${d}/>`),s.rank>=2&&F.push(`<circle cx="${C(it)}" cy="${r-l*(tt?2.2:3.2)}" r="2" fill="${s.accent}"/>`)}if(i==="halfling"){let tt=["#6a3a1c","#a8652a","#3a2414","#c9934a"][Math.floor(e()*4)],it="";for(let wt=0;wt<8;wt++){let Ut=Math.PI*(1.05+wt*.12);it+=`<circle cx="${C(100+Math.cos(Ut)*o)}" cy="${C(r-2+Math.sin(Ut)*l)}" r="${C(4+e()*2)}"/>`}F.push(`<g fill="${Xt(tt,.4)}">${it}</g>`),F.push(`<circle cx="${100-o+1}" cy="${r+2}" r="3.2" fill="${A}"/><circle cx="${100+o-1}" cy="${r+2}" r="3.2" fill="${A}"/>`),p.push(`<path d="M87,${h-12} Q100,${h-2} 113,${h-12} L115,${h-6} Q100,${h+4} 85,${h-6} Z" fill="${s.fac.tint}" opacity=".9"/>`),F.push(H),s.rank>=3&&F.push(yr(100,r-12,o,n))}let q=_?` transform="translate(${ye},0) scale(-1,1)"`:"";return`${E}<g transform="translate(${I} 0) translate(100 150) scale(${U}) translate(-100 -150)"><g${q}>${x.join("")}</g>${p.join("")}${F.join("")}<g${q}>${k.front}</g></g>`}function yr(i,t,e,n,s=!1){let r=`M${i-e},${t+4}`;for(let o=0;o<=10;o++){let l=i-e+o/10*e*2;r+=` L${C(l)},${C(o%2?t-(s?7:3):t-(s?0:8))}`}return r+=` L${i+e},${t+4} Z`,`<path d="${r}" fill="url(#${n("metal")})" stroke="#000" stroke-opacity=".3" stroke-width=".5"/><circle cx="${i}" cy="${t}" r="1.6" fill="#ff5a6a"/>`}function u_(i,t,e,n,s){let a=`url(#${e("metal")})`,r=Xt(n.fac.tint,.7),o=n.rank>=2,l=100+s.sw*.8,c="",h="";switch(i){case"bow":c=`<path d="M${l-4},28 Q${l+26},86 ${l-4},146" fill="none" stroke="${r}" stroke-width="3.2" stroke-linecap="round"/><path d="M${l-4},28 Q${l+26},86 ${l-4},146" fill="none" stroke="${n.accent}" stroke-opacity=".5" stroke-width=".7"/><path d="M${l-4},28 L${l-4},146" stroke="#e8e2d0" stroke-opacity=".6" stroke-width=".5"/>`;break;case"sword":c=`<path d="M${l},22 L${l+3.2},30 L${l+3.2},112 L${l-3.2},112 L${l-3.2},30 Z" fill="${a}"/>`+(o?`<path d="M${l},26 L${l},110" stroke="${n.accent}" stroke-width="1"/><ellipse cx="${l}" cy="70" rx="12" ry="50" fill="url(#${e("acc")})" opacity=".5"/>`:"")+`<rect x="${l-11}" y="112" width="22" height="3.5" rx="1.5" fill="${a}"/><rect x="${l-2}" y="115" width="4" height="16" fill="${r}"/><circle cx="${l}" cy="133" r="3" fill="${a}"/>`;break;case"spear":c=`<rect x="${l-1.4}" y="26" width="2.8" height="130" fill="${r}"/><path d="M${l},6 L${l+5},26 L${l},34 L${l-5},26 Z" fill="${a}"/>`+(o?`<circle cx="${l}" cy="22" r="14" fill="url(#${e("acc")})"/>`:"")+`<path d="M${l-1},34 Q${l+8},42 ${l+3},52" stroke="${n.fac.tint}" stroke-width="2" fill="none"/>`;break;case"staff":{c=`<path d="M${l},34 Q${l+3},90 ${l-1},152" stroke="${r}" stroke-width="3.4" fill="none" stroke-linecap="round"/><path d="M${l},34 Q${l-10},26 ${l-4},16 Q${l+6},14 ${l+6},26" stroke="${r}" stroke-width="2.6" fill="none"/><circle cx="${l+1}" cy="26" r="${18+n.rank*4}" fill="url(#${e("acc")})"/><circle cx="${l+1}" cy="26" r="3.6" fill="${Te(n.accent,.5)}"/>`;break}case"axe":c=`<rect x="${l-1.6}" y="30" width="3.2" height="124" fill="${r}"/><path d="M${l},32 L${l+8},34 C${l+16},28 ${l+22},22 ${l+24},18 C${l+30},30 ${l+30},46 ${l+24},58 C${l+20},52 ${l+14},48 ${l+8},48 L${l},50 Z M${l},36 L${l-6},34 L${l-10},38 L${l-6},46 L${l},46 Z" fill="${a}"/>`+(o?`<path d="M${l+24},18 C${l+30},30 ${l+30},46 ${l+24},58" stroke="${n.accent}" stroke-width="1.4" fill="none"/>`:"");break;case"hammer":c=`<rect x="${l-1.8}" y="40" width="3.6" height="116" fill="${r}"/><rect x="${l-14}" y="28" width="28" height="16" rx="2" fill="${a}"/><rect x="${l-14}" y="34" width="28" height="2" fill="#000" opacity=".3"/>`+(o?`<path d="M${l-6},36 h12" stroke="${n.accent}" stroke-width="1.6"/><circle cx="${l}" cy="36" r="16" fill="url(#${e("acc")})" opacity=".6"/>`:"");break;case"dagger":h=`<g transform="rotate(-28 66 134)"><path d="M66,104 L69,110 L69,128 L63,128 L63,110 Z" fill="${a}"/><rect x="58" y="128" width="16" height="3" fill="${a}"/><rect x="64.5" y="131" width="3" height="10" fill="${r}"/></g>`;break;case"shield":h=`<path d="M54,112 L86,112 L86,130 Q86,146 70,152 Q54,146 54,130 Z" fill="${Xt(n.fac.tint,.25)}" stroke="${a}" stroke-width="2.2"/><path d="M70,118 L76,128 L70,142 L64,128 Z" fill="${n.accent}" opacity=".8"/>`;break;case"lantern":h=`<circle cx="140" cy="132" r="${24+n.rank*4}" fill="url(#${e("acc")})"/><path d="M140,108 L140,118" stroke="${a}" stroke-width="1.2"/><path d="M133,118 L147,118 L145,140 L135,140 Z" fill="${Te(n.accent,.4)}" opacity=".9" stroke="${Xt(n.fac.metal,.4)}" stroke-width="1.6"/><rect x="132" y="139" width="16" height="3" fill="${Xt(n.fac.metal,.4)}"/><path d="M140,113 a4,4 0 0 1 0,6" stroke="${a}" fill="none"/>`;break;case"pipe":h=`<path d="M${100+s.rx*.3},${s.hy+s.ry*.7} L${100+s.rx+8},${s.hy+s.ry*.9}" stroke="${r}" stroke-width="1.6"/><rect x="${100+s.rx+6}" y="${s.hy+s.ry*.9-4}" width="4" height="5" fill="${r}"/><path d="M${100+s.rx+8},${s.hy+s.ry*.5} C${100+s.rx+2},${s.hy-4} ${100+s.rx+18},${s.hy-12} ${100+s.rx+10},${s.hy-26} C${100+s.rx+4},${s.hy-36} ${100+s.rx+20},${s.hy-42} ${100+s.rx+16},${s.hy-54}" stroke="#f0ece4" stroke-opacity=".4" stroke-width="2.4" fill="none" stroke-linecap="round"/>`;break;case"tome":h=`<ellipse cx="100" cy="134" rx="40" ry="18" fill="url(#${e("acc")})"/><path d="M78,140 L100,136 L122,140 L122,126 L100,122 L78,126 Z" fill="${Te(n.accent,.6)}" stroke="${Xt(n.fac.tint,.5)}" stroke-width="1.8"/><path d="M100,122 L100,136" stroke="${Xt(n.fac.tint,.4)}" stroke-width="1"/>`;break;default:break}return{back:c,front:h}}var xn={wolf:"M150,141 C162,132 160,118 150,114 C146,100 138,90 128,84 C120,70 114,58 110,48 L114,32 L104,41 L100,29 L95,42 C88,40 80,34 70,26 L67,31 C74,40 82,48 86,56 C88,66 90,78 90,90 C88,104 86,118 90,132 L84,141 L100,141 L100,128 C104,124 110,126 112,132 L110,141 Z",stag:"M62,141 L66,104 C60,96 60,86 70,82 L118,80 C124,72 126,62 128,56 C126,52 128,46 132,46 L140,48 C146,52 146,56 142,58 L136,60 C134,70 132,80 130,88 C134,96 134,106 130,112 L134,141 L127,141 L124,114 L104,112 L100,141 L93,141 L94,112 L78,110 L72,141 Z M130,46 C126,34 118,30 112,18 C118,26 124,28 126,26 C122,18 124,10 120,4 C128,12 128,22 130,28 C132,18 138,14 136,6 C142,16 136,26 136,36 C142,30 148,30 152,22 C150,32 142,38 136,46 Z",owl:"M100,30 C82,30 72,44 72,62 C72,84 76,104 84,120 L80,134 L92,128 L100,134 L108,128 L120,134 L116,120 C124,104 128,84 128,62 C128,44 118,30 100,30 Z M76,36 L84,24 L90,34 Z M124,36 L116,24 L110,34 Z M60,141 L140,141 L140,134 L60,134 Z",eagle:"M100,46 C94,46 92,52 94,58 C80,56 64,44 40,30 C36,40 44,48 30,48 C40,58 34,62 26,64 C44,72 70,76 92,80 C90,92 90,104 96,118 L92,132 L100,126 L108,132 L104,118 C110,104 110,92 108,80 C130,76 156,72 174,64 C166,62 160,58 170,48 C156,48 164,40 160,30 C136,44 120,56 106,58 C108,52 106,46 100,46 Z M100,48 L104,54 L100,58 Z",horse:"M56,141 L60,108 C50,104 46,94 52,84 C60,78 80,78 96,80 L116,80 C120,66 124,56 128,46 L126,38 L132,42 L136,36 L138,44 C146,48 152,56 156,64 C156,70 152,72 148,70 L140,66 C138,78 134,92 132,106 L134,141 L127,141 L124,110 L106,112 L104,141 L97,141 L96,112 L76,110 L68,141 Z M128,46 C120,52 116,62 114,76 L118,70 C120,62 124,54 128,46 Z",ram:"M66,141 L68,108 C58,104 56,92 62,84 C72,76 96,76 110,78 C116,72 120,66 124,62 C130,56 140,56 146,62 L150,74 L142,78 L136,74 C132,84 130,96 128,108 L130,141 L123,141 L120,112 L104,112 L102,141 L95,141 L94,112 L80,110 L74,141 Z M124,62 C116,52 120,40 132,38 C144,38 150,48 146,58 C142,50 134,46 128,50 C126,54 126,58 124,62 Z",bear:"M50,141 L54,112 C44,104 44,88 56,80 C70,68 96,64 116,70 C126,72 134,78 140,84 L150,84 C158,86 162,92 160,98 L152,104 L144,106 C142,118 140,130 142,141 L132,141 L128,118 L108,120 L106,141 L96,141 L94,118 L72,116 L66,141 Z M136,80 L138,72 L144,78 Z",troll:"M70,141 L74,118 C62,114 56,100 58,86 C60,72 68,62 82,60 C84,48 90,40 100,40 C110,40 116,48 116,58 C128,60 138,70 142,86 C146,100 140,114 128,118 L132,141 L118,141 L114,120 L104,124 L96,124 L86,120 L84,141 Z M142,86 C152,90 158,104 160,118 L170,120 C168,104 160,82 146,76 Z M150,118 C152,96 160,60 168,40 C176,40 180,48 178,56 C170,74 164,98 162,120 Z",golem:"M66,141 L70,116 L58,112 L56,82 L66,66 L84,62 L84,46 L116,46 L116,62 L134,66 L144,82 L142,112 L130,116 L134,141 L112,141 L110,120 L90,120 L88,141 Z M56,82 L44,90 L42,120 L54,124 L58,112 Z M144,82 L156,90 L158,120 L146,124 L142,112 Z",treant:"M80,141 C84,120 86,100 84,80 C70,74 58,62 54,44 C62,52 70,56 78,56 C70,46 68,34 72,22 C78,34 84,42 92,46 C92,34 96,24 102,16 C104,28 104,38 108,46 C114,38 122,32 132,30 C126,40 120,50 118,58 C128,58 138,54 146,46 C142,62 130,74 116,80 C114,100 116,120 120,141 L110,141 C108,130 104,124 100,124 C96,124 92,130 90,141 Z",dragon:"M18,138 C36,132 52,126 64,118 C64,106 72,96 86,94 C100,92 112,92 122,88 C130,80 134,68 138,58 C140,50 144,44 150,41 L153,30 L158,40 L174,45 L176,52 L162,55 C154,58 149,64 147,72 C145,84 141,96 135,104 L139,124 L147,141 L134,141 L128,124 L96,122 L86,141 L73,141 L76,122 C60,128 42,136 18,138 Z M110,91 L96,50 L74,16 Q60,30 28,24 Q44,38 42,52 Q58,52 64,66 Q76,66 84,80 Q96,82 100,94 Z M126,86 L136,44 L160,12 Q162,34 182,42 Q166,48 164,60 Q150,62 144,76 Z"};xn.crow=xn.eagle;xn.griffin=xn.eagle;xn.phoenix=xn.eagle;xn.badger=xn.bear;xn.wyvern=xn.dragon;function d_(i,t,e,n){let s=`url(#${e("fig")})`,a=`stroke="${n.accent}" stroke-opacity=".5" stroke-width=".9"`,r="";if(i==="elemental"||i==="wisp"){let x=i==="wisp"?n.accent:"#bfe4ff";r+=`<circle cx="100" cy="82" r="${i==="wisp"?40:60}" fill="url(#${e("acc")})"/>`;let p=i==="wisp"?5:9;for(let m=0;m<p;m++){let M=6+m*(i==="wisp"?3:5),w=t()*6.28;r+=`<path d="M${C(100+Math.cos(w)*M)},${C(82+Math.sin(w)*M*1.3)} A${M},${C(M*1.3)} 0 0 1 ${C(100+Math.cos(w+2.6)*M)},${C(82+Math.sin(w+2.6)*M*1.3)}" stroke="${x}" stroke-opacity="${C(.9-m*.07)}" stroke-width="${C(2.6-m*.18)}" fill="none" stroke-linecap="round"/>`}if(i==="elemental")r+='<path d="M86,30 L94,52 L86,54 L98,80 M118,26 L110,46 L118,48 L104,74" stroke="#fff" stroke-width="1.6" fill="none" stroke-linejoin="round"/>',r+='<circle cx="93" cy="80" r="2.4" fill="#fff"/><circle cx="107" cy="80" r="2.4" fill="#fff"/>';else{r+='<circle cx="100" cy="82" r="5" fill="#fff"/>';for(let m=0;m<4;m++)r+=`<circle cx="${C(60+t()*80)}" cy="${C(50+t()*60)}" r="${C(1.5+t()*2)}" fill="${Te(n.accent,.5)}"/>`}return r}let o=t()<.5,l=i==="badger"?.65:i==="crow"?.7:1,c=o?`translate(${ye},0) scale(-1,1)`:"",h=l!==1?` translate(${100*(1-l)},${141*(1-l)}) scale(${l})`:"",u=s,d="";i==="phoenix"&&(u=`url(#${e("fire")})`,r+=`<defs><linearGradient id="${e("fire")}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff2b0"/><stop offset=".4" stop-color="#ff9a3a"/><stop offset="1" stop-color="#b8261a"/></linearGradient></defs>`,r+=`<circle cx="100" cy="70" r="80" fill="url(#${e("acc")})" opacity=".8"/>`,d='<path d="M96,118 C90,132 84,140 70,148 M100,120 C100,134 100,142 98,150 M104,118 C110,132 118,140 132,148" stroke="#ffb347" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>'),(i==="griffin"||/White/.test(n.card.name))&&(u=`url(#${e("metal")})`),n.rank>=3&&i!=="phoenix"&&(r+=`<ellipse cx="100" cy="90" rx="90" ry="60" fill="url(#${e("acc")})" opacity=".45"/>`),r+=`<g transform="${c}${h}"><path d="${xn[i]}" fill="${u}" ${a} stroke-linejoin="round"/>${d}`;let f={wolf:[92,40],stag:[136,51],owl:[[91,54],[109,54]],eagle:[[97,52],[103,52]],horse:[140,52],ram:[138,64],bear:[146,90],troll:[[95,52],[105,52]],golem:[[93,56],[107,56]],treant:[[94,72],[106,72]],dragon:[162,47]}[i in{crow:1,griffin:1,phoenix:1}?"eagle":i in{badger:1}?"bear":i in{wyvern:1}?"dragon":i],_=n.fac.key==="horde"||i==="dragon"||i==="wyvern"?"#ff5a2a":n.accent;if(f){let x=Array.isArray(f[0])?f:[f];for(let[p,m]of x)r+=`<circle cx="${p}" cy="${m}" r="5" fill="url(#${e("acc")})"/><circle cx="${p}" cy="${m}" r="1.4" fill="${_}"/>`}return(i==="dragon"||i==="wyvern")&&(r+=`<path d="M74,16 L42,52 M74,16 L64,66 M74,16 L84,80 M160,12 L164,60 M160,12 L144,76" stroke="${n.accent}" stroke-opacity=".35" stroke-width=".8" fill="none"/>`),i==="owl"&&(r+=`<circle cx="91" cy="54" r="8" fill="${Te(n.figure,.12)}"/><circle cx="109" cy="54" r="8" fill="${Te(n.figure,.12)}"/><path d="M98,60 L100,66 L102,60 Z" fill="${n.accent}"/><path d="M76,66 C78,90 84,106 92,118 M124,66 C122,90 116,106 108,118" stroke="${n.accent}" stroke-opacity=".4" fill="none"/><path d="M92,80 l4,3 4,-3 4,3 4,-3 M92,90 l4,3 4,-3 4,3 4,-3" stroke="${Te(n.figure,.2)}" fill="none"/><circle cx="91" cy="54" r="2.2" fill="${n.accent}"/><circle cx="109" cy="54" r="2.2" fill="${n.accent}"/>`),i==="golem"&&(r+=`<path d="M90,78 L100,90 L110,78 M100,90 L100,104" stroke="${n.accent}" stroke-width="1.6" fill="none"/>`),i==="stag"&&n.fac.key==="sylvan"&&(r+=`<path d="M130,46 C126,34 118,30 112,18" stroke="${n.accent}" stroke-width=".6" fill="none" opacity=".8"/>`),r+="</g>",(i==="dragon"||i==="wyvern")&&(r+=`<g opacity=".7">${Array.from({length:12},()=>`<circle cx="${C(t()*ye)}" cy="${C(100+t()*50)}" r="${C(1+t()*2)}" fill="#ff8a3a"/>`).join("")}</g>`),r+=`<path d="M0,141 L${ye},141 L${ye},${Ue} L0,${Ue} Z" fill="${n.landNear}"/>`,r}function Ro(i,t,e,n,s,a,r){let o="";for(let l=0;l<a;l++)o+=`<rect x="${C(t+i()*(n-3))}" y="${C(e+i()*(s-4))}" width="2" height="3" fill="${r}"/>`;return o}function f_(i,t,e,n){let{landMid:s,landNear:a,accent:r,fac:o,rank:l,skyBot:c,skyTop:h}=n,u=Xt(xe(c,o.tint,.3),.55),d=xe(u,n.t.sun,.25),f="",_=`<ellipse cx="100" cy="80" rx="${60+l*10}" ry="${50+l*8}" fill="url(#${e("acc")})" opacity="${.18+l*.08}"/>`;switch(f+=_,i){case"tower":{let x=70+t()*60,p=80+t()*20,m=13+t()*6;f+=`<path d="M${C(x-m)},132 L${C(x-m*.75)},${C(132-p)} L${C(x+m*.75)},${C(132-p)} L${C(x+m)},132 Z" fill="${u}"/>`,f+=`<path d="M${C(x-m)},132 L${C(x-m*.75)},${C(132-p)} L${C(x-m*.2)},${C(132-p)} L${C(x-m*.3)},132 Z" fill="${d}" opacity=".5"/>`,f+=`<path d="M${C(x-m*1.05)},${C(132-p)} L${C(x)},${C(132-p-30)} L${C(x+m*1.05)},${C(132-p)} Z" fill="${Xt(o.tint,.4)}"/>`,f+=Ro(t,x-m*.6,132-p+8,m*1.2,p-16,6+l*2,r),f+=`<circle cx="${C(x)}" cy="${C(132-p+10)}" r="14" fill="url(#${e("acc")})"/><rect x="${C(x-2)}" y="${C(132-p+6)}" width="4" height="7" fill="${Te(r,.4)}"/>`;break}case"gate":{f+=`<path d="M40,134 L44,52 L64,48 L66,134 Z M134,134 L136,48 L156,52 L160,134 Z" fill="${u}"/>`,f+=`<path d="M64,134 L64,74 Q100,34 136,74 L136,134 Z" fill="${Xt(u,.2)}"/>`,f+=`<path d="M72,134 L72,80 Q100,48 128,80 L128,134 Z" fill="${r}" opacity=".85"/>`,f+=`<path d="M72,134 L72,80 Q100,48 128,80 L128,134 Z" fill="url(#${e("acc")})"/>`,f+=`<path d="M100,60 L100,134 M86,66 L86,134 M114,66 L114,134" stroke="${Xt(u,.4)}" stroke-width="1.4" opacity=".6"/>`,f+=`<path d="M38,52 L66,46 L66,40 L38,46 Z M134,46 L162,52 L162,46 L134,40 Z" fill="${d}"/>`;break}case"tree":{f+=`<path d="M90,136 C92,112 94,92 90,70 L110,70 C106,92 108,112 112,136 C122,138 130,142 136,146 L64,146 C70,142 80,138 90,136 Z" fill="${Xt(a,.2)}"/>`;for(let x=0;x<9;x++){let p=100+(t()-.5)*110,m=40+t()*40,M=18+t()*18;f+=`<circle cx="${C(p)}" cy="${C(m)}" r="${C(M)}" fill="${xe(s,o.tint,.2+t()*.2)}"/>`}for(let x=0;x<18+l*6;x++)f+=`<circle cx="${C(100+(t()-.5)*120)}" cy="${C(30+t()*60)}" r="${C(.8+t()*1.2)}" fill="${Te(r,.3)}"/>`;break}case"bridge":{f+=`<rect x="0" y="116" width="${ye}" height="40" fill="${xe(c,h,.4)}"/>`,f+=`<path d="M0,104 L200,104 L200,122 L176,122 Q160,96 140,122 L120,122 Q100,90 80,122 L60,122 Q40,96 24,122 L0,122 Z" fill="${xe(u,n.t.sun,.3)}"/><path d="M0,104 L200,104 L200,122 L176,122 Q160,96 140,122 L120,122 Q100,90 80,122 L60,122 Q40,96 24,122 L0,122 Z" fill="none" stroke="${r}" stroke-opacity=".35" stroke-width=".8"/>`,f+=`<path d="M0,101 L200,101 L200,105 L0,105 Z" fill="${Te(d,.2)}"/>`,f+=`<path d="M30,101 L30,86 M70,101 L70,86 M130,101 L130,86 M170,101 L170,86" stroke="${xe(u,n.t.sun,.3)}" stroke-width="3"/>`,f+=`<circle cx="70" cy="84" r="9" fill="url(#${e("acc")})"/><circle cx="130" cy="84" r="9" fill="url(#${e("acc")})"/><circle cx="70" cy="84" r="1.6" fill="${r}"/><circle cx="130" cy="84" r="1.6" fill="${r}"/>`,f+=`<path d="M0,128 L200,128 M10,136 L190,136" stroke="${Te(c,.4)}" stroke-width=".6" opacity=".5"/>`;break}case"hall":{f+=`<path d="M-10,140 L30,30 L100,10 L170,30 L210,140 Z" fill="${u}"/>`,f+=`<path d="M66,140 L66,70 L100,52 L134,70 L134,140 Z" fill="${Xt(u,.35)}"/>`,f+=`<path d="M76,140 L76,76 L100,62 L124,76 L124,140 Z" fill="${r}" opacity=".8"/><path d="M76,140 L76,76 L100,62 L124,76 L124,140 Z" fill="url(#${e("acc")})"/>`,f+=`<path d="M56,62 L60,140 M144,62 L140,140" stroke="${d}" stroke-width="5"/>`;for(let x=0;x<4;x++)f+=`<rect x="${60-x*6}" y="${140-x*3}" width="${80+x*12}" height="3" fill="${d}" opacity=".5"/>`;break}case"village":{for(let x=0;x<5;x++){let p=20+x*40+(t()-.5)*12,m=16+t()*10,M=12+t()*10,w=128-t()*8;o.key==="hearth"?f+=`<ellipse cx="${C(p)}" cy="${C(w+4)}" rx="${C(m*1.3)}" ry="${C(M)}" fill="${s}"/><circle cx="${C(p)}" cy="${C(w)}" r="5" fill="${r}" opacity=".9"/><circle cx="${C(p)}" cy="${C(w)}" r="12" fill="url(#${e("acc")})"/><rect x="${C(p-.6)}" y="${C(w-5)}" width="1.2" height="10" fill="${a}"/>`:(f+=`<rect x="${C(p-m/2)}" y="${C(w-M)}" width="${C(m)}" height="${C(M)}" fill="${u}"/><path d="M${C(p-m/2-3)},${C(w-M)} L${C(p)},${C(w-M-10)} L${C(p+m/2+3)},${C(w-M)} Z" fill="${Xt(o.tint,.5)}"/>`,f+=Ro(t,p-m/2+2,w-M+2,m-4,M-4,2,r),f+=`<path d="M${C(p+m*.2)},${C(w-M-6)} c-4,-10 6,-16 0,-28" stroke="#ddd" stroke-opacity=".25" stroke-width="2" fill="none"/>`)}f+=`<path d="M0,140 Q100,124 200,140 L200,150 L0,150 Z" fill="${a}"/>`;break}case"forge":{f+=`<path d="M40,134 L40,86 L100,64 L160,86 L160,134 Z" fill="${u}"/>`,f+=`<rect x="122" y="40" width="14" height="40" fill="${Xt(u,.2)}"/>`,f+='<path d="M129,40 C120,24 140,14 128,-4" stroke="#999" stroke-opacity=".35" stroke-width="7" fill="none" stroke-linecap="round"/>',f+=`<path d="M80,134 L80,104 Q100,88 120,104 L120,134 Z" fill="#ff8a3a"/><path d="M80,134 L80,104 Q100,88 120,104 L120,134 Z" fill="url(#${e("acc")})"/>`,f+=`<circle cx="100" cy="120" r="40" fill="url(#${e("acc")})" opacity=".7"/>`;for(let x=0;x<16;x++)f+=`<circle cx="${C(85+t()*30)}" cy="${C(60+t()*50)}" r="${C(.6+t())}" fill="#ffcf7a"/>`;break}case"camp":{for(let x=0;x<5;x++){let p=18+x*42+(t()-.5)*10,m=14+t()*8,M=18+t()*10;f+=`<path d="M${C(p-m)},132 L${C(p)},${C(132-M)} L${C(p+m)},132 Z" fill="${Xt(o.tint,.6)}"/><path d="M${C(p)},${C(132-M)} L${C(p)},${C(132-M-16)} L${C(p+10)},${C(132-M-12)} L${C(p)},${C(132-M-8)}" fill="${o.tint}" stroke="${a}" stroke-width=".8"/>`}f+=`<circle cx="100" cy="128" r="36" fill="url(#${e("acc")})"/><path d="M92,134 Q94,118 100,108 Q104,120 108,134 Z" fill="#ffb347"/><path d="M96,134 Q98,124 100,118 Q102,126 104,134 Z" fill="#fff0b0"/>`,f+='<path d="M100,108 C92,90 110,74 98,50" stroke="#777" stroke-opacity=".3" stroke-width="8" fill="none" stroke-linecap="round"/>',f+=`<path d="M0,134 L200,134 L200,150 L0,150 Z" fill="${a}"/>`;break}case"peak":{f+=`<path d="M-10,140 L60,70 L84,40 L100,20 L118,44 L138,62 L210,140 Z" fill="${u}"/>`,f+='<path d="M84,40 L100,20 L118,44 L110,40 L104,50 L96,42 L90,48 Z" fill="#f2f4f8"/>',f+=`<path d="M-10,140 L60,70 L84,40 L100,20 L96,60 L80,100 L60,140 Z" fill="${d}" opacity=".35"/>`,f+=`<path d="M100,140 C110,120 86,110 100,92 C110,80 96,70 104,58" stroke="${r}" stroke-opacity=".55" stroke-width="1.2" fill="none" stroke-dasharray="2 2"/>`;break}case"lake":{f+=`<rect x="0" y="112" width="${ye}" height="40" fill="${xe(c,h,.45)}"/>`;for(let x=0;x<12;x++)f+=`<rect x="${C(t()*ye)}" y="${C(114+t()*34)}" width="${C(10+t()*30)}" height=".7" fill="${Te(c,.5)}" opacity=".45"/>`;f+=`<ellipse cx="100" cy="128" rx="18" ry="3" fill="${r}" opacity=".45"/><circle cx="100" cy="100" r="22" fill="url(#${e("acc")})" opacity=".8"/>`;for(let x=0;x<10;x++){let p=t()<.5?t()*40:160+t()*40;f+=`<path d="M${C(p)},150 Q${C(p+2)},${C(130-t()*10)} ${C(p+4*(t()-.5))},${C(118-t()*14)}" stroke="${a}" stroke-width="1.4" fill="none"/>`}break}case"citadel":{f+=`<path d="M30,150 L44,110 L60,96 L140,96 L156,110 L170,150 Z" fill="${Xt(u,.3)}"/>`;let x=[[62,46],[84,30],[100,14],[116,30],[138,46]];for(let[p,m]of x)f+=`<rect x="${p-6}" y="${m}" width="12" height="${100-m}" fill="${u}"/><path d="M${p-8},${m} L${p},${m-16} L${p+8},${m} Z" fill="${Xt(o.tint,.45)}"/>`,f+=Ro(t,p-4,m+4,8,90-m,3,r);f+=`<rect x="56" y="70" width="88" height="30" fill="${u}"/>`,f+=Ro(t,58,74,84,22,10,r),f+=`<circle cx="100" cy="20" r="14" fill="url(#${e("acc")})"/>`,(n.fac.key==="wilds"||t()<.4)&&(f+=`<rect x="0" y="118" width="${ye}" height="32" fill="${xe(c,h,.5)}" opacity=".85"/><path d="M0,124 L200,124 M0,134 L200,134" stroke="${Te(c,.4)}" stroke-width=".6" opacity=".5"/>`);break}default:break}return f}function p_(i,t){return`<path d="M64,140 L136,140 L130,130 L70,130 Z" fill="${i}"/><path d="M70,130 L130,130" stroke="${t}" stroke-opacity=".5"/>`}function m_(i,t,e,n,s,a){let r=`url(#${e("metal")})`,o=["#ff4a6a","#4ad2ff","#7cff8a","#c08aff","#ffd24a"][Math.floor(t()*5)],l=(h,u,d)=>`<circle cx="${h}" cy="${u}" r="${d*2.6}" fill="url(#${e("acc")})"/><path d="M${h},${u-d} L${h+d},${u} L${h},${u+d} L${h-d},${u} Z" fill="${o}" stroke="#fff" stroke-opacity=".6" stroke-width=".5"/>`,c=Xt(s.tint,.65);switch(i){case"sword":return`<g transform="rotate(${C((t()-.5)*20)} 100 80)"><path d="M100,12 L105,22 L105,102 L95,102 L95,22 Z" fill="${r}"/><path d="M100,16 L100,100" stroke="${n}" stroke-width="1"/><path d="M78,102 L122,102 L118,108 L82,108 Z" fill="${r}"/><rect x="97" y="108" width="6" height="18" fill="${c}"/><circle cx="100" cy="129" r="4.5" fill="${r}"/>${l(100,105,3)}</g>`;case"ring":return`<ellipse cx="100" cy="86" rx="28" ry="24" fill="none" stroke="${r}" stroke-width="7"/>${l(100,60,8)}`;case"crown":return`<g transform="translate(100 82)"><path d="M-40,16 L-44,-20 L-24,-2 L-12,-30 L0,-6 L12,-30 L24,-2 L44,-20 L40,16 Z" fill="${r}" stroke="#000" stroke-opacity=".3"/>${a>=4?'<path d="M-2,-34 L4,-2 L-4,6 L2,18" stroke="#120a10" stroke-width="2.4" fill="none"/>':""}<rect x="-40" y="10" width="80" height="8" fill="${r}"/>${l(0,13,4)}${l(-22,13,3)}${l(22,13,3)}<circle cx="-44" cy="-22" r="3" fill="${o}"/><circle cx="44" cy="-22" r="3" fill="${o}"/><circle cx="-12" cy="-32" r="3" fill="${o}"/><circle cx="12" cy="-32" r="3" fill="${o}"/></g>`;case"chalice":return`<path d="M72,40 L128,40 Q128,76 104,84 L104,112 L118,124 L82,124 L96,112 L96,84 Q72,76 72,40 Z" fill="${r}"/><ellipse cx="100" cy="40" rx="28" ry="5" fill="${Xt(s.metal,.4)}"/><ellipse cx="100" cy="40" rx="24" ry="3.5" fill="${n}" opacity=".9"/>${l(100,62,5)}`;case"amulet":return`<path d="M64,24 Q100,90 136,24" stroke="${r}" stroke-width="2" fill="none" stroke-dasharray="3 1.5"/><circle cx="100" cy="82" r="22" fill="${r}"/><circle cx="100" cy="82" r="16" fill="${Xt(s.tint,.3)}"/>${l(100,82,9)}<path d="M100,60 L100,104 M78,82 L122,82" stroke="${n}" stroke-opacity=".3"/>`;case"tome":return`<path d="M54,104 L100,96 L146,104 L146,58 L100,50 L54,58 Z" fill="${Xt(s.tint,.5)}" stroke="${r}" stroke-width="2"/><path d="M58,100 L100,92 L142,100 L142,60 L100,54 L58,60 Z" fill="${Te(n,.7)}"/><path d="M100,54 L100,92" stroke="${Xt(s.tint,.4)}"/>${[0,1,2,3,4].map(h=>`<path d="M64,${66+h*6} L94,${62+h*6} M106,${62+h*6} L136,${66+h*6}" stroke="${Xt(s.tint,.4)}" stroke-opacity=".45" stroke-width=".8"/>`).join("")}<circle cx="100" cy="66" r="${26+a*4}" fill="url(#${e("acc")})"/>${Array.from({length:6},(h,u)=>`<path d="M${100+(u-2.5)*10},50 l2,-${8+u%3*5} l2,${3+u%2*2}" stroke="${n}" fill="none" stroke-width="1.2"/>`).join("")}`;case"staff":return`<path d="M100,30 L100,132" stroke="${c}" stroke-width="5" stroke-linecap="round"/><path d="M84,28 Q100,48 116,28 Q110,14 100,12 Q90,14 84,28 Z" fill="${Xt(s.metal,.5)}"/><circle cx="91" cy="26" r="3" fill="#000" opacity=".7"/><circle cx="109" cy="26" r="3" fill="#000" opacity=".7"/><circle cx="91" cy="26" r="1.4" fill="${n}"/><circle cx="109" cy="26" r="1.4" fill="${n}"/><path d="M92,50 L108,50 L104,60 L96,60 Z" fill="${r}"/><path d="M100,62 C88,70 112,80 100,88" stroke="#c9a" stroke-opacity=".4" fill="none"/>`;case"shield":return`<path d="M64,30 L136,30 L136,74 Q136,110 100,128 Q64,110 64,74 Z" fill="${Xt(s.tint,.2)}" stroke="${r}" stroke-width="4"/><path d="M100,40 L118,70 L100,112 L82,70 Z" fill="${r}"/>${l(100,70,6)}`;case"horn":return`<path d="M56,92 C70,60 110,48 146,54 L150,40 L156,58 L146,70 C116,68 84,82 70,104 Z" fill="${Te(s.metal,.6)}" stroke="${Xt(s.metal,.5)}" stroke-width="1.4"/><path d="M70,80 L78,92 M86,70 L92,82 M104,62 L108,74 M122,58 L124,70" stroke="${r}" stroke-width="3"/><path d="M52,90 L74,106" stroke="${r}" stroke-width="5" stroke-linecap="round"/>`;case"gem":{let h=o;return`<circle cx="100" cy="80" r="${40+a*6}" fill="url(#${e("acc")})"/><path d="M100,30 L132,60 L118,116 L82,116 L68,60 Z" fill="${h}"/><path d="M100,30 L112,62 L100,116 L88,62 Z" fill="#fff" opacity=".25"/><path d="M68,60 L132,60 M88,62 L82,116 M112,62 L118,116" stroke="#fff" stroke-opacity=".5" stroke-width=".8" fill="none"/><path d="M80,50 L92,38" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".7"/>`}case"bow":return`<path d="M86,14 Q140,80 86,146" stroke="${c}" stroke-width="6" fill="none" stroke-linecap="round"/><path d="M86,14 Q140,80 86,146" stroke="${n}" stroke-width="1.4" fill="none"/><path d="M86,14 L86,146" stroke="#f0ece0" stroke-width=".8"/><path d="M60,80 L128,80" stroke="${r}" stroke-width="2"/><path d="M128,80 L120,76 L120,84 Z" fill="${n}"/>`;case"axe":return`<path d="M100,20 L100,134" stroke="${c}" stroke-width="5"/><path d="M100,30 L112,32 C126,24 136,14 140,6 C154,26 154,58 140,80 C132,70 122,64 112,64 L100,66 Z M100,36 L88,34 L80,42 L88,58 L100,58 Z" fill="${r}"/><path d="M140,6 C154,26 154,58 140,80" stroke="${n}" stroke-width="1.8" fill="none"/>`;default:return""}}function g_(i,t,e,n){let[s,a]=wu[i],r="",o=2+Math.min(n,3);for(let h=0;h<o;h++){let u=22+h*12;r+=`<circle cx="100" cy="74" r="${u}" fill="none" stroke="${s}" stroke-opacity="${C(.8-h*.12)}" stroke-width="${h%2?.8:1.6}" ${h%2?'stroke-dasharray="3 3"':""}/>`;let d=8+h*4;for(let f=0;f<d;f++){if(h%2)continue;let _=f/d*Math.PI*2,x=100+Math.cos(_)*(u+5),p=74+Math.sin(_)*(u+5),m=Math.floor(t()*4);r+=`<path d="${m===0?"M-2,-3 L0,3 L2,-3":m===1?"M-2,-3 L-2,3 M-2,0 L2,-3 M-2,0 L2,3":m===2?"M0,-3 L0,3 M-2,-1 L2,1":"M-2,3 L0,-3 L2,3 M-1,0 L1,0"}" transform="translate(${C(x)} ${C(p)}) rotate(${C(_*57.3+90)})" stroke="${a}" stroke-width=".7" fill="none" opacity=".8"/>`}}let l=5+Math.floor(t()*4),c="";for(let h=0;h<=l;h++){let u=h*2/l*Math.PI*2-Math.PI/2;c+=`${h?"L":"M"}${C(100+Math.cos(u)*22)},${C(74+Math.sin(u)*22)} `}if(r+=`<path d="${c}" stroke="${a}" stroke-width="1" fill="none" opacity=".8"/>`,r+=`<circle cx="100" cy="74" r="${18+n*3}" fill="url(#${e("acc")})"/><circle cx="100" cy="74" r="${5+n}" fill="${a}"/>`,i==="storm")for(let h=0;h<3;h++){let u=100,d=74,f=`M${u},${d}`,_=t()*6.28;for(let x=0;x<6;x++)u+=Math.cos(_)*10+(t()-.5)*12,d+=Math.sin(_)*10+(t()-.5)*12,f+=` L${C(u)},${C(d)}`;r+=`<path d="${f}" stroke="${a}" stroke-width="1.4" fill="none"/>`}else if(i==="fire")for(let h=0;h<7;h++){let u=70+h*10+(t()-.5)*6,d=30+t()*40;r+=`<path d="M${C(u-6)},116 Q${C(u-4)},${C(116-d*.6)} ${C(u)},${C(116-d)} Q${C(u+4)},${C(116-d*.6)} ${C(u+6)},116 Z" fill="${s}" opacity=".55"/>`}else if(i==="frost")for(let h=0;h<6;h++){let u=h*Math.PI/3;r+=`<path d="M100,74 L${C(100+Math.cos(u)*60)},${C(74+Math.sin(u)*60)}" stroke="${a}" stroke-width="1.2" opacity=".7"/>`;for(let d of[.5,.75]){let f=100+Math.cos(u)*60*d,_=74+Math.sin(u)*60*d;r+=`<path d="M${C(f+Math.cos(u+.8)*8)},${C(_+Math.sin(u+.8)*8)} L${C(f)},${C(_)} L${C(f+Math.cos(u-.8)*8)},${C(_+Math.sin(u-.8)*8)}" stroke="${a}" fill="none" opacity=".7"/>`}}else if(i==="nature")for(let h=0;h<10;h++){let u=t()*6.28,d=30+t()*40,f=100+Math.cos(u)*d,_=74+Math.sin(u)*d*.8;r+=`<path d="M${C(f)},${C(_)} q4,-6 10,-4 q-2,6 -10,4 Z" fill="${s}" opacity=".8" transform="rotate(${C(u*57)} ${C(f)} ${C(_)})"/>`}else if(i==="shadow")for(let h=0;h<5;h++){let u=t()*6.28;r+=`<path d="M100,74 C${C(100+Math.cos(u)*30)},${C(74+Math.sin(u)*10)} ${C(100+Math.cos(u+1)*50)},${C(74+Math.sin(u+1)*50)} ${C(100+Math.cos(u+1.5)*80)},${C(74+Math.sin(u+1.5)*70)}" stroke="#1a0630" stroke-width="5" fill="none" opacity=".7" stroke-linecap="round"/>`}else if(i==="earth"){for(let h=0;h<8;h++){let u=30+t()*140,d=100+t()*30,f=4+t()*8;r+=`<path d="M${C(u-f)},${C(d)} L${C(u)},${C(d-f*1.6)} L${C(u+f)},${C(d)} Z" fill="${Xt(s,.3)}" stroke="${a}" stroke-opacity=".4" stroke-width=".6"/>`}r+=`<path d="M40,130 L80,118 L100,130 L124,116 L160,130" stroke="${a}" stroke-width="1.6" fill="none" opacity=".8"/>`}else(i==="light"||i==="rune")&&(r+=`<path d="M100,20 L100,128 M46,74 L154,74" stroke="${a}" stroke-width=".8" opacity=".6"/>`);return r}var ac=new Map,__=new Set(ic.map(i=>i.id));function Tu(i){return __.has(i.id)?new URL(`./assets/card-art/${i.id}.webp`,import.meta.url).href:(ac.has(i.id)||ac.set(i.id,`data:image/svg+xml,${encodeURIComponent(r_(i))}`),ac.get(i.id))}var ee=768,x_={sylvan:"#547d60",deephold:"#9b7650",westmarch:"#607f99",horde:"#95584d",conclave:"#86719c",hearth:"#a28a54",wilds:"#7b8b90"};function Io(i){let t=document.createElement("canvas");return t.width=ee,t.height=i,[t,t.getContext("2d")]}function Lo(i,t,e,n,s,a=0){i.beginPath(),i.roundRect(t,e,n,s,a)}function Xe(i,t,e,n,s,a="#e4d1a2",r="center",o="Georgia"){i.font=`${s}px ${o}`,i.fillStyle=a,i.textAlign=r,i.fillText(t,e,n)}function Eu(i,t,e,n,s,a,r,o,l=4){i.font=`${a}px Georgia`,i.fillStyle=o,i.textAlign="center";let c="",h=[];for(let u of t.split(" "))i.measureText(c+u).width>s&&c&&(h.push(c.trim()),c=""),c+=u+" ";c&&h.push(c.trim()),h=h.slice(0,l),h.forEach((u,d)=>i.fillText(u,e,n+(d-(h.length-1)/2)*r))}function oc(i,t,e,n,s="#d7ba77"){i.save(),i.translate(t,e),i.scale(n,n),i.strokeStyle=s,i.lineWidth=2,i.beginPath(),i.moveTo(-28,-15),i.lineTo(-15,-4),i.lineTo(0,-25),i.lineTo(15,-4),i.lineTo(28,-15),i.lineTo(21,16),i.lineTo(-21,16),i.closePath(),i.stroke(),i.beginPath(),i.moveTo(-19,8),i.lineTo(19,8),i.moveTo(-12,23),i.lineTo(12,23),i.stroke(),i.restore()}async function Au(i){let t=new Image;return t.src=Tu(i),await t.decode(),t}function Cu(i,t,e,n,s,a){let r=Math.min(s/t.naturalWidth,a/t.naturalHeight),o=t.naturalWidth*r,l=t.naturalHeight*r;i.fillStyle="#f5dfb8",i.fillRect(e,n,s,a),i.drawImage(t,e+(s-o)/2,n+(a-l)/2,o,l)}function lc(i,t,e=7e3){let n=91;for(let s=0;s<e;s++){n=Math.imul(n,1664525)+1013904223>>>0;let a=n%ee;n=Math.imul(n,1664525)+1013904223>>>0;let r=n%t;i.fillStyle=s%2?"#ffffff08":"#0000000a",i.fillRect(a,r,1,1)}}async function cc(i,t=!1){let[n,s]=Io(1229),a=s.createLinearGradient(0,0,ee,1229);a.addColorStop(0,"#3d5646"),a.addColorStop(.35,"#254535"),a.addColorStop(.65,"#183227"),a.addColorStop(1,"#40513b"),s.fillStyle=a,s.fillRect(0,0,ee,1229);for(let r=0;r<ee;r+=8)s.fillStyle=`rgba(230,218,174,${.025+.02*Math.sin(r*.17)})`,s.fillRect(r,0,2,1229);if(s.strokeStyle="#bea267",s.lineWidth=2,Lo(s,32,106,ee-64,1017,5),s.stroke(),Lo(s,43,117,ee-86,995,3),s.strokeStyle="#bea26760",s.stroke(),t){oc(s,ee/2,280,2),Xe(s,"THE SUNDERED CROWN",ee/2,445,37),Eu(s,"Six factions. A fractured kingdom. A collection waiting to be discovered.",ee/2,570,520,29,43,"#d0ceb5"),Xe(s,"10 COLLECTIBLE CARDS",ee/2,755,23),Xe(s,"FIRST EDITION \xB7 SET 01",ee/2,800,20,"#a7b198");for(let r=0;r<300;r+=5)s.fillStyle=r%3?"#e3d8b6":"#b6ab8a",s.fillRect(234+r,910,r%4?2:4,68);Xe(s,"REALMBINDER",ee/2,1030,23)}else{Xe(s,"REALMBINDER",ee/2,190,53),Xe(s,"FIRST EDITION",ee/2,235,17,"#c3c6aa");let r=await Au(i);Cu(s,r,70,320,628,471),s.strokeStyle="#c5ad6d",s.lineWidth=3,s.strokeRect(70,320,628,471),oc(s,ee/2,280,.65),Xe(s,"THE SUNDERED",ee/2,890,52),Xe(s,"CROWN",ee/2,950,60),Xe(s,"10 CARDS  \xB7  SET 01",ee/2,1060,21,"#ccd0b5")}for(let r of[0,1155]){s.fillStyle="#a48b53",s.fillRect(0,r,ee,74);for(let o=0;o<ee;o+=7){let l=s.createLinearGradient(o,0,o+7,0);l.addColorStop(0,"#80704c"),l.addColorStop(.45,"#d5c18b"),l.addColorStop(1,"#97814e"),s.fillStyle=l,s.fillRect(o,r,7,74)}s.fillStyle="#1b2c2180",s.fillRect(0,r+(r===0?64:4),ee,2)}return lc(s,1229),n}async function Ru(i,t){let[n,s]=Io(1073),a=t.gilded?"#d2ac58":x_[i.faction],r=s.createLinearGradient(0,0,ee,1073);r.addColorStop(0,"#e1cf96"),r.addColorStop(.24,a),r.addColorStop(.7,"#263b2c"),r.addColorStop(1,"#b6a577"),s.fillStyle=r,s.fillRect(0,0,ee,1073),Lo(s,22,22,ee-44,1029,12),s.fillStyle="#1b2b22",s.fill(),s.strokeStyle="#b5ab77",s.lineWidth=2,s.stroke(),s.fillStyle=t.gilded?"#d8be7f":"#dfd8bb",s.fillRect(24,24,ee-48,120),s.font="bold 37px Georgia",s.textAlign="left",s.fillStyle="#223329";let o=i.name.split(" "),l="";for(;o.length&&s.measureText(l+o[0]).width<580;)l+=o.shift()+" ";s.fillText(l.trim(),45,o.length?73:96),o.length&&s.fillText(o.join(" "),45,116),s.beginPath(),s.arc(693,82,28,0,Math.PI*2),s.fillStyle="#344d3b",s.fill(),s.strokeStyle="#af9357",s.stroke(),Xe(s,String(i.cost),693,94,31,"#eee1b8");let c=await Au(i);return Cu(s,c,24,145,720,540),s.fillStyle="#ac996d",s.fillRect(24,684,720,2),s.fillStyle="#344333",s.fillRect(24,686,720,60),Xe(s,`${Mu[i.kind]} \xB7 ${Su[i.faction].short}`,46,724,22,"#ddd2af","left","system-ui"),s.save(),s.translate(710,716),s.rotate(Math.PI/4),s.fillStyle=xr[i.rarity].color,s.fillRect(-8,-8,16,16),s.restore(),Eu(s,i.flavor,ee/2,864,625,30,41,"#d5d1b8"),Xe(s,`SC \xB7 ${String(i.num).padStart(3,"0")}/130`,46,1026,19,"#b0b59c","left","system-ui"),i.might!=null&&Xe(s,String(i.might),708,1026,28,"#e7d3a0","right"),(t.foil||t.gilded)&&Xe(s,t.gilded?"GILDED":"FOIL",ee/2,1026,16,"#dec386"),lc(s,1073,5e3),n}function Lu(){let[t,e]=Io(1073);e.fillStyle="#18362b",e.fillRect(0,0,ee,1073);for(let n=-1073;n<ee;n+=27)e.beginPath(),e.moveTo(n,0),e.lineTo(n+1073,1073),e.strokeStyle="#c9b87910",e.lineWidth=1,e.stroke();for(let n of[22,32,47,59])Lo(e,n,n,ee-n*2,1073-n*2,16),e.strokeStyle=n===32?"#d2bb78":"#ab975c70",e.lineWidth=n===32?3:1,e.stroke();for(let n of[230,211,185])e.beginPath(),e.arc(ee/2,1073*.45,n,0,Math.PI*2),e.strokeStyle="#c9b478a0",e.lineWidth=1.5,e.stroke();for(let n=0;n<40;n++){let s=n/40*Math.PI*2;e.save(),e.translate(ee/2+Math.cos(s)*222,1073*.45+Math.sin(s)*222),e.rotate(s),e.fillStyle="#c9b478",e.fillRect(-2,-2,4,4),e.restore()}return oc(e,ee/2,1073*.45,4),Xe(e,"REALMBINDER",ee/2,825,45),Xe(e,"THE SUNDERED CROWN",ee/2,875,19,"#adb99a"),lc(e,1073,5e3),t}function Iu(){let[i,t]=Io(1229);t.fillStyle="#808080",t.fillRect(0,0,ee,1229);for(let e=0;e<ee;e+=3)t.fillStyle=`rgb(${128+Math.round(Math.sin(e*.16)*13)},${128+Math.round(Math.sin(e*.16)*13)},${128+Math.round(Math.sin(e*.16)*13)})`,t.fillRect(e,0,1,1229);for(let e of[0,1155])for(let n=0;n<ee;n+=7)t.fillStyle="#b8b8b8",t.fillRect(n,e,2,74),t.fillStyle="#555",t.fillRect(n+3,e,2,74);return i}var ci=Ci.clamp,hc=i=>i*i*(3-2*i),uc=i=>1-(1-i)**3,Li=2.3,qn=3.68,vr=2.2,Po=vr*88/63;async function H1(i,{feature:t,getStage:e,onTear:n,onFallback:s}){let a;try{a=new bo({antialias:!0,alpha:!0,powerPreference:"low-power"})}catch{return null}let r=new Set,o=g=>(r.add(g),g),l=!1,c=0,h=null,u="sealed",d=null,f=null,_=null,x=null,p=0,m=0,M=!1,w=!1,b=null,A={x:0,y:0},E=a.domElement;E.setAttribute("aria-hidden","true"),i.appendChild(E),a.setPixelRatio(Math.min(devicePixelRatio||1,2)),a.setClearColor(0,0),a.outputColorSpace=He,a.toneMapping=rr,a.toneMappingExposure=1.05,a.shadowMap.enabled=!1,a.shadowMap.type=Pa;try{let wt=function(N){let Z=o(new xi(N));return Z.colorSpace=He,Z.anisotropy=Math.min(a.capabilities.getMaxAnisotropy(),4),Z},st=function(N,Z,ot,Y=!1){let dt=o(new ii(Li,Z-N,48,ot?8:54)),Ct=dt.attributes.position,yt=dt.attributes.uv;for(let ce=0;ce<Ct.count;ce++){let Fe=Ct.getX(ce),Pn=Ct.getY(ce)+(N+Z)/2,us=qn/2-.25,Do=Math.abs(Pn-us)<1e-4,Mr=Math.sin(Fe*67)*.013+Math.sin(Fe*37)*.008,ds=Fe/(Li/2),Dn=Pn/(qn/2),fs=.11*Math.max(0,1-ds**6)*Math.max(.2,1-Math.abs(Dn)**8),Sr=(Math.sin(Fe*47+Pn*4)*.012+Math.sin(Fe*23-Pn*7)*.009)*Math.abs(ds)**3;Ct.setXYZ(ce,Fe,Pn+(Do?Mr:0),(Y?-1:1)*(fs+Sr+.014)),yt.setXY(ce,Y?.5-Fe/Li:.5+Fe/Li,.5+Pn/qn)}dt.computeVertexNormals();let Qt=new pe(dt,Y?Yt:kt);return Qt.castShadow=!0,Qt.receiveShadow=!0,(ot?ft:At).add(Qt),Kt.push({geo:dt,base:Ct.array.slice(),isTop:ot,back:Y}),Qt},Vt=function(){let N=new yi,Z=-vr/2,ot=-Po/2,Y=.055,dt=vr,Ct=Po;return N.moveTo(Z+Y,ot),N.lineTo(Z+dt-Y,ot),N.quadraticCurveTo(Z+dt,ot,Z+dt,ot+Y),N.lineTo(Z+dt,ot+Ct-Y),N.quadraticCurveTo(Z+dt,ot+Ct,Z+dt-Y,ot+Ct),N.lineTo(Z+Y,ot+Ct),N.quadraticCurveTo(Z,ot+Ct,Z,ot+Ct-Y),N.lineTo(Z,ot+Y),N.quadraticCurveTo(Z,ot,Z+Y,ot),N},Ft=function(N=Jt){let Z=new Ze,ot=new pe(D,we);ot.position.z=-.009,Z.add(ot),ot.castShadow=!0;let Y=new pe(qt,N);Y.position.z=.013,Y.castShadow=!0,Z.add(Y);let dt=new pe(qt,Jt);return dt.position.z=-.013,dt.rotation.y=Math.PI,Z.add(dt),Z},$t=function(){d&&(ie.remove(d),d=null),f&&(f.dispose(),r.delete(f),f=null),_&&(_.dispose(),r.delete(_),_=null)},y=function(){if(l)return;let N=i.getBoundingClientRect(),Z=e()?.getBoundingClientRect();if(!Z||!N.width||!N.height)return;a.setSize(N.width,N.height,!1),S.aspect=N.width/N.height;let ot=N.height/Math.max(Z.height,80)*(u==="sealed"||u==="opening"?4.2:3.45);S.position.z=ot/(2*Math.tan(Ci.degToRad(16))),S.updateProjectionMatrix(),O.position.set((Z.x+Z.width/2-N.x-N.width/2)*ot/N.height,-(Z.y+Z.height/2-N.y-N.height/2)*ot/N.height,0),a.render(g,S)},at=function(N,Z){return l?Promise.resolve(!1):(h&&h.resolve(!1),new Promise(ot=>{h={start:performance.now(),duration:N,update:Z,resolve:ot},Z(0),nt()}))},nt=function(){!c&&!l&&!document.hidden&&(c=requestAnimationFrame(pt))},pt=function(N){if(c=0,l)return;if(h){let ot=ci((N-h.start)/h.duration,0,1),Y=h;Y.update(ot),ot===1&&h===Y&&(h=null,Y.resolve(!0))}let Z=!1;if(w&&d&&!h){let ot=Math.min(.04,Math.max(.008,(N-m)/1e3));d.rotation.x=Ci.damp(d.rotation.x,-.035+A.y,14,ot),d.rotation.y=Ci.damp(d.rotation.y,A.x,14,ot),Z=Math.abs(d.rotation.x+.035-A.y)+Math.abs(d.rotation.y-A.x)>1e-4}x&&(J.rotation.y=Ci.damp(J.rotation.y,-.18+p*.23,12,Math.min(.04,(N-m)/1e3))),m=N,a.render(g,S),(h||x||Z)&&nt()},_t=function(N){for(let Z of Kt){if(Z.isTop)continue;let ot=Z.geo.attributes.position;for(let Y=0;Y<ot.count;Y++){let dt=Z.base[Y*3],Ct=Z.base[Y*3+1],yt=Z.base[Y*3+2],Qt=ci((Ct-ct+.55)/.55,0,1);ot.setZ(Y,yt+(Z.back?-1:1)*Qt*N*(.08+.08*Math.cos(dt*4)))}Z.geo.computeVertexNormals(),ot.needsUpdate=!0}},j=function(N){p=N,ft.rotation.z=-N*.12,ft.position.set(N*.1,N*.04,N*.08),_t(N*.35),nt()},et=function(N){if(N.button>0||N.target.closest("button"))return;if(w&&!h){let ot=e().getBoundingClientRect();N.clientX>=ot.left&&N.clientX<=ot.right&&N.clientY>=ot.top&&N.clientY<=ot.bottom&&(x={x:N.clientX,y:N.clientY,id:N.pointerId,kind:"card"},p=0);return}if(u!=="sealed")return;let Z=e().getBoundingClientRect();N.clientY<Z.top||N.clientY>Z.top+Z.height*.42||N.clientX<Z.left||N.clientX>Z.right||(x={x:N.clientX,y:N.clientY,id:N.pointerId},j(0))},mt=function(N){x&&Math.hypot(N.clientX-x.x,N.clientY-x.y)>8&&!Q.hasPointerCapture?.(N.pointerId)&&Q.setPointerCapture?.(N.pointerId),x?.kind==="card"?(p=Math.max(p,Math.abs(N.clientX-x.x)/100,Math.abs(N.clientY-x.y)/100),A.x=ci((N.clientX-x.x)/500,-.15,.15),A.y=ci((N.clientY-x.y)/500,-.12,.12),nt()):x&&j(ci(Math.abs(N.clientX-x.x)/Math.min(170,innerWidth*.38),0,1))},R=function(N){if(!x||x.id!==N.pointerId)return;if(x.kind==="card"){M=p>.08,x=null,A.x=0,A.y=0,nt();return}let Z=p>.6;M=p>.08,x=null,Q.hasPointerCapture?.(N.pointerId)&&Q.releasePointerCapture(N.pointerId),Z?n():at(220,ot=>{j(p*(1-hc(ot))),J.rotation.y=-.18})},g=new _i,S=new Ve(32,1,.1,100),O=new Ze;g.add(O);let I=new ls(a),U=new Eo,k=o(I.fromScene(U,.06));g.environment=k.texture,g.environmentIntensity=.55,U.dispose(),I.dispose();let V=new Si(16769709,1.8);V.position.set(-3,5,5),V.castShadow=!1,V.shadow.mapSize.set(1024,1024),V.shadow.radius=4,V.shadow.normalBias=.025,V.shadow.camera.left=-5,V.shadow.camera.right=5,V.shadow.camera.top=5,V.shadow.camera.bottom=-5,g.add(V);let L=new Si(13232094,.85);L.position.set(4,1,2),g.add(L);let F=new Si(16767633,1.5);F.position.set(-2,3,-3),g.add(F),g.add(new js(15002329,1582619,.6));let X=document.createElement("canvas");X.width=128,X.height=64;let H=X.getContext("2d"),rt=H.createRadialGradient(64,32,1,64,32,62);rt.addColorStop(0,"#00000090"),rt.addColorStop(.4,"#00000050"),rt.addColorStop(1,"#00000000"),H.fillStyle=rt,H.fillRect(0,0,128,64);let q=o(new xi(X)),tt=o(new Qi({map:q,transparent:!0,depthWrite:!1,opacity:.5})),it=new pe(o(new ii(3.7,.6)),tt);it.position.set(0,-2,-.35),O.add(it);let Ut=wt(Lu()),J=new Ze;O.add(J),J.rotation.set(-.045,-.18,-.045);let ft=new Ze;J.add(ft);let At=new Ze;J.add(At);let Ot=wt(await cc(t)),bt=wt(await cc(t,!0)),Bt=o(new xi(Iu())),de=N=>o(new Mi({map:N,bumpMap:Bt,bumpScale:.012,metalness:.48,roughness:.4,clearcoat:.55,clearcoatRoughness:.3,side:an,envMapIntensity:.6})),kt=de(Ot),Yt=de(bt),Kt=[],ct=qn/2-.25;st(-qn/2,ct,!1),st(-qn/2,ct,!1,!0),st(ct,qn/2,!0),st(ct,qn/2,!0,!0);let ut=o(new Cn({color:11968876,metalness:.7,roughness:.38})),Rt=o(new En(.025,qn-.12,.038));for(let N of[-Li/2,Li/2]){let Z=new pe(Rt,ut);Z.position.x=N,At.add(Z)}let xt=new pe(o(new zs(.045,.1,3)),ut);xt.position.set(-Li/2,ct+.05,.035),xt.rotation.z=-Math.PI/2,J.add(xt);let Dt=Vt(),qt=o(new Js(Dt,16)),ne=qt.attributes.uv,se=qt.attributes.position;for(let N=0;N<se.count;N++)ne.setXY(N,(se.getX(N)+vr/2)/vr,(se.getY(N)+Po/2)/Po);let D=o(new Ys(Dt,{depth:.017,steps:1,bevelEnabled:!0,bevelSegments:2,bevelSize:.003,bevelThickness:.003,curveSegments:12})),we=o(new Cn({color:13223337,roughness:.8})),Jt=o(new Mi({map:Ut,roughness:.65,clearcoat:.18,clearcoatRoughness:.55,metalness:.02,envMapIntensity:.3})),ie=new Ze;O.add(ie),ie.rotation.y=Math.PI+.05;let ht=new Ze;ie.add(ht),ht.visible=!1;let ge=[];for(let N=0;N<9;N++){let Z=Ft();Z.position.set((N+1)*.014,-(N+1)*.012,-(N+1)*.025),Z.rotation.z=-(N+1)*.003,ht.add(Z),ge.push(Z)}async function T(N,Z){let ot=await Ru(N,Z);if(l)return null;let Y=wt(ot),dt=o(new Mi({map:Y,roughness:Z.foil?.43:.65,metalness:Z.gilded?.55:Z.foil?.22:.01,clearcoat:Z.foil?.18:0,clearcoatRoughness:.55,envMapIntensity:Z.foil?.3:.12,color:14540253,iridescence:Z.foil?.65:0,iridescenceIOR:1.4,iridescenceThicknessRange:[120,400]}));return{uid:Z.uid,map:Y,material:dt}}let z=new ResizeObserver(y);z.observe(i);let Q=i.parentElement;Q.addEventListener("pointerdown",et),Q.addEventListener("pointermove",mt),Q.addEventListener("pointerup",R);let K=()=>{x=null,A.x=0,A.y=0,j(0)};Q.addEventListener("pointercancel",K);let gt=N=>{N.preventDefault(),l||s()};E.addEventListener("webglcontextlost",gt);let lt=()=>{document.hidden?(c&&cancelAnimationFrame(c),c=0):(y(),nt())};return document.addEventListener("visibilitychange",lt),y(),a.render(g,S),{consumeGesture(){let N=M;return M=!1,N},resize:y,async tear(){if(l)return!1;u="opening",x=null;let N=ft.position.clone(),Z=ft.rotation.z,ot=await at(1650,Y=>{let dt=hc(ci(Y/.45,0,1)),Ct=uc(ci((Y-.45)/.55,0,1));ft.position.set(N.x+dt*.7+Ct*2.4,N.y+dt*.42-Ct*2.2,dt*.25+Ct*.55),ft.rotation.set(-dt*.3,Ct*1.8,Z-dt*.32-Ct*1.2),_t(dt),J.rotation.y=-.18+dt*.1,At.position.set(Ct*.7,-Ct*4.8,Ct*.2),At.rotation.z=Ct*.24,ht.visible=Y>.35,ht.position.set(0,-.65+uc(ci((Y-.35)/.65,0,1))*.65,.05),ht.rotation.x=.02*(1-Ct)});return ot&&(J.visible=!1,u="cards"),ot},async deal(N,Z,ot,Y=!1,dt=null){if(l)return!1;u="cards",w=!1,A.x=0,A.y=0,$t();let Ct=b?.uid===Z.uid?b:await T(N,Z);if(!Ct||l)return!1;if(b=null,f=Ct.map,_=Ct.material,d=Ft(_),ie.add(d),d.rotation.set(-.035,0,-.018),d.position.set(-.08,-.08,.22),ie.rotation.set(0,Y?Math.PI*2:Math.PI+.05,0),ie.position.set(0,0,0),J.visible=!1,ht.visible=ot>0,ge.forEach((Qt,ce)=>Qt.visible=ce<ot),dt){if(b=await T(dt.card,dt.copy),!b||l)return!1;ge[0].children[1].material=b.material}y();let yt=await at(240,Qt=>{let ce=uc(Qt);d.position.set(-.08*(1-ce),-.08*(1-ce),.22),d.rotation.z=-.018*(1-ce)});return yt&&(w=Y),yt},async flip(){if(!d||l)return!1;let N=await at(750,Z=>{let ot=hc(Z),Y=Math.sin(Z*Math.PI);ie.rotation.set(Y*.09,Math.PI+.05+ot*(Math.PI-.05),-Y*.025),ie.position.set(-Y*.08,Y*.08,Y*.48),tt.opacity=.5-Y*.15});return N&&(w=!0),N},next(){if(w=!1,x=null,!d||l)return Promise.resolve(!1);let N=d;return at(430,Z=>{let ot=Z*Z;N.position.set(ot*4.8,-ot*1.7,.22+Math.sin(Z*Math.PI)*.5),N.rotation.z=-ot*.4,N.rotation.y=ot*.5})},dispose(){if(!l){l=!0,c&&cancelAnimationFrame(c),h&&(h.resolve(!1),h=null),z.disconnect(),Q.removeEventListener("pointerdown",et),Q.removeEventListener("pointermove",mt),Q.removeEventListener("pointerup",R),Q.removeEventListener("pointercancel",K),document.removeEventListener("visibilitychange",lt),E.removeEventListener("webglcontextlost",gt);for(let N of r)N.dispose();r.clear(),V.shadow.dispose(),a.dispose(),a.forceContextLoss(),E.remove()}}}}catch{for(let g of r)g.dispose();return r.clear(),a.dispose(),a.forceContextLoss(),E.remove(),null}}export{H1 as createOpener3D};
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
