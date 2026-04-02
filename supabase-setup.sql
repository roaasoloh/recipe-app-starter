drop table if exists favorites cascade;
drop table if exists recipes cascade;
drop table if exists categories cascade;

create table categories (
    id bigint primary key generated always as identity,
    name text not null unique,
    created_at timestamp with time zone not null default now()
);

create table recipes (
    id bigint primary key generated always as identity,
    title text not null,
    description text not null,
    prep_time integer not null check (prep_time > 0),
    category_id bigint not null references categories(id) on delete restrict,
    user_id uuid not null references auth.users(id) on delete cascade,
    image_path text,
    created_at timestamp with time zone not null default now()
);

create table favorites (
    id bigint primary key generated always as identity,
    user_id uuid not null references auth.users(id) on delete cascade,
    recipe_id bigint not null references recipes(id) on delete cascade,
    created_at timestamp with time zone not null default now(),
    constraint favorites_user_recipe_unique unique (user_id, recipe_id)
);

insert into categories (name) values
('Breakfast'),
('Lunch'),
('Dinner'),
('Dessert'),
('Drinks');