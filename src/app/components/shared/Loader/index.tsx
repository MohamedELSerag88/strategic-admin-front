import React from "react";
import "./index.scss";

const Loader: React.FC = (props) => {
  return (
    <div
      style={{
        width: "100%",
        textAlign: "center",
        marginTop: props?.marginTop || "20px",
      }}
    >
      <span
        className="loader"
        style={{
          ...(props?.size ? { width: props?.size, height: props?.size } : {}),
          ...(props?.borderSize ? { borderWidth: props?.borderSize } : {}),
        }}
      ></span>
    </div>
  );
};

export default Loader;
