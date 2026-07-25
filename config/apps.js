/* ============================================================
   RĪGAS DARBVIRSMA — SATURA KONFIGURĀCIJA
   config/apps.js

   Vienīgā vieta, kur maina darbvirsmas saturu. Nav būvēšanas
   soļa — saglabā failu un pārlādē lapu.

   Konvencija pārņemta no dizaina sistēmas pašas datu failiem
   (assets/app-icons/systems-data.js → window.RIGA_SYSTEMS), lai
   lapa strādātu arī tieši no faila, bez tīmekļa servera.

   Grupu ikonas: Font Awesome Pro Light nosaukums, piem. 'fa-users'.
   Pilns komplekts ir brand/fonts/fontawesome/.

   Pilns lauku apraksts: docs/lv/izstrade.md
   Full field reference:  docs/en/development.md

   ⚠ URL vietturi: sešām sistēmām vēl nav zināmas īstās adreses.
     Aizvieto katru `url: '#'` ar reālo adresi pirms publicēšanas.
   ============================================================ */

window.RVPCA_LAUNCHPAD = {
  title: 'Rīgas darbvirsma',
  lead: 'Rīgas valstspilsētas pašvaldības iekšējās lietotnes.',

  groups: [
    {
      id: 'iepirkumi',
      title: 'Iepirkumi un finanses',
      icon: 'fa-file-contract',
      span: 'wide',
      apps: [
        {
          id: 'sagade',
          title: 'Sagāde',
          desc: 'Iepirkumu datu analīze',
          url: '#',
          mark: 'brand/assets/app-icons/exports/sagade-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/sagade-mono.svg',
          size: 'lg'
        },
        {
          id: 'budzets',
          title: 'Budžets',
          desc: 'Budžeta plānošana un izpilde',
          url: '#',
          mono: 'Bu',
          family: 'Blues',
          size: 'lg',
          status: 'izstrade'
        }
      ]
    },

    {
      id: 'cilveki',
      title: 'Cilvēki',
      icon: 'fa-users',
      span: 'wide',
      apps: [
        {
          id: 'starts',
          title: 'Starts',
          desc: 'Jauno darbinieku dienas vizualizācija',
          url: '#',
          mark: 'brand/assets/app-icons/exports/starts-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/starts-mono.svg',
          size: 'md'
        },
        {
          id: 'pulss',
          title: 'Pulss',
          desc: 'Darbinieku viedokļa un aptauju analīze',
          url: '#',
          mark: 'brand/assets/app-icons/exports/pulss-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/pulss-mono.svg',
          size: 'md'
        },
        {
          id: 'izaugsme',
          title: 'Izaugsme',
          desc: 'Kompetenču ietvaru uzskaite amatu saimēm',
          url: '#',
          mark: 'brand/assets/app-icons/exports/izaugsme-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/izaugsme-mono.svg',
          size: 'lg'
        }
      ]
    },

    {
      id: 'parvaldiba',
      title: 'Pārvaldība un rīki',
      icon: 'fa-sliders',
      span: 'full',
      apps: [
        {
          id: 'kontrole',
          title: 'Kontrole',
          desc: 'Risku kontroles un uzraudzības rīks',
          url: '#',
          mark: 'brand/assets/app-icons/exports/kontrole-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/kontrole-mono.svg',
          size: 'lg'
        },
        {
          id: 'sintakse',
          title: 'Sintakse',
          desc: 'Rīgas dizaina sistēma',
          url: '#',
          mark: 'brand/assets/app-icons/exports/sintakse-colored.svg',
          markMuted: 'brand/assets/app-icons/exports/sintakse-mono.svg',
          size: 'sm'
        },
        {
          id: 'dokumenti',
          title: 'Dokumenti',
          desc: 'Dokumentu pārvaldība un versiju vēsture',
          url: '#',
          mono: 'Do',
          family: 'Grays',
          size: 'sm',
          status: 'izstrade'
        },
        {
          id: 'analitika',
          title: 'Analītika',
          desc: 'Pārskati un salīdzinājumi',
          url: '#',
          mono: 'An',
          family: 'Alt Blue',
          size: 'sm'
        }
      ]
    }
  ]
};
