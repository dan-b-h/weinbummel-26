// Thurgau Weinquiz – Fragenpool
// Quellen: swisswine.ch, Branchenverband Thurgau Weine / thurgauweine.ch, vinum.eu,
// deutschschweizerwein.ch, "Thurgau: Ein kleiner Weinkanton zeigt Kontur"
const QUESTIONS = [
  {
    category: "Zahlen & Fakten",
    question: "Wie viele Hektar Reben stehen ungefähr im Kanton Thurgau?",
    options: ["rund 50 Hektar", "rund 250 Hektar", "rund 1'000 Hektar", "rund 2'500 Hektar"],
    correct: 1,
    explanation: "Rund 250 Hektar stehen heute im Thurgau unter Reben. Vor etwa 200 Jahren waren es allerdings über 2'000 Hektar – ein fast geschlossenes Rebband zog sich damals von den Ufern des Bodensees und des Rheins bis in die Täler hinein."
  },
  {
    category: "Übernamen",
    question: "Der Kanton Thurgau trägt wegen seiner ausgedehnten Obstplantagen einen speziellen Übernamen. Wie lautet er?",
    options: ["Rebenland", "Mostindien", "Bodensee-Napa", "Apfelriviera"],
    correct: 1,
    explanation: "«Mostindien» – ein Übername, der auf die Fülle an Obstplantagen zurückgeht, die im Frühling mit ihrer Blütenpracht bezaubern."
  },
  {
    category: "Rebsorten",
    question: "Welche Rebsorte ist die mit Abstand wichtigste im Thurgau – die eigentliche Referenzsorte?",
    options: ["Chardonnay", "Sauvignon Blanc", "Pinot Noir / Blauburgunder", "Riesling"],
    correct: 2,
    explanation: "Pinot Noir alias Blauburgunder wird auf rund 150 der insgesamt 250-260 Hektar angebaut und gilt klar als Paradesorte des Kantons."
  },
  {
    category: "Rebsorten",
    question: "Welche weisse Sorte ist die Nummer 2 im Thurgau und untrennbar mit dem Kanton verbunden?",
    options: ["Müller-Thurgau", "Chardonnay", "Solaris", "Pinot Gris"],
    correct: 0,
    explanation: "Müller-Thurgau (Synonym: Riesling-Sylvaner) ist die wichtigste Weisssorte im Thurgau – und trägt den Kanton sogar im Namen."
  },
  {
    category: "Geschichte",
    question: "Wer züchtete die Rebsorte Müller-Thurgau – und wo geschah das eigentlich?",
    options: [
      "Hermann Müller, in Tägerwilen (Thurgau)",
      "Hermann Müller, in Geisenheim (Deutschland)",
      "Ein Mönch der Kartause Ittingen",
      "Louis Pasteur, in Frankreich"
    ],
    correct: 1,
    explanation: "Kleiner Twist: Hermann Müller wurde zwar 1850 in Tägerwilen (TG) geboren – gezüchtet hat er die Kreuzung aus Riesling und Madeleine royale aber im deutschen Geisenheim."
  },
  {
    category: "Geschichte",
    question: "Woher stammt der Namenszusatz «-Thurgau» bei der Rebsorte Müller-Thurgau?",
    options: [
      "Nach dem Fluss Thur, an dem die Sorte erstmals wuchs",
      "Weil Hermann Müller aus dem Thurgau stammte – zur Unterscheidung von anderen Botanikern namens Müller",
      "Nach einem gleichnamigen Weingut",
      "Er wurde per Zufallsgenerator vergeben"
    ],
    correct: 1,
    explanation: "Der Heimatkanton wurde Teil des Sortennamens, damit man Hermann Müller von all den anderen Botanikern mit Nachnamen Müller unterscheiden konnte."
  },
  {
    category: "Geografie",
    question: "Welche zwei Lagen gelten als das prestigeträchtige Herzstück des Thurgauer Pinot Noir?",
    options: [
      "Lauchetal und Seebachtal",
      "Untersee und Rheingebiet",
      "Ottenberg und Iselisberg",
      "Frauenfeld und Weinfelden-Zentrum"
    ],
    correct: 2,
    explanation: "Der Ottenberg bei Weinfelden und der Iselisberg nahe Frauenfeld sind die bekanntesten Grosslagen – perfekt nach Süden ausgerichtete Hanglagen, auf denen die besten Thurgauer Pinots wachsen."
  },
  {
    category: "Geografie",
    question: "In wie viele Anbaugebiete gliedert sich der Thurgauer Weinbau?",
    options: ["Drei", "Vier", "Sechs", "Acht"],
    correct: 2,
    explanation: "Sechs Anbaugebiete: Oberes Thurtal, Unteres Thurtal, Seebachtal, Untersee, Rheingebiet und Lauchetal."
  },
  {
    category: "Geografie",
    question: "Welches ist das grösste der sechs Thurgauer Anbaugebiete?",
    options: ["Unteres Thurtal", "Seebachtal", "Lauchetal", "Rheingebiet"],
    correct: 0,
    explanation: "Das Untere Thurtal (mit Uesslingen und Iselisberg) ist mit rund 110-114 Hektar die grösste Anbaufläche im Kanton – historisches Zentrum war einst die Kartause Ittingen."
  },
  {
    category: "Geschichte",
    question: "Welches Kloster förderte den Thurgauer Weinbau im Mittelalter massgeblich?",
    options: ["Kloster Einsiedeln", "Kartause Ittingen", "Kloster St. Gallen", "Kloster Fischingen"],
    correct: 1,
    explanation: "Die Kartause Ittingen im Unteren Thurtal war ein wichtiges Zentrum der klösterlichen Weinbauförderung – Weinbau im Thurgau lässt sich sogar bis in die Römerzeit zurückverfolgen."
  },
  {
    category: "Klima & Boden",
    question: "Als was für ein Weinbaugebiet gilt der Thurgau in Fachkreisen?",
    options: ["Mediterranes Gebiet", "«Cool Climate»-Gebiet", "Wüstenklima-Gebiet", "Subtropisches Gebiet"],
    correct: 1,
    explanation: "Nördliche Lage, Höhenlagen von 450 bis 600 m ü. M. und über 1'000 mm Niederschlag pro Jahr machen den Thurgau zu einem typischen Cool-Climate-Gebiet – Bodensee und Rhein wirken dabei klimatisch ausgleichend."
  },
  {
    category: "Klima & Boden",
    question: "Welcher Bodentyp prägt die Thurgauer Rebberge hauptsächlich?",
    options: ["Vulkanboden", "Moränenböden mit Lehm, Kalk und Kies", "Reiner Sandboden", "Granitverwitterungsboden"],
    correct: 1,
    explanation: "Tiefgründige, nährstoffreiche Moränenböden mit Lehm sowie unterschiedlichen Anteilen an Kalk, Kies oder Sand dominieren – am Ottenberg findet sich sogar sandiger Lehm mit einem Kalkgehalt ähnlich dem des Burgunds."
  },
  {
    category: "Rebsorten",
    question: "Was bedeutet die Abkürzung «PIWI» bei modernen Rebsorten wie Regent oder Souvignier Gris?",
    options: ["Pilzwiderstandsfähig", "Pinot-Wildkreuzung", "Piemonteser Winzer-Initiative", "Präzise Winter-Immunisierung"],
    correct: 0,
    explanation: "PIWI steht für pilzwiderstandsfähige Rebsorten – sie brauchen weniger Pflanzenschutz und liegen im Thurgau klar im Aufwind."
  },
  {
    category: "Rebsorten",
    question: "Pinot Gris (Grauburgunder) ist botanisch eng mit welcher anderen Sorte verwandt?",
    options: ["Chardonnay", "Pinot Noir – er ist eine Knospen-Mutation davon", "Sauvignon Blanc", "Müller-Thurgau"],
    correct: 1,
    explanation: "Pinot Gris entstand als Knospen-Mutation aus Pinot Noir und ist zudem wenig botrytisanfällig."
  },
  {
    category: "Weinstil",
    question: "Aus welcher einfachen Weinart hat sich der heutige, im Eichenholz ausgebaute Thurgauer Pinot Noir über die letzten 30 Jahre entwickelt?",
    options: ["«Beerliwein»", "Sturm", "Federweisser", "Süssmost"],
    correct: 0,
    explanation: "Aus dem einst süffigen «Beerliwein» ist ein komplexes, im Eichenholz ausgebautes Gewächs nach burgundischem Vorbild geworden – die besten Thurgauer Pinots gehören längst zur Schweizer Topliga."
  },
  {
    category: "Zahlen & Fakten",
    question: "Ungefähr wie viele Rebbewirtschafter:innen – inklusive vieler Kleinsterzeuger im Nebenerwerb – zählt der Thurgau?",
    options: ["rund 15", "rund 160", "rund 600", "rund 1'600"],
    correct: 1,
    explanation: "Rund 160 Rebbewirtschafter:innen und 36 Kellereibetriebe prägen die sechs Thurgauer Weinbaugebiete – viele davon sind im Branchenverband Thurgau Weine (BTW) organisiert."
  },
  {
    category: "Trend",
    question: "Wie entwickelt sich der Konsum von Thurgauer Weinen im Vergleich zum gesamtschweizerischen Trend?",
    options: [
      "Er sinkt stärker als im Rest der Schweiz",
      "Er steigt – während der Weinkonsum in der Schweiz insgesamt rückläufig ist",
      "Er stagniert seit Jahrzehnten exakt gleich",
      "Dazu gibt es keinerlei Daten"
    ],
    correct: 1,
    explanation: "Während der Weinkonsum in der Schweiz seit Jahren sinkt, gehören Thurgauer Weine zu den wenigen, die beim Konsum zulegen können – kein Wunder bei der Qualitätsentwicklung der letzten Jahre."
  },
  {
    category: "Thurgauer Staatswein",
    question: "Wofür werden die offiziell gekürten «Thurgauer Staatsweine» verwendet?",
    options: [
      "Ausschliesslich für den Export",
      "Ausschank bei offiziellen Anlässen und als Geschenk für Gäste, Referent:innen und Besucher:innen",
      "Sie werden eingelagert und nie geöffnet",
      "Nur für private Anlässe der Regierungsratsmitglieder"
    ],
    correct: 1,
    explanation: "Der Kanton will mit den Thurgauer Staatsweinen die Weinregion bekannter machen: Die gekürten Weine – prämiert per Blinddegustation auf dem Arenenberg – werden bei offiziellen Anlässen ausgeschenkt und verschenkt."
  }
];
