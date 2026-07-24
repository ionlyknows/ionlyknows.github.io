(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const n of a)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&r(o)}).observe(document,{childList:!0,subtree:!0});function t(a){const n={};return a.integrity&&(n.integrity=a.integrity),a.referrerPolicy&&(n.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?n.credentials="include":a.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(a){if(a.ep)return;a.ep=!0;const n=t(a);fetch(a.href,n)}})();(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))t(r);new MutationObserver(r=>{for(const a of r)if(a.type==="childList")for(const n of a.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&t(n)}).observe(document,{childList:!0,subtree:!0});function e(r){const a={};return r.integrity&&(a.integrity=r.integrity),r.referrerPolicy&&(a.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?a.credentials="include":r.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function t(r){if(r.ep)return;r.ep=!0;const a=e(r);fetch(r.href,a)}})();/**
* @license
* Copyright 2010-2024 Three.js Authors
* SPDX-License-Identifier: MIT
*/const _n="166",So=0,Fn=1,Eo=2,Os=1,To=2,Wt=3,sr=0,mt=1,Xt=2,ar=0,Yr=1,Bn=2,zn=3,Hn=4,yo=5,vr=100,bo=101,Ao=102,wo=103,Ro=104,Co=200,Po=201,Lo=202,Uo=203,Oa=204,Fa=205,Io=206,Do=207,No=208,Oo=209,Fo=210,Bo=211,zo=212,Ho=213,Vo=214,ko=0,Go=1,Wo=2,ji=3,Xo=4,qo=5,jo=6,Yo=7,Fs=0,Ko=1,Zo=2,nr=0,Jo=1,$o=2,Qo=3,el=4,tl=5,rl=6,il=7,Bs=300,Jr=301,$r=302,Ba=303,za=304,Qi=306,Ha=1e3,Mr=1001,Va=1002,yt=1003,al=1004,vi=1005,Ct=1006,la=1007,Sr=1008,Yt=1009,zs=1010,Hs=1011,ci=1012,vn=1013,Tr=1014,qt=1015,hi=1016,xn=1017,Mn=1018,Qr=1020,Vs=35902,ks=1021,Gs=1022,Pt=1023,Ws=1024,Xs=1025,Kr=1026,ei=1027,qs=1028,Sn=1029,js=1030,En=1031,Tn=1033,Vi=33776,ki=33777,Gi=33778,Wi=33779,ka=35840,Ga=35841,Wa=35842,Xa=35843,qa=36196,ja=37492,Ya=37496,Ka=37808,Za=37809,Ja=37810,$a=37811,Qa=37812,en=37813,tn=37814,rn=37815,an=37816,nn=37817,sn=37818,on=37819,ln=37820,cn=37821,Xi=36492,hn=36494,un=36495,Ys=36283,dn=36284,pn=36285,fn=36286,nl=3200,sl=3201,ol=0,ll=1,ir="",Ut="srgb",or="srgb-linear",yn="display-p3",ea="display-p3-linear",Yi="linear",Xe="srgb",Ki="rec709",Zi="p3",Rr=7680,Vn=519,cl=512,hl=513,ul=514,Ks=515,dl=516,pl=517,fl=518,ml=519,kn=35044,Gn="300 es",jt=2e3,Ji=2001;class br{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const r=this._listeners;r[e]===void 0&&(r[e]=[]),r[e].indexOf(t)===-1&&r[e].push(t)}hasEventListener(e,t){if(this._listeners===void 0)return!1;const r=this._listeners;return r[e]!==void 0&&r[e].indexOf(t)!==-1}removeEventListener(e,t){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const a=r.indexOf(t);a!==-1&&r.splice(a,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const t=this._listeners[e.type];if(t!==void 0){e.target=this;const r=t.slice(0);for(let a=0,n=r.length;a<n;a++)r[a].call(this,e);e.target=null}}}const ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ca=Math.PI/180,mn=180/Math.PI;function ui(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,r=Math.random()*4294967295|0;return(ct[i&255]+ct[i>>8&255]+ct[i>>16&255]+ct[i>>24&255]+"-"+ct[e&255]+ct[e>>8&255]+"-"+ct[e>>16&15|64]+ct[e>>24&255]+"-"+ct[t&63|128]+ct[t>>8&255]+"-"+ct[t>>16&255]+ct[t>>24&255]+ct[r&255]+ct[r>>8&255]+ct[r>>16&255]+ct[r>>24&255]).toLowerCase()}function ft(i,e,t){return Math.max(e,Math.min(t,i))}function gl(i,e){return(i%e+e)%e}function ha(i,e,t){return(1-t)*i+t*e}function ii(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function pt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}class Be{constructor(e=0,t=0){Be.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,r=this.y,a=e.elements;return this.x=a[0]*t+a[3]*r+a[6],this.y=a[1]*t+a[4]*r+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(ft(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y;return t*t+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const r=Math.cos(t),a=Math.sin(t),n=this.x-e.x,o=this.y-e.y;return this.x=n*r-o*a+e.x,this.y=n*a+o*r+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Pe{constructor(e,t,r,a,n,o,s,l,c){Pe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,r,a,n,o,s,l,c)}set(e,t,r,a,n,o,s,l,c){const u=this.elements;return u[0]=e,u[1]=a,u[2]=s,u[3]=t,u[4]=n,u[5]=l,u[6]=r,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],this}extractBasis(e,t,r){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),r.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,n=this.elements,o=r[0],s=r[3],l=r[6],c=r[1],u=r[4],f=r[7],p=r[2],m=r[5],x=r[8],M=a[0],d=a[3],h=a[6],b=a[1],E=a[4],y=a[7],B=a[2],R=a[5],w=a[8];return n[0]=o*M+s*b+l*B,n[3]=o*d+s*E+l*R,n[6]=o*h+s*y+l*w,n[1]=c*M+u*b+f*B,n[4]=c*d+u*E+f*R,n[7]=c*h+u*y+f*w,n[2]=p*M+m*b+x*B,n[5]=p*d+m*E+x*R,n[8]=p*h+m*y+x*w,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[1],a=e[2],n=e[3],o=e[4],s=e[5],l=e[6],c=e[7],u=e[8];return t*o*u-t*s*c-r*n*u+r*s*l+a*n*c-a*o*l}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],n=e[3],o=e[4],s=e[5],l=e[6],c=e[7],u=e[8],f=u*o-s*c,p=s*l-u*n,m=c*n-o*l,x=t*f+r*p+a*m;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const M=1/x;return e[0]=f*M,e[1]=(a*c-u*r)*M,e[2]=(s*r-a*o)*M,e[3]=p*M,e[4]=(u*t-a*l)*M,e[5]=(a*n-s*t)*M,e[6]=m*M,e[7]=(r*l-c*t)*M,e[8]=(o*t-r*n)*M,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,r,a,n,o,s){const l=Math.cos(n),c=Math.sin(n);return this.set(r*l,r*c,-r*(l*o+c*s)+o+e,-a*c,a*l,-a*(-c*o+l*s)+s+t,0,0,1),this}scale(e,t){return this.premultiply(ua.makeScale(e,t)),this}rotate(e){return this.premultiply(ua.makeRotation(-e)),this}translate(e,t){return this.premultiply(ua.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,r,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<9;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<9;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const ua=new Pe;function Zs(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function $i(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function _l(){const i=$i("canvas");return i.style.display="block",i}const Wn={};function Js(i){i in Wn||(Wn[i]=!0,console.warn(i))}function vl(i,e,t){return new Promise(function(r,a){function n(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:a();break;case i.TIMEOUT_EXPIRED:setTimeout(n,t);break;default:r()}}setTimeout(n,t)})}const Xn=new Pe().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),qn=new Pe().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),xi={[or]:{transfer:Yi,primaries:Ki,toReference:i=>i,fromReference:i=>i},[Ut]:{transfer:Xe,primaries:Ki,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[ea]:{transfer:Yi,primaries:Zi,toReference:i=>i.applyMatrix3(qn),fromReference:i=>i.applyMatrix3(Xn)},[yn]:{transfer:Xe,primaries:Zi,toReference:i=>i.convertSRGBToLinear().applyMatrix3(qn),fromReference:i=>i.applyMatrix3(Xn).convertLinearToSRGB()}},xl=new Set([or,ea]),Ve={enabled:!0,_workingColorSpace:or,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!xl.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,e,t){if(this.enabled===!1||e===t||!e||!t)return i;const r=xi[e].toReference,a=xi[t].fromReference;return a(r(i))},fromWorkingColorSpace:function(i,e){return this.convert(i,this._workingColorSpace,e)},toWorkingColorSpace:function(i,e){return this.convert(i,e,this._workingColorSpace)},getPrimaries:function(i){return xi[i].primaries},getTransfer:function(i){return i===ir?Yi:xi[i].transfer}};function Zr(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function da(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let Cr;class Ml{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let t;if(e instanceof HTMLCanvasElement)t=e;else{Cr===void 0&&(Cr=$i("canvas")),Cr.width=e.width,Cr.height=e.height;const r=Cr.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),t=Cr}return t.width>2048||t.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),t.toDataURL("image/jpeg",.6)):t.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=$i("canvas");t.width=e.width,t.height=e.height;const r=t.getContext("2d");r.drawImage(e,0,0,e.width,e.height);const a=r.getImageData(0,0,e.width,e.height),n=a.data;for(let o=0;o<n.length;o++)n[o]=Zr(n[o]/255)*255;return r.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let r=0;r<t.length;r++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[r]=Math.floor(Zr(t[r]/255)*255):t[r]=Zr(t[r]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Sl=0;class $s{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Sl++}),this.uuid=ui(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const r={uuid:this.uuid,url:""},a=this.data;if(a!==null){let n;if(Array.isArray(a)){n=[];for(let o=0,s=a.length;o<s;o++)a[o].isDataTexture?n.push(pa(a[o].image)):n.push(pa(a[o]))}else n=pa(a);r.url=n}return t||(e.images[this.uuid]=r),r}}function pa(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Ml.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let El=0;class gt extends br{constructor(e=gt.DEFAULT_IMAGE,t=gt.DEFAULT_MAPPING,r=Mr,a=Mr,n=Ct,o=Sr,s=Pt,l=Yt,c=gt.DEFAULT_ANISOTROPY,u=ir){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:El++}),this.uuid=ui(),this.name="",this.source=new $s(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=r,this.wrapT=a,this.magFilter=n,this.minFilter=o,this.anisotropy=c,this.format=s,this.internalFormat=null,this.type=l,this.offset=new Be(0,0),this.repeat=new Be(1,1),this.center=new Be(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Pe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const r={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(r.userData=this.userData),t||(e.textures[this.uuid]=r),r}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Bs)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Ha:e.x=e.x-Math.floor(e.x);break;case Mr:e.x=e.x<0?0:1;break;case Va:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Ha:e.y=e.y-Math.floor(e.y);break;case Mr:e.y=e.y<0?0:1;break;case Va:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}gt.DEFAULT_IMAGE=null;gt.DEFAULT_MAPPING=Bs;gt.DEFAULT_ANISOTROPY=1;class ot{constructor(e=0,t=0,r=0,a=1){ot.prototype.isVector4=!0,this.x=e,this.y=t,this.z=r,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,r,a){return this.x=e,this.y=t,this.z=r,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,n=this.w,o=e.elements;return this.x=o[0]*t+o[4]*r+o[8]*a+o[12]*n,this.y=o[1]*t+o[5]*r+o[9]*a+o[13]*n,this.z=o[2]*t+o[6]*r+o[10]*a+o[14]*n,this.w=o[3]*t+o[7]*r+o[11]*a+o[15]*n,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,r,a,n;const o=e.elements,s=o[0],l=o[4],c=o[8],u=o[1],f=o[5],p=o[9],m=o[2],x=o[6],M=o[10];if(Math.abs(l-u)<.01&&Math.abs(c-m)<.01&&Math.abs(p-x)<.01){if(Math.abs(l+u)<.1&&Math.abs(c+m)<.1&&Math.abs(p+x)<.1&&Math.abs(s+f+M-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const h=(s+1)/2,b=(f+1)/2,E=(M+1)/2,y=(l+u)/4,B=(c+m)/4,R=(p+x)/4;return h>b&&h>E?h<.01?(r=0,a=.707106781,n=.707106781):(r=Math.sqrt(h),a=y/r,n=B/r):b>E?b<.01?(r=.707106781,a=0,n=.707106781):(a=Math.sqrt(b),r=y/a,n=R/a):E<.01?(r=.707106781,a=.707106781,n=0):(n=Math.sqrt(E),r=B/n,a=R/n),this.set(r,a,n,t),this}let d=Math.sqrt((x-p)*(x-p)+(c-m)*(c-m)+(u-l)*(u-l));return Math.abs(d)<.001&&(d=1),this.x=(x-p)/d,this.y=(c-m)/d,this.z=(u-l)/d,this.w=Math.acos((s+f+M-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this.w=Math.max(e.w,Math.min(t.w,this.w)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this.w=Math.max(e,Math.min(t,this.w)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this.w=e.w+(t.w-e.w)*r,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Tl extends br{constructor(e=1,t=1,r={}){super(),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=1,this.scissor=new ot(0,0,e,t),this.scissorTest=!1,this.viewport=new ot(0,0,e,t);const a={width:e,height:t,depth:1};r=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ct,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},r);const n=new gt(a,r.mapping,r.wrapS,r.wrapT,r.magFilter,r.minFilter,r.format,r.type,r.anisotropy,r.colorSpace);n.flipY=!1,n.generateMipmaps=r.generateMipmaps,n.internalFormat=r.internalFormat,this.textures=[];const o=r.count;for(let s=0;s<o;s++)this.textures[s]=n.clone(),this.textures[s].isRenderTargetTexture=!0;this.depthBuffer=r.depthBuffer,this.stencilBuffer=r.stencilBuffer,this.resolveDepthBuffer=r.resolveDepthBuffer,this.resolveStencilBuffer=r.resolveStencilBuffer,this.depthTexture=r.depthTexture,this.samples=r.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,t,r=1){if(this.width!==e||this.height!==t||this.depth!==r){this.width=e,this.height=t,this.depth=r;for(let a=0,n=this.textures.length;a<n;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=r;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let r=0,a=e.textures.length;r<a;r++)this.textures[r]=e.textures[r].clone(),this.textures[r].isRenderTargetTexture=!0;const t=Object.assign({},e.texture.image);return this.texture.source=new $s(t),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class yr extends Tl{constructor(e=1,t=1,r={}){super(e,t,r),this.isWebGLRenderTarget=!0}}class Qs extends gt{constructor(e=null,t=1,r=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=yt,this.minFilter=yt,this.wrapR=Mr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class yl extends gt{constructor(e=null,t=1,r=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:r,depth:a},this.magFilter=yt,this.minFilter=yt,this.wrapR=Mr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class di{constructor(e=0,t=0,r=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=r,this._w=a}static slerpFlat(e,t,r,a,n,o,s){let l=r[a+0],c=r[a+1],u=r[a+2],f=r[a+3];const p=n[o+0],m=n[o+1],x=n[o+2],M=n[o+3];if(s===0){e[t+0]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f;return}if(s===1){e[t+0]=p,e[t+1]=m,e[t+2]=x,e[t+3]=M;return}if(f!==M||l!==p||c!==m||u!==x){let d=1-s;const h=l*p+c*m+u*x+f*M,b=h>=0?1:-1,E=1-h*h;if(E>Number.EPSILON){const B=Math.sqrt(E),R=Math.atan2(B,h*b);d=Math.sin(d*R)/B,s=Math.sin(s*R)/B}const y=s*b;if(l=l*d+p*y,c=c*d+m*y,u=u*d+x*y,f=f*d+M*y,d===1-s){const B=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=B,c*=B,u*=B,f*=B}}e[t]=l,e[t+1]=c,e[t+2]=u,e[t+3]=f}static multiplyQuaternionsFlat(e,t,r,a,n,o){const s=r[a],l=r[a+1],c=r[a+2],u=r[a+3],f=n[o],p=n[o+1],m=n[o+2],x=n[o+3];return e[t]=s*x+u*f+l*m-c*p,e[t+1]=l*x+u*p+c*f-s*m,e[t+2]=c*x+u*m+s*p-l*f,e[t+3]=u*x-s*f-l*p-c*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,r,a){return this._x=e,this._y=t,this._z=r,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const r=e._x,a=e._y,n=e._z,o=e._order,s=Math.cos,l=Math.sin,c=s(r/2),u=s(a/2),f=s(n/2),p=l(r/2),m=l(a/2),x=l(n/2);switch(o){case"XYZ":this._x=p*u*f+c*m*x,this._y=c*m*f-p*u*x,this._z=c*u*x+p*m*f,this._w=c*u*f-p*m*x;break;case"YXZ":this._x=p*u*f+c*m*x,this._y=c*m*f-p*u*x,this._z=c*u*x-p*m*f,this._w=c*u*f+p*m*x;break;case"ZXY":this._x=p*u*f-c*m*x,this._y=c*m*f+p*u*x,this._z=c*u*x+p*m*f,this._w=c*u*f-p*m*x;break;case"ZYX":this._x=p*u*f-c*m*x,this._y=c*m*f+p*u*x,this._z=c*u*x-p*m*f,this._w=c*u*f+p*m*x;break;case"YZX":this._x=p*u*f+c*m*x,this._y=c*m*f+p*u*x,this._z=c*u*x-p*m*f,this._w=c*u*f-p*m*x;break;case"XZY":this._x=p*u*f-c*m*x,this._y=c*m*f-p*u*x,this._z=c*u*x+p*m*f,this._w=c*u*f+p*m*x;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const r=t/2,a=Math.sin(r);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(r),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,r=t[0],a=t[4],n=t[8],o=t[1],s=t[5],l=t[9],c=t[2],u=t[6],f=t[10],p=r+s+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(u-l)*m,this._y=(n-c)*m,this._z=(o-a)*m}else if(r>s&&r>f){const m=2*Math.sqrt(1+r-s-f);this._w=(u-l)/m,this._x=.25*m,this._y=(a+o)/m,this._z=(n+c)/m}else if(s>f){const m=2*Math.sqrt(1+s-r-f);this._w=(n-c)/m,this._x=(a+o)/m,this._y=.25*m,this._z=(l+u)/m}else{const m=2*Math.sqrt(1+f-r-s);this._w=(o-a)/m,this._x=(n+c)/m,this._y=(l+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let r=e.dot(t)+1;return r<Number.EPSILON?(r=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=r):(this._x=0,this._y=-e.z,this._z=e.y,this._w=r)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=r),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ft(this.dot(e),-1,1)))}rotateTowards(e,t){const r=this.angleTo(e);if(r===0)return this;const a=Math.min(1,t/r);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const r=e._x,a=e._y,n=e._z,o=e._w,s=t._x,l=t._y,c=t._z,u=t._w;return this._x=r*u+o*s+a*c-n*l,this._y=a*u+o*l+n*s-r*c,this._z=n*u+o*c+r*l-a*s,this._w=o*u-r*s-a*l-n*c,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);const r=this._x,a=this._y,n=this._z,o=this._w;let s=o*e._w+r*e._x+a*e._y+n*e._z;if(s<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,s=-s):this.copy(e),s>=1)return this._w=o,this._x=r,this._y=a,this._z=n,this;const l=1-s*s;if(l<=Number.EPSILON){const m=1-t;return this._w=m*o+t*this._w,this._x=m*r+t*this._x,this._y=m*a+t*this._y,this._z=m*n+t*this._z,this.normalize(),this}const c=Math.sqrt(l),u=Math.atan2(c,s),f=Math.sin((1-t)*u)/c,p=Math.sin(t*u)/c;return this._w=o*f+this._w*p,this._x=r*f+this._x*p,this._y=a*f+this._y*p,this._z=n*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,t,r){return this.copy(e).slerp(t,r)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),r=Math.random(),a=Math.sqrt(1-r),n=Math.sqrt(r);return this.set(a*Math.sin(e),a*Math.cos(e),n*Math.sin(t),n*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class O{constructor(e=0,t=0,r=0){O.prototype.isVector3=!0,this.x=e,this.y=t,this.z=r}set(e,t,r){return r===void 0&&(r=this.z),this.x=e,this.y=t,this.z=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(jn.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(jn.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,r=this.y,a=this.z,n=e.elements;return this.x=n[0]*t+n[3]*r+n[6]*a,this.y=n[1]*t+n[4]*r+n[7]*a,this.z=n[2]*t+n[5]*r+n[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,r=this.y,a=this.z,n=e.elements,o=1/(n[3]*t+n[7]*r+n[11]*a+n[15]);return this.x=(n[0]*t+n[4]*r+n[8]*a+n[12])*o,this.y=(n[1]*t+n[5]*r+n[9]*a+n[13])*o,this.z=(n[2]*t+n[6]*r+n[10]*a+n[14])*o,this}applyQuaternion(e){const t=this.x,r=this.y,a=this.z,n=e.x,o=e.y,s=e.z,l=e.w,c=2*(o*a-s*r),u=2*(s*t-n*a),f=2*(n*r-o*t);return this.x=t+l*c+o*f-s*u,this.y=r+l*u+s*c-n*f,this.z=a+l*f+n*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,r=this.y,a=this.z,n=e.elements;return this.x=n[0]*t+n[4]*r+n[8]*a,this.y=n[1]*t+n[5]*r+n[9]*a,this.z=n[2]*t+n[6]*r+n[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=Math.max(e.x,Math.min(t.x,this.x)),this.y=Math.max(e.y,Math.min(t.y,this.y)),this.z=Math.max(e.z,Math.min(t.z,this.z)),this}clampScalar(e,t){return this.x=Math.max(e,Math.min(t,this.x)),this.y=Math.max(e,Math.min(t,this.y)),this.z=Math.max(e,Math.min(t,this.z)),this}clampLength(e,t){const r=this.length();return this.divideScalar(r||1).multiplyScalar(Math.max(e,Math.min(t,r)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,r){return this.x=e.x+(t.x-e.x)*r,this.y=e.y+(t.y-e.y)*r,this.z=e.z+(t.z-e.z)*r,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const r=e.x,a=e.y,n=e.z,o=t.x,s=t.y,l=t.z;return this.x=a*l-n*s,this.y=n*o-r*l,this.z=r*s-a*o,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const r=e.dot(this)/t;return this.copy(e).multiplyScalar(r)}projectOnPlane(e){return fa.copy(this).projectOnVector(e),this.sub(fa)}reflect(e){return this.sub(fa.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const r=this.dot(e)/t;return Math.acos(ft(r,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,r=this.y-e.y,a=this.z-e.z;return t*t+r*r+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,r){const a=Math.sin(t)*e;return this.x=a*Math.sin(r),this.y=Math.cos(t)*e,this.z=a*Math.cos(r),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,r){return this.x=e*Math.sin(t),this.y=r,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),r=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=r,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,r=Math.sqrt(1-t*t);return this.x=r*Math.cos(e),this.y=t,this.z=r*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const fa=new O,jn=new di;class pi{constructor(e=new O(1/0,1/0,1/0),t=new O(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t+=3)this.expandByPoint(At.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,r=e.count;t<r;t++)this.expandByPoint(At.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,r=e.length;t<r;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const r=At.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(r),this.max.copy(e).add(r),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const r=e.geometry;if(r!==void 0){const n=r.getAttribute("position");if(t===!0&&n!==void 0&&e.isInstancedMesh!==!0)for(let o=0,s=n.count;o<s;o++)e.isMesh===!0?e.getVertexPosition(o,At):At.fromBufferAttribute(n,o),At.applyMatrix4(e.matrixWorld),this.expandByPoint(At);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Mi.copy(e.boundingBox)):(r.boundingBox===null&&r.computeBoundingBox(),Mi.copy(r.boundingBox)),Mi.applyMatrix4(e.matrixWorld),this.union(Mi)}const a=e.children;for(let n=0,o=a.length;n<o;n++)this.expandByObject(a[n],t);return this}containsPoint(e){return!(e.x<this.min.x||e.x>this.max.x||e.y<this.min.y||e.y>this.max.y||e.z<this.min.z||e.z>this.max.z)}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return!(e.max.x<this.min.x||e.min.x>this.max.x||e.max.y<this.min.y||e.min.y>this.max.y||e.max.z<this.min.z||e.min.z>this.max.z)}intersectsSphere(e){return this.clampPoint(e.center,At),At.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,r;return e.normal.x>0?(t=e.normal.x*this.min.x,r=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,r=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,r+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,r+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,r+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,r+=e.normal.z*this.min.z),t<=-e.constant&&r>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ai),Si.subVectors(this.max,ai),Pr.subVectors(e.a,ai),Lr.subVectors(e.b,ai),Ur.subVectors(e.c,ai),Jt.subVectors(Lr,Pr),$t.subVectors(Ur,Lr),hr.subVectors(Pr,Ur);let t=[0,-Jt.z,Jt.y,0,-$t.z,$t.y,0,-hr.z,hr.y,Jt.z,0,-Jt.x,$t.z,0,-$t.x,hr.z,0,-hr.x,-Jt.y,Jt.x,0,-$t.y,$t.x,0,-hr.y,hr.x,0];return!ma(t,Pr,Lr,Ur,Si)||(t=[1,0,0,0,1,0,0,0,1],!ma(t,Pr,Lr,Ur,Si))?!1:(Ei.crossVectors(Jt,$t),t=[Ei.x,Ei.y,Ei.z],ma(t,Pr,Lr,Ur,Si))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,At).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(At).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(zt[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),zt[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),zt[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),zt[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),zt[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),zt[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),zt[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),zt[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(zt),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const zt=[new O,new O,new O,new O,new O,new O,new O,new O],At=new O,Mi=new pi,Pr=new O,Lr=new O,Ur=new O,Jt=new O,$t=new O,hr=new O,ai=new O,Si=new O,Ei=new O,ur=new O;function ma(i,e,t,r,a){for(let n=0,o=i.length-3;n<=o;n+=3){ur.fromArray(i,n);const s=a.x*Math.abs(ur.x)+a.y*Math.abs(ur.y)+a.z*Math.abs(ur.z),l=e.dot(ur),c=t.dot(ur),u=r.dot(ur);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>s)return!1}return!0}const bl=new pi,ni=new O,ga=new O;class bn{constructor(e=new O,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const r=this.center;t!==void 0?r.copy(t):bl.setFromPoints(e).getCenter(r);let a=0;for(let n=0,o=e.length;n<o;n++)a=Math.max(a,r.distanceToSquared(e[n]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const r=this.center.distanceToSquared(e);return t.copy(e),r>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ni.subVectors(e,this.center);const t=ni.lengthSq();if(t>this.radius*this.radius){const r=Math.sqrt(t),a=(r-this.radius)*.5;this.center.addScaledVector(ni,a/r),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(ga.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ni.copy(e.center).add(ga)),this.expandByPoint(ni.copy(e.center).sub(ga))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const Ht=new O,_a=new O,Ti=new O,Qt=new O,va=new O,yi=new O,xa=new O;class Al{constructor(e=new O,t=new O(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Ht)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const r=t.dot(this.direction);return r<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,r)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Ht.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Ht.copy(this.origin).addScaledVector(this.direction,t),Ht.distanceToSquared(e))}distanceSqToSegment(e,t,r,a){_a.copy(e).add(t).multiplyScalar(.5),Ti.copy(t).sub(e).normalize(),Qt.copy(this.origin).sub(_a);const n=e.distanceTo(t)*.5,o=-this.direction.dot(Ti),s=Qt.dot(this.direction),l=-Qt.dot(Ti),c=Qt.lengthSq(),u=Math.abs(1-o*o);let f,p,m,x;if(u>0)if(f=o*l-s,p=o*s-l,x=n*u,f>=0)if(p>=-x)if(p<=x){const M=1/u;f*=M,p*=M,m=f*(f+o*p+2*s)+p*(o*f+p+2*l)+c}else p=n,f=Math.max(0,-(o*p+s)),m=-f*f+p*(p+2*l)+c;else p=-n,f=Math.max(0,-(o*p+s)),m=-f*f+p*(p+2*l)+c;else p<=-x?(f=Math.max(0,-(-o*n+s)),p=f>0?-n:Math.min(Math.max(-n,-l),n),m=-f*f+p*(p+2*l)+c):p<=x?(f=0,p=Math.min(Math.max(-n,-l),n),m=p*(p+2*l)+c):(f=Math.max(0,-(o*n+s)),p=f>0?n:Math.min(Math.max(-n,-l),n),m=-f*f+p*(p+2*l)+c);else p=o>0?-n:n,f=Math.max(0,-(o*p+s)),m=-f*f+p*(p+2*l)+c;return r&&r.copy(this.origin).addScaledVector(this.direction,f),a&&a.copy(_a).addScaledVector(Ti,p),m}intersectSphere(e,t){Ht.subVectors(e.center,this.origin);const r=Ht.dot(this.direction),a=Ht.dot(Ht)-r*r,n=e.radius*e.radius;if(a>n)return null;const o=Math.sqrt(n-a),s=r-o,l=r+o;return l<0?null:s<0?this.at(l,t):this.at(s,t)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const r=-(this.origin.dot(e.normal)+e.constant)/t;return r>=0?r:null}intersectPlane(e,t){const r=this.distanceToPlane(e);return r===null?null:this.at(r,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let r,a,n,o,s,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return c>=0?(r=(e.min.x-p.x)*c,a=(e.max.x-p.x)*c):(r=(e.max.x-p.x)*c,a=(e.min.x-p.x)*c),u>=0?(n=(e.min.y-p.y)*u,o=(e.max.y-p.y)*u):(n=(e.max.y-p.y)*u,o=(e.min.y-p.y)*u),r>o||n>a||((n>r||isNaN(r))&&(r=n),(o<a||isNaN(a))&&(a=o),f>=0?(s=(e.min.z-p.z)*f,l=(e.max.z-p.z)*f):(s=(e.max.z-p.z)*f,l=(e.min.z-p.z)*f),r>l||s>a)||((s>r||r!==r)&&(r=s),(l<a||a!==a)&&(a=l),a<0)?null:this.at(r>=0?r:a,t)}intersectsBox(e){return this.intersectBox(e,Ht)!==null}intersectTriangle(e,t,r,a,n){va.subVectors(t,e),yi.subVectors(r,e),xa.crossVectors(va,yi);let o=this.direction.dot(xa),s;if(o>0){if(a)return null;s=1}else if(o<0)s=-1,o=-o;else return null;Qt.subVectors(this.origin,e);const l=s*this.direction.dot(yi.crossVectors(Qt,yi));if(l<0)return null;const c=s*this.direction.dot(va.cross(Qt));if(c<0||l+c>o)return null;const u=-s*Qt.dot(xa);return u<0?null:this.at(u/o,n)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class it{constructor(e,t,r,a,n,o,s,l,c,u,f,p,m,x,M,d){it.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,r,a,n,o,s,l,c,u,f,p,m,x,M,d)}set(e,t,r,a,n,o,s,l,c,u,f,p,m,x,M,d){const h=this.elements;return h[0]=e,h[4]=t,h[8]=r,h[12]=a,h[1]=n,h[5]=o,h[9]=s,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=p,h[3]=m,h[7]=x,h[11]=M,h[15]=d,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new it().fromArray(this.elements)}copy(e){const t=this.elements,r=e.elements;return t[0]=r[0],t[1]=r[1],t[2]=r[2],t[3]=r[3],t[4]=r[4],t[5]=r[5],t[6]=r[6],t[7]=r[7],t[8]=r[8],t[9]=r[9],t[10]=r[10],t[11]=r[11],t[12]=r[12],t[13]=r[13],t[14]=r[14],t[15]=r[15],this}copyPosition(e){const t=this.elements,r=e.elements;return t[12]=r[12],t[13]=r[13],t[14]=r[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,r){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),r.setFromMatrixColumn(this,2),this}makeBasis(e,t,r){return this.set(e.x,t.x,r.x,0,e.y,t.y,r.y,0,e.z,t.z,r.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,r=e.elements,a=1/Ir.setFromMatrixColumn(e,0).length(),n=1/Ir.setFromMatrixColumn(e,1).length(),o=1/Ir.setFromMatrixColumn(e,2).length();return t[0]=r[0]*a,t[1]=r[1]*a,t[2]=r[2]*a,t[3]=0,t[4]=r[4]*n,t[5]=r[5]*n,t[6]=r[6]*n,t[7]=0,t[8]=r[8]*o,t[9]=r[9]*o,t[10]=r[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,r=e.x,a=e.y,n=e.z,o=Math.cos(r),s=Math.sin(r),l=Math.cos(a),c=Math.sin(a),u=Math.cos(n),f=Math.sin(n);if(e.order==="XYZ"){const p=o*u,m=o*f,x=s*u,M=s*f;t[0]=l*u,t[4]=-l*f,t[8]=c,t[1]=m+x*c,t[5]=p-M*c,t[9]=-s*l,t[2]=M-p*c,t[6]=x+m*c,t[10]=o*l}else if(e.order==="YXZ"){const p=l*u,m=l*f,x=c*u,M=c*f;t[0]=p+M*s,t[4]=x*s-m,t[8]=o*c,t[1]=o*f,t[5]=o*u,t[9]=-s,t[2]=m*s-x,t[6]=M+p*s,t[10]=o*l}else if(e.order==="ZXY"){const p=l*u,m=l*f,x=c*u,M=c*f;t[0]=p-M*s,t[4]=-o*f,t[8]=x+m*s,t[1]=m+x*s,t[5]=o*u,t[9]=M-p*s,t[2]=-o*c,t[6]=s,t[10]=o*l}else if(e.order==="ZYX"){const p=o*u,m=o*f,x=s*u,M=s*f;t[0]=l*u,t[4]=x*c-m,t[8]=p*c+M,t[1]=l*f,t[5]=M*c+p,t[9]=m*c-x,t[2]=-c,t[6]=s*l,t[10]=o*l}else if(e.order==="YZX"){const p=o*l,m=o*c,x=s*l,M=s*c;t[0]=l*u,t[4]=M-p*f,t[8]=x*f+m,t[1]=f,t[5]=o*u,t[9]=-s*u,t[2]=-c*u,t[6]=m*f+x,t[10]=p-M*f}else if(e.order==="XZY"){const p=o*l,m=o*c,x=s*l,M=s*c;t[0]=l*u,t[4]=-f,t[8]=c*u,t[1]=p*f+M,t[5]=o*u,t[9]=m*f-x,t[2]=x*f-m,t[6]=s*u,t[10]=M*f+p}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(wl,e,Rl)}lookAt(e,t,r){const a=this.elements;return xt.subVectors(e,t),xt.lengthSq()===0&&(xt.z=1),xt.normalize(),er.crossVectors(r,xt),er.lengthSq()===0&&(Math.abs(r.z)===1?xt.x+=1e-4:xt.z+=1e-4,xt.normalize(),er.crossVectors(r,xt)),er.normalize(),bi.crossVectors(xt,er),a[0]=er.x,a[4]=bi.x,a[8]=xt.x,a[1]=er.y,a[5]=bi.y,a[9]=xt.y,a[2]=er.z,a[6]=bi.z,a[10]=xt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const r=e.elements,a=t.elements,n=this.elements,o=r[0],s=r[4],l=r[8],c=r[12],u=r[1],f=r[5],p=r[9],m=r[13],x=r[2],M=r[6],d=r[10],h=r[14],b=r[3],E=r[7],y=r[11],B=r[15],R=a[0],w=a[4],F=a[8],S=a[12],v=a[1],P=a[5],H=a[9],z=a[13],X=a[2],Y=a[6],k=a[10],Z=a[14],V=a[3],ae=a[7],me=a[11],Me=a[15];return n[0]=o*R+s*v+l*X+c*V,n[4]=o*w+s*P+l*Y+c*ae,n[8]=o*F+s*H+l*k+c*me,n[12]=o*S+s*z+l*Z+c*Me,n[1]=u*R+f*v+p*X+m*V,n[5]=u*w+f*P+p*Y+m*ae,n[9]=u*F+f*H+p*k+m*me,n[13]=u*S+f*z+p*Z+m*Me,n[2]=x*R+M*v+d*X+h*V,n[6]=x*w+M*P+d*Y+h*ae,n[10]=x*F+M*H+d*k+h*me,n[14]=x*S+M*z+d*Z+h*Me,n[3]=b*R+E*v+y*X+B*V,n[7]=b*w+E*P+y*Y+B*ae,n[11]=b*F+E*H+y*k+B*me,n[15]=b*S+E*z+y*Z+B*Me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],r=e[4],a=e[8],n=e[12],o=e[1],s=e[5],l=e[9],c=e[13],u=e[2],f=e[6],p=e[10],m=e[14],x=e[3],M=e[7],d=e[11],h=e[15];return x*(+n*l*f-a*c*f-n*s*p+r*c*p+a*s*m-r*l*m)+M*(+t*l*m-t*c*p+n*o*p-a*o*m+a*c*u-n*l*u)+d*(+t*c*f-t*s*m-n*o*f+r*o*m+n*s*u-r*c*u)+h*(-a*s*u-t*l*f+t*s*p+a*o*f-r*o*p+r*l*u)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,r){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=r),this}invert(){const e=this.elements,t=e[0],r=e[1],a=e[2],n=e[3],o=e[4],s=e[5],l=e[6],c=e[7],u=e[8],f=e[9],p=e[10],m=e[11],x=e[12],M=e[13],d=e[14],h=e[15],b=f*d*c-M*p*c+M*l*m-s*d*m-f*l*h+s*p*h,E=x*p*c-u*d*c-x*l*m+o*d*m+u*l*h-o*p*h,y=u*M*c-x*f*c+x*s*m-o*M*m-u*s*h+o*f*h,B=x*f*l-u*M*l-x*s*p+o*M*p+u*s*d-o*f*d,R=t*b+r*E+a*y+n*B;if(R===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const w=1/R;return e[0]=b*w,e[1]=(M*p*n-f*d*n-M*a*m+r*d*m+f*a*h-r*p*h)*w,e[2]=(s*d*n-M*l*n+M*a*c-r*d*c-s*a*h+r*l*h)*w,e[3]=(f*l*n-s*p*n-f*a*c+r*p*c+s*a*m-r*l*m)*w,e[4]=E*w,e[5]=(u*d*n-x*p*n+x*a*m-t*d*m-u*a*h+t*p*h)*w,e[6]=(x*l*n-o*d*n-x*a*c+t*d*c+o*a*h-t*l*h)*w,e[7]=(o*p*n-u*l*n+u*a*c-t*p*c-o*a*m+t*l*m)*w,e[8]=y*w,e[9]=(x*f*n-u*M*n-x*r*m+t*M*m+u*r*h-t*f*h)*w,e[10]=(o*M*n-x*s*n+x*r*c-t*M*c-o*r*h+t*s*h)*w,e[11]=(u*s*n-o*f*n-u*r*c+t*f*c+o*r*m-t*s*m)*w,e[12]=B*w,e[13]=(u*M*a-x*f*a+x*r*p-t*M*p-u*r*d+t*f*d)*w,e[14]=(x*s*a-o*M*a-x*r*l+t*M*l+o*r*d-t*s*d)*w,e[15]=(o*f*a-u*s*a+u*r*l-t*f*l-o*r*p+t*s*p)*w,this}scale(e){const t=this.elements,r=e.x,a=e.y,n=e.z;return t[0]*=r,t[4]*=a,t[8]*=n,t[1]*=r,t[5]*=a,t[9]*=n,t[2]*=r,t[6]*=a,t[10]*=n,t[3]*=r,t[7]*=a,t[11]*=n,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],r=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,r,a))}makeTranslation(e,t,r){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,r,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),r=Math.sin(e);return this.set(1,0,0,0,0,t,-r,0,0,r,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,0,r,0,0,1,0,0,-r,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),r=Math.sin(e);return this.set(t,-r,0,0,r,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const r=Math.cos(t),a=Math.sin(t),n=1-r,o=e.x,s=e.y,l=e.z,c=n*o,u=n*s;return this.set(c*o+r,c*s-a*l,c*l+a*s,0,c*s+a*l,u*s+r,u*l-a*o,0,c*l-a*s,u*l+a*o,n*l*l+r,0,0,0,0,1),this}makeScale(e,t,r){return this.set(e,0,0,0,0,t,0,0,0,0,r,0,0,0,0,1),this}makeShear(e,t,r,a,n,o){return this.set(1,r,n,0,e,1,o,0,t,a,1,0,0,0,0,1),this}compose(e,t,r){const a=this.elements,n=t._x,o=t._y,s=t._z,l=t._w,c=n+n,u=o+o,f=s+s,p=n*c,m=n*u,x=n*f,M=o*u,d=o*f,h=s*f,b=l*c,E=l*u,y=l*f,B=r.x,R=r.y,w=r.z;return a[0]=(1-(M+h))*B,a[1]=(m+y)*B,a[2]=(x-E)*B,a[3]=0,a[4]=(m-y)*R,a[5]=(1-(p+h))*R,a[6]=(d+b)*R,a[7]=0,a[8]=(x+E)*w,a[9]=(d-b)*w,a[10]=(1-(p+M))*w,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,r){const a=this.elements;let n=Ir.set(a[0],a[1],a[2]).length();const o=Ir.set(a[4],a[5],a[6]).length(),s=Ir.set(a[8],a[9],a[10]).length();this.determinant()<0&&(n=-n),e.x=a[12],e.y=a[13],e.z=a[14],wt.copy(this);const l=1/n,c=1/o,u=1/s;return wt.elements[0]*=l,wt.elements[1]*=l,wt.elements[2]*=l,wt.elements[4]*=c,wt.elements[5]*=c,wt.elements[6]*=c,wt.elements[8]*=u,wt.elements[9]*=u,wt.elements[10]*=u,t.setFromRotationMatrix(wt),r.x=n,r.y=o,r.z=s,this}makePerspective(e,t,r,a,n,o,s=jt){const l=this.elements,c=2*n/(t-e),u=2*n/(r-a),f=(t+e)/(t-e),p=(r+a)/(r-a);let m,x;if(s===jt)m=-(o+n)/(o-n),x=-2*o*n/(o-n);else if(s===Ji)m=-o/(o-n),x=-o*n/(o-n);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+s);return l[0]=c,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=m,l[14]=x,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,t,r,a,n,o,s=jt){const l=this.elements,c=1/(t-e),u=1/(r-a),f=1/(o-n),p=(t+e)*c,m=(r+a)*u;let x,M;if(s===jt)x=(o+n)*f,M=-2*f;else if(s===Ji)x=n*f,M=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+s);return l[0]=2*c,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-m,l[2]=0,l[6]=0,l[10]=M,l[14]=-x,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const t=this.elements,r=e.elements;for(let a=0;a<16;a++)if(t[a]!==r[a])return!1;return!0}fromArray(e,t=0){for(let r=0;r<16;r++)this.elements[r]=e[r+t];return this}toArray(e=[],t=0){const r=this.elements;return e[t]=r[0],e[t+1]=r[1],e[t+2]=r[2],e[t+3]=r[3],e[t+4]=r[4],e[t+5]=r[5],e[t+6]=r[6],e[t+7]=r[7],e[t+8]=r[8],e[t+9]=r[9],e[t+10]=r[10],e[t+11]=r[11],e[t+12]=r[12],e[t+13]=r[13],e[t+14]=r[14],e[t+15]=r[15],e}}const Ir=new O,wt=new it,wl=new O(0,0,0),Rl=new O(1,1,1),er=new O,bi=new O,xt=new O,Yn=new it,Kn=new di;class Ft{constructor(e=0,t=0,r=0,a=Ft.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=r,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,r,a=this._order){return this._x=e,this._y=t,this._z=r,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,r=!0){const a=e.elements,n=a[0],o=a[4],s=a[8],l=a[1],c=a[5],u=a[9],f=a[2],p=a[6],m=a[10];switch(t){case"XYZ":this._y=Math.asin(ft(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-o,n)):(this._x=Math.atan2(p,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ft(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(s,m),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,n),this._z=0);break;case"ZXY":this._x=Math.asin(ft(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,n));break;case"ZYX":this._y=Math.asin(-ft(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(l,n)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(ft(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,n)):(this._x=0,this._y=Math.atan2(s,m));break;case"XZY":this._z=Math.asin(-ft(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(p,c),this._y=Math.atan2(s,n)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,r===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,r){return Yn.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Yn,t,r)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Kn.setFromEuler(this),this.setFromQuaternion(Kn,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Ft.DEFAULT_ORDER="XYZ";class eo{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let Cl=0;const Zn=new O,Dr=new di,Vt=new it,Ai=new O,si=new O,Pl=new O,Ll=new di,Jn=new O(1,0,0),$n=new O(0,1,0),Qn=new O(0,0,1),es={type:"added"},Ul={type:"removed"},Nr={type:"childadded",child:null},Ma={type:"childremoved",child:null};class _t extends br{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Cl++}),this.uuid=ui(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=_t.DEFAULT_UP.clone();const e=new O,t=new Ft,r=new di,a=new O(1,1,1);function n(){r.setFromEuler(t,!1)}function o(){t.setFromQuaternion(r,void 0,!1)}t._onChange(n),r._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:r},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new it},normalMatrix:{value:new Pe}}),this.matrix=new it,this.matrixWorld=new it,this.matrixAutoUpdate=_t.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new eo,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Dr.setFromAxisAngle(e,t),this.quaternion.multiply(Dr),this}rotateOnWorldAxis(e,t){return Dr.setFromAxisAngle(e,t),this.quaternion.premultiply(Dr),this}rotateX(e){return this.rotateOnAxis(Jn,e)}rotateY(e){return this.rotateOnAxis($n,e)}rotateZ(e){return this.rotateOnAxis(Qn,e)}translateOnAxis(e,t){return Zn.copy(e).applyQuaternion(this.quaternion),this.position.add(Zn.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Jn,e)}translateY(e){return this.translateOnAxis($n,e)}translateZ(e){return this.translateOnAxis(Qn,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Vt.copy(this.matrixWorld).invert())}lookAt(e,t,r){e.isVector3?Ai.copy(e):Ai.set(e,t,r);const a=this.parent;this.updateWorldMatrix(!0,!1),si.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Vt.lookAt(si,Ai,this.up):Vt.lookAt(Ai,si,this.up),this.quaternion.setFromRotationMatrix(Vt),a&&(Vt.extractRotation(a.matrixWorld),Dr.setFromRotationMatrix(Vt),this.quaternion.premultiply(Dr.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(es),Nr.child=e,this.dispatchEvent(Nr),Nr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let r=0;r<arguments.length;r++)this.remove(arguments[r]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Ul),Ma.child=e,this.dispatchEvent(Ma),Ma.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Vt.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Vt.multiply(e.parent.matrixWorld)),e.applyMatrix4(Vt),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(es),Nr.child=e,this.dispatchEvent(Nr),Nr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let r=0,a=this.children.length;r<a;r++){const n=this.children[r].getObjectByProperty(e,t);if(n!==void 0)return n}}getObjectsByProperty(e,t,r=[]){this[e]===t&&r.push(this);const a=this.children;for(let n=0,o=a.length;n<o;n++)a[n].getObjectsByProperty(e,t,r);return r}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(si,e,Pl),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(si,Ll,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let r=0,a=t.length;r<a;r++)t[r].updateMatrixWorld(e)}updateWorldMatrix(e,t){const r=this.parent;if(e===!0&&r!==null&&r.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let n=0,o=a.length;n<o;n++)a[n].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",r={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},r.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.visibility=this._visibility,a.active=this._active,a.bounds=this._bounds.map(s=>({boxInitialized:s.boxInitialized,boxMin:s.box.min.toArray(),boxMax:s.box.max.toArray(),sphereInitialized:s.sphereInitialized,sphereRadius:s.sphere.radius,sphereCenter:s.sphere.center.toArray()})),a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.geometryCount=this._geometryCount,a.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere={center:a.boundingSphere.center.toArray(),radius:a.boundingSphere.radius}),this.boundingBox!==null&&(a.boundingBox={min:a.boundingBox.min.toArray(),max:a.boundingBox.max.toArray()}));function n(s,l){return s[l.uuid]===void 0&&(s[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=n(e.geometries,this.geometry);const s=this.geometry.parameters;if(s!==void 0&&s.shapes!==void 0){const l=s.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];n(e.shapes,f)}else n(e.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(n(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const s=[];for(let l=0,c=this.material.length;l<c;l++)s.push(n(e.materials,this.material[l]));a.material=s}else a.material=n(e.materials,this.material);if(this.children.length>0){a.children=[];for(let s=0;s<this.children.length;s++)a.children.push(this.children[s].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let s=0;s<this.animations.length;s++){const l=this.animations[s];a.animations.push(n(e.animations,l))}}if(t){const s=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),p=o(e.skeletons),m=o(e.animations),x=o(e.nodes);s.length>0&&(r.geometries=s),l.length>0&&(r.materials=l),c.length>0&&(r.textures=c),u.length>0&&(r.images=u),f.length>0&&(r.shapes=f),p.length>0&&(r.skeletons=p),m.length>0&&(r.animations=m),x.length>0&&(r.nodes=x)}return r.object=a,r;function o(s){const l=[];for(const c in s){const u=s[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let r=0;r<e.children.length;r++){const a=e.children[r];this.add(a.clone())}return this}}_t.DEFAULT_UP=new O(0,1,0);_t.DEFAULT_MATRIX_AUTO_UPDATE=!0;_t.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Rt=new O,kt=new O,Sa=new O,Gt=new O,Or=new O,Fr=new O,ts=new O,Ea=new O,Ta=new O,ya=new O;class Dt{constructor(e=new O,t=new O,r=new O){this.a=e,this.b=t,this.c=r}static getNormal(e,t,r,a){a.subVectors(r,t),Rt.subVectors(e,t),a.cross(Rt);const n=a.lengthSq();return n>0?a.multiplyScalar(1/Math.sqrt(n)):a.set(0,0,0)}static getBarycoord(e,t,r,a,n){Rt.subVectors(a,t),kt.subVectors(r,t),Sa.subVectors(e,t);const o=Rt.dot(Rt),s=Rt.dot(kt),l=Rt.dot(Sa),c=kt.dot(kt),u=kt.dot(Sa),f=o*c-s*s;if(f===0)return n.set(0,0,0),null;const p=1/f,m=(c*l-s*u)*p,x=(o*u-s*l)*p;return n.set(1-m-x,x,m)}static containsPoint(e,t,r,a){return this.getBarycoord(e,t,r,a,Gt)===null?!1:Gt.x>=0&&Gt.y>=0&&Gt.x+Gt.y<=1}static getInterpolation(e,t,r,a,n,o,s,l){return this.getBarycoord(e,t,r,a,Gt)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(n,Gt.x),l.addScaledVector(o,Gt.y),l.addScaledVector(s,Gt.z),l)}static isFrontFacing(e,t,r,a){return Rt.subVectors(r,t),kt.subVectors(e,t),Rt.cross(kt).dot(a)<0}set(e,t,r){return this.a.copy(e),this.b.copy(t),this.c.copy(r),this}setFromPointsAndIndices(e,t,r,a){return this.a.copy(e[t]),this.b.copy(e[r]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,r,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,r),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Rt.subVectors(this.c,this.b),kt.subVectors(this.a,this.b),Rt.cross(kt).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Dt.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return Dt.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,r,a,n){return Dt.getInterpolation(e,this.a,this.b,this.c,t,r,a,n)}containsPoint(e){return Dt.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Dt.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const r=this.a,a=this.b,n=this.c;let o,s;Or.subVectors(a,r),Fr.subVectors(n,r),Ea.subVectors(e,r);const l=Or.dot(Ea),c=Fr.dot(Ea);if(l<=0&&c<=0)return t.copy(r);Ta.subVectors(e,a);const u=Or.dot(Ta),f=Fr.dot(Ta);if(u>=0&&f<=u)return t.copy(a);const p=l*f-u*c;if(p<=0&&l>=0&&u<=0)return o=l/(l-u),t.copy(r).addScaledVector(Or,o);ya.subVectors(e,n);const m=Or.dot(ya),x=Fr.dot(ya);if(x>=0&&m<=x)return t.copy(n);const M=m*c-l*x;if(M<=0&&c>=0&&x<=0)return s=c/(c-x),t.copy(r).addScaledVector(Fr,s);const d=u*x-m*f;if(d<=0&&f-u>=0&&m-x>=0)return ts.subVectors(n,a),s=(f-u)/(f-u+(m-x)),t.copy(a).addScaledVector(ts,s);const h=1/(d+M+p);return o=M*h,s=p*h,t.copy(r).addScaledVector(Or,o).addScaledVector(Fr,s)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const to={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},tr={h:0,s:0,l:0},wi={h:0,s:0,l:0};function ba(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Oe{constructor(e,t,r){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,r)}set(e,t,r){if(t===void 0&&r===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,r);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Ut){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Ve.toWorkingColorSpace(this,t),this}setRGB(e,t,r,a=Ve.workingColorSpace){return this.r=e,this.g=t,this.b=r,Ve.toWorkingColorSpace(this,a),this}setHSL(e,t,r,a=Ve.workingColorSpace){if(e=gl(e,1),t=ft(t,0,1),r=ft(r,0,1),t===0)this.r=this.g=this.b=r;else{const n=r<=.5?r*(1+t):r+t-r*t,o=2*r-n;this.r=ba(o,n,e+1/3),this.g=ba(o,n,e),this.b=ba(o,n,e-1/3)}return Ve.toWorkingColorSpace(this,a),this}setStyle(e,t=Ut){function r(n){n!==void 0&&parseFloat(n)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let n;const o=a[1],s=a[2];switch(o){case"rgb":case"rgba":if(n=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(n[4]),this.setRGB(Math.min(255,parseInt(n[1],10))/255,Math.min(255,parseInt(n[2],10))/255,Math.min(255,parseInt(n[3],10))/255,t);if(n=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(n[4]),this.setRGB(Math.min(100,parseInt(n[1],10))/100,Math.min(100,parseInt(n[2],10))/100,Math.min(100,parseInt(n[3],10))/100,t);break;case"hsl":case"hsla":if(n=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(s))return r(n[4]),this.setHSL(parseFloat(n[1])/360,parseFloat(n[2])/100,parseFloat(n[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const n=a[1],o=n.length;if(o===3)return this.setRGB(parseInt(n.charAt(0),16)/15,parseInt(n.charAt(1),16)/15,parseInt(n.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(n,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Ut){const r=to[e.toLowerCase()];return r!==void 0?this.setHex(r,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Zr(e.r),this.g=Zr(e.g),this.b=Zr(e.b),this}copyLinearToSRGB(e){return this.r=da(e.r),this.g=da(e.g),this.b=da(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Ut){return Ve.fromWorkingColorSpace(ht.copy(this),e),Math.round(ft(ht.r*255,0,255))*65536+Math.round(ft(ht.g*255,0,255))*256+Math.round(ft(ht.b*255,0,255))}getHexString(e=Ut){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=Ve.workingColorSpace){Ve.fromWorkingColorSpace(ht.copy(this),t);const r=ht.r,a=ht.g,n=ht.b,o=Math.max(r,a,n),s=Math.min(r,a,n);let l,c;const u=(s+o)/2;if(s===o)l=0,c=0;else{const f=o-s;switch(c=u<=.5?f/(o+s):f/(2-o-s),o){case r:l=(a-n)/f+(a<n?6:0);break;case a:l=(n-r)/f+2;break;case n:l=(r-a)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,t=Ve.workingColorSpace){return Ve.fromWorkingColorSpace(ht.copy(this),t),e.r=ht.r,e.g=ht.g,e.b=ht.b,e}getStyle(e=Ut){Ve.fromWorkingColorSpace(ht.copy(this),e);const t=ht.r,r=ht.g,a=ht.b;return e!==Ut?`color(${e} ${t.toFixed(3)} ${r.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(r*255)},${Math.round(a*255)})`}offsetHSL(e,t,r){return this.getHSL(tr),this.setHSL(tr.h+e,tr.s+t,tr.l+r)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,r){return this.r=e.r+(t.r-e.r)*r,this.g=e.g+(t.g-e.g)*r,this.b=e.b+(t.b-e.b)*r,this}lerpHSL(e,t){this.getHSL(tr),e.getHSL(wi);const r=ha(tr.h,wi.h,t),a=ha(tr.s,wi.s,t),n=ha(tr.l,wi.l,t);return this.setHSL(r,a,n),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,r=this.g,a=this.b,n=e.elements;return this.r=n[0]*t+n[3]*r+n[6]*a,this.g=n[1]*t+n[4]*r+n[7]*a,this.b=n[2]*t+n[5]*r+n[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const ht=new Oe;Oe.NAMES=to;let Il=0;class ta extends br{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Il++}),this.uuid=ui(),this.name="",this.type="Material",this.blending=Yr,this.side=sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Oa,this.blendDst=Fa,this.blendEquation=vr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Oe(0,0,0),this.blendAlpha=0,this.depthFunc=ji,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Vn,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Rr,this.stencilZFail=Rr,this.stencilZPass=Rr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const r=e[t];if(r===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(r):a&&a.isVector3&&r&&r.isVector3?a.copy(r):this[t]=r}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const r={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.color&&this.color.isColor&&(r.color=this.color.getHex()),this.roughness!==void 0&&(r.roughness=this.roughness),this.metalness!==void 0&&(r.metalness=this.metalness),this.sheen!==void 0&&(r.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(r.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(r.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(r.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(r.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(r.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(r.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(r.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(r.shininess=this.shininess),this.clearcoat!==void 0&&(r.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(r.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(r.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(r.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(r.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,r.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(r.dispersion=this.dispersion),this.iridescence!==void 0&&(r.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(r.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(r.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(r.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(r.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(r.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(r.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(r.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(r.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(r.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(r.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(r.lightMap=this.lightMap.toJSON(e).uuid,r.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(r.aoMap=this.aoMap.toJSON(e).uuid,r.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(r.bumpMap=this.bumpMap.toJSON(e).uuid,r.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(r.normalMap=this.normalMap.toJSON(e).uuid,r.normalMapType=this.normalMapType,r.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(r.displacementMap=this.displacementMap.toJSON(e).uuid,r.displacementScale=this.displacementScale,r.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(r.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(r.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(r.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(r.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(r.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(r.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(r.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(r.combine=this.combine)),this.envMapRotation!==void 0&&(r.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(r.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(r.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(r.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(r.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(r.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(r.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(r.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(r.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(r.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(r.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(r.size=this.size),this.shadowSide!==null&&(r.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(r.sizeAttenuation=this.sizeAttenuation),this.blending!==Yr&&(r.blending=this.blending),this.side!==sr&&(r.side=this.side),this.vertexColors===!0&&(r.vertexColors=!0),this.opacity<1&&(r.opacity=this.opacity),this.transparent===!0&&(r.transparent=!0),this.blendSrc!==Oa&&(r.blendSrc=this.blendSrc),this.blendDst!==Fa&&(r.blendDst=this.blendDst),this.blendEquation!==vr&&(r.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(r.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(r.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(r.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(r.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(r.blendAlpha=this.blendAlpha),this.depthFunc!==ji&&(r.depthFunc=this.depthFunc),this.depthTest===!1&&(r.depthTest=this.depthTest),this.depthWrite===!1&&(r.depthWrite=this.depthWrite),this.colorWrite===!1&&(r.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(r.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Vn&&(r.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(r.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(r.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Rr&&(r.stencilFail=this.stencilFail),this.stencilZFail!==Rr&&(r.stencilZFail=this.stencilZFail),this.stencilZPass!==Rr&&(r.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(r.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(r.rotation=this.rotation),this.polygonOffset===!0&&(r.polygonOffset=!0),this.polygonOffsetFactor!==0&&(r.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(r.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(r.linewidth=this.linewidth),this.dashSize!==void 0&&(r.dashSize=this.dashSize),this.gapSize!==void 0&&(r.gapSize=this.gapSize),this.scale!==void 0&&(r.scale=this.scale),this.dithering===!0&&(r.dithering=!0),this.alphaTest>0&&(r.alphaTest=this.alphaTest),this.alphaHash===!0&&(r.alphaHash=!0),this.alphaToCoverage===!0&&(r.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(r.premultipliedAlpha=!0),this.forceSinglePass===!0&&(r.forceSinglePass=!0),this.wireframe===!0&&(r.wireframe=!0),this.wireframeLinewidth>1&&(r.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(r.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(r.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(r.flatShading=!0),this.visible===!1&&(r.visible=!1),this.toneMapped===!1&&(r.toneMapped=!1),this.fog===!1&&(r.fog=!1),Object.keys(this.userData).length>0&&(r.userData=this.userData);function a(n){const o=[];for(const s in n){const l=n[s];delete l.metadata,o.push(l)}return o}if(t){const n=a(e.textures),o=a(e.images);n.length>0&&(r.textures=n),o.length>0&&(r.images=o)}return r}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let r=null;if(t!==null){const a=t.length;r=new Array(a);for(let n=0;n!==a;++n)r[n]=t[n].clone()}return this.clippingPlanes=r,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}onBeforeRender(){console.warn("Material: onBeforeRender() has been removed.")}}class ro extends ta{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Oe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Ft,this.combine=Fs,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const tt=new O,Ri=new Be;class Ot{constructor(e,t,r=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=r,this.usage=kn,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=qt,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}get updateRange(){return Js("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,r){e*=this.itemSize,r*=t.itemSize;for(let a=0,n=this.itemSize;a<n;a++)this.array[e+a]=t.array[r+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,r=this.count;t<r;t++)Ri.fromBufferAttribute(this,t),Ri.applyMatrix3(e),this.setXY(t,Ri.x,Ri.y);else if(this.itemSize===3)for(let t=0,r=this.count;t<r;t++)tt.fromBufferAttribute(this,t),tt.applyMatrix3(e),this.setXYZ(t,tt.x,tt.y,tt.z);return this}applyMatrix4(e){for(let t=0,r=this.count;t<r;t++)tt.fromBufferAttribute(this,t),tt.applyMatrix4(e),this.setXYZ(t,tt.x,tt.y,tt.z);return this}applyNormalMatrix(e){for(let t=0,r=this.count;t<r;t++)tt.fromBufferAttribute(this,t),tt.applyNormalMatrix(e),this.setXYZ(t,tt.x,tt.y,tt.z);return this}transformDirection(e){for(let t=0,r=this.count;t<r;t++)tt.fromBufferAttribute(this,t),tt.transformDirection(e),this.setXYZ(t,tt.x,tt.y,tt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let r=this.array[e*this.itemSize+t];return this.normalized&&(r=ii(r,this.array)),r}setComponent(e,t,r){return this.normalized&&(r=pt(r,this.array)),this.array[e*this.itemSize+t]=r,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=ii(t,this.array)),t}setX(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=ii(t,this.array)),t}setY(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=ii(t,this.array)),t}setZ(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=ii(t,this.array)),t}setW(e,t){return this.normalized&&(t=pt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,r){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),r=pt(r,this.array)),this.array[e+0]=t,this.array[e+1]=r,this}setXYZ(e,t,r,a){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),r=pt(r,this.array),a=pt(a,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this}setXYZW(e,t,r,a,n){return e*=this.itemSize,this.normalized&&(t=pt(t,this.array),r=pt(r,this.array),a=pt(a,this.array),n=pt(n,this.array)),this.array[e+0]=t,this.array[e+1]=r,this.array[e+2]=a,this.array[e+3]=n,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==kn&&(e.usage=this.usage),e}}class io extends Ot{constructor(e,t,r){super(new Uint16Array(e),t,r)}}class ao extends Ot{constructor(e,t,r){super(new Uint32Array(e),t,r)}}class Er extends Ot{constructor(e,t,r){super(new Float32Array(e),t,r)}}let Dl=0;const Et=new it,Aa=new _t,Br=new O,Mt=new pi,oi=new pi,st=new O;class Ar extends br{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Dl++}),this.uuid=ui(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Zs(e)?ao:io)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,r=0){this.groups.push({start:e,count:t,materialIndex:r})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const r=this.attributes.normal;if(r!==void 0){const n=new Pe().getNormalMatrix(e);r.applyNormalMatrix(n),r.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Et.makeRotationFromQuaternion(e),this.applyMatrix4(Et),this}rotateX(e){return Et.makeRotationX(e),this.applyMatrix4(Et),this}rotateY(e){return Et.makeRotationY(e),this.applyMatrix4(Et),this}rotateZ(e){return Et.makeRotationZ(e),this.applyMatrix4(Et),this}translate(e,t,r){return Et.makeTranslation(e,t,r),this.applyMatrix4(Et),this}scale(e,t,r){return Et.makeScale(e,t,r),this.applyMatrix4(Et),this}lookAt(e){return Aa.lookAt(e),Aa.updateMatrix(),this.applyMatrix4(Aa.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Br).negate(),this.translate(Br.x,Br.y,Br.z),this}setFromPoints(e){const t=[];for(let r=0,a=e.length;r<a;r++){const n=e[r];t.push(n.x,n.y,n.z||0)}return this.setAttribute("position",new Er(t,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new pi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new O(-1/0,-1/0,-1/0),new O(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let r=0,a=t.length;r<a;r++){const n=t[r];Mt.setFromBufferAttribute(n),this.morphTargetsRelative?(st.addVectors(this.boundingBox.min,Mt.min),this.boundingBox.expandByPoint(st),st.addVectors(this.boundingBox.max,Mt.max),this.boundingBox.expandByPoint(st)):(this.boundingBox.expandByPoint(Mt.min),this.boundingBox.expandByPoint(Mt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new bn);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new O,1/0);return}if(e){const r=this.boundingSphere.center;if(Mt.setFromBufferAttribute(e),t)for(let n=0,o=t.length;n<o;n++){const s=t[n];oi.setFromBufferAttribute(s),this.morphTargetsRelative?(st.addVectors(Mt.min,oi.min),Mt.expandByPoint(st),st.addVectors(Mt.max,oi.max),Mt.expandByPoint(st)):(Mt.expandByPoint(oi.min),Mt.expandByPoint(oi.max))}Mt.getCenter(r);let a=0;for(let n=0,o=e.count;n<o;n++)st.fromBufferAttribute(e,n),a=Math.max(a,r.distanceToSquared(st));if(t)for(let n=0,o=t.length;n<o;n++){const s=t[n],l=this.morphTargetsRelative;for(let c=0,u=s.count;c<u;c++)st.fromBufferAttribute(s,c),l&&(Br.fromBufferAttribute(e,c),st.add(Br)),a=Math.max(a,r.distanceToSquared(st))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const r=t.position,a=t.normal,n=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Ot(new Float32Array(4*r.count),4));const o=this.getAttribute("tangent"),s=[],l=[];for(let F=0;F<r.count;F++)s[F]=new O,l[F]=new O;const c=new O,u=new O,f=new O,p=new Be,m=new Be,x=new Be,M=new O,d=new O;function h(F,S,v){c.fromBufferAttribute(r,F),u.fromBufferAttribute(r,S),f.fromBufferAttribute(r,v),p.fromBufferAttribute(n,F),m.fromBufferAttribute(n,S),x.fromBufferAttribute(n,v),u.sub(c),f.sub(c),m.sub(p),x.sub(p);const P=1/(m.x*x.y-x.x*m.y);isFinite(P)&&(M.copy(u).multiplyScalar(x.y).addScaledVector(f,-m.y).multiplyScalar(P),d.copy(f).multiplyScalar(m.x).addScaledVector(u,-x.x).multiplyScalar(P),s[F].add(M),s[S].add(M),s[v].add(M),l[F].add(d),l[S].add(d),l[v].add(d))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let F=0,S=b.length;F<S;++F){const v=b[F],P=v.start,H=v.count;for(let z=P,X=P+H;z<X;z+=3)h(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const E=new O,y=new O,B=new O,R=new O;function w(F){B.fromBufferAttribute(a,F),R.copy(B);const S=s[F];E.copy(S),E.sub(B.multiplyScalar(B.dot(S))).normalize(),y.crossVectors(R,S);const v=y.dot(l[F])<0?-1:1;o.setXYZW(F,E.x,E.y,E.z,v)}for(let F=0,S=b.length;F<S;++F){const v=b[F],P=v.start,H=v.count;for(let z=P,X=P+H;z<X;z+=3)w(e.getX(z+0)),w(e.getX(z+1)),w(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let r=this.getAttribute("normal");if(r===void 0)r=new Ot(new Float32Array(t.count*3),3),this.setAttribute("normal",r);else for(let p=0,m=r.count;p<m;p++)r.setXYZ(p,0,0,0);const a=new O,n=new O,o=new O,s=new O,l=new O,c=new O,u=new O,f=new O;if(e)for(let p=0,m=e.count;p<m;p+=3){const x=e.getX(p+0),M=e.getX(p+1),d=e.getX(p+2);a.fromBufferAttribute(t,x),n.fromBufferAttribute(t,M),o.fromBufferAttribute(t,d),u.subVectors(o,n),f.subVectors(a,n),u.cross(f),s.fromBufferAttribute(r,x),l.fromBufferAttribute(r,M),c.fromBufferAttribute(r,d),s.add(u),l.add(u),c.add(u),r.setXYZ(x,s.x,s.y,s.z),r.setXYZ(M,l.x,l.y,l.z),r.setXYZ(d,c.x,c.y,c.z)}else for(let p=0,m=t.count;p<m;p+=3)a.fromBufferAttribute(t,p+0),n.fromBufferAttribute(t,p+1),o.fromBufferAttribute(t,p+2),u.subVectors(o,n),f.subVectors(a,n),u.cross(f),r.setXYZ(p+0,u.x,u.y,u.z),r.setXYZ(p+1,u.x,u.y,u.z),r.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),r.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,r=e.count;t<r;t++)st.fromBufferAttribute(e,t),st.normalize(),e.setXYZ(t,st.x,st.y,st.z)}toNonIndexed(){function e(s,l){const c=s.array,u=s.itemSize,f=s.normalized,p=new c.constructor(l.length*u);let m=0,x=0;for(let M=0,d=l.length;M<d;M++){s.isInterleavedBufferAttribute?m=l[M]*s.data.stride+s.offset:m=l[M]*u;for(let h=0;h<u;h++)p[x++]=c[m++]}return new Ot(p,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new Ar,r=this.index.array,a=this.attributes;for(const s in a){const l=a[s],c=e(l,r);t.setAttribute(s,c)}const n=this.morphAttributes;for(const s in n){const l=[],c=n[s];for(let u=0,f=c.length;u<f;u++){const p=c[u],m=e(p,r);l.push(m)}t.morphAttributes[s]=l}t.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let s=0,l=o.length;s<l;s++){const c=o[s];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const r=this.attributes;for(const l in r){const c=r[l];e.data.attributes[l]=c.toJSON(e.data)}const a={};let n=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,p=c.length;f<p;f++){const m=c[f];u.push(m.toJSON(e.data))}u.length>0&&(a[l]=u,n=!0)}n&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const s=this.boundingSphere;return s!==null&&(e.data.boundingSphere={center:s.center.toArray(),radius:s.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const r=e.index;r!==null&&this.setIndex(r.clone(t));const a=e.attributes;for(const c in a){const u=a[c];this.setAttribute(c,u.clone(t))}const n=e.morphAttributes;for(const c in n){const u=[],f=n[c];for(let p=0,m=f.length;p<m;p++)u.push(f[p].clone(t));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const s=e.boundingBox;s!==null&&(this.boundingBox=s.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const rs=new it,dr=new Al,Ci=new bn,is=new O,zr=new O,Hr=new O,Vr=new O,wa=new O,Pi=new O,Li=new Be,Ui=new Be,Ii=new Be,as=new O,ns=new O,ss=new O,Di=new O,Ni=new O;class Nt extends _t{constructor(e=new Ar,t=new ro){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,t=Object.keys(e);if(t.length>0){const r=e[t[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let a=0,n=r.length;a<n;a++){const o=r[a].name||String(a);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=a}}}}getVertexPosition(e,t){const r=this.geometry,a=r.attributes.position,n=r.morphAttributes.position,o=r.morphTargetsRelative;t.fromBufferAttribute(a,e);const s=this.morphTargetInfluences;if(n&&s){Pi.set(0,0,0);for(let l=0,c=n.length;l<c;l++){const u=s[l],f=n[l];u!==0&&(wa.fromBufferAttribute(f,e),o?Pi.addScaledVector(wa,u):Pi.addScaledVector(wa.sub(t),u))}t.add(Pi)}return t}raycast(e,t){const r=this.geometry,a=this.material,n=this.matrixWorld;a!==void 0&&(r.boundingSphere===null&&r.computeBoundingSphere(),Ci.copy(r.boundingSphere),Ci.applyMatrix4(n),dr.copy(e.ray).recast(e.near),!(Ci.containsPoint(dr.origin)===!1&&(dr.intersectSphere(Ci,is)===null||dr.origin.distanceToSquared(is)>(e.far-e.near)**2))&&(rs.copy(n).invert(),dr.copy(e.ray).applyMatrix4(rs),!(r.boundingBox!==null&&dr.intersectsBox(r.boundingBox)===!1)&&this._computeIntersections(e,t,dr)))}_computeIntersections(e,t,r){let a;const n=this.geometry,o=this.material,s=n.index,l=n.attributes.position,c=n.attributes.uv,u=n.attributes.uv1,f=n.attributes.normal,p=n.groups,m=n.drawRange;if(s!==null)if(Array.isArray(o))for(let x=0,M=p.length;x<M;x++){const d=p[x],h=o[d.materialIndex],b=Math.max(d.start,m.start),E=Math.min(s.count,Math.min(d.start+d.count,m.start+m.count));for(let y=b,B=E;y<B;y+=3){const R=s.getX(y),w=s.getX(y+1),F=s.getX(y+2);a=Oi(this,h,e,r,c,u,f,R,w,F),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=d.materialIndex,t.push(a))}}else{const x=Math.max(0,m.start),M=Math.min(s.count,m.start+m.count);for(let d=x,h=M;d<h;d+=3){const b=s.getX(d),E=s.getX(d+1),y=s.getX(d+2);a=Oi(this,o,e,r,c,u,f,b,E,y),a&&(a.faceIndex=Math.floor(d/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(o))for(let x=0,M=p.length;x<M;x++){const d=p[x],h=o[d.materialIndex],b=Math.max(d.start,m.start),E=Math.min(l.count,Math.min(d.start+d.count,m.start+m.count));for(let y=b,B=E;y<B;y+=3){const R=y,w=y+1,F=y+2;a=Oi(this,h,e,r,c,u,f,R,w,F),a&&(a.faceIndex=Math.floor(y/3),a.face.materialIndex=d.materialIndex,t.push(a))}}else{const x=Math.max(0,m.start),M=Math.min(l.count,m.start+m.count);for(let d=x,h=M;d<h;d+=3){const b=d,E=d+1,y=d+2;a=Oi(this,o,e,r,c,u,f,b,E,y),a&&(a.faceIndex=Math.floor(d/3),t.push(a))}}}}function Nl(i,e,t,r,a,n,o,s){let l;if(e.side===mt?l=r.intersectTriangle(o,n,a,!0,s):l=r.intersectTriangle(a,n,o,e.side===sr,s),l===null)return null;Ni.copy(s),Ni.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Ni);return c<t.near||c>t.far?null:{distance:c,point:Ni.clone(),object:i}}function Oi(i,e,t,r,a,n,o,s,l,c){i.getVertexPosition(s,zr),i.getVertexPosition(l,Hr),i.getVertexPosition(c,Vr);const u=Nl(i,e,t,r,zr,Hr,Vr,Di);if(u){a&&(Li.fromBufferAttribute(a,s),Ui.fromBufferAttribute(a,l),Ii.fromBufferAttribute(a,c),u.uv=Dt.getInterpolation(Di,zr,Hr,Vr,Li,Ui,Ii,new Be)),n&&(Li.fromBufferAttribute(n,s),Ui.fromBufferAttribute(n,l),Ii.fromBufferAttribute(n,c),u.uv1=Dt.getInterpolation(Di,zr,Hr,Vr,Li,Ui,Ii,new Be)),o&&(as.fromBufferAttribute(o,s),ns.fromBufferAttribute(o,l),ss.fromBufferAttribute(o,c),u.normal=Dt.getInterpolation(Di,zr,Hr,Vr,as,ns,ss,new O),u.normal.dot(r.direction)>0&&u.normal.multiplyScalar(-1));const f={a:s,b:l,c,normal:new O,materialIndex:0};Dt.getNormal(zr,Hr,Vr,f.normal),u.face=f}return u}class fi extends Ar{constructor(e=1,t=1,r=1,a=1,n=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:r,widthSegments:a,heightSegments:n,depthSegments:o};const s=this;a=Math.floor(a),n=Math.floor(n),o=Math.floor(o);const l=[],c=[],u=[],f=[];let p=0,m=0;x("z","y","x",-1,-1,r,t,e,o,n,0),x("z","y","x",1,-1,r,t,-e,o,n,1),x("x","z","y",1,1,e,r,t,a,o,2),x("x","z","y",1,-1,e,r,-t,a,o,3),x("x","y","z",1,-1,e,t,r,a,n,4),x("x","y","z",-1,-1,e,t,-r,a,n,5),this.setIndex(l),this.setAttribute("position",new Er(c,3)),this.setAttribute("normal",new Er(u,3)),this.setAttribute("uv",new Er(f,2));function x(M,d,h,b,E,y,B,R,w,F,S){const v=y/w,P=B/F,H=y/2,z=B/2,X=R/2,Y=w+1,k=F+1;let Z=0,V=0;const ae=new O;for(let me=0;me<k;me++){const Me=me*P-z;for(let De=0;De<Y;De++){const ke=De*v-H;ae[M]=ke*b,ae[d]=Me*E,ae[h]=X,c.push(ae.x,ae.y,ae.z),ae[M]=0,ae[d]=0,ae[h]=R>0?1:-1,u.push(ae.x,ae.y,ae.z),f.push(De/w),f.push(1-me/F),Z+=1}}for(let me=0;me<F;me++)for(let Me=0;Me<w;Me++){const De=p+Me+Y*me,ke=p+Me+Y*(me+1),G=p+(Me+1)+Y*(me+1),Q=p+(Me+1)+Y*me;l.push(De,ke,Q),l.push(ke,G,Q),V+=6}s.addGroup(m,V,S),m+=V,p+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fi(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function ti(i){const e={};for(const t in i){e[t]={};for(const r in i[t]){const a=i[t][r];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][r]=null):e[t][r]=a.clone():Array.isArray(a)?e[t][r]=a.slice():e[t][r]=a}}return e}function dt(i){const e={};for(let t=0;t<i.length;t++){const r=ti(i[t]);for(const a in r)e[a]=r[a]}return e}function Ol(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function no(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Ve.workingColorSpace}const Fl={clone:ti,merge:dt};var Bl=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,zl=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Kt extends ta{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Bl,this.fragmentShader=zl,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ti(e.uniforms),this.uniformsGroups=Ol(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const n=this.uniforms[a].value;n&&n.isTexture?t.uniforms[a]={type:"t",value:n.toJSON(e).uuid}:n&&n.isColor?t.uniforms[a]={type:"c",value:n.getHex()}:n&&n.isVector2?t.uniforms[a]={type:"v2",value:n.toArray()}:n&&n.isVector3?t.uniforms[a]={type:"v3",value:n.toArray()}:n&&n.isVector4?t.uniforms[a]={type:"v4",value:n.toArray()}:n&&n.isMatrix3?t.uniforms[a]={type:"m3",value:n.toArray()}:n&&n.isMatrix4?t.uniforms[a]={type:"m4",value:n.toArray()}:t.uniforms[a]={value:n}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const r={};for(const a in this.extensions)this.extensions[a]===!0&&(r[a]=!0);return Object.keys(r).length>0&&(t.extensions=r),t}}class so extends _t{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new it,this.projectionMatrix=new it,this.projectionMatrixInverse=new it,this.coordinateSystem=jt}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const rr=new O,os=new Be,ls=new Be;class Tt extends so{constructor(e=50,t=1,r=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=r,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=mn*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ca*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return mn*2*Math.atan(Math.tan(ca*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,r){rr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(rr.x,rr.y).multiplyScalar(-e/rr.z),rr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),r.set(rr.x,rr.y).multiplyScalar(-e/rr.z)}getViewSize(e,t){return this.getViewBounds(e,os,ls),t.subVectors(ls,os)}setViewOffset(e,t,r,a,n,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=n,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ca*.5*this.fov)/this.zoom,r=2*t,a=this.aspect*r,n=-.5*a;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;n+=o.offsetX*a/l,t-=o.offsetY*r/c,a*=o.width/l,r*=o.height/c}const s=this.filmOffset;s!==0&&(n+=e*s/this.getFilmWidth()),this.projectionMatrix.makePerspective(n,n+a,t,t-r,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const kr=-90,Gr=1;class Hl extends _t{constructor(e,t,r){super(),this.type="CubeCamera",this.renderTarget=r,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new Tt(kr,Gr,e,t);a.layers=this.layers,this.add(a);const n=new Tt(kr,Gr,e,t);n.layers=this.layers,this.add(n);const o=new Tt(kr,Gr,e,t);o.layers=this.layers,this.add(o);const s=new Tt(kr,Gr,e,t);s.layers=this.layers,this.add(s);const l=new Tt(kr,Gr,e,t);l.layers=this.layers,this.add(l);const c=new Tt(kr,Gr,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[r,a,n,o,s,l]=t;for(const c of t)this.remove(c);if(e===jt)r.up.set(0,1,0),r.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),n.up.set(0,0,-1),n.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),s.up.set(0,1,0),s.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Ji)r.up.set(0,-1,0),r.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),n.up.set(0,0,1),n.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),s.up.set(0,-1,0),s.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:r,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[n,o,s,l,c,u]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const M=r.texture.generateMipmaps;r.texture.generateMipmaps=!1,e.setRenderTarget(r,0,a),e.render(t,n),e.setRenderTarget(r,1,a),e.render(t,o),e.setRenderTarget(r,2,a),e.render(t,s),e.setRenderTarget(r,3,a),e.render(t,l),e.setRenderTarget(r,4,a),e.render(t,c),r.texture.generateMipmaps=M,e.setRenderTarget(r,5,a),e.render(t,u),e.setRenderTarget(f,p,m),e.xr.enabled=x,r.texture.needsPMREMUpdate=!0}}class oo extends gt{constructor(e,t,r,a,n,o,s,l,c,u){e=e!==void 0?e:[],t=t!==void 0?t:Jr,super(e,t,r,a,n,o,s,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class Vl extends yr{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const r={width:e,height:e,depth:1},a=[r,r,r,r,r,r];this.texture=new oo(a,t.mapping,t.wrapS,t.wrapT,t.magFilter,t.minFilter,t.format,t.type,t.anisotropy,t.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=t.generateMipmaps!==void 0?t.generateMipmaps:!1,this.texture.minFilter=t.minFilter!==void 0?t.minFilter:Ct}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const r={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new fi(5,5,5),n=new Kt({name:"CubemapFromEquirect",uniforms:ti(r.uniforms),vertexShader:r.vertexShader,fragmentShader:r.fragmentShader,side:mt,blending:ar});n.uniforms.tEquirect.value=t;const o=new Nt(a,n),s=t.minFilter;return t.minFilter===Sr&&(t.minFilter=Ct),new Hl(1,10,this).update(e,o),t.minFilter=s,o.geometry.dispose(),o.material.dispose(),this}clear(e,t,r,a){const n=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,r,a);e.setRenderTarget(n)}}const Ra=new O,kl=new O,Gl=new Pe;class gr{constructor(e=new O(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,r,a){return this.normal.set(e,t,r),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,r){const a=Ra.subVectors(r,t).cross(kl.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const r=e.delta(Ra),a=this.normal.dot(r);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const n=-(e.start.dot(this.normal)+this.constant)/a;return n<0||n>1?null:t.copy(e.start).addScaledVector(r,n)}intersectsLine(e){const t=this.distanceToPoint(e.start),r=this.distanceToPoint(e.end);return t<0&&r>0||r<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const r=t||Gl.getNormalMatrix(e),a=this.coplanarPoint(Ra).applyMatrix4(e),n=this.normal.applyMatrix3(r).normalize();return this.constant=-a.dot(n),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const pr=new bn,Fi=new O;class lo{constructor(e=new gr,t=new gr,r=new gr,a=new gr,n=new gr,o=new gr){this.planes=[e,t,r,a,n,o]}set(e,t,r,a,n,o){const s=this.planes;return s[0].copy(e),s[1].copy(t),s[2].copy(r),s[3].copy(a),s[4].copy(n),s[5].copy(o),this}copy(e){const t=this.planes;for(let r=0;r<6;r++)t[r].copy(e.planes[r]);return this}setFromProjectionMatrix(e,t=jt){const r=this.planes,a=e.elements,n=a[0],o=a[1],s=a[2],l=a[3],c=a[4],u=a[5],f=a[6],p=a[7],m=a[8],x=a[9],M=a[10],d=a[11],h=a[12],b=a[13],E=a[14],y=a[15];if(r[0].setComponents(l-n,p-c,d-m,y-h).normalize(),r[1].setComponents(l+n,p+c,d+m,y+h).normalize(),r[2].setComponents(l+o,p+u,d+x,y+b).normalize(),r[3].setComponents(l-o,p-u,d-x,y-b).normalize(),r[4].setComponents(l-s,p-f,d-M,y-E).normalize(),t===jt)r[5].setComponents(l+s,p+f,d+M,y+E).normalize();else if(t===Ji)r[5].setComponents(s,f,M,E).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),pr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),pr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(pr)}intersectsSprite(e){return pr.center.set(0,0,0),pr.radius=.7071067811865476,pr.applyMatrix4(e.matrixWorld),this.intersectsSphere(pr)}intersectsSphere(e){const t=this.planes,r=e.center,a=-e.radius;for(let n=0;n<6;n++)if(t[n].distanceToPoint(r)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let r=0;r<6;r++){const a=t[r];if(Fi.x=a.normal.x>0?e.max.x:e.min.x,Fi.y=a.normal.y>0?e.max.y:e.min.y,Fi.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Fi)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let r=0;r<6;r++)if(t[r].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function co(){let i=null,e=!1,t=null,r=null;function a(n,o){t(n,o),r=i.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(r=i.requestAnimationFrame(a),e=!0)},stop:function(){i.cancelAnimationFrame(r),e=!1},setAnimationLoop:function(n){t=n},setContext:function(n){i=n}}}function Wl(i){const e=new WeakMap;function t(s,l){const c=s.array,u=s.usage,f=c.byteLength,p=i.createBuffer();i.bindBuffer(l,p),i.bufferData(l,c,u),s.onUploadCallback();let m;if(c instanceof Float32Array)m=i.FLOAT;else if(c instanceof Uint16Array)s.isFloat16BufferAttribute?m=i.HALF_FLOAT:m=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)m=i.SHORT;else if(c instanceof Uint32Array)m=i.UNSIGNED_INT;else if(c instanceof Int32Array)m=i.INT;else if(c instanceof Int8Array)m=i.BYTE;else if(c instanceof Uint8Array)m=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)m=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:p,type:m,bytesPerElement:c.BYTES_PER_ELEMENT,version:s.version,size:f}}function r(s,l,c){const u=l.array,f=l._updateRange,p=l.updateRanges;if(i.bindBuffer(c,s),f.count===-1&&p.length===0&&i.bufferSubData(c,0,u),p.length!==0){for(let m=0,x=p.length;m<x;m++){const M=p[m];i.bufferSubData(c,M.start*u.BYTES_PER_ELEMENT,u,M.start,M.count)}l.clearUpdateRanges()}f.count!==-1&&(i.bufferSubData(c,f.offset*u.BYTES_PER_ELEMENT,u,f.offset,f.count),f.count=-1),l.onUploadCallback()}function a(s){return s.isInterleavedBufferAttribute&&(s=s.data),e.get(s)}function n(s){s.isInterleavedBufferAttribute&&(s=s.data);const l=e.get(s);l&&(i.deleteBuffer(l.buffer),e.delete(s))}function o(s,l){if(s.isGLBufferAttribute){const u=e.get(s);(!u||u.version<s.version)&&e.set(s,{buffer:s.buffer,type:s.type,bytesPerElement:s.elementSize,version:s.version});return}s.isInterleavedBufferAttribute&&(s=s.data);const c=e.get(s);if(c===void 0)e.set(s,t(s,l));else if(c.version<s.version){if(c.size!==s.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(c.buffer,s,l),c.version=s.version}}return{get:a,remove:n,update:o}}class mi extends Ar{constructor(e=1,t=1,r=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:r,heightSegments:a};const n=e/2,o=t/2,s=Math.floor(r),l=Math.floor(a),c=s+1,u=l+1,f=e/s,p=t/l,m=[],x=[],M=[],d=[];for(let h=0;h<u;h++){const b=h*p-o;for(let E=0;E<c;E++){const y=E*f-n;x.push(y,-b,0),M.push(0,0,1),d.push(E/s),d.push(1-h/l)}}for(let h=0;h<l;h++)for(let b=0;b<s;b++){const E=b+c*h,y=b+c*(h+1),B=b+1+c*(h+1),R=b+1+c*h;m.push(E,y,R),m.push(y,B,R)}this.setIndex(m),this.setAttribute("position",new Er(x,3)),this.setAttribute("normal",new Er(M,3)),this.setAttribute("uv",new Er(d,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mi(e.width,e.height,e.widthSegments,e.heightSegments)}}var Xl=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ql=`#ifdef USE_ALPHAHASH
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
#endif`,jl=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Yl=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Kl=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Zl=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jl=`#ifdef USE_AOMAP
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
#endif`,$l=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Ql=`#ifdef USE_BATCHING
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
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,ec=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,tc=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,rc=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,ic=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,ac=`#ifdef USE_IRIDESCENCE
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
#endif`,nc=`#ifdef USE_BUMPMAP
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
#endif`,sc=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,oc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,lc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,cc=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,hc=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,uc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,dc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,pc=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,fc=`#define PI 3.141592653589793
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
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
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
} // validated`,mc=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,gc=`vec3 transformedNormal = objectNormal;
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
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,_c=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,vc=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,xc=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Mc=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Sc="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ec=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,Tc=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,yc=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,bc=`#ifdef USE_ENVMAP
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
#endif`,Ac=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,wc=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Rc=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Cc=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Pc=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Lc=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Uc=`#ifdef USE_GRADIENTMAP
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
}`,Ic=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Dc=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Nc=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Oc=`uniform bool receiveShadow;
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
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
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
#endif`,Fc=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Bc=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,zc=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hc=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Vc=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,kc=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
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
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
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
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
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
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
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
#endif`,Gc=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
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
		vec3 iridescenceF0;
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
		float v = 0.5 / ( gv + gl );
		return saturate(v);
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
		float roughness = material.clearcoatRoughness;
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
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
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
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
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
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
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
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
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
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
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
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Wc=`
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
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
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
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
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
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xc=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,qc=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,jc=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Yc=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Kc=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Zc=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jc=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,$c=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Qc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,eh=`#if defined( USE_POINTS_UV )
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
#endif`,th=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rh=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ih=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ah=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,nh=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sh=`#ifdef USE_MORPHTARGETS
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
#endif`,oh=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,lh=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
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
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ch=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,hh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,uh=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dh=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,ph=`#ifdef USE_NORMALMAP
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
#endif`,fh=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,mh=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,gh=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_h=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vh=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,xh=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Mh=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sh=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Eh=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Th=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,yh=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,bh=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Ah=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
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
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
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
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
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
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,wh=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
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
#endif`,Rh=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
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
#endif`,Ch=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
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
	#if NUM_POINT_LIGHT_SHADOWS > 0
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
}`,Ph=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Lh=`#ifdef USE_SKINNING
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
#endif`,Uh=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Ih=`#ifdef USE_SKINNING
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
#endif`,Dh=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Nh=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Oh=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Fh=`#ifndef saturate
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
vec3 OptimizedCineonToneMapping( vec3 color ) {
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Bh=`#ifdef USE_TRANSMISSION
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
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,zh=`#ifdef USE_TRANSMISSION
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
#endif`,Hh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Vh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,kh=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gh=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Wh=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xh=`uniform sampler2D t2D;
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
}`,qh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jh=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Yh=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Kh=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Zh=`#include <common>
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
}`,Jh=`#if DEPTH_PACKING == 3200
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
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,$h=`#define DISTANCE
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
}`,Qh=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,eu=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,tu=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ru=`uniform float scale;
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
}`,iu=`uniform vec3 diffuse;
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
}`,au=`#include <common>
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
}`,nu=`uniform vec3 diffuse;
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
}`,su=`#define LAMBERT
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
}`,ou=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,lu=`#define MATCAP
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
}`,cu=`#define MATCAP
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
}`,hu=`#define NORMAL
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
}`,uu=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
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
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,du=`#define PHONG
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
}`,pu=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
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
}`,fu=`#define STANDARD
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
}`,mu=`#define STANDARD
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
#ifdef USE_DISPERSION
	uniform float dispersion;
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
#include <packing>
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
#include <cube_uv_reflection_fragment>
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
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
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
}`,gu=`#define TOON
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
}`,_u=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
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
}`,vu=`uniform float size;
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
}`,xu=`uniform vec3 diffuse;
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
}`,Mu=`#include <common>
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
}`,Su=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
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
}`,Eu=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
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
}`,Tu=`uniform vec3 diffuse;
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
}`,Ce={alphahash_fragment:Xl,alphahash_pars_fragment:ql,alphamap_fragment:jl,alphamap_pars_fragment:Yl,alphatest_fragment:Kl,alphatest_pars_fragment:Zl,aomap_fragment:Jl,aomap_pars_fragment:$l,batching_pars_vertex:Ql,batching_vertex:ec,begin_vertex:tc,beginnormal_vertex:rc,bsdfs:ic,iridescence_fragment:ac,bumpmap_pars_fragment:nc,clipping_planes_fragment:sc,clipping_planes_pars_fragment:oc,clipping_planes_pars_vertex:lc,clipping_planes_vertex:cc,color_fragment:hc,color_pars_fragment:uc,color_pars_vertex:dc,color_vertex:pc,common:fc,cube_uv_reflection_fragment:mc,defaultnormal_vertex:gc,displacementmap_pars_vertex:_c,displacementmap_vertex:vc,emissivemap_fragment:xc,emissivemap_pars_fragment:Mc,colorspace_fragment:Sc,colorspace_pars_fragment:Ec,envmap_fragment:Tc,envmap_common_pars_fragment:yc,envmap_pars_fragment:bc,envmap_pars_vertex:Ac,envmap_physical_pars_fragment:Fc,envmap_vertex:wc,fog_vertex:Rc,fog_pars_vertex:Cc,fog_fragment:Pc,fog_pars_fragment:Lc,gradientmap_pars_fragment:Uc,lightmap_pars_fragment:Ic,lights_lambert_fragment:Dc,lights_lambert_pars_fragment:Nc,lights_pars_begin:Oc,lights_toon_fragment:Bc,lights_toon_pars_fragment:zc,lights_phong_fragment:Hc,lights_phong_pars_fragment:Vc,lights_physical_fragment:kc,lights_physical_pars_fragment:Gc,lights_fragment_begin:Wc,lights_fragment_maps:Xc,lights_fragment_end:qc,logdepthbuf_fragment:jc,logdepthbuf_pars_fragment:Yc,logdepthbuf_pars_vertex:Kc,logdepthbuf_vertex:Zc,map_fragment:Jc,map_pars_fragment:$c,map_particle_fragment:Qc,map_particle_pars_fragment:eh,metalnessmap_fragment:th,metalnessmap_pars_fragment:rh,morphinstance_vertex:ih,morphcolor_vertex:ah,morphnormal_vertex:nh,morphtarget_pars_vertex:sh,morphtarget_vertex:oh,normal_fragment_begin:lh,normal_fragment_maps:ch,normal_pars_fragment:hh,normal_pars_vertex:uh,normal_vertex:dh,normalmap_pars_fragment:ph,clearcoat_normal_fragment_begin:fh,clearcoat_normal_fragment_maps:mh,clearcoat_pars_fragment:gh,iridescence_pars_fragment:_h,opaque_fragment:vh,packing:xh,premultiplied_alpha_fragment:Mh,project_vertex:Sh,dithering_fragment:Eh,dithering_pars_fragment:Th,roughnessmap_fragment:yh,roughnessmap_pars_fragment:bh,shadowmap_pars_fragment:Ah,shadowmap_pars_vertex:wh,shadowmap_vertex:Rh,shadowmask_pars_fragment:Ch,skinbase_vertex:Ph,skinning_pars_vertex:Lh,skinning_vertex:Uh,skinnormal_vertex:Ih,specularmap_fragment:Dh,specularmap_pars_fragment:Nh,tonemapping_fragment:Oh,tonemapping_pars_fragment:Fh,transmission_fragment:Bh,transmission_pars_fragment:zh,uv_pars_fragment:Hh,uv_pars_vertex:Vh,uv_vertex:kh,worldpos_vertex:Gh,background_vert:Wh,background_frag:Xh,backgroundCube_vert:qh,backgroundCube_frag:jh,cube_vert:Yh,cube_frag:Kh,depth_vert:Zh,depth_frag:Jh,distanceRGBA_vert:$h,distanceRGBA_frag:Qh,equirect_vert:eu,equirect_frag:tu,linedashed_vert:ru,linedashed_frag:iu,meshbasic_vert:au,meshbasic_frag:nu,meshlambert_vert:su,meshlambert_frag:ou,meshmatcap_vert:lu,meshmatcap_frag:cu,meshnormal_vert:hu,meshnormal_frag:uu,meshphong_vert:du,meshphong_frag:pu,meshphysical_vert:fu,meshphysical_frag:mu,meshtoon_vert:gu,meshtoon_frag:_u,points_vert:vu,points_frag:xu,shadow_vert:Mu,shadow_frag:Su,sprite_vert:Eu,sprite_frag:Tu},ie={common:{diffuse:{value:new Oe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Pe}},envmap:{envMap:{value:null},envMapRotation:{value:new Pe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Pe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Pe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Pe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Pe},normalScale:{value:new Be(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Pe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Pe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Pe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Pe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Oe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Oe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0},uvTransform:{value:new Pe}},sprite:{diffuse:{value:new Oe(16777215)},opacity:{value:1},center:{value:new Be(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Pe},alphaMap:{value:null},alphaMapTransform:{value:new Pe},alphaTest:{value:0}}},It={basic:{uniforms:dt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.fog]),vertexShader:Ce.meshbasic_vert,fragmentShader:Ce.meshbasic_frag},lambert:{uniforms:dt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ce.meshlambert_vert,fragmentShader:Ce.meshlambert_frag},phong:{uniforms:dt([ie.common,ie.specularmap,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,ie.lights,{emissive:{value:new Oe(0)},specular:{value:new Oe(1118481)},shininess:{value:30}}]),vertexShader:Ce.meshphong_vert,fragmentShader:Ce.meshphong_frag},standard:{uniforms:dt([ie.common,ie.envmap,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.roughnessmap,ie.metalnessmap,ie.fog,ie.lights,{emissive:{value:new Oe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag},toon:{uniforms:dt([ie.common,ie.aomap,ie.lightmap,ie.emissivemap,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.gradientmap,ie.fog,ie.lights,{emissive:{value:new Oe(0)}}]),vertexShader:Ce.meshtoon_vert,fragmentShader:Ce.meshtoon_frag},matcap:{uniforms:dt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,ie.fog,{matcap:{value:null}}]),vertexShader:Ce.meshmatcap_vert,fragmentShader:Ce.meshmatcap_frag},points:{uniforms:dt([ie.points,ie.fog]),vertexShader:Ce.points_vert,fragmentShader:Ce.points_frag},dashed:{uniforms:dt([ie.common,ie.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ce.linedashed_vert,fragmentShader:Ce.linedashed_frag},depth:{uniforms:dt([ie.common,ie.displacementmap]),vertexShader:Ce.depth_vert,fragmentShader:Ce.depth_frag},normal:{uniforms:dt([ie.common,ie.bumpmap,ie.normalmap,ie.displacementmap,{opacity:{value:1}}]),vertexShader:Ce.meshnormal_vert,fragmentShader:Ce.meshnormal_frag},sprite:{uniforms:dt([ie.sprite,ie.fog]),vertexShader:Ce.sprite_vert,fragmentShader:Ce.sprite_frag},background:{uniforms:{uvTransform:{value:new Pe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ce.background_vert,fragmentShader:Ce.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Pe}},vertexShader:Ce.backgroundCube_vert,fragmentShader:Ce.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ce.cube_vert,fragmentShader:Ce.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ce.equirect_vert,fragmentShader:Ce.equirect_frag},distanceRGBA:{uniforms:dt([ie.common,ie.displacementmap,{referencePosition:{value:new O},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ce.distanceRGBA_vert,fragmentShader:Ce.distanceRGBA_frag},shadow:{uniforms:dt([ie.lights,ie.fog,{color:{value:new Oe(0)},opacity:{value:1}}]),vertexShader:Ce.shadow_vert,fragmentShader:Ce.shadow_frag}};It.physical={uniforms:dt([It.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Pe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Pe},clearcoatNormalScale:{value:new Be(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Pe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Pe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Pe},sheen:{value:0},sheenColor:{value:new Oe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Pe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Pe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Pe},transmissionSamplerSize:{value:new Be},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Pe},attenuationDistance:{value:0},attenuationColor:{value:new Oe(0)},specularColor:{value:new Oe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Pe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Pe},anisotropyVector:{value:new Be},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Pe}}]),vertexShader:Ce.meshphysical_vert,fragmentShader:Ce.meshphysical_frag};const Bi={r:0,b:0,g:0},fr=new Ft,yu=new it;function bu(i,e,t,r,a,n,o){const s=new Oe(0);let l=n===!0?0:1,c,u,f=null,p=0,m=null;function x(b){let E=b.isScene===!0?b.background:null;return E&&E.isTexture&&(E=(b.backgroundBlurriness>0?t:e).get(E)),E}function M(b){let E=!1;const y=x(b);y===null?h(s,l):y&&y.isColor&&(h(y,1),E=!0);const B=i.xr.getEnvironmentBlendMode();B==="additive"?r.buffers.color.setClear(0,0,0,1,o):B==="alpha-blend"&&r.buffers.color.setClear(0,0,0,0,o),(i.autoClear||E)&&(r.buffers.depth.setTest(!0),r.buffers.depth.setMask(!0),r.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function d(b,E){const y=x(E);y&&(y.isCubeTexture||y.mapping===Qi)?(u===void 0&&(u=new Nt(new fi(1,1,1),new Kt({name:"BackgroundCubeMaterial",uniforms:ti(It.backgroundCube.uniforms),vertexShader:It.backgroundCube.vertexShader,fragmentShader:It.backgroundCube.fragmentShader,side:mt,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(B,R,w){this.matrixWorld.copyPosition(w.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(u)),fr.copy(E.backgroundRotation),fr.x*=-1,fr.y*=-1,fr.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(fr.y*=-1,fr.z*=-1),u.material.uniforms.envMap.value=y,u.material.uniforms.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=E.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(yu.makeRotationFromEuler(fr)),u.material.toneMapped=Ve.getTransfer(y.colorSpace)!==Xe,(f!==y||p!==y.version||m!==i.toneMapping)&&(u.material.needsUpdate=!0,f=y,p=y.version,m=i.toneMapping),u.layers.enableAll(),b.unshift(u,u.geometry,u.material,0,0,null)):y&&y.isTexture&&(c===void 0&&(c=new Nt(new mi(2,2),new Kt({name:"BackgroundMaterial",uniforms:ti(It.background.uniforms),vertexShader:It.background.vertexShader,fragmentShader:It.background.fragmentShader,side:sr,depthTest:!1,depthWrite:!1,fog:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=y,c.material.uniforms.backgroundIntensity.value=E.backgroundIntensity,c.material.toneMapped=Ve.getTransfer(y.colorSpace)!==Xe,y.matrixAutoUpdate===!0&&y.updateMatrix(),c.material.uniforms.uvTransform.value.copy(y.matrix),(f!==y||p!==y.version||m!==i.toneMapping)&&(c.material.needsUpdate=!0,f=y,p=y.version,m=i.toneMapping),c.layers.enableAll(),b.unshift(c,c.geometry,c.material,0,0,null))}function h(b,E){b.getRGB(Bi,no(i)),r.buffers.color.setClear(Bi.r,Bi.g,Bi.b,E,o)}return{getClearColor:function(){return s},setClearColor:function(b,E=1){s.set(b),l=E,h(s,l)},getClearAlpha:function(){return l},setClearAlpha:function(b){l=b,h(s,l)},render:M,addToRenderList:d}}function Au(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),r={},a=p(null);let n=a,o=!1;function s(v,P,H,z,X){let Y=!1;const k=f(z,H,P);n!==k&&(n=k,c(n.object)),Y=m(v,z,H,X),Y&&x(v,z,H,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(Y||o)&&(o=!1,y(v,P,H,z),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return i.createVertexArray()}function c(v){return i.bindVertexArray(v)}function u(v){return i.deleteVertexArray(v)}function f(v,P,H){const z=H.wireframe===!0;let X=r[v.id];X===void 0&&(X={},r[v.id]=X);let Y=X[P.id];Y===void 0&&(Y={},X[P.id]=Y);let k=Y[z];return k===void 0&&(k=p(l()),Y[z]=k),k}function p(v){const P=[],H=[],z=[];for(let X=0;X<t;X++)P[X]=0,H[X]=0,z[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:P,enabledAttributes:H,attributeDivisors:z,object:v,attributes:{},index:null}}function m(v,P,H,z){const X=n.attributes,Y=P.attributes;let k=0;const Z=H.getAttributes();for(const V in Z)if(Z[V].location>=0){const ae=X[V];let me=Y[V];if(me===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(me=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(me=v.instanceColor)),ae===void 0||ae.attribute!==me||me&&ae.data!==me.data)return!0;k++}return n.attributesNum!==k||n.index!==z}function x(v,P,H,z){const X={},Y=P.attributes;let k=0;const Z=H.getAttributes();for(const V in Z)if(Z[V].location>=0){let ae=Y[V];ae===void 0&&(V==="instanceMatrix"&&v.instanceMatrix&&(ae=v.instanceMatrix),V==="instanceColor"&&v.instanceColor&&(ae=v.instanceColor));const me={};me.attribute=ae,ae&&ae.data&&(me.data=ae.data),X[V]=me,k++}n.attributes=X,n.attributesNum=k,n.index=z}function M(){const v=n.newAttributes;for(let P=0,H=v.length;P<H;P++)v[P]=0}function d(v){h(v,0)}function h(v,P){const H=n.newAttributes,z=n.enabledAttributes,X=n.attributeDivisors;H[v]=1,z[v]===0&&(i.enableVertexAttribArray(v),z[v]=1),X[v]!==P&&(i.vertexAttribDivisor(v,P),X[v]=P)}function b(){const v=n.newAttributes,P=n.enabledAttributes;for(let H=0,z=P.length;H<z;H++)P[H]!==v[H]&&(i.disableVertexAttribArray(H),P[H]=0)}function E(v,P,H,z,X,Y,k){k===!0?i.vertexAttribIPointer(v,P,H,X,Y):i.vertexAttribPointer(v,P,H,z,X,Y)}function y(v,P,H,z){M();const X=z.attributes,Y=H.getAttributes(),k=P.defaultAttributeValues;for(const Z in Y){const V=Y[Z];if(V.location>=0){let ae=X[Z];if(ae===void 0&&(Z==="instanceMatrix"&&v.instanceMatrix&&(ae=v.instanceMatrix),Z==="instanceColor"&&v.instanceColor&&(ae=v.instanceColor)),ae!==void 0){const me=ae.normalized,Me=ae.itemSize,De=e.get(ae);if(De===void 0)continue;const ke=De.buffer,G=De.type,Q=De.bytesPerElement,ue=G===i.INT||G===i.UNSIGNED_INT||ae.gpuType===vn;if(ae.isInterleavedBufferAttribute){const oe=ae.data,Ae=oe.stride,Le=ae.offset;if(oe.isInstancedInterleavedBuffer){for(let Ie=0;Ie<V.locationSize;Ie++)h(V.location+Ie,oe.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=oe.meshPerAttribute*oe.count)}else for(let Ie=0;Ie<V.locationSize;Ie++)d(V.location+Ie);i.bindBuffer(i.ARRAY_BUFFER,ke);for(let Ie=0;Ie<V.locationSize;Ie++)E(V.location+Ie,Me/V.locationSize,G,me,Ae*Q,(Le+Me/V.locationSize*Ie)*Q,ue)}else{if(ae.isInstancedBufferAttribute){for(let oe=0;oe<V.locationSize;oe++)h(V.location+oe,ae.meshPerAttribute);v.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ae.meshPerAttribute*ae.count)}else for(let oe=0;oe<V.locationSize;oe++)d(V.location+oe);i.bindBuffer(i.ARRAY_BUFFER,ke);for(let oe=0;oe<V.locationSize;oe++)E(V.location+oe,Me/V.locationSize,G,me,Me*Q,Me/V.locationSize*oe*Q,ue)}}else if(k!==void 0){const me=k[Z];if(me!==void 0)switch(me.length){case 2:i.vertexAttrib2fv(V.location,me);break;case 3:i.vertexAttrib3fv(V.location,me);break;case 4:i.vertexAttrib4fv(V.location,me);break;default:i.vertexAttrib1fv(V.location,me)}}}}b()}function B(){F();for(const v in r){const P=r[v];for(const H in P){const z=P[H];for(const X in z)u(z[X].object),delete z[X];delete P[H]}delete r[v]}}function R(v){if(r[v.id]===void 0)return;const P=r[v.id];for(const H in P){const z=P[H];for(const X in z)u(z[X].object),delete z[X];delete P[H]}delete r[v.id]}function w(v){for(const P in r){const H=r[P];if(H[v.id]===void 0)continue;const z=H[v.id];for(const X in z)u(z[X].object),delete z[X];delete H[v.id]}}function F(){S(),o=!0,n!==a&&(n=a,c(n.object))}function S(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:s,reset:F,resetDefaultState:S,dispose:B,releaseStatesOfGeometry:R,releaseStatesOfProgram:w,initAttributes:M,enableAttribute:d,disableUnusedAttributes:b}}function wu(i,e,t){let r;function a(c){r=c}function n(c,u){i.drawArrays(r,c,u),t.update(u,r,1)}function o(c,u,f){f!==0&&(i.drawArraysInstanced(r,c,u,f),t.update(u,r,f))}function s(c,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(r,c,0,u,0,f);let p=0;for(let m=0;m<f;m++)p+=u[m];t.update(p,r,1)}function l(c,u,f,p){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let x=0;x<c.length;x++)o(c[x],u[x],p[x]);else{m.multiDrawArraysInstancedWEBGL(r,c,0,u,0,p,0,f);let x=0;for(let M=0;M<f;M++)x+=u[M];for(let M=0;M<p.length;M++)t.update(x,r,p[M])}}this.setMode=a,this.render=n,this.renderInstances=o,this.renderMultiDraw=s,this.renderMultiDrawInstances=l}function Ru(i,e,t,r){let a;function n(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");a=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function o(R){return!(R!==Pt&&r.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function s(R){const w=R===hi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Yt&&r.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==qt&&!w)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const u=l(c);u!==c&&(console.warn("THREE.WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=t.logarithmicDepthBuffer===!0,p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_TEXTURE_SIZE),M=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),d=i.getParameter(i.MAX_VERTEX_ATTRIBS),h=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),b=i.getParameter(i.MAX_VARYING_VECTORS),E=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),y=m>0,B=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:n,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:s,precision:c,logarithmicDepthBuffer:f,maxTextures:p,maxVertexTextures:m,maxTextureSize:x,maxCubemapSize:M,maxAttributes:d,maxVertexUniforms:h,maxVaryings:b,maxFragmentUniforms:E,vertexTextures:y,maxSamples:B}}function Cu(i){const e=this;let t=null,r=0,a=!1,n=!1;const o=new gr,s=new Pe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||r!==0||a;return a=p,r=f.length,m},this.beginShadows=function(){n=!0,u(null)},this.endShadows=function(){n=!1},this.setGlobalState=function(f,p){t=u(f,p,0)},this.setState=function(f,p,m){const x=f.clippingPlanes,M=f.clipIntersection,d=f.clipShadows,h=i.get(f);if(!a||x===null||x.length===0||n&&!d)n?u(null):c();else{const b=n?0:r,E=b*4;let y=h.clippingState||null;l.value=y,y=u(x,p,E,m);for(let B=0;B!==E;++B)y[B]=t[B];h.clippingState=y,this.numIntersection=M?this.numPlanes:0,this.numPlanes+=b}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=r>0),e.numPlanes=r,e.numIntersection=0}function u(f,p,m,x){const M=f!==null?f.length:0;let d=null;if(M!==0){if(d=l.value,x!==!0||d===null){const h=m+M*4,b=p.matrixWorldInverse;s.getNormalMatrix(b),(d===null||d.length<h)&&(d=new Float32Array(h));for(let E=0,y=m;E!==M;++E,y+=4)o.copy(f[E]).applyMatrix4(b,s),o.normal.toArray(d,y),d[y+3]=o.constant}l.value=d,l.needsUpdate=!0}return e.numPlanes=M,e.numIntersection=0,d}}function Pu(i){let e=new WeakMap;function t(o,s){return s===Ba?o.mapping=Jr:s===za&&(o.mapping=$r),o}function r(o){if(o&&o.isTexture){const s=o.mapping;if(s===Ba||s===za)if(e.has(o)){const l=e.get(o).texture;return t(l,o.mapping)}else{const l=o.image;if(l&&l.height>0){const c=new Vl(l.height);return c.fromEquirectangularTexture(i,o),e.set(o,c),o.addEventListener("dispose",a),t(c.texture,o.mapping)}else return null}}return o}function a(o){const s=o.target;s.removeEventListener("dispose",a);const l=e.get(s);l!==void 0&&(e.delete(s),l.dispose())}function n(){e=new WeakMap}return{get:r,dispose:n}}class Lu extends so{constructor(e=-1,t=1,r=1,a=-1,n=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=r,this.bottom=a,this.near=n,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,r,a,n,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=r,this.view.offsetY=a,this.view.width=n,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),r=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let n=r-e,o=r+e,s=a+t,l=a-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;n+=c*this.view.offsetX,o=n+c*this.view.width,s-=u*this.view.offsetY,l=s-u*this.view.height}this.projectionMatrix.makeOrthographic(n,o,s,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}const jr=4,cs=[.125,.215,.35,.446,.526,.582],xr=20,Ca=new Lu,hs=new Oe;let Pa=null,La=0,Ua=0,Ia=!1;const _r=(1+Math.sqrt(5))/2,Wr=1/_r,us=[new O(-_r,Wr,0),new O(_r,Wr,0),new O(-Wr,0,_r),new O(Wr,0,_r),new O(0,_r,-Wr),new O(0,_r,Wr),new O(-1,1,-1),new O(1,1,-1),new O(-1,1,1),new O(1,1,1)];class ds{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,r=.1,a=100){Pa=this._renderer.getRenderTarget(),La=this._renderer.getActiveCubeFace(),Ua=this._renderer.getActiveMipmapLevel(),Ia=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const n=this._allocateTargets();return n.depthBuffer=!0,this._sceneToCubeUV(e,r,a,n),t>0&&this._blur(n,0,0,t),this._applyPMREM(n),this._cleanup(n),n}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=ms(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fs(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(Pa,La,Ua),this._renderer.xr.enabled=Ia,e.scissorTest=!1,zi(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Jr||e.mapping===$r?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Pa=this._renderer.getRenderTarget(),La=this._renderer.getActiveCubeFace(),Ua=this._renderer.getActiveMipmapLevel(),Ia=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const r=t||this._allocateTargets();return this._textureToCubeUV(e,r),this._applyPMREM(r),this._cleanup(r),r}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,r={magFilter:Ct,minFilter:Ct,generateMipmaps:!1,type:hi,format:Pt,colorSpace:or,depthBuffer:!1},a=ps(e,t,r);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ps(e,t,r);const{_lodMax:n}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Uu(n)),this._blurMaterial=Iu(n,e,t)}return a}_compileMaterial(e){const t=new Nt(this._lodPlanes[0],e);this._renderer.compile(t,Ca)}_sceneToCubeUV(e,t,r,a){const n=new Tt(90,1,t,r),o=[1,-1,1,1,1,1],s=[1,1,1,-1,-1,-1],l=this._renderer,c=l.autoClear,u=l.toneMapping;l.getClearColor(hs),l.toneMapping=nr,l.autoClear=!1;const f=new ro({name:"PMREM.Background",side:mt,depthWrite:!1,depthTest:!1}),p=new Nt(new fi,f);let m=!1;const x=e.background;x?x.isColor&&(f.color.copy(x),e.background=null,m=!0):(f.color.copy(hs),m=!0);for(let M=0;M<6;M++){const d=M%3;d===0?(n.up.set(0,o[M],0),n.lookAt(s[M],0,0)):d===1?(n.up.set(0,0,o[M]),n.lookAt(0,s[M],0)):(n.up.set(0,o[M],0),n.lookAt(0,0,s[M]));const h=this._cubeSize;zi(a,d*h,M>2?h:0,h,h),l.setRenderTarget(a),m&&l.render(p,n),l.render(e,n)}p.geometry.dispose(),p.material.dispose(),l.toneMapping=u,l.autoClear=c,e.background=x}_textureToCubeUV(e,t){const r=this._renderer,a=e.mapping===Jr||e.mapping===$r;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=ms()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fs());const n=a?this._cubemapMaterial:this._equirectMaterial,o=new Nt(this._lodPlanes[0],n),s=n.uniforms;s.envMap.value=e;const l=this._cubeSize;zi(t,0,0,3*l,2*l),r.setRenderTarget(t),r.render(o,Ca)}_applyPMREM(e){const t=this._renderer,r=t.autoClear;t.autoClear=!1;const a=this._lodPlanes.length;for(let n=1;n<a;n++){const o=Math.sqrt(this._sigmas[n]*this._sigmas[n]-this._sigmas[n-1]*this._sigmas[n-1]),s=us[(a-n-1)%us.length];this._blur(e,n-1,n,o,s)}t.autoClear=r}_blur(e,t,r,a,n){const o=this._pingPongRenderTarget;this._halfBlur(e,o,t,r,a,"latitudinal",n),this._halfBlur(o,e,r,r,a,"longitudinal",n)}_halfBlur(e,t,r,a,n,o,s){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Nt(this._lodPlanes[a],c),p=c.uniforms,m=this._sizeLods[r]-1,x=isFinite(n)?Math.PI/(2*m):2*Math.PI/(2*xr-1),M=n/x,d=isFinite(n)?1+Math.floor(u*M):xr;d>xr&&console.warn(`sigmaRadians, ${n}, is too large and will clip, as it requested ${d} samples when the maximum is set to ${xr}`);const h=[];let b=0;for(let w=0;w<xr;++w){const F=w/M,S=Math.exp(-F*F/2);h.push(S),w===0?b+=S:w<d&&(b+=2*S)}for(let w=0;w<h.length;w++)h[w]=h[w]/b;p.envMap.value=e.texture,p.samples.value=d,p.weights.value=h,p.latitudinal.value=o==="latitudinal",s&&(p.poleAxis.value=s);const{_lodMax:E}=this;p.dTheta.value=x,p.mipInt.value=E-r;const y=this._sizeLods[a],B=3*y*(a>E-jr?a-E+jr:0),R=4*(this._cubeSize-y);zi(t,B,R,3*y,2*y),l.setRenderTarget(t),l.render(f,Ca)}}function Uu(i){const e=[],t=[],r=[];let a=i;const n=i-jr+1+cs.length;for(let o=0;o<n;o++){const s=Math.pow(2,a);t.push(s);let l=1/s;o>i-jr?l=cs[o-i+jr-1]:o===0&&(l=0),r.push(l);const c=1/(s-2),u=-c,f=1+c,p=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,x=6,M=3,d=2,h=1,b=new Float32Array(M*x*m),E=new Float32Array(d*x*m),y=new Float32Array(h*x*m);for(let R=0;R<m;R++){const w=R%3*2/3-1,F=R>2?0:-1,S=[w,F,0,w+2/3,F,0,w+2/3,F+1,0,w,F,0,w+2/3,F+1,0,w,F+1,0];b.set(S,M*x*R),E.set(p,d*x*R);const v=[R,R,R,R,R,R];y.set(v,h*x*R)}const B=new Ar;B.setAttribute("position",new Ot(b,M)),B.setAttribute("uv",new Ot(E,d)),B.setAttribute("faceIndex",new Ot(y,h)),e.push(B),a>jr&&a--}return{lodPlanes:e,sizeLods:t,sigmas:r}}function ps(i,e,t){const r=new yr(i,e,t);return r.texture.mapping=Qi,r.texture.name="PMREM.cubeUv",r.scissorTest=!0,r}function zi(i,e,t,r,a){i.viewport.set(e,t,r,a),i.scissor.set(e,t,r,a)}function Iu(i,e,t){const r=new Float32Array(xr),a=new O(0,1,0);return new Kt({name:"SphericalGaussianBlur",defines:{n:xr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:r},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:An(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:ar,depthTest:!1,depthWrite:!1})}function fs(){return new Kt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:An(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:ar,depthTest:!1,depthWrite:!1})}function ms(){return new Kt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:An(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:ar,depthTest:!1,depthWrite:!1})}function An(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Du(i){let e=new WeakMap,t=null;function r(s){if(s&&s.isTexture){const l=s.mapping,c=l===Ba||l===za,u=l===Jr||l===$r;if(c||u){let f=e.get(s);const p=f!==void 0?f.texture.pmremVersion:0;if(s.isRenderTargetTexture&&s.pmremVersion!==p)return t===null&&(t=new ds(i)),f=c?t.fromEquirectangular(s,f):t.fromCubemap(s,f),f.texture.pmremVersion=s.pmremVersion,e.set(s,f),f.texture;if(f!==void 0)return f.texture;{const m=s.image;return c&&m&&m.height>0||u&&m&&a(m)?(t===null&&(t=new ds(i)),f=c?t.fromEquirectangular(s):t.fromCubemap(s),f.texture.pmremVersion=s.pmremVersion,e.set(s,f),s.addEventListener("dispose",n),f.texture):null}}}return s}function a(s){let l=0;const c=6;for(let u=0;u<c;u++)s[u]!==void 0&&l++;return l===c}function n(s){const l=s.target;l.removeEventListener("dispose",n);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:r,dispose:o}}function Nu(i){const e={};function t(r){if(e[r]!==void 0)return e[r];let a;switch(r){case"WEBGL_depth_texture":a=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":a=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":a=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":a=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:a=i.getExtension(r)}return e[r]=a,a}return{has:function(r){return t(r)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(r){const a=t(r);return a===null&&Js("THREE.WebGLRenderer: "+r+" extension not supported."),a}}}function Ou(i,e,t,r){const a={},n=new WeakMap;function o(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const x in p.attributes)e.remove(p.attributes[x]);for(const x in p.morphAttributes){const M=p.morphAttributes[x];for(let d=0,h=M.length;d<h;d++)e.remove(M[d])}p.removeEventListener("dispose",o),delete a[p.id];const m=n.get(p);m&&(e.remove(m),n.delete(p)),r.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,t.memory.geometries--}function s(f,p){return a[p.id]===!0||(p.addEventListener("dispose",o),a[p.id]=!0,t.memory.geometries++),p}function l(f){const p=f.attributes;for(const x in p)e.update(p[x],i.ARRAY_BUFFER);const m=f.morphAttributes;for(const x in m){const M=m[x];for(let d=0,h=M.length;d<h;d++)e.update(M[d],i.ARRAY_BUFFER)}}function c(f){const p=[],m=f.index,x=f.attributes.position;let M=0;if(m!==null){const b=m.array;M=m.version;for(let E=0,y=b.length;E<y;E+=3){const B=b[E+0],R=b[E+1],w=b[E+2];p.push(B,R,R,w,w,B)}}else if(x!==void 0){const b=x.array;M=x.version;for(let E=0,y=b.length/3-1;E<y;E+=3){const B=E+0,R=E+1,w=E+2;p.push(B,R,R,w,w,B)}}else return;const d=new(Zs(p)?ao:io)(p,1);d.version=M;const h=n.get(f);h&&e.remove(h),n.set(f,d)}function u(f){const p=n.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&c(f)}else c(f);return n.get(f)}return{get:s,update:l,getWireframeAttribute:u}}function Fu(i,e,t){let r;function a(p){r=p}let n,o;function s(p){n=p.type,o=p.bytesPerElement}function l(p,m){i.drawElements(r,m,n,p*o),t.update(m,r,1)}function c(p,m,x){x!==0&&(i.drawElementsInstanced(r,m,n,p*o,x),t.update(m,r,x))}function u(p,m,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(r,m,0,n,p,0,x);let M=0;for(let d=0;d<x;d++)M+=m[d];t.update(M,r,1)}function f(p,m,x,M){if(x===0)return;const d=e.get("WEBGL_multi_draw");if(d===null)for(let h=0;h<p.length;h++)c(p[h]/o,m[h],M[h]);else{d.multiDrawElementsInstancedWEBGL(r,m,0,n,p,0,M,0,x);let h=0;for(let b=0;b<x;b++)h+=m[b];for(let b=0;b<M.length;b++)t.update(h,r,M[b])}}this.setMode=a,this.setIndex=s,this.render=l,this.renderInstances=c,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Bu(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function r(n,o,s){switch(t.calls++,o){case i.TRIANGLES:t.triangles+=s*(n/3);break;case i.LINES:t.lines+=s*(n/2);break;case i.LINE_STRIP:t.lines+=s*(n-1);break;case i.LINE_LOOP:t.lines+=s*n;break;case i.POINTS:t.points+=s*n;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:r}}function zu(i,e,t){const r=new WeakMap,a=new ot;function n(o,s,l){const c=o.morphTargetInfluences,u=s.morphAttributes.position||s.morphAttributes.normal||s.morphAttributes.color,f=u!==void 0?u.length:0;let p=r.get(s);if(p===void 0||p.count!==f){let m=function(){F.dispose(),r.delete(s),s.removeEventListener("dispose",m)};p!==void 0&&p.texture.dispose();const x=s.morphAttributes.position!==void 0,M=s.morphAttributes.normal!==void 0,d=s.morphAttributes.color!==void 0,h=s.morphAttributes.position||[],b=s.morphAttributes.normal||[],E=s.morphAttributes.color||[];let y=0;x===!0&&(y=1),M===!0&&(y=2),d===!0&&(y=3);let B=s.attributes.position.count*y,R=1;B>e.maxTextureSize&&(R=Math.ceil(B/e.maxTextureSize),B=e.maxTextureSize);const w=new Float32Array(B*R*4*f),F=new Qs(w,B,R,f);F.type=qt,F.needsUpdate=!0;const S=y*4;for(let v=0;v<f;v++){const P=h[v],H=b[v],z=E[v],X=B*R*4*v;for(let Y=0;Y<P.count;Y++){const k=Y*S;x===!0&&(a.fromBufferAttribute(P,Y),w[X+k+0]=a.x,w[X+k+1]=a.y,w[X+k+2]=a.z,w[X+k+3]=0),M===!0&&(a.fromBufferAttribute(H,Y),w[X+k+4]=a.x,w[X+k+5]=a.y,w[X+k+6]=a.z,w[X+k+7]=0),d===!0&&(a.fromBufferAttribute(z,Y),w[X+k+8]=a.x,w[X+k+9]=a.y,w[X+k+10]=a.z,w[X+k+11]=z.itemSize===4?a.w:1)}}p={count:f,texture:F,size:new Be(B,R)},r.set(s,p),s.addEventListener("dispose",m)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",o.morphTexture,t);else{let m=0;for(let M=0;M<c.length;M++)m+=c[M];const x=s.morphTargetsRelative?1:1-m;l.getUniforms().setValue(i,"morphTargetBaseInfluence",x),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",p.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",p.size)}return{update:n}}function Hu(i,e,t,r){let a=new WeakMap;function n(l){const c=r.render.frame,u=l.geometry,f=e.get(l,u);if(a.get(f)!==c&&(e.update(f),a.set(f,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",s)===!1&&l.addEventListener("dispose",s),a.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const p=l.skeleton;a.get(p)!==c&&(p.update(),a.set(p,c))}return f}function o(){a=new WeakMap}function s(l){const c=l.target;c.removeEventListener("dispose",s),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:n,dispose:o}}class ho extends gt{constructor(e,t,r,a,n,o,s,l,c,u=Kr){if(u!==Kr&&u!==ei)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");r===void 0&&u===Kr&&(r=Tr),r===void 0&&u===ei&&(r=Qr),super(null,a,n,o,s,l,u,r,c),this.isDepthTexture=!0,this.image={width:e,height:t},this.magFilter=s!==void 0?s:yt,this.minFilter=l!==void 0?l:yt,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}const uo=new gt,gs=new ho(1,1),po=new Qs,fo=new yl,mo=new oo,_s=[],vs=[],xs=new Float32Array(16),Ms=new Float32Array(9),Ss=new Float32Array(4);function ri(i,e,t){const r=i[0];if(r<=0||r>0)return i;const a=e*t;let n=_s[a];if(n===void 0&&(n=new Float32Array(a),_s[a]=n),e!==0){r.toArray(n,0);for(let o=1,s=0;o!==e;++o)s+=t,i[o].toArray(n,s)}return n}function at(i,e){if(i.length!==e.length)return!1;for(let t=0,r=i.length;t<r;t++)if(i[t]!==e[t])return!1;return!0}function nt(i,e){for(let t=0,r=e.length;t<r;t++)i[t]=e[t]}function ra(i,e){let t=vs[e];t===void 0&&(t=new Int32Array(e),vs[e]=t);for(let r=0;r!==e;++r)t[r]=i.allocateTextureUnit();return t}function Vu(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function ku(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(at(t,e))return;i.uniform2fv(this.addr,e),nt(t,e)}}function Gu(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(at(t,e))return;i.uniform3fv(this.addr,e),nt(t,e)}}function Wu(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(at(t,e))return;i.uniform4fv(this.addr,e),nt(t,e)}}function Xu(i,e){const t=this.cache,r=e.elements;if(r===void 0){if(at(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),nt(t,e)}else{if(at(t,r))return;Ss.set(r),i.uniformMatrix2fv(this.addr,!1,Ss),nt(t,r)}}function qu(i,e){const t=this.cache,r=e.elements;if(r===void 0){if(at(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),nt(t,e)}else{if(at(t,r))return;Ms.set(r),i.uniformMatrix3fv(this.addr,!1,Ms),nt(t,r)}}function ju(i,e){const t=this.cache,r=e.elements;if(r===void 0){if(at(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),nt(t,e)}else{if(at(t,r))return;xs.set(r),i.uniformMatrix4fv(this.addr,!1,xs),nt(t,r)}}function Yu(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Ku(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(at(t,e))return;i.uniform2iv(this.addr,e),nt(t,e)}}function Zu(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(at(t,e))return;i.uniform3iv(this.addr,e),nt(t,e)}}function Ju(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(at(t,e))return;i.uniform4iv(this.addr,e),nt(t,e)}}function $u(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Qu(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(at(t,e))return;i.uniform2uiv(this.addr,e),nt(t,e)}}function ed(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(at(t,e))return;i.uniform3uiv(this.addr,e),nt(t,e)}}function td(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(at(t,e))return;i.uniform4uiv(this.addr,e),nt(t,e)}}function rd(i,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(i.uniform1i(this.addr,a),r[0]=a);let n;this.type===i.SAMPLER_2D_SHADOW?(gs.compareFunction=Ks,n=gs):n=uo,t.setTexture2D(e||n,a)}function id(i,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(i.uniform1i(this.addr,a),r[0]=a),t.setTexture3D(e||fo,a)}function ad(i,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(i.uniform1i(this.addr,a),r[0]=a),t.setTextureCube(e||mo,a)}function nd(i,e,t){const r=this.cache,a=t.allocateTextureUnit();r[0]!==a&&(i.uniform1i(this.addr,a),r[0]=a),t.setTexture2DArray(e||po,a)}function sd(i){switch(i){case 5126:return Vu;case 35664:return ku;case 35665:return Gu;case 35666:return Wu;case 35674:return Xu;case 35675:return qu;case 35676:return ju;case 5124:case 35670:return Yu;case 35667:case 35671:return Ku;case 35668:case 35672:return Zu;case 35669:case 35673:return Ju;case 5125:return $u;case 36294:return Qu;case 36295:return ed;case 36296:return td;case 35678:case 36198:case 36298:case 36306:case 35682:return rd;case 35679:case 36299:case 36307:return id;case 35680:case 36300:case 36308:case 36293:return ad;case 36289:case 36303:case 36311:case 36292:return nd}}function od(i,e){i.uniform1fv(this.addr,e)}function ld(i,e){const t=ri(e,this.size,2);i.uniform2fv(this.addr,t)}function cd(i,e){const t=ri(e,this.size,3);i.uniform3fv(this.addr,t)}function hd(i,e){const t=ri(e,this.size,4);i.uniform4fv(this.addr,t)}function ud(i,e){const t=ri(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function dd(i,e){const t=ri(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function pd(i,e){const t=ri(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function fd(i,e){i.uniform1iv(this.addr,e)}function md(i,e){i.uniform2iv(this.addr,e)}function gd(i,e){i.uniform3iv(this.addr,e)}function _d(i,e){i.uniform4iv(this.addr,e)}function vd(i,e){i.uniform1uiv(this.addr,e)}function xd(i,e){i.uniform2uiv(this.addr,e)}function Md(i,e){i.uniform3uiv(this.addr,e)}function Sd(i,e){i.uniform4uiv(this.addr,e)}function Ed(i,e,t){const r=this.cache,a=e.length,n=ra(t,a);at(r,n)||(i.uniform1iv(this.addr,n),nt(r,n));for(let o=0;o!==a;++o)t.setTexture2D(e[o]||uo,n[o])}function Td(i,e,t){const r=this.cache,a=e.length,n=ra(t,a);at(r,n)||(i.uniform1iv(this.addr,n),nt(r,n));for(let o=0;o!==a;++o)t.setTexture3D(e[o]||fo,n[o])}function yd(i,e,t){const r=this.cache,a=e.length,n=ra(t,a);at(r,n)||(i.uniform1iv(this.addr,n),nt(r,n));for(let o=0;o!==a;++o)t.setTextureCube(e[o]||mo,n[o])}function bd(i,e,t){const r=this.cache,a=e.length,n=ra(t,a);at(r,n)||(i.uniform1iv(this.addr,n),nt(r,n));for(let o=0;o!==a;++o)t.setTexture2DArray(e[o]||po,n[o])}function Ad(i){switch(i){case 5126:return od;case 35664:return ld;case 35665:return cd;case 35666:return hd;case 35674:return ud;case 35675:return dd;case 35676:return pd;case 5124:case 35670:return fd;case 35667:case 35671:return md;case 35668:case 35672:return gd;case 35669:case 35673:return _d;case 5125:return vd;case 36294:return xd;case 36295:return Md;case 36296:return Sd;case 35678:case 36198:case 36298:case 36306:case 35682:return Ed;case 35679:case 36299:case 36307:return Td;case 35680:case 36300:case 36308:case 36293:return yd;case 36289:case 36303:case 36311:case 36292:return bd}}class wd{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.setValue=sd(t.type)}}class Rd{constructor(e,t,r){this.id=e,this.addr=r,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Ad(t.type)}}class Cd{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,r){const a=this.seq;for(let n=0,o=a.length;n!==o;++n){const s=a[n];s.setValue(e,t[s.id],r)}}}const Da=/(\w+)(\])?(\[|\.)?/g;function Es(i,e){i.seq.push(e),i.map[e.id]=e}function Pd(i,e,t){const r=i.name,a=r.length;for(Da.lastIndex=0;;){const n=Da.exec(r),o=Da.lastIndex;let s=n[1];const l=n[2]==="]",c=n[3];if(l&&(s=s|0),c===void 0||c==="["&&o+2===a){Es(t,c===void 0?new wd(s,i,e):new Rd(s,i,e));break}else{let u=t.map[s];u===void 0&&(u=new Cd(s),Es(t,u)),t=u}}}class qi{constructor(e,t){this.seq=[],this.map={};const r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<r;++a){const n=e.getActiveUniform(t,a),o=e.getUniformLocation(t,n.name);Pd(n,o,this)}}setValue(e,t,r,a){const n=this.map[t];n!==void 0&&n.setValue(e,r,a)}setOptional(e,t,r){const a=t[r];a!==void 0&&this.setValue(e,r,a)}static upload(e,t,r,a){for(let n=0,o=t.length;n!==o;++n){const s=t[n],l=r[s.id];l.needsUpdate!==!1&&s.setValue(e,l.value,a)}}static seqWithValue(e,t){const r=[];for(let a=0,n=e.length;a!==n;++a){const o=e[a];o.id in t&&r.push(o)}return r}}function Ts(i,e,t){const r=i.createShader(e);return i.shaderSource(r,t),i.compileShader(r),r}const Ld=37297;let Ud=0;function Id(i,e){const t=i.split(`
`),r=[],a=Math.max(e-6,0),n=Math.min(e+6,t.length);for(let o=a;o<n;o++){const s=o+1;r.push(`${s===e?">":" "} ${s}: ${t[o]}`)}return r.join(`
`)}function Dd(i){const e=Ve.getPrimaries(Ve.workingColorSpace),t=Ve.getPrimaries(i);let r;switch(e===t?r="":e===Zi&&t===Ki?r="LinearDisplayP3ToLinearSRGB":e===Ki&&t===Zi&&(r="LinearSRGBToLinearDisplayP3"),i){case or:case ea:return[r,"LinearTransferOETF"];case Ut:case yn:return[r,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[r,"LinearTransferOETF"]}}function ys(i,e,t){const r=i.getShaderParameter(e,i.COMPILE_STATUS),a=i.getShaderInfoLog(e).trim();if(r&&a==="")return"";const n=/ERROR: 0:(\d+)/.exec(a);if(n){const o=parseInt(n[1]);return t.toUpperCase()+`

`+a+`

`+Id(i.getShaderSource(e),o)}else return a}function Nd(i,e){const t=Dd(e);return`vec4 ${i}( vec4 value ) { return ${t[0]}( ${t[1]}( value ) ); }`}function Od(i,e){let t;switch(e){case Jo:t="Linear";break;case $o:t="Reinhard";break;case Qo:t="OptimizedCineon";break;case el:t="ACESFilmic";break;case rl:t="AgX";break;case il:t="Neutral";break;case tl:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}function Fd(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(li).join(`
`)}function Bd(i){const e=[];for(const t in i){const r=i[t];r!==!1&&e.push("#define "+t+" "+r)}return e.join(`
`)}function zd(i,e){const t={},r=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let a=0;a<r;a++){const n=i.getActiveAttrib(e,a),o=n.name;let s=1;n.type===i.FLOAT_MAT2&&(s=2),n.type===i.FLOAT_MAT3&&(s=3),n.type===i.FLOAT_MAT4&&(s=4),t[o]={type:n.type,location:i.getAttribLocation(e,o),locationSize:s}}return t}function li(i){return i!==""}function bs(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function As(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Hd=/^[ \t]*#include +<([\w\d./]+)>/gm;function gn(i){return i.replace(Hd,kd)}const Vd=new Map;function kd(i,e){let t=Ce[e];if(t===void 0){const r=Vd.get(e);if(r!==void 0)t=Ce[r],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,r);else throw new Error("Can not resolve #include <"+e+">")}return gn(t)}const Gd=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function ws(i){return i.replace(Gd,Wd)}function Wd(i,e,t,r){let a="";for(let n=parseInt(e);n<parseInt(t);n++)a+=r.replace(/\[\s*i\s*\]/g,"[ "+n+" ]").replace(/UNROLLED_LOOP_INDEX/g,n);return a}function Rs(i){let e=`precision ${i.precision} float;
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
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Xd(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Os?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===To?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Wt&&(e="SHADOWMAP_TYPE_VSM"),e}function qd(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Jr:case $r:e="ENVMAP_TYPE_CUBE";break;case Qi:e="ENVMAP_TYPE_CUBE_UV";break}return e}function jd(i){let e="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case $r:e="ENVMAP_MODE_REFRACTION";break}return e}function Yd(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Fs:e="ENVMAP_BLENDING_MULTIPLY";break;case Ko:e="ENVMAP_BLENDING_MIX";break;case Zo:e="ENVMAP_BLENDING_ADD";break}return e}function Kd(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,r=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),7*16)),texelHeight:r,maxMip:t}}function Zd(i,e,t,r){const a=i.getContext(),n=t.defines;let o=t.vertexShader,s=t.fragmentShader;const l=Xd(t),c=qd(t),u=jd(t),f=Yd(t),p=Kd(t),m=Fd(t),x=Bd(n),M=a.createProgram();let d,h,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(d=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(li).join(`
`),d.length>0&&(d+=`
`),h=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(li).join(`
`),h.length>0&&(h+=`
`)):(d=[Rs(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+u:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(li).join(`
`),h=[Rs(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+u:"",t.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==nr?"#define TONE_MAPPING":"",t.toneMapping!==nr?Ce.tonemapping_pars_fragment:"",t.toneMapping!==nr?Od("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Ce.colorspace_pars_fragment,Nd("linearToOutputTexel",t.outputColorSpace),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(li).join(`
`)),o=gn(o),o=bs(o,t),o=As(o,t),s=gn(s),s=bs(s,t),s=As(s,t),o=ws(o),s=ws(s),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,d=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+d,h=["#define varying in",t.glslVersion===Gn?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Gn?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const E=b+d+o,y=b+h+s,B=Ts(a,a.VERTEX_SHADER,E),R=Ts(a,a.FRAGMENT_SHADER,y);a.attachShader(M,B),a.attachShader(M,R),t.index0AttributeName!==void 0?a.bindAttribLocation(M,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(M,0,"position"),a.linkProgram(M);function w(P){if(i.debug.checkShaderErrors){const H=a.getProgramInfoLog(M).trim(),z=a.getShaderInfoLog(B).trim(),X=a.getShaderInfoLog(R).trim();let Y=!0,k=!0;if(a.getProgramParameter(M,a.LINK_STATUS)===!1)if(Y=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(a,M,B,R);else{const Z=ys(a,B,"vertex"),V=ys(a,R,"fragment");console.error("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(M,a.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+H+`
`+Z+`
`+V)}else H!==""?console.warn("THREE.WebGLProgram: Program Info Log:",H):(z===""||X==="")&&(k=!1);k&&(P.diagnostics={runnable:Y,programLog:H,vertexShader:{log:z,prefix:d},fragmentShader:{log:X,prefix:h}})}a.deleteShader(B),a.deleteShader(R),F=new qi(a,M),S=zd(a,M)}let F;this.getUniforms=function(){return F===void 0&&w(this),F};let S;this.getAttributes=function(){return S===void 0&&w(this),S};let v=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=a.getProgramParameter(M,Ld)),v},this.destroy=function(){r.releaseStatesOfProgram(this),a.deleteProgram(M),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Ud++,this.cacheKey=e,this.usedTimes=1,this.program=M,this.vertexShader=B,this.fragmentShader=R,this}let Jd=0;class $d{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,r=e.fragmentShader,a=this._getShaderStage(t),n=this._getShaderStage(r),o=this._getShaderCacheForMaterial(e);return o.has(a)===!1&&(o.add(a),a.usedTimes++),o.has(n)===!1&&(o.add(n),n.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const r of t)r.usedTimes--,r.usedTimes===0&&this.shaderCache.delete(r.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let r=t.get(e);return r===void 0&&(r=new Set,t.set(e,r)),r}_getShaderStage(e){const t=this.shaderCache;let r=t.get(e);return r===void 0&&(r=new Qd(e),t.set(e,r)),r}}class Qd{constructor(e){this.id=Jd++,this.code=e,this.usedTimes=0}}function ep(i,e,t,r,a,n,o){const s=new eo,l=new $d,c=new Set,u=[],f=a.logarithmicDepthBuffer,p=a.vertexTextures;let m=a.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function M(S){return c.add(S),S===0?"uv":`uv${S}`}function d(S,v,P,H,z){const X=H.fog,Y=z.geometry,k=S.isMeshStandardMaterial?H.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||k),V=Z&&Z.mapping===Qi?Z.image.height:null,ae=x[S.type];S.precision!==null&&(m=a.getMaxPrecision(S.precision),m!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",m,"instead."));const me=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,Me=me!==void 0?me.length:0;let De=0;Y.morphAttributes.position!==void 0&&(De=1),Y.morphAttributes.normal!==void 0&&(De=2),Y.morphAttributes.color!==void 0&&(De=3);let ke,G,Q,ue;if(ae){const Fe=It[ae];ke=Fe.vertexShader,G=Fe.fragmentShader}else ke=S.vertexShader,G=S.fragmentShader,l.update(S),Q=l.getVertexShaderID(S),ue=l.getFragmentShaderID(S);const oe=i.getRenderTarget(),Ae=z.isInstancedMesh===!0,Le=z.isBatchedMesh===!0,Ie=!!S.map,Ye=!!S.matcap,A=!!Z,Ze=!!S.aoMap,ze=!!S.lightMap,Ge=!!S.bumpMap,ge=!!S.normalMap,Je=!!S.displacementMap,Te=!!S.emissiveMap,we=!!S.metalnessMap,T=!!S.roughnessMap,g=S.anisotropy>0,D=S.clearcoat>0,K=S.dispersion>0,$=S.iridescence>0,j=S.sheen>0,ve=S.transmission>0,ne=g&&!!S.anisotropyMap,ce=D&&!!S.clearcoatMap,be=D&&!!S.clearcoatNormalMap,ee=D&&!!S.clearcoatRoughnessMap,he=$&&!!S.iridescenceMap,Ne=$&&!!S.iridescenceThicknessMap,Ee=j&&!!S.sheenColorMap,le=j&&!!S.sheenRoughnessMap,ye=!!S.specularMap,Ue=!!S.specularColorMap,je=!!S.specularIntensityMap,C=ve&&!!S.transmissionMap,te=ve&&!!S.thicknessMap,W=!!S.gradientMap,q=!!S.alphaMap,re=S.alphaTest>0,_e=!!S.alphaHash,We=!!S.extensions;let $e=nr;S.toneMapped&&(oe===null||oe.isXRRenderTarget===!0)&&($e=i.toneMapping);const lt={shaderID:ae,shaderType:S.type,shaderName:S.name,vertexShader:ke,fragmentShader:G,defines:S.defines,customVertexShaderID:Q,customFragmentShaderID:ue,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:m,batching:Le,batchingColor:Le&&z._colorsTexture!==null,instancing:Ae,instancingColor:Ae&&z.instanceColor!==null,instancingMorph:Ae&&z.morphTexture!==null,supportsVertexTextures:p,outputColorSpace:oe===null?i.outputColorSpace:oe.isXRRenderTarget===!0?oe.texture.colorSpace:or,alphaToCoverage:!!S.alphaToCoverage,map:Ie,matcap:Ye,envMap:A,envMapMode:A&&Z.mapping,envMapCubeUVHeight:V,aoMap:Ze,lightMap:ze,bumpMap:Ge,normalMap:ge,displacementMap:p&&Je,emissiveMap:Te,normalMapObjectSpace:ge&&S.normalMapType===ll,normalMapTangentSpace:ge&&S.normalMapType===ol,metalnessMap:we,roughnessMap:T,anisotropy:g,anisotropyMap:ne,clearcoat:D,clearcoatMap:ce,clearcoatNormalMap:be,clearcoatRoughnessMap:ee,dispersion:K,iridescence:$,iridescenceMap:he,iridescenceThicknessMap:Ne,sheen:j,sheenColorMap:Ee,sheenRoughnessMap:le,specularMap:ye,specularColorMap:Ue,specularIntensityMap:je,transmission:ve,transmissionMap:C,thicknessMap:te,gradientMap:W,opaque:S.transparent===!1&&S.blending===Yr&&S.alphaToCoverage===!1,alphaMap:q,alphaTest:re,alphaHash:_e,combine:S.combine,mapUv:Ie&&M(S.map.channel),aoMapUv:Ze&&M(S.aoMap.channel),lightMapUv:ze&&M(S.lightMap.channel),bumpMapUv:Ge&&M(S.bumpMap.channel),normalMapUv:ge&&M(S.normalMap.channel),displacementMapUv:Je&&M(S.displacementMap.channel),emissiveMapUv:Te&&M(S.emissiveMap.channel),metalnessMapUv:we&&M(S.metalnessMap.channel),roughnessMapUv:T&&M(S.roughnessMap.channel),anisotropyMapUv:ne&&M(S.anisotropyMap.channel),clearcoatMapUv:ce&&M(S.clearcoatMap.channel),clearcoatNormalMapUv:be&&M(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ee&&M(S.clearcoatRoughnessMap.channel),iridescenceMapUv:he&&M(S.iridescenceMap.channel),iridescenceThicknessMapUv:Ne&&M(S.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&M(S.sheenColorMap.channel),sheenRoughnessMapUv:le&&M(S.sheenRoughnessMap.channel),specularMapUv:ye&&M(S.specularMap.channel),specularColorMapUv:Ue&&M(S.specularColorMap.channel),specularIntensityMapUv:je&&M(S.specularIntensityMap.channel),transmissionMapUv:C&&M(S.transmissionMap.channel),thicknessMapUv:te&&M(S.thicknessMap.channel),alphaMapUv:q&&M(S.alphaMap.channel),vertexTangents:!!Y.attributes.tangent&&(ge||g),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!Y.attributes.uv&&(Ie||q),fog:!!X,useFog:S.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:S.flatShading===!0,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:z.isSkinnedMesh===!0,morphTargets:Y.morphAttributes.position!==void 0,morphNormals:Y.morphAttributes.normal!==void 0,morphColors:Y.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:De,numDirLights:v.directional.length,numPointLights:v.point.length,numSpotLights:v.spot.length,numSpotLightMaps:v.spotLightMap.length,numRectAreaLights:v.rectArea.length,numHemiLights:v.hemi.length,numDirLightShadows:v.directionalShadowMap.length,numPointLightShadows:v.pointShadowMap.length,numSpotLightShadows:v.spotShadowMap.length,numSpotLightShadowsWithMaps:v.numSpotLightShadowsWithMaps,numLightProbes:v.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:i.shadowMap.enabled&&P.length>0,shadowMapType:i.shadowMap.type,toneMapping:$e,decodeVideoTexture:Ie&&S.map.isVideoTexture===!0&&Ve.getTransfer(S.map.colorSpace)===Xe,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Xt,flipSided:S.side===mt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:We&&S.extensions.clipCullDistance===!0&&r.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(We&&S.extensions.multiDraw===!0||Le)&&r.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:r.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return lt.vertexUv1s=c.has(1),lt.vertexUv2s=c.has(2),lt.vertexUv3s=c.has(3),c.clear(),lt}function h(S){const v=[];if(S.shaderID?v.push(S.shaderID):(v.push(S.customVertexShaderID),v.push(S.customFragmentShaderID)),S.defines!==void 0)for(const P in S.defines)v.push(P),v.push(S.defines[P]);return S.isRawShaderMaterial===!1&&(b(v,S),E(v,S),v.push(i.outputColorSpace)),v.push(S.customProgramCacheKey),v.join()}function b(S,v){S.push(v.precision),S.push(v.outputColorSpace),S.push(v.envMapMode),S.push(v.envMapCubeUVHeight),S.push(v.mapUv),S.push(v.alphaMapUv),S.push(v.lightMapUv),S.push(v.aoMapUv),S.push(v.bumpMapUv),S.push(v.normalMapUv),S.push(v.displacementMapUv),S.push(v.emissiveMapUv),S.push(v.metalnessMapUv),S.push(v.roughnessMapUv),S.push(v.anisotropyMapUv),S.push(v.clearcoatMapUv),S.push(v.clearcoatNormalMapUv),S.push(v.clearcoatRoughnessMapUv),S.push(v.iridescenceMapUv),S.push(v.iridescenceThicknessMapUv),S.push(v.sheenColorMapUv),S.push(v.sheenRoughnessMapUv),S.push(v.specularMapUv),S.push(v.specularColorMapUv),S.push(v.specularIntensityMapUv),S.push(v.transmissionMapUv),S.push(v.thicknessMapUv),S.push(v.combine),S.push(v.fogExp2),S.push(v.sizeAttenuation),S.push(v.morphTargetsCount),S.push(v.morphAttributeCount),S.push(v.numDirLights),S.push(v.numPointLights),S.push(v.numSpotLights),S.push(v.numSpotLightMaps),S.push(v.numHemiLights),S.push(v.numRectAreaLights),S.push(v.numDirLightShadows),S.push(v.numPointLightShadows),S.push(v.numSpotLightShadows),S.push(v.numSpotLightShadowsWithMaps),S.push(v.numLightProbes),S.push(v.shadowMapType),S.push(v.toneMapping),S.push(v.numClippingPlanes),S.push(v.numClipIntersection),S.push(v.depthPacking)}function E(S,v){s.disableAll(),v.supportsVertexTextures&&s.enable(0),v.instancing&&s.enable(1),v.instancingColor&&s.enable(2),v.instancingMorph&&s.enable(3),v.matcap&&s.enable(4),v.envMap&&s.enable(5),v.normalMapObjectSpace&&s.enable(6),v.normalMapTangentSpace&&s.enable(7),v.clearcoat&&s.enable(8),v.iridescence&&s.enable(9),v.alphaTest&&s.enable(10),v.vertexColors&&s.enable(11),v.vertexAlphas&&s.enable(12),v.vertexUv1s&&s.enable(13),v.vertexUv2s&&s.enable(14),v.vertexUv3s&&s.enable(15),v.vertexTangents&&s.enable(16),v.anisotropy&&s.enable(17),v.alphaHash&&s.enable(18),v.batching&&s.enable(19),v.dispersion&&s.enable(20),v.batchingColor&&s.enable(21),S.push(s.mask),s.disableAll(),v.fog&&s.enable(0),v.useFog&&s.enable(1),v.flatShading&&s.enable(2),v.logarithmicDepthBuffer&&s.enable(3),v.skinning&&s.enable(4),v.morphTargets&&s.enable(5),v.morphNormals&&s.enable(6),v.morphColors&&s.enable(7),v.premultipliedAlpha&&s.enable(8),v.shadowMapEnabled&&s.enable(9),v.doubleSided&&s.enable(10),v.flipSided&&s.enable(11),v.useDepthPacking&&s.enable(12),v.dithering&&s.enable(13),v.transmission&&s.enable(14),v.sheen&&s.enable(15),v.opaque&&s.enable(16),v.pointsUvs&&s.enable(17),v.decodeVideoTexture&&s.enable(18),v.alphaToCoverage&&s.enable(19),S.push(s.mask)}function y(S){const v=x[S.type];let P;if(v){const H=It[v];P=Fl.clone(H.uniforms)}else P=S.uniforms;return P}function B(S,v){let P;for(let H=0,z=u.length;H<z;H++){const X=u[H];if(X.cacheKey===v){P=X,++P.usedTimes;break}}return P===void 0&&(P=new Zd(i,v,S,n),u.push(P)),P}function R(S){if(--S.usedTimes===0){const v=u.indexOf(S);u[v]=u[u.length-1],u.pop(),S.destroy()}}function w(S){l.remove(S)}function F(){l.dispose()}return{getParameters:d,getProgramCacheKey:h,getUniforms:y,acquireProgram:B,releaseProgram:R,releaseShaderCache:w,programs:u,dispose:F}}function tp(){let i=new WeakMap;function e(n){let o=i.get(n);return o===void 0&&(o={},i.set(n,o)),o}function t(n){i.delete(n)}function r(n,o,s){i.get(n)[o]=s}function a(){i=new WeakMap}return{get:e,remove:t,update:r,dispose:a}}function rp(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Cs(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Ps(){const i=[];let e=0;const t=[],r=[],a=[];function n(){e=0,t.length=0,r.length=0,a.length=0}function o(f,p,m,x,M,d){let h=i[e];return h===void 0?(h={id:f.id,object:f,geometry:p,material:m,groupOrder:x,renderOrder:f.renderOrder,z:M,group:d},i[e]=h):(h.id=f.id,h.object=f,h.geometry=p,h.material=m,h.groupOrder=x,h.renderOrder=f.renderOrder,h.z=M,h.group=d),e++,h}function s(f,p,m,x,M,d){const h=o(f,p,m,x,M,d);m.transmission>0?r.push(h):m.transparent===!0?a.push(h):t.push(h)}function l(f,p,m,x,M,d){const h=o(f,p,m,x,M,d);m.transmission>0?r.unshift(h):m.transparent===!0?a.unshift(h):t.unshift(h)}function c(f,p){t.length>1&&t.sort(f||rp),r.length>1&&r.sort(p||Cs),a.length>1&&a.sort(p||Cs)}function u(){for(let f=e,p=i.length;f<p;f++){const m=i[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:t,transmissive:r,transparent:a,init:n,push:s,unshift:l,finish:u,sort:c}}function ip(){let i=new WeakMap;function e(r,a){const n=i.get(r);let o;return n===void 0?(o=new Ps,i.set(r,[o])):a>=n.length?(o=new Ps,n.push(o)):o=n[a],o}function t(){i=new WeakMap}return{get:e,dispose:t}}function ap(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new O,color:new Oe};break;case"SpotLight":t={position:new O,direction:new O,color:new Oe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new O,color:new Oe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new O,skyColor:new Oe,groundColor:new Oe};break;case"RectAreaLight":t={color:new Oe,position:new O,halfWidth:new O,halfHeight:new O};break}return i[e.id]=t,t}}}function np(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Be,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let sp=0;function op(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function lp(i){const e=new ap,t=np(),r={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)r.probe.push(new O);const a=new O,n=new it,o=new it;function s(c){let u=0,f=0,p=0;for(let S=0;S<9;S++)r.probe[S].set(0,0,0);let m=0,x=0,M=0,d=0,h=0,b=0,E=0,y=0,B=0,R=0,w=0;c.sort(op);for(let S=0,v=c.length;S<v;S++){const P=c[S],H=P.color,z=P.intensity,X=P.distance,Y=P.shadow&&P.shadow.map?P.shadow.map.texture:null;if(P.isAmbientLight)u+=H.r*z,f+=H.g*z,p+=H.b*z;else if(P.isLightProbe){for(let k=0;k<9;k++)r.probe[k].addScaledVector(P.sh.coefficients[k],z);w++}else if(P.isDirectionalLight){const k=e.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const Z=P.shadow,V=t.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,r.directionalShadow[m]=V,r.directionalShadowMap[m]=Y,r.directionalShadowMatrix[m]=P.shadow.matrix,b++}r.directional[m]=k,m++}else if(P.isSpotLight){const k=e.get(P);k.position.setFromMatrixPosition(P.matrixWorld),k.color.copy(H).multiplyScalar(z),k.distance=X,k.coneCos=Math.cos(P.angle),k.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),k.decay=P.decay,r.spot[M]=k;const Z=P.shadow;if(P.map&&(r.spotLightMap[B]=P.map,B++,Z.updateMatrices(P),P.castShadow&&R++),r.spotLightMatrix[M]=Z.matrix,P.castShadow){const V=t.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,r.spotShadow[M]=V,r.spotShadowMap[M]=Y,y++}M++}else if(P.isRectAreaLight){const k=e.get(P);k.color.copy(H).multiplyScalar(z),k.halfWidth.set(P.width*.5,0,0),k.halfHeight.set(0,P.height*.5,0),r.rectArea[d]=k,d++}else if(P.isPointLight){const k=e.get(P);if(k.color.copy(P.color).multiplyScalar(P.intensity),k.distance=P.distance,k.decay=P.decay,P.castShadow){const Z=P.shadow,V=t.get(P);V.shadowIntensity=Z.intensity,V.shadowBias=Z.bias,V.shadowNormalBias=Z.normalBias,V.shadowRadius=Z.radius,V.shadowMapSize=Z.mapSize,V.shadowCameraNear=Z.camera.near,V.shadowCameraFar=Z.camera.far,r.pointShadow[x]=V,r.pointShadowMap[x]=Y,r.pointShadowMatrix[x]=P.shadow.matrix,E++}r.point[x]=k,x++}else if(P.isHemisphereLight){const k=e.get(P);k.skyColor.copy(P.color).multiplyScalar(z),k.groundColor.copy(P.groundColor).multiplyScalar(z),r.hemi[h]=k,h++}}d>0&&(i.has("OES_texture_float_linear")===!0?(r.rectAreaLTC1=ie.LTC_FLOAT_1,r.rectAreaLTC2=ie.LTC_FLOAT_2):(r.rectAreaLTC1=ie.LTC_HALF_1,r.rectAreaLTC2=ie.LTC_HALF_2)),r.ambient[0]=u,r.ambient[1]=f,r.ambient[2]=p;const F=r.hash;(F.directionalLength!==m||F.pointLength!==x||F.spotLength!==M||F.rectAreaLength!==d||F.hemiLength!==h||F.numDirectionalShadows!==b||F.numPointShadows!==E||F.numSpotShadows!==y||F.numSpotMaps!==B||F.numLightProbes!==w)&&(r.directional.length=m,r.spot.length=M,r.rectArea.length=d,r.point.length=x,r.hemi.length=h,r.directionalShadow.length=b,r.directionalShadowMap.length=b,r.pointShadow.length=E,r.pointShadowMap.length=E,r.spotShadow.length=y,r.spotShadowMap.length=y,r.directionalShadowMatrix.length=b,r.pointShadowMatrix.length=E,r.spotLightMatrix.length=y+B-R,r.spotLightMap.length=B,r.numSpotLightShadowsWithMaps=R,r.numLightProbes=w,F.directionalLength=m,F.pointLength=x,F.spotLength=M,F.rectAreaLength=d,F.hemiLength=h,F.numDirectionalShadows=b,F.numPointShadows=E,F.numSpotShadows=y,F.numSpotMaps=B,F.numLightProbes=w,r.version=sp++)}function l(c,u){let f=0,p=0,m=0,x=0,M=0;const d=u.matrixWorldInverse;for(let h=0,b=c.length;h<b;h++){const E=c[h];if(E.isDirectionalLight){const y=r.directional[f];y.direction.setFromMatrixPosition(E.matrixWorld),a.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(d),f++}else if(E.isSpotLight){const y=r.spot[m];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(d),y.direction.setFromMatrixPosition(E.matrixWorld),a.setFromMatrixPosition(E.target.matrixWorld),y.direction.sub(a),y.direction.transformDirection(d),m++}else if(E.isRectAreaLight){const y=r.rectArea[x];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(d),o.identity(),n.copy(E.matrixWorld),n.premultiply(d),o.extractRotation(n),y.halfWidth.set(E.width*.5,0,0),y.halfHeight.set(0,E.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),x++}else if(E.isPointLight){const y=r.point[p];y.position.setFromMatrixPosition(E.matrixWorld),y.position.applyMatrix4(d),p++}else if(E.isHemisphereLight){const y=r.hemi[M];y.direction.setFromMatrixPosition(E.matrixWorld),y.direction.transformDirection(d),M++}}}return{setup:s,setupView:l,state:r}}function Ls(i){const e=new lp(i),t=[],r=[];function a(u){c.camera=u,t.length=0,r.length=0}function n(u){t.push(u)}function o(u){r.push(u)}function s(){e.setup(t)}function l(u){e.setupView(t,u)}const c={lightsArray:t,shadowsArray:r,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:s,setupLightsView:l,pushLight:n,pushShadow:o}}function cp(i){let e=new WeakMap;function t(a,n=0){const o=e.get(a);let s;return o===void 0?(s=new Ls(i),e.set(a,[s])):n>=o.length?(s=new Ls(i),o.push(s)):s=o[n],s}function r(){e=new WeakMap}return{get:t,dispose:r}}class hp extends ta{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=nl,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class up extends ta{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const dp=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pp=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function fp(i,e,t){let r=new lo;const a=new Be,n=new Be,o=new ot,s=new hp({depthPacking:sl}),l=new up,c={},u=t.maxTextureSize,f={[sr]:mt,[mt]:sr,[Xt]:Xt},p=new Kt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Be},radius:{value:4}},vertexShader:dp,fragmentShader:pp}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const x=new Ar;x.setAttribute("position",new Ot(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const M=new Nt(x,p),d=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Os;let h=this.type;this.render=function(R,w,F){if(d.enabled===!1||d.autoUpdate===!1&&d.needsUpdate===!1||R.length===0)return;const S=i.getRenderTarget(),v=i.getActiveCubeFace(),P=i.getActiveMipmapLevel(),H=i.state;H.setBlending(ar),H.buffers.color.setClear(1,1,1,1),H.buffers.depth.setTest(!0),H.setScissorTest(!1);const z=h!==Wt&&this.type===Wt,X=h===Wt&&this.type!==Wt;for(let Y=0,k=R.length;Y<k;Y++){const Z=R[Y],V=Z.shadow;if(V===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(V.autoUpdate===!1&&V.needsUpdate===!1)continue;a.copy(V.mapSize);const ae=V.getFrameExtents();if(a.multiply(ae),n.copy(V.mapSize),(a.x>u||a.y>u)&&(a.x>u&&(n.x=Math.floor(u/ae.x),a.x=n.x*ae.x,V.mapSize.x=n.x),a.y>u&&(n.y=Math.floor(u/ae.y),a.y=n.y*ae.y,V.mapSize.y=n.y)),V.map===null||z===!0||X===!0){const Me=this.type!==Wt?{minFilter:yt,magFilter:yt}:{};V.map!==null&&V.map.dispose(),V.map=new yr(a.x,a.y,Me),V.map.texture.name=Z.name+".shadowMap",V.camera.updateProjectionMatrix()}i.setRenderTarget(V.map),i.clear();const me=V.getViewportCount();for(let Me=0;Me<me;Me++){const De=V.getViewport(Me);o.set(n.x*De.x,n.y*De.y,n.x*De.z,n.y*De.w),H.viewport(o),V.updateMatrices(Z,Me),r=V.getFrustum(),y(w,F,V.camera,Z,this.type)}V.isPointLightShadow!==!0&&this.type===Wt&&b(V,F),V.needsUpdate=!1}h=this.type,d.needsUpdate=!1,i.setRenderTarget(S,v,P)};function b(R,w){const F=e.update(M);p.defines.VSM_SAMPLES!==R.blurSamples&&(p.defines.VSM_SAMPLES=R.blurSamples,m.defines.VSM_SAMPLES=R.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),R.mapPass===null&&(R.mapPass=new yr(a.x,a.y)),p.uniforms.shadow_pass.value=R.map.texture,p.uniforms.resolution.value=R.mapSize,p.uniforms.radius.value=R.radius,i.setRenderTarget(R.mapPass),i.clear(),i.renderBufferDirect(w,null,F,p,M,null),m.uniforms.shadow_pass.value=R.mapPass.texture,m.uniforms.resolution.value=R.mapSize,m.uniforms.radius.value=R.radius,i.setRenderTarget(R.map),i.clear(),i.renderBufferDirect(w,null,F,m,M,null)}function E(R,w,F,S){let v=null;const P=F.isPointLight===!0?R.customDistanceMaterial:R.customDepthMaterial;if(P!==void 0)v=P;else if(v=F.isPointLight===!0?l:s,i.localClippingEnabled&&w.clipShadows===!0&&Array.isArray(w.clippingPlanes)&&w.clippingPlanes.length!==0||w.displacementMap&&w.displacementScale!==0||w.alphaMap&&w.alphaTest>0||w.map&&w.alphaTest>0){const H=v.uuid,z=w.uuid;let X=c[H];X===void 0&&(X={},c[H]=X);let Y=X[z];Y===void 0&&(Y=v.clone(),X[z]=Y,w.addEventListener("dispose",B)),v=Y}if(v.visible=w.visible,v.wireframe=w.wireframe,S===Wt?v.side=w.shadowSide!==null?w.shadowSide:w.side:v.side=w.shadowSide!==null?w.shadowSide:f[w.side],v.alphaMap=w.alphaMap,v.alphaTest=w.alphaTest,v.map=w.map,v.clipShadows=w.clipShadows,v.clippingPlanes=w.clippingPlanes,v.clipIntersection=w.clipIntersection,v.displacementMap=w.displacementMap,v.displacementScale=w.displacementScale,v.displacementBias=w.displacementBias,v.wireframeLinewidth=w.wireframeLinewidth,v.linewidth=w.linewidth,F.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const H=i.properties.get(v);H.light=F}return v}function y(R,w,F,S,v){if(R.visible===!1)return;if(R.layers.test(w.layers)&&(R.isMesh||R.isLine||R.isPoints)&&(R.castShadow||R.receiveShadow&&v===Wt)&&(!R.frustumCulled||r.intersectsObject(R))){R.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,R.matrixWorld);const H=e.update(R),z=R.material;if(Array.isArray(z)){const X=H.groups;for(let Y=0,k=X.length;Y<k;Y++){const Z=X[Y],V=z[Z.materialIndex];if(V&&V.visible){const ae=E(R,V,S,v);R.onBeforeShadow(i,R,w,F,H,ae,Z),i.renderBufferDirect(F,null,H,ae,R,Z),R.onAfterShadow(i,R,w,F,H,ae,Z)}}}else if(z.visible){const X=E(R,z,S,v);R.onBeforeShadow(i,R,w,F,H,X,null),i.renderBufferDirect(F,null,H,X,R,null),R.onAfterShadow(i,R,w,F,H,X,null)}}const P=R.children;for(let H=0,z=P.length;H<z;H++)y(P[H],w,F,S,v)}function B(R){R.target.removeEventListener("dispose",B);for(const w in c){const F=c[w],S=R.target.uuid;S in F&&(F[S].dispose(),delete F[S])}}}function mp(i){function e(){let C=!1;const te=new ot;let W=null;const q=new ot(0,0,0,0);return{setMask:function(re){W!==re&&!C&&(i.colorMask(re,re,re,re),W=re)},setLocked:function(re){C=re},setClear:function(re,_e,We,$e,lt){lt===!0&&(re*=$e,_e*=$e,We*=$e),te.set(re,_e,We,$e),q.equals(te)===!1&&(i.clearColor(re,_e,We,$e),q.copy(te))},reset:function(){C=!1,W=null,q.set(-1,0,0,0)}}}function t(){let C=!1,te=null,W=null,q=null;return{setTest:function(re){re?ue(i.DEPTH_TEST):oe(i.DEPTH_TEST)},setMask:function(re){te!==re&&!C&&(i.depthMask(re),te=re)},setFunc:function(re){if(W!==re){switch(re){case ko:i.depthFunc(i.NEVER);break;case Go:i.depthFunc(i.ALWAYS);break;case Wo:i.depthFunc(i.LESS);break;case ji:i.depthFunc(i.LEQUAL);break;case Xo:i.depthFunc(i.EQUAL);break;case qo:i.depthFunc(i.GEQUAL);break;case jo:i.depthFunc(i.GREATER);break;case Yo:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}W=re}},setLocked:function(re){C=re},setClear:function(re){q!==re&&(i.clearDepth(re),q=re)},reset:function(){C=!1,te=null,W=null,q=null}}}function r(){let C=!1,te=null,W=null,q=null,re=null,_e=null,We=null,$e=null,lt=null;return{setTest:function(Fe){C||(Fe?ue(i.STENCIL_TEST):oe(i.STENCIL_TEST))},setMask:function(Fe){te!==Fe&&!C&&(i.stencilMask(Fe),te=Fe)},setFunc:function(Fe,Bt,Lt){(W!==Fe||q!==Bt||re!==Lt)&&(i.stencilFunc(Fe,Bt,Lt),W=Fe,q=Bt,re=Lt)},setOp:function(Fe,Bt,Lt){(_e!==Fe||We!==Bt||$e!==Lt)&&(i.stencilOp(Fe,Bt,Lt),_e=Fe,We=Bt,$e=Lt)},setLocked:function(Fe){C=Fe},setClear:function(Fe){lt!==Fe&&(i.clearStencil(Fe),lt=Fe)},reset:function(){C=!1,te=null,W=null,q=null,re=null,_e=null,We=null,$e=null,lt=null}}}const a=new e,n=new t,o=new r,s=new WeakMap,l=new WeakMap;let c={},u={},f=new WeakMap,p=[],m=null,x=!1,M=null,d=null,h=null,b=null,E=null,y=null,B=null,R=new Oe(0,0,0),w=0,F=!1,S=null,v=null,P=null,H=null,z=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,k=0;const Z=i.getParameter(i.VERSION);Z.indexOf("WebGL")!==-1?(k=parseFloat(/^WebGL (\d)/.exec(Z)[1]),Y=k>=1):Z.indexOf("OpenGL ES")!==-1&&(k=parseFloat(/^OpenGL ES (\d)/.exec(Z)[1]),Y=k>=2);let V=null,ae={};const me=i.getParameter(i.SCISSOR_BOX),Me=i.getParameter(i.VIEWPORT),De=new ot().fromArray(me),ke=new ot().fromArray(Me);function G(C,te,W,q){const re=new Uint8Array(4),_e=i.createTexture();i.bindTexture(C,_e),i.texParameteri(C,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(C,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let We=0;We<W;We++)C===i.TEXTURE_3D||C===i.TEXTURE_2D_ARRAY?i.texImage3D(te,0,i.RGBA,1,1,q,0,i.RGBA,i.UNSIGNED_BYTE,re):i.texImage2D(te+We,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,re);return _e}const Q={};Q[i.TEXTURE_2D]=G(i.TEXTURE_2D,i.TEXTURE_2D,1),Q[i.TEXTURE_CUBE_MAP]=G(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),Q[i.TEXTURE_2D_ARRAY]=G(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Q[i.TEXTURE_3D]=G(i.TEXTURE_3D,i.TEXTURE_3D,1,1),a.setClear(0,0,0,1),n.setClear(1),o.setClear(0),ue(i.DEPTH_TEST),n.setFunc(ji),Ge(!1),ge(Fn),ue(i.CULL_FACE),Ze(ar);function ue(C){c[C]!==!0&&(i.enable(C),c[C]=!0)}function oe(C){c[C]!==!1&&(i.disable(C),c[C]=!1)}function Ae(C,te){return u[C]!==te?(i.bindFramebuffer(C,te),u[C]=te,C===i.DRAW_FRAMEBUFFER&&(u[i.FRAMEBUFFER]=te),C===i.FRAMEBUFFER&&(u[i.DRAW_FRAMEBUFFER]=te),!0):!1}function Le(C,te){let W=p,q=!1;if(C){W=f.get(te),W===void 0&&(W=[],f.set(te,W));const re=C.textures;if(W.length!==re.length||W[0]!==i.COLOR_ATTACHMENT0){for(let _e=0,We=re.length;_e<We;_e++)W[_e]=i.COLOR_ATTACHMENT0+_e;W.length=re.length,q=!0}}else W[0]!==i.BACK&&(W[0]=i.BACK,q=!0);q&&i.drawBuffers(W)}function Ie(C){return m!==C?(i.useProgram(C),m=C,!0):!1}const Ye={[vr]:i.FUNC_ADD,[bo]:i.FUNC_SUBTRACT,[Ao]:i.FUNC_REVERSE_SUBTRACT};Ye[wo]=i.MIN,Ye[Ro]=i.MAX;const A={[Co]:i.ZERO,[Po]:i.ONE,[Lo]:i.SRC_COLOR,[Oa]:i.SRC_ALPHA,[Fo]:i.SRC_ALPHA_SATURATE,[No]:i.DST_COLOR,[Io]:i.DST_ALPHA,[Uo]:i.ONE_MINUS_SRC_COLOR,[Fa]:i.ONE_MINUS_SRC_ALPHA,[Oo]:i.ONE_MINUS_DST_COLOR,[Do]:i.ONE_MINUS_DST_ALPHA,[Bo]:i.CONSTANT_COLOR,[zo]:i.ONE_MINUS_CONSTANT_COLOR,[Ho]:i.CONSTANT_ALPHA,[Vo]:i.ONE_MINUS_CONSTANT_ALPHA};function Ze(C,te,W,q,re,_e,We,$e,lt,Fe){if(C===ar){x===!0&&(oe(i.BLEND),x=!1);return}if(x===!1&&(ue(i.BLEND),x=!0),C!==yo){if(C!==M||Fe!==F){if((d!==vr||E!==vr)&&(i.blendEquation(i.FUNC_ADD),d=vr,E=vr),Fe)switch(C){case Yr:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bn:i.blendFunc(i.ONE,i.ONE);break;case zn:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Hn:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}else switch(C){case Yr:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Bn:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case zn:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Hn:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",C);break}h=null,b=null,y=null,B=null,R.set(0,0,0),w=0,M=C,F=Fe}return}re=re||te,_e=_e||W,We=We||q,(te!==d||re!==E)&&(i.blendEquationSeparate(Ye[te],Ye[re]),d=te,E=re),(W!==h||q!==b||_e!==y||We!==B)&&(i.blendFuncSeparate(A[W],A[q],A[_e],A[We]),h=W,b=q,y=_e,B=We),($e.equals(R)===!1||lt!==w)&&(i.blendColor($e.r,$e.g,$e.b,lt),R.copy($e),w=lt),M=C,F=!1}function ze(C,te){C.side===Xt?oe(i.CULL_FACE):ue(i.CULL_FACE);let W=C.side===mt;te&&(W=!W),Ge(W),C.blending===Yr&&C.transparent===!1?Ze(ar):Ze(C.blending,C.blendEquation,C.blendSrc,C.blendDst,C.blendEquationAlpha,C.blendSrcAlpha,C.blendDstAlpha,C.blendColor,C.blendAlpha,C.premultipliedAlpha),n.setFunc(C.depthFunc),n.setTest(C.depthTest),n.setMask(C.depthWrite),a.setMask(C.colorWrite);const q=C.stencilWrite;o.setTest(q),q&&(o.setMask(C.stencilWriteMask),o.setFunc(C.stencilFunc,C.stencilRef,C.stencilFuncMask),o.setOp(C.stencilFail,C.stencilZFail,C.stencilZPass)),Te(C.polygonOffset,C.polygonOffsetFactor,C.polygonOffsetUnits),C.alphaToCoverage===!0?ue(i.SAMPLE_ALPHA_TO_COVERAGE):oe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(C){S!==C&&(C?i.frontFace(i.CW):i.frontFace(i.CCW),S=C)}function ge(C){C!==So?(ue(i.CULL_FACE),C!==v&&(C===Fn?i.cullFace(i.BACK):C===Eo?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):oe(i.CULL_FACE),v=C}function Je(C){C!==P&&(Y&&i.lineWidth(C),P=C)}function Te(C,te,W){C?(ue(i.POLYGON_OFFSET_FILL),(H!==te||z!==W)&&(i.polygonOffset(te,W),H=te,z=W)):oe(i.POLYGON_OFFSET_FILL)}function we(C){C?ue(i.SCISSOR_TEST):oe(i.SCISSOR_TEST)}function T(C){C===void 0&&(C=i.TEXTURE0+X-1),V!==C&&(i.activeTexture(C),V=C)}function g(C,te,W){W===void 0&&(V===null?W=i.TEXTURE0+X-1:W=V);let q=ae[W];q===void 0&&(q={type:void 0,texture:void 0},ae[W]=q),(q.type!==C||q.texture!==te)&&(V!==W&&(i.activeTexture(W),V=W),i.bindTexture(C,te||Q[C]),q.type=C,q.texture=te)}function D(){const C=ae[V];C!==void 0&&C.type!==void 0&&(i.bindTexture(C.type,null),C.type=void 0,C.texture=void 0)}function K(){try{i.compressedTexImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function $(){try{i.compressedTexImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function j(){try{i.texSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ve(){try{i.texSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ne(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ce(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function be(){try{i.texStorage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function ee(){try{i.texStorage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function he(){try{i.texImage2D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ne(){try{i.texImage3D.apply(i,arguments)}catch(C){console.error("THREE.WebGLState:",C)}}function Ee(C){De.equals(C)===!1&&(i.scissor(C.x,C.y,C.z,C.w),De.copy(C))}function le(C){ke.equals(C)===!1&&(i.viewport(C.x,C.y,C.z,C.w),ke.copy(C))}function ye(C,te){let W=l.get(te);W===void 0&&(W=new WeakMap,l.set(te,W));let q=W.get(C);q===void 0&&(q=i.getUniformBlockIndex(te,C.name),W.set(C,q))}function Ue(C,te){const W=l.get(te).get(C);s.get(te)!==W&&(i.uniformBlockBinding(te,W,C.__bindingPointIndex),s.set(te,W))}function je(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),c={},V=null,ae={},u={},f=new WeakMap,p=[],m=null,x=!1,M=null,d=null,h=null,b=null,E=null,y=null,B=null,R=new Oe(0,0,0),w=0,F=!1,S=null,v=null,P=null,H=null,z=null,De.set(0,0,i.canvas.width,i.canvas.height),ke.set(0,0,i.canvas.width,i.canvas.height),a.reset(),n.reset(),o.reset()}return{buffers:{color:a,depth:n,stencil:o},enable:ue,disable:oe,bindFramebuffer:Ae,drawBuffers:Le,useProgram:Ie,setBlending:Ze,setMaterial:ze,setFlipSided:Ge,setCullFace:ge,setLineWidth:Je,setPolygonOffset:Te,setScissorTest:we,activeTexture:T,bindTexture:g,unbindTexture:D,compressedTexImage2D:K,compressedTexImage3D:$,texImage2D:he,texImage3D:Ne,updateUBOMapping:ye,uniformBlockBinding:Ue,texStorage2D:be,texStorage3D:ee,texSubImage2D:j,texSubImage3D:ve,compressedTexSubImage2D:ne,compressedTexSubImage3D:ce,scissor:Ee,viewport:le,reset:je}}function Us(i,e,t,r){const a=gp(r);switch(t){case ks:return i*e;case Ws:return i*e;case Xs:return i*e*2;case qs:return i*e/a.components*a.byteLength;case Sn:return i*e/a.components*a.byteLength;case js:return i*e*2/a.components*a.byteLength;case En:return i*e*2/a.components*a.byteLength;case Gs:return i*e*3/a.components*a.byteLength;case Pt:return i*e*4/a.components*a.byteLength;case Tn:return i*e*4/a.components*a.byteLength;case Vi:case ki:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Gi:case Wi:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ga:case Xa:return Math.max(i,16)*Math.max(e,8)/4;case ka:case Wa:return Math.max(i,8)*Math.max(e,8)/2;case qa:case ja:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Ya:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ka:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Za:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ja:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case $a:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Qa:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case en:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case tn:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case rn:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case an:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case nn:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case sn:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case on:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case ln:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case cn:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Xi:case hn:case un:return Math.ceil(i/4)*Math.ceil(e/4)*16;case Ys:case dn:return Math.ceil(i/4)*Math.ceil(e/4)*8;case pn:case fn:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function gp(i){switch(i){case Yt:case zs:return{byteLength:1,components:1};case ci:case Hs:case hi:return{byteLength:2,components:1};case xn:case Mn:return{byteLength:2,components:4};case Tr:case vn:case qt:return{byteLength:4,components:1};case Vs:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}function _p(i,e,t,r,a,n,o){const s=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Be,u=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(T,g){return m?new OffscreenCanvas(T,g):$i("canvas")}function M(T,g,D){let K=1;const $=we(T);if(($.width>D||$.height>D)&&(K=D/Math.max($.width,$.height)),K<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const j=Math.floor(K*$.width),ve=Math.floor(K*$.height);f===void 0&&(f=x(j,ve));const ne=g?x(j,ve):f;return ne.width=j,ne.height=ve,ne.getContext("2d").drawImage(T,0,0,j,ve),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+j+"x"+ve+")."),ne}else return"data"in T&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),T;return T}function d(T){return T.generateMipmaps&&T.minFilter!==yt&&T.minFilter!==Ct}function h(T){i.generateMipmap(T)}function b(T,g,D,K,$=!1){if(T!==null){if(i[T]!==void 0)return i[T];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let j=g;if(g===i.RED&&(D===i.FLOAT&&(j=i.R32F),D===i.HALF_FLOAT&&(j=i.R16F),D===i.UNSIGNED_BYTE&&(j=i.R8)),g===i.RED_INTEGER&&(D===i.UNSIGNED_BYTE&&(j=i.R8UI),D===i.UNSIGNED_SHORT&&(j=i.R16UI),D===i.UNSIGNED_INT&&(j=i.R32UI),D===i.BYTE&&(j=i.R8I),D===i.SHORT&&(j=i.R16I),D===i.INT&&(j=i.R32I)),g===i.RG&&(D===i.FLOAT&&(j=i.RG32F),D===i.HALF_FLOAT&&(j=i.RG16F),D===i.UNSIGNED_BYTE&&(j=i.RG8)),g===i.RG_INTEGER&&(D===i.UNSIGNED_BYTE&&(j=i.RG8UI),D===i.UNSIGNED_SHORT&&(j=i.RG16UI),D===i.UNSIGNED_INT&&(j=i.RG32UI),D===i.BYTE&&(j=i.RG8I),D===i.SHORT&&(j=i.RG16I),D===i.INT&&(j=i.RG32I)),g===i.RGB&&D===i.UNSIGNED_INT_5_9_9_9_REV&&(j=i.RGB9_E5),g===i.RGBA){const ve=$?Yi:Ve.getTransfer(K);D===i.FLOAT&&(j=i.RGBA32F),D===i.HALF_FLOAT&&(j=i.RGBA16F),D===i.UNSIGNED_BYTE&&(j=ve===Xe?i.SRGB8_ALPHA8:i.RGBA8),D===i.UNSIGNED_SHORT_4_4_4_4&&(j=i.RGBA4),D===i.UNSIGNED_SHORT_5_5_5_1&&(j=i.RGB5_A1)}return(j===i.R16F||j===i.R32F||j===i.RG16F||j===i.RG32F||j===i.RGBA16F||j===i.RGBA32F)&&e.get("EXT_color_buffer_float"),j}function E(T,g){let D;return T?g===null||g===Tr||g===Qr?D=i.DEPTH24_STENCIL8:g===qt?D=i.DEPTH32F_STENCIL8:g===ci&&(D=i.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===Tr||g===Qr?D=i.DEPTH_COMPONENT24:g===qt?D=i.DEPTH_COMPONENT32F:g===ci&&(D=i.DEPTH_COMPONENT16),D}function y(T,g){return d(T)===!0||T.isFramebufferTexture&&T.minFilter!==yt&&T.minFilter!==Ct?Math.log2(Math.max(g.width,g.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?g.mipmaps.length:1}function B(T){const g=T.target;g.removeEventListener("dispose",B),w(g),g.isVideoTexture&&u.delete(g)}function R(T){const g=T.target;g.removeEventListener("dispose",R),S(g)}function w(T){const g=r.get(T);if(g.__webglInit===void 0)return;const D=T.source,K=p.get(D);if(K){const $=K[g.__cacheKey];$.usedTimes--,$.usedTimes===0&&F(T),Object.keys(K).length===0&&p.delete(D)}r.remove(T)}function F(T){const g=r.get(T);i.deleteTexture(g.__webglTexture);const D=T.source,K=p.get(D);delete K[g.__cacheKey],o.memory.textures--}function S(T){const g=r.get(T);if(T.depthTexture&&T.depthTexture.dispose(),T.isWebGLCubeRenderTarget)for(let K=0;K<6;K++){if(Array.isArray(g.__webglFramebuffer[K]))for(let $=0;$<g.__webglFramebuffer[K].length;$++)i.deleteFramebuffer(g.__webglFramebuffer[K][$]);else i.deleteFramebuffer(g.__webglFramebuffer[K]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[K])}else{if(Array.isArray(g.__webglFramebuffer))for(let K=0;K<g.__webglFramebuffer.length;K++)i.deleteFramebuffer(g.__webglFramebuffer[K]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let K=0;K<g.__webglColorRenderbuffer.length;K++)g.__webglColorRenderbuffer[K]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[K]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const D=T.textures;for(let K=0,$=D.length;K<$;K++){const j=r.get(D[K]);j.__webglTexture&&(i.deleteTexture(j.__webglTexture),o.memory.textures--),r.remove(D[K])}r.remove(T)}let v=0;function P(){v=0}function H(){const T=v;return T>=a.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+a.maxTextures),v+=1,T}function z(T){const g=[];return g.push(T.wrapS),g.push(T.wrapT),g.push(T.wrapR||0),g.push(T.magFilter),g.push(T.minFilter),g.push(T.anisotropy),g.push(T.internalFormat),g.push(T.format),g.push(T.type),g.push(T.generateMipmaps),g.push(T.premultiplyAlpha),g.push(T.flipY),g.push(T.unpackAlignment),g.push(T.colorSpace),g.join()}function X(T,g){const D=r.get(T);if(T.isVideoTexture&&Je(T),T.isRenderTargetTexture===!1&&T.version>0&&D.__version!==T.version){const K=T.image;if(K===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(K.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ke(D,T,g);return}}t.bindTexture(i.TEXTURE_2D,D.__webglTexture,i.TEXTURE0+g)}function Y(T,g){const D=r.get(T);if(T.version>0&&D.__version!==T.version){ke(D,T,g);return}t.bindTexture(i.TEXTURE_2D_ARRAY,D.__webglTexture,i.TEXTURE0+g)}function k(T,g){const D=r.get(T);if(T.version>0&&D.__version!==T.version){ke(D,T,g);return}t.bindTexture(i.TEXTURE_3D,D.__webglTexture,i.TEXTURE0+g)}function Z(T,g){const D=r.get(T);if(T.version>0&&D.__version!==T.version){G(D,T,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,D.__webglTexture,i.TEXTURE0+g)}const V={[Ha]:i.REPEAT,[Mr]:i.CLAMP_TO_EDGE,[Va]:i.MIRRORED_REPEAT},ae={[yt]:i.NEAREST,[al]:i.NEAREST_MIPMAP_NEAREST,[vi]:i.NEAREST_MIPMAP_LINEAR,[Ct]:i.LINEAR,[la]:i.LINEAR_MIPMAP_NEAREST,[Sr]:i.LINEAR_MIPMAP_LINEAR},me={[cl]:i.NEVER,[ml]:i.ALWAYS,[hl]:i.LESS,[Ks]:i.LEQUAL,[ul]:i.EQUAL,[fl]:i.GEQUAL,[dl]:i.GREATER,[pl]:i.NOTEQUAL};function Me(T,g){if(g.type===qt&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===Ct||g.magFilter===la||g.magFilter===vi||g.magFilter===Sr||g.minFilter===Ct||g.minFilter===la||g.minFilter===vi||g.minFilter===Sr)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(T,i.TEXTURE_WRAP_S,V[g.wrapS]),i.texParameteri(T,i.TEXTURE_WRAP_T,V[g.wrapT]),(T===i.TEXTURE_3D||T===i.TEXTURE_2D_ARRAY)&&i.texParameteri(T,i.TEXTURE_WRAP_R,V[g.wrapR]),i.texParameteri(T,i.TEXTURE_MAG_FILTER,ae[g.magFilter]),i.texParameteri(T,i.TEXTURE_MIN_FILTER,ae[g.minFilter]),g.compareFunction&&(i.texParameteri(T,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(T,i.TEXTURE_COMPARE_FUNC,me[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===yt||g.minFilter!==vi&&g.minFilter!==Sr||g.type===qt&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||r.get(g).__currentAnisotropy){const D=e.get("EXT_texture_filter_anisotropic");i.texParameterf(T,D.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,a.getMaxAnisotropy())),r.get(g).__currentAnisotropy=g.anisotropy}}}function De(T,g){let D=!1;T.__webglInit===void 0&&(T.__webglInit=!0,g.addEventListener("dispose",B));const K=g.source;let $=p.get(K);$===void 0&&($={},p.set(K,$));const j=z(g);if(j!==T.__cacheKey){$[j]===void 0&&($[j]={texture:i.createTexture(),usedTimes:0},o.memory.textures++,D=!0),$[j].usedTimes++;const ve=$[T.__cacheKey];ve!==void 0&&($[T.__cacheKey].usedTimes--,ve.usedTimes===0&&F(g)),T.__cacheKey=j,T.__webglTexture=$[j].texture}return D}function ke(T,g,D){let K=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(K=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(K=i.TEXTURE_3D);const $=De(T,g),j=g.source;t.bindTexture(K,T.__webglTexture,i.TEXTURE0+D);const ve=r.get(j);if(j.version!==ve.__version||$===!0){t.activeTexture(i.TEXTURE0+D);const ne=Ve.getPrimaries(Ve.workingColorSpace),ce=g.colorSpace===ir?null:Ve.getPrimaries(g.colorSpace),be=g.colorSpace===ir||ne===ce?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let ee=M(g.image,!1,a.maxTextureSize);ee=Te(g,ee);const he=n.convert(g.format,g.colorSpace),Ne=n.convert(g.type);let Ee=b(g.internalFormat,he,Ne,g.colorSpace,g.isVideoTexture);Me(K,g);let le;const ye=g.mipmaps,Ue=g.isVideoTexture!==!0,je=ve.__version===void 0||$===!0,C=j.dataReady,te=y(g,ee);if(g.isDepthTexture)Ee=E(g.format===ei,g.type),je&&(Ue?t.texStorage2D(i.TEXTURE_2D,1,Ee,ee.width,ee.height):t.texImage2D(i.TEXTURE_2D,0,Ee,ee.width,ee.height,0,he,Ne,null));else if(g.isDataTexture)if(ye.length>0){Ue&&je&&t.texStorage2D(i.TEXTURE_2D,te,Ee,ye[0].width,ye[0].height);for(let W=0,q=ye.length;W<q;W++)le=ye[W],Ue?C&&t.texSubImage2D(i.TEXTURE_2D,W,0,0,le.width,le.height,he,Ne,le.data):t.texImage2D(i.TEXTURE_2D,W,Ee,le.width,le.height,0,he,Ne,le.data);g.generateMipmaps=!1}else Ue?(je&&t.texStorage2D(i.TEXTURE_2D,te,Ee,ee.width,ee.height),C&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ee.width,ee.height,he,Ne,ee.data)):t.texImage2D(i.TEXTURE_2D,0,Ee,ee.width,ee.height,0,he,Ne,ee.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){Ue&&je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,te,Ee,ye[0].width,ye[0].height,ee.depth);for(let W=0,q=ye.length;W<q;W++)if(le=ye[W],g.format!==Pt)if(he!==null)if(Ue){if(C)if(g.layerUpdates.size>0){const re=Us(le.width,le.height,g.format,g.type);for(const _e of g.layerUpdates){const We=le.data.subarray(_e*re/le.data.BYTES_PER_ELEMENT,(_e+1)*re/le.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,W,0,0,_e,le.width,le.height,1,he,We,0,0)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,W,0,0,0,le.width,le.height,ee.depth,he,le.data,0,0)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,W,Ee,le.width,le.height,ee.depth,0,le.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Ue?C&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,W,0,0,0,le.width,le.height,ee.depth,he,Ne,le.data):t.texImage3D(i.TEXTURE_2D_ARRAY,W,Ee,le.width,le.height,ee.depth,0,he,Ne,le.data)}else{Ue&&je&&t.texStorage2D(i.TEXTURE_2D,te,Ee,ye[0].width,ye[0].height);for(let W=0,q=ye.length;W<q;W++)le=ye[W],g.format!==Pt?he!==null?Ue?C&&t.compressedTexSubImage2D(i.TEXTURE_2D,W,0,0,le.width,le.height,he,le.data):t.compressedTexImage2D(i.TEXTURE_2D,W,Ee,le.width,le.height,0,le.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Ue?C&&t.texSubImage2D(i.TEXTURE_2D,W,0,0,le.width,le.height,he,Ne,le.data):t.texImage2D(i.TEXTURE_2D,W,Ee,le.width,le.height,0,he,Ne,le.data)}else if(g.isDataArrayTexture)if(Ue){if(je&&t.texStorage3D(i.TEXTURE_2D_ARRAY,te,Ee,ee.width,ee.height,ee.depth),C)if(g.layerUpdates.size>0){const W=Us(ee.width,ee.height,g.format,g.type);for(const q of g.layerUpdates){const re=ee.data.subarray(q*W/ee.data.BYTES_PER_ELEMENT,(q+1)*W/ee.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,q,ee.width,ee.height,1,he,Ne,re)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,he,Ne,ee.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Ee,ee.width,ee.height,ee.depth,0,he,Ne,ee.data);else if(g.isData3DTexture)Ue?(je&&t.texStorage3D(i.TEXTURE_3D,te,Ee,ee.width,ee.height,ee.depth),C&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,he,Ne,ee.data)):t.texImage3D(i.TEXTURE_3D,0,Ee,ee.width,ee.height,ee.depth,0,he,Ne,ee.data);else if(g.isFramebufferTexture){if(je)if(Ue)t.texStorage2D(i.TEXTURE_2D,te,Ee,ee.width,ee.height);else{let W=ee.width,q=ee.height;for(let re=0;re<te;re++)t.texImage2D(i.TEXTURE_2D,re,Ee,W,q,0,he,Ne,null),W>>=1,q>>=1}}else if(ye.length>0){if(Ue&&je){const W=we(ye[0]);t.texStorage2D(i.TEXTURE_2D,te,Ee,W.width,W.height)}for(let W=0,q=ye.length;W<q;W++)le=ye[W],Ue?C&&t.texSubImage2D(i.TEXTURE_2D,W,0,0,he,Ne,le):t.texImage2D(i.TEXTURE_2D,W,Ee,he,Ne,le);g.generateMipmaps=!1}else if(Ue){if(je){const W=we(ee);t.texStorage2D(i.TEXTURE_2D,te,Ee,W.width,W.height)}C&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,he,Ne,ee)}else t.texImage2D(i.TEXTURE_2D,0,Ee,he,Ne,ee);d(g)&&h(K),ve.__version=j.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function G(T,g,D){if(g.image.length!==6)return;const K=De(T,g),$=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,T.__webglTexture,i.TEXTURE0+D);const j=r.get($);if($.version!==j.__version||K===!0){t.activeTexture(i.TEXTURE0+D);const ve=Ve.getPrimaries(Ve.workingColorSpace),ne=g.colorSpace===ir?null:Ve.getPrimaries(g.colorSpace),ce=g.colorSpace===ir||ve===ne?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ce);const be=g.isCompressedTexture||g.image[0].isCompressedTexture,ee=g.image[0]&&g.image[0].isDataTexture,he=[];for(let q=0;q<6;q++)!be&&!ee?he[q]=M(g.image[q],!0,a.maxCubemapSize):he[q]=ee?g.image[q].image:g.image[q],he[q]=Te(g,he[q]);const Ne=he[0],Ee=n.convert(g.format,g.colorSpace),le=n.convert(g.type),ye=b(g.internalFormat,Ee,le,g.colorSpace),Ue=g.isVideoTexture!==!0,je=j.__version===void 0||K===!0,C=$.dataReady;let te=y(g,Ne);Me(i.TEXTURE_CUBE_MAP,g);let W;if(be){Ue&&je&&t.texStorage2D(i.TEXTURE_CUBE_MAP,te,ye,Ne.width,Ne.height);for(let q=0;q<6;q++){W=he[q].mipmaps;for(let re=0;re<W.length;re++){const _e=W[re];g.format!==Pt?Ee!==null?Ue?C&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re,0,0,_e.width,_e.height,Ee,_e.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re,ye,_e.width,_e.height,0,_e.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re,0,0,_e.width,_e.height,Ee,le,_e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re,ye,_e.width,_e.height,0,Ee,le,_e.data)}}}else{if(W=g.mipmaps,Ue&&je){W.length>0&&te++;const q=we(he[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,te,ye,q.width,q.height)}for(let q=0;q<6;q++)if(ee){Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,he[q].width,he[q].height,Ee,le,he[q].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,ye,he[q].width,he[q].height,0,Ee,le,he[q].data);for(let re=0;re<W.length;re++){const _e=W[re].image[q].image;Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re+1,0,0,_e.width,_e.height,Ee,le,_e.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re+1,ye,_e.width,_e.height,0,Ee,le,_e.data)}}else{Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,Ee,le,he[q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,ye,Ee,le,he[q]);for(let re=0;re<W.length;re++){const _e=W[re];Ue?C&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re+1,0,0,Ee,le,_e.image[q]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+q,re+1,ye,Ee,le,_e.image[q])}}}d(g)&&h(i.TEXTURE_CUBE_MAP),j.__version=$.version,g.onUpdate&&g.onUpdate(g)}T.__version=g.version}function Q(T,g,D,K,$,j){const ve=n.convert(D.format,D.colorSpace),ne=n.convert(D.type),ce=b(D.internalFormat,ve,ne,D.colorSpace);if(!r.get(g).__hasExternalTextures){const be=Math.max(1,g.width>>j),ee=Math.max(1,g.height>>j);$===i.TEXTURE_3D||$===i.TEXTURE_2D_ARRAY?t.texImage3D($,j,ce,be,ee,g.depth,0,ve,ne,null):t.texImage2D($,j,ce,be,ee,0,ve,ne,null)}t.bindFramebuffer(i.FRAMEBUFFER,T),ge(g)?s.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,K,$,r.get(D).__webglTexture,0,Ge(g)):($===i.TEXTURE_2D||$>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,K,$,r.get(D).__webglTexture,j),t.bindFramebuffer(i.FRAMEBUFFER,null)}function ue(T,g,D){if(i.bindRenderbuffer(i.RENDERBUFFER,T),g.depthBuffer){const K=g.depthTexture,$=K&&K.isDepthTexture?K.type:null,j=E(g.stencilBuffer,$),ve=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ne=Ge(g);ge(g)?s.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ne,j,g.width,g.height):D?i.renderbufferStorageMultisample(i.RENDERBUFFER,ne,j,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,j,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ve,i.RENDERBUFFER,T)}else{const K=g.textures;for(let $=0;$<K.length;$++){const j=K[$],ve=n.convert(j.format,j.colorSpace),ne=n.convert(j.type),ce=b(j.internalFormat,ve,ne,j.colorSpace),be=Ge(g);D&&ge(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,be,ce,g.width,g.height):ge(g)?s.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,be,ce,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ce,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function oe(T,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,T),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!r.get(g.depthTexture).__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),X(g.depthTexture,0);const D=r.get(g.depthTexture).__webglTexture,K=Ge(g);if(g.depthTexture.format===Kr)ge(g)?s.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,D,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,D,0);else if(g.depthTexture.format===ei)ge(g)?s.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,D,0,K):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,D,0);else throw new Error("Unknown depthTexture format")}function Ae(T){const g=r.get(T),D=T.isWebGLCubeRenderTarget===!0;if(T.depthTexture&&!g.__autoAllocateDepthBuffer){if(D)throw new Error("target.depthTexture not supported in Cube render targets");oe(g.__webglFramebuffer,T)}else if(D){g.__webglDepthbuffer=[];for(let K=0;K<6;K++)t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[K]),g.__webglDepthbuffer[K]=i.createRenderbuffer(),ue(g.__webglDepthbuffer[K],T,!1)}else t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer=i.createRenderbuffer(),ue(g.__webglDepthbuffer,T,!1);t.bindFramebuffer(i.FRAMEBUFFER,null)}function Le(T,g,D){const K=r.get(T);g!==void 0&&Q(K.__webglFramebuffer,T,T.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),D!==void 0&&Ae(T)}function Ie(T){const g=T.texture,D=r.get(T),K=r.get(g);T.addEventListener("dispose",R);const $=T.textures,j=T.isWebGLCubeRenderTarget===!0,ve=$.length>1;if(ve||(K.__webglTexture===void 0&&(K.__webglTexture=i.createTexture()),K.__version=g.version,o.memory.textures++),j){D.__webglFramebuffer=[];for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0){D.__webglFramebuffer[ne]=[];for(let ce=0;ce<g.mipmaps.length;ce++)D.__webglFramebuffer[ne][ce]=i.createFramebuffer()}else D.__webglFramebuffer[ne]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){D.__webglFramebuffer=[];for(let ne=0;ne<g.mipmaps.length;ne++)D.__webglFramebuffer[ne]=i.createFramebuffer()}else D.__webglFramebuffer=i.createFramebuffer();if(ve)for(let ne=0,ce=$.length;ne<ce;ne++){const be=r.get($[ne]);be.__webglTexture===void 0&&(be.__webglTexture=i.createTexture(),o.memory.textures++)}if(T.samples>0&&ge(T)===!1){D.__webglMultisampledFramebuffer=i.createFramebuffer(),D.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,D.__webglMultisampledFramebuffer);for(let ne=0;ne<$.length;ne++){const ce=$[ne];D.__webglColorRenderbuffer[ne]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,D.__webglColorRenderbuffer[ne]);const be=n.convert(ce.format,ce.colorSpace),ee=n.convert(ce.type),he=b(ce.internalFormat,be,ee,ce.colorSpace,T.isXRRenderTarget===!0),Ne=Ge(T);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ne,he,T.width,T.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ne,i.RENDERBUFFER,D.__webglColorRenderbuffer[ne])}i.bindRenderbuffer(i.RENDERBUFFER,null),T.depthBuffer&&(D.__webglDepthRenderbuffer=i.createRenderbuffer(),ue(D.__webglDepthRenderbuffer,T,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(j){t.bindTexture(i.TEXTURE_CUBE_MAP,K.__webglTexture),Me(i.TEXTURE_CUBE_MAP,g);for(let ne=0;ne<6;ne++)if(g.mipmaps&&g.mipmaps.length>0)for(let ce=0;ce<g.mipmaps.length;ce++)Q(D.__webglFramebuffer[ne][ce],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,ce);else Q(D.__webglFramebuffer[ne],T,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+ne,0);d(g)&&h(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ve){for(let ne=0,ce=$.length;ne<ce;ne++){const be=$[ne],ee=r.get(be);t.bindTexture(i.TEXTURE_2D,ee.__webglTexture),Me(i.TEXTURE_2D,be),Q(D.__webglFramebuffer,T,be,i.COLOR_ATTACHMENT0+ne,i.TEXTURE_2D,0),d(be)&&h(i.TEXTURE_2D)}t.unbindTexture()}else{let ne=i.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(ne=T.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ne,K.__webglTexture),Me(ne,g),g.mipmaps&&g.mipmaps.length>0)for(let ce=0;ce<g.mipmaps.length;ce++)Q(D.__webglFramebuffer[ce],T,g,i.COLOR_ATTACHMENT0,ne,ce);else Q(D.__webglFramebuffer,T,g,i.COLOR_ATTACHMENT0,ne,0);d(g)&&h(ne),t.unbindTexture()}T.depthBuffer&&Ae(T)}function Ye(T){const g=T.textures;for(let D=0,K=g.length;D<K;D++){const $=g[D];if(d($)){const j=T.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,ve=r.get($).__webglTexture;t.bindTexture(j,ve),h(j),t.unbindTexture()}}}const A=[],Ze=[];function ze(T){if(T.samples>0){if(ge(T)===!1){const g=T.textures,D=T.width,K=T.height;let $=i.COLOR_BUFFER_BIT;const j=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ve=r.get(T),ne=g.length>1;if(ne)for(let ce=0;ce<g.length;ce++)t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ve.__webglMultisampledFramebuffer),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ve.__webglFramebuffer);for(let ce=0;ce<g.length;ce++){if(T.resolveDepthBuffer&&(T.depthBuffer&&($|=i.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&($|=i.STENCIL_BUFFER_BIT)),ne){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ve.__webglColorRenderbuffer[ce]);const be=r.get(g[ce]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,be,0)}i.blitFramebuffer(0,0,D,K,0,0,D,K,$,i.NEAREST),l===!0&&(A.length=0,Ze.length=0,A.push(i.COLOR_ATTACHMENT0+ce),T.depthBuffer&&T.resolveDepthBuffer===!1&&(A.push(j),Ze.push(j),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ze)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,A))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),ne)for(let ce=0;ce<g.length;ce++){t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.RENDERBUFFER,ve.__webglColorRenderbuffer[ce]);const be=r.get(g[ce]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ve.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ce,i.TEXTURE_2D,be,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ve.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const g=T.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function Ge(T){return Math.min(a.maxSamples,T.samples)}function ge(T){const g=r.get(T);return T.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Je(T){const g=o.render.frame;u.get(T)!==g&&(u.set(T,g),T.update())}function Te(T,g){const D=T.colorSpace,K=T.format,$=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||D!==or&&D!==ir&&(Ve.getTransfer(D)===Xe?(K!==Pt||$!==Yt)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",D)),g}function we(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=P,this.setTexture2D=X,this.setTexture2DArray=Y,this.setTexture3D=k,this.setTextureCube=Z,this.rebindTextures=Le,this.setupRenderTarget=Ie,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=ze,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=Q,this.useMultisampledRTT=ge}function vp(i,e){function t(r,a=ir){let n;const o=Ve.getTransfer(a);if(r===Yt)return i.UNSIGNED_BYTE;if(r===xn)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Mn)return i.UNSIGNED_SHORT_5_5_5_1;if(r===Vs)return i.UNSIGNED_INT_5_9_9_9_REV;if(r===zs)return i.BYTE;if(r===Hs)return i.SHORT;if(r===ci)return i.UNSIGNED_SHORT;if(r===vn)return i.INT;if(r===Tr)return i.UNSIGNED_INT;if(r===qt)return i.FLOAT;if(r===hi)return i.HALF_FLOAT;if(r===ks)return i.ALPHA;if(r===Gs)return i.RGB;if(r===Pt)return i.RGBA;if(r===Ws)return i.LUMINANCE;if(r===Xs)return i.LUMINANCE_ALPHA;if(r===Kr)return i.DEPTH_COMPONENT;if(r===ei)return i.DEPTH_STENCIL;if(r===qs)return i.RED;if(r===Sn)return i.RED_INTEGER;if(r===js)return i.RG;if(r===En)return i.RG_INTEGER;if(r===Tn)return i.RGBA_INTEGER;if(r===Vi||r===ki||r===Gi||r===Wi)if(o===Xe)if(n=e.get("WEBGL_compressed_texture_s3tc_srgb"),n!==null){if(r===Vi)return n.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===ki)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Gi)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Wi)return n.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(n=e.get("WEBGL_compressed_texture_s3tc"),n!==null){if(r===Vi)return n.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===ki)return n.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Gi)return n.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Wi)return n.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===ka||r===Ga||r===Wa||r===Xa)if(n=e.get("WEBGL_compressed_texture_pvrtc"),n!==null){if(r===ka)return n.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===Ga)return n.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Wa)return n.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Xa)return n.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===qa||r===ja||r===Ya)if(n=e.get("WEBGL_compressed_texture_etc"),n!==null){if(r===qa||r===ja)return o===Xe?n.COMPRESSED_SRGB8_ETC2:n.COMPRESSED_RGB8_ETC2;if(r===Ya)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:n.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Ka||r===Za||r===Ja||r===$a||r===Qa||r===en||r===tn||r===rn||r===an||r===nn||r===sn||r===on||r===ln||r===cn)if(n=e.get("WEBGL_compressed_texture_astc"),n!==null){if(r===Ka)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:n.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Za)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:n.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Ja)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:n.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===$a)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:n.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Qa)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:n.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===en)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:n.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===tn)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:n.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===rn)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:n.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===an)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:n.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===nn)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:n.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===sn)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:n.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===on)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:n.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===ln)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:n.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===cn)return o===Xe?n.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:n.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Xi||r===hn||r===un)if(n=e.get("EXT_texture_compression_bptc"),n!==null){if(r===Xi)return o===Xe?n.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:n.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===hn)return n.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===un)return n.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===Ys||r===dn||r===pn||r===fn)if(n=e.get("EXT_texture_compression_rgtc"),n!==null){if(r===Xi)return n.COMPRESSED_RED_RGTC1_EXT;if(r===dn)return n.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===pn)return n.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===fn)return n.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Qr?i.UNSIGNED_INT_24_8:i[r]!==void 0?i[r]:null}return{convert:t}}class xp extends Tt{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Hi extends _t{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Mp={type:"move"};class Na{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Hi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Hi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new O,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new O),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Hi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new O,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new O),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const r of e.hand.values())this._getHandJoint(t,r)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,r){let a=null,n=null,o=null;const s=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const M of e.hand.values()){const d=t.getJointPose(M,r),h=this._getHandJoint(c,M);d!==null&&(h.matrix.fromArray(d.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=d.radius),h.visible=d!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],p=u.position.distanceTo(f.position),m=.02,x=.005;c.inputState.pinching&&p>m+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&p<=m-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(n=t.getPose(e.gripSpace,r),n!==null&&(l.matrix.fromArray(n.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,n.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(n.linearVelocity)):l.hasLinearVelocity=!1,n.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(n.angularVelocity)):l.hasAngularVelocity=!1));s!==null&&(a=t.getPose(e.targetRaySpace,r),a===null&&n!==null&&(a=n),a!==null&&(s.matrix.fromArray(a.transform.matrix),s.matrix.decompose(s.position,s.rotation,s.scale),s.matrixWorldNeedsUpdate=!0,a.linearVelocity?(s.hasLinearVelocity=!0,s.linearVelocity.copy(a.linearVelocity)):s.hasLinearVelocity=!1,a.angularVelocity?(s.hasAngularVelocity=!0,s.angularVelocity.copy(a.angularVelocity)):s.hasAngularVelocity=!1,this.dispatchEvent(Mp)))}return s!==null&&(s.visible=a!==null),l!==null&&(l.visible=n!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const r=new Hi;r.matrixAutoUpdate=!1,r.visible=!1,e.joints[t.jointName]=r,e.add(r)}return e.joints[t.jointName]}}const Sp=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,Ep=`
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

}`;class Tp{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t,r){if(this.texture===null){const a=new gt,n=e.properties.get(a);n.__webglTexture=t.texture,(t.depthNear!=r.depthNear||t.depthFar!=r.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=a}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,r=new Kt({vertexShader:Sp,fragmentShader:Ep,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Nt(new mi(20,20),r)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class yp extends br{constructor(e,t){super();const r=this;let a=null,n=1,o=null,s="local-floor",l=1,c=null,u=null,f=null,p=null,m=null,x=null;const M=new Tp,d=t.getContextAttributes();let h=null,b=null;const E=[],y=[],B=new Be;let R=null;const w=new Tt;w.layers.enable(1),w.viewport=new ot;const F=new Tt;F.layers.enable(2),F.viewport=new ot;const S=[w,F],v=new xp;v.layers.enable(1),v.layers.enable(2);let P=null,H=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(G){let Q=E[G];return Q===void 0&&(Q=new Na,E[G]=Q),Q.getTargetRaySpace()},this.getControllerGrip=function(G){let Q=E[G];return Q===void 0&&(Q=new Na,E[G]=Q),Q.getGripSpace()},this.getHand=function(G){let Q=E[G];return Q===void 0&&(Q=new Na,E[G]=Q),Q.getHandSpace()};function z(G){const Q=y.indexOf(G.inputSource);if(Q===-1)return;const ue=E[Q];ue!==void 0&&(ue.update(G.inputSource,G.frame,c||o),ue.dispatchEvent({type:G.type,data:G.inputSource}))}function X(){a.removeEventListener("select",z),a.removeEventListener("selectstart",z),a.removeEventListener("selectend",z),a.removeEventListener("squeeze",z),a.removeEventListener("squeezestart",z),a.removeEventListener("squeezeend",z),a.removeEventListener("end",X),a.removeEventListener("inputsourceschange",Y);for(let G=0;G<E.length;G++){const Q=y[G];Q!==null&&(y[G]=null,E[G].disconnect(Q))}P=null,H=null,M.reset(),e.setRenderTarget(h),m=null,p=null,f=null,a=null,b=null,ke.stop(),r.isPresenting=!1,e.setPixelRatio(R),e.setSize(B.width,B.height,!1),r.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(G){n=G,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(G){s=G,r.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(G){c=G},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f},this.getFrame=function(){return x},this.getSession=function(){return a},this.setSession=async function(G){if(a=G,a!==null){if(h=e.getRenderTarget(),a.addEventListener("select",z),a.addEventListener("selectstart",z),a.addEventListener("selectend",z),a.addEventListener("squeeze",z),a.addEventListener("squeezestart",z),a.addEventListener("squeezeend",z),a.addEventListener("end",X),a.addEventListener("inputsourceschange",Y),d.xrCompatible!==!0&&await t.makeXRCompatible(),R=e.getPixelRatio(),e.getSize(B),a.renderState.layers===void 0){const Q={antialias:d.antialias,alpha:!0,depth:d.depth,stencil:d.stencil,framebufferScaleFactor:n};m=new XRWebGLLayer(a,t,Q),a.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),b=new yr(m.framebufferWidth,m.framebufferHeight,{format:Pt,type:Yt,colorSpace:e.outputColorSpace,stencilBuffer:d.stencil})}else{let Q=null,ue=null,oe=null;d.depth&&(oe=d.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,Q=d.stencil?ei:Kr,ue=d.stencil?Qr:Tr);const Ae={colorFormat:t.RGBA8,depthFormat:oe,scaleFactor:n};f=new XRWebGLBinding(a,t),p=f.createProjectionLayer(Ae),a.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),b=new yr(p.textureWidth,p.textureHeight,{format:Pt,type:Yt,depthTexture:new ho(p.textureWidth,p.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,Q),stencilBuffer:d.stencil,colorSpace:e.outputColorSpace,samples:d.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}b.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await a.requestReferenceSpace(s),ke.setContext(a),ke.start(),r.isPresenting=!0,r.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return M.getDepthTexture()};function Y(G){for(let Q=0;Q<G.removed.length;Q++){const ue=G.removed[Q],oe=y.indexOf(ue);oe>=0&&(y[oe]=null,E[oe].disconnect(ue))}for(let Q=0;Q<G.added.length;Q++){const ue=G.added[Q];let oe=y.indexOf(ue);if(oe===-1){for(let Le=0;Le<E.length;Le++)if(Le>=y.length){y.push(ue),oe=Le;break}else if(y[Le]===null){y[Le]=ue,oe=Le;break}if(oe===-1)break}const Ae=E[oe];Ae&&Ae.connect(ue)}}const k=new O,Z=new O;function V(G,Q,ue){k.setFromMatrixPosition(Q.matrixWorld),Z.setFromMatrixPosition(ue.matrixWorld);const oe=k.distanceTo(Z),Ae=Q.projectionMatrix.elements,Le=ue.projectionMatrix.elements,Ie=Ae[14]/(Ae[10]-1),Ye=Ae[14]/(Ae[10]+1),A=(Ae[9]+1)/Ae[5],Ze=(Ae[9]-1)/Ae[5],ze=(Ae[8]-1)/Ae[0],Ge=(Le[8]+1)/Le[0],ge=Ie*ze,Je=Ie*Ge,Te=oe/(-ze+Ge),we=Te*-ze;Q.matrixWorld.decompose(G.position,G.quaternion,G.scale),G.translateX(we),G.translateZ(Te),G.matrixWorld.compose(G.position,G.quaternion,G.scale),G.matrixWorldInverse.copy(G.matrixWorld).invert();const T=Ie+Te,g=Ye+Te,D=ge-we,K=Je+(oe-we),$=A*Ye/g*T,j=Ze*Ye/g*T;G.projectionMatrix.makePerspective(D,K,$,j,T,g),G.projectionMatrixInverse.copy(G.projectionMatrix).invert()}function ae(G,Q){Q===null?G.matrixWorld.copy(G.matrix):G.matrixWorld.multiplyMatrices(Q.matrixWorld,G.matrix),G.matrixWorldInverse.copy(G.matrixWorld).invert()}this.updateCamera=function(G){if(a===null)return;M.texture!==null&&(G.near=M.depthNear,G.far=M.depthFar),v.near=F.near=w.near=G.near,v.far=F.far=w.far=G.far,(P!==v.near||H!==v.far)&&(a.updateRenderState({depthNear:v.near,depthFar:v.far}),P=v.near,H=v.far,w.near=P,w.far=H,F.near=P,F.far=H,w.updateProjectionMatrix(),F.updateProjectionMatrix(),G.updateProjectionMatrix());const Q=G.parent,ue=v.cameras;ae(v,Q);for(let oe=0;oe<ue.length;oe++)ae(ue[oe],Q);ue.length===2?V(v,w,F):v.projectionMatrix.copy(w.projectionMatrix),me(G,v,Q)};function me(G,Q,ue){ue===null?G.matrix.copy(Q.matrixWorld):(G.matrix.copy(ue.matrixWorld),G.matrix.invert(),G.matrix.multiply(Q.matrixWorld)),G.matrix.decompose(G.position,G.quaternion,G.scale),G.updateMatrixWorld(!0),G.projectionMatrix.copy(Q.projectionMatrix),G.projectionMatrixInverse.copy(Q.projectionMatrixInverse),G.isPerspectiveCamera&&(G.fov=mn*2*Math.atan(1/G.projectionMatrix.elements[5]),G.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(p===null&&m===null))return l},this.setFoveation=function(G){l=G,p!==null&&(p.fixedFoveation=G),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=G)},this.hasDepthSensing=function(){return M.texture!==null},this.getDepthSensingMesh=function(){return M.getMesh(v)};let Me=null;function De(G,Q){if(u=Q.getViewerPose(c||o),x=Q,u!==null){const ue=u.views;m!==null&&(e.setRenderTargetFramebuffer(b,m.framebuffer),e.setRenderTarget(b));let oe=!1;ue.length!==v.cameras.length&&(v.cameras.length=0,oe=!0);for(let Le=0;Le<ue.length;Le++){const Ie=ue[Le];let Ye=null;if(m!==null)Ye=m.getViewport(Ie);else{const Ze=f.getViewSubImage(p,Ie);Ye=Ze.viewport,Le===0&&(e.setRenderTargetTextures(b,Ze.colorTexture,p.ignoreDepthValues?void 0:Ze.depthStencilTexture),e.setRenderTarget(b))}let A=S[Le];A===void 0&&(A=new Tt,A.layers.enable(Le),A.viewport=new ot,S[Le]=A),A.matrix.fromArray(Ie.transform.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale),A.projectionMatrix.fromArray(Ie.projectionMatrix),A.projectionMatrixInverse.copy(A.projectionMatrix).invert(),A.viewport.set(Ye.x,Ye.y,Ye.width,Ye.height),Le===0&&(v.matrix.copy(A.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),oe===!0&&v.cameras.push(A)}const Ae=a.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Le=f.getDepthInformation(ue[0]);Le&&Le.isValid&&Le.texture&&M.init(e,Le,a.renderState)}}for(let ue=0;ue<E.length;ue++){const oe=y[ue],Ae=E[ue];oe!==null&&Ae!==void 0&&Ae.update(oe,Q,c||o)}Me&&Me(G,Q),Q.detectedPlanes&&r.dispatchEvent({type:"planesdetected",data:Q}),x=null}const ke=new co;ke.setAnimationLoop(De),this.setAnimationLoop=function(G){Me=G},this.dispose=function(){}}}const mr=new Ft,bp=new it;function Ap(i,e){function t(d,h){d.matrixAutoUpdate===!0&&d.updateMatrix(),h.value.copy(d.matrix)}function r(d,h){h.color.getRGB(d.fogColor.value,no(i)),h.isFog?(d.fogNear.value=h.near,d.fogFar.value=h.far):h.isFogExp2&&(d.fogDensity.value=h.density)}function a(d,h,b,E,y){h.isMeshBasicMaterial||h.isMeshLambertMaterial?n(d,h):h.isMeshToonMaterial?(n(d,h),f(d,h)):h.isMeshPhongMaterial?(n(d,h),u(d,h)):h.isMeshStandardMaterial?(n(d,h),p(d,h),h.isMeshPhysicalMaterial&&m(d,h,y)):h.isMeshMatcapMaterial?(n(d,h),x(d,h)):h.isMeshDepthMaterial?n(d,h):h.isMeshDistanceMaterial?(n(d,h),M(d,h)):h.isMeshNormalMaterial?n(d,h):h.isLineBasicMaterial?(o(d,h),h.isLineDashedMaterial&&s(d,h)):h.isPointsMaterial?l(d,h,b,E):h.isSpriteMaterial?c(d,h):h.isShadowMaterial?(d.color.value.copy(h.color),d.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function n(d,h){d.opacity.value=h.opacity,h.color&&d.diffuse.value.copy(h.color),h.emissive&&d.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.bumpMap&&(d.bumpMap.value=h.bumpMap,t(h.bumpMap,d.bumpMapTransform),d.bumpScale.value=h.bumpScale,h.side===mt&&(d.bumpScale.value*=-1)),h.normalMap&&(d.normalMap.value=h.normalMap,t(h.normalMap,d.normalMapTransform),d.normalScale.value.copy(h.normalScale),h.side===mt&&d.normalScale.value.negate()),h.displacementMap&&(d.displacementMap.value=h.displacementMap,t(h.displacementMap,d.displacementMapTransform),d.displacementScale.value=h.displacementScale,d.displacementBias.value=h.displacementBias),h.emissiveMap&&(d.emissiveMap.value=h.emissiveMap,t(h.emissiveMap,d.emissiveMapTransform)),h.specularMap&&(d.specularMap.value=h.specularMap,t(h.specularMap,d.specularMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest);const b=e.get(h),E=b.envMap,y=b.envMapRotation;E&&(d.envMap.value=E,mr.copy(y),mr.x*=-1,mr.y*=-1,mr.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(mr.y*=-1,mr.z*=-1),d.envMapRotation.value.setFromMatrix4(bp.makeRotationFromEuler(mr)),d.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,d.reflectivity.value=h.reflectivity,d.ior.value=h.ior,d.refractionRatio.value=h.refractionRatio),h.lightMap&&(d.lightMap.value=h.lightMap,d.lightMapIntensity.value=h.lightMapIntensity,t(h.lightMap,d.lightMapTransform)),h.aoMap&&(d.aoMap.value=h.aoMap,d.aoMapIntensity.value=h.aoMapIntensity,t(h.aoMap,d.aoMapTransform))}function o(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform))}function s(d,h){d.dashSize.value=h.dashSize,d.totalSize.value=h.dashSize+h.gapSize,d.scale.value=h.scale}function l(d,h,b,E){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.size.value=h.size*b,d.scale.value=E*.5,h.map&&(d.map.value=h.map,t(h.map,d.uvTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function c(d,h){d.diffuse.value.copy(h.color),d.opacity.value=h.opacity,d.rotation.value=h.rotation,h.map&&(d.map.value=h.map,t(h.map,d.mapTransform)),h.alphaMap&&(d.alphaMap.value=h.alphaMap,t(h.alphaMap,d.alphaMapTransform)),h.alphaTest>0&&(d.alphaTest.value=h.alphaTest)}function u(d,h){d.specular.value.copy(h.specular),d.shininess.value=Math.max(h.shininess,1e-4)}function f(d,h){h.gradientMap&&(d.gradientMap.value=h.gradientMap)}function p(d,h){d.metalness.value=h.metalness,h.metalnessMap&&(d.metalnessMap.value=h.metalnessMap,t(h.metalnessMap,d.metalnessMapTransform)),d.roughness.value=h.roughness,h.roughnessMap&&(d.roughnessMap.value=h.roughnessMap,t(h.roughnessMap,d.roughnessMapTransform)),h.envMap&&(d.envMapIntensity.value=h.envMapIntensity)}function m(d,h,b){d.ior.value=h.ior,h.sheen>0&&(d.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),d.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(d.sheenColorMap.value=h.sheenColorMap,t(h.sheenColorMap,d.sheenColorMapTransform)),h.sheenRoughnessMap&&(d.sheenRoughnessMap.value=h.sheenRoughnessMap,t(h.sheenRoughnessMap,d.sheenRoughnessMapTransform))),h.clearcoat>0&&(d.clearcoat.value=h.clearcoat,d.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(d.clearcoatMap.value=h.clearcoatMap,t(h.clearcoatMap,d.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(d.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,t(h.clearcoatRoughnessMap,d.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(d.clearcoatNormalMap.value=h.clearcoatNormalMap,t(h.clearcoatNormalMap,d.clearcoatNormalMapTransform),d.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===mt&&d.clearcoatNormalScale.value.negate())),h.dispersion>0&&(d.dispersion.value=h.dispersion),h.iridescence>0&&(d.iridescence.value=h.iridescence,d.iridescenceIOR.value=h.iridescenceIOR,d.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],d.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(d.iridescenceMap.value=h.iridescenceMap,t(h.iridescenceMap,d.iridescenceMapTransform)),h.iridescenceThicknessMap&&(d.iridescenceThicknessMap.value=h.iridescenceThicknessMap,t(h.iridescenceThicknessMap,d.iridescenceThicknessMapTransform))),h.transmission>0&&(d.transmission.value=h.transmission,d.transmissionSamplerMap.value=b.texture,d.transmissionSamplerSize.value.set(b.width,b.height),h.transmissionMap&&(d.transmissionMap.value=h.transmissionMap,t(h.transmissionMap,d.transmissionMapTransform)),d.thickness.value=h.thickness,h.thicknessMap&&(d.thicknessMap.value=h.thicknessMap,t(h.thicknessMap,d.thicknessMapTransform)),d.attenuationDistance.value=h.attenuationDistance,d.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(d.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(d.anisotropyMap.value=h.anisotropyMap,t(h.anisotropyMap,d.anisotropyMapTransform))),d.specularIntensity.value=h.specularIntensity,d.specularColor.value.copy(h.specularColor),h.specularColorMap&&(d.specularColorMap.value=h.specularColorMap,t(h.specularColorMap,d.specularColorMapTransform)),h.specularIntensityMap&&(d.specularIntensityMap.value=h.specularIntensityMap,t(h.specularIntensityMap,d.specularIntensityMapTransform))}function x(d,h){h.matcap&&(d.matcap.value=h.matcap)}function M(d,h){const b=e.get(h).light;d.referencePosition.value.setFromMatrixPosition(b.matrixWorld),d.nearDistance.value=b.shadow.camera.near,d.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:r,refreshMaterialUniforms:a}}function wp(i,e,t,r){let a={},n={},o=[];const s=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(b,E){const y=E.program;r.uniformBlockBinding(b,y)}function c(b,E){let y=a[b.id];y===void 0&&(x(b),y=u(b),a[b.id]=y,b.addEventListener("dispose",d));const B=E.program;r.updateUBOMapping(b,B);const R=e.render.frame;n[b.id]!==R&&(p(b),n[b.id]=R)}function u(b){const E=f();b.__bindingPointIndex=E;const y=i.createBuffer(),B=b.__size,R=b.usage;return i.bindBuffer(i.UNIFORM_BUFFER,y),i.bufferData(i.UNIFORM_BUFFER,B,R),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,E,y),y}function f(){for(let b=0;b<s;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(b){const E=a[b.id],y=b.uniforms,B=b.__cache;i.bindBuffer(i.UNIFORM_BUFFER,E);for(let R=0,w=y.length;R<w;R++){const F=Array.isArray(y[R])?y[R]:[y[R]];for(let S=0,v=F.length;S<v;S++){const P=F[S];if(m(P,R,S,B)===!0){const H=P.__offset,z=Array.isArray(P.value)?P.value:[P.value];let X=0;for(let Y=0;Y<z.length;Y++){const k=z[Y],Z=M(k);typeof k=="number"||typeof k=="boolean"?(P.__data[0]=k,i.bufferSubData(i.UNIFORM_BUFFER,H+X,P.__data)):k.isMatrix3?(P.__data[0]=k.elements[0],P.__data[1]=k.elements[1],P.__data[2]=k.elements[2],P.__data[3]=0,P.__data[4]=k.elements[3],P.__data[5]=k.elements[4],P.__data[6]=k.elements[5],P.__data[7]=0,P.__data[8]=k.elements[6],P.__data[9]=k.elements[7],P.__data[10]=k.elements[8],P.__data[11]=0):(k.toArray(P.__data,X),X+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,H,P.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function m(b,E,y,B){const R=b.value,w=E+"_"+y;if(B[w]===void 0)return typeof R=="number"||typeof R=="boolean"?B[w]=R:B[w]=R.clone(),!0;{const F=B[w];if(typeof R=="number"||typeof R=="boolean"){if(F!==R)return B[w]=R,!0}else if(F.equals(R)===!1)return F.copy(R),!0}return!1}function x(b){const E=b.uniforms;let y=0;const B=16;for(let w=0,F=E.length;w<F;w++){const S=Array.isArray(E[w])?E[w]:[E[w]];for(let v=0,P=S.length;v<P;v++){const H=S[v],z=Array.isArray(H.value)?H.value:[H.value];for(let X=0,Y=z.length;X<Y;X++){const k=z[X],Z=M(k),V=y%B;V!==0&&B-V<Z.boundary&&(y+=B-V),H.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),H.__offset=y,y+=Z.storage}}}const R=y%B;return R>0&&(y+=B-R),b.__size=y,b.__cache={},this}function M(b){const E={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(E.boundary=4,E.storage=4):b.isVector2?(E.boundary=8,E.storage=8):b.isVector3||b.isColor?(E.boundary=16,E.storage=12):b.isVector4?(E.boundary=16,E.storage=16):b.isMatrix3?(E.boundary=48,E.storage=48):b.isMatrix4?(E.boundary=64,E.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),E}function d(b){const E=b.target;E.removeEventListener("dispose",d);const y=o.indexOf(E.__bindingPointIndex);o.splice(y,1),i.deleteBuffer(a[E.id]),delete a[E.id],delete n[E.id]}function h(){for(const b in a)i.deleteBuffer(a[b]);o=[],a={},n={}}return{bind:l,update:c,dispose:h}}class Rp{constructor(e={}){const{canvas:t=_l(),context:r=null,depth:a=!0,stencil:n=!1,alpha:o=!1,antialias:s=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let p;if(r!==null){if(typeof WebGLRenderingContext<"u"&&r instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=r.getContextAttributes().alpha}else p=o;const m=new Uint32Array(4),x=new Int32Array(4);let M=null,d=null;const h=[],b=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Ut,this.toneMapping=nr,this.toneMappingExposure=1;const E=this;let y=!1,B=0,R=0,w=null,F=-1,S=null;const v=new ot,P=new ot;let H=null;const z=new Oe(0);let X=0,Y=t.width,k=t.height,Z=1,V=null,ae=null;const me=new ot(0,0,Y,k),Me=new ot(0,0,Y,k);let De=!1;const ke=new lo;let G=!1,Q=!1;const ue=new it,oe=new O,Ae=new ot,Le={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ie=!1;function Ye(){return w===null?Z:1}let A=r;function Ze(_,L){return t.getContext(_,L)}try{const _={alpha:!0,depth:a,stencil:n,antialias:s,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${_n}`),t.addEventListener("webglcontextlost",W,!1),t.addEventListener("webglcontextrestored",q,!1),t.addEventListener("webglcontextcreationerror",re,!1),A===null){const L="webgl2";if(A=Ze(L,_),A===null)throw Ze(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(_){throw console.error("THREE.WebGLRenderer: "+_.message),_}let ze,Ge,ge,Je,Te,we,T,g,D,K,$,j,ve,ne,ce,be,ee,he,Ne,Ee,le,ye,Ue,je;function C(){ze=new Nu(A),ze.init(),ye=new vp(A,ze),Ge=new Ru(A,ze,e,ye),ge=new mp(A),Je=new Bu(A),Te=new tp,we=new _p(A,ze,ge,Te,Ge,ye,Je),T=new Pu(E),g=new Du(E),D=new Wl(A),Ue=new Au(A,D),K=new Ou(A,D,Je,Ue),$=new Hu(A,K,D,Je),Ne=new zu(A,Ge,we),be=new Cu(Te),j=new ep(E,T,g,ze,Ge,Ue,be),ve=new Ap(E,Te),ne=new ip,ce=new cp(ze),he=new bu(E,T,g,ge,$,p,l),ee=new fp(E,$,Ge),je=new wp(A,Je,Ge,ge),Ee=new wu(A,ze,Je),le=new Fu(A,ze,Je),Je.programs=j.programs,E.capabilities=Ge,E.extensions=ze,E.properties=Te,E.renderLists=ne,E.shadowMap=ee,E.state=ge,E.info=Je}C();const te=new yp(E,A);this.xr=te,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const _=ze.get("WEBGL_lose_context");_&&_.loseContext()},this.forceContextRestore=function(){const _=ze.get("WEBGL_lose_context");_&&_.restoreContext()},this.getPixelRatio=function(){return Z},this.setPixelRatio=function(_){_!==void 0&&(Z=_,this.setSize(Y,k,!1))},this.getSize=function(_){return _.set(Y,k)},this.setSize=function(_,L,I=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=_,k=L,t.width=Math.floor(_*Z),t.height=Math.floor(L*Z),I===!0&&(t.style.width=_+"px",t.style.height=L+"px"),this.setViewport(0,0,_,L)},this.getDrawingBufferSize=function(_){return _.set(Y*Z,k*Z).floor()},this.setDrawingBufferSize=function(_,L,I){Y=_,k=L,Z=I,t.width=Math.floor(_*I),t.height=Math.floor(L*I),this.setViewport(0,0,_,L)},this.getCurrentViewport=function(_){return _.copy(v)},this.getViewport=function(_){return _.copy(me)},this.setViewport=function(_,L,I,N){_.isVector4?me.set(_.x,_.y,_.z,_.w):me.set(_,L,I,N),ge.viewport(v.copy(me).multiplyScalar(Z).round())},this.getScissor=function(_){return _.copy(Me)},this.setScissor=function(_,L,I,N){_.isVector4?Me.set(_.x,_.y,_.z,_.w):Me.set(_,L,I,N),ge.scissor(P.copy(Me).multiplyScalar(Z).round())},this.getScissorTest=function(){return De},this.setScissorTest=function(_){ge.setScissorTest(De=_)},this.setOpaqueSort=function(_){V=_},this.setTransparentSort=function(_){ae=_},this.getClearColor=function(_){return _.copy(he.getClearColor())},this.setClearColor=function(){he.setClearColor.apply(he,arguments)},this.getClearAlpha=function(){return he.getClearAlpha()},this.setClearAlpha=function(){he.setClearAlpha.apply(he,arguments)},this.clear=function(_=!0,L=!0,I=!0){let N=0;if(_){let U=!1;if(w!==null){const J=w.texture.format;U=J===Tn||J===En||J===Sn}if(U){const J=w.texture.type,se=J===Yt||J===Tr||J===ci||J===Qr||J===xn||J===Mn,de=he.getClearColor(),pe=he.getClearAlpha(),Se=de.r,Re=de.g,xe=de.b;se?(m[0]=Se,m[1]=Re,m[2]=xe,m[3]=pe,A.clearBufferuiv(A.COLOR,0,m)):(x[0]=Se,x[1]=Re,x[2]=xe,x[3]=pe,A.clearBufferiv(A.COLOR,0,x))}else N|=A.COLOR_BUFFER_BIT}L&&(N|=A.DEPTH_BUFFER_BIT),I&&(N|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(N)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",W,!1),t.removeEventListener("webglcontextrestored",q,!1),t.removeEventListener("webglcontextcreationerror",re,!1),ne.dispose(),ce.dispose(),Te.dispose(),T.dispose(),g.dispose(),$.dispose(),Ue.dispose(),je.dispose(),j.dispose(),te.dispose(),te.removeEventListener("sessionstart",Lt),te.removeEventListener("sessionend",Pn),lr.stop()};function W(_){_.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),y=!0}function q(){console.log("THREE.WebGLRenderer: Context Restored."),y=!1;const _=Je.autoReset,L=ee.enabled,I=ee.autoUpdate,N=ee.needsUpdate,U=ee.type;C(),Je.autoReset=_,ee.enabled=L,ee.autoUpdate=I,ee.needsUpdate=N,ee.type=U}function re(_){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",_.statusMessage)}function _e(_){const L=_.target;L.removeEventListener("dispose",_e),We(L)}function We(_){$e(_),Te.remove(_)}function $e(_){const L=Te.get(_).programs;L!==void 0&&(L.forEach(function(I){j.releaseProgram(I)}),_.isShaderMaterial&&j.releaseShaderCache(_))}this.renderBufferDirect=function(_,L,I,N,U,J){L===null&&(L=Le);const se=U.isMesh&&U.matrixWorld.determinant()<0,de=_o(_,L,I,N,U);ge.setMaterial(N,se);let pe=I.index,Se=1;if(N.wireframe===!0){if(pe=K.getWireframeAttribute(I),pe===void 0)return;Se=2}const Re=I.drawRange,xe=I.attributes.position;let He=Re.start*Se,Qe=(Re.start+Re.count)*Se;J!==null&&(He=Math.max(He,J.start*Se),Qe=Math.min(Qe,(J.start+J.count)*Se)),pe!==null?(He=Math.max(He,0),Qe=Math.min(Qe,pe.count)):xe!=null&&(He=Math.max(He,0),Qe=Math.min(Qe,xe.count));const Ke=Qe-He;if(Ke<0||Ke===1/0)return;Ue.setup(U,N,de,I,pe);let rt,qe=Ee;if(pe!==null&&(rt=D.get(pe),qe=le,qe.setIndex(rt)),U.isMesh)N.wireframe===!0?(ge.setLineWidth(N.wireframeLinewidth*Ye()),qe.setMode(A.LINES)):qe.setMode(A.TRIANGLES);else if(U.isLine){let fe=N.linewidth;fe===void 0&&(fe=1),ge.setLineWidth(fe*Ye()),U.isLineSegments?qe.setMode(A.LINES):U.isLineLoop?qe.setMode(A.LINE_LOOP):qe.setMode(A.LINE_STRIP)}else U.isPoints?qe.setMode(A.POINTS):U.isSprite&&qe.setMode(A.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)qe.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(ze.get("WEBGL_multi_draw"))qe.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const fe=U._multiDrawStarts,ut=U._multiDrawCounts,cr=U._multiDrawCount,bt=pe?D.get(pe).bytesPerElement:1,wr=Te.get(N).currentProgram.getUniforms();for(let vt=0;vt<cr;vt++)wr.setValue(A,"_gl_DrawID",vt),qe.render(fe[vt]/bt,ut[vt])}else if(U.isInstancedMesh)qe.renderInstances(He,Ke,U.count);else if(I.isInstancedBufferGeometry){const fe=I._maxInstanceCount!==void 0?I._maxInstanceCount:1/0,ut=Math.min(I.instanceCount,fe);qe.renderInstances(He,Ke,ut)}else qe.render(He,Ke)};function lt(_,L,I){_.transparent===!0&&_.side===Xt&&_.forceSinglePass===!1?(_.side=mt,_.needsUpdate=!0,_i(_,L,I),_.side=sr,_.needsUpdate=!0,_i(_,L,I),_.side=Xt):_i(_,L,I)}this.compile=function(_,L,I=null){I===null&&(I=_),d=ce.get(I),d.init(L),b.push(d),I.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),_!==I&&_.traverseVisible(function(U){U.isLight&&U.layers.test(L.layers)&&(d.pushLight(U),U.castShadow&&d.pushShadow(U))}),d.setupLights();const N=new Set;return _.traverse(function(U){const J=U.material;if(J)if(Array.isArray(J))for(let se=0;se<J.length;se++){const de=J[se];lt(de,I,U),N.add(de)}else lt(J,I,U),N.add(J)}),b.pop(),d=null,N},this.compileAsync=function(_,L,I=null){const N=this.compile(_,L,I);return new Promise(U=>{function J(){if(N.forEach(function(se){Te.get(se).currentProgram.isReady()&&N.delete(se)}),N.size===0){U(_);return}setTimeout(J,10)}ze.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let Fe=null;function Bt(_){Fe&&Fe(_)}function Lt(){lr.stop()}function Pn(){lr.start()}const lr=new co;lr.setAnimationLoop(Bt),typeof self<"u"&&lr.setContext(self),this.setAnimationLoop=function(_){Fe=_,te.setAnimationLoop(_),_===null?lr.stop():lr.start()},te.addEventListener("sessionstart",Lt),te.addEventListener("sessionend",Pn),this.render=function(_,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(y===!0)return;if(_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(L),L=te.getCamera()),_.isScene===!0&&_.onBeforeRender(E,_,L,w),d=ce.get(_,b.length),d.init(L),b.push(d),ue.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),ke.setFromProjectionMatrix(ue),Q=this.localClippingEnabled,G=be.init(this.clippingPlanes,Q),M=ne.get(_,h.length),M.init(),h.push(M),te.enabled===!0&&te.isPresenting===!0){const J=E.xr.getDepthSensingMesh();J!==null&&aa(J,L,-1/0,E.sortObjects)}aa(_,L,0,E.sortObjects),M.finish(),E.sortObjects===!0&&M.sort(V,ae),Ie=te.enabled===!1||te.isPresenting===!1||te.hasDepthSensing()===!1,Ie&&he.addToRenderList(M,_),this.info.render.frame++,G===!0&&be.beginShadows();const I=d.state.shadowsArray;ee.render(I,_,L),G===!0&&be.endShadows(),this.info.autoReset===!0&&this.info.reset();const N=M.opaque,U=M.transmissive;if(d.setupLights(),L.isArrayCamera){const J=L.cameras;if(U.length>0)for(let se=0,de=J.length;se<de;se++){const pe=J[se];Un(N,U,_,pe)}Ie&&he.render(_);for(let se=0,de=J.length;se<de;se++){const pe=J[se];Ln(M,_,pe,pe.viewport)}}else U.length>0&&Un(N,U,_,L),Ie&&he.render(_),Ln(M,_,L);w!==null&&(we.updateMultisampleRenderTarget(w),we.updateRenderTargetMipmap(w)),_.isScene===!0&&_.onAfterRender(E,_,L),Ue.resetDefaultState(),F=-1,S=null,b.pop(),b.length>0?(d=b[b.length-1],G===!0&&be.setGlobalState(E.clippingPlanes,d.state.camera)):d=null,h.pop(),h.length>0?M=h[h.length-1]:M=null};function aa(_,L,I,N){if(_.visible===!1)return;if(_.layers.test(L.layers)){if(_.isGroup)I=_.renderOrder;else if(_.isLOD)_.autoUpdate===!0&&_.update(L);else if(_.isLight)d.pushLight(_),_.castShadow&&d.pushShadow(_);else if(_.isSprite){if(!_.frustumCulled||ke.intersectsSprite(_)){N&&Ae.setFromMatrixPosition(_.matrixWorld).applyMatrix4(ue);const J=$.update(_),se=_.material;se.visible&&M.push(_,J,se,I,Ae.z,null)}}else if((_.isMesh||_.isLine||_.isPoints)&&(!_.frustumCulled||ke.intersectsObject(_))){const J=$.update(_),se=_.material;if(N&&(_.boundingSphere!==void 0?(_.boundingSphere===null&&_.computeBoundingSphere(),Ae.copy(_.boundingSphere.center)):(J.boundingSphere===null&&J.computeBoundingSphere(),Ae.copy(J.boundingSphere.center)),Ae.applyMatrix4(_.matrixWorld).applyMatrix4(ue)),Array.isArray(se)){const de=J.groups;for(let pe=0,Se=de.length;pe<Se;pe++){const Re=de[pe],xe=se[Re.materialIndex];xe&&xe.visible&&M.push(_,J,xe,I,Ae.z,Re)}}else se.visible&&M.push(_,J,se,I,Ae.z,null)}}const U=_.children;for(let J=0,se=U.length;J<se;J++)aa(U[J],L,I,N)}function Ln(_,L,I,N){const U=_.opaque,J=_.transmissive,se=_.transparent;d.setupLightsView(I),G===!0&&be.setGlobalState(E.clippingPlanes,I),N&&ge.viewport(v.copy(N)),U.length>0&&gi(U,L,I),J.length>0&&gi(J,L,I),se.length>0&&gi(se,L,I),ge.buffers.depth.setTest(!0),ge.buffers.depth.setMask(!0),ge.buffers.color.setMask(!0),ge.setPolygonOffset(!1)}function Un(_,L,I,N){if((I.isScene===!0?I.overrideMaterial:null)!==null)return;d.state.transmissionRenderTarget[N.id]===void 0&&(d.state.transmissionRenderTarget[N.id]=new yr(1,1,{generateMipmaps:!0,type:ze.has("EXT_color_buffer_half_float")||ze.has("EXT_color_buffer_float")?hi:Yt,minFilter:Sr,samples:4,stencilBuffer:n,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Ve.workingColorSpace}));const U=d.state.transmissionRenderTarget[N.id],J=N.viewport||v;U.setSize(J.z,J.w);const se=E.getRenderTarget();E.setRenderTarget(U),E.getClearColor(z),X=E.getClearAlpha(),X<1&&E.setClearColor(16777215,.5),Ie?he.render(I):E.clear();const de=E.toneMapping;E.toneMapping=nr;const pe=N.viewport;if(N.viewport!==void 0&&(N.viewport=void 0),d.setupLightsView(N),G===!0&&be.setGlobalState(E.clippingPlanes,N),gi(_,I,N),we.updateMultisampleRenderTarget(U),we.updateRenderTargetMipmap(U),ze.has("WEBGL_multisampled_render_to_texture")===!1){let Se=!1;for(let Re=0,xe=L.length;Re<xe;Re++){const He=L[Re],Qe=He.object,Ke=He.geometry,rt=He.material,qe=He.group;if(rt.side===Xt&&Qe.layers.test(N.layers)){const fe=rt.side;rt.side=mt,rt.needsUpdate=!0,In(Qe,I,N,Ke,rt,qe),rt.side=fe,rt.needsUpdate=!0,Se=!0}}Se===!0&&(we.updateMultisampleRenderTarget(U),we.updateRenderTargetMipmap(U))}E.setRenderTarget(se),E.setClearColor(z,X),pe!==void 0&&(N.viewport=pe),E.toneMapping=de}function gi(_,L,I){const N=L.isScene===!0?L.overrideMaterial:null;for(let U=0,J=_.length;U<J;U++){const se=_[U],de=se.object,pe=se.geometry,Se=N===null?se.material:N,Re=se.group;de.layers.test(I.layers)&&In(de,L,I,pe,Se,Re)}}function In(_,L,I,N,U,J){_.onBeforeRender(E,L,I,N,U,J),_.modelViewMatrix.multiplyMatrices(I.matrixWorldInverse,_.matrixWorld),_.normalMatrix.getNormalMatrix(_.modelViewMatrix),U.transparent===!0&&U.side===Xt&&U.forceSinglePass===!1?(U.side=mt,U.needsUpdate=!0,E.renderBufferDirect(I,L,N,U,_,J),U.side=sr,U.needsUpdate=!0,E.renderBufferDirect(I,L,N,U,_,J),U.side=Xt):E.renderBufferDirect(I,L,N,U,_,J),_.onAfterRender(E,L,I,N,U,J)}function _i(_,L,I){L.isScene!==!0&&(L=Le);const N=Te.get(_),U=d.state.lights,J=d.state.shadowsArray,se=U.state.version,de=j.getParameters(_,U.state,J,L,I),pe=j.getProgramCacheKey(de);let Se=N.programs;N.environment=_.isMeshStandardMaterial?L.environment:null,N.fog=L.fog,N.envMap=(_.isMeshStandardMaterial?g:T).get(_.envMap||N.environment),N.envMapRotation=N.environment!==null&&_.envMap===null?L.environmentRotation:_.envMapRotation,Se===void 0&&(_.addEventListener("dispose",_e),Se=new Map,N.programs=Se);let Re=Se.get(pe);if(Re!==void 0){if(N.currentProgram===Re&&N.lightsStateVersion===se)return Nn(_,de),Re}else de.uniforms=j.getUniforms(_),_.onBeforeCompile(de,E),Re=j.acquireProgram(de,pe),Se.set(pe,Re),N.uniforms=de.uniforms;const xe=N.uniforms;return(!_.isShaderMaterial&&!_.isRawShaderMaterial||_.clipping===!0)&&(xe.clippingPlanes=be.uniform),Nn(_,de),N.needsLights=xo(_),N.lightsStateVersion=se,N.needsLights&&(xe.ambientLightColor.value=U.state.ambient,xe.lightProbe.value=U.state.probe,xe.directionalLights.value=U.state.directional,xe.directionalLightShadows.value=U.state.directionalShadow,xe.spotLights.value=U.state.spot,xe.spotLightShadows.value=U.state.spotShadow,xe.rectAreaLights.value=U.state.rectArea,xe.ltc_1.value=U.state.rectAreaLTC1,xe.ltc_2.value=U.state.rectAreaLTC2,xe.pointLights.value=U.state.point,xe.pointLightShadows.value=U.state.pointShadow,xe.hemisphereLights.value=U.state.hemi,xe.directionalShadowMap.value=U.state.directionalShadowMap,xe.directionalShadowMatrix.value=U.state.directionalShadowMatrix,xe.spotShadowMap.value=U.state.spotShadowMap,xe.spotLightMatrix.value=U.state.spotLightMatrix,xe.spotLightMap.value=U.state.spotLightMap,xe.pointShadowMap.value=U.state.pointShadowMap,xe.pointShadowMatrix.value=U.state.pointShadowMatrix),N.currentProgram=Re,N.uniformsList=null,Re}function Dn(_){if(_.uniformsList===null){const L=_.currentProgram.getUniforms();_.uniformsList=qi.seqWithValue(L.seq,_.uniforms)}return _.uniformsList}function Nn(_,L){const I=Te.get(_);I.outputColorSpace=L.outputColorSpace,I.batching=L.batching,I.batchingColor=L.batchingColor,I.instancing=L.instancing,I.instancingColor=L.instancingColor,I.instancingMorph=L.instancingMorph,I.skinning=L.skinning,I.morphTargets=L.morphTargets,I.morphNormals=L.morphNormals,I.morphColors=L.morphColors,I.morphTargetsCount=L.morphTargetsCount,I.numClippingPlanes=L.numClippingPlanes,I.numIntersection=L.numClipIntersection,I.vertexAlphas=L.vertexAlphas,I.vertexTangents=L.vertexTangents,I.toneMapping=L.toneMapping}function _o(_,L,I,N,U){L.isScene!==!0&&(L=Le),we.resetTextureUnits();const J=L.fog,se=N.isMeshStandardMaterial?L.environment:null,de=w===null?E.outputColorSpace:w.isXRRenderTarget===!0?w.texture.colorSpace:or,pe=(N.isMeshStandardMaterial?g:T).get(N.envMap||se),Se=N.vertexColors===!0&&!!I.attributes.color&&I.attributes.color.itemSize===4,Re=!!I.attributes.tangent&&(!!N.normalMap||N.anisotropy>0),xe=!!I.morphAttributes.position,He=!!I.morphAttributes.normal,Qe=!!I.morphAttributes.color;let Ke=nr;N.toneMapped&&(w===null||w.isXRRenderTarget===!0)&&(Ke=E.toneMapping);const rt=I.morphAttributes.position||I.morphAttributes.normal||I.morphAttributes.color,qe=rt!==void 0?rt.length:0,fe=Te.get(N),ut=d.state.lights;if(G===!0&&(Q===!0||_!==S)){const St=_===S&&N.id===F;be.setState(N,_,St)}let cr=!1;N.version===fe.__version?(fe.needsLights&&fe.lightsStateVersion!==ut.state.version||fe.outputColorSpace!==de||U.isBatchedMesh&&fe.batching===!1||!U.isBatchedMesh&&fe.batching===!0||U.isBatchedMesh&&fe.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&fe.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&fe.instancing===!1||!U.isInstancedMesh&&fe.instancing===!0||U.isSkinnedMesh&&fe.skinning===!1||!U.isSkinnedMesh&&fe.skinning===!0||U.isInstancedMesh&&fe.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&fe.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&fe.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&fe.instancingMorph===!1&&U.morphTexture!==null||fe.envMap!==pe||N.fog===!0&&fe.fog!==J||fe.numClippingPlanes!==void 0&&(fe.numClippingPlanes!==be.numPlanes||fe.numIntersection!==be.numIntersection)||fe.vertexAlphas!==Se||fe.vertexTangents!==Re||fe.morphTargets!==xe||fe.morphNormals!==He||fe.morphColors!==Qe||fe.toneMapping!==Ke||fe.morphTargetsCount!==qe)&&(cr=!0):(cr=!0,fe.__version=N.version);let bt=fe.currentProgram;cr===!0&&(bt=_i(N,L,U));let wr=!1,vt=!1,na=!1;const et=bt.getUniforms(),Zt=fe.uniforms;if(ge.useProgram(bt.program)&&(wr=!0,vt=!0,na=!0),N.id!==F&&(F=N.id,vt=!0),wr||S!==_){et.setValue(A,"projectionMatrix",_.projectionMatrix),et.setValue(A,"viewMatrix",_.matrixWorldInverse);const St=et.map.cameraPosition;St!==void 0&&St.setValue(A,oe.setFromMatrixPosition(_.matrixWorld)),Ge.logarithmicDepthBuffer&&et.setValue(A,"logDepthBufFC",2/(Math.log(_.far+1)/Math.LN2)),(N.isMeshPhongMaterial||N.isMeshToonMaterial||N.isMeshLambertMaterial||N.isMeshBasicMaterial||N.isMeshStandardMaterial||N.isShaderMaterial)&&et.setValue(A,"isOrthographic",_.isOrthographicCamera===!0),S!==_&&(S=_,vt=!0,na=!0)}if(U.isSkinnedMesh){et.setOptional(A,U,"bindMatrix"),et.setOptional(A,U,"bindMatrixInverse");const St=U.skeleton;St&&(St.boneTexture===null&&St.computeBoneTexture(),et.setValue(A,"boneTexture",St.boneTexture,we))}U.isBatchedMesh&&(et.setOptional(A,U,"batchingTexture"),et.setValue(A,"batchingTexture",U._matricesTexture,we),et.setOptional(A,U,"batchingIdTexture"),et.setValue(A,"batchingIdTexture",U._indirectTexture,we),et.setOptional(A,U,"batchingColorTexture"),U._colorsTexture!==null&&et.setValue(A,"batchingColorTexture",U._colorsTexture,we));const sa=I.morphAttributes;if((sa.position!==void 0||sa.normal!==void 0||sa.color!==void 0)&&Ne.update(U,I,bt),(vt||fe.receiveShadow!==U.receiveShadow)&&(fe.receiveShadow=U.receiveShadow,et.setValue(A,"receiveShadow",U.receiveShadow)),N.isMeshGouraudMaterial&&N.envMap!==null&&(Zt.envMap.value=pe,Zt.flipEnvMap.value=pe.isCubeTexture&&pe.isRenderTargetTexture===!1?-1:1),N.isMeshStandardMaterial&&N.envMap===null&&L.environment!==null&&(Zt.envMapIntensity.value=L.environmentIntensity),vt&&(et.setValue(A,"toneMappingExposure",E.toneMappingExposure),fe.needsLights&&vo(Zt,na),J&&N.fog===!0&&ve.refreshFogUniforms(Zt,J),ve.refreshMaterialUniforms(Zt,N,Z,k,d.state.transmissionRenderTarget[_.id]),qi.upload(A,Dn(fe),Zt,we)),N.isShaderMaterial&&N.uniformsNeedUpdate===!0&&(qi.upload(A,Dn(fe),Zt,we),N.uniformsNeedUpdate=!1),N.isSpriteMaterial&&et.setValue(A,"center",U.center),et.setValue(A,"modelViewMatrix",U.modelViewMatrix),et.setValue(A,"normalMatrix",U.normalMatrix),et.setValue(A,"modelMatrix",U.matrixWorld),N.isShaderMaterial||N.isRawShaderMaterial){const St=N.uniformsGroups;for(let oa=0,Mo=St.length;oa<Mo;oa++){const On=St[oa];je.update(On,bt),je.bind(On,bt)}}return bt}function vo(_,L){_.ambientLightColor.needsUpdate=L,_.lightProbe.needsUpdate=L,_.directionalLights.needsUpdate=L,_.directionalLightShadows.needsUpdate=L,_.pointLights.needsUpdate=L,_.pointLightShadows.needsUpdate=L,_.spotLights.needsUpdate=L,_.spotLightShadows.needsUpdate=L,_.rectAreaLights.needsUpdate=L,_.hemisphereLights.needsUpdate=L}function xo(_){return _.isMeshLambertMaterial||_.isMeshToonMaterial||_.isMeshPhongMaterial||_.isMeshStandardMaterial||_.isShadowMaterial||_.isShaderMaterial&&_.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return R},this.getRenderTarget=function(){return w},this.setRenderTargetTextures=function(_,L,I){Te.get(_.texture).__webglTexture=L,Te.get(_.depthTexture).__webglTexture=I;const N=Te.get(_);N.__hasExternalTextures=!0,N.__autoAllocateDepthBuffer=I===void 0,N.__autoAllocateDepthBuffer||ze.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),N.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(_,L){const I=Te.get(_);I.__webglFramebuffer=L,I.__useDefaultFramebuffer=L===void 0},this.setRenderTarget=function(_,L=0,I=0){w=_,B=L,R=I;let N=!0,U=null,J=!1,se=!1;if(_){const de=Te.get(_);de.__useDefaultFramebuffer!==void 0?(ge.bindFramebuffer(A.FRAMEBUFFER,null),N=!1):de.__webglFramebuffer===void 0?we.setupRenderTarget(_):de.__hasExternalTextures&&we.rebindTextures(_,Te.get(_.texture).__webglTexture,Te.get(_.depthTexture).__webglTexture);const pe=_.texture;(pe.isData3DTexture||pe.isDataArrayTexture||pe.isCompressedArrayTexture)&&(se=!0);const Se=Te.get(_).__webglFramebuffer;_.isWebGLCubeRenderTarget?(Array.isArray(Se[L])?U=Se[L][I]:U=Se[L],J=!0):_.samples>0&&we.useMultisampledRTT(_)===!1?U=Te.get(_).__webglMultisampledFramebuffer:Array.isArray(Se)?U=Se[I]:U=Se,v.copy(_.viewport),P.copy(_.scissor),H=_.scissorTest}else v.copy(me).multiplyScalar(Z).floor(),P.copy(Me).multiplyScalar(Z).floor(),H=De;if(ge.bindFramebuffer(A.FRAMEBUFFER,U)&&N&&ge.drawBuffers(_,U),ge.viewport(v),ge.scissor(P),ge.setScissorTest(H),J){const de=Te.get(_.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+L,de.__webglTexture,I)}else if(se){const de=Te.get(_.texture),pe=L||0;A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,de.__webglTexture,I||0,pe)}F=-1},this.readRenderTargetPixels=function(_,L,I,N,U,J,se){if(!(_&&_.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let de=Te.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&se!==void 0&&(de=de[se]),de){ge.bindFramebuffer(A.FRAMEBUFFER,de);try{const pe=_.texture,Se=pe.format,Re=pe.type;if(!Ge.textureFormatReadable(Se)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Ge.textureTypeReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=_.width-N&&I>=0&&I<=_.height-U&&A.readPixels(L,I,N,U,ye.convert(Se),ye.convert(Re),J)}finally{const pe=w!==null?Te.get(w).__webglFramebuffer:null;ge.bindFramebuffer(A.FRAMEBUFFER,pe)}}},this.readRenderTargetPixelsAsync=async function(_,L,I,N,U,J,se){if(!(_&&_.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let de=Te.get(_).__webglFramebuffer;if(_.isWebGLCubeRenderTarget&&se!==void 0&&(de=de[se]),de){ge.bindFramebuffer(A.FRAMEBUFFER,de);try{const pe=_.texture,Se=pe.format,Re=pe.type;if(!Ge.textureFormatReadable(Se))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Ge.textureTypeReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(L>=0&&L<=_.width-N&&I>=0&&I<=_.height-U){const xe=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,xe),A.bufferData(A.PIXEL_PACK_BUFFER,J.byteLength,A.STREAM_READ),A.readPixels(L,I,N,U,ye.convert(Se),ye.convert(Re),0),A.flush();const He=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);await vl(A,He,4);try{A.bindBuffer(A.PIXEL_PACK_BUFFER,xe),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,J)}finally{A.deleteBuffer(xe),A.deleteSync(He)}return J}}finally{const pe=w!==null?Te.get(w).__webglFramebuffer:null;ge.bindFramebuffer(A.FRAMEBUFFER,pe)}}},this.copyFramebufferToTexture=function(_,L=null,I=0){_.isTexture!==!0&&(console.warn("WebGLRenderer: copyFramebufferToTexture function signature has changed."),L=arguments[0]||null,_=arguments[1]);const N=Math.pow(2,-I),U=Math.floor(_.image.width*N),J=Math.floor(_.image.height*N),se=L!==null?L.x:0,de=L!==null?L.y:0;we.setTexture2D(_,0),A.copyTexSubImage2D(A.TEXTURE_2D,I,0,0,se,de,U,J),ge.unbindTexture()},this.copyTextureToTexture=function(_,L,I=null,N=null,U=0){_.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture function signature has changed."),N=arguments[0]||null,_=arguments[1],L=arguments[2],U=arguments[3]||0,I=null);let J,se,de,pe,Se,Re;I!==null?(J=I.max.x-I.min.x,se=I.max.y-I.min.y,de=I.min.x,pe=I.min.y):(J=_.image.width,se=_.image.height,de=0,pe=0),N!==null?(Se=N.x,Re=N.y):(Se=0,Re=0);const xe=ye.convert(L.format),He=ye.convert(L.type);we.setTexture2D(L,0),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,L.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,L.unpackAlignment);const Qe=A.getParameter(A.UNPACK_ROW_LENGTH),Ke=A.getParameter(A.UNPACK_IMAGE_HEIGHT),rt=A.getParameter(A.UNPACK_SKIP_PIXELS),qe=A.getParameter(A.UNPACK_SKIP_ROWS),fe=A.getParameter(A.UNPACK_SKIP_IMAGES),ut=_.isCompressedTexture?_.mipmaps[U]:_.image;A.pixelStorei(A.UNPACK_ROW_LENGTH,ut.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,ut.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,de),A.pixelStorei(A.UNPACK_SKIP_ROWS,pe),_.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,U,Se,Re,J,se,xe,He,ut.data):_.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,U,Se,Re,ut.width,ut.height,xe,ut.data):A.texSubImage2D(A.TEXTURE_2D,U,Se,Re,J,se,xe,He,ut),A.pixelStorei(A.UNPACK_ROW_LENGTH,Qe),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Ke),A.pixelStorei(A.UNPACK_SKIP_PIXELS,rt),A.pixelStorei(A.UNPACK_SKIP_ROWS,qe),A.pixelStorei(A.UNPACK_SKIP_IMAGES,fe),U===0&&L.generateMipmaps&&A.generateMipmap(A.TEXTURE_2D),ge.unbindTexture()},this.copyTextureToTexture3D=function(_,L,I=null,N=null,U=0){_.isTexture!==!0&&(console.warn("WebGLRenderer: copyTextureToTexture3D function signature has changed."),I=arguments[0]||null,N=arguments[1]||null,_=arguments[2],L=arguments[3],U=arguments[4]||0);let J,se,de,pe,Se,Re,xe,He,Qe;const Ke=_.isCompressedTexture?_.mipmaps[U]:_.image;I!==null?(J=I.max.x-I.min.x,se=I.max.y-I.min.y,de=I.max.z-I.min.z,pe=I.min.x,Se=I.min.y,Re=I.min.z):(J=Ke.width,se=Ke.height,de=Ke.depth,pe=0,Se=0,Re=0),N!==null?(xe=N.x,He=N.y,Qe=N.z):(xe=0,He=0,Qe=0);const rt=ye.convert(L.format),qe=ye.convert(L.type);let fe;if(L.isData3DTexture)we.setTexture3D(L,0),fe=A.TEXTURE_3D;else if(L.isDataArrayTexture||L.isCompressedArrayTexture)we.setTexture2DArray(L,0),fe=A.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,L.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,L.unpackAlignment);const ut=A.getParameter(A.UNPACK_ROW_LENGTH),cr=A.getParameter(A.UNPACK_IMAGE_HEIGHT),bt=A.getParameter(A.UNPACK_SKIP_PIXELS),wr=A.getParameter(A.UNPACK_SKIP_ROWS),vt=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,Ke.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Ke.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,pe),A.pixelStorei(A.UNPACK_SKIP_ROWS,Se),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Re),_.isDataTexture||_.isData3DTexture?A.texSubImage3D(fe,U,xe,He,Qe,J,se,de,rt,qe,Ke.data):L.isCompressedArrayTexture?A.compressedTexSubImage3D(fe,U,xe,He,Qe,J,se,de,rt,Ke.data):A.texSubImage3D(fe,U,xe,He,Qe,J,se,de,rt,qe,Ke),A.pixelStorei(A.UNPACK_ROW_LENGTH,ut),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,cr),A.pixelStorei(A.UNPACK_SKIP_PIXELS,bt),A.pixelStorei(A.UNPACK_SKIP_ROWS,wr),A.pixelStorei(A.UNPACK_SKIP_IMAGES,vt),U===0&&L.generateMipmaps&&A.generateMipmap(fe),ge.unbindTexture()},this.initRenderTarget=function(_){Te.get(_).__webglFramebuffer===void 0&&we.setupRenderTarget(_)},this.initTexture=function(_){_.isCubeTexture?we.setTextureCube(_,0):_.isData3DTexture?we.setTexture3D(_,0):_.isDataArrayTexture||_.isCompressedArrayTexture?we.setTexture2DArray(_,0):we.setTexture2D(_,0),ge.unbindTexture()},this.resetState=function(){B=0,R=0,w=null,ge.reset(),Ue.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return jt}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=e===yn?"display-p3":"srgb",t.unpackColorSpace=Ve.workingColorSpace===ea?"display-p3":"srgb"}}class wn{constructor(e,t=25e-5){this.isFogExp2=!0,this.name="",this.color=new Oe(e),this.density=t}clone(){return new wn(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}}class Cp extends _t{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Ft,this.environmentIntensity=1,this.environmentRotation=new Ft,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class Pp extends _t{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Oe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Lp extends Pp{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Up{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=Is(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const t=Is();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}}function Is(){return(typeof performance>"u"?Date:performance).now()}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:_n}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=_n);const Ds={void:657935};function Ip(){const i=new Cp;return i.background=new Oe(Ds.void),i.fog=new wn(Ds.void,.035),i}function Dp(){const i=new Tt(70,window.innerWidth/window.innerHeight,.1,1e3);return i.position.set(0,1.7,5),i}function Np(){const i=new Rp({antialias:!0});return i.setSize(window.innerWidth,window.innerHeight),i.setPixelRatio(Math.min(window.devicePixelRatio,2)),document.getElementById("app").prepend(i.domElement),i}function Op(i,e){window.addEventListener("resize",()=>{i.aspect=window.innerWidth/window.innerHeight,i.updateProjectionMatrix(),e.setSize(window.innerWidth,window.innerHeight)})}function Fp(){const i=new mi(400,400,1,1),e=new Kt({uniforms:{uColor:{value:new Oe(61695)},uBackground:{value:new Oe(657935)},uCellSize:{value:2},uLineWidth:{value:.02},uFadeDistance:{value:80}},vertexShader:`
      varying vec3 vWorldPos;
      void main() {
        vec4 worldPos = modelMatrix * vec4(position, 1.0);
        vWorldPos = worldPos.xyz;
        gl_Position = projectionMatrix * viewMatrix * worldPos;
      }
    `,fragmentShader:`
      uniform vec3 uColor;
      uniform vec3 uBackground;
      uniform float uCellSize;
      uniform float uLineWidth;
      uniform float uFadeDistance;
      varying vec3 vWorldPos;

      float gridLine(vec2 coord, float cell, float width) {
        vec2 g = abs(fract(coord / cell - 0.5) - 0.5) / fwidth(coord / cell);
        float line = min(g.x, g.y);
        return 1.0 - smoothstep(0.0, width * 10.0, line);
      }

      void main() {
        float dist = length(vWorldPos.xz);
        float fade = 1.0 - smoothstep(0.0, uFadeDistance, dist);
        float line = gridLine(vWorldPos.xz, uCellSize, uLineWidth);
        vec3 color = mix(uBackground, uColor, line * fade);
        gl_FragColor = vec4(color, 1.0);
      }
    `}),t=new Nt(i,e);return t.rotation.x=-Math.PI/2,t.position.y=0,t}const Xr=new Ft(0,0,0,"YXZ"),qr=new O,Bp={type:"change"},zp={type:"lock"},Hp={type:"unlock"},Ns=Math.PI/2;class Vp extends br{constructor(e,t){super(),this.camera=e,this.domElement=t,this.isLocked=!1,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.pointerSpeed=1,this._onMouseMove=kp.bind(this),this._onPointerlockChange=Gp.bind(this),this._onPointerlockError=Wp.bind(this),this.connect()}connect(){this.domElement.ownerDocument.addEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.addEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.addEventListener("pointerlockerror",this._onPointerlockError)}disconnect(){this.domElement.ownerDocument.removeEventListener("mousemove",this._onMouseMove),this.domElement.ownerDocument.removeEventListener("pointerlockchange",this._onPointerlockChange),this.domElement.ownerDocument.removeEventListener("pointerlockerror",this._onPointerlockError)}dispose(){this.disconnect()}getObject(){return this.camera}getDirection(e){return e.set(0,0,-1).applyQuaternion(this.camera.quaternion)}moveForward(e){const t=this.camera;qr.setFromMatrixColumn(t.matrix,0),qr.crossVectors(t.up,qr),t.position.addScaledVector(qr,e)}moveRight(e){const t=this.camera;qr.setFromMatrixColumn(t.matrix,0),t.position.addScaledVector(qr,e)}lock(){this.domElement.requestPointerLock()}unlock(){this.domElement.ownerDocument.exitPointerLock()}}function kp(i){if(this.isLocked===!1)return;const e=i.movementX||i.mozMovementX||i.webkitMovementX||0,t=i.movementY||i.mozMovementY||i.webkitMovementY||0,r=this.camera;Xr.setFromQuaternion(r.quaternion),Xr.y-=e*.002*this.pointerSpeed,Xr.x-=t*.002*this.pointerSpeed,Xr.x=Math.max(Ns-this.maxPolarAngle,Math.min(Ns-this.minPolarAngle,Xr.x)),r.quaternion.setFromEuler(Xr),this.dispatchEvent(Bp)}function Gp(){this.domElement.ownerDocument.pointerLockElement===this.domElement?(this.dispatchEvent(zp),this.isLocked=!0):(this.dispatchEvent(Hp),this.isLocked=!1)}function Wp(){console.error("THREE.PointerLockControls: Unable to use Pointer Lock API")}const Xp=6;function qp(i,e,t){const r=new Vp(i,e),a={forward:!1,back:!1,left:!1,right:!1};t.addEventListener("click",()=>r.lock()),r.addEventListener("lock",()=>t.classList.add("hidden")),r.addEventListener("unlock",()=>t.classList.remove("hidden")),document.addEventListener("keydown",s=>n(s.code,!0)),document.addEventListener("keyup",s=>n(s.code,!1));function n(s,l){switch(s){case"KeyW":case"ArrowUp":a.forward=l;break;case"KeyS":case"ArrowDown":a.back=l;break;case"KeyA":case"ArrowLeft":a.left=l;break;case"KeyD":case"ArrowRight":a.right=l;break}}function o(s){if(!r.isLocked)return;const l=Xp*s;a.forward&&r.moveForward(l),a.back&&r.moveForward(-l),a.right&&r.moveRight(l),a.left&&r.moveRight(-l)}return{controls:r,update:o}}const ia=Ip(),Rn=Dp(),Cn=Np();Op(Rn,Cn);const jp=Fp();ia.add(jp);ia.add(new Lp(2241348,.6));const Yp=document.getElementById("overlay"),{controls:Kp,update:Zp}=qp(Rn,Cn.domElement,Yp);ia.add(Kp.getObject());const Jp=new Up;function go(){requestAnimationFrame(go);const i=Jp.getDelta();Zp(i),Cn.render(ia,Rn)}go();
