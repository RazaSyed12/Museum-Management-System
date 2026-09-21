import * as React from 'react';
export interface ImageUploadProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When set, the filled state (thumbnail + filename + Remove) renders instead of the dropzone. */
  fileName?: string;
  hint?: string;
  onRemove?: () => void;
  invalid?: boolean;
}
export declare function ImageUpload(props: ImageUploadProps): JSX.Element;
