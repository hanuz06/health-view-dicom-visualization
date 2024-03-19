interface ImageNavigationButtonProps {
  title: string;
  onClick: () => void;
}

const ImageNavigationButton: React.FC<ImageNavigationButtonProps> = ({ title, onClick }) => {
  return (
    <button
      className="px-2 py-3 border flex items-center justify-center ml-1 font-semibold text-white bg-main hover:bg-blue-700"
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default ImageNavigationButton;
