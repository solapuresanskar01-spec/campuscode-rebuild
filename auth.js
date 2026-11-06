"use strict";

const loginForm = document.querySelector("#login-form");
const emailInput = document.querySelector("#email");
const passwordInput = document.querySelector("#password");
const captchaInput = document.querySelector("#captcha-input");
const captchaDisplay = document.querySelector("#captcha-display");
const formMessage = document.querySelector("#form-message");
const forgotMessage = document.querySelector("#forgot-message");
const captchaCharacters = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
let currentCaptcha = "";

if (loginForm) {
function generateCaptcha() {
  currentCaptcha = Array.from({ length: 5 }, () => {
    const index = Math.floor(Math.random() * captchaCharacters.length);
    return captchaCharacters[index];
  }).join("");

  captchaDisplay.replaceChildren(
    ...Array.from(currentCaptcha, (character) => {
      const span = document.createElement("span");
      span.className = "captcha-character";
      span.textContent = character;
      span.style.transform = `rotate(${Math.floor(Math.random() * 25) - 12}deg) translateY(${Math.floor(Math.random() * 5) - 2}px)`;
      return span;
    })
  );
  captchaDisplay.setAttribute("aria-label", `CAPTCHA code: ${currentCaptcha.split("").join(" ")}`);
}

function setFieldError(name, message) {
  const error = document.querySelector(`#${name}-error`);
  const input = document.querySelector(`#${name === "captcha" ? "captcha-input" : name}`);
  error.textContent = message;
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function showFormMessage(message, type) {
  formMessage.textContent = message;
  formMessage.className = `form-message is-visible is-${type} mono`;
}

generateCaptcha();

document.querySelector("#captcha-refresh").addEventListener("click", () => {
  generateCaptcha();
  captchaInput.value = "";
  setFieldError("captcha", "");
  captchaInput.focus();
});

document.querySelector(".password-toggle").addEventListener("click", (event) => {
  const button = event.currentTarget;
  const showPassword = passwordInput.type === "password";
  passwordInput.type = showPassword ? "text" : "password";
  button.textContent = showPassword ? "HIDE" : "SHOW";
  button.setAttribute("aria-label", showPassword ? "Hide password" : "Show password");
  button.setAttribute("aria-pressed", String(showPassword));
});

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  formMessage.className = "form-message mono";
  setFieldError("email", "");
  setFieldError("password", "");
  setFieldError("captcha", "");

  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const captcha = captchaInput.value.trim().toUpperCase();
  const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  let isValid = true;

  if (!emailIsValid) {
    setFieldError("email", email ? "Enter a valid email address." : "Email address is required.");
    isValid = false;
  }
  if (!password.trim()) {
    setFieldError("password", "Password is required for this demo.");
    isValid = false;
  }
  if (!captcha) {
    setFieldError("captcha", "Enter the code shown above.");
    isValid = false;
  } else if (captcha !== currentCaptcha) {
    setFieldError("captcha", "That code doesn't match. Try again.");
    isValid = false;
    generateCaptcha();
    captchaInput.value = "";
  }

  if (!isValid) {
    showFormMessage("Check the highlighted fields and try again.", "error");
    const firstInvalid = loginForm.querySelector('[aria-invalid="true"]');
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  passwordInput.value = "";
  captchaInput.value = "";
  generateCaptcha();
  showFormMessage("Demo complete. No credentials were sent or saved; authentication is not connected.", "success");
});

document.querySelector("#forgot-password").addEventListener("click", (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();
  forgotMessage.className = "forgot-message is-visible mono";

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    forgotMessage.textContent = "Enter a valid email above to preview password recovery.";
    emailInput.focus();
    setFieldError("email", "Enter a valid email address.");
    return;
  }

  setFieldError("email", "");
  forgotMessage.textContent = "Password recovery is a frontend demo; no email was sent.";
});
}

const registrationForm = document.querySelector("#registration-form");

if (registrationForm) {
  const registrationCaptchaCharacters = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  const registrationCaptchaDisplay = document.querySelector("#registration-captcha-display");
  const registrationCaptchaInput = document.querySelector("#registration-captcha-input");
  const registrationMessage = document.querySelector("#registration-message");
  let registrationCaptcha = "";

  function generateRegistrationCaptcha() {
    registrationCaptcha = Array.from({ length: 5 }, () => {
      const index = Math.floor(Math.random() * registrationCaptchaCharacters.length);
      return registrationCaptchaCharacters[index];
    }).join("");

    registrationCaptchaDisplay.replaceChildren(
      ...Array.from(registrationCaptcha, (character, index) => {
        const span = document.createElement("span");
        span.className = `captcha-character captcha-character-${index % 5}`;
        span.textContent = character;
        return span;
      })
    );
    registrationCaptchaDisplay.setAttribute(
      "aria-label",
      `CAPTCHA code: ${registrationCaptcha.split("").join(" ")}`
    );
  }

  function setRegistrationError(field, message) {
    const error = document.querySelector(`#${field}-error`);
    const input = document.querySelector(`#${field}`);
    error.textContent = message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
  }

  function showRegistrationMessage(message, type) {
    registrationMessage.textContent = message;
    registrationMessage.className = `registration-message form-message is-visible is-${type} mono`;
  }

  generateRegistrationCaptcha();

  document.querySelector("#registration-captcha-refresh").addEventListener("click", () => {
    generateRegistrationCaptcha();
    registrationCaptchaInput.value = "";
    setRegistrationError("registration-captcha-input", "");
    registrationCaptchaInput.focus();
  });

  registrationForm.querySelectorAll("[data-password-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const input = document.querySelector(`#${button.dataset.passwordToggle}`);
      const showPassword = input.type === "password";
      input.type = showPassword ? "text" : "password";
      button.textContent = showPassword ? "HIDE" : "SHOW";
      button.setAttribute("aria-label", `${showPassword ? "Hide" : "Show"} ${input.labels[0].textContent.toLowerCase()}`);
      button.setAttribute("aria-pressed", String(showPassword));
    });
  });

  registrationForm.addEventListener("submit", (event) => {
    event.preventDefault();
    registrationMessage.className = "registration-message form-message mono";

    const nameInput = document.querySelector("#register-name");
    const emailInput = document.querySelector("#register-email");
    const passwordInput = document.querySelector("#register-password");
    const confirmInput = document.querySelector("#confirm-password");
    const ageInput = document.querySelector("#age-confirmation");
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmInput.value;
    const enteredCaptcha = registrationCaptchaInput.value.trim().toUpperCase();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    let isValid = true;

    setRegistrationError("register-name", "");
    setRegistrationError("register-email", "");
    setRegistrationError("register-password", "");
    setRegistrationError("confirm-password", "");
    setRegistrationError("registration-captcha-input", "");
    ageInput.setAttribute("aria-invalid", "false");
    document.querySelector("#age-confirmation-error").textContent = "";

    if (name.length < 2) {
      setRegistrationError("register-name", "Enter your full name.");
      isValid = false;
    }
    if (!validEmail) {
      setRegistrationError("register-email", email ? "Enter a valid email address." : "Email address is required.");
      isValid = false;
    }
    if (password.length < 8) {
      setRegistrationError("register-password", "Use at least 8 characters for your password.");
      isValid = false;
    }
    if (!confirmPassword) {
      setRegistrationError("confirm-password", "Repeat your password to confirm it.");
      isValid = false;
    } else if (password !== confirmPassword) {
      setRegistrationError("confirm-password", "These passwords don't match.");
      isValid = false;
    }
    if (!enteredCaptcha) {
      setRegistrationError("registration-captcha-input", "Enter the code shown above.");
      isValid = false;
    } else if (enteredCaptcha !== registrationCaptcha) {
      setRegistrationError("registration-captcha-input", "That code doesn't match. Try again.");
      isValid = false;
      generateRegistrationCaptcha();
      registrationCaptchaInput.value = "";
    }
    if (!ageInput.checked) {
      ageInput.setAttribute("aria-invalid", "true");
      document.querySelector("#age-confirmation-error").textContent = "Confirm that you are 18 years of age or older.";
      isValid = false;
    }

    if (!isValid) {
      showRegistrationMessage("Check the highlighted fields and try again.", "error");
      const firstInvalid = registrationForm.querySelector('[aria-invalid="true"]');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    passwordInput.value = "";
    confirmInput.value = "";
    registrationCaptchaInput.value = "";
    generateRegistrationCaptcha();
    showRegistrationMessage(
      "Frontend demo only. No account was created and no verification email was sent.",
      "success"
    );
  });
}
