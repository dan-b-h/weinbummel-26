// Thurgau Weinquiz – Fragenpool, in 3 Teile à 6 Fragen gegliedert
// Quellen: swisswine.ch, Branchenverband Thurgau Weine / thurgauweine.ch, vinum.eu,
// deutschschweizerwein.ch, "Thurgau: Ein kleiner Weinkanton zeigt Kontur"

// Varianten-Pool für das "Richtig!"-Kompliment (wird zufällig gezogen, kein Wort doppelt hintereinander)
const PRAISE = [
  "Volltreffer!",
  "Genau richtig – Chapeau!",
  "Bravo, das sass!",
  "Perfekt getroffen!",
  "Da kennt sich jemand aus!",
  "Stark erkannt!",
  "Punktlandung!",
  "Sauber beantwortet!",
  "Ottenberg-würdig, diese Antwort!",
  "Nase und Wissen im Einklang!",
  "Absolut korrekt!",
  "Das sitzt!",
];

const ROUNDS = [
  {
    title: "Teil 1",
    subtitle: "Ankommen in der Weinregion",
    questions: [
      {
        category: "Zahlen & Fakten",
        icon: "land",
        question: "Wie viele Hektar Reben stehen ungefähr im Kanton Thurgau?",
        options: ["rund 50 Hektar", "rund 250 Hektar", "rund 1'000 Hektar", "rund 2'500 Hektar"],
        correct: 1,
        explanation: "Rund 250 Hektar stehen heute im Thurgau unter Reben. Vor etwa 200 Jahren waren es allerdings über 2'000 Hektar – ein fast geschlossenes Rebband zog sich damals von den Ufern des Bodensees und des Rheins bis in die Täler hinein."
      },
      {
        category: "Übernamen",
        icon: "orchard",
        question: "Der Kanton Thurgau trägt wegen seiner ausgedehnten Obstplantagen einen speziellen Übernamen. Wie lautet er?",
        options: ["Rebenland", "Mostindien", "Bodensee-Napa", "Apfelriviera"],
        correct: 1,
        explanation: "«Mostindien» – ein Übername, der auf die Fülle an Obstplantagen zurückgeht, die im Frühling mit ihrer Blütenpracht bezaubern."
      },
      {
        category: "Rebsorten",
        icon: "chart",
        question: "Welche Rebsorte ist die mit Abstand wichtigste im Thurgau – die eigentliche Referenzsorte?",
        options: ["Chardonnay", "Sauvignon Blanc", "Pinot Noir / Blauburgunder", "Riesling"],
        correct: 2,
        explanation: "Pinot Noir alias Blauburgunder wird auf rund 150 der insgesamt 250-260 Hektar angebaut und gilt klar als Paradesorte des Kantons."
      },
      {
        category: "Rebsorten",
        icon: "chart",
        question: "Welche weisse Sorte ist die Nummer 2 im Thurgau und untrennbar mit dem Kanton verbunden?",
        options: ["Müller-Thurgau", "Chardonnay", "Solaris", "Pinot Gris"],
        correct: 0,
        explanation: "Müller-Thurgau (Synonym: Riesling-Sylvaner) ist die wichtigste Weisssorte im Thurgau – und trägt den Kanton sogar im Namen."
      },
      {
        category: "Rebsorten",
        icon: "shield",
        question: "Was ist das Zuchtziel bei modernen Sorten wie Regent oder Souvignier Gris, die man unter dem Begriff «PIWI» zusammenfasst?",
        options: ["Pilzwiderstandsfähigkeit", "Phylloxera-Resistenz", "Spätfrost-Toleranz", "Gezielt reduzierter Ertrag"],
        correct: 0,
        explanation: "PIWI steht für pilzwiderstandsfähige Rebsorten – sie brauchen deutlich weniger Pflanzenschutzmittel. Phylloxera-Resistenz und Frosttoleranz sind eigene, andere Zuchtziele im Rebbau."
      },
      {
        category: "Rebsorten",
        icon: "grapes",
        question: "Pinot Gris (Grauburgunder) ist botanisch eng mit welcher anderen Sorte verwandt?",
        options: ["Chardonnay", "Pinot Noir", "Sauvignon Blanc", "Müller-Thurgau"],
        correct: 1,
        explanation: "Pinot Gris entstand als Knospen-Mutation aus Pinot Noir und ist zudem wenig botrytisanfällig."
      }
    ]
  },
  {
    title: "Teil 2",
    subtitle: "Geschichte & Geografie",
    questions: [
      {
        category: "Geschichte",
        icon: "scroll",
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
        icon: "tag",
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
        icon: "map",
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
        category: "Branche",
        icon: "bottles",
        question: "Wie viele Kellereibetriebe verarbeiten die Trauben der sechs Thurgauer Anbaugebiete ungefähr?",
        options: ["rund 10", "rund 36", "rund 100", "rund 300"],
        correct: 1,
        explanation: "36 Kellereibetriebe stehen hinter den Thurgauer Weinen – die führenden davon sind im Branchenverband Thurgau Weine (BTW) organisiert, der ihre Interessen nach aussen vertritt."
      },
      {
        category: "Geografie",
        icon: "map",
        question: "Welches ist das grösste der sechs Thurgauer Anbaugebiete?",
        options: ["Unteres Thurtal", "Seebachtal", "Lauchetal", "Rheingebiet"],
        correct: 0,
        explanation: "Das Untere Thurtal (mit Uesslingen und Iselisberg) ist mit rund 110-114 Hektar die grösste Anbaufläche im Kanton."
      },
      {
        category: "Geschichte",
        icon: "monastery",
        question: "Welches Kloster förderte den Thurgauer Weinbau im Mittelalter massgeblich?",
        options: ["Kloster Einsiedeln", "Kartause Ittingen", "Kloster St. Gallen", "Kloster Fischingen"],
        correct: 1,
        explanation: "Die Kartause Ittingen im Unteren Thurtal war ein wichtiges Zentrum der klösterlichen Weinbauförderung – Weinbau im Thurgau lässt sich sogar bis in die Römerzeit zurückverfolgen."
      }
    ]
  },
  {
    title: "Teil 3",
    subtitle: "Klima, Stil & Kultur",
    questions: [
      {
        category: "Klima & Boden",
        icon: "thermometer",
        question: "Als was für ein Weinbaugebiet gilt der Thurgau in Fachkreisen?",
        options: [
          "Mediterranes Klima",
          "«Cool Climate»-Gebiet",
          "Kontinentales Klima mit trockenen Sommern",
          "Maritimes Klima wie an der Atlantikküste"
        ],
        correct: 1,
        explanation: "Nördliche Lage, Höhenlagen von 450 bis 600 m ü. M. und über 1'000 mm Niederschlag pro Jahr machen den Thurgau zu einem typischen Cool-Climate-Gebiet – Bodensee und Rhein wirken dabei klimatisch ausgleichend."
      },
      {
        category: "Klima & Boden",
        icon: "soil",
        question: "Welcher Bodentyp prägt die Thurgauer Rebberge hauptsächlich?",
        options: [
          "Moränenboden mit Lehm",
          "Kalkmergel wie in der Champagne",
          "Vulkangestein wie am Kaiserstuhl",
          "Schieferboden wie an der Mosel"
        ],
        correct: 0,
        explanation: "Tiefgründige, nährstoffreiche Moränenböden mit Lehm sowie unterschiedlichen Anteilen an Kalk, Kies oder Sand dominieren – am Ottenberg findet sich sogar sandiger Lehm mit einem Kalkgehalt ähnlich dem des Burgunds, nicht aber vulkanisches oder schiefriges Gestein wie in anderen europäischen Weinregionen."
      },
      {
        category: "Weinstil",
        icon: "barrel",
        question: "Aus welcher einfachen Weinart hat sich der heutige, im Eichenholz ausgebaute Thurgauer Pinot Noir über die letzten 30 Jahre entwickelt?",
        options: ["«Beerliwein»", "Sturm", "Federweisser", "Süssmost"],
        correct: 0,
        explanation: "Aus dem einst süffigen «Beerliwein» ist ein komplexes, im Eichenholz ausgebautes Gewächs nach burgundischem Vorbild geworden – die besten Thurgauer Pinots gehören längst zur Schweizer Topliga."
      },
      {
        category: "Zahlen & Fakten",
        icon: "people",
        question: "Ungefähr wie viele Rebbewirtschafter:innen – inklusive vieler Kleinsterzeuger im Nebenerwerb – zählt der Thurgau?",
        options: ["rund 15", "rund 160", "rund 600", "rund 1'600"],
        correct: 1,
        explanation: "Rund 160 Rebbewirtschafter:innen bewirtschaften die Thurgauer Rebflächen – viele davon als Kleinsterzeuger im Nebenerwerb."
      },
      {
        category: "Trend",
        icon: "trend",
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
        icon: "medal",
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
    ]
  }
];

// Alle Fragen in einer flachen Liste (für Gesamtzahl, Auswertung etc.)
const QUESTIONS = ROUNDS.flatMap(r => r.questions);
