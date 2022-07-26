import emailjs from "emailjs-com";


const TextBox = () => {
  function sendEmail(e) {
    e.preventDefault();

    emailjs.sendForm(
      "service_oxvmxpc","template_cqb2zyg",
      e.target, "53zgb406krqnsJIF_"
    ).then(res=>{
        console.log(res);
    }).catch(err=> console.log(err));
  }
  return (
    <div
      className="container border"
      style={{
        marginTop: "30px",
        width: "30%",
        backgroundImage: `url('https://cdn.shopk.it/usercontent/1-04-store/media/images/square/d51d168-ceisum.png')`,

      }}
    >
      <h1 style={{ marginTop: "25px", fontWeight: "bold" }}>Box for suggestions!</h1>
      <form
        className="row"
        style={{ margin: "25px 85px 75px 100px",  backgroundColor: "#D3D3D3", padding:"10px 10px", border:"solid black", borderRadius: "5px"}}
        onSubmit={sendEmail}
      >
        <label>Name</label>
        <input type="text" name="name" className="form-control" style={{width: "200px"}} />

        
        <label>Email</label>
        <input type="email" name="user_email" className="form-control" style={{width: "200px"}}  />

        <label>Message</label>
        <textarea name="message" rows="4" className="form-control" style={{width: "200px"}} />
        <input
          type="submit"
          value="Send"
          className="form-control btn btn-primary"
          style={{ marginTop: "30px", border: "solid black", borderRadius: "5px", padding: "2px 5px", cursor: "pointer", backgroundColor: "#A9A9A9"}}
        />
      </form>
    </div>
  );
};

export default TextBox;