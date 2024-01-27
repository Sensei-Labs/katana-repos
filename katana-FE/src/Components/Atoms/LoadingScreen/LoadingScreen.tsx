import { SpinStyle } from './style';

const LoadingScreen = () => {
  return (
    <div className="w-screen h-screen bg-background flex justify-center items-center">
      <SpinStyle size="large" />
    </div>
  );
};

export default LoadingScreen;
