import * as React from 'react';
export interface QuantityStepperProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  min?: number;
  /** Cap at remaining availability (or the member allocation for member tickets). */
  max?: number;
  onChange?: (value: number) => void;
  /** Ticket type name, used to build the buttons' accessible names. */
  label?: string;
  disabled?: boolean;
}
export declare function QuantityStepper(props: QuantityStepperProps): JSX.Element;
