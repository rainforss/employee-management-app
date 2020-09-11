import { elements } from "./base";

export const loadForm = () => {
  elements.formSection.classList.add("in");
};

export const removeForm = () => {
  elements.formSection.classList.remove("in");
};

export const resetFormInputs = () => {
  elements.formBody.reset();
};

//Implement real-time validation, specifically when user is typing
export const validateForm = (inputProps, validationState) => {
  const inputName = inputProps.name;
  const verifyInputName = {
    "employee-first-name": validationRules(validationState).firstName,
    "employee-last-name": validationRules(validationState).lastName,
    "employee-title": validationRules(validationState).jobTitle,
    "employee-photo": validationRules(validationState).photoURL,
  };

  return verifyInputName[inputName](inputProps);
};

//Use closure on validation methods to ensure privacy
export const changeFormState = (validationState) => {
  return {
    addToState: (inputData) => {
      const action = "removeClass";
      const { inputProps, inputName } = inputData;

      validationState.add(inputName);
      manipulateValidationMsg({ inputProps, action });
    },
    removeFromState: (inputData) => {
      const action = "addClass";
      const { inputProps, inputName } = inputData;

      validationState.delete(inputName);
      manipulateValidationMsg({ inputProps, action });
    },
    validateState: () => {
      if (validationState.size > 0) {
        return false;
      }
      if (validationState.size === 0) {
        validationRules(validationState).emptyFields();
        if (validationState.size > 0) {
          return false;
        } else {
          return true;
        }
      }
    },
  };
};

export const validationRules = (validationState) => {
  return {
    firstName: (inputProps) => {
      const firstNameValidationRule = /[A-za-z]{3,}/;
      const inputValue = inputProps.value;
      const inputName = inputProps.name;
      const isInputValid = firstNameValidationRule.test(inputValue);
      isInputValid
        ? changeFormState(validationState).removeFromState({
            inputProps,
            inputName,
          })
        : changeFormState(validationState).addToState({
            inputProps,
            inputName,
          });
    },
    lastName: (inputProps) => {
      const lastNameValidationRule = /[A-za-z]{3,}/;
      const inputValue = inputProps.value;
      const inputName = inputProps.name;
      const isInputValid = lastNameValidationRule.test(inputValue);

      isInputValid
        ? changeFormState(validationState).removeFromState({
            inputProps,
            inputName,
          })
        : changeFormState(validationState).addToState({
            inputProps,
            inputName,
          });
    },
    jobTitle: (inputProps) => {
      const jobTitleValidationRule = /[A-za-z]{1,}/;
      const inputValue = inputProps.value;
      const inputName = inputProps.name;
      const isInputValid = jobTitleValidationRule.test(inputValue);

      isInputValid
        ? changeFormState(validationState).removeFromState({
            inputProps,
            inputName,
          })
        : changeFormState(validationState).addToState({
            inputProps,
            inputName,
          });
    },
    photoURL: (inputProps) => {
      const photoURLValidationRule = /((([A-Za-z]{0,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(:[0-9]+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/;
      const inputValue = inputProps.value;
      const inputName = inputProps.name;
      const isInputValid = photoURLValidationRule.test(inputValue);

      isInputValid
        ? changeFormState(validationState).removeFromState({
            inputProps,
            inputName,
          })
        : changeFormState(validationState).addToState({
            inputProps,
            inputName,
          });
    },
    emptyFields: () => {
      const formInputElems = [...elements.formBody.elements].filter(
        (item) => item.nodeName === "INPUT"
      );
      for (const inputProps of formInputElems) {
        const inputName = inputProps.name;
        const inputValue = inputProps.value;

        if (
          !inputValue &&
          inputName !== "employee-title" &&
          inputName !== "employee-photo"
        ) {
          changeFormState(validationState).addToState({
            inputProps,
            inputName,
          });
        }
      }
    },
  };
};

export const manipulateValidationMsg = (validationData) => {
  const { inputProps, action } = validationData;
  const elementValidationMsg = inputProps.nextElementSibling;
  const validationMsgClasses = elementValidationMsg.classList;
  const removeClass = () => {
    validationMsgClasses.remove("hide");
  };

  const addClass = () => {
    validationMsgClasses.add("hide");
  };

  return action === "addClass" ? addClass() : removeClass();
};
