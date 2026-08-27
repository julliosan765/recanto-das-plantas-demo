alter table public.store_settings
  add column if not exists about_since_year integer not null default 2004,
  add column if not exists about_intro text not null default 'Em Maceió, o Recanto reúne plantas, flores, vasos e itens para jardim, oferecendo qualidade e um atendimento próximo para quem quer cultivar, renovar ou presentear.',
  add column if not exists about_detail text not null default 'Fale com a equipe, consulte a disponibilidade e escolha com mais calma o que combina com o seu espaço.';
