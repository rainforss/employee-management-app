import { elements } from "./base";

export const getPageSize = () => elements.pageSize.value;

export const getPageNumber = () => elements.pageNumber.value;

const renderEmployee = (employee) => {
  const markup = `
    <li class="person">
        <img class="photo" src="${
          employee.photoURL ? employee.photoURL : "./img/profile.png"
        }" alt="Profile Picture"/>
        <div class="info">
            <div class="name">${employee.name.first} ${employee.name.last}</div>
            <div class="job-title">${
              employee.jobTitle ? employee.jobTitle : ""
            }</div>
        </div>
    </li>

    `;
  elements.resultList.insertAdjacentHTML("beforeend", markup);
};

export const renderEmployees = (employees) => {
  employees.forEach(renderEmployee);
};

export const renderPageNumbers = (maxPageNumber, currentPage) => {
  const pages = [];
  for (var i = 1; i <= maxPageNumber; i++) {
    pages.push(i);
  }
  const markups = pages.map(
    (i) =>
      `<option value=${i} ${i == currentPage ? "selected" : ""}>${i}</option>`
  );
  markups.forEach((markup) =>
    elements.pageNumber.insertAdjacentHTML("beforeend", markup)
  );
};

export const removeResults = () => (elements.resultList.innerHTML = "");

export const removePageNumbers = () => (elements.pageNumber.innerHTML = "");

export const showPagination = () => elements.pagination.classList.add("shown");

export const removePagination = () =>
  elements.pagination.classList.remove("shown");

export const resetPageSelection = () =>
  (elements.pageNumber.selectedIndex = "0");
