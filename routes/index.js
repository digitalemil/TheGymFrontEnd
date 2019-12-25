let express = require('express');
let router = express.Router();
const PDFDocument = require('pdfkit');
let manuellemedizin= require("./manuellemedizin");

kurse= manuellemedizin.kurse;
//payments= manuellemedizin.payments;

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: '' });
});

/* GET home kurse. */
router.get('/kurse', function (req, res, next) {
  let ret= new Array();
  kurse.forEach(kurs =>  {
      let n= 0;
      aerzte.forEach(arzt => { if(arzt.hatKursGebucht(kurs)) {
        n++;
      }});
      let k= new Object();
      k.name= kurs.toString();
      k.anmeldungen= n;
      ret.push(k);
    }
  );
  res.send(JSON.stringify(ret));
});

/* GET Home */
router.get('/app/home', function (req, res, next) {
  res.render('home', { title: 'Herzlich Willkommen bei Manuelle Medizin Bayern' , darkmode:global.darkmode});
});

/* GET Arzt. */
router.get('/app/arzt1', function (req, res, next) {
  res.render('arztwaehlen', { aerzte: aerzte, target: "/app/arzt2", title: "Arzt Details", darkmode:global.darkmode });
});

/* GET Kurse fuer Arzt. */
router.get('/app/arzt2', function (req, res, next) {
  let arzt= aerzte.getArztByMail(req.query.arzt);
  let payments= manuellemedizin.getPayments();
  let bezahltekurse= payments[arzt.mail];
  if(bezahltekurse== undefined)
    bezahltekurse= new Array();
  res.render('arzt2', { kurse: kurse, arzt: arzt, bezahltekurse: bezahltekurse, target: "", darkmode:global.darkmode });
});

/* GET Arzt suchen. */
router.get('/app/arztsuchen', function (req, res, next) {
  res.render('suchen', { aerzte: aerzte, target: "/app/arztsuchen2", title: "Arzt suchen", wonach: "Name, e-Mail, Telefonnummer, etc." , darkmode:global.darkmode});
});

/* GET Arzt suchen2. */
router.get('/app/arztsuchen2', function (req, res, next) {
  let resaerzte= new Array();
  let such= req.query.suchstring;

  aerzte.forEach(arzt => {
    if(arzt.getAll().search(such)>-1)
      resaerzte.push(arzt);
    arzt.gebuchteKurse.forEach(kurs => {
      if(kurs.toString().search(such)> -1 && !resaerzte.includes(arzt))
        resaerzte.push(arzt);
    });
    arzt.stornierteKurse.forEach(kurs => {
      if(kurs.toString().search(such)> -1 && !resaerzte.includes(arzt))
        resaerzte.push(arzt);
    });
    arzt.wartelisteKurse.forEach(kurs => {
      if(kurs.toString().search(such)> -1 && !resaerzte.includes(arzt))
        resaerzte.push(arzt);
    });
  });
  let resultate="";
  resaerzte.forEach(arzt => {
    resultate+="<p><a href='arzt2?arzt="+arzt.mail+"'>"+arzt.getAll()+"</a></p>";

  });
  res.render('suchresultate', { title: "Suchergebnisse", resultate:resultate, darkmode:global.darkmode});
});


/* GET Kurs. */
router.get('/app/kurs1', function (req, res, next) {
  res.render('kurswaehlen', { aerzte: aerzte, target: "/app/kurs2" , darkmode:global.darkmode});
});


/* GET Kurse fuer Arzt. */
router.get('/app/kurs2', function (req, res, next) {
  kurs= kurse.getKursForText(req.query.kurs);
  let n=0 ; aerzte.forEach(arzt => { if(arzt.hatKursGebucht(kurs)) { n++;  }});
   console.log("Gebuchte Kurse: "+n);
  res.render('kurs2', { aerzte:aerzte, kurs: kurs, darkmode:global.darkmode});
});

/* GET Kursteilnehmer. */
router.get('/app/kursteilnehmer', function (req, res, next) {
  
  res.render('kursteilnehmer', { rows: kurse , darkmode:global.darkmode});
});

/* GET Zahlung1. */
router.get('/app/zahlung1', function (req, res, next) {
  res.render('arztwaehlen', { aerzte: aerzte, target: "/app/zahlung2", title: "Zahlungseingang von:", darkmode:global.darkmode });
});

/* GET Zahlung2. */
router.get('/app/zahlung2', function (req, res, next) {
  let arzt= aerzte.getArztByMail(req.query.arzt);
  let payments= manuellemedizin.getPayments();
  let bezahltekurse= payments[arzt.mail];
  if(bezahltekurse== undefined)
    bezahltekurse= new Array();
  res.render('zahlung2', { kurse: kurse, arzt: arzt, bezahltekurse: bezahltekurse, target: "", darkmode:global.darkmode });
});

/* GET Zahlung1. */
router.get('/app/unbezahlte1', function (req, res, next) {
  res.render('unbezahlte1', { kurse: kurse, aerzte: aerzte, title: "Unbezahlte Anmeldungen", darkmode:global.darkmode });
});


/* GET Kurs durchfuehren. */
router.get('/app/kursduchfuehrungstarten', function (req, res, next) {
  
  res.render('kursduchfuehrungstarten', { rows: kurse, darkmode:global.darkmode });
});

/* GET kursdurchfuehren. */
router.get('/app/kursdurchfuehren', function (req, res, next) {
  kurs= kurse.getKursForText(req.query.kurs);
  let a= '<table style="width:80%"><tr><th style="text-align:left;">Name</th><th style="text-align:center;">Teilnahme Tag 1</th><th style="text-align:center;">Teilnahme Tag 2</th></tr>';
  aerzte.forEach(element => {
    a+="<tr><td>"+element.toString()+"</td><td style='text-align:center;'><input id='tag1' name='' type='checkbox' style='text-align:center; vertical-align: middle;'> </td>"+"</td><td style='text-align:center;'><input id='tag2' type='checkbox' name='' style='text-align:center; vertical-align: middle;'> </td></tr>";
  });
  res.render('kursdurchfuehren', { aerzte: a, kurs:kurs , darkmode:global.darkmode});
});

/* GET Kurs. */
router.get('/app/registrieren1', function (req, res, next) {
  res.render('kurswaehlen', { aerzte: aerzte, target: "/app/registrieren2", darkmode:global.darkmode });
});

/* GET Teilnahme1 */
router.get('/app/teilnahme1', function (req, res, next) {
  let teilnahme= manuellemedizin.teilnahmemodule.unhashTeilnahme();

  res.render('kurswaehlen', { aerzte: aerzte, target: "/app/teilnahme2", kurse:kurse, darkmode:global.darkmode });
});

/* GET Teilnahme2 */
router.get('/app/teilnahme2', function (req, res, next) {
  kurs= kurse.getKursForText(req.query.kurs);
  res.render('teilnahme2', { aerzte: aerzte, target: "/app/teilnahme3", teilnahme:teilnahme.kurse[kurs], kurs:kurs , darkmode:global.darkmode});
});

/* GET Teilnahme3 */
router.get('/app/teilnahme3', function (req, res, next) {
  let teilnahme= manuellemedizin.getTeilnahme();
  let kurs= req.query.kurs;
  delete req.query["kurs"];
  let kursarray= teilnahme.kurse;
  kursarray[kurs]= {};
  for(var i in req.query) {
    let splits= i.split("@");
    let tag= splits[0];
    let email= splits[1]+"@"+splits[2];
    let value= req.query[i];  
    let a= teilnahme.kurse[kurs][email];
    if(a== undefined) {
      a= email; 
      teilnahme.kurse[kurs][a]= {};
      teilnahme.kurse[kurs][a].mail=a;
    }
    else {
      a= teilnahme.kurse[kurs][a.mail].mail;
    }
    teilnahme.kurse[kurs][a][tag]= value;
  };
  console.log("Teilnahme: "+JSON.stringify(teilnahme));
  manuellemedizin.teilnahmemodule.saveTeilnahme(teilnahme);
  res.render('home', { title: 'Herzlich Willkommen bei Manuelle Medizin Bayern', darkmode:global.darkmode });
});

router.get('/app/registrieren2', function (req, res, next) {
  res.setHeader('content-type', 'application/pdf');

  let doc = new PDFDocument();
  doc.pipe(res);
  
 let kurs= kurse.getKursForText(req.query.kurs);
 doc.fontSize(18);
 doc.text("Bayerisches Ärzteseminar für Manuelle Medizin (BÄSMM)", {
  align: 'center',
  valign: 'center'}); 
  doc.fontSize(12);
 
  doc.text(" ");
 doc.text("Teilnahmedokumentation          Kurs: "+kurs.nummer+"            Datum: "+kurs.getTag(1));
 doc.text(" ");
 doc.text("Name                                        Unterschrift ");
 doc.text(" ");
 
 let r= "";
 let n= 0;
 doc.text(" ");
 aerzte.forEach(arzt => {
   if(arzt.hatKursGebucht(kurs)) {
     doc.text(" ");
    doc.text(arzt.toString());
    doc.text("-------------------------------------------------------------------------------------------------------------------");
  
    n++;
   }
 });
 doc.addPage();
 doc.fontSize(18);
 doc.text("Bayerisches Ärzteseminar für Manuelle Medizin (BÄSMM)", {
  align: 'center',
  valign: 'center'}); 
  doc.fontSize(12);
 
  doc.text(" ");
 doc.text("Teilnahmedokumentation          Kurs: "+kurs.nummer+"            Datum: "+kurs.getTag(2));
 doc.text(" ");
 doc.text("Name                                        Unterschrift ");
 doc.text(" ");
 
 r= "";
 n= 0;
 doc.text(" ");
 aerzte.forEach(arzt => {
   if(arzt.hatKursGebucht(kurs)) {
     doc.text(" ");
    doc.text(arzt.toString());
    doc.text("-------------------------------------------------------------------------------------------------------------------");
  
    n++;
   }
 });
 doc.addPage();
 doc.fontSize(18);
 doc.text("Bayerisches Ärzteseminar für Manuelle Medizin (BÄSMM)", {
  align: 'center',
  valign: 'center'}); 
  doc.fontSize(12);
 
  doc.text(" ");
 doc.text("Teilnahmedokumentation          Kurs: "+kurs.nummer+"            Datum: "+kurs.getTag(3));
 doc.text(" ");
 doc.text("Name                                        Unterschrift ");
 doc.text(" ");
 
 r= "";
 n= 0;
 doc.text(" ");
 aerzte.forEach(arzt => {
   if(arzt.hatKursGebucht(kurs)) {
     doc.text(" ");
    doc.text(arzt.toString());
    doc.text("-------------------------------------------------------------------------------------------------------------------");
  
    n++;
   }
 });

 doc.end();
});




/* GET No User. */
router.get('/nouser', function (req, res, next) {
  res.render('nouser', { darkmode:global.darkmode });
});

/* GET Users. */
router.get('/app/users1', function (req, res, next) {
  let users= manuellemedizin.getUsers();
  res.render('users1', { users:users, target: "users2", darkmode:global.darkmode});
});

/* GET Users. */
router.get('/app/users2', function (req, res, next) {
  let newusers= req.query;
  console.log(newusers);
  users= new Object();
  users.users= new Array();
  users.darkmode= new Object();
  for (var a in req.query) {
    let v= req.query[a.toString()];
    if(v== undefined)
      v= "off";
    a.darkmode= req.query[a.toString()];
    users.users.push(a);
    users.darkmode[a]= new Object();
    users.darkmode[a].darkmode= v;
  }
  manuellemedizin.setUsers(users);
  console.log(JSON.stringify(users));
  res.render('home', { title: 'Herzlich Willkommen bei Manuelle Medizin Bayern', darkmode:global.darkmode });
});

/* GET Warteliste1. */
router.get('/app/warteliste1', function (req, res, next) {
  res.render('warteliste1', { kurse: kurse , darkmode:global.darkmode});
});
/* GET Warteliste2. */
router.get('/app/warteliste1', function (req, res, next) {
  res.render('warteliste2', { aerzte: aerzte, darkmode:global.darkmode });
});

/* GET Bestaetigung1 */
router.get('/app/bestaetigung1', function (req, res, next) {
  res.render('kurswaehlen', { aerzte: aerzte, target: "/app/bestaetigung2", kurse:kurse, darkmode:global.darkmode });
});

/* GET Teilnahmebestaetigung. */
router.get('/app/bestaetigung2', function (req, res, next) {
  let kurs= kurse.getKursForText(req.query.kurs);
  console.log(kurs);
  manuellemedizin.teilnahmemodule.unhashTeilnahme();
  let teilnahme= manuellemedizin.getTeilnahme();
  let kursarray= teilnahme.kurse[kurs];
 
  res.setHeader('content-type', 'application/pdf');
  let doc = new PDFDocument();
  doc.pipe(res);
  for (var a in kursarray) {
    let arzt= aerzte.getArztByMail(a);
   
   /* doc.image('./public/images/logo-512-whitebg.png', {
      fit: [128, 128],
      align: 'right',
      valign: 'center'
    });*/
    doc.fontSize(25);
    doc.text("Teilnahmebescheinigung", {
      align: 'center',
      valign: 'center'});
    doc.text(" ");
    doc.text(arzt.toString(), {
      align: 'center',
      valign: 'center'});
    doc.fontSize(10);
    doc.text("hat am")
    doc.text(kurs.nummer, {
      align: 'center',
      valign: 'center'});
    doc.text("zur Erlangung der Zusatzbezeichnung Manuelle Medizin/Chirotherapie", {
      align: 'center',
      valign: 'center'});
      doc.text(" ");
    doc.text("Mit Erfolg teilgenommen");
    doc.text(" ");
    doc.text("Kurszeiten:");
    doc.text(" ");
    doc.text("Datum                       Uhrzeit                              VNR                         Kat        Fortbildungspunkte");
    doc.text("                                                                          (BLÄK)                 (BLÄK)              (BLÄK)");
    doc.text(kurs.getTag(1)+"          14:00-21:00 Uhr          27609090087207200          H          8");
    doc.text("                                                                            12                          ");
    doc.text(kurs.getTag(2)+"          14:00-21:00 Uhr          27609090087207200          H          11"); 
    doc.text("                                                                            20                          ");
    doc.text(kurs.getTag(3)+"          14:00-21:00 Uhr          27609090087207200          H          7");
    doc.text("                                                                            38                          ");
    doc.text(" ");
    
    doc.text("ANF (BLÄK)          6123      SNR (BLÄK)      872063   Veranstaltungsort          München")
    doc.text(" ");
    
    doc.text("Insgesmt: 25 Stunden");
    doc.text("Die Kurse des Bayrischen Ärzteseminars für Manuelle Medizin (BÄSMM) sind von der Bayrischen Landesärztekammer (BLÄK) zur Erlangung der Zusatzbezeichnung Manuelle Medizin/Chirotherapie anerkannt.");
    doc.text(" ");
    
    doc.text("Diese Teilnahme entspricht den Anforderungen nach Kapitel B I § 4 der Berufsordnung für die Ärzte Bayerns; die Bescheinigungist nur in Verbindung mit der ärztlichen Berufserlaubnis nach §3 bzw. Nach §10 der Bundesärzteordnung (BÄO) gültig. Für das freiwillige Fortblidungszertifikat der Bayrischen Landesärztekammer ist diese Fortbildung mit den oben angegebenen Punkten anrechenbar. Die elektronische Registrierung der Fortbildungspunkte ist bei der zuständigen Ärztekammer durch die teilnehmenden Ärztinnen/Ärzte selbst vorzunehmen, sofern der Punktenachweis gewünscht wird.");
    doc.text(" ");
    
    doc.text("Das Bayrische Ärzteseminar für Manuelle Medizin ist von der Regierung von Oberbayern umsatzsteuerbefreit.");
    doc.text(" ");
    
    doc.text("Die Kursgebühr wurde entrichtet. Verpflegung ist in der Kursgebühr nicht enthalten.");
    doc.text(" ");
    let d= new Date();
    doc.text("München, den "+d.getDate()+"."+(d.getMonth()+1)+"."+d.getFullYear());
    doc.addPage(); 
  }
  doc.end();
});

/* GET Kurse fuer Arzt. */
router.get('/app/aerzte', function (req, res, next) {
  res.render('alleaerzte', { aerzte:aerzte, darkmode:global.darkmode});
});
/* GET alle kurse. */
router.get('/app/kurse', function (req, res, next) {
  res.render('allekurse', { kurse: kurse, aerzte: aerzte, darkmode:global.darkmode });
});


module.exports = router;
