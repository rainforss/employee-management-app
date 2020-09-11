import Search from "./models/Search";
import * as searchView from "./views/searchView";
import * as formView from "./views/formView";
import {
  elements,
  renderLoader,
  removeLoader,
  mobileMenuControl,
  toastBox,
} from "./views/base";
import Form from "./models/Form";

//No routing included in this demo, it is assumed that api calls will be made (hence content will be loaded) upon clicking the "Employee" tab

//Global state, or data store if you prefer
const state = {
  formState: new Set(),
};

//Make API calls and load pagination as well as employees information

const loadEmployees = async () => {
  //Get pagination parameters, use default if none provided

  const pageSizeInput = searchView.getPageSize();
  const pageNumberInput = searchView.getPageNumber();

  let pageSize = pageSizeInput ? pageSizeInput : 6;
  let pageNumber = pageNumberInput ? pageNumberInput : 1;

  //Create new search object from default or view
  if (pageSize && pageNumber) {
    state.search = new Search(pageSize, pageNumber);
  }
  //Show loading UI
  //Clear previously loaded results from page
  searchView.removeResults();
  searchView.removePageNumbers();
  searchView.removePagination();
  renderLoader(elements.result);

  //Wait for search results
  await state.search.getTotalPage();
  await state.search.getEmployees();

  //Render results on UI
  removeLoader();
  searchView.showPagination();
  searchView.renderPageNumbers(state.search.totalPage, pageNumber);
  searchView.renderEmployees(state.search.employees);
};

//Attach listeners

elements.employees.addEventListener("click", (e) => {
  e.preventDefault();

  loadEmployees();
});

elements.mobileEmployees.addEventListener("click", (e) => {
  e.preventDefault();
  elements.mobileMenu.classList.toggle("nav-active");

  elements.burger.classList.toggle("toggle");
  loadEmployees();
});

elements.pageSize.addEventListener("change", (e) => {
  e.preventDefault();
  //Reset page number selection to prevent page overflow
  searchView.resetPageSelection();
  loadEmployees();
});

elements.pageNumber.addEventListener("change", (e) => {
  e.preventDefault();
  loadEmployees();
});

//Form handling

const formController = async (open, submit, inputProps) => {
  //Load form UI or remove form UI
  if (open) {
    formView.loadForm();
  } else {
    formView.removeForm();
  }

  //Real-time input validation upon typing
  if (inputProps) {
    formView.validateForm(inputProps, state.formState);
  }

  //Final validation upon submission
  if (submit) {
    const success = formView.changeFormState(state.formState).validateState();

    //If final validation is successful, instantiate a new form model to perform POST. Assuming the API can accept JSON data, we serialize the FormData into JSON in Form model
    if (success) {
      let myForm = elements.formBody;
      let formData = new FormData(myForm);

      //Instantiate the model to perform POST
      state.form = new Form(formData);

      // await state.form.sendForm();  commented out since it would throw errors here, we simply console log the form data in JSON here and notify user

      let object = {};
      formData.forEach((value, key) => {
        object[key] = value;
      });
      let json = JSON.stringify(object);
      console.log(json);

      //Notify user that data has been added, reset inputs and close modal
      toastBox();
      formView.resetFormInputs();
      formView.removeForm();
    }
  }
};

//Attach listeners

elements.addEmployee.addEventListener("click", (e) => {
  e.preventDefault();
  formController(true, false);
});

elements.cancelForm.addEventListener("click", (e) => {
  e.preventDefault();
  formController(false, false);
});

elements.submitForm.addEventListener("click", (e) => {
  e.preventDefault();
  formController(true, true);
});

elements.formBody.addEventListener("keyup", (e) => {
  const nodeName = e.target.nodeName;
  const inputProps = event.target;
  if (nodeName === "INPUT") {
    formController(true, false, inputProps);
  }
});

//Mobile menu control

mobileMenuControl();
