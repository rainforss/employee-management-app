export const elements = {
  employees: document.querySelector("#employees"),
  mobileEmployees: document.querySelector("#mobile-employees"),
  pageSize: document.querySelector("#pageSize"),
  pageNumber: document.querySelector("#pageNumber"),
  pagination: document.querySelector(".pagination"),
  resultList: document.querySelector(".results-list"),
  result: document.querySelector(".results"),
  addEmployee: document.querySelector(".add-employee"),
  formSection: document.querySelector(".form-section"),
  formBody: document.querySelector(".form"),
  submitForm: document.querySelector(".submit-form"),
  cancelForm: document.querySelector(".cancel-form"),
  burger: document.querySelector(".burger"),
  mobileMenu: document.querySelector(".mobile-nav"),
  toastBox: document.querySelector(".toast-box"),
};

export const elementStrings = {
  loader: "loader",
};

export const renderLoader = (parent) => {
  const loader = `
        <div class="${elementStrings.loader}">
            <img src="./img/loader.svg" />
        </div>
    `;

  parent.insertAdjacentHTML("afterbegin", loader);
};

export const removeLoader = () => {
  const loader = document.querySelector(`.${elementStrings.loader}`);
  if (loader) loader.parentElement.removeChild(loader);
};

export const mobileMenuControl = () => {
  elements.burger.addEventListener("click", () => {
    elements.mobileMenu.classList.toggle("nav-active");

    elements.burger.classList.toggle("toggle");
  });
};

export const toastBox = () => {
  elements.toastBox.classList.toggle("toast-active");
  setTimeout(() => elements.toastBox.classList.toggle("toast-active"), 3000);
};
