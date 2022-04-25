var p=Object.defineProperty;var C=(e,t,i)=>t in e?p(e,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):e[t]=i;var s=(e,t,i)=>(C(e,typeof t!="symbol"?t+"":t,i),i);const y=function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))o(n);new MutationObserver(n=>{for(const r of n)if(r.type==="childList")for(const d of r.addedNodes)d.tagName==="LINK"&&d.rel==="modulepreload"&&o(d)}).observe(document,{childList:!0,subtree:!0});function i(n){const r={};return n.integrity&&(r.integrity=n.integrity),n.referrerpolicy&&(r.referrerPolicy=n.referrerpolicy),n.crossorigin==="use-credentials"?r.credentials="include":n.crossorigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function o(n){if(n.ep)return;n.ep=!0;const r=i(n);fetch(n.href,r)}};y();var w={backgroundColor:"white",borderColor:"#ddd",borderSize:2,shape:"circle",size:50,textColor:"#222",fontSize:16,hoverBorderSize:2,fontFamily:"Lora",hoverBorderColor:"rgba(120, 118, 240, .6)",hoverBackgroundColor:"white"},b=class{constructor(e,t,i){s(this,"name","node");s(this,"neighbors",[]);s(this,"nodeConfig",{});s(this,"text");s(this,"position");s(this,"movable",!1);s(this,"moveFrom");s(this,"isHovered",!1);s(this,"isSelected",!1);s(this,"mode","normal");s(this,"_borderOffset",0);s(this,"gCost",0);s(this,"parent",null);this.text=e,this.position=t,this.nodeConfig=Object.assign(this.nodeConfig,w),this.nodeConfig=Object.assign(this.nodeConfig,i)}addNeighbor(e,t,i){this.neighbors.find(o=>o.node==e)||this.neighbors.push({node:e,distance:t,line:i})}draw(e){e.beginPath(),e.arc(this.position.x,this.position.y,this.nodeConfig.size+5,0,Math.PI*2),e.strokeStyle=this.nodeConfig.hoverBorderColor,e.fillStyle=this.nodeConfig.hoverBackgroundColor,e.lineWidth=this.nodeConfig.hoverBorderSize,e.setLineDash(this.mode=="connecting"?[50,10]:[0]),e.lineDashOffset=this._borderOffset,this.isHovered&&!this.isSelected&&e.fill(),this.isSelected&&e.stroke(),e.closePath(),e.beginPath(),e.fillStyle=this.nodeConfig.backgroundColor,e.arc(this.position.x,this.position.y,this.nodeConfig.size,0,Math.PI*2),e.strokeStyle=this.nodeConfig.borderColor,e.lineWidth=this.nodeConfig.borderSize,e.stroke(),e.fill(),e.closePath(),e.fillStyle=this.nodeConfig.textColor,e.font=`${this.nodeConfig.fontSize}px ${this.nodeConfig.fontFamily}`,e.textBaseline="middle",e.textAlign="center",e.fillText(this.text,this.position.x,this.position.y)}update(){this._borderOffset++}select(){this.isSelected=!this.isSelected,this.isSelected||(this._borderOffset=0)}move(e,t){e&&(this.position.x=e),t&&(this.position.y=t)}isOnCoordinate(e){return e.x>this.position.x-this.nodeConfig.size&&e.x<=this.position.x+this.nodeConfig.size&&e.y>this.position.y-this.nodeConfig.size&&e.y<=this.position.y+this.nodeConfig.size}},N=()=>({events:{},emit(e,...t){(this.events[e]||[]).forEach(i=>i(...t))},on(e,t){return(this.events[e]=this.events[e]||[]).push(t),()=>this.events[e]=(this.events[e]||[]).filter(i=>i!==t)}});function h(e,t){return Math.sqrt(Math.abs(e.x-t.x)**2+Math.abs(e.y-t.y)**2)}var g={color:"#777",width:5,hoverColor:"rgba(120, 118, 240, .6)",text:""},S=class{constructor(e,t,i){s(this,"name","line");s(this,"moveFrom");s(this,"lineConfig",g);s(this,"from");s(this,"to");s(this,"isHovered",!1);s(this,"isSelected",!1);this.lineConfig=Object.assign(g,i),this.from=e,this.to=t}draw(e){e.strokeStyle=this.lineConfig.color,this.isHovered&&(e.strokeStyle=this.lineConfig.hoverColor),e.lineWidth=this.lineConfig.width,e.beginPath(),e.moveTo(this.from.position.x,this.from.position.y),e.lineTo(this.to.position.x,this.to.position.y),e.stroke(),e.closePath()}isOnCoordinate(e){return Math.ceil(h(this.from.position,e))+Math.ceil(h(this.to.position,e))==Math.ceil(h(this.from.position,this.to.position))+1}move(){}},k={lineColor:"#555",nodeBackground:"white",nodeTextColor:"#555",canvasBackground:"#ccc"},L=class{constructor(e={}){s(this,"canvas");s(this,"ctx");s(this,"nodes",[]);s(this,"dragFrom");s(this,"isDirectedGraph",!1);s(this,"lines",[]);s(this,"selectedNode",[]);s(this,"holdingNode",null);s(this,"mode","normal");s(this,"_hoveredElement",null);s(this,"_emitter",N());s(this,"_runningBorderOffset",0);this.config=e,this.config=Object.assign(k,e),this.mount(e.el)}resolveSelector(e){return typeof e=="string"?document.querySelector(e):e||null}mount(e){if(this.canvas)throw new Error("[graphism] already mounted, unmount previous target first");if(this.canvas=this.resolveSelector(e),!this.canvas)throw new Error("[graphism] target element not found");this.ctx=this.canvas.getContext("2d"),this.canvas.width=this.canvas.clientWidth,this.canvas.height=this.canvas.clientHeight,this.canvas.addEventListener("mousedown",this.mouseDown.bind(this)),this.canvas.addEventListener("mousemove",this.mouseMove.bind(this)),this.canvas.addEventListener("mouseup",this.mouseUp.bind(this)),this.canvas.addEventListener("click",this.mouseClick.bind(this)),this._emitter.emit("mounted"),requestAnimationFrame(()=>this.render())}on(e,t,i=!1){const o=this._emitter.on(e,(...n)=>{i&&o(),t(...n)});return o}generateGraph(){const e=this.createNode("Jakarta",{x:130,y:274}),t=this.createNode("Bandung",{x:390,y:200});this.addNodeNeighbor(t,e,100),this.addNodeNeighbor(e,t,100);const i=[e,t];return this.nodes=i,i}draw(){this.drawBackground(),this.drawLines(),this.drawNodes()}drawLines(){for(let e=0;e<this.lines.length;e++)this.lines[e].draw(this.ctx)}drawNodes(){for(let e=0;e<this.nodes.length;e++)this.nodes[e].draw(this.ctx)}drawBackground(){typeof this.config.canvasBackground=="string"||this.config.canvasBackground instanceof CanvasPattern?(this.ctx.fillStyle=this.config.canvasBackground,this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height)):this.config.canvasBackground instanceof HTMLImageElement&&this.ctx.drawImage(this.config.canvasBackground,0,0,this.canvas.width,this.canvas.height),["creating","connecting"].includes(this.mode)&&(this.ctx.save(),this.ctx.beginPath(),this.ctx.strokeStyle="rgb(120, 118, 240)",this.ctx.rect(0,0,this.canvas.width,this.canvas.height),this.ctx.lineWidth=10,this.ctx.setLineDash([0,25,50]),this.ctx.lineDashOffset=this._runningBorderOffset,this.ctx.stroke(),this.ctx.closePath(),this.ctx.restore())}waitingForClick(){return new Promise(e=>{this.mode="creating",this.canvas.addEventListener("click",t=>{let i=this.getCursorPosition(t);e(i)},{once:!0})})}createNode(e,t,i){let o=new b(e,t,i);return this.nodes.push(o),this._emitter.emit("node:created",o),this.setMode("normal"),this.clearSelectedNode(),console.log("creating new node ",e," at ",t),o}clearSelectedNode(){for(let e=0;e<this.nodes.length;e++)this.nodes[e].isSelected=!1,this.nodes[e].mode="normal",this.nodes[e].movable=!1;this.selectedNode=[],console.log("clearing selected node")}setMode(e){switch(this.mode=e,e){case"connecting":this.clearSelectedNode(),this.on("node:click",t=>{this.on("node:click",i=>{this.addNodeNeighbor(t,i,0),this.clearSelectedNode(),this.mode="normal"},!0)},!0);break}}addNodeNeighbor(e,t,i){let o,n=this.lines.find(r=>r.from==e&&r.to==t||r.from==t&&r.to==e);n?o=n:(o=new S(e,t,{}),this.lines.push(o)),e.addNeighbor(t,i,o),this.isDirectedGraph||t.addNeighbor(e,i,o),this._emitter.emit("node:connect",e,t)}update(){for(let e=0;e<this.nodes.length;e++)this.nodes[e].update();["creating","connecting"].includes(this.mode)&&this._runningBorderOffset++}mouseUp(){this.holdingNode=null,console.log("Mouseup ",this.selectedNode)}mouseDown(e){let t=this.getCursorPosition(e);console.log("mousedown"),this.dragFrom=t;for(let i=0;i<this.nodes.length;i++){let o=this.nodes[i];if(o.isOnCoordinate(t)){this.holdingNode=o,o.moveFrom={x:o.position.x,y:o.position.y};for(let n=0;n<this.selectedNode.length;n++){let r=this.selectedNode[n];r.moveFrom={x:r.position.x,y:r.position.y}}}}}mouseMove(e){let t=this.getCursorPosition(e),i,o=[...this.nodes,...this.lines];if(this._hoveredElement!=null&&(this._hoveredElement.isHovered=!1,this._hoveredElement=null),this.canvas.style.cursor="grab",(i=o.find(d=>d.isOnCoordinate(t)))&&(this.canvas.style.cursor="pointer",this._emitter.emit(`${i.name}:mouseover`,i),this._hoveredElement=i,i.isHovered=!0),!this.nodes.length)return;let n=t.x-this.dragFrom.x,r=t.y-this.dragFrom.y;if(console.log("Move dx = ",n," dy",r),!!this.holdingNode)if(this.selectedNode.length>1&&this.holdingNode.isSelected)for(let d=0;d<this.selectedNode.length;d++)i=this.nodes[d],i.move(i.moveFrom.x+n,i.moveFrom.y+r);else i.move(i.moveFrom.x+n,i.moveFrom.y+r)}mouseClick(e){let t=this.getCursorPosition(e);if(t.x==this.dragFrom.x&&t.y==this.dragFrom.y){this._emitter.emit("canvas:click",t);let i=!1;for(let o=this.nodes.length-1;o>=0;o--){let n=this.nodes[o];if(n.isOnCoordinate(t)){e.ctrlKey||this.clearSelectedNode(),this.selectNode(n,this.mode),i=!0,this._emitter.emit("node:click",n);break}}i||this.clearSelectedNode()}}selectNode(e,t="normal"){e.select(),e.mode=e.isSelected?t:"normal",this.selectedNode.push(e)}getCursorPosition(e){let t=this.canvas.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}render(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height),this.draw(),this.update(),requestAnimationFrame(()=>this.render())}};function E(e){return new L(e)}const u=e=>e.replace(/[A-Z]/g,t=>`-${t.toLowerCase()}`);window.onload=()=>{const e=document.querySelector("#canvas"),t=E({el:e,canvasBackground:"#efefef"});window.addEventListener("resize",z.bind(null,e)),document.getElementById("node-add").addEventListener("click",B.bind(null,t)),document.getElementById("generate-graph").addEventListener("click",M.bind(null,t)),document.getElementById("create-new").addEventListener("click",F),document.getElementById("connectNode").addEventListener("click",O.bind(null,t));let i=_(t,x);q(i)};let x={fontSize:22,fontFamily:"Lora",textColor:"#222",backgroundColor:"white",borderColor:"#ddd",borderSize:2,width:50,height:50,hoverBorderColor:"rgba(120, 118, 240, .6)",hoverBackgroundColor:"white"};function B(e){let t=document.getElementById("name");document.querySelector(".modal-add").classList.remove("modal-open"),m(`Click anywhere to create ${t.value} node`),e.setMode("creating"),e.on("canvas:click",i=>{let o=t?t.value:"";e.createNode(o,i),P("success",`Node ${o} created`),v()},!0)}function O(e){e.setMode("connecting"),m("Click any node to connect"),e.on("node:connect",()=>{v()})}function M(e){const t=e.generateGraph();e.nodes=t,f()}function F(){f()}function f(){document.querySelector(".page-title").classList.toggle("show")}const l=document.getElementById("helper-text");function m(e,t=!0){t&&l.classList.add("blinking"),l.innerText=e,l.classList.add("show")}function v(){l.classList.remove("blinking"),l.classList.remove("show")}function P(e,t,i=2e3){let o=document.createElement("div");o.classList.add("notification"),o.classList.add(`notification-${e}`),o.innerText=t;let n=document.createElement("button"),r=document.createElementNS("http://www.w3.org/2000/svg","svg"),d=document.createElementNS("http://www.w3.org/2000/svg","path");r.setAttribute("width","16"),r.setAttribute("height","16"),d.setAttribute("d","M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"),r.appendChild(d),n.appendChild(r),o.appendChild(n);let a=document.querySelector(".notifications");a.appendChild(o),setTimeout(()=>a.removeChild(o),i),n.addEventListener("click",()=>{a.removeChild(o)},{once:!0})}function z(e){e.width=window.innerWidth,e.height=window.innerHeight,e.setAttribute("width",e.width.toString()),e.setAttribute("height",e.height.toString())}function _(e,t){return new Proxy(t,{set(i,o,n){i[o]=n;let r=document.getElementById(`custom-${u(o)}`);return r.value=n,console.log("Changing: ",e.selectedNode[0]),e.selectedNode[0].nodeConfig[o]=n,!0}})}function q(e){Object.keys(e).forEach(t=>{console.log(`querying: custom-${u(t)}`);let i=document.getElementById(`custom-${u(t)}`);i||(i=document.querySelector(t)),i.addEventListener("input",()=>e[t]=i.value)})}let I=document.querySelectorAll(".modal");I.forEach(e=>{e.querySelector(".modal-close").addEventListener("click",i=>{e.classList.remove("modal-open")})});const A=document.querySelector(".modal-add"),T=document.getElementById("openAddModal");T.addEventListener("click",e=>{A.classList.toggle("modal-open"),console.log("open")});let c=document.querySelectorAll(".sidebar-item");for(let e=0;e<c.length;e++){let t=c[e];t.querySelector(".sidebar-group-icon").addEventListener("click",()=>{c.forEach(i=>i!==t&&i.classList.remove("sidebar-item-open")),t.classList.toggle("sidebar-item-open")})}
