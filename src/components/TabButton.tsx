interface Props {
  optionId: number;
  selectedOptionId: number;
  text: string;
  handleOnClick: () => void;
}

export const TabButton = ({ optionId, selectedOptionId, text, handleOnClick }: Props) => {
  return (
    <button
      onClick={handleOnClick}
      role="tab"
      className={`rounded-none sm:w-auto sm:block tab text-white h-full transition ${
        optionId === selectedOptionId ? 'border-x-4 border-x-white' : ''
      }`}
      style={
        optionId === selectedOptionId
          ? { borderRight: '2px solid white', borderLeft: '2px solid white' }
          : {}
      }
    >
      {text}
    </button>
  );
};

