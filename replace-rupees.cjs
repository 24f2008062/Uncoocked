/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

function replaceFile(path, replacements) {
  let content = fs.readFileSync(path, 'utf8');
  let newContent = content;
  
  for (const [from, to] of replacements) {
    newContent = newContent.replace(from, to);
  }
  
  if (content !== newContent) {
    fs.writeFileSync(path, newContent);
    console.log(`Updated ${path}`);
  }
}

replaceFile('app/components/RegistrationCard.jsx', [
  ['`$${event.price}`', '`₹${event.price}`']
]);

replaceFile('app/components/RegisterModal.jsx', [
  ['`Enter your details to pay $${price} and secure your ticket.`', '`Enter your details to pay ₹${price} and secure your ticket.`'],
  ['`Pay $${price}`', '`Pay ₹${price}`']
]);

replaceFile('app/dashboard/organizer/[eventId]/analytics/page.jsx', [
  ['name="Revenue ($)"', 'name="Revenue (₹)"']
]);

replaceFile('app/dashboard/organizer/new/page.jsx', [
  ['Ticket Price ($)', 'Ticket Price (₹)']
]);
