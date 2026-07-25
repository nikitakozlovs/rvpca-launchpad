/* ============================================================
   RVP CA DARBVIRSMA — SATURA KONFIGURĀCIJA
   config/apps.js

   Vienīgā vieta, kur maina darbvirsmas saturu. Nav būvēšanas
   soļa — saglabā failu un pārlādē lapu.

   Konvencija pārņemta no dizaina sistēmas pašas datu failiem
   (assets/app-icons/systems-data.js → window.RIGA_SYSTEMS), lai
   lapa strādātu arī tieši no faila, bez tīmekļa servera.

   Grupu ikonas: Font Awesome Pro Light nosaukums, piem. 'fa-users'.
   Pilns komplekts ir brand/fonts/fontawesome/.

   Neobligātie lauki: `order` (kārtība), `added` (datums — 30 dienas
   rāda nozīmīti "Jauns"), `env` ('test' vai 'demo'), `owner` un
   `contact` (atbildīgais), `accessUrl` (piekļuves pieprasījums).

   Pilns lauku apraksts: docs/lv/izstrade.md
   Full field reference:  docs/en/development.md

   ⚠ URL vietturi: sešām sistēmām vēl nav zināmas īstās adreses.
     Aizvieto katru `url: '#'` ar reālo adresi pirms publicēšanas.
   ============================================================ */

window.RVPCA_LAUNCHPAD = {
  title: 'RVP CA darbvirsma',

  groups: [
    {
      id: 'iepirkumi',
      order: 1,
      title: 'Iepirkumi un finanses',
      icon: 'fa-file-contract',
      span: 'wide',
      apps: [
        {
          id: 'sagade',
          order: 1,
          title: 'Sagāde',
          desc: 'Iepirkumu datu analīze',
          url: '#',
          mark: 'brand/assets/app-icons/exports/sagade-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/sagade-mono.svg',
          owner: 'Iepirkumu nodaļa',
          contact: 'iepirkumi@riga.lv',
          size: 'lg'
        },
        {
          id: 'budzets',
          order: 2,
          title: 'Budžets',
          desc: 'Budžeta plānošana un izpilde',
          url: '#',
          mono: 'Bu',
          family: 'Blues',
          owner: 'Finanšu departaments',
          contact: 'finanses@riga.lv',
          size: 'lg',
          status: 'izstrade'
        }
      ]
    },

    {
      id: 'cilveki',
      order: 2,
      title: 'Cilvēki',
      icon: 'fa-users',
      span: 'wide',
      apps: [
        {
          id: 'starts',
          order: 1,
          title: 'Starts',
          desc: 'Jauno darbinieku dienas vizualizācija',
          url: '#',
          mark: 'brand/assets/app-icons/exports/starts-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/starts-mono.svg',
          owner: 'Personāla nodaļa',
          contact: 'personals@riga.lv',
          accessUrl: 'https://intranet.riga.lv/piekluve/starts',
          size: 'md'
        },
        {
          id: 'pulss',
          order: 2,
          title: 'Pulss',
          desc: 'Darbinieku viedokļa un aptauju analīze',
          url: '#',
          mark: 'brand/assets/app-icons/exports/pulss-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/pulss-mono.svg',
          owner: 'Personāla nodaļa',
          contact: 'personals@riga.lv',
          size: 'md'
        },
        {
          id: 'izaugsme',
          order: 3,
          title: 'Izaugsme',
          desc: 'Kompetenču ietvaru uzskaite amatu saimēm',
          url: '#',
          mark: 'brand/assets/app-icons/exports/izaugsme-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/izaugsme-mono.svg',
          owner: 'Personāla nodaļa',
          contact: 'personals@riga.lv',
          added: '2026-07-16',
          size: 'lg'
        }
      ]
    },

    {
      id: 'parvaldiba',
      order: 3,
      title: 'Pārvaldība un rīki',
      icon: 'fa-sliders',
      span: 'full',
      apps: [
        {
          id: 'kontrole',
          order: 1,
          title: 'Kontrole',
          desc: 'Risku kontroles un uzraudzības rīks',
          url: '#',
          mark: 'brand/assets/app-icons/exports/kontrole-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/kontrole-mono.svg',
          owner: 'Iekšējā audita nodaļa',
          contact: 'audits@riga.lv',
          accessUrl: 'https://intranet.riga.lv/piekluve/kontrole',
          size: 'lg'
        },
        {
          id: 'sintakse',
          order: 2,
          title: 'Sintakse',
          desc: 'Rīgas dizaina sistēma',
          url: '#',
          mark: 'brand/assets/app-icons/exports/sintakse-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/sintakse-mono.svg',
          owner: 'Komunikācijas pārvalde',
          contact: 'dizains@riga.lv',
          size: 'sm'
        },
        {
          id: 'dokumenti',
          order: 3,
          title: 'Dokumenti',
          desc: 'Dokumentu pārvaldība un versiju vēsture',
          url: '#',
          mono: 'Do',
          family: 'Grays',
          owner: 'Dokumentu pārvaldības nodaļa',
          contact: 'dokumenti@riga.lv',
          size: 'sm',
          status: 'izstrade'
        },
        {
          id: 'analitika',
          order: 4,
          title: 'Analītika',
          desc: 'Pārskati un salīdzinājumi',
          url: '#',
          mono: 'An',
          family: 'Alt Blue',
          owner: 'Analītikas nodaļa',
          contact: 'analitika@riga.lv',
          env: 'test',
          added: '2026-07-16',
          size: 'sm'
        }
      ]
    }
  ]
};
