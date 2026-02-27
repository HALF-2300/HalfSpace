"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[5],{5:function(e,t,a){a.r(t),a.d(t,{default:function(){return w}});var o=a(57437),n=a(2265),i=a(36496),r=a(44725),s=a(85903),l=a(1119),c=a(72079),d=a(49074),u=Object.defineProperty,h=(e,t,a)=>t in e?u(e,t,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[t]=a,f=(e,t,a)=>(h(e,"symbol"!=typeof t?t+"":t,a),a);let m=(()=>{let e={uniforms:{turbidity:{value:2},rayleigh:{value:1},mieCoefficient:{value:.005},mieDirectionalG:{value:.8},sunPosition:{value:new c.Pa4},up:{value:new c.Pa4(0,1,0)}},vertexShader:`
      uniform vec3 sunPosition;
      uniform float rayleigh;
      uniform float turbidity;
      uniform float mieCoefficient;
      uniform vec3 up;

      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      // constants for atmospheric scattering
      const float e = 2.71828182845904523536028747135266249775724709369995957;
      const float pi = 3.141592653589793238462643383279502884197169;

      // wavelength of used primaries, according to preetham
      const vec3 lambda = vec3( 680E-9, 550E-9, 450E-9 );
      // this pre-calcuation replaces older TotalRayleigh(vec3 lambda) function:
      // (8.0 * pow(pi, 3.0) * pow(pow(n, 2.0) - 1.0, 2.0) * (6.0 + 3.0 * pn)) / (3.0 * N * pow(lambda, vec3(4.0)) * (6.0 - 7.0 * pn))
      const vec3 totalRayleigh = vec3( 5.804542996261093E-6, 1.3562911419845635E-5, 3.0265902468824876E-5 );

      // mie stuff
      // K coefficient for the primaries
      const float v = 4.0;
      const vec3 K = vec3( 0.686, 0.678, 0.666 );
      // MieConst = pi * pow( ( 2.0 * pi ) / lambda, vec3( v - 2.0 ) ) * K
      const vec3 MieConst = vec3( 1.8399918514433978E14, 2.7798023919660528E14, 4.0790479543861094E14 );

      // earth shadow hack
      // cutoffAngle = pi / 1.95;
      const float cutoffAngle = 1.6110731556870734;
      const float steepness = 1.5;
      const float EE = 1000.0;

      float sunIntensity( float zenithAngleCos ) {
        zenithAngleCos = clamp( zenithAngleCos, -1.0, 1.0 );
        return EE * max( 0.0, 1.0 - pow( e, -( ( cutoffAngle - acos( zenithAngleCos ) ) / steepness ) ) );
      }

      vec3 totalMie( float T ) {
        float c = ( 0.2 * T ) * 10E-18;
        return 0.434 * c * MieConst;
      }

      void main() {

        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vWorldPosition = worldPosition.xyz;

        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        gl_Position.z = gl_Position.w; // set z to camera.far

        vSunDirection = normalize( sunPosition );

        vSunE = sunIntensity( dot( vSunDirection, up ) );

        vSunfade = 1.0 - clamp( 1.0 - exp( ( sunPosition.y / 450000.0 ) ), 0.0, 1.0 );

        float rayleighCoefficient = rayleigh - ( 1.0 * ( 1.0 - vSunfade ) );

      // extinction (absorbtion + out scattering)
      // rayleigh coefficients
        vBetaR = totalRayleigh * rayleighCoefficient;

      // mie coefficients
        vBetaM = totalMie( turbidity ) * mieCoefficient;

      }
    `,fragmentShader:`
      varying vec3 vWorldPosition;
      varying vec3 vSunDirection;
      varying float vSunfade;
      varying vec3 vBetaR;
      varying vec3 vBetaM;
      varying float vSunE;

      uniform float mieDirectionalG;
      uniform vec3 up;

      const vec3 cameraPos = vec3( 0.0, 0.0, 0.0 );

      // constants for atmospheric scattering
      const float pi = 3.141592653589793238462643383279502884197169;

      const float n = 1.0003; // refractive index of air
      const float N = 2.545E25; // number of molecules per unit volume for air at 288.15K and 1013mb (sea level -45 celsius)

      // optical length at zenith for molecules
      const float rayleighZenithLength = 8.4E3;
      const float mieZenithLength = 1.25E3;
      // 66 arc seconds -> degrees, and the cosine of that
      const float sunAngularDiameterCos = 0.999956676946448443553574619906976478926848692873900859324;

      // 3.0 / ( 16.0 * pi )
      const float THREE_OVER_SIXTEENPI = 0.05968310365946075;
      // 1.0 / ( 4.0 * pi )
      const float ONE_OVER_FOURPI = 0.07957747154594767;

      float rayleighPhase( float cosTheta ) {
        return THREE_OVER_SIXTEENPI * ( 1.0 + pow( cosTheta, 2.0 ) );
      }

      float hgPhase( float cosTheta, float g ) {
        float g2 = pow( g, 2.0 );
        float inverse = 1.0 / pow( 1.0 - 2.0 * g * cosTheta + g2, 1.5 );
        return ONE_OVER_FOURPI * ( ( 1.0 - g2 ) * inverse );
      }

      void main() {

        vec3 direction = normalize( vWorldPosition - cameraPos );

      // optical length
      // cutoff angle at 90 to avoid singularity in next formula.
        float zenithAngle = acos( max( 0.0, dot( up, direction ) ) );
        float inverse = 1.0 / ( cos( zenithAngle ) + 0.15 * pow( 93.885 - ( ( zenithAngle * 180.0 ) / pi ), -1.253 ) );
        float sR = rayleighZenithLength * inverse;
        float sM = mieZenithLength * inverse;

      // combined extinction factor
        vec3 Fex = exp( -( vBetaR * sR + vBetaM * sM ) );

      // in scattering
        float cosTheta = dot( direction, vSunDirection );

        float rPhase = rayleighPhase( cosTheta * 0.5 + 0.5 );
        vec3 betaRTheta = vBetaR * rPhase;

        float mPhase = hgPhase( cosTheta, mieDirectionalG );
        vec3 betaMTheta = vBetaM * mPhase;

        vec3 Lin = pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * ( 1.0 - Fex ), vec3( 1.5 ) );
        Lin *= mix( vec3( 1.0 ), pow( vSunE * ( ( betaRTheta + betaMTheta ) / ( vBetaR + vBetaM ) ) * Fex, vec3( 1.0 / 2.0 ) ), clamp( pow( 1.0 - dot( up, vSunDirection ), 5.0 ), 0.0, 1.0 ) );

      // nightsky
        float theta = acos( direction.y ); // elevation --> y-axis, [-pi/2, pi/2]
        float phi = atan( direction.z, direction.x ); // azimuth --> x-axis [-pi/2, pi/2]
        vec2 uv = vec2( phi, theta ) / vec2( 2.0 * pi, pi ) + vec2( 0.5, 0.0 );
        vec3 L0 = vec3( 0.1 ) * Fex;

      // composition + solar disc
        float sundisk = smoothstep( sunAngularDiameterCos, sunAngularDiameterCos + 0.00002, cosTheta );
        L0 += ( vSunE * 19000.0 * Fex ) * sundisk;

        vec3 texColor = ( Lin + L0 ) * 0.04 + vec3( 0.0, 0.0003, 0.00075 );

        vec3 retColor = pow( texColor, vec3( 1.0 / ( 1.2 + ( 1.2 * vSunfade ) ) ) );

        gl_FragColor = vec4( retColor, 1.0 );

      #include <tonemapping_fragment>
      #include <${d.i>=154?"colorspace_fragment":"encodings_fragment"}>

      }
    `},t=new c.jyz({name:"SkyShader",fragmentShader:e.fragmentShader,vertexShader:e.vertexShader,uniforms:c.rDY.clone(e.uniforms),side:c._Li,depthWrite:!1});class a extends c.Kj0{constructor(){super(new c.DvJ(1,1,1),t)}}return f(a,"SkyShader",e),f(a,"material",t),a})();function v(e,t,a=new c.Pa4){let o=2*Math.PI*(t-.5);return a.x=Math.cos(o),a.y=Math.sin(Math.PI*(e-.5)),a.z=Math.sin(o),a}let g=n.forwardRef(({inclination:e=.6,azimuth:t=.1,distance:a=1e3,mieCoefficient:o=.005,mieDirectionalG:i=.8,rayleigh:r=.5,turbidity:s=10,sunPosition:d=v(e,t),...u},h)=>{let f=n.useMemo(()=>new c.Pa4().setScalar(a),[a]),[g]=n.useState(()=>new m);return n.createElement("primitive",(0,l.Z)({object:g,ref:h,"material-uniforms-mieCoefficient-value":o,"material-uniforms-mieDirectionalG-value":i,"material-uniforms-rayleigh-value":r,"material-uniforms-sunPosition-value":d,"material-uniforms-turbidity-value":s,scale:f},u))});function x(){let e=(0,n.useRef)(null),t=new c._12(100,100,128,128),a=t.attributes.position.array;for(let e=0;e<a.length;e+=3){let t=a[e],o=a[e+1],n=Math.sin(.1*t)*Math.cos(.1*o)*2+Math.sin(.05*t)*Math.cos(.05*o)*4;a[e+2]=n}return t.computeVertexNormals(),(0,o.jsx)("mesh",{ref:e,geometry:t,rotation:[-Math.PI/2,0,0],receiveShadow:!0,children:(0,o.jsx)("meshStandardMaterial",{color:"#cd5c5c",roughness:.9,metalness:.1})})}function p(){let e=[];for(let t=0;t<50;t++){let a=(Math.random()-.5)*80,n=(Math.random()-.5)*80,i=.5*Math.random()+.3;e.push((0,o.jsxs)("mesh",{position:[a,i/2,n],castShadow:!0,children:[(0,o.jsx)("boxGeometry",{args:[i,i,i]}),(0,o.jsx)("meshStandardMaterial",{color:"rgb(".concat(180+40*Math.random(),", ").concat(100+30*Math.random(),", ").concat(80+30*Math.random(),")"),roughness:.95})]},t))}return(0,o.jsx)(o.Fragment,{children:e})}function b(e){let{position:t}=e;return(0,o.jsxs)("group",{position:t,children:[(0,o.jsxs)("mesh",{position:[0,.5,0],castShadow:!0,children:[(0,o.jsx)("boxGeometry",{args:[1,.5,1.5]}),(0,o.jsx)("meshStandardMaterial",{color:"#888888",metalness:.8,roughness:.3})]}),(0,o.jsxs)("mesh",{position:[0,.8,0],castShadow:!0,children:[(0,o.jsx)("boxGeometry",{args:[1.5,.05,1]}),(0,o.jsx)("meshStandardMaterial",{color:"#1a1a3a",metalness:.5,roughness:.2})]}),(0,o.jsxs)("mesh",{position:[0,1.2,-.3],castShadow:!0,children:[(0,o.jsx)("cylinderGeometry",{args:[.05,.05,.8,16]}),(0,o.jsx)("meshStandardMaterial",{color:"#cccccc",metalness:.7,roughness:.3})]}),(0,o.jsxs)("mesh",{position:[0,1.6,-.3],castShadow:!0,children:[(0,o.jsx)("boxGeometry",{args:[.3,.2,.2]}),(0,o.jsx)("meshStandardMaterial",{color:"#444444"})]}),[[-.5,.2,-.6],[-.5,.2,.6],[.5,.2,-.6],[.5,.2,.6]].map((e,t)=>(0,o.jsxs)("mesh",{position:e,rotation:[0,0,Math.PI/2],castShadow:!0,children:[(0,o.jsx)("cylinderGeometry",{args:[.2,.2,.15,16]}),(0,o.jsx)("meshStandardMaterial",{color:"#333333",roughness:.9})]},t))]})}function y(e){let{roverPosition:t}=e;return(0,o.jsxs)(o.Fragment,{children:[(0,o.jsx)(r.c,{makeDefault:!0,position:[5,3,5],fov:75}),(0,o.jsx)(s.z,{target:t,enablePan:!1,minDistance:2,maxDistance:20,maxPolarAngle:Math.PI/2-.1,enableDamping:!0}),(0,o.jsx)("ambientLight",{intensity:.3}),(0,o.jsx)("directionalLight",{position:[50,50,50],intensity:1.5,castShadow:!0,"shadow-mapSize-width":2048,"shadow-mapSize-height":2048,"shadow-camera-far":200,"shadow-camera-left":-50,"shadow-camera-right":50,"shadow-camera-top":50,"shadow-camera-bottom":-50,color:"#ffddbb"}),(0,o.jsx)(g,{sunPosition:[50,20,50],turbidity:10,rayleigh:.5,mieCoefficient:.005,mieDirectionalG:.8}),(0,o.jsx)(x,{}),(0,o.jsx)(p,{}),(0,o.jsx)(b,{position:t}),(0,o.jsx)("fog",{attach:"fog",args:["#cd5c5c",30,100]})]})}function w(){let[e,t]=(0,n.useState)(!1),[a,r]=(0,n.useState)([0,0,0]),[s,l]=(0,n.useState)(0),c=e=>{let[t,o,n]=a;switch(e){case"forward":r([t,o,n-.5]);break;case"backward":r([t,o,n+.5]);break;case"left":r([t-.5,o,n]);break;case"right":r([t+.5,o,n])}l(e=>e+.5)};return e?(0,o.jsxs)("div",{className:"relative w-full h-[600px] bg-black rounded-2xl overflow-hidden",children:[(0,o.jsxs)("div",{className:"absolute top-4 left-4 z-20 glass rounded-lg px-6 py-4 space-y-2 text-white",children:[(0,o.jsx)("div",{className:"font-bold text-lg",children:"Mars Rover Control"}),(0,o.jsxs)("div",{className:"text-sm space-y-1",children:[(0,o.jsxs)("div",{children:["Position: ",(0,o.jsxs)("span",{className:"font-mono",children:["(",a[0].toFixed(1),", ",a[2].toFixed(1),")"]})]}),(0,o.jsxs)("div",{children:["Distance: ",(0,o.jsxs)("span",{className:"font-mono",children:[s.toFixed(1),"m"]})]}),(0,o.jsx)("div",{className:"text-xs text-gray-400 mt-2",children:"Use controls to drive the rover"})]})]}),(0,o.jsx)("div",{className:"absolute top-4 right-4 z-20",children:(0,o.jsx)("button",{onClick:()=>t(!1),className:"px-4 py-2 bg-red-600/80 hover:bg-red-600 backdrop-blur-sm rounded-lg text-white font-semibold transition-all",children:"Exit"})}),(0,o.jsx)("div",{className:"absolute bottom-4 left-1/2 -translate-x-1/2 z-20 glass rounded-lg px-6 py-4",children:(0,o.jsxs)("div",{className:"grid grid-cols-3 gap-2",children:[(0,o.jsx)("div",{}),(0,o.jsx)("button",{onClick:()=>c("forward"),className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold",children:"↑"}),(0,o.jsx)("div",{}),(0,o.jsx)("button",{onClick:()=>c("left"),className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold",children:"←"}),(0,o.jsx)("div",{className:"flex items-center justify-center text-white text-sm",children:"Move"}),(0,o.jsx)("button",{onClick:()=>c("right"),className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold",children:"→"}),(0,o.jsx)("div",{}),(0,o.jsx)("button",{onClick:()=>c("backward"),className:"px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white font-bold",children:"↓"}),(0,o.jsx)("div",{})]})}),(0,o.jsx)(i.Xz,{shadows:!0,children:(0,o.jsx)(n.Suspense,{fallback:null,children:(0,o.jsx)(y,{roverPosition:a})})})]}):(0,o.jsxs)("button",{onClick:()=>t(!0),className:"w-full min-h-[300px] bg-gradient-to-br from-red-900/30 via-orange-900/20 to-black backdrop-blur-sm rounded-2xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300 group relative overflow-hidden",children:[(0,o.jsx)("div",{className:"absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(205,92,92,0.3)_0%,rgba(0,0,0,1)_100%)]"}),(0,o.jsxs)("div",{className:"relative z-10 flex flex-col items-center justify-center h-full p-8",children:[(0,o.jsx)("div",{className:"text-6xl mb-4",children:"\uD83D\uDD34"}),(0,o.jsx)("h3",{className:"text-3xl font-bold text-white mb-3",children:"Mars Surface Explorer"}),(0,o.jsx)("p",{className:"text-gray-300 text-lg mb-4",children:"Drive a rover on the Red Planet"}),(0,o.jsx)("div",{className:"px-6 py-3 bg-red-600 rounded-lg text-white font-bold hover:bg-red-500 transition-all",children:"Land on Mars →"})]})]})}},44725:function(e,t,a){a.d(t,{c:function(){return l}});var o=a(1119),n=a(2265),i=a(21276),r=a(72079);let s=e=>"function"==typeof e,l=n.forwardRef(({envMap:e,resolution:t=256,frames:a=1/0,makeDefault:l,children:c,...d},u)=>{let h=(0,i.D)(({set:e})=>e),f=(0,i.D)(({camera:e})=>e),m=(0,i.D)(({size:e})=>e),v=n.useRef(null);n.useImperativeHandle(u,()=>v.current,[]);let g=n.useRef(null),x=function(e,t,a){let o=(0,i.D)(e=>e.size),s=(0,i.D)(e=>e.viewport),l="number"==typeof e?e:o.width*s.dpr,c=o.height*s.dpr,{samples:d=0,depth:u,...h}=("number"==typeof e?void 0:e)||{},f=n.useMemo(()=>{let e=new r.dd2(l,c,{minFilter:r.wem,magFilter:r.wem,type:r.cLu,...h});return u&&(e.depthTexture=new r.$YQ(l,c,r.VzW)),e.samples=d,e},[]);return n.useLayoutEffect(()=>{f.setSize(l,c),d&&(f.samples=d)},[d,f,l,c]),n.useEffect(()=>()=>f.dispose(),[]),f}(t);n.useLayoutEffect(()=>{d.manual||(v.current.aspect=m.width/m.height)},[m,d]),n.useLayoutEffect(()=>{v.current.updateProjectionMatrix()});let p=0,b=null,y=s(c);return(0,i.F)(t=>{y&&(a===1/0||p<a)&&(g.current.visible=!1,t.gl.setRenderTarget(x),b=t.scene.background,e&&(t.scene.background=e),t.gl.render(t.scene,v.current),t.scene.background=b,t.gl.setRenderTarget(null),g.current.visible=!0,p++)}),n.useLayoutEffect(()=>{if(l)return h(()=>({camera:v.current})),()=>h(()=>({camera:f}))},[v,l,h]),n.createElement(n.Fragment,null,n.createElement("perspectiveCamera",(0,o.Z)({ref:v},d),!y&&c),n.createElement("group",{ref:g},y&&c(x.texture)))})},49074:function(e,t,a){a.d(t,{i:function(){return o}});let o=parseInt(a(72079).UZH.replace(/\D+/g,""))}}]);