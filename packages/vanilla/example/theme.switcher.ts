const knownThemes : {[key: string]: string} = {
  normal: 'Normal Label Top',
  dark: 'Dark label Top',
  labelFixed: 'Label left Fixed'
};
const changeTheme = (style: string) => {
  document.body.className = style;
};
export const createThemeSelection = () => {
  const themeDiv = document.getElementById('theme');

  const select = document.createElement('select');
  select.id = 'example_theme';
  Object.keys(knownThemes).forEach(key => {
    const style = knownThemes[key];
    const option = document.createElement('option');
    option.value = key;
    option.label = style;
    option.text = style;
    select.appendChild(option);
  });
  select.onchange = () => {
    changeTheme(select.value);
  };

  const themeLabel = document.createElement('label');
  themeLabel.textContent = 'Theme:';
  themeLabel.htmlFor = 'example_theme';

  themeDiv.appendChild(themeLabel);
  themeDiv.appendChild(select);
};
