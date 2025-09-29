export const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  const isSecure = window.location.protocol === 'https:';
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${isSecure ? ';Secure' : ''}`;
};

export const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

export const deleteCookie = (name) => {
  const isSecure = window.location.protocol === 'https:';
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;SameSite=Strict${isSecure ? ';Secure' : ''}`;
};

export const hasCookie = (name) => {
  return getCookie(name) !== null;
};
