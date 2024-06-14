export const validateId = (id) => {
  return /[a-zA-Z0-9]{6,20}/.test(id);
};

export const validateTel = (tel) => {
  return /^010\d{8}/.test(tel);
};

export const validateEmail = (email) => {
  return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);
};

export const validatePassword = (password) => {
  return /^(?=.*\d)(?=.*\w)(?=.*[!@#$%^&+=])[\w\d!@#$%^&+=]{8,15}$/.test(
    password
  );
};

export const preventNotNumberInput = (event) => {
  if (
    !/^\d$/.test(event.key) &&
    event.key !== 'Backspace' &&
    event.key !== 'Delete' &&
    event.key !== 'ArrowUp' &&
    event.key !== 'ArrowDown' &&
    event.key !== 'ArrowLeft' &&
    event.key !== 'ArrowRight' &&
    event.key !== 'Tab' &&
    event.key !== 'End' &&
    event.key !== 'Home'
  ) {
    event.preventDefault();
  }
};
