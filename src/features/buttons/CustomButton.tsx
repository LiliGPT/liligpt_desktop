interface Props {
  label: string;
  onClick: () => void;
  size: 'small' | 'medium' | 'large';
  color: 'error' | 'success' | 'text-error' | 'text-success';
  className?: string;
}

export function CustomButton(props: Props) {
  const { label, onClick, size, color } = props;
  let className = 'border-2 rounded-md cursor-pointer';
  if (size === 'small') {
    className += ' px-2 py-0.5 mx-0.5 mt-0.5';
  }
  if (color === 'error') {
    className += ' bg-red-100 border-red-200 hover:bg-red-200 hover:border-red-300 text-red-800';
  } else if (color === 'success') {
    className += ' bg-green-100 border-green-200 hover:bg-green-200 hover:border-green-300 text-green-800';
  } else if (color === 'text-error') {
    className += ' text-red-600 border-none bg-opacity-20 hover:bg-red-500 hover:text-red-900 hover:bg-opacity-40';
  } else if (color === 'text-success') {
    className += ' text-green-600 border-none bg-opacity-20 hover:bg-green-500 hover:text-green-900 hover:bg-opacity-40';
  }
  if (props.className) className += ` ${props.className}`;
  return (
    <button
      onClick={onClick}
      className={className}
    >{label}</button>
  );
}