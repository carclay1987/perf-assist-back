declare module '@nejadipour/react-modern-datepicker' {
  import * as React from 'react';

  export interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    minDate?: string;
    maxDate?: string;
    format?: string;
    className?: string;
    inputClassName?: string;
    placeholder?: string;
    disabled?: boolean;
    /**
     * Вызывается при сабмите/подтверждении выбора даты, если библиотека это поддерживает.
     */
    onSubmit?: () => void;
  }

  const DatePicker: React.FC<DatePickerProps>;
  export default DatePicker;
}
