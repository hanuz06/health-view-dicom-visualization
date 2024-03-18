import { RefObject } from "react";

type ButtonProps = {
  title: string;
  onClick?: () => void;
};

const ImageManipulationButton = ({ title, onClick }: ButtonProps) => {
  return (
    <button
      className='bg-white hover:border-zinc-200 px-2 py-3 flex items-center justify-center font-semibold'
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ImageManipulationButton;
