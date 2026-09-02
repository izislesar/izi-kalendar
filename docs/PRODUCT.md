# Product specification

## Product identity

Working name: **Calendar**.

It is intentionally presented as a normal calendar available through a Tor onion service. The interface behaves like a questionable onion/malware product and like a mildly judgmental person, but it never acknowledges that this is unusual.

The joke is the contrast between a technically polished interface and interactions that are indefensible for a calendar.

## Canonical 90-second flow

### 1. Entry — 0–10 s

User opens the onion service.

Show:
- `Secure connection established.`
- `Your browser has been fingerprinted.`
- one fake privacy-oriented ad that contradicts the fingerprint notice;
- visible hungry Pet / ammo count.

Primary action: `Create meeting`.

### 2. Handshake — 10–20 s

Creating a meeting requires a handshake.

Choices:
- Firm
- Weak
- Uncomfortably long

All work. They may change flavor text only.

After selection:
- `Handshake accepted.`
- `Calendar's opinion of you has changed.`

Do not display what the opinion is.

### 3. Ammunition / Pet — 20–35 s

Entering date selection reveals no ammunition.

Message:
`No ammunition. Feed Pet to continue.`

Feed choices:
- Cookie
- Onion
- Browser history

Feeding produces exactly enough ammunition for the demo, e.g. +3 rounds.

After feeding:
`Pet consumed cookie. +3 ammunition.`

Immediately follow with a fake notice:
`Your cookie preferences have been fingerprinted.`

### 4. Shooting range — 35–55 s

Heading:
`Select a date.`

Display current month as targets. User moves a crosshair and clicks/shoots a numbered target.

Revolver state:
- READY
- BLANK
- JAMMED
- EMPTY

Requirements:
- first encounter may intentionally produce one blank for the gag;
- later shot should succeed quickly;
- jam can occur at most once on intended demo path;
- `RELOAD` and `FIX` are separate plain controls with 1–3 second timers;
- do not implement realistic weapon operation;
- target hit chooses that date.

Successful hit:
`September 17 selected.`

Then:
`Date is locked.`

### 5. Lock-picking — 55–75 s

Heading:
`Confirm selected date.`

Display a lock + pick inspired by Skyrim's interaction:
- pointer/mouse controls pick angle;
- click/drag/keyboard attempts to rotate lock;
- rotation succeeds only near hidden sweet spot;
- wrong angle rattles and returns;
- optional pick break after a failure;
- silently widen sweet spot after failure.

Successful open:
`Date confirmed.`

Then:
`Your lockpicking behavior has been fingerprinted.`

### 6. Normal form — 75–85 s

Suddenly become mostly normal.

Fields:
- title
- time
- duration

Defaults should make demo fast.

No attendee management, backend scheduling, timezone engine, accounts, sync, or external calendar integration in the one-hour build.

### 7. Farewell / Save — 85–90 s

Save triggers:
`Calendar expected a farewell.`

Choices:
- Goodbye
- Final handshake
- Leave respectfully

All work.

Then:
`Meeting created.`

Render a real event card in the local calendar/event list.

One beat later:
`Your meeting has been fingerprinted.`

Optional final:
`Thank you for respecting Calendar.`

## Fake advertisements

Ads are purely local UI. Recommended pool:

- `STOP BROWSER FINGERPRINTING — Protect yourself from sites like this one.`
- `ARE YOU BEING TRACKED? Yes. [FIND OUT MORE]`
- `PREMIUM AMMUNITION — Up to 12% fewer blanks.`
- `CALENDAR PRO — Still contains advertisements.`
- `FEED YOUR PET PREMIUM — Pet remains hungry longer.`
- `VPN FOR TOR — Add another layer for no particular reason.`
- `BUY THURSDAY — Limited availability.`
- `HOT SINGLES IN YOUR TIMEZONE — UTC+3.`

Ads may overlap peripheral UI but must not make the intended path impossible.

## Fake fingerprint notice pool

Start plausible and become absurd:
- Browser fingerprint collected.
- Mouse movement fingerprint collected.
- Cookie preferences fingerprinted.
- Shooting style fingerprint collected.
- Lockpicking behavior fingerprinted.
- Preferred weekday fingerprinted.
- Hesitation before Thursday recorded.
- Calendar has formed an opinion about you.
- Calendar noticed that.

These are text-only simulations. No actual browser fingerprinting.

## Pet

Keep Pet visually simple and cheap to implement.

State:
- hunger: cosmetic
- mood: cosmetic
- ammo production: functional

Mood examples:
- content
- concerned
- judgmental
- disappointed

Feeding grants ammunition. No complex lifecycle.

## Visual direction

Mix:
- polished modern SaaS shell;
- questionable security/onion status text;
- intrusive banner/pop-up ads;
- dry interpersonal Calendar messages.

Avoid deliberately ugly typography everywhere. The interface should look like somebody competently built an indefensible product.

## Non-goals

Not in the one-hour version:
- accounts;
- server-side persistence;
- collaborative calendars;
- real invitations/email;
- external calendar APIs;
- multiple weapons;
- realistic firearm simulation;
- elaborate tamagotchi lifecycle;
- mobile perfection;
- accessibility remediation;
- production security hardening beyond not collecting data;
- clearnet deployment.

## Success metric

A judge unfamiliar with the app can create one event in 60–90 seconds, laughs at multiple distinct interaction beats, and the app does not fail due to randomness.
