-- DB: expanses

-- type => enum('expanse', 'income')

CREATE TABLE "expanses" (
	"id"	INTEGER PRIMARY KEY AUTOINCREMENT,
	"amount"	NUMERIC NOT NULL,
	"description"	TEXT,
	"date"	TEXT NOT NULL,
	"type"	TEXT NOT NULL
);
