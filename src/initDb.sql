create table watches (
    userId uuid not null,
    symbol text not null,
    createdAt timestamp not null default now(),
    primary key(userId, symbol)
);
