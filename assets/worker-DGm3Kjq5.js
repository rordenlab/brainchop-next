var eo={},to;function ja(){if(to)return eo;to=1;var $e=class extends Error{code;log;constructor(e,t,n){super(t),this.name="BrainchopError",this.code=e,this.log=n}};function on(e){return e==="16chan18cls"?"mindmap-fast":e}var Fr={mindgrab:16,"mindmap-fast":16,"16chan18cls":16,mindmap:24,mindsnap:24},Vn=128*1024*1024;function no(e="mindmap-fast"){const t=Fr[e]??16;return 256*256*(t/2)*80*4}function Hn(e){return 256*256*256*Fr[e]*2}Hn("16chan18cls");var an=e=>`${Math.round(e/(1024*1024))} MiB`,Br=/SwiftShader|llvmpipe|lavapipe|softpipe|Software|Basic Render/i;async function Ur(e="mindmap-fast"){if(typeof navigator>"u"||!navigator.gpu)return{supported:!1,reasons:["navigator.gpu is undefined: either this browser has no WebGPU, or the page is not a secure context. about:blank and file:// are NOT secure contexts and look exactly like a browser without WebGPU; serve over https or localhost."]};const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)return{supported:!1,reasons:["requestAdapter returned null"]};const n=[],r=t.features.has("shader-f16"),s=t.features.has("subgroups"),{maxBufferSize:o,maxStorageBufferBindingSize:i}=t.limits,a=Vn;i<a&&n.push(`maxStorageBufferBindingSize is ${an(i)}, but WebGPU V4 requires at least ${an(a)}`),o<a&&n.push(`maxBufferSize is ${an(o)}, but WebGPU V4 requires at least ${an(a)}`);const f=Math.min(o,i)<no(e),l=t.info,m=!!(l?.isFallbackAdapter??t.isFallbackAdapter)||Br.test(`${l?.vendor} ${l?.architecture} ${l?.description}`);return{supported:n.length===0,reasons:n,maxBufferSize:o,maxStorageBufferBindingSize:i,hasShaderF16:r,hasSubgroups:s,lowMemoryRequired:f,software:m}}async function Lr(e="mindmap-fast"){if(typeof navigator>"u"||!navigator.gpu)throw new $e("no-webgpu","navigator.gpu is undefined: either this browser has no WebGPU, or the page is not a secure context (https or localhost)");const t=await navigator.gpu.requestAdapter({powerPreference:"high-performance"});if(!t)throw new $e("no-adapter","requestAdapter returned null");const{maxBufferSize:n,maxStorageBufferBindingSize:r}=t.limits,s=Vn;if(r<s||n<s)throw new $e("device-too-small",`this device allows ${an(r)} per storage binding and ${an(n)} per buffer, but WebGPU V4 needs at least ${an(s)}`);const o=[];t.features.has("shader-f16")&&o.push("shader-f16"),t.features.has("subgroups")&&o.push("subgroups");const i=["maxBufferSize","maxStorageBufferBindingSize","maxStorageBuffersPerShaderStage","maxUniformBufferBindingSize","maxComputeInvocationsPerWorkgroup","maxComputeWorkgroupSizeX","maxComputeWorkgroupSizeY","maxComputeWorkgroupSizeZ","maxComputeWorkgroupStorageSize","maxComputeWorkgroupsPerDimension"],a={},f=t.limits;for(const d of i){const c=f[d];typeof c=="number"&&Number.isFinite(c)&&(a[d]=c)}const l=await t.requestDevice({requiredFeatures:o,requiredLimits:a}),m=l;return m.__adapterInfo=t.info??null,m.__isLost=!1,l.lost&&typeof l.lost.then=="function"&&l.lost.then(()=>{m.__isLost=!0}),l}function Ir(e){return Hn(e)*2}Ir("16chan18cls");var Dt=256,Wr=Dt*Dt*Dt*4*2,An=2048,qr=e=>`${Math.round(e/(1024*1024))} MiB`;function Er(){const e=typeof OffscreenCanvas<"u"&&typeof document>"u"?new OffscreenCanvas(1,1):typeof document<"u"?document.createElement("canvas"):null;return e?e.getContext("webgl2",{alpha:!1,depth:!1,stencil:!1,antialias:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance"}):null}function ro(e="16chan18cls"){const t=Er();if(!t)return{supported:!1,reasons:["a webgl2 context could not be created; this browser is either too old or has WebGL disabled or blocklisted"]};const n=[],r=t.getExtension("WEBGL_debug_renderer_info"),s=r?t.getParameter(r.UNMASKED_RENDERER_WEBGL):t.getParameter(t.RENDERER),o=Br.test(s)||(r?!1:void 0),i=t.getExtension("EXT_color_buffer_float");i||n.push("this device lacks EXT_color_buffer_float, which the kernels require in order to render into float textures");const a=t.getParameter(t.MAX_3D_TEXTURE_SIZE),f=t.getParameter(t.MAX_DRAW_BUFFERS),l=t.getParameter(t.MAX_COLOR_ATTACHMENTS),m=t.getParameter(t.MAX_TEXTURE_SIZE),d=t.getParameter(t.MAX_VIEWPORT_DIMS);a<Dt&&n.push(`MAX_3D_TEXTURE_SIZE is ${a}, but the model needs ${Dt}`);const c=Hn(e)/Wr;(f<c||l<c)&&n.push(`this device allows ${f} draw buffers and ${l} colour attachments, but ${e} writes ${c} at once`),(m<An||d[0]<An||d[1]<An)&&n.push(`MAX_TEXTURE_SIZE is ${m} and MAX_VIEWPORT_DIMS ${d[0]}x${d[1]}, but the label texture is ${An}x${An}`);let u;if(i&&a>=Dt){for(;t.getError()!==t.NO_ERROR;);const p=t.createTexture();t.bindTexture(t.TEXTURE_3D,p),t.texStorage3D(t.TEXTURE_3D,1,t.RGBA16F,Dt,Dt,Dt),u=t.getError()===t.NO_ERROR&&!t.isContextLost(),t.deleteTexture(p),u||n.push(`this device could not allocate even one ${qr(Wr)} activation plane; a ${e} run needs ${qr(Ir(e))} of them`)}return t.getExtension("WEBGL_lose_context")?.loseContext(),{supported:n.length===0,reasons:n,renderer:s,software:o,max3dTextureSize:a,maxDrawBuffers:f,maxColorAttachments:l,maxTextureSize:m,allocates:u}}function so(e){e.getExtension("WEBGL_lose_context")?.loseContext()}function Xn(){const e=Er();if(!e)throw new $e("no-webgpu","a webgl2 context could not be created; this browser is either too old or has WebGL disabled or blocklisted");if(!e.getExtension("EXT_color_buffer_float"))throw new $e("no-f16","this device lacks EXT_color_buffer_float, which the segmentation kernels require in order to render into float textures");const t=e.getParameter(e.MAX_3D_TEXTURE_SIZE);if(t<Dt)throw new $e("device-too-small",`this device allows 3D textures up to ${t}, but the model needs ${Dt}`);return e}var Tr=[31,139];function oo(e){return e.length>=2&&e[0]===Tr[0]&&e[1]===Tr[1]}async function Rr(e,t){const n=new Uint8Array(e),r=new Blob([n]).stream().pipeThrough(t);return new Uint8Array(await new Response(r).arrayBuffer())}async function ao(e){if(typeof DecompressionStream>"u")throw new $e("bad-input","the input is gzipped but this environment has no DecompressionStream; decompress it before calling, or pass an uncompressed NIfTI");return Rr(e,new DecompressionStream("gzip"))}async function io(e){if(typeof CompressionStream>"u")throw new $e("bad-input","gzip output was requested but this environment has no CompressionStream");return Rr(e,new CompressionStream("gzip"))}var In={mindgrab:()=>new URL(""+new URL("mindgrab-CH7iqY8a.bin",import.meta.url).href,import.meta.url).href,"mindmap-fast":()=>new URL(""+new URL("mindmap-fast-BCu5io7E.bin",import.meta.url).href,import.meta.url).href,"16chan18cls":()=>new URL(""+new URL("mindmap-fast-BCu5io7E.bin",import.meta.url).href,import.meta.url).href,mindmap:()=>new URL(""+new URL("mindmap-CKWMhBiE.bin",import.meta.url).href,import.meta.url).href,mindsnap:()=>new URL(""+new URL("mindsnap-BOzPdqmr.bin",import.meta.url).href,import.meta.url).href},Nr={webgl2:{mindgrab:()=>import("./brainchop-mindgrab-gl-p2_j2c4g.js"),"mindmap-fast":()=>import("./brainchop-mindmap-fast-gl-drbGLFss.js"),"16chan18cls":()=>import("./brainchop-mindmap-fast-gl-drbGLFss.js"),mindmap:()=>import("./brainchop-mindmap-gl-Duo6PiIi.js"),mindsnap:()=>import("./brainchop-mindsnap-gl-Tw-jY0Yz.js")},cpu:{mindgrab:()=>import("./brainchop-mindgrab-BZUtL7Tz.js"),"mindmap-fast":()=>import("./brainchop-mindmap-fast-DKUBO7bL.js"),"16chan18cls":()=>import("./brainchop-mindmap-fast-DKUBO7bL.js"),mindmap:()=>import("./brainchop-mindmap-Yis27IXm.js"),mindsnap:()=>import("./brainchop-mindsnap-DHS-sa_P.js")}},lo=12e4,co=12e4,Or=9e5,uo={webgl2:"-gl",cpu:""},hn=new Map;function Wn(e,t){const n=t.endsWith("/")?t:`${t}/`,r=typeof location<"u"?location.href:"file:///",s=new URL(`${n}${e.replace("./","")}`,r);if(typeof location<"u"){if(location.origin==="null")throw new $e("unsupported-option","assetPath cannot be used from an opaque origin (file:// or a sandboxed iframe); serve the page over http(s)");if(s.origin!==location.origin)throw new $e("unsupported-option",`assetPath must be same-origin; ${s.origin} is not ${location.origin}`)}return s.href}function fo(e,t,n){const r=on(t),s=n?Wn(`brainchop-${r}${uo[e]}.js`,n):`${e}/${r}`;let o=hn.get(s);if(!o){const i=Nr[e][t]??Nr[e][r];o=(n?import(s):i()).then(a=>a.default),hn.set(s,o),o.catch(()=>{hn.get(s)===o&&hn.delete(s)})}return[s,o]}async function mo(e){const t=[],n=_=>{t.push(_),e.onLog?.(_)};let r;const s=new Promise(_=>{r=_});let o;const i={noInitialRun:!0,thisProgram:`brainchop-${on(e.model)}`,print:n,printErr:n,onExit:_=>r(_)};e.backend==="webgl2"&&(i.preinitializedWebGLContext=e.glContext);const a=e.timeoutMs??(e.backend==="cpu"?Or:lo),f=Math.min(a,co),[l,m]=fo(e.backend,e.model,e.assetPath);let d=!1;const c=await Promise.race([m.then(_=>_(i)),new Promise((_,z)=>{o=setTimeout(()=>{d=!0,z(new $e("initialization-failed",`the ${e.model} module did not finish initialising within ${f} ms`,t))},f)})]).finally(()=>{clearTimeout(o),d&&hn.get(l)===m&&hn.delete(l)});if(e.backend==="webgl2"){if(!c.specialHTMLTargets)throw new $e("inference-failed","this WebGL2 module was built without specialHTMLTargets exported; rebuild it with the flags in src/Makefile",t);c.specialHTMLTargets["#brainchop-webgl2"]=e.glContext.canvas}c.FS.writeFile("/in.nii",e.input);const u=performance.now();try{c.callMain([...e.args,"-backend",e.backend,"-o","/out.nii","/in.nii"])}catch(_){_&&typeof _.status=="number"?r(_.status):(n(`threw: ${_ instanceof Error?_.stack??_.message:String(_)}`),r(-1))}const p=e.backend==="webgl2"?await s:await Promise.race([s,new Promise((_,z)=>{o=setTimeout(()=>z(new $e("inference-failed",`the ${e.model} module did not finish within ${a} ms; `+(e.backend==="cpu"?"this machine may simply be slower than the limit allows":"the GPU device may have been lost"),t)),a)})]).finally(()=>clearTimeout(o)),y=performance.now()-u;if(e.backend==="webgl2"&&e.glContext?.isContextLost())throw new $e("inference-failed",`the WebGL2 context was lost while running ${e.model}; the GPU or its driver reset. Any output from this run is meaningless.`,t);if(p!==0)throw new $e("inference-failed",`the ${e.model} module exited with status ${p}`,t);const $=e.primaryOutput??"/out.nii";if(!c.FS.analyzePath($).exists)throw new $e("inference-failed",`the ${e.model} module exited cleanly but wrote no output`,t);const h=new Map;for(const _ of e.extraOutputs??[])c.FS.analyzePath(_).exists&&h.set(_,c.FS.readFile(_));return{image:c.FS.readFile($),extras:h,elapsedMs:y}}var po={R:[0,255],G:[0,255],B:[0,255],labels:["background","brain mask"]},Gr={R:[0,245,205,120,196,220,230,0,122,236,12,204,42,119,220,103,255,165],G:[0,245,62,18,58,248,148,118,186,13,48,182,204,159,216,255,165,42],B:[0,245,78,134,250,164,34,14,220,176,255,142,164,176,20,255,0,42],labels:["Unknown","Cerebral-White-Matter","Cerebral-Cortex","Lateral-Ventricle","Inferior-Lateral-Ventricle","Cerebellum-White-Matter","Cerebellum-Cortex","Thalamus","Caudate","Putamen","Pallidum","3rd-Ventricle","4th-Ventricle","Brain-Stem","Hippocampus","Amygdala","Accumbens-area","VentralDC"]},go={R:[0,245,205,120,196,220,230,0,122,236,12,204,42,119,220,103,255,165],G:[0,245,62,18,58,248,148,118,186,13,48,182,204,159,216,255,165,42],B:[0,245,78,134,250,164,34,14,220,176,255,142,164,176,20,255,0,42],labels:["Unknown","Cerebral-White-Matter","Cerebral-Cortex","Lateral-Ventricle","Inferior-Lateral-Ventricle","Cerebellum-White-Matter","Cerebellum-Cortex","Thalamus","Caudate","Putamen","Pallidum","3rd-Ventricle","4th-Ventricle","Brain-Stem","Hippocampus","Amygdala","Accumbens-area","VentralDC"]},_o={R:[0,25,125,100,220,220,180,220,180,140,20,35,225,200,160,20,60,220,20,220,120,220,220,60,160,80,75,20,20,140,80,100,70,150,255,25,125,100,220,220,180,220,180,140,20,35,225,200,160,20,60,220,20,220,120,220,220,60,160,80,75,20,20,140,80,100,70,150,255,0,0,122,122,236,236,12,13,220,220,103,103,255,255,165,165,245,245,120,196,120,196,204,42,60,119,220,220,230,230,0,0,0,0,0],G:[0,100,100,25,20,20,220,60,40,20,30,75,140,35,100,220,220,180,100,60,100,20,180,20,140,20,50,220,180,220,160,0,70,150,192,100,100,25,20,20,220,60,40,20,30,75,140,35,100,220,220,180,100,60,100,20,180,20,140,20,50,220,180,220,160,0,70,150,192,118,118,186,186,13,13,48,48,216,216,255,255,165,165,42,42,245,245,18,58,18,58,182,204,60,159,248,248,148,148,0,0,0,0,0],B:[0,40,160,0,100,10,140,220,120,140,140,50,140,75,50,60,60,140,50,20,60,20,220,220,180,140,125,160,140,220,20,100,70,200,32,40,160,0,100,10,140,220,120,140,140,50,140,75,50,60,60,140,50,20,60,20,220,220,180,140,125,160,140,220,20,100,70,200,32,14,14,220,220,176,176,255,255,20,20,255,255,0,0,42,42,245,245,134,250,134,250,142,164,60,176,164,164,34,34,64,112,160,208,255],labels:["BG","ctx-lh-bankssts","ctx-lh-caudalanteriorcingulate","ctx-lh-caudalmiddlefrontal","ctx-lh-cuneus","ctx-lh-entorhinal","ctx-lh-fusiform","ctx-lh-inferiorparietal","ctx-lh-inferiortemporal","ctx-lh-isthmuscingulate","ctx-lh-lateraloccipital","ctx-lh-lateralorbitofrontal","ctx-lh-lingual","ctx-lh-medialorbitofrontal","ctx-lh-middletemporal","ctx-lh-parahippocampal","ctx-lh-paracentral","ctx-lh-parsopercularis","ctx-lh-parsorbitalis","ctx-lh-parstriangularis","ctx-lh-pericalcarine","ctx-lh-postcentral","ctx-lh-posteriorcingulate","ctx-lh-precentral","ctx-lh-precuneus","ctx-lh-rostralanteriorcingulate","ctx-lh-rostralmiddlefrontal","ctx-lh-superiorfrontal","ctx-lh-superiorparietal","ctx-lh-superiortemporal","ctx-lh-supramarginal","ctx-lh-frontalpole","ctx-lh-temporalpole","ctx-lh-transversetemporal","ctx-lh-insula","ctx-rh-bankssts","ctx-rh-caudalanteriorcingulate","ctx-rh-caudalmiddlefrontal","ctx-rh-cuneus","ctx-rh-entorhinal","ctx-rh-fusiform","ctx-rh-inferiorparietal","ctx-rh-inferiortemporal","ctx-rh-isthmuscingulate","ctx-rh-lateraloccipital","ctx-rh-lateralorbitofrontal","ctx-rh-lingual","ctx-rh-medialorbitofrontal","ctx-rh-middletemporal","ctx-rh-parahippocampal","ctx-rh-paracentral","ctx-rh-parsopercularis","ctx-rh-parsorbitalis","ctx-rh-parstriangularis","ctx-rh-pericalcarine","ctx-rh-postcentral","ctx-rh-posteriorcingulate","ctx-rh-precentral","ctx-rh-precuneus","ctx-rh-rostralanteriorcingulate","ctx-rh-rostralmiddlefrontal","ctx-rh-superiorfrontal","ctx-rh-superiorparietal","ctx-rh-superiortemporal","ctx-rh-supramarginal","ctx-rh-frontalpole","ctx-rh-temporalpole","ctx-rh-transversetemporal","ctx-rh-insula","Left-Thalamus-Proper*","Right-Thalamus-Proper*","Left-Caudate","Right-Caudate","Left-Putamen","Right-Putamen","Left-Pallidum","Right-Pallidum","Left-Hippocampus","Right-Hippocampus","Left-Amygdala","Right-Amygdala","Left-Accumbens-area","Right-Accumbens-area","Left-VentralDC","Right-VentralDC","Left-Cerebral-White-Matter","Right-Cerebral-White-Matter","Left-Lateral-Ventricle","Left-Inf-Lat-Vent","Right-Lateral-Ventricle","Right-Inf-Lat-Vent","3rd-Ventricle","4th-Ventricle","CSF","Brain-Stem","Left-Cerebellum-White-Matter","Right-Cerebellum-White-Matter","Left-Cerebellum-Cortex","Right-Cerebellum-Cortex","CC_Posterior","CC_Mid_Posterior","CC_Central","CC_Mid_Anterior","CC_Anterior"]},Cn={mindgrab:po,"mindmap-fast":Gr,"16chan18cls":Gr,mindmap:go,mindsnap:_o},ln=348,en=352,Yn=0,Zn=1002,Le={UINT8:2,INT16:4,INT32:8,FLOAT32:16,FLOAT64:64,INT8:256,UINT16:512,UINT32:768,INT64:1024,UINT64:1280};function Dr(e){switch(e){case Le.UINT8:case Le.INT8:return 1;case Le.INT16:case Le.UINT16:return 2;case Le.INT32:case Le.UINT32:case Le.FLOAT32:return 4;case Le.FLOAT64:case Le.INT64:case Le.UINT64:return 8;default:return 0}}function qn(e){if(!e||e.length<16)return!1;for(let n=0;n<16;n++)if(!Number.isFinite(e[n]))return!1;const t=e[0]*(e[5]*e[10]-e[6]*e[9])-e[1]*(e[4]*e[10]-e[6]*e[8])+e[2]*(e[4]*e[9]-e[5]*e[8]);return Number.isFinite(t)&&Math.abs(t)>=1e-6}function ho(e,t,n,r,s,o,i,a,f,l){let m=e,d=t,c=n,u=1-(m*m+d*d+c*c);if(u<1e-7){const h=Math.sqrt(m*m+d*d+c*c);if(h>0){const _=1/h;m*=_,d*=_,c*=_}u=0}else u=Math.sqrt(u);const p=i>0?i:1,y=a>0?a:1;let $=f>0?f:1;return l<0&&($=-$),[(u*u+m*m-d*d-c*c)*p,2*(m*d-u*c)*y,2*(m*c+u*d)*$,r,2*(m*d+u*c)*p,(u*u+d*d-m*m-c*c)*y,2*(d*c-u*m)*$,s,2*(m*c-u*d)*p,2*(d*c+u*m)*y,(u*u+c*c-d*d-m*m)*$,o,0,0,0,1]}function Kn(e){let t=0;for(let n=0;n<3;n++){const r=Math.abs(e[n])+Math.abs(e[3+n])+Math.abs(e[6+n]);r>t&&(t=r)}return t}function jn(e){let t=0;for(let n=0;n<3;n++){const r=n*3,s=Math.abs(e[r])+Math.abs(e[r+1])+Math.abs(e[r+2]);s>t&&(t=s)}return t}function wo(e){const t=e[4]*e[8]-e[5]*e[7],n=-(e[3]*e[8]-e[5]*e[6]),r=e[3]*e[7]-e[4]*e[6],s=e[0]*t+e[1]*n+e[2]*r;if(!Number.isFinite(s)||Math.abs(s)<1e-18)return null;const o=1/s;return[t*o,-(e[1]*e[8]-e[2]*e[7])*o,(e[1]*e[5]-e[2]*e[4])*o,n*o,(e[0]*e[8]-e[2]*e[6])*o,-(e[0]*e[5]-e[2]*e[3])*o,r*o,-(e[0]*e[7]-e[1]*e[6])*o,(e[0]*e[4]-e[1]*e[3])*o]}function bo(e){let t=e.slice(),n=Kn(t);if(n===0)return t;let r=jn(t);for(let s=0;s<64;s++){const o=wo(t);if(!o)break;const i=Kn(o),a=jn(o),f=Math.sqrt(Math.sqrt(i*a/(n*r))),l=.5*f,m=.5/f;let d=0;const c=new Array(9);for(let u=0;u<3;u++)for(let p=0;p<3;p++){const y=u*3+p,$=l*t[y]+m*o[p*3+u];d+=Math.abs($-t[y]),c[y]=$}if(t=c,d<1e-12)break;n=Kn(t),r=jn(t)}return t}function yo(e){const t=e[3],n=e[7],r=e[11];let s=e[0],o=e[1],i=e[2],a=e[4],f=e[5],l=e[6],m=e[8],d=e[9],c=e[10],u=Math.sqrt(s*s+a*a+m*m),p=Math.sqrt(o*o+f*f+d*d),y=Math.sqrt(i*i+l*l+c*c);u===0&&(s=1,a=0,m=0,u=1),p===0&&(f=1,o=0,d=0,p=1),y===0&&(c=1,i=0,l=0,y=1);const $=u,h=p,_=y;s/=u,a/=u,m/=u,o/=p,f/=p,d/=p,i/=y,l/=y,c/=y;const z=bo([s,o,i,a,f,l,m,d,c]);s=z[0],o=z[1],i=z[2],a=z[3],f=z[4],l=z[5],m=z[6],d=z[7],c=z[8];const b=s*f*c-s*d*l-a*o*c+a*d*i+m*o*l-m*f*i;let g=1;b<=0&&(g=-1,i=-i,l=-l,c=-c);let v=s+f+c+1,M,w,x;if(v>.5)v=.5*Math.sqrt(v),M=.25*(d-l)/v,w=.25*(i-m)/v,x=.25*(a-o)/v;else{const P=1+s-(f+c),k=1+f-(s+c),S=1+c-(s+f);P>1?(M=.5*Math.sqrt(P),w=.25*(o+a)/M,x=.25*(i+m)/M,v=.25*(d-l)/M):k>1?(w=.5*Math.sqrt(k),M=.25*(o+a)/w,x=.25*(l+d)/w,v=.25*(i-m)/w):(x=.5*Math.sqrt(S),M=.25*(i+m)/x,w=.25*(l+d)/x,v=.25*(a-o)/x),v<0&&(M=-M,w=-w,x=-x)}return{quaternB:M,quaternC:w,quaternD:x,qoffsetX:t,qoffsetY:n,qoffsetZ:r,dx:$,dy:h,dz:_,qfac:g}}function vo(e,t,n,r,s){const o=Dr(r);if(!o)throw new Error(`Unsupported NIfTI-1 datatype code: ${r}`);const i=n*o;if(t+i>e.byteLength)throw new Error(`NIfTI-1 data truncated: need ${t+i} bytes, got ${e.byteLength}`);if(s){const f=(e.byteOffset+t&o-1)===0,l=f?e.buffer:e.slice(t,t+i).buffer,m=f?e.byteOffset+t:0;switch(r){case Le.UINT8:return new Uint8Array(l,m,n);case Le.INT8:return new Int8Array(l,m,n);case Le.INT16:return new Int16Array(l,m,n);case Le.UINT16:return new Uint16Array(l,m,n);case Le.INT32:return new Int32Array(l,m,n);case Le.UINT32:return new Uint32Array(l,m,n);case Le.FLOAT32:return new Float32Array(l,m,n);case Le.FLOAT64:return new Float64Array(l,m,n);case Le.INT64:return new BigInt64Array(l,m,n);case Le.UINT64:return new BigUint64Array(l,m,n)}}const a=new DataView(e.buffer,e.byteOffset+t,i);switch(r){case Le.UINT8:return e.subarray(t,t+n);case Le.INT8:return new Int8Array(e.slice(t,t+n).buffer);case Le.INT16:{const f=new Int16Array(n);for(let l=0;l<n;l++)f[l]=a.getInt16(l*2,!1);return f}case Le.UINT16:{const f=new Uint16Array(n);for(let l=0;l<n;l++)f[l]=a.getUint16(l*2,!1);return f}case Le.INT32:{const f=new Int32Array(n);for(let l=0;l<n;l++)f[l]=a.getInt32(l*4,!1);return f}case Le.UINT32:{const f=new Uint32Array(n);for(let l=0;l<n;l++)f[l]=a.getUint32(l*4,!1);return f}case Le.FLOAT32:{const f=new Float32Array(n);for(let l=0;l<n;l++)f[l]=a.getFloat32(l*4,!1);return f}case Le.FLOAT64:{const f=new Float64Array(n);for(let l=0;l<n;l++)f[l]=a.getFloat64(l*8,!1);return f}case Le.INT64:{const f=new BigInt64Array(n);for(let l=0;l<n;l++)f[l]=a.getBigInt64(l*8,!1);return f}case Le.UINT64:{const f=new BigUint64Array(n);for(let l=0;l<n;l++)f[l]=a.getBigUint64(l*8,!1);return f}default:throw new Error(`Unsupported NIfTI-1 datatype code: ${r}`)}}function Vr(e){const t=e instanceof Uint8Array?e:new Uint8Array(e);if(t.byteLength<en)throw new Error(`Invalid NIfTI-1 input: expected at least ${en} bytes, got ${t.byteLength}`);const n=new DataView(t.buffer,t.byteOffset,t.byteLength),r=n.getInt32(0,!0),s=n.getInt32(0,!1);let o;if(r===ln)o=!0;else if(s===ln)o=!1;else throw new Error(`Invalid NIfTI-1 header: sizeof_hdr is ${r} (expected ${ln})`);const i=String.fromCharCode(t[344],t[345],t[346],t[347]);if(i!=="n+1\0")throw new Error(`Unsupported NIfTI-1 magic '${i.replace(/\0/g,"\\0")}'; expected single-file 'n+1\\0'`);const a=new Array(8);for(let N=0;N<8;N++)a[N]=n.getInt16(40+N*2,o);const f=a[1],l=a[2],m=a[3],d=a[0]>=4&&a[4]>0?a[4]:1;if(f<1||l<1||m<1||d!==1)throw new Error(`NIfTI-1 input must be a scalar 3D image; got dims=[${a.slice(0,5).join(", ")}]`);const c=n.getInt16(68,o),u=n.getInt16(70,o),p=n.getInt16(72,o),y=new Array(8);for(let N=0;N<8;N++)y[N]=n.getFloat32(76+N*4,o);const $=Math.floor(n.getFloat32(108,o)),h=$>=en?$:en,_=n.getFloat32(112,o),z=n.getFloat32(116,o),b=n.getFloat32(124,o),g=n.getFloat32(128,o),v=n.getInt16(252,o),M=n.getInt16(254,o),w=n.getFloat32(256,o),x=n.getFloat32(260,o),P=n.getFloat32(264,o),k=n.getFloat32(268,o),S=n.getFloat32(272,o),F=n.getFloat32(276,o),L=[n.getFloat32(280,o),n.getFloat32(284,o),n.getFloat32(288,o),n.getFloat32(292,o)],K=[n.getFloat32(296,o),n.getFloat32(300,o),n.getFloat32(304,o),n.getFloat32(308,o)],W=[n.getFloat32(312,o),n.getFloat32(316,o),n.getFloat32(320,o),n.getFloat32(324,o)],C=Math.abs(y[1])||1,R=Math.abs(y[2])||1,A=Math.abs(y[3])||1,U=[C,0,0,0,0,R,0,0,0,0,A,0,0,0,0,1],E=y[0]<0?-1:1,B=v>0?ho(w,x,P,k,S,F,C,R,A,E):U.slice(),O=M>0?[...L,...K,...W,0,0,0,1]:B.slice(),D=v>M?B:O,J=v>M?O:B,Y=qn(D)?D.slice():J.slice(),V=f*l*m,re=vo(t,h,V,u,o),X=new Uint8Array(en);return X.set(t.subarray(0,ln),0),{header:{dims:a,pixDims:y,datatypeCode:u,numBitsPerVoxel:p,voxOffset:h,sclSlope:_,sclInter:z,calMin:g,calMax:b,intentCode:c,qformCode:v,sformCode:M,quaternB:w,quaternC:x,quaternD:P,qoffsetX:k,qoffsetY:S,qoffsetZ:F,qtoXyz:B,stoXyz:O,affine:Y,littleEndian:o,rawHeader:X},data:re}}function xo(e,t,n){const r=e.length,s=new Float32Array(r),o=Number.isFinite(t)&&t!==0?t:1,i=Number.isFinite(n)?n:0,a=e instanceof BigInt64Array||e instanceof BigUint64Array;let f=0;for(let l=0;l<r;l++){const d=(a?Number(e[l]):e[l])*o+i;Number.isFinite(d)?(s[l]=d,f++):s[l]=0}if(f===0)throw new Error("Input volume has no finite voxels");return s}function wn(e,t,n){return e>=t?e<=n?Math.round(e):n:t}function $o(e,t){const n=e.length;switch(t){case Le.UINT8:{const r=new Uint8Array(n);for(let s=0;s<n;s++)r[s]=wn(e[s],0,255);return r}case Le.INT8:{const r=new Int8Array(n);for(let s=0;s<n;s++)r[s]=wn(e[s],-128,127);return r}case Le.INT16:{const r=new Int16Array(n);for(let s=0;s<n;s++)r[s]=wn(e[s],-32768,32767);return r}case Le.UINT16:{const r=new Uint16Array(n);for(let s=0;s<n;s++)r[s]=wn(e[s],0,65535);return r}case Le.INT32:{const r=new Int32Array(n);for(let s=0;s<n;s++)r[s]=wn(e[s],-2147483648,2147483647);return r}case Le.UINT32:{const r=new Uint32Array(n);for(let s=0;s<n;s++)r[s]=wn(e[s],0,4294967295);return r}case Le.FLOAT32:return e;case Le.FLOAT64:{const r=new Float64Array(n);for(let s=0;s<n;s++)r[s]=e[s];return r}case Le.INT64:{const r=new BigInt64Array(n);for(let s=0;s<n;s++){const o=e[s];r[s]=o>=-9223372036854776e3?o<9223372036854776e3?BigInt(Math.round(o)):9223372036854775807n:-9223372036854775808n}return r}case Le.UINT64:{const r=new BigUint64Array(n);for(let s=0;s<n;s++){const o=e[s];r[s]=o>0?o<18446744073709552e3?BigInt(Math.round(o)):18446744073709551615n:0n}return r}default:throw new Error(`Unsupported output NIfTI datatype code: ${t}`)}}function bn(e,t,n={}){const r=n.datatypeCode??e?.datatypeCode??Le.UINT8,s=Dr(r);if(!s)throw new Error(`Unsupported NIfTI-1 datatype code: ${r}`);const o=new Uint8Array(t.buffer,t.byteOffset,t.byteLength),i=new Uint8Array(en+o.byteLength);e&&e.littleEndian&&e.rawHeader.byteLength>=ln&&i.set(e.rawHeader.subarray(0,ln),0);const a=new DataView(i.buffer);a.setInt32(0,ln,!0);const f=n.dims?[3,n.dims[0],n.dims[1],n.dims[2],1,1,1,1]:e?[3,e.dims[1],e.dims[2],e.dims[3],1,1,1,1]:[3,1,1,1,1,1,1,1];for(let c=0;c<8;c++)a.setInt16(40+c*2,f[c],!0);const l=n.intentCode??e?.intentCode??Yn;a.setFloat32(56,0,!0),a.setFloat32(60,0,!0),a.setFloat32(64,0,!0),a.setInt16(68,l,!0),a.setInt16(70,r,!0),a.setInt16(72,s*8,!0);const m=e?e.pixDims.slice():[1,1,1,1,1,0,0,0];n.pixDims&&(m[1]=n.pixDims[0],m[2]=n.pixDims[1],m[3]=n.pixDims[2]);for(let c=0;c<8;c++)a.setFloat32(76+c*4,m[c]??0,!0);if(a.setFloat32(108,en,!0),a.setFloat32(112,n.sclSlope??e?.sclSlope??1,!0),a.setFloat32(116,n.sclInter??e?.sclInter??0,!0),a.setFloat32(124,n.calMax??e?.calMax??0,!0),a.setFloat32(128,n.calMin??e?.calMin??0,!0),i.fill(0,328,344),n.descrip!==void 0){i.fill(0,148,228);for(let c=0;c<Math.min(80,n.descrip.length);c++)i[148+c]=n.descrip.charCodeAt(c)&127}const d=n.affine??(e&&!e.littleEndian?e.stoXyz:null);if(d){const c=n.sformCode??n.qformCode??Math.max(e?.qformCode??0,e?.sformCode??0,1);a.setInt16(252,n.qformCode??c,!0),a.setInt16(254,n.sformCode??c,!0);const u=yo(d);a.setFloat32(76,u.qfac,!0),a.setFloat32(80,n.preservePixDims?n.preservePixDims[0]:u.dx,!0),a.setFloat32(84,n.preservePixDims?n.preservePixDims[1]:u.dy,!0),a.setFloat32(88,n.preservePixDims?n.preservePixDims[2]:u.dz,!0),a.setFloat32(256,u.quaternB,!0),a.setFloat32(260,u.quaternC,!0),a.setFloat32(264,u.quaternD,!0),a.setFloat32(268,u.qoffsetX,!0),a.setFloat32(272,u.qoffsetY,!0),a.setFloat32(276,u.qoffsetZ,!0);for(let p=0;p<4;p++)a.setFloat32(280+p*4,d[p],!0);for(let p=0;p<4;p++)a.setFloat32(296+p*4,d[4+p],!0);for(let p=0;p<4;p++)a.setFloat32(312+p*4,d[8+p],!0)}else if(e&&!e.littleEndian){a.setInt16(252,e.qformCode,!0),a.setInt16(254,e.sformCode,!0),a.setFloat32(256,e.quaternB,!0),a.setFloat32(260,e.quaternC,!0),a.setFloat32(264,e.quaternD,!0),a.setFloat32(268,e.qoffsetX,!0),a.setFloat32(272,e.qoffsetY,!0),a.setFloat32(276,e.qoffsetZ,!0);for(let c=0;c<4;c++)a.setFloat32(280+c*4,e.stoXyz[c],!0);for(let c=0;c<4;c++)a.setFloat32(296+c*4,e.stoXyz[4+c],!0);for(let c=0;c<4;c++)a.setFloat32(312+c*4,e.stoXyz[8+c],!0)}return i[344]=110,i[345]=43,i[346]=49,i[347]=0,i[348]=0,i[349]=0,i[350]=0,i[351]=0,i.set(o,en),i}var Xe=256,cn=Xe*Xe*Xe,Hr=.999,Xr=.98;function Mo(e){for(let o=0;o<e.length;o++){const i=e[o],a=(i>-1e3?i:-1e3)- -1e3,f=a-900,l=f<=0?0:f>=200?200:f;e[o]=Math.fround(a+l*9)}}function ko(e){const t=e.length;if(t===0)return;let n=1/0,r=0;for(let s=0;s<t;s++){let o=e[s];Number.isFinite(o)||(o=0,e[s]=0),o<n&&(n=o),o<0&&r++}n<0&&100*r/t<2&&(n=0);for(let s=0;s<t;s++){const o=e[s]-n;e[s]=o<=0?0:o>=255?255:Math.fround(o)}}function zo(e,t){if(!(e instanceof ArrayBuffer))return e;switch(t){case 2:return new Uint8Array(e);case 4:return new Int16Array(e);case 8:return new Int32Array(e);case 16:return new Float32Array(e);case 64:return new Float64Array(e);case 256:return new Int8Array(e);case 512:return new Uint16Array(e);case 768:return new Uint32Array(e);case 1024:return new BigInt64Array(e);case 1280:return new BigUint64Array(e);default:return new Float32Array(e)}}function Po(e){return e[0]*(e[5]*e[10]-e[6]*e[9])-e[1]*(e[4]*e[10]-e[6]*e[8])+e[2]*(e[4]*e[9]-e[5]*e[8])}function So(e){if(!e||e.length<16)return!1;for(let t=0;t<16;t++)if(!Number.isFinite(e[t]))return!1;return Math.abs(Po(e))>=1e-6}function Yr(e){const t=e[0],n=e[1],r=e[2],s=e[3],o=e[4],i=e[5],a=e[6],f=e[7],l=e[8],m=e[9],d=e[10],c=e[11],u=i*d-a*m,p=-(o*d-a*l),y=o*m-i*l,$=t*u+n*p+r*y;if(!Number.isFinite($)||Math.abs($)<1e-12)throw new Error("Cannot conform volume: singular affine transform.");const h=1/$,_=u*h,z=-(n*d-r*m)*h,b=(n*a-r*i)*h,g=p*h,v=(t*d-r*l)*h,M=-(t*a-r*o)*h,w=y*h,x=-(t*m-n*l)*h,P=(t*i-n*o)*h,k=-(_*s+z*f+b*c),S=-(g*s+v*f+M*c),F=-(w*s+x*f+P*c);return[_,z,b,k,g,v,M,S,w,x,P,F,0,0,0,1]}function Zr(e,t){const n=new Array(16);for(let r=0;r<3;r++){const s=r*4,o=e[s],i=e[s+1],a=e[s+2],f=e[s+3];n[s]=o*t[0]+i*t[4]+a*t[8],n[s+1]=o*t[1]+i*t[5]+a*t[9],n[s+2]=o*t[2]+i*t[6]+a*t[10],n[s+3]=o*t[3]+i*t[7]+a*t[11]+f}return n[12]=0,n[13]=0,n[14]=0,n[15]=1,n}function Kr(e,t,n,r,s=!1){const o=e*.5,i=t*.5,a=n*.5,f=r[0]*o+r[1]*i+r[2]*a+r[3],l=r[4]*o+r[5]*i+r[6]*a+r[7],m=r[8]*o+r[9]*i+r[10]*a+r[11],d=Xe*.5;return s?[1,0,0,f-d,0,1,0,l-d,0,0,1,m-d,0,0,0,1]:[-1,0,0,f+d,0,0,1,l-d,0,-1,0,m+d,0,0,0,1]}function wt(e,t,n){const r=n*(e-t);return r<=0?0:r>=255?255:Math.fround(r)}function Ao(e){const t=e.length;if(t===0)return{n:0,rawMin:0,rawMax:0,srcMin:0,nz:0,flooredNegative:!1,binSize:0,hist:null};let n=1/0,r=-1/0,s=0,o=0;for(let m=0;m<t;m++){let d=e[m];Number.isFinite(d)||(d=0,e[m]=0),d<n&&(n=d),d>r&&(r=d),(d>=1e-15||d<=-1e-15)&&s++,d<0&&o++}let i=n,a=!1;i<0&&100*o/t<2&&(i=0,a=!0);const f=Math.fround((r-i)/1e3);if(!(f>0))return{n:t,rawMin:n,rawMax:r,srcMin:i,nz:s,flooredNegative:a,binSize:0,hist:null};const l=new Uint32Array(1e3);for(let m=0;m<t;m++){const d=Math.fround((e[m]-i)/f),c=d<=0?0:d>=999?999:Math.trunc(d);l[c]++}return{n:t,rawMin:n,rawMax:r,srcMin:i,nz:s,flooredNegative:a,binSize:f,hist:l}}function jr(e,t=Hr){if(!e.hist||!(e.binSize>0))return{srcMin:e.srcMin,srcMax:e.rawMax,scale:1,flooredNegative:e.flooredNegative,degenerate:!0};const n=Math.max(0,Math.min(1,1-t)),r=e.n-Math.floor(n*e.nz);let s=0,o=0;for(;o<999&&(s+=e.hist[o],!(s+e.hist[o+1]>=r));o++);const i=Math.fround(o*e.binSize+e.srcMin),a=e.srcMin!==i?Math.fround(255/(i-e.srcMin)):1;return{srcMin:e.srcMin,srcMax:i,scale:a,flooredNegative:e.flooredNegative,degenerate:!1}}function Co(e,t){const n=e.length;if(t.degenerate){for(let o=0;o<n;o++){const i=e[o];e[o]=i<=0?0:i>=255?255:i}return}const{srcMin:r,scale:s}=t;for(let o=0;o<n;o++){const i=s*(e[o]-r);e[o]=i<=0?0:i>=255?255:i}}function Qr({img:e,datatypeCode:t,dims:n,affine:r,sclSlope:s=1,sclInter:o=0,toRAS:i=!1,isLinear:a=!0,asFloat32:f=!1,fHigh:l=Hr,inferenceFHigh:m=null,ct:d=!1,comply:c=!1}){let u=n[1]|0,p=n[2]|0,y=n[3]|0;if(u<1||p<1||y<1)throw new Error(`Invalid input volume dimensions: [${u}, ${p}, ${y}]`);let $=Array.isArray(r[0])?r.flat():Array.from(r);if(!So($))throw new Error("Cannot conform volume: invalid or singular affine matrix.");const h=zo(e,t),_=u*p*y;if(!h||h.length<_)throw new Error(`Input buffer length (${h?h.length:0}) is smaller than ${u}x${p}x${y}`);const z=Number.isFinite(s)&&s!==0?s:1,b=Number.isFinite(o)?o:0;let g=new Float32Array(_);const v=h instanceof BigInt64Array||h instanceof BigUint64Array;let M=0;if(v)for(let A=0;A<_;A++){const U=Number(h[A])*z+b;Number.isFinite(U)?(g[A]=U,M++):g[A]=0}else if(z===1&&b===0)for(let A=0;A<_;A++){const U=h[A];Number.isFinite(U)?(g[A]=U,M++):g[A]=0}else for(let A=0;A<_;A++){const U=h[A]*z+b;Number.isFinite(U)?(g[A]=U,M++):g[A]=0}if(M===0)throw new Error("Input volume contains no finite voxel values.");if(d&&Mo(g),c){ko(g);const A=Kr(u,p,y,$,!0),U=Zr(Yr($),A);let E=u===Xe&&p===Xe&&y===Xe;for(let B=0;B<3&&E;B++){const O=B*4;let D=Math.abs(U[O+3]);for(let J=0;J<3;J++)D+=Math.abs(U[O+J]-(B===J?1:0))*(Xe-1);E=D<.001}if(!E){const B=new Float32Array(cn);let O=g[0];for(let H=1;H<g.length;H++)g[H]<O&&(O=g[H]);O!==0&&B.fill(O);const D=U[0],J=U[1],Y=U[2],V=U[3],re=U[4],X=U[5],oe=U[6],N=U[7],j=U[8],G=U[9],se=U[10],ne=U[11],ce=u*p,Z=u-1,ee=p-1,T=y-1;let I=0;for(let H=0;H<Xe;H++){const ie=H*Y+V,le=H*oe+N,pe=H*se+ne;for(let ue=0;ue<Xe;ue++){const he=ue*J+ie,_e=ue*X+le,be=ue*G+pe;for(let me=0;me<Xe;me++,I++){const te=me*D+he,fe=me*re+_e,Be=me*j+be,ye=Math.floor(te),Ge=Math.floor(fe),He=Math.floor(Be);if(ye<0||Ge<0||He<0||ye>=Z||Ge>=ee||He>=T)continue;const nt=te-ye,Mt=fe-Ge,ft=Be-He,ct=1-nt,kt=1-Mt,at=1-ft,Ke=ye+Ge*u+He*ce,mt=g[Ke]*ct+g[Ke+1]*nt,yt=g[Ke+u]*ct+g[Ke+u+1]*nt,pt=g[Ke+ce]*ct+g[Ke+ce+1]*nt,vt=g[Ke+u+ce]*ct+g[Ke+u+ce+1]*nt;B[I]=(mt*kt+yt*Mt)*at+(pt*kt+vt*Mt)*ft}}}g=B}u=Xe,p=Xe,y=Xe,$=A}const w=Ao(g),x=jr(w,l),P=m!=null&&!f?jr(w,m):null,k=!!(P&&!x.degenerate&&P.scale!==x.scale),S=Kr(u,p,y,$,i),F=Yr($),L=Zr(F,S);let K=u===Xe&&p===Xe&&y===Xe;for(let A=0;A<3&&K;A++){const U=A*4;let E=Math.abs(L[U+3]);for(let B=0;B<3;B++)E+=Math.abs(L[U+B]-(A===B?1:0))*(Xe-1);K=E<.001}const W=f?new Float32Array(cn):new Uint8Array(cn);let C=null;if(k){C=new Uint8Array(cn);const A=x.srcMin,U=x.scale,E=P.scale;if(K)for(let B=0;B<cn;B++){const O=g[B],D=wt(O,A,U);W[B]=D<=0?0:D>=255?255:Math.round(D);const J=wt(O,A,E);C[B]=J<=0?0:J>=255?255:Math.round(J)}else{const B=wt(w.rawMin,A,U);B!==0&&W.fill(Math.min(255,Math.max(0,Math.round(B))));const O=wt(w.rawMin,A,E);O!==0&&C.fill(Math.min(255,Math.max(0,Math.round(O))));const D=L[0],J=L[1],Y=L[2],V=L[3],re=L[4],X=L[5],oe=L[6],N=L[7],j=L[8],G=L[9],se=L[10],ne=L[11],ce=u*p,Z=u-1,ee=p-1,T=y-1;let I=0;if(a)for(let H=0;H<Xe;H++){const ie=H*Y+V,le=H*oe+N,pe=H*se+ne;for(let ue=0;ue<Xe;ue++){const he=ue*J+ie,_e=ue*X+le,be=ue*G+pe;for(let me=0;me<Xe;me++,I++){const te=me*D+he,fe=me*re+_e,Be=me*j+be,ye=Math.floor(te),Ge=Math.floor(fe),He=Math.floor(Be);if(ye<0||Ge<0||He<0||ye>=Z||Ge>=ee||He>=T)continue;const nt=ye+Ge*u+He*ce,Mt=g[nt],ft=g[nt+1],ct=g[nt+u],kt=g[nt+u+1],at=g[nt+ce],Ke=g[nt+ce+1],mt=g[nt+u+ce],yt=g[nt+u+ce+1];if(Mt<=A&&ft<=A&&ct<=A&&kt<=A&&at<=A&&Ke<=A&&mt<=A&&yt<=A){W[I]=0,C[I]=0;continue}const pt=te-ye,vt=fe-Ge,Xt=Be-He,xt=1-pt,Gt=1-vt,Yt=1-Xt,zt=wt(Mt,A,U)*xt+wt(ft,A,U)*pt,Bt=wt(ct,A,U)*xt+wt(kt,A,U)*pt,Ze=wt(at,A,U)*xt+wt(Ke,A,U)*pt,gn=wt(mt,A,U)*xt+wt(yt,A,U)*pt,je=Math.fround((zt*Gt+Bt*vt)*Yt+(Ze*Gt+gn*vt)*Xt);W[I]=je<=0?0:je>=255?255:Math.floor(je+.5);const Vt=wt(Mt,A,E)*xt+wt(ft,A,E)*pt,dt=wt(ct,A,E)*xt+wt(kt,A,E)*pt,Te=wt(at,A,E)*xt+wt(Ke,A,E)*pt,Ue=wt(mt,A,E)*xt+wt(yt,A,E)*pt,De=Math.fround((Vt*Gt+dt*vt)*Yt+(Te*Gt+Ue*vt)*Xt);C[I]=De<=0?0:De>=255?255:Math.floor(De+.5)}}}else for(let H=0;H<Xe;H++){const ie=H*Y+V,le=H*oe+N,pe=H*se+ne;for(let ue=0;ue<Xe;ue++){const he=ue*J+ie,_e=ue*X+le,be=ue*G+pe;for(let me=0;me<Xe;me++,I++){const te=Math.round(me*D+he),fe=Math.round(me*re+_e),Be=Math.round(me*j+be);if(te<0||fe<0||Be<0||te>=u||fe>=p||Be>=y)continue;const ye=g[te+fe*u+Be*ce],Ge=wt(ye,A,U);W[I]=Ge<=0?0:Ge>=255?255:Math.floor(Ge+.5);const He=wt(ye,A,E);C[I]=He<=0?0:He>=255?255:Math.floor(He+.5)}}}}}else if(Co(g,x),K)if(f)for(let A=0;A<cn;A++)W[A]=g[A]*(1/255);else for(let A=0;A<cn;A++){const U=g[A];W[A]=U<=0?0:U>=255?255:Math.round(U)}else{let A=g[0];for(let ee=1;ee<g.length;ee++)g[ee]<A&&(A=g[ee]);A!==0&&W.fill(f?A*(1/255):Math.min(255,Math.max(0,Math.round(A))));const U=L[0],E=L[1],B=L[2],O=L[3],D=L[4],J=L[5],Y=L[6],V=L[7],re=L[8],X=L[9],oe=L[10],N=L[11],j=u*p,G=u-1,se=p-1,ne=y-1,ce=1/255;let Z=0;if(a)for(let ee=0;ee<Xe;ee++){const T=ee*B+O,I=ee*Y+V,H=ee*oe+N;for(let ie=0;ie<Xe;ie++){const le=ie*E+T,pe=ie*J+I,ue=ie*X+H;for(let he=0;he<Xe;he++,Z++){const _e=he*U+le,be=he*D+pe,me=he*re+ue,te=Math.floor(_e),fe=Math.floor(be),Be=Math.floor(me);if(te<0||fe<0||Be<0||te>=G||fe>=se||Be>=ne)continue;const ye=_e-te,Ge=be-fe,He=me-Be,nt=1-ye,Mt=1-Ge,ft=1-He,ct=te+fe*u+Be*j,kt=g[ct]*nt+g[ct+1]*ye,at=g[ct+u]*nt+g[ct+u+1]*ye,Ke=g[ct+j]*nt+g[ct+j+1]*ye,mt=g[ct+u+j]*nt+g[ct+u+j+1]*ye,yt=(kt*Mt+at*Ge)*ft+(Ke*Mt+mt*Ge)*He;if(f)W[Z]=yt<=0?0:yt>=255?1:yt*ce;else{const pt=Math.fround(yt);W[Z]=pt<=0?0:pt>=255?255:Math.floor(pt+.5)}}}}else for(let ee=0;ee<Xe;ee++){const T=ee*B+O,I=ee*Y+V,H=ee*oe+N;for(let ie=0;ie<Xe;ie++){const le=ie*E+T,pe=ie*J+I,ue=ie*X+H;for(let he=0;he<Xe;he++,Z++){const _e=Math.round(he*U+le),be=Math.round(he*D+pe),me=Math.round(he*re+ue);if(_e<0||be<0||me<0||_e>=u||be>=p||me>=y)continue;const te=g[_e+be*u+me*j];f?W[Z]=te<=0?0:te>=255?1:te*ce:W[Z]=te<=0?0:te>=255?255:Math.floor(te+.5)}}}}const R={img:W,dims:[3,Xe,Xe,Xe,1,1,1,1],pixDims:[1,1,1,1,1,0,0,0],affine:S,datatypeCode:f?16:2,bitsPerVoxel:f?32:8,sclSlope:1,sclInter:0,calMin:0,calMax:0};return m!=null&&(R.inferenceImg=C),R}function Jr(e){const t=Array.isArray(e[0])?[e[0][0],e[0][1],e[0][2],e[0][3],e[1][0],e[1][1],e[1][2],e[1][3],e[2][0],e[2][1],e[2][2],e[2][3],0,0,0,1]:e,n=t[0],r=t[1],s=t[2],o=t[3],i=t[4],a=t[5],f=t[6],l=t[7],m=t[8],d=t[9],c=t[10],u=t[11],p=a*c-f*d,y=-(i*c-f*m),$=i*d-a*m,h=n*p+r*y+s*$;if(!Number.isFinite(h)||Math.abs(h)<1e-12)return null;const _=1/h,z=p*_,b=-(r*c-s*d)*_,g=(r*f-s*a)*_,v=y*_,M=(n*c-s*m)*_,w=-(n*f-s*i)*_,x=$*_,P=-(n*d-r*m)*_,k=(n*a-r*i)*_;return[z,b,g,-(z*o+b*l+g*u),v,M,w,-(v*o+M*l+w*u),x,P,k,-(x*o+P*l+k*u),0,0,0,1]}function Fo(e,t){const n=Array.isArray(e[0])?e.flat():e,r=Array.isArray(t[0])?t.flat():t,s=new Array(16);for(let o=0;o<3;o++){const i=o*4,a=n[i],f=n[i+1],l=n[i+2],m=n[i+3];s[i]=a*r[0]+f*r[4]+l*r[8],s[i+1]=a*r[1]+f*r[5]+l*r[9],s[i+2]=a*r[2]+f*r[6]+l*r[10],s[i+3]=a*r[3]+f*r[7]+l*r[11]+m}return s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}var Bo={Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array};function Qn({srcImg:e,srcDims:t,srcAffine:n,dstDims:r,dstAffine:s,isLabel:o,isProbability:i=!1,dstTypedArrayKind:a="Uint8Array",labelOutputType:f="int16",labelLut:l=null}){const[m,d,c]=r,[u,p,y]=t,$=Array.isArray(s[0])?s:[s.slice(0,4),s.slice(4,8),s.slice(8,12),[0,0,0,1]],h=(A,U)=>[A[0][0]*U[0]+A[0][1]*U[1]+A[0][2]*U[2]+A[0][3],A[1][0]*U[0]+A[1][1]*U[1]+A[1][2]*U[2]+A[1][3],A[2][0]*U[0]+A[2][1]*U[1]+A[2][2]*U[2]+A[2][3]],_=Jr(n);if(!_)throw new Error("Segmentation affine is not invertible");const z=(A,U)=>[A[0]*U[0]+A[1]*U[1]+A[2]*U[2]+A[3],A[4]*U[0]+A[5]*U[1]+A[6]*U[2]+A[7],A[8]*U[0]+A[9]*U[1]+A[10]*U[2]+A[11]],b=A=>z(_,h($,A)),g=b([0,0,0]),v=b([1,0,0]).map((A,U)=>A-g[U]),M=b([0,1,0]).map((A,U)=>A-g[U]),w=b([0,0,1]).map((A,U)=>A-g[U]),x=m*d*c,P=u*p,k=(A,U,E)=>A>=0&&A<u&&U>=0&&U<p&&E>=0&&E<y?e[A+U*u+E*P]:0;if(o){const A=X=>{const oe=Math.sqrt(X[0]*X[0]+X[1]*X[1]+X[2]*X[2]);if(oe<=1.5001)return[0];const N=oe<=3.5001?4:oe<=5.5001?6:8,j=new Array(N);for(let G=0;G<N/2;G++){const se=(G+.5)/N;j[2*G]=-se,j[2*G+1]=se}return j},U=A(v),E=A(M),B=A(w),O=[];for(const X of U)for(const oe of E)for(const N of B)O.push([X*v[0]+oe*M[0]+N*w[0],X*v[1]+oe*M[1]+N*w[1],X*v[2]+oe*M[2]+N*w[2]]);const D=f==="uint8"?new Uint8Array(x):new Int16Array(x),J=l?l.length:0;let Y=0;const V=O.length;let re=0;if(V===1)for(let X=0;X<c;X++)for(let oe=0;oe<d;oe++){let N=g[0]+oe*M[0]+X*w[0],j=g[1]+oe*M[1]+X*w[1],G=g[2]+oe*M[2]+X*w[2];for(let se=0;se<m;se++){let ne=k(Math.floor(N+.5),Math.floor(j+.5),Math.floor(G+.5));l&&ne>=0&&ne<J&&(ne=l[ne]),ne>Y&&(Y=ne),D[re++]=ne,N+=v[0],j+=v[1],G+=v[2]}}else{const X=new Int32Array(V),oe=new Int32Array(V);for(let N=0;N<c;N++)for(let j=0;j<d;j++){let G=g[0]+j*M[0]+N*w[0],se=g[1]+j*M[1]+N*w[1],ne=g[2]+j*M[2]+N*w[2];for(let ce=0;ce<m;ce++){let Z=0;for(let I=0;I<V;I++){const H=O[I],ie=k(Math.floor(G+H[0]+.5),Math.floor(se+H[1]+.5),Math.floor(ne+H[2]+.5));let le=-1;for(let pe=0;pe<Z;pe++)if(X[pe]===ie){le=pe;break}le<0?(X[Z]=ie,oe[Z]=1,Z++):oe[le]++}let ee=X[0],T=oe[0];for(let I=1;I<Z;I++)oe[I]>T&&(T=oe[I],ee=X[I]);l&&ee>=0&&ee<J&&(ee=l[ee]),ee>Y&&(Y=ee),D[re++]=ee,G+=v[0],se+=v[1],ne+=v[2]}}}return{img:D,hdrPatch:{datatypeCode:f==="uint8"?2:4,numBitsPerVoxel:f==="uint8"?8:16,scl_slope:1,scl_inter:0,cal_min:0,cal_max:f==="uint8"?0:Y,intent_code:1002}}}const S=Bo[a]||Uint8Array,F=i?255:1,L=i?new Uint8Array(x):new S(x),K=(A,U,E)=>{const B=Math.floor(A),O=Math.floor(U),D=Math.floor(E),J=A-B,Y=U-O,V=E-D,re=k(B,O,D),X=k(B+1,O,D),oe=k(B,O+1,D),N=k(B+1,O+1,D),j=k(B,O,D+1),G=k(B+1,O,D+1),se=k(B,O+1,D+1),ne=k(B+1,O+1,D+1),ce=re+J*(X-re),Z=oe+J*(N-oe),ee=j+J*(G-j),T=se+J*(ne-se),I=ce+Y*(Z-ce),H=ee+Y*(T-ee);return I+V*(H-I)},W=i?K:(A,U,E)=>k(Math.round(A),Math.round(U),Math.round(E));let C=0;if(i)for(let A=0;A<c;A++)for(let U=0;U<d;U++){let E=g[0]+U*M[0]+A*w[0],B=g[1]+U*M[1]+A*w[1],O=g[2]+U*M[2]+A*w[2];for(let D=0;D<m;D++){let J=K(E,B,O);J>0?J>1&&(J=1):J=0,L[C++]=Math.floor(J*255+.5),E+=v[0],B+=v[1],O+=v[2]}}else for(let A=0;A<c;A++)for(let U=0;U<d;U++){let E=g[0]+U*M[0]+A*w[0],B=g[1]+U*M[1]+A*w[1],O=g[2]+U*M[2]+A*w[2];for(let D=0;D<m;D++)L[C++]=W(E,B,O),E+=v[0],B+=v[1],O+=v[2]}const R=i?{datatypeCode:2,numBitsPerVoxel:8,cal_min:0,cal_max:1,scl_slope:1/F,scl_inter:0}:{scl_slope:1,scl_inter:0};return{img:L,hdrPatch:R}}var un=new WeakMap,es=class{getLabelMeta(e){return un.get(e)||null}idx(e,t,n,r){return n*r[0]*r[1]+t*r[0]+e}check_previous_slice(e,t,n,r,s,o,i,a,f,l){let m=0;if(!s)return 0;const d=e[this.idx(n,r,s,o)];if(i>=6){const c=this.idx(n,r,s-1,o);d===e[c]&&(f[m++]=t[c])}if(i>=18){if(n){const c=this.idx(n-1,r,s-1,o);d===e[c]&&(f[m++]=t[c])}if(r){const c=this.idx(n,r-1,s-1,o);d===e[c]&&(f[m++]=t[c])}if(n<o[0]-1){const c=this.idx(n+1,r,s-1,o);d===e[c]&&(f[m++]=t[c])}if(r<o[1]-1){const c=this.idx(n,r+1,s-1,o);d===e[c]&&(f[m++]=t[c])}}if(i===26){if(n&&r){const c=this.idx(n-1,r-1,s-1,o);d===e[c]&&(f[m++]=t[c])}if(n<o[0]-1&&r){const c=this.idx(n+1,r-1,s-1,o);d===e[c]&&(f[m++]=t[c])}if(n&&r<o[1]-1){const c=this.idx(n-1,r+1,s-1,o);d===e[c]&&(f[m++]=t[c])}if(n<o[0]-1&&r<o[1]-1){const c=this.idx(n+1,r+1,s-1,o);d===e[c]&&(f[m++]=t[c])}}return m?(this.fill_tratab(a,f,m,l),f[0]):0}do_initial_labelling(e,t,n,r=null){const s=t[0]|0,o=t[1]|0,i=t[2]|0,a=s*o,f=a*i;let l=1;const m=8192;let d=m,c=new Uint32Array(d),u;if(n===6&&r&&r.il&&r.il.length===f){if(u=r.il,r.dirty)u.fill(0);else if(r.runs&&r.runLen>0){const h=r.runs,_=r.runLen;for(let z=0;z<_;z+=2)u.fill(0,h[z],h[z+1])}}else u=new Uint32Array(f),n===6&&r&&(r.il=u,r.runs=null,r.runLen=0,r.dirty=!1);if(n===6){r&&(r.dirty=!0);const h=(e instanceof Uint8Array||e instanceof Uint8ClampedArray)&&(e.byteOffset&3)===0&&(s&3)===0&&e.length>=f?new Uint32Array(e.buffer,e.byteOffset,f>>2):null;let _=r&&r.runs?r.runs:new Uint32Array(8192),z=_.length,b=0,g=0,v=0,M=0,w=-1,x=-1,P=i,k=-1;for(let S=0;S<i;S++){const F=S*a;for(let L=0;L<o;L++){const K=F+L*s;let W=0;if(h){const R=K+s>>2;let A=K>>2;for(;A<R&&h[A]===0;)A++;if(A===R)continue;W=(A<<2)-K}let C=!1;for(;W<s;W++){const R=K+W;if(h&&!C&&(W&3)===0&&h[R>>2]===0){W+=3;continue}const A=e[R];if(A===0){C&&(_[b++]=R,C=!1);continue}if(!C){if(b+2>z){z<<=1;const E=new Uint32Array(z);E.set(_),_=E}_[b++]=R,C=!0}w<0&&(w=R,P=S),x=R,k=S;let U=0;if(S>0&&e[R-a]===A&&(g=u[R-a],U=1),W>0&&e[R-1]===A){const E=u[R-1];U===0?g=E:U===1?v=E:M=E,U++}if(L>0&&e[R-s]===A){const E=u[R-s];U===0?g=E:U===1?v=E:M=E,U++}if(U===0){if(u[R]=l,l>=d){d+=m;const E=new Uint32Array(d);E.set(c),c=E}c[l-1]=l,l++}else if(u[R]=g,U===2&&v!==g){let E=g;for(;c[E-1]!==E;)E=c[E-1];let B=v;for(;c[B-1]!==B;)B=c[B-1];const O=E<B?E:B;c[E-1]=O,c[B-1]=O}else if(U===3&&(v!==g||M!==g)){let E=g;for(;c[E-1]!==E;)E=c[E-1];let B=v;for(;c[B-1]!==B;)B=c[B-1];let O=M;for(;c[O-1]!==O;)O=c[O-1];let D=E<B?E:B;O<D&&(D=O),c[E-1]=D,c[B-1]=D,c[O-1]=D}}C&&(_[b++]=K+s)}}for(let S=0;S<l-1;S++){let F=S;for(;c[F]!==F+1;)F=c[F]-1;c[S]=F+1}return r&&(r.runs=_,r.runLen=b,r.dirty=!1),this._lastInitialRange={conn:6,fgStart:w,fgEnd:x,minSl:P,maxSl:k,runs:_,runLen:b},[l-1,c,u]}const p=new Uint32Array(32),y=new Uint32Array(32),$=new Uint32Array(27);for(let h=0;h<i;h++)for(let _=0;_<o;_++)for(let z=0;z<s;z++){let b=0;const g=e[this.idx(z,_,h,t)];if(g!==0){if($[0]=this.check_previous_slice(e,u,z,_,h,t,n,c,p,y),$[0]&&(b+=1),n>=6){if(z){const v=this.idx(z-1,_,h,t);g===e[v]&&($[b++]=u[v])}if(_){const v=this.idx(z,_-1,h,t);g===e[v]&&($[b++]=u[v])}}if(n>=18){if(_&&z){const v=this.idx(z-1,_-1,h,t);g===e[v]&&($[b++]=u[v])}if(_&&z<s-1){const v=this.idx(z+1,_-1,h,t);g===e[v]&&($[b++]=u[v])}}if(b)u[this.idx(z,_,h,t)]=$[0],this.fill_tratab(c,$,b,y);else{if(u[this.idx(z,_,h,t)]=l,l>=d){d+=m;const v=new Uint32Array(d);v.set(c),c=v}c[l-1]=l,l++}}}for(let h=0;h<l-1;h++){let _=h;for(;c[_]!==_+1;)_=c[_]-1;c[h]=_+1}return this._lastInitialRange=null,[l-1,c,u]}fill_tratab(e,t,n,r){let o=2147483647;for(let i=0;i<n;i++){let a=t[i];for(;e[a-1]!==a;)a=e[a-1];r[i]=a,o=Math.min(o,a)}for(let i=0;i<n;i++)e[r[i]-1]=o}translate_labels(e,t,n,r,s=null,o=null){const i=t[0]*t[1]*t[2];if(o&&(r===0||o.fgStart<0))return s&&(this._lastMeta={conn:o.conn,cl:0,fgStart:0,fgEnd:-1,minSl:0,maxSl:-1,ls2bw:new Uint32Array(1),sumls:new Uint32Array(1),distinctFgClasses:0,bw:s}),[0,e];let a=0;for(let p=0;p<r;p++)n[p]>a&&(a=n[p]);const f=new Uint32Array(a+1),l=s&&o?new Uint32Array(r+1):null,m=s&&o?new Uint32Array(r+1):null,d=o?o.fgStart:0,c=o?o.fgEnd:i-1;let u=0;if(o&&o.runs){const p=o.runs,y=o.runLen;for(let $=0;$<y;$+=2){const h=p[$],_=p[$+1];for(let z=h;z<_;z++){const b=n[e[z]-1];let g=f[b];g||(u+=1,g=u,f[b]=g,l&&(l[g]=s[z])),e[z]=g,m&&m[g]++}}}else for(let p=d;p<=c;p++){const y=e[p];if(y){const $=n[y-1];let h=f[$];h||(u+=1,h=u,f[$]=h,l&&(l[h]=s[p])),e[p]=h,m&&m[h]++}}if(s&&o){const p=l.slice(0,u+1),y=m.slice(0,u+1);let $=0;if(u>0){const h=p[1];$=1;for(let _=2;_<=u;_++)if(p[_]!==h){$=2;break}}this._lastMeta={conn:o.conn,cl:u,fgStart:o.fgStart,fgEnd:o.fgEnd,minSl:o.minSl,maxSl:o.maxSl,runs:o.runs,runLen:o.runLen,ls2bw:p,sumls:y,distinctFgClasses:$,bw:s}}return[u,e]}neighbor_winners(e,t,n,r,s=null,o=null){const i=t[0],a=t[1],f=t[2],l=i*a,m=!!(o&&s);let d=!1;for(let z=1;z<=r;z++)if(!n[z]){d=!0;break}if(!d)return m&&console.log("[relabel] 0/0 suppressed components resolved within their own class family (0 fell back to the unrestricted neighbour vote)"),new Uint32Array(r+1);const c=m?new Int32Array(r+1).fill(-1):null,u=new Map,p=(z,b)=>{let g=u.get(z);g||(g=new Map,u.set(z,g)),g.set(b,(g.get(b)||0)+1)},y=un.get(e),$=y&&y.cl===r&&e.length===l*f;if($&&y.runs){const z=y.runs,b=y.runLen;for(let g=0;g<b;g+=2){const v=z[g],M=z[g+1],w=v/l|0,x=v-w*l,P=x/i|0;let k=x-P*i;for(let S=v;S<M;S++,k++){const F=e[S];if(n[F])continue;m&&c[F]<0&&(c[F]=o(s[S]));let L;k>0&&(L=n[e[S-1]])&&p(F,L),k<i-1&&(L=n[e[S+1]])&&p(F,L),P>0&&(L=n[e[S-i]])&&p(F,L),P<a-1&&(L=n[e[S+i]])&&p(F,L),w>0&&(L=n[e[S-l]])&&p(F,L),w<f-1&&(L=n[e[S+l]])&&p(F,L)}}}else{const z=$?y.minSl:0,b=$?y.maxSl:f-1;let g=z*l;for(let v=z;v<=b;v++)for(let M=0;M<a;M++)for(let w=0;w<i;w++,g++){const x=e[g];if(x===0||n[x])continue;m&&c[x]<0&&(c[x]=o(s[g]));let P;w>0&&(P=n[e[g-1]])&&p(x,P),w<i-1&&(P=n[e[g+1]])&&p(x,P),M>0&&(P=n[e[g-i]])&&p(x,P),M<a-1&&(P=n[e[g+i]])&&p(x,P),v>0&&(P=n[e[g-l]])&&p(x,P),v<f-1&&(P=n[e[g+l]])&&p(x,P)}}const h=new Uint32Array(r+1).fill(0);let _=0;for(const[z,b]of u){const g=m?c[z]:0;let v=0,M=0;if(g>0){for(const[w,x]of b)o(w)===g&&(x>M||x===M&&(v===0||w<v))&&(M=x,v=w);v&&_++}if(!v)for(const[w,x]of b)(x>M||x===M&&(v===0||w<v))&&(M=x,v=w);h[z]=v}return m&&console.log(`[relabel] ${_}/${u.size} suppressed components resolved within their own class family (${u.size-_} fell back to the unrestricted neighbour vote)`),h}finalize_volume(e,t,n,r,s,o=null,i=null,a=!1){const f=e.length,l=s?this.neighbor_winners(e,t,n,r,o,i):null,m=l?new Uint32Array(r+1):n;let d=0;for(let h=1;h<=r;h++){let _=n[h];l&&(_||(_=l[h]),m[h]=_),_>d&&(d=_)}const c=un.get(e),u=c&&c.cl===r&&c.ls2bw.length===r+1&&c.fgEnd<f;let p=0;if(u&&c.runs){const h=c.runs,_=c.runLen;for(let g=1;g<=r;g++)c.sumls[g]>0&&m[g]>p&&(p=m[g]);if(c.bw===o&&o instanceof Uint8Array&&d<=255){const g=new Uint8Array(r+1);let v=!1;for(let w=1;w<=r;w++)c.sumls[w]>0&&m[w]!==c.ls2bw[w]&&(g[w]=1,v=!0);const M=a?o:o.slice();if(v)for(let w=0;w<_;w+=2){const x=h[w],P=h[w+1];for(let k=x;k<P;k++){const S=e[k];g[S]&&(M[k]=m[S])}}return[p,M]}const b=o instanceof Uint8Array&&d<=255?new Uint8Array(f):new Uint32Array(f);for(let g=0;g<_;g+=2){const v=h[g],M=h[g+1];for(let w=v;w<M;w++){const x=m[e[w]];x&&(b[w]=x)}}return[p,b]}const $=o instanceof Uint8Array&&d<=255?new Uint8Array(f):new Uint32Array(f);if(u){if(c.fgStart>=0&&c.fgEnd>=c.fgStart)for(let h=c.fgStart;h<=c.fgEnd;h++){const _=e[h];if(_!==0){const z=m[_];z&&($[h]=z,z>p&&(p=z))}}}else for(let h=0;h<f;h++){const _=e[h];if(_!==0){const z=m[_];z&&($[h]=z,z>p&&(p=z))}}return[p,$]}diagnose_components(e,t,n,r,s={}){const o=s.topN??50,i=s.minSize??1,a=s.label??"diag",f=r[0],l=r[1],m=r[2],d=f*l,c=new Uint32Array(t+1),u=new Uint32Array(t+1);for(let w=0;w<e.length;w++){const x=n[w];x&&(c[x]=e[w],u[x]++)}const p=new Map,y=new Uint32Array(t+1),$=new Uint32Array(t+1),h=(w,x)=>{let P=p.get(w);P||(P=new Map,p.set(w,P)),P.set(x,(P.get(x)||0)+1)};for(let w=0;w<m;w++)for(let x=0;x<l;x++)for(let P=0;P<f;P++){const k=w*d+x*f+P,S=n[k];if(!S)continue;const F=c[S],L=K=>{const W=n[K];if(W===S)return;$[S]++;const C=W?c[W]:0;C===0?y[S]++:C!==F&&h(S,C)};P>0&&L(k-1),P<f-1&&L(k+1),x>0&&L(k-f),x<l-1&&L(k+f),w>0&&L(k-d),w<m-1&&L(k+d)}const _=new Map,z=new Map;for(let w=1;w<=t;w++){const x=c[w];_.set(x,(_.get(x)||0)+1),(!z.has(x)||u[w]>z.get(x))&&z.set(x,u[w])}const b=[];for(let w=1;w<=t;w++){if(u[w]<i)continue;const x=c[w],P=p.get(w);let k=0,S=0,F=0;if(P)for(const[K,W]of P)F+=W,W>S&&(S=W,k=K);const L=$[w]||1;b.push({comp:w,class:x,size:u[w],largestOfClass:u[w]===z.get(x)?"Y":"n",compsInClass:_.get(x),domNeighbor:k,domFracForeign:F?+(S/F).toFixed(2):0,domFracBoundary:+(S/L).toFixed(2),bgFrac:+(y[w]/L).toFixed(2)})}b.sort((w,x)=>x.domFracForeign-w.domFracForeign||x.size-w.size);const g=(w,x)=>{const P=x.map(S=>Math.max(S.h.length,...w.map(F=>String(F[S.k]).length))),k=S=>S.map((F,L)=>String(F).padStart(P[L])).join("  ");return[k(x.map(S=>S.h)),...w.map(S=>k(x.map(F=>S[F.k])))].join(`
`)},v=[{k:"comp",h:"comp"},{k:"class",h:"class"},{k:"size",h:"size"},{k:"largestOfClass",h:"lrg"},{k:"compsInClass",h:"nComp"},{k:"domNeighbor",h:"domNbr"},{k:"domFracForeign",h:"encF"},{k:"domFracBoundary",h:"encB"},{k:"bgFrac",h:"bgF"}];console.log(`[${a}] total components=${t}, distinct classes=${_.size}
[${a}] island candidates (encF≈1 + small size + lrg=n ⇒ swallowed island):
`+g(b.slice(0,o),v));const M=[..._.entries()].map(([w,x])=>({class:w,components:x,maxCompSize:z.get(w)})).sort((w,x)=>x.components-w.components);return console.log(`[${a}] per-class component counts (components=1 ⇒ fully connected):
`+g(M.slice(0,30),[{k:"class",h:"class"},{k:"components",h:"comps"},{k:"maxCompSize",h:"maxSize"}])),b}_collectComponentStats(e,t,n){const r=un.get(n);if(r&&r.cl===t&&r.bw===e&&n.length===e.length)return[r.ls2bw,r.sumls];const s=e.length,o=new Uint32Array(t+1),i=new Uint32Array(t+1);for(let a=0;a<s;a++){const f=n[a];f>0&&(o[f]=e[a],i[f]++)}return[o,i]}_buildKeptMap(e,t,n,r,s){const o=new Uint32Array(n+1);let i=0;for(let f=1;f<=n;f++)e[f]>i&&(i=e[f]);const a=r==="all";if(i<=65535){const f=new Uint32Array(i+1),l=new Uint32Array(i+1);for(let m=1;m<=n;m++){const d=e[m];if(d!==0)if(a||r&&r.has&&r.has(d)){const c=t[m];(!l[d]||(s?c>=f[d]:c>f[d]))&&(f[d]=c,l[d]=m)}else o[m]=d}for(let m=1;m<=i;m++){const d=l[m];d>0&&(o[d]=m)}}else{const f=new Map;for(let l=1;l<=n;l++){const m=e[l];if(m!==0)if(a||r&&r.has&&r.has(m)){const d=t[l],c=f.get(m);(!c||(s?d>=c.sz:d>c.sz))&&f.set(m,{c:l,sz:d})}else o[l]=m}for(const[l,{c:m}]of f)o[m]=l}return o}largest_original_cluster_labels(e,t,n,r=null,s=!1,o=null,i=!1){const[a,f]=this._collectComponentStats(e,t,n),l=this._buildKeptMap(a,f,t,"all",!0);return this.finalize_volume(n,r,l,t,s,e,o,i)}filter_clusters(e,t,n,r,s=null,o=!1,i=null,a=!1){const[f,l]=this._collectComponentStats(e,t,n),m=this._buildKeptMap(f,l,t,r,!1);return this.finalize_volume(n,s,m,t,o,e,i,a)}filter_clusters_by_ratio(e,t,n,r,s=null,o=!1,i=null){const a=e.length,f=new Uint32Array(t+1).fill(0),l=new Uint32Array(t+1).fill(0);for(let u=0;u<a;u++){const p=n[u];p>0&&(f[p]===0&&(f[p]=e[u]),l[p]++)}const m=new Map;for(let u=1;u<=t;u++){const p=f[u],y=l[u];(!m.has(p)||y>m.get(p))&&m.set(p,y)}const d=new Uint8Array(t+1).fill(0);for(let u=1;u<=t;u++){const p=f[u],y=l[u],$=m.get(p)||0;y>=$*r&&(d[u]=1)}const c=new Uint32Array(t+1).fill(0);for(let u=1;u<=t;u++)d[u]&&(c[u]=f[u]);return this.finalize_volume(n,s,c,t,o,e,i)}_binaryComponentsFromLabels(e,t,n,r,s=!1){const o=r[0]|0,i=r[1]|0,a=r[2]|0,f=o*i,l=un.get(n),m=l&&l.cl===t&&n.length===f*a&&(!s||l.bw===e);if(m&&l.conn===6&&l.distinctFgClasses<=1){const h=new Uint32Array(t+1);let _=0,z=0;for(let b=1;b<=t;b++){h[b]=b;const g=l.sumls[b];g>0&&g>=z&&(z=g,_=b)}return{parent:h,compSize:l.sumls,compClass:s?l.ls2bw:null,bestRoot:_}}const d=m?l.sumls:new Uint32Array(t+1),c=m?s?l.ls2bw:null:s?new Uint32Array(t+1):null,u=new Uint32Array(t+1);for(let h=1;h<=t;h++)u[h]=h;if(m&&l.conn===6&&l.runs&&l.bw===e){const h=(b,g)=>{for(;u[b]!==b;)u[b]=u[u[b]],b=u[b];for(;u[g]!==g;)u[g]=u[u[g]],g=u[g];b!==g&&(b<g?u[g]=b:u[b]=g)},_=l.runs,z=l.runLen;for(let b=0;b<z;b+=2){const g=_[b],v=_[b+1],M=g/f|0,w=g-M*f,x=w/o|0;let P=w-x*o;for(let k=g;k<v;k++,P++){const S=e[k];let F=0;if(M>0){const L=e[k-f];L!==0&&L!==S&&(F=n[k],h(F,n[k-f]))}if(x>0){const L=e[k-o];L!==0&&L!==S&&(F||(F=n[k]),h(F,n[k-o]))}if(P>0){const L=e[k-1];L!==0&&L!==S&&(F||(F=n[k]),h(F,n[k-1]))}}}}else{const h=m?l.minSl:0,_=m?l.maxSl:a-1;let z=h*f;for(let b=h;b<=_;b++)for(let g=0;g<i;g++)for(let v=0;v<o;v++,z++){const M=n[z];if(M===0)continue;m||(d[M]++,c&&c[M]===0&&(c[M]=e[z]));let w=M;for(;u[w]!==w;)u[w]=u[u[w]],w=u[w];if(b>0){const x=n[z-f];if(x!==0&&x!==M){let P=x;for(;u[P]!==P;)u[P]=u[u[P]],P=u[P];w!==P&&(w<P?u[P]=w:(u[w]=P,w=P))}}if(g>0){const x=n[z-o];if(x!==0&&x!==M){let P=x;for(;u[P]!==P;)u[P]=u[u[P]],P=u[P];w!==P&&(w<P?u[P]=w:(u[w]=P,w=P))}}if(v>0){const x=n[z-1];if(x!==0&&x!==M){let P=x;for(;u[P]!==P;)u[P]=u[u[P]],P=u[P];w!==P&&(w<P?u[P]=w:u[w]=P)}}}}const p=new Uint32Array(t+1);for(let h=1;h<=t;h++){let _=h;for(;u[_]!==_;)_=u[_];u[h]=_,p[_]+=d[h]}let y=0,$=0;for(let h=1;h<=t;h++){const _=p[h];_>0&&_>=$&&($=_,y=h)}return{parent:u,compSize:d,compClass:c,bestRoot:y}}applyLargestBinaryMaskInPlace(e,t,n,r){const s=e.length;if(t===0)return e.fill(0),e;const o=un.get(n),i=o&&o.cl===t&&n.length===s;if(i&&o.conn===6&&o.distinctFgClasses<=1){let l=0,m=0;for(let d=1;d<=t;d++){const c=o.sumls[d];c>0&&c>=m&&(m=c,l=d)}if(o.runs&&o.bw===e){if(t>1){const d=o.runs,c=o.runLen;for(let u=0;u<c;u+=2){const p=d[u],y=d[u+1];for(let $=p;$<y;$++)n[$]!==l&&(e[$]=0)}}return e}if(o.fgStart>0&&e.fill(0,0,o.fgStart),o.fgEnd>=o.fgStart){for(let d=o.fgStart;d<=o.fgEnd;d++)n[d]!==l&&(e[d]=0);o.fgEnd+1<s&&e.fill(0,o.fgEnd+1)}else e.fill(0);return e}const{parent:a,bestRoot:f}=this._binaryComponentsFromLabels(e,t,n,r,!1);if(i&&o.runs&&o.bw===e){const l=o.runs,m=o.runLen;for(let d=0;d<m;d+=2){const c=l[d],u=l[d+1];for(let p=c;p<u;p++)a[n[p]]!==f&&(e[p]=0)}return e}if(i&&o.fgEnd>=o.fgStart){o.fgStart>0&&e.fill(0,0,o.fgStart);for(let l=o.fgStart;l<=o.fgEnd;l++){const m=n[l];(m===0||a[m]!==f)&&(e[l]=0)}o.fgEnd+1<s&&e.fill(0,o.fgEnd+1)}else for(let l=0;l<s;l++){const m=n[l];(m===0||a[m]!==f)&&(e[l]=0)}return e}filterHierarchicalFromLabels(e,t,n,r,s="all",o=!0,i=!1,a=null,f=!1){if(t===0)return[0,e instanceof Uint8Array?f?e:new Uint8Array(e.length):new Uint32Array(e.length)];const{parent:l,compSize:m,compClass:d,bestRoot:c}=this._binaryComponentsFromLabels(e,t,n,r,!0),u=new Uint32Array(t+1);for(let y=1;y<=t;y++)l[y]===c&&(u[y]=d[y]);const p=this._buildKeptMap(u,m,t,s,o);return this.finalize_volume(n,r,p,t,i,e,a,f)}filter18ClassFromLabels(e,t,n,r,s,o=!1,i=null,a=!1){return this.filterHierarchicalFromLabels(e,t,n,r,s,!1,o,i,a)}bwlabel(e,t,n=26,r=!1,s=!1,o=null){const i=Date.now(),a=t[0]*t[1]*t[2];if(![6,18,26].includes(n))return console.log("bwlabel: conn must be 6, 18 or 26."),[0,new Uint32Array(a)];if(t[0]<2||t[1]<2||t[2]<1)return console.log("bwlabel: img must be 2 or 3-dimensional"),[0,new Uint32Array(a)];let f;if(r){f=new Uint8Array(a);for(let p=0;p<a;p++)e[p]!==0&&(f[p]=1)}else e instanceof Uint8Array||e instanceof Uint8ClampedArray||e instanceof Uint16Array||e instanceof Uint32Array||e instanceof Int8Array||e instanceof Int16Array||e instanceof Int32Array?e.length===a?f=e:(f=new Uint32Array(a),f.set(e.subarray(0,a))):(f=new Uint32Array(a),f.set(e));this._lastInitialRange=null,this._lastMeta=null;let[l,m,d]=this.do_initial_labelling(f,t,n,o);m===void 0&&(m=new Uint32Array(0));const[c,u]=this.translate_labels(d,t,m,l,f,this._lastInitialRange);if(this._lastMeta&&un.set(u,this._lastMeta),console.log(n+" neighbor clustering into "+c+" regions in "+(Date.now()-i)+"ms"),s){const[p,y]=this.largest_original_cluster_labels(f,c,u);return[p,y]}return[c,u]}filter_clusters_by_rank(e,t,n,r,s=0,o=null,i=!1,a=null,f=!1,l=null){const m=e.length,d=new Uint32Array(t+1).fill(0),c=new Uint32Array(t+1).fill(0),u=a!=null&&Array.isArray(o)&&o.length===3,p=u?o[0]:0,y=u?o[1]:0,$=u?new Int32Array(t+1).fill(2147483647):null,h=u?new Int32Array(t+1).fill(-1):null,_=u?new Int32Array(t+1).fill(2147483647):null,z=u?new Int32Array(t+1).fill(-1):null,b=u?new Int32Array(t+1).fill(2147483647):null,g=u?new Int32Array(t+1).fill(-1):null;for(let k=0;k<m;k++){const S=n[k];if(S>0&&(d[S]===0&&(d[S]=e[k]),c[S]++,u)){const F=k%p,L=k/p|0,K=L%y,W=L/y|0;F<$[S]&&($[S]=F),F>h[S]&&(h[S]=F),K<_[S]&&(_[S]=K),K>z[S]&&(z[S]=K),W<b[S]&&(b[S]=W),W>g[S]&&(g[S]=W)}}let v=null,M=0;if(u){let k=-1;for(let C=1;C<=t;C++)c[C]>k&&(k=c[C],M=C);const S=Math.max(2,Math.ceil(a)+4),F=p*y,L=new Int16Array(m).fill(-1);let K=[];for(let C=0;C<m;C++)n[C]===M&&(L[C]=0,K.push(C));for(let C=1;C<=S&&K.length;C++){const R=[];for(let A=0;A<K.length;A++){const U=K[A],E=U%p,O=(U/p|0)%y;E>0&&L[U-1]===-1&&(L[U-1]=C,R.push(U-1)),E<p-1&&L[U+1]===-1&&(L[U+1]=C,R.push(U+1)),O>0&&L[U-p]===-1&&(L[U-p]=C,R.push(U-p)),O<y-1&&L[U+p]===-1&&(L[U+p]=C,R.push(U+p)),U-F>=0&&L[U-F]===-1&&(L[U-F]=C,R.push(U-F)),U+F<m&&L[U+F]===-1&&(L[U+F]=C,R.push(U+F))}K=R}const W=S+1;v=new Float64Array(t+1).fill(W);for(let C=0;C<m;C++){const R=n[C];if(R>0&&R!==M){const A=L[C]>=0?L[C]:W;A<v[R]&&(v[R]=A)}}f&&console.log(`[rank-filter] brain comp=${M} size=${k} bbox A[${$[M]},${h[M]}] B[${_[M]},${z[M]}] C[${b[M]},${g[M]}] | maxGap=${a} scan=${S}`)}const w=new Map;for(let k=1;k<=t;k++){const S=d[k],F=c[k];w.has(S)||w.set(S,[]),w.get(S).push({i:k,size:F})}const x=new Uint8Array(t+1).fill(0);for(const[k,S]of w.entries()){S.sort((W,C)=>C.size-W.size);const F=S.length?S[0].size:0,L=s>0?F*s:0,K=Math.min(S.length,r);for(let W=0;W<K;W++){const C=S[W];if(C.size<L){f&&W>0&&console.log(`[rank-filter] class ${k} #${W}: size=${C.size} DROP (below ${(s*100).toFixed(0)}% floor)`);break}if(W>0&&u){const R=v[C.i],A=R<=a;if(f&&console.log(`[rank-filter] class ${k} #${W}: size=${C.size} surfDist=${R} -> ${A?"KEEP":"DROP (too far)"}`),!A)continue}x[C.i]=1}}const P=new Uint32Array(t+1).fill(0);for(let k=1;k<=t;k++)x[k]&&(P[k]=d[k]);return this.finalize_volume(n,o,P,t,i,e,l)}};function ts(e,t,n=!1){const r=t[0]|0,s=t[1]|0,o=t[2]|0,i=r*s,a=i*o;if(a<1||e.length<a)return e;const f=new Uint32Array(a);let l=0;for(let p=0;p<a;p++)e[p]>0&&l++;if(l===0)return e;const m=new Uint32Array(l);let d=0,c=0,u=0;for(let p=0;p<a;p++){if(e[p]<=0||f[p]!==0)continue;d++;let y=0,$=0;for(m[$++]=p,f[p]=d;y<$;){const h=m[y++],_=Math.floor(h/i),z=h-_*i,b=Math.floor(z/r),g=z-b*r,v=_>0?-1:0,M=_+1<o?1:0,w=b>0?-1:0,x=b+1<s?1:0,P=g>0?-1:0,k=g+1<r?1:0;for(let S=v;S<=M;S++){const F=(_+S)*i;for(let L=w;L<=x;L++){const K=F+(b+L)*r;for(let W=P;W<=k;W++){if(W===0&&L===0&&S===0)continue;const C=K+(g+W);e[C]>0&&f[C]===0&&(f[C]=d,m[$++]=C)}}}}$>u&&(u=$,c=d)}for(let p=0;p<a;p++)f[p]!==c||c===0?e[p]=0:n&&(e[p]=1);return e}function ns(e,t,n){if(t===n)return 1/0;const r=(e[n]+n*n-(e[t]+t*t))/(2*n-2*t);return Number.isNaN(r)?1/0:r}function Jn(e,t,n,r,s,o){const i=n>0?n:1;if(i!==1){const l=1/(i*i);for(let m=0;m<t;m++)e[m]*=l}let a=0;o[0]=0,s[0]=-1/0,s[1]=1/0;for(let l=1;l<t;l++){let m=ns(e,o[a],l);for(;a>0&&m<=s[a];)a--,m=ns(e,o[a],l);a++,o[a]=l,s[a]=m,s[a+1]=1/0}a=0;for(let l=0;l<t;l++){for(;s[a+1]<l;)a++;const m=l-o[a];r[l]=m*m+e[o[a]]}const f=i*i;for(let l=0;l<t;l++)e[l]=r[l]*f}function Uo(e,t,n,r,s,o){const i=t[0]|0,a=t[1]|0,f=t[2]|0;if(!(o>0)||i<2||a<2||f<1)return e;const l=i*a,m=l*f,d=new Float32Array(m),c=Math.max(i,a,f),u=new Float32Array(c),p=new Float32Array(c+2),y=new Float32Array(c+2),$=new Int32Array(c+2);for(let b=0;b<m;b++)d[b]=e[b]>0?0:1/0;const h=Math.abs(n)||1,_=Math.abs(r)||1,z=Math.abs(s)||1;for(let b=0;b<f;b++)for(let g=0;g<a;g++){const v=b*l+g*i;for(let M=0;M<i;M++)u[M]=d[v+M];Jn(u,i,h,p,y,$);for(let M=0;M<i;M++)d[v+M]=u[M]}for(let b=0;b<f;b++){const g=b*l;for(let v=0;v<i;v++){for(let M=0;M<a;M++)u[M]=d[g+M*i+v];Jn(u,a,_,p,y,$);for(let M=0;M<a;M++)d[g+M*i+v]=u[M]}}for(let b=0;b<a;b++){const g=b*i;for(let v=0;v<i;v++){const M=g+v;for(let w=0;w<f;w++)u[w]=d[w*l+M];Jn(u,f,z,p,y,$);for(let w=0;w<f;w++)d[w*l+M]=u[w]}}for(let b=0;b<m;b++)e[b]=e[b]>0||Math.sqrt(d[b])<o?1:0;return e}function Lo(e){if(!e?.length)throw new Error("Segmentation volume is empty.");let t=0;if((e instanceof Uint8Array||e instanceof Uint8ClampedArray)&&(e.byteOffset&3)===0&&e.length>=4){const n=e.length>>2,r=new Uint32Array(e.buffer,e.byteOffset,n);for(let s=0;s<n;s++){const o=r[s];o!==0&&(o&255&&t++,o&65280&&t++,o&16711680&&t++,o&4278190080&&t++)}for(let s=n<<2;s<e.length;s++)e[s]!==0&&t++}else if(e instanceof Uint8Array||e instanceof Uint8ClampedArray||e instanceof Uint16Array||e instanceof Uint32Array)for(let n=0;n<e.length;n++)e[n]!==0&&t++;else for(let n=0;n<e.length;n++){const r=e[n];if(!Number.isFinite(r)||r<0)throw new Error(`Segmentation contains an invalid label at voxel ${n}: ${r}.`);r!==0&&t++}if(t===0)throw new Error("Segmentation volume contains no foreground labels.");if(t>e.length*.95)throw new Error(`Segmentation fills ${(100*t/e.length).toFixed(1)}% of the volume; GPU output is unusable.`)}function rs(e,t=.05,n=.95){const r=e.length;if(r===0)return{qmin:0,qmax:0};if(e instanceof Uint8Array||e instanceof Uint8ClampedArray){const f=Math.max(0,Math.min(r-1,Math.floor(r*t))),l=Math.max(0,Math.min(r-1,Math.ceil(r*n)-1)),m=new Uint32Array(256);for(let $=0;$<r;$++)m[e[$]]++;let d=0,c=0,u=0,p=!1,y=!1;for(let $=0;$<256;$++){const h=m[$];if(h!==0&&(d+=h,!p&&d>f&&(c=$,p=!0),!y&&d>l&&(u=$,y=!0),p&&y))break}return{qmin:c,qmax:u}}const s=Math.min(1e5,r),o=Math.max(0,Math.min(s-1,Math.floor(s*t))),i=Math.max(0,Math.min(s-1,Math.ceil(s*n)-1)),a=new Float64Array(s);if(s>=r)a.set(e);else{const f=.6180339887498949;let l=.5;for(let m=0;m<s;m++)l+=f,l>=1&&(l-=1),a[m]=e[Math.floor(l*r)]}return a.sort(),{qmin:a[o],qmax:a[i]}}function Io(e,t=.02,n=.98){const r=e.length;if(r===0)return{qmin:0,qmax:0};const s=new Uint32Array(256);for(let f=0;f<r;f++)s[e[f]]++;const o=new Float64Array(256);let i=0;for(let f=0;f<256;f++)i+=s[f],o[f]=i;const a=f=>{const l=f*(r-1),m=Math.floor(l),d=l-m;let c=0;for(;c<255&&o[c]<=m;)c++;let u=c;for(;u<255&&o[u]<=m+1;)u++;return d<.5?c+(u-c)*d:u-(u-c)*(1-d)};return{qmin:a(t),qmax:a(n)}}function Wo(e,t,n){const r=e.length,s=new Float32Array(r);if(e instanceof Uint8Array||e instanceof Uint8ClampedArray){const o=new Float32Array(256);for(let i=0;i<256;i++)o[i]=(i-t)/n;for(let i=0;i<r;i++)s[i]=o[e[i]];return s}for(let o=0;o<r;o++)s[o]=(e[o]-t)/n;return s}function qo(e,t,n,r){const s=t[0]|0,o=t[1]|0,i=t[2]|0,a=s*o*i,f=new r(a);if(n[0]===2&&n[1]===1&&n[2]===0&&a===e.length){const $=o*i,h=o*s,_=16;for(let z=0;z<o;z++){const b=z*i,g=z*s;for(let v=0;v<s;v+=_){const M=Math.min(v+_,s);for(let w=0;w<i;w+=_){const x=Math.min(w+_,i);for(let P=v;P<M;P++){let k=P*$+b+w,S=w*h+g+P;for(let F=w;F<x;F++,k++,S+=h)f[S]=e[k]}}}}return f}const l=[s,o,i],m=[l[n[0]],l[n[1]],l[n[2]]],d=[o*i,i,1],c=d[n[0]],u=d[n[1]],p=d[n[2]];let y=0;for(let $=0;$<m[0];$++){const h=$*c;for(let _=0;_<m[1];_++){const z=h+_*u;for(let b=0;b<m[2];b++,y++)f[y]=e[z+b*p]}}return f}function ss(e,t=[256,256,256],n=[2,1,0]){return qo(e,t,n,Float32Array)}var Lt=1e-8;function Qt(e,t,n){return Math.max(t,Math.min(n,e))}function Eo(e,t,n){const[r,s,o]=e,i=r.length,a=new Uint8Array(i);let f=0;for(let b=0;b<i;b++)Math.max(0,r[b])+Math.max(0,s[b])+Math.max(0,o[b])>=n&&(a[b]=1,f++);const[l,m,d]=t;if(l<2||m<2||d<1)return{componentCount:0,removedVoxels:0,supportMask:a};const c=l===256&&m===256,u=new Uint32Array(f),p=l*m;let y=0,$=0,h=0,_=0;for(let b=0;b<i;b++){if(a[b]!==1)continue;_++;const g=y;u[y++]=b,a[b]=2;for(let v=g;v<y;v++){const M=u[v],w=c?M&255:M%l,x=c?M>>>8&255:Math.floor(M/l)%m;w>0&&a[M-1]===1&&(a[M-1]=2,u[y++]=M-1),w+1<l&&a[M+1]===1&&(a[M+1]=2,u[y++]=M+1),x>0&&a[M-l]===1&&(a[M-l]=2,u[y++]=M-l),x+1<m&&a[M+l]===1&&(a[M+l]=2,u[y++]=M+l),M>=p&&a[M-p]===1&&(a[M-p]=2,u[y++]=M-p),M+p<i&&a[M+p]===1&&(a[M+p]=2,u[y++]=M+p)}y-g>=h-$&&($=g,h=y)}let z=0;if(_>1)for(let b=0;b<y;b++){if(b>=$&&b<h)continue;const g=u[b];r[g]=0,s[g]=0,o[g]=0,a[g]=0,z++}return{componentCount:_,removedVoxels:z,supportMask:a}}function To([e,t,n],r,{minSupport:s,priorPower:o},i=null){const a=!!(i&&s>0&&s<=1);let f=0;for(let y=0;y<r.length;y++){if(a&&i[y]!==2)continue;const $=Math.max(0,e[y])+Math.max(0,t[y])+Math.max(0,n[y]);Math.min($,1)>=s&&Number.isFinite(r[y])&&f++}const l=new Uint32Array(f),m=new Float64Array(f),d=f*36<=192*2**20?f:0,c=new Float64Array(d),u=new Float64Array(d),p=new Float64Array(d);for(let y=0,$=0;y<r.length;y++){if(a&&i[y]!==2)continue;const h=Math.max(0,e[y]),_=Math.max(0,t[y]),z=Math.max(0,n[y]),b=h+_+z,g=Math.min(b,1);!(g>=s)||!Number.isFinite(r[y])||(l[$]=y,m[$]=r[y]-0,d&&(c[$]=g*Math.pow(z/b,o),u[$]=g*Math.pow(h/b,o),p[$]=g*Math.pow(_/b,o)),$++)}return{indices:l,values:m,weightCsf:c,weightGm:u,weightWm:p,volumes:[e,t,n]}}function os([e,t,n],r,s,o){const i=Math.max(0,e[r]),a=Math.max(0,t[r]),f=Math.max(0,n[r]),l=i+a+f,m=Math.min(l,1);o[0]=m*Math.pow(f/l,s),o[1]=m*Math.pow(i/l,s),o[2]=m*Math.pow(a/l,s)}function as({indices:e,values:t,weightCsf:n,weightGm:r,weightWm:s,volumes:o},{minSeparation:i,sigmaFloor:a,priorPower:f},l=!1){const m=n.length===0?new Float64Array(3):null,d=new Float64Array(3),c=new Float64Array(3);for(let $=0;$<t.length;$++){const h=t[$];m&&os(o,e[$],f,m);const _=m?m[0]:n[$],z=m?m[1]:r[$],b=m?m[2]:s[$];d[0]+=_*h,c[0]+=_,d[1]+=z*h,c[1]+=z,d[2]+=b*h,c[2]+=b}if(c.some($=>$<100))return{applied:!1,reason:"too few high-confidence tissue voxels"};const u=Array.from(d,($,h)=>$/c[h]);if(!(u[0]+i<u[1]&&u[1]+i<u[2]))return{applied:!1,reason:`implausible T1 tissue ordering (${u.map($=>$.toFixed(3)).join(", ")})`};if(l)return{applied:!0,means:u};const p=new Float64Array(3);for(let $=0;$<t.length;$++){const h=t[$];m&&os(o,e[$],f,m);const _=m?m[0]:n[$],z=m?m[1]:r[$],b=m?m[2]:s[$],g=h-u[0],v=h-u[1],M=h-u[2];p[0]+=_*g*g,p[1]+=z*v*v,p[2]+=b*M*M}const y=Array.from(p,($,h)=>Math.sqrt(Math.max(a*a,$/c[h])));return{applied:!0,means:u,sigmas:y}}function Ro(e,t,n,r,{minSupport:s,block:o,smoothingPasses:i},a=null){const[f,l,m]=e,[d,c,u]=n,p=!!(a&&s>0&&s<=1),y=Math.ceil(d/o),$=Math.ceil(c/o),h=Math.ceil(u/o),_=y*$*h,z=new Float64Array(_),b=new Float64Array(_),[g,v,M]=r,w=d*c;for(let W=0;W<u;W++){const C=Math.floor(W/o);for(let R=0;R<c;R++){const A=Math.floor(R/o);let U=W*w+R*d;const E=(C*$+A)*y;for(let B=0;B<d;B++,U++){if(p&&a[U]!==2)continue;const O=Math.max(0,f[U]),D=Math.max(0,l[U]),J=Math.max(0,m[U]),Y=O+D+J,V=Math.min(Y,1);if(!(V>=s)||!Number.isFinite(t[U]))continue;const re=O/Y,X=D/Y,oe=J/Y,N=oe*g+re*v+X*M,j=V*(oe*oe+re*re+X*X),G=E+Math.floor(B/o);z[G]+=j*(t[U]-N),b[G]+=j}}}let x=new Float32Array(_),P=new Uint8Array(_);for(let W=0;W<_;W++)b[W]>1&&(x[W]=z[W]/b[W],P[W]=1);for(let W=0;W<i;W++){const C=new Float32Array(_),R=new Uint8Array(_);for(let A=0;A<h;A++)for(let U=0;U<$;U++)for(let E=0;E<y;E++){let B=0,O=0;for(let J=-1;J<=1;J++){const Y=A+J;if(!(Y<0||Y>=h))for(let V=-1;V<=1;V++){const re=U+V;if(!(re<0||re>=$))for(let X=-1;X<=1;X++){const oe=E+X;if(oe<0||oe>=y)continue;const N=(Y*$+re)*y+oe;P[N]&&(B+=x[N],O++)}}}const D=(A*$+U)*y+E;O>0&&(C[D]=B/O,R[D]=1)}x=C,P=R}const k=(W,C)=>{const R=new Int32Array(W),A=new Int32Array(W),U=new Float32Array(W);for(let E=0;E<W;E++){const B=Qt((E+.5)/o-.5,0,C-1);R[E]=Math.floor(B),A[E]=Math.min(R[E]+1,C-1),U[E]=B-R[E]}return{low:R,high:A,t:U}},S=k(d,y),F=k(c,$),L=k(u,h),K=d===256&&c===256;return W=>{let C,R,A;if(K)A=W>>>16,R=W>>>8&255,C=W&255;else{A=Math.floor(W/w);const se=W-A*w;R=Math.floor(se/d),C=se-R*d}const U=S.low[C],E=S.high[C],B=S.t[C],O=(L.low[A]*$+F.low[R])*y,D=(L.low[A]*$+F.high[R])*y,J=(L.high[A]*$+F.low[R])*y,Y=(L.high[A]*$+F.high[R])*y,V=x[O+U]+(x[O+E]-x[O+U])*B,re=x[D+U]+(x[D+E]-x[D+U])*B,X=x[J+U]+(x[J+E]-x[J+U])*B,oe=x[Y+U]+(x[Y+E]-x[Y+U])*B,N=F.t[R],j=V+(re-V)*N,G=X+(oe-X)*N;return j+(G-j)*L.t[A]}}function yn(e,t,n,r){const s=(e-t)/n;return-.5*s*s-r}function No(e,t,n,r={}){const{catLiteMinSupport:s=.03,catLitePurePriorPower:o=3,catLiteMinMeanSeparation:i=.035,catLiteSigmaFloor:a=.025,catLiteBiasBlockSize:f=16,catLiteBiasSmoothPasses:l=3,catLitePriorStrength:m=.8,catLiteIntensityStrength:d=.75,catLiteMixelPrior:c=.35,catLiteCsfWmMixelPrior:u=6,catLiteSpatialWeight:p=.25}=r,y={priorPower:o,minSupport:s,minSeparation:i,sigmaFloor:a},[$,h,_]=n,z=t.length,b=s>0&&s<=1,{componentCount:g,removedVoxels:v,supportMask:M}=Eo(e,n,s),w={componentCount:g,removedVoxels:v},x=To(e,t,y,M),P=as(x,y,!0);if(!P.applied)return{tissues:e,stats:P};const k=Ro(e,t,n,P.means,{minSupport:s,block:f,smoothingPasses:l},M);for(let T=0;T<x.indices.length;T++){const I=x.indices[T];x.values[T]=t[I]-k(I)}const S=as(x,y);if(!S.applied)return{tissues:e,stats:S};x.indices=x.weightCsf=x.weightGm=x.weightWm=null;const[F,L,K]=S.means,[W,C,R]=S.sigmas,[A,U,E]=e,B=new Float32Array(z),O=new Float32Array(z),D=new Float32Array(z),J=$*h,Y=.5*(F+L),V=.5*(L+K),re=.5*(F+K),X=Math.sqrt((L-F)**2/12+.5*(W**2+C**2)),oe=Math.sqrt((K-L)**2/12+.5*(C**2+R**2)),N=Math.sqrt((K-F)**2/12+.5*(W**2+R**2)),j=Math.log(W),G=Math.log(C),se=Math.log(R),ne=Math.log(X),ce=Math.log(oe),Z=Math.log(N);let ee=0;for(let T=0;T<_;T++)for(let I=0;I<h;I++){let H=T*J+I*$;for(let ie=0;ie<$;ie++,H++){if(b&&M[H]!==2)continue;const le=Math.max(0,A[H]),pe=Math.max(0,U[H]),ue=Math.max(0,E[H]),he=le+pe+ue,_e=Math.min(he,1);if(!(_e>=s)||!Number.isFinite(t[H]))continue;let be=le/he,me=pe/he,te=ue/he;if(p>0){let dt=0,Te=0,Ue=0,De=0;if(ie>0){const Ie=H-1,ot=Math.max(0,A[Ie]),Me=Math.max(0,U[Ie]),it=Math.max(0,E[Ie]),ge=ot+Me+it;ge>Lt&&(dt+=ot/ge,Te+=Me/ge,Ue+=it/ge,De++)}if(ie+1<$){const Ie=H+1,ot=Math.max(0,A[Ie]),Me=Math.max(0,U[Ie]),it=Math.max(0,E[Ie]),ge=ot+Me+it;ge>Lt&&(dt+=ot/ge,Te+=Me/ge,Ue+=it/ge,De++)}if(I>0){const Ie=H-$,ot=Math.max(0,A[Ie]),Me=Math.max(0,U[Ie]),it=Math.max(0,E[Ie]),ge=ot+Me+it;ge>Lt&&(dt+=ot/ge,Te+=Me/ge,Ue+=it/ge,De++)}if(I+1<h){const Ie=H+$,ot=Math.max(0,A[Ie]),Me=Math.max(0,U[Ie]),it=Math.max(0,E[Ie]),ge=ot+Me+it;ge>Lt&&(dt+=ot/ge,Te+=Me/ge,Ue+=it/ge,De++)}if(T>0){const Ie=H-J,ot=Math.max(0,A[Ie]),Me=Math.max(0,U[Ie]),it=Math.max(0,E[Ie]),ge=ot+Me+it;ge>Lt&&(dt+=ot/ge,Te+=Me/ge,Ue+=it/ge,De++)}if(T+1<_){const Ie=H+J,ot=Math.max(0,A[Ie]),Me=Math.max(0,U[Ie]),it=Math.max(0,E[Ie]),ge=ot+Me+it;ge>Lt&&(dt+=ot/ge,Te+=Me/ge,Ue+=it/ge,De++)}if(De){const Ie=1-p;be=Ie*be+p*dt/De,me=Ie*me+p*Te/De,te=Ie*te+p*Ue/De}}const fe=x.values[ee++],Be=m*Math.log(te+Lt)+d*yn(fe,F,W,j),ye=m*Math.log(be+Lt)+d*yn(fe,L,C,G),Ge=m*Math.log(me+Lt)+d*yn(fe,K,R,se),He=m*Math.log(c*2*Math.sqrt(te*be)+Lt)+d*yn(fe,Y,X,ne),nt=m*Math.log(c*2*Math.sqrt(be*me)+Lt)+d*yn(fe,V,oe,ce),Mt=m*Math.log(u*2*Math.sqrt(te*me)*(1-be)**2+Lt)+d*yn(fe,re,N,Z),ft=Math.max(Be,ye,Ge,He,nt,Mt),ct=Math.exp(Be-ft),kt=Math.exp(ye-ft),at=Math.exp(Ge-ft),Ke=Math.exp(He-ft),mt=Math.exp(nt-ft),yt=Math.exp(Mt-ft),pt=ct+kt+at+Ke+mt+yt,vt=Qt((fe-F)/(L-F),0,1),Xt=Qt((K-fe)/(K-L),0,1),xt=Qt((fe-F)/(K-F),0,1),Gt=(kt+Ke*vt+mt*Xt)/pt,Yt=(at+mt*(1-Xt)+yt*xt)/pt,zt=(ct+Ke*(1-vt)+yt*(1-xt))/pt,Bt=Math.min(te,me),Ze=Qt((Bt-be)/(Bt+Lt),0,1),je=(1-Qt(4*te*me,0,1)*Ze)**2;B[H]=Qt(Gt*_e*je,0,1);const Vt=(1-Gt*je)/Math.max(Yt+zt,Lt);O[H]=Qt(Yt*Vt*_e,0,1),D[H]=Qt(zt*Vt*_e,0,1)}}return{tissues:[B,O,D],stats:{applied:!0,tissueMeans:{csf:F,gray:L,white:K},tissueSigmas:{csf:W,gray:C,white:R},supportCleanup:w}}}var er="v1",Oo="brainchop:webgpu-v4-profile:",Go=720*60*60*1e3,fn=256*64,Ht=4,is=2,ls=Ht*64*is,cs=16,Do=120,Vo=140,tr=220,nr=550,Ho=450,vn=64,rr=8,En=vn+2*rr,sr=24,qt=12,xn=6,or=9*sr*3*xn,ar=or/2,Tn=new Map,us=new WeakMap,ir=new WeakMap,Xo=/\b(?:nvidia|geforce|rtx|gtx|quadro|tesla|amd|radeon|ryzen|intel|arc|uhd|iris|apple|qualcomm|adreno|arm|mali|immortalis|powervr|microsoft|swiftshader|llvmpipe|mesa)\b/i;function fs(e){return e?.navigator??globalThis.navigator}function lr(e){if(e&&"storage"in e)return e.storage;try{return globalThis.localStorage??null}catch{return null}}function ms(e){if(e&&typeof e.search=="string")return e.search;try{return globalThis.location?.search||""}catch{return""}}function Rn(e){return typeof e?.now=="function"?e.now():typeof globalThis.performance?.now=="function"?globalThis.performance.now():Date.now()}function ps(e){return typeof e?.wallNow=="function"?e.wallNow():Date.now()}function ds(e,t=void 0){const n=String(t??globalThis.navigator?.userAgentData?.platform??globalThis.navigator?.platform??""),r=String(e||"");return/Linux/i.test(n)&&!/Android/i.test(n)&&/\bMesa\b/i.test(r)&&/\bIntel\b/i.test(r)&&/\b(?:WHL|KBL|CFL|SKL|CML)\b/i.test(r)}function cr(e){const t=String(e||"").trim().toLowerCase();return t==="single"||t==="pipelined"||t==="paced"||t==="calibrate"?t:t==="chunked"?"paced":""}function gs(e=void 0){let t=e;if(t===void 0)try{t=globalThis.location?.search||""}catch{t=""}const n={mode:"",exec:""};if(!t)return n;try{const r=new URLSearchParams(t),s=(r.get("webgpuMode")||"").trim().toLowerCase();s==="low-memory"||s==="lowmem"||s==="low_memory"||s==="128m"?n.mode="low-memory":s==="standard"||s==="std"?n.mode="standard":s==="recalibrate"||s==="reset"?n.mode="recalibrate":s==="probe"&&(n.mode="probe"),n.exec=cr(r.get("webgpuExec"))}catch{}return n}function Yo(e,t=null){if(!e)return"";if(typeof e.__glRenderer=="string")return e.__glRenderer;let n="";try{const r=fs(t),s=!!(r&&/Firefox/i.test(r.userAgent||"")),i=(typeof globalThis.OffscreenCanvas<"u"?new globalThis.OffscreenCanvas(1,1):typeof globalThis.document<"u"?globalThis.document.createElement("canvas"):null)?.getContext?.("webgl2",{powerPreference:"high-performance"});if(i){if(s)n=String(i.getParameter(i.RENDERER)||"");else{const a=i.getExtension("WEBGL_debug_renderer_info");n=String((a?i.getParameter(a.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER))||"")}i.getExtension("WEBGL_lose_context")?.loseContext()}}catch{}return e.__glRenderer=n,n}function Fn(e,t=null){const n=e?.__adapterInfo||e?.adapterInfo||{},r=String(n.vendor||"").trim().toLowerCase(),s=String(n.architecture||"").trim().toLowerCase(),o=fs(t),i=String(t?.userAgent??o?.userAgent??""),a=String(t?.platform??o?.userAgentData?.platform??o?.platform??""),f=/Android/i.test(i)||/Android/i.test(a),l=!f&&(r==="apple"||/Mac|iPhone|iPad|iPod/i.test(`${a} ${i}`)&&!["intel","amd","nvidia","microsoft"].includes(r)),m=!l&&!f&&(/Win/i.test(a)||/Windows/i.test(i)),d=!l&&!m&&!f&&(/Linux/i.test(a)||/Linux/i.test(i)),c=typeof e?.__glRenderer=="string"?e.__glRenderer:!l&&!r&&!t?.skipGlProbe?Yo(e,t):"",u=`${n.device||""} ${n.description||""} ${c}`.trim(),p=r||(/\bintel\b/i.test(c)?"intel":/\bmicrosoft\b|\bbasic render\b/i.test(c)?"microsoft":/\bnvidia\b/i.test(c)?"nvidia":/\bamd\b|\bradeon\b/i.test(c)?"amd":""),y=m&&(p==="microsoft"||p==="intel"&&!/\bArc\b/i.test(u)&&(/^gen-(9|11|12lp)/i.test(s)||/(?:UHD|HD)\s+Graphics|Iris(?:\(R\))?\s*(?:Plus|Xe)|Pentium|Celeron/i.test(u))),$=d&&(r==="intel"&&/^gen-9/i.test(s)||ds(c,a||"Linux")||ds(n.description||"",a||"Linux")||p==="intel"&&/\b(?:WHL|KBL|CFL|SKL|CML|UHD\s+Graphics\s+6[0-3]0|HD\s+Graphics\s+(?:5[0-3]0|6[0-3]0))\b/i.test(u)),h=`${r} ${s} ${n.device||""} ${n.description||""} ${c}`.trim(),_=!l&&(h===""||/^(?:brave|unknown|generic|webgl|webgpu|default|\s)+$/i.test(h)||!Xo.test(h)&&!/^gen-\d/i.test(s));return{os:l?"apple":m?"windows":f?"android":d?"linux":"other",vendor:p,arch:s,desc:u,glRenderer:c,isApple:l,isWindows:m,isLinux:d,isAndroid:f,isWindowsSharedIgpu:y,isLinuxIntelGen9:$,isMaskedGpu:_}}function ur(e,t=null,n=null){const r=t||Fn(e,n),s=e?.limits||{},o=e?.__adapterInfo||e?.adapterInfo||{},i=Number(s.maxStorageBufferBindingSize||0),a=Number(s.maxBufferSize||0),f=e?.features?.has?.("shader-f16")?1:0,m=!!e?.features?.has?.("subgroups")?`${o.subgroupMinSize|0}-${o.subgroupMaxSize|0}`:"none",c=([o.vendor||"",o.architecture||"",o.device||"",o.description||"",r.glRenderer||""].map(u=>String(u).trim().toLowerCase().replace(/\s+/g," ")).filter(Boolean).join("/")||"masked").slice(0,96);return[er,r.os,`sb=${i}`,`mb=${a}`,`f16=${f}`,`sg=${m}`,c].join("|")}function fr(e){return`${Oo}${e}`}function _s(e){return e?(e.__v4Calib instanceof Map||(e.__v4Calib=new Map),e.__v4Calib):null}function mr(e,t){return!e||typeof e!="object"||e.version!==er||typeof e.ts!="number"||!Number.isFinite(e.ts)?!1:t-e.ts<=Go}function hs(e,t,n=null){const r=ps(n),s=_s(e),o=s?.get(t);if(mr(o,r))return o;const i=lr(n);let a=!1;if(i&&typeof i.getItem=="function")try{const f=i.getItem(t);if(a=!0,f){const l=JSON.parse(f);if(mr(l,r))return s?.set(t,l),l}}catch{}if(!a){const f=Tn.get(t);if(mr(f,r))return s?.set(t,f),f}return null}function ws(e,t,n,r=null){const s={version:er,ts:ps(r),...n};_s(e)?.set(t,s);const o=lr(r);let i=!1;if(o&&typeof o.setItem=="function")try{o.setItem(t,JSON.stringify(s)),i=!0}catch{}return i||Tn.set(t,s),s}function Zo(e,t=null,n=null){const r=t||(e?fr(ur(e,null,n)):null);if(e&&(e.__v4Calib instanceof Map&&(r?e.__v4Calib.delete(r):e.__v4Calib.clear()),delete e.__v4WinCalibrated,delete e.__v4WinFast,delete e.__v4MsPerStrip,delete e.__v4Recalibrated,delete e.__v4ProbeDone),r){Tn.delete(r);const s=lr(n);if(s&&typeof s.removeItem=="function")try{s.removeItem(r)}catch{}}else Tn.clear()}function Ko(e,t="device-lost",n=null){if(!e)return null;const r=Fn(e,n),s=ur(e,r,n),o=fr(s),i=hs(e,o,n)||{};return ws(e,o,{...i,safeMode:"low-memory-paced",safeModeReason:t},n)}function bs(e){return!Number.isFinite(e)||e>=nr?"very-slow":e>=tr?"moderate":"fast"}function jo(e){const t=qt*En,n=qt*vn,r=(o,i)=>Array.from({length:o},(a,f)=>i(f)).join("");if(e){const o=()=>{let a="";for(let f=0;f<xn;f+=2){const l=f*4,m=f/2;a+=`      {
        let wp0 = w_eff_u[wbu + ${m}u];
        let wp1 = w_eff_u[wbu + ${3+m}u];
        let wp2 = w_eff_u[wbu + ${6+m}u];
        let w0a = u4_lo(wp0);
        let w0b = u4_hi(wp0);
        let w1a = u4_lo(wp1);
        let w1b = u4_hi(wp1);
        let w2a = u4_lo(wp2);
        let w2b = u4_hi(wp2);
        a_${l}     = fma(vn, vec4<f16>(w0a.x), fma(vc, vec4<f16>(w1a.x), fma(vp, vec4<f16>(w2a.x), a_${l})));
        a_${l+1} = fma(vn, vec4<f16>(w0a.y), fma(vc, vec4<f16>(w1a.y), fma(vp, vec4<f16>(w2a.y), a_${l+1})));
        a_${l+2} = fma(vn, vec4<f16>(w0a.z), fma(vc, vec4<f16>(w1a.z), fma(vp, vec4<f16>(w2a.z), a_${l+2})));
        a_${l+3} = fma(vn, vec4<f16>(w0a.w), fma(vc, vec4<f16>(w1a.w), fma(vp, vec4<f16>(w2a.w), a_${l+3})));
        a_${l+4} = fma(vn, vec4<f16>(w0b.x), fma(vc, vec4<f16>(w1b.x), fma(vp, vec4<f16>(w2b.x), a_${l+4})));
        a_${l+5} = fma(vn, vec4<f16>(w0b.y), fma(vc, vec4<f16>(w1b.y), fma(vp, vec4<f16>(w2b.y), a_${l+5})));
        a_${l+6} = fma(vn, vec4<f16>(w0b.z), fma(vc, vec4<f16>(w1b.z), fma(vp, vec4<f16>(w2b.z), a_${l+6})));
        a_${l+7} = fma(vn, vec4<f16>(w0b.w), fma(vc, vec4<f16>(w1b.w), fma(vp, vec4<f16>(w2b.w), a_${l+7})));
      }
`}return a},i=(a,f)=>`    for (var ic : u32 = 0u; ic < ${qt}u; ic = ic + 1u) {
      let base = row_off + ic * ${En}u;
      let uL = ${a}[base - 2u];
      let uN = ${a}[base - 1u];
      let uC = ${a}[base];
      let uP = ${a}[base + 1u];
      let uR = ${a}[base + 2u];
      let u_neg = (uL >> 24u) | (uN << 8u);
      let u_pos = (uP >> 8u) | (uR << 24u);
      let vn = vec4<f16>(vec2<f16>(unpack2x16float(((u_neg & 0x00FF00FFu) << 2u) | 0x3C003C00u)), vec2<f16>(unpack2x16float(((u_neg >> 6u) & 0x03FC03FCu) | 0x3C003C00u))) - vec4<f16>(1.02734375h);
      let vc = vec4<f16>(vec2<f16>(unpack2x16float(((uC & 0x00FF00FFu) << 2u) | 0x3C003C00u)), vec2<f16>(unpack2x16float(((uC >> 6u) & 0x03FC03FCu) | 0x3C003C00u))) - vec4<f16>(1.02734375h);
      let vp = vec4<f16>(vec2<f16>(unpack2x16float(((u_pos & 0x00FF00FFu) << 2u) | 0x3C003C00u)), vec2<f16>(unpack2x16float(((u_pos >> 6u) & 0x03FC03FCu) | 0x3C003C00u))) - vec4<f16>(1.02734375h);
      let wbu = wbu_tap + (${f}u + ic) * 9u;
${o()}    }
`;return`enable f16;
@group(0) @binding(0) var<storage, read> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read_write> y8_0 : array<u32>;
@group(0) @binding(3) var<storage, read_write> y8_1 : array<u32>;
@group(0) @binding(4) var<uniform> w_eff_u : array<vec4<u32>, ${ar}>;

fn u4_lo(p : vec4<u32>) -> vec4<f16> {
  return vec4<f16>(vec2<f16>(unpack2x16float(p.x)), vec2<f16>(unpack2x16float(p.y)));
}
fn u4_hi(p : vec4<u32>) -> vec4<f16> {
  return vec4<f16>(vec2<f16>(unpack2x16float(p.z)), vec2<f16>(unpack2x16float(p.w)));
}

@compute @workgroup_size(64, 4, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let x4 = lid.x;
  let x_pad = x4 + ${rr}u;
  let y = (wid.y * 4u + lid.y) & 255u;
  let z = wid.z & ${Ht-1}u;
${r(sr,a=>`  var a_${a} = vec4<f16>(0.0h);
`)}
  for (var tap_yz : u32 = 0u; tap_yz < 9u; tap_yz = tap_yz + 1u) {
    let dz = tap_yz / 3u;
    let dy = tap_yz - dz * 3u;
    let z_src = (z + dz + ${Ht-1}u) & ${Ht-1}u;
    let y_src = (y + dy * 5u + 251u) & 255u;
    let row_off = (z_src * 256u + y_src) * ${t}u + x_pad;
    let wbu_tap = tap_yz * 216u;
${i("act8_0",0)}${i("act8_1",qt)}  }

  let y_base = (z * 256u + y) * ${n}u + x4;
${r(qt,a=>`  y8_0[y_base + ${a*vn}u] = pack4x8unorm(vec4<f32>(a_${a}) * 0.5 + vec4<f32>(0.5));
`)}${r(qt,a=>`  y8_1[y_base + ${a*vn}u] = pack4x8unorm(vec4<f32>(a_${a+qt}) * 0.5 + vec4<f32>(0.5));
`)}
}`}const s=(o,i,a)=>{const f=i*4,l=()=>r(3,d=>{const c=i+d,u=f+d*4;return`      {
        let w0 = w_eff[wb + ${c}u];
        let w1 = w_eff[wb + ${xn+c}u];
        let w2 = w_eff[wb + ${2*xn+c}u];
        a_${u}     = fma(vn, vec4<f32>(w0.x), fma(vc, vec4<f32>(w1.x), fma(vp, vec4<f32>(w2.x), a_${u})));
        a_${u+1} = fma(vn, vec4<f32>(w0.y), fma(vc, vec4<f32>(w1.y), fma(vp, vec4<f32>(w2.y), a_${u+1})));
        a_${u+2} = fma(vn, vec4<f32>(w0.z), fma(vc, vec4<f32>(w1.z), fma(vp, vec4<f32>(w2.z), a_${u+2})));
        a_${u+3} = fma(vn, vec4<f32>(w0.w), fma(vc, vec4<f32>(w1.w), fma(vp, vec4<f32>(w2.w), a_${u+3})));
      }
`}),m=(d,c)=>`    for (var ic : u32 = 0u; ic < ${qt}u; ic = ic + 1u) {
      let base = row_off + ic * ${En}u;
      let uL = ${d}[base - 2u];
      let uN = ${d}[base - 1u];
      let uC = ${d}[base];
      let uP = ${d}[base + 1u];
      let uR = ${d}[base + 2u];
      let u_neg = (uL >> 24u) | (uN << 8u);
      let u_pos = (uP >> 8u) | (uR << 24u);
      let vn = unpack4x8unorm(u_neg) - vec4<f32>(0.02745098);
      let vc = unpack4x8unorm(uC) - vec4<f32>(0.02745098);
      let vp = unpack4x8unorm(u_pos) - vec4<f32>(0.02745098);
      let wb = wb_tap + (${c}u + ic) * ${3*xn}u;
${l()}    }
`;return`@compute @workgroup_size(64, 4, 1)
fn ${o}(@builtin(local_invocation_id) lid : vec3<u32>,
                @builtin(workgroup_id) wid : vec3<u32>) {
  let x4 = lid.x;
  let x_pad = x4 + ${rr}u;
  let y = (wid.y * 4u + lid.y) & 255u;
  let z = wid.z & ${Ht-1}u;
${r(qt,d=>`  var a_${f+d} = vec4<f32>(0.0);
`)}
  for (var tap_yz : u32 = 0u; tap_yz < 9u; tap_yz = tap_yz + 1u) {
    let dz = tap_yz / 3u;
    let dy = tap_yz - dz * 3u;
    let z_src = (z + dz + ${Ht-1}u) & ${Ht-1}u;
    let y_src = (y + dy * 5u + 251u) & 255u;
    let row_off = (z_src * 256u + y_src) * ${t}u + x_pad;
    let wb_tap = tap_yz * ${sr*3*xn}u;
${m("act8_0",0)}${m("act8_1",qt)}  }

  let y_base = (z * 256u + y) * ${n}u + x4;
${r(qt,d=>`  ${a}[y_base + ${d*vn}u] = pack4x8unorm(a_${f+d} * 0.5 + vec4<f32>(0.5));
`)}
}`};return`@group(0) @binding(0) var<storage, read> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read_write> y8_0 : array<u32>;
@group(0) @binding(3) var<storage, read_write> y8_1 : array<u32>;
@group(0) @binding(4) var<storage, read> w_eff : array<vec4<f32>>;

${s("main_lo",0,"y8_0")}

${s("main_hi",3,"y8_1")}`}async function Qo(e,t){let n=us.get(e);n||(n=new Map,us.set(e,n));const r=t?"f16":"f32";let s=n.get(r);return s||(s=(async()=>{const o=jo(t),i=e.createShaderModule({code:o});if(t){const d=await e.createComputePipelineAsync({layout:"auto",compute:{module:i,entryPoint:"main"}});return{main:d,bgl:d.getBindGroupLayout(0)}}const a=e.createBindGroupLayout({entries:[{binding:0,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:1,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}},{binding:2,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:3,visibility:GPUShaderStage.COMPUTE,buffer:{type:"storage"}},{binding:4,visibility:GPUShaderStage.COMPUTE,buffer:{type:"read-only-storage"}}]}),f=e.createPipelineLayout({bindGroupLayouts:[a]}),[l,m]=await Promise.all([e.createComputePipelineAsync({layout:f,compute:{module:i,entryPoint:"main_lo"}}),e.createComputePipelineAsync({layout:f,compute:{module:i,entryPoint:"main_hi"}})]);return{lo:l,hi:m,bgl:a}})().catch(o=>{throw n.delete(r),o}),n.set(r,s)),s}async function Jo(e,t={}){const n=t?.env||null;if(typeof t?.runProbe=="function"){const o=await t.runProbe(e),i=Math.max(.1,Number(o?.probeMs??o)||.1),a=Number.isFinite(o?.estFullLayerMs)?o.estFullLayerMs:i*(fn/ls),f=o?.tier||bs(a);return{probeMs:i,warmupMs:Number(o?.warmupMs??0),estFullLayerMs:a,msPerStrip24:a/fn,tier:f,abortedEarly:!!o?.abortedEarly}}const r=ir.get(e);if(r)return r;const s=(async()=>{const o=t.hasF16!==void 0?!!t.hasF16:!!e?.features?.has?.("shader-f16"),i=GPUBufferUsage.STORAGE,a=GPUBufferUsage.COPY_DST,f=GPUBufferUsage.UNIFORM,l=Ht*256*qt*En*4,m=Ht*256*qt*vn*4,d=o?ar*16:or*16,c=[],u=typeof e.pushErrorScope=="function"&&typeof e.popErrorScope=="function";let p=!1;u&&(e.pushErrorScope("out-of-memory"),p=!0);try{const y=await Qo(e,o),$=(S,F)=>{const L=e.createBuffer({size:S,usage:F});return c.push(L),L},h=$(l,i),_=$(l,i),z=$(m,i),b=$(m,i),g=$(d,(o?f:i)|a);if(o){const S=new Uint32Array(ar*4);S.fill(2703171871),e.queue.writeBuffer(g,0,S)}else{const S=new Float32Array(or*4);for(let F=0;F<S.length;F++)S[F]=F&1?-.01:.01;e.queue.writeBuffer(g,0,S)}const v=e.createBindGroup({layout:y.bgl,entries:[{binding:0,resource:{buffer:h}},{binding:1,resource:{buffer:_}},{binding:2,resource:{buffer:z}},{binding:3,resource:{buffer:b}},{binding:4,resource:{buffer:g}}]}),M=(S,F,L,K)=>{for(let W=0;W<K;W++)if(o){const C=S.beginComputePass();C.setPipeline(y.main),C.setBindGroup(0,v),C.dispatchWorkgroups(1,F,L),C.end()}else{const C=S.beginComputePass();C.setPipeline(y.lo),C.setBindGroup(0,v),C.dispatchWorkgroups(1,F,L),C.end();const R=S.beginComputePass();R.setPipeline(y.hi),R.setBindGroup(0,v),R.dispatchWorkgroups(1,F,L),R.end()}},w=e.createCommandEncoder();M(w,cs,1,1);const x=Rn(n);e.queue.submit([w.finish()]),await e.queue.onSubmittedWorkDone();const P=Math.max(.1,Rn(n)-x);let k;if(P>=Do){const S=P*(fn/cs);k={probeMs:P,warmupMs:P,estFullLayerMs:S,msPerStrip24:S/fn,tier:"very-slow",abortedEarly:!0}}else{const S=async()=>{const R=e.createCommandEncoder();M(R,64,Ht,is);const A=Rn(n);return e.queue.submit([R.finish()]),await e.queue.onSubmittedWorkDone(),Math.max(.1,Rn(n)-A)},F=await S(),L=F>=Vo?F:await S(),K=Math.min(F,L),W=K*(fn/ls),C=bs(W);k={probeMs:K,warmupMs:P,estFullLayerMs:W,msPerStrip24:W/fn,tier:C,abortedEarly:!1}}if(p){p=!1;const S=await e.popErrorScope();if(S){const F=new Error(`WebGPU micro-probe out of memory: ${S.message||"allocation failed"}`);throw F.oomError=S,F}}return k}finally{for(const y of c)try{y.destroy()}catch{}if(p){p=!1;try{await e.popErrorScope()}catch{}}}})().finally(()=>{ir.delete(e)});return ir.set(e,s),s}function $n(e){const t=Math.floor(e/1048576);return t<=128?"limit<=128M":`limit<=${t}M`}function pr(e,t){const n=Math.max(8,Number(t)||24)/24,r=Math.max(.35,Math.min(1,n*n));return Math.max(.005,Math.min(2,e*r))}function dr(e){return e.chan===15||Array.isArray(e.dilations)&&e.dilations.length>=25}async function ea(e,t,n=null,r={}){const s=r?.env||null,o=Fn(e,s),i=ur(e,o,s),a=fr(i),f=e?.limits||{},l=Math.min(f.maxStorageBufferBindingSize??1/0,f.maxBufferSize??1/0),m=t.cs>=8&&t.cs%4===0,d=Number(r.actBytes??0),c=Number(r.outBufBytes??0),u=(d>l||c>l)&&m,p=gs(ms(s)),y=cr(n?.webgpuExecMode)||p.exec,$=n?.forceLowMem128===!0?!0:n?.forceLowMem128===!1?!1:p.mode==="low-memory"?!0:p.mode==="standard"?!1:null,h=!!(p.mode==="low-memory"||p.mode==="standard"||p.exec||n?.__v4PlanReasonOverride==="url-override"),_=n?.forceProbe===!0||p.mode==="probe"&&!e?.__v4ProbeDone;(p.mode==="recalibrate"||p.mode==="probe"||n?.recalibrate===!0)&&!e?.__v4Recalibrated&&(Zo(e,a,s),e&&(e.__v4Recalibrated=!0));const b=({layout:F,execMode:L,reason:K,tier:W=null,probeMs:C=null,estFullLayerMs:R=null,msPerStrip:A=null,fromCache:U=!1,safeMode:E=!1})=>{const B=u||F==="LowMem128"&&m?"LowMem128":"std",O=B==="std"&&(L==="paced"||L==="calibrate");return e&&Number.isFinite(A)&&(e.__v4MsPerStrip=A),{layout:B,execMode:L,chunkableStd:O,reason:K,tier:W,probeMs:C,estFullLayerMs:R,msPerStrip:A,fromCache:U,safeMode:E,fingerprint:i,storageKey:a,platform:o}};if(n?.__v4PlanReasonOverride==="safe-mode-retry")return b({layout:m?"LowMem128":"std",execMode:"paced",reason:"safe-mode-retry",safeMode:!0});const g=_?null:hs(e,a,s);if(!_&&($!==null||y!=="")){let F="std",L="";u?(F="LowMem128",L=$n(l)):$===!0?F=m?"LowMem128":"std":$===!1?F="std":o.isWindowsSharedIgpu&&t.cs>=24&&m?(F="LowMem128",L="hint:win-igpu"):o.isLinuxIntelGen9&&dr(t)&&m?(F="LowMem128",L="hint:intel-gen9"):g?.safeMode==="low-memory-paced"&&m?(F="LowMem128",L="cached-safe-mode"):g?.tier==="very-slow"&&m&&(F="LowMem128",L="cached-probe");let K=y;K||($===!0?K="paced":o.isApple?K="single":o.isWindowsSharedIgpu||o.isLinuxIntelGen9?K="paced":K="pipelined");const W=u&&$===!1?$n(l):h?"url-override":L||"override";return b({layout:F,execMode:K,reason:W,tier:g?.tier??null,probeMs:g?.probeMs??null,estFullLayerMs:g?.estFullLayerMs??null,msPerStrip:g?.msPerStrip24?pr(g.msPerStrip24,t.cs):null,fromCache:!!g,safeMode:g?.safeMode==="low-memory-paced"})}if(o.isApple&&!_)return g?.safeMode==="low-memory-paced"?b({layout:m?"LowMem128":"std",execMode:"paced",reason:"cached-safe-mode",fromCache:!0,safeMode:!0}):b({layout:u?"LowMem128":"std",execMode:"single",reason:u?$n(l):"apple"});if(!_&&g?.safeMode==="low-memory-paced")return o.isWindows&&e&&(e.__v4WinCalibrated=!0,e.__v4WinFast=!1),b({layout:m?"LowMem128":"std",execMode:"paced",reason:"cached-safe-mode",tier:g.tier??"very-slow",probeMs:g.probeMs??null,estFullLayerMs:g.estFullLayerMs??null,msPerStrip:g.msPerStrip24?pr(g.msPerStrip24,t.cs):null,fromCache:!0,safeMode:!0});if(!_&&o.isLinuxIntelGen9){const F=u||dr(t)&&m;return b({layout:F?"LowMem128":"std",execMode:"paced",reason:u?$n(l):"hint:intel-gen9"})}if(!_&&o.isWindowsSharedIgpu){e&&(e.__v4WinCalibrated=!0,e.__v4WinFast=!1);const F=u||t.cs>=24&&m;return b({layout:F?"LowMem128":"std",execMode:"paced",reason:u?$n(l):"hint:win-igpu"})}let v=!_&&g&&g.tier&&Number.isFinite(g.estFullLayerMs)?g:null,M=!!v;if(!v)try{const F=await Jo(e,{hasF16:r.hasF16,runProbe:r.runProbe,env:s});v=ws(e,a,{tier:F.tier,probeMs:Number(F.probeMs.toFixed(2)),estFullLayerMs:Number(F.estFullLayerMs.toFixed(1)),msPerStrip24:F.msPerStrip24,safeMode:null,safeModeReason:null},s),e&&(e.__v4ProbeDone=!0),M=!1}catch(F){const L=vs(F,e,!!e?.__isLost);if(L==="device-lost")throw F;const K=L==="oom"?"very-slow":"moderate";v={tier:K,probeMs:null,estFullLayerMs:K==="very-slow"?nr:tr,msPerStrip24:(K==="very-slow"?nr:tr)/fn},M=!1}o.isWindows&&e&&(e.__v4WinCalibrated=!0,e.__v4WinFast=v.tier==="fast");const w=Number(v.estFullLayerMs),x=!!(o.isMaskedGpu&&v.tier==="moderate"&&w>=Ho&&(t.cs>=24||dr(t))),P=u||m&&(v.tier==="very-slow"||x),k=y||(v.tier==="fast"?"pipelined":"paced");let S;return u?S=$n(l):M?S="cached-probe":Number.isFinite(v.probeMs)?S=`probe:${Number(v.probeMs).toFixed(1)}ms`:S="probe:fallback",b({layout:P?"LowMem128":"std",execMode:k,reason:S,tier:v.tier,probeMs:v.probeMs??null,estFullLayerMs:Number.isFinite(w)?w:null,msPerStrip:Number.isFinite(v.msPerStrip24)?pr(v.msPerStrip24,t.cs):null,fromCache:M,safeMode:!1})}function ys(e,t=null){const n=t?` | ${t.chan}ch(cs=${t.cs})/${t.dilations?.length??"?"}L`:"",r=Number.isFinite(e?.estFullLayerMs)?` | est24ch=${Math.round(e.estFullLayerMs)}ms(${e.tier})`:"";return`[WebGPU-V4] layout=${e.layout} exec=${e.execMode} reason=${e.reason}${r}${n}`}async function ta(e,t=10){return e?e.__isLost?!0:!e.lost||typeof e.lost.then!="function"?!1:Promise.race([e.lost.then(n=>(e.__isLost=!0,n?.reason!=="destroyed")),new Promise(n=>setTimeout(()=>n(!!e.__isLost),t))]):!1}function vs(e,t=null,n=!1){if(n||t?.__isLost)return"device-lost";if(e?.oomError)return"oom";const r=String(e?.message||e||"");return/\bdevice(?:\s+was|\s+is)?\s+lost\b|gpu\s+reset|engine\s+reset|\btdr\b|instance\s+dropped|device\s+destroyed/i.test(r)?"device-lost":/out[- ]of[- ]memory|\boom\b|allocation\s+failed|failed\s+to\s+allocate|exceeds\s+device\s+limit|binding\s+size|maxbuffersize|maxstoragebufferbinding/i.test(r)?"oom":null}async function na({device:e,modelEntry:t,runAttempt:n,requestFreshDevice:r,onRetry:s=null,env:o=null}){try{return await n(e,t,{isRetry:!1})}catch(i){const a=!!t?.quantize8Bit,f=await ta(e,o?.lostWaitMs??10),l=vs(i,e,f),m=e?.__v4LastPlan||null,d=m?.layout==="LowMem128"&&m?.execMode==="paced"||t?.forceLowMem128===!0&&cr(t?.webgpuExecMode)==="paced",u=gs(ms(o)).mode==="standard"||t?.forceLowMem128===!1;if(!a||!l||d||u||typeof r!="function")throw i;Ko(e,l,o);const p=await r({failedDevice:e,failureKind:l,error:i});if(!p||p.__isLost){const $=new Error(`WebGPU safe-mode retry aborted: could not acquire fresh GPUDevice after ${l} (${i?.message||i})`);throw $.priorWebGpuError=i,$}const y={...t,forceLowMem128:!0,webgpuExecMode:"paced",__v4PlanReasonOverride:"safe-mode-retry"};s?.({failureKind:l,error:i,retryEntry:y,freshDevice:p});try{return await n(p,y,{isRetry:!0})}catch($){throw $&&typeof $=="object"&&($.priorWebGpuError=i),$}}}function ra(e){const t=e&32768?-1:1,n=(e&31744)>>10,r=e&1023;return n===0?t*Math.pow(2,-14)*(r/1024):n===31?r?NaN:t*(1/0):t*Math.pow(2,n-15)*(1+r/1024)}function sa(e){const t=new DataView(e),n=Number(t.getBigUint64(0,!0)),r=JSON.parse(new TextDecoder().decode(new Uint8Array(e,8,n))),s=8+n,o={};for(const[i,a]of Object.entries(r)){if(i==="__metadata__"){o.__metadata__=a;continue}const[f,l]=a.data_offsets,m=a.shape.reduce((c,u)=>c*u,1);let d;if(a.dtype==="F32")d=new Float32Array(e.slice(s+f,s+l));else if(a.dtype==="F16"){const c=new Uint16Array(e.slice(s+f,s+l));d=new Float32Array(m);for(let u=0;u<m;u++)d[u]=ra(c[u])}else if(a.dtype==="BF16"){const c=new Uint16Array(e.slice(s+f,s+l));d=new Float32Array(m);const u=new Uint32Array(1),p=new Float32Array(u.buffer);for(let y=0;y<m;y++)u[0]=c[y]<<16,d[y]=p[0]}else throw new Error(`safetensors: unsupported dtype ${a.dtype} for tensor '${i}'`);if(d.length!==m)throw new Error(`safetensors: tensor '${i}' has ${d.length} values, shape says ${m}`);o[i]={dtype:a.dtype,shape:a.shape,data:d}}return o}var gr={mindgrab:{chan:15,nhidden:25,nclass:2,hasAffine:!1,weightFloats:146237},"mindmap-fast":{chan:16,nhidden:13,nclass:18,hasAffine:!0,weightFloats:87218},mindmap:{chan:24,nhidden:13,nclass:18,hasAffine:!0,weightFloats:195522},mindsnap:{chan:24,nhidden:13,nclass:104,hasAffine:!0,weightFloats:197672}};function oa(e){return e==="16chan18cls"||e==="model16chan18cls"?"mindmap-fast":e}function aa(e,t){const n=oa(t),r=Object.hasOwn(gr,n)?gr[n]:null;if(!r)throw new Error(`parseModelBin: unknown model '${t}'; expected one of ${Object.keys(gr).join(", ")}`);let s;if(e instanceof ArrayBuffer)s=new Uint8Array(e);else if(ArrayBuffer.isView(e))s=new Uint8Array(e.buffer,e.byteOffset,e.byteLength);else throw new Error("parseModelBin: expected an ArrayBuffer or ArrayBufferView");const o=r.weightFloats*4;if(s.byteLength!==o)throw new Error(`parseModelBin(${n}): expected ${o} bytes (${r.weightFloats} floats), got ${s.byteLength}`);const i=(s.byteOffset&3)===0?new Float32Array(s.buffer,s.byteOffset,r.weightFloats):new Float32Array(s.slice().buffer),a={};let f=0;for(let u=0;u<r.nhidden;u++){const p=u===0?1:r.chan,y=r.chan,$=27*p*y,h=new Float32Array($);for(let _=0;_<y;_++)for(let z=0;z<p;z++){const b=(_*p+z)*27;for(let g=0;g<27;g++)h[b+g]=i[f+(g*p+z)*y+_]}if(f+=$,a[`m.model.${u*3}.weight`]={dtype:"F32",shape:[y,p,3,3,3],data:h},r.hasAffine){const _=new Float32Array(y);for(let b=0;b<y;b++)for(let g=0;g<y;g++){const v=i[f+b*y+g];if(b===g)_[g]=v;else if(v!==0)throw new Error(`parseModelBin(${n}): non-diagonal affine weight at layer ${u} [${b},${g}] = ${v}`)}f+=y*y;const z=new Float32Array(y);for(let b=0;b<y;b++)z[b]=i[f+b];f+=y,a[`m.model.${u*3+1}.weight`]={dtype:"F32",shape:[y],data:_},a[`m.model.${u*3+1}.bias`]={dtype:"F32",shape:[y],data:z}}}const l=r.nhidden*3,m=r.chan*r.nclass,d=new Float32Array(m);for(let u=0;u<r.nclass;u++)for(let p=0;p<r.chan;p++)d[u*r.chan+p]=i[f+p*r.nclass+u];f+=m;const c=new Float32Array(r.nclass);for(let u=0;u<r.nclass;u++)c[u]=i[f+u];if(f+=r.nclass,f!==r.weightFloats)throw new Error(`parseModelBin(${n}): parsed ${f} floats, expected ${r.weightFloats}`);return a[`m.model.${l}.weight`]={dtype:"F32",shape:[r.nclass,r.chan,1,1,1],data:d},a[`m.model.${l}.bias`]={dtype:"F32",shape:[r.nclass],data:c},a}function ia(e){const t=[],n=[],r=[];for(const[o,i]of Object.entries(e)){if(o==="__metadata__")continue;const a=o.match(/^m\.model\.(\d+)\.(weight|bias)$/);if(!a)continue;const f=Number(a[1]),l=a[2]==="weight";if(i.shape.length===5){const[m,d,c,u,p]=i.shape,$={idx:f,outC:m,inC:d,kd:c,kh:u,kw:p,is1x1:c===1&&u===1&&p===1,w:i.data,bias:null},h=t.find(_=>_.idx===f);h?Object.assign(h,$):t.push($)}else i.shape.length===1&&r.push({idx:f,isW:l,data:i.data,len:i.shape[0]})}t.sort((o,i)=>o.idx-i.idx);for(const o of r){const i=t.find(f=>f.idx===o.idx);if(i&&!o.isW){i.bias=o.data;continue}if(i&&o.isW)continue;let a=n.find(f=>f.idx===o.idx);a||(a={idx:o.idx,scale:null,bias:null},n.push(a)),o.isW?a.scale=o.data:a.bias=o.data}n.sort((o,i)=>o.idx-i.idx);let s=null;return t.length&&t[t.length-1].is1x1&&(s=t.pop()),{convs:t,affines:n,classifier:s}}function la(e,t={}){const{convs:n,affines:r,classifier:s}=e,o=n[0].outC,i=Math.ceil(o/4)*4,a=n.some(l=>l.bias),f={chan:o,cs:i,planes:i/4,nclass:s?s.outC:0,nhidden:n.length-1,norm:r.length?"gn":a?"none":"gn",affine:r.length>0,convBias:a,classifierBias:!!(s&&s.bias),centeredVariance:!1,eps:1e-5,...t};if(f.nclass>256)throw new Error(`classifier has ${f.nclass} classes; the RGBA8 label texture holds at most 256`);if(!f.activation)throw new Error("descriptor needs an explicit `activation`");if(!f.dilations)throw new Error("descriptor needs an explicit `dilations` array");if(f.dilations.length!==n.length)throw new Error(`descriptor has ${f.dilations.length} dilations for ${n.length} convs`);return f}var Ot=[1,3,5,7,13,19,31,19,13,7,5,3,1],ca=[16,8,4,2,1,16,8,4,2,1,16,8,4,2,1,16,8,4,2,1,16,8,4,2,1],_r={"mindmap-fast":{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},"16chan18cls":{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},mindmap:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},mindsnap:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model16chan18cls:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model24chan18cls_gdice_prio:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model6chan3cls:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model24chan104cls_synth:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model24chan104cls_infant_refit_synth:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model24chan104cls_v3_repbn:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model24chan50cls:{dilations:Ot,activation:"gelu_tanh",fullVolume:!0},model32chan18cls:{dilations:Ot,activation:"gelu_tanh",fullVolume:!1},mindgrab:{dilations:ca,activation:"gelu_tanh",fullVolume:!0},model5_gw_ae:{dilations:[1,2,4,8,16,8,4,2,1],activation:"relu",fullVolume:!0},model11_gw_ae:{dilations:[1,2,4,8,4,2,2,1],activation:"relu",noSafetensors:!0,fullVolume:!0},model30chan18cls:{dilations:[1,2,4,8,16,8,4,2,1],activation:"elu",fullVolume:!0},model30chan50cls:{dilations:[1,2,4,8,16,8,4,2,1],activation:"elu",fullVolume:!0}};function ua(e){if(e?.modelBinModel&&Object.hasOwn(_r,e.modelBinModel))return e.modelBinModel;if(e?.model&&Object.hasOwn(_r,e.model))return e.model;const t=String(e?.path||"").match(/\/models\/([^/]+)\//);return t?t[1]:null}function fa(e){const t=ua(e);if(!t)return null;const n=_r[t];return!n||n.noSafetensors?null:{name:t,...n}}var ma={grayMatter:[2,6,7,8,9,10,14,15,16,17],whiteMatter:[1,5],csf:[3,4,11,12]};function Mn(e,t,n,r,s){const o=Number(e[t]??n);if(!Number.isFinite(o)||o<r||o>s)throw new Error(`${t} must be between ${r} and ${s}, got ${e[t]}`);return o}function hr(e,t,n){let r=0;for(const s of e||[]){if(!Number.isInteger(s)||s<0||s>=t||s>=32)throw new Error(`Invalid ${n} tissue label ${s} for ${t} classes`);r=(r|1<<s)>>>0}return r}function pa(e,t){if(!Number.isInteger(t)||t<2||t>32)throw new Error(`Native WebGL2 grouped probabilities require 2..32 classes, got ${t}`);const n={...ma,...e.probabilityGroups||{}};return{temperature:Mn(e,"softmaxTemperature",1,1e-6,1e6),supportTemperature:Mn(e,"brainSupportTemperature",1,1e-6,1e6),supportPower:Mn(e,"brainSupportPower",1,1e-6,1e6),sigma:Mn(e,"partialVolumeSigma",0,0,2),grayMask:hr(n.grayMatter,t,"gray-matter"),whiteMask:hr(n.whiteMatter,t,"white-matter"),csfMask:hr(n.csf,t,"CSF")}}function wr(e,t,n,r,s,o){const[i,a,f]=n,l=i*a,m=s.length-1>>1;for(let d=0;d<f;d++)for(let c=0;c<a;c++)for(let u=0;u<i;u++){const p=d*l+c*i+u,y=r===1?u:r===i?c:d,$=r===1?i:r===i?a:f;let h=0;for(let _=-m;_<=m;_++){const z=y+_;z<0||z>=$||(h+=s[_+m]*e[p+_*r])}t[p]=h/o}}function da(e,t,n,r){const[s,o,i]=n,a=s*o*i;if(!Array.isArray(e)||e.length!==3||e.some(u=>u.length!==a)||t.length!==a)throw new Error("Native WebGL2 tissue-prior dimensions do not match");const f=Mn(r,"partialVolumeSigma",0,0,2),l=Mn(r,"brainSupportPower",1,1e-6,1e6);let m=null,d=null,c=1;if(f>0){const u=Math.max(1,Math.round(3*f));d=new Float32Array(u*2+1),c=0;for(let p=-u;p<=u;p++){const y=Math.exp(-.5*p*p/(f*f));d[p+u]=y,c+=y}m=new Float32Array(a)}for(const u of e){let p=u;d&&(wr(u,m,n,1,d,c),wr(m,u,n,s,d,c),wr(u,m,n,s*o,d,c),p=m);for(let y=0;y<a;y++){const $=Math.pow(Math.max(0,Math.min(1,t[y])),l);u[y]=Math.max(0,Math.min(1,p[y]*$))}}return e}var q=256,ut=64,Et=8,st=ut+2*Et,tn=st*4,Fe=q*64,Bn=q*q*2,Nn=9216,xs=Nn*8,ga=[1,3,5,7,13,19,31,19,13,7,5,3,1],tt=(e,t)=>Array.from({length:e},(n,r)=>t(r)).join(""),$s=280,Ms=150,_a=55,br=112;function yr(e,t){const n=Math.floor(e/4),r=e%4,s=r===0?n:n+1,o=n,i=r*8,a=r===0?0:32-i;return(e&63|(s&15)<<6|(o&15)<<10|(i&31)<<14|(a&31)<<19|(t?1:0)<<24)>>>0}function ha(e,t){if(!e?.features?.has?.("subgroups")||t?.disableSubgroups)return"none";if(t?.forceSubgroupMode)return t.forceSubgroupMode;const n=e.__adapterInfo||e.adapterInfo||{},r=n.subgroupMinSize|0,s=n.subgroupMaxSize|0;return r===32&&s===32?"sg32":r===64&&s===64?"sg64":r>=32&&s<=64?"sg32_64":r>=8&&s<=32?"sg_small":"none"}function ks(e){switch(e){case"sg32":return"subgroups32";case"sg64":return"subgroups64-bf";case"sg32_64":return"subgroups32-64";case"sg_small":return"subgroups8-32";default:return"shared-8KiB"}}function zs(){return typeof requestAnimationFrame!="function"?new Promise(e=>setTimeout(e,0)):new Promise(e=>{let t=!1;const n=()=>{t||(t=!0,e())},r=setTimeout(n,16);requestAnimationFrame(()=>{clearTimeout(r),setTimeout(n,0)})})}function Ps(e,t,n){let r=t,s=null,o=null,i=performance.now(),a=performance.now();async function f(m,d,c,{forceUiYield:u=!1,emitTick:p=!0}={}){s&&(await s,s=null);const y=performance.now();e.queue.submit([m.finish()]);const $=e.createCommandEncoder(),h=e.queue.onSubmittedWorkDone().then(()=>{const z=performance.now(),b=Math.max(y,i),g=Math.max(0,z-b);z>i&&(i=z),d>=256&&g>.2&&(r=Math.max(.005,Math.min(2,.7*r+.3*(g/d))),e.__v4MsPerStrip=r)});s=o,o=h,p&&n&&n(c);const _=performance.now();return(u||_-a>=_a)&&(await zs(),a=performance.now()),$}async function l(){s&&(await s,s=null)}return{submitChunk:f,waitBeforeFinalSubmit:l,getMsPerStrip:()=>r,setMsPerStrip:m=>{r=Math.max(.005,Math.min(2,m)),e.__v4MsPerStrip=r,i=performance.now()}}}function vr(e,t,n){const r=e.isFull?Fe:e.mainStrips.length,s=e.isFull||!e.extStrips?0:e.extStrips.length,o=t+1<n?e.isFull?Fe:e.normStrips?e.normStrips.length:0:0,i=Math.max(16,Math.round(o*.12));return t===0?{convWork:Math.max(64,Math.round(r*.12)),normWork:i}:{convWork:r+s,normWork:i}}function Ss(e,t){let n=0;for(let s=0;s<t;s++){const o=vr(e.layers[s],s,t);n+=o.convWork+o.normWork}const r=e.clsSkipped?e.clsStrips.length:Fe;return n+=Math.max(64,Math.round(r*.2)),Math.max(1,n)}var As=new Float32Array(1),wa=new Uint32Array(As.buffer);function xr(e){As[0]=e;const t=wa[0],n=t>>>16&32768,r=t>>>23&255;let s=t&8388607;if(r===255)return n|31744|(s?512:0);let o=r-127+15;return o<=0?o<-10?n:(s=(s|8388608)>>>1-o,n|s+4096>>>13):o>=31?n|31744:n|Math.min(31744,(o<<10)+(s+4096>>>13))}function ba(e){const t=new Uint16Array(e.length);for(let n=0;n<e.length;n++)t[n]=xr(e[n]);return t}var nn=new Map,ya=12,Cs=new WeakMap,va=new WeakMap;function xa(e){let t=2166136261,n=2654435769;const r=e.byteLength>>>2;if((e.byteOffset&3)===0){const s=new Uint32Array(e.buffer,e.byteOffset,r);for(let o=0;o<s.length;o++){const i=s[o];t=Math.imul(t^i,16777619)>>>0,n=Math.imul(n^(i<<13|i>>>19),2246822507)>>>0}}else for(let s=0;s<r*4;s+=4){const o=e[s]|e[s+1]<<8|e[s+2]<<16|e[s+3]<<24;t=Math.imul(t^o,16777619)>>>0,n=Math.imul(n^(o<<13|o>>>19),2246822507)>>>0}for(let s=r*4;s<e.byteLength;s++)t=Math.imul(t^e[s],16777619)>>>0;return`${e.byteLength}_${t.toString(16)}_${n.toString(16)}`}function $a(e,t,n,r){const s=r?.classifierBias?JSON.stringify(r.classifierBias):"",o=`${xa(e)}|${n.chan}|${n.cs}|${n.nclass}|${n.norm}|${n.eps}|${s}`;if(nn.has(o)){const a=nn.get(o);return nn.delete(o),nn.set(o,a),a}const i=Ca(t,n);if(nn.size>=ya){const a=nn.keys().next().value;nn.delete(a)}return nn.set(o,i),i}function $r(e,t){let n=e.get(t);return n||(n=new Map,e.set(t,n)),n}function Tt(e,t,n){let r=e.get(t);return r||(r=n().catch(s=>{throw e.delete(t),s}),e.set(t,r)),r}function On(e,t){let n=0;return{alloc:(s,o)=>{const i=Math.max(16,Math.ceil(s/16)*16),a=e.createBuffer({size:i,usage:o});return t.push(a),n+=i,a},getBytes:()=>n,resetBytes:()=>{n=0}}}var Jt=new WeakMap;function kn(e){const t=e?Jt.get(e):null;if(t){Jt.delete(e),t.inUse=!1;for(const n of t.buffers)n.destroy();t.buffers.length=0}}function Fs(e,t,n){const r=Jt.get(e);if(r){if(r.key===t&&!r.inUse)return r.inUse=!0,r;if(r.inUse){const i=n();return{key:t,...i,inUse:!0,pooled:!1}}Jt.delete(e);for(const i of r.buffers)i.destroy();r.buffers.length=0}const s=n(),o={key:t,...s,inUse:!0,pooled:!0};return Jt.set(e,o),o}function It(e,t,n){return e.createShaderModule({label:t,code:n})}async function Mr(e,t,n,r,s){const o=e.createBindGroupLayout({entries:s.map((i,a)=>typeof i=="string"?{binding:a,visibility:GPUShaderStage.COMPUTE,buffer:{type:i}}:{binding:a,visibility:GPUShaderStage.COMPUTE,buffer:i})});try{const i=await e.createComputePipelineAsync({label:t,layout:e.createPipelineLayout({bindGroupLayouts:[o]}),compute:{module:n,entryPoint:r}});return{bgl:o,pipe:i}}catch(i){if(n?.getCompilationInfo){const a=await n.getCompilationInfo().catch(()=>null),f=a?a.messages.filter(l=>l.type==="error"):[];if(f.length)throw new Error(`meshnet_fast_v4 [${t}] WGSL error: `+f.map(l=>`L${l.lineNum}:${l.linePos} ${l.message}`).join(" | "))}throw i}}function Bs(e,t){const n=t?`enable f16;
`:"",r=t?"f16":"f32",s=`vec4<${r}>`;return e?`${n}
@group(0) @binding(0) var<storage, read> raw_u32 : array<u32>;
@group(0) @binding(1) var<storage, read_write> inp_4 : array<${s}>;
@group(0) @binding(2) var<uniform> lut : array<vec4<f32>, 64>;

var<workgroup> sh : array<f32, 32u * 33u>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let t = lid.y * 8u + lid.x;
  let X0 = wid.x * 32u;
  let Y = wid.y;
  let Z0 = wid.z * 32u;

  let z4 = t & 7u;
  let xOff = t >> 3u;
  let zBase = z4 * 4u;
  for (var s : u32 = 0u; s < 4u; s = s + 1u) {
    let xLoc = s * 8u + xOff;
    let w = raw_u32[((X0 + xLoc) * 256u + Y) * 64u + wid.z * 8u + z4];
    let b0 = w & 0xffu;
    let b1 = (w >> 8u) & 0xffu;
    let b2 = (w >> 16u) & 0xffu;
    let b3 = (w >> 24u) & 0xffu;
    sh[(zBase + 0u) * 33u + xLoc] = lut[b0 >> 2u][b0 & 3u];
    sh[(zBase + 1u) * 33u + xLoc] = lut[b1 >> 2u][b1 & 3u];
    sh[(zBase + 2u) * 33u + xLoc] = lut[b2 >> 2u][b2 & 3u];
    sh[(zBase + 3u) * 33u + xLoc] = lut[b3 >> 2u][b3 & 3u];
  }
  workgroupBarrier();

  let x4Loc = t & 7u;
  let zOff = t >> 3u;
  let xBase = x4Loc * 4u;
  let dstX4 = ${Et}u + wid.x * 8u + x4Loc;
  for (var s : u32 = 0u; s < 4u; s = s + 1u) {
    let zLoc = s * 8u + zOff;
    let r = zLoc * 33u + xBase;
    inp_4[((Z0 + zLoc) * 256u + Y) * ${st}u + dstX4] =
      ${s}(${r}(sh[r]), ${r}(sh[r + 1u]), ${r}(sh[r + 2u]), ${r}(sh[r + 3u]));
  }
}`:`${n}
@group(0) @binding(0) var<storage, read> raw_f32 : array<f32>;
@group(0) @binding(1) var<storage, read_write> inp_4 : array<${s}>;
@group(0) @binding(2) var<uniform> params : vec4<f32>;

var<workgroup> sh : array<f32, 32u * 33u>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let t = lid.y * 8u + lid.x;
  let X0 = wid.x * 32u;
  let Y = wid.y;
  let Z0 = wid.z * 32u;

  let zLoc = t & 31u;
  let xOff = t >> 5u;
  for (var s : u32 = 0u; s < 16u; s = s + 1u) {
    let xLoc = s * 2u + xOff;
    let v = raw_f32[((X0 + xLoc) * 256u + Y) * 256u + (Z0 + zLoc)];
    sh[zLoc * 33u + xLoc] = select((v - params.x) / params.y, 0.0, v == params.x);
  }
  workgroupBarrier();

  let x4Loc = t & 7u;
  let zOff = t >> 3u;
  let xBase = x4Loc * 4u;
  let dstX4 = ${Et}u + wid.x * 8u + x4Loc;
  for (var s : u32 = 0u; s < 4u; s = s + 1u) {
    let zl = s * 8u + zOff;
    let r = zl * 33u + xBase;
    inp_4[((Z0 + zl) * 256u + Y) * ${st}u + dstX4] =
      ${s}(${r}(sh[r]), ${r}(sh[r + 1u]), ${r}(sh[r + 2u]), ${r}(sh[r + 3u]));
  }
}`}function Ma(){return`
@group(0) @binding(0) var<storage, read> src_u32 : array<u32>;
@group(0) @binding(1) var<storage, read_write> dst_u32 : array<u32>;

var<workgroup> sh : array<u32, 32u * 33u>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let t = lid.y * 8u + lid.x;
  let X0 = wid.x * 32u;
  let Y = wid.y;
  let Z0 = wid.z * 32u;

  let x4Loc = t & 7u;
  let zOff = t >> 3u;
  let xBase = x4Loc * 4u;
  for (var s : u32 = 0u; s < 4u; s = s + 1u) {
    let zLoc = s * 8u + zOff;
    let w = src_u32[((Z0 + zLoc) * 256u + Y) * 64u + wid.x * 8u + x4Loc];
    let r = zLoc * 33u + xBase;
    sh[r + 0u] = w & 0xffu;
    sh[r + 1u] = (w >> 8u) & 0xffu;
    sh[r + 2u] = (w >> 16u) & 0xffu;
    sh[r + 3u] = (w >> 24u) & 0xffu;
  }
  workgroupBarrier();

  let z4Loc = t & 7u;
  let xOff = t >> 3u;
  let zBase = z4Loc * 4u;
  for (var s : u32 = 0u; s < 4u; s = s + 1u) {
    let xLoc = s * 8u + xOff;
    let b0 = sh[(zBase + 0u) * 33u + xLoc];
    let b1 = sh[(zBase + 1u) * 33u + xLoc];
    let b2 = sh[(zBase + 2u) * 33u + xLoc];
    let b3 = sh[(zBase + 3u) * 33u + xLoc];
    dst_u32[((X0 + xLoc) * 256u + Y) * 64u + wid.z * 8u + z4Loc] =
      b0 | (b1 << 8u) | (b2 << 16u) | (b3 << 24u);
  }
}`}function ka(){return`
@group(0) @binding(0) var<storage, read> src_f32 : array<f32>;
@group(0) @binding(1) var<storage, read_write> dst_f32 : array<f32>;

var<workgroup> sh : array<f32, 32u * 33u>;

@compute @workgroup_size(8, 8, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let t = lid.y * 8u + lid.x;
  let X0 = wid.x * 32u;
  let Y = wid.y;
  let Z0 = wid.z * 32u;

  let xLoc = t & 31u;
  let zOff = t >> 5u;
  for (var s : u32 = 0u; s < 16u; s = s + 1u) {
    let zLoc = s * 2u + zOff;
    sh[zLoc * 33u + xLoc] = src_f32[((Z0 + zLoc) * 256u + Y) * 256u + (X0 + xLoc)];
  }
  workgroupBarrier();

  let zLoc = t & 31u;
  let xOff = t >> 5u;
  for (var s : u32 = 0u; s < 16u; s = s + 1u) {
    let xl = s * 2u + xOff;
    dst_f32[((X0 + xl) * 256u + Y) * 256u + (Z0 + zLoc)] = sh[zLoc * 33u + xl];
  }
}`}function za(){return`
@group(0) @binding(0) var<storage, read> packedSrc : array<u32>;
@group(0) @binding(1) var<storage, read_write> outA : array<f32>;
@group(0) @binding(2) var<storage, read_write> outB : array<f32>;

@compute @workgroup_size(256, 1, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let idx = wid.y * 65536u + wid.x * 256u + lid.x;
  let w = packedSrc[idx];
  let inv = 1.0 / 65535.0;
  outA[idx] = f32(w & 0xffffu) * inv;
  outB[idx] = f32(w >> 16u) * inv;
}`}function Us(){return`
struct BlurParams {
  axis : u32,
  radius : u32,
  weightSum : f32,
  supPow : f32,
  k : array<vec4<f32>, 8>,
};
@group(0) @binding(0) var<storage, read> src : array<f32>;
@group(0) @binding(1) var<storage, read_write> dst : array<f32>;
@group(0) @binding(2) var<storage, read> sup : array<f32>;
@group(0) @binding(3) var<uniform> p : BlurParams;

fn blurSample(idx : u32, x : u32, y : u32, z : u32) -> f32 {
  var coord : i32 = i32(x);
  var stride : i32 = 1;
  if (p.axis == 1u) {
    coord = i32(y);
    stride = 256;
  } else if (p.axis == 2u) {
    coord = i32(z);
    stride = 65536;
  }
  let rad = i32(p.radius);
  var sum : f32 = 0.0;
  for (var o : i32 = -rad; o <= rad; o = o + 1) {
    let c = coord + o;
    if (c >= 0 && c < 256) {
      let kIdx = u32(o + rad);
      let w = p.k[kIdx >> 2u][kIdx & 3u];
      sum = sum + src[u32(i32(idx) + o * stride)] * w;
    }
  }
  return sum / p.weightSum;
}

@compute @workgroup_size(64, 4, 1)
fn blur_axis(@builtin(local_invocation_id) lid : vec3<u32>,
             @builtin(workgroup_id) wid : vec3<u32>) {
  let x = wid.x * 64u + lid.x;
  let y = wid.y * 4u + lid.y;
  let z = wid.z;
  let idx = (z * 256u + y) * 256u + x;
  dst[idx] = blurSample(idx, x, y, z);
}

@compute @workgroup_size(64, 4, 1)
fn blur_z_gate(@builtin(local_invocation_id) lid : vec3<u32>,
               @builtin(workgroup_id) wid : vec3<u32>) {
  let x = wid.x * 64u + lid.x;
  let y = wid.y * 4u + lid.y;
  let z = wid.z;
  let idx = (z * 256u + y) * 256u + x;
  let blurred = blurSample(idx, x, y, z);
  let sv = clamp(sup[idx], 0.0, 1.0);
  var gate : f32 = 0.0;
  if (sv > 0.0) {
    gate = select(pow(sv, p.supPow), sv, p.supPow == 1.0);
  }
  dst[idx] = clamp(blurred * gate, 0.0, 1.0);
}`}async function mn(e,t,n,r,s){const o=$r(va,e);let i=o.get(t);return i||(i=(async()=>{const a=It(e,t,n());return Mr(e,t,a,r,s)})().catch(a=>{throw o.delete(t),a}),o.set(t,i)),i}function Ls(e,t,n,r,s){t.fill(0);const o=q*q*q;if(!(s&&e[0]===r&&e[o-1]===r))return{hasBgSkip:!1};if(n.fill(0),(e instanceof Uint8Array||e instanceof Uint8ClampedArray)&&(e.byteOffset&3)===0&&Number.isInteger(r)&&r>=0&&r<=255){const f=new Uint32Array(e.buffer,e.byteOffset,o>>>2),l=new Uint32Array(n.buffer,n.byteOffset,q*q>>>2),m=(r&255)*16843009>>>0;let d=0;for(let c=0;c<q;c++)for(let u=0;u<16384;u++)l[u]|=f[d++]^m}else{let f=0;const l=q*q;for(let m=0;m<q;m++)for(let d=0;d<l;d++,f++)e[f]!==r&&(n[d]=1)}let a=0;for(let f=0;f<q;f++){const l=f*q;for(let m=0;m<q;m++)n[l+m]!==0&&(t[m*q+f]=1,a++)}return a===0||a>=6e4?{hasBgSkip:!1}:{hasBgSkip:!0}}function Is(e){return e?`${e.grayMask}_${e.whiteMask}_${e.csfMask}_${e.temperature}_${e.supportTemperature}`:"seg"}async function Pa(e,t,n,r,s,o,i,{includeCls:a=!0,sequential:f=!1,shouldAbort:l=null}={}){const m=$r(Cs,e),d=r?1:0,c=s||"none",u=i.useUniformWeff?1:0,p=(V,re,X,oe)=>Mr(e,V,re,X,oe),y=["storage","storage","storage","storage"],$=["read-only-storage","storage","storage","storage","storage","storage","read-only-storage","storage","uniform","uniform","uniform"],h=["read-only-storage","read-only-storage","storage","storage","read-only-storage","uniform"],_=["storage","storage","storage","storage","read-only-storage","read-only-storage",{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}],z=["storage","storage","storage","storage","read-only-storage","read-only-storage","read-only-storage","uniform"],b=["read-only-storage","read-only-storage","read-only-storage","read-only-storage","storage","storage",i.useUniformWeff?"uniform":"read-only-storage","read-only-storage",{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}],g=["read-only-storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","storage","uniform","uniform","uniform"],v=`128|init|${t.cs}|${t.activation}|${d}`,M=`128|conv0|${t.cs}|${t.dilations[0]}|${t.norm}|${d}|${c}`,w=`128|prep|${t.chan}|${t.cs}|${t.activation}|${t.norm}|${d}`,x=`128|flush|${t.cs}|${d}`,P=`128|norm|${t.cs}|${t.activation}|${t.norm}|${d}`,k=`128|conv|${t.chan}|${t.cs}|${t.activation}|${t.norm}|${u}|${d}|${c}`,S=`128|cls|${t.chan}|${t.cs}|${t.nclass}|${n?.clsK4??0}|${i.numConvs}|${t.activation}|${t.norm}|${d}|${Is(o)}`,F=()=>Tt(m,v,()=>{const V=It(e,"init_act8_128",i.initActWgsl());return p("init_act8_128",V,"main",y)}),L=()=>Tt(m,M,async()=>{const V=It(e,"conv0_128",i.conv0Wgsl()),re=await Promise.all(i.halfPass0?[p("conv0_128_lo",V,"main_lo",$),p("conv0_128_hi",V,"main_hi",$),p("conv0_128_bg_lo",V,"main_bg_lo",$),p("conv0_128_bg_hi",V,"main_bg_hi",$)]:[p("conv0_128",V,"main",$),p("conv0_128_bg",V,"main_bg",$)]);return i.halfPass0?{lo:re[0],hi:re[1],bgLo:re[2],bgHi:re[3]}:{main:re[0],bg:re[1]}}),K=()=>Tt(m,w,async()=>{const V=It(e,"prep_128",i.prepWgsl()),[re,X]=await Promise.all([p("moments_finish_128",V,"moments_finish",h),p("prep_weff_128",V,"prep_weff",h)]);return{pMomFin:re,pPrepW:X}}),W=()=>Tt(m,x,()=>{const V=It(e,"flush_128",i.flushWgsl());return p("flush_stage_128",V,"main",_)}),C=()=>Tt(m,P,async()=>{const V=It(e,"norm_128",i.normWgsl()),[re,X]=await Promise.all([p("norm_quant8_128",V,"main",z),p("norm_halo_fill_128",V,"norm_halo_fill",z)]);return{pNorm:re,pNormHalo:X}}),R=()=>a?Tt(m,S,()=>{const V=It(e,"cls_128",i.clsWgsl());return p("classify_v4_128",V,"main",g)}):Promise.resolve(null),A=()=>Tt(m,k,async()=>{const V=It(e,"conv_128",i.convWgsl());if(i.halfPassConv){const[N,j,G,se,ne,ce]=await Promise.all([p("conv_128_lo",V,"main_lo",b),p("conv_128_hi",V,"main_hi",b),p("conv_128_ext_lo",V,"main_ext_lo",b),p("conv_128_ext_hi",V,"main_ext_hi",b),p("conv_128_bg_lo",V,"main_bg_lo",b),p("conv_128_bg_hi",V,"main_bg_hi",b)]);return{lo:N,hi:j,extLo:G,extHi:se,bgLo:ne,bgHi:ce}}const[re,X,oe]=await Promise.all([p("conv_128",V,"main",b),p("conv_128_ext",V,"main_ext",b),p("conv_128_bg",V,"main_bg",b)]);return{main:re,ext:X,bg:oe}});if(f){for(const V of[F,K,W,C,L,A,R]){if(l?.())return null;await V()}return null}const[U,E,B,O,D,J,Y]=await Promise.all([F(),L(),K(),W(),C(),R(),A()]);return{pInit:U,pMomFin:B.pMomFin,pPrepW:B.pPrepW,pFlush:O,pNorm:D.pNorm,pNormHalo:D.pNormHalo,pCls:J,pConv0:E,pConv:Y}}async function Sa(e,t,n,r,s,o,i,a,{includeCls:f=!0,sequential:l=!1,shouldAbort:m=null}={}){const d=$r(Cs,e),c=r?1:0,u=s||"none",p=o?1:0,y=a.useUniformWeff?1:0,$=a.chunkableStd?1:0,h=(Y,V,re,X)=>Mr(e,Y,V,re,X),_=["storage","storage"],z=["read-only-storage","storage","storage","read-only-storage","read-only-storage","storage","storage","read-only-storage","uniform"],b=["read-only-storage","read-only-storage","storage","storage","storage","storage","read-only-storage","uniform"],g=["storage","storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","uniform"],v=["read-only-storage","read-only-storage","storage","storage","storage","storage",a.useUniformWeff?"uniform":"read-only-storage","read-only-storage",a.chunkableStd?{type:"uniform",hasDynamicOffset:!0,minBindingSize:32}:"uniform"],M=["read-only-storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","read-only-storage","storage","read-only-storage","uniform"],w=`std|init|${t.cs}|${t.activation}|${c}|${p}`,x=`std|conv0|${t.cs}|${t.dilations[0]}|${t.norm}|${c}|${u}|${p}`,P=`std|prep|${t.chan}|${t.cs}|${t.activation}|${t.norm}|${c}|${p}`,k=`std|norm|${t.cs}|${t.activation}|${t.norm}|${c}|${p}`,S=`std|conv|${t.chan}|${t.cs}|${t.activation}|${t.norm}|${y}|${c}|${u}|${p}${$?"|chk1":""}`,F=`std|cls|${t.chan}|${t.cs}|${t.nclass}|${n?.clsK4??0}|${t.activation}|${t.norm}|${c}|${p}|${Is(i)}`,L=()=>Tt(d,w,()=>{const Y=It(e,"init_act8",a.initActWgsl());return h("init_act8",Y,"main",_)}),K=()=>Tt(d,x,async()=>{const Y=It(e,"conv0",a.conv0Wgsl()),V=await Promise.all(a.halfPass0?[h("conv0_lo",Y,"main_lo",z),h("conv0_hi",Y,"main_hi",z),h("conv0_bg_lo",Y,"main_bg_lo",z),h("conv0_bg_hi",Y,"main_bg_hi",z)]:[h("conv0",Y,"main",z),h("conv0_bg",Y,"main_bg",z)]);return a.halfPass0?{lo:V[0],hi:V[1],bgLo:V[2],bgHi:V[3]}:{main:V[0],bg:V[1]}}),W=()=>Tt(d,P,async()=>{const Y=It(e,"prep",a.prepWgsl()),[V,re]=await Promise.all([h("moments_finish",Y,"moments_finish",b),h("prep_weff",Y,"prep_weff",b)]);return{pMomFin:V,pPrepW:re}}),C=()=>Tt(d,k,async()=>{const Y=It(e,"norm",a.normWgsl()),[V,re]=await Promise.all([h("norm_quant8",Y,"main",g),h("norm_halo_fill",Y,"norm_halo_fill",g)]);return{pNorm:V,pNormHalo:re}}),R=()=>f?Tt(d,F,()=>{const Y=It(e,"cls",a.clsWgsl());return h("classify_v4",Y,"main",M)}):Promise.resolve(null),A=()=>Tt(d,S,async()=>{const Y=It(e,"conv",a.convWgsl());if(a.halfPassConv){const[X,oe,N,j]=await Promise.all([h("conv_lo",Y,"main_lo",v),h("conv_hi",Y,"main_hi",v),h("conv_ext_lo",Y,"main_ext_lo",v),h("conv_ext_hi",Y,"main_ext_hi",v)]);return{lo:X,hi:oe,extLo:N,extHi:j}}const[V,re]=await Promise.all([h("conv",Y,"main",v),h("conv_ext",Y,"main_ext",v)]);return{main:V,ext:re}});if(l){for(const Y of[L,W,C,K,A,R]){if(m?.())return null;await Y()}return null}const[U,E,B,O,D,J]=await Promise.all([L(),K(),W(),C(),R(),A()]);return{pInit:U,pMomFin:B.pMomFin,pPrepW:B.pPrepW,pNorm:O.pNorm,pNormHalo:O.pNormHalo,pCls:D,pConv0:E,pConv:J}}function Ws(e,t,n,r,s){n.fill(0);const o=s&&e[0]===0&&e[e.length-1]===0;let i=0,a=0;if(!o){if(r)for(let f=0;f<q;f++){const l=f*q*tn;for(let m=0;m<q;m++){let d=l+m*tn+32;for(let c=0;c<q;c++,a++,d++){const u=e[a];t[d]=u===0?0:xr(u)}}}else for(let f=0;f<q;f++){const l=f*q*tn;for(let m=0;m<q;m++){const d=f*q*q+m*q;t.set(e.subarray(d,d+q),l+m*tn+32)}}return{hasBgSkip:!1}}for(let f=0;f<q;f++){const l=f*q*tn;for(let m=0;m<q;m++){let d=!1,c=l+m*tn+32;for(let u=0;u<q;u++,a++,c++){const p=e[a];p!==0?(t[c]=r?xr(p):p,d=!0):t[c]=0}d&&(n[f*q+m]=1,i++)}}return i===0||i>=6e4?{hasBgSkip:!1}:{hasBgSkip:!0}}function Un(e,t){const n=new Uint8Array(q*q);for(let r=0;r<q;r++){const s=r*q,o=r-t,i=r+t;for(let a=0;a<q;a++){if(!e[s+a])continue;const f=a-t,l=a+t;if(o>=0){const m=o*q;f>=0&&(n[m+f]=1),n[m+a]=1,l<q&&(n[m+l]=1)}if(f>=0&&(n[s+f]=1),n[s+a]=1,l<q&&(n[s+l]=1),i>=0&&i<q){const m=i*q;f>=0&&(n[m+f]=1),n[m+a]=1,l<q&&(n[m+l]=1)}}}return n}function Aa(e,t){const n=new Uint8Array(q*q),r=new Uint8Array(q*q),s=new Int32Array(q+1);for(let o=0;o<q;o++){const i=o*q;for(let a=0;a<q;a++)s[a+1]=s[a]+e[i+a];for(let a=0;a<q;a++)s[Math.min(q-1,a+t)+1]-s[Math.max(0,a-t)]>0&&(n[i+a]=1)}for(let o=0;o<q;o++){for(let i=0;i<q;i++)s[i+1]=s[i]+n[i*q+o];for(let i=0;i<q;i++)s[Math.min(q-1,i+t)+1]-s[Math.max(0,i-t)]>0&&(r[i*q+o]=1)}return r}function kr(e){const t=new Uint8Array(Fe);for(let n=0;n<q;n++){const r=n*q,s=n*64;for(let o=0;o<64;o++){const i=r+(o<<2);e[i]|e[i+1]|e[i+2]|e[i+3]&&(t[s+o]=1)}}return t}function Gn(e){const t=new Uint8Array(q*q);for(let n=0;n<q;n++){const r=n*q,s=n*64;for(let o=0;o<64;o++)if(e[s+o]){const i=r+(o<<2);t[i]=1,t[i+1]=1,t[i+2]=1,t[i+3]=1}}return t}function Dn(e){let t=0;for(let s=0;s<Fe;s++)t+=e[s];const n=new Uint32Array(t);let r=0;for(let s=0;s<q;s++){const o=s*64;for(let i=0;i<64;i++)e[o+i]&&(n[r++]=s<<8|i)}return n}function rn(e){let t=0;for(let n=0;n<e.length;n++)t+=e[n];return t}function qs(e){const t=new Uint8Array(Fe);if(e===1024)for(let n=0;n<32;n++)for(let r=0;r<32;r++){const s=n*8+(n*3+r*5&7),o=r*2+(n+r&1);t[s*64+o]=1}else if(e===512)for(let n=0;n<32;n++)for(let r=0;r<16;r++){const s=n*8+(n*3+r*5&7),o=r*4+(n+r*3&3);t[s*64+o]=1}else for(let n=0;n<16;n++)for(let r=0;r<16;r++){const s=n*16+(n*7+r*3&15),o=r*4+(n+r*3&3);t[s*64+o]=1}return t}function Es(e,t,n,r){const s=n.length,o=()=>({isFull:!0,mode:"full",writtenMask:null,computedMask:null,mainStrips:null,extStrips:null,nMomExt:0,normStrips:null,haloRows:null,bgStrip:null,extWeight:0});if(!r||!t.hasBgSkip)return{clsSkipped:!1,clsStrips:null,layers:Array.from({length:s},o)};const i=kr(Aa(e,3)),a=rn(i)<15800,f=a?Dn(i):null,l=new Array(s);let m=null;for(let _=0;_<s;_++){const z=n[_],b=Un(_===0?e:m,z);if(_>0)for(let v=0;v<q;v++){const M=v<z||v>=q-z,w=v*q;for(let x=0;x<q;x++)(M||x<z||x>=q-z)&&(b[w+x]=1)}m=b;const g=new Uint8Array(Fe);for(let v=0;v<q;v++){const M=v*q,w=v*64;for(let x=0;x<64;x++){const P=M+(x<<2);b[P]|b[P+1]|b[P+2]|b[P+3]||(g[w+x]=1)}}l[_]=g}const d=new Array(s);d[s-1]=i;for(let _=s-2;_>=0;_--)d[_]=kr(Un(Gn(d[_+1]),n[_+1]));const c=a&&s>=4&&n[s-1]<=2&&n[s-2]<=4&&n[s-3]<=6,u=Math.max(1,s-3),p=new Array(s).fill(null),y=new Array(s).fill(null),$=new Array(s).fill(null);if(c){const z=(Fe-rn(d[s-1]))/Fe>=.52?256:512,b=1024,g=qs(z),v=qs(b),M=d[s-1],w=new Uint8Array(Fe);let x=0;for(let P=0;P<Fe;P++)g[P]&&!M[P]&&(w[P]=1,x++);if(x>0&&x<=Nn&&rn(M)+x<=15360){p[s-1]=w,y[s-1]=new Uint8Array(Fe),$[s-1]=g;for(let P=s-2;P>=u;P--){const k=new Uint8Array(Fe),S=d[P+1],F=p[P+1];for(let E=0;E<Fe;E++)k[E]=S[E]|F[E];const L=kr(Un(Gn(k),n[P+1])),K=new Uint8Array(Fe),W=d[P];for(let E=0;E<Fe;E++)L[E]&&!W[E]&&(K[E]=1);const C=P===u?v:g,R=new Uint8Array(Fe);let A=0,U=0;for(let E=0;E<Fe;E++)(K[E]||C[E])&&!W[E]&&(R[E]=1,A++,C[E]&&U++);if(U===0||A>Nn||rn(W)+A>15360){const E=P+1,B=d[E],O=y[E],D=new Uint8Array(Fe);let J=0;for(let Y=0;Y<Fe;Y++)(O[Y]||v[Y])&&!B[Y]&&(D[Y]=1,J++);J<=Nn&&rn(B)+J<=15360&&(p[E]=D,$[E]=v);break}y[P]=K,p[P]=R,$[P]=C}}}const h=new Array(s);for(let _=0;_<s;_++){const z=rn(l[_]),b=Fe-z,g=p[_]!==null,v=g?rn(d[_])+rn(p[_]):1/0;if(z>=512&&b<=v){const M=new Uint8Array(Fe);let w=-1;for(let S=0;S<Fe;S++)l[_][S]?w<0&&(w=S):M[S]=1;const x=M.slice();x[w]=1;const P={z:w>>>6,yWg:w&63,packed:w>>>6<<8|w&63},k=Dn(M);h[_]={isFull:!1,mode:"rpure",writtenMask:M,computedMask:x,mainStrips:k,extStrips:_===0?null:new Uint32Array([P.packed]),nMomExt:_===0?0:1,normStrips:k,haloRows:null,bgStrip:P,extWeight:z}}else if(g&&v<=15360){const M=d[_],w=p[_],x=y[_],P=$[_],k=Dn(M),S=[],F=[];for(let R=0;R<q;R++){const A=R*64;for(let U=0;U<64;U++){const E=A+U;if(!w[E])continue;const B=R<<8|U;P[E]?S.push(B):F.push(B)}}const L=S.length;if(L===0){h[_]=o();continue}const K=new Uint32Array(S.length+F.length);K.set(S,0),K.set(F,S.length);const W=new Uint8Array(Fe),C=new Uint8Array(Fe);for(let R=0;R<Fe;R++)W[R]=M[R]|x[R],C[R]=M[R]|w[R];h[_]={isFull:!1,mode:"bwd",writtenMask:W,computedMask:C,mainStrips:k,extStrips:K,nMomExt:L,normStrips:_+1<s?Dn(W):null,haloRows:null,bgStrip:null,extWeight:(Fe-k.length)/L}}else h[_]=o()}for(let _=s-2;_>=0;_--)h[_].mode==="bwd"&&h[_+1].mode!=="bwd"&&(h[_]=o());for(let _=0;_<s-1;_++){const z=h[_];if(z.mode!=="rpure")continue;const b=h[_+1],g=b.isFull?new Uint8Array(q*q).fill(1):Un(Gn(b.computedMask),n[_+1]),v=Gn(z.writtenMask),M=[];for(let w=0;w<q;w++){const x=w*q;for(let P=0;P<q;P++)g[x+P]&&!v[x+P]&&M.push(w<<8|P)}M.length>0&&(z.haloRows=new Uint32Array(M))}return{clsSkipped:a,clsStrips:f,layers:h}}function Ca(e,t){const n=t.chan,r=t.cs,s=r/4,o=t.nclass,i=Math.ceil(o/4),{convs:a,affines:f,classifier:l}=e,m=a.length,d=27*s,c=9*r*3*s,u=r*i,p=(d+(m-1)*c+u)*4,y=new Float32Array(p),$=4*r,h=m*$,_=new Float32Array(h+i*4),z=(v,M,w)=>{if(t.norm!=="gn"||M>=n)return 1;const x=a[v],P=w*27,k=M*P;let S=0;for(let F=0;F<P;F++)S+=Math.abs(x.w[k+F]);return Math.max(S/16,1e-6)};for(let v=0;v<a[0].outC;v++){const M=z(0,v,a[0].inC),w=1/M;for(let x=0;x<27;x++)y[x*r+v]=a[0].w[v*27+x]*w;_[2*r+v]=t.eps/(M*M),a[0].bias&&(_[3*r+v]=a[0].bias[v])}for(let v=a[0].outC;v<r;v++)_[2*r+v]=t.eps;for(let v=1;v<m;v++){const M=a[v],w=(d+(v-1)*c)*4,x=v*$;for(let P=0;P<M.outC;P++){const k=z(v,P,M.inC),S=1/k,F=P>>>2,L=P&3;for(let K=0;K<9;K++)for(let W=0;W<M.inC;W++)for(let C=0;C<3;C++){const R=K*3+C,A=w+(((K*r+W)*3+C)*s+F)*4+L;y[A]=M.w[(P*M.inC+W)*27+R]*S}_[x+2*r+P]=t.eps/(k*k),M.bias&&(_[x+3*r+P]=M.bias[P])}for(let P=M.outC;P<r;P++)_[x+2*r+P]=t.eps}for(let v=0;v<m;v++){const M=v*$,w=f[v];for(let x=0;x<n;x++)t.norm==="gn"?(_[M+x]=w?.scale?w.scale[x]:1,_[M+r+x]=w?.bias?w.bias[x]:0):(_[M+x]=1,_[M+r+x]=0)}const b=d+(m-1)*c,g=b*4;for(let v=0;v<n;v++)for(let M=0;M<o;M++)y[g+v*i*4+M]=l.w[M*l.inC+v];for(let v=0;v<i*4;v++)_[h+v]=v<o?l.bias?l.bias[v]:0:-1e30;return{wF32:y,wF16:ba(y),qmetaF32:_,w0Vec4s:d,hiddenVec4PerLayer:c,clsVec4Off:b,clsBiasOff:h,metaStride:$,clsK4:i}}function zn(e){if(e==="gelu_tanh")return`fn act(x : f32) -> f32 {
  let u = clamp(0.7978845608028654 * (x + 0.044715 * x * x * x), -9.0, 9.0);
  return 0.5 * x * (1.0 + tanh(u));
}`;if(e==="relu")return"fn act(x : f32) -> f32 { return max(x, 0.0); }";if(e==="elu")return"fn act(x : f32) -> f32 { return select(exp(clamp(x, -20.0, 0.0)) - 1.0, x, x >= 0.0); }";throw new Error(`meshnet_fast_v4: unsupported activation '${e}'`)}function Ts(e){return e==="gelu_tanh"?{uZeroInt:7,uZeroFloat:7/255,uZeroWord:117901063,sterbenzSub:"1.02734375h",zeroBin:7}:e==="relu"?{uZeroInt:0,uZeroFloat:0,uZeroWord:0,sterbenzSub:"1.0h",zeroBin:0}:{uZeroInt:32,uZeroFloat:32/255,uZeroWord:538976288,sterbenzSub:"1.125h",zeroBin:32}}function Rs({chan:e,clsK4:t,nclass:n,V4:r,suf:s,readBiasStmt:o,biasExpr:i,probCfg:a}){const f=`    var acc0 = ${r}(0.0${s});
    var acc1 = ${r}(0.0${s});
    var acc2 = ${r}(0.0${s});
    var acc3 = ${r}(0.0${s});
    for (var c : u32 = 0u; c < ${e}u; c = c + 1u) {
      let wv = w16_4[w_cls + c * ${t}u + k4];
      let f = feat[c];
      acc0 = fma(f, ${r}(wv.x), acc0);
      acc1 = fma(f, ${r}(wv.y), acc1);
      acc2 = fma(f, ${r}(wv.z), acc2);
      acc3 = fma(f, ${r}(wv.w), acc3);
    }
    let k_base = k4 * 4u;
${o}`;if(!a)return`  var best_v = vec4<f32>(-1.0e29);
  var best_k = vec4<u32>(0u);

  for (var k4 : u32 = 0u; k4 < ${t}u; k4 = k4 + 1u) {
${f}
${tt(4,c=>`    let l${c} = vec4<f32>(acc${c}) + vec4<f32>(${i(c)});
    let m${c} = l${c} > best_v;
    best_v = select(best_v, l${c}, m${c});
    best_k = select(best_k, vec4<u32>(k_base + ${c}u), m${c});
`)}  }

  labels8[row_idx * ${ut}u + x4] = best_k.x | (best_k.y << 8u) | (best_k.z << 16u) | (best_k.w << 24u);`;const l=`f32(${(1/Math.max(a.temperature,1e-6)).toExponential(8)})`,m=`f32(${(1/Math.max(a.supportTemperature,1e-6)).toExponential(8)})`,d=a.temperature===a.supportTemperature;return`  var max_v = vec4<f32>(-1.0e29);
  for (var k4 : u32 = 0u; k4 < ${t}u; k4 = k4 + 1u) {
${f}
${tt(4,c=>`    if (k_base + ${c}u < ${n}u) {
      max_v = max(max_v, vec4<f32>(acc${c}) + vec4<f32>(${i(c)}));
    }
`)}  }

  var denom = vec4<f32>(0.0);
  var sup_denom = vec4<f32>(0.0);
  var bg_w = vec4<f32>(0.0);
  var gm_num = vec4<f32>(0.0);
  var wm_num = vec4<f32>(0.0);
  var csf_num = vec4<f32>(0.0);
  for (var k4 : u32 = 0u; k4 < ${t}u; k4 = k4 + 1u) {
${f}
${tt(4,c=>`    let k${c} = k_base + ${c}u;
    if (k${c} < ${n}u) {
      let l${c} = vec4<f32>(acc${c}) + vec4<f32>(${i(c)});
      let v${c} = exp(clamp((l${c} - max_v) * ${l}, vec4<f32>(-80.0), vec4<f32>(0.0)));
      let s${c} = ${d?`v${c}`:`exp(clamp((l${c} - max_v) * ${m}, vec4<f32>(-80.0), vec4<f32>(0.0)))`};
      denom = denom + v${c};
      sup_denom = sup_denom + s${c};
      if (k${c} == 0u) { bg_w = s${c}; }
      let bit${c} = 1u << k${c};
      if ((${a.grayMask}u & bit${c}) != 0u) { gm_num = gm_num + v${c}; }
      if ((${a.whiteMask}u & bit${c}) != 0u) { wm_num = wm_num + v${c}; }
      if ((${a.csfMask}u & bit${c}) != 0u) { csf_num = csf_num + v${c}; }
    }
`)}  }

  let inv_den = vec4<f32>(1.0) / max(denom, vec4<f32>(1.0e-20));
  let gm = clamp(gm_num * inv_den, vec4<f32>(0.0), vec4<f32>(1.0));
  let wm = clamp(wm_num * inv_den, vec4<f32>(0.0), vec4<f32>(1.0));
  let csf = clamp(csf_num * inv_den, vec4<f32>(0.0), vec4<f32>(1.0));
  let sup = clamp(vec4<f32>(1.0) - bg_w / max(sup_denom, vec4<f32>(1.0e-20)), vec4<f32>(0.0), vec4<f32>(1.0));
  let vox_base = row_idx * ${q}u + x4 * 4u;
  if (cp.pad0 == 0u) {
    labels8[vox_base]      = pack2x16unorm(vec2<f32>(gm.x, wm.x));
    labels8[vox_base + 1u] = pack2x16unorm(vec2<f32>(gm.y, wm.y));
    labels8[vox_base + 2u] = pack2x16unorm(vec2<f32>(gm.z, wm.z));
    labels8[vox_base + 3u] = pack2x16unorm(vec2<f32>(gm.w, wm.w));
  } else {
    labels8[vox_base]      = pack2x16unorm(vec2<f32>(csf.x, sup.x));
    labels8[vox_base + 1u] = pack2x16unorm(vec2<f32>(csf.y, sup.y));
    labels8[vox_base + 2u] = pack2x16unorm(vec2<f32>(csf.z, sup.z));
    labels8[vox_base + 3u] = pack2x16unorm(vec2<f32>(csf.w, sup.w));
  }`}function Ns({device:e,hasF16:t,nvox:n,outBufBytes:r,inpBuf:s,act8_0:o,labels8Buf:i,readbackBuf:a,pInit:f,bgInit:l,pCls:m,bgCls:d,clsUbo:c,packed:u,modelEntry:p,probCfg:y,canGpuProb:$,probSlots:h,ownedBuffers:_,mkBuf:z}){let b=!1,g=!1,v=!1,M=!1;const w=new Uint8Array(q*q);let x=null,P=null,k=null,S=null;const F=(B,O)=>e.createBindGroup({layout:B,entries:O.map((D,J)=>({binding:J,resource:D&&D.buffer?D:{buffer:D}}))});function L(){if(!x){const B=t?"prep_in_u8_f16":"prep_in_u8_f32";x=(async()=>{const{bgl:O,pipe:D}=await mn(e,B,()=>Bs(!0,t),"main",["read-only-storage","storage","uniform"]);if(M)return null;const J=z(256*4,GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST),Y=new Float32Array(256),V=F(O,[{buffer:i,offset:0,size:n},s,J]);return{pipe:D,ubo:J,lutF32:Y,bg:V}})().catch(O=>{throw x=null,O})}return x}function K(){if(!P){const B=t?"prep_in_f32_f16":"prep_in_f32_f32";P=(async()=>{const{bgl:O,pipe:D}=await mn(e,B,()=>Bs(!1,t),"main",["read-only-storage","storage","uniform"]);if(M)return null;const J=z(16,GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST),Y=new Float32Array(4),V=r>=n*4?F(O,[{buffer:i,offset:0,size:n*4},s,J]):null,re=o.size>=n*4?F(O,[{buffer:o,offset:0,size:n*4},s,J]):null;return{pipe:D,ubo:J,f32Tmp:Y,bgLabels:V,bgAct0:re}})().catch(O=>{throw P=null,O})}return P}function W(){return k||(k=(async()=>{const{bgl:B,pipe:O}=await mn(e,"transpose_u8_v4",Ma,"main",["read-only-storage","storage"]);if(M)return null;const D=F(B,[{buffer:i,offset:0,size:n},{buffer:s,offset:0,size:n}]);return{pipe:O,bg:D}})().catch(B=>{throw k=null,B})),k}function C(){return S||(S=(async()=>{const[B,O,D,J]=await Promise.all([mn(e,"prob_unpack_two",za,"main",["read-only-storage","storage","storage"]),mn(e,"prob_blur_axis",Us,"blur_axis",["read-only-storage","storage","read-only-storage","uniform"]),mn(e,"prob_blur_z_gate",Us,"blur_z_gate",["read-only-storage","storage","read-only-storage","uniform"]),mn(e,"transpose_f32",ka,"main",["read-only-storage","storage"])]);if(M)return null;const Y=GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST,V=144,re=z(V,Y),X=z(V,Y),oe=z(V,Y),N=ne=>({buffer:ne,offset:0,size:r}),j=F(B.bgl,[N(h.pass0HoldBuf),N(h.y0),N(h.y1)]),G=F(B.bgl,[N(i),N(h.b),N(h.sup)]),se=[h.y0,h.y1,h.b].map(ne=>({buf:ne,bgBlurX:F(O.bgl,[N(ne),N(i),N(h.sup),re]),bgBlurY:F(O.bgl,[N(i),N(ne),N(h.sup),X]),bgBlurZ:F(D.bgl,[N(ne),N(i),N(h.sup),oe]),bgTranspose:F(J.bgl,[N(i),N(ne)])}));return{pUnpack:B.pipe,pBlurAxis:O.pipe,pBlurZGate:D.pipe,pTransposeF32:J.pipe,bgUnpack0:j,bgUnpack1:G,tissues:se,uboX:re,uboY:X,uboZ:oe,uboScratch:new ArrayBuffer(V),lastBlurKey:null}})().catch(B=>{throw S=null,B})),S}function R(){y?$&&C().catch(()=>{}):(L().catch(()=>{}),W().catch(()=>{}))}function A(){M=!0}async function U({volume:B,ioOpts:O,useCone:D,padInputHost:J,headRowHost:Y,hasF16Flag:V}){if(O?.gpuNativeInput){const X=O.normOffset??0,oe=O.normRange||1,N=B instanceof Uint8Array||B instanceof Uint8ClampedArray,j=r>=n*4||o.size>=n*4;if(N){const ce=Ls(B,Y,w,X,D),Z=await L(),ee=!!O.normClamp;for(let T=0;T<256;T++){let I=T===X?0:(T-X)/oe;ee&&(I>0?I>1&&(I=1):I=0),Z.lutF32[T]=I}return e.queue.writeBuffer(Z.ubo,0,Z.lutF32),e.queue.writeBuffer(i,0,B,0,n),{info:ce,runPrePasses(T,I){(!g||v)&&(T.clearBuffer(s),g=!0,v=!1);const H=T.beginComputePass();if(H.setPipeline(Z.pipe),H.setBindGroup(0,Z.bg),H.dispatchWorkgroups(8,q,8),H.end(),I.push("preprocess"),b){const ie=T.beginComputePass();ie.setPipeline(f.pipe),ie.setBindGroup(0,l),ie.dispatchWorkgroups(1,q,q),ie.end(),I.push("preprocess"),b=!1}}}}if(j){const ce=Ls(B,Y,w,X,D),Z=await K(),ee=!(r>=n*4),T=ee?o:i,I=ee?Z.bgAct0:Z.bgLabels,H=B instanceof Float32Array?B:Float32Array.from(B);return Z.f32Tmp[0]=X,Z.f32Tmp[1]=oe,Z.f32Tmp[2]=0,Z.f32Tmp[3]=0,e.queue.writeBuffer(Z.ubo,0,Z.f32Tmp),e.queue.writeBuffer(T,0,H,0,n),{info:ce,runPrePasses(ie,le){(!g||v)&&(ie.clearBuffer(s),g=!0,v=!1);const pe=ie.beginComputePass();if(pe.setPipeline(Z.pipe),pe.setBindGroup(0,I),pe.dispatchWorkgroups(8,q,8),pe.end(),le.push("preprocess"),b||ee){const ue=ie.beginComputePass();ue.setPipeline(f.pipe),ue.setBindGroup(0,l),ue.dispatchWorkgroups(1,q,q),ue.end(),le.push("preprocess"),b=!1}}}}const G=new Float32Array(n);for(let ce=0;ce<n;ce++){const Z=B[ce];G[ce]=Z===X?0:(Z-X)/oe}const se=ss(G,[q,q,q],[2,1,0]),ne=Ws(se,J,Y,V,D);return e.queue.writeBuffer(s,0,J),g=!0,v=!1,{info:ne,runPrePasses(ce,Z){if(b){const ee=ce.beginComputePass();ee.setPipeline(f.pipe),ee.setBindGroup(0,l),ee.dispatchWorkgroups(1,q,q),ee.end(),Z.push("preprocess"),b=!1}}}}const re=Ws(B,J,Y,V,D);return e.queue.writeBuffer(s,0,J),g=!0,v=!1,{info:re,runPrePasses(X,oe){if(b){const N=X.beginComputePass();N.setPipeline(f.pipe),N.setBindGroup(0,l),N.dispatchWorkgroups(1,q,q),N.end(),oe.push("preprocess"),b=!1}}}}async function E({enc:B,schedule:O,passCategories:D,u4Tmp:J,ioOpts:Y,paced:V=!1,onProgress:re=null}){const X=O.clsSkipped?O.clsStrips.length:q;if(!y){J[0]=u.clsVec4Off,J[1]=u.clsBiasOff,J[2]=O.clsSkipped?0:1,J[3]=0,e.queue.writeBuffer(c,0,J);{const ie=B.beginComputePass();ie.setPipeline(m.pipe),ie.setBindGroup(0,d),X>0&&ie.dispatchWorkgroups(1,O.clsSkipped?1:64,X),ie.end(),D.push("classify")}if(Y?.gpuNativeOutput){const ie=await W(),le=B.beginComputePass();le.setPipeline(ie.pipe),le.setBindGroup(0,ie.bg),le.dispatchWorkgroups(8,q,8),le.end(),D.push("postprocess"),v=!0,B.copyBufferToBuffer(s,0,a,0,n),e.queue.submit([B.finish()]),await a.mapAsync(GPUMapMode.READ);const pe=new Uint8Array(a.getMappedRange()).slice();return a.unmap(),V&&re&&re(1,""),[pe]}B.copyBufferToBuffer(i,0,a,0,r),e.queue.submit([B.finish()]),await a.mapAsync(GPUMapMode.READ);const I=new Uint8Array(a.getMappedRange()),H=new Float32Array(n);for(let ie=0;ie<n;ie++)H[ie]=I[ie];return a.unmap(),V&&re&&re(1,""),[H]}if($){const I=await C();J[0]=u.clsVec4Off,J[1]=u.clsBiasOff,J[2]=O.clsSkipped?0:1,J[3]=0,e.queue.writeBuffer(c,0,J),J[3]=1,e.queue.writeBuffer(h.clsUbo1,0,J);{const te=B.beginComputePass();te.setPipeline(m.pipe),te.setBindGroup(0,d),X>0&&te.dispatchWorkgroups(1,O.clsSkipped?1:64,X),te.end(),D.push("classify")}B.copyBufferToBuffer(i,0,h.pass0HoldBuf,0,r),O.clsSkipped&&B.clearBuffer(i,0,r);{const te=B.beginComputePass();te.setPipeline(m.pipe),te.setBindGroup(0,h.bgCls1),X>0&&te.dispatchWorkgroups(1,O.clsSkipped?1:64,X),te.end(),D.push("classify")}b=!0;const H=`${y.sigma}|${y.supportPower}`,ie=y.sigma>0,le=ie?Math.max(1,Math.round(3*y.sigma)):0;if(I.lastBlurKey!==H){const te=new Uint32Array(I.uboScratch),fe=new Float32Array(I.uboScratch);fe.fill(0);let Be=1;if(ie){Be=0;for(let ye=-le;ye<=le;ye++){const Ge=Math.exp(-.5*ye*ye/(y.sigma*y.sigma));fe[4+ye+le]=Ge,Be+=Ge}}else fe[4]=1;te[1]=le,fe[2]=Be,te[0]=0,fe[3]=1,e.queue.writeBuffer(I.uboX,0,I.uboScratch),te[0]=1,e.queue.writeBuffer(I.uboY,0,I.uboScratch),te[0]=2,fe[3]=y.supportPower,e.queue.writeBuffer(I.uboZ,0,I.uboScratch),I.lastBlurKey=H}{const te=B.beginComputePass();te.setPipeline(I.pUnpack),te.setBindGroup(0,I.bgUnpack0),te.dispatchWorkgroups(256,256,1),te.end(),D.push("postprocess");const fe=B.beginComputePass();fe.setPipeline(I.pUnpack),fe.setBindGroup(0,I.bgUnpack1),fe.dispatchWorkgroups(256,256,1),fe.end(),D.push("postprocess")}V&&(e.queue.submit([B.finish()]),await e.queue.onSubmittedWorkDone(),re&&re(.992,""),await zs(),B=e.createCommandEncoder());const pe=!!Y?.gpuNativeOutput;for(let te=0;te<3;te++){const fe=I.tissues[te];if(ie){const ye=B.beginComputePass();ye.setPipeline(I.pBlurAxis),ye.setBindGroup(0,fe.bgBlurX),ye.dispatchWorkgroups(4,64,q),ye.end(),D.push("postprocess");const Ge=B.beginComputePass();Ge.setPipeline(I.pBlurAxis),Ge.setBindGroup(0,fe.bgBlurY),Ge.dispatchWorkgroups(4,64,q),Ge.end(),D.push("postprocess")}const Be=B.beginComputePass();if(Be.setPipeline(I.pBlurZGate),Be.setBindGroup(0,fe.bgBlurZ),Be.dispatchWorkgroups(4,64,q),Be.end(),D.push("postprocess"),pe){const ye=B.beginComputePass();ye.setPipeline(I.pTransposeF32),ye.setBindGroup(0,fe.bgTranspose),ye.dispatchWorkgroups(8,q,8),ye.end(),D.push("postprocess")}else te<2&&B.copyBufferToBuffer(i,0,fe.buf,0,r)}const ue=pe?[h.y0,h.y1,h.b]:[h.y0,h.y1,i];B.copyBufferToBuffer(ue[0],0,a,0,r),e.queue.submit([B.finish()]),await a.mapAsync(GPUMapMode.READ);const he=new Float32Array(a.getMappedRange()).slice();a.unmap();const _e=async te=>{const fe=e.createCommandEncoder();fe.copyBufferToBuffer(te,0,a,0,r),e.queue.submit([fe.finish()]),await a.mapAsync(GPUMapMode.READ);const Be=new Float32Array(a.getMappedRange()).slice();return a.unmap(),Be},be=await _e(ue[1]),me=await _e(ue[2]);return V&&re&&re(1,""),[he,be,me]}J[0]=u.clsVec4Off,J[1]=u.clsBiasOff,J[2]=O.clsSkipped?0:1,J[3]=0,e.queue.writeBuffer(c,0,J);{const I=B.beginComputePass();I.setPipeline(m.pipe),I.setBindGroup(0,d),X>0&&I.dispatchWorkgroups(1,O.clsSkipped?1:64,X),I.end(),D.push("classify"),B.copyBufferToBuffer(i,0,a,0,r)}e.queue.submit([B.finish()]),await a.mapAsync(GPUMapMode.READ);const oe=1/65535,N=new Uint16Array(a.getMappedRange()),j=new Float32Array(n),G=new Float32Array(n);for(let I=0;I<n;I++)j[I]=N[I*2]*oe,G[I]=N[I*2+1]*oe;a.unmap(),J[3]=1,e.queue.writeBuffer(c,0,J);const se=e.createCommandEncoder();O.clsSkipped&&se.clearBuffer(i,0,r);const ne=se.beginComputePass();ne.setPipeline(m.pipe),ne.setBindGroup(0,d),X>0&&ne.dispatchWorkgroups(1,O.clsSkipped?1:64,X),ne.end(),D.push("classify"),se.copyBufferToBuffer(i,0,a,0,r),e.queue.submit([se.finish()]),await a.mapAsync(GPUMapMode.READ);const ce=new Uint16Array(a.getMappedRange()),Z=new Float32Array(n),ee=new Float32Array(n);for(let I=0;I<n;I++)Z[I]=ce[I*2]*oe,ee[I]=ce[I*2+1]*oe;a.unmap();const T=da([j,G,Z],ee,[q,q,q],p);return Y?.gpuNativeOutput?T.map(I=>ss(I,[q,q,q],[2,1,0])):T}return{prepareInput:U,finishAndReadback:E,warmupIoPipelines:R,dispose:A}}function Os(e,t){if(e==="sg32")return{decls:"",entryArgs:"",add:s=>`subgroupAdd(${s})`,min:s=>`subgroupMin(${s})`,max:s=>`subgroupMax(${s})`};const n=(s,o)=>{const i=f=>s==="+"?`  x = x + subgroupShuffleXor(x, ${f}u);`:`  x = ${s}(x, subgroupShuffleXor(x, ${f}u));`;return e==="sg64"?`fn ${o}(v : f32) -> f32 {
  var x = v;
${i(16)}
${i(8)}
${i(4)}
${i(2)}
${i(1)}
  return x;
}
`:`fn ${o}(v : f32, sg_size : u32) -> f32 {
  if (sg_size == 32u) { return ${s==="+"?"subgroupAdd":s==="min"?"subgroupMin":"subgroupMax"}(v); }
  var x = v;
${i(16)}
${i(8)}
${i(4)}
${i(2)}
${i(1)}
  return x;
}
`},r=(t==="none"?"":n("+","sg32_add"))+n("min","sg32_min")+n("max","sg32_max");return e==="sg64"?{decls:r,entryArgs:"",add:s=>`sg32_add(${s})`,min:s=>`sg32_min(${s})`,max:s=>`sg32_max(${s})`}:{decls:r,entryArgs:`,
             @builtin(subgroup_size) sg_size : u32`,add:s=>`sg32_add(${s}, sg_size)`,min:s=>`sg32_min(${s}, sg_size)`,max:s=>`sg32_max(${s}, sg_size)`}}function Gs({V4:e,sw:t,norm:n,writeMomFn:r,momParams:s,momArgs:o}){const i=n==="none",a=i?"vec2<f32>":"vec4<f32>",f=i?`fn sg32_pack1(a : ${e}, slane : u32, c_out : u32, ${s}) -> u32 {
  let f = vec4<f32>(a${t});
  let mn = subgroupMin(min(min(f.x, f.y), min(f.z, f.w)));
  let mx = subgroupMax(max(max(f.x, f.y), max(f.z, f.w)));
  let sp = mx - mn;
  if (slane == 0u) {
    write_mom(c_out, vec4<f32>(0.0, 0.0, mn, sp), ${o});
  }
  return pack4x8unorm((f - vec4<f32>(mn)) * select(0.0, 1.0 / sp, sp > 1e-7));
}
`:`fn sg32_pack1(a : ${e}, slane : u32, c_out : u32, ${s}) -> u32 {
  let f = vec4<f32>(a${t});
  let s = subgroupAdd(f.x + f.y + f.z + f.w);
  let q = subgroupAdd(dot(f, f));
  let mn = subgroupMin(min(min(f.x, f.y), min(f.z, f.w)));
  let mx = subgroupMax(max(max(f.x, f.y), max(f.z, f.w)));
  let sp = mx - mn;
  if (slane == 0u) {
    write_mom(c_out, vec4<f32>(s, q, mn, sp), ${o});
  }
  return pack4x8unorm((f - vec4<f32>(mn)) * select(0.0, 1.0 / sp, sp > 1e-7));
}
`,l=i?`fn sg_sub_store(a : ${e}, slot : u32, sg_id : u32) {
  let f = vec4<f32>(a${t});
  let mn = subgroupMin(min(min(f.x, f.y), min(f.z, f.w)));
  let mx = subgroupMax(max(max(f.x, f.y), max(f.z, f.w)));
  if (sg_id == 0u) { sh_sg[slot] = vec2<f32>(mn, mx); }
}
`:`fn sg_sub_store(a : ${e}, slot : u32, sg_id : u32) {
  let f = vec4<f32>(a${t});
  let s = subgroupAdd(f.x + f.y + f.z + f.w);
  let q = subgroupAdd(dot(f, f));
  let mn = subgroupMin(min(min(f.x, f.y), min(f.z, f.w)));
  let mx = subgroupMax(max(max(f.x, f.y), max(f.z, f.w)));
  if (sg_id == 0u) { sh_sg[slot] = vec4<f32>(s, q, mn, mx); }
}
`,m=i?`      let p0 = sh_sg[rb];
      let p1 = sh_sg[rb + 1u];
      var rmn = min(p0.x, p1.x);
      var rmx = max(p0.y, p1.y);
      if (sg_size == 8u) {
        let p2 = sh_sg[rb + 2u];
        let p3 = sh_sg[rb + 3u];
        rmn = min(rmn, min(p2.x, p3.x));
        rmx = max(rmx, max(p2.y, p3.y));
      }
      let sp = rmx - rmn;
      sh_res[h * 4u + slane] = vec2<f32>(rmn, select(0.0, 1.0 / sp, sp > 1e-7));
      write_mom(c_base + slane, vec4<f32>(0.0, 0.0, rmn, sp), ${o});`:`      let p0 = sh_sg[rb];
      let p1 = sh_sg[rb + 1u];
      var rs = p0.x + p1.x;
      var rq = p0.y + p1.y;
      var rmn = min(p0.z, p1.z);
      var rmx = max(p0.w, p1.w);
      if (sg_size == 8u) {
        let p2 = sh_sg[rb + 2u];
        let p3 = sh_sg[rb + 3u];
        rs += p2.x + p3.x;
        rq += p2.y + p3.y;
        rmn = min(rmn, min(p2.z, p3.z));
        rmx = max(rmx, max(p2.w, p3.w));
      }
      let sp = rmx - rmn;
      sh_res[h * 4u + slane] = vec2<f32>(rmn, select(0.0, 1.0 / sp, sp > 1e-7));
      write_mom(c_base + slane, vec4<f32>(rs, rq, rmn, sp), ${o});`;return`var<workgroup> sh_sg  : array<${a}, 128>;
var<workgroup> sh_res : array<vec2<f32>, 32>;
${r}${f}${l}fn reduce_pack4_sg(
  a0 : ${e}, a1 : ${e}, a2 : ${e}, a3 : ${e},
  h : u32, slane : u32, sg_size : u32, sg_id : u32,
  c_base : u32, ${s}
) -> vec4<u32> {
  var out_q : vec4<u32>;
  if (sg_size == 32u) {
    out_q = vec4<u32>(
      sg32_pack1(a0, slane, c_base + 0u, ${o}),
      sg32_pack1(a1, slane, c_base + 1u, ${o}),
      sg32_pack1(a2, slane, c_base + 2u, ${o}),
      sg32_pack1(a3, slane, c_base + 3u, ${o})
    );
  } else {
    let b0 = (h * 4u) * 4u + (slane / sg_size);
    sg_sub_store(a0, b0 + 0u, sg_id);
    sg_sub_store(a1, b0 + 4u, sg_id);
    sg_sub_store(a2, b0 + 8u, sg_id);
    sg_sub_store(a3, b0 + 12u, sg_id);
    workgroupBarrier();
    if (slane < 4u) {
      let rb = (h * 4u + slane) * 4u;
${m}
    }
    workgroupBarrier();
    let r0 = sh_res[h * 4u + 0u];
    let r1 = sh_res[h * 4u + 1u];
    let r2 = sh_res[h * 4u + 2u];
    let r3 = sh_res[h * 4u + 3u];
    out_q = vec4<u32>(
      pack4x8unorm((vec4<f32>(a0${t}) - vec4<f32>(r0.x)) * r0.y),
      pack4x8unorm((vec4<f32>(a1${t}) - vec4<f32>(r1.x)) * r1.y),
      pack4x8unorm((vec4<f32>(a2${t}) - vec4<f32>(r2.x)) * r2.y),
      pack4x8unorm((vec4<f32>(a3${t}) - vec4<f32>(r3.x)) * r3.y)
    );
  }
  return out_q;
}
`}function Fa(e){const{cs:t,chan:n,nclass:r,clsK4:s,dilations:o,activation:i,norm:a,hasF16:f,subgroupMode:l="none",splitHalves:m,probCfg:d,chunkableStd:c=!1}=e,u=t/4,p=m?t/2:t,y=p*st,$=p*ut,h=9*t*3*u,_=h,z=h+u,b=f&&u%2===0&&z*8<=65536,g=Ts(i),v=f?`enable f16;
`:"",M=f&&l!=="none",w=M?`enable subgroups;
`:"",x=f?"f16":"f32",P=f?"h":"f",k=`vec4<${x}>`,S=f?256:255,F=E=>{const B=E?".xzyw":"",O=(V,re,X)=>m&&re>=p?`y8_1[${V} + ${(re-p)*ut}u] = ${X};`:`y8_0[${V} + ${re*ut}u] = ${X};`;if(M&&(l==="sg32"||l==="sg64"||l==="sg32_64")){const V=Os(l,a);return{decls:V.decls,entryArgs:V.entryArgs,localHeader:"",emit:({accVar:re,cStart:X,cEnd:oe,hrExpr:N,yRowExpr:j,momMode:G,writeY8Expr:se="true"})=>tt(oe-X,ne=>{const ce=X+ne,Z=G==="ext_and_main"?`mom_ext[(${N}) * ${t}u + ${ce}u] = mv;
      mom_main[(row_idx * 2u + sg) * ${t}u + ${ce}u] = mv;`:G==="ext_only"?`mom_ext[(${N}) * ${t}u + ${ce}u] = mv;`:`mom_main[(${N}) * ${t}u + ${ce}u] = mv;`;return a==="none"?`  {
    let f = vec4<f32>(${re}.v_${ne}${B});
    let lmn = ${V.min("min(min(f.x, f.y), min(f.z, f.w))")};
    let lmx = ${V.max("max(max(f.x, f.y), max(f.z, f.w))")};
    let sp = lmx - lmn;
    let inv = select(0.0, 1.0 / sp, sp > 1e-7);
    if (${se}) {
      ${O(j,ce,"pack4x8unorm((f - vec4<f32>(lmn)) * inv)")}
    }
    if (slane == 0u) {
      let mv = vec4<f32>(0.0, 0.0, lmn, sp);
      ${Z}
    }
  }
`:`  {
    let f = vec4<f32>(${re}.v_${ne}${B});
    let ls = ${V.add("f.x + f.y + f.z + f.w")};
    let lq = ${V.add("dot(f, f)")};
    let lmn = ${V.min("min(min(f.x, f.y), min(f.z, f.w))")};
    let lmx = ${V.max("max(max(f.x, f.y), max(f.z, f.w))")};
    let sp = lmx - lmn;
    let inv = select(0.0, 1.0 / sp, sp > 1e-7);
    if (${se}) {
      ${O(j,ce,"pack4x8unorm((f - vec4<f32>(lmn)) * inv)")}
    }
    if (slane == 0u) {
      let mv = vec4<f32>(ls, lq, lmn, sp);
      ${Z}
    }
  }
`})}}if(M&&l==="sg_small")return{decls:Gs({V4:k,sw:B,norm:a,writeMomFn:`fn write_mom(c_out : u32, mv : vec4<f32>, ext_off : u32, main_off : u32, mom_mode : u32) {
  if (mom_mode == 0u) {
    mom_main[main_off + c_out] = mv;
  } else if (mom_mode == 1u) {
    mom_ext[ext_off + c_out] = mv;
    mom_main[main_off + c_out] = mv;
  } else {
    mom_ext[ext_off + c_out] = mv;
  }
}
`,momParams:"ext_off : u32, main_off : u32, mom_mode : u32",momArgs:"ext_off, main_off, mom_mode"}),entryArgs:`,
             @builtin(subgroup_size) sg_size : u32,
             @builtin(subgroup_invocation_id) sg_id : u32`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:X,cStart:oe,cEnd:N,hrExpr:j,yRowExpr:G,momMode:se,writeY8Expr:ne="true"})=>{const ce=se==="ext_and_main"?"1u":se==="ext_only"?"2u":"0u",Z=se==="main"?"0u":`(${j}) * ${t}u`,ee=se==="ext_only"?"0u":`(row_idx * 2u + sg) * ${t}u`;let T=`  let ep_ext_off = ${Z};
  let ep_main_off = ${ee};
`;for(let I=0;I<N-oe;I+=4){const H=oe+I;T+=`  {
    let qw = reduce_pack4_sg(${X}.v_${I}, ${X}.v_${I+1}, ${X}.v_${I+2}, ${X}.v_${I+3}, h, slane, sg_size, sg_id, ${H}u, ep_ext_off, ep_main_off, ${ce});
    if (${ne}) {
      ${O(G,H,"qw.x")}
      ${O(G,H+1,"qw.y")}
      ${O(G,H+2,"qw.z")}
      ${O(G,H+3,"qw.w")}
    }
  }
`}return T}};const D=`    let c_out = c_base + slane;
    if (mom_mode == 0u) {
      mom_main[main_off + c_out] = mv;
    } else if (mom_mode == 1u) {
      mom_ext[ext_off + c_out] = mv;
      mom_main[main_off + c_out] = mv;
    } else {
      mom_ext[ext_off + c_out] = mv;
    }`;if(a==="none"&&f){const V=tt(31,X=>`    {
      let m = sh_mm[rb + ${X+1}u];
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`);return{decls:`var<workgroup> sh_mm  : array<vec2<f16>, 1024>;
var<workgroup> sh_res : array<vec2<f32>, 32>;
fn vec_mm16(a : vec4<f16>) -> vec2<f16> {
  return vec2<f16>(min(min(a.x, a.y), min(a.z, a.w)), max(max(a.x, a.y), max(a.z, a.w)));
}
fn reduce_pack4(
  a0 : ${k}, a1 : ${k}, a2 : ${k}, a3 : ${k},
  h : u32, slane : u32, c_base : u32, ext_off : u32, main_off : u32, mom_mode : u32
) -> vec4<u32> {
  let b0 = (h * 4u) * 32u + slane;
  sh_mm[b0]       = vec_mm16(a0);
  sh_mm[b0 + 32u] = vec_mm16(a1);
  sh_mm[b0 + 64u] = vec_mm16(a2);
  sh_mm[b0 + 96u] = vec_mm16(a3);
  workgroupBarrier();
  if (slane < 4u) {
    let rb = (h * 4u + slane) * 32u;
    let m0 = sh_mm[rb];
    var rmn : f16 = m0.x;
    var rmx : f16 = m0.y;
${V}    let fmn = f32(rmn);
    let sp = f32(rmx) - fmn;
    sh_res[h * 4u + slane] = vec2<f32>(fmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(0.0, 0.0, fmn, sp);
${D}
  }
  workgroupBarrier();
  let f0 = vec4<f32>(a0${B});
  let f1 = vec4<f32>(a1${B});
  let f2 = vec4<f32>(a2${B});
  let f3 = vec4<f32>(a3${B});
  let r0 = sh_res[h * 4u + 0u];
  let r1 = sh_res[h * 4u + 1u];
  let r2 = sh_res[h * 4u + 2u];
  let r3 = sh_res[h * 4u + 3u];
  return vec4<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y),
    pack4x8unorm((f2 - vec4<f32>(r2.x)) * r2.y),
    pack4x8unorm((f3 - vec4<f32>(r3.x)) * r3.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:X,cStart:oe,cEnd:N,hrExpr:j,yRowExpr:G,momMode:se,writeY8Expr:ne="true"})=>{const ce=se==="ext_and_main"?"1u":se==="ext_only"?"2u":"0u",Z=se==="main"?"0u":`(${j}) * ${t}u`,ee=se==="ext_only"?"0u":`(row_idx * 2u + sg) * ${t}u`;let T=`  let ep_ext_off = ${Z};
  let ep_main_off = ${ee};
`;for(let I=0;I<N-oe;I+=4){const H=oe+I;T+=`  {
    let qw = reduce_pack4(${X}.v_${I}, ${X}.v_${I+1}, ${X}.v_${I+2}, ${X}.v_${I+3}, h, slane, ${H}u, ep_ext_off, ep_main_off, ${ce});
    if (${ne}) {
      ${O(G,H,"qw.x")}
      ${O(G,H+1,"qw.y")}
      ${O(G,H+2,"qw.z")}
      ${O(G,H+3,"qw.w")}
    }
  }
`}return T}}}if(a==="none"){const V=tt(32,X=>`    {
      let m = sh_mm[rb + ${X}u];
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`);return{decls:`var<workgroup> sh_mm  : array<vec2<f32>, 1024>;
var<workgroup> sh_res : array<vec2<f32>, 32>;
fn vec_mm(f : vec4<f32>) -> vec2<f32> {
  return vec2<f32>(min(min(f.x, f.y), min(f.z, f.w)), max(max(f.x, f.y), max(f.z, f.w)));
}
fn reduce_pack4(
  a0 : ${k}, a1 : ${k}, a2 : ${k}, a3 : ${k},
  h : u32, slane : u32, c_base : u32, ext_off : u32, main_off : u32, mom_mode : u32
) -> vec4<u32> {
  let f0 = vec4<f32>(a0${B});
  let f1 = vec4<f32>(a1${B});
  let f2 = vec4<f32>(a2${B});
  let f3 = vec4<f32>(a3${B});
  let b0 = (h * 4u) * 32u + slane;
  sh_mm[b0]       = vec_mm(f0);
  sh_mm[b0 + 32u] = vec_mm(f1);
  sh_mm[b0 + 64u] = vec_mm(f2);
  sh_mm[b0 + 96u] = vec_mm(f3);
  workgroupBarrier();
  if (slane < 4u) {
    let rb = (h * 4u + slane) * 32u;
    var rmn : f32 = 3.0e38;
    var rmx : f32 = -3.0e38;
${V}    let sp = rmx - rmn;
    sh_res[h * 4u + slane] = vec2<f32>(rmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(0.0, 0.0, rmn, sp);
${D}
  }
  workgroupBarrier();
  let r0 = sh_res[h * 4u + 0u];
  let r1 = sh_res[h * 4u + 1u];
  let r2 = sh_res[h * 4u + 2u];
  let r3 = sh_res[h * 4u + 3u];
  return vec4<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y),
    pack4x8unorm((f2 - vec4<f32>(r2.x)) * r2.y),
    pack4x8unorm((f3 - vec4<f32>(r3.x)) * r3.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:X,cStart:oe,cEnd:N,hrExpr:j,yRowExpr:G,momMode:se,writeY8Expr:ne="true"})=>{const ce=se==="ext_and_main"?"1u":se==="ext_only"?"2u":"0u",Z=se==="main"?"0u":`(${j}) * ${t}u`,ee=se==="ext_only"?"0u":`(row_idx * 2u + sg) * ${t}u`;let T=`  let ep_ext_off = ${Z};
  let ep_main_off = ${ee};
`;for(let I=0;I<N-oe;I+=4){const H=oe+I;T+=`  {
    let qw = reduce_pack4(${X}.v_${I}, ${X}.v_${I+1}, ${X}.v_${I+2}, ${X}.v_${I+3}, h, slane, ${H}u, ep_ext_off, ep_main_off, ${ce});
    if (${ne}) {
      ${O(G,H,"qw.x")}
      ${O(G,H+1,"qw.y")}
      ${O(G,H+2,"qw.z")}
      ${O(G,H+3,"qw.w")}
    }
  }
`}return T}}}if(f){const V=tt(31,X=>{const oe=X+1;return`    {
      let s = sh_sq[rb + ${oe}u];
      let m = sh_mm[rb + ${oe}u];
      rs += s.x;
      rq += s.y;
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`});return{decls:`var<workgroup> sh_sq  : array<vec2<f32>, 1024>;
var<workgroup> sh_mm  : array<vec2<f16>, 1024>;
var<workgroup> sh_res : array<vec2<f32>, 32>;
fn vec_mm16(a : vec4<f16>) -> vec2<f16> {
  return vec2<f16>(min(min(a.x, a.y), min(a.z, a.w)), max(max(a.x, a.y), max(a.z, a.w)));
}
fn reduce_pack4(
  a0 : ${k}, a1 : ${k}, a2 : ${k}, a3 : ${k},
  h : u32, slane : u32, c_base : u32, ext_off : u32, main_off : u32, mom_mode : u32
) -> vec4<u32> {
  let f0 = vec4<f32>(a0${B});
  let f1 = vec4<f32>(a1${B});
  let f2 = vec4<f32>(a2${B});
  let f3 = vec4<f32>(a3${B});
  let b0 = (h * 4u) * 32u + slane;
  sh_sq[b0]       = vec2<f32>(f0.x + f0.y + f0.z + f0.w, dot(f0, f0));
  sh_sq[b0 + 32u] = vec2<f32>(f1.x + f1.y + f1.z + f1.w, dot(f1, f1));
  sh_sq[b0 + 64u] = vec2<f32>(f2.x + f2.y + f2.z + f2.w, dot(f2, f2));
  sh_sq[b0 + 96u] = vec2<f32>(f3.x + f3.y + f3.z + f3.w, dot(f3, f3));
  sh_mm[b0]       = vec_mm16(a0);
  sh_mm[b0 + 32u] = vec_mm16(a1);
  sh_mm[b0 + 64u] = vec_mm16(a2);
  sh_mm[b0 + 96u] = vec_mm16(a3);
  workgroupBarrier();
  if (slane < 4u) {
    let rb = (h * 4u + slane) * 32u;
    let s0 = sh_sq[rb];
    let m0 = sh_mm[rb];
    var rs : f32 = s0.x;
    var rq : f32 = s0.y;
    var rmn : f16 = m0.x;
    var rmx : f16 = m0.y;
${V}    let fmn = f32(rmn);
    let sp = f32(rmx) - fmn;
    sh_res[h * 4u + slane] = vec2<f32>(fmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(rs, rq, fmn, sp);
${D}
  }
  workgroupBarrier();
  let r0 = sh_res[h * 4u + 0u];
  let r1 = sh_res[h * 4u + 1u];
  let r2 = sh_res[h * 4u + 2u];
  let r3 = sh_res[h * 4u + 3u];
  return vec4<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y),
    pack4x8unorm((f2 - vec4<f32>(r2.x)) * r2.y),
    pack4x8unorm((f3 - vec4<f32>(r3.x)) * r3.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:X,cStart:oe,cEnd:N,hrExpr:j,yRowExpr:G,momMode:se,writeY8Expr:ne="true"})=>{const ce=se==="ext_and_main"?"1u":se==="ext_only"?"2u":"0u",Z=se==="main"?"0u":`(${j}) * ${t}u`,ee=se==="ext_only"?"0u":`(row_idx * 2u + sg) * ${t}u`;let T=`  let ep_ext_off = ${Z};
  let ep_main_off = ${ee};
`;for(let I=0;I<N-oe;I+=4){const H=oe+I;T+=`  {
    let qw = reduce_pack4(${X}.v_${I}, ${X}.v_${I+1}, ${X}.v_${I+2}, ${X}.v_${I+3}, h, slane, ${H}u, ep_ext_off, ep_main_off, ${ce});
    if (${ne}) {
      ${O(G,H,"qw.x")}
      ${O(G,H+1,"qw.y")}
      ${O(G,H+2,"qw.z")}
      ${O(G,H+3,"qw.w")}
    }
  }
`}return T}}}const J=tt(32,V=>`    {
      let s = sh_sq[rb + ${V}u];
      let m = sh_mm[rb + ${V}u];
      rs += s.x;
      rq += s.y;
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`);return{decls:`var<workgroup> sh_sq  : array<vec2<f32>, 512>;
var<workgroup> sh_mm  : array<vec2<f32>, 512>;
var<workgroup> sh_res : array<vec2<f32>, 16>;
fn vec_mm(f : vec4<f32>) -> vec2<f32> {
  return vec2<f32>(min(min(f.x, f.y), min(f.z, f.w)), max(max(f.x, f.y), max(f.z, f.w)));
}
fn reduce_pack2(
  a0 : ${k}, a1 : ${k},
  h : u32, slane : u32, c_base : u32, ext_off : u32, main_off : u32, mom_mode : u32
) -> vec2<u32> {
  let f0 = vec4<f32>(a0${B});
  let f1 = vec4<f32>(a1${B});
  let b0 = (h * 2u) * 32u + slane;
  sh_sq[b0]       = vec2<f32>(f0.x + f0.y + f0.z + f0.w, dot(f0, f0));
  sh_sq[b0 + 32u] = vec2<f32>(f1.x + f1.y + f1.z + f1.w, dot(f1, f1));
  sh_mm[b0]       = vec_mm(f0);
  sh_mm[b0 + 32u] = vec_mm(f1);
  workgroupBarrier();
  if (slane < 2u) {
    let rb = (h * 2u + slane) * 32u;
    var rs : f32 = 0.0;
    var rq : f32 = 0.0;
    var rmn : f32 = 3.0e38;
    var rmx : f32 = -3.0e38;
${J}    let sp = rmx - rmn;
    sh_res[h * 2u + slane] = vec2<f32>(rmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(rs, rq, rmn, sp);
${D}
  }
  workgroupBarrier();
  let r0 = sh_res[h * 2u + 0u];
  let r1 = sh_res[h * 2u + 1u];
  return vec2<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:V,cStart:re,cEnd:X,hrExpr:oe,yRowExpr:N,momMode:j,writeY8Expr:G="true"})=>{const se=j==="ext_and_main"?"1u":j==="ext_only"?"2u":"0u",ne=j==="main"?"0u":`(${oe}) * ${t}u`,ce=j==="ext_only"?"0u":`(row_idx * 2u + sg) * ${t}u`;let Z=`  let ep_ext_off = ${ne};
  let ep_main_off = ${ce};
`;for(let ee=0;ee<X-re;ee+=2){const T=re+ee;Z+=`  {
    let qw = reduce_pack2(${V}.v_${ee}, ${V}.v_${ee+1}, h, slane, ${T}u, ep_ext_off, ep_main_off, ${se});
    if (${G}) {
      ${O(N,T,"qw.x")}
      ${O(N,T+1,"qw.y")}
    }
  }
`}return Z}}},L=()=>`
@group(0) @binding(0) var<storage, read_write> act0 : array<u32>;
@group(0) @binding(1) var<storage, read_write> act1 : array<u32>;
@compute @workgroup_size(${st}, 1, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let row_base = (wid.z * 256u + wid.y) * ${y}u + lid.x;
  let val = ${g.uZeroWord}u;
  for (var c : u32 = 0u; c < ${p}u; c = c + 1u) {
    let idx = row_base + c * ${st}u;
    act0[idx] = val;
    ${m?"act1[idx] = val;":""}
  }
}`,K=o[0];return{initActWgsl:L,conv0Wgsl:()=>{const E=!f&&m,B=F(!1),O=(oe,N)=>{const j=oe/4,G=N/4;return tt(G-j,se=>{const ne=j+se,ce=ne*4;return`          {
            let w0 = w16_4[wb + ${ne}u];
            let w1 = w16_4[wb + ${u+ne}u];
            let w2 = w16_4[wb + ${2*u+ne}u];
            a_${ce}     = fma(vn, ${k}(w0.x), fma(vc, ${k}(w1.x), fma(vp, ${k}(w2.x), a_${ce})));
            a_${ce+1} = fma(vn, ${k}(w0.y), fma(vc, ${k}(w1.y), fma(vp, ${k}(w2.y), a_${ce+1})));
            a_${ce+2} = fma(vn, ${k}(w0.z), fma(vc, ${k}(w1.z), fma(vp, ${k}(w2.z), a_${ce+2})));
            a_${ce+3} = fma(vn, ${k}(w0.w), fma(vc, ${k}(w1.w), fma(vp, ${k}(w2.w), a_${ce+3})));
          }
`})},D=Math.floor(K/4),J=K%4;let Y="";J===0?Y=`
        let vn = inp_4[base - ${D}u];
        let vc = inp_4[base];
        let vp = inp_4[base + ${D}u];`:D===0&&J===1?Y=`
        let vL = inp_4[base - 1u];
        let vc = inp_4[base];
        let vR = inp_4[base + 1u];
        let vn = ${k}(vL.w, vc.xyz);
        let vp = ${k}(vc.yzw, vR.x);`:J===1?Y=`
        let vL = inp_4[base - ${D+1}u];
        let vN = inp_4[base - ${D}u];
        let vc = inp_4[base];
        let vP = inp_4[base + ${D}u];
        let vR = inp_4[base + ${D+1}u];
        let vn = ${k}(vL.w, vN.xyz);
        let vp = ${k}(vP.yzw, vR.x);`:J===2?Y=`
        let vL = inp_4[base - ${D+1}u];
        let vN = ${D===0?"inp_4[base]":`inp_4[base - ${D}u]`};
        let vc = ${D===0?"vN":"inp_4[base]"};
        let vP = ${D===0?"vN":`inp_4[base + ${D}u]`};
        let vR = inp_4[base + ${D+1}u];
        let vn = ${k}(vL.zw, vN.xy);
        let vp = ${k}(vP.zw, vR.xy);`:Y=`
        let vL = inp_4[base - ${D+1}u];
        let vN = ${D===0?"inp_4[base]":`inp_4[base - ${D}u]`};
        let vc = ${D===0?"vN":"inp_4[base]"};
        let vP = ${D===0?"vN":`inp_4[base + ${D}u]`};
        let vR = inp_4[base + ${D+1}u];
        let vn = ${k}(vL.yzw, vN.x);
        let vp = ${k}(vP.w, vR.xyz);`;const V=(oe,N,j,G)=>{const se=G-j,ne=tt(se,ee=>`  v_${ee} : ${k},
`),ce=tt(se,ee=>{const T=j+ee;return a==="none"?`  var a_${T} = ${k}(${x}(qmeta[${3*t+T}u]));
`:`  var a_${T} = ${k}(0.0${P});
`}),Z=Array.from({length:se},(ee,T)=>`a_${j+T}`).join(", ");return`struct ${N} {
${ne}};
fn ${oe}(y : i32, z : i32, x_pad : u32) -> ${N} {
${ce}  var tap_yz : u32 = 0u;
  for (var dz : i32 = -1; dz <= 1; dz = dz + 1) {
    let sz = z + dz * ${K};
    for (var dy : i32 = -1; dy <= 1; dy = dy + 1) {
      let sy = y + dy * ${K};
      if ((u32(sz) | u32(sy)) < 256u) {
        let base = (u32(sz) * 256u + u32(sy)) * ${st}u + x_pad;
${Y}
        let wb = tap_yz * ${3*u}u;
${O(j,G)}
      }
      tap_yz = tap_yz + 1u;
    }
  }
  return ${N}(${Z});
}
`},re=(oe,N,j,G,se)=>{const ne=se?`  let y = i32(p0.bg_y0 + lid.y);
  let z = i32(p0.bg_z0);`:`  var y : i32;
  var z : i32;
  if (p0.is_full != 0u) {
    y = i32(wid.y * 4u + lid.y);
    z = i32(wid.z);
  } else {
    let pk = strips0[wid.z];
    y = i32((pk & 255u) * 4u + lid.y);
    z = i32(pk >> 8u);
  }`,ce=se?"lid.y * 2u + sg":"row_idx * 2u + sg";return`
@compute @workgroup_size(64, 4, 1)
fn ${oe}(@builtin(local_invocation_id) lid : vec3<u32>,
             @builtin(workgroup_id) wid : vec3<u32>${B.entryArgs||""}) {
  let sg = lid.x >> 5u;
  let slane = lid.x & 31u;
${B.localHeader}  let x_pad = lid.x + ${Et}u;
${ne}
  let acc = ${N}(y, z, x_pad);
  let row_idx = u32(z) * 256u + u32(y);
  let y_row_base = row_idx * ${$}u + lid.x;
${B.emit({accVar:"acc",cStart:j,cEnd:G,hrExpr:ce,yRowExpr:"y_row_base",momMode:se?"ext_only":"main"})}}`},X=E?V("run_conv0_lo","Conv0AccLo",0,p)+V("run_conv0_hi","Conv0AccHi",p,t)+re("main_lo","run_conv0_lo",0,p,!1)+re("main_hi","run_conv0_hi",p,t,!1)+re("main_bg_lo","run_conv0_lo",0,p,!0)+re("main_bg_hi","run_conv0_hi",p,t,!0):V("run_conv0","Conv0Acc",0,t)+re("main","run_conv0",0,t,!1)+re("main_bg","run_conv0",0,t,!0);return`${v}${w}
struct Params0 {
  is_full : u32,
  bg_y0 : u32,
  bg_z0 : u32,
  pad0 : u32,
};
@group(0) @binding(0) var<storage, read> inp_4 : array<${k}>;
@group(0) @binding(1) var<storage, read_write> y8_0 : array<u32>;
@group(0) @binding(2) var<storage, read_write> y8_1 : array<u32>;
@group(0) @binding(3) var<storage, read> w16_4 : array<${k}>;
@group(0) @binding(4) var<storage, read> qmeta : array<f32>;
@group(0) @binding(5) var<storage, read_write> mom_main : array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> mom_ext : array<vec4<f32>>;
@group(0) @binding(7) var<storage, read> strips0 : array<u32>;
@group(0) @binding(8) var<uniform> p0 : Params0;
${B.decls}${X}`},prepWgsl:()=>`${v}
${zn(i)}
struct PrepParams {
  meta_off : u32,
  next_w_vec4_off : u32,
  next_meta_off : u32,
  has_next : u32,
  is_first : u32,
  is_full : u32,
  n_main_strips : u32,
  n_ext_hr : u32,
  ext_weight : f32,
  pad0 : u32,
  pad1 : u32,
  pad2 : u32,
};
@group(0) @binding(0) var<storage, read> w16_4 : array<${k}>;
@group(0) @binding(1) var<storage, read> qmeta : array<f32>;
@group(0) @binding(2) var<storage, read_write> mom_main : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> mom_ext : array<vec4<f32>>;
@group(0) @binding(4) var<storage, read_write> mom_stats : array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> w_eff : array<${k}>;
@group(0) @binding(6) var<storage, read> main_strips : array<u32>;
@group(0) @binding(7) var<uniform> pp : PrepParams;

${a==="gn"?`var<workgroup> fin_s  : array<f32, 256>;
var<workgroup> fin_q  : array<f32, 256>;
var<workgroup> fin_es : array<f32, 256>;
var<workgroup> fin_eq : array<f32, 256>;
`:""}var<workgroup> fin_mn : array<f32, 256>;
var<workgroup> fin_mx : array<f32, 256>;

@compute @workgroup_size(256, 1, 1)
fn moments_finish(@builtin(local_invocation_index) lid : u32,
                  @builtin(workgroup_id) wid : vec3<u32>) {
  let c = wid.x;
${a==="gn"?`  var s : f32 = 0.0;
  var q : f32 = 0.0;
  var es : f32 = 0.0;
  var eq : f32 = 0.0;
`:""}  var mn : f32 = 3.0e38;
  var mx : f32 = -3.0e38;
  if (pp.is_full != 0u) {
    for (var hr : u32 = lid; hr < ${Bn}u; hr = hr + 256u) {
      let v = mom_main[hr * ${t}u + c];
${a==="gn"?`      s  += v.x;
      q  += v.y;
`:""}      mn  = min(mn, v.z);
      mx  = max(mx, v.z + v.w);
    }
  } else {
    for (var si : u32 = lid; si < pp.n_main_strips; si = si + 256u) {
      let pk = main_strips[si];
      let base_hr = ((pk >> 8u) * 256u + (pk & 255u) * 4u) * 2u;
      for (var h : u32 = 0u; h < 8u; h = h + 1u) {
        let v = mom_main[(base_hr + h) * ${t}u + c];
${a==="gn"?`        s  += v.x;
        q  += v.y;
`:""}        mn  = min(mn, v.z);
        mx  = max(mx, v.z + v.w);
      }
    }
    if (pp.is_first != 0u) {
      mn = min(mn, 0.0);
      mx = max(mx, 0.0);
    } else if (pp.n_ext_hr > 0u) {
      for (var e : u32 = lid; e < pp.n_ext_hr; e = e + 256u) {
        let v = mom_ext[e * ${t}u + c];
${a==="gn"?`        es += v.x;
        eq += v.y;
`:""}        mn  = min(mn, v.z);
        mx  = max(mx, v.z + v.w);
      }
    }
  }
${a==="gn"?`  fin_s[lid]  = s;
  fin_q[lid]  = q;
  fin_es[lid] = es;
  fin_eq[lid] = eq;
`:""}  fin_mn[lid] = mn;
  fin_mx[lid] = mx;
  workgroupBarrier();
  for (var stride : u32 = 128u; stride > 0u; stride = stride >> 1u) {
    if (lid < stride) {
${a==="gn"?`      fin_s[lid]  += fin_s[lid + stride];
      fin_q[lid]  += fin_q[lid + stride];
      fin_es[lid] += fin_es[lid + stride];
      fin_eq[lid] += fin_eq[lid + stride];
`:""}      fin_mn[lid]  = min(fin_mn[lid], fin_mn[lid + stride]);
      fin_mx[lid]  = max(fin_mx[lid], fin_mx[lid + stride]);
    }
    workgroupBarrier();
  }
  if (lid == 0u) {
    let mbase = pp.meta_off;
    let gamma = qmeta[mbase + c];
    let beta  = qmeta[mbase + ${t}u + c];
    let eps_base = qmeta[mbase + ${2*t}u + c];
    let q_prev = select(mom_stats[${t*2}u].x, 1.0, pp.is_first != 0u);
    let eff_eps = eps_base / (q_prev * q_prev);
${a==="gn"?`    let total_s = fin_s[0] + pp.ext_weight * fin_es[0];
    let total_q = fin_q[0] + pp.ext_weight * fin_eq[0];
    let mean = total_s / 16777216.0;
    let varr = max(total_q / 16777216.0 - mean * mean, 0.0);
    let inv_std = inverseSqrt(varr + eff_eps);
`:`    let mean : f32 = 0.0;
    let inv_std : f32 = 1.0;
`}    let scale = inv_std * gamma;
    let shift = beta - mean * scale;
    let u_lo = fin_mn[0] * scale + shift;
    let u_hi = fin_mx[0] * scale + shift;
    let vmax = max(0.25, max(act(u_lo), act(u_hi)));
    ${i==="gelu_tanh"?`
    let qs = select(max(vmax / 248.0, 0.1705 / 7.0), 1.0, c >= ${n}u);
    `:i==="relu"?`
    let qs = select(max(vmax / 255.0, 1e-6), 1.0, c >= ${n}u);
    `:`
    let qs = select(max(vmax / 223.0, 1.0 / 32.0), 1.0, c >= ${n}u);
    `}
    let sb = c * 2u;
    mom_stats[sb]      = vec4<f32>(mean, inv_std, qs, 1.0 / qs);
    mom_stats[sb + 1u] = vec4<f32>(scale, shift, 0.0, 0.0);
  }
}

@compute @workgroup_size(256, 1, 1)
fn prep_weff(@builtin(local_invocation_index) lid : u32) {
  if (pp.has_next == 0u) { return; }
  var q_ref : f32 = 1e-6;
  for (var ic : u32 = 0u; ic < ${n}u; ic = ic + 1u) {
    let qs = mom_stats[ic * 2u].z;
    q_ref = max(q_ref, ${S.toFixed(1)} * qs);
  }
  ${a==="none"?"q_ref = 1.0;":""}
  if (lid == 0u) {
    mom_stats[${t*2}u] = vec4<f32>(q_ref, 0.0, 0.0, 0.0);
  }
  let scale_num = ${S.toFixed(1)} / q_ref;
  for (var idx : u32 = lid; idx < ${h}u; idx = idx + 256u) {
    let ic = (idx / ${3*u}u) % ${t}u;
    let qs = mom_stats[ic * 2u].z;
    w_eff[idx] = w16_4[pp.next_w_vec4_off + idx] * ${x}(qs * scale_num);
  }
  if (lid < ${u}u) {
    ${a==="none"?`
    let mb = pp.next_meta_off + ${3*t}u + lid * 4u;
    w_eff[${_}u + lid] = ${k}(${x}(qmeta[mb]), ${x}(qmeta[mb + 1u]), ${x}(qmeta[mb + 2u]), ${x}(qmeta[mb + 3u]));
    `:`
    w_eff[${_}u + lid] = ${k}(0.0${P});
    `}
  }
}`,normWgsl:()=>`${zn(i)}
struct NormParams {
  is_full : u32,
  bg_row : u32,
  halo_off : u32,
  n_halo : u32,
};
@group(0) @binding(0) var<storage, read_write> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read_write> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read> y8_0 : array<u32>;
@group(0) @binding(3) var<storage, read> y8_1 : array<u32>;
@group(0) @binding(4) var<storage, read> mom_main : array<vec4<f32>>;
@group(0) @binding(5) var<storage, read> mom_ext : array<vec4<f32>>;
@group(0) @binding(6) var<storage, read> mom_stats : array<vec4<f32>>;
@group(0) @binding(7) var<storage, read> norm_aux : array<u32>;
@group(0) @binding(8) var<uniform> np : NormParams;

@compute @workgroup_size(64, 4, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let x4 = lid.x;
  let sg = x4 >> 5u;
  let x_pad = x4 + ${Et}u;
  var y : u32;
  var z : u32;
  if (np.is_full != 0u) {
    y = wid.y * 4u + lid.y;
    z = wid.z;
  } else {
    let pk = norm_aux[wid.z];
    y = (pk & 255u) * 4u + lid.y;
    z = pk >> 8u;
  }
  let row_idx = z * 256u + y;
  let hr = row_idx * 2u + sg;
  let y_base = row_idx * ${$}u + x4;
  let a_base = row_idx * ${y}u + x_pad;
  let mom_base = hr * ${t}u;

  for (var c : u32 = 0u; c < ${p}u; c = c + 1u) {
    let inv_qs = mom_stats[c * 2u].w;
    let st = mom_stats[c * 2u + 1u];
    let rm = mom_main[mom_base + c];
    let yv = unpack4x8unorm(y8_0[y_base + c * ${ut}u]) * rm.w + vec4<f32>(rm.z);
    let a = vec4<f32>(
      act(yv.x * st.x + st.y),
      act(yv.y * st.x + st.y),
      act(yv.z * st.x + st.y),
      act(yv.w * st.x + st.y)
    );
    act8_0[a_base + c * ${st}u] = pack4x8unorm((a * inv_qs + vec4<f32>(${g.zeroBin.toFixed(1)})) * (1.0 / 255.0));
  }
  ${m?`
  for (var c : u32 = 0u; c < ${p}u; c = c + 1u) {
    let cg = ${p}u + c;
    let inv_qs = mom_stats[cg * 2u].w;
    let st = mom_stats[cg * 2u + 1u];
    let rm = mom_main[mom_base + cg];
    let yv = unpack4x8unorm(y8_1[y_base + c * ${ut}u]) * rm.w + vec4<f32>(rm.z);
    let a = vec4<f32>(
      act(yv.x * st.x + st.y),
      act(yv.y * st.x + st.y),
      act(yv.z * st.x + st.y),
      act(yv.w * st.x + st.y)
    );
    act8_1[a_base + c * ${st}u] = pack4x8unorm((a * inv_qs + vec4<f32>(${g.zeroBin.toFixed(1)})) * (1.0 / 255.0));
  }`:""}
}

@compute @workgroup_size(64, 4, 1)
fn norm_halo_fill(@builtin(local_invocation_id) lid : vec3<u32>,
                  @builtin(workgroup_id) wid : vec3<u32>) {
  let idx = wid.y * 4u + lid.y;
  if (idx >= np.n_halo) { return; }
  let x4 = lid.x;
  let sg = x4 >> 5u;
  let x_pad = x4 + ${Et}u;
  let y_base = np.bg_row * ${$}u + x4;
  let mom_base = sg * ${t}u;
  let dst_row = norm_aux[np.halo_off + idx];
  let a_base = dst_row * ${y}u + x_pad;

  for (var c : u32 = 0u; c < ${p}u; c = c + 1u) {
    let inv_qs = mom_stats[c * 2u].w;
    let st = mom_stats[c * 2u + 1u];
    let rm = mom_ext[mom_base + c];
    let yv = unpack4x8unorm(y8_0[y_base + c * ${ut}u]) * rm.w + vec4<f32>(rm.z);
    let a = vec4<f32>(
      act(yv.x * st.x + st.y),
      act(yv.y * st.x + st.y),
      act(yv.z * st.x + st.y),
      act(yv.w * st.x + st.y)
    );
    act8_0[a_base + c * ${st}u] = pack4x8unorm((a * inv_qs + vec4<f32>(${g.zeroBin.toFixed(1)})) * (1.0 / 255.0));
  }
  ${m?`
  for (var c : u32 = 0u; c < ${p}u; c = c + 1u) {
    let cg = ${p}u + c;
    let inv_qs = mom_stats[cg * 2u].w;
    let st = mom_stats[cg * 2u + 1u];
    let rm = mom_ext[mom_base + cg];
    let yv = unpack4x8unorm(y8_1[y_base + c * ${ut}u]) * rm.w + vec4<f32>(rm.z);
    let a = vec4<f32>(
      act(yv.x * st.x + st.y),
      act(yv.y * st.x + st.y),
      act(yv.z * st.x + st.y),
      act(yv.w * st.x + st.y)
    );
    act8_1[a_base + c * ${st}u] = pack4x8unorm((a * inv_qs + vec4<f32>(${g.zeroBin.toFixed(1)})) * (1.0 / 255.0));
  }`:""}
}`,convWgsl:()=>{const E=!f&&m,B=F(f),O=(N,j)=>f?`
          let ${N} = vec4<f16>(vec2<f16>(unpack2x16float(((${j} & 0x00FF00FFu) << 2u) | 0x3C003C00u)), vec2<f16>(unpack2x16float(((${j} >> 6u) & 0x03FC03FCu) | 0x3C003C00u))) - vec4<f16>(${g.sterbenzSub});`:`
          let ${N} = unpack4x8unorm(${j}) - vec4<f32>(${g.uZeroFloat});`,D=N=>`
          let uL = ${N}[base - off0];
          let uN = ${N}[base - off1];
          let uC = ${N}[base];
          let uP = ${N}[base + off1];
          let uR = ${N}[base + off0];
          let u_neg = (uL >> sh_l) | (uN << sh_r);
          let u_pos = (uP >> sh_r) | (uR << sh_l);`+O("vn","u_neg")+O("vc","uC")+O("vp","u_pos"),J=(N,j)=>{const G=N/4,se=j/4;if(b){const ne=u/2,ce=u;let Z="";for(let ee=G;ee<se;ee+=2){const T=ee*4,I=ee/2;Z+=`          {
            let wp0 = w_eff_u[wbu + ${I}u];
            let wp1 = w_eff_u[wbu + ${ne+I}u];
            let wp2 = w_eff_u[wbu + ${ce+I}u];
            let w0a = u4_lo(wp0);
            let w0b = u4_hi(wp0);
            let w1a = u4_lo(wp1);
            let w1b = u4_hi(wp1);
            let w2a = u4_lo(wp2);
            let w2b = u4_hi(wp2);
            a_${T}     = fma(vn, vec4<f16>(w0a.x), fma(vc, vec4<f16>(w1a.x), fma(vp, vec4<f16>(w2a.x), a_${T})));
            a_${T+1} = fma(vn, vec4<f16>(w0a.y), fma(vc, vec4<f16>(w1a.y), fma(vp, vec4<f16>(w2a.y), a_${T+1})));
            a_${T+2} = fma(vn, vec4<f16>(w0a.z), fma(vc, vec4<f16>(w1a.z), fma(vp, vec4<f16>(w2a.z), a_${T+2})));
            a_${T+3} = fma(vn, vec4<f16>(w0a.w), fma(vc, vec4<f16>(w1a.w), fma(vp, vec4<f16>(w2a.w), a_${T+3})));
            a_${T+4} = fma(vn, vec4<f16>(w0b.x), fma(vc, vec4<f16>(w1b.x), fma(vp, vec4<f16>(w2b.x), a_${T+4})));
            a_${T+5} = fma(vn, vec4<f16>(w0b.y), fma(vc, vec4<f16>(w1b.y), fma(vp, vec4<f16>(w2b.y), a_${T+5})));
            a_${T+6} = fma(vn, vec4<f16>(w0b.z), fma(vc, vec4<f16>(w1b.z), fma(vp, vec4<f16>(w2b.z), a_${T+6})));
            a_${T+7} = fma(vn, vec4<f16>(w0b.w), fma(vc, vec4<f16>(w1b.w), fma(vp, vec4<f16>(w2b.w), a_${T+7})));
          }
`}return Z}return tt(se-G,ne=>{const ce=G+ne,Z=ce*4;return`          {
            let w0 = w_eff[wb + ${ce}u];
            let w1 = w_eff[wb + ${u+ce}u];
            let w2 = w_eff[wb + ${2*u+ce}u];
            a_${Z}     = fma(vn, ${k}(w0.x), fma(vc, ${k}(w1.x), fma(vp, ${k}(w2.x), a_${Z})));
            a_${Z+1} = fma(vn, ${k}(w0.y), fma(vc, ${k}(w1.y), fma(vp, ${k}(w2.y), a_${Z+1})));
            a_${Z+2} = fma(vn, ${k}(w0.z), fma(vc, ${k}(w1.z), fma(vp, ${k}(w2.z), a_${Z+2})));
            a_${Z+3} = fma(vn, ${k}(w0.w), fma(vc, ${k}(w1.w), fma(vp, ${k}(w2.w), a_${Z+3})));
          }
`})},Y=(N,j,G,se)=>{const ne=se-G,ce=tt(ne,ie=>`  v_${ie} : ${k},
`),Z=tt(ne,ie=>{const le=G+ie;if(a==="none"){const pe=le>>>2,ue=["x","y","z","w"][le&3];if(b){const he=_+pe>>>1,_e=_+pe&1?"u4_hi":"u4_lo";return`  var a_${le} = ${k}(${_e}(w_eff_u[${he}u]).${ue});
`}return`  var a_${le} = ${k}(w_eff[${_+pe}u].${ue});
`}return`  var a_${le} = ${k}(0.0${P});
`}),ee=p<=8?`(${p}u + cp.pad0)`:`${p}u`,T=b?`        let wbu_tap = tap_yz * ${t*3*u/2}u;
        for (var ic : u32 = 0u; ic < ${ee}; ic = ic + 1u) {
          let base = row_off + ic * ${st}u;
${D("act8_0")}
          let wbu = wbu_tap + ic * ${3*u/2}u;
${J(G,se)}
        }`:`        let wb_tap = tap_yz * ${t*3*u}u;
        for (var ic : u32 = 0u; ic < ${ee}; ic = ic + 1u) {
          let base = row_off + ic * ${st}u;
${D("act8_0")}
          let wb = wb_tap + ic * ${3*u}u;
${J(G,se)}
        }`,I=b?`        for (var ic : u32 = 0u; ic < ${ee}; ic = ic + 1u) {
          let base = row_off + ic * ${st}u;
${D("act8_1")}
          let wbu = wbu_tap + (${p}u + ic) * ${3*u/2}u;
${J(G,se)}
        }`:`        for (var ic : u32 = 0u; ic < ${ee}; ic = ic + 1u) {
          let base = row_off + ic * ${st}u;
${D("act8_1")}
          let wb = wb_tap + (${p}u + ic) * ${3*u}u;
${J(G,se)}
        }`,H=Array.from({length:ne},(ie,le)=>`a_${G+le}`).join(", ");return`struct ${j} {
${ce}};
fn ${N}(y : i32, z : i32, x_pad : u32, dp : u32) -> ${j} {
${Z}  let d_step = i32(dp & 63u);
  let off0 = (dp >> 6u) & 15u;
  let off1 = (dp >> 10u) & 15u;
  let sh_r = (dp >> 14u) & 31u;
  let sh_l = (dp >> 19u) & 31u;
  var tap_yz : u32 = 0u;
  for (var dz : i32 = -1; dz <= 1; dz = dz + 1) {
    let sz = z + dz * d_step;
    for (var dy : i32 = -1; dy <= 1; dy = dy + 1) {
      let sy = y + dy * d_step;
      if ((u32(sz) | u32(sy)) < 256u) {
        let row_off = (u32(sz) * 256u + u32(sy)) * ${y}u + x_pad;
${T}
        ${m?I:""}
      }
      tap_yz = tap_yz + 1u;
    }
  }
  return ${j}(${H});
}
`},V=(N,j,G,se,ne)=>{const ce=ne?c?`
  let ext_i = cp.ext_base + wid.z;
  let pk = strips[cp.ext_off + ext_i];
  let y = i32((pk & 255u) * 4u + lid.y);
  let z = i32(pk >> 8u);`:`
  let pk = strips[cp.ext_off + wid.z];
  let y = i32((pk & 255u) * 4u + lid.y);
  let z = i32(pk >> 8u);`:c?`
  var y : i32;
  var z : i32;
  if (cp.is_full != 0u) {
    y = i32(wid.y * 4u + lid.y);
    z = i32(cp.main_off + wid.z);
  } else {
    let pk = strips[cp.main_off + wid.z];
    y = i32((pk & 255u) * 4u + lid.y);
    z = i32(pk >> 8u);
  }`:`
  var y : i32;
  var z : i32;
  if (cp.is_full != 0u) {
    y = i32(wid.y * 4u + lid.y);
    z = i32(wid.z);
  } else {
    let pk = strips[wid.z];
    y = i32((pk & 255u) * 4u + lid.y);
    z = i32(pk >> 8u);
  }`,Z=ne?c?"ext_i * 8u + lid.y * 2u + sg":"wid.z * 8u + lid.y * 2u + sg":"row_idx * 2u + sg",ee=ne?"(((dp >> 24u) & 1u) != 0u)":"true";return`
@compute @workgroup_size(64, 4, 1)
fn ${N}(@builtin(local_invocation_id) lid : vec3<u32>,
             @builtin(workgroup_id) wid : vec3<u32>${B.entryArgs||""}) {
  let x4 = lid.x;
  let sg = x4 >> 5u;
  let slane = x4 & 31u;
${B.localHeader}  let x_pad = x4 + ${Et}u;
${ce}
  let dp = cp.d_pack;
  let acc = ${j}(y, z, x_pad, dp);
  let row_idx = u32(z) * 256u + u32(y);
  let y_row_base = row_idx * ${$}u + x4;
${B.emit({accVar:"acc",cStart:G,cEnd:se,hrExpr:Z,yRowExpr:"y_row_base",momMode:ne?"ext_and_main":"main",writeY8Expr:ee})}}`},re=E?Y("run_conv_lo","ConvAccLo",0,p)+Y("run_conv_hi","ConvAccHi",p,t)+V("main_lo","run_conv_lo",0,p,!1)+V("main_hi","run_conv_hi",p,t,!1)+V("main_ext_lo","run_conv_lo",0,p,!0)+V("main_ext_hi","run_conv_hi",p,t,!0):Y("run_conv","ConvAcc",0,t)+V("main","run_conv",0,t,!1)+V("main_ext","run_conv",0,t,!0),X=b?`fn u4_lo(u : vec4<u32>) -> vec4<f16> {
  return vec4<f16>(vec2<f16>(unpack2x16float(u.x)), vec2<f16>(unpack2x16float(u.y)));
}
fn u4_hi(u : vec4<u32>) -> vec4<f16> {
  return vec4<f16>(vec2<f16>(unpack2x16float(u.z)), vec2<f16>(unpack2x16float(u.w)));
}
@group(0) @binding(6) var<uniform> w_eff_u : array<vec4<u32>, ${Math.ceil(z/2)}>;`:`@group(0) @binding(6) var<storage, read> w_eff : array<${k}>;`;return`${v}${w}
${c?`struct ConvParams {
  is_full : u32,
  ext_off : u32,
  d_pack : u32,
  pad0 : u32,
  main_off : u32,
  ext_base : u32,
  pad1 : u32,
  pad2 : u32,
};`:`struct ConvParams {
  is_full : u32,
  ext_off : u32,
  d_pack : u32,
  pad0 : u32,
};`}
@group(0) @binding(0) var<storage, read> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read_write> y8_0 : array<u32>;
@group(0) @binding(3) var<storage, read_write> y8_1 : array<u32>;
@group(0) @binding(4) var<storage, read_write> mom_main : array<vec4<f32>>;
@group(0) @binding(5) var<storage, read_write> mom_ext : array<vec4<f32>>;
${X}
@group(0) @binding(7) var<storage, read> strips : array<u32>;
@group(0) @binding(8) var<uniform> cp : ConvParams;
${B.decls}${re}`},clsWgsl:()=>`${v}
${zn(i)}
struct ClsParams {
  w_vec4_off : u32,
  bias_off : u32,
  is_full : u32,
  pad0 : u32,
};
@group(0) @binding(0) var<storage, read> y8_0 : array<u32>;
@group(0) @binding(1) var<storage, read> y8_1 : array<u32>;
@group(0) @binding(2) var<storage, read> w16_4 : array<${k}>;
@group(0) @binding(3) var<storage, read> qmeta : array<f32>;
@group(0) @binding(4) var<storage, read> mom_main : array<vec4<f32>>;
@group(0) @binding(5) var<storage, read> mom_stats : array<vec4<f32>>;
@group(0) @binding(6) var<storage, read_write> labels8 : array<u32>;
@group(0) @binding(7) var<storage, read> cls_strips : array<u32>;
@group(0) @binding(8) var<uniform> cp : ClsParams;

@compute @workgroup_size(64, 4, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let x4 = lid.x;
  let sg = x4 >> 5u;
  var y : u32;
  var z : u32;
  if (cp.is_full != 0u) {
    y = wid.y * 4u + lid.y;
    z = wid.z;
  } else {
    let pk = cls_strips[wid.z];
    y = (pk & 255u) * 4u + lid.y;
    z = pk >> 8u;
  }
  let row_idx = z * 256u + y;
  let hr = row_idx * 2u + sg;
  let y_base = row_idx * ${$}u + x4;
  let mom_base = hr * ${t}u;

  var feat : array<${k}, ${n}>;
  for (var c : u32 = 0u; c < ${n}u; c = c + 1u) {
    let st = mom_stats[c * 2u + 1u];
    let rm = mom_main[mom_base + c];
    ${m?`
    let in_hi = c >= ${p}u;
    let c_loc = select(c, c - ${p}u, in_hi);
    let idx4 = y_base + c_loc * ${ut}u;
    let q_word = select(y8_0[idx4], y8_1[idx4], in_hi);
    `:`
    let q_word = y8_0[y_base + c * ${ut}u];
    `}
    let yv = unpack4x8unorm(q_word) * rm.w + vec4<f32>(rm.z);
    let fv = vec4<f32>(
      act(yv.x * st.x + st.y),
      act(yv.y * st.x + st.y),
      act(yv.z * st.x + st.y),
      act(yv.w * st.x + st.y)
    );
    feat[c] = ${k}(fv);
  }

  let w_cls = cp.w_vec4_off;
  let m_cls = cp.bias_off;
${Rs({chan:n,clsK4:s,nclass:r,V4:k,suf:P,readBiasStmt:"",biasExpr:E=>`qmeta[m_cls + k_base + ${E}u]`,probCfg:d})}
}`,totalWEffVec4s:z,useUniformWeff:b,csHalf:p,chunkableStd:c,halfPass0:!f&&m,halfPassConv:!f&&m}}function Ba(e){const{cs:t,chan:n,nclass:r,clsK4:s,dilations:o,activation:i,norm:a,hasF16:f,subgroupMode:l="none",numConvs:m,probCfg:d}=e,c=t/4,u=t/2,p=t/4,y=c*st,$=16384,h=t*ut,z=t*2+4,b=z+Bn*t,g=4*t,v=(m*g+s*4)/4,M=9*t*3*p,w=M,x=M+p,P=f&&p%2===0&&x*8<=65536,k=Ts(i),S=f?`enable f16;
`:"",F=f&&l!=="none",L=F?`enable subgroups;
`:"",K=f?"f16":"f32",W=f?"h":"f",C=`vec4<${K}>`,R=f?256:255,A=N=>{const j=N?".xzyw":"",G=(Z,ee,T)=>{if(Z==="stage_bg")return`stage[s_bg_base + ${ee*ut}u] = ${T};`;if(Z==="stage")return`stage[s_row_base + ${ee*ut}u] = ${T};`;const I=Math.floor(ee/c),H=ee%c;return`if (use_act) { act8_${I}[a_row_base + ${H*st}u] = ${T}; } else { stage[s_row_base + ${ee*ut}u] = ${T}; }`};if(F&&(l==="sg32"||l==="sg64"||l==="sg32_64")){const Z=Os(l,a);return{decls:Z.decls,entryArgs:Z.entryArgs,localHeader:"",emit:({accVar:ee,cStart:T,cEnd:I,hrExpr:H,storeMode:ie,momOffExpr:le,alsoWriteMomMain:pe=!1,writeY8Expr:ue="true"})=>tt(I-T,he=>{const _e=T+he;return a==="none"?`  {
    let f = vec4<f32>(${ee}.v_${he}${j});
    let lmn = ${Z.min("min(min(f.x, f.y), min(f.z, f.w))")};
    let lmx = ${Z.max("max(max(f.x, f.y), max(f.z, f.w))")};
    let sp = lmx - lmn;
    let inv = select(0.0, 1.0 / sp, sp > 1e-7);
    if (${ue}) {
      ${G(ie,_e,"pack4x8unorm((f - vec4<f32>(lmn)) * inv)")}
    }
    if (slane == 0u) {
      let mv = vec4<f32>(0.0, 0.0, lmn, sp);
      mom[${le} + (${H}) * ${t}u + ${_e}u] = mv;
      ${pe?`mom[${z}u + (row_idx * 2u + sg) * ${t}u + ${_e}u] = mv;`:""}
    }
  }
`:`  {
    let f = vec4<f32>(${ee}.v_${he}${j});
    let ls = ${Z.add("f.x + f.y + f.z + f.w")};
    let lq = ${Z.add("dot(f, f)")};
    let lmn = ${Z.min("min(min(f.x, f.y), min(f.z, f.w))")};
    let lmx = ${Z.max("max(max(f.x, f.y), max(f.z, f.w))")};
    let sp = lmx - lmn;
    let inv = select(0.0, 1.0 / sp, sp > 1e-7);
    if (${ue}) {
      ${G(ie,_e,"pack4x8unorm((f - vec4<f32>(lmn)) * inv)")}
    }
    if (slane == 0u) {
      let mv = vec4<f32>(ls, lq, lmn, sp);
      mom[${le} + (${H}) * ${t}u + ${_e}u] = mv;
      ${pe?`mom[${z}u + (row_idx * 2u + sg) * ${t}u + ${_e}u] = mv;`:""}
    }
  }
`})}}if(F&&l==="sg_small")return{decls:Gs({V4:C,sw:j,norm:a,writeMomFn:`fn write_mom(c_out : u32, mv : vec4<f32>, mom_off : u32, main_off : u32, also_main : bool) {
  mom[mom_off + c_out] = mv;
  if (also_main) {
    mom[main_off + c_out] = mv;
  }
}
`,momParams:"mom_off : u32, main_off : u32, also_main : bool",momArgs:"mom_off, main_off, also_main"}),entryArgs:`,
             @builtin(subgroup_size) sg_size : u32,
             @builtin(subgroup_invocation_id) sg_id : u32`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:T,cStart:I,cEnd:H,hrExpr:ie,storeMode:le,momOffExpr:pe,alsoWriteMomMain:ue=!1,writeY8Expr:he="true"})=>{const _e=`${pe} + (${ie}) * ${t}u`,be=ue?`${z}u + (row_idx * 2u + sg) * ${t}u`:"0u";let me=`  let ep_mom_off = ${_e};
  let ep_main_off = ${be};
`;for(let te=0;te<H-I;te+=4){const fe=I+te;me+=`  {
    let qw = reduce_pack4_sg(${T}.v_${te}, ${T}.v_${te+1}, ${T}.v_${te+2}, ${T}.v_${te+3}, h, slane, sg_size, sg_id, ${fe}u, ep_mom_off, ep_main_off, ${ue});
    if (${he}) {
      ${G(le,fe,"qw.x")}
      ${G(le,fe+1,"qw.y")}
      ${G(le,fe+2,"qw.z")}
      ${G(le,fe+3,"qw.w")}
    }
  }
`}return me}};const se=`    let c_out = c_base + slane;
    mom[mom_off + c_out] = mv;
    if (also_main) {
      mom[main_off + c_out] = mv;
    }`;if(a==="none"&&f){const Z=tt(31,T=>`    {
      let m = sh_mm[rb + ${T+1}u];
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`);return{decls:`var<workgroup> sh_mm  : array<vec2<f16>, 1024>;
var<workgroup> sh_res : array<vec2<f32>, 32>;
fn vec_mm16(a : vec4<f16>) -> vec2<f16> {
  return vec2<f16>(min(min(a.x, a.y), min(a.z, a.w)), max(max(a.x, a.y), max(a.z, a.w)));
}
fn reduce_pack4(
  a0 : ${C}, a1 : ${C}, a2 : ${C}, a3 : ${C},
  h : u32, slane : u32, c_base : u32, mom_off : u32, main_off : u32, also_main : bool
) -> vec4<u32> {
  let b0 = (h * 4u) * 32u + slane;
  sh_mm[b0]       = vec_mm16(a0);
  sh_mm[b0 + 32u] = vec_mm16(a1);
  sh_mm[b0 + 64u] = vec_mm16(a2);
  sh_mm[b0 + 96u] = vec_mm16(a3);
  workgroupBarrier();
  if (slane < 4u) {
    let rb = (h * 4u + slane) * 32u;
    let m0 = sh_mm[rb];
    var rmn : f16 = m0.x;
    var rmx : f16 = m0.y;
${Z}    let fmn = f32(rmn);
    let sp = f32(rmx) - fmn;
    sh_res[h * 4u + slane] = vec2<f32>(fmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(0.0, 0.0, fmn, sp);
${se}
  }
  workgroupBarrier();
  let f0 = vec4<f32>(a0${j});
  let f1 = vec4<f32>(a1${j});
  let f2 = vec4<f32>(a2${j});
  let f3 = vec4<f32>(a3${j});
  let r0 = sh_res[h * 4u + 0u];
  let r1 = sh_res[h * 4u + 1u];
  let r2 = sh_res[h * 4u + 2u];
  let r3 = sh_res[h * 4u + 3u];
  return vec4<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y),
    pack4x8unorm((f2 - vec4<f32>(r2.x)) * r2.y),
    pack4x8unorm((f3 - vec4<f32>(r3.x)) * r3.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:T,cStart:I,cEnd:H,hrExpr:ie,storeMode:le,momOffExpr:pe,alsoWriteMomMain:ue=!1,writeY8Expr:he="true"})=>{const _e=`${pe} + (${ie}) * ${t}u`,be=ue?`${z}u + (row_idx * 2u + sg) * ${t}u`:"0u";let me=`  let ep_mom_off = ${_e};
  let ep_main_off = ${be};
`;for(let te=0;te<H-I;te+=4){const fe=I+te;me+=`  {
    let qw = reduce_pack4(${T}.v_${te}, ${T}.v_${te+1}, ${T}.v_${te+2}, ${T}.v_${te+3}, h, slane, ${fe}u, ep_mom_off, ep_main_off, ${ue});
    if (${he}) {
      ${G(le,fe,"qw.x")}
      ${G(le,fe+1,"qw.y")}
      ${G(le,fe+2,"qw.z")}
      ${G(le,fe+3,"qw.w")}
    }
  }
`}return me}}}if(a==="none"){const Z=tt(32,T=>`    {
      let m = sh_mm[rb + ${T}u];
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`);return{decls:`var<workgroup> sh_mm  : array<vec2<f32>, 1024>;
var<workgroup> sh_res : array<vec2<f32>, 32>;
fn vec_mm(f : vec4<f32>) -> vec2<f32> {
  return vec2<f32>(min(min(f.x, f.y), min(f.z, f.w)), max(max(f.x, f.y), max(f.z, f.w)));
}
fn reduce_pack4(
  a0 : ${C}, a1 : ${C}, a2 : ${C}, a3 : ${C},
  h : u32, slane : u32, c_base : u32, mom_off : u32, main_off : u32, also_main : bool
) -> vec4<u32> {
  let f0 = vec4<f32>(a0${j});
  let f1 = vec4<f32>(a1${j});
  let f2 = vec4<f32>(a2${j});
  let f3 = vec4<f32>(a3${j});
  let b0 = (h * 4u) * 32u + slane;
  sh_mm[b0]       = vec_mm(f0);
  sh_mm[b0 + 32u] = vec_mm(f1);
  sh_mm[b0 + 64u] = vec_mm(f2);
  sh_mm[b0 + 96u] = vec_mm(f3);
  workgroupBarrier();
  if (slane < 4u) {
    let rb = (h * 4u + slane) * 32u;
    var rmn : f32 = 3.0e38;
    var rmx : f32 = -3.0e38;
${Z}    let sp = rmx - rmn;
    sh_res[h * 4u + slane] = vec2<f32>(rmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(0.0, 0.0, rmn, sp);
${se}
  }
  workgroupBarrier();
  let r0 = sh_res[h * 4u + 0u];
  let r1 = sh_res[h * 4u + 1u];
  let r2 = sh_res[h * 4u + 2u];
  let r3 = sh_res[h * 4u + 3u];
  return vec4<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y),
    pack4x8unorm((f2 - vec4<f32>(r2.x)) * r2.y),
    pack4x8unorm((f3 - vec4<f32>(r3.x)) * r3.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:T,cStart:I,cEnd:H,hrExpr:ie,storeMode:le,momOffExpr:pe,alsoWriteMomMain:ue=!1,writeY8Expr:he="true"})=>{const _e=`${pe} + (${ie}) * ${t}u`,be=ue?`${z}u + (row_idx * 2u + sg) * ${t}u`:"0u";let me=`  let ep_mom_off = ${_e};
  let ep_main_off = ${be};
`;for(let te=0;te<H-I;te+=4){const fe=I+te;me+=`  {
    let qw = reduce_pack4(${T}.v_${te}, ${T}.v_${te+1}, ${T}.v_${te+2}, ${T}.v_${te+3}, h, slane, ${fe}u, ep_mom_off, ep_main_off, ${ue});
    if (${he}) {
      ${G(le,fe,"qw.x")}
      ${G(le,fe+1,"qw.y")}
      ${G(le,fe+2,"qw.z")}
      ${G(le,fe+3,"qw.w")}
    }
  }
`}return me}}}if(f){const Z=tt(31,T=>{const I=T+1;return`    {
      let s = sh_sq[rb + ${I}u];
      let m = sh_mm[rb + ${I}u];
      rs += s.x;
      rq += s.y;
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`});return{decls:`var<workgroup> sh_sq  : array<vec2<f32>, 1024>;
var<workgroup> sh_mm  : array<vec2<f16>, 1024>;
var<workgroup> sh_res : array<vec2<f32>, 32>;
fn vec_mm16(a : vec4<f16>) -> vec2<f16> {
  return vec2<f16>(min(min(a.x, a.y), min(a.z, a.w)), max(max(a.x, a.y), max(a.z, a.w)));
}
fn reduce_pack4(
  a0 : ${C}, a1 : ${C}, a2 : ${C}, a3 : ${C},
  h : u32, slane : u32, c_base : u32, mom_off : u32, main_off : u32, also_main : bool
) -> vec4<u32> {
  let f0 = vec4<f32>(a0${j});
  let f1 = vec4<f32>(a1${j});
  let f2 = vec4<f32>(a2${j});
  let f3 = vec4<f32>(a3${j});
  let b0 = (h * 4u) * 32u + slane;
  sh_sq[b0]       = vec2<f32>(f0.x + f0.y + f0.z + f0.w, dot(f0, f0));
  sh_sq[b0 + 32u] = vec2<f32>(f1.x + f1.y + f1.z + f1.w, dot(f1, f1));
  sh_sq[b0 + 64u] = vec2<f32>(f2.x + f2.y + f2.z + f2.w, dot(f2, f2));
  sh_sq[b0 + 96u] = vec2<f32>(f3.x + f3.y + f3.z + f3.w, dot(f3, f3));
  sh_mm[b0]       = vec_mm16(a0);
  sh_mm[b0 + 32u] = vec_mm16(a1);
  sh_mm[b0 + 64u] = vec_mm16(a2);
  sh_mm[b0 + 96u] = vec_mm16(a3);
  workgroupBarrier();
  if (slane < 4u) {
    let rb = (h * 4u + slane) * 32u;
    let s0 = sh_sq[rb];
    let m0 = sh_mm[rb];
    var rs : f32 = s0.x;
    var rq : f32 = s0.y;
    var rmn : f16 = m0.x;
    var rmx : f16 = m0.y;
${Z}    let fmn = f32(rmn);
    let sp = f32(rmx) - fmn;
    sh_res[h * 4u + slane] = vec2<f32>(fmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(rs, rq, fmn, sp);
${se}
  }
  workgroupBarrier();
  let r0 = sh_res[h * 4u + 0u];
  let r1 = sh_res[h * 4u + 1u];
  let r2 = sh_res[h * 4u + 2u];
  let r3 = sh_res[h * 4u + 3u];
  return vec4<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y),
    pack4x8unorm((f2 - vec4<f32>(r2.x)) * r2.y),
    pack4x8unorm((f3 - vec4<f32>(r3.x)) * r3.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:T,cStart:I,cEnd:H,hrExpr:ie,storeMode:le,momOffExpr:pe,alsoWriteMomMain:ue=!1,writeY8Expr:he="true"})=>{const _e=`${pe} + (${ie}) * ${t}u`,be=ue?`${z}u + (row_idx * 2u + sg) * ${t}u`:"0u";let me=`  let ep_mom_off = ${_e};
  let ep_main_off = ${be};
`;for(let te=0;te<H-I;te+=4){const fe=I+te;me+=`  {
    let qw = reduce_pack4(${T}.v_${te}, ${T}.v_${te+1}, ${T}.v_${te+2}, ${T}.v_${te+3}, h, slane, ${fe}u, ep_mom_off, ep_main_off, ${ue});
    if (${he}) {
      ${G(le,fe,"qw.x")}
      ${G(le,fe+1,"qw.y")}
      ${G(le,fe+2,"qw.z")}
      ${G(le,fe+3,"qw.w")}
    }
  }
`}return me}}}const ne=tt(32,Z=>`    {
      let s = sh_sq[rb + ${Z}u];
      let m = sh_mm[rb + ${Z}u];
      rs += s.x;
      rq += s.y;
      rmn = min(rmn, m.x);
      rmx = max(rmx, m.y);
    }
`);return{decls:`var<workgroup> sh_sq  : array<vec2<f32>, 512>;
var<workgroup> sh_mm  : array<vec2<f32>, 512>;
var<workgroup> sh_res : array<vec2<f32>, 16>;
fn vec_mm(f : vec4<f32>) -> vec2<f32> {
  return vec2<f32>(min(min(f.x, f.y), min(f.z, f.w)), max(max(f.x, f.y), max(f.z, f.w)));
}
fn reduce_pack2(
  a0 : ${C}, a1 : ${C},
  h : u32, slane : u32, c_base : u32, mom_off : u32, main_off : u32, also_main : bool
) -> vec2<u32> {
  let f0 = vec4<f32>(a0${j});
  let f1 = vec4<f32>(a1${j});
  let b0 = (h * 2u) * 32u + slane;
  sh_sq[b0]       = vec2<f32>(f0.x + f0.y + f0.z + f0.w, dot(f0, f0));
  sh_sq[b0 + 32u] = vec2<f32>(f1.x + f1.y + f1.z + f1.w, dot(f1, f1));
  sh_mm[b0]       = vec_mm(f0);
  sh_mm[b0 + 32u] = vec_mm(f1);
  workgroupBarrier();
  if (slane < 2u) {
    let rb = (h * 2u + slane) * 32u;
    var rs : f32 = 0.0;
    var rq : f32 = 0.0;
    var rmn : f32 = 3.0e38;
    var rmx : f32 = -3.0e38;
${ne}    let sp = rmx - rmn;
    sh_res[h * 2u + slane] = vec2<f32>(rmn, select(0.0, 1.0 / sp, sp > 1e-7));
    let mv = vec4<f32>(rs, rq, rmn, sp);
${se}
  }
  workgroupBarrier();
  let r0 = sh_res[h * 2u + 0u];
  let r1 = sh_res[h * 2u + 1u];
  return vec2<u32>(
    pack4x8unorm((f0 - vec4<f32>(r0.x)) * r0.y),
    pack4x8unorm((f1 - vec4<f32>(r1.x)) * r1.y)
  );
}
`,localHeader:`  let h = lid.y * 2u + sg;
`,emit:({accVar:Z,cStart:ee,cEnd:T,hrExpr:I,storeMode:H,momOffExpr:ie,alsoWriteMomMain:le=!1,writeY8Expr:pe="true"})=>{const ue=`${ie} + (${I}) * ${t}u`,he=le?`${z}u + (row_idx * 2u + sg) * ${t}u`:"0u";let _e=`  let ep_mom_off = ${ue};
  let ep_main_off = ${he};
`;for(let be=0;be<T-ee;be+=2){const me=ee+be;_e+=`  {
    let qw = reduce_pack2(${Z}.v_${be}, ${Z}.v_${be+1}, h, slane, ${me}u, ep_mom_off, ep_main_off, ${le});
    if (${pe}) {
      ${G(H,me,"qw.x")}
      ${G(H,me+1,"qw.y")}
    }
  }
`}return _e}}},U=()=>`
@group(0) @binding(0) var<storage, read_write> act0 : array<u32>;
@group(0) @binding(1) var<storage, read_write> act1 : array<u32>;
@group(0) @binding(2) var<storage, read_write> act2 : array<u32>;
@group(0) @binding(3) var<storage, read_write> act3 : array<u32>;
@compute @workgroup_size(${st}, 1, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let row_base = (wid.z * 256u + wid.y) * ${y}u + lid.x;
  let val = ${k.uZeroWord}u;
  for (var c : u32 = 0u; c < ${c}u; c = c + 1u) {
    let idx = row_base + c * ${st}u;
    act0[idx] = val;
    act1[idx] = val;
    act2[idx] = val;
    act3[idx] = val;
  }
}`,E=o[0],B=!f&&t>=16,O=()=>{const N=A(!1),j=(T,I)=>{const H=T/4,ie=I/4;return tt(ie-H,le=>{const pe=H+le,ue=pe*4;return`          {
            let w0 = w16_4[wb + ${pe}u];
            let w1 = w16_4[wb + ${p+pe}u];
            let w2 = w16_4[wb + ${2*p+pe}u];
            a_${ue}     = fma(vn, ${C}(w0.x), fma(vc, ${C}(w1.x), fma(vp, ${C}(w2.x), a_${ue})));
            a_${ue+1} = fma(vn, ${C}(w0.y), fma(vc, ${C}(w1.y), fma(vp, ${C}(w2.y), a_${ue+1})));
            a_${ue+2} = fma(vn, ${C}(w0.z), fma(vc, ${C}(w1.z), fma(vp, ${C}(w2.z), a_${ue+2})));
            a_${ue+3} = fma(vn, ${C}(w0.w), fma(vc, ${C}(w1.w), fma(vp, ${C}(w2.w), a_${ue+3})));
          }
`})},G=Math.floor(E/4),se=E%4;let ne="";se===0?ne=`
        let vn = inp_4[base - ${G}u];
        let vc = inp_4[base];
        let vp = inp_4[base + ${G}u];`:G===0&&se===1?ne=`
        let vL = inp_4[base - 1u];
        let vc = inp_4[base];
        let vR = inp_4[base + 1u];
        let vn = ${C}(vL.w, vc.xyz);
        let vp = ${C}(vc.yzw, vR.x);`:se===1?ne=`
        let vL = inp_4[base - ${G+1}u];
        let vN = inp_4[base - ${G}u];
        let vc = inp_4[base];
        let vP = inp_4[base + ${G}u];
        let vR = inp_4[base + ${G+1}u];
        let vn = ${C}(vL.w, vN.xyz);
        let vp = ${C}(vP.yzw, vR.x);`:se===2?ne=`
        let vL = inp_4[base - ${G+1}u];
        let vN = ${G===0?"inp_4[base]":`inp_4[base - ${G}u]`};
        let vc = ${G===0?"vN":"inp_4[base]"};
        let vP = ${G===0?"vN":`inp_4[base + ${G}u]`};
        let vR = inp_4[base + ${G+1}u];
        let vn = ${C}(vL.zw, vN.xy);
        let vp = ${C}(vP.zw, vR.xy);`:ne=`
        let vL = inp_4[base - ${G+1}u];
        let vN = ${G===0?"inp_4[base]":`inp_4[base - ${G}u]`};
        let vc = ${G===0?"vN":"inp_4[base]"};
        let vP = ${G===0?"vN":`inp_4[base + ${G}u]`};
        let vR = inp_4[base + ${G+1}u];
        let vn = ${C}(vL.yzw, vN.x);
        let vp = ${C}(vP.w, vR.xyz);`;const ce=(T,I,H,ie)=>{const le=ie-H,pe=tt(le,_e=>`  v_${_e} : ${C},
`),ue=tt(le,_e=>{const be=H+_e;if(a==="none"){const me=3*t+be;return`  var a_${be} = ${C}(${K}(qmeta_u[${me>>>2}u][${me&3}u]));
`}return`  var a_${be} = ${C}(0.0${W});
`}),he=Array.from({length:le},(_e,be)=>`a_${H+be}`).join(", ");return`struct ${I} {
${pe}};
fn ${T}(y : i32, z : i32, x_pad : u32) -> ${I} {
${ue}  var tap_yz : u32 = 0u;
  for (var dz : i32 = -1; dz <= 1; dz = dz + 1) {
    let sz = z + dz * ${E};
    for (var dy : i32 = -1; dy <= 1; dy = dy + 1) {
      let sy = y + dy * ${E};
      if ((u32(sz) | u32(sy)) < 256u) {
        let base = (u32(sz) * 256u + u32(sy)) * ${st}u + x_pad;
${ne}
        let wb = tap_yz * ${3*p}u;
${j(H,ie)}
      }
      tap_yz = tap_yz + 1u;
    }
  }
  return ${I}(${he});
}
`},Z=(T,I,H,ie,le)=>{const pe=le?`  let y = i32(p0.bg_y0 + lid.y);
  let z = i32(p0.bg_z0);`:`  var y : i32;
  var z : i32;
  if (p0.is_full != 0u) {
    y = i32(wid.y * 4u + lid.y);
    z = i32(wid.z);
  } else {
    let pk = strips0_u[wid.z >> 2u][wid.z & 3u];
    y = i32((pk & 255u) * 4u + lid.y);
    z = i32(pk >> 8u);
  }`,ue=le?"lid.y * 2u + sg":"row_idx * 2u + sg",he=le?`${b}u`:`${z}u`,_e=le?`  let s_bg_base = (${$}u + lid.y) * ${h}u + lid.x;`:`  let row_idx = u32(z) * 256u + u32(y);
  let use_act = u32(z) < 192u;
  let a_row_base = row_idx * ${y}u + x_pad;
  let s_row_base = ((u32(z) & 63u) * 256u + u32(y)) * ${h}u + lid.x;`;return`
@compute @workgroup_size(64, 4, 1)
fn ${T}(@builtin(local_invocation_id) lid : vec3<u32>,
             @builtin(workgroup_id) wid : vec3<u32>${N.entryArgs||""}) {
  let sg = lid.x >> 5u;
  let slane = lid.x & 31u;
${N.localHeader}  let x_pad = lid.x + ${Et}u;
${pe}
  let acc = ${I}(y, z, x_pad);
${_e}
${N.emit({accVar:"acc",cStart:H,cEnd:ie,hrExpr:ue,storeMode:le?"stage_bg":"conv0_split",momOffExpr:he})}}`},ee=B?ce("run_conv0_lo","Conv0AccLo",0,u)+ce("run_conv0_hi","Conv0AccHi",u,t)+Z("main_lo","run_conv0_lo",0,u,!1)+Z("main_hi","run_conv0_hi",u,t,!1)+Z("main_bg_lo","run_conv0_lo",0,u,!0)+Z("main_bg_hi","run_conv0_hi",u,t,!0):ce("run_conv0","Conv0Acc",0,t)+Z("main","run_conv0",0,t,!1)+Z("main_bg","run_conv0",0,t,!0);return`${S}${L}
struct Params0 {
  is_full : u32,
  bg_y0 : u32,
  bg_z0 : u32,
  pad0 : u32,
};
@group(0) @binding(0) var<storage, read> inp_4 : array<${C}>;
@group(0) @binding(1) var<storage, read_write> act8_0 : array<u32>;
@group(0) @binding(2) var<storage, read_write> act8_1 : array<u32>;
@group(0) @binding(3) var<storage, read_write> act8_2 : array<u32>;
@group(0) @binding(4) var<storage, read_write> act8_3 : array<u32>;
@group(0) @binding(5) var<storage, read_write> stage : array<u32>;
@group(0) @binding(6) var<storage, read> w16_4 : array<${C}>;
@group(0) @binding(7) var<storage, read_write> mom : array<vec4<f32>>;
@group(0) @binding(8) var<uniform> qmeta_u : array<vec4<f32>, ${t}>;
@group(0) @binding(9) var<uniform> strips0_u : array<vec4<u32>, 4096>;
@group(0) @binding(10) var<uniform> p0 : Params0;
${N.decls}${ee}`},D=()=>`${S}
${zn(i)}
struct PrepParams {
  meta_off : u32,
  next_w_vec4_off : u32,
  next_meta_off : u32,
  has_next : u32,
  is_first : u32,
  is_full : u32,
  n_main_strips : u32,
  n_ext_hr : u32,
  ext_weight : f32,
  pad0 : u32,
  pad1 : u32,
  pad2 : u32,
};
@group(0) @binding(0) var<storage, read> w16_4 : array<${C}>;
@group(0) @binding(1) var<storage, read> qmeta : array<f32>;
@group(0) @binding(2) var<storage, read_write> mom : array<vec4<f32>>;
@group(0) @binding(3) var<storage, read_write> w_eff : array<${C}>;
@group(0) @binding(4) var<storage, read> main_strips : array<u32>;
@group(0) @binding(5) var<uniform> pp : PrepParams;

${a==="gn"?`var<workgroup> fin_s  : array<f32, 256>;
var<workgroup> fin_q  : array<f32, 256>;
var<workgroup> fin_es : array<f32, 256>;
var<workgroup> fin_eq : array<f32, 256>;
`:""}var<workgroup> fin_mn : array<f32, 256>;
var<workgroup> fin_mx : array<f32, 256>;

@compute @workgroup_size(256, 1, 1)
fn moments_finish(@builtin(local_invocation_index) lid : u32,
                  @builtin(workgroup_id) wid : vec3<u32>) {
  let c = wid.x;
${a==="gn"?`  var s : f32 = 0.0;
  var q : f32 = 0.0;
  var es : f32 = 0.0;
  var eq : f32 = 0.0;
`:""}  var mn : f32 = 3.0e38;
  var mx : f32 = -3.0e38;
  if (pp.is_full != 0u) {
    for (var hr : u32 = lid; hr < ${Bn}u; hr = hr + 256u) {
      let v = mom[${z}u + hr * ${t}u + c];
${a==="gn"?`      s  += v.x;
      q  += v.y;
`:""}      mn  = min(mn, v.z);
      mx  = max(mx, v.z + v.w);
    }
  } else {
    for (var si : u32 = lid; si < pp.n_main_strips; si = si + 256u) {
      let pk = main_strips[si];
      let base_hr = ((pk >> 8u) * 256u + (pk & 255u) * 4u) * 2u;
      for (var h : u32 = 0u; h < 8u; h = h + 1u) {
        let v = mom[${z}u + (base_hr + h) * ${t}u + c];
${a==="gn"?`        s  += v.x;
        q  += v.y;
`:""}        mn  = min(mn, v.z);
        mx  = max(mx, v.z + v.w);
      }
    }
    if (pp.is_first != 0u) {
      mn = min(mn, 0.0);
      mx = max(mx, 0.0);
    } else if (pp.n_ext_hr > 0u) {
      for (var e : u32 = lid; e < pp.n_ext_hr; e = e + 256u) {
        let v = mom[${b}u + e * ${t}u + c];
${a==="gn"?`        es += v.x;
        eq += v.y;
`:""}        mn  = min(mn, v.z);
        mx  = max(mx, v.z + v.w);
      }
    }
  }
${a==="gn"?`  fin_s[lid]  = s;
  fin_q[lid]  = q;
  fin_es[lid] = es;
  fin_eq[lid] = eq;
`:""}  fin_mn[lid] = mn;
  fin_mx[lid] = mx;
  workgroupBarrier();
  for (var stride : u32 = 128u; stride > 0u; stride = stride >> 1u) {
    if (lid < stride) {
${a==="gn"?`      fin_s[lid]  += fin_s[lid + stride];
      fin_q[lid]  += fin_q[lid + stride];
      fin_es[lid] += fin_es[lid + stride];
      fin_eq[lid] += fin_eq[lid + stride];
`:""}      fin_mn[lid]  = min(fin_mn[lid], fin_mn[lid + stride]);
      fin_mx[lid]  = max(fin_mx[lid], fin_mx[lid + stride]);
    }
    workgroupBarrier();
  }
  if (lid == 0u) {
    let mbase = pp.meta_off;
    let gamma = qmeta[mbase + c];
    let beta  = qmeta[mbase + ${t}u + c];
    let eps_base = qmeta[mbase + ${2*t}u + c];
    let q_prev = select(mom[${t*2}u].x, 1.0, pp.is_first != 0u);
    let eff_eps = eps_base / (q_prev * q_prev);
${a==="gn"?`    let total_s = fin_s[0] + pp.ext_weight * fin_es[0];
    let total_q = fin_q[0] + pp.ext_weight * fin_eq[0];
    let mean = total_s / 16777216.0;
    let varr = max(total_q / 16777216.0 - mean * mean, 0.0);
    let inv_std = inverseSqrt(varr + eff_eps);
`:`    let mean : f32 = 0.0;
    let inv_std : f32 = 1.0;
`}    let scale = inv_std * gamma;
    let shift = beta - mean * scale;
    let u_lo = fin_mn[0] * scale + shift;
    let u_hi = fin_mx[0] * scale + shift;
    let vmax = max(0.25, max(act(u_lo), act(u_hi)));
    ${i==="gelu_tanh"?`
    let qs = select(max(vmax / 248.0, 0.1705 / 7.0), 1.0, c >= ${n}u);
    `:i==="relu"?`
    let qs = select(max(vmax / 255.0, 1e-6), 1.0, c >= ${n}u);
    `:`
    let qs = select(max(vmax / 223.0, 1.0 / 32.0), 1.0, c >= ${n}u);
    `}
    let sb = c * 2u;
    mom[sb]      = vec4<f32>(mean, inv_std, qs, 1.0 / qs);
    mom[sb + 1u] = vec4<f32>(scale, shift, 0.0, 0.0);
  }
}

@compute @workgroup_size(256, 1, 1)
fn prep_weff(@builtin(local_invocation_index) lid : u32) {
  if (pp.has_next == 0u) { return; }
  var q_ref : f32 = 1e-6;
  for (var ic : u32 = 0u; ic < ${n}u; ic = ic + 1u) {
    let qs = mom[ic * 2u].z;
    q_ref = max(q_ref, ${R.toFixed(1)} * qs);
  }
  ${a==="none"?"q_ref = 1.0;":""}
  if (lid == 0u) {
    mom[${t*2}u] = vec4<f32>(q_ref, 0.0, 0.0, 0.0);
  }
  let scale_num = ${R.toFixed(1)} / q_ref;
  for (var idx : u32 = lid; idx < ${M}u; idx = idx + 256u) {
    let ic = (idx / ${3*p}u) % ${t}u;
    let qs = mom[ic * 2u].z;
    w_eff[idx] = w16_4[pp.next_w_vec4_off + idx] * ${K}(qs * scale_num);
  }
  if (lid < ${p}u) {
    ${a==="none"?`
    let mb = pp.next_meta_off + ${3*t}u + lid * 4u;
    w_eff[${w}u + lid] = ${C}(${K}(qmeta[mb]), ${K}(qmeta[mb + 1u]), ${K}(qmeta[mb + 2u]), ${K}(qmeta[mb + 3u]));
    `:`
    w_eff[${w}u + lid] = ${C}(0.0${W});
    `}
  }
}`,J=()=>`
struct BandFlushParams {
  is_full : u32,
  z_start : u32,
  strip_off : u32,
  pad0 : u32,
  pad1 : u32,
  pad2 : u32,
  pad3 : u32,
  pad4 : u32,
};
@group(0) @binding(0) var<storage, read_write> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read_write> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read_write> act8_2 : array<u32>;
@group(0) @binding(3) var<storage, read_write> act8_3 : array<u32>;
@group(0) @binding(4) var<storage, read> stage : array<u32>;
@group(0) @binding(5) var<storage, read> strips : array<u32>;
@group(0) @binding(6) var<uniform> fp : BandFlushParams;

@compute @workgroup_size(64, 4, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let x4 = lid.x;
  let x_pad = x4 + ${Et}u;
  var y : u32;
  var z : u32;
  if (fp.is_full != 0u) {
    y = wid.y * 4u + lid.y;
    z = fp.z_start + wid.z;
  } else {
    let pk = strips[fp.strip_off + wid.z] & 0xFFFFu;
    y = (pk & 255u) * 4u + lid.y;
    z = pk >> 8u;
  }
  let a_base = (z * 256u + y) * ${y}u + x_pad;
  let s_base = ((z & 63u) * 256u + y) * ${h}u + x4;
  for (var c : u32 = 0u; c < ${c}u; c = c + 1u) {
    let a_off = a_base + c * ${st}u;
    act8_0[a_off] = stage[s_base + c * ${ut}u];
    act8_1[a_off] = stage[s_base + (${c}u + c) * ${ut}u];
    act8_2[a_off] = stage[s_base + (${2*c}u + c) * ${ut}u];
    act8_3[a_off] = stage[s_base + (${3*c}u + c) * ${ut}u];
  }
}`,Y=(N,j)=>{const G=N*c;return`
  for (var cl : u32 = 0u; cl < ${c}u; cl = cl + 1u) {
    let c = ${G}u + cl;
    let inv_qs = mom[c * 2u].w;
    let st = mom[c * 2u + 1u];
    let rm = mom[mom_base + c];
    let q_word = ${j?`stage[s_bg_base + c * ${ut}u]`:`select(stage[s_base + c * ${ut}u], act8_${N}[a_base + cl * ${st}u], use_act)`};
    let yv = unpack4x8unorm(q_word) * rm.w + vec4<f32>(rm.z);
    let a = vec4<f32>(
      act(yv.x * st.x + st.y),
      act(yv.y * st.x + st.y),
      act(yv.z * st.x + st.y),
      act(yv.w * st.x + st.y)
    );
    act8_${N}[a_base + cl * ${st}u] = pack4x8unorm((a * inv_qs + vec4<f32>(${k.zeroBin.toFixed(1)})) * (1.0 / 255.0));
  }`},V=()=>`${zn(i)}
struct NormParams {
  is_full : u32,
  bg_row : u32,
  halo_off : u32,
  n_halo : u32,
};
@group(0) @binding(0) var<storage, read_write> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read_write> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read_write> act8_2 : array<u32>;
@group(0) @binding(3) var<storage, read_write> act8_3 : array<u32>;
@group(0) @binding(4) var<storage, read> stage : array<u32>;
@group(0) @binding(5) var<storage, read> mom : array<vec4<f32>>;
@group(0) @binding(6) var<storage, read> norm_aux : array<u32>;
@group(0) @binding(7) var<uniform> np : NormParams;

@compute @workgroup_size(64, 4, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let x4 = lid.x;
  let sg = x4 >> 5u;
  let x_pad = x4 + ${Et}u;
  var y : u32;
  var z : u32;
  if (np.is_full != 0u) {
    y = wid.y * 4u + lid.y;
    z = wid.z;
  } else {
    let pk = norm_aux[wid.z];
    y = (pk & 255u) * 4u + lid.y;
    z = pk >> 8u;
  }
  let row_idx = z * 256u + y;
  let use_act = z < 192u;
  let a_base = row_idx * ${y}u + x_pad;
  let s_base = ((z & 63u) * 256u + y) * ${h}u + x4;
  let mom_base = ${z}u + (row_idx * 2u + sg) * ${t}u;
${tt(4,N=>Y(N,!1))}
}

@compute @workgroup_size(64, 4, 1)
fn norm_halo_fill(@builtin(local_invocation_id) lid : vec3<u32>,
                  @builtin(workgroup_id) wid : vec3<u32>) {
  let idx = wid.y * 4u + lid.y;
  if (idx >= np.n_halo) { return; }
  let x4 = lid.x;
  let sg = x4 >> 5u;
  let x_pad = x4 + ${Et}u;
  let s_bg_base = ${$}u * ${h}u + x4;
  let mom_base = ${b}u + sg * ${t}u;
  let dst_row = norm_aux[np.halo_off + idx];
  let a_base = dst_row * ${y}u + x_pad;
${tt(4,N=>Y(N,!0))}
}`,re=()=>{const N=!f&&t>=16,j=A(f),G=(H,ie)=>f?`
          let ${H} = vec4<f16>(vec2<f16>(unpack2x16float(((${ie} & 0x00FF00FFu) << 2u) | 0x3C003C00u)), vec2<f16>(unpack2x16float(((${ie} >> 6u) & 0x03FC03FCu) | 0x3C003C00u))) - vec4<f16>(${k.sterbenzSub});`:`
          let ${H} = unpack4x8unorm(${ie}) - vec4<f32>(${k.uZeroFloat});`,se=H=>`
          let uL = ${H}[base - off0];
          let uN = ${H}[base - off1];
          let uC = ${H}[base];
          let uP = ${H}[base + off1];
          let uR = ${H}[base + off0];
          let u_neg = (uL >> sh_l) | (uN << sh_r);
          let u_pos = (uP >> sh_r) | (uR << sh_l);`+G("vn","u_neg")+G("vc","uC")+G("vp","u_pos"),ne=(H,ie)=>{const le=H/4,pe=ie/4;if(P){const ue=p/2,he=p;let _e="";for(let be=le;be<pe;be+=2){const me=be*4,te=be/2;_e+=`          {
            let wp0 = w_eff_u[wbu + ${te}u];
            let wp1 = w_eff_u[wbu + ${ue+te}u];
            let wp2 = w_eff_u[wbu + ${he+te}u];
            let w0a = u4_lo(wp0);
            let w0b = u4_hi(wp0);
            let w1a = u4_lo(wp1);
            let w1b = u4_hi(wp1);
            let w2a = u4_lo(wp2);
            let w2b = u4_hi(wp2);
            a_${me}     = fma(vn, vec4<f16>(w0a.x), fma(vc, vec4<f16>(w1a.x), fma(vp, vec4<f16>(w2a.x), a_${me})));
            a_${me+1} = fma(vn, vec4<f16>(w0a.y), fma(vc, vec4<f16>(w1a.y), fma(vp, vec4<f16>(w2a.y), a_${me+1})));
            a_${me+2} = fma(vn, vec4<f16>(w0a.z), fma(vc, vec4<f16>(w1a.z), fma(vp, vec4<f16>(w2a.z), a_${me+2})));
            a_${me+3} = fma(vn, vec4<f16>(w0a.w), fma(vc, vec4<f16>(w1a.w), fma(vp, vec4<f16>(w2a.w), a_${me+3})));
            a_${me+4} = fma(vn, vec4<f16>(w0b.x), fma(vc, vec4<f16>(w1b.x), fma(vp, vec4<f16>(w2b.x), a_${me+4})));
            a_${me+5} = fma(vn, vec4<f16>(w0b.y), fma(vc, vec4<f16>(w1b.y), fma(vp, vec4<f16>(w2b.y), a_${me+5})));
            a_${me+6} = fma(vn, vec4<f16>(w0b.z), fma(vc, vec4<f16>(w1b.z), fma(vp, vec4<f16>(w2b.z), a_${me+6})));
            a_${me+7} = fma(vn, vec4<f16>(w0b.w), fma(vc, vec4<f16>(w1b.w), fma(vp, vec4<f16>(w2b.w), a_${me+7})));
          }
`}return _e}return tt(pe-le,ue=>{const he=le+ue,_e=he*4;return`          {
            let w0 = w_eff[wb + ${he}u];
            let w1 = w_eff[wb + ${p+he}u];
            let w2 = w_eff[wb + ${2*p+he}u];
            a_${_e}     = fma(vn, ${C}(w0.x), fma(vc, ${C}(w1.x), fma(vp, ${C}(w2.x), a_${_e})));
            a_${_e+1} = fma(vn, ${C}(w0.y), fma(vc, ${C}(w1.y), fma(vp, ${C}(w2.y), a_${_e+1})));
            a_${_e+2} = fma(vn, ${C}(w0.z), fma(vc, ${C}(w1.z), fma(vp, ${C}(w2.z), a_${_e+2})));
            a_${_e+3} = fma(vn, ${C}(w0.w), fma(vc, ${C}(w1.w), fma(vp, ${C}(w2.w), a_${_e+3})));
          }
`})},ce=(H,ie,le)=>{const pe=H*c,ue=`(${c}u + cp.pad0)`;return P?`        for (var ic : u32 = 0u; ic < ${ue}; ic = ic + 1u) {
          let base = row_off + ic * ${st}u;
${se(`act8_${H}`)}
          let wbu = wbu_tap + ${pe?`(${pe}u + ic)`:"ic"} * ${3*p/2}u;
${ne(ie,le)}
        }
`:`        for (var ic : u32 = 0u; ic < ${ue}; ic = ic + 1u) {
          let base = row_off + ic * ${st}u;
${se(`act8_${H}`)}
          let wb = wb_tap + ${pe?`(${pe}u + ic)`:"ic"} * ${3*p}u;
${ne(ie,le)}
        }
`},Z=(H,ie,le,pe)=>{const ue=pe-le,he=tt(ue,te=>`  v_${te} : ${C},
`),_e=tt(ue,te=>{const fe=le+te;if(a==="none"){const Be=fe>>>2,ye=["x","y","z","w"][fe&3];if(P){const Ge=w+Be>>>1,He=w+Be&1?"u4_hi":"u4_lo";return`  var a_${fe} = ${C}(${He}(w_eff_u[${Ge}u]).${ye});
`}return`  var a_${fe} = ${C}(w_eff[${w+Be}u].${ye});
`}return`  var a_${fe} = ${C}(0.0${W});
`}),be=P?`        let wbu_tap = tap_yz * ${t*3*p/2}u;
`:`        let wb_tap = tap_yz * ${t*3*p}u;
`,me=Array.from({length:ue},(te,fe)=>`a_${le+fe}`).join(", ");return`struct ${ie} {
${he}};
fn ${H}(y : i32, z : i32, x_pad : u32, dp : u32) -> ${ie} {
${_e}  let d_step = i32(dp & 63u);
  let off0 = (dp >> 6u) & 15u;
  let off1 = (dp >> 10u) & 15u;
  let sh_r = (dp >> 14u) & 31u;
  let sh_l = (dp >> 19u) & 31u;
  var tap_yz : u32 = 0u;
  for (var dz : i32 = -1; dz <= 1; dz = dz + 1) {
    let sz = z + dz * d_step;
    for (var dy : i32 = -1; dy <= 1; dy = dy + 1) {
      let sy = y + dy * d_step;
      if ((u32(sz) | u32(sy)) < 256u) {
        let row_off = (u32(sz) * 256u + u32(sy)) * ${y}u + x_pad;
${be}${tt(4,te=>ce(te,le,pe))}      }
      tap_yz = tap_yz + 1u;
    }
  }
  return ${ie}(${me});
}
`},ee=(H,ie,le,pe,ue)=>{let he="";ue==="bg"?he=`
  let y = i32(cp.bg_y0 + lid.y);
  let z = i32(cp.bg_z0);`:ue==="ext"?he=`
  let pk_full = strips[cp.ext_off + wid.z];
  let ext_orig = pk_full >> 16u;
  let pk = pk_full & 0xFFFFu;
  let y = i32((pk & 255u) * 4u + lid.y);
  let z = i32(pk >> 8u);`:he=`
  var y : i32;
  var z : i32;
  if (cp.is_full != 0u) {
    y = i32(wid.y * 4u + lid.y);
    z = i32(cp.z_start + wid.z);
  } else {
    let pk = strips[cp.strip_off + wid.z] & 0xFFFFu;
    y = i32((pk & 255u) * 4u + lid.y);
    z = i32(pk >> 8u);
  }`;const _e=ue==="bg"?"lid.y * 2u + sg":ue==="ext"?"ext_orig * 8u + lid.y * 2u + sg":"row_idx * 2u + sg",be=ue==="main"?`${z}u`:`${b}u`,me=ue==="bg"?"stage_bg":"stage",te=ue==="main"?"true":"(((dp >> 24u) & 1u) != 0u)",fe=ue==="bg"?`  let row_idx = u32(z) * 256u + u32(y);
  let s_bg_base = (${$}u + lid.y) * ${h}u + x4;`:`  let row_idx = u32(z) * 256u + u32(y);
  let s_row_base = ((u32(z) & 63u) * 256u + u32(y)) * ${h}u + x4;`;return`
@compute @workgroup_size(64, 4, 1)
fn ${H}(@builtin(local_invocation_id) lid : vec3<u32>,
             @builtin(workgroup_id) wid : vec3<u32>${j.entryArgs||""}) {
  let x4 = lid.x;
  let sg = x4 >> 5u;
  let slane = x4 & 31u;
${j.localHeader}  let x_pad = x4 + ${Et}u;
${he}
  let dp = cp.d_pack;
  let acc = ${ie}(y, z, x_pad, dp);
${fe}
${j.emit({accVar:"acc",cStart:le,cEnd:pe,hrExpr:_e,storeMode:me,momOffExpr:be,alsoWriteMomMain:ue!=="main",writeY8Expr:te})}}`},T=N?Z("run_conv_lo","ConvAccLo",0,u)+Z("run_conv_hi","ConvAccHi",u,t)+ee("main_lo","run_conv_lo",0,u,"main")+ee("main_hi","run_conv_hi",u,t,"main")+ee("main_ext_lo","run_conv_lo",0,u,"ext")+ee("main_ext_hi","run_conv_hi",u,t,"ext")+ee("main_bg_lo","run_conv_lo",0,u,"bg")+ee("main_bg_hi","run_conv_hi",u,t,"bg"):Z("run_conv","ConvAcc",0,t)+ee("main","run_conv",0,t,"main")+ee("main_ext","run_conv",0,t,"ext")+ee("main_bg","run_conv",0,t,"bg"),I=P?`fn u4_lo(u : vec4<u32>) -> vec4<f16> {
  return vec4<f16>(vec2<f16>(unpack2x16float(u.x)), vec2<f16>(unpack2x16float(u.y)));
}
fn u4_hi(u : vec4<u32>) -> vec4<f16> {
  return vec4<f16>(vec2<f16>(unpack2x16float(u.z)), vec2<f16>(unpack2x16float(u.w)));
}
@group(0) @binding(6) var<uniform> w_eff_u : array<vec4<u32>, ${Math.ceil(x/2)}>;`:`@group(0) @binding(6) var<storage, read> w_eff : array<${C}>;`;return`${S}${L}
struct BandConvParams {
  is_full : u32,
  z_start : u32,
  strip_off : u32,
  ext_off : u32,
  d_pack : u32,
  bg_y0 : u32,
  bg_z0 : u32,
  pad0 : u32,
};
@group(0) @binding(0) var<storage, read> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read> act8_2 : array<u32>;
@group(0) @binding(3) var<storage, read> act8_3 : array<u32>;
@group(0) @binding(4) var<storage, read_write> stage : array<u32>;
@group(0) @binding(5) var<storage, read_write> mom : array<vec4<f32>>;
${I}
@group(0) @binding(7) var<storage, read> strips : array<u32>;
@group(0) @binding(8) var<uniform> cp : BandConvParams;
${j.decls}${T}`},X=N=>{const j=N*c;return`
  for (var cl : u32 = 0u; cl < ${c}u; cl = cl + 1u) {
    let c = ${j}u + cl;
    if (c < ${n}u) {
      let st = mom[c * 2u + 1u];
      let rm = mom[mom_base + c];
      let q_word = select(stage[s_base + c * ${ut}u], act8_${N}[a_base + cl * ${st}u], use_act);
      let yv = unpack4x8unorm(q_word) * rm.w + vec4<f32>(rm.z);
      let fv = vec4<f32>(
        act(yv.x * st.x + st.y),
        act(yv.y * st.x + st.y),
        act(yv.z * st.x + st.y),
        act(yv.w * st.x + st.y)
      );
      feat[c] = ${C}(fv);
    }
  }`};return{initActWgsl:U,conv0Wgsl:O,prepWgsl:D,flushWgsl:J,normWgsl:V,convWgsl:re,clsWgsl:()=>`${S}
${zn(i)}
struct ClsParams {
  w_vec4_off : u32,
  bias_off : u32,
  is_full : u32,
  pad0 : u32,
};
@group(0) @binding(0) var<storage, read> act8_0 : array<u32>;
@group(0) @binding(1) var<storage, read> act8_1 : array<u32>;
@group(0) @binding(2) var<storage, read> act8_2 : array<u32>;
@group(0) @binding(3) var<storage, read> act8_3 : array<u32>;
@group(0) @binding(4) var<storage, read> stage : array<u32>;
@group(0) @binding(5) var<storage, read> w16_4 : array<${C}>;
@group(0) @binding(6) var<storage, read> mom : array<vec4<f32>>;
@group(0) @binding(7) var<storage, read_write> labels8 : array<u32>;
@group(0) @binding(8) var<uniform> qmeta_u : array<vec4<f32>, ${v}>;
@group(0) @binding(9) var<uniform> cls_strips_u : array<vec4<u32>, 4096>;
@group(0) @binding(10) var<uniform> cp : ClsParams;

@compute @workgroup_size(64, 4, 1)
fn main(@builtin(local_invocation_id) lid : vec3<u32>,
        @builtin(workgroup_id) wid : vec3<u32>) {
  let x4 = lid.x;
  let sg = x4 >> 5u;
  var y : u32;
  var z : u32;
  if (cp.is_full != 0u) {
    y = wid.y * 4u + lid.y;
    z = wid.z;
  } else {
    let pk = cls_strips_u[wid.z >> 2u][wid.z & 3u];
    y = (pk & 255u) * 4u + lid.y;
    z = pk >> 8u;
  }
  let row_idx = z * 256u + y;
  let use_act = z < 192u;
  let a_base = row_idx * ${y}u + x4 + ${Et}u;
  let s_base = ((z & 63u) * 256u + y) * ${h}u + x4;
  let mom_base = ${z}u + (row_idx * 2u + sg) * ${t}u;

  var feat : array<${C}, ${n}>;
${tt(4,N=>X(N))}

  let w_cls = cp.w_vec4_off;
  let b_vec4 = cp.bias_off >> 2u;
${Rs({chan:n,clsK4:s,nclass:r,V4:C,suf:W,readBiasStmt:"    let bv = qmeta_u[b_vec4 + k4];",biasExpr:N=>`bv.${["x","y","z","w"][N]}`,probCfg:d})}
}`,qmetaVec4Len:v,numConvs:m,totalWEffVec4s:x,useUniformWeff:P,csQ:c,halfPass0:B,halfPassConv:!f&&t>=16}}async function Ua(e,t,n,r,s,o,i,a){const f=q*q*q,l=i?f*4:f,m=t.dilations.length,d=t.cs/4,c=q*q*d*st*4,p=(64*q+4)*t.cs*ut*4,$=(t.cs*2+4+(Bn+xs)*t.cs)*16,h=e.limits||{},_=Math.min(h.maxStorageBufferBindingSize??1/0,h.maxBufferSize??1/0);if(c>_||p>_||$>_||l>_){const Te=Math.ceil(Math.max(c,p,$,l)/1048576);throw new Error(`meshnet_fast_v4: LowMem128 max buffer (${Te} MiB) exceeds device limit (${_>>>20} MiB)`)}const z=Ba({cs:t.cs,chan:t.chan,nclass:t.nclass,clsK4:n.clsK4,dilations:t.dilations,activation:t.activation,norm:t.norm,hasF16:r,subgroupMode:s,numConvs:m,probCfg:i});console.log(`[WebGPU-V4-128M] ${t.chan}ch(cs=${t.cs})/${t.nclass}cls (${m} convs, ${t.activation}, norm=${t.norm}${i?", prob=3":""}) | ${r?"f16+sterbenz":"f32"} | ${ks(s)} | ZYCX-4Q+64slice | maxBuf=${(Math.max(c,p,$,l)/1048576).toFixed(1)} MiB`);const b=GPUBufferUsage.STORAGE,g=GPUBufferUsage.UNIFORM,v=GPUBufferUsage.COPY_DST,M=GPUBufferUsage.COPY_SRC,w=q*q*tn,x=w*(r?2:4),P=r?Math.ceil(z.totalWEffVec4s/2)*16:z.totalWEffVec4s*16,k=!!(i&&c>=l),S=`128|${t.cs}|${r?1:0}|${l}|${k?1:0}`,F=Fs(e,S,()=>{const Te=[],Ue=On(e,Te),De=Ue.alloc,Ie={inpBuf:De(x,b|v|M),act8_0:De(c,b|v|M),act8_1:De(c,b|v|M),act8_2:De(c,b|v|M),act8_3:De(c,b|v|M),stageBuf:De(p,b),momBuf:De($,b),labels8Buf:De(l,b|v|M),readbackBuf:De(l,GPUBufferUsage.MAP_READ|v),probPackTmpBuf:k?De(l,b|v|M):null};return{buffers:Te,named:Ie,bytes:Ue.getBytes()}}),{inpBuf:L,act8_0:K,act8_1:W,act8_2:C,act8_3:R,stageBuf:A,momBuf:U,labels8Buf:E,readbackBuf:B,probPackTmpBuf:O}=F.named,D=[],J=On(e,D),Y=J.alloc,V=Y(r?n.wF16.byteLength:n.wF32.byteLength,b|v),re=Y(n.qmetaF32.byteLength,b|g|v),X=Y(P,z.useUniformWeff?b|g:b),oe=t.norm==="gn"&&!o?.disableConeSkip,N=Y(Fe*4,g|v),j=Y(Fe*4,g|v),G=Array.from({length:m},()=>Y(oe?Fe*4:16,b|v)),se=Array.from({length:m-1},()=>Y(oe?(Fe+q*q)*4:16,b|v)),ne=Y(16,g|v),ce=Y(16,g|v),Z=Array.from({length:m},()=>Y(48,g|v)),ee=Array.from({length:m-1},()=>Y(16,g|v)),T=Math.max(256,h.minUniformBufferOffsetAlignment||256),I=T>>>2,H=20,ie=Math.max(1,(m-1)*H),le=Y(ie*T,g|v),pe=new Uint32Array(ie*I);e.queue.writeBuffer(V,0,r?n.wF16:n.wF32),e.queue.writeBuffer(re,0,n.qmetaF32);let ue;try{ue=await Pa(e,t,n,r,s,i,z)}catch(Te){for(const Ue of D)Ue.destroy();if(D.length=0,F.pooled)Jt.get(e)===F&&kn(e);else{for(const Ue of F.buffers)Ue.destroy();F.buffers.length=0}throw Te}const{pInit:he,pMomFin:_e,pPrepW:be,pFlush:me,pNorm:te,pNormHalo:fe,pCls:Be,pConv0:ye,pConv:Ge}=ue,He=(Te,Ue)=>e.createBindGroup({layout:Te,entries:Ue.map((De,Ie)=>({binding:Ie,resource:De&&De.buffer?De:{buffer:De}}))}),nt=He(he.bgl,[K,W,C,R]);{const Te=e.createCommandEncoder(),Ue=Te.beginComputePass();Ue.setPipeline(he.pipe),Ue.setBindGroup(0,nt),Ue.dispatchWorkgroups(1,q,q),Ue.end(),e.queue.submit([Te.finish()])}const Mt=(z.halfPass0?ye.lo:ye.main).bgl,ft=He(Mt,[L,K,W,C,R,A,V,U,{buffer:re,offset:0,size:t.cs*16},N,ne]),ct=He(Be.bgl,[K,W,C,R,A,V,U,E,re,j,ce]),kt=k?Y(16,g|v):null,at=k?He(Be.bgl,[K,W,C,R,A,V,U,E,re,j,kt]):null,Ke=Ns({device:e,hasF16:r,nvox:f,outBufBytes:l,inpBuf:L,act8_0:K,labels8Buf:E,readbackBuf:B,pInit:he,bgInit:nt,pCls:Be,bgCls:ct,clsUbo:ce,packed:n,modelEntry:o,probCfg:i,canGpuProb:k,probSlots:k?{clsUbo1:kt,bgCls1:at,pass0HoldBuf:O,y0:K,y1:W,b:C,sup:R}:null,ownedBuffers:D,mkBuf:Y}),mt=Z.map((Te,Ue)=>He(_e.bgl,[V,re,U,X,G[Ue],Te])),yt=ee.map((Te,Ue)=>He(te.bgl,[K,W,C,R,A,U,se[Ue],Te])),pt={buffer:le,offset:0,size:32},vt=Array.from({length:m},(Te,Ue)=>Ue===0?null:He(me.bgl,[K,W,C,R,A,G[Ue],pt])),Xt=z.halfPassConv?Ge.lo:Ge.main,xt=Array.from({length:m},(Te,Ue)=>Ue===0?null:He(Xt.bgl,[K,W,C,R,A,U,X,G[Ue],pt])),Gt=r?new Uint16Array(w):new Float32Array(w),Yt=new Uint8Array(q*q),zt=new Uint32Array(Fe),Bt=new Uint32Array(Fe+q*q),Ze=new Uint32Array(12),gn=new Float32Array(Ze.buffer),je=new Uint32Array(4),Vt=(Te,Ue,De,Ie,ot,Me,it,ge)=>{const Ee=Te*I;pe[Ee]=Ue?1:0,pe[Ee+1]=De,pe[Ee+2]=Ie,pe[Ee+3]=ot,pe[Ee+4]=Me,pe[Ee+5]=it,pe[Ee+6]=ge,pe[Ee+7]=0};async function dt(Te,Ue){if(Te.length!==f)throw new Error(`meshnet_fast_v4 expected ${f} voxels, got ${Te.length}`);const De=t.norm==="gn"&&!o?.disableConeSkip,Ie=await Ke.prepareInput({volume:Te,ioOpts:Ue,useCone:De,padInputHost:Gt,headRowHost:Yt,hasF16Flag:r}),ot=Ie.info,Me=Es(Yt,ot,t.dilations,De),it=new Array(m);for(let de=0;de<m;de++){const Pe=Me.layers[de],ve=Pe.isFull?Fe:Pe.mainStrips.length,Se=Pe.isFull||!Pe.extStrips?0:Pe.extStrips.length,Pt=Pe.haloRows?Pe.haloRows.length:0;if(de===0){!Pe.isFull&&ve>0&&(zt.set(Pe.mainStrips,0),e.queue.writeBuffer(N,0,zt.subarray(0,ve)),e.queue.writeBuffer(G[0],0,zt.subarray(0,ve))),it[0]={L:Pe,nMain:ve,nExt:Se,nHalo:Pt};continue}const At=new Uint32Array(8),Ct=new Uint32Array(8),qe=new Uint32Array(8),ze=new Uint32Array(8);if(!Pe.isFull){if(ve>0){zt.set(Pe.mainStrips,0);for(let lt=0;lt<ve;lt++)Ct[Pe.mainStrips[lt]>>>13]++;let xe=0;for(let lt=0;lt<8;lt++)At[lt]=xe,xe+=Ct[lt]}if(Pe.mode==="bwd"&&Se>0){const xe=Array.from({length:8},()=>[]);for(let Ne=0;Ne<Se;Ne++){const we=Pe.extStrips[Ne];xe[we>>>13].push((Ne&65535)<<16|we)}let lt=ve;for(let Ne=0;Ne<8;Ne++){qe[Ne]=lt;const we=xe[Ne];ze[Ne]=we.length;for(let ke=0;ke<we.length;ke++)zt[lt++]=we[ke]}e.queue.writeBuffer(G[de],0,zt.subarray(0,ve+Se))}else ve>0&&e.queue.writeBuffer(G[de],0,zt.subarray(0,ve))}const Q=Pe.mode==="rpure"&&Pt>0||Pe.mode==="bwd"&&de+1<m,ae=yr(t.dilations[de],Q),Ye=(de-1)*H,Ve=Pe.bgStrip?Pe.bgStrip.yWg*4:0,Je=Pe.bgStrip?Pe.bgStrip.z:0;for(let xe=0;xe<8;xe++)Vt(Ye+xe,Pe.isFull,xe*32,At[xe],qe[xe],ae,Ve,Je);for(let xe=0;xe<6;xe++)Vt(Ye+8+xe,Pe.isFull,xe*32,At[xe],0,0,0,0),Vt(Ye+14+xe,!1,xe*32,qe[xe],0,0,0,0);it[de]={L:Pe,nMain:ve,nExt:Se,nHalo:Pt,mainCount:Ct,extCount:ze,layerBaseSlot:Ye}}m>1&&e.queue.writeBuffer(le,0,pe);let ge=a.execMode==="calibrate"&&e.__v4WinCalibrated?e.__v4WinFast?"pipelined":"paced":a.execMode;const Ee=[];if(ge==="single"){const de=e.createCommandEncoder();Ie.runPrePasses(de,Ee),Me.clsSkipped&&(de.clearBuffer(E,0,l),Me.clsStrips.length>0&&e.queue.writeBuffer(j,0,Me.clsStrips));for(let Pe=0;Pe<m;Pe++){const ve=it[Pe],{L:Se,nMain:Pt,nHalo:At}=ve,Ct=Se.nMomExt||0,qe=Se.isFull?Fe:Se.normStrips?Se.normStrips.length:0;if(Pe===0){const Q=Se.isFull?64:1,ae=Se.isFull?q:Pt,Ye=!!(Se.bgStrip&&At>0);if(je[0]=Se.isFull?1:0,je[1]=Se.bgStrip?Se.bgStrip.yWg*4:0,je[2]=Se.bgStrip?Se.bgStrip.z:0,je[3]=0,e.queue.writeBuffer(ne,0,je),z.halfPass0)for(const[Ve,Je]of[[ye.lo,ye.bgLo],[ye.hi,ye.bgHi]]){const xe=de.beginComputePass();xe.setBindGroup(0,ft),ae>0&&(xe.setPipeline(Ve.pipe),xe.dispatchWorkgroups(1,Q,ae)),Ye&&(xe.setPipeline(Je.pipe),xe.dispatchWorkgroups(1,1,1)),xe.end(),Ee.push("conv0")}else{const Ve=de.beginComputePass();Ve.setBindGroup(0,ft),ae>0&&(Ve.setPipeline(ye.main.pipe),Ve.dispatchWorkgroups(1,Q,ae)),Ye&&(Ve.setPipeline(ye.bg.pipe),Ve.dispatchWorkgroups(1,1,1)),Ve.end(),Ee.push("conv0")}}else{const Q=Ge,ae=xt[Pe],Ye=vt[Pe],{mainCount:Ve,extCount:Je,layerBaseSlot:xe}=ve,lt=Se.mode==="rpure"&&!!Se.bgStrip;for(let Ne=0;Ne<8;Ne++){if(Ne>=2){const Oe=Ne-2,et=Se.isFull||Ve[Oe]>0,Rt=!Se.isFull&&Se.mode==="bwd"&&Je[Oe]>0;if(et||Rt){const ht=de.beginComputePass();ht.setPipeline(me.pipe),et&&(ht.setBindGroup(0,Ye,[(xe+8+Oe)*T]),ht.dispatchWorkgroups(1,Se.isFull?64:1,Se.isFull?32:Ve[Oe])),Rt&&(ht.setBindGroup(0,Ye,[(xe+14+Oe)*T]),ht.dispatchWorkgroups(1,1,Je[Oe])),ht.end(),Ee.push("flushStage")}}const we=Se.isFull||Ve[Ne]>0,ke=!Se.isFull&&Se.mode==="bwd"&&Je[Ne]>0,bt=Ne===0&&lt;if(!we&&!ke&&!bt)continue;const Ae=[(xe+Ne)*T],St=Se.isFull?64:1,Ut=Se.isFull?32:Ve[Ne];if(z.halfPassConv)for(const[Oe,et,Rt]of[[Q.lo,Q.extLo,Q.bgLo],[Q.hi,Q.extHi,Q.bgHi]]){const ht=de.beginComputePass();ht.setBindGroup(0,ae,Ae),we&&(ht.setPipeline(Oe.pipe),ht.dispatchWorkgroups(1,St,Ut)),ke&&(ht.setPipeline(et.pipe),ht.dispatchWorkgroups(1,1,Je[Ne])),bt&&(ht.setPipeline(Rt.pipe),ht.dispatchWorkgroups(1,1,1)),ht.end(),Ee.push("convHidden")}else{const Oe=de.beginComputePass();Oe.setBindGroup(0,ae,Ae),we&&(Oe.setPipeline(Q.main.pipe),Oe.dispatchWorkgroups(1,St,Ut)),ke&&(Oe.setPipeline(Q.ext.pipe),Oe.dispatchWorkgroups(1,1,Je[Ne])),bt&&(Oe.setPipeline(Q.bg.pipe),Oe.dispatchWorkgroups(1,1,1)),Oe.end(),Ee.push("convHidden")}}}const ze=Pe+1<m?n.w0Vec4s+Pe*n.hiddenVec4PerLayer:0;Ze[0]=Pe*n.metaStride,Ze[1]=ze,Ze[2]=(Pe+1)*n.metaStride,Ze[3]=Pe+1<m?1:0,Ze[4]=Pe===0?1:0,Ze[5]=Se.isFull?1:0,Ze[6]=Pt,Ze[7]=Ct*8,gn[8]=Se.extWeight||0,Ze[9]=0,Ze[10]=0,Ze[11]=0,e.queue.writeBuffer(Z[Pe],0,Ze);{const Q=de.beginComputePass();Q.setBindGroup(0,mt[Pe]),Q.setPipeline(_e.pipe),Q.dispatchWorkgroups(t.cs,1,1),Q.end(),Ee.push("momentsPrep")}if(Pe+1<m){{const ae=de.beginComputePass();ae.setBindGroup(0,mt[Pe]),ae.setPipeline(be.pipe),ae.dispatchWorkgroups(1,1,1),ae.end(),Ee.push("momentsPrep")}const Q=Se.isFull?0:qe;if((Q>0||At>0)&&(Q>0&&Bt.set(Se.normStrips,0),At>0&&Bt.set(Se.haloRows,Q),e.queue.writeBuffer(se[Pe],0,Bt.subarray(0,Q+At))),je[0]=Se.isFull?1:0,je[1]=Se.bgStrip?Se.bgStrip.z*q+Se.bgStrip.yWg*4:0,je[2]=Q,je[3]=At,e.queue.writeBuffer(ee[Pe],0,je),Se.isFull||qe>0||At>0){const ae=de.beginComputePass();ae.setBindGroup(0,yt[Pe]),(Se.isFull||qe>0)&&(ae.setPipeline(te.pipe),ae.dispatchWorkgroups(1,Se.isFull?64:1,Se.isFull?q:qe)),At>0&&(ae.setPipeline(fe.pipe),ae.dispatchWorkgroups(1,Math.ceil(At/4),1)),ae.end(),Ee.push("normHalo")}}}return dt.__passCategories=Ee,Ke.finishAndReadback({enc:de,schedule:Me,passCategories:Ee,u4Tmp:je,ioOpts:Ue})}const Qe=Fn(e),We=typeof Ue?.onProgress=="function"?Ue.onProgress:null,rt=Ss(Me,m);let _t=0,Zt=-1;const gt=de=>{if(!We)return;const Pe=Math.min(.99,_t/rt);let ve="";de>=0&&de!==Zt&&(Zt=de,ve=`Layer ${de+1}/${m}`),We(Pe,ve)},Re=Ps(e,a.msPerStrip||e.__v4MsPerStrip||.12,gt);let Ce=e.createCommandEncoder();Ie.runPrePasses(Ce,Ee),Me.clsSkipped&&(Ce.clearBuffer(E,0,l),Me.clsStrips.length>0&&e.queue.writeBuffer(j,0,Me.clsStrips));for(let de=0;de<m;de++){const Pe=it[de],{L:ve,nMain:Se,nHalo:Pt}=Pe,At=ve.nMomExt||0,Ct=ve.isFull?Fe:ve.normStrips?ve.normStrips.length:0,qe=vr(ve,de,m);if(de===0){const Q=ve.isFull?64:1,ae=ve.isFull?q:Se,Ye=!!(ve.bgStrip&&Pt>0);if(je[0]=ve.isFull?1:0,je[1]=ve.bgStrip?ve.bgStrip.yWg*4:0,je[2]=ve.bgStrip?ve.bgStrip.z:0,je[3]=0,e.queue.writeBuffer(ne,0,je),z.halfPass0)for(const[Ve,Je]of[[ye.lo,ye.bgLo],[ye.hi,ye.bgHi]]){const xe=Ce.beginComputePass();xe.setBindGroup(0,ft),ae>0&&(xe.setPipeline(Ve.pipe),xe.dispatchWorkgroups(1,Q,ae)),Ye&&(xe.setPipeline(Je.pipe),xe.dispatchWorkgroups(1,1,1)),xe.end(),Ee.push("conv0")}else{const Ve=Ce.beginComputePass();Ve.setBindGroup(0,ft),ae>0&&(Ve.setPipeline(ye.main.pipe),Ve.dispatchWorkgroups(1,Q,ae)),Ye&&(Ve.setPipeline(ye.bg.pipe),Ve.dispatchWorkgroups(1,1,1)),Ve.end(),Ee.push("conv0")}ge==="calibrate"?(e.queue.submit([Ce.finish()]),Ce=e.createCommandEncoder()):ge==="paced"&&(_t+=qe.convWork,Ce=await Re.submitChunk(Ce,qe.convWork,0,{forceUiYield:!0}))}else{const Q=Ge,ae=xt[de],Ye=vt[de],{mainCount:Ve,extCount:Je,layerBaseSlot:xe}=Pe,lt=ve.mode==="rpure"&&!!ve.bgStrip;let Ne=0;for(let we=0;we<8;we++){if(we>=2){const St=we-2,Ut=ve.isFull||Ve[St]>0,Oe=!ve.isFull&&ve.mode==="bwd"&&Je[St]>0;if(Ut||Oe){const et=Ce.beginComputePass();et.setPipeline(me.pipe),Ut&&(et.setBindGroup(0,Ye,[(xe+8+St)*T]),et.dispatchWorkgroups(1,ve.isFull?64:1,ve.isFull?32:Ve[St])),Oe&&(et.setBindGroup(0,Ye,[(xe+14+St)*T]),et.dispatchWorkgroups(1,1,Je[St])),et.end(),Ee.push("flushStage")}}const ke=ve.isFull||Ve[we]>0,bt=!ve.isFull&&ve.mode==="bwd"&&Je[we]>0,Ae=we===0&&lt;if(ke||bt||Ae){const St=[(xe+we)*T],Ut=ve.isFull?64:1,Oe=ve.isFull?32:Ve[we];if(z.halfPassConv)for(const[et,Rt,ht]of[[Q.lo,Q.extLo,Q.bgLo],[Q.hi,Q.extHi,Q.bgHi]]){const $t=Ce.beginComputePass();$t.setBindGroup(0,ae,St),ke&&($t.setPipeline(et.pipe),$t.dispatchWorkgroups(1,Ut,Oe)),bt&&($t.setPipeline(Rt.pipe),$t.dispatchWorkgroups(1,1,Je[we])),Ae&&($t.setPipeline(ht.pipe),$t.dispatchWorkgroups(1,1,1)),$t.end(),Ee.push("convHidden")}else{const et=Ce.beginComputePass();et.setBindGroup(0,ae,St),ke&&(et.setPipeline(Q.main.pipe),et.dispatchWorkgroups(1,Ut,Oe)),bt&&(et.setPipeline(Q.ext.pipe),et.dispatchWorkgroups(1,1,Je[we])),Ae&&(et.setPipeline(Q.bg.pipe),et.dispatchWorkgroups(1,1,1)),et.end(),Ee.push("convHidden")}Ne+=(ke?ve.isFull?2048:Ve[we]:0)+(bt?Je[we]:0)}if(ge==="calibrate"&&(Ne>=512||we===7&&Ne>0)){const St=performance.now();e.queue.submit([Ce.finish()]),await e.queue.onSubmittedWorkDone();const Ut=performance.now()-St;if(Ce=e.createCommandEncoder(),_t+=Ne,Ne>=512){const Oe=Ut/Ne,et=Oe*Fe;e.__v4WinCalibrated=!0,Re.setMsPerStrip(Oe),!Qe.isWindowsSharedIgpu&&et<$s?(e.__v4WinFast=!0,ge="pipelined",console.log(`[WebGPU-V4-128M] Windows GPU calibration: estFullLayer=${et.toFixed(1)}ms -> unthrottled pipelined mode`)):(e.__v4WinFast=!1,ge="paced",console.log(`[WebGPU-V4-128M] Windows GPU calibration: estFullLayer=${et.toFixed(1)}ms -> TDR-safe 2-in-flight paced mode`),gt(de))}Ne=0}else ge==="paced"&&Ne>0&&(Ne*Re.getMsPerStrip()>=Ms*.75||we===7)&&(_t+=Ne,Ce=await Re.submitChunk(Ce,Ne,de),Ne=0)}}const ze=de+1<m?n.w0Vec4s+de*n.hiddenVec4PerLayer:0;Ze[0]=de*n.metaStride,Ze[1]=ze,Ze[2]=(de+1)*n.metaStride,Ze[3]=de+1<m?1:0,Ze[4]=de===0?1:0,Ze[5]=ve.isFull?1:0,Ze[6]=Se,Ze[7]=At*8,gn[8]=ve.extWeight||0,Ze[9]=0,Ze[10]=0,Ze[11]=0,e.queue.writeBuffer(Z[de],0,Ze);{const Q=Ce.beginComputePass();Q.setBindGroup(0,mt[de]),Q.setPipeline(_e.pipe),Q.dispatchWorkgroups(t.cs,1,1),Q.end(),Ee.push("momentsPrep")}if(de+1<m){{const ae=Ce.beginComputePass();ae.setBindGroup(0,mt[de]),ae.setPipeline(be.pipe),ae.dispatchWorkgroups(1,1,1),ae.end(),Ee.push("momentsPrep")}const Q=ve.isFull?0:Ct;if((Q>0||Pt>0)&&(Q>0&&Bt.set(ve.normStrips,0),Pt>0&&Bt.set(ve.haloRows,Q),e.queue.writeBuffer(se[de],0,Bt.subarray(0,Q+Pt))),je[0]=ve.isFull?1:0,je[1]=ve.bgStrip?ve.bgStrip.z*q+ve.bgStrip.yWg*4:0,je[2]=Q,je[3]=Pt,e.queue.writeBuffer(ee[de],0,je),ve.isFull||Ct>0||Pt>0){const ae=Ce.beginComputePass();ae.setBindGroup(0,yt[de]),(ve.isFull||Ct>0)&&(ae.setPipeline(te.pipe),ae.dispatchWorkgroups(1,ve.isFull?64:1,ve.isFull?q:Ct)),Pt>0&&(ae.setPipeline(fe.pipe),ae.dispatchWorkgroups(1,Math.ceil(Pt/4),1)),ae.end(),Ee.push("normHalo")}}ge==="pipelined"?(e.queue.submit([Ce.finish()]),Ce=e.createCommandEncoder()):ge==="calibrate"?(e.queue.submit([Ce.finish()]),await e.queue.onSubmittedWorkDone(),Ce=e.createCommandEncoder(),_t+=(de===0?qe.convWork:0)+qe.normWork,de===m-1&&!e.__v4WinCalibrated&&(e.__v4WinCalibrated=!0,e.__v4WinFast=!Qe.isWindowsSharedIgpu)):(_t+=qe.normWork,Ce=await Re.submitChunk(Ce,qe.normWork,de))}return ge==="paced"&&await Re.waitBeforeFinalSubmit(),dt.__passCategories=Ee,Ke.finishAndReadback({enc:Ce,schedule:Me,passCategories:Ee,u4Tmp:je,ioOpts:Ue,paced:ge==="paced",onProgress:We})}return Ke.warmupIoPipelines(),dt.dispose=({keepSharedWorkspace:Te=!1}={})=>{Ke.dispose();for(const Ue of D)Ue.destroy();if(D.length=0,J.resetBytes(),F.pooled)Te?F.inUse=!1:Jt.get(e)===F&&kn(e);else{for(const Ue of F.buffers)Ue.destroy();F.buffers.length=0}},dt.gpuBytes=()=>F.bytes+J.getBytes(),dt.__passCategories=[],dt.__coneInfo=()=>({paddedVox:w,actMiB:c/1048576,mode:"LowMem128"}),dt.__v4Plan=()=>a,dt.kernels="v4-int8",dt}async function La(e,t,n,r={}){return await Ia(e,t,n,r)}async function Ia(e,t,n,r={}){const s=t instanceof Uint8Array?t:new Uint8Array(t),o=r?.modelBinModel?aa(s,r.modelBinModel):sa(s.buffer.slice(s.byteOffset,s.byteOffset+s.byteLength)),i=ia(o);r?.classifierBias&&i.classifier&&(i.classifier.bias=Float32Array.from(r.classifierBias));const a=fa(r),f=r?.dilations||a?.dilations||(i.convs.length===25?[16,8,4,2,1,16,8,4,2,1,16,8,4,2,1,16,8,4,2,1,16,8,4,2,1]:i.convs.length===9?[1,2,4,8,16,8,4,2,1]:ga),l=r?.activation||a?.activation||(i.affines.length||i.convs.length>=13?"gelu_tanh":"relu"),m=i.convs[0].outC,d=m>8?Math.ceil(m/8)*8:Math.ceil(m/4)*4,c=la(i,{nx:q,ny:q,nz:q,cs:d,activation:l,dilations:f}),u=$a(s,i,c,r),p=r?.outputType==="probability"?pa(r,c.nclass):null,y=!!e.features?.has?.("shader-f16")&&!r?.disableF16,$=ha(e,r),h=q*q*q,_=p?h*4:h,z=c.cs>=16,b=z?c.cs/2:c.cs,g=q*q*b*st*4,v=q*q*b*ut*4,M=e.limits||{},w=Math.min(M.maxStorageBufferBindingSize??1/0,M.maxBufferSize??1/0),x=await ea(e,c,r,{actBytes:g,outBufBytes:_,hasF16:y});if(e.__v4LastPlan=x,console.info(ys(x,c)),x.layout==="LowMem128"&&c.cs>=8&&c.cs%4===0)return Ua(e,c,u,y,$,r,p,x);if(g>w||_>w){const Qe=Math.max(g,_)>>>20;throw new Error(`meshnet_fast_v4: buffer (${Qe} MiB) exceeds device limit (${w>>>20} MiB)`)}const P=x.chunkableStd,k=Fa({cs:c.cs,chan:c.chan,nclass:c.nclass,clsK4:u.clsK4,dilations:c.dilations,activation:c.activation,norm:c.norm,hasF16:y,subgroupMode:$,splitHalves:z,probCfg:p,chunkableStd:P});console.log(`[WebGPU-V4] ${c.chan}ch(cs=${c.cs})/${c.nclass}cls (${c.dilations.length} convs, ${c.activation}, norm=${c.norm}${p?", prob=3":""}) | ${y?"f16+sterbenz":"f32"} | ${ks($)} | ZYCX-pad80 | maxBuf=${(Math.max(g,_)/1048576).toFixed(1)} MiB`);const S=GPUBufferUsage.STORAGE,F=GPUBufferUsage.COPY_DST,L=GPUBufferUsage.COPY_SRC,K=q*q*tn,W=K*(y?2:4),C=Bn*c.cs*16,R=xs*c.cs*16,A=(c.cs*2+4)*16,U=y?Math.ceil(k.totalWEffVec4s/2)*16:k.totalWEffVec4s*16,E=`std|${c.cs}|${z?1:0}|${y?1:0}|${_}`,B=Fs(e,E,()=>{const Qe=[],We=On(e,Qe),rt=We.alloc,_t={inpBuf:rt(W,S|F|L),act8_0:rt(g,S|F|L),act8_1:rt(z?g:16,S|F|L),y8_0:rt(v,S|F|L),y8_1:rt(z?v:16,S|F|L),momMainBuf:rt(C,S),momExtBuf:rt(R,S),momStatsBuf:rt(A,S),labels8Buf:rt(_,S|F|L),readbackBuf:rt(_,GPUBufferUsage.MAP_READ|F)};return{buffers:Qe,named:_t,bytes:We.getBytes()}}),{inpBuf:O,act8_0:D,act8_1:J,y8_0:Y,y8_1:V,momMainBuf:re,momExtBuf:X,momStatsBuf:oe,labels8Buf:N,readbackBuf:j}=B.named,G=[],se=On(e,G),ne=se.alloc,ce=ne(y?u.wF16.byteLength:u.wF32.byteLength,S|F),Z=ne(u.qmetaF32.byteLength,S|F),ee=ne(U,k.useUniformWeff?S|GPUBufferUsage.UNIFORM:S),T=c.dilations.length,I=c.norm==="gn"&&!r?.disableConeSkip,H=Array.from({length:T},()=>ne(I?Fe*4:16,S|F)),ie=Array.from({length:T-1},()=>ne(I?(Fe+q*q)*4:16,S|F)),le=ne(I?Fe*4:16,S|F),pe=ne(16,GPUBufferUsage.UNIFORM|F),ue=ne(16,GPUBufferUsage.UNIFORM|F),he=Array.from({length:T},()=>ne(48,GPUBufferUsage.UNIFORM|F)),_e=Array.from({length:T-1},()=>ne(16,GPUBufferUsage.UNIFORM|F)),be=Math.max(256,M.minUniformBufferOffsetAlignment||256),me=be>>>2,te=k.chunkableStd?Math.max(1,(T-1)*br):0,fe=k.chunkableStd?ne(te*be,GPUBufferUsage.UNIFORM|F):null,Be=k.chunkableStd?new Uint32Array(te*me):null,ye=k.chunkableStd?null:Array.from({length:T},()=>ne(16,GPUBufferUsage.UNIFORM|F));e.queue.writeBuffer(ce,0,y?u.wF16:u.wF32),e.queue.writeBuffer(Z,0,u.qmetaF32);let Ge;try{Ge=await Sa(e,c,u,y,$,z,p,k)}catch(Qe){for(const We of G)We.destroy();if(G.length=0,B.pooled)Jt.get(e)===B&&kn(e);else{for(const We of B.buffers)We.destroy();B.buffers.length=0}throw Qe}const{pInit:He,pMomFin:nt,pPrepW:Mt,pNorm:ft,pNormHalo:ct,pCls:kt,pConv0:at,pConv:Ke}=Ge,mt=(Qe,We)=>e.createBindGroup({layout:Qe,entries:We.map((rt,_t)=>({binding:_t,resource:rt&&rt.buffer?rt:{buffer:rt}}))}),yt=mt(He.bgl,[D,J]);{const Qe=e.createCommandEncoder(),We=Qe.beginComputePass();We.setPipeline(He.pipe),We.setBindGroup(0,yt),We.dispatchWorkgroups(1,q,q),We.end(),e.queue.submit([Qe.finish()])}const pt=(k.halfPass0?at.lo:at.main).bgl,vt=mt(pt,[O,Y,V,ce,Z,re,X,H[0],pe]),Xt=mt(kt.bgl,[Y,V,ce,Z,re,oe,N,le,ue]),xt=!!(p&&z&&g>=_&&v>=_),Gt=xt?ne(16,GPUBufferUsage.UNIFORM|F):null,Yt=xt?mt(kt.bgl,[Y,V,ce,Z,re,oe,N,le,Gt]):null,zt=Ns({device:e,hasF16:y,nvox:h,outBufBytes:_,inpBuf:O,act8_0:D,labels8Buf:N,readbackBuf:j,pInit:He,bgInit:yt,pCls:kt,bgCls:Xt,clsUbo:ue,packed:u,modelEntry:r,probCfg:p,canGpuProb:xt,probSlots:xt?{clsUbo1:Gt,bgCls1:Yt,pass0HoldBuf:D,y0:Y,y1:V,b:J,sup:D}:null,ownedBuffers:G,mkBuf:ne}),Bt=he.map((Qe,We)=>mt(nt.bgl,[ce,Z,re,X,oe,ee,H[We],Qe])),Ze=_e.map((Qe,We)=>mt(ft.bgl,[D,J,Y,V,re,X,oe,ie[We],Qe])),gn=k.chunkableStd?{buffer:fe,offset:0,size:32}:null,je=k.halfPassConv?Ke.lo:Ke.main,Vt=Array.from({length:T},(Qe,We)=>We===0?null:mt(je.bgl,[D,J,Y,V,re,X,ee,H[We],k.chunkableStd?gn:ye[We]])),dt=(Qe,We,rt,_t,Zt,gt)=>{const Re=Qe*me;Be[Re]=We?1:0,Be[Re+1]=rt,Be[Re+2]=_t,Be[Re+3]=0,Be[Re+4]=Zt,Be[Re+5]=gt,Be[Re+6]=0,Be[Re+7]=0},Te=(Qe,We,rt,_t,Zt,gt,Re,Ce)=>{if(!(gt<=0&&Re<=0))if(k.halfPassConv){{const de=Qe.beginComputePass();_t?de.setBindGroup(0,rt,_t):de.setBindGroup(0,rt),gt>0&&(de.setPipeline(We.lo.pipe),de.dispatchWorkgroups(1,Zt,gt)),Re>0&&(de.setPipeline(We.extLo.pipe),de.dispatchWorkgroups(1,1,Re)),de.end(),Ce.push("convHidden")}{const de=Qe.beginComputePass();_t?de.setBindGroup(0,rt,_t):de.setBindGroup(0,rt),gt>0&&(de.setPipeline(We.hi.pipe),de.dispatchWorkgroups(1,Zt,gt)),Re>0&&(de.setPipeline(We.extHi.pipe),de.dispatchWorkgroups(1,1,Re)),de.end(),Ce.push("convHidden")}}else{const de=Qe.beginComputePass();_t?de.setBindGroup(0,rt,_t):de.setBindGroup(0,rt),gt>0&&(de.setPipeline(We.main.pipe),de.dispatchWorkgroups(1,Zt,gt)),Re>0&&(de.setPipeline(We.ext.pipe),de.dispatchWorkgroups(1,1,Re)),de.end(),Ce.push("convHidden")}},Ue=y?new Uint16Array(K):new Float32Array(K),De=new Uint8Array(q*q),Ie=new Uint32Array(Fe),ot=new Uint32Array(Fe+q*q),Me=new Uint32Array(12),it=new Float32Array(Me.buffer),ge=new Uint32Array(4);async function Ee(Qe,We){if(Qe.length!==h)throw new Error(`meshnet_fast_v4 expected ${h} voxels, got ${Qe.length}`);const rt=c.norm==="gn"&&!r?.disableConeSkip,_t=await zt.prepareInput({volume:Qe,ioOpts:We,useCone:rt,padInputHost:Ue,headRowHost:De,hasF16Flag:y}),Zt=_t.info,gt=Es(De,Zt,c.dilations,rt);let Re=x.execMode==="calibrate"&&e.__v4WinCalibrated?e.__v4WinFast?"pipelined":"paced":x.execMode;const Ce=[];if(Re==="single"&&!k.chunkableStd){const ze=e.createCommandEncoder();_t.runPrePasses(ze,Ce),gt.clsSkipped&&(ze.clearBuffer(N,0,_),gt.clsStrips.length>0&&e.queue.writeBuffer(le,0,gt.clsStrips));for(let Q=0;Q<T;Q++){const ae=gt.layers[Q],Ye=ae.isFull?Fe:ae.mainStrips.length,Ve=ae.isFull||!ae.extStrips?0:ae.extStrips.length,Je=ae.nMomExt||0,xe=ae.haloRows?ae.haloRows.length:0,lt=ae.isFull?Fe:ae.normStrips?ae.normStrips.length:0;if(!ae.isFull&&(Ye>0||Ve>0)&&(Ye>0&&Ie.set(ae.mainStrips,0),Ve>0&&Ie.set(ae.extStrips,Ye),e.queue.writeBuffer(H[Q],0,Ie.subarray(0,Ye+Ve))),Q===0){const we=ae.isFull?64:1,ke=ae.isFull?q:Ye,bt=!!(ae.bgStrip&&xe>0);if(ge[0]=ae.isFull?1:0,ge[1]=ae.bgStrip?ae.bgStrip.yWg*4:0,ge[2]=ae.bgStrip?ae.bgStrip.z:0,ge[3]=0,e.queue.writeBuffer(pe,0,ge),k.halfPass0){{const Ae=ze.beginComputePass();Ae.setBindGroup(0,vt),ke>0&&(Ae.setPipeline(at.lo.pipe),Ae.dispatchWorkgroups(1,we,ke)),bt&&(Ae.setPipeline(at.bgLo.pipe),Ae.dispatchWorkgroups(1,1,1)),Ae.end(),Ce.push("conv0")}{const Ae=ze.beginComputePass();Ae.setBindGroup(0,vt),ke>0&&(Ae.setPipeline(at.hi.pipe),Ae.dispatchWorkgroups(1,we,ke)),bt&&(Ae.setPipeline(at.bgHi.pipe),Ae.dispatchWorkgroups(1,1,1)),Ae.end(),Ce.push("conv0")}}else{const Ae=ze.beginComputePass();Ae.setBindGroup(0,vt),ke>0&&(Ae.setPipeline(at.main.pipe),Ae.dispatchWorkgroups(1,we,ke)),bt&&(Ae.setPipeline(at.bg.pipe),Ae.dispatchWorkgroups(1,1,1)),Ae.end(),Ce.push("conv0")}}else{const we=c.dilations[Q],ke=Vt[Q],bt=ae.isFull?64:1,Ae=ae.isFull?q:Ye,St=ae.mode==="rpure"&&xe>0||ae.mode==="bwd"&&Q+1<T;ge[0]=ae.isFull?1:0,ge[1]=Ye,ge[2]=yr(we,St),ge[3]=0,e.queue.writeBuffer(ye[Q],0,ge),Te(ze,Ke,ke,null,bt,Ae,Ve,Ce)}const Ne=Q+1<T?u.w0Vec4s+Q*u.hiddenVec4PerLayer:0;Me[0]=Q*u.metaStride,Me[1]=Ne,Me[2]=(Q+1)*u.metaStride,Me[3]=Q+1<T?1:0,Me[4]=Q===0?1:0,Me[5]=ae.isFull?1:0,Me[6]=Ye,Me[7]=Je*8,it[8]=ae.extWeight||0,Me[9]=0,Me[10]=0,Me[11]=0,e.queue.writeBuffer(he[Q],0,Me);{const we=ze.beginComputePass();we.setBindGroup(0,Bt[Q]),we.setPipeline(nt.pipe),we.dispatchWorkgroups(c.cs,1,1),we.end(),Ce.push("momentsPrep")}if(Q+1<T){{const ke=ze.beginComputePass();ke.setBindGroup(0,Bt[Q]),ke.setPipeline(Mt.pipe),ke.dispatchWorkgroups(1,1,1),ke.end(),Ce.push("momentsPrep")}const we=ae.isFull?0:lt;if((we>0||xe>0)&&(we>0&&ot.set(ae.normStrips,0),xe>0&&ot.set(ae.haloRows,we),e.queue.writeBuffer(ie[Q],0,ot.subarray(0,we+xe))),ge[0]=ae.isFull?1:0,ge[1]=ae.bgStrip?ae.bgStrip.z*q+ae.bgStrip.yWg*4:0,ge[2]=we,ge[3]=xe,e.queue.writeBuffer(_e[Q],0,ge),ae.isFull||lt>0||xe>0){const ke=ze.beginComputePass();ke.setBindGroup(0,Ze[Q]),(ae.isFull||lt>0)&&(ke.setPipeline(ft.pipe),ke.dispatchWorkgroups(1,ae.isFull?64:1,ae.isFull?q:lt)),xe>0&&(ke.setPipeline(ct.pipe),ke.dispatchWorkgroups(1,Math.ceil(xe/4),1)),ke.end(),Ce.push("normHalo")}}}return Ee.__passCategories=Ce,zt.finishAndReadback({enc:ze,schedule:gt,passCategories:Ce,u4Tmp:ge,ioOpts:We})}const de=Fn(e),Pe=typeof We?.onProgress=="function"?We.onProgress:null,ve=Ss(gt,T);let Se=0,Pt=-1;const At=ze=>{if(!Pe)return;const Q=Math.min(.99,Se/ve);let ae="";ze>=0&&ze!==Pt&&(Pt=ze,ae=`Layer ${ze+1}/${T}`),Pe(Q,ae)},Ct=Ps(e,x.msPerStrip||e.__v4MsPerStrip||.12,At);let qe=e.createCommandEncoder();_t.runPrePasses(qe,Ce),gt.clsSkipped&&(qe.clearBuffer(N,0,_),gt.clsStrips.length>0&&e.queue.writeBuffer(le,0,gt.clsStrips));for(let ze=0;ze<T;ze++){const Q=gt.layers[ze],ae=Q.isFull?Fe:Q.mainStrips.length,Ye=Q.isFull||!Q.extStrips?0:Q.extStrips.length,Ve=Q.nMomExt||0,Je=Q.haloRows?Q.haloRows.length:0,xe=Q.isFull?Fe:Q.normStrips?Q.normStrips.length:0,lt=vr(Q,ze,T);if(!Q.isFull&&(ae>0||Ye>0)&&(ae>0&&Ie.set(Q.mainStrips,0),Ye>0&&Ie.set(Q.extStrips,ae),e.queue.writeBuffer(H[ze],0,Ie.subarray(0,ae+Ye))),ze===0){const we=Q.isFull?64:1,ke=Q.isFull?q:ae,bt=!!(Q.bgStrip&&Je>0);if(ge[0]=Q.isFull?1:0,ge[1]=Q.bgStrip?Q.bgStrip.yWg*4:0,ge[2]=Q.bgStrip?Q.bgStrip.z:0,ge[3]=0,e.queue.writeBuffer(pe,0,ge),k.halfPass0){{const Ae=qe.beginComputePass();Ae.setBindGroup(0,vt),ke>0&&(Ae.setPipeline(at.lo.pipe),Ae.dispatchWorkgroups(1,we,ke)),bt&&(Ae.setPipeline(at.bgLo.pipe),Ae.dispatchWorkgroups(1,1,1)),Ae.end(),Ce.push("conv0")}{const Ae=qe.beginComputePass();Ae.setBindGroup(0,vt),ke>0&&(Ae.setPipeline(at.hi.pipe),Ae.dispatchWorkgroups(1,we,ke)),bt&&(Ae.setPipeline(at.bgHi.pipe),Ae.dispatchWorkgroups(1,1,1)),Ae.end(),Ce.push("conv0")}}else{const Ae=qe.beginComputePass();Ae.setBindGroup(0,vt),ke>0&&(Ae.setPipeline(at.main.pipe),Ae.dispatchWorkgroups(1,we,ke)),bt&&(Ae.setPipeline(at.bg.pipe),Ae.dispatchWorkgroups(1,1,1)),Ae.end(),Ce.push("conv0")}Re==="calibrate"?(e.queue.submit([qe.finish()]),qe=e.createCommandEncoder()):Re==="paced"&&(Se+=lt.convWork,qe=await Ct.submitChunk(qe,lt.convWork,0,{forceUiYield:!0}))}else{const we=c.dilations[ze],ke=Vt[ze],bt=Q.isFull?64:1,Ae=Q.isFull?q:ae,St=Q.mode==="rpure"&&Je>0||Q.mode==="bwd"&&ze+1<T,Ut=yr(we,St);if(!k.chunkableStd)ge[0]=Q.isFull?1:0,ge[1]=ae,ge[2]=Ut,ge[3]=0,e.queue.writeBuffer(ye[ze],0,ge),Te(qe,Ke,ke,null,bt,Ae,Ye,Ce);else if(Re==="pipelined"||Re==="single"){const Oe=(ze-1)*br;dt(Oe,Q.isFull,ae,Ut,0,0),e.queue.writeBuffer(fe,Oe*be,Be.subarray(Oe*me,(Oe+1)*me)),Te(qe,Ke,ke,[Oe*be],bt,Ae,Ye,Ce)}else{const Oe=(ze-1)*br,et=Re==="calibrate"?1024:Math.max(256,Math.min(4096,Math.round(Ms/Math.max(.005,Ct.getMsPerStrip())))),Rt=[];let ht=0;if(Q.isFull){const Kt=Math.max(4,Math.min(64,Math.round(et/64)));for(let Nt=0;Nt<q;Nt+=Kt){const Wt=Math.min(Kt,q-Nt),jt=Oe+ht++;dt(jt,!0,ae,Ut,Nt,0),Rt.push({slotIdx:jt,mainY:64,mainCountZ:Wt,extCountZ:0,strips:Wt*64})}}else{const Kt=Math.max(256,et);for(let Wt=0;Wt<ae;Wt+=Kt){const jt=Math.min(Kt,ae-Wt),_n=Oe+ht++;dt(_n,!1,ae,Ut,Wt,0),Rt.push({slotIdx:_n,mainY:1,mainCountZ:jt,extCountZ:0,strips:jt})}const Nt=Math.max(256,et);for(let Wt=0;Wt<Ye;Wt+=Nt){const jt=Math.min(Nt,Ye-Wt),_n=Oe+ht++;dt(_n,!1,ae,Ut,0,Wt),Rt.push({slotIdx:_n,mainY:1,mainCountZ:0,extCountZ:jt,strips:jt})}}ht>0&&e.queue.writeBuffer(fe,Oe*be,Be.subarray(Oe*me,(Oe+ht)*me));let $t=0;for(let Kt=0;Kt<Rt.length;Kt++){const Nt=Rt[Kt];if(Te(qe,Ke,ke,[Nt.slotIdx*be],Nt.mainY,Nt.mainCountZ,Nt.extCountZ,Ce),Re==="pipelined")continue;$t+=Nt.strips;const Wt=Kt===Rt.length-1;if(Re==="calibrate"&&($t>=512||Wt&&$t>0)){const jt=performance.now();e.queue.submit([qe.finish()]),await e.queue.onSubmittedWorkDone();const _n=performance.now()-jt;if(qe=e.createCommandEncoder(),Se+=$t,$t>=512){const Js=_n/$t,Cr=Js*Fe;e.__v4WinCalibrated=!0,Ct.setMsPerStrip(Js),!de.isWindowsSharedIgpu&&Cr<$s?(e.__v4WinFast=!0,Re="pipelined",console.log(`[WebGPU-V4] Windows GPU calibration: estFullLayer=${Cr.toFixed(1)}ms -> unthrottled pipelined mode`)):(e.__v4WinFast=!1,Re="paced",console.log(`[WebGPU-V4] Windows GPU calibration: estFullLayer=${Cr.toFixed(1)}ms -> TDR-safe 2-in-flight paced mode`),At(ze))}$t=0}else Re==="paced"&&(Se+=$t,qe=await Ct.submitChunk(qe,$t,ze),$t=0)}}}const Ne=ze+1<T?u.w0Vec4s+ze*u.hiddenVec4PerLayer:0;Me[0]=ze*u.metaStride,Me[1]=Ne,Me[2]=(ze+1)*u.metaStride,Me[3]=ze+1<T?1:0,Me[4]=ze===0?1:0,Me[5]=Q.isFull?1:0,Me[6]=ae,Me[7]=Ve*8,it[8]=Q.extWeight||0,Me[9]=0,Me[10]=0,Me[11]=0,e.queue.writeBuffer(he[ze],0,Me);{const we=qe.beginComputePass();we.setBindGroup(0,Bt[ze]),we.setPipeline(nt.pipe),we.dispatchWorkgroups(c.cs,1,1),we.end(),Ce.push("momentsPrep")}if(ze+1<T){{const ke=qe.beginComputePass();ke.setBindGroup(0,Bt[ze]),ke.setPipeline(Mt.pipe),ke.dispatchWorkgroups(1,1,1),ke.end(),Ce.push("momentsPrep")}const we=Q.isFull?0:xe;if((we>0||Je>0)&&(we>0&&ot.set(Q.normStrips,0),Je>0&&ot.set(Q.haloRows,we),e.queue.writeBuffer(ie[ze],0,ot.subarray(0,we+Je))),ge[0]=Q.isFull?1:0,ge[1]=Q.bgStrip?Q.bgStrip.z*q+Q.bgStrip.yWg*4:0,ge[2]=we,ge[3]=Je,e.queue.writeBuffer(_e[ze],0,ge),Q.isFull||xe>0||Je>0){const ke=qe.beginComputePass();ke.setBindGroup(0,Ze[ze]),(Q.isFull||xe>0)&&(ke.setPipeline(ft.pipe),ke.dispatchWorkgroups(1,Q.isFull?64:1,Q.isFull?q:xe)),Je>0&&(ke.setPipeline(ct.pipe),ke.dispatchWorkgroups(1,Math.ceil(Je/4),1)),ke.end(),Ce.push("normHalo")}}if(Re==="pipelined")e.queue.submit([qe.finish()]),qe=e.createCommandEncoder();else if(Re==="calibrate")e.queue.submit([qe.finish()]),await e.queue.onSubmittedWorkDone(),qe=e.createCommandEncoder(),Se+=(ze===0||!k.chunkableStd?lt.convWork:0)+lt.normWork,ze===T-1&&!e.__v4WinCalibrated&&(e.__v4WinCalibrated=!0,e.__v4WinFast=!de.isWindowsSharedIgpu);else if(Re!=="single"){const we=(!k.chunkableStd&&ze>0?lt.convWork:0)+lt.normWork;Se+=we,qe=await Ct.submitChunk(qe,we,ze)}}return Re==="paced"&&await Ct.waitBeforeFinalSubmit(),Ee.__passCategories=Ce,zt.finishAndReadback({enc:qe,schedule:gt,passCategories:Ce,u4Tmp:ge,ioOpts:We,paced:Re==="paced",onProgress:Pe})}return zt.warmupIoPipelines(),Ee.dispose=({keepSharedWorkspace:Qe=!1}={})=>{zt.dispose();for(const We of G)We.destroy();if(G.length=0,se.resetBytes(),B.pooled)Qe?B.inUse=!1:Jt.get(e)===B&&kn(e);else{for(const We of B.buffers)We.destroy();B.buffers.length=0}},Ee.gpuBytes=()=>B.bytes+se.getBytes(),Ee.__passCategories=[],Ee.__coneInfo=()=>({paddedVox:K,actMiB:g/1048576}),Ee.__v4Plan=()=>x,Ee.kernels="v4-int8",Ee}var Pn=256,Ft=[Pn,Pn,Pn],sn=Pn*Pn*Pn,Ds=12e4,Vs=12e4,Wa=new Set([1,2,5,6,13]),qa=e=>e>=1&&e<=34?1:e>=35&&e<=68?2:0,Ea={outputType:"probability",softmaxTemperature:2,brainSupportTemperature:1,brainSupportPower:1,partialVolumeSigma:.65,probabilityGroups:{grayMatter:[2,6,7,8,9,10,14,15,16,17],whiteMatter:[1,5],csf:[3,4,11,12]}},Ta={catLitePurePriorPower:3,catLitePriorStrength:.8,catLiteIntensityStrength:.75,catLiteMixelPrior:.35,catLiteCsfWmMixelPrior:6,catLiteSpatialWeight:.25,catLiteMinSupport:.03,catLiteSigmaFloor:.025,catLiteBiasBlockSize:16,catLiteBiasSmoothPasses:3},Ra=4,pn=new Map,zr=new Map,dn=null;async function Hs(e){if(dn&&!dn.__isLost)return dn;dn=null;const t=await Lr(e);return dn=t,t}function Na(e){if(e){try{kn(e)}catch{}if(!e.__isLost)try{e.destroy()}catch{}dn===e&&(dn=null)}}function Oa(e,t){const n=on(e);if(t)return Wn(`models/${n}.bin`,t);const r=In[e]??In[n];if(!r)throw new $e("unsupported-option",`${e} is not in this entry point; import '@brainchop/mindgrab' or '@brainchop/mindgrab/${e}'`);return r()}async function Xs(e,t,n,r){const s=Oa(e,t),o=pn.get(s);if(o)return pn.delete(s),pn.set(s,o),o;let i=zr.get(s);i||(i=(async()=>{const f=await fetch(s);if(!f.ok)throw new Error(`HTTP ${f.status}: ${f.statusText}`);const l=new Uint8Array(await f.arrayBuffer());for(pn.set(s,l);pn.size>Ra;){const m=pn.keys().next().value;m!==void 0&&pn.delete(m)}return l})().finally(()=>{zr.delete(s)}),zr.set(s,i));let a;try{return await Promise.race([i,new Promise((f,l)=>{a=setTimeout(()=>{l(new $e("initialization-failed",`fetching weights for ${e} (${s}) timed out after ${n} ms`,r))},n)})])}catch(f){throw f instanceof $e?f:new $e("initialization-failed",`failed to load ${e} weights from ${s}: ${f instanceof Error?f.message:String(f)}`,r)}finally{clearTimeout(a)}}function Sn(e){return[[e[0],e[1],e[2],e[3]],[e[4],e[5],e[6],e[7]],[e[8],e[9],e[10],e[11]],[0,0,0,1]]}function Pr(e,t,n,r){if(e[0]!==n[0]||e[1]!==n[1]||e[2]!==n[2])return!1;const s=Jr(t);if(!s)return!1;const o=Fo(s,r);for(let i=0;i<3;i++){const a=i*4;let f=Math.abs(o[a+3]);for(let l=0;l<3;l++)f+=Math.abs(o[a+l]-(i===l?1:0))*(n[l]-1);if(f>=.001)return!1}return!0}function Ga(e,t,n){const r={model:e,modelBinModel:e,quantize8Bit:!0,enableTranspose:!0,...n?Ea:{}};return t==="low-memory"?(r.forceLowMem128=!0,r.webgpuExecMode="paced",r.__v4PlanReasonOverride="override"):t==="standard"?(r.forceLowMem128=!1,r.__v4PlanReasonOverride="override"):t==="recalibrate"&&(r.recalibrate=!0),r}function Ys(e){let t=0;return(n,r,s)=>{if(!e)return;const o=Math.max(0,Math.min(1,Number.isFinite(r)?r:0)),i=Math.max(t,o);t=i;const a={stage:n,progress:i};s?.layer!==void 0&&(a.layer=s.layer),s?.totalLayers!==void 0&&(a.totalLayers=s.totalLayers),s?.message!==void 0&&(a.message=s.message),e(a)}}async function Zs(e){const{canonical:t,model:n,weightBytes:r,conformedImg:s,normOffset:o,normRange:i,normClamp:a,tissueMode:f,device:l,webgpuMode:m,timeoutMs:d,log:c,record:u,reportProgress:p}=e,y=!l,$=l??await Hs(n),h=Ga(t,m,f),_=t==="mindgrab"?25:13,z=async(b,g)=>{const v=typeof b.pushErrorScope=="function"&&typeof b.popErrorScope=="function";let M=!1,w=null,x;v&&(b.pushErrorScope("out-of-memory"),M=!0);try{const P=(async()=>{p("load",.12,{message:`Setting up WebGPU V4 for ${t}`}),w=await La(b,r,void 0,g);const S=typeof w.__v4Plan=="function"?w.__v4Plan():null;S&&u(ys(S)),p("inference",.3,{layer:0,totalLayers:_,message:f?"Estimating tissue priors":`Running ${t} inference`});const F=await w(s,{gpuNativeInput:!0,gpuNativeOutput:!0,normOffset:o,normRange:i,normClamp:a,onProgress:(L,K)=>{const W=Math.max(0,Math.min(1,Number(L)||0)),C=typeof K=="string"?/^Layer (\d+)\/(\d+)$/.exec(K):null;p("inference",.3+.55*W,{layer:C?Number(C[1]):void 0,totalLayers:C?Number(C[2]):_,message:K||void 0})}});return p("inference",.85,{layer:_,totalLayers:_,message:"Inference complete"}),F})(),k=await Promise.race([P,new Promise((S,F)=>{x=setTimeout(()=>{F(new $e("inference-failed",`the ${n} WebGPU inference did not finish within ${d} ms; the GPU device may have been lost`,c))},d)})]);if(M){M=!1;const S=await b.popErrorScope();if(S){const F=new Error(`WebGPU out of memory (${S.message||"allocation failed"})`);throw F.oomError=S,F}}return k}catch(P){if(M){M=!1;try{const k=await b.popErrorScope();k&&P&&typeof P=="object"&&!("oomError"in P)&&(P.oomError=k)}catch{}}throw P}finally{clearTimeout(x);const P=w;if(P)try{P.dispose({keepSharedWorkspace:!1})}catch{}try{kn(b)}catch{}}};try{return await na({device:$,modelEntry:h,runAttempt:(b,g)=>z(b,g),requestFreshDevice:y?async({failedDevice:b})=>{Na(b);try{return await Hs(n)}catch{return null}}:null,onRetry:({failureKind:b,error:g})=>{const v=`[WebGPU-V4] ${b} during inference (${g instanceof Error?g.message:String(g)}); retrying once in LowMem128 + paced`;u(v),p("load",.14,{message:"Retrying in low-memory WebGPU mode"})}})}catch(b){if(b instanceof $e)throw b;const g=b instanceof Error?b.message:String(b);throw u(`brainchopc: webgpu inference error: ${g}`),new $e("inference-failed",g,c)}}function Ks(e){const t=new Uint8Array(e.length);for(let n=0;n<e.length;n++){let r=e[n];r>0?r>1&&(r=1):r=0,t[n]=Math.floor(r*255+.5)}return t}function Sr(e,t,n,r){let s=0;for(let o=0;o<e.length;o++){const i=e[o];if(!Number.isFinite(i)){const a=`brainchopc: ${t} tissue prior contains non-finite value at voxel ${o}`;throw r(a),new $e("inference-failed",a,n)}s+=i}if(!(s>0)){const o=`brainchopc: ${t} tissue prior is empty (all zeros)`;throw r(o),new $e("inference-failed",o,n)}}async function Da(e){const t=performance.now(),n=[],r=w=>{n.push(w),e.onLog?.(w)},s=Ys(e.onProgress),o=on(e.model),i=e.timeoutMs??Ds,a=Math.min(i,Vs);s("load",0,{message:`Loading ${o} weights`}),e.noTurbo&&r(`[WebGPU-V4] running pure-JS V4 engine for ${o}`);const f=Xs(e.model,e.assetPath,a,n);let l;try{l=Vr(e.input)}catch(w){throw await f.catch(()=>{}),new $e("bad-input",w instanceof Error?w.message:String(w),n)}s("conform",.15,{message:"Conforming volume to 256^3"});let m;try{m=Qr({img:l.data,datatypeCode:l.header.datatypeCode,dims:l.header.dims,affine:l.header.affine,sclSlope:l.header.sclSlope,sclInter:l.header.sclInter,toRAS:!1,isLinear:!0,asFloat32:!1,fHigh:Xr,ct:!!e.ct,comply:!!e.comply})}catch(w){throw await f.catch(()=>{}),new $e("bad-input",w instanceof Error?w.message:String(w),n)}const d=m.img;s("conform",.25),s("preprocess",.25,{message:"Computing intensity quantiles"});let c,u,p;if(o==="mindgrab"){const{qmin:w,qmax:x}=Io(d,.02,.98);c=w;const P=x-w+.001;u=P>0?P:1,p=!0}else{const{qmin:w,qmax:x}=rs(d,.05,.95);c=w;const P=x-w;u=P>0?P:1,p=!1}s("preprocess",.3);const y=await f,h=(await Zs({canonical:o,model:e.model,weightBytes:y,conformedImg:d,normOffset:c,normRange:u,normClamp:p,tissueMode:!1,device:e.device,webgpuMode:e.webgpuMode,timeoutMs:i,log:n,record:r,reportProgress:s}))[0];if(!h||h.length!==sn){const w=`brainchopc: unexpected WebGPU output length (${h?.length??0})`;throw r(w),new $e("inference-failed",w,n)}const _=h instanceof Uint8Array?h:new Uint8Array(h);s("postprocess",.85,{message:"Post-processing segmentation"});const z=[l.header.dims[1],l.header.dims[2],l.header.dims[3]];if(o==="mindgrab"){let w=!1;for(let W=0;W<sn;W++)if(_[W]>0){w=!0;break}if(!w){const W="mindgrab: the network found no brain; check the input contrast";throw r(W),new $e("inference-failed",W,n)}if(ts(_,Ft,!0),e.borderMm&&e.borderMm>0&&Uo(_,Ft,1,1,1,e.borderMm),s("reslice",.93,{message:"Applying brain mask in native space"}),!qn(l.header.stoXyz)){const W="brainchopc: cannot reslice to the input grid; its sform is not a usable spatial transform";throw r(W),new $e("bad-input",W,n)}let x;Pr(Ft,m.affine,z,l.header.stoXyz)?x=_:x=Qn({srcImg:_,srcDims:Ft,srcAffine:Sn(m.affine),dstDims:z,dstAffine:Sn(l.header.stoXyz),isLabel:!1,isProbability:!1,dstTypedArrayKind:"Uint8Array"}).img;let P;if(e.mask||e.borderMm!==void 0){const W=new Uint8Array(x.length);for(let C=0;C<x.length;C++)W[C]=x[C]>0?1:0;P=bn(l.header,W,{datatypeCode:Le.UINT8,sclSlope:1,sclInter:0,calMin:0,calMax:0,intentCode:Zn,descrip:"6.0.5"})}const k=xo(l.data,l.header.sclSlope,l.header.sclInter);let S=1/0;for(let W=0;W<k.length;W++)k[W]<S&&(S=k[W]);for(let W=0;W<k.length;W++)x[W]===0&&(k[W]=S);const F=$o(k,l.header.datatypeCode),L=bn(l.header,F,{datatypeCode:l.header.datatypeCode,sclSlope:1,sclInter:0,descrip:"6.0.5"}),K=performance.now()-t;return s("complete",1,{message:"Done"}),{image:L,mask:P,elapsedMs:K}}let b=0;for(let w=0;w<sn;w++)_[w]!==0&&b++;if(b===0){const w=`brainchopc: categorical foreground is 0/${sn} voxels; segmentation is empty`;throw r(w),new $e("inference-failed",w,n)}try{Lo(_)}catch(w){const x=w instanceof Error?w.message:String(w);throw r(`brainchopc: ${x}`),new $e("inference-failed",x,n)}let g;if(e.legacyCleanup){const w=new es,[x]=w.bwlabel(_,Ft,6,!1,!1),P=Math.max(1e5,Math.floor(sn*.01));if(x>P){const k=`brainchopc: categorical segmentation is excessively fragmented (${x} six-connected regions, cap ${P})`;throw r(k),new $e("inference-failed",k,n)}g=ts(_,Ft,!1)}else{const w=new es,[x,P]=w.bwlabel(_,Ft,6,!1,!1),k=Math.max(1e5,Math.floor(sn*.01));if(x>k){const S=`brainchopc: categorical segmentation is excessively fragmented (${x} six-connected regions, cap ${k})`;throw r(S),new $e("inference-failed",S,n)}if(o==="mindsnap"){const[,S]=w.filterHierarchicalFromLabels(_,x,P,Ft,"all",!0,!0,qa,!0);g=S instanceof Uint8Array?S:new Uint8Array(S)}else{const[,S]=w.filter18ClassFromLabels(_,x,P,Ft,Wa,!0,null,!0);g=S instanceof Uint8Array?S:new Uint8Array(S)}}s("reslice",.93,{message:e.saveConform?"Encoding conformed NIfTI":"Reslicing labels to native space"});let v;if(e.saveConform)v=bn(l.header,g,{dims:Ft,pixDims:[1,1,1],affine:m.affine,datatypeCode:Le.UINT8,sclSlope:1,sclInter:0,calMin:0,calMax:0,intentCode:Zn,descrip:"6.0.5"});else{if(!qn(l.header.stoXyz)){const x="brainchopc: cannot reslice to the input grid; its sform is not a usable spatial transform";throw r(x),new $e("bad-input",x,n)}let w;Pr(Ft,m.affine,z,l.header.stoXyz)?w=g:w=Qn({srcImg:g,srcDims:Ft,srcAffine:Sn(m.affine),dstDims:z,dstAffine:Sn(l.header.stoXyz),isLabel:!0,labelOutputType:"uint8"}).img,v=bn(l.header,w,{dims:z,affine:l.header.stoXyz,preservePixDims:[l.header.pixDims[1],l.header.pixDims[2],l.header.pixDims[3]],datatypeCode:Le.UINT8,sclSlope:1,sclInter:0,calMin:0,calMax:0,intentCode:Zn,descrip:"6.0.5"})}const M=performance.now()-t;return s("complete",1,{message:"Done"}),{image:v,elapsedMs:M}}async function Va(e){const t=performance.now(),n=[],r=R=>{n.push(R),e.onLog?.(R)},s=Ys(e.onProgress),o=on(e.model),i=e.timeoutMs??Ds,a=Math.min(i,Vs);s("load",0,{message:`Loading ${o} weights`});const f=Xs(e.model,e.assetPath,a,n);let l;try{l=Vr(e.input)}catch(R){throw await f.catch(()=>{}),new $e("bad-input",R instanceof Error?R.message:String(R),n)}s("conform",.15,{message:"Conforming volume to 256^3"});let m;try{m=Qr({img:l.data,datatypeCode:l.header.datatypeCode,dims:l.header.dims,affine:l.header.affine,sclSlope:l.header.sclSlope,sclInter:l.header.sclInter,toRAS:!1,isLinear:!0,asFloat32:!1,fHigh:Xr,ct:!!e.ct,comply:!!e.comply})}catch(R){throw await f.catch(()=>{}),new $e("bad-input",R instanceof Error?R.message:String(R),n)}const d=m.img;s("conform",.25),s("preprocess",.25,{message:"Computing intensity quantiles"});const{qmin:c,qmax:u}=rs(d,.05,.95),p=c,y=u-c>0?u-c:1,$=Wo(d,p,y);s("preprocess",.3);const h=await f,_=await Zs({canonical:o,model:e.model,weightBytes:h,conformedImg:d,normOffset:p,normRange:y,normClamp:!1,tissueMode:!0,device:e.device,webgpuMode:e.webgpuMode,timeoutMs:i,log:n,record:r,reportProgress:s});if(_.length!==3){const R=`brainchopc: CAT-lite expected 3 tissue priors, got ${_.length}`;throw r(R),new $e("inference-failed",R,n)}const z=_.map(R=>R instanceof Float32Array?R:Float32Array.from(R));Sr(z[0],"GM",n,r),Sr(z[1],"WM",n,r),Sr(z[2],"CSF",n,r),s("postprocess",.85,{message:"Fitting CAT-lite partial-volume tissues"});const{tissues:b,stats:g}=No(z,$,Ft,Ta);g.applied&&g.tissueMeans&&g.tissueSigmas?r(`[CAT-lite] means CSF=${g.tissueMeans.csf.toFixed(3)} GM=${g.tissueMeans.gray.toFixed(3)} WM=${g.tissueMeans.white.toFixed(3)}; sigmas CSF=${g.tissueSigmas.csf.toFixed(3)} GM=${g.tissueSigmas.gray.toFixed(3)} WM=${g.tissueSigmas.white.toFixed(3)}`):g.applied||r(`[CAT-lite] skipped: ${g.reason??"unknown"}`);const[v,M,w]=b,x=new Float32Array(sn);for(let R=0;R<sn;R++)x[R]=v[R]+M[R];s("reslice",.93,{message:e.saveConform?"Encoding conformed tissue maps":"Reslicing tissue maps to native space"});const P=[l.header.dims[1],l.header.dims[2],l.header.dims[3]];if(!e.saveConform&&!qn(l.header.stoXyz)){const R="brainchopc: cannot reslice to the input grid; its sform is not a usable spatial transform";throw r(R),new $e("bad-input",R,n)}const k=!e.saveConform&&Pr(Ft,m.affine,P,l.header.stoXyz),S=R=>{if(e.saveConform)return bn(l.header,Ks(R),{dims:Ft,pixDims:[1,1,1],affine:m.affine,datatypeCode:Le.UINT8,sclSlope:1/255,sclInter:0,calMin:0,calMax:1,intentCode:Yn,descrip:"6.0.5"});const A=k?Ks(R):Qn({srcImg:R,srcDims:Ft,srcAffine:Sn(m.affine),dstDims:P,dstAffine:Sn(l.header.stoXyz),isLabel:!1,isProbability:!0}).img;return bn(l.header,A,{dims:P,affine:l.header.stoXyz,preservePixDims:[l.header.pixDims[1],l.header.pixDims[2],l.header.pixDims[3]],datatypeCode:Le.UINT8,sclSlope:1/255,sclInter:0,calMin:0,calMax:1,intentCode:Yn,descrip:"6.0.5"})},F=S(v),L=S(M),K=S(w),W=S(x),C=performance.now()-t;return s("complete",1,{message:"Done"}),{gm:F,wm:L,csf:K,brain:W,elapsedMs:C}}var Ar={mindgrab:{name:"mindgrab",colormap:Cn.mindgrab,description:"skull stripping in any modality",outputKind:"mask",capabilities:{ct:!0,comply:!0,saveConform:!1,mask:!0,border:!0}},"mindmap-fast":{name:"mindmap-fast",colormap:Cn["mindmap-fast"],description:"18-class brain segmentation (16-channel, MindMap-Fast v3.5)",outputKind:"labels",capabilities:{ct:!0,comply:!0,saveConform:!0,mask:!1,border:!1}},"16chan18cls":{name:"16chan18cls",colormap:Cn["16chan18cls"],description:"18-class brain segmentation (16-channel, alias for mindmap-fast)",outputKind:"labels",capabilities:{ct:!0,comply:!0,saveConform:!0,mask:!1,border:!1}},mindmap:{name:"mindmap",colormap:Cn.mindmap,description:"18-class brain segmentation (24-channel, MindMap-18 v4.0 Gold)",outputKind:"labels",capabilities:{ct:!0,comply:!0,saveConform:!0,mask:!1,border:!1}},mindsnap:{name:"mindsnap",colormap:Cn.mindsnap,description:"104-class Desikan-Killiany parcellation (24-channel, MindSnap-104 v4.0 Gold)",outputKind:"labels",capabilities:{ct:!0,comply:!0,saveConform:!0,mask:!1,border:!1}}};function Ln(e,t,n){throw new $e("unsupported-option",`${e} does not support \`${t}\`: ${n}`)}function Ha(e){const t=Object.hasOwn(Ar,e.model)?Ar[e.model]:void 0;if(!t)throw new $e("unsupported-option",`unknown model '${e.model}'; expected one of ${Object.keys(Ar).join(", ")}`);const n=on(e.model);if(!e.assetPath&&!Object.hasOwn(In,e.model)&&!Object.hasOwn(In,n))throw new $e("unsupported-option",`${e.model} is not in this entry point; import '@brainchop/mindgrab' or '@brainchop/mindgrab/${e.model}'`);const r=[];e.ct&&r.push("--ct"),e.comply&&r.push("--comply"),e.legacyCleanup&&(t.outputKind!=="labels"&&Ln(e.model,"legacyCleanup","this compatibility option is only for label models"),r.push("--legacy-cleanup")),e.saveConform&&(t.capabilities.saveConform||Ln(e.model,"saveConform","its output is the input image with non-brain voxels floored, so it is inherently in the input space"),r.push("--save-conform")),e.borderMm!==void 0&&!t.capabilities.border&&Ln(e.model,"borderMm","a mask border is only meaningful for a mask model"),e.mask&&!t.capabilities.mask&&Ln(e.model,"mask","a brain mask is only meaningful for a mask model");let s;if((e.mask||e.borderMm!==void 0)&&(s="/mask.nii",r.push("--mask",s)),e.borderMm!==void 0){if(!Number.isFinite(e.borderMm)||e.borderMm<0)throw new $e("unsupported-option",`borderMm must be a non-negative number, got ${e.borderMm}`);r.push("--border",String(e.borderMm))}return{args:r,maskPath:s}}async function Xa(e,t,n=!1){if(typeof Worker>"u")throw new $e("unsupported-option","this environment has no Worker; run with worker: false");const r=t.assetPath?new Worker(Wn("./worker.js",t.assetPath),{type:"module"}):new Worker(self.location.href,{type:"module"}),{device:s,glContext:o,onLog:i,onProgress:a,worker:f,...l}=t;l.assetPath!==void 0&&(l.assetPath=Wn("",l.assetPath));let m;try{return await new Promise((d,c)=>{r.onmessage=y=>{const $=y.data;if($.type==="log"){i?.($.line);return}if($.type==="progress"){a?.($.event);return}if($.type==="done"){d({image:$.image,mask:$.mask,tissues:$.tissues,elapsedMs:$.elapsedMs,backend:$.backend});return}c(new $e($.code,$.message,$.log))},r.onerror=y=>c(new $e("inference-failed",`the segmentation worker failed to start or threw: ${y.message??"unknown"}`)),r.onmessageerror=()=>c(new $e("inference-failed","the segmentation worker sent a message that could not be deserialized"));const u=t.backend&&t.backend!=="auto"?t.backend:null,p=t.timeoutMs??(u&&u!=="cpu"?12e4:Or);m=setTimeout(()=>c(new $e("inference-failed",`the segmentation did not finish within ${p} ms`)),p),r.postMessage({input:e,options:l,tissueMode:n})})}finally{clearTimeout(m),r.terminate()}}async function Ya(e){const t=e.backend&&e.backend!=="auto"?e.backend:null;if(e.device&&t&&t!=="webgpu")throw new $e("unsupported-option",`backend: '${t}' was requested but a GPUDevice was supplied; a device selects the webgpu backend. Drop the device, or drop the backend.`);if(e.glContext&&t&&t!=="webgl2")throw new $e("unsupported-option",`backend: '${t}' was requested but a WebGL2RenderingContext was supplied; a context selects the webgl2 backend. Drop the glContext, or drop the backend.`);if(e.device){const a=Vn,{maxStorageBufferBindingSize:f,maxBufferSize:l}=e.device.limits;if(f<a||l<a)throw new $e("device-too-small",`the supplied device allows ${Math.round(f/1048576)} MiB per storage binding and ${Math.round(l/1048576)} MiB per buffer, but WebGPU V4 needs at least ${Math.round(a/1048576)} MiB. Acquire one with acquireDevice('${e.model}').`);return{backend:"webgpu",device:e.device,ownsContext:!1}}if(e.glContext)return{backend:"webgl2",glContext:e.glContext,ownsContext:!1};const n=e.backend??"auto";if(n==="webgpu")return(await Ur(e.model)).supported||await Lr(e.model),{backend:"webgpu",ownsContext:!1};if(n==="webgl2")return{backend:"webgl2",glContext:Xn(),ownsContext:!0};if(n==="cpu"){const a=js();if(!a.supported)throw new $e("no-webgpu",`the cpu backend cannot run here: ${a.reasons.join("; ")}`);return{backend:"cpu",ownsContext:!1}}const r=await Ur(e.model);if(r.supported&&!r.software)return{backend:"webgpu",ownsContext:!1};const s=ro(e.model);if(s.supported&&s.software===!1)return{backend:"webgl2",glContext:Xn(),ownsContext:!0};const o=js();if(o.supported)return{backend:"cpu",ownsContext:!1};if(s.supported&&!s.software)return{backend:"webgl2",glContext:Xn(),ownsContext:!0};const i="a software rasteriser, too slow and unreliable to run; make the page cross-origin isolated so the cpu backend can";throw new $e("no-webgpu",`no backend can run here.
  WebGPU: ${r.supported?i:r.reasons.join("; ")}
  WebGL2: ${s.supported?i:s.reasons.join("; ")}
  CPU:    ${o.reasons.join("; ")}`)}function js(){const e=[];return typeof SharedArrayBuffer>"u"?e.push("this environment has no SharedArrayBuffer"):globalThis.crossOriginIsolated!==!0&&e.push("this page is not cross-origin isolated; serve it with Cross-Origin-Opener-Policy: same-origin and Cross-Origin-Embedder-Policy: require-corp"),{supported:e.length===0,reasons:e}}async function Za(e,t){return Qs(e,t,!1)}async function Ka(e,t){const n=await Qs(e,t,!0);if(!n.tissues)throw new $e("inference-failed","missing tissue outputs");return{tissues:n.tissues,elapsedMs:n.elapsedMs,backend:n.backend,ranInWorker:n.ranInWorker}}async function Qs(e,t,n){const r=e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength);if(r.byteLength===0)throw new $e("bad-input","the input is empty");const{args:s,maskPath:o}=Ha(t);if(n){const h=on(t.model);(h!=="mindmap"&&h!=="mindmap-fast"||t.mask||t.borderMm||t.legacyCleanup)&&Ln(t.model,"tissue fractions","requires an 18-class model without mask or categorical cleanup options"),s.push("--pve")}if(t.worker&&(t.device||t.glContext))throw new $e("unsupported-option","worker cannot be combined with device or glContext: a GPUDevice and a WebGL2RenderingContext belong to the thread that created them and cannot cross into a worker");if(t.worker){const h=await Xa(r,t,n),_={image:h.image,elapsedMs:h.elapsedMs,backend:h.backend,ranInWorker:!0};return h.mask&&(_.mask=h.mask),h.tissues&&(_.tissues=h.tissues),_}const i=oo(r),a=i?await ao(r):r,f=t.gzipOutput??i,{backend:l,device:m,glContext:d,ownsContext:c}=await Ya(t),u=async h=>(f?await io(h):h).slice().buffer;if(l==="webgpu"){const h={model:t.model,input:a,device:m,ct:t.ct,comply:t.comply,saveConform:t.saveConform,legacyCleanup:t.legacyCleanup,noTurbo:t.noTurbo,mask:t.mask,borderMm:t.borderMm,assetPath:t.assetPath,timeoutMs:t.timeoutMs,webgpuMode:t.webgpuMode,onLog:t.onLog,onProgress:t.onProgress};if(n){const b=await Va(h),[g,v,M,w]=await Promise.all([u(b.gm),u(b.wm),u(b.csf),u(b.brain)]);return{image:g,tissues:{gm:g,wm:v,csf:M,brain:w},elapsedMs:b.elapsedMs,backend:"webgpu",ranInWorker:!1}}const _=await Da(h),z={image:await u(_.image),elapsedMs:_.elapsedMs,backend:"webgpu",ranInWorker:!1};return _.mask&&(z.mask=await u(_.mask)),z}t.onProgress?.({stage:"load",progress:0,message:`Loading ${l} module`});let p;try{p=await mo({model:t.model,backend:l,glContext:d,input:a,args:t.noTurbo?[...s,"--no-turbo"]:s,primaryOutput:n?"/out_gm.nii":void 0,extraOutputs:n?["/out_wm.nii","/out_csf.nii","/out_brain.nii"]:o?[o]:[],assetPath:t.assetPath,timeoutMs:t.timeoutMs,onLog:t.onLog})}finally{c&&d&&so(d)}t.onProgress?.({stage:"complete",progress:1,message:"Done"});const y={image:await u(p.image),elapsedMs:p.elapsedMs,backend:l,ranInWorker:!1},$=o?p.extras.get(o):void 0;if($&&(y.mask=await u($)),n){const h=p.extras.get("/out_wm.nii"),_=p.extras.get("/out_csf.nii"),z=p.extras.get("/out_brain.nii");if(!h||!_||!z)throw new $e("inference-failed","missing WM/CSF/brain output");y.tissues={gm:y.image,wm:await u(h),csf:await u(_),brain:await u(z)}}return y}return self.onmessage=async e=>{const t=(n,r=[])=>self.postMessage(n,r);try{const n={...e.data.options,onLog:i=>t({type:"log",line:i}),onProgress:i=>t({type:"progress",event:i})},r=e.data.tissueMode?await Ka(e.data.input,n):null,s=r?{...r,image:r.tissues.gm,mask:void 0}:await Za(e.data.input,n),o=[s.image];s.mask&&o.push(s.mask),r&&o.push(r.tissues.wm,r.tissues.csf,r.tissues.brain),t({type:"done",image:s.image,mask:s.mask,tissues:r?.tissues,elapsedMs:s.elapsedMs,backend:s.backend},o)}catch(n){const r=n;t({type:"error",code:r&&r.code||"inference-failed",message:r&&r.message||String(n),log:r&&r.log})}},eo}ja();var Qa=Object.freeze({__proto__:null});export{Qa as _};
