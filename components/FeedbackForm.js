import Link from "next/link";

const FeedbackForm = () => {
  return (
    <div className="txt-container-border text-center">
      <p>Alguma informação errada ou incorreta?</p>
      <Link href="https://forms.gle/C2uxuUKqoeqMWfcZ6">
        Dá-nos o teu feedback
      </Link>
    </div>
  );
};

export default FeedbackForm;
