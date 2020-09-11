export default class Search {
  constructor(pageSize, pageNumber) {
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
  }

  async getTotalPage() {
    const proxy = "https://cors-anywhere.herokuapp.com/";
    try {
      //There should be a URI which have the total number of entries available. The root URL does not return the full list of personels but it is used here to provide pagination calculations.
      const result = await fetch(
        `${proxy}https://emplistapi-258220.appspot.com/`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      this.allEmployees = await result.json();
      this.totalPage = Math.ceil(this.allEmployees.length / this.pageSize);
    } catch (error) {
      alert(error);
    }
  }

  async getEmployees() {
    //proxy server to avoid CORS error
    const proxy = "https://cors-anywhere.herokuapp.com/";
    try {
      const result = await fetch(
        `${proxy}https://emplistapi-258220.appspot.com/?pageSize=${this.pageSize}&pageNumber=${this.pageNumber}`,
        {
          method: "get",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      this.employees = await result.json();
      //   console.log(this.data);
    } catch (error) {
      alert(error);
    }
  }
}
