import Link from "next/link";

const FeedbackForm = () => {
  return (
    <div className="w-full text-center">
      <p>Anything wrong or missing?</p>
      <Link href="https://forms.gle/C2uxuUKqoeqMWfcZ6">
        Contact us and give your feedback
      </Link>
    </div>
  );
};

export default FeedbackForm;
