const form = document.getElementById("signUpForm");
const nameField = document.getElementById("username");
const passwordField = document.getElementById("password");
const confirmPasswordField = document.getElementById("confirm-password");

function validateForm() {
  let isValid = true;

  // Reset the borders
  nameField.classList.remove("border-green-500", "border-red-500");
  nameField.classList.add("border-gray-300");
  emailField.classList.remove("border-green-500", "border-red-500");
  emailField.classList.add("border-gray-300");
  passwordField.classList.remove("border-green-500", "border-red-500");
  passwordField.classList.add("border-gray-300");
  confirmPasswordField.classList.remove("border-green-500", "border-red-500");
  confirmPasswordField.classList.add("border-gray-300");

  // Validate name field
  if (nameField.value.trim() === "") {
    nameField.classList.remove("border-gray-300");
    nameField.classList.add("border-red-500");
    isValid = false;
  } else {
    nameField.classList.remove("border-gray-300");
    nameField.classList.add("border-green-500");
  }

  // Validate password field
  if (passwordField.value.trim() === "") {
    passwordField.classList.remove("border-gray-300");
    passwordField.classList.add("border-red-500");
    isValid = false;
  } else {
    passwordField.classList.remove("border-gray-300");
    passwordField.classList.add("border-green-500");
  }

  // Validate confirm password field
  if (
    confirmPasswordField.value.trim() === "" ||
    confirmPasswordField.value !== passwordField.value
  ) {
    confirmPasswordField.classList.remove("border-gray-300");
    confirmPasswordField.classList.add("border-red-500");
    isValid = false;
  } else {
    confirmPasswordField.classList.remove("border-gray-300");
    confirmPasswordField.classList.add("border-green-500");
  }

  return isValid;
}

function validatePasswords() {
  // Reset the borders to the default gray
  passwordField.classList.remove("border-green-500", "border-red-500");
  confirmPasswordField.classList.remove("border-green-500", "border-red-500");
  passwordField.classList.add("border-gray-300");
  confirmPasswordField.classList.add("border-gray-300");

  // Validate password match
  if (
    passwordField.value.trim() === "" ||
    confirmPasswordField.value.trim() === ""
  ) {
    // Do nothing if one of the fields is empty
    return;
  } else if (passwordField.value === confirmPasswordField.value) {
    // Passwords match
    passwordField.classList.remove("border-gray-300");
    confirmPasswordField.classList.remove("border-gray-300");
    passwordField.classList.add("border-green-500");
    confirmPasswordField.classList.add("border-green-500");
  } else {
    // Passwords do not match
    passwordField.classList.remove("border-gray-300");
    confirmPasswordField.classList.remove("border-gray-300");
    passwordField.classList.add("border-red-500");
    confirmPasswordField.classList.add("border-red-500");
  }
}

passwordField.addEventListener("input", validatePasswords);
confirmPasswordField.addEventListener("input", validatePasswords);

form.addEventListener("submit", validateForm);
