import { type Categorization, mapStateToLayoutProps } from '@jsonforms/core';
import { type LayoutProps, useControl } from '@jsonforms/vue';

export const useJsonFormsCategorization = (props: LayoutProps) => {
  const { control, ...other } = useControl(props, mapStateToLayoutProps);

  const categories = (control.value.uischema as Categorization).elements.map(
    (category) => {
      const categoryProps: LayoutProps = {
        ...props,
        uischema: category,
      };

      return useControl(categoryProps, mapStateToLayoutProps).control;
    }
  );

  return { layout: control, categories, ...other };
};
