type TitleProps = {
  title: string;
  description: string;
};

const Title = ({ title, description }: TitleProps) => {
  return (
    <>
      <div id='demo-title-container'>
        <h1 id='demo-title'>{title}</h1>
      </div>
      <div id='demo-description-container'>
        <p id='demo-description'>{description}</p>
      </div>
    </>
  );
};

export default Title;
