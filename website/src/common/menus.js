import find from 'lodash/find';

export const groupByParent = menus => {
  const remove = [];
  menus.forEach(m => {
    if (m.parent) {
      const parent = find(menus, x => x.name === m.parent);
      if (parent) {
        parent.menu = parent.menu || [];
        parent.menu.push(m);
        remove.push(m.id);
      }
    }
  });
  return menus.filter(m => find(remove, id => id === m.id) === undefined);
};
