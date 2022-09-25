import Link from "next/link";
import styles from "./feedbackform.module.scss";

const FeedbackForm = () => {
  return (
    <div className={styles.footer}>
      <p className={styles.title}>
        Anything wrong or missing? <i className="bi bi-bug-fill"></i>
      </p>
      <Link href="https://forms.gle/C2uxuUKqoeqMWfcZ6">
        Contact us and give your feedback
      </Link>
    </div>
  );
};

export default FeedbackForm;
