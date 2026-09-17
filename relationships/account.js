/* ═══════════════════════════════════════
   WOBAZI — Relationships data on account delete / export
   relationships/account.js

   Called by portal/routes.js. wipeUser runs INSIDE the portal's delete transaction,
   so a failure rolls back the whole account deletion.
═══════════════════════════════════════ */

'use strict';

let cardCache = null;   // set by index.js when mounted
function setCardCache(cache) { cardCache = cache; }

/* Delete cached share PNGs for removed people. Call after the transaction commits. */
function purgeCards(personIds) {
  if (!cardCache) return;
  (personIds || []).forEach(id => cardCache.purge(`p${id}`));
}

function tableExists(db, name) {
  return !!db.prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = ?").get(name);
}

/**
 * Remove everything relationships holds about a user. Must run inside a transaction.
 * - people the user saved (manual + linked), with their readings and share links
 * - rows in OTHER users' lists that are linked to this user: deleted outright
 *   (their name and birth data came from this user's account)
 * - invites the user sent or accepted, and the user's birth place record
 * @returns {number[]} person ids removed (for share-image cache cleanup after commit)
 */
function wipeUser(db, googleId) {
  if (!tableExists(db, 'people')) return [];
  const ids = db.prepare('SELECT id FROM people WHERE owner_id = ? OR linked_user_id = ?')
    .all(googleId, googleId).map(r => r.id);
  if (ids.length) {
    const marks = ids.map(() => '?').join(',');
    db.prepare(`DELETE FROM relationship_share_links WHERE person_id IN (${marks})`).run(...ids);
    db.prepare(`DELETE FROM relationship_readings WHERE person_id IN (${marks})`).run(...ids);
    db.prepare(`DELETE FROM people WHERE id IN (${marks})`).run(...ids);
  }
  db.prepare('DELETE FROM relationship_share_links WHERE owner_id = ?').run(googleId);
  db.prepare('DELETE FROM relationship_invites WHERE inviter_id = ? OR accepted_by = ?').run(googleId, googleId);
  db.prepare('DELETE FROM user_birth_places WHERE google_id = ?').run(googleId);
  return ids;
}

/**
 * Data the user entered themselves. Linked people carry no birth data here:
 * that belongs to the other account.
 */
function exportUser(db, googleId) {
  if (!tableExists(db, 'people')) return { people: [], invites: [], shareLinks: [] };
  const people = db.prepare('SELECT * FROM people WHERE owner_id = ? ORDER BY created_at').all(googleId).map(p => {
    const base = { name: p.name, type: p.rel_type, addedAt: p.created_at, linkedAccount: !!p.linked_user_id };
    if (p.linked_user_id) return base;
    return Object.assign(base, {
      birth: {
        calendar: p.calendar_type,
        solarDate: `${p.year}-${String(p.month).padStart(2, '0')}-${String(p.day).padStart(2, '0')}`,
        lunarDate: p.calendar_type === 'lunar' ? `${p.lunar_year}-${p.lunar_month}-${p.lunar_day}${p.leap_month ? ' (leap month)' : ''}` : null,
        time: p.hour_known ? `${String(p.hour).padStart(2, '0')}:${String(p.minute || 0).padStart(2, '0')}` : null,
        birthplace: p.birthplace,
      },
    });
  });
  const invites = db.prepare('SELECT rel_type, status, created_at, expires_at FROM relationship_invites WHERE inviter_id = ? ORDER BY created_at')
    .all(googleId).map(i => ({ type: i.rel_type, status: i.status, createdAt: i.created_at, expiresAt: i.expires_at }));
  const shareLinks = db.prepare(`SELECT s.created_at, s.revoked_at, p.name FROM relationship_share_links s
    JOIN people p ON p.id = s.person_id WHERE s.owner_id = ? ORDER BY s.created_at`)
    .all(googleId).map(s => ({ person: s.name, createdAt: s.created_at, revokedAt: s.revoked_at }));
  return { people, invites, shareLinks };
}

function exportMarkdown(rel) {
  if (!rel || !rel.people.length) return [];
  const lines = [`## People (${rel.people.length})`, ''];
  rel.people.forEach(p => {
    let line = `- **${p.name}** · ${p.type}`;
    if (p.linkedAccount) line += ' · linked account';
    else if (p.birth) {
      line += ` · ${p.birth.calendar === 'lunar' ? `Lunar ${p.birth.lunarDate} → ` : ''}${p.birth.solarDate}`;
      line += p.birth.time ? ` ${p.birth.time}` : ' · hour unknown';
      if (p.birth.birthplace) line += ` · ${p.birth.birthplace}`;
    }
    lines.push(line);
  });
  lines.push('');
  return lines;
}

module.exports = { wipeUser, purgeCards, setCardCache, exportUser, exportMarkdown };
