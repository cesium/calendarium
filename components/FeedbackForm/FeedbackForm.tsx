import Link from "next/link";
import styles from "./feedbackform.module.scss";

const FeedbackForm = () => {
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

export default FeedbackForm;
