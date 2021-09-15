import { AvgTimingDTO } from '@synterra/shared/dist/class/avg-timing';

export const TAG_PRIORITIES = new Map<number, string>([
  [68231, '1'],
  [68232, '1'],
  [70806, '1'],
  [68234, '2'],
  [68233, '3'],
  [68236, '4'],
  [68237, '4'],
]);

export const CITY_DURATION = new Map<string, number>([
  ['Galluis', 11],
  ['Vicq', 10],
  ['Méré', 11],
  ['Boissy-sans-Avoir', 10],
  ['Auteuil-le-Roi', 12],
  ['Auteuil', 12],
  ['Gambais', 16],
  ['La Queue-lez-Yvelines', 13],
  ["Montfort-l'Amaury", 14],
  ['Neauphle-le-Vieux', 13],
  ['Saulx-Marchais', 15],
  ['Mareil-le-Guyon', 14],
  ['Bazoches-sur-Guyonne', 16],
  ['Grosrouvre', 16],
  ['Millemont', 14],
  ['Garancières', 15],
  ['Autouillet', 14],
  ['Le Tremblay-sur-Mauldre', 20],
  ['Villiers-Saint-Frédéric', 16],
  ['Les Mesnuls', 17],
  ['Marcq', 15],
  ['Thoiry', 15],
  ['Jouars-Pontchartrain', 18],
  ['Villiers-le-Mahieu', 18],
  ["Saint-Rémy-l'Honoré", 22],
  ['Flexanville', 20],
  ['Béhoust', 18],
  ['Orgerus', 21],
  ['Neauphle-le-Château', 18],
]);

// Backlog 10002
// Select 10003
// In progres  3
// Pass 10013
// Done 10001

export const JIRA_PROGRESS_COLUMN_ID = '3';

// VARIABLE DATA

// TODO uncomment this
export const TAG_COMPOSANT = new Map<number, string>([
  [68231, '10006'], //BURGER BURGER
  [70806, '10006'], //Menu enfant aka cheeseburger
  [68232, '10009'],
  [68234, '10007'], // Accompagnement - Friteuse
  [68233, '10008'], // Salade
  [80177, '10008'], // Aperitivo
  // [68236, '4'],
  // [68237, '4'],
]);
export const defaultComponent = { id: '10010' };
export const currentJiraProject = { id: '10001' };
export const COMPOSANT_CAPACITY = new Map<string, number>([
  ['10006', 8], //BURGER BURGER
  ['10007', 8], // Accompagnement - Friteuse
  ['10009', 1], // THAI
  ['10008', 1], // Salade
  ['10010', 30], // Others
]);

export function getStaticDuration() {
  const COMPOSANT_DURATION_STATIC: AvgTimingDTO = {
    '10006': {
      '3': {
        count: 1,
        offset: 5 * 60 * 1000,
      },
    },
    '10007': {
      '3': {
        count: 1,
        offset: 4 * 60 * 1000,
      },
    },
    '10009': {
      '3': {
        count: 1,
        offset: 4 * 60 * 1000,
      },
    },
    '10008': {
      '3': {
        count: 1,
        offset: 4 * 60 * 1000,
      },
    },
    '10010': {
      '3': {
        count: 1,
        offset: 0 * 60 * 1000,
      },
    },
  };

  return COMPOSANT_DURATION_STATIC;
}

// LOCAL DATA

// export const TAG_COMPOSANT = new Map<number, string>([
//   [68231, '10013'], //BURGER BURGER
//   [70806, '10013'], //Menu enfant aka cheeseburger
//   [68234, '10014'], // Accompagnement - Friteuse
//   [68232, '10011'], // THAI
//   [68233, '10012'], // Salade
//   [80177, '10012'], // Aperitivo
//   // [68236, '4'],
//   // [68237, '4'],
// ]);

// export const COMPOSANT_CAPACITY = new Map<string, number>([
//   ['10013', 8], //BURGER BURGER
//   ['10014', 8], // Accompagnement - Friteuse
//   ['10011', 1], // THAI
//   ['10012', 1], // Salade
//   ['10015', 30], // Others
// ]);

// export const COMPOSANT_DURATION_STATIC: AvgTimingDTO = {
//   '10013': {
//     '3': {
//       count: 1,
//       offset: 5 * 60 * 1000,
//     },
//   },
//   '10014': {
//     '3': {
//       count: 1,
//       offset: 4 * 60 * 1000,
//     },
//   },
//   '10011': {
//     '3': {
//       count: 1,
//       offset: 4 * 60 * 1000,
//     },
//   },
//   '10012': {
//     '3': {
//       count: 1,
//       offset: 4 * 60 * 1000,
//     },
//   },
//   '10015': {
//     '3': {
//       count: 1,
//       offset: 0 * 60 * 1000,
//     },
//   },
// };

// export const defaultComponent = { id: '10015' };
// export const currentJiraProject = { id: '10007' };
