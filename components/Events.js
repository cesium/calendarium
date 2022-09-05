/*
Format -> Date (YYYY, MM, DD, HH, Min)
Month count starts with 0 (January -> 0; February -> 1; March -> 2;...)

Group Id:
0 -> CeSIUM activities
1 -> First Year (Graduation)
2 -> Second Year (Graduation)
3 -> Third Year (Graduation)
4 -> First Year (Masters)
5 -> Second Year (Masters)
6 -> UMinho activities
*/



export default [
  {
    title: "CeSIUM - Evento top",
    start: new Date(2022, 7, 16, 13, 0),
    end: new Date(2022, 7, 16, 15, 30),
    groupId: 0,
    filterId: 0,
  },

  {
    title: "Algoritmos - Teste",
    start: new Date(2022, 7, 18, 15, 0),
    end: new Date(2022, 7, 18, 18, 0),
    groupId: 2,
    filterId: 211,
  },

  {
    title: "PF - 50 questoes Teste",
    start: new Date(2022, 7, 18, 10, 0),
    end: new Date(2022, 7, 18, 11, 45),
    groupId: 1,
    filterId: 114,
  },

  {
    title: "CeSIUM - Fim Summer Camp :(",
    start: new Date(2022, 6, 27, 14, 0),
    end: new Date(2022, 6, 27, 20, 0),
    groupId: 0,
    filterId: 0,
  },

  {
    title: "LI4 - Entrega",
    start: new Date(2022, 7, 31, 0, 0),
    end: new Date(2022, 7, 31, 23, 59),
    groupId: 3,
    filterId: 315,
  },

  {
    title: "Calculo - Mini-teste",
    start: new Date(2022, 7, 18, 15, 30),
    end: new Date(2022, 7, 18, 16, 30),
    groupId: 1,
    filterId: 112,
  },

  {
    title: "PI - 51 questoes Teste",
    start: new Date(2022, 7, 25, 10, 0),
    end: new Date(2022, 7, 25, 11, 45),
    groupId: 1,
    filterId: 125,
  },

  {
    title: "UMinho - Propinas",
    start: new Date(2022, 6, 10, 0, 0),
    end: new Date(2022, 6, 10, 23, 59),
    groupId: 6,
    filterId: 1,
  },

  {
    title: "VC - Teste Fácil",
    start: new Date(2022, 6, 25, 18, 0),
    end: new Date(2022, 6, 25, 19, 30),
    groupId: 4,
    filterId: 421,
  },

  {
    title: "VI - Teste Dificil",
    start: new Date(2022, 6, 15, 14, 0),
    end: new Date(2022, 6, 15, 16, 30),
    groupId: 4,
    filterId: 421,
  },

  {
    title: "VTR - Entrega Trabalho",
    start: new Date(2022, 6, 30, 0, 0),
    end: new Date(2022, 6, 30, 23, 59),
    groupId: 4,
    filterId: 421,
  },

  {
    title: "Dissertação - Entrega Final",
    start: new Date(2022, 7, 1, 0, 0),
    end: new Date(2022, 7, 1, 23, 59),
    groupId: 5,
    filterId: 52,
  },
];
