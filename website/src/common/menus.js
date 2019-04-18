
export const groupByParent = menus => {
  const remove = [];
  menus.forEach(m => {
    if (m.parent) {
      const parent = _.find(menus, x => x.name === m.parent)
      if (parent) {
        parent.menu = parent.menu || [];
        parent.menu.push(m);
        remove.push(m.id);
      }
    }
  })
  return menus.filter(m => _.find(remove, id => id === m.id) === undefined);
}