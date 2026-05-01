// dict.js — pure data and helpers (no React), safe in server components.

export const LOCALES = ['ru', 'lv', 'en'];

export const LANGUAGES = [
  { code: 'ru', label: 'RU', name: 'Русский' },
  { code: 'lv', label: 'LV', name: 'Latviešu' },
  { code: 'en', label: 'EN', name: 'English' },
];

// Helper to define a localized string
const L = (ru, lv, en) => ({ ru, lv, en });

// =========================================================
// DICTIONARY — all UI strings
// =========================================================
export const DICT = {
  nav: {
    cottages:    L('Дома',         'Mājas',        'Cottages'),
    why:         L('Почему мы',    'Kāpēc mēs',    'Why us'),
    reviews:     L('Отзывы',       'Atsauksmes',   'Reviews'),
    contact:     L('Контакты',     'Kontakti',     'Contact'),
    book:        L('Забронировать','Rezervēt',     'Book now'),
    menu:        L('Меню',         'Izvēlne',      'Menu'),
  },
  hero: {
    eyebrow:     L('Единственный олений парк в Латвии', 'Vienīgais briežu parks Latvijā', 'The only deer park in Latvia'),
    titleA:      L('Покорми',          'Pabaro',           'Feed a'),
    titleB:      L('оленя',             'briedi',           'deer'),
    titleAccent: L('у самого порога',   'pie pat sliekšņa', 'at your doorstep'),
    lead:        L(
      'Олений парк, карповник у озера и четыре дома, в которых остаются на ночь. Не туристический аттракцион — частный лес, где можно гулять с оленями. 2 часа от Риги.',
      'Briežu parks, karpu dīķis pie ezera un četras mājas, kurās palikt uz nakti. Nevis tūrisma atrakcija — privāts mežs, kur var pastaigāties kopā ar briežiem. 2 stundas no Rīgas.',
      'A deer park, a carp pond by the lake, and four cottages to stay the night. Not a tourist attraction — a private forest where you can walk among deer. 2 hours from Riga.'
    ),
    where:       L('Куда',           'Kur',          'Where'),
    checkIn:     L('Заезд',          'Ierašanās',    'Check-in'),
    checkOut:    L('Выезд',          'Izbraukšana',  'Check-out'),
    guests:      L('Гостей',         'Viesi',        'Guests'),
    search:      L('Искать',         'Meklēt',       'Search'),
    place:       L('Латвия, Līči',   'Latvija, Līči','Latvia, Līči'),
    guestsN:     L('гостя',          'viesi',        'guests'), // 2 гостя
    statRating:  L('Средняя оценка', 'Vidējais vērtējums', 'Average rating'),
    statReviews: L('Отзывов гостей', 'Viesu atsauksmes',   'Guest reviews'),
    statHomes:   L('Уникальных дома','Unikālas mājas',     'Unique cottages'),
    statSilence: L('Тишины и леса',  'Klusums un mežs',    'Silence & forest'),
    scroll:      L('Прокрути',       'Ritini',       'Scroll'),
  },
  marquee: [
    L('Покормить оленя',              'Pabarot briedi',             'Feed a deer'),
    L('Карповник у дома',             'Karpu dīķis pie mājas',      'Carp pond by the cottage'),
    L('Прогулки по парку',            'Pastaigas pa parku',         'Walks through the park'),
    L('Озеро у порога',               'Ezers pie durvīm',           'Lake at the doorstep'),
    L('Джакузи под звёздами',         'Burbuļvanna zem zvaigznēm',  'Jacuzzi under the stars'),
    L('Сауна на закате',              'Pirts saulrietā',            'Sauna at sunset'),
  ],
  cottages: {
    eyebrow:    L('— Наши дома', '— Mūsu mājas',    '— Our cottages'),
    titleA:     L('Четыре характера.', 'Četri raksturi.', 'Four characters.'),
    titleB:     L('Одна магия',      'Viena maģija',     'One magic'),
    titleC:     L('леса.',           'meža.',            'of the forest.'),
    sub:        L(
      'Каждый домик — это история. Выберите свою: дом-дракон с кинотеатром, аутентичная вилла викингов, ферма с альпаками или загадочное чёрное шале.',
      'Katra mājiņa ir stāsts. Izvēlieties savējo: pūķa māju ar kinozāli, autentisku vikingu villu, fermu ar alpakām vai noslēpumaino melno šaleju.',
      'Each cottage is a story. Pick yours: dragon house with a cinema, an authentic viking villa, a farm with alpacas, or the mysterious black chalet.'
    ),
    open:       L('Открыть',         'Atvērt',           'View'),
    perNight:   L('/ ночь',          '/ naktī',          '/ night'),
  },
  // ▸ THE LEAD MAGNET — Deer Park
  deer: {
    eyebrow:    L('— Deer Park',         '— Briežu parks',         '— The Deer Park'),
    titleA:     L('Олени, которые',      'Brieži, kas',            'Deer that'),
    titleAccent:L('сами подходят',       'paši pienāk',            'come to you'),
    titleB:     L('к тебе.',             'klāt.',                  '.'),
    p1:         L(
      'Не зоопарк за стеклом — частный парк, по которому олени гуляют свободно. Возьми морковь или яблоко, и они подойдут так близко, что ты услышишь их дыхание. Дети не отходят, взрослые забывают про телефоны.',
      'Nav zoodārzs aiz stikla — privāts parks, pa kuru brieži brīvi staigā. Paņem burkānu vai ābolu, un tie pienāks tik tuvu, ka dzirdēsi to elpošanu. Bērnus nevar aizvilkt, pieaugušie aizmirst par telefoniem.',
      'Not a zoo behind glass — a private park where deer roam free. Bring a carrot or an apple, and they\'ll come close enough to hear their breath. Kids don\'t want to leave; adults forget about their phones.'
    ),
    p2:         L(
      'Парк наш собственный. Идти туда от любого домика — пять минут. Можешь зайти на рассвете, на закате, ночью с фонарём. Это часть проживания, не отдельный билет.',
      'Parks ir mūsu pašu. No jebkuras mājas līdz tam — piecas minūtes. Vari ieiet rītausmā, saulrietā, naktī ar lukturīti. Tas ir daļa no uzturēšanās, nevis atsevišķa biļete.',
      'The park is ours. Five-minute walk from any cottage. Drop in at dawn, at sunset, at night with a torch. It\'s part of your stay, not a separate ticket.'
    ),
    pills: [
      L('🦌 Олени',                 '🦌 Brieži',                  '🦌 Deer'),
      L('🥕 Корм с собой',          '🥕 Barība līdzi',            '🥕 Bring food'),
      L('🌅 Любое время',           '🌅 Jebkurā laikā',           '🌅 Any time of day'),
    ],
    cta:        L('Узнать больше',   'Uzzināt vairāk',             'Learn more'),
  },
  // ▸ FISHING — second magnet
  fishing: {
    eyebrow:    L('— Карповник у озера', '— Karpu dīķis pie ezera', '— Carp pond by the lake'),
    titleA:     L('Закинул удочку',      'Iemeti makšķeri',         'Cast the line'),
    titleAccent:L('— через минуту клюёт.','— pēc minūtes ķeras.',    '— it bites in a minute.'),
    titleB:     L('',                    '',                        ''),
    p1:         L(
      'Озеро прямо у домиков, рыба — карп, линь, щука, карась. Карповник — отдельный пруд только для гостей. Удочки и лодки бесплатно. Поймал — пожарил на гриле у себя на террасе. Отпустил — никто не считает.',
      'Ezers pie pat mājām, zivis — karpa, līnis, līdaka, karūsa. Karpu dīķis — atsevišķs dīķis tikai viesiem. Makšķeres un laivas bez maksas. Noķēri — apcepi uz grila pie savas terases. Atlaidi — neviens nesaskaita.',
      'The lake is right at the cottages — carp, tench, pike, crucian. The carp pond is a separate water for guests only. Rods and boats are free. Catch one and grill it on your terrace. Release it — no one counts.'
    ),
    p2:         L(
      'Лучший клёв — на рассвете. Хозяин расскажет, где ловить и на что. Это не платная рыбалка с лимитом, а уединение с природой.',
      'Vislabāk ķeras rītausmā. Saimnieks pastāstīs, kur un uz ko ķert. Tā nav maksas makšķerēšana ar limitu, bet vientulība ar dabu.',
      'Best biting at dawn. The host will tell you where and what to use. Not paid fishing with limits — solitude with nature.'
    ),
    pills: [
      L('🎣 Удочки бесплатно',     '🎣 Makšķeres bez maksas',     '🎣 Free rods'),
      L('🚣 Лодки',                '🚣 Laivas',                   '🚣 Boats included'),
      L('🐟 Карп · Щука · Линь',   '🐟 Karpa · Līdaka · Līnis',   '🐟 Carp · Pike · Tench'),
    ],
  },
  // ▸ USP banner
  usp: {
    badge:      L('Только в Латвии',   'Tikai Latvijā',            'Only in Latvia'),
    title:      L(
      'Единственный <em>олений парк</em> с проживанием.',
      'Vienīgais <em>briežu parks</em> ar nakšņošanu.',
      'The only <em>deer park</em> you can stay overnight at.'
    ),
    sub:        L(
      'В Латвии всего 25% домиков стоят у озера. С оленьим парком — мы одни.',
      'Latvijā tikai 25% māju atrodas pie ezera. Ar briežu parku — esam vieni.',
      'Only 25% of Latvian rentals sit by a lake. With a deer park — we are alone.'
    ),
  },
  // ▸ Park rules — safety, what to bring, courtesy
  rules: {
    eyebrow:    L('— Правила парка',     '— Parka noteikumi',       '— Park rules'),
    titleA:     L('Парк — частный лес.', 'Parks — privāts mežs.',   'The park is a private forest.'),
    titleAccent:L('Здесь ласково',       'Te ar mīlestību',         'We treat it gently'),
    titleB:     L('и спокойно.',         'un mierīgi.',             'and calmly.'),
    cards: [
      {
        emoji: '🦌',
        title: L('С оленями — ласково',    'Ar briežiem — maigi',     'Gently with the deer'),
        text:  L(
          'Не бегайте за ними, не кричите, не делайте резких движений. Кормите медленно, с раскрытой ладони. У оленя есть рога — не лезьте лицом вплотную, не хватайте за шею. Если олень отходит — не догоняйте.',
          'Neskrieniet tiem pakaļ, nekliedziet, izvairieties no asām kustībām. Barojiet lēni, ar atvērtu plaukstu. Briedim ir ragi — neraušaties ar seju cieši klāt, neturiet aiz kakla. Ja briedis aiziet — neskrieniet pakaļ.',
          'Don\'t chase them, don\'t shout, no sudden moves. Feed slowly with an open palm. Deer have antlers — don\'t put your face right up against them, don\'t grab them by the neck. If a deer steps away — don\'t follow.'
        ),
      },
      {
        emoji: '🥕',
        title: L('Что приносить',           'Ko ņemt līdzi',           'What to bring'),
        text:  L(
          'Морковь и яблоки оленям, листовой салат кроликам. Можно любые свежие овощи. Нельзя — хлеб, шоколад, чипсы, всё солёное и пряное: они от этого болеют. Запас всегда есть у нас на стойке, бесплатно.',
          'Burkāni un āboli briežiem, salāti trušiem. Var jebkurus svaigus dārzeņus. Nedrīkst — maizi, šokolādi, čipsus, visu sālītu un asu: viņi no tā saslimst. Krājumi vienmēr ir pie reģistratūras, bez maksas.',
          'Carrots and apples for the deer, salad leaves for the rabbits. Any fresh vegetable works. Don\'t bring bread, chocolate, crisps, anything salty or spicy — they get sick from that. We always have a free stash at reception.'
        ),
      },
      {
        emoji: '⏰',
        title: L('Чтобы все ушли счастливые', 'Lai visi paliek laimīgi',  'So everyone leaves happy'),
        text:  L(
          'Парк работает 8:00–22:00. Дети — всегда рядом со взрослым. Своих собак в парк не берём (они пугают оленей — но в домике им рады). Без алкоголя в парке и без громкого шума. С мая по сентябрь обработай одежду от клещей.',
          'Parks atvērts 8:00–22:00. Bērni — vienmēr blakus pieaugušajam. Savus suņus parkā neņemam (tie biedē briežus — bet mājiņā tos gaidām). Bez alkohola parkā un bez skaļa trokšņa. No maija līdz septembrim apstrādājiet apģērbu pret ērcēm.',
          'Park hours are 8:00–22:00. Children stay with an adult at all times. No outside dogs in the park (they frighten the deer — but they\'re welcome at the cottage). No alcohol or loud noise inside the park. From May to September, treat your clothes against ticks.'
        ),
      },
    ],
    disclaimer: L(
      'Парк — частный лес с дикими животными. Их поведение нельзя предсказать заранее. Заходя на территорию, посетитель принимает на себя ответственность за свою безопасность и за тех, кто рядом. Хозяева благодарят за внимание к этому маленькому миру.',
      'Parks ir privāts mežs ar savvaļas dzīvniekiem. Viņu uzvedību nevar pareģot. Ieejot teritorijā, apmeklētājs uzņemas atbildību par savu un blakus esošo drošību. Saimnieki pateicas par cieņu pret šo mazo pasauli.',
      'The park is a private forest with wild animals; their behaviour cannot be predicted. By entering, visitors accept responsibility for their own safety and for those with them. The hosts thank you for caring for this small world.'
    ),
  },
  // ▸ How it works
  how: {
    eyebrow:    L('— Как это работает',  '— Kā tas notiek',         '— How it works'),
    titleA:     L('Три шага до встречи', 'Trīs soļi līdz tikšanās', 'Three steps to'),
    titleAccent:L('с оленями',           'ar briežiem',             'meeting deer'),
    titleB:     L('.',                   '.',                       '.'),
    steps: [
      { num: '01',
        title: L('Заселяешься в дом',   'Ieved māju',                'Check into the cottage'),
        text:  L('Ключ в коробке. Рассказываем по WhatsApp всё, что нужно. Никаких очередей.',
                 'Atslēga kastē. Pa WhatsApp pastāstām visu vajadzīgo. Nekādu rindu.',
                 'Key in a lockbox. We send everything you need on WhatsApp. No queues.') },
      { num: '02',
        title: L('Берёшь корм',          'Paņem barību',              'Grab some food'),
        text:  L('Морковь, яблоки, специальный корм — у нас на стойке. Бесплатно. Можно взять с собой.',
                 'Burkāni, āboli, speciāla barība — pie reģistratūras. Bez maksas. Var paņemt līdzi.',
                 'Carrots, apples, special feed — at our counter. Free. Take it with you.') },
      { num: '03',
        title: L('Идёшь в парк',         'Ej uz parku',               'Walk to the park'),
        text:  L('Пять минут пешком от любого домика. Олени уже ждут — особенно если ты не первый раз.',
                 'Piecas minūtes ar kājām no jebkuras mājas. Brieži jau gaida — īpaši, ja neesi pirmo reizi.',
                 'Five minutes from any cottage. The deer are already waiting — especially if you\'ve been before.') },
    ],
  },
  // ▸ Cottage detail: "What's around"
  around: {
    eyebrow:    L('— Что рядом',         '— Kas ir tuvumā',           '— What\'s around'),
    title:      L('В шаговой доступности','Pieejams ar kājām',         'Within walking distance'),
    deerLabel:  L('Олений парк',         'Briežu parks',              'Deer Park'),
    fishLabel:  L('Карповник',           'Karpu dīķis',               'Carp pond'),
    lakeLabel:  L('Озеро',               'Ezers',                     'Lake'),
    saunaLabel: L('Сауна',               'Pirts',                     'Sauna'),
    walkUnit:   L('мин пешком',          'min ar kājām',              'min walk'),
  },
  story1: {
    eyebrow:    L('— История места',  '— Vietas stāsts',  '— Place story'),
    title:      L(
      'Где время <em>замедляется</em>, а душа <em>выдыхает</em>.',
      'Kur laiks <em>palēninās</em>, un dvēsele <em>uzelpo</em>.',
      'Where time <em>slows down</em> and the soul <em>exhales</em>.'
    ),
    p1:         L(
      'Лес. Озеро. Тёплый свет от костра. Каждый домик — это миниатюрная вселенная, где интерьер собран по крупицам, мебель — с историей, а вид из окна меняется с временем суток.',
      'Mežs. Ezers. Silta uguns gaisma. Katra mājiņa ir miniatūrs visums, kur interjers salikts pa graudiem, mēbeles ar stāstu, un skats no loga mainās ar diennakti.',
      'Forest. Lake. Warm firelight. Each cottage is a tiny universe — interior assembled piece by piece, furniture with stories, and a window view that shifts with the hours.'
    ),
    p2:         L(
      'Никаких типовых отелей с пластиковыми ключами и лифтами. Только дерево, ткань, тёплый свет и ритм природы.',
      'Nekādu standarta viesnīcu ar plastmasas atslēgām un liftiem. Tikai koks, audums, silta gaisma un dabas ritms.',
      'No corporate hotels with plastic keys and elevators. Just wood, fabric, warm light, and the rhythm of nature.'
    ),
    pills: [
      L('🌲 1.5 ч от Риги',       '🌲 1.5 h no Rīgas',    '🌲 1.5 h from Riga'),
      L('🛏 До 4 гостей',         '🛏 Līdz 4 viesiem',   '🛏 Up to 4 guests'),
      L('🐾 С питомцами бесплатно','🐾 Ar mājdzīvniekiem bezmaksas', '🐾 Pets free'),
    ],
  },
  trust: [
    { icon: '✓',  title: L('Без предоплаты',     'Bez priekšapmaksas', 'No prepayment'),
                  desc:  L('Платите при заезде',  'Maksājiet ierodoties', 'Pay on arrival') },
    { icon: '⏱',  title: L('Бесплатная отмена',  'Bezmaksas atcelšana','Free cancellation'),
                  desc:  L('До 48 часов до заезда','Līdz 48 h pirms ierašanās', 'Up to 48h before') },
    { icon: '🔒', title: L('Безопасная оплата',  'Droša apmaksa',     'Secure payment'),
                  desc:  L('Защищённые транзакции','Aizsargātas transakcijas', 'Encrypted transactions') },
    { icon: '⭐', title: L('9.0 / 10',            '9.0 / 10',          '9.0 / 10'),
                  desc:  L('464 проверенных отзыва','464 pārbaudītas atsauksmes', '464 verified reviews') },
    { icon: '📞', title: L('Хост 24/7',           'Saimnieks 24/7',    'Host 24/7'),
                  desc:  L('На связи всегда',      'Vienmēr sasniedzams', 'Always available') },
    { icon: '⏰', title: L('Парк 8:00–22:00',     'Parks 8:00–22:00',  'Park 8:00–22:00'),
                  desc:  L('Каждый день, включая праздники','Katru dienu, arī svētkos','Daily, including holidays') },
  ],
  story2: {
    eyebrow:    L('— Spa & Wellness', '— Spa & Wellness', '— Spa & Wellness'),
    title:      L(
      'Джакузи под звёздами. <em>Сауна</em> на закате.',
      'Burbuļvanna zem zvaigznēm. <em>Pirts</em> saulrietā.',
      'Jacuzzi under the stars. <em>Sauna</em> at sunset.'
    ),
    p1:         L(
      'Гидромассажная купель прямо под открытым небом — 39° тёплой воды, тишина леса и небо в звёздах. Финская сауна с ароматом дерева. Перепрыгивание из жара в холодное озеро — и снова в тепло.',
      'Burbuļvanna zem klajas debess — 39° silta ūdens, meža klusums un zvaigžņota debess. Somu pirts ar koka aromātu. No karstuma ledusaukstā ezerā — un atpakaļ.',
      'Hot tub right under the open sky — 39° warm water, forest silence and a star-filled sky. Finnish sauna with the scent of pine. From heat to cold lake — and back again.'
    ),
    p2:         L(
      'Лучший способ сбросить городской стресс — встретить ночь в купели с бокалом вина под пение совы.',
      'Labākais veids atbrīvoties no pilsētas stresa — sagaidīt nakti vannā ar vīna glāzi pūces dziesmas pavadībā.',
      'The best way to shed city stress — meet the night in a hot tub with a glass of wine and the song of an owl.'
    ),
    pills: [
      L('♨️ Гидромассажная ванна', '♨️ Burbuļvanna',     '♨️ Hot tub'),
      L('🧖 Финская сауна',         '🧖 Somu pirts',      '🧖 Finnish sauna'),
      L('🔥 Камин и BBQ',          '🔥 Kamīns un BBQ',   '🔥 Fireplace and BBQ'),
    ],
  },
  story3: {
    eyebrow:    L('— Для души и детей', '— Dvēselei un bērniem', '— For soul and kids'),
    title:      L(
      'Альпаки, пони, кролики — <em>прямо у порога</em>.',
      'Alpakas, poniji, truši — <em>pie pat sliekšņa</em>.',
      'Alpacas, ponies, rabbits — <em>right at the doorstep</em>.'
    ),
    p1:         L(
      'Кролики выходят к крыльцу за морковкой. Альпаки и пони пасутся за оградой. Собаки хозяев — самые добрые в Латвии. Возьмите с собой яблок и моркови — это лучшие друзья на отпуск.',
      'Truši iznāk pie lieveņa pēc burkāniem. Alpakas un poniji ganās aiz žoga. Saimnieku suņi — vislaipnākie Latvijā. Paņemiet līdzi ābolus un burkānus — labākie atvaļinājuma draugi.',
      'Rabbits hop to the porch for carrots. Alpacas and ponies graze just behind the fence. The hosts\' dogs are the kindest in Latvia. Bring apples and carrots — best holiday friends.'
    ),
    p2:         L(
      'Дети будут заняты весь день: животные, лодки, рыбалка, велосипеды, детская площадка. Взрослые — тоже.',
      'Bērni būs aizņemti visu dienu: dzīvnieki, laivas, makšķerēšana, velosipēdi, rotaļlaukums. Pieaugušie — arī.',
      'Kids will be busy all day: animals, boats, fishing, bikes, playground. Adults too.'
    ),
    pills: [
      L('🦙 Альпаки',          '🦙 Alpakas',        '🦙 Alpacas'),
      L('🐰 Свободные кролики','🐰 Brīvie truši',   '🐰 Free-roaming rabbits'),
      L('🎣 Озеро с рыбой',    '🎣 Ezers ar zivīm', '🎣 Lake with fish'),
      L('🚴 Велосипеды',       '🚴 Velosipēdi',     '🚴 Bicycles'),
    ],
  },
  why: {
    eyebrow:    L('— Почему Forest Retreat', '— Kāpēc Forest Retreat', '— Why Forest Retreat'),
    titleA:     L('Не отель.',                'Ne viesnīca.',           'Not a hotel.'),
    titleB:     L('Личный мир',               'Personīga pasaule',      'A private world'),
    titleC:     L('в лесу.',                  'mežā.',                  'in the forest.'),
  },
  features: [
    { icon: '🌲', title: L('Полное уединение','Pilnīga vientulība','Full seclusion'),
                  text:  L('Каждый дом стоит отдельно в окружении леса и озера. Никаких соседей за стенкой — только звук ветра и пение птиц.',
                           'Katra māja stāv atsevišķi mežā pie ezera. Nekādu kaimiņu aiz sienas — tikai vēja skaņa un putnu dziesmas.',
                           'Each cottage stands alone, framed by forest and lake. No neighbors through the wall — just wind and birdsong.') },
    { icon: '♨️', title: L('Джакузи и сауна','Burbuļvanna un pirts','Jacuzzi & sauna'),
                  text:  L('Парная по-чёрному, гидромассажная купель под открытым небом — расслабьтесь после прогулки по лесу.',
                           'Melnā pirts, burbuļvanna zem klajas debess — atpūtieties pēc pastaigas pa mežu.',
                           'Smoke sauna and an open-air hot tub — unwind after a walk through the forest.') },
    { icon: '🦙', title: L('Мини-зоопарк','Mini zoodārzs','Mini-zoo'),
                  text:  L('Альпаки, пони, овечки, козы и кролики, которые едят с рук. Дети будут счастливы. Взрослые — тоже.',
                           'Alpakas, poniji, aitas, kazas un truši, kuri ēd no rokas. Bērni būs laimīgi. Arī pieaugušie.',
                           'Alpacas, ponies, sheep, goats and rabbits that eat from your hand. Kids will be happy. Adults too.') },
    { icon: '🎬', title: L('Кино в лесу','Kino mežā','Cinema in the forest'),
                  text:  L('Кинопроектор с Netflix в тишине леса. Фильм, плед, бокал вина — лучшая премьера в вашей жизни.',
                           'Projektors ar Netflix meža klusumā. Filma, pleds, vīna glāze — labākā pirmizrāde dzīvē.',
                           'A projector with Netflix in forest silence. Movie, blanket, glass of wine — your best premiere ever.') },
    { icon: '🐾', title: L('С питомцами — бесплатно','Ar mājdzīvniekiem — bezmaksas','Pets — free'),
                  text:  L('Берите с собой собак — они будут в восторге от свободы. Никаких доплат, только радостные хвосты.',
                           'Ņemiet līdzi suņus — tie būs sajūsmā par brīvību. Nekādu piemaksu, tikai laimīgas astes.',
                           'Bring your dogs — they\'ll love the freedom. No surcharges, just happy tails.') },
    { icon: '🎣', title: L('Рыбалка и лодки','Makšķerēšana un laivas','Fishing & boats'),
                  text:  L('Карп, линь, щука, карась — в озере прямо у домика. Лодки — бесплатно. Удочки можно прихватить с собой.',
                           'Karpas, līņi, līdakas, karūsas — ezerā pie pat mājiņas. Laivas bezmaksas. Makšķeres var ņemt līdzi.',
                           'Carp, tench, pike, crucian — in the lake right by the cottage. Boats are free. Bring your rods.') },
  ],
  reviewsSection: {
    eyebrow:    L('— Отзывы гостей', '— Viesu atsauksmes', '— Guest reviews'),
    titleA:     L('Что говорят те,',  'Ko saka tie,',       'What those say,'),
    titleB:     L('кто',              'kas',                'who'),
    titleAccent:L('уже вернулся',     'jau atgriezušies',   'have already returned'),
    sub:        L(
      '{n}+ отзывов на Booking.com со средней оценкой {r}/10. Вот лучшие из них.',
      '{n}+ atsauksmes Booking.com ar vidējo vērtējumu {r}/10. Lūk, labākās.',
      '{n}+ reviews on Booking.com averaging {r}/10. Here are the best.'
    ),
  },
  map: {
    eyebrow:    L('— Где мы',          '— Kur mēs esam',     '— Where we are'),
    titleA:     L('В сердце',           'Kurzemes',           'In the heart of'),
    titleAccent:L('Курземе',            'sirdī',              'Kurzeme'),
    titleB:     L('. 1.5 часа от Риги.','. 1.5 stundas no Rīgas.','. 1.5 hours from Riga.'),
    sub:        L(
      'Līči, Латвия — посёлок среди лесов и озёр. Свой пруд у каждого домика, до ближайшего магазина 20 км — то самое уединение, за которым едут.',
      'Līči, Latvija — ciemats mežu un ezeru ielokā. Savs dīķis pie katras mājiņas, līdz tuvākajam veikalam 20 km — tā vientulība, kuras dēļ brauc.',
      'Līči, Latvia — a village among forests and lakes. Each cottage has its own pond; the nearest shop is 20 km away — that\'s the seclusion you came for.'
    ),
    pin:        L('Forest Retreat · Līči', 'Forest Retreat · Līči', 'Forest Retreat · Līči'),
  },
  cta: {
    titleA:     L('Готовы сбежать',  'Gatavi aizbēgt',      'Ready to escape'),
    titleB:     L('в',               'uz',                  'into'),
    titleAccent:L('тишину',          'klusumu',             'silence'),
    sub:        L(
      'Забронируйте свой уголок леса прямо сейчас. Лучшие даты разбирают за месяц вперёд.',
      'Rezervējiet savu meža stūrīti tagad. Labākie datumi tiek izķerti mēnesi uz priekšu.',
      'Book your corner of the forest now. The best dates fill up a month in advance.'
    ),
    btn:        L('Выбрать дом',      'Izvēlēties māju',    'Choose a cottage'),
  },
  footer: {
    tagline:    L('Уединённые домики на природе в Латвии. Сауна, джакузи, озеро, лес — всё, чтобы перезагрузиться.',
                  'Nomaļas mājiņas dabā Latvijā. Pirts, burbuļvanna, ezers, mežs — viss, lai atjaunotos.',
                  'Secluded cottages in Latvian nature. Sauna, jacuzzi, lake, forest — everything to reset.'),
    cottages:   L('Дома',            'Mājas',              'Cottages'),
    info:       L('Информация',      'Informācija',        'Information'),
    contact:    L('Контакты',        'Kontakti',           'Contact'),
    booking:    L('Бронирование',    'Rezervācija',        'Booking'),
    rights:     L('© 2026 Forest Retreat · Все права защищены','© 2026 Forest Retreat · Visas tiesības aizsargātas','© 2026 Forest Retreat · All rights reserved'),
    madeWith:   L('Сделано с любовью в латвийском лесу','Veidots ar mīlestību Latvijas mežā','Made with love in the Latvian forest'),
  },
  detail: {
    home:        L('Главная',        'Sākums',             'Home'),
    cottages:    L('Дома',           'Mājas',              'Cottages'),
    notFound:    L('Дом не найден',  'Māja nav atrasta',   'Cottage not found'),
    back:        L('Вернуться',      'Atgriezties',        'Go back'),
    bedroom:     L('спальня',        'guļamistaba',        'bedroom'),
    bedroomsTo:  L('· до',           '· līdz',             '· up to'),
    guestsLabel: L('гостей',         'viesiem',            'guests'),
    sqm:         L('м²',             'm²',                 'sqm'),
    location:    L('📍 Līči, Латвия','📍 Līči, Latvija',   '📍 Līči, Latvia'),
    reviewsCount:L('отзывов',        'atsauksmes',         'reviews'),
    showAll:     L('Все фото',       'Visas bildes',       'All photos'),
    about:       L('Об этом доме',   'Par šo māju',        'About this cottage'),
    amenities:   L('Удобства и услуги','Ērtības un pakalpojumi','Amenities & services'),
    ratings:     L('Оценки гостей',  'Viesu vērtējumi',    'Guest ratings'),
    reviewsHead: L('Отзывы',         'Atsauksmes',         'Reviews'),
    reviewsSub:  L('— реальные истории гостей','— reāli viesu stāsti','— real guest stories'),
  },
  booking: {
    perNight:    L('€ / ночь',       '€ / naktī',          '€ / night'),
    checkIn:     L('Заезд',          'Ierašanās',          'Check-in'),
    checkOut:    L('Выезд',          'Izbraukšana',        'Check-out'),
    guests:      L('Гостей',         'Viesi',              'Guests'),
    name:        L('Имя',            'Vārds',              'Name'),
    namePh:      L('Ваше имя',       'Jūsu vārds',         'Your name'),
    email:       L('E-mail',         'E-pasts',            'E-mail'),
    phone:       L('Телефон',        'Telefons',           'Phone'),
    cleaning:    L('Уборка',         'Uzkopšana',          'Cleaning'),
    fee:         L('Сервисный сбор', 'Servisa maksa',      'Service fee'),
    total:       L('Итого',          'Kopā',               'Total'),
    submit:      L('Забронировать сейчас','Rezervēt tagad','Book now'),
    sending:     L('Отправляем…',     'Nosūtām…',           'Sending…'),
    errBlocked:  L('Эти даты уже заняты — выберите другие.','Šie datumi jau aizņemti — izvēlieties citus.','These dates are already booked — please pick others.'),
    errGeneric:  L('Не удалось отправить заявку. Попробуйте ещё раз.','Neizdevās nosūtīt pieteikumu. Mēģiniet vēlreiz.','Could not submit booking. Please try again.'),
    helper:      L('Без предоплаты · Бесплатная отмена','Bez priekšapmaksas · Bezmaksas atcelšana','No prepayment · Free cancellation'),
    successTitle:L('Заявка отправлена!','Pieteikums nosūtīts!','Request submitted!'),
    successText: L('Мы свяжемся с вами в течение часа, чтобы подтвердить бронирование. Спасибо, что выбрали Forest Retreat.',
                   'Mēs sazināsimies ar jums stundas laikā, lai apstiprinātu rezervāciju. Paldies, ka izvēlējāties Forest Retreat.',
                   'We\'ll contact you within an hour to confirm. Thanks for choosing Forest Retreat.'),
    successBtn:  L('Прекрасно',      'Lieliski',           'Wonderful'),
    nights1:     L('ночь',           'nakts',              'night'),
    nightsFew:   L('ночи',           'naktis',             'nights'),
    nightsMany:  L('ночей',          'naktis',             'nights'),
  },
  fab:           L('Забронировать',  'Rezervēt',           'Book now'),
  mega: {
    eyebrow:    L('— Выберите свой дом','— Izvēlieties māju',  '— Choose your cottage'),
    footHint:   L('4 уникальных дома · Латвия','4 unikālas mājas · Latvija','4 unique cottages · Latvia'),
    viewAll:    L('Все дома',          'Visas mājas',         'All cottages'),
  },
  faq: {
    eyebrow:    L('— Часто спрашивают',  '— Bieži uzdotie jautājumi', '— Frequently asked'),
    titleA:     L('Если у вас остались', 'Ja jums vēl ir',            'If you still have'),
    titleAccent:L('вопросы',              'jautājumi',                 'questions'),
    titleB:     L('— мы здесь.',          '— mēs esam šeit.',          ' — we are here.'),
    items: [
      { q: L('Можно ли с питомцами?',
             'Vai drīkst ar mājdzīvniekiem?',
             'Are pets allowed?'),
        a: L('Да, питомцы разрешены бесплатно во всех домах. У нас есть свои собаки и животные на территории — они дружелюбны.',
             'Jā, mājdzīvnieki ir atļauti bez maksas visās mājās. Mums ir savi suņi un dzīvnieki teritorijā — tie ir draudzīgi.',
             'Yes, pets are welcome in all cottages free of charge. We have our own dogs and farm animals on site — they are friendly.') },
      { q: L('Что входит в стоимость?',
             'Kas iekļauts cenā?',
             'What is included in the price?'),
        a: L('Полностью оборудованный дом, постельное бельё, полотенца, бесплатный Wi-Fi, парковка, базовые принадлежности (чай, кофе, соль). Сауна и джакузи оплачиваются отдельно.',
             'Pilnībā aprīkota māja, gultas veļa, dvieļi, bezmaksas Wi-Fi, autostāvvieta, pamata piederumi (tēja, kafija, sāls). Pirts un burbuļvanna tiek apmaksāti atsevišķi.',
             'A fully-equipped cottage, linens, towels, free Wi-Fi, parking, basic supplies (tea, coffee, salt). Sauna and jacuzzi are paid separately.') },
      { q: L('Какие условия отмены?',
             'Kādi ir atcelšanas noteikumi?',
             'What is the cancellation policy?'),
        a: L('Бесплатная отмена за 48 часов до заезда. После — удерживается стоимость первой ночи. Предоплата не требуется.',
             'Bezmaksas atcelšana 48 stundas pirms ierašanās. Pēc tam tiek ieturēta pirmās nakts maksa. Priekšapmaksa nav nepieciešama.',
             'Free cancellation up to 48 hours before check-in. After that, the first night is charged. No prepayment required.') },
      { q: L('Когда заезд и выезд?',
             'Kāds ir reģistrācijas laiks?',
             'What are check-in and check-out times?'),
        a: L('Заезд с 15:00, выезд до 11:00. Ранний/поздний заезд — по согласованию.',
             'Reģistrācija no 15:00, izrakstīšanās līdz 11:00. Agrāka/vēlāka ierašanās — pēc vienošanās.',
             'Check-in from 15:00, check-out by 11:00. Early or late check-in is possible by arrangement.') },
      { q: L('Как добраться?',
             'Kā nokļūt?',
             'How do I get there?'),
        a: L('1.5 часа от Риги. По Е22 в сторону Талси, затем 20 км по второстепенным дорогам до Līči. Точные координаты пришлём после бронирования. Есть платный трансфер от/до аэропорта.',
             '1.5 stundas no Rīgas. Pa Е22 Talsu virzienā, tad 20 km pa lauku ceļiem līdz Līčiem. Precīzas koordinātes nosūtīsim pēc rezervācijas. Ir maksas transfērs no/uz lidostu.',
             '1.5 hours from Riga. Take E22 toward Talsi, then 20 km on country roads to Līči. Exact coordinates sent after booking. Paid airport transfer available.') },
      { q: L('Подходит ли для детей?',
             'Vai der bērniem?',
             'Is it suitable for children?'),
        a: L('Да! Детская площадка, мини-зоопарк (альпаки, пони, кролики), безопасное озеро, просторная территория. Только не оставляйте малышей без присмотра у воды.',
             'Jā! Bērnu rotaļlaukums, mini zoodārzs (alpakas, poniji, truši), drošs ezers, plaša teritorija. Tikai neatstājiet mazos bez uzraudzības pie ūdens.',
             'Yes! Playground, mini zoo (alpacas, ponies, rabbits), safe lake, spacious grounds. Just don\'t leave little ones unattended near water.') },
      { q: L('Что делать, если олень напугался или подошёл слишком близко?',
             'Ko darīt, ja briedis nobijies vai pienācis pārāk tuvu?',
             'What if a deer is spooked or comes too close?'),
        a: L('Стой на месте, не делай резких движений и не поворачивайся спиной. Опусти руку с кормом и говори тихо. Олени быстро успокаиваются. Если всё же что-то идёт не так — зови хоста, мы рядом.',
             'Apstājies uz vietas, neveic asas kustības un negriez muguru. Nolaid roku ar barību un runā klusi. Brieži ātri nomierinās. Ja kaut kas tomēr nav kārtībā — sauc saimnieku, mēs esam tuvu.',
             'Stand still, no sudden moves, don\'t turn your back. Lower the hand with food and speak softly. Deer calm down quickly. If anything still feels off — call the host, we\'re close by.') },
      { q: L('Какие часы работы парка?',
             'Kādas ir parka darba stundas?',
             'What are the park hours?'),
        a: L('Парк открыт каждый день 8:00–22:00, включая праздники. Лучшее время для встречи с оленями — рассвет и за час до заката, когда они активнее всего. Ночью парк закрыт ради спокойствия животных.',
             'Parks atvērts katru dienu 8:00–22:00, arī svētku dienās. Labākais laiks tikšanai ar briežiem — rītausma un stunda pirms saulrieta, kad tie aktīvākie. Naktī parks slēgts dzīvnieku miera dēļ.',
             'The park is open every day 8:00–22:00, including holidays. The best time to meet the deer is at dawn and the hour before sunset when they are most active. The park is closed at night to let the animals rest.') },
      { q: L('Можно ли с собакой в парк?',
             'Vai drīkst ar suni parkā?',
             'Can I bring my dog into the park?'),
        a: L('В парк к оленям — нет: собаки их пугают, олени могут пораниться о забор. В домик и на территорию — да, бесплатно. Рядом много троп, где собака может побегать без оленей.',
             'Pie briežiem parkā — nē: suņi tos biedē, brieži var savainoties pret žogu. Mājiņā un teritorijā — jā, bez maksas. Tuvumā ir daudz taku, kur suns var paskraidīt bez briežiem.',
             'Into the deer park — no: dogs frighten them and the deer can hurt themselves on the fence. At the cottage and grounds — absolutely yes, free of charge. There are plenty of trails nearby for dog walks without the deer.') },
    ],
  },
  // Lookups
  amenities: {
    'Бесплатный Wi-Fi':         L('Бесплатный Wi-Fi','Bezmaksas Wi-Fi','Free Wi-Fi'),
    'Бесплатная парковка':      L('Бесплатная парковка','Bezmaksas autostāvvieta','Free parking'),
    'Гидромассажная ванна':     L('Гидромассажная ванна','Burbuļvanna','Hot tub'),
    'Сауна':                    L('Сауна','Pirts','Sauna'),
    'Кинопроектор Netflix':     L('Кинопроектор Netflix','Projektors Netflix','Netflix projector'),
    'Можно с питомцами':        L('Можно с питомцами','Ar mājdzīvniekiem atļauts','Pets allowed'),
    'Полная мини-кухня':        L('Полная мини-кухня','Pilna virtuvīte','Full kitchenette'),
    'Кондиционер':              L('Кондиционер','Kondicionieris','Air conditioning'),
    'Вид на озеро':             L('Вид на озеро','Skats uz ezeru','Lake view'),
    'Рыбалка':                  L('Рыбалка','Makšķerēšana','Fishing'),
    'Барбекю-зона':             L('Барбекю-зона','BBQ zona','BBQ area'),
    'Барбекю':                  L('Барбекю','BBQ','BBQ'),
    'Принадлежности для BBQ':   L('Принадлежности для BBQ','BBQ piederumi','BBQ supplies'),
    'Бесплатные велосипеды':    L('Бесплатные велосипеды','Bezmaksas velosipēdi','Free bicycles'),
    'Трансфер от/до аэропорта': L('Трансфер от/до аэропорта','Transfērs no/uz lidostu','Airport transfer'),
    'Семейные номера':          L('Семейные номера','Ģimenes numuri','Family rooms'),
    'Балкон с видом':           L('Балкон с видом','Balkons ar skatu','Balcony with view'),
    'Отопление':                L('Отопление','Apkure','Heating'),
    'Альпаки, пони, кролики':   L('Альпаки, пони, кролики','Alpakas, poniji, truši','Alpacas, ponies, rabbits'),
    'Кролики, пони':            L('Кролики, пони','Truši, poniji','Rabbits, ponies'),
    'Камин':                    L('Камин','Kamīns','Fireplace'),
    'Кухня с плитой':           L('Кухня с плитой','Virtuve ar plīti','Kitchen with stove'),
    'Мини-кухня':               L('Мини-кухня','Virtuvīte','Kitchenette'),
    'Дартс':                    L('Дартс','Darts','Darts'),
    'Домашний кинотеатр':       L('Домашний кинотеатр','Mājas kinoteātris','Home theater'),
    'Уютная гостиная':          L('Уютная гостиная','Mājīga viesistaba','Cozy living room'),
    'Для семьи / пары':         L('Для семьи / пары','Ģimenei / pārim','For family / couple'),
  },
  categories: {
    'Персонал':       L('Персонал','Personāls','Staff'),
    'Удобства':       L('Удобства','Ērtības','Amenities'),
    'Чистота':        L('Чистота','Tīrība','Cleanliness'),
    'Комфорт':        L('Комфорт','Komforts','Comfort'),
    'Цена/качество':  L('Цена/качество','Cena/kvalitāte','Value for money'),
    'Расположение':   L('Расположение','Atrašanās vieta','Location'),
  },
  ratingLabels: {
    'Превосходно': L('Превосходно','Izcili','Excellent'),
    'Потрясающе':  L('Потрясающе','Pārsteidzoši','Awesome'),
  },
  types: {
    'Дом на дереве': L('Дом на дереве','Māja kokā','Tree house'),
    'Лодж на ферме': L('Лодж на ферме','Lauku mājiņa','Farm lodge'),
    'Шале':          L('Шале','Šaleja','Chalet'),
  },
  badges: {
    'Хит сезона':     L('Хит сезона',    'Sezonas hīts',    'Season hit'),
    'Романтика':      L('Романтика',     'Romantika',       'Romantic'),
    'С животными':    L('С животными',   'Ar dzīvniekiem',  'With animals'),
    'Арт-интерьер':   L('Арт-интерьер',  'Arta interjers',  'Art interior'),
  },
  months: {
    ru: ['Январь','Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    lv: ['Janvāris','Februāris','Marts','Aprīlis','Maijs','Jūnijs','Jūlijs','Augusts','Septembris','Oktobris','Novembris','Decembris'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  },
  weekdays: {
    ru: ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'],
    lv: ['Pr','Ot','Tr','Ce','Pk','Se','Sv'],
    en: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  },
  guestsOptions: {
    ru: ['1 гость','2 гостя','3 гостя','4 гостя'],
    lv: ['1 viesis','2 viesi','3 viesi','4 viesi'],
    en: ['1 guest','2 guests','3 guests','4 guests'],
  },
};


// Pick localized value from {ru,lv,en} or pass through string
export function pick(obj, locale) {
  if (!obj) return '';
  if (typeof obj === 'string') return obj;
  return obj[locale] ?? obj.ru ?? obj.en ?? '';
}
