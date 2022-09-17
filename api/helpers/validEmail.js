module.exports = validEmail;

function validEmail(email) {
    email = email.trim();
    return !email.includes(" ") && email.endsWith("@verdala.org");
}
