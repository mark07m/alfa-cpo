import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from './Input';
import { Select } from './Select';
import { Textarea } from './Textarea';

interface BaseFieldProps {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

interface InputFieldProps extends BaseFieldProps {
  type: 'input';
  inputProps?: React.ComponentProps<typeof Input>;
}

interface SelectFieldProps extends BaseFieldProps {
  type: 'select';
  selectProps?: React.ComponentProps<typeof Select>;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

interface TextareaFieldProps extends BaseFieldProps {
  type: 'textarea';
  textareaProps?: React.ComponentProps<typeof Textarea>;
}

type FormFieldProps = InputFieldProps | SelectFieldProps | TextareaFieldProps;

export function FormField(props: FormFieldProps) {
  const { label, error, helperText, required, className } = props;

  const fieldId = React.useId();
  const errorId = `${fieldId}-error`;
  const helperId = `${fieldId}-helper`;

  const renderField = () => {
    switch (props.type) {
      case 'input':
        return (
          <Input
            id={fieldId}
            label={label}
            error={error}
            helperText={helperText}
            required={required}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            {...props.inputProps}
          />
        );
      
      case 'select':
        return (
          <Select
            id={fieldId}
            label={label}
            error={error}
            helperText={helperText}
            required={required}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            {...props.selectProps}
          >
            {props.options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
              >
                {option.label}
              </option>
            ))}
          </Select>
        );
      
      case 'textarea':
        return (
          <Textarea
            id={fieldId}
            label={label}
            error={error}
            helperText={helperText}
            required={required}
            aria-describedby={error ? errorId : helperText ? helperId : undefined}
            aria-invalid={!!error}
            {...props.textareaProps}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className={cn('w-full', className)}>
      {renderField()}
    </div>
  );
}

// Хук для управления состоянием формы
export function useFormField<T>(initialValue: T) {
  const [value, setValue] = React.useState<T>(initialValue);
  const [error, setError] = React.useState<string | undefined>();
  const [touched, setTouched] = React.useState(false);

  const handleChange = React.useCallback((newValue: T) => {
    setValue(newValue);
    if (error) {
      setError(undefined);
    }
  }, [error]);

  const handleBlur = React.useCallback(() => {
    setTouched(true);
  }, []);

  const setFieldError = React.useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const clearError = React.useCallback(() => {
    setError(undefined);
  }, []);

  const reset = React.useCallback(() => {
    setValue(initialValue);
    setError(undefined);
    setTouched(false);
  }, [initialValue]);

  return {
    value,
    error,
    touched,
    handleChange,
    handleBlur,
    setFieldError,
    clearError,
    reset
  };
}
