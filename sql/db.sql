-- DB: expanses

-- type => enum('expanse', 'income')

CREATE TABLE "expanses" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"amount"	NUMERIC NOT NULL,
	"description"	TEXT,
	"month"	TEXT NOT NULL,
	"date"	TEXT NOT NULL,
	"datetime"	TEXT NOT NULL,
	"type"	TEXT NOT NULL
);
