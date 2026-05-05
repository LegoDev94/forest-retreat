// Legal copy for Terms / Privacy / Refund. Each section is {ru, lv, en}.
// LV is canonical (required by Swedbank merchant compliance).

const L = (ru, lv, en) => ({ ru, lv, en });

export const COMPANY = {
  name:    'Rančo Gobas SIA',
  regNo:   '40103XXXXXXX',
  address: 'Līči, Krāslavas novads, LV-5601, Latvija',
  phone:   '+371 25 674 959',
  email:   'hello@forestretreat.lv',
};

export const LEGAL = {
  terms: {
    title: L('Условия и положения', 'Pakalpojumu noteikumi', 'Terms of Service'),
    updated: L('Обновлено: 04.05.2026', 'Atjaunināts: 04.05.2026', 'Updated: 2026-05-04'),
    sections: [
      {
        h: L('1. Общие положения', '1. Vispārīgi noteikumi', '1. General provisions'),
        p: L(
          `Настоящие условия регулируют отношения между ${COMPANY.name} (далее — «Поставщик», рег.№ ${COMPANY.regNo}, ${COMPANY.address}) и пользователем сайта forestretreat.lv (далее — «Гость») при бронировании размещения в коттеджах.`,
          `Šie noteikumi regulē attiecības starp ${COMPANY.name} (turpmāk — “Pakalpojumu sniedzējs”, reģ.Nr. ${COMPANY.regNo}, ${COMPANY.address}) un vietnes forestretreat.lv lietotāju (turpmāk — “Viesis”), veicot mājiņu rezervāciju.`,
          `These terms govern the relationship between ${COMPANY.name} (hereafter "Provider", reg. no. ${COMPANY.regNo}, ${COMPANY.address}) and the user of forestretreat.lv (hereafter "Guest") when booking accommodation in our cottages.`,
        ),
      },
      {
        h: L('2. Предмет договора', '2. Līguma priekšmets', '2. Subject of the agreement'),
        p: L(
          'Поставщик предоставляет Гостю в краткосрочную аренду коттедж и связанные услуги (отопление, сауна, парковка и т.п.) в указанные даты заезда/выезда. Бронирование считается заключённым после успешной оплаты.',
          'Pakalpojumu sniedzējs nodod Viesim īstermiņa nomā mājiņu un saistītos pakalpojumus (apkure, pirts, autostāvvieta utml.) norādītajos ierašanās/izbraukšanas datumos. Rezervācija tiek uzskatīta par noslēgtu pēc veiksmīgas apmaksas.',
          'The Provider rents the cottage and related services (heating, sauna, parking etc.) to the Guest for the stated check-in/check-out dates. The booking is considered confirmed after successful payment.',
        ),
      },
      {
        h: L('3. Цены и оплата', '3. Cenas un apmaksa', '3. Prices and payment'),
        p: L(
          'Цены указаны в евро (EUR), включают НДС. В стоимость входят проживание, уборка и сервисный сбор; туристический налог (если применим) оплачивается на месте. Оплата принимается онлайн через платёжный шлюз Swedbank (EveryPay) — поддерживаются карты VISA и Mastercard. После успешной транзакции Гость получает подтверждение бронирования по электронной почте.',
          'Cenas norādītas eiro (EUR) un ietver PVN. Cenā ietilpst naktsmītne, uzkopšana un servisa maksa; tūrisma nodeva (ja piemērojama) tiek apmaksāta uz vietas. Apmaksa tiek pieņemta tiešsaistē caur Swedbank (EveryPay) maksājumu vārteju — atbalstītas VISA un Mastercard kartes. Pēc veiksmīga darījuma Viesis saņem rezervācijas apstiprinājumu uz e-pastu.',
          'Prices are in euros (EUR) including VAT. The price includes accommodation, cleaning and a service fee; tourist tax (if applicable) is paid on site. Payment is accepted online via the Swedbank (EveryPay) payment gateway — VISA and Mastercard are supported. After a successful transaction the Guest receives a booking confirmation by e-mail.',
        ),
      },
      {
        h: L('4. Заезд и выезд', '4. Ierašanās un izbraukšana', '4. Check-in and check-out'),
        p: L(
          'Заезд — с 15:00, выезд — до 12:00. Поздний заезд возможен по предварительному согласованию. При заселении Гость предъявляет документ, удостоверяющий личность.',
          'Ierašanās — no plkst. 15:00, izbraukšana — līdz plkst. 12:00. Vēla ierašanās iespējama pēc iepriekšējas saskaņošanas. Reģistrējoties Viesis uzrāda personu apliecinošu dokumentu.',
          'Check-in from 15:00, check-out by 12:00. Late check-in is possible by prior arrangement. At check-in the Guest presents a valid ID.',
        ),
      },
      {
        h: L('5. Обязанности гостя', '5. Viesa pienākumi', '5. Guest obligations'),
        p: L(
          'Гость обязуется бережно относиться к имуществу, соблюдать тишину после 23:00, не курить в помещениях, не разводить открытый огонь вне специально отведённых мест и соблюдать правила поведения с животными парка. Поставщик вправе требовать возмещения ущерба.',
          'Viesis apņemas saudzīgi izturēties pret īpašumu, ievērot klusumu pēc plkst. 23:00, nesmēķēt iekštelpās, neatklātu uguni kurt tikai tam paredzētās vietās un ievērot dzīvnieku parka uzvedības noteikumus. Pakalpojumu sniedzējam ir tiesības pieprasīt zaudējumu atlīdzību.',
          'The Guest agrees to treat the property with care, observe quiet hours after 23:00, refrain from smoking indoors, only use open fire in designated areas, and follow the deer-park behaviour rules. The Provider is entitled to demand compensation for damages.',
        ),
      },
      {
        h: L('6. Аннулирование и возврат', '6. Atcelšana un atmaksa', '6. Cancellation and refund'),
        p: L(
          'Условия аннулирования и возврата средств описаны в отдельном документе «Условия отмены и возврата».',
          'Atcelšanas un atmaksas noteikumi ir aprakstīti atsevišķā dokumentā “Atcelšanas un atmaksas noteikumi”.',
          'Cancellation and refund terms are described in a separate document, "Cancellation and Refund Policy".',
        ),
      },
      {
        h: L('7. Ответственность', '7. Atbildība', '7. Liability'),
        p: L(
          'Поставщик не несёт ответственности за ущерб, причинённый обстоятельствами непреодолимой силы (стихийные бедствия, отключение коммунальных услуг провайдером и т.п.). Гость использует территорию парка, водоёмы и инвентарь на свой страх и риск; за детьми и питомцами следят сопровождающие взрослые.',
          'Pakalpojumu sniedzējs nav atbildīgs par zaudējumiem, kas radušies nepārvaramas varas apstākļu dēļ (stihiskas nelaimes, komunālo pakalpojumu pārtraukums no piegādātāja puses utml.). Viesis izmanto parka teritoriju, ūdenstilpnes un inventāru uz savu risku; par bērniem un mājdzīvniekiem atbild pieaugušais pavadonis.',
          'The Provider is not liable for damages caused by force majeure (natural disasters, utility outages from suppliers, etc.). The Guest uses the park grounds, water bodies and equipment at their own risk; children and pets are the responsibility of the accompanying adult.',
        ),
      },
      {
        h: L('8. Защита данных', '8. Datu aizsardzība', '8. Data protection'),
        p: L(
          'Обработка персональных данных описана в Политике конфиденциальности.',
          'Personas datu apstrāde ir aprakstīta Privātuma politikā.',
          'Personal data processing is described in the Privacy Policy.',
        ),
      },
      {
        h: L('9. Применимое право и споры', '9. Piemērojamie likumi un strīdi', '9. Governing law and disputes'),
        p: L(
          `Настоящие условия регулируются законодательством Латвийской Республики. Споры решаются путём переговоров; при недостижении согласия — в суде Латвийской Республики по месту нахождения Поставщика. Контакты для претензий: ${COMPANY.email}, тел. ${COMPANY.phone}.`,
          `Šie noteikumi tiek regulēti ar Latvijas Republikas likumdošanu. Strīdi tiek risināti pārrunu ceļā; ja vienošanās netiek panākta — Latvijas Republikas tiesā Pakalpojumu sniedzēja atrašanās vietā. Kontakti pretenzijām: ${COMPANY.email}, tālr. ${COMPANY.phone}.`,
          `These terms are governed by the laws of the Republic of Latvia. Disputes are resolved through negotiation; failing agreement — in a court of the Republic of Latvia at the Provider's location. Complaints contact: ${COMPANY.email}, tel. ${COMPANY.phone}.`,
        ),
      },
    ],
  },

  privacy: {
    title: L('Политика конфиденциальности', 'Privātuma politika', 'Privacy Policy'),
    updated: L('Обновлено: 04.05.2026', 'Atjaunināts: 04.05.2026', 'Updated: 2026-05-04'),
    sections: [
      {
        h: L('1. Контролёр данных', '1. Datu pārzinis', '1. Data controller'),
        p: L(
          `Контролёром персональных данных является ${COMPANY.name}, рег.№ ${COMPANY.regNo}, ${COMPANY.address}. Контакт по вопросам данных: ${COMPANY.email}.`,
          `Personas datu pārzinis ir ${COMPANY.name}, reģ.Nr. ${COMPANY.regNo}, ${COMPANY.address}. Kontakts datu jautājumos: ${COMPANY.email}.`,
          `The data controller is ${COMPANY.name}, reg. no. ${COMPANY.regNo}, ${COMPANY.address}. Data contact: ${COMPANY.email}.`,
        ),
      },
      {
        h: L('2. Какие данные мы собираем', '2. Kādus datus mēs vācam', '2. What data we collect'),
        p: L(
          'При бронировании: имя, фамилия, e-mail, телефон, даты заезда, число гостей. При оплате: данные карты обрабатываются банковским шлюзом Swedbank/EveryPay — мы НЕ получаем и не храним номер карты, CVV или PIN. Для журналов сервера: IP-адрес, user-agent, время запросов.',
          'Veicot rezervāciju: vārds, uzvārds, e-pasts, tālrunis, ierašanās datumi, viesu skaits. Veicot apmaksu: kartes dati tiek apstrādāti bankas vārtejā Swedbank/EveryPay — mēs NESAŅEMAM un neuzglabājam kartes numuru, CVV vai PIN. Servera žurnāliem: IP adrese, user-agent, pieprasījumu laiks.',
          'For booking: first and last name, e-mail, phone, check-in dates, number of guests. For payment: card data is handled by the Swedbank/EveryPay banking gateway — we do NOT receive or store card number, CVV or PIN. For server logs: IP address, user agent, request times.',
        ),
      },
      {
        h: L('3. Цели обработки', '3. Apstrādes mērķi', '3. Purposes of processing'),
        p: L(
          'Заключение и исполнение договора аренды (ст. 6(1)(b) GDPR), бухгалтерский учёт и налоговая отчётность (6(1)(c)), безопасность сервиса и защита от мошенничества (6(1)(f)), маркетинговые сообщения — только с явного согласия (6(1)(a)).',
          'Nomas līguma slēgšana un izpilde (VDAR 6.p.1.d.b), grāmatvedība un nodokļu pārskati (6.p.1.d.c), servisa drošība un krāpniecības novēršana (6.p.1.d.f), mārketinga ziņas — tikai ar nepārprotamu piekrišanu (6.p.1.d.a).',
          'Conclusion and execution of the rental contract (GDPR Art. 6(1)(b)), accounting and tax reporting (6(1)(c)), service security and fraud prevention (6(1)(f)), marketing messages — only with explicit consent (6(1)(a)).',
        ),
      },
      {
        h: L('4. Передача третьим лицам', '4. Datu nodošana trešajām personām', '4. Third-party recipients'),
        p: L(
          'Платёжный шлюз: AS Swedbank (Latvia) и AS EveryPay (Estonia) — для проведения расчётов. Хостинг и БД: Supabase Inc. (EU region). Email-уведомления: Resend Inc. Все получатели обязаны соблюдать GDPR; данные не передаются за пределы ЕЭЗ без надлежащих гарантий.',
          'Maksājumu vārteja: AS Swedbank (Latvija) un AS EveryPay (Igaunija) — norēķiniem. Hostings un datubāze: Supabase Inc. (ES reģions). E-pasta paziņojumi: Resend Inc. Visi saņēmēji ir saistīti ar VDAR; dati netiek nodoti ārpus EEZ bez atbilstošām garantijām.',
          'Payment gateway: AS Swedbank (Latvia) and AS EveryPay (Estonia) — for settlement. Hosting and database: Supabase Inc. (EU region). E-mail notifications: Resend Inc. All recipients are bound by GDPR; data is not transferred outside the EEA without adequate safeguards.',
        ),
      },
      {
        h: L('5. Срок хранения', '5. Glabāšanas termiņš', '5. Retention period'),
        p: L(
          'Данные о бронированиях и платежах хранятся 5 лет после оказания услуги (закон о бухгалтерском учёте). Маркетинговые согласия — до отзыва. Серверные журналы — до 90 дней.',
          'Rezervāciju un maksājumu dati tiek glabāti 5 gadus pēc pakalpojuma sniegšanas (Grāmatvedības likums). Mārketinga piekrišanas — līdz atsaukšanai. Servera žurnāli — līdz 90 dienām.',
          'Booking and payment data are retained for 5 years after service delivery (Accounting Act). Marketing consents — until withdrawn. Server logs — up to 90 days.',
        ),
      },
      {
        h: L('6. Ваши права', '6. Jūsu tiesības', '6. Your rights'),
        p: L(
          `Вы имеете право: запросить копию своих данных, исправить их, удалить (если нет иных правовых оснований для хранения), ограничить обработку, перенести данные другому контролёру, отозвать согласие, подать жалобу в Государственную инспекцию данных Латвии (Datu valsts inspekcija). Запросы — на ${COMPANY.email}, ответ в течение 30 дней.`,
          `Jums ir tiesības: pieprasīt savu datu kopiju, tos labot, dzēst (ja nav citu juridisku pamatu glabāšanai), ierobežot apstrādi, pārnest datus citam pārzinim, atsaukt piekrišanu, iesniegt sūdzību Datu valsts inspekcijā. Pieprasījumi — uz ${COMPANY.email}, atbilde 30 dienu laikā.`,
          `You have the right to: request a copy of your data, correct it, delete it (where no other legal basis applies), restrict processing, port your data, withdraw consent, lodge a complaint with the Latvian State Data Inspectorate (Datu valsts inspekcija). Requests — to ${COMPANY.email}, response within 30 days.`,
        ),
      },
      {
        h: L('7. Cookies', '7. Sīkdatnes', '7. Cookies'),
        p: L(
          'Сайт использует только технические cookies (сессия аутентификации, язык). Аналитические/маркетинговые cookies не используются.',
          'Vietne izmanto tikai tehniskās sīkdatnes (autentifikācijas sesija, valoda). Analītiskās/mārketinga sīkdatnes netiek izmantotas.',
          'The site uses only technical cookies (auth session, language). No analytics or marketing cookies are used.',
        ),
      },
      {
        h: L('8. Безопасность', '8. Drošība', '8. Security'),
        p: L(
          'Соединение шифруется TLS, пароли хранятся в виде хешей, доступ к данным — по принципу минимальных привилегий, журналы аудита ведутся.',
          'Savienojums tiek šifrēts ar TLS, paroles tiek glabātas kā hash vērtības, piekļuve datiem — pēc minimālo privilēģiju principa, tiek vesti audita žurnāli.',
          'Connection is encrypted with TLS, passwords are stored as hashes, access follows least-privilege, audit logs are kept.',
        ),
      },
    ],
  },

  refund: {
    title: L('Условия отмены и возврата', 'Atcelšanas un atmaksas noteikumi', 'Cancellation and Refund Policy'),
    updated: L('Обновлено: 04.05.2026', 'Atjaunināts: 04.05.2026', 'Updated: 2026-05-04'),
    sections: [
      {
        h: L('1. Бесплатная отмена', '1. Bezmaksas atcelšana', '1. Free cancellation'),
        p: L(
          'Вы можете отменить бронирование без штрафа не позднее, чем за 7 дней до даты заезда. В этом случае возврат происходит в полном объёме, на ту же карту, в течение 5–10 рабочих дней.',
          'Jūs varat atcelt rezervāciju bez maksas ne vēlāk kā 7 dienas pirms ierašanās datuma. Šajā gadījumā tiek veikta pilna atmaksa uz to pašu karti 5–10 darba dienu laikā.',
          'You may cancel the booking free of charge no later than 7 days before the check-in date. A full refund is then made to the same card within 5–10 business days.',
        ),
      },
      {
        h: L('2. Частичный возврат', '2. Daļēja atmaksa', '2. Partial refund'),
        p: L(
          'При отмене за 3–7 дней до заезда возвращается 50% от суммы бронирования.',
          'Atceļot 3–7 dienas pirms ierašanās, tiek atmaksāti 50% no rezervācijas summas.',
          'For cancellations 3–7 days before check-in, 50% of the booking amount is refunded.',
        ),
      },
      {
        h: L('3. Поздняя отмена и неявка', '3. Vēla atcelšana un neierašanās', '3. Late cancellation and no-show'),
        p: L(
          'При отмене менее чем за 3 дня до заезда или неявке возврат не производится.',
          'Atceļot mazāk nekā 3 dienas pirms ierašanās vai neierodoties, atmaksa netiek veikta.',
          'Cancellations less than 3 days before check-in, or no-shows, are non-refundable.',
        ),
      },
      {
        h: L('4. Форс-мажор', '4. Nepārvarama vara', '4. Force majeure'),
        p: L(
          'В случае объективной невозможности заезда (закрытие границ, стихийные бедствия, тяжёлая болезнь с подтверждающим документом) — возврат рассматривается индивидуально, обычно полностью или с переносом дат без штрафа.',
          'Objektīvas nespējas ierasties gadījumā (robežu slēgšana, stihiskas nelaimes, smaga slimība ar apliecinošu dokumentu) — atmaksa tiek izskatīta individuāli, parasti pilnībā vai ar datumu pārcelšanu bez maksas.',
          'In case of an objective inability to arrive (border closures, natural disasters, serious illness with supporting document) — refunds are reviewed case-by-case, usually full or with free date change.',
        ),
      },
      {
        h: L('5. Как отменить', '5. Kā atcelt', '5. How to cancel'),
        p: L(
          `Чтобы отменить бронирование, напишите на ${COMPANY.email} с темой «Cancellation» и укажите номер брони (формат FR-XXXXXXXX) и дату заезда. Также можно позвонить или написать в WhatsApp по номеру ${COMPANY.phone}.`,
          `Lai atceltu rezervāciju, rakstiet uz ${COMPANY.email} ar tēmu “Cancellation” un norādiet rezervācijas numuru (formāts FR-XXXXXXXX) un ierašanās datumu. Var arī zvanīt vai rakstīt WhatsApp uz ${COMPANY.phone}.`,
          `To cancel a booking, e-mail ${COMPANY.email} with the subject "Cancellation" and include your booking reference (format FR-XXXXXXXX) and check-in date. You can also call or WhatsApp ${COMPANY.phone}.`,
        ),
      },
      {
        h: L('6. Возврат на карту', '6. Atmaksa uz karti', '6. Card refund'),
        p: L(
          'Возврат всегда производится тем же способом, которым была произведена оплата — на ту же карту через шлюз Swedbank/EveryPay. Срок зачисления зависит от банка-эмитента (обычно 5–10 рабочих дней).',
          'Atmaksa vienmēr tiek veikta ar to pašu metodi, kā tika veikta apmaksa — uz to pašu karti caur Swedbank/EveryPay vārteju. Ieskaitīšanas termiņš atkarīgs no izdevējbankas (parasti 5–10 darba dienas).',
          'Refunds are always made by the same method used for payment — to the same card via the Swedbank/EveryPay gateway. The arrival time depends on the issuing bank (typically 5–10 business days).',
        ),
      },
    ],
  },
};

export const LEGAL_KEYS = ['terms', 'privacy', 'refund'];
