/* ═══════════════════════════════════════
   WOBAZI — Relationships paywall flag
   relationships/flags.js

   RELATIONSHIPS_PAYWALL=on switches the free/paid split on. Unset (default) = off:
   everyone gets everything. Invite teasers and public share pages ignore this flag.
   Free: 1 saved person, headline + scorecard. Paid: unlimited people, friction map,
   type-specific sections.
═══════════════════════════════════════ */

'use strict';

const FREE_PEOPLE = 1;

function paywallOn() {
  return /^(1|true|on|yes)$/i.test(process.env.RELATIONSHIPS_PAYWALL || '');
}

/* Billing hook: replace with a real subscription lookup when payments exist. */
function isPaidUser(db, googleId) { // eslint-disable-line no-unused-vars
  return false;
}

function entitlements(db, googleId) {
  const on = paywallOn();
  const paid = !on || isPaidUser(db, googleId);
  return {
    paywall: on,
    paid,
    maxPeople: paid ? null : FREE_PEOPLE,
    friction: paid,
    typeSections: paid,
  };
}

module.exports = { entitlements, paywallOn, FREE_PEOPLE };
