import type { FC } from 'react';
import WidgetContainer from 'components/WidgetContainer';
import Content from 'components/Modern/Content';
import { MeasuresFixed } from 'types/global-types';

const Modern:FC = () => <WidgetContainer content={Content} id="modern-container" />;

const createStyleTag = () => {
  const style = document.createElement('style');
  style.innerText = `
#selections-modern-container .ui.disabled.input, .ui.input:not(.disabled) input[disabled] {
  opacity: 1;
}
#selections-modern-container .ui.corner.label {
  width: 2.8em;
  padding-top: 2px;
}
#selections-modern-container > div:nth-child(2) > div > div.visible.menu.transition {
  max-height: ${MeasuresFixed.HEIGHT}!important;
}
#selections-modern-container > div:nth-child(2) > div > input[type=text] {
  border-top-left-radius: 0px!important;
  border-bottom-left-radius: 0px!important;
  border-left-color: #e8e8e8;
}
#selections-modern-container > div:nth-child(2) {
  padding-left: 0;
}
#selections-modern-container > div:nth-child(1) > div {
  border-top-right-radius: 0px!important;
  border-bottom-right-radius: 0px!important;
}
#selections-modern-container > div:nth-child(1) {
  padding-right: 0;
}
  `;
  window.self.document.body.appendChild(style);
};

createStyleTag();

export default Modern;
