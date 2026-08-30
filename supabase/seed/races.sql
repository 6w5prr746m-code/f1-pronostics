-- Illustrative calendar for local dev / demo — dates are placeholders
-- spaced out from whenever this seed is run, NOT the real F1 calendar.
-- Replace with the actual season dates before running this with real
-- groups (insert into public.races directly, or build an admin UI later).

insert into public.races (name, circuit, country, race_date, quali_date, status) values
  ('Grand Prix des Amis', 'Circuit Paul Ricard', 'France', now() + interval '3 days', now() + interval '2 days', 'upcoming'),
  ('Grand Prix de Monza', 'Autodromo di Monza', 'Italie', now() + interval '17 days', now() + interval '16 days', 'upcoming'),
  ('Grand Prix de Singapour', 'Marina Bay Circuit', 'Singapour', now() + interval '31 days', now() + interval '30 days', 'upcoming'),
  ('Grand Prix des Amériques', 'Circuit of the Americas', 'États-Unis', now() + interval '45 days', now() + interval '44 days', 'upcoming'),
  ('Grand Prix du Mexique', 'Autódromo Hermanos Rodríguez', 'Mexique', now() + interval '59 days', now() + interval '58 days', 'upcoming')
on conflict do nothing;
