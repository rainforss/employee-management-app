export default class Form {
  constructor(formData) {
    this.formData = formData;
  }

  async sendForm() {
    let object = {};
    this.formData.forEach((value, key) => {
      object[key] = value;
    });
    let jsonData = JSON.stringify(object);
    const proxy = "https://cors-anywhere.herokuapp.com/";
    try {
      //Assume that we are sending back the form to the exact same API and the API can handle form data
      const response = await fetch(
        `${proxy}https://emplistapi-258220.appspot.com/`,
        {
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
          body: jsonData,
        }
      );
      this.data = response.json();
      console.log(this.data);
    } catch (error) {
      alert(error);
    }
  }
}
