webpackJsonp([0,2],[,,,function(t,e,n){"use strict";var o=n(1),i=n.n(o),a=n(37),r=n(21),s=n.n(r),c=n(24),l=n.n(c),d=n(25),u=n.n(d);i.a.use(a.a),e.a=new a.a({routes:[{path:"/about",name:"about",alias:"/",component:s.a},{path:"/get",name:"get",component:l.a},{path:"/room/:id",name:"room",component:u.a},{path:"/room",redirect:"/room/undefined"}]})},function(t,e,n){n(18);var o=n(0)(n(6),n(34),null,null);t.exports=o.exports},function(t,e,n){var o=n(19),i=n(36);t.exports={props:{width:{type:[String,Number],default:"100%"},height:{type:[String,Number],default:"100%"},code:{type:String,default:"// code \n"},srcPath:{type:String},language:{type:String,default:"javascript"},theme:{type:String,default:"vs-dark"},options:{type:Object,default:function(){}},highlighted:{type:Array,default:function(){return[{number:0,class:""}]}},changeThrottle:{type:Number,default:0}},mounted:function(){this.fetchEditor()},destroyed:function(){this.destroyMonaco()},computed:{style:function(){var t=this.width,e=this.height,n=t.toString().indexOf("%")!==-1?t:t+"px",o=e.toString().indexOf("%")!==-1?e:e+"px";return{width:n,height:o}},editorOptions:function(){return Object.assign({},this.defaults,this.options,{value:this.code,language:this.language,theme:this.theme})}},data:function(){return{defaults:{selectOnLineNumbers:!0,roundedSelection:!1,readOnly:!1,cursorStyle:"line",automaticLayout:!1,glyphMargin:!0}}},watch:{highlighted:{handler:function(t){this.highlightLines(t)},deep:!0}},methods:{highlightLines:function(t){var e=this;this.editor&&t.forEach(function(t){var n=t.class,o=e.$el.querySelector("."+n);o&&o.classList.remove(n);var i=parseInt(t.number);if(!(!e.editor&&i<1||isNaN(i))){var a=e.$el.querySelector('.view-lines [linenumber="'+i+'"]');a&&a.classList.add(n)}})},editorHasLoaded:function(t,e){var n=this;this.editor=t,this.monaco=e,this.editor.onDidChangeModelContent(function(e){return n.codeChangeHandler(t,e)}),this.$emit("mounted",t)},codeChangeHandler:function(t){this.codeChangeEmitter?this.codeChangeEmitter(t):(this.codeChangeEmitter=o(function(t){this.$emit("codeChange",t)},this.changeThrottle),this.codeChangeEmitter(t))},fetchEditor:function(){i.load(this.srcPath,this.createMonaco)},createMonaco:function(){this.editor=window.monaco.editor.create(this.$el,this.editorOptions),this.editorHasLoaded(this.editor,window.monaco)},destroyMonaco:function(){"undefined"!=typeof this.editor&&this.editor.dispose()}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"app",created:function(){"room"==this.$route.name&&(this.lastRoom=this.$route.path.replace("/room/",""))},methods:{handleGotoSubmit:function(t){this.$router.push({name:"room",params:{id:this.idInput}}),this.lastRoom=this.idInput,this.idInput=""},isRoute:function(t){return this.$route.name==t}},data:function(){return{idInput:"",lastRoom:""}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"about",data:function(){return{}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(35),i=n.n(o);e.default={name:"room",props:["editorLang","editorCode","editorMounted"],data:function(){return{}},components:{MonacoEditor:i.a},methods:{editorHeight:function(){return.9*window.outerHeight}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(26),i=n.n(o);e.default={name:"fileTree",props:["data"],components:{Tree:i.a},data:function(){return{}},methods:{}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"get",data:function(){return{}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(22),i=n.n(o),a=n(23),r=n.n(a);e.default={name:"room",data:function(){return{treeData:{name:"My Tree",children:[{name:"hello"},{name:"wat"},{name:"child folder",children:[{name:"child folder",children:[{name:"hello"},{name:"wat"}]},{name:"hello"},{name:"wat"},{name:"child folder",children:[{name:"hello"},{name:"wat"}]}]}]}}},components:{Editor:i.a,FileTree:r.a},methods:{editorMounted:function(){}}}},function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={name:"tree",props:{model:Object,selected:Boolean},data:function(){return{open:!1}},computed:{isFolder:function(){return this.model.children&&this.model.children.length}},methods:{toggle:function(){this.isFolder&&(this.open=!this.open)},changeType:function(){this.isFolder||(Vue.set(this.model,"children",[]),this.addChild(),this.open=!0)}}}},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},function(t,e){},,function(t,e,n){var o=n(0)(n(5),n(32),null,null);t.exports=o.exports},function(t,e,n){n(14);var o=n(0)(n(7),n(29),"data-v-27320f80",null);t.exports=o.exports},function(t,e,n){var o=n(0)(n(8),n(27),null,null);t.exports=o.exports},function(t,e,n){n(16);var o=n(0)(n(9),n(31),null,null);t.exports=o.exports},function(t,e,n){n(13);var o=n(0)(n(10),n(28),"data-v-1b47a989",null);t.exports=o.exports},function(t,e,n){n(17);var o=n(0)(n(11),n(33),"data-v-5fb0c290",null);t.exports=o.exports},function(t,e,n){n(15);var o=n(0)(n(12),n(30),"data-v-294113db",null);t.exports=o.exports},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("MonacoEditor",{attrs:{height:t.editorHeight(),language:t.editorLang,code:t.editorCode,options:{readOnly:!0,fontSize:18,automaticLayout:!0}},on:{mounted:t.editorMounted,codeChange:function(){}}})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;t._self._c||e;return t._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"col-md-8 col-md-offset-2"},[n("h1",[t._v("Stream Your Hack in TWO steps")]),t._v(" "),n("ol",[n("li",[n("i",{staticClass:"glyphicon glyphicon-download-alt"}),n("a",{attrs:{href:""}},[t._v("get")]),t._v(" the plugin")]),t._v(" "),n("li",[n("i",{staticClass:"glyphicon glyphicon-link"}),t._v("tap this this that and get an unique url")])]),t._v(" "),n("p",[t._v("\n      Now share your hack with anyone. Changes, Git, File, Webcam will be available by default\n    ")])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement;t._self._c||e;return t._m(0)},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"hello"},[n("h1",[t._v("Stream Your Hack")]),t._v(" "),n("p",[t._v("by kind guys from Takefive")]),t._v(" "),n("p",[t._v("Support us on DevPost")])])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("li",{class:{"file-icon":!t.isFolder,"folder-icon":t.isFolder,open:t.isFolder&&t.open,selected:t.model.selected}},[n("span",{on:{click:t.toggle}},[t._v("\n    "+t._s(t.model.name)+"\n  ")]),t._v(" "),t.isFolder?n("ul",{directives:[{name:"show",rawName:"v-show",value:t.open,expression:"open"}]},t._l(t.model.children,function(t){return n("tree",{staticClass:"item",attrs:{model:t}})})):t._e()])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"wrap"},[n("ul",t._l(t.data,function(t){return n("tree",{staticClass:"item",attrs:{model:t,selected:!1}})}))])},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{style:t.style})},staticRenderFns:[]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return"undefined"==t.$route.params.id?n("div",{staticClass:"col-md-offset-7 col-md-4 get-a-room"},[t._m(0)]):n("div",{staticClass:"col-sm-12 left-big"},[n("section",{staticClass:"big"},[n("editor",{attrs:{editorMounted:t.editorMounted}})],1),t._v(" "),n("section",[n("file-tree",{attrs:{data:t.treeData}})],1),t._v(" "),n("section")])},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("h1",[t._v("\n    Go get a room\n     \n    "),n("i",{staticClass:"glyphicon glyphicon-menu-up"})])}]}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"col-md-10 col-md-offset-1",attrs:{id:"app"}},[n("nav",{staticClass:"navbar navbar-default"},[n("div",{staticClass:"container-fluid"},[t._m(0),t._v(" "),n("div",[n("ul",{staticClass:"nav navbar-nav navbar-right"},[n("li",{class:{active:t.isRoute("get")}},[n("a",{attrs:{href:"#/get"}},[t._v("\n              Get\n            ")])]),t._v(" "),n("li",{class:{active:t.isRoute("about")}},[n("a",{attrs:{href:"#/about"}},[t._v("\n              About\n            ")])]),t._v(" "),n("li",{class:{active:t.isRoute("room")}},[n("a",{attrs:{href:"#/room/"+t.lastRoom}},[t._v("\n              Room  \n              "),t.isRoute("room")&&t.lastRoom.length?n("code",[t._v("\n                "+t._s(t.lastRoom)+"\n              ")]):t._e()])]),t._v(" "),n("li",[n("form",{staticClass:"navbar-form navbar-left",on:{submit:t.handleGotoSubmit}},[n("div",{staticClass:"form-group"},[n("input",{directives:[{name:"model",rawName:"v-model",value:t.idInput,expression:"idInput"}],staticClass:"form-control",attrs:{type:"text",placeholder:"goto"},domProps:{value:t.idInput},on:{input:function(e){e.target.composing||(t.idInput=e.target.value)}}})])])])])])])]),t._v(" "),n("div",{staticClass:"body"},[n("router-view")],1)])},staticRenderFns:[function(){var t=this,e=t.$createElement,n=t._self._c||e;return n("div",{staticClass:"navbar-header"},[n("a",{staticClass:"navbar-brand",attrs:{href:"#/about"}},[t._v("\n          STFH   \n          "),n("i",[t._v("Stream the Fucking Hack")])])])}]}},,,,,function(t,e,n){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var o=n(1),i=n.n(o),a=n(4),r=n.n(a),s=n(3);new i.a({el:"#app",router:s.a,template:"<App/>",components:{App:r.a}}),function(){var t=!1;return function(e){(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(e)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(e.substr(0,4)))&&(t=!0)}(navigator.userAgent||navigator.vendor||window.opera),t}()&&alert("It might not work well on mobile.")}],[39]);
//# sourceMappingURL=app.513400b7feba3cfcce9f.js.map