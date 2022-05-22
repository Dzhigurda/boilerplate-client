export const userTester = {
  id: 1,
  firstName: 'A',
  lastName: 'B',
  secondName: 'C',
  STATUS: '',
  role: 1,
  roleRef: {
    id: 1,
    name: 'Tester',
    comment: 'Only testing',
    right: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14],
  },
};

export const users = [
  {
    id: 1,
    STATUS: 'CHECKED',
    contacts: [
      { id: 2, userId: 1, title: 'Home', type: 1, value: '79055230881' },
    ],
    role: 7,
    firstName: 'Anton',
    secondName: 'Alex',
    lastName: 'Dzhigurda',
    roleRef: {
      id: 7,
      name: 'Администратор',
      comment:
        'Администрирует сотрудников журнала, выдаёт права, может блокировать и удалять любых пользователей',
      right: [3, 2, 6, 5, 8, 1, 9, 4, 7, 10, 13, 17, 11, 12, 14, 15, 18],
    },
  },
  {
    id: 8,
    STATUS: 'CHECKED',
    contacts: [
      { id: 4, userId: 8, title: 'Не мой', type: 1, value: '79095328452' },
    ],
    role: 3,
    firstName: 'Kirill',
    secondName: 'D',
    lastName: 'Akimov',
    roleRef: {
      id: 3,
      name: 'Журналист',
      comment:
        'Пишет статьи по редакционному заданию, может посещать редколлегии и предлагать материалы',
      right: [3, 2, 6, 4, 5, 10, 12],
    },
  },
];
