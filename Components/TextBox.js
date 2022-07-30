import emailjs from "emailjs-com";

let email_service = process.env.PRIVATE_ID_EMAIL_SERVICE

let template = process.env.PRIVATE_ID_TEMPLATE

let user = process.env.PRIVATE_ID_USER

const TextBox = () => {
    function sendEmail(e) {
        e.preventDefault();

        emailjs
            .sendForm(
                email_service,
                template,
                e.target,
                user
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

                <label className="txt-msg">Message</label>

                <textarea name="message" rows="4" className="form-control" />

                <input type="submit" value="Send" className="txt-send-button" />
            </form>
        </div>
    );
};

export default TextBox;
