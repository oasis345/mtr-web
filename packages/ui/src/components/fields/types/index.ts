export interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  children?: React.ReactNode;
  label?: string;
}

export interface NumberFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: boolean;
}
