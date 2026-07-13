import { Pinwheel } from 'ldrs/react';
import 'ldrs/react/Pinwheel.css';

const LoadingSpinner = ({ size = "45", color = "#00f2fe" }) => {
  return (
    <div className="loader-card">
      <Pinwheel
        size={size}
        stroke="4"
        speed="0.9"
        color={color}
      />
      <span>Loading premium goods...</span>
    </div>
  );
};

export default LoadingSpinner;
