import styles from "./footer.module.scss";

const Footer = () => {
  return (
    <div className={styles.footer}>
      <p className={styles.title}>
        Anything wrong or missing? <i className="bi bi-bug-fill"></i>
      </p>
      <a
        href="https://forms.gle/C2uxuUKqoeqMWfcZ6"
        style={{ color: "rgb(24, 144, 255, 1)" }}
      >
        Contact us and give your feedback
      </a>
    </div>
  );
};

export default Footer;
