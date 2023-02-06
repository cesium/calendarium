const Legend = () => {
  return (
    <div
      style={{ margin: "0.6rem 0 0 0", fontFamily: "Inter", fontWeight: "500" }}
    >
      <i className="bi bi-circle-fill" style={{ color: "var(--orange)" }}></i> T
      <i
        className="bi bi-circle-fill"
        style={{ color: "#c65932", marginLeft: "1rem" }}
      ></i>{" "}
      TP / PL
    </div>
  );
};

export default Legend;
