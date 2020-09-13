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
  const inputProps = e.target;
  if (nodeName === "INPUT") {
    formController(true, false, inputProps);
  }
});

//Listeners for mobile menu control

mobileMenuControl();

/*Extra functionalities can be impletented easily but cannot be achieved due to time concerns, I would simply describe them here:
1. Sorting can be implemented using array prototype method sort with specific rules. It can be set up in the presentation layer. We can associate different sorting rules
according to user specifications by adding extra event listeners and etc, the usuals.

2. Drag and drop are not particularly useful or applicable in this app since we are mainly getting data from the server. Dragging to reorder items are not essential if
we are just performing the reordering in client side. In my opinion, sorting in the UI can be done in a more elegant way without the help of dragon and drop.

3. I implemented pagination instead of 'load more' function in this demo. I will come back to replace the pagination with 'load more' if required, but I am providing the
steps here for your info: make another API call with the same pageSize and incremented pageNumber while rendering the loader, remove the loader as well as load button and
 render the new data when new data is received. If the new data array size is less than the pageSize, render the load button as 'no more entries' and disable the button.  
 
 I am assuming that pagination is more helpful in a common API which can return the total number of entries, especially when there are a lot of entries. Draging down to load 
 more can be implemented using webapis such as offset and heights to send another get request right before user scrolls to the end of current list container. It does have the 
 advantage of getting rid of annoying button clicks for mobile users, but it brings down the efficiency on PCs since PC screens can diplay a lot more entries at once and scroll 
 to load approach can be tedious in this situation. Anyways, different approaches can be used on different devices, following customer's requirements.
 */
