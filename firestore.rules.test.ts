import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { UNIT_CODE_REGEX, WHATSAPP_REGEX, EMAIL_REGEX } from './src/utils/bookingLogic';

test('firestore.rules includes default deny, email_verified check, and strict schema guards', () => {
  const rules = fs.readFileSync('firestore.rules', 'utf8');
  assert.match(rules, /match \/\{document=\*\*\} \{\s*allow read, write: if false;/);
  assert.match(rules, /request\.auth\.token\.email_verified == true/);
  assert.match(rules, /isValidUnitBooking/);
  assert.match(rules, /isValidUnitReservation/);
  assert.match(rules, /existsAfter\(/);
  assert.match(rules, /affectedKeys\(\)\.hasOnly\(/);
  assert.match(rules, /resource\.data\.userId == request\.auth\.uid/);
  assert.match(rules, /transferProofName/);
  assert.match(rules, /ktpPhotoName/);
});

test('firebase-blueprint.json patterns synchronize with bookingLogic regexes', () => {
  const blueprint = JSON.parse(fs.readFileSync('firebase-blueprint.json', 'utf8'));
  const bookingProps = blueprint.entities.UnitBooking.properties;
  assert.equal(new RegExp(bookingProps.unitCode.pattern).source, UNIT_CODE_REGEX.source);
  assert.equal(new RegExp(bookingProps.whatsapp.pattern).source, WHATSAPP_REGEX.source);
  assert.equal(new RegExp(bookingProps.email.pattern).source, EMAIL_REGEX.source);
  assert.ok(bookingProps.transferProofName);
  assert.ok(bookingProps.ktpPhotoName);
});
