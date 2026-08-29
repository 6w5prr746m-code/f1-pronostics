-- Starter driver list for local dev / demo groups.
-- NOTE: F1 grids change every season (transfers, new teams). This snapshot
-- reflects the lineup as commonly known at the time this MVP was built —
-- double-check names/teams/numbers against the current season before
-- relying on it, and update via /admin/results or a fresh seed as needed.

insert into public.drivers (name, team, number, active) values
  ('Max Verstappen', 'Red Bull Racing', 1, true),
  ('Yuki Tsunoda', 'Red Bull Racing', 22, true),
  ('Lewis Hamilton', 'Ferrari', 44, true),
  ('Charles Leclerc', 'Ferrari', 16, true),
  ('George Russell', 'Mercedes', 63, true),
  ('Kimi Antonelli', 'Mercedes', 12, true),
  ('Lando Norris', 'McLaren', 4, true),
  ('Oscar Piastri', 'McLaren', 81, true),
  ('Fernando Alonso', 'Aston Martin', 14, true),
  ('Lance Stroll', 'Aston Martin', 18, true),
  ('Pierre Gasly', 'Alpine', 10, true),
  ('Franco Colapinto', 'Alpine', 43, true),
  ('Esteban Ocon', 'Haas', 31, true),
  ('Oliver Bearman', 'Haas', 87, true),
  ('Alex Albon', 'Williams', 23, true),
  ('Carlos Sainz', 'Williams', 55, true),
  ('Nico Hulkenberg', 'Sauber', 27, true),
  ('Gabriel Bortoleto', 'Sauber', 5, true),
  ('Liam Lawson', 'Racing Bulls', 30, true),
  ('Isack Hadjar', 'Racing Bulls', 6, true)
on conflict do nothing;
