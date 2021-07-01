import {
  CreateComponent,
  CreatePriority,
} from '../../jira/models/jira-issue-created.dto';
import { DishDTO } from '../../zelty/models/dish';

const TAG_PRIORITIES = new Map<number, string>([
  [68231, '1'],
  [68232, '1'],
  [70806, '1'],
  [68234, '2'],
  [68233, '3'],
  [68236, '4'],
  [68237, '4'],
]);

export function selectPriority(dish: DishDTO): CreatePriority | undefined {
  const priority = dish.tags
    .filter((t) => TAG_PRIORITIES.has(t))
    .map((t) => TAG_PRIORITIES.get(t));

  return priority[0] ? { id: priority[0] } : undefined;
}

// TODO uncomment this
const TAG_COMPOSANT = new Map<number, string>([
  [68231, '10006'], //BURGER BURGER
  [70806, '10006'], //Menu enfant aka cheeseburger
  [68232, '10009'],
  [68234, '10007'], // Accompagnement - Friteuse
  [68233, '10008'], // Salade
  [80177, '10008'], // Aperitivo
  // [68236, '4'],
  // [68237, '4'],
]);

// const TAG_COMPOSANT = new Map<number, string>([
//   [68231, '10013'], //BURGER BURGER
//   [70806, '10013'], //Menu enfant aka cheeseburger
//   [68232, '10011'],
//   [68234, '10014'], // Accompagnement - Friteuse
//   [68233, '10012'], // Salade
//    [80177, '10012'], // Aperitivo
//   // [68236, '4'],
//   // [68237, '4'],
// ]);

export function findJiraComponent(dish: DishDTO): CreateComponent | undefined {
  const component = dish.tags
    .filter((t) => TAG_COMPOSANT.has(t))
    .map((t) => TAG_COMPOSANT.get(t));

  // TODO uncomment this
  return component[0] ? { id: component[0] } : { id: '10010' };
  // return component[0] ? { id: component[0] } : { id: '10015' };
}

// [
//   {
//       "self": "https://hubert-campagne.atlassian.net/rest/api/2/component/10006",
//       "id": "10006",
//       "name": "BURGER",
//       "description": "Poste burger de la cuisine.",
//       "assigneeType": "PROJECT_DEFAULT",
//       "realAssigneeType": "PROJECT_DEFAULT",
//       "isAssigneeTypeValid": false,
//       "project": "HCT",
//       "projectId": 10001
//   },
//   {
//       "self": "https://hubert-campagne.atlassian.net/rest/api/2/component/10007",
//       "id": "10007",
//       "name": "FRITEUSE",
//       "description": "Poste friteuse de la cuisine",
//       "assigneeType": "PROJECT_DEFAULT",
//       "realAssigneeType": "PROJECT_DEFAULT",
//       "isAssigneeTypeValid": false,
//       "project": "HCT",
//       "projectId": 10001
//   },
//   {
//       "self": "https://hubert-campagne.atlassian.net/rest/api/2/component/10008",
//       "id": "10008",
//       "name": "SALADE",
//       "description": "Poste salade de la cuisine",
//       "assigneeType": "PROJECT_DEFAULT",
//       "realAssigneeType": "PROJECT_DEFAULT",
//       "isAssigneeTypeValid": false,
//       "project": "HCT",
//       "projectId": 10001
//   },
//   {
//       "self": "https://hubert-campagne.atlassian.net/rest/api/2/component/10009",
//       "id": "10009",
//       "name": "THAI",
//       "description": "Poste thaï de la cuisine",
//       "assigneeType": "PROJECT_DEFAULT",
//       "realAssigneeType": "PROJECT_DEFAULT",
//       "isAssigneeTypeValid": false,
//       "project": "HCT",
//       "projectId": 10001
//   }
// ]

// burgers : très haute priorité

// thaïe : très haute priorité

// frites : haute priorité

// salade : priorité moyenne

// boissons : faible priorité

// desserts sauf glace : faible priorité

// glaces : très faible priorité

// const priorities = [
//   {
//     self: 'https://hubert-campagne.atlassian.net/rest/api/2/priority/1',
//     statusColor: '#d04437',
//     description: 'This problem will block progress.',
//     iconUrl:
//       'https://hubert-campagne.atlassian.net/images/icons/priorities/highest.svg',
//     name: 'Highest',
//     id: '1',
//   },
//   {
//     self: 'https://hubert-campagne.atlassian.net/rest/api/2/priority/2',
//     statusColor: '#f15C75',
//     description: 'Serious problem that could block progress.',
//     iconUrl:
//       'https://hubert-campagne.atlassian.net/images/icons/priorities/high.svg',
//     name: 'High',
//     id: '2',
//   },
//   {
//     self: 'https://hubert-campagne.atlassian.net/rest/api/2/priority/3',
//     statusColor: '#f79232',
//     description: 'Has the potential to affect progress.',
//     iconUrl:
//       'https://hubert-campagne.atlassian.net/images/icons/priorities/medium.svg',
//     name: 'Medium',
//     id: '3',
//   },
//   {
//     self: 'https://hubert-campagne.atlassian.net/rest/api/2/priority/4',
//     statusColor: '#707070',
//     description: 'Minor problem or easily worked around.',
//     iconUrl:
//       'https://hubert-campagne.atlassian.net/images/icons/priorities/low.svg',
//     name: 'Low',
//     id: '4',
//   },
//   {
//     self: 'https://hubert-campagne.atlassian.net/rest/api/2/priority/5',
//     statusColor: '#999999',
//     description: 'Trivial problem with little or no impact on progress.',
//     iconUrl:
//       'https://hubert-campagne.atlassian.net/images/icons/priorities/lowest.svg',
//     name: 'Lowest',
//     id: '5',
//   },
// ];

// const a = {
//   tags: [
//     {
//       id: 68231,
//       name: 'LES TONTONS BURGER',
//       img: null,
//       description: null,
//       id_parent: 0,
//       color: [0.9411764705882353, 0.7490196078431373, 0.34901960784313724],
//       o: 10,
//       meta: null,
//       remote_id: null,
//       zc_only: false,
//       zc_hidden: false,
//     },
//     {
//       id: 68232,
//       name: 'COBRA THAÏ',
//       img: null,
//       description: null,
//       id_parent: 0,
//       color: [0.9882352941176471, 0.7764705882352941, 0],
//       o: 20,
//       meta: null,
//       remote_id: null,
//       zc_only: false,
//       zc_hidden: false,
//     },
//     {
//       id: 68233,
//       name: 'SALAD ADDICT',
//       img: null,
//       description: null,
//       id_parent: 0,
//       color: [0.9490196078431372, 0.6549019607843137, 0.5725490196078431],
//       o: 30,
//       meta: null,
//       remote_id: null,
//       zc_only: false,
//       zc_hidden: false,
//     },
//     {
//       id: 70806,
//       name: 'MENU ENFANT',
//       img: null,
//       description: null,
//       id_parent: 0,
//       color: [1, 1, 1],
//       o: 40,
//       meta: null,
//       remote_id: null,
//       zc_only: false,
//       zc_hidden: false,
//     },
//     {
//       id: 68234,
//       name: 'Accompagnements',
//       img: null,
//       description: null,
//       id_parent: 0,
//       color: [0.08627450980392157, 0.611764705882353, 0.47058823529411764],
//       o: 50,
//       meta: null,
//       remote_id: null,
//       zc_only: false,
//       zc_hidden: false,
//     },
//     {
//       id: 68236,
//       name: 'Les boissons',
//       img: null,
//       description: null,
//       id_parent: 0,
//       color: [0.7333333333333333, 0.5098039215686274, 0.3764705882352941],
//       o: 60,
//       meta: null,
//       remote_id: null,
//       zc_only: false,
//       zc_hidden: false,
//     },
//     {
//       id: 68237,
//       name: 'Les desserts',
//       img: null,
//       description: null,
//       id_parent: 0,
//       color: [0.00784313725490196, 0.796078431372549, 0.7490196078431373],
//       o: 70,
//       meta: null,
//       remote_id: null,
//       zc_only: false,
//       zc_hidden: false,
//     },
//   ],
//   errno: 0,
// };
