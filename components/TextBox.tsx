import emailjs from "emailjs-com";

const TextBox = () => {
  function sendEmail(e) {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_oxvmxpc",
        "template_cqb2zyg",
        e.target,
        "53zgb406krqnsJIF_"
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => console.log(err));
  }

  return (
    <div className="txt-container-border">
      <h1 style={{ marginTop: "25px", fontWeight: "bold" }}>
        Box for suggestions!
      </h1>
      <form className="txt-caixa" onSubmit={sendEmail}>
        <label>Name</label>
        <input type="text" name="name" className="form-control" />

        <label>Email</label>
        <input type="email" name="user_email" className="form-control" />

        <label className="txt-msg">Message</label>

        <textarea name="message" rows={4} className="form-control" />

        <input type="submit" value="Send" className="txt-send-button" />
      </form>
    </div>
  );
};

export default TextBox;
