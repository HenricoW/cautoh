import React from "react";

type DistancesProps = {
  distance: number;
};

const Distances = ({ distance }: DistancesProps) => {
  return (
    <div>
      <h4>Distance: {(distance / 1000).toFixed(3)} km</h4>
      <h4>Distance: {(distance / 1609).toFixed(3)} mi</h4>
    </div>
  );
};

export default Distances;
