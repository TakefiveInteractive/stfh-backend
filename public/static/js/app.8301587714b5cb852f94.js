webpackJsonp([0,2],[,,,function(e,t,n){"use strict";var o=n(1),i=n.n(o),a=n(41),r=n(23),s=n.n(r),c=n(26),l=n.n(c),d=n(27),u=n.n(d);i.a.use(a.a),t.a=new a.a({routes:[{path:"/about",name:"about",alias:"/",component:s.a},{path:"/get",name:"get",component:l.a},{path:"/room/:id",name:"room",component:u.a},{path:"/room",redirect:"/room/undefined"}]})},function(e,t,n){n(19);var o=n(0)(n(6),n(37),null,null);e.exports=o.exports},function(e,t,n){var o=n(21),i=n(40);e.exports={props:{width:{type:[String,Number],default:"100%"},height:{type:[String,Number],default:"100%"},code:{type:String,default:"// code \n"},srcPath:{type:String},language:{type:String,default:"javascript"},theme:{type:String,default:"vs-dark"},options:{type:Object,default:function(){}},highlighted:{type:Array,default:function(){return[{number:0,class:""}]}},changeThrottle:{type:Number,default:0}},mounted:function(){this.fetchEditor()},destroyed:function(){this.destroyMonaco()},computed:{style:function(){var e=this.width,t=this.height,n=e.toString().indexOf("%")!==-1?e:e+"px",o=t.toString().indexOf("%")!==-1?t:t+"px";return{width:n,height:o}},editorOptions:function(){return Object.assign({},this.defaults,this.options,{value:this.code,language:this.language,theme:this.theme})}},data:function(){return{defaults:{selectOnLineNumbers:!0,roundedSelection:!1,readOnly:!1,cursorStyle:"line",automaticLayout:!1,glyphMargin:!0}}},watch:{highlighted:{handler:function(e){this.highlightLines(e)},deep:!0}},methods:{highlightLines:function(e){var t=this;this.editor&&e.forEach(function(e){var n=e.class,o=t.$el.querySelector("."+n);o&&o.classList.remove(n);var i=parseInt(e.number);if(!(!t.editor&&i<1||isNaN(i))){var a=t.$el.querySelector('.view-lines [linenumber="'+i+'"]');a&&a.classList.add(n)}})},editorHasLoaded:function(e,t){var n=this;this.editor=e,this.monaco=t,this.editor.onDidChangeModelContent(function(t){return n.codeChangeHandler(e,t)}),this.$emit("mounted",e)},codeChangeHandler:function(e){this.codeChangeEmitter?this.codeChangeEmitter(e):(this.codeChangeEmitter=o(function(e){this.$emit("codeChange",e)},this.changeThrottle),this.codeChangeEmitter(e))},fetchEditor:function(){i.load(this.srcPath,this.createMonaco)},createMonaco:function(){this.editor=window.monaco.editor.create(this.$el,this.editorOptions),this.editorHasLoaded(this.editor,window.monaco)},destroyMonaco:function(){"undefined"!=typeof this.editor&&this.editor.dispose()}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"app",created:function(){"room"==this.$route.name&&(this.lastRoom=this.$route.path.replace("/room/",""))},methods:{handleGotoSubmit:function(e){this.$router.push({name:"room",params:{id:this.idInput}}),this.lastRoom=this.idInput,this.idInput=""},isRoute:function(e){return this.$route.name==e}},data:function(){return{idInput:"",lastRoom:""}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"about",data:function(){return{}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(39),i=n.n(o);t.default={name:"room",props:["editorLang","editorCode","editorMounted"],data:function(){return{}},components:{MonacoEditor:i.a},methods:{editorHeight:function(){return.9*window.outerHeight}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(29),i=n.n(o);t.default={name:"fileTree",props:["data"],components:{Tree:i.a},data:function(){return{}},methods:{}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"get",data:function(){return{}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(24),i=n.n(o),a=n(25),r=n.n(a),s=n(28),c=n.n(s);t.default={name:"room",data:function(){return{treeData:{name:"My Tree",children:[{name:"hello"},{name:"wat"},{name:"child folder",children:[{name:"child folder",children:[{name:"hello"},{name:"wat"}]},{name:"hello"},{name:"wat"},{name:"child folder",children:[{name:"hello"},{name:"wat"}]}]}]}}},components:{Editor:i.a,FileTree:r.a,Vidcam:c.a},methods:{editorMounted:function(){}}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"vidcam",props:["roomId"],data:function(){return{}},mounted:function(){var e=this.roomId;this.$nextTick(function(){var t=new Peer({host:"stfh.rocks",path:"/peer",port:"80",debug:3}),n=document.querySelector("video");t.on("connection",function(e){console.log("On connection",e)}),t.on("open",function(n){console.log("My ID ",n);var o=e;console.log("peerID",o);t.connect(o)}),t.on("call",function(e){console.log("on call",e),e.answer(),e.on("stream",function(e){n.src=URL.createObjectURL(e)})})})}}},function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default={name:"tree",props:{model:Object,selected:Boolean},data:function(){return{open:!1}},computed:{isFolder:function(){return this.model.children&&this.model.children.length}},methods:{toggle:function(){this.isFolder&&(this.open=!this.open)},changeType:function(){this.isFolder||(Vue.set(this.model,"children",[]),this.addChild(),this.open=!0)}}}},function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t){},function(e,t){},,function(e,t,n){var o=n(0)(n(5),n(35),null,null);e.exports=o.exports},function(e,t,n){n(15);var o=n(0)(n(7),n(32),"data-v-27320f80",null);e.exports=o.exports},function(e,t,n){var o=n(0)(n(8),n(30),null,null);e.exports=o.exports},function(e,t,n){n(17);var o=n(0)(n(9),n(34),null,null);e.exports=o.exports},function(e,t,n){n(14);var o=n(0)(n(10),n(31),"data-v-1b47a989",null);e.exports=o.exports},function(e,t,n){n(18);var o=n(0)(n(11),n(36),"data-v-5fb0c290",null);e.exports=o.exports},function(e,t,n){n(20);var o=n(0)(n(12),n(38),"data-v-e9f9cd8a",null);e.exports=o.exports},function(e,t,n){n(16);var o=n(0)(n(13),n(33),"data-v-294113db",null);e.exports=o.exports},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("MonacoEditor",{attrs:{height:e.editorHeight(),language:e.editorLang,code:e.editorCode,options:{readOnly:!0,fontSize:18,automaticLayout:!0}},on:{mounted:e.editorMounted,codeChange:function(){}}})},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c||t;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"col-md-8 col-md-offset-2"},[n("h1",[e._v("Stream Your Hack in TWO steps")]),e._v(" "),n("ol",[n("li",[n("i",{staticClass:"glyphicon glyphicon-download-alt"}),n("a",{attrs:{href:""}},[e._v("get")]),e._v(" the plugin")]),e._v(" "),n("li",[n("i",{staticClass:"glyphicon glyphicon-link"}),e._v("tap this this that and get an unique url")])]),e._v(" "),n("p",[e._v("\n      Now share your hack with anyone. Changes, Git, File, Webcam will be available by default\n    ")])])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement;e._self._c||t;return e._m(0)},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"hello"},[n("h1",[e._v("Stream Your Hack")]),e._v(" "),n("p",[e._v("by kind guys from Takefive")]),e._v(" "),n("p",[e._v("Support us on DevPost")])])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("li",{class:{"file-icon":!e.isFolder,"folder-icon":e.isFolder,open:e.isFolder&&e.open,selected:e.model.selected}},[n("span",{on:{click:e.toggle}},[e._v("\n    "+e._s(e.model.name)+"\n  ")]),e._v(" "),e.isFolder?n("ul",{directives:[{name:"show",rawName:"v-show",value:e.open,expression:"open"}]},e._l(e.model.children,function(e){return n("tree",{staticClass:"item",attrs:{model:e}})})):e._e()])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"wrap"},[n("ul",e._l(e.data,function(e){return n("tree",{staticClass:"item",attrs:{model:e,selected:!1}})}))])},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{style:e.style})},staticRenderFns:[]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return"undefined"==e.$route.params.id?n("div",{staticClass:"col-md-offset-7 col-md-4 get-a-room"},[e._m(0)]):n("div",{staticClass:"col-sm-12 left-big"},[n("section",{staticClass:"big"},[n("editor",{attrs:{editorMounted:e.editorMounted}})],1),e._v(" "),n("section",[n("file-tree",{attrs:{data:e.treeData}})],1),e._v(" "),n("section",[n("vidcam",{attrs:{roomId:e.roomId}})],1)])},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("h1",[e._v("\n    Go get a room\n     \n    "),n("i",{staticClass:"glyphicon glyphicon-menu-up"})])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"col-md-10 col-md-offset-1",attrs:{id:"app"}},[n("nav",{staticClass:"navbar navbar-default"},[n("div",{staticClass:"container-fluid"},[e._m(0),e._v(" "),n("div",[n("ul",{staticClass:"nav navbar-nav navbar-right"},[n("li",{class:{active:e.isRoute("get")}},[n("a",{attrs:{href:"#/get"}},[e._v("\n              Get\n            ")])]),e._v(" "),n("li",{class:{active:e.isRoute("about")}},[n("a",{attrs:{href:"#/about"}},[e._v("\n              About\n            ")])]),e._v(" "),n("li",{class:{active:e.isRoute("room")}},[n("a",{attrs:{href:"#/room/"+e.lastRoom}},[e._v("\n              Room  \n              "),e.isRoute("room")&&e.lastRoom.length?n("code",[e._v("\n                "+e._s(e.lastRoom)+"\n              ")]):e._e()])]),e._v(" "),n("li",[n("form",{staticClass:"navbar-form navbar-left",on:{submit:e.handleGotoSubmit}},[n("div",{staticClass:"form-group"},[n("input",{directives:[{name:"model",rawName:"v-model",value:e.idInput,expression:"idInput"}],staticClass:"form-control",attrs:{type:"text",placeholder:"goto"},domProps:{value:e.idInput},on:{input:function(t){t.target.composing||(e.idInput=t.target.value)}}})])])])])])])]),e._v(" "),n("div",{staticClass:"body"},[n("router-view")],1)])},staticRenderFns:[function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"navbar-header"},[n("a",{staticClass:"navbar-brand",attrs:{href:"#/about"}},[e._v("\n          STFH   \n          "),n("i",[e._v("Stream the Fucking Hack")])])])}]}},function(e,t){e.exports={render:function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("video",{attrs:{autoplay:"true"}})},staticRenderFns:[]}},,,,,function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=n(1),i=n.n(o),a=n(4),r=n.n(a),s=n(3);new i.a({el:"#app",router:s.a,template:"<App/>",components:{App:r.a}}),function(){var e=!1;return function(t){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(t)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(t.substr(0,4)))&&(e=!0)}(navigator.userAgent||navigator.vendor||window.opera),e}()&&alert("It might not work well on mobile.")}],[43]);
//# sourceMappingURL=app.8301587714b5cb852f94.js.map