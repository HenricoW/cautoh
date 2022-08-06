import React from "react";

import styles from "./VehicleOptions.module.scss";

interface RenderVehicleOptionsProps {
  name: "Year" | "Make" | "Model";
  arrayData: string[];
  setterStr?: (val: string) => void;
  setterNum?: (val: number) => void;
}

const RenderVehicleOptions = ({ name, arrayData, setterStr, setterNum }: RenderVehicleOptionsProps) => {
  return (
    <select
      className={styles.select}
      name={`${name.toLowerCase()}s`}
      id={`${name.toLowerCase()}s`}
      onChange={(e) => (name === "Year" ? setterNum?.(+e.target.value) : setterStr?.(e.target.value))}
    >
      <option value="">{name}</option>
      {arrayData.map((item) => (
        <option key={item} value={item}>
          {item}
        </option>
      ))}
    </select>
  );
};

export default React.memo(RenderVehicleOptions);
