type ButtonProps = {
  title: string;
  onClick?: () => void;
};

const ImageManipulationButton: React.FC<ButtonProps> = ({ title, onClick }) => {
  return (
    <button
      className="bg-white hover:border-mainzinc-200 px-2 py-3 flex items-center justify-center font-semibold"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ImageManipulationButton;
