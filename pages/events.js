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
*/ 

export default [
    {
      title: "CeSIUM - Evento top",
      start: new Date(2022,7,16,13,0),
      end: new Date(2022,7,16,15,30),
      groupId: 0
    },

    {
        title: "Algoritmos - Teste",
        start: new Date(2022,7,18,15,0),
        end: new Date(2022,7,18,18,0),
        groupId: 2
    },

    {
        title: "PF - 50 questoes Teste",
        start: new Date(2022,7,18,10,0),
        end: new Date(2022,7,18,11,45),
        groupId: 1
    },

    {
        title: "CeSIUM - Fim Summer Camp :(",
        start: new Date(2022,6,27,18,0),
        end: new Date(2022,6,27,19,30),
        groupId: 0
    },

    {
        title: "LI4 - Entrega",
        start: new Date(2022,7,31,0,0),
        end: new Date(2022,7,31,23,59),
        groupId: 3
    },

    {
        title: "Calculo - Mini-teste",
        start: new Date(2022,7,18,15,30),
        end: new Date(2022,7,18,16,30),
        groupId: 1
    },
]