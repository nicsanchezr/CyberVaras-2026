/* CyberVaras 2026 · generador de diplomas y badges (cliente) */
/* ---------- datos ---------- */
var EVENT_URL = "https://2026.cybervaras.xyz";
var TEAMS = {
  "LosNoNames":{m:["Rodrigo Martínez Becker","Diego Ramírez","Matías Nazal"],rank:1,award:"Campeón",note:"Campeón · 23 first bloods",mention:""},
  "sudo rm -rf /*":{m:["Lucas Arcos","Sebastián Carrasco"],rank:2,award:"2.º lugar",note:"",mention:""},
  "ARKA":{m:["Magara"],rank:3,award:"3.º lugar",note:"",mention:""},
  "HireUsPls":{m:["Felipe Willson","Jorge Vergara","Fernando Villalon"],rank:4,award:"Top 10",note:"",mention:"Rey del First Blood"},
  "eskibidisigmas":{m:["Ariel catalán","Pedro philimon","Mauricio ahumada"],rank:5,award:"Top 10",note:"",mention:"Mejor equipo novato"},
  "L1m1nal-N3tw0rk":{m:["Daniel Cordero","Fernando Gomez","Fabian Palma"],rank:6,award:"Top 10",note:"",mention:"Mejor equipo de región"},
  "Kernel Panic":{m:["Martin Mora","Juan Pizarro","Leandro Pedraza"],rank:7,award:"Top 10",note:"",mention:""},
  "SudoMamis":{m:["Lucero","Ignacia","Angie"],rank:8,award:"Top 10",note:"",mention:""},
  "Los Son of krippy":{m:["Franco Alejandro Clarke Gonzalez","Cristopher Jesus Muñoz Alvial","Jordan Enrique Toloza Muñoz"],rank:9,award:"Top 10",note:"",mention:""},
  "auth":{m:["Francisca Barrera","Felipe Ahumada","Francisca Carrasco"],rank:10,award:"Top 10",note:"",mention:""},
  "M1sh":{m:["Alan Santana Miranda"],rank:null,award:"Participante",note:"",mention:""},
  "Operacion Dora":{m:["Estefania Ramos","Alvaro Rivera"],rank:null,award:"Participante",note:"",mention:""},
  "NFIG":{m:["Nicolas Figueroa"],rank:null,award:"Participante",note:"",mention:""},
  "Black":{m:["Maria Paz Lobos"],rank:null,award:"Participante",note:"",mention:""},
  "los sudo rm -rf":{m:["Antonio Suazo","Cesar Salvo","Matias Guajardo"],rank:null,award:"Participante",note:"",mention:""},
  "paarthurnax":{m:["Pablo Alexander Rico Rodriguez"],rank:null,award:"Participante",note:"",mention:""},
  "Cybeer":{m:["Vicente"],rank:null,award:"Participante",note:"",mention:""},
  "Sekhmet":{m:["Lilian Zapata"],rank:null,award:"Participante",note:"",mention:""},
  "Pinky promise":{m:["Alejandra Nuñez Masafierro","Anais Riquelme Zambrano","Belen Rodriguez Parra"],rank:null,award:"Participante",note:"",mention:""},
  "She_Wins":{m:["Chiguin"],rank:null,award:"Participante",note:"",mention:""},
  "hoxtxnDev":{m:["Horacio"],rank:null,award:"Participante",note:"",mention:""},
  "sudo_win":{m:["Massimo Navarrete","Vincent Farenden","Valentina Saavedra"],rank:null,award:"Participante",note:"",mention:""},
  "MotoSploit":{m:["Nicolas Vergara Herlitz","Guillermo araneda"],rank:null,award:"Participante",note:"",mention:""},
  "00x":{m:["Martina Norambuena"],rank:null,award:"Participante",note:"",mention:""},
  "BitBandits":{m:["Max Saavedra Lagos","Matias Briceño"],rank:null,award:"Participante",note:"",mention:""},
  "las_ellas":{m:["Camila","Alejandrina"],rank:null,award:"Participante",note:"",mention:""},
  "FireStarter":{m:["Gonzalo"],rank:null,award:"Participante",note:"",mention:""},
  "Black and White":{m:["Camilo Torres"],rank:null,award:"Participante",note:"",mention:""},
  "Stein":{m:["Veronica Cereceda"],rank:null,award:"Participante",note:"",mention:""},
  "&> /dev/null":{m:["Leonel Briones"],rank:null,award:"Participante",note:"",mention:""},
  "KernelPanic":{m:["Aron Orlando Acevedo Navarrete"],rank:null,award:"Participante",note:"",mention:""},
  "bmo":{m:["Carolina Moreno","Catalina Correa"],rank:null,award:"Participante",note:"",mention:""},
  "losAntiPala":{m:["Mauro Flores","Pedro Gonzalez","Millaray Elgueta"],rank:null,award:"Participante",note:"",mention:""},
  "0x400804838f":{m:["Esteban"],rank:null,award:"Participante",note:"",mention:""},
  "kosmo":{m:["Guerben"],rank:null,award:"Participante",note:"",mention:""},
  "3DMENTIONAL":{m:["Benjamín Moreno","Matías Baez","Maximiliano León"],rank:null,award:"Participante",note:"",mention:""},
  "Ghost Hook":{m:["Marco jaramillo"],rank:null,award:"Participante",note:"",mention:""},
  "Fondo_de_Bikini":{m:["Leonard Hernández","Julian Naranjo","Sebastian Trejo"],rank:null,award:"Participante",note:"",mention:""},
  "HeXen":{m:["Sebastian","Nicolas","Jeison"],rank:null,award:"Participante",note:"",mention:""},
  "CrazyPP":{m:["Fabián Soto"],rank:null,award:"Participante",note:"",mention:""},
  "hanSolo":{m:["Antonio Jara"],rank:null,award:"Participante",note:"",mention:""},
  "Ositos_Recargado":{m:["Jose Miguel Rivera","Belen Varela","Sebastian Gallardo"],rank:null,award:"Participante",note:"",mention:""}
};
/* equipos sin ningún reto resuelto (0 puntos, según el backup de CTFd): no reciben diploma ni badge */
var NOSCORE = {"NFIG":1,"Black":1,"FireStarter":1,"Black and White":1,"&> /dev/null":1,"KernelPanic":1,"Fondo_de_Bikini":1,"CrazyPP":1,"Ositos_Recargado":1};
var SEDE = {"LosNoNames": "San Carlos de Apoquindo", "sudo rm -rf /*": "Alameda", "ARKA": "Viña del Mar", "HireUsPls": "Maipú", "eskibidisigmas": "Antonio Varas", "L1m1nal-N3tw0rk": "Viña del Mar", "Kernel Panic": "Viña del Mar", "SudoMamis": "San Carlos de Apoquindo", "Los Son of krippy": "Concepción", "auth": "Concepción", "hoxtxnDev": "Concepción", "00x": "Concepción", "Sekhmet": "Otra", "3DMENTIONAL": "Concepción", "losAntiPala": "Puente Alto", "los sudo rm -rf": "Maipú", "sudo_win": "San Carlos de Apoquindo", "0x400804838f": "Viña del Mar", "hanSolo": "Concepción", "Ghost Hook": "San Carlos de Apoquindo", "Stein": "Concepción", "Pinky promise": "Viña del Mar", "paarthurnax": "Antonio Varas", "MotoSploit": "San Joaquín", "BitBandits": "Viña del Mar", "M1sh": "San Bernardo", "Cybeer": "Maipú", "HeXen": "Nacimiento", "kosmo": "Alameda", "Operacion Dora": "Antonio Varas", "las_ellas": "Alameda", "bmo": "Antonio Varas", "She_Wins": "Valparaíso", "NFIG": "Antonio Varas", "Black": "Antonio Varas", "FireStarter": "Concepción", "Black and White": "Concepción", "&> /dev/null": "Viña del Mar", "KernelPanic": "Antonio Varas", "Fondo_de_Bikini": "San Carlos de Apoquindo", "CrazyPP": "Maipú", "Ositos_Recargado": "Maipú"};
var TOP10 = ["LosNoNames","sudo rm -rf /*","ARKA","HireUsPls","eskibidisigmas","L1m1nal-N3tw0rk","Kernel Panic","SudoMamis","Los Son of krippy","auth"];

/* ---------- mapa correo (SHA-256) -> {nombre, equipo}. No se expone ningun correo en claro. ---------- */
var EMAILMAP = {
"a90bc575a8b73c1ca532ffaf639275fe385b80900f6222be5fe4b7e66c08df09":{n:"Alan Santana Miranda",t:"M1sh"},
"febfca654f21670594fbd7a60643c0ca4ca3401bbc9ffdb42f7510dd9c4c5a6c":{n:"Estefania Ramos",t:"Operacion Dora"},
"bfe5b82bc9e76b1b498fb4e56dc799f64abf8601f6b8379317f3e8e582c5f090":{n:"Alvaro Rivera",t:"Operacion Dora"},
"fd9abdc2f98fdfebd1bc40b288d1312c22a779591906965bdf8582ad469c5f1a":{n:"Nicolas Figueroa",t:"NFIG"},
"1eb87b5ae9588e2b048bc7c8b8640b22ee48e65ced282129851785711af19ed7":{n:"Maria Paz Lobos",t:"Black"},
"d9fcc93e4a1cdcf9eaeaa4e9426a500027f2ad0ca544d3e70005e9da4d5ab2a5":{n:"Antonio Suazo",t:"los sudo rm -rf"},
"fb05dd6c05e8d8c27f0beb712e55032c18ec284452989b66a0d0a9ca2f2a77ac":{n:"Cesar Salvo",t:"los sudo rm -rf"},
"97781d31d8d64fcc5abd0e621ccdcaf4665f0d676b1f25d9063f98609923c813":{n:"Matias Guajardo",t:"los sudo rm -rf"},
"cdb210a5b071d1a4cfba1699e2eca49dfd508ad45ecbed32bced3da7f6fb27bf":{n:"Pablo Alexander Rico Rodriguez",t:"paarthurnax"},
"e7c378e48659a81a4f8447402967731e0c414dc804de87bedcb98096e619fa45":{n:"Lucas Arcos",t:"sudo rm -rf /*"},
"77308eef73d5d879dfbe54f588d38543109f318a60ad343871410df4e060725e":{n:"Sebastián Alejandro Carrasco Acevedo",t:"sudo rm -rf /*"},
"938c8dcb15305e7ac5138e7e32f941df0607142803a63de529033e8484bcac06":{n:"Francisca Barrera",t:"auth"},
"2ad6b753f98c5c31ab6b49699c2e10b2efc1e53b5f50011bd734b1462ea3ec66":{n:"Felipe Andrés Ahumada Silva",t:"auth"},
"a12cee48875bcd5f70b3c9663542df04c5eaa0fe6fd58b9fae3deef11180a40b":{n:"Francisca Carrasco",t:"auth"},
"c517bee1fa5abacf68647f674e645d149f3b2d50841133964f44d205ea51726d":{n:"Vicente",t:"Cybeer"},
"e318531b7c805511d8c14746f93987d5fb3a3d1e0048ceae711012f9a7175ca2":{n:"Lilian Zapata",t:"Sekhmet"},
"f8635c3a1a914ae53018219b0a1b3a6de119216c1fb739325ccd7f58997aafd3":{n:"Alejandra Nuñez Masafierro",t:"Pinky promise"},
"57c648f3612afde66b40b4a20a33e852f733c1e07d84c89cd4aa33cc0429e72b":{n:"Anais Riquelme Zambrano",t:"Pinky promise"},
"322f5e591cce6b080140f66b5884f49bb6f88b3f1a58a3724d2c8d4d13e6dfc8":{n:"Belen Rodriguez Parra",t:"Pinky promise"},
"c51ecc302e9943ee16b114e27cfb872ce063d6a23bacc438b490d8778f626386":{n:"Martín Mora",t:"Kernel Panic"},
"9988b80d6615c7ec1942fc942f6057c70adaa63b63164ac415d8fefa2ae5c930":{n:"Juan Pizarro",t:"Kernel Panic"},
"24dd61571c7856049977bf93c3ae27518d99d4c44b3585550b341658c4bebd34":{n:"Leandro Pedraza",t:"Kernel Panic"},
"dd25e5ad3e2fb968c85e3db9726acdb7200ed2ff10d232f5018844dec88ddb4b":{n:"Chiguin",t:"She_Wins"},
"cd9d1b7119b9a43db8d6c661765150a186bea28a6eb7209a174423d26306bc69":{n:"Horacio",t:"hoxtxnDev"},
"8930436a000166944114ca1b348337fdf5ede1fc201391c9f38f3bf1b04f1216":{n:"Daniel Cordero",t:"L1m1nal-N3tw0rk"},
"d9a84199085c6db63d36254f66d9ef07557b9cfe8f58dc5b6d8a01fa6c64da32":{n:"Fernando Alonso Gómez Solís",t:"L1m1nal-N3tw0rk"},
"1889a8879d13045b41ae31f484af6dcaaaa424a09ead063b99971bff7145994a":{n:"Fabián Palma",t:"L1m1nal-N3tw0rk"},
"907809f28ef6c3c3d91af2d875be9e37423d3a640d1b875bea4b8e17fbb5b9bf":{n:"Massimo Navarrete",t:"sudo_win"},
"da5bee33259dd11f9c655a71c7b714e7cb3ee3df894f226940ab065afc38f78f":{n:"Vincent Farenden",t:"sudo_win"},
"f44f9a094ddb42e98b3675984ca586a2587ccfc648bf3067f01e1e0c7586c0f4":{n:"Valentina Saavedra",t:"sudo_win"},
"2b35df3035998950b289a5b8c2d107c4baaeb528546a3398cfb370fae8265f07":{n:"Magara",t:"ARKA"},
"e96d9fe7e42374a5fb2a4f3dc2b26162ae48b3d58a81c0cdfff89fd5e1ec7f22":{n:"Nicolas Vergara Herlitz",t:"MotoSploit"},
"a57901cff01e376ce539ce9410b584b5b353e08e1455fb9a08e560ca73aef282":{n:"Guillermo araneda",t:"MotoSploit"},
"f3a6b7f271b7a874c5f628db7522dedb8c4a99567a3c7c40b861571b5841854e":{n:"Martina Norambuena",t:"00x"},
"5545f79c171f38c6e801a9bb740b1aa411cde496ccb6c8d15c7fa59c35c9165b":{n:"Max Saavedra Lagos",t:"BitBandits"},
"2f2089516052e57119e91f27e124cb4c5af44f5dd7e9165df910975693b79495":{n:"Matias Briceño",t:"BitBandits"},
"1d03cde2043a6296825e965edf69727fb59e7f4654f83522c7fb09a321c66d8c":{n:"Camila",t:"las_ellas"},
"e1200f232729d318eb1a992020bf6702278e64b377f9f2fe7fd0ffd42d8f5d77":{n:"Alejandrina",t:"las_ellas"},
"b20bd8b8b47223c0f389d7faed12ebe4a4c5abfb83c1b0d3f236dc289dd725a3":{n:"Ariel Catalán Madariaga",t:"eskibidisigmas"},
"cb83287c2db4f476e5211a83c677c7bef0d9e4091ff91e1d9c4a46364792caa3":{n:"Pedro Pablo Philimon Zúñiga",t:"eskibidisigmas"},
"e290ba86c50509e6b82feb905d9cef6906dd624a21d075f382a01c6034ca4188":{n:"Mauricio Ahumada",t:"eskibidisigmas"},
"44fa1e21f745119eeea80095f8e0dcf1d7868dacd899a771458e21b14e438ad7":{n:"Rodrigo Martínez Becker",t:"LosNoNames"},
"abaa2bee6d1e01c2c92d322e04f92022952bf88680b75a12f20d9524b7898d5c":{n:"Diego Ramírez Muñoz",t:"LosNoNames"},
"c866b7e6d7d04f6d8f48d643a85c9d10c448486b7aacc3dfb3e49e24ca696b91":{n:"Matías Nazal",t:"LosNoNames"},
"0681ac0d473b9466cdac44cde58cc2bcb4d297364f407ee43a34027f944dd040":{n:"Felipe Andrés Willson Méndez",t:"HireUsPls"},
"7a66483c3679e6937d9fa26bf640df9d505bb6879ae86831b5ff04fac5e156dd":{n:"Jorge Vergara Stuardo",t:"HireUsPls"},
"c38c97d00d2177bc7e1e5c88a9d61e101c8c7bb309d481a5b9feea4bc571af2a":{n:"Fernando Javier Villalón Fuentes",t:"HireUsPls"},
"f2dd6b4a92b49ffa689b31384d04485e7b55a2782bd4ef52fee528d8f350aa11":{n:"Gonzalo",t:"FireStarter"},
"052d56bc3f138e86d86b6d1e5ccbbdbf59cee3a4ae8f9b6d4d3028c3534d9114":{n:"Camilo Torres",t:"Black and White"},
"30077c74c27c26ed034428836428c6c19cf0c8bf15dd5fab6c22ea0903953259":{n:"Veronica Cereceda",t:"Stein"},
"674de8252e764896810c7264e3033699f40b6530d3c970feeeb3df2508f8be49":{n:"Leonel Briones",t:"&> /dev/null"},
"fe65a00f8ab1a53514da527dc32350546f80901f3f2722f93f67de643bf2b71b":{n:"Lucero",t:"SudoMamis"},
"37d9feebe3777bdbc4c0ece145b4e02395aa4437835022785d0b6299c36205ee":{n:"Ignacia Antonia Cavedo Palma",t:"SudoMamis"},
"b849a58853105a952f0d561be78e672043d515600e7c44f2b7df042d08453098":{n:"Angie",t:"SudoMamis"},
"6f69e52b82107557b15f0ba7cb83072ab97913d37fbb67407fe9bc3784d1a7a7":{n:"Aron Orlando Acevedo Navarrete",t:"KernelPanic"},
"62ecda0a693b35efc22849534fa503a50475d59f7d81042f70f18ad5fd9f2bf2":{n:"Carolina Moreno",t:"bmo"},
"58ccc4148a8a9bcae69a37c6e5da841310459c3d96e2e520134650148e24f119":{n:"Catalina Correa",t:"bmo"},
"3806b14caa17531996bf9d3bedd33553e5316ab5dedc818adcd9b9dcb86f5128":{n:"Mauro Flores",t:"losAntiPala"},
"3dae96f0b26ee12387b8440895c6ddae09ba1e3c88d5f4fbae23b09251f670b8":{n:"Pedro Gonzalez",t:"losAntiPala"},
"5092e81b2f729f4ea5eb02b8d61666cf29879635edf3f1f16ebe00fa70162e33":{n:"Millaray Elgueta",t:"losAntiPala"},
"fb235a2df4832e2e7b2d60b3deb8b450468c94a2e3c8c478ff2626ac8b6e0b1c":{n:"Esteban",t:"0x400804838f"},
"ed10025a4297084fad43ae4351e70275588fe38d6b18bd682a05357147763be8":{n:"Guerben",t:"kosmo"},
"a5ed54a77d25bf841aa0845eeaacfce9eeecea96bfd14b0c16750c8e50791432":{n:"Benjamín Moreno",t:"3DMENTIONAL"},
"f887e7f213be329184c729c1fcb5be1c15a1a340708e5f78c675ed22328cd26e":{n:"Matías Baez",t:"3DMENTIONAL"},
"df7a2be90554aa0f853b7801c95426249b2d45eca249924626ab14ab5e4f51cc":{n:"Maximiliano León",t:"3DMENTIONAL"},
"2f6f876d61cbfd4cdb51a098dbdecba97da3312b789ff04168a970c1cd4b0a56":{n:"Marco jaramillo",t:"Ghost Hook"},
"7f74778b42f19ad2510e7af1a30a060dc8b43dc555535305fe744a1edeb031cc":{n:"Leonard Hernández",t:"Fondo_de_Bikini"},
"77b07de1d43d2c8a8f36f59fd3d1f89c0c4d962908f8c6f28d9caa6f3ab0daf0":{n:"Julian Naranjo",t:"Fondo_de_Bikini"},
"864ac9715dc4ef3cf2f9892ce2c0135c9f778e5504f39897d4fd0e9f4ea3cbd7":{n:"Sebastian Trejo",t:"Fondo_de_Bikini"},
"5e6e313eb2078c77c90d413a2930489806f9efb7ff6f0dc3baefc1e9e28184cf":{n:"Sebastian",t:"HeXen"},
"f2e8609187b4f825db1aef5e5a7fbe50e5b5b9b9f8662f1d983afd090d4fa262":{n:"Nicolas",t:"HeXen"},
"f2d4a50b5b0087385e97c62d877f5c1cd243ca64d31949bdd3fe119c78ccebfd":{n:"Jeison",t:"HeXen"},
"fb55d8bcf08712e113f142e4c70c9e052fc72c0d50c08e97bac9e77e8844cc75":{n:"Fabián Soto",t:"CrazyPP"},
"337d73cc42c7512dd86c239daaf99a59f609ceb38ebd1fb7a074c1e2469a9446":{n:"Antonio Jara",t:"hanSolo"},
"9d20dd8629101d341bc61261e4c25ff0602325fb435b7cb40e2a99d184f8b6e4":{n:"Franco Alejandro Clarke González",t:"Los Son of krippy"},
"f415e45b121cd35ac0688d790b2db0084511a857d106751625b41647a3e3520d":{n:"Cristopher Jesús Muñoz Alvial",t:"Los Son of krippy"},
"fe60dd200d535fdb9e388aa3c5a7af645aa6eda310341b57aa52a15eba15af73":{n:"Jordan Enrique Toloza Muñoz",t:"Los Son of krippy"},
"93a79994511ce8c719395b33e7e2b707fe9811692012cf4d9e8550fbe4ce4461":{n:"Jose Miguel Rivera",t:"Ositos_Recargado"},
"8a8d2fd1a556749e621187b49a2de4584a464dabe6982962216742d724438b71":{n:"Belen Varela",t:"Ositos_Recargado"},
"cb80d74c2e37f595529e58121d6a43274581ebad34ebd6276f50ef148f39081f":{n:"Sebastian Gallardo",t:"Ositos_Recargado"}
};

/* ---------- verificacion por correo ---------- */
var genBtn=document.getElementById("genBtn"), chip=document.getElementById("resultChip"),
    emailInp=document.getElementById("email"), verifyBtn=document.getElementById("verifyBtn"),
    verifyMsg=document.getElementById("verifyMsg");
var CURRENT=null; // {name, team}

function awardInfo(team){
  var t=TEAMS[team]; var head, line;
  if(t.rank===1){head="Campeón 🏆"; line="se consagró <b>Campeón</b> del Sexto Campeonato CyberVaras 2026, obteniendo el <b>1.<sup>er</sup> lugar</b> entre 42 equipos.";}
  else if(t.rank===2||t.rank===3){head=t.rank+".º lugar "+(t.rank===2?"🥈":"🥉"); line="obtuvo el <b>"+t.rank+".º lugar</b> del Sexto Campeonato CyberVaras 2026, entre 42 equipos.";}
  else if(t.rank){head="Top 10 ("+t.rank+".º)"; line="se ubicó en el <b>Top 10</b> ("+t.rank+".º lugar) del Sexto Campeonato CyberVaras 2026, entre 42 equipos.";}
  else {head="Participante"; line="participó en el <b>Sexto Campeonato CyberVaras 2026</b>, un CTF de 24 horas con 48 retos y 42 equipos.";}
  return {head:head, line:line, mention:t.mention};
}

async function sha256hex(str){
  var buf=await crypto.subtle.digest("SHA-256", new TextEncoder().encode(str));
  return Array.prototype.map.call(new Uint8Array(buf),function(b){return b.toString(16).padStart(2,"0");}).join("");
}
function clearResult(){ CURRENT=null; document.getElementById("nameEdit").hidden=true; chip.style.display="none"; genBtn.disabled=true; document.getElementById("output").style.display="none"; }
function showResult(){
  if(!CURRENT){ chip.style.display="none"; genBtn.disabled=true; return; }
  var a=awardInfo(CURRENT.team), t=TEAMS[CURRENT.team];
  chip.style.display="flex";
  var cls=t.rank&&t.rank<=3?"badge-pill win":"badge-pill";
  chip.innerHTML='<span class="badge-pill">'+CURRENT.name+'</span><span class="badge-pill">equipo '+CURRENT.team+'</span><span class="'+cls+'">'+a.head+'</span>'+(a.mention?'<span class="badge-pill win">'+a.mention+'</span>':'');
  genBtn.disabled=false;
  var inp=document.getElementById("nameInp"), hint=document.getElementById("nameHint");
  inp.value=CURRENT.name;
  var single=CURRENT.name.trim().split(/\s+/).length<2;
  hint.textContent=single
    ? "// tu inscripción solo tiene un nombre. escribe aquí tu nombre completo como quieres que aparezca. si el diploma impreso o entregado en mano quedó distinto, escríbenos a nic.sanchezr@profesor.duoc.cl para corregirlo."
    : "// puedes editar el nombre antes de generar (por ejemplo, para agregar tu segundo apellido). si tu diploma impreso tiene un error, escríbenos a nic.sanchezr@profesor.duoc.cl para corregirlo.";
  document.getElementById("nameEdit").hidden=false;
}
async function verify(){
  var raw=(emailInp.value||"").trim().toLowerCase();
  verifyMsg.className="verifymsg"; clearResult();
  if(!raw){ verifyMsg.textContent=""; return; }
  if(!(window.crypto&&crypto.subtle)){ verifyMsg.className="verifymsg err"; verifyMsg.textContent="Tu navegador no permite verificar aquí (abre la página en https). Escríbenos a nic.sanchezr@profesor.duoc.cl y te ayudamos."; return; }
  verifyMsg.textContent="verificando…";
  try{
    var hit=EMAILMAP[await sha256hex(raw)];
    if(hit){
      if(NOSCORE[hit.t]){
        verifyMsg.className="verifymsg err";
        verifyMsg.textContent="// el diploma y el badge se entregan solo a equipos que resolvieron al menos un reto. Tu equipo ("+hit.t+") no registró puntaje. Si crees que es un error, escríbenos a nic.sanchezr@profesor.duoc.cl.";
        return;
      }
      CURRENT={name:hit.n, team:hit.t};
      verifyMsg.className="verifymsg ok"; verifyMsg.textContent="✓ correo verificado";
      showResult();
    } else {
      verifyMsg.className="verifymsg err"; verifyMsg.textContent="✗ ese correo no aparece entre los inscritos. Usa el mismo con el que te inscribiste (normalmente @duocuc.cl) o escríbenos a nic.sanchezr@profesor.duoc.cl.";
    }
  }catch(e){ verifyMsg.className="verifymsg err"; verifyMsg.textContent="No se pudo verificar. Inténtalo de nuevo."; }
}
verifyBtn.addEventListener("click",verify);
emailInp.addEventListener("keydown",function(e){ if(e.key==="Enter"){ e.preventDefault(); verify(); } });
emailInp.addEventListener("input",function(){ if(CURRENT||verifyMsg.textContent){ clearResult(); verifyMsg.className="verifymsg"; verifyMsg.textContent=""; } });

/* ---------- construir plantillas ---------- */
function fillTemplates(name, team){
  var a=awardInfo(team), t=TEAMS[team];
  var sede=SEDE[team]==="Otra"?"":SEDE[team]; var mt=a.mention;
  var K,T,O,S,B; var ev="<b>Sexto Campeonato CyberVaras 2026</b>";
  if(t.rank&&t.rank<=3){
    var o=t.rank===1?["// <b>1ER LUGAR</b>  STATUS: CHAMPION","CAMPEÓN","1.er","1.º LUGAR"]:t.rank===2?["// <b>2DO LUGAR</b>  STATUS: PODIUM","SEGUNDO LUGAR","2.º","2.º LUGAR"]:["// <b>3ER LUGAR</b>  STATUS: PODIUM","TERCER LUGAR","3.er","3.º LUGAR"];
    K=o[0];T=o[1];S=o[3];O="Se otorga el presente reconocimiento a";
    B="Por obtener el <b>"+o[2]+" lugar</b> del "+ev+", tras 24 horas de competencia y 48 retos.";
  } else if(mt){
    var tails={"Rey del First Blood":"al ser el equipo con más primeras resoluciones de retos.","Mejor equipo novato":"destacando en su primera participación.","Mejor equipo de región":"destacando entre los equipos de sedes de regiones."};
    var nm={"Rey del First Blood":"Rey del First Blood","Mejor equipo novato":"Mejor Equipo Novato","Mejor equipo de región":"Mejor Equipo de Región"}[mt]||mt;
    K="// <b>MENCIÓN HONROSA</b>  STATUS: HONOR_UNLOCKED";T="MENCIÓN HONROSA";S="MENCIÓN HONROSA";O="El Track de Ciberseguridad reconoce a";
    B="Por obtener la distinción «<b>"+nm+"</b>» en el "+ev+", "+(tails[mt]||"")
  } else {
    K="// <b>PARTICIPACIÓN</b>  STATUS: COMPLETED";T="DIPLOMA DE PARTICIPACIÓN";S="PARTICIPANTE";O="Se otorga el presente diploma a";
    B="Por su participación en el "+ev+", competencia de ciberseguridad tipo CTF de 24 horas y 48 retos, desarrollada en entorno controlado y con fines formativos.";
  }
  var ac=(t.rank&&t.rank<=3)||mt?"#B8860B":"#0070C0";
  document.getElementById("certTpl").style.setProperty("--ac",ac);
  document.getElementById("c_kind").innerHTML=K;
  document.getElementById("c_title").textContent=T;
  document.getElementById("c_otorga").textContent=O;
  var fs=S.length>12?6.8:9;
  var svg='<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224" viewBox="0 0 120 120"><circle cx="60" cy="60" r="57" fill="#fff" stroke="#002060" stroke-width="1.5"/><circle cx="60" cy="60" r="50" fill="none" stroke="'+ac+'" stroke-width="5"/><g font-family="Liberation Sans,Arial,Helvetica,sans-serif" font-weight="700" text-anchor="middle"><text x="60" y="46" font-size="10" letter-spacing="1" fill="#002060">CYBERVARAS</text><text x="60" y="66" font-size="22" fill="'+ac+'">2026</text><text x="60" y="82" font-size="'+fs+'" letter-spacing=".8" fill="#002060">'+S+'</text></g></svg>';
  document.getElementById("c_sealImg").src="data:image/svg+xml;charset=utf-8,"+encodeURIComponent(svg);
  document.getElementById("c_name").textContent=name;
  document.getElementById("c_eq").textContent="Equipo: "+team+(sede?" · Sede "+sede:"");
  document.getElementById("c_body").innerHTML=B;
  // badge
  var bw=document.getElementById("b_awrd");
  var awtext = t.rank===1?"CAMPEÓN":(t.rank===2?"2.º LUGAR":(t.rank===3?"3.º LUGAR":(t.rank?"TOP 10":"PARTICIPANTE")));
  if(a.mention) awtext = a.mention.toUpperCase();
  bw.textContent=awtext;
  bw.className="awrd"+((t.rank&&t.rank<=3)||a.mention?" gold":"");
  document.getElementById("b_name").textContent=name;
  document.getElementById("b_team").textContent="equipo "+team;
}
function certName(team){
  var t=TEAMS[team];
  if(t.rank===1) return "CyberVaras 2026 — Campeón";
  if(t.rank===2||t.rank===3) return "CyberVaras 2026 — "+t.rank+".º lugar";
  if(t.rank) return "CyberVaras 2026 — Top 10";
  return "CyberVaras 2026 — Participante";
}

/* ---------- render a imagen ---------- */
var certURL="", badgeURL="";
async function render(){
  await (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve());
  var opt={backgroundColor:null, scale:2, useCORS:true, logging:false};
  var c1=await html2canvas(document.getElementById("certTpl"),opt);
  certURL=c1.toDataURL("image/png");
  document.getElementById("certImg").src=certURL;
  var c2=await html2canvas(document.getElementById("badgeTpl"),opt);
  badgeURL=c2.toDataURL("image/png");
  document.getElementById("badgeImg").src=badgeURL;
}
genBtn.addEventListener("click",async function(){
  if(!CURRENT) return; var name=(document.getElementById("nameInp").value||"").trim()||CURRENT.name, team=CURRENT.team; CURRENT.name=name;
  genBtn.disabled=true; var old=genBtn.textContent; genBtn.textContent="generando…";
  fillTemplates(name,team);
  try{ await document.getElementById("c_sealImg").decode(); }catch(e){}
  try{ await render(); document.getElementById("output").style.display="block";
       document.getElementById("output").scrollIntoView({behavior:"smooth",block:"start"});}
  catch(e){ document.getElementById("output").style.display="block"; }
  genBtn.textContent=old; genBtn.disabled=false;
});

/* ---------- tabs ---------- */
var tabD=document.getElementById("tabD"), tabB=document.getElementById("tabB"),
    paneD=document.getElementById("paneD"), paneB=document.getElementById("paneB");
function sel(d){tabD.setAttribute("aria-selected",d); tabB.setAttribute("aria-selected",!d); paneD.hidden=!d; paneB.hidden=d;}
tabD.addEventListener("click",function(){sel(true);}); tabB.addEventListener("click",function(){sel(false);});
tabD.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();sel(true);}});
tabB.addEventListener("keydown",function(e){if(e.key==="Enter"||e.key===" "){e.preventDefault();sel(false);}});

/* ---------- descargas: en el artifact de claude.ai usa la capacidad 'downloads';
   en el sitio publicado usa la descarga nativa del navegador. Siempre queda, además,
   "guardar imagen como" sobre la imagen. ---------- */
function dataURLtoBlob(u){
  var parts=u.split(","), mime=(parts[0].match(/:(.*?);/)||[])[1]||"image/png",
      bin=atob(parts[1]), n=bin.length, arr=new Uint8Array(n);
  while(n--) arr[n]=bin.charCodeAt(n);
  return new Blob([arr],{type:mime});
}
function nativeDownload(url,fname){ try{var a=document.createElement("a");a.href=url;a.download=fname;document.body.appendChild(a);a.click();a.remove();}catch(e){} }
async function download(url,fname){
  if(!url) return;
  try{
    if(false){
      var d=await claude.use("downloads");
      if(d){ await d.save({filename:fname, data:dataURLtoBlob(url)}); return; }
    }
  }catch(e){ /* viewer canceló o no disponible -> intento nativo */ }
  nativeDownload(url,fname);
}
function slug(){ return ((CURRENT&&CURRENT.name)||"diploma").normalize("NFD").replace(/[̀-ͯ]/g,"").replace(/[^a-zA-Z0-9]+/g,"_"); }
document.getElementById("dlCert").addEventListener("click",function(){ if(certURL) download(certURL,"CyberVaras2026_diploma_"+slug()+".png"); });
document.getElementById("dlBadge").addEventListener("click",function(){ if(badgeURL) download(badgeURL,"CyberVaras2026_badge_"+slug()+".png"); });

/* ---------- LinkedIn ---------- */
document.getElementById("liAdd").addEventListener("click",function(){
  var team=CURRENT&&CURRENT.team; if(!team) return;
  var p=new URLSearchParams({startTask:"CERTIFICATION_NAME",name:certName(team),organizationName:"CITT Duoc UC",issueYear:"2026",issueMonth:"10",certUrl:EVENT_URL+"/#diplomas"});
  window.open("https://www.linkedin.com/profile/add?"+p.toString(),"_blank","noopener");
});
document.getElementById("liShare").addEventListener("click",function(){
  window.open("https://www.linkedin.com/sharing/share-offsite/?url="+encodeURIComponent(EVENT_URL),"_blank","noopener");
});
function getCap(){
  var team=CURRENT&&CURRENT.team, a=team?awardInfo(team):null;
  return "🚩 Participé en el Sexto Campeonato CyberVaras 2026, un CTF de 24 horas organizado por el Track de Ciberseguridad del CITT Duoc UC (Escuela de Informática y Telecomunicaciones)."
    + (a&&TEAMS[team].rank?(" Nuestro equipo "+team+" logró "+(TEAMS[team].rank===1?"el 1.º lugar 🏆":(TEAMS[team].rank+".º lugar"))+"."):"")
    + (a&&a.mention?(" Además recibimos la mención “"+a.mention+"”."):"")
    + " #CyberVaras2026 #Ciberseguridad #CTF #DuocUC #CITT";
}
function copyText(cap,msg,ok){
  if(navigator.clipboard&&navigator.clipboard.writeText){
    navigator.clipboard.writeText(cap).then(function(){msg.textContent=ok;},function(){fallbackCopy(cap,msg);});
  } else fallbackCopy(cap,msg);
}
document.getElementById("copyCap").addEventListener("click",function(){
  copyText(getCap(),document.getElementById("copyMsg"),"✓ Texto copiado. Pégalo en tu publicación y adjunta el badge.");
});
document.querySelectorAll("button.sh").forEach(function(btn){
  btn.addEventListener("click",function(){
    if(!CURRENT) return;
    var n=btn.getAttribute("data-net"), cap=getCap(), u=encodeURIComponent(EVENT_URL), t=encodeURIComponent(cap), msg=document.getElementById("copyMsg"), url=null;
    if(n==="x") url="https://twitter.com/intent/tweet?text="+t+"&url="+u;
    else if(n==="fb") url="https://www.facebook.com/sharer/sharer.php?u="+u+"&quote="+t;
    else if(n==="wa") url="https://wa.me/?text="+encodeURIComponent(cap+" "+EVENT_URL);
    else if(n==="tg") url="https://t.me/share/url?url="+u+"&text="+t;
    if(url){ window.open(url,"_blank","noopener"); msg.textContent="Se abrió la ventana para compartir. Recuerda adjuntar tu badge (descárgalo arriba)."; }
    else copyText(cap,msg,"✓ Texto copiado. Instagram no permite publicar desde la web: abre la app, sube tu badge y pega el texto.");
  });
});
function fallbackCopy(text,msg){
  try{var ta=document.createElement("textarea");ta.value=text;ta.style.position="fixed";ta.style.left="-9999px";document.body.appendChild(ta);ta.select();document.execCommand("copy");ta.remove();msg.textContent="✓ Texto copiado.";}
  catch(e){msg.textContent="Copia este texto: "+text;}
}
